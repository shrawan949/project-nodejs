import Order from '../models/Order.js';
import Product from '../models/Product.js';
import Coupon from '../models/Coupon.js';

// @desc    Create new order
// @route   POST /api/v1/orders
export const createOrder = async (req, res, next) => {
  try {
    const { orderItems, shippingAddress, paymentMethod, couponCode } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ success: false, message: 'No order items found in cart' });
    }

    // Verify stock and compute real prices from database
    let itemsPrice = 0;
    const validatedItems = [];

    for (const item of orderItems) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({ success: false, message: `Product ${item.name} no longer exists` });
      }

      if (product.countInStock < item.qty) {
        return res.status(400).json({
          success: false,
          message: `Insufficient inventory for ${product.name}. Available: ${product.countInStock}`,
        });
      }

      itemsPrice += product.price * item.qty;
      validatedItems.push({
        product: product._id,
        name: product.name,
        image: product.images[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=400&q=80',
        price: product.price,
        qty: item.qty,
      });

      // Decrement stock
      product.countInStock -= item.qty;
      await product.save();
    }

    // Handle discounts
    let discountAmount = 0;
    if (couponCode) {
      const coupon = await Coupon.findOne({ code: couponCode.toUpperCase(), isActive: true });
      if (coupon && coupon.expiresAt > new Date() && itemsPrice >= coupon.minOrderValue) {
        if (coupon.discountType === 'percentage') {
          discountAmount = (itemsPrice * coupon.discountValue) / 100;
          if (coupon.maxDiscount && discountAmount > coupon.maxDiscount) {
            discountAmount = coupon.maxDiscount;
          }
        } else {
          discountAmount = coupon.discountValue;
        }
        coupon.usageCount += 1;
        await coupon.save();
      }
    }

    // Tax (8%) and Shipping (Free over $100, else $10)
    const taxableAmount = Math.max(0, itemsPrice - discountAmount);
    const taxPrice = Number((taxableAmount * 0.08).toFixed(2));
    const shippingPrice = itemsPrice > 100 ? 0 : 10;
    const totalPrice = Number((taxableAmount + taxPrice + shippingPrice).toFixed(2));

    const order = await Order.create({
      user: req.user._id,
      orderItems: validatedItems,
      shippingAddress,
      paymentMethod,
      itemsPrice: Number(itemsPrice.toFixed(2)),
      taxPrice,
      shippingPrice,
      discountAmount: Number(discountAmount.toFixed(2)),
      totalPrice,
      isPaid: paymentMethod === 'Credit Card' || paymentMethod === 'Stripe', // Simulated auto-pay for cards
      paidAt: paymentMethod === 'Credit Card' || paymentMethod === 'Stripe' ? new Date() : null,
      status: 'Processing',
    });

    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      order,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get order by ID
// @route   GET /api/v1/orders/:id
export const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email phone')
      .populate('orderItems.product', 'slug');

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Check if user owns order or is admin
    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to view this order' });
    }

    res.status(200).json({ success: true, order });
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged in user orders
// @route   GET /api/v1/orders/myorders
export const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: orders.length, orders });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all orders (Admin)
// @route   GET /api/v1/orders
export const getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({})
      .populate('user', 'id name email')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: orders.length, orders });
  } catch (error) {
    next(error);
  }
};

// @desc    Update order status (Admin)
// @route   PUT /api/v1/orders/:id/status
export const updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    order.status = status;
    if (status === 'Delivered') {
      order.deliveredAt = new Date();
    }
    if (status === 'Cancelled') {
      // Restore inventory
      for (const item of order.orderItems) {
        await Product.findByIdAndUpdate(item.product, {
          $inc: { countInStock: item.qty },
        });
      }
    }

    await order.save();
    res.status(200).json({ success: true, message: 'Order status updated', order });
  } catch (error) {
    next(error);
  }
};
