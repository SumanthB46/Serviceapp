import { Response } from 'express';
import { Cart } from '../../models/Cart';
import { SubService } from '../../models/SubService';
import { AuthRequest } from '../../middleware/authMiddleware';

// @desc    Get current user's cart
// @route   GET /api/cart
// @access  Private
export const getCart = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    let cart = await Cart.findOne({ user_id: req.user?._id }).populate('items.subservice_id');
    
    if (!cart) {
      // Create empty cart if it doesn't exist
      cart = await Cart.create({ user_id: req.user?._id, items: [], total_amount: 0 });
    }
    
    res.json(cart);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add item to cart or update quantity
// @route   POST /api/cart/add
// @access  Private
export const addToCart = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { subservice_id, quantity = 1 } = req.body;

    const subService = await SubService.findById(subservice_id);
    if (!subService) {
      res.status(404).json({ message: 'Sub-service not found' });
      return;
    }

    let cart = await Cart.findOne({ user_id: req.user?._id });

    if (!cart) {
      cart = new Cart({
        user_id: req.user?._id,
        items: [
          {
            subservice_id,
            quantity,
            price_snapshot: subService.base_price,
            added_at: new Date(),
          },
        ],
      });
    } else {
      const itemIndex = cart.items.findIndex(
        (item) => item.subservice_id.toString() === subservice_id
      );

      if (itemIndex > -1) {
        // If exists, update quantity and update price snapshot
        cart.items[itemIndex].quantity += quantity;
        cart.items[itemIndex].price_snapshot = subService.base_price;
      } else {
        // If not exists, add to items
        cart.items.push({
          subservice_id: subservice_id as any,
          quantity,
          price_snapshot: subService.base_price,
          added_at: new Date(),
        });
      }
    }

    await cart.save();
    const populatedCart = await Cart.findById(cart._id).populate('items.subservice_id');
    res.status(200).json(populatedCart);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update item quantity in cart
// @route   PUT /api/cart/update
// @access  Private
export const updateCartItem = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { subservice_id, quantity } = req.body;

    const cart = await Cart.findOne({ user_id: req.user?._id });
    if (!cart) {
      res.status(404).json({ message: 'Cart not found' });
      return;
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.subservice_id.toString() === subservice_id
    );

    if (itemIndex === -1) {
      res.status(404).json({ message: 'Item not found in cart' });
      return;
    }

    if (quantity <= 0) {
      cart.items.splice(itemIndex, 1);
    } else {
      cart.items[itemIndex].quantity = quantity;
      
      // Update price snapshot while we are at it
      const subService = await SubService.findById(subservice_id);
      if (subService) {
        cart.items[itemIndex].price_snapshot = subService.base_price;
      }
    }

    await cart.save();
    const populatedCart = await Cart.findById(cart._id).populate('items.subservice_id');
    res.json(populatedCart);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/item/:id
// @access  Private
export const removeFromCart = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const cart = await Cart.findOne({ user_id: req.user?._id });
    if (!cart) {
      res.status(404).json({ message: 'Cart not found' });
      return;
    }

    cart.items = cart.items.filter(
      (item) => item.subservice_id.toString() !== req.params.id
    );

    await cart.save();
    const populatedCart = await Cart.findById(cart._id).populate('items.subservice_id');
    res.json(populatedCart);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Clear cart
// @route   DELETE /api/cart
// @access  Private
export const clearCart = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const cart = await Cart.findOne({ user_id: req.user?._id });
    if (cart) {
      cart.items = [];
      await cart.save();
    }
    res.json({ message: 'Cart cleared' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
