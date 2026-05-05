import { Request, Response } from 'express';
import { Notification } from '../../models/Notification';
import { AuthRequest } from '../../middleware/authMiddleware';

// @desc    Get user notifications
// @route   GET /api/notifications
// @access  Private
export const getNotifications = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const notifications = await Notification.find({ recipient_id: req.user?._id }).sort({ createdAt: -1 });

    res.json(notifications);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Mark notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
export const markAsRead = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const notification = await Notification.findOne({ _id: req.params.id, recipient_id: req.user?._id });

    if (!notification) {
      res.status(404).json({ message: 'Notification not found' });
      return;
    }

    notification.is_read = true;
    await notification.save();
    res.json(notification);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete notification
// @route   DELETE /api/notifications/:id
// @access  Private
export const deleteNotification = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const notification = await Notification.findOne({ _id: req.params.id, recipient_id: req.user?._id });

    if (!notification) {
      res.status(404).json({ message: 'Notification not found' });
      return;
    }

    await notification.deleteOne();
    res.json({ message: 'Notification removed' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create notification (Internal/Admin)
// @route   POST /api/notifications
// @access  Private/Admin
export const createNotification = async (req: Request, res: Response): Promise<void> => {
  try {
    const { recipient_id, recipient_type, title, message, type, metadata } = req.body;
    const notification = await Notification.create({ 
      recipient_id, 
      recipient_type: recipient_type || 'User', 
      title, 
      message,
      type: type || 'system_alert',
      metadata
    });

    res.status(201).json(notification);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

