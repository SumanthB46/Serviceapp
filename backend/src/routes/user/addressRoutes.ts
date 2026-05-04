import express from 'express';
import { getAddresses, addAddress, updateAddress, deleteAddress } from '../../controllers/user/addressController';
import { protect } from '../../middleware/authMiddleware';

const router = express.Router();

router.route('/')
  .get(protect, getAddresses)
  .post(protect, addAddress);

router.route('/:id')
  .put(protect, updateAddress)
  .delete(protect, deleteAddress);

export default router;



