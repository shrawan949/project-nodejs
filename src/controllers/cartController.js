import Cart from '../models/Cart.js';
import Product from '../models/Product.js';

// @desc    Get current user's cart
// @route   GET /api/v1/cart
export const getCart = async (req, res, next) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id }).populate('items.product', 'name slug price compareAtPrice images countInStock brand');
    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [] });
    }
    res.status(200).json({ success: true, cart });
  } catch (error) {
    next(error);
  }
};

// @desc    Add item to cart
// @route   POST /api/v1/cart
export const addToCart = async (req, res, next) => {
  try {
    const { productId, qty } = req.body;
    const quantity = parseInt(qty, 10) || 1;

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    if (product.countInStock < quantity) {
      return res.status(400).json({ success: false, message: `Only ${product.countInStock} units available` });
    }

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) cart = await Cart.create({ user: req.user._id, items: [] });

    const existingIdx = cart.items.findIndex(i => i.product.toString() === productId);
    if (existingIdx > -1) {
      cart.items[existingIdx].qty += quantity;
    } else {
      cart.items.push({ product: productId, qty: quantity });
    }
    await cart.save();

    cart = await Cart.findOne({ user: req.user._id }).populate('items.product', 'name slug price compareAtPrice images countInStock brand');
    res.status(200).json({ success: true, message: 'Item added to cart', cart });
  } catch (error) {
    next(error);
  }
};

// @desc    Update cart item quantity
// @route   PUT /api/v1/cart/:productId
export const updateCartItem = async (req, res, next) => {
  try {
    const { qty } = req.body;
    const quantity = parseInt(qty, 10);

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ success: false, message: 'Cart not found' });

    const itemIdx = cart.items.findIndex(i => i.product.toString() === req.params.productId);
    if (itemIdx === -1) return res.status(404).json({ success: false, message: 'Item not in cart' });

    if (quantity <= 0) {
      cart.items.splice(itemIdx, 1);
    } else {
      cart.items[itemIdx].qty = quantity;
    }
    await cart.save();

    const updated = await Cart.findOne({ user: req.user._id }).populate('items.product', 'name slug price compareAtPrice images countInStock brand');
    res.status(200).json({ success: true, message: 'Cart updated', cart: updated });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/v1/cart/:productId
export const removeFromCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ success: false, message: 'Cart not found' });

    cart.items = cart.items.filter(i => i.product.toString() !== req.params.productId);
    await cart.save();

    const updated = await Cart.findOne({ user: req.user._id }).populate('items.product', 'name slug price compareAtPrice images countInStock brand');
    res.status(200).json({ success: true, message: 'Item removed', cart: updated });
  } catch (error) {
    next(error);
  }
};

// @desc    Clear entire cart
// @route   DELETE /api/v1/cart
export const clearCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (cart) {
      cart.items = [];
      cart.couponCode = '';
      await cart.save();
    }
    res.status(200).json({ success: true, message: 'Cart cleared' });
  } catch (error) {
    next(error);
  }
};

// @desc    Merge guest cart items into server cart on login
// @route   POST /api/v1/cart/merge
export const mergeCart = async (req, res, next) => {
  try {
    const { items } = req.body; // Array of { productId, qty }
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(200).json({ success: true, message: 'Nothing to merge' });
    }

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) cart = await Cart.create({ user: req.user._id, items: [] });

    for (const guestItem of items) {
      const product = await Product.findById(guestItem.productId);
      if (!product || product.countInStock <= 0) continue;

      const existingIdx = cart.items.findIndex(i => i.product.toString() === guestItem.productId);
      if (existingIdx > -1) {
        cart.items[existingIdx].qty = Math.max(cart.items[existingIdx].qty, parseInt(guestItem.qty, 10) || 1);
      } else {
        cart.items.push({ product: guestItem.productId, qty: parseInt(guestItem.qty, 10) || 1 });
      }
    }
    await cart.save();

    const updated = await Cart.findOne({ user: req.user._id }).populate('items.product', 'name slug price compareAtPrice images countInStock brand');
    res.status(200).json({ success: true, message: 'Cart merged', cart: updated });
  } catch (error) {
    next(error);
  }
};
