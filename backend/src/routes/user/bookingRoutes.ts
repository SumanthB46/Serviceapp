import express from 'express';
import { 
  createBooking, 
  updateBookingStatus, 
  getAllBookings, 
  getMyBookings, 
  verifyBookingOtp 
} from '../../controllers/user/bookingController';
import { protect, admin } from '../../middleware/authMiddleware';

const router = express.Router();

router.route('/')
  .post(protect, createBooking)
  .get(protect, admin, getAllBookings);

router.get('/my', protect, getMyBookings);

router.put('/:id/status', protect, updateBookingStatus);
router.post('/:id/verify', protect, verifyBookingOtp);

export default router;
