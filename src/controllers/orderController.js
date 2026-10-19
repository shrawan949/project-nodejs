import mongoose from 'mongoose';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import Coupon from '../models/Coupon.js';
import { sampleProducts, sampleOrders } from '../config/sampleData.js';

const isDBConnected = () => mongoose.connection.readyState === 1;

// @desc    Create new order
// @route   POST /api/v1/orders
export const createOrder = async (req, res, next) => {
  try {
    const { orderItems, shippingAddress, paymentMethod, couponCode } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ success: false, message: 'No order items found in cart' });
    }

    if (!isDBConnected()) {
      let itemsPrice = 0;
      const validatedItems = [];

      for (const item of orderItems) {
        const prod = sampleProducts.find(p => p._id === item.product || p.slug === item.product) || sampleProducts[0];
        itemsPrice += prod.price * item.qty;
        validatedItems.push({
          product: prod._id,
          name: prod.name,
          image: prod.images[0],
          price: prod.price,
          qty: item.qty,
        });
      }

      let discountAmount = 0;
      if (couponCode && couponCode.toUpperCase() === 'WELCOME10') {
        discountAmount = (itemsPrice * 10) / 100;
      } else if (couponCode && couponCode.toUpperCase() === 'NEXUS20') {
        discountAmount = (itemsPrice * 20) / 100;
      }

      const shippingPrice = itemsPrice > 999 ? 0 : 99;
      const taxableAmount = Math.max(0, itemsPrice - discountAmount);
      const taxPrice = Number((taxableAmount * 0.18).toFixed(2));
      const totalPrice = Number((taxableAmount + taxPrice + shippingPrice).toFixed(2));

      const mockOrder = {
        _id: 'ord_' + Date.now(),
        orderNumber: 'ORD-' + Math.floor(10000 + Math.random() * 90000) + '-IN',
        user: req.user ? req.user._id : 'mock_customer',
        orderItems: validatedItems,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        discountAmount,
        shippingPrice,
        taxPrice,
        totalPrice,
        isPaid: paymentMethod !== 'Cash on Delivery',
        paidAt: paymentMethod !== 'Cash on Delivery' ? new Date() : null,
        status: 'Processing',
        createdAt: new Date(),
      };

      sampleOrders.unshift(mockOrder);

      return res.status(201).json({
        success: true,
        message: 'Order placed successfully',
        order: mockOrder,
      });
    }

    // Database flow
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

      product.countInStock -= item.qty;
      await product.save();
    }

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

    const shippingPrice = itemsPrice > 999 ? 0 : 99;
    const taxableAmount = Math.max(0, itemsPrice - discountAmount);
    const taxPrice = Number((taxableAmount * 0.18).toFixed(2));
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
      isPaid: paymentMethod !== 'Cash on Delivery',
      paidAt: paymentMethod !== 'Cash on Delivery' ? new Date() : null,
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
    if (!isDBConnected()) {
      const order = sampleOrders.find(o => o._id === req.params.id) || sampleOrders[0];
      return res.status(200).json({ success: true, order });
    }

    const order = await Order.findById(req.params.id)
      .populate('user', 'name email phone')
      .populate('orderItems.product', 'slug');

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
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
    if (!isDBConnected()) {
      return res.status(200).json({ success: true, count: sampleOrders.length, orders: sampleOrders });
    }

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
    if (!isDBConnected()) {
      return res.status(200).json({ success: true, count: sampleOrders.length, orders: sampleOrders });
    }

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

    if (!isDBConnected()) {
      const o = sampleOrders.find(item => item._id === req.params.id);
      if (o) o.status = status;
      return res.status(200).json({ success: true, message: `Status updated to ${status}` });
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    order.status = status;
    if (status === 'Delivered') {
      order.deliveredAt = new Date();
    }
    await order.save();
    res.status(200).json({ success: true, message: 'Order status updated', order });
  } catch (error) {
    next(error);
  }
};
