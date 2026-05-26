import { Request, Response } from 'express';
import { AuthRequest } from '../../middleware/authMiddleware';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { Provider } from '../../models/Provider';
import { ProviderService } from '../../models/ProviderService';
import { User } from '../../models/User';
import { JobRequest } from '../../models/JobRequest';
import { Booking } from '../../models/Booking';
import { saveFileToCloud, deleteFileFromCloud } from '../../utils/fileHelper';
import { emitToUser } from '../../services/socketService';
import { VerificationAction } from '../../models/VerificationAction';
import { sendEmail } from '../../utils/email';

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

    const idProofRes = verification_docs?.id_proof_url ? await saveFileToCloud(verification_docs.id_proof_url, 'verification/pending') : '';

    const provider = await Provider.create({
      user_id,
      availability_status: availability_status || 'offline',
      is_verified: false,
      ...secureAadhar,
      bank_details: secureBank,
      verification_docs: typeof idProofRes === 'object' ? {
        id_proof_url: idProofRes.secure_url,
        public_id: idProofRes.public_id,
        resource_type: idProofRes.resource_type,
      } : {
        id_proof_url: idProofRes,
      }
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

    const { 
      availability_status, 
      is_verified, 
      status, 
      aadhar_id, 
      bank_details, 
      verification_docs,
      kyc_rejection_reason 
    } = req.body;

    provider.availability_status = availability_status ?? provider.availability_status;
    provider.is_verified         = is_verified         ?? provider.is_verified;
    provider.kyc_status          = status              ?? provider.kyc_status;
    
    // Handle Verification Logic
    if (status === 'verified') {
      provider.is_verified = true;
      provider.verified_at = new Date();
      // Set expiry for 30 days from now for auto-cleanup
      const expiryDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
      provider.verification_docs_expiry = expiryDate;
      provider.kyc_rejection_reason = undefined; // Clear any previous rejection
      
      // Also set expiry for all associated services
      await ProviderService.updateMany(
        { provider_id: provider._id },
        { documents_expiry: expiryDate }
      );
    }

    if (status === 'rejected') {
      provider.is_verified = false;
      provider.kyc_rejection_reason = kyc_rejection_reason || 'Documents did not meet our verification standards.';
    }
    
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
    
    if (verification_docs !== undefined) {
      // Delete old files if they exist to prevent storage leaks
      if (provider.verification_docs?.public_id) {
        await deleteFileFromCloud(provider.verification_docs.public_id, provider.verification_docs.resource_type);
      } else if (provider.verification_docs?.id_proof_url) {
        // Fallback for migration
        await deleteFileFromCloud(provider.verification_docs.id_proof_url);
      }

      const idProofRes = verification_docs?.id_proof_url ? await saveFileToCloud(verification_docs.id_proof_url, 'verification/pending') : '';

      provider.verification_docs = typeof idProofRes === 'object' ? {
        id_proof_url: idProofRes.secure_url,
        public_id: idProofRes.public_id,
        resource_type: idProofRes.resource_type,
      } : {
        id_proof_url: idProofRes,
      };
      
      // If admin manually updates docs, reset kyc status to pending for re-review
      if (status !== 'verified') {
        provider.kyc_status = 'pending';
        provider.is_verified = false;
      }
    }

    const updated = await provider.save();
    const populated = await updated.populate('user_id', 'name email phone profile_image status');
    
    // Aggregate services for return
    const services = await ProviderService.find({ provider_id: provider._id, isDeleted: false });
    res.json({ ...populated.toObject(), services });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Process verification action (Approve/Reject/Request Docs)
// @route   POST /api/providers/:id/verification-action
// @access  Private/Admin
export const processVerificationAction = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const providerId = req.params.id;
    const { action_type, reasons, custom_message, requested_docs } = req.body;
    const adminId = req.user?._id;

    if (!adminId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const provider = await Provider.findById(providerId).populate('user_id', 'name email');
    if (!provider || !provider.user_id) {
      res.status(404).json({ message: 'Provider not found' });
      return;
    }

    const providerUser = provider.user_id as any;

    // 1. Log the action
    await VerificationAction.create({
      provider_id: provider._id,
      action_type,
      reasons: reasons || [],
      custom_message,
      requested_docs: requested_docs || [],
      admin_id: adminId,
    });

    // 2. Update Provider Status
    if (action_type === 'rejected') {
      provider.kyc_status = 'rejected';
      provider.is_verified = false;
      provider.kyc_rejection_reason = custom_message || reasons?.join(', ');
    } else if (action_type === 'requested_docs') {
      provider.kyc_status = 'pending';
      // Store the requested docs in the rejection reason or a new field for the provider to see
      provider.kyc_rejection_reason = `Requested Documents: ${requested_docs?.join(', ')}. Note: ${custom_message || ''}`;
    } else if (action_type === 'approved') {
      provider.kyc_status = 'verified';
      provider.is_verified = true;
      provider.verified_at = new Date();
      provider.verification_docs_expiry = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
      provider.kyc_rejection_reason = undefined;
    }
    
    await provider.save();

    // 3. Send Email
    let emailSubject = '';
    let emailMessage = '';

    if (action_type === 'rejected') {
      emailSubject = 'Verification Request Rejected';
      emailMessage = `Hi ${providerUser.name},\n\nWe reviewed your partner verification request.\n\nUnfortunately, your verification could not be approved for the following reasons:\n`;
      if (reasons && reasons.length > 0) {
        reasons.forEach((r: string) => { emailMessage += `• ${r}\n`; });
      }
      if (custom_message) {
        emailMessage += `\nAdditional comments from admin:\n"${custom_message}"\n`;
      }
      emailMessage += `\nPlease update your documents and resubmit verification.\n\nRegards,\nFixvo Verification Team`;
    } else if (action_type === 'requested_docs') {
      emailSubject = 'Additional Documents Required';
      emailMessage = `Hi ${providerUser.name},\n\nTo continue your partner verification process, please upload the following documents:\n`;
      if (requested_docs && requested_docs.length > 0) {
        requested_docs.forEach((doc: string) => { emailMessage += `• ${doc}\n`; });
      }
      if (custom_message) {
        emailMessage += `\nAdditional request from admin:\n"${custom_message}"\n`;
      }
      emailMessage += `\nYou can upload these documents from your profile verification page.\n\nRegards,\nFixvo Verification Team`;
    } else if (action_type === 'approved') {
      emailSubject = 'Fixvo Provider Verification Approved';
      emailMessage = `Hello ${providerUser.name},\n\nCongratulations!\n\nYour provider account has been successfully verified by the Fixvo Admin team.\n\nYou can now log in and start accepting service requests on the Fixvo platform.\n\nThank you for being part of Fixvo.\n\nRegards,\nFixvo Admin Team\nfixvoadmin@gmail.com`;
    }

    if (emailSubject && emailMessage) {
      await sendEmail({
        email: providerUser.email,
        subject: emailSubject,
        message: emailMessage
      });
    }

    res.json({ message: 'Action processed successfully', status: provider.kyc_status });
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
    let provider = await Provider.findOne({ user_id: req.user?._id })
      .populate('user_id', 'name email phone profile_image status');
    
    // Auto-create provider profile if missing but user has provider role
    if (!provider && req.user?.role === 'provider') {
      const newProvider = await Provider.create({
        user_id: req.user._id,
        availability_status: 'offline',
        kyc_status: 'pending',
        is_verified: false,
      });
      provider = await Provider.findById(newProvider._id).populate('user_id', 'name email phone profile_image status');
    }

    if (!provider) {
      res.status(404).json({ message: 'Provider profile not found' });
      return;
    }

    const services = await ProviderService.find({ 
      provider_id: provider._id, 
      isDeleted: false 
    }).populate('subservice_ids', 'subservice_name');

    const profileData = provider.toObject();
    let processedServices = services;

    // Urban Company Flow: Hide docs if not pending to reduce misuse
    if (provider.kyc_status !== 'pending') {
       if (profileData.verification_docs) {
          profileData.verification_docs.id_proof_url = '';
       }
       // Also hide service docs
       processedServices = services.map((service: any) => {
         const serviceObj = service.toObject ? service.toObject() : service;
         return {
           ...serviceObj,
           documents: serviceObj.documents?.map((doc: any) => ({ ...doc, file_url: '' })) || []
         };
       });
    }

    res.json({
      ...profileData,
      services: processedServices
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
    let provider = await Provider.findOne({ user_id: req.user?._id });
    
    // Auto-create provider profile if missing but user has provider role
    if (!provider && req.user?.role === 'provider') {
      provider = await Provider.create({
        user_id: req.user._id,
        availability_status: 'offline',
        kyc_status: 'pending',
        is_verified: false,
      });
    }

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
    
    if (verification_docs !== undefined) {
      // Only allow upload/replace if pending or rejected
      if (provider.kyc_status === 'verified') {
        res.status(403).json({ message: 'Verified documents cannot be modified. Contact support for updates.' });
        return;
      }

      // Delete old files to prevent storage leak
      if (provider.verification_docs?.public_id) {
        await deleteFileFromCloud(provider.verification_docs.public_id, provider.verification_docs.resource_type);
      } else if (provider.verification_docs?.id_proof_url) {
        // Fallback
        await deleteFileFromCloud(provider.verification_docs.id_proof_url);
      }

      const idProofRes = verification_docs?.id_proof_url ? await saveFileToCloud(verification_docs.id_proof_url, 'verification/pending') : '';

      provider.verification_docs = typeof idProofRes === 'object' ? {
        id_proof_url: idProofRes.secure_url,
        public_id: idProofRes.public_id,
        resource_type: idProofRes.resource_type,
      } : {
        id_proof_url: idProofRes,
      };
      
      // Reset status to pending when user re-uploads
      provider.kyc_status = 'pending';
      provider.is_verified = false;
    }

    const updated = await provider.save();
    const populated = await updated.populate('user_id', 'name email phone profile_image status');
    
    const services = await ProviderService.find({ provider_id: provider._id, isDeleted: false });
    res.json({ ...populated.toObject(), services });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    System task to cleanup expired KYC and Service documents
// @access  Internal/Admin
export const cleanupExpiredDocuments = async (): Promise<{ deletedCount: number }> => {
  try {
    let count = 0;

    // 1. Cleanup Provider KYC Docs
    const expiredProviders = await Provider.find({
      verification_docs_expiry: { $lte: new Date() },
      kyc_status: 'verified'
    });

    for (const provider of expiredProviders) {
      if (provider.verification_docs) {
        if (provider.verification_docs.public_id) {
          await deleteFileFromCloud(provider.verification_docs.public_id, provider.verification_docs.resource_type);
        } else if (provider.verification_docs.id_proof_url) {
          // Fallback
          await deleteFileFromCloud(provider.verification_docs.id_proof_url);
        }
        
        provider.verification_docs = {
          id_proof_url: ''
        };
        provider.verification_docs_expiry = undefined;
        await provider.save();
        count++;
      }
    }

    // 2. Cleanup ProviderService Docs (certificates/work samples)
    const expiredServices = await ProviderService.find({
      documents_expiry: { $lte: new Date() }
    });

    for (const service of expiredServices) {
      if (service.documents && service.documents.length > 0) {
        // Delete all physical files in the array
        for (const doc of service.documents) {
          if (doc.public_id) {
            await deleteFileFromCloud(doc.public_id, doc.resource_type);
          } else if (doc.file_url) {
            await deleteFileFromCloud(doc.file_url);
          }
        }
        
        service.documents = [];
        service.documents_expiry = undefined;
        await service.save();
        count++;
      }
    }

    console.log(`[STORAGE CLEANUP] Successfully removed documents from ${count} records (Providers & Services).`);
    return { deletedCount: count };
  } catch (error) {
    console.error('[STORAGE CLEANUP] Task failed:', error);
    return { deletedCount: 0 };
  }
};

// @desc    Get pending job requests for current provider
// @route   GET /api/providers/job-requests
// @access  Private/Provider
export const getMyJobRequests = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const provider = await Provider.findOne({ user_id: req.user?._id });
    if (!provider) {
      res.status(404).json({ message: 'Provider not found' });
      return;
    }

    const requests = await JobRequest.find({
      provider_id: provider._id,
      status: 'pending',
      expires_at: { $gt: new Date() }
    }).populate({
      path: 'booking_id',
      populate: [
        { path: 'user_id', select: 'name email phone profile_image' },
        { path: 'address_id' },
        { path: 'subservice_id', populate: { path: 'service_id' } }
      ]
    }).sort({ createdAt: -1 });

    const mappedRequests = requests.map(r => {
      const booking = r.booking_id as any;
      if (!booking) return null;

      const subservice = booking.subservice_id as any;
      const serviceName = subservice?.subservice_name || subservice?.service_id?.service_name || 'New Service Request';
      const address = booking.address_id as any;

      return {
        _id: r._id,
        request_id: r._id,
        booking_id: {
          _id: booking._id,
          booking_id: booking.booking_id,
          user_id: booking.user_id,
          address_id: booking.address_id
        },
        display_id: booking.booking_id,
        service_name: serviceName,
        amount: booking.payable_amount,
        location: {
          address: address?.address_line || 'Address',
          city: address?.city || 'City',
          distance: r.distance ? (r.distance / 1000).toFixed(1) + ' km' : 'Nearby'
        },
        scheduled_at: booking.scheduled_at,
        booking_time: booking.booking_time,
        expires_at: r.expires_at,
        status: r.status
      };
    }).filter(Boolean);

    res.json(mappedRequests);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};



// @desc    Accept a job request
// @route   POST /api/providers/job-requests/:id/accept
// @access  Private/Provider
export const acceptJobRequest = async (req: AuthRequest, res: Response): Promise<void> => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const provider = await Provider.findOne({ user_id: req.user?._id }).session(session);
    if (!provider) {
      res.status(404).json({ message: 'Provider not found' });
      return;
    }

    const request = await JobRequest.findById(req.params.id).session(session);
    if (!request || request.status !== 'pending' || request.expires_at < new Date()) {
      res.status(400).json({ message: 'Request is no longer valid' });
      return;
    }

    const booking = await Booking.findById(request.booking_id).session(session);
    if (!booking || booking.status !== 'pending') {
      res.status(400).json({ message: 'Booking is already assigned or unavailable' });
      return;
    }

    // 1. Assign booking to provider
    booking.provider_id = provider._id;
    booking.status = 'accepted';
    await booking.save({ session });

    // 2. Update current request status
    request.status = 'accepted';
    await request.save({ session });

    // 3. Mark other requests for this booking as 'removed'
    await JobRequest.updateMany(
      { booking_id: booking._id, _id: { $ne: request._id } },
      { status: 'removed' }
    ).session(session);

    // 4. Update provider status to busy
    provider.availability_status = 'busy';
    provider.isBusy = true;
    await provider.save({ session });

    await session.commitTransaction();

    // Notify user via socket
    emitToUser(booking.user_id.toString(), 'booking_accepted', {
      booking_id: booking._id,
      provider: {
        name: req.user?.name,
        profile_image: req.user?.profile_image
      }
    });

    res.json({ message: 'Job accepted successfully', booking });
  } catch (error: any) {
    await session.abortTransaction();
    res.status(500).json({ message: error.message });
  } finally {
    session.endSession();
  }
};

// @desc    Reject a job request
// @route   POST /api/providers/job-requests/:id/reject
// @access  Private/Provider
export const rejectJobRequest = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const request = await JobRequest.findById(req.params.id);
    if (!request) {
      res.status(404).json({ message: 'Request not found' });
      return;
    }

    request.status = 'rejected';
    await request.save();

    res.json({ message: 'Job rejected successfully' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update provider live location
// @route   PATCH /api/providers/live-location
// @access  Private/Provider
export const updateLiveLocation = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { latitude, longitude } = req.body;
    const provider = await Provider.findOneAndUpdate(
      { user_id: req.user?._id },
      {
        live_location: { type: 'Point', coordinates: [longitude, latitude] },
        lastActiveAt: new Date(),
        isOnline: true
      },
      { new: true }
    );
    res.json({ message: 'Live location updated', location: provider?.live_location });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update provider availability status
// @route   PUT /api/providers/availability
// @access  Private/Provider
export const updateMyAvailability = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { status } = req.body; // 'available', 'busy', 'offline'
    
    const update: any = { availability_status: status };
    if (status === 'offline') {
      update.isOnline = false;
      update.isBusy = false;
    } else if (status === 'available') {
      update.isOnline = true;
      update.isBusy = false;
    } else if (status === 'busy') {
      update.isOnline = true;
      update.isBusy = true;
    }

    const provider = await Provider.findOneAndUpdate(
      { user_id: req.user?._id },
      update,
      { new: true }
    );
    res.json({ message: 'Availability updated', status: provider?.availability_status, isOnline: provider?.isOnline });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
