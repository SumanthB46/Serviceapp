import { Request, Response } from 'express';
import { Review } from '../models/Review';
import { AuthRequest } from '../middleware/authMiddleware';

// @desc    Get reviews for a provider
// @route   GET /api/reviews/provider/:providerId
// @access  Public
export const getProviderReviews = async (req: Request, res: Response): Promise<void> => {
  try {
    const reviews = await Review.find({ provider_id: req.params.providerId })
      .populate('user_id', 'name profile_image')
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a review
// @route   POST /api/reviews
// @access  Private
export const createReview = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { booking_id, provider_id, rating, comment } = req.body;

    // Check if review already exists for this booking
    const exists = await Review.findOne({ booking_id });
    if (exists) {
      res.status(400).json({ message: 'You have already reviewed this booking' });
      return;
    }

    const review = await Review.create({
      booking_id,
      user_id: req.user?._id,
      provider_id,
      rating,
      comment
    });

    res.status(201).json(review);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a review
// @route   DELETE /api/reviews/:id
// @access  Private/Admin
export const deleteReview = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      res.status(404).json({ message: 'Review not found' });
      return;
    }

    // Only user who wrote it or admin can delete
    if (review.user_id.toString() !== req.user?._id.toString() && req.user?.role !== 'admin') {
      res.status(403).json({ message: 'Not authorized' });
      return;
    }

    await review.deleteOne();
    res.json({ message: 'Review deleted' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
