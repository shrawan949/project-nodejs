import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import User from '../models/User.js';
import Product from '../models/Product.js';
import Category from '../models/Category.js';
import Coupon from '../models/Coupon.js';
import Order from '../models/Order.js';
import { sampleCategories, sampleProducts } from '../config/sampleData.js';

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/nexus_ecommerce';

const couponsData = [
  {
    code: 'WELCOME10',
    discountType: 'percentage',
    discountValue: 10,
    minOrderValue: 999,
    maxDiscount: 5000,
    expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
  },
  {
    code: 'NEXUS20',
    discountType: 'percentage',
    discountValue: 20,
    minOrderValue: 2999,
    maxDiscount: 10000,
    expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
  },
  {
    code: 'SUPER50',
    discountType: 'fixed',
    discountValue: 1500,
    minOrderValue: 9999,
    expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
  },
];

const seedData = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('🌱 Connected to MongoDB for Indian MegaStore Seeding...');

    // Clear old collections
    await User.deleteMany();
    await Product.deleteMany();
    await Category.deleteMany();
    await Coupon.deleteMany();
    await Order.deleteMany();
    console.log('🧹 Purged existing collections.');

    // Seed Admin and Demo Users
    const admin = await User.create({
      name: 'Nexus Admin India',
      email: process.env.ADMIN_EMAIL || 'admin@nexus-shop.com',
      password: process.env.ADMIN_PASSWORD || 'AdminSecure2026!',
      role: 'admin',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80',
    });

    const customer = await User.create({
      name: 'Shrawan Ambarte',
      email: 'shrawan@example.com',
      password: 'Customer123!',
      role: 'customer',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
      address: {
        street: 'Flat 402, Lotus Residency, MG Road',
        city: 'Mumbai',
        state: 'Maharashtra',
        postalCode: '400001',
        country: 'India',
      },
    });

    console.log('👤 Seeded users: Admin and Customer accounts.');

    // Seed Categories
    await Category.insertMany(sampleCategories);
    console.log(`📁 Seeded ${sampleCategories.length} product departments.`);

    // Seed Products
    const productsToSeed = sampleProducts.map(p => {
      const copy = { ...p };
      delete copy._id;
      return copy;
    });
    const createdProducts = await Product.insertMany(productsToSeed);
    console.log(`📦 Seeded ${createdProducts.length} Samsung, Puma, and Sports products with INR pricing.`);

    // Seed Coupons
    await Coupon.insertMany(couponsData);
    console.log(`🎟️ Seeded ${couponsData.length} active coupons (WELCOME10, NEXUS20, SUPER50).`);

    // Seed sample order
    await Order.create({
      user: customer._id,
      orderItems: [
        {
          product: createdProducts[0]._id,
          name: createdProducts[0].name,
          image: createdProducts[0].images[0],
          price: createdProducts[0].price,
          qty: 1,
        },
      ],
      shippingAddress: {
        fullName: 'Shrawan Ambarte',
        street: 'Flat 402, Lotus Residency, MG Road',
        city: 'Mumbai',
        state: 'Maharashtra',
        postalCode: '400001',
        country: 'India',
        phone: '+91 98765 43210',
      },
      paymentMethod: 'UPI',
      itemsPrice: createdProducts[0].price,
      taxPrice: Math.round(createdProducts[0].price * 0.18),
      shippingPrice: 0.0,
      discountAmount: 0.0,
      totalPrice: createdProducts[0].price + Math.round(createdProducts[0].price * 0.18),
      isPaid: true,
      paidAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      status: 'Delivered',
      deliveredAt: new Date(),
    });

    console.log(`
=============================================================
✨ DATABASE SEEDING COMPLETED SUCCESSFULLY!
🇮🇳 Currency: Indian Rupees (₹ - INR)
🏷️ Featured Brands: Samsung, Puma, Apple, Sony, SS Cricket

🔑 Admin Credentials:
   Email:    admin@nexus-shop.com
   Password: AdminSecure2026!

👤 Customer Credentials:
   Email:    shrawan@example.com
   Password: Customer123!
=============================================================
    `);
    process.exit(0);
  } catch (error) {
    console.error(`❌ Seeding failed: ${error.message}`);
    process.exit(1);
  }
};

seedData();
