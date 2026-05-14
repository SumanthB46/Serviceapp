import { Request, Response } from 'express';
import { Payment } from '../../models/Payment';
import { Booking } from '../../models/Booking';
import { AuthRequest } from '../../middleware/authMiddleware';

// @desc    Process payment (Mock)
// @route   POST /api/payments
// @access  Private
export const processPayment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { booking_id, amount, payment_method } = req.body;

    // Here you would normally integrate with Razorpay, Stripe, etc.
    const payment = await Payment.create({
      booking_id,
      amount,
      payment_method,
      payment_status: 'completed', // Mocking success
      transaction_id: 'TXN_' + Math.random().toString(36).substr(2, 9).toUpperCase(),
      payment_date: new Date()
    });

    res.status(201).json(payment);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get payment details
// @route   GET /api/payments/:bookingId
// @access  Private
export const getPaymentByBooking = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const payment = await Payment.findOne({ booking_id: req.params.bookingId });
    if (!payment) {
      res.status(404).json({ message: 'Payment not found' });
      return;
    }

    res.json(payment);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all payments (Admin)
// @route   GET /api/payments
// @access  Private/Admin
export const getAllPayments = async (req: Request, res: Response): Promise<void> => {
  try {
    const payments = await Payment.find().populate('booking_id').sort({ createdAt: -1 });
    res.json(payments);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get payments for logged-in user
// @route   GET /api/payments/my
// @access  Private
export const getMyPayments = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      res.status(401).json({ message: 'Not authenticated' });
      return;
    }

    // Get all bookings for this user
    const bookings = await Booking.find({ user_id: userId, isDeleted: false })
      .populate({ path: 'subservice_id', select: 'name' })
      .select('_id booking_id subservice_id payable_amount payment_status payment_method');

    const bookingIds = bookings.map(b => b._id);

    // Get payments for those bookings
    const payments = await Payment.find({ booking_id: { $in: bookingIds } })
      .sort({ createdAt: -1 })
      .lean();

    // Build booking map for quick lookup
    const bookingMap = new Map(
      bookings.map(b => [String(b._id), b])
    );

    // Merge payment + booking info
    const result = payments.map(p => {
      const booking = bookingMap.get(String(p.booking_id));
      return {
        _id:             p._id,
        booking_id:      booking?.booking_id ?? p.booking_id,
        subservice_name: (booking?.subservice_id as any)?.name ?? '—',
        amount:          p.amount,
        payment_method:  p.payment_method,
        payment_status:  p.payment_status,
        transaction_id:  p.transaction_id ?? '—',
        payment_date:    p.payment_date ?? p.createdAt,
      };
    });

    res.json(result);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

