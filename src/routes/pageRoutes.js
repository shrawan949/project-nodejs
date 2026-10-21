import express from 'express';
import {
  getHome, getShop, getProductDetail, getCart, getCheckout,
  getOrderSuccess, getMyOrdersPage, getLoginPage, getRegisterPage,
  getCategoryPage, getBrandPage, getProfilePage, getWishlistPage,
  getForgotPasswordPage, getResetPasswordPage,
  getAdminDashboard, getAdminProducts, getAdminOrders, getAdminUsers,
  getAdminCategories, getAdminBrands, getAdminCoupons,
} from '../controllers/pageController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Public Storefront Routes
router.get('/', getHome);
router.get('/shop', getShop);
router.get('/product/:slug', getProductDetail);
router.get('/category/:slug', getCategoryPage);
router.get('/brand/:slug', getBrandPage);
router.get('/cart', getCart);
router.get('/login', getLoginPage);
router.get('/register', getRegisterPage);
router.get('/forgot-password', getForgotPasswordPage);
router.get('/reset-password/:token', getResetPasswordPage);

// Customer Authenticated Routes
router.get('/checkout', protect, getCheckout);
router.get('/order-success/:id', protect, getOrderSuccess);
router.get('/my-orders', protect, getMyOrdersPage);
router.get('/profile', protect, getProfilePage);
router.get('/wishlist', protect, getWishlistPage);

// Admin Routes
router.get('/admin', protect, authorize('admin'), getAdminDashboard);
router.get('/admin/products', protect, authorize('admin'), getAdminProducts);
router.get('/admin/orders', protect, authorize('admin'), getAdminOrders);
router.get('/admin/users', protect, authorize('admin'), getAdminUsers);
router.get('/admin/categories', protect, authorize('admin'), getAdminCategories);
router.get('/admin/brands', protect, authorize('admin'), getAdminBrands);
router.get('/admin/coupons', protect, authorize('admin'), getAdminCoupons);

export default router;
