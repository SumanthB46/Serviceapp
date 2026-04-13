import express from 'express';
import { registerUser, loginUser, getMe, updateMe, getUsers, deleteUser, updateUser } from '../controllers/userController';
import { protect, admin } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/', getUsers);
router.post('/register', registerUser);
router.post('/login', loginUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);
router.get('/me', protect, getMe);
router.put('/me', protect, updateMe);

export default router;
