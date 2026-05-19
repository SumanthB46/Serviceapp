 const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://fixvoadmin_db_user:Admin123@cluster0.rdlnwbx.mongodb.net/serviceapp').then(async () => {
  const Booking = mongoose.model('Booking', new mongoose.Schema({}, { strict: false }));
  const Provider = mongoose.model('Provider', new mongoose.Schema({}, { strict: false }));
  const ProviderService = mongoose.model('ProviderService', new mongoose.Schema({}, { strict: false }));
  const Location = mongoose.model('Location', new mongoose.Schema({}, { strict: false }));
  const Address = mongoose.model('Address', new mongoose.Schema({}, { strict: false }));

  const b = await Booking.findOne().sort({createdAt: -1});
  console.log('--- LATEST BOOKING ---');
  console.log('ID:', b._id);
  console.log('Subservice:', b.subservice_id);
  console.log('Status:', b.status);
  console.log('Provider Assigned:', b.provider_id);
  
  if (b) {
     const addr = await Address.findById(b.address_id);
     console.log('\n--- ADDRESS COORDS ---');
     console.log(addr ? JSON.stringify(addr.coordinates) : 'No address');

     const ps = await ProviderService.find({ subservice_ids: b.subservice_id, is_active: true });
     console.log('\n--- PROVIDER SERVICES MATCHING SUBSERVICE ---');
     console.log('Count:', ps.length);
     
     if (ps.length > 0) {
        const providers = await Provider.find({ _id: { $in: ps.map(p => p.provider_id) } });
        console.log('\n--- PROVIDER STATUS ---');
        providers.forEach(p => {
           console.log(`Provider ${p._id} | avail:${p.availability_status} | online:${p.isOnline} | verified:${p.is_verified} | live_loc:${JSON.stringify(p.live_location)} | services_locs: ${p.service_locations}`);
        });
     }
  }
  process.exit();
}).catch(e => { console.error(e); process.exit(); });
