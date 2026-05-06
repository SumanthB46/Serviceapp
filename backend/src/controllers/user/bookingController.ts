import { Request, Response } from 'express';
import { Booking } from '../../models/Booking';
import { AuthRequest } from '../../middleware/authMiddleware';
export const getAllBookings = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const bookings = await Booking.find({})
      .populate('customer_id', 'name email phone profile_image')
      .populate({
        path: 'provider_id',
        populate: {
          path: 'user_id',
          select: 'name email phone profile_image'
        }
      })
      .populate({
        path: 'service_id',
        populate: {
          path: 'category_id',
          select: 'category_name icon'
        }
      })
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
  try {
    let query = {};
    
    if (req.user?.role === 'customer') {
      query = { customer_id: req.user._id };
    } else if (req.user?.role === 'provider') {
      query = { provider_id: req.user._id }; 
    }

    const bookings = await Booking.find(query)
      .populate('customer_id', 'name email phone profile_image')
      .populate({
        path: 'provider_id',
        populate: {
          path: 'user_id',
          select: 'name email phone profile_image'
        }
      })
      .populate({
        path: 'service_id',
        populate: {
          path: 'category_id',
          select: 'category_name icon'
        }
      })
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
      .populate('customer_id', 'name email phone profile_image')
      .populate({
        path: 'provider_id',
        populate: {
          path: 'user_id',
          select: 'name email phone profile_image'
        }
      })
      .populate({
        path: 'service_id',
        populate: {
          path: 'category_id',
          select: 'category_name icon'
        }
      });

    if (!booking) {
      res.status(404).json({ message: 'Booking not found' });
      return;
    }

    // Check authorization
    if (req.user?.role === 'customer' && booking.customer_id.toString() !== req.user._id.toString()) {
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
  try {
    const { 
      provider_id, 
      service_id, 
      provider_service_id,
      booking_date, 
      time_slot, 
      address, 
      total_amount,
      booking_id 
    } = req.body;

    const booking = await Booking.create({
      booking_id: booking_id || `BK-${Date.now()}`,
      customer_id: req.user?._id,
      provider_id,
      service_id,
      provider_service_id,
      scheduled_at: booking_date,
      location: {
        address: address.address,
        city: address.city || '',
        state: address.state || '',
        pincode: address.pincode || '',
        coordinates: address.coordinates || { type: 'Point', coordinates: [0, 0] }
      },
      total_amount,
      payable_amount: total_amount, // Default to total
      status: 'pending'
    });

    res.status(201).json(booking);
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
    const bookings = await Booking.find({ customer_id: req.params.userId })
      .populate('customer_id', 'name email phone profile_image')
      .populate({
        path: 'provider_id',
        populate: {
          path: 'user_id',
          select: 'name email phone profile_image'
        }
      })
      .populate({
        path: 'service_id',
        populate: {
          path: 'category_id',
          select: 'category_name icon'
        }
      })
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
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

    if (booking.otp !== otp) {
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
