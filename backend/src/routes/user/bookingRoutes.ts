import express from 'express';
import { getBookings, getBookingById, createBooking, updateBookingStatus, getBookingsByUserId } from '../../controllers/user/bookingController';
import { protect, admin } from '../../middleware/authMiddleware';

const router = express.Router();

router.route('/')
  .get(protect, getBookings)
  .post(protect, createBooking);

router.get('/user/:userId', getBookingsByUserId);

router.route('/:id')
  .get(protect, getBookingById)
  .put(protect, updateBookingStatus);

export default router;



