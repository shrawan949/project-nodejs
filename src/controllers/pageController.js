import mongoose from 'mongoose';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import User from '../models/User.js';
import Category from '../models/Category.js';
import {
  sampleCategories,
  sampleProducts,
  sampleAdminStats,
  sampleOrders,
  sampleUsers,
} from '../config/sampleData.js';

const isDBConnected = () => mongoose.connection.readyState === 1;

// Home Page
export const getHome = async (req, res, next) => {
  try {
    if (!isDBConnected()) {
      return res.render('pages/index', {
        title: 'Nexus E-Commerce | Modern Online Store',
        featuredProducts: sampleProducts.filter((p) => p.isFeatured),
        newArrivals: sampleProducts,
        categories: sampleCategories,
      });
    }

    const featuredProducts = await Product.find({ isFeatured: true }).limit(8);
    const newArrivals = await Product.find().sort({ createdAt: -1 }).limit(8);
    const categories = await Category.find();

    res.render('pages/index', {
      title: 'Nexus E-Commerce | Modern Online Store',
      featuredProducts: featuredProducts.length > 0 ? featuredProducts : sampleProducts.filter((p) => p.isFeatured),
      newArrivals: newArrivals.length > 0 ? newArrivals : sampleProducts,
      categories: categories.length > 0 ? categories : sampleCategories,
    });
  } catch (error) {
    res.render('pages/index', {
      title: 'Nexus E-Commerce | Modern Online Store',
      featuredProducts: sampleProducts.filter((p) => p.isFeatured),
      newArrivals: sampleProducts,
      categories: sampleCategories,
    });
  }
};

// Shop Page
export const getShop = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = 9;

    if (!isDBConnected()) {
      let filtered = [...sampleProducts];
      if (req.query.category && req.query.category !== 'all') {
        filtered = filtered.filter((p) => p.category === req.query.category);
      }
      if (req.query.keyword) {
        const kw = req.query.keyword.toLowerCase();
        filtered = filtered.filter(
          (p) => p.name.toLowerCase().includes(kw) || p.description.toLowerCase().includes(kw)
        );
      }
      const categories = [...new Set(sampleProducts.map((p) => p.category))];

      return res.render('pages/shop', {
        title: 'Shop All Products | Nexus',
        products: filtered,
        categories,
        currentCategory: req.query.category || 'all',
        keyword: req.query.keyword || '',
        currentSort: req.query.sort || 'newest',
        page: 1,
        pages: 1,
        totalProducts: filtered.length,
      });
    }

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
      products: products.length > 0 ? products : sampleProducts,
      categories: categories.length > 0 ? categories : [...new Set(sampleProducts.map((p) => p.category))],
      currentCategory: req.query.category || 'all',
      keyword: req.query.keyword || '',
      currentSort: req.query.sort || 'newest',
      page,
      pages: Math.ceil(count / limit) || 1,
      totalProducts: count || sampleProducts.length,
    });
  } catch (error) {
    res.render('pages/shop', {
      title: 'Shop All Products | Nexus',
      products: sampleProducts,
      categories: [...new Set(sampleProducts.map((p) => p.category))],
      currentCategory: 'all',
      keyword: '',
      currentSort: 'newest',
      page: 1,
      pages: 1,
      totalProducts: sampleProducts.length,
    });
  }
};

// Product Detail Page
export const getProductDetail = async (req, res, next) => {
  try {
    if (!isDBConnected()) {
      const product = sampleProducts.find(
        (p) => p.slug === req.params.slug || p._id === req.params.slug
      ) || sampleProducts[0];

      const relatedProducts = sampleProducts.filter(
        (p) => p.category === product.category && p._id !== product._id
      ).slice(0, 4);

      return res.render('pages/product-detail', {
        title: `${product.name} | Nexus`,
        product,
        relatedProducts,
      });
    }

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
    const product = sampleProducts[0];
    res.render('pages/product-detail', {
      title: `${product.name} | Nexus`,
      product,
      relatedProducts: sampleProducts.slice(1, 4),
    });
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
    if (!isDBConnected()) {
      return res.render('pages/order-success', {
        title: 'Order Confirmed | Nexus',
        order: sampleOrders[0],
      });
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.redirect('/');
    }

    res.render('pages/order-success', {
      title: 'Order Confirmed | Nexus',
      order,
    });
  } catch (error) {
    res.render('pages/order-success', {
      title: 'Order Confirmed | Nexus',
      order: sampleOrders[0],
    });
  }
};

// My Orders Page
export const getMyOrdersPage = async (req, res, next) => {
  try {
    if (!isDBConnected()) {
      return res.render('pages/my-orders', {
        title: 'My Orders | Nexus',
        orders: sampleOrders,
      });
    }

    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.render('pages/my-orders', {
      title: 'My Orders | Nexus',
      orders: orders.length > 0 ? orders : sampleOrders,
    });
  } catch (error) {
    res.render('pages/my-orders', {
      title: 'My Orders | Nexus',
      orders: sampleOrders,
    });
  }
};

// Login Page
export const getLoginPage = (req, res) => {
  res.render('pages/login', {
    title: 'Sign In | Nexus',
    redirect: req.query.redirect || '',
  });
};

// Register Page
export const getRegisterPage = (req, res) => {
  res.render('pages/register', {
    title: 'Create Account | Nexus',
  });
};

// Admin Dashboard
export const getAdminDashboard = async (req, res, next) => {
  try {
    if (!isDBConnected()) {
      return res.render('pages/admin/dashboard', {
        title: 'Admin Dashboard | Nexus',
        stats: sampleAdminStats,
        recentOrders: sampleOrders,
      });
    }

    const totalUsers = await User.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();

    const revenueResult = await Order.aggregate([
      { $match: { isPaid: true } },
      { $group: { _id: null, totalRevenue: { $sum: '$totalPrice' } } },
    ]);
    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].totalRevenue : sampleAdminStats.totalRevenue;

    const recentOrders = await Order.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(6);

    res.render('pages/admin/dashboard', {
      title: 'Admin Dashboard | Nexus',
      stats: {
        totalRevenue: Number(totalRevenue.toFixed(2)),
        totalOrders: totalOrders || sampleAdminStats.totalOrders,
        totalProducts: totalProducts || sampleAdminStats.totalProducts,
        totalUsers: totalUsers || sampleAdminStats.totalUsers,
      },
      recentOrders: recentOrders.length > 0 ? recentOrders : sampleOrders,
    });
  } catch (error) {
    res.render('pages/admin/dashboard', {
      title: 'Admin Dashboard | Nexus',
      stats: sampleAdminStats,
      recentOrders: sampleOrders,
    });
  }
};

// Admin Products
export const getAdminProducts = async (req, res, next) => {
  try {
    if (!isDBConnected()) {
      return res.render('pages/admin/products', {
        title: 'Product Inventory | Admin',
        products: sampleProducts,
      });
    }
    const products = await Product.find().sort({ createdAt: -1 });
    res.render('pages/admin/products', {
      title: 'Product Inventory | Admin',
      products: products.length > 0 ? products : sampleProducts,
    });
  } catch (error) {
    res.render('pages/admin/products', {
      title: 'Product Inventory | Admin',
      products: sampleProducts,
    });
  }
};

// Admin Orders
export const getAdminOrders = async (req, res, next) => {
  try {
    if (!isDBConnected()) {
      return res.render('pages/admin/orders', {
        title: 'Order Management | Admin',
        orders: sampleOrders,
      });
    }
    const orders = await Order.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    res.render('pages/admin/orders', {
      title: 'Order Management | Admin',
      orders: orders.length > 0 ? orders : sampleOrders,
    });
  } catch (error) {
    res.render('pages/admin/orders', {
      title: 'Order Management | Admin',
      orders: sampleOrders,
    });
  }
};

// Admin Users
export const getAdminUsers = async (req, res, next) => {
  try {
    if (!isDBConnected()) {
      return res.render('pages/admin/users', {
        title: 'User Management | Admin',
        users: sampleUsers,
      });
    }
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.render('pages/admin/users', {
      title: 'User Management | Admin',
      users: users.length > 0 ? users : sampleUsers,
    });
  } catch (error) {
    res.render('pages/admin/users', {
      title: 'User Management | Admin',
      users: sampleUsers,
    });
  }
};
