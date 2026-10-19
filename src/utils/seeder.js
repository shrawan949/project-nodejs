import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import User from '../models/User.js';
import Product from '../models/Product.js';
import Category from '../models/Category.js';
import Coupon from '../models/Coupon.js';
import Order from '../models/Order.js';

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/nexus_ecommerce';

const categoriesData = [
  {
    name: 'Electronics & Gadgets',
    icon: 'laptop',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80',
    description: 'Next-gen audio, smart accessories, and cutting-edge tech gear.',
  },
  {
    name: 'Fashion & Apparel',
    icon: 'tshirt',
    image: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=600&q=80',
    description: 'Contemporary streetwear, timeless classics, and designer footwear.',
  },
  {
    name: 'Home & Kitchen',
    icon: 'home',
    image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=600&q=80',
    description: 'Elevate your living spaces with premium interior and culinary tools.',
  },
  {
    name: 'Fitness & Outdoors',
    icon: 'dumbbell',
    image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=600&q=80',
    description: 'High-performance gym gear, adventure apparel, and wellness devices.',
  },
];

const productsData = [
  {
    name: 'AcousticPro Wireless ANC Headphones',
    price: 299.99,
    compareAtPrice: 349.99,
    category: 'Electronics & Gadgets',
    brand: 'SonicPeak',
    countInStock: 25,
    isFeatured: true,
    description: 'Engineered with 45mm custom dynamic neodymium drivers and hybrid active noise cancellation, the AcousticPro delivers studio-grade acoustics, 40-hour battery life, and ultra-plush memory foam comfort for all-day listening.',
    shortDescription: 'Studio-quality wireless headphones with hybrid ANC and 40h battery.',
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=800&q=80',
    ],
    rating: 4.9,
    numReviews: 18,
    tags: ['audio', 'wireless', 'noise-cancelling', 'bestseller'],
  },
  {
    name: 'Chronos Titanium Smartwatch Series 7',
    price: 399.00,
    compareAtPrice: 449.00,
    category: 'Electronics & Gadgets',
    brand: 'Chronos',
    countInStock: 14,
    isFeatured: true,
    description: 'Crafted from aerospace-grade titanium with a scratch-resistant sapphire crystal AMOLED display. Features ECG monitoring, sleep staging, dual-band GPS, and 50m water resistance.',
    shortDescription: 'Aerospace-grade titanium smartwatch with health monitoring and GPS.',
    images: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=800&q=80',
    ],
    rating: 4.8,
    numReviews: 24,
    tags: ['smartwatch', 'titanium', 'fitness'],
  },
  {
    name: 'Minimalist Artisan Leather Backpack',
    price: 189.50,
    compareAtPrice: 220.00,
    category: 'Fashion & Apparel',
    brand: 'Vanguard Heritage',
    countInStock: 18,
    isFeatured: true,
    description: 'Handcrafted from full-grain vegetable-tanned leather. Features a dedicated padded 16-inch laptop compartment, hidden anti-theft passport pocket, and solid brass hardware.',
    shortDescription: 'Full-grain artisan leather backpack with 16" laptop sleeve.',
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?auto=format&fit=crop&w=800&q=80',
    ],
    rating: 4.7,
    numReviews: 12,
    tags: ['leather', 'bag', 'travel', 'fashion'],
  },
  {
    name: 'BaristaTouch Precision Espresso Machine',
    price: 649.99,
    compareAtPrice: 729.99,
    category: 'Home & Kitchen',
    brand: 'CremaMaster',
    countInStock: 8,
    isFeatured: true,
    description: 'Commercial-grade PID digital temperature control, dual thermoblock heating system, 15-bar Italian pressure pump, and microfoam steam wand for café-quality latte art at home.',
    shortDescription: 'Precision dual-thermoblock espresso machine with digital PID control.',
    images: [
      'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1570968915860-54d5c301fa9f?auto=format&fit=crop&w=800&q=80',
    ],
    rating: 5.0,
    numReviews: 9,
    tags: ['coffee', 'kitchen', 'espresso', 'premium'],
  },
  {
    name: 'Velocity Aero Carbon Road Running Shoes',
    price: 175.00,
    compareAtPrice: 195.00,
    category: 'Fitness & Outdoors',
    brand: 'ApexKinetics',
    countInStock: 30,
    isFeatured: false,
    description: 'Ultra-responsive nitrogen-infused foam midsole embedded with a full-length carbon fiber propulsion plate. Engineered for marathon PB seekers and high-tempo road training.',
    shortDescription: 'Carbon-plated marathon racing shoes with nitrogen foam cushion.',
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&q=80',
    ],
    rating: 4.6,
    numReviews: 15,
    tags: ['running', 'shoes', 'carbon-plate', 'fitness'],
  },
  {
    name: 'ErgoComfort Mechanical Gaming Keyboard',
    price: 139.99,
    compareAtPrice: 169.99,
    category: 'Electronics & Gadgets',
    brand: 'NexusTech',
    countInStock: 42,
    isFeatured: false,
    description: 'Hot-swappable tactile mechanical switches, per-key RGB backlighting, sound-dampening acoustic silicone gaskets, and an anodized CNC aluminum top case.',
    shortDescription: 'Custom gasket-mounted RGB mechanical keyboard with hot-swap switches.',
    images: [
      'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80',
    ],
    rating: 4.8,
    numReviews: 21,
    tags: ['keyboard', 'gaming', 'mechanical', 'rgb'],
  },
  {
    name: 'Lumina Smart Ambient Studio Lamp',
    price: 89.00,
    compareAtPrice: 110.00,
    category: 'Home & Kitchen',
    brand: 'Lumina',
    countInStock: 19,
    isFeatured: false,
    description: '16 million colors with dynamic audio sync, touch sliding brightness controls, wireless charging base for smartphones, and Matter/Apple HomeKit smart home integration.',
    shortDescription: 'RGB ambient lamp with wireless phone charger and smart home control.',
    images: [
      'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80',
    ],
    rating: 4.5,
    numReviews: 8,
    tags: ['lighting', 'smart-home', 'interior'],
  },
  {
    name: 'Summit Waterproof Tactical Duffel 55L',
    price: 119.95,
    compareAtPrice: 139.95,
    category: 'Fitness & Outdoors',
    brand: 'ApexKinetics',
    countInStock: 12,
    isFeatured: false,
    description: 'Built with rugged 1000D TPU laminated nylon. 100% waterproof submerged seams, detachable ergonomic shoulder straps, and modular MOLLE attachment loops.',
    shortDescription: 'Submersible 55L waterproof duffel bag for extreme expeditions.',
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80',
    ],
    rating: 4.9,
    numReviews: 11,
    tags: ['outdoor', 'waterproof', 'duffel', 'travel'],
  },
];

const couponsData = [
  {
    code: 'WELCOME10',
    discountType: 'percentage',
    discountValue: 10,
    minOrderValue: 50,
    expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
  },
  {
    code: 'SUPER50',
    discountType: 'fixed',
    discountValue: 50,
    minOrderValue: 200,
    expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
  },
  {
    code: 'NEXUS20',
    discountType: 'percentage',
    discountValue: 20,
    minOrderValue: 100,
    expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
  },
];

const seedData = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('🌱 Connected to database for seeding...');

    // Clear old data
    await User.deleteMany();
    await Product.deleteMany();
    await Category.deleteMany();
    await Coupon.deleteMany();
    await Order.deleteMany();
    console.log('🧹 Purged existing collections.');

    // Seed Users
    const admin = await User.create({
      name: 'Nexus Admin',
      email: process.env.ADMIN_EMAIL || 'admin@nexus-shop.com',
      password: process.env.ADMIN_PASSWORD || 'AdminSecure2026!',
      role: 'admin',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80',
    });

    const customer1 = await User.create({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'Customer123!',
      role: 'customer',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
      address: {
        street: '742 Evergreen Terrace',
        city: 'Springfield',
        state: 'OR',
        postalCode: '97477',
        country: 'United States',
      },
    });

    console.log('👤 Seeded users: Admin and Customer accounts.');

    // Seed Categories
    await Category.insertMany(categoriesData);
    console.log(`📁 Seeded ${categoriesData.length} product categories.`);

    // Seed Products
    const createdProducts = await Product.insertMany(productsData);
    console.log(`📦 Seeded ${createdProducts.length} high-level products.`);

    // Seed Coupons
    await Coupon.insertMany(couponsData);
    console.log(`🎟️ Seeded ${couponsData.length} active coupons (WELCOME10, SUPER50, NEXUS20).`);

    // Seed sample orders for Admin analytics
    await Order.create({
      user: customer1._id,
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
        fullName: 'John Doe',
        street: '742 Evergreen Terrace',
        city: 'Springfield',
        state: 'OR',
        postalCode: '97477',
        country: 'United States',
        phone: '+1 555-0199',
      },
      paymentMethod: 'Credit Card',
      itemsPrice: createdProducts[0].price,
      taxPrice: 24.0,
      shippingPrice: 0.0,
      discountAmount: 0.0,
      totalPrice: createdProducts[0].price + 24.0,
      isPaid: true,
      paidAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      status: 'Delivered',
      deliveredAt: new Date(),
    });

    console.log('💳 Seeded sample completed orders.');
    console.log(`
=============================================================
✨ DATABASE SEEDING COMPLETED SUCCESSFULLY!
🔑 Admin Credentials:
   Email:    admin@nexus-shop.com
   Password: AdminSecure2026!

👤 Customer Credentials:
   Email:    john@example.com
   Password: Customer123!
=============================================================
    `);
    process.exit(0);
  } catch (error) {
    console.error(`❌ Seeding failed: ${error.message}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  // Destroy only
  mongoose.connect(MONGO_URI).then(async () => {
    await User.deleteMany();
    await Product.deleteMany();
    await Category.deleteMany();
    await Coupon.deleteMany();
    await Order.deleteMany();
    console.log('💥 All database data purged!');
    process.exit(0);
  });
} else {
  seedData();
}
