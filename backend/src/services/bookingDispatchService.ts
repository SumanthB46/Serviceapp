import { Booking } from '../models/Booking';
import { Provider } from '../models/Provider';
import { JobRequest } from '../models/JobRequest';
import { Address } from '../models/Address';
import { ProviderService } from '../models/ProviderService';
import { Location } from '../models/Location';
import { emitToUser } from './socketService';
import mongoose from 'mongoose';

/**
 * Uber/Urban Company Style Geospatial Dispatch
 * 
 * Logic:
 * 1. Identify user's exact GPS coordinates from their address.
 * 2. Find all providers who:
 *    a) Provide the requested service.
 *    b) Are currently online and available (not busy).
 *    c) Are verified.
 * 3. Use MongoDB $geoNear to calculate real-time distance from user.
 * 4. Filter providers by their INDIVIDUAL service radius.
 * 5. Notify the top candidates ordered by proximity.
 */
export const dispatchNearbyProviders = async (bookingId: string) => {
  try {
    const booking = await Booking.findById(bookingId);
    if (!booking) return;

    const address = await Address.findById(booking.address_id);
    if (!address || !address.coordinates || !address.coordinates.coordinates) {
        console.error(`[DISPATCH] Critical: No GPS coordinates for booking ${bookingId}`);
        return;
    }

    const [userLng, userLat] = address.coordinates.coordinates;
    const GLOBAL_MAX_DISTANCE = 30000; // 30km absolute limit for scanning

    // 0. Fetch qualified provider IDs for this specific service
    const providerServices = await ProviderService.find({
      subservice_ids: booking.subservice_id,
      is_active: true,
      isDeleted: false
    }).select('provider_id');

    const qualifiedIds = providerServices.map(ps => ps.provider_id);
    if (qualifiedIds.length === 0) {
        console.log(`[DISPATCH] No qualified providers found for subservice ${booking.subservice_id}`);
        return;
    }

    // 1. Geospatial Aggregation
    const candidates = await Provider.aggregate([
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
            availability_status: 'available'
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

    console.log(`[DISPATCH] Found ${candidates.length} eligible providers within radius for booking ${booking.booking_id}`);

    if (candidates.length === 0) {
        // Here you could implement a broader fallback or alert admin
        return;
    }

    // 2. Create Job Requests and Notify via Socket
    for (const provider of candidates) {
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minute acceptance window

      // Prevent duplicate job requests
      const exists = await JobRequest.findOne({ booking_id: booking._id, provider_id: provider._id });
      if (exists) continue;

      const jobRequest = await JobRequest.create({
        booking_id: booking._id,
        provider_id: provider._id,
        expires_at: expiresAt,
        distance: Math.round(provider.distance), 
        status: 'pending'
      });

      // Notify provider in real-time
      emitToUser(provider.user_id.toString(), 'new_job_request', {
        request_id: jobRequest._id,
        booking_id: booking._id,
        display_id: booking.booking_id,
        service_name: booking.variant_name || 'New Service Request',
        amount: booking.payable_amount,
        location: {
            address: address.address_line,
            city: address.city,
            distance: (provider.distance / 1000).toFixed(1) + ' km'
        },
        scheduled_at: booking.scheduled_at,
        booking_time: booking.booking_time,
        expires_at: expiresAt
      });
    }

  } catch (error) {
    console.error('[DISPATCH] Error in geospatial matching pipeline:', error);
  }
};

export const dispatchBooking = dispatchNearbyProviders;
