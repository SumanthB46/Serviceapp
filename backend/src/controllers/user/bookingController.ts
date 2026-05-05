import { Request, Response } from 'express';
import { Booking, IBooking } from '../../models/Booking';
import { Provider } from '../../models/Provider';
import { ProviderService } from '../../models/ProviderService';
import { Wallet } from '../../models/Wallet';
import { Notification } from '../../models/Notification';
import { AuthRequest } from '../../middleware/authMiddleware';
import { Types } from 'mongoose';

// Generate a random numeric OTP
const generateOTP = () => Math.floor(1000 + Math.random() * 9000).toString();

// Generate a unique Booking ID
const generateBookingId = () => `FIX-${Date.now().toString().slice(-6)}-${Math.floor(Math.random() * 1000)}`;

// @desc    Create a new booking
// @route   POST /api/bookings
// @access  Private/Customer
export const createBooking = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { 
      provider_id, service_id, provider_service_id, 
      scheduled_at, total_amount, payable_amount, location, variant_name
    } = req.body;

    const booking = await Booking.create({
      booking_id: generateBookingId(),
      customer_id: req.user?._id,
      provider_id,
      service_id,
      provider_service_id,
      variant_name,
      scheduled_at,
      total_amount,
      payable_amount,
      location,
      status: 'pending',
      otp: generateOTP()
    });

    // Notify Provider
    await Notification.create({
      recipient_id: provider_id,
      recipient_type: 'Provider',
      title: 'New Job Request!',
      message: `You have a new booking request for ${variant_name || 'Service'}.`,
      type: 'booking_alert',
      metadata: { booking_id: booking._id }
    });

    res.status(201).json(booking);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update booking status (Accept/Reject/In-Progress/Complete/Cancel)
// @route   PUT /api/bookings/:id/status
// @access  Private
export const updateBookingStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { status, cancellation_reason } = req.body;
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      res.status(404).json({ message: 'Booking not found' });
      return;
    }

    const oldStatus = booking.status;
    booking.status = status;

    if (status === 'completed') {
      booking.completed_at = new Date();
      // Handle wallet payout logic here
      await handlePayout(booking);
    } else if (status === 'cancelled') {
      booking.cancelled_at = new Date();
      booking.cancellation_reason = cancellation_reason;
      booking.cancelled_by = req.user?.role === 'admin' ? 'admin' : (req.user?.role === 'provider' ? 'provider' : 'customer');
    } else if (status === 'accepted') {
       // Track response time
       const now = new Date();
       const diff = (now.getTime() - booking.createdAt.getTime()) / (1000 * 60);
       booking.provider_response_time = Math.round(diff);
    }

    await booking.save();

    // Notify relevant parties
    const recipient_id = req.user?.role === 'provider' ? booking.customer_id : booking.provider_id;
    const recipient_type = req.user?.role === 'provider' ? 'User' : 'Provider';

    await Notification.create({
      recipient_id,
      recipient_type,
      title: `Booking ${status.toUpperCase()}`,
      message: `Your booking ${booking.booking_id} status has been updated to ${status}.`,
      type: 'status_update',
      metadata: { booking_id: booking._id }
    });

    res.json(booking);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

// Internal: Handle provider payout on completion
const handlePayout = async (booking: IBooking) => {
  try {
    let wallet = await Wallet.findOne({ provider_id: booking.provider_id });
    if (!wallet) {
      wallet = await Wallet.create({ provider_id: booking.provider_id, balance: 0 });
    }

    const payoutAmount = booking.payable_amount * 0.8; // Assuming 20% platform fee
    wallet.balance += payoutAmount;
    wallet.transactions.push({
      amount: payoutAmount,
      type: 'credit',
      transaction_type: 'job_payout',
      description: `Payout for Job ID: ${booking.booking_id}`,
      booking_id: booking._id as Types.ObjectId,
      status: 'completed',
      createdAt: new Date()
    });

    await wallet.save();
    
    // Update provider metrics
    await Provider.findByIdAndUpdate(booking.provider_id, {
      $inc: { total_jobs: 1, completed_jobs: 1 }
    });
  } catch (error) {
    console.error('Payout failed:', error);
  }
};

// @desc    Get all bookings (Admin)
// @route   GET /api/bookings
// @access  Private/Admin
export const getAllBookings = async (req: Request, res: Response): Promise<void> => {
  try {
    const bookings = await Booking.find({ isDeleted: false })
      .populate('customer_id', 'name email phone')
      .populate('provider_id', 'user_id location_id')
      .populate({ path: 'provider_id', populate: { path: 'user_id', select: 'name' }})
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user/provider specific bookings
// @route   GET /api/bookings/my
// @access  Private
export const getMyBookings = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const filter: any = { isDeleted: false };
    if (req.user?.role === 'provider') {
      const provider = await Provider.findOne({ user_id: req.user._id });
      filter.provider_id = provider?._id;
    } else {
      filter.customer_id = req.user?._id;
    }

    const bookings = await Booking.find(filter)
      .populate('service_id', 'service_name')
      .sort({ scheduled_at: -1 });
    res.json(bookings);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Verify OTP to transition booking state
// @route   POST /api/bookings/:id/verify
// @access  Private
export const verifyBookingOtp = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { otp, target_status } = req.body;
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      res.status(404).json({ message: 'Booking not found' });
      return;
    }

    if (booking.otp !== otp) {
      res.status(400).json({ message: 'Invalid Verification Code' });
      return;
    }

    booking.status = target_status;
    if (target_status === 'completed') {
      booking.completed_at = new Date();
      await handlePayout(booking);
    }

    await booking.save();
    res.json({ message: `Booking successfully verified and moved to ${target_status}`, booking });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};
