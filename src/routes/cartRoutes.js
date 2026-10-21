import express from 'express';
import { getCart, addToCart, updateCartItem, removeFromCart, clearCart, mergeCart } from '../controllers/cartController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);
router.route('/').get(getCart).post(addToCart).delete(clearCart);
router.post('/merge', mergeCart);
router.route('/:productId').put(updateCartItem).delete(removeFromCart);

export default router;
