import { Request, Response } from 'express';
import { Coupon } from '../../models/Coupon';
import { CouponUsage } from '../../models/CouponUsage';
import mongoose from 'mongoose';

export const createCoupon = async (req: Request, res: Response) => {
  try {
    const coupon = new Coupon(req.body);
    await coupon.save();
    res.status(201).json({ message: 'Coupon created successfully', coupon });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllCoupons = async (req: Request, res: Response) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    res.status(200).json(coupons);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateCoupon = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const coupon = await Coupon.findByIdAndUpdate(id, req.body, { new: true });
    if (!coupon) return res.status(404).json({ message: 'Coupon not found' });
    res.status(200).json({ message: 'Coupon updated successfully', coupon });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteCoupon = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await Coupon.findByIdAndDelete(id);
    await CouponUsage.deleteMany({ couponId: id });
    res.status(200).json({ message: 'Coupon deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getCouponStats = async (req: Request, res: Response) => {
  try {
    const totalCoupons = await Coupon.countDocuments();
    const activeOffers = await Coupon.countDocuments({ status: 'active' });
    const totalRedemptions = await CouponUsage.countDocuments();
    
    const usageData = await CouponUsage.aggregate([
      { $group: { _id: null, totalDiscount: { $sum: '$discountApplied' } } }
    ]);
    const totalDiscountGiven = usageData.length > 0 ? usageData[0].totalDiscount : 0;

    res.status(200).json({
      totalCoupons,
      activeOffers,
      totalRedemptions,
      totalDiscountGiven
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getCouponAnalytics = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const couponId = new mongoose.Types.ObjectId(id);

    const redemptions = await CouponUsage.find({ couponId })
      .populate('userId', 'name email profile_image')
      .populate('bookingId', 'booking_id total_amount status')
      .sort({ usedAt: -1 });

    const totalRedemptions = redemptions.length;
    const totalDiscount = redemptions.reduce((sum, r) => sum + r.discountApplied, 0);
    
    // Revenue generated from bookings where this coupon was used
    const revenueGenerated = redemptions.reduce((sum, r: any) => sum + (r.bookingId?.total_amount || 0), 0);

    // Group by date for line chart (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const dailyUsage = await CouponUsage.aggregate([
      { $match: { couponId, usedAt: { $gte: thirtyDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$usedAt" } },
          count: { $sum: 1 },
          discount: { $sum: "$discountApplied" }
        }
      },
      { $sort: { "_id": 1 } }
    ]);

    res.status(200).json({
      summary: {
        totalRedemptions,
        totalDiscount,
        revenueGenerated,
        conversionRate: totalRedemptions > 0 ? (totalRedemptions / 100).toFixed(2) : 0 // Simplified conversion
      },
      dailyUsage,
      redemptions
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getCouponUsage = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const usage = await CouponUsage.find({ couponId: id })
      .populate('userId', 'name email profile_image')
      .populate('bookingId', 'booking_id total_amount createdAt')
      .sort({ usedAt: -1 });
    res.status(200).json(usage);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
