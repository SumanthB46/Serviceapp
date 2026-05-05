import { Request, Response } from 'express';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { Provider } from '../../models/Provider';
import { ProviderService } from '../../models/ProviderService';
import { User } from '../../models/User';

// @desc    Get all providers
// @route   GET /api/providers
// @access  Private/Admin
export const getProviders = async (req: Request, res: Response): Promise<void> => {
  try {
    const providers = await Provider.find({ isDeleted: false })
      .populate('user_id', 'name email phone profile_image status')
      .sort({ createdAt: -1 });

    // For each provider, fetch their associated services
    const providersWithServices = await Promise.all(
      providers.map(async (provider) => {
        const services = await ProviderService.find({ 
          provider_id: provider._id, 
          isDeleted: false 
        });
        return {
          ...provider.toObject(),
          services
        };
      })
    );

    res.json(providersWithServices);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single provider by ID
// @route   GET /api/providers/:id
// @access  Private/Admin
export const getProviderById = async (req: Request, res: Response): Promise<void> => {
  try {
    const provider = await Provider.findById(req.params.id)
      .populate('user_id', 'name email phone profile_image status');
    if (!provider) {
      res.status(404).json({ message: 'Provider not found' });
      return;
    }
    res.json(provider);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a provider profile
// @route   POST /api/providers
// @access  Private/Admin
export const createProvider = async (req: Request, res: Response): Promise<void> => {
  try {
    const { 
      name, email, phone, password, 
      profile_image, experience, services, documents, availability_status, location 
    } = req.body;

    let user_id = req.body.user_id;

    // 1. If no user_id, create a new User (expert invitation flow)
    if (!user_id && email && password) {
      const userExists = await User.findOne({ email });
      if (userExists) {
        res.status(400).json({ message: 'User with this email already exists' });
        return;
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const newUser = await User.create({
        name,
        email,
        phone,
        password: hashedPassword,
        role: 'provider',
        profile_image: profile_image || '',
      });
      user_id = newUser._id;
    }

    if (!user_id) {
      res.status(400).json({ message: 'User ID or account credentials required' });
      return;
    }

    const alreadyExists = await Provider.findOne({ user_id });
    if (alreadyExists) {
      res.status(400).json({ message: 'Provider profile already exists for this user' });
      return;
    }

    // 2. Create the main Provider profile
    const provider = await Provider.create({
      user_id,
      availability_status: availability_status || 'offline',
      location: location || 'Unassigned',
      overall_rating: 0,
      is_verified: false
    });

    // 3. Create individual ProviderService entries
    if (Array.isArray(services)) {
      await Promise.all(
        services.map(async (serviceName, index) => {
          const placeholderServiceId = new mongoose.Types.ObjectId(); 
          
          return ProviderService.create({
            provider_id: provider._id,
            service_id: placeholderServiceId,
            service_name: serviceName,
            experience: index === 0 ? (experience || 0) : 0,
            price: 0,
            skills: [],
            documents: [
              { doc_type: 'ID Proof', file_url: documents?.id_proof || '', uploaded_at: new Date() },
              { doc_type: 'Experience Certificate', file_url: documents?.certificates?.[index] || '', uploaded_at: new Date() }
            ],
            service_rating: 0,
            is_active: true
          });
        })
      );
    }

    const populated = await provider.populate('user_id', 'name email phone profile_image status');
    const finalProvider = {
      ...populated.toObject(),
      services: await ProviderService.find({ provider_id: provider._id, isDeleted: false })
    };

    res.status(201).json(finalProvider);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a provider profile
// @route   PUT /api/providers/:id
// @access  Private/Admin
export const updateProvider = async (req: Request, res: Response): Promise<void> => {
  try {
    const provider = await Provider.findById(req.params.id);
    if (!provider) {
      res.status(404).json({ message: 'Provider not found' });
      return;
    }

    const { availability_status, location, is_verified, overall_rating, status } = req.body;

    provider.availability_status = availability_status ?? provider.availability_status;
    provider.location            = location            ?? provider.location;
    provider.is_verified         = is_verified         ?? provider.is_verified;
    provider.overall_rating      = overall_rating      ?? provider.overall_rating;
    provider.status              = status              ?? provider.status;

    const updated = await provider.save();
    const populated = await updated.populate('user_id', 'name email phone profile_image status');
    
    // Aggregate services for return
    const services = await ProviderService.find({ provider_id: provider._id, isDeleted: false });
    res.json({ ...populated.toObject(), services });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a provider profile
// @route   DELETE /api/providers/:id
// @access  Private/Admin
export const deleteProvider = async (req: Request, res: Response): Promise<void> => {
  try {
    const provider = await Provider.findById(req.params.id);
    if (!provider) {
      res.status(404).json({ message: 'Provider not found' });
      return;
    }
    
    // Soft delete the main provider
    provider.isDeleted = true;
    provider.availability_status = 'offline';
    await provider.save();

    // Soft delete all associated services
    await ProviderService.updateMany(
      { provider_id: provider._id },
      { isDeleted: true, is_active: false }
    );
    
    res.json({ message: 'Provider profile and associated services removed (soft delete) successfully' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Legacy addProviderDocument removed. Documents are now managed per ProviderService record.

