import { Booking } from '../models/Booking';
import { Provider } from '../models/Provider';
import { JobRequest } from '../models/JobRequest';
import { Address } from '../models/Address';
import { ProviderService } from '../models/ProviderService';
import { Location } from '../models/Location';
import { emitToUser } from './socketService';
import mongoose from 'mongoose';

/**
 * Haversine Formula to calculate distance between coordinates (in meters)
 */
const getHaversineDistance = (lon1: number, lat1: number, lon2: number, lat2: number): number => {
  const R = 6371e3; // metres
  const phi1 = lat1 * Math.PI / 180;
  const phi2 = lat2 * Math.PI / 180;
  const deltaPhi = (lat2 - lat1) * Math.PI / 180;
  const deltaLambda = (lon2 - lon1) * Math.PI / 180;

  const a = Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
            Math.cos(phi1) * Math.cos(phi2) *
            Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
};

/**
 * Uber/Urban Company Style Geospatial Dispatch
 * 
 * Logic:
 * 1. Identify user's coordinates.
 * 2. Find nearby serviceable locations (areas) within 15km.
 * 3. Find qualified providers who:
 *    a) Offer this subservice.
 *    b) Are active & verified.
 *    c) Match designated service areas OR have no specific zones selected (fallback).
 * 4. Perform live GPS proximity matching ($geoNear).
 * 5. Notify candidates in real-time and create JobRequests.
 */
export const dispatchNearbyProviders = async (bookingId: string) => {
  try {
    // Populate subservice and service details
    const booking = await Booking.findById(bookingId).populate({
      path: 'subservice_id',
      populate: { path: 'service_id' }
    });
    if (!booking) return;

    const address = await Address.findById(booking.address_id);
    
    // Resilient Coordinate Fallback: Use Bangalore city center if coordinates are missing
    let userLng = 77.5946;
    let userLat = 12.9716;
    if (address && address.coordinates && address.coordinates.coordinates && address.coordinates.coordinates.length === 2) {
      [userLng, userLat] = address.coordinates.coordinates;
    } else {
      console.warn(`[DISPATCH] Address for booking ${bookingId} has no GPS coordinates. Falling back to default Bangalore center [77.5946, 12.9716]`);
    }

    const GLOBAL_MAX_DISTANCE = 30000; // 30km absolute limit for scanning

    // 0. Find serviceable locations within 15km of user coordinates
    const activeLocations = await Location.find({ status: 'active', isDeleted: false });
    const nearbyLocations = activeLocations.filter(loc => {
      if (!loc.coordinates || !loc.coordinates.coordinates || loc.coordinates.coordinates.length < 2) return false;
      const [locLng, locLat] = loc.coordinates.coordinates;
      const dist = getHaversineDistance(userLng, userLat, locLng, locLat);
      return dist <= 15000; // 15km
    });
    const nearbyLocationIds = nearbyLocations.map(loc => loc._id);

    // 1. Fetch qualified provider IDs for this specific service
    const providerServices = await ProviderService.find({
      subservice_ids: booking.subservice_id?._id || booking.subservice_id,
      is_active: true,
      isDeleted: false
    }).select('provider_id');

    const qualifiedIds = providerServices.map(ps => ps.provider_id);
    if (qualifiedIds.length === 0) {
        console.log(`[DISPATCH] No qualified providers found for subservice ${booking.subservice_id?._id || booking.subservice_id}`);
        return;
    }

    // 2. Geospatial Aggregation (Online Providers First)
    let candidates = await Provider.aggregate([
      {
        $geoNear: {
          near: { type: 'Point', coordinates: [userLng, userLat] },
          distanceField: 'distance', // Meters
          maxDistance: GLOBAL_MAX_DISTANCE,
          spherical: true,
          key: 'live_location',
          query: {
            _id: { $in: qualifiedIds },
            isOnline: true,
            isBusy: false,
            is_verified: true,
            isDeleted: false,
            availability_status: 'available',
            $or: [
              { service_locations: { $in: nearbyLocationIds } },
              { service_locations: { $size: 0 } },
              { service_locations: { $exists: false } }
            ]
          }
        }
      },
      {
        // Filter based on provider's individual service radius (default to 15km if not set)
        $match: {
          $expr: {
            $lte: ['$distance', { $ifNull: ['$serviceRadius', 15000] }]
          }
        }
      },
      { $sort: { distance: 1 } },
      { $limit: 15 } // Notify top 15 nearest eligible providers
    ]);

    // Fallback: If no online providers are active, search for offline/any verified providers in the area.
    // This ensures pending job requests are created and visible when they log in or go online.
    if (candidates.length === 0) {
      console.log(`[DISPATCH] No online/available providers found. Executing fallback to offline verified providers in the area...`);
      candidates = await Provider.aggregate([
        {
          $geoNear: {
            near: { type: 'Point', coordinates: [userLng, userLat] },
            distanceField: 'distance',
            maxDistance: GLOBAL_MAX_DISTANCE,
            spherical: true,
            key: 'live_location',
            query: {
              _id: { $in: qualifiedIds },
              is_verified: true,
              isDeleted: false,
              $or: [
                { service_locations: { $in: nearbyLocationIds } },
                { service_locations: { $size: 0 } },
                { service_locations: { $exists: false } }
              ]
            }
          }
        },
        {
          $match: {
            $expr: {
              $lte: ['$distance', { $ifNull: ['$serviceRadius', 15000] }]
            }
          }
        },
        { $sort: { distance: 1 } },
        { $limit: 15 }
      ]);
    }

    // Absolute Fallback: If still no providers found (likely because their live_location is [0,0] and hasn't synced),
    // match purely based on the logical service area (City/Location) ignoring GPS coordinates.
    if (candidates.length === 0) {
      console.log(`[DISPATCH] Absolute fallback: matching purely based on service areas ignoring GPS...`);
      candidates = await Provider.aggregate([
        {
          $match: {
            _id: { $in: qualifiedIds },
            is_verified: true,
            isDeleted: false,
            $or: [
              { service_locations: { $in: nearbyLocationIds } },
              { service_locations: { $size: 0 } },
              { service_locations: { $exists: false } }
            ]
          }
        },
        { $limit: 5 }
      ]);
    }

    console.log(`[DISPATCH] Found ${candidates.length} eligible providers within range for booking ${booking.booking_id}`);

    if (candidates.length === 0) {
        return;
    }

    const subservice = booking.subservice_id as any;
    const serviceName = subservice?.subservice_name || subservice?.service_id?.service_name || 'New Service Request';

    // 3. Automatically Assign Booking to the Closest Provider
    if (candidates.length > 0) {
      const bestProvider = candidates[0]; // Closest one
      
      booking.provider_id = bestProvider._id;
      booking.status = 'pending';
      await booking.save();
      
      const { Notification } = await import('../models/Notification');
      await Notification.create({
        recipient_id: bestProvider.user_id,
        recipient_type: 'Provider',
        title: 'New Service Booking',
        message: 'A new booking was assigned to you and is pending your acceptance.',
        type: 'booking_alert',
        metadata: { booking_id: booking._id }
      });

      // Emit the socket event that ProviderDashboard is listening for
      emitToUser(bestProvider.user_id.toString(), 'booking_assigned', {
        booking_id: booking._id,
        message: 'A new booking was assigned to you and is pending your acceptance.'
      });

      // Emit to the customer so their booking page updates immediately
      emitToUser(booking.user_id.toString(), 'booking_status_update', {
        booking_id: booking._id,
        status: 'pending',
        message: 'Your booking has been assigned to a provider and is waiting for their confirmation.'
      });

      console.log(`[DISPATCH] Automatically assigned booking ${booking.booking_id} to provider ${bestProvider._id}`);
    }

  } catch (error) {
    console.error('[DISPATCH] Error in geospatial matching pipeline:', error);
  }
};

export const dispatchBooking = dispatchNearbyProviders;
