import { Request, Response } from 'express';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { Provider } from '../../models/Provider';
import { ProviderService } from '../../models/ProviderService';
import { User } from '../../models/User';
import { AuthRequest } from '../../middleware/authMiddleware';

// @desc    Get all providers
// @route   GET /api/providers
// @access  Private/Admin
export const getProviders = async (req: Request, res: Response): Promise<void> => {
  try {
    const providers = await Provider.find({ isDeleted: false })
      .populate('user_id', 'name email phone profile_image status')
      .populate('location_id', 'name state country')
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
      profile_image, experience, services, documents, availability_status, location_id, years_of_experience 
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
      location_id: location_id || null,
      years_of_experience: years_of_experience || experience || 0,
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

    const populated = await provider.populate([
      { path: 'user_id', select: 'name email phone profile_image status' },
      { path: 'location_id', select: 'name state country' }
    ]);

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

    const { 
      availability_status, location_id, is_verified, overall_rating, status, kyc_status,
      aadhar_id, bank_details, verification_docs, rejection_reason,
      total_jobs, completed_jobs, cancelled_jobs, acceptance_rate, completion_rate,
      years_of_experience, bio, languages, profile_image, rating_breakdown,
      last_active_at, current_location, portfolio, cancellation_count, penalty_amount
    } = req.body;

    provider.availability_status = availability_status ?? provider.availability_status;
    provider.location_id         = location_id         ?? provider.location_id;
    provider.is_verified         = is_verified         ?? provider.is_verified;
    provider.overall_rating      = overall_rating      ?? provider.overall_rating;
    provider.kyc_status          = kyc_status          ?? provider.kyc_status;
    provider.aadhar_id           = aadhar_id           ?? provider.aadhar_id;
    provider.bank_details        = bank_details        ?? provider.bank_details;
    provider.verification_docs   = verification_docs   ?? provider.verification_docs;
    provider.rejection_reason    = rejection_reason    ?? provider.rejection_reason;
    
    // Metrics & Performance
    provider.total_jobs          = total_jobs          ?? provider.total_jobs;
    provider.completed_jobs      = completed_jobs      ?? provider.completed_jobs;
    provider.cancelled_jobs      = cancelled_jobs      ?? provider.cancelled_jobs;
    provider.acceptance_rate     = acceptance_rate     ?? provider.acceptance_rate;
    provider.completion_rate     = completion_rate     ?? provider.completion_rate;
    provider.cancellation_count  = cancellation_count  ?? provider.cancellation_count;
    provider.penalty_amount      = penalty_amount      ?? provider.penalty_amount;
    
    // Profile Details
    provider.years_of_experience = years_of_experience ?? provider.years_of_experience;
    provider.bio                 = bio                 ?? provider.bio;
    provider.languages           = languages           ?? provider.languages;
    provider.profile_image       = profile_image       ?? provider.profile_image;
    provider.rating_breakdown    = rating_breakdown    ?? provider.rating_breakdown;
    provider.last_active_at      = last_active_at      ?? provider.last_active_at;
    provider.current_location    = current_location    ?? provider.current_location;
    provider.portfolio           = portfolio           ?? provider.portfolio;


    const updated = await provider.save();
    const populated = await updated.populate([
      { path: 'user_id', select: 'name email phone profile_image status' },
      { path: 'location_id', select: 'name state country' }
    ]);

    
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

// @desc    Get current logged-in provider profile
// @route   GET /api/providers/me
// @access  Private
export const getMyProviderProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const provider = await Provider.findOne({ user_id: req.user?._id })
      .populate('user_id', 'name email phone profile_image status')
      .populate('location_id', 'name state country');

    
    if (!provider) {
      res.status(404).json({ message: 'Provider profile not found' });
      return;
    }

    const services = await ProviderService.find({ 
      provider_id: provider._id, 
      isDeleted: false 
    });

    res.json({
      ...provider.toObject(),
      services
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
// @desc    Update current logged-in provider profile
// @route   PUT /api/providers/me
// @access  Private
export const updateMyProviderProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const provider = await Provider.findOne({ user_id: req.user?._id });
    
    if (!provider) {
      res.status(404).json({ message: 'Provider profile not found' });
      return;
    }

    const { 
      availability_status, location_id, aadhar_id, bank_details, verification_docs,
      bio, languages, profile_image, portfolio, last_active_at, current_location
    } = req.body;

    provider.availability_status = availability_status ?? provider.availability_status;
    provider.location_id         = location_id         ?? provider.location_id;
    provider.aadhar_id           = aadhar_id           ?? provider.aadhar_id;
    provider.bank_details        = bank_details        ?? provider.bank_details;
    provider.verification_docs   = verification_docs   ?? provider.verification_docs;
    provider.bio                 = bio                 ?? provider.bio;
    provider.languages           = languages           ?? provider.languages;
    provider.profile_image       = profile_image       ?? provider.profile_image;
    provider.portfolio           = portfolio           ?? provider.portfolio;
    provider.last_active_at      = last_active_at      ?? provider.last_active_at;
    provider.current_location    = current_location    ?? provider.current_location;



    const updated = await provider.save();
    res.json(updated);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
