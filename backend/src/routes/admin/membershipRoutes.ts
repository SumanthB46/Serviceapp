import express from 'express';
import { 
  createMembership, 
  getAllMemberships, 
  updateMembership, 
  deleteMembership, 
  getMembershipUsers,
  getMembershipStats
} from '../../controllers/admin/membershipController';
import { protect, admin } from '../../middleware/authMiddleware';

const router = express.Router();

// Public route to view memberships
router.get('/', getAllMemberships);

// Protected administrative routes
router.post('/', protect, admin, createMembership);
router.get('/stats', protect, admin, getMembershipStats);
router.put('/:id', protect, admin, updateMembership);
router.delete('/:id', protect, admin, deleteMembership);
router.get('/:id/users', protect, admin, getMembershipUsers);

export default router;
