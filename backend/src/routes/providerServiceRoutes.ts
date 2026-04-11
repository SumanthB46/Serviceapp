import express from 'express';
import { addProviderService, getProviderServices, updateProviderService, deleteProviderService } from '../controllers/providerServiceController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/', protect, addProviderService);
router.get('/:providerId', getProviderServices);

router.route('/:id')
  .put(protect, updateProviderService)
  .delete(protect, deleteProviderService);

export default router;
