import { Request, Response } from 'express';
import { User, IUser } from '../../models/User';
import { Otp } from '../../models/Otp';
import generateToken from '../../utils/generateToken';
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';
import twilio from 'twilio';
import { AuthRequest } from '../../middleware/authMiddleware';

// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public
export const registerUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, phone, password, role, profile_image, gender } = req.body;

    const queryList = [];
    if (email) queryList.push({ email });
    if (phone) queryList.push({ phone });
    
    if (queryList.length === 0) {
      res.status(400).json({ message: 'Must provide an email or phone number.' });
      return;
    }

    const userExists = await User.findOne({ $or: queryList });

    if (userExists) {
      res.status(400).json({ message: 'User with this email or phone already exists. Please log in instead.' });
      return;
    }

    // Hash the password if it exists
    let hashedPassword = undefined;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      hashedPassword = await bcrypt.hash(password, salt);
    }

    const user = await User.create({
      name,
      email: email || undefined,
      phone: phone || undefined,
      password: hashedPassword,
      role: role || 'customer',
      gender,
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

// @desc    Update any user (Admin only)
// @route   PUT /api/users/:id
// @access  Private/Admin
export const updateUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.params.id) as IUser & { _id: string; password?: string };
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    user.name          = req.body.name          ?? user.name;
    user.email         = req.body.email         ?? user.email;
    user.phone         = req.body.phone         ?? user.phone;
    user.profile_image = req.body.profile_image ?? user.profile_image;
    
    // Explicitly handle status mapping to lower-case for registry consistency
    if (req.body.status) {
       user.status = req.body.status.toLowerCase();
    }

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

// @desc    Send OTP for registration/login
// @route   POST /api/users/send-otp
// @access  Public
export const sendOtp = async (req: Request, res: Response): Promise<void> => {
  try {
    const { identifier, role, useEmail } = req.body;
    
    // Check if user already exists in the main User table
    const existingUser = await User.findOne(useEmail ? { email: identifier } : { phone: identifier });
    if (existingUser) {
      res.status(400).json({ message: 'This email or phone number is already registered. Please log in.' });
      return;
    }

    // Generate a random 6-digit OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Store in Otp collection temporarily. Upsert ensures we overwrite any existing OTP for this identifier.
    await Otp.findOneAndUpdate(
      { identifier },
      { otpCode, role: role || 'customer', identifier },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    // Send Real Email if useEmail is true
    if (useEmail) {
      // Create a transporter using your SMTP settings
      const transporter = nodemailer.createTransport({
        service: 'gmail', 
        auth: {
          user: process.env.SMTP_EMAIL, // Add this to your backend .env -> e.g., admin@gmail.com
          pass: process.env.SMTP_PASSWORD, // Add this to your backend .env -> standard Google App Password
        },
      });

      const mailOptions = {
        from: process.env.SMTP_EMAIL || 'admin@serviceapp.com',
        to: identifier,
        subject: 'ServiceApp Verification OTP',
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 10px;">
            <h2 style="color: #1D2B83; text-align: center;">ServiceApp Verification</h2>
            <p>Hello,</p>
            <p>Thank you for joining us! Please use the verification code below to securely log into your account.</p>
            <div style="background-color: #F8F9FC; padding: 15px; text-align: center; border-radius: 10px; margin: 20px 0;">
              <h1 style="font-size: 32px; letter-spacing: 8px; color: #1D2B83; margin: 0;">${otpCode}</h1>
            </div>
            <p style="color: #666; font-size: 14px;">If you didn't request this OTP, please ignore this email.</p>
          </div>
        `,
      };

      try {
        if (process.env.SMTP_EMAIL && process.env.SMTP_PASSWORD) {
          await transporter.sendMail(mailOptions);
          console.log(`[SUCCESS] Email OTP sent to ${identifier}`);
        } else {
          console.log(`[MOCK EMAIL] Setup SMTP_EMAIL && SMTP_PASSWORD in .env to send real email. OTP for ${identifier}: ${otpCode}`);
        }
      } catch (emailError) {
        console.error('Failed to send email:', emailError);
      }
    } else {
      // Send Real SMS via Twilio
      if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_PHONE_NUMBER) {
        try {
          const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
          // Auto-prepend Indian country code if not present, based on frontend forcing +91
          const formattedPhone = identifier.startsWith('+') ? identifier : `+91${identifier}`;
          
          await twilioClient.messages.create({
            body: `Your ServiceApp Verification OTP is: ${otpCode}. Please do not share this code with anyone.`,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: formattedPhone
          });
          console.log(`[SUCCESS] SMS OTP sent to ${formattedPhone}`);
        } catch (smsError) {
          console.error('Failed to send SMS via Twilio:', smsError);
        }
      } else {
        console.log(`[MOCK SMS] Setup TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER to send real SMS. OTP for phone ${identifier}: ${otpCode}`);
      }
    }

    // Returning otpCode strictly for development testing as we don't have SMS/Email gateway setup fully
    res.status(200).json({ message: 'OTP sent successfully', otpCode });
  } catch (error: any) {
    if (error.code === 11000) {
      res.status(400).json({ message: 'Email or phone already in use by another account.' });
    } else {
      res.status(500).json({ message: error.message });
    }
  }
};

// @desc    Verify OTP
// @route   POST /api/users/verify-otp
// @access  Public
export const verifyOtp = async (req: Request, res: Response): Promise<void> => {
  try {
    const { identifier, otp, useEmail } = req.body;
    
    const otpRecord = await Otp.findOne({ identifier, otpCode: otp });

    if (!otpRecord) {
      res.status(400).json({ message: 'Invalid or expired OTP.' });
      return;
    }

    // Clean up OTP to prevent reuse
    await Otp.deleteOne({ _id: otpRecord._id });

    // IMPORTANT: We do not save to the User table here. 
    // We strictly verify the code and pass a 'pending' state backwards. 
    // The account is exclusively completed in the final registration profile step.
    
    res.status(200).json({
      message: 'OTP verified successfully',
      user: {
         _id: "pending_verification",
         role: otpRecord.role,
         email: useEmail ? identifier : "",
         phone: !useEmail ? identifier : "",
         token: "pending_auth_token",
      }
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

