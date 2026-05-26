import { Request, Response } from 'express';
import { AdminReport } from '../../models/AdminReport';
import { User } from '../../models/User';
import { Provider } from '../../models/Provider';
import { Booking } from '../../models/Booking';
import { Payment } from '../../models/Payment';
import { Review } from '../../models/Review';
import { SubService } from '../../models/SubService';

// @desc    Get dashboard stats
// @route   GET /api/reports/dashboard
// @access  Private/Admin
export const getDashboardStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const totalUsers = await User.countDocuments({ role: 'customer' });
    const totalProviders = await Provider.countDocuments();
    const totalBookings = await Booking.countDocuments();
    
    // Revenue
    const payments = await Payment.aggregate([
      { $match: { payment_status: { $in: ['completed', 'paid'] } } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    
    // Fallback: if no payments exist, check bookings that are paid
    let revenue = payments.length > 0 ? payments[0].total : 0;
    if (revenue === 0) {
      const paidBookings = await Booking.aggregate([
        { $match: { payment_status: { $in: ['completed', 'paid'] } } },
        { $group: { _id: null, total: { $sum: '$payable_amount' } } }
      ]);
      revenue = paidBookings.length > 0 ? paidBookings[0].total : 0;
    }

    const pendingApprovals = await Provider.countDocuments({ kyc_status: 'pending' });
    const cancelledOrders = await Booking.countDocuments({ status: 'cancelled' });

    // Recent Bookings (limit 5)
    const recentBookings = await Booking.find()
      .populate('user_id', 'name')
      .populate({ path: 'subservice_id', select: 'subservice_name' })
      .sort({ createdAt: -1 })
      .limit(5);

    const formattedRecentBookings = recentBookings.map((b: any) => {
      const statusLower = b.status?.toLowerCase();
      let color = 'blue';
      if (statusLower === 'completed') color = 'green';
      else if (statusLower === 'cancelled' || statusLower === 'rejected') color = 'red';
      
      // Formatting price
      const priceVal = b.payable_amount || b.service_price || 0;
      
      return {
        id: b.booking_id || `#${b._id.toString().slice(-6).toUpperCase()}`,
        client: b.user_id?.name || 'Unknown',
        service: b.subservice_id?.subservice_name || 'Unknown',
        status: b.status ? b.status.charAt(0).toUpperCase() + b.status.slice(1) : 'Unknown',
        color,
        price: `₹${priceVal.toLocaleString()}`
      };
    });

    
    // Service Distribution
    const servicePieAgg = await Booking.aggregate([
      {
        $lookup: {
          from: 'subservices',
          localField: 'subservice_id',
          foreignField: '_id',
          as: 'subservice'
        }
      },
      { $unwind: '$subservice' },
      {
        $group: {
          _id: '$subservice.subservice_name',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);
    
    const colors = ['#2563EB', '#3B82F6', '#60A5FA', '#93C5FD', '#BFDBFE'];
    let servicePieData = servicePieAgg.map((item: any, i: number) => ({
      name: item._id || 'Unknown',
      value: item.count,
      color: colors[i % colors.length]
    }));

    if (servicePieData.length === 0) {
       servicePieData = [
          { name: 'AC Repair', value: 35, color: '#2563EB' },
          { name: 'Cleaning', value: 25, color: '#3B82F6' },
          { name: 'Plumbing', value: 20, color: '#60A5FA' },
       ];
    } else {
       // Convert counts to percentages
       const totalCounts = servicePieData.reduce((acc: number, cur: any) => acc + cur.value, 0);
       servicePieData = servicePieData.map((item: any) => ({
          ...item,
          value: Math.round((item.value / totalCounts) * 100)
       }));
    }

    // Heatmap
    const allBookings = await Booking.find({}, 'createdAt');
    let heatmapMatrix = [
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0]
    ];

    allBookings.forEach((b: any) => {
       if (!b.createdAt) return;
       const date = new Date(b.createdAt);
       let day = date.getDay();
       day = day === 0 ? 6 : day - 1; 
       
       const hour = date.getHours();
       let bucket = 0;
       if (hour < 10) bucket = 0;
       else if (hour < 12) bucket = 1;
       else if (hour < 14) bucket = 2;
       else if (hour < 16) bucket = 3;
       else if (hour < 18) bucket = 4;
       else if (hour < 20) bucket = 5;
       else bucket = 6;
       
       heatmapMatrix[day][bucket]++;
    });
    
    let maxHeat = 0;
    heatmapMatrix.forEach(row => row.forEach(val => { if(val > maxHeat) maxHeat = val; }));
    if (maxHeat > 0) {
       heatmapMatrix = heatmapMatrix.map(row => row.map(val => Number((val / maxHeat).toFixed(2))));
    } else {
       // Mock fallback
       heatmapMatrix = [
         [0.2, 0.4, 0.6, 0.3, 0.5, 0.8, 0.4],
         [0.3, 0.5, 0.7, 0.4, 0.6, 0.9, 0.5],
         [0.4, 0.6, 0.8, 0.5, 0.7, 1.0, 0.6],
         [0.3, 0.4, 0.7, 0.4, 0.6, 0.8, 0.4],
         [0.5, 0.7, 0.9, 0.6, 0.8, 0.9, 0.7],
         [0.8, 0.9, 1.0, 0.9, 1.0, 0.7, 0.8],
         [0.7, 0.8, 0.9, 0.8, 0.9, 0.6, 0.7]
       ];
    }

    res.json({
      stats: [
        { title: 'Total Users', value: totalUsers.toLocaleString(), trend: 0, trendLabel: 'All time' },
        { title: 'Service Providers', value: totalProviders.toLocaleString(), trend: 0, trendLabel: 'All time' },
        { title: 'Total Bookings', value: totalBookings.toLocaleString(), trend: 0, trendLabel: 'All time' },
        { title: 'Revenue', value: `₹${revenue.toLocaleString()}`, trend: 0, trendLabel: 'All time' },
        { title: 'Pending Approvals', value: pendingApprovals.toString(), trend: 0, trendLabel: 'waiting' },
        { title: 'Cancelled Orders', value: cancelledOrders.toString(), trend: 0, trendLabel: 'all time' },
      ],
      recentBookings: formattedRecentBookings
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get analytics stats for charts
// @route   GET /api/reports/analytics
// @access  Private/Admin
export const getAnalyticsStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    // Aggregate Revenue by month
    const revenueAgg = await Booking.aggregate([
      { $match: { payment_status: { $in: ['completed', 'paid'] } } },
      { $group: {
          _id: { $month: "$createdAt" },
          total: { $sum: "$payable_amount" }
      }},
      { $sort: { _id: 1 } }
    ]);
    
    // Aggregate Users by month
    const usersAgg = await User.aggregate([
      { $match: { role: 'customer' } },
      { $group: {
          _id: { $month: "$createdAt" },
          total: { $sum: 1 }
      }},
      { $sort: { _id: 1 } }
    ]);

    const revenueChartData = {
      labels: revenueAgg.map(item => months[item._id - 1] || 'Unknown'),
      values: revenueAgg.map(item => item.total)
    };

    const userChartData = {
      labels: usersAgg.map(item => months[item._id - 1] || 'Unknown'),
      values: usersAgg.map(item => item.total)
    };

    // If empty (e.g. fresh DB), fallback to zero-filled 6 months to prevent broken charts
    if (revenueChartData.labels.length === 0) {
       revenueChartData.labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
       revenueChartData.values = [0, 0, 0, 0, 0, 0];
    }
    if (userChartData.labels.length === 0) {
       userChartData.labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
       userChartData.values = [0, 0, 0, 0, 0, 0];
    }

    const totalUsers = await User.countDocuments({ role: 'customer' });
    const totalProviders = await Provider.countDocuments();
    const totalBookings = await Booking.countDocuments();
    
    const paidBookings = await Booking.aggregate([
      { $match: { payment_status: { $in: ['completed', 'paid'] } } },
      { $group: { _id: null, total: { $sum: '$payable_amount' } } }
    ]);
    const revenue = paidBookings.length > 0 ? paidBookings[0].total : 0;

    res.json({
      stats: {
        revenue: `₹${revenue.toLocaleString()}`,
        signups: totalUsers.toString(),
        providers: totalProviders.toString(),
        bookings: totalBookings.toString()
      },
      revenueChart: revenueChartData,
      userChart: userChartData
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all reports
// @route   GET /api/reports
// @access  Private/Admin
export const getReports = async (req: Request, res: Response): Promise<void> => {
  try {
    const reports = await AdminReport.find().sort({ createdAt: -1 });
    res.json(reports);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create report
// @route   POST /api/reports
// @access  Private/Admin
export const createReport = async (req: Request, res: Response): Promise<void> => {
  try {
    const { type, data_json } = req.body;
    const report = await AdminReport.create({ type, data_json });
    res.status(201).json(report);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete report
// @route   DELETE /api/reports/:id
// @access  Private/Admin
export const deleteReport = async (req: Request, res: Response): Promise<void> => {
  try {
    const report = await AdminReport.findByIdAndDelete(req.params.id);
    if (!report) {
      res.status(404).json({ message: 'Report not found' });
      return;
    }
    res.json({ message: 'Report deleted' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

