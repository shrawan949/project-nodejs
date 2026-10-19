import express from 'express';
import {
  getHome,
  getShop,
  getProductDetail,
  getCart,
  getCheckout,
  getOrderSuccess,
  getMyOrdersPage,
  getLoginPage,
  getRegisterPage,
  getAdminDashboard,
  getAdminProducts,
  getAdminOrders,
  getAdminUsers,
} from '../controllers/pageController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Public Storefront Routes
router.get('/', getHome);
router.get('/shop', getShop);
router.get('/product/:slug', getProductDetail);
router.get('/cart', getCart);
router.get('/login', getLoginPage);
router.get('/register', getRegisterPage);

// Customer Authenticated Routes
router.get('/checkout', protect, getCheckout);
router.get('/order-success/:id', protect, getOrderSuccess);
router.get('/my-orders', protect, getMyOrdersPage);

// Admin Routes
router.get('/admin', protect, authorize('admin'), getAdminDashboard);
router.get('/admin/products', protect, authorize('admin'), getAdminProducts);
router.get('/admin/orders', protect, authorize('admin'), getAdminOrders);
router.get('/admin/users', protect, authorize('admin'), getAdminUsers);

export default router;
