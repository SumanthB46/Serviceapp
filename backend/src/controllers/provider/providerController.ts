import { Request, Response } from 'express';
import { AuthRequest } from '../../middleware/authMiddleware';
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
        }).populate('subservice_ids', 'subservice_name');
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
      profile_image, availability_status, 
      aadhar_id, bank_details, verification_docs,
      services // Array of ProviderService objects
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

    // 2. Security: Hash sensitive data and store last 4 digits
    let secureAadhar = {};
    if (aadhar_id) {
      const salt = await bcrypt.genSalt(10);
      secureAadhar = {
        aadhar_last4: aadhar_id.slice(-4),
        aadhar_hash: await bcrypt.hash(aadhar_id, salt)
      };
    }

    let secureBank = { ...bank_details };
    if (bank_details?.account_number) {
      const salt = await bcrypt.genSalt(10);
      secureBank.account_number_last4 = bank_details.account_number.slice(-4);
      secureBank.account_number_hash = await bcrypt.hash(bank_details.account_number, salt);
      delete secureBank.account_number;
    }

    const provider = await Provider.create({
      user_id,
      availability_status: availability_status || 'offline',
      is_verified: false,
      ...secureAadhar,
      bank_details: secureBank,
      verification_docs
    });

    // 3. Create individual ProviderService entries if provided
    if (Array.isArray(services)) {
      await Promise.all(
        services.map(async (serviceData) => {
          return ProviderService.create({
            provider_id: provider._id,
            ...serviceData
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

    const { availability_status, is_verified, status, aadhar_id, bank_details, verification_docs } = req.body;

    provider.availability_status = availability_status ?? provider.availability_status;
    provider.is_verified         = is_verified         ?? provider.is_verified;
    provider.kyc_status          = status              ?? provider.kyc_status;
    
    if (aadhar_id !== undefined) {
      const salt = await bcrypt.genSalt(10);
      provider.aadhar_last4 = aadhar_id.slice(-4);
      provider.aadhar_hash = await bcrypt.hash(aadhar_id, salt);
    }
    
    if (bank_details !== undefined) {
      const secureBank = { ...bank_details };
      if (bank_details.account_number) {
        const salt = await bcrypt.genSalt(10);
        secureBank.account_number_last4 = bank_details.account_number.slice(-4);
        secureBank.account_number_hash = await bcrypt.hash(bank_details.account_number, salt);
        delete (secureBank as any).account_number;
      }
      provider.bank_details = secureBank as any;
    }
    
    if (verification_docs !== undefined) provider.verification_docs = verification_docs;

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

// @desc    Get current provider profile
// @route   GET /api/providers/me
// @access  Private/Provider
export const getMyProviderProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const provider = await Provider.findOne({ user_id: req.user?._id })
      .populate('user_id', 'name email phone profile_image status');
    
    if (!provider) {
      res.status(404).json({ message: 'Provider profile not found' });
      return;
    }

    const services = await ProviderService.find({ 
      provider_id: provider._id, 
      isDeleted: false 
    }).populate('subservice_ids', 'subservice_name');

    res.json({
      ...provider.toObject(),
      services
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update current provider profile
// @route   PUT /api/providers/me
// @access  Private/Provider
export const updateMyProviderProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const provider = await Provider.findOne({ user_id: req.user?._id });
    
    if (!provider) {
      res.status(404).json({ message: 'Provider profile not found' });
      return;
    }

    const { availability_status, aadhar_id, bank_details, verification_docs } = req.body;

    provider.availability_status = availability_status ?? provider.availability_status;
    if (aadhar_id !== undefined) {
      const salt = await bcrypt.genSalt(10);
      provider.aadhar_last4 = aadhar_id.slice(-4);
      provider.aadhar_hash = await bcrypt.hash(aadhar_id, salt);
    }
    
    if (bank_details !== undefined) {
      const secureBank = { ...bank_details };
      if (bank_details.account_number) {
        const salt = await bcrypt.genSalt(10);
        secureBank.account_number_last4 = bank_details.account_number.slice(-4);
        secureBank.account_number_hash = await bcrypt.hash(bank_details.account_number, salt);
        delete (secureBank as any).account_number;
      }
      provider.bank_details = secureBank as any;
    }
    
    if (verification_docs !== undefined) provider.verification_docs = verification_docs;

    const updated = await provider.save();
    const populated = await updated.populate('user_id', 'name email phone profile_image status');
    
    const services = await ProviderService.find({ provider_id: provider._id, isDeleted: false });
    res.json({ ...populated.toObject(), services });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
