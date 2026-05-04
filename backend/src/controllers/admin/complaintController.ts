import { Request, Response } from 'express';
import { Complaint } from '../../models/Complaint';
import { AuthRequest } from '../../middleware/authMiddleware';

// @desc    Get all complaints
// @route   GET /api/complaints
// @access  Private/Admin
export const getComplaints = async (req: Request, res: Response): Promise<void> => {
  try {
    const complaints = await Complaint.find()
      .populate('user_id', 'name email')
      .sort({ createdAt: -1 });
    res.json(complaints);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get complaints by user ID
// @route   GET /api/complaints/user/:userId
// @access  Private/Admin
export const getComplaintsByUserId = async (req: Request, res: Response): Promise<void> => {
  try {
    const complaints = await Complaint.find({ user_id: req.params.userId })
      .populate('service_id', 'service_name')
      .populate('booking_id')
      .sort({ createdAt: -1 });
    res.json(complaints);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Submit a complaint
// @route   POST /api/complaints
// @access  Private
export const submitComplaint = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { service_id, booking_id, complaint } = req.body;
    const newComplaint = await Complaint.create({
      user_id: req.user?._id,
      service_id,
      booking_id,
      complaint
    });
    res.status(201).json(newComplaint);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update complaint status
// @route   PUT /api/complaints/:id
// @access  Private/Admin
export const updateComplaintStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { status } = req.body;
    const complaint = await Complaint.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!complaint) {
      res.status(404).json({ message: 'Complaint not found' });
      return;
    }
    res.json(complaint);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

