import { Request, Response } from 'express';
import { Booking } from '../../models/Booking';
import { AuthRequest } from '../../middleware/authMiddleware';

// @desc    Get all bookings (Admin or filtered by user/provider)
// @route   GET /api/bookings
// @access  Private
export const getBookings = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    let query = {};
    
    if (req.user?.role === 'customer') {
      query = { user_id: req.user._id };
    } else if (req.user?.role === 'provider') {
      query = { provider_id: req.user._id };
    }
    // Admin gets all

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
      .populate('user_id', 'name email phone profile_image')
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
  try {
    const { provider_id, service_id, booking_date, time_slot, address, total_amount } = req.body;

    const booking = await Booking.create({
      user_id: req.user?._id,
      provider_id,
      service_id,
      booking_date,
      time_slot,
      address,
      total_amount,
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
    
    // Logic for who can update what status
    // For now simple update
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

