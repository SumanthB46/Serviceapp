import { Request, Response } from 'express';
import { Address } from '../../models/Address';
import { AuthRequest } from '../../middleware/authMiddleware';
import { getCoordinatesFromPincode } from '../../utils/geocoding';

// @desc    Get user addresses
// @route   GET /api/address
// @access  Private
export const getAddresses = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const addresses = await Address.find({ user_id: req.user?._id }).sort({ is_default: -1, createdAt: -1 });
    res.json(addresses);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add new address
// @route   POST /api/address
// @access  Private
export const addAddress = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { address_line, city, state, pincode, landmark, is_default, coordinates } = req.body;

    // If this is the default address, unset other defaults for this user
    if (is_default) {
      await Address.updateMany({ user_id: req.user?._id }, { is_default: false });
    }

    // Fetch coordinates from pincode if not provided
    let finalCoordinates = coordinates;
    if (!finalCoordinates && pincode) {
      const geo = await getCoordinatesFromPincode(pincode);
      if (geo) {
        finalCoordinates = {
          type: 'Point',
          coordinates: [geo.lng, geo.lat]
        };
      }
    }

    const address = await Address.create({
      user_id: req.user?._id,
      address_line,
      city,
      state,
      pincode,
      landmark,
      is_default: !!is_default,
      coordinates: finalCoordinates
    });

    res.status(201).json(address);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update address
// @route   PUT /api/addresses/:id
// @access  Private
export const updateAddress = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const address = await Address.findOne({ _id: req.params.id, user_id: req.user?._id });

    if (!address) {
      res.status(404).json({ message: 'Address not found' });
      return;
    }

    const { address_line, city, state, pincode, landmark, is_default, coordinates } = req.body;

    if (is_default && !address.is_default) {
      await Address.updateMany({ user_id: req.user?._id }, { is_default: false });
    }

    // Fetch coordinates from pincode if pincode changed and no new coordinates provided
    let finalCoordinates = coordinates ?? address.coordinates;
    if (pincode && pincode !== address.pincode && !coordinates) {
      const geo = await getCoordinatesFromPincode(pincode);
      if (geo) {
        finalCoordinates = {
          type: 'Point',
          coordinates: [geo.lng, geo.lat]
        };
      }
    }

    address.address_line = address_line ?? address.address_line;
    address.city         = city         ?? address.city;
    address.state        = state        ?? address.state;
    address.pincode      = pincode      ?? address.pincode;
    address.landmark     = landmark     ?? address.landmark;
    address.is_default   = is_default   ?? address.is_default;
    address.coordinates  = finalCoordinates;

    const updated = await address.save();
    res.json(updated);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete address
// @route   DELETE /api/address/:id
// @access  Private
export const deleteAddress = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const address = await Address.findOne({ _id: req.params.id, user_id: req.user?._id });

    if (!address) {
      res.status(404).json({ message: 'Address not found' });
      return;
    }

    await address.deleteOne();
    res.json({ message: 'Address removed' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
