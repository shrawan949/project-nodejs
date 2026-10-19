import express from 'express';
import {
  validateCoupon,
  getCoupons,
  createCoupon,
  deleteCoupon,
} from '../controllers/couponController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.post('/validate', validateCoupon);

router.use(protect, authorize('admin'));
router.route('/')
  .get(getCoupons)
  .post(createCoupon);

router.route('/:id')
  .delete(deleteCoupon);

export default router;
