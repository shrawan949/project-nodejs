import Coupon from '../models/Coupon.js';

// @desc    Validate a promo code
// @route   POST /api/v1/coupons/validate
export const validateCoupon = async (req, res, next) => {
  try {
    const { code, cartTotal } = req.body;

    if (!code) {
      return res.status(400).json({ success: false, message: 'Please provide a coupon code' });
    }

    const coupon = await Coupon.findOne({
      code: code.toUpperCase().trim(),
      isActive: true,
    });

    if (!coupon) {
      return res.status(404).json({ success: false, message: 'Invalid or inactive promo code' });
    }

    if (coupon.expiresAt < new Date()) {
      return res.status(400).json({ success: false, message: 'This promo code has expired' });
    }

    if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) {
      return res.status(400).json({ success: false, message: 'This coupon usage limit has been reached' });
    }

    const total = parseFloat(cartTotal) || 0;
    if (total < coupon.minOrderValue) {
      return res.status(400).json({
        success: false,
        message: `Minimum order amount of $${coupon.minOrderValue} required for this coupon`,
      });
    }

    let discount = 0;
    if (coupon.discountType === 'percentage') {
      discount = (total * coupon.discountValue) / 100;
      if (coupon.maxDiscount && discount > coupon.maxDiscount) {
        discount = coupon.maxDiscount;
      }
    } else {
      discount = coupon.discountValue;
    }

    res.status(200).json({
      success: true,
      message: `Coupon applied: ${coupon.discountValue}${coupon.discountType === 'percentage' ? '%' : '$'} OFF`,
      discount: Number(discount.toFixed(2)),
      coupon: {
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all coupons (Admin)
// @route   GET /api/v1/coupons
export const getCoupons = async (req, res, next) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: coupons.length, coupons });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new coupon (Admin)
// @route   POST /api/v1/coupons
export const createCoupon = async (req, res, next) => {
  try {
    const coupon = await Coupon.create(req.body);
    res.status(201).json({ success: true, message: 'Coupon created successfully', coupon });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete coupon (Admin)
// @route   DELETE /api/v1/coupons/:id
export const deleteCoupon = async (req, res, next) => {
  try {
    await Coupon.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Coupon deleted' });
  } catch (error) {
    next(error);
  }
};
