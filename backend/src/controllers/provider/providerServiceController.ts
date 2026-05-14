import { Request, Response } from 'express';
import { ProviderService } from '../../models/ProviderService';
import { AuthRequest } from '../../middleware/authMiddleware';
import mongoose from 'mongoose';
import { saveFileToCloud } from '../../utils/fileHelper';

// @desc    Add service to provider profile
// @route   POST /api/provider-services
// @access  Private/Provider
export const addProviderService = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const {
      provider_id,
      experience,
      price,
      discount,
      final_price,
      location_ids,
      subservice_ids,
      documents,
      is_featured,
      is_available
    } = req.body;

    if (experience === undefined || experience === null) {
      res.status(400).json({ message: 'Experience is required.' });
      return;
    }

    if (!price) {
      res.status(400).json({ message: 'Price is required.' });
      return;
    }

    // Process documents to Cloudinary
    const processedDocs = [];
    if (Array.isArray(documents)) {
      for (const doc of documents) {
        if (doc.file_url && doc.file_url.startsWith('data:')) {
          const cloudRes = await saveFileToCloud(doc.file_url, 'services/docs');
          if (typeof cloudRes === 'object') {
            processedDocs.push({ 
              ...doc, 
              file_url: cloudRes.secure_url,
              public_id: cloudRes.public_id,
              resource_type: cloudRes.resource_type
            });
          } else {
            processedDocs.push({ ...doc, file_url: cloudRes });
          }
        } else {
          processedDocs.push(doc);
        }
      }
    }

    const providerService = await ProviderService.create({
      provider_id: new mongoose.Types.ObjectId(provider_id as string),
      experience,
      price,
      discount: discount || 0,
      final_price: final_price || price,
      location_ids: location_ids || [],
      subservice_ids: subservice_ids || [],
      documents: processedDocs,
      is_featured: is_featured || false,
      is_available: is_available ?? true,
      is_active: true,
      isDeleted: false
    });

    res.status(201).json(providerService);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get all provider services (Admin)
// @route   GET /api/provider-services
// @access  Private/Admin
export const getAllProviderServices = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const services = await ProviderService.find({
      isDeleted: false,
    }).populate({
      path: 'provider_id',
      populate: {
        path: 'user_id',
        select: 'name email',
      },
    });

    res.json(services);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get services of a provider
// @route   GET /api/provider-services/:providerId
// @access  Public
export const getProviderServices = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const services = await ProviderService.find({ 
      provider_id: req.params.providerId,
      isDeleted: false 
    }).populate('subservice_ids');
    
    res.json(services);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update provider service
// @route   PUT /api/provider-services/:id
// @access  Private/Provider
export const updateProviderService = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { 
      price, 
      discount, 
      final_price, 
      subservice_ids, 
      is_active,
      is_available,
      is_featured 
    } = req.body;

    const providerService = await ProviderService.findById(req.params.id);

    if (!providerService) {
      res.status(404).json({
        message: 'Provider service not found',
      });
      return;
    }

    if (price !== undefined) providerService.price = price;
    if (discount !== undefined) providerService.discount = discount;
    if (final_price !== undefined) providerService.final_price = final_price;
    if (subservice_ids !== undefined) providerService.subservice_ids = subservice_ids;
    if (is_featured !== undefined) providerService.is_featured = is_featured;
    if (is_available !== undefined) providerService.is_available = is_available;
    if (is_active !== undefined) providerService.is_active = is_active;

    await providerService.save();

    res.json(providerService);
  } catch (error: any) {
    res.status(400).json({
      message: error.message,
    });
  }
};

// @desc    Remove service from provider profile
// @route   DELETE /api/provider-services/:id
// @access  Private/Provider
export const deleteProviderService = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const providerService =
      await ProviderService.findById(req.params.id);

    if (!providerService) {
      res.status(404).json({
        message: 'Provider service not found',
      });
      return;
    }

    providerService.isDeleted = true;
    providerService.is_active = false;
    await providerService.save();
    
    res.json({ message: 'Service removed from provider' });
  } catch (error: any) {
    res.status(500).json({
      message: error.message,
    });
  }
};
