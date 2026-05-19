import { Request, Response } from 'express';
import { Booking } from '../../models/Booking';
import { Cart } from '../../models/Cart';
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
      payment_method
    } = req.body;

    if (!address) {
      res.status(400).json({ message: 'Please select an address' });
      return;
    }

    const cart = await Cart.findOne({ user_id: req.user?._id });
    if (!cart || cart.items.length === 0) {
      res.status(400).json({ message: 'Cart is empty' });
      return;
    }

    const createdBookings = [];

    for (const item of cart.items) {
      const booking = await Booking.create({
        booking_id: `BK-${Math.floor(100000 + Math.random() * 900000)}`,
        user_id: req.user?._id,
        subservice_id: item.subservice_id,
        address_id: address._id || address,
        scheduled_at: booking_date,
        booking_time: time_slot,
        service_price: item.price_snapshot * item.quantity,
        payable_amount: item.price_snapshot * item.quantity,
        payment_method: payment_method || 'cod',
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

    await booking.save();

    res.json({ message: 'Booking cancelled successfully', booking });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
