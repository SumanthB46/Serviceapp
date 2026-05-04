import express from 'express';
import {
  getProviders,
  getProviderById,
  createProvider,
  updateProvider,
  deleteProvider,
  getMyProviderProfile,
  updateMyProviderProfile,
} from '../../controllers/provider/providerController';
import { protect, admin } from '../../middleware/authMiddleware';

const router = express.Router();

router.get('/me',                       protect, getMyProviderProfile);
router.put('/me',                       protect, updateMyProviderProfile);
router.get('/',                       protect, admin, getProviders);
router.get('/:id',                    protect, admin, getProviderById);
router.post('/',                      protect, admin, createProvider);
router.put('/:id',                    protect, admin, updateProvider);
router.delete('/:id',                 protect, admin, deleteProvider);


export default router;
