import express from 'express';
import {
  getProviders,
  getProviderById,
  createProvider,
  updateProvider,
  deleteProvider,
  addProviderDocument,
} from '../controllers/providerController';
import { protect, admin } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/',                       protect, admin, getProviders);
router.get('/:id',                    protect, admin, getProviderById);
router.post('/',                      protect, admin, createProvider);
router.put('/:id',                    protect, admin, updateProvider);
router.delete('/:id',                 protect, admin, deleteProvider);
router.post('/:id/documents',         protect, admin, addProviderDocument);

export default router;
