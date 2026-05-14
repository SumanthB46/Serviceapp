import { Request, Response } from 'express';
import { Membership } from '../../models/Membership';
import { UserMembership } from '../../models/UserMembership';

export const createMembership = async (req: Request, res: Response) => {
  try {
    const membership = new Membership(req.body);
    await membership.save();
    res.status(201).json({ message: 'Membership created successfully', membership });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllMemberships = async (req: Request, res: Response) => {
  try {
    const memberships = await Membership.find().sort({ createdAt: -1 });
    res.status(200).json(memberships);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateMembership = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const membership = await Membership.findByIdAndUpdate(id, req.body, { new: true });
    if (!membership) return res.status(404).json({ message: 'Membership not found' });
    res.status(200).json({ message: 'Membership updated successfully', membership });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteMembership = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const membership = await Membership.findByIdAndDelete(id);
    if (!membership) return res.status(404).json({ message: 'Membership not found' });
    res.status(200).json({ message: 'Membership deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getMembershipUsers = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const users = await UserMembership.find({ membership_id: id })
      .populate('user_id', 'name email phone profile_image')
      .populate('membership_id', 'name')
      .sort({ purchase_date: -1 });
    res.status(200).json(users);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getMembershipStats = async (req: Request, res: Response) => {
  try {
    const totalPlans = await Membership.countDocuments();
    const activeMembers = await UserMembership.countDocuments({ membership_status: 'active' });
    
    // Calculate Monthly Revenue (Example logic: sum of prices of paid memberships in last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const paidMemberships = await UserMembership.find({ 
      payment_status: 'paid',
      purchase_date: { $gte: thirtyDaysAgo }
    }).populate('membership_id', 'price');
    
    const monthlyRevenue = paidMemberships.reduce((sum, item: any) => sum + (item.membership_id?.price || 0), 0);
    const premiumUsers = activeMembers; // Or specific logic for premium

    res.status(200).json({
      totalPlans,
      activeMembers,
      monthlyRevenue,
      premiumUsers
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
