import User from '../models/User.js';
import Product from '../models/Product.js';

// @desc    Get wishlist
// @route   GET /api/v1/wishlist
export const getWishlist = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate('wishlist', 'name slug price compareAtPrice images rating numReviews brand countInStock isFeatured');
    res.status(200).json({ success: true, count: user.wishlist.length, wishlist: user.wishlist });
  } catch (error) {
    next(error);
  }
};

// @desc    Add product to wishlist
// @route   POST /api/v1/wishlist
export const addToWishlist = async (req, res, next) => {
  try {
    const { productId } = req.body;
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

    const user = await User.findById(req.user._id);
    if (user.wishlist.includes(productId)) {
      return res.status(400).json({ success: false, message: 'Already in wishlist' });
    }

    user.wishlist.push(productId);
    await user.save();
    res.status(200).json({ success: true, message: 'Added to wishlist' });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove product from wishlist
// @route   DELETE /api/v1/wishlist/:productId
export const removeFromWishlist = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    user.wishlist = user.wishlist.filter(id => id.toString() !== req.params.productId);
    await user.save();
    res.status(200).json({ success: true, message: 'Removed from wishlist' });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle wishlist (add if not present, remove if present)
// @route   POST /api/v1/wishlist/toggle
export const toggleWishlist = async (req, res, next) => {
  try {
    const { productId } = req.body;
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

    const user = await User.findById(req.user._id);
    const idx = user.wishlist.indexOf(productId);
    let action;

    if (idx > -1) {
      user.wishlist.splice(idx, 1);
      action = 'removed';
    } else {
      user.wishlist.push(productId);
      action = 'added';
    }
    await user.save();
    res.status(200).json({ success: true, message: `Product ${action} ${action === 'added' ? 'to' : 'from'} wishlist`, action, wishlistCount: user.wishlist.length });
  } catch (error) {
    next(error);
  }
};
