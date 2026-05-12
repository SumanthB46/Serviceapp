import express from 'express';
import { getCart, addToCart, updateCartItem, removeFromCart, clearCart } from '../../controllers/user/cartController';
import { protect } from '../../middleware/authMiddleware';

const router = express.Router();

router.use(protect);

router.get('/', getCart);
router.post('/add', addToCart);
router.put('/update', updateCartItem);
router.delete('/item/:id', removeFromCart);
router.delete('/', clearCart);

export default router;
