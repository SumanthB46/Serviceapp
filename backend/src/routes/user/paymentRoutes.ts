import express from 'express';
import { processPayment, getPaymentByBooking, getAllPayments } from '../../controllers/user/paymentController';
import { protect, admin } from '../../middleware/authMiddleware';

const router = express.Router();

router.route('/')
  .get(protect, admin, getAllPayments)
  .post(protect, processPayment);

router.get('/:bookingId', protect, getPaymentByBooking);

export default router;



