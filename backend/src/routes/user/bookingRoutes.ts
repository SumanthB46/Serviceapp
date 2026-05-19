import express from 'express';
import { 
  createBooking, 
  updateBookingStatus, 
  getAllBookings, 
  getMyBookings, 
  getBookingsByUserId,
  getBookingsByProvider,
  verifyBookingOtp,
  cancelBooking,
  debugDispatch
} from '../../controllers/user/bookingController';
import { protect, admin } from '../../middleware/authMiddleware';
import { Booking } from '../../models/Booking';

const router = express.Router();

router.get('/provider/:providerId', protect, getBookingsByProvider);

router.get('/debug-dispatch', debugDispatch);

router.route('/')
  .post(protect, createBooking)
  .get(protect, admin, getAllBookings);

router.get('/my', protect, getMyBookings);
router.get('/user/:userId', protect, admin, getBookingsByUserId);

router.put('/:id/status', protect, updateBookingStatus);
router.put('/:id/cancel', protect, cancelBooking);
router.post('/:id/verify', protect, verifyBookingOtp);

export default router;
