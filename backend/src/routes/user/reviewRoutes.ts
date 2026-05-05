import express from 'express';
import { getProviderReviews, createReview, deleteReview } from '../../controllers/user/reviewController';
import { protect } from '../../middleware/authMiddleware';

const router = express.Router();

router.get('/provider/:providerId', getProviderReviews);
router.post('/', protect, createReview);
router.delete('/:id', protect, deleteReview);

export default router;



