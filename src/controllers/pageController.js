import Product from '../models/Product.js';
import Order from '../models/Order.js';
import User from '../models/User.js';
import Category from '../models/Category.js';
import Brand from '../models/Brand.js';
import Address from '../models/Address.js';
import Coupon from '../models/Coupon.js';

// ──────────────────────────────────────────────
// STOREFRONT PAGES
// ──────────────────────────────────────────────

// Home Page
export const getHome = async (req, res, next) => {
  try {
    const [featuredProducts, newArrivals, categories, brands, deals] = await Promise.all([
      Product.find({ isFeatured: true }).limit(8),
      Product.find().sort({ createdAt: -1 }).limit(8),
      Category.find({ parent: null, isActive: true }).sort({ order: 1 }).limit(12),
      Brand.find({ isActive: true }).sort({ name: 1 }).limit(12),
      Product.find({ compareAtPrice: { $gt: 0 } }).sort({ rating: -1 }).limit(4),
    ]);

    res.render('pages/index', {
      title: 'Nexus — Premium Online Marketplace',
      featuredProducts, newArrivals, categories, brands, deals,
    });
  } catch (error) {
    next(error);
  }
};

// Shop Page
export const getShop = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = 12;

    const filter = {};
    if (req.query.category && req.query.category !== 'all') {
      filter.category = req.query.category;
    }
    if (req.query.brand && req.query.brand !== 'all') {
      filter.brand = req.query.brand;
    }
    if (req.query.keyword) {
      filter.$or = [
        { name: { $regex: req.query.keyword, $options: 'i' } },
        { description: { $regex: req.query.keyword, $options: 'i' } },
        { brand: { $regex: req.query.keyword, $options: 'i' } },
      ];
    }
    if (req.query.minPrice || req.query.maxPrice) {
      filter.price = {};
      if (req.query.minPrice) filter.price.$gte = Number(req.query.minPrice);
      if (req.query.maxPrice) filter.price.$lte = Number(req.query.maxPrice);
    }
    if (req.query.rating) {
      filter.rating = { $gte: Number(req.query.rating) };
    }
    if (req.query.inStock === 'true') {
      filter.countInStock = { $gt: 0 };
    }

    let sort = { createdAt: -1 };
    if (req.query.sort === 'price-asc') sort = { price: 1 };
    if (req.query.sort === 'price-desc') sort = { price: -1 };
    if (req.query.sort === 'rating') sort = { rating: -1 };
    if (req.query.sort === 'popular') sort = { numReviews: -1 };

    const [count, products, categories, brands] = await Promise.all([
      Product.countDocuments(filter),
      Product.find(filter).sort(sort).skip((page - 1) * limit).limit(limit),
      Category.find({ parent: null, isActive: true }).sort({ order: 1 }),
      Brand.find({ isActive: true }).sort({ name: 1 }),
    ]);

    res.render('pages/shop', {
      title: 'Shop All Products | Nexus',
      products, categories, brands,
      currentCategory: req.query.category || 'all',
      currentBrand: req.query.brand || 'all',
      keyword: req.query.keyword || '',
      currentSort: req.query.sort || 'newest',
      minPrice: req.query.minPrice || '',
      maxPrice: req.query.maxPrice || '',
      currentRating: req.query.rating || '',
      inStock: req.query.inStock || '',
      page, pages: Math.ceil(count / limit), totalProducts: count,
    });
  } catch (error) {
    next(error);
  }
};

// Product Detail Page
export const getProductDetail = async (req, res, next) => {
  try {
    const isObjectId = req.params.slug.match(/^[0-9a-fA-F]{24}$/);
    const product = isObjectId
      ? await Product.findById(req.params.slug)
      : await Product.findOne({ slug: req.params.slug });

    if (!product) {
      return res.status(404).render('pages/error', {
        title: 'Product Not Found', statusCode: 404,
        message: 'The requested product could not be found.',
      });
    }

    const relatedProducts = await Product.find({
      category: product.category, _id: { $ne: product._id },
    }).limit(4);

    // Check if user has wishlisted this product
    let isWishlisted = false;
    if (req.user) {
      isWishlisted = req.user.wishlist.some(id => id.toString() === product._id.toString());
    }

    res.render('pages/product-detail', {
      title: `${product.name} | Nexus`,
      product, relatedProducts, isWishlisted,
    });
  } catch (error) {
    next(error);
  }
};

// Category Page
export const getCategoryPage = async (req, res, next) => {
  try {
    const category = await Category.findOne({ slug: req.params.slug, isActive: true });
    if (!category) {
      return res.status(404).render('pages/error', {
        title: 'Category Not Found', statusCode: 404,
        message: 'The requested category could not be found.',
      });
    }

    const subcategories = await Category.find({ parent: category._id, isActive: true });
    const catNames = [category.name, ...subcategories.map(s => s.name)];

    const page = parseInt(req.query.page, 10) || 1;
    const limit = 12;
    const filter = { category: { $in: catNames } };

    let sort = { createdAt: -1 };
    if (req.query.sort === 'price-asc') sort = { price: 1 };
    if (req.query.sort === 'price-desc') sort = { price: -1 };
    if (req.query.sort === 'rating') sort = { rating: -1 };

    const [count, products] = await Promise.all([
      Product.countDocuments(filter),
      Product.find(filter).sort(sort).skip((page - 1) * limit).limit(limit),
    ]);

    res.render('pages/category', {
      title: `${category.name} | Nexus`,
      category, subcategories, products,
      page, pages: Math.ceil(count / limit), totalProducts: count,
      currentSort: req.query.sort || 'newest',
    });
  } catch (error) {
    next(error);
  }
};

// Brand Page
export const getBrandPage = async (req, res, next) => {
  try {
    const brand = await Brand.findOne({ slug: req.params.slug, isActive: true });
    if (!brand) {
      return res.status(404).render('pages/error', {
        title: 'Brand Not Found', statusCode: 404,
        message: 'The requested brand could not be found.',
      });
    }

    const page = parseInt(req.query.page, 10) || 1;
    const limit = 12;
    const filter = { brand: brand.name };

    const [count, products] = await Promise.all([
      Product.countDocuments(filter),
      Product.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit),
    ]);

    res.render('pages/brand', {
      title: `${brand.name} | Nexus`,
      brand, products,
      page, pages: Math.ceil(count / limit), totalProducts: count,
    });
  } catch (error) {
    next(error);
  }
};

// Cart Page
export const getCart = (req, res) => {
  res.render('pages/cart', { title: 'Your Shopping Cart | Nexus' });
};

// Checkout Page
export const getCheckout = async (req, res, next) => {
  try {
    const addresses = await Address.find({ user: req.user._id }).sort({ isDefault: -1 });
    res.render('pages/checkout', { title: 'Checkout | Nexus', addresses });
  } catch (error) {
    next(error);
  }
};

// Order Success Page
export const getOrderSuccess = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.redirect('/');
    res.render('pages/order-success', { title: 'Order Confirmed | Nexus', order });
  } catch (error) {
    next(error);
  }
};

// My Orders Page
export const getMyOrdersPage = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.render('pages/my-orders', { title: 'My Orders | Nexus', orders });
  } catch (error) {
    next(error);
  }
};

// Profile Page
export const getProfilePage = async (req, res, next) => {
  try {
    const addresses = await Address.find({ user: req.user._id }).sort({ isDefault: -1 });
    const orderCount = await Order.countDocuments({ user: req.user._id });
    res.render('pages/profile', { title: 'My Account | Nexus', addresses, orderCount });
  } catch (error) {
    next(error);
  }
};

// Wishlist Page
export const getWishlistPage = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate('wishlist', 'name slug price compareAtPrice images rating numReviews brand countInStock isFeatured');
    res.render('pages/wishlist', { title: 'My Wishlist | Nexus', wishlistItems: user.wishlist });
  } catch (error) {
    next(error);
  }
};

// Login Page
export const getLoginPage = (req, res) => {
  if (res.locals.user) return res.redirect('/');
  res.render('pages/login', { title: 'Sign In | Nexus', redirect: req.query.redirect || '' });
};

// Register Page
export const getRegisterPage = (req, res) => {
  if (res.locals.user) return res.redirect('/');
  res.render('pages/register', { title: 'Create Account | Nexus' });
};

// Forgot Password Page
export const getForgotPasswordPage = (req, res) => {
  if (res.locals.user) return res.redirect('/');
  res.render('pages/forgot-password', { title: 'Forgot Password | Nexus' });
};

// Reset Password Page
export const getResetPasswordPage = (req, res) => {
  if (res.locals.user) return res.redirect('/');
  res.render('pages/reset-password', { title: 'Reset Password | Nexus', token: req.params.token });
};

// ──────────────────────────────────────────────
// ADMIN PAGES
// ──────────────────────────────────────────────

// Admin Dashboard
export const getAdminDashboard = async (req, res, next) => {
  try {
    const [totalUsers, totalProducts, totalOrders, lowStockCount, revenueResult, recentOrders, topProducts] = await Promise.all([
      User.countDocuments(),
      Product.countDocuments(),
      Order.countDocuments(),
      Product.countDocuments({ countInStock: { $lte: 5 } }),
      Order.aggregate([{ $match: { isPaid: true } }, { $group: { _id: null, totalRevenue: { $sum: '$totalPrice' } } }]),
      Order.find().populate('user', 'name email').sort({ createdAt: -1 }).limit(8),
      Product.find().sort({ numReviews: -1 }).limit(5),
    ]);

    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;

    // Orders by status
    const statusCounts = await Order.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    res.render('pages/admin/dashboard', {
      title: 'Admin Dashboard | Nexus',
      stats: { totalRevenue: Number(totalRevenue.toFixed(2)), totalOrders, totalProducts, totalUsers, lowStockCount },
      recentOrders, topProducts, statusCounts,
    });
  } catch (error) {
    next(error);
  }
};

// Admin Products
export const getAdminProducts = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = 20;
    const filter = {};
    if (req.query.keyword) {
      filter.$or = [
        { name: { $regex: req.query.keyword, $options: 'i' } },
        { sku: { $regex: req.query.keyword, $options: 'i' } },
      ];
    }
    if (req.query.category && req.query.category !== 'all') filter.category = req.query.category;

    const [count, products, categories] = await Promise.all([
      Product.countDocuments(filter),
      Product.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit),
      Category.find({ parent: null, isActive: true }).sort({ order: 1 }),
    ]);

    res.render('pages/admin/products', {
      title: 'Product Inventory | Admin', products, categories,
      page, pages: Math.ceil(count / limit), totalProducts: count,
      keyword: req.query.keyword || '', currentCategory: req.query.category || 'all',
    });
  } catch (error) {
    next(error);
  }
};

// Admin Orders
export const getAdminOrders = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = 20;
    const filter = {};
    if (req.query.status && req.query.status !== 'all') filter.status = req.query.status;

    const [count, orders] = await Promise.all([
      Order.countDocuments(filter),
      Order.find(filter).populate('user', 'name email').sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit),
    ]);

    res.render('pages/admin/orders', {
      title: 'Order Management | Admin', orders,
      page, pages: Math.ceil(count / limit), totalOrders: count,
      currentStatus: req.query.status || 'all',
    });
  } catch (error) {
    next(error);
  }
};

// Admin Users
export const getAdminUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.render('pages/admin/users', { title: 'User Management | Admin', users });
  } catch (error) {
    next(error);
  }
};

// Admin Categories
export const getAdminCategories = async (req, res, next) => {
  try {
    const categories = await Category.find().populate('parent', 'name').sort({ order: 1, name: 1 });
    res.render('pages/admin/categories', { title: 'Category Management | Admin', categories });
  } catch (error) {
    next(error);
  }
};

// Admin Brands
export const getAdminBrands = async (req, res, next) => {
  try {
    const brands = await Brand.find().sort({ name: 1 });
    res.render('pages/admin/brands', { title: 'Brand Management | Admin', brands });
  } catch (error) {
    next(error);
  }
};

// Admin Coupons
export const getAdminCoupons = async (req, res, next) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    res.render('pages/admin/coupons', { title: 'Coupon Management | Admin', coupons });
  } catch (error) {
    next(error);
  }
};
