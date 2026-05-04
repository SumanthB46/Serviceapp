import { Request, Response } from 'express';
import { ProviderService } from '../../models/ProviderService';
import { AuthRequest } from '../../middleware/authMiddleware';

// @desc    Add service to provider profile
// @route   POST /api/provider-services
// @access  Private/Provider
export const addProviderService = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { provider_id, service_id, price } = req.body;

    // Check if current user is the provider (unless admin)
    // Assuming provider_id is the ID from Provider model, not User model.
    // Provider model usually has a user_id field.
    
    const providerService = await ProviderService.create({
      provider_id,
      service_id,
      price
    });

    res.status(201).json(providerService);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get all provider services (Admin)
// @route   GET /api/provider-services
// @access  Private/Admin
export const getAllProviderServices = async (req: Request, res: Response): Promise<void> => {
  try {
    const services = await ProviderService.find({ isDeleted: false })
      .populate({
        path: 'provider_id',
        populate: { path: 'user_id', select: 'name email' }
      })
      .populate('service_id');
    res.json(services);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get services of a provider
// @route   GET /api/provider-services/:providerId
// @access  Public
export const getProviderServices = async (req: Request, res: Response): Promise<void> => {
  try {
    const services = await ProviderService.find({ provider_id: req.params.providerId })
      .populate('service_id');
    res.json(services);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update provider service price
// @route   PUT /api/provider-services/:id
// @access  Private/Provider
export const updateProviderService = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { price } = req.body;
    const providerService = await ProviderService.findById(req.params.id);

    if (!providerService) {
      res.status(404).json({ message: 'Provider service not found' });
      return;
    }

    providerService.price = price ?? providerService.price;
    await providerService.save();

    res.json(providerService);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Remove service from provider profile
// @route   DELETE /api/provider-services/:id
// @access  Private/Provider
export const deleteProviderService = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const providerService = await ProviderService.findById(req.params.id);

    if (!providerService) {
      res.status(404).json({ message: 'Provider service not found' });
      return;
    }

    await providerService.deleteOne();
    res.json({ message: 'Service removed from provider' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

