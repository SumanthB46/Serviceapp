import express from 'express';
import { registerUser, loginUser, getMe, updateMe, getUsers, deleteUser, updateUser, sendOtp, verifyOtp } from '../../controllers/user/userController';
import { protect, admin } from '../../middleware/authMiddleware';

const router = express.Router();

router.get('/', getUsers);
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/send-otp', sendOtp);
router.post('/verify-otp', verifyOtp);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);
router.get('/me', protect, getMe);
router.put('/me', protect, updateMe);

export default router;
