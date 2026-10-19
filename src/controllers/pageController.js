import Product from '../models/Product.js';
import Order from '../models/Order.js';
import User from '../models/User.js';
import Category from '../models/Category.js';

// Home Page
export const getHome = async (req, res, next) => {
  try {
    const featuredProducts = await Product.find({ isFeatured: true }).limit(8);
    const newArrivals = await Product.find().sort({ createdAt: -1 }).limit(8);
    const categories = await Category.find();

    res.render('pages/index', {
      title: 'Nexus E-Commerce | Modern Online Store',
      featuredProducts,
      newArrivals,
      categories,
    });
  } catch (error) {
    next(error);
  }
};

// Shop Page
export const getShop = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = 9;

    const filter = {};
    if (req.query.category && req.query.category !== 'all') {
      filter.category = req.query.category;
    }
    if (req.query.keyword) {
      filter.$or = [
        { name: { $regex: req.query.keyword, $options: 'i' } },
        { description: { $regex: req.query.keyword, $options: 'i' } },
      ];
    }
    if (req.query.minPrice || req.query.maxPrice) {
      filter.price = {};
      if (req.query.minPrice) filter.price.$gte = Number(req.query.minPrice);
      if (req.query.maxPrice) filter.price.$lte = Number(req.query.maxPrice);
    }

    let sort = { createdAt: -1 };
    if (req.query.sort === 'price-asc') sort = { price: 1 };
    if (req.query.sort === 'price-desc') sort = { price: -1 };
    if (req.query.sort === 'rating') sort = { rating: -1 };

    const count = await Product.countDocuments(filter);
    const products = await Product.find(filter)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit);

    const categories = await Product.distinct('category');

    res.render('pages/shop', {
      title: 'Shop All Products | Nexus',
      products,
      categories,
      currentCategory: req.query.category || 'all',
      keyword: req.query.keyword || '',
      currentSort: req.query.sort || 'newest',
      page,
      pages: Math.ceil(count / limit),
      totalProducts: count,
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
        title: 'Product Not Found',
        statusCode: 404,
        message: 'The requested product could not be found.',
      });
    }

    const relatedProducts = await Product.find({
      category: product.category,
      _id: { $ne: product._id },
    }).limit(4);

    res.render('pages/product-detail', {
      title: `${product.name} | Nexus`,
      product,
      relatedProducts,
    });
  } catch (error) {
    next(error);
  }
};

// Cart Page
export const getCart = (req, res) => {
  res.render('pages/cart', {
    title: 'Your Shopping Cart | Nexus',
  });
};

// Checkout Page
export const getCheckout = (req, res) => {
  res.render('pages/checkout', {
    title: 'Checkout | Nexus',
  });
};

// Order Success Page
export const getOrderSuccess = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.redirect('/');
    }

    res.render('pages/order-success', {
      title: 'Order Confirmed | Nexus',
      order,
    });
  } catch (error) {
    next(error);
  }
};

// My Orders Page
export const getMyOrdersPage = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.render('pages/my-orders', {
      title: 'My Orders | Nexus',
      orders,
    });
  } catch (error) {
    next(error);
  }
};

// Login Page
export const getLoginPage = (req, res) => {
  if (res.locals.user) {
    return res.redirect('/');
  }
  res.render('pages/login', {
    title: 'Sign In | Nexus',
    redirect: req.query.redirect || '',
  });
};

// Register Page
export const getRegisterPage = (req, res) => {
  if (res.locals.user) {
    return res.redirect('/');
  }
  res.render('pages/register', {
    title: 'Create Account | Nexus',
  });
};

// Admin Dashboard
export const getAdminDashboard = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();

    const revenueResult = await Order.aggregate([
      { $match: { isPaid: true } },
      { $group: { _id: null, totalRevenue: { $sum: '$totalPrice' } } },
    ]);
    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;

    const recentOrders = await Order.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(6);

    res.render('pages/admin/dashboard', {
      title: 'Admin Dashboard | Nexus',
      stats: {
        totalRevenue: Number(totalRevenue.toFixed(2)),
        totalOrders,
        totalProducts,
        totalUsers,
      },
      recentOrders,
    });
  } catch (error) {
    next(error);
  }
};

// Admin Products
export const getAdminProducts = async (req, res, next) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.render('pages/admin/products', {
      title: 'Product Inventory | Admin',
      products,
    });
  } catch (error) {
    next(error);
  }
};

// Admin Orders
export const getAdminOrders = async (req, res, next) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    res.render('pages/admin/orders', {
      title: 'Order Management | Admin',
      orders,
    });
  } catch (error) {
    next(error);
  }
};

// Admin Users
export const getAdminUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.render('pages/admin/users', {
      title: 'User Management | Admin',
      users,
    });
  } catch (error) {
    next(error);
  }
};
