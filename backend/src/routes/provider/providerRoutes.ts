import express from 'express';
import {
  getProviders,
  getProviderById,
  createProvider,
  updateProvider,
  deleteProvider,
  getMyProviderProfile,
  updateMyProviderProfile,
  getMyJobRequests,
  acceptJobRequest,
  rejectJobRequest,
  updateLiveLocation,
  updateMyAvailability,
  processVerificationAction
} from '../../controllers/provider/providerController';
import { protect, admin, requireVerifiedProvider } from '../../middleware/authMiddleware';

const router = express.Router();

router.get('/me',                       protect, getMyProviderProfile);
router.put('/me',                       protect, updateMyProviderProfile);
// Job Requests & Status
router.get('/job-requests',            protect, requireVerifiedProvider, getMyJobRequests);
router.post('/job-requests/:id/accept', protect, requireVerifiedProvider, acceptJobRequest);
router.post('/job-requests/:id/reject', protect, requireVerifiedProvider, rejectJobRequest);
router.patch('/live-location',        protect, requireVerifiedProvider, updateLiveLocation);
router.put('/availability',           protect, requireVerifiedProvider, updateMyAvailability);

router.get('/',                       protect, admin, getProviders);
router.get('/:id',                    protect, admin, getProviderById);
router.post('/',                      protect, admin, createProvider);
router.put('/:id',                    protect, admin, updateProvider);
router.post('/:id/verification-action', protect, admin, processVerificationAction);
router.delete('/:id',                 protect, admin, deleteProvider);


export default router;
