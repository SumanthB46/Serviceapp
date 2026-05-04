import express from 'express';
import { getNotifications, markAsRead, deleteNotification, createNotification } from '../../controllers/user/notificationController';
import { protect, admin } from '../../middleware/authMiddleware';

const router = express.Router();

router.route('/')
  .get(protect, getNotifications)
  .post(protect, admin, createNotification);

router.put('/:id/read', protect, markAsRead);
router.delete('/:id', protect, deleteNotification);

export default router;



