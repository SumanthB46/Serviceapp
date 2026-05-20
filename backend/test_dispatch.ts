import mongoose from 'mongoose';
import { dispatchNearbyProviders } from './src/services/bookingDispatchService';
import { Booking } from './src/models/Booking';
import { Provider } from './src/models/Provider';
import { ProviderService } from './src/models/ProviderService';

async function test() {
  await mongoose.connect('mongodb://localhost:27017/serviceapp');
  const latestBooking = await Booking.findOne().sort({ createdAt: -1 });
  if (latestBooking) {
    console.log('Testing dispatch for booking:', latestBooking._id);
    
    // Check provider services
    const providerServices = await ProviderService.find({
      subservice_ids: latestBooking.subservice_id,
      is_active: true,
      isDeleted: false
    });
    console.log(`Found ${providerServices.length} providers offering subservice ${latestBooking.subservice_id}`);
    
    const providers = await Provider.find({ _id: { $in: providerServices.map(ps => ps.provider_id) }});
    console.log('Providers details:');
    providers.forEach(p => console.log(`Provider ${p._id}: isOnline=${p.isOnline}, is_verified=${p.is_verified}, status=${p.availability_status}`));
    
    await dispatchNearbyProviders(latestBooking._id.toString());
  } else {
    console.log('No bookings found.');
  }
  process.exit(0);
}
test();
