import { Request, Response } from 'express';
import { Provider } from '../models/Provider';
import { User } from '../models/User';

// @desc    Get all providers
// @route   GET /api/providers
// @access  Private/Admin
export const getProviders = async (req: Request, res: Response): Promise<void> => {
  try {
    const providers = await Provider.find()
      .populate('user_id', 'name email phone profile_image status')
      .sort({ createdAt: -1 });
    res.json(providers);
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
    const { user_id, experience, skills, documents, availability_status, location } = req.body;

    // Verify user exists and has role 'provider'
    const user = await User.findById(user_id);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    // Check if provider profile already exists for this user
    const alreadyExists = await Provider.findOne({ user_id });
    if (alreadyExists) {
      res.status(400).json({ message: 'Provider profile already exists for this user' });
      return;
    }

    const provider = await Provider.create({
      user_id,
      experience,
      skills,
      documents,
      availability_status,
      location,
    });

    const populated = await provider.populate('user_id', 'name email phone profile_image status');
    res.status(201).json(populated);
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

    const { experience, skills, documents, rating, availability_status, location } = req.body;

    provider.experience          = experience          ?? provider.experience;
    provider.skills              = skills              ?? provider.skills;
    provider.documents           = documents           ?? provider.documents;
    provider.rating              = rating              ?? provider.rating;
    provider.availability_status = availability_status ?? provider.availability_status;
    provider.location            = location            ?? provider.location;

    const updated = await provider.save();
    const populated = await updated.populate('user_id', 'name email phone profile_image status');
    res.json(populated);
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
    await provider.deleteOne();
    res.json({ message: 'Provider deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add a document to provider profile
// @route   POST /api/providers/:id/documents
// @access  Private/Admin
export const addProviderDocument = async (req: Request, res: Response): Promise<void> => {
  try {
    const provider = await Provider.findById(req.params.id);
    if (!provider) {
      res.status(404).json({ message: 'Provider not found' });
      return;
    }

    const { doc_type, file_url } = req.body;
    provider.documents.push({ doc_type, file_url, uploaded_at: new Date() });

    const updated = await provider.save();
    res.json(updated);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
