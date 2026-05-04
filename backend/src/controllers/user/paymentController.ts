import { Request, Response } from 'express';
import { Payment } from '../../models/Payment';
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

