import { Request, Response } from 'express';
import { Booking } from '../../models/Booking';
import { Cart } from '../../models/Cart';
import { Coupon } from '../../models/Coupon';
import { UserMembership } from '../../models/UserMembership';
import { AuthRequest } from '../../middleware/authMiddleware';
import { dispatchNearbyProviders } from '../../services/bookingDispatchService';
export const getAllBookings = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const bookings = await Booking.find({})
      .populate('user_id', 'name email phone profile_image')
      .populate({
        path: 'provider_id',
        populate: {
          path: 'user_id',
          select: 'name email phone profile_image'
        }
      })
      .populate({
        path: 'subservice_id',
        populate: {
          path: 'service_id',
          populate: {
            path: 'category_id',
            select: 'category_name icon'
          }
        }
      })
      .populate('address_id')
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get my bookings (Customer or Provider)
// @route   GET /api/bookings/my
// @access  Private
export const getMyBookings = async (req: AuthRequest, res: Response): Promise<void> => {
  console.log("Get My Bookings Request:", { 
    userId: req.user?._id, 
    role: req.user?.role,
    user: req.user
  });
  try {
    let query = {};
    
    if (req.user?.role === 'customer') {
      query = { 
        $or: [
          { user_id: req.user._id },
          { customer_id: req.user._id }
        ]
      };
    } else if (req.user?.role === 'provider') {
      const { Provider } = await import('../../models/Provider');
      const provider = await Provider.findOne({ user_id: req.user._id });
      
      query = { 
        $or: [
          { provider_id: provider?._id },
          { customer_id: req.user._id } // Fallback for old provider field if any
        ]
      }; 
    }

    const bookings = await Booking.find(query)
      .populate('user_id', 'name email phone profile_image')
      .populate({
        path: 'provider_id',
        populate: {
          path: 'user_id',
          select: 'name email phone profile_image'
        }
      })
      .populate({
        path: 'subservice_id',
        populate: {
          path: 'service_id',
          populate: {
            path: 'category_id',
            select: 'category_name icon'
          }
        }
      })
      .populate('address_id')
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single booking
// @route   GET /api/bookings/:id
// @access  Private
export const getBookingById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('user_id', 'name email phone profile_image')
      .populate({
        path: 'provider_id',
        populate: {
          path: 'user_id',
          select: 'name email phone profile_image'
        }
      })
      .populate({
        path: 'subservice_id',
        populate: {
          path: 'service_id',
          populate: {
            path: 'category_id',
            select: 'category_name icon'
          }
        }
      })
      .populate('address_id');

    if (!booking) {
      res.status(404).json({ message: 'Booking not found' });
      return;
    }

    // Check authorization
    if (req.user?.role === 'customer' && booking.user_id.toString() !== req.user._id.toString()) {
      res.status(403).json({ message: 'Not authorized' });
      return;
    }

    res.json(booking);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Private
export const createBooking = async (req: AuthRequest, res: Response): Promise<void> => {
  console.log("Create Booking Hit!", { body: req.body, user: req.user?._id });
  try {
    const { 
      booking_date, 
      time_slot, 
      address,
      payment_method,
      coupon_code
    } = req.body;

    if (!address) {
      res.status(400).json({ message: 'Please select an address' });
      return;
    }

    const cart = await Cart.findOne({ user_id: req.user?._id }).populate({
      path: 'items.subservice_id',
      populate: { path: 'service_id' }
    });
    if (!cart || cart.items.length === 0) {
      res.status(400).json({ message: 'Cart is empty' });
      return;
    }

    let totalDiscount = 0;
    
    // FINAL BACKEND COUPON VALIDATION
    if (coupon_code) {
      const coupon = await Coupon.findOne({ code: coupon_code });
      if (!coupon) {
        res.status(400).json({ message: 'Invalid coupon code' });
        return;
      }
      
      if (coupon.status !== 'active') {
        res.status(400).json({ message: 'Coupon is not active' });
        return;
      }

      if (new Date() > new Date(coupon.expiryDate)) {
        res.status(400).json({ message: 'Coupon has expired' });
        return;
      }

      if (cart.total_amount < coupon.minOrderAmount) {
        res.status(400).json({ message: `Minimum order amount of ₹${coupon.minOrderAmount} required` });
        return;
      }

      // User eligibility check
      if (coupon.targetAudience.includes('members')) {
        const activeMembership = await UserMembership.findOne({ 
          user_id: req.user?._id, 
          membership_status: 'active' 
        });
        if (!activeMembership) {
          res.status(400).json({ message: 'This coupon is valid for members only' });
          return;
        }
      }

      if (coupon.targetAudience.includes('first_time')) {
        const previousBookings = await Booking.countDocuments({ user_id: req.user?._id, status: 'completed' });
        if (previousBookings > 0) {
          res.status(400).json({ message: 'This coupon is valid for first-time users only' });
          return;
        }
      }

      // Usage limits check
      if (coupon.usageLimit > 0) {
        // Since one checkout creates multiple bookings, count distinct group_booking_ids or just total usages
        const totalUses = await Booking.distinct('booking_id', { applied_coupon: coupon_code });
        if (totalUses.length >= coupon.usageLimit) {
          res.status(400).json({ message: 'Coupon usage limit has been reached' });
          return;
        }
      }

      if (coupon.perUserLimit > 0) {
        const userUses = await Booking.distinct('booking_id', { applied_coupon: coupon_code, user_id: req.user?._id });
        if (userUses.length >= coupon.perUserLimit) {
          res.status(400).json({ message: `You have reached the maximum usage limit (${coupon.perUserLimit}) for this coupon` });
          return;
        }
      }
      
      // Calculate total eligible amount
      let eligibleAmount = 0;
      for (const item of cart.items) {
        let isEligible = true;
        const subservice: any = item.subservice_id;
        
        if (coupon.allowedServices && coupon.allowedServices.length > 0) {
           if (!coupon.allowedServices.includes(subservice.service_id?._id) && !coupon.allowedServices.includes(subservice._id)) {
             isEligible = false;
           }
        }
        
        if (coupon.allowedCategories && coupon.allowedCategories.length > 0) {
           if (!coupon.allowedCategories.includes(subservice.service_id?.category_id)) {
             isEligible = false;
           }
        }
        
        if (isEligible) {
          eligibleAmount += item.price_snapshot * item.quantity;
        }
      }

      if (eligibleAmount === 0 && (coupon.allowedServices?.length > 0 || coupon.allowedCategories?.length > 0)) {
        res.status(400).json({ message: 'Coupon is not applicable for the selected services' });
        return;
      }

      // Calculate discount
      if (coupon.discountType === 'flat') {
        totalDiscount = coupon.discountValue;
      } else if (coupon.discountType === 'percentage') {
        totalDiscount = (eligibleAmount * coupon.discountValue) / 100;
        if (coupon.maxDiscountLimit && totalDiscount > coupon.maxDiscountLimit) {
          totalDiscount = coupon.maxDiscountLimit;
        }
      }
    }

    const createdBookings = [];
    const groupBookingId = `BK-${Math.floor(100000 + Math.random() * 900000)}`;

    for (const item of cart.items) {
      const itemPrice = item.price_snapshot * item.quantity;
      // Pro-rata discount distribution
      const itemDiscount = cart.total_amount > 0 ? (itemPrice / cart.total_amount) * totalDiscount : 0;
      const payableAmount = Math.max(0, itemPrice - itemDiscount);

      const booking = await Booking.create({
        booking_id: groupBookingId,
        user_id: req.user?._id,
        subservice_id: (item.subservice_id as any)._id || item.subservice_id,
        address_id: address._id || address,
        scheduled_at: booking_date,
        booking_time: time_slot,
        service_price: itemPrice,
        discount_amount: itemDiscount,
        payable_amount: payableAmount,
        payment_method: payment_method || 'cod',
        applied_coupon: totalDiscount > 0 ? coupon_code : undefined,
        status: 'pending',
        is_reviewed: false,
        isDeleted: false
      });
      createdBookings.push(booking);
      
      // Notify multiple nearby providers
      await dispatchNearbyProviders(booking._id.toString());
    }

    // Clear cart after successful booking
    cart.items = [];
    cart.total_amount = 0;
    await cart.save();

    res.status(201).json({
      message: 'Bookings created successfully',
      bookings: createdBookings
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update booking status
// @route   PUT /api/bookings/:id
// @access  Private
export const updateBookingStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      res.status(404).json({ message: 'Booking not found' });
      return;
    }

    const { status } = req.body;
    
    booking.status = status ?? booking.status;

    const updated = await booking.save();
    res.json(updated);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get bookings for a specific user ID
// @route   GET /api/bookings/user/:userId
// @access  Private/Admin
export const getBookingsByUserId = async (req: Request, res: Response): Promise<void> => {
  try {
    const bookings = await Booking.find({ user_id: req.params.userId })
      .populate('user_id', 'name email phone profile_image')
      .populate({
        path: 'provider_id',
        populate: {
          path: 'user_id',
          select: 'name email phone profile_image'
        }
      })
      .populate({
        path: 'subservice_id',
        populate: {
          path: 'service_id',
          populate: {
            path: 'category_id',
            select: 'category_name icon'
          }
        }
      })
      .populate('address_id')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get bookings for a specific provider
// @route   GET /api/bookings/provider/:providerId
// @access  Private/Provider
export const getBookingsByProvider = async (req: Request, res: Response): Promise<void> => {
  try {
    const bookings = await Booking.find({ provider_id: req.params.providerId })
      .populate('user_id', 'name email phone profile_image')
      .populate({
        path: 'subservice_id',
        populate: {
          path: 'service_id',
          populate: {
            path: 'category_id',
            select: 'category_name icon'
          }
        }
      })
      .populate('address_id')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const debugDispatch = async (req: Request, res: Response): Promise<void> => {
  try {
    const booking = await Booking.findOne().sort({ createdAt: -1 });
    if (!booking) {
      res.json({ message: "No bookings found" });
      return;
    }
    
    const { dispatchNearbyProviders } = await import('../../services/bookingDispatchService');
    
    // Call the actual dispatch service logic and wait for it
    await dispatchNearbyProviders(booking._id.toString());
    
    // Fetch the updated booking to see if provider_id got assigned
    const updatedBooking = await Booking.findById(booking._id);
    
    res.json({
      message: "Dispatch manually triggered",
      bookingId: booking._id,
      assignedProvider: updatedBooking?.provider_id || "None",
      status: updatedBooking?.status
    });
  } catch(e: any) {
    res.json({ error: e.message });
  }
};

// @desc    Verify booking OTP
// @route   POST /api/bookings/:id/verify
// @access  Private
export const verifyBookingOtp = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { otp } = req.body;
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      res.status(404).json({ message: 'Booking not found' });
      return;
    }

    if (booking.start_otp !== otp) {
      res.status(400).json({ message: 'Invalid OTP' });
      return;
    }

    booking.status = 'completed';
    await booking.save();

    res.json({ message: 'Booking verified successfully', booking });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Cancel booking
// @route   PUT /api/bookings/:id/cancel
// @access  Private
export const cancelBooking = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      res.status(404).json({ message: 'Booking not found' });
      return;
    }

    // Check authorization
    if (booking.user_id.toString() !== req.user?._id.toString()) {
      res.status(403).json({ message: 'Not authorized' });
      return;
    }

    const allowedStatuses = ['pending', 'accepted'];
    if (!allowedStatuses.includes(booking.status)) {
      res.status(400).json({ message: 'Cannot cancel booking in current status' });
      return;
    }

    // Time restriction: 1 hour before booking
    const bookingDateTime = new Date(booking.scheduled_at);
    const diff = bookingDateTime.getTime() - Date.now();
    const oneHour = 60 * 60 * 1000;

    if (diff < oneHour) {
      res.status(400).json({ message: 'Cancellation window closed (within 1 hour of service)' });
      return;
    }

    const { reason } = req.body;

    booking.status = 'cancelled';
    booking.cancelled_at = new Date();
    booking.cancelled_by = 'customer';
    booking.cancellation_reason = reason;

    // Refund logic
    if (booking.payment_method === 'cod') {
      booking.refund_status = 'none';
      booking.refund_amount = 0;
      booking.refund_reason = 'COD payment not refundable';
    } else if (booking.payment_method === 'online' || booking.payment_method === 'wallet') {
      booking.refund_status = 'processing';
      booking.refund_amount = booking.payable_amount;
      booking.refund_reason = 'Service cancelled before delivery';
    }

    await booking.save();

    res.json({ message: 'Booking cancelled successfully', booking });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
