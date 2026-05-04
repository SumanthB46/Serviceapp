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
      provider_id, service_id, service_name, experience, price, 
      discount, final_price, currency, service_radius_km,
      location_ids, skills, documents, availability 
    } = req.body;

    
    const providerService = await ProviderService.create({
      provider_id,
      service_id,
      service_name,
      experience: experience || 0,
      price: price || 0,
      min_price: req.body.min_price || 0,
      max_price: req.body.max_price || 0,
      discount: discount || 0,
      final_price: final_price || price || 0,
      currency: currency || 'INR',
      service_radius_km: service_radius_km || 10,
      location_ids: location_ids || [],
      skills: skills || [],
      documents: documents || [],
      availability: availability || [],
      weekly_off: req.body.weekly_off || [],
      blocked_dates: req.body.blocked_dates || [],
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
    const { 
      price, discount, final_price, currency, service_radius_km, 
      skills, availability, is_active 
    } = req.body;
    
    const providerService = await ProviderService.findById(req.params.id);

    if (!providerService) {
      res.status(404).json({ message: 'Provider service not found' });
      return;
    }

    providerService.price             = price             ?? providerService.price;
    providerService.min_price         = req.body.min_price ?? providerService.min_price;
    providerService.max_price         = req.body.max_price ?? providerService.max_price;
    providerService.discount          = discount          ?? providerService.discount;
    providerService.final_price       = final_price       ?? providerService.final_price;
    providerService.currency          = currency          ?? providerService.currency;
    providerService.service_radius_km = service_radius_km ?? providerService.service_radius_km;
    providerService.skills            = skills            ?? providerService.skills;
    providerService.availability      = availability      ?? providerService.availability;
    providerService.weekly_off        = req.body.weekly_off ?? providerService.weekly_off;
    providerService.blocked_dates     = req.body.blocked_dates ?? providerService.blocked_dates;
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
