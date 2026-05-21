const mongoose = require('mongoose');
require('dotenv').config({ path: './.env' });

async function test() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to DB");
  
  const User = require('./src/models/User').User;
  const Provider = require('./src/models/Provider').Provider;
  const Booking = require('./src/models/Booking').Booking;
  const Payment = require('./src/models/Payment').Payment;
  const Review = require('./src/models/Review').Review;
  
  try {
    console.log("1. totalUsers");
    await User.countDocuments({ role: 'customer' });
    console.log("2. totalProviders");
    await Provider.countDocuments();
    console.log("3. totalBookings");
    await Booking.countDocuments();
    
    console.log("4. payments agg");
    const payments = await Payment.aggregate([
      { $match: { payment_status: { $in: ['completed', 'paid'] } } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    
    console.log("5. paidBookings agg");
    const paidBookings = await Booking.aggregate([
      { $match: { payment_status: { $in: ['completed', 'paid'] } } },
      { $group: { _id: null, total: { $sum: '$payable_amount' } } }
    ]);

    console.log("6. pendingApprovals");
    await Provider.countDocuments({ kyc_status: 'pending' });
    console.log("7. cancelledOrders");
    await Booking.countDocuments({ status: 'cancelled' });

    console.log("8. recentBookings");
    await Booking.find()
      .populate('user_id', 'name')
      .populate({ path: 'subservice_id', select: 'name category_id' })
      .populate({ path: 'provider_id', populate: { path: 'user_id', select: 'name' } })
      .sort({ createdAt: -1 })
      .limit(5);

    console.log("9. revenueAgg");
    await Booking.aggregate([
      { $match: { payment_status: { $in: ['completed', 'paid'] } } },
      { $group: { _id: { $month: "$createdAt" }, total: { $sum: "$payable_amount" } } },
      { $sort: { _id: 1 } }
    ]);
    
    console.log("10. bookingDailyAgg");
    await Booking.aggregate([
      { $group: { _id: { $dayOfWeek: "$createdAt" }, total: { $sum: 1 } } }
    ]);
    
    console.log("11. order statuses");
    await Booking.countDocuments({ status: 'completed' });
    await Booking.countDocuments({ status: { $in: ['pending', 'accepted', 'in_progress'] } });
    await Booking.countDocuments({ status: { $in: ['cancelled', 'rejected'] } });

    console.log("12. topProviders");
    await Provider.find({ is_verified: true })
      .populate('user_id', 'name profile_image')
      .limit(4);

    console.log("13. recentReviews");
    await Review.find()
      .populate('user_id', 'name')
      .populate({ path: 'subservice_id', select: 'name' })
      .sort({ createdAt: -1 })
      .limit(3);

    console.log("Success! All queries passed.");
  } catch (e) {
     console.error("Error at step:", e);
  }
  
  process.exit(0);
}

test();
