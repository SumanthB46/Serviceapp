import { Request, Response } from 'express';
import { User, IUser } from '../models/User';
import generateToken from '../utils/generateToken';
import bcrypt from 'bcryptjs';
import { AuthRequest } from '../middleware/authMiddleware';

// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public
export const registerUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, phone, password, role, profile_image } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
      res.status(400).json({ message: 'User already exists' });
      return;
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      phone,
      password: hashedPassword,
      role: role || 'customer',
      profile_image: profile_image || '',
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        profile_image: user.profile_image,
        token: generateToken(user._id.toString()),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
export const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Check for user email
    const user = await User.findOne({ email }) as IUser & { _id: string, password?: string };

    if (user && user.password && (await bcrypt.compare(password, user.password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        token: generateToken(user._id.toString()),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get current logged-in user profile
// @route   GET /api/users/me
// @access  Private
export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.user?._id).select('-password');
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    res.json(user);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update current logged-in user profile
// @route   PUT /api/users/me
// @access  Private
export const updateMe = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.user?._id) as IUser & { _id: string; password?: string };
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    user.name          = req.body.name          ?? user.name;
    user.email         = req.body.email         ?? user.email;
    user.phone         = req.body.phone         ?? user.phone;
    user.profile_image = req.body.profile_image ?? user.profile_image;

    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(req.body.password, salt);
    }

    const updated = await user.save();

    res.json({
      _id:           updated._id,
      name:          updated.name,
      email:         updated.email,
      phone:         updated.phone,
      role:          updated.role,
      profile_image: updated.profile_image,
      status:        updated.status,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all users (Admin only normally, but public for now for this request)
// @route   GET /api/users
// @access  Public
export const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await User.find({ status: { $ne: 'deleted' } }).sort({ createdAt: -1 });
    res.json(users);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a user (Soft Delete)
// @route   DELETE /api/users/:id
// @access  Private/Admin
export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    user.status = 'deleted';
    await user.save();
    res.json({ message: 'User moved to trash (Soft Delete)' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
