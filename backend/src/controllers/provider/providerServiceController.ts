import { Request, Response } from 'express';
import { ProviderService } from '../../models/ProviderService';
import { AuthRequest } from '../../middleware/authMiddleware';

// @desc    Add service to provider profile
// @route   POST /api/provider-services
// @access  Private/Provider
export const addProviderService = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    // Check if current user is the provider (unless admin)
    // Assuming provider_id is the ID from Provider model, not User model.
    const { 
      provider_id, experience, price, 
      discount, final_price,
      location_ids, subservice_ids, documents, availability 
    } = req.body;

    
    const providerService = await ProviderService.create({
      provider_id,
      experience: experience || 0,
      price: price || 0,
      discount: discount || 0,
      final_price: final_price || price || 0,
      location_ids: location_ids || [],
      subservice_ids: subservice_ids || [],
      documents: documents || [],
      availability: availability || [],
      is_featured: req.body.is_featured || false,
      is_available: req.body.is_available ?? true
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
      });
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
    const services = await ProviderService.find({ provider_id: req.params.providerId });
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
    const { 
      price, discount, final_price, 
      subservice_ids, availability, is_active 
    } = req.body;
    
    const providerService = await ProviderService.findById(req.params.id);

    if (!providerService) {
      res.status(404).json({ message: 'Provider service not found' });
      return;
    }

    providerService.price             = price             ?? providerService.price;
    providerService.discount          = discount          ?? providerService.discount;
    providerService.final_price       = final_price       ?? providerService.final_price;
    providerService.subservice_ids    = subservice_ids    ?? providerService.subservice_ids;
    providerService.availability      = availability      ?? providerService.availability;
    providerService.is_featured       = req.body.is_featured ?? providerService.is_featured;
    providerService.is_available      = req.body.is_available ?? providerService.is_available;
    providerService.is_active         = is_active         ?? providerService.is_active;


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

