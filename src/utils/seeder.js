import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import User from '../models/User.js';
import Product from '../models/Product.js';
import Category from '../models/Category.js';
import Coupon from '../models/Coupon.js';
import Order from '../models/Order.js';
import Brand from '../models/Brand.js';
import Address from '../models/Address.js';
import Cart from '../models/Cart.js';

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/nexus_ecommerce';

// ──────────────────────────────────────────────
// BRANDS DATA
// ──────────────────────────────────────────────
const brandsData = [
  { name: 'SonicPeak', description: 'Premium audio engineering and sound equipment.', logo: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?auto=format&fit=crop&w=200&q=80' },
  { name: 'Chronos', description: 'Luxury smartwatches and wearable technology.', logo: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=200&q=80' },
  { name: 'Vanguard Heritage', description: 'Handcrafted leather goods and accessories.', logo: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?auto=format&fit=crop&w=200&q=80' },
  { name: 'CremaMaster', description: 'Professional-grade coffee and kitchen appliances.', logo: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=200&q=80' },
  { name: 'ApexKinetics', description: 'High-performance athletic and outdoor gear.', logo: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=200&q=80' },
  { name: 'NexusTech', description: 'Cutting-edge computer peripherals and accessories.', logo: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=200&q=80' },
  { name: 'Lumina', description: 'Smart lighting and ambient home products.', logo: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=200&q=80' },
  { name: 'UrbanCraft', description: 'Contemporary urban fashion and streetwear.', logo: 'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=200&q=80' },
  { name: 'TechVault', description: 'Premium smartphones, tablets and accessories.', logo: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=200&q=80' },
  { name: 'AquaForce', description: 'Water sports and marine equipment.', logo: 'https://images.unsplash.com/photo-1530053969600-caed2596d242?auto=format&fit=crop&w=200&q=80' },
  { name: 'PixelPro', description: 'Photography and videography equipment.', logo: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=200&q=80' },
  { name: 'GreenLeaf', description: 'Organic and natural food products.', logo: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=200&q=80' },
  { name: 'SwiftGear', description: 'Cycling and automotive accessories.', logo: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?auto=format&fit=crop&w=200&q=80' },
  { name: 'NovaFit', description: 'Smart fitness equipment and wellness trackers.', logo: 'https://images.unsplash.com/photo-1576678927484-cc907957088c?auto=format&fit=crop&w=200&q=80' },
  { name: 'ZenBrew', description: 'Artisan teas, coffees, and brewing accessories.', logo: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=200&q=80' },
  { name: 'CloudNine', description: 'Premium bedding, pillows, and sleep products.', logo: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=200&q=80' },
  { name: 'IronForge', description: 'Durable tools, hardware, and outdoor equipment.', logo: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=200&q=80' },
  { name: 'SilkTouch', description: 'Premium skincare and beauty products.', logo: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=200&q=80' },
  { name: 'BrightStar', description: 'Educational toys and learning games.', logo: 'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?auto=format&fit=crop&w=200&q=80' },
  { name: 'PureFusion', description: 'Health supplements and organic beverages.', logo: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=200&q=80' },
];

// ──────────────────────────────────────────────
// CATEGORIES DATA (with parent hierarchy)
// ──────────────────────────────────────────────
const mainCategories = [
  { name: 'Electronics & Gadgets', icon: 'laptop', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80', description: 'Next-gen audio, smart accessories, and cutting-edge tech gear.', order: 1 },
  { name: 'Smartphones & Tablets', icon: 'mobile-alt', image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80', description: 'Latest smartphones, tablets, and mobile accessories.', order: 2 },
  { name: 'Fashion & Apparel', icon: 'tshirt', image: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=600&q=80', description: 'Contemporary streetwear, timeless classics, and designer footwear.', order: 3 },
  { name: 'Bags & Luggage', icon: 'suitcase', image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80', description: 'Premium backpacks, handbags, and travel luggage.', order: 4 },
  { name: 'Home & Kitchen', icon: 'home', image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=600&q=80', description: 'Elevate your living spaces with premium interior and culinary tools.', order: 5 },
  { name: 'Beauty & Personal Care', icon: 'spa', image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=600&q=80', description: 'Premium skincare, haircare, and grooming essentials.', order: 6 },
  { name: 'Fitness & Outdoors', icon: 'dumbbell', image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=600&q=80', description: 'High-performance gym gear, adventure apparel, and wellness devices.', order: 7 },
  { name: 'Books & Stationery', icon: 'book', image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&q=80', description: 'Bestselling books, journals, and premium office supplies.', order: 8 },
  { name: 'Toys & Games', icon: 'gamepad', image: 'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?auto=format&fit=crop&w=600&q=80', description: 'Fun for all ages — board games, educational toys, and collectibles.', order: 9 },
  { name: 'Grocery & Essentials', icon: 'shopping-basket', image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80', description: 'Organic foods, beverages, and daily household essentials.', order: 10 },
  { name: 'Automotive & Travel', icon: 'car', image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0afa?auto=format&fit=crop&w=600&q=80', description: 'Car accessories, travel gear, and safety equipment.', order: 11 },
  { name: 'Sports & Recreation', icon: 'futbol', image: 'https://images.unsplash.com/photo-1461896836934-bd45ba8fcf9b?auto=format&fit=crop&w=600&q=80', description: 'Team sports gear, cycling, and water sports equipment.', order: 12 },
];

const subCategoryMap = {
  'Electronics & Gadgets': ['Headphones & Speakers', 'Smartwatches & Wearables', 'Computer Accessories'],
  'Smartphones & Tablets': ['Smartphones', 'Tablets', 'Phone Accessories'],
  'Fashion & Apparel': ["Men's Clothing", "Women's Clothing", 'Footwear'],
  'Bags & Luggage': ['Backpacks', 'Handbags', 'Travel Luggage'],
  'Home & Kitchen': ['Kitchen Appliances', 'Home Decor', 'Lighting'],
  'Beauty & Personal Care': ['Skincare', 'Haircare', 'Grooming'],
  'Fitness & Outdoors': ['Exercise Equipment', 'Running & Training', 'Outdoor Gear'],
  'Books & Stationery': ['Fiction', 'Non-Fiction', 'Office Supplies'],
  'Toys & Games': ['Board Games', 'Educational Toys', 'Action Figures'],
  'Grocery & Essentials': ['Organic Foods', 'Beverages', 'Household Supplies'],
  'Automotive & Travel': ['Car Accessories', 'Travel Accessories', 'Safety Equipment'],
  'Sports & Recreation': ['Team Sports', 'Cycling', 'Water Sports'],
};

// ──────────────────────────────────────────────
// PRODUCTS DATA (65 products)
// ──────────────────────────────────────────────
const productsData = [
  // ─── Electronics & Gadgets ───
  {
    name: 'AcousticPro Wireless ANC Headphones',
    price: 299.99, compareAtPrice: 349.99,
    category: 'Electronics & Gadgets', brand: 'SonicPeak',
    countInStock: 25, isFeatured: true,
    description: 'Engineered with 45mm custom dynamic neodymium drivers and hybrid active noise cancellation, the AcousticPro delivers studio-grade acoustics, 40-hour battery life, and ultra-plush memory foam comfort.',
    shortDescription: 'Studio-quality wireless headphones with hybrid ANC and 40h battery.',
    images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=800&q=80'],
    rating: 4.9, numReviews: 42, tags: ['audio', 'wireless', 'noise-cancelling', 'bestseller'],
    specifications: [{ key: 'Driver Size', value: '45mm' }, { key: 'Battery Life', value: '40 hours' }, { key: 'Weight', value: '265g' }, { key: 'Connectivity', value: 'Bluetooth 5.3' }],
  },
  {
    name: 'SonicPeak Portable Bluetooth Speaker',
    price: 129.99, compareAtPrice: 159.99,
    category: 'Electronics & Gadgets', brand: 'SonicPeak',
    countInStock: 38, isFeatured: false,
    description: 'Waterproof IPX7 portable speaker with 360-degree immersive sound. Features 20-hour playback, built-in microphone for calls, and rugged silicone housing for outdoor adventures.',
    shortDescription: 'Waterproof 360° Bluetooth speaker with 20h battery life.',
    images: ['https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=800&q=80'],
    rating: 4.6, numReviews: 28, tags: ['speaker', 'bluetooth', 'waterproof', 'portable'],
    specifications: [{ key: 'Waterproof Rating', value: 'IPX7' }, { key: 'Battery Life', value: '20 hours' }, { key: 'Weight', value: '580g' }],
  },
  {
    name: 'Chronos Titanium Smartwatch Series 7',
    price: 399.00, compareAtPrice: 449.00,
    category: 'Electronics & Gadgets', brand: 'Chronos',
    countInStock: 14, isFeatured: true,
    description: 'Crafted from aerospace-grade titanium with a scratch-resistant sapphire crystal AMOLED display. Features ECG monitoring, sleep staging, dual-band GPS, and 50m water resistance.',
    shortDescription: 'Aerospace-grade titanium smartwatch with health monitoring and GPS.',
    images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=800&q=80'],
    rating: 4.8, numReviews: 35, tags: ['smartwatch', 'titanium', 'fitness', 'bestseller'],
    specifications: [{ key: 'Display', value: '1.9" AMOLED' }, { key: 'Water Resistance', value: '50m' }, { key: 'Battery', value: '72 hours' }, { key: 'Material', value: 'Titanium' }],
  },
  {
    name: 'ErgoComfort Mechanical Gaming Keyboard',
    price: 139.99, compareAtPrice: 169.99,
    category: 'Electronics & Gadgets', brand: 'NexusTech',
    countInStock: 42, isFeatured: false,
    description: 'Hot-swappable tactile mechanical switches, per-key RGB backlighting, sound-dampening acoustic silicone gaskets, and an anodized CNC aluminum top case.',
    shortDescription: 'Custom gasket-mounted RGB mechanical keyboard with hot-swap switches.',
    images: ['https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80'],
    rating: 4.8, numReviews: 21, tags: ['keyboard', 'gaming', 'mechanical', 'rgb'],
    specifications: [{ key: 'Switch Type', value: 'Mechanical Tactile' }, { key: 'Backlight', value: 'Per-key RGB' }, { key: 'Layout', value: '75% Compact' }],
  },
  {
    name: 'NexusTech Wireless Ergonomic Mouse',
    price: 79.99, compareAtPrice: 99.99,
    category: 'Electronics & Gadgets', brand: 'NexusTech',
    countInStock: 55, isFeatured: false,
    description: 'Sculpted vertical ergonomic design with 4000 DPI optical sensor, USB-C rechargeable battery lasting 90 days, and programmable silent-click buttons for distraction-free work.',
    shortDescription: 'Vertical ergonomic mouse with 90-day battery and silent clicks.',
    images: ['https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=800&q=80'],
    rating: 4.5, numReviews: 18, tags: ['mouse', 'ergonomic', 'wireless'],
    specifications: [{ key: 'DPI', value: '4000' }, { key: 'Battery Life', value: '90 days' }, { key: 'Connectivity', value: '2.4GHz + Bluetooth' }],
  },
  // ─── Smartphones & Tablets ───
  {
    name: 'TechVault ProMax 15 Smartphone',
    price: 999.99, compareAtPrice: 1099.99,
    category: 'Smartphones & Tablets', brand: 'TechVault',
    countInStock: 20, isFeatured: true,
    description: 'Flagship smartphone with 6.7" 120Hz LTPO OLED display, 200MP quad-camera system with 8K video, 5000mAh silicon-carbon battery with 100W fast charging.',
    shortDescription: '200MP camera flagship with 120Hz display and 100W charging.',
    images: ['https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?auto=format&fit=crop&w=800&q=80'],
    rating: 4.7, numReviews: 48, tags: ['smartphone', '5g', 'camera', 'flagship'],
    specifications: [{ key: 'Display', value: '6.7" LTPO OLED 120Hz' }, { key: 'Camera', value: '200MP + 50MP + 12MP + 10MP' }, { key: 'Battery', value: '5000mAh' }, { key: 'Storage', value: '256GB' }],
  },
  {
    name: 'TechVault Tab Ultra 12.4"',
    price: 649.99, compareAtPrice: 749.99,
    category: 'Smartphones & Tablets', brand: 'TechVault',
    countInStock: 15, isFeatured: true,
    description: 'Productivity powerhouse with 12.4-inch 2K Super AMOLED display, Snapdragon 8 Gen 2, S-Pen included, quad AKG speakers with Dolby Atmos for an immersive experience.',
    shortDescription: '12.4" 2K AMOLED tablet with S-Pen and Dolby Atmos speakers.',
    images: ['https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=800&q=80'],
    rating: 4.6, numReviews: 22, tags: ['tablet', 'productivity', 'stylus'],
    specifications: [{ key: 'Display', value: '12.4" 2K AMOLED' }, { key: 'Processor', value: 'Snapdragon 8 Gen 2' }, { key: 'RAM', value: '12GB' }, { key: 'Storage', value: '256GB' }],
  },
  {
    name: 'Crystal Shield Tempered Glass Screen Protector',
    price: 14.99, compareAtPrice: 19.99,
    category: 'Smartphones & Tablets', brand: 'TechVault',
    countInStock: 200, isFeatured: false,
    description: '9H hardness tempered glass with oleophobic coating. Anti-fingerprint, bubble-free installation kit included. Compatible with most flagship smartphones.',
    shortDescription: '9H tempered glass screen protector with easy install kit.',
    images: ['https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?auto=format&fit=crop&w=800&q=80'],
    rating: 4.3, numReviews: 85, tags: ['accessories', 'screen-protector', 'phone'],
    specifications: [{ key: 'Hardness', value: '9H' }, { key: 'Thickness', value: '0.33mm' }],
  },
  // ─── Fashion & Apparel ───
  {
    name: 'UrbanCraft Premium Cotton Crew Neck Tee',
    price: 39.99, compareAtPrice: 49.99,
    category: 'Fashion & Apparel', brand: 'UrbanCraft',
    countInStock: 80, isFeatured: false,
    description: 'Heavyweight 220 GSM organic cotton t-shirt with reinforced double-stitched seams. Pre-shrunk, enzyme-washed for buttery softness. Available in classic earth tones.',
    shortDescription: '220 GSM organic cotton crew neck with premium construction.',
    images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80'],
    rating: 4.4, numReviews: 32, tags: ['clothing', 'cotton', 'casual', 'men'],
    specifications: [{ key: 'Material', value: '100% Organic Cotton' }, { key: 'Weight', value: '220 GSM' }, { key: 'Fit', value: 'Regular' }],
  },
  {
    name: 'UrbanCraft Slim Fit Chino Pants',
    price: 69.99, compareAtPrice: 89.99,
    category: 'Fashion & Apparel', brand: 'UrbanCraft',
    countInStock: 45, isFeatured: true,
    description: 'Tailored slim-fit chinos crafted from stretch-blend cotton twill. Features a modern tapered leg, hidden coin pocket, and YKK zippers for durability.',
    shortDescription: 'Stretch cotton slim-fit chinos with modern tapered leg.',
    images: ['https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=800&q=80'],
    rating: 4.5, numReviews: 27, tags: ['pants', 'chinos', 'slim-fit', 'men'],
    specifications: [{ key: 'Material', value: '97% Cotton, 3% Elastane' }, { key: 'Fit', value: 'Slim' }, { key: 'Rise', value: 'Mid-rise' }],
  },
  {
    name: 'Velocity Aero Carbon Road Running Shoes',
    price: 175.00, compareAtPrice: 195.00,
    category: 'Fashion & Apparel', brand: 'ApexKinetics',
    countInStock: 30, isFeatured: true,
    description: 'Ultra-responsive nitrogen-infused foam midsole with full-length carbon fiber propulsion plate. Engineered for marathon PB seekers and high-tempo training.',
    shortDescription: 'Carbon-plated marathon racing shoes with nitrogen foam cushion.',
    images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&q=80'],
    rating: 4.6, numReviews: 15, tags: ['running', 'shoes', 'carbon-plate', 'fitness'],
    specifications: [{ key: 'Sole', value: 'Carbon Fiber Plate' }, { key: 'Cushion', value: 'Nitrogen-Infused Foam' }, { key: 'Weight', value: '195g' }, { key: 'Drop', value: '8mm' }],
  },
  {
    name: 'SilkTouch Cashmere Blend Scarf',
    price: 89.99, compareAtPrice: 119.99,
    category: 'Fashion & Apparel', brand: 'SilkTouch',
    countInStock: 35, isFeatured: false,
    description: 'Luxuriously soft 70% cashmere, 30% silk blend scarf. Hand-finished fringed edges, generous 200cm length. Perfect for layering in transitional weather.',
    shortDescription: 'Cashmere-silk blend luxury scarf with hand-finished edges.',
    images: ['https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?auto=format&fit=crop&w=800&q=80'],
    rating: 4.7, numReviews: 14, tags: ['scarf', 'cashmere', 'luxury', 'women'],
    specifications: [{ key: 'Material', value: '70% Cashmere, 30% Silk' }, { key: 'Length', value: '200cm' }, { key: 'Care', value: 'Dry Clean Only' }],
  },
  // ─── Bags & Luggage ───
  {
    name: 'Minimalist Artisan Leather Backpack',
    price: 189.50, compareAtPrice: 220.00,
    category: 'Bags & Luggage', brand: 'Vanguard Heritage',
    countInStock: 18, isFeatured: true,
    description: 'Handcrafted from full-grain vegetable-tanned leather. Features a dedicated padded 16-inch laptop compartment, hidden anti-theft passport pocket, and solid brass hardware.',
    shortDescription: 'Full-grain artisan leather backpack with 16" laptop sleeve.',
    images: ['https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?auto=format&fit=crop&w=800&q=80'],
    rating: 4.7, numReviews: 12, tags: ['leather', 'bag', 'travel', 'fashion'],
    specifications: [{ key: 'Material', value: 'Full-Grain Leather' }, { key: 'Laptop Fit', value: 'Up to 16"' }, { key: 'Capacity', value: '25L' }],
  },
  {
    name: 'Summit Waterproof Tactical Duffel 55L',
    price: 119.95, compareAtPrice: 139.95,
    category: 'Bags & Luggage', brand: 'ApexKinetics',
    countInStock: 12, isFeatured: false,
    description: 'Built with rugged 1000D TPU laminated nylon. 100% waterproof submerged seams, detachable ergonomic shoulder straps, and modular MOLLE attachment loops.',
    shortDescription: 'Submersible 55L waterproof duffel bag for extreme expeditions.',
    images: ['https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?auto=format&fit=crop&w=800&q=80'],
    rating: 4.9, numReviews: 11, tags: ['outdoor', 'waterproof', 'duffel', 'travel'],
    specifications: [{ key: 'Material', value: '1000D TPU Nylon' }, { key: 'Capacity', value: '55L' }, { key: 'Weight', value: '1.2kg' }],
  },
  {
    name: 'Vanguard Heritage Leather Messenger Bag',
    price: 159.99, compareAtPrice: 199.99,
    category: 'Bags & Luggage', brand: 'Vanguard Heritage',
    countInStock: 22, isFeatured: false,
    description: 'Classic leather messenger bag with padded 14-inch laptop compartment, adjustable crossbody strap, magnetic brass closures, and internal organizer pockets.',
    shortDescription: 'Classic leather messenger bag with 14" laptop compartment.',
    images: ['https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=80'],
    rating: 4.5, numReviews: 19, tags: ['bag', 'leather', 'messenger', 'work'],
    specifications: [{ key: 'Material', value: 'Full-Grain Leather' }, { key: 'Laptop Fit', value: '14"' }, { key: 'Dimensions', value: '38 x 28 x 12 cm' }],
  },
  // ─── Home & Kitchen ───
  {
    name: 'BaristaTouch Precision Espresso Machine',
    price: 649.99, compareAtPrice: 729.99,
    category: 'Home & Kitchen', brand: 'CremaMaster',
    countInStock: 8, isFeatured: true,
    description: 'Commercial-grade PID digital temperature control, dual thermoblock heating system, 15-bar Italian pressure pump, and microfoam steam wand for café-quality latte art.',
    shortDescription: 'Precision dual-thermoblock espresso machine with digital PID control.',
    images: ['https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1570968915860-54d5c301fa9f?auto=format&fit=crop&w=800&q=80'],
    rating: 5.0, numReviews: 9, tags: ['coffee', 'kitchen', 'espresso', 'premium'],
    specifications: [{ key: 'Pressure', value: '15 Bar' }, { key: 'Water Tank', value: '2L' }, { key: 'Heating', value: 'Dual Thermoblock PID' }, { key: 'Material', value: 'Stainless Steel' }],
  },
  {
    name: 'Lumina Smart Ambient Studio Lamp',
    price: 89.00, compareAtPrice: 110.00,
    category: 'Home & Kitchen', brand: 'Lumina',
    countInStock: 19, isFeatured: false,
    description: '16 million colors with dynamic audio sync, touch sliding brightness controls, wireless charging base for smartphones, and Matter/Apple HomeKit smart home integration.',
    shortDescription: 'RGB ambient lamp with wireless charger and smart home control.',
    images: ['https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80'],
    rating: 4.5, numReviews: 16, tags: ['lighting', 'smart-home', 'interior'],
    specifications: [{ key: 'Colors', value: '16 Million' }, { key: 'Smart Home', value: 'Matter / HomeKit / Alexa' }, { key: 'Charging', value: 'Qi Wireless 15W' }],
  },
  {
    name: 'CloudNine Memory Foam Pillow Set',
    price: 59.99, compareAtPrice: 79.99,
    category: 'Home & Kitchen', brand: 'CloudNine',
    countInStock: 40, isFeatured: false,
    description: 'Set of 2 premium shredded memory foam pillows with cooling bamboo-derived rayon covers. Adjustable loft — add or remove fill to customize support. CertiPUR-US certified.',
    shortDescription: 'Adjustable memory foam pillows with cooling bamboo covers (set of 2).',
    images: ['https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=800&q=80'],
    rating: 4.4, numReviews: 38, tags: ['bedding', 'pillow', 'memory-foam', 'sleep'],
    specifications: [{ key: 'Fill', value: 'Shredded Memory Foam' }, { key: 'Cover', value: 'Bamboo Rayon' }, { key: 'Quantity', value: '2 Pillows' }, { key: 'Certification', value: 'CertiPUR-US' }],
  },
  {
    name: 'CremaMaster Pour-Over Coffee Dripper Set',
    price: 44.99, compareAtPrice: 54.99,
    category: 'Home & Kitchen', brand: 'CremaMaster',
    countInStock: 32, isFeatured: false,
    description: 'Borosilicate glass carafe with stainless steel reusable filter. Includes precision gooseneck pouring kettle, wooden collar grip, and 100 paper filters. Brews 4 cups.',
    shortDescription: 'Complete pour-over coffee set with glass carafe and gooseneck kettle.',
    images: ['https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&q=80'],
    rating: 4.6, numReviews: 24, tags: ['coffee', 'pour-over', 'kitchen'],
    specifications: [{ key: 'Material', value: 'Borosilicate Glass' }, { key: 'Capacity', value: '600ml (4 cups)' }, { key: 'Filter', value: 'Reusable Stainless Steel' }],
  },
  // ─── Beauty & Personal Care ───
  {
    name: 'SilkTouch Vitamin C Brightening Serum',
    price: 34.99, compareAtPrice: 44.99,
    category: 'Beauty & Personal Care', brand: 'SilkTouch',
    countInStock: 60, isFeatured: true,
    description: '20% L-ascorbic acid vitamin C serum with hyaluronic acid and vitamin E. Clinical-grade formula for reducing dark spots, fine lines, and uneven skin tone. Dermatologist tested.',
    shortDescription: '20% Vitamin C serum with hyaluronic acid for brightening.',
    images: ['https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80'],
    rating: 4.7, numReviews: 52, tags: ['skincare', 'serum', 'vitamin-c', 'brightening'],
    specifications: [{ key: 'Active', value: '20% L-Ascorbic Acid' }, { key: 'Volume', value: '30ml' }, { key: 'Skin Type', value: 'All Skin Types' }],
  },
  {
    name: 'SilkTouch Retinol Night Repair Cream',
    price: 49.99, compareAtPrice: 64.99,
    category: 'Beauty & Personal Care', brand: 'SilkTouch',
    countInStock: 44, isFeatured: false,
    description: 'Advanced retinol 0.5% encapsulated formula with peptide complex and squalane. Targets wrinkles, loss of firmness, and uneven texture while you sleep.',
    shortDescription: 'Retinol 0.5% night cream with peptide complex for anti-aging.',
    images: ['https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=800&q=80'],
    rating: 4.6, numReviews: 29, tags: ['skincare', 'retinol', 'anti-aging', 'night-cream'],
    specifications: [{ key: 'Active', value: '0.5% Encapsulated Retinol' }, { key: 'Volume', value: '50ml' }, { key: 'Usage', value: 'PM only' }],
  },
  {
    name: 'PureFusion Bamboo Charcoal Face Wash',
    price: 18.99, compareAtPrice: 24.99,
    category: 'Beauty & Personal Care', brand: 'PureFusion',
    countInStock: 75, isFeatured: false,
    description: 'Deep-cleansing activated bamboo charcoal gel face wash. Draws out impurities, excess oil, and pollutants. Enriched with tea tree oil and aloe vera. Sulfate-free.',
    shortDescription: 'Activated charcoal gel face wash with tea tree oil.',
    images: ['https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&w=800&q=80'],
    rating: 4.3, numReviews: 41, tags: ['face-wash', 'charcoal', 'grooming'],
    specifications: [{ key: 'Type', value: 'Gel Cleanser' }, { key: 'Volume', value: '150ml' }, { key: 'Key Ingredient', value: 'Activated Charcoal' }],
  },
  // ─── Fitness & Outdoors ───
  {
    name: 'NovaFit Adjustable Dumbbell Set 5-50 lbs',
    price: 349.99, compareAtPrice: 399.99,
    category: 'Fitness & Outdoors', brand: 'NovaFit',
    countInStock: 10, isFeatured: true,
    description: 'Space-saving adjustable dumbbells replacing 15 pairs of weights. Twist-lock selector mechanism for instant weight changes from 5 to 50 lbs per hand. Anti-slip rubber grip.',
    shortDescription: 'Adjustable 5-50 lb dumbbells replacing 15 pairs of weights.',
    images: ['https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80'],
    rating: 4.8, numReviews: 33, tags: ['fitness', 'dumbbell', 'home-gym', 'strength'],
    specifications: [{ key: 'Weight Range', value: '5-50 lbs per dumbbell' }, { key: 'Mechanism', value: 'Twist-Lock Selector' }, { key: 'Material', value: 'Steel + Rubber Grip' }],
  },
  {
    name: 'ApexKinetics Resistance Band Set (5-Pack)',
    price: 29.99, compareAtPrice: 39.99,
    category: 'Fitness & Outdoors', brand: 'ApexKinetics',
    countInStock: 90, isFeatured: false,
    description: 'Professional latex resistance bands in 5 resistance levels from 10-150 lbs. Includes door anchor, ankle straps, foam handles, and carry bag. Perfect for travel workouts.',
    shortDescription: '5-level resistance band set with handles and door anchor.',
    images: ['https://images.unsplash.com/photo-1598289431512-b97b0917affc?auto=format&fit=crop&w=800&q=80'],
    rating: 4.5, numReviews: 47, tags: ['resistance-bands', 'fitness', 'portable', 'training'],
    specifications: [{ key: 'Levels', value: '5 (10-150 lbs total)' }, { key: 'Material', value: 'Natural Latex' }, { key: 'Includes', value: 'Handles, Ankle Straps, Door Anchor, Bag' }],
  },
  {
    name: 'IronForge Camping Hammock with Mosquito Net',
    price: 54.99, compareAtPrice: 69.99,
    category: 'Fitness & Outdoors', brand: 'IronForge',
    countInStock: 28, isFeatured: false,
    description: 'Ultralight parachute nylon hammock with integrated mosquito net. Supports up to 400 lbs. Includes tree straps, carabiners, and stuff sack. Sets up in 60 seconds.',
    shortDescription: 'Ultralight camping hammock with mosquito net and tree straps.',
    images: ['https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=800&q=80'],
    rating: 4.6, numReviews: 36, tags: ['camping', 'hammock', 'outdoor', 'travel'],
    specifications: [{ key: 'Material', value: '210T Parachute Nylon' }, { key: 'Capacity', value: '400 lbs' }, { key: 'Weight', value: '680g' }, { key: 'Size', value: '275 x 140 cm' }],
  },
  {
    name: 'NovaFit Smart Jump Rope with LCD Counter',
    price: 24.99, compareAtPrice: 34.99,
    category: 'Fitness & Outdoors', brand: 'NovaFit',
    countInStock: 65, isFeatured: false,
    description: 'Digital smart jump rope with built-in LCD displaying calories, jumps, time, and weight settings. Ball-bearing handles for tangle-free spinning. Adjustable steel cable.',
    shortDescription: 'Smart jump rope with LCD calorie counter and ball-bearing handles.',
    images: ['https://images.unsplash.com/photo-1517963879433-6ad2b056d712?auto=format&fit=crop&w=800&q=80'],
    rating: 4.4, numReviews: 22, tags: ['jump-rope', 'cardio', 'fitness'],
    specifications: [{ key: 'Cable', value: 'Adjustable Steel' }, { key: 'Display', value: 'LCD Counter' }, { key: 'Handle', value: 'Ball-Bearing' }],
  },
  // ─── Books & Stationery ───
  {
    name: 'The Art of Code: Mastering Software Design',
    price: 32.99, compareAtPrice: 39.99,
    category: 'Books & Stationery', brand: 'BrightStar',
    countInStock: 50, isFeatured: false,
    description: 'A comprehensive guide to writing clean, maintainable, and scalable software. Covers design patterns, SOLID principles, testing strategies, and real-world case studies from Silicon Valley.',
    shortDescription: 'Comprehensive guide to clean code and software design patterns.',
    images: ['https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80'],
    rating: 4.8, numReviews: 31, tags: ['book', 'programming', 'software', 'non-fiction'],
    specifications: [{ key: 'Pages', value: '448' }, { key: 'Format', value: 'Hardcover' }, { key: 'Language', value: 'English' }],
  },
  {
    name: 'Premium Dotted Grid Bullet Journal A5',
    price: 19.99, compareAtPrice: 24.99,
    category: 'Books & Stationery', brand: 'BrightStar',
    countInStock: 70, isFeatured: false,
    description: '180 pages of 120 GSM acid-free ivory paper with 5mm dot grid. Lay-flat binding, elastic closure, ribbon bookmark, and back pocket. PU leather cover in midnight blue.',
    shortDescription: 'A5 bullet journal with 120 GSM paper and PU leather cover.',
    images: ['https://images.unsplash.com/photo-1531346878377-a5be20888e57?auto=format&fit=crop&w=800&q=80'],
    rating: 4.6, numReviews: 44, tags: ['journal', 'stationery', 'bullet-journal', 'writing'],
    specifications: [{ key: 'Paper', value: '120 GSM Ivory' }, { key: 'Pages', value: '180' }, { key: 'Size', value: 'A5 (148 x 210mm)' }, { key: 'Grid', value: '5mm Dot' }],
  },
  {
    name: 'Precision Mechanical Pencil Set (0.5mm)',
    price: 15.99, compareAtPrice: 19.99,
    category: 'Books & Stationery', brand: 'BrightStar',
    countInStock: 85, isFeatured: false,
    description: 'Set of 3 premium 0.5mm mechanical pencils with retractable tip, cushioned grip, and built-in eraser. Includes 60 HB lead refills and 3 replacement erasers.',
    shortDescription: 'Premium 0.5mm mechanical pencil set with lead refills.',
    images: ['https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=800&q=80'],
    rating: 4.3, numReviews: 18, tags: ['pencil', 'stationery', 'office'],
    specifications: [{ key: 'Lead Size', value: '0.5mm HB' }, { key: 'Quantity', value: '3 Pencils + 60 Leads' }],
  },
  // ─── Toys & Games ───
  {
    name: 'Strategy Master Chess & Checkers Set',
    price: 49.99, compareAtPrice: 64.99,
    category: 'Toys & Games', brand: 'BrightStar',
    countInStock: 25, isFeatured: false,
    description: 'Magnetic folding chess board with hand-carved wooden pieces. Board doubles as storage case. Includes chess, checkers, and backgammon pieces. Tournament-size 15" board.',
    shortDescription: 'Magnetic 3-in-1 chess set with hand-carved wooden pieces.',
    images: ['https://images.unsplash.com/photo-1529699211952-734e80c4d42b?auto=format&fit=crop&w=800&q=80'],
    rating: 4.7, numReviews: 19, tags: ['chess', 'board-game', 'strategy', 'wooden'],
    specifications: [{ key: 'Board Size', value: '15 inches' }, { key: 'Material', value: 'Wood + Magnets' }, { key: 'Games', value: 'Chess, Checkers, Backgammon' }],
  },
  {
    name: 'BrightStar STEM Robot Building Kit (12-in-1)',
    price: 39.99, compareAtPrice: 49.99,
    category: 'Toys & Games', brand: 'BrightStar',
    countInStock: 35, isFeatured: true,
    description: 'Solar-powered STEM building kit that builds 12 different robots. Teaches engineering, solar energy, and mechanical principles. Ages 8+. No batteries needed.',
    shortDescription: 'Solar-powered 12-in-1 STEM robot building kit for ages 8+.',
    images: ['https://images.unsplash.com/photo-1535378620166-273708d44e4c?auto=format&fit=crop&w=800&q=80'],
    rating: 4.5, numReviews: 27, tags: ['stem', 'educational', 'robot', 'solar'],
    specifications: [{ key: 'Configurations', value: '12 robots' }, { key: 'Power', value: 'Solar' }, { key: 'Age', value: '8+' }, { key: 'Pieces', value: '190' }],
  },
  {
    name: '1000-Piece Scenic Landscape Jigsaw Puzzle',
    price: 22.99, compareAtPrice: 29.99,
    category: 'Toys & Games', brand: 'BrightStar',
    countInStock: 40, isFeatured: false,
    description: 'Premium 1000-piece jigsaw puzzle featuring a stunning mountain lake landscape. Made from recycled cardboard with precision-cut interlocking pieces. Completed size: 70 x 50 cm.',
    shortDescription: '1000-piece mountain landscape puzzle from recycled materials.',
    images: ['https://images.unsplash.com/photo-1494059980473-813e73ee784b?auto=format&fit=crop&w=800&q=80'],
    rating: 4.4, numReviews: 15, tags: ['puzzle', 'jigsaw', 'family', 'hobby'],
    specifications: [{ key: 'Pieces', value: '1000' }, { key: 'Size', value: '70 x 50 cm' }, { key: 'Material', value: 'Recycled Cardboard' }],
  },
  // ─── Grocery & Essentials ───
  {
    name: 'GreenLeaf Organic Raw Honey (500g)',
    price: 12.99, compareAtPrice: 16.99,
    category: 'Grocery & Essentials', brand: 'GreenLeaf',
    countInStock: 95, isFeatured: false,
    description: 'Unfiltered, unpasteurized raw wildflower honey from sustainable apiaries. Rich in natural enzymes, antioxidants, and minerals. Glass jar packaging.',
    shortDescription: 'Raw unfiltered wildflower honey from sustainable apiaries.',
    images: ['https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=800&q=80'],
    rating: 4.8, numReviews: 56, tags: ['honey', 'organic', 'raw', 'natural'],
    specifications: [{ key: 'Weight', value: '500g' }, { key: 'Type', value: 'Raw Wildflower' }, { key: 'Packaging', value: 'Glass Jar' }],
  },
  {
    name: 'PureFusion Organic Green Tea Collection (50 Bags)',
    price: 9.99, compareAtPrice: 14.99,
    category: 'Grocery & Essentials', brand: 'PureFusion',
    countInStock: 120, isFeatured: false,
    description: 'Assorted organic green tea sampler with 5 varieties: Classic Sencha, Jasmine Pearl, Moroccan Mint, Lemongrass Ginger, and Matcha Blend. Individually wrapped.',
    shortDescription: 'Organic green tea sampler with 5 varieties (50 bags).',
    images: ['https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=800&q=80'],
    rating: 4.5, numReviews: 39, tags: ['tea', 'organic', 'green-tea', 'beverage'],
    specifications: [{ key: 'Quantity', value: '50 Bags (5 x 10)' }, { key: 'Certification', value: 'USDA Organic' }, { key: 'Caffeine', value: 'Low to Medium' }],
  },
  {
    name: 'GreenLeaf Extra Virgin Olive Oil (1L)',
    price: 16.99, compareAtPrice: 21.99,
    category: 'Grocery & Essentials', brand: 'GreenLeaf',
    countInStock: 70, isFeatured: false,
    description: 'Cold-pressed extra virgin olive oil from single-estate Mediterranean groves. First harvest, polyphenol-rich with peppery finish. Dark glass bottle to preserve freshness.',
    shortDescription: 'Cold-pressed single-estate EVOO in dark glass bottle.',
    images: ['https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=800&q=80'],
    rating: 4.7, numReviews: 32, tags: ['olive-oil', 'organic', 'cooking', 'mediterranean'],
    specifications: [{ key: 'Volume', value: '1 Liter' }, { key: 'Type', value: 'Extra Virgin, Cold-Pressed' }, { key: 'Origin', value: 'Mediterranean' }],
  },
  // ─── Automotive & Travel ───
  {
    name: 'SwiftGear Magnetic Phone Car Mount',
    price: 24.99, compareAtPrice: 34.99,
    category: 'Automotive & Travel', brand: 'SwiftGear',
    countInStock: 80, isFeatured: false,
    description: 'N52 neodymium magnet car phone mount with adhesive dashboard base and air vent clip. Holds phones up to 1 lb securely. 360-degree rotation. MagSafe compatible.',
    shortDescription: 'N52 magnetic car phone mount with dashboard and vent clip.',
    images: ['https://images.unsplash.com/photo-1549317661-bd32c8ce0afa?auto=format&fit=crop&w=800&q=80'],
    rating: 4.4, numReviews: 43, tags: ['car', 'phone-mount', 'magnetic', 'accessories'],
    specifications: [{ key: 'Magnet', value: 'N52 Neodymium' }, { key: 'Rotation', value: '360°' }, { key: 'Compatibility', value: 'MagSafe + Universal' }],
  },
  {
    name: 'IronForge Compact Car Emergency Kit',
    price: 44.99, compareAtPrice: 59.99,
    category: 'Automotive & Travel', brand: 'IronForge',
    countInStock: 30, isFeatured: false,
    description: '76-piece car emergency kit in zip-up EVA case. Includes jumper cables, tow rope, tire pressure gauge, safety triangle, flashlight, first-aid supplies, and rain poncho.',
    shortDescription: '76-piece car emergency kit with jumper cables and first-aid.',
    images: ['https://images.unsplash.com/photo-1558618666-fcd25c85f82e?auto=format&fit=crop&w=800&q=80'],
    rating: 4.6, numReviews: 21, tags: ['car', 'emergency', 'safety', 'kit'],
    specifications: [{ key: 'Pieces', value: '76' }, { key: 'Includes', value: 'Jumper Cables, Tow Rope, First-Aid' }, { key: 'Case', value: 'EVA Hard Shell' }],
  },
  {
    name: 'SwiftGear RFID Travel Wallet Organizer',
    price: 29.99, compareAtPrice: 39.99,
    category: 'Automotive & Travel', brand: 'SwiftGear',
    countInStock: 50, isFeatured: false,
    description: 'RFID-blocking travel wallet with passport holder, boarding pass slot, SIM card pocket, and pen loop. Water-resistant nylon with YKK zipper. Fits all passport sizes.',
    shortDescription: 'RFID-blocking travel wallet organizer for passports and cards.',
    images: ['https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80'],
    rating: 4.5, numReviews: 28, tags: ['travel', 'wallet', 'rfid', 'organizer'],
    specifications: [{ key: 'Material', value: 'Water-Resistant Nylon' }, { key: 'RFID Protection', value: 'Yes' }, { key: 'Zipper', value: 'YKK' }],
  },
  // ─── Sports & Recreation ───
  {
    name: 'ApexKinetics Professional Yoga Mat 6mm',
    price: 39.99, compareAtPrice: 54.99,
    category: 'Sports & Recreation', brand: 'ApexKinetics',
    countInStock: 45, isFeatured: true,
    description: 'Non-slip TPE yoga mat with alignment guide markings. Dual-layer construction: textured top for grip, smooth bottom for stability. Free carry strap included.',
    shortDescription: 'Non-slip 6mm TPE yoga mat with alignment guides.',
    images: ['https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?auto=format&fit=crop&w=800&q=80'],
    rating: 4.6, numReviews: 34, tags: ['yoga', 'mat', 'fitness', 'exercise'],
    specifications: [{ key: 'Material', value: 'TPE (Eco-Friendly)' }, { key: 'Thickness', value: '6mm' }, { key: 'Size', value: '183 x 61 cm' }],
  },
  {
    name: 'SwiftGear Carbon Fiber Road Bike Helmet',
    price: 89.99, compareAtPrice: 119.99,
    category: 'Sports & Recreation', brand: 'SwiftGear',
    countInStock: 20, isFeatured: false,
    description: 'Aerodynamic road cycling helmet with carbon fiber reinforced EPS shell. 24 vents for optimal airflow, adjustable fit system with dial, removable visor, and magnetic buckle.',
    shortDescription: 'Carbon fiber reinforced cycling helmet with 24 vents.',
    images: ['https://images.unsplash.com/photo-1557803175-2e1a4d5db2f3?auto=format&fit=crop&w=800&q=80'],
    rating: 4.7, numReviews: 17, tags: ['cycling', 'helmet', 'safety', 'carbon'],
    specifications: [{ key: 'Shell', value: 'Carbon Fiber + EPS' }, { key: 'Vents', value: '24' }, { key: 'Weight', value: '240g' }, { key: 'Certification', value: 'CE EN 1078' }],
  },
  {
    name: 'AquaForce Snorkel Mask Full-Face',
    price: 44.99, compareAtPrice: 59.99,
    category: 'Sports & Recreation', brand: 'AquaForce',
    countInStock: 25, isFeatured: false,
    description: '180° panoramic full-face snorkel mask with anti-fog and anti-leak design. Dry-top snorkel valve prevents water entry. GoPro compatible mount. Silicone seal.',
    shortDescription: '180° panoramic full-face snorkel mask with GoPro mount.',
    images: ['https://images.unsplash.com/photo-1530053969600-caed2596d242?auto=format&fit=crop&w=800&q=80'],
    rating: 4.4, numReviews: 23, tags: ['snorkel', 'water-sports', 'diving', 'swimming'],
    specifications: [{ key: 'View', value: '180° Panoramic' }, { key: 'Valve', value: 'Dry-Top Anti-Leak' }, { key: 'Mount', value: 'GoPro Compatible' }],
  },
  // ─── Additional Products to reach 50+ ───
  {
    name: 'PixelPro Wireless Charging Pad (15W)',
    price: 29.99, compareAtPrice: 39.99,
    category: 'Smartphones & Tablets', brand: 'PixelPro',
    countInStock: 60, isFeatured: false,
    description: 'Qi-certified 15W fast wireless charging pad with LED indicator and foreign object detection. Slim aluminum design with non-slip silicone surface. USB-C powered.',
    shortDescription: '15W Qi wireless charger with slim aluminum design.',
    images: ['https://images.unsplash.com/photo-1586816879360-004f5b0c51e3?auto=format&fit=crop&w=800&q=80'],
    rating: 4.3, numReviews: 35, tags: ['charger', 'wireless', 'qi', 'phone'],
    specifications: [{ key: 'Power', value: '15W Max' }, { key: 'Material', value: 'Aluminum' }, { key: 'Input', value: 'USB-C' }],
  },
  {
    name: 'NexusTech USB-C Hub 7-in-1',
    price: 49.99, compareAtPrice: 64.99,
    category: 'Electronics & Gadgets', brand: 'NexusTech',
    countInStock: 40, isFeatured: false,
    description: '7-in-1 USB-C hub with 4K HDMI, 100W PD pass-through, 2x USB-A 3.0, SD/microSD card readers, and gigabit Ethernet. Aluminum body with braided cable.',
    shortDescription: '7-in-1 USB-C hub with 4K HDMI and 100W PD pass-through.',
    images: ['https://images.unsplash.com/photo-1625842268584-8f3296236a9d?auto=format&fit=crop&w=800&q=80'],
    rating: 4.5, numReviews: 26, tags: ['usb-c', 'hub', 'dock', 'laptop'],
    specifications: [{ key: 'Ports', value: 'HDMI, 2x USB-A, SD, microSD, Ethernet, PD' }, { key: 'HDMI', value: '4K@60Hz' }, { key: 'PD', value: '100W' }],
  },
  {
    name: 'UrbanCraft Merino Wool Quarter-Zip Pullover',
    price: 99.99, compareAtPrice: 129.99,
    category: 'Fashion & Apparel', brand: 'UrbanCraft',
    countInStock: 28, isFeatured: true,
    description: 'Extra-fine 17.5 micron merino wool pullover with moisture-wicking properties. Quarter-zip collar, ribbed cuffs and hem. Temperature-regulating, odor-resistant. Machine washable.',
    shortDescription: 'Extra-fine merino wool quarter-zip pullover, machine washable.',
    images: ['https://images.unsplash.com/photo-1434389677669-e08b4cda3a7a?auto=format&fit=crop&w=800&q=80'],
    rating: 4.7, numReviews: 20, tags: ['merino', 'wool', 'pullover', 'men'],
    specifications: [{ key: 'Material', value: '100% Extra-Fine Merino Wool (17.5μ)' }, { key: 'Care', value: 'Machine Washable' }, { key: 'Weight', value: '280g' }],
  },
  {
    name: 'Lumina LED Desk Lamp with Wireless Charger',
    price: 69.99, compareAtPrice: 89.99,
    category: 'Home & Kitchen', brand: 'Lumina',
    countInStock: 30, isFeatured: false,
    description: 'Minimalist LED desk lamp with 5 brightness levels and 3 color temperatures. Built-in 10W Qi wireless charging base, USB-A charging port, and 45-minute auto-off timer.',
    shortDescription: 'LED desk lamp with Qi wireless charger and USB port.',
    images: ['https://images.unsplash.com/photo-1534353436294-0dbd4bdac845?auto=format&fit=crop&w=800&q=80'],
    rating: 4.5, numReviews: 22, tags: ['lamp', 'desk', 'led', 'wireless-charging'],
    specifications: [{ key: 'Brightness', value: '5 Levels' }, { key: 'Color Temp', value: '3000K-6500K' }, { key: 'Charging', value: '10W Qi + USB-A' }],
  },
  {
    name: 'ZenBrew Matcha Starter Kit',
    price: 34.99, compareAtPrice: 44.99,
    category: 'Grocery & Essentials', brand: 'ZenBrew',
    countInStock: 40, isFeatured: false,
    description: 'Complete matcha ceremony kit with 30g ceremonial-grade matcha powder, bamboo whisk (chasen), bamboo scoop (chashaku), ceramic bowl, and strainer. Sourced from Uji, Japan.',
    shortDescription: 'Japanese ceremonial matcha kit with bamboo whisk and bowl.',
    images: ['https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=800&q=80'],
    rating: 4.8, numReviews: 18, tags: ['matcha', 'tea', 'japanese', 'organic'],
    specifications: [{ key: 'Grade', value: 'Ceremonial' }, { key: 'Origin', value: 'Uji, Kyoto, Japan' }, { key: 'Kit Contents', value: 'Matcha, Whisk, Scoop, Bowl, Strainer' }],
  },
  {
    name: 'NovaFit Smart Body Composition Scale',
    price: 49.99, compareAtPrice: 69.99,
    category: 'Fitness & Outdoors', brand: 'NovaFit',
    countInStock: 35, isFeatured: false,
    description: 'Wi-Fi + Bluetooth body composition scale measuring weight, BMI, body fat %, muscle mass, bone density, water %, and more (13 metrics). Auto-recognizes up to 8 users.',
    shortDescription: 'Smart scale with 13 body metrics, Wi-Fi sync, and app.',
    images: ['https://images.unsplash.com/photo-1576678927484-cc907957088c?auto=format&fit=crop&w=800&q=80'],
    rating: 4.5, numReviews: 29, tags: ['scale', 'smart', 'fitness', 'health'],
    specifications: [{ key: 'Metrics', value: '13 Body Composition Metrics' }, { key: 'Connectivity', value: 'Wi-Fi + Bluetooth' }, { key: 'Users', value: 'Up to 8' }],
  },
  {
    name: 'Vanguard Heritage Leather Card Wallet',
    price: 49.99, compareAtPrice: 64.99,
    category: 'Bags & Luggage', brand: 'Vanguard Heritage',
    countInStock: 55, isFeatured: false,
    description: 'Slim RFID-blocking card wallet in full-grain Italian leather. Holds 8 cards with quick-access front pocket and center cash compartment. Hand-stitched with waxed thread.',
    shortDescription: 'Slim RFID-blocking Italian leather card wallet.',
    images: ['https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=800&q=80'],
    rating: 4.6, numReviews: 33, tags: ['wallet', 'leather', 'rfid', 'slim'],
    specifications: [{ key: 'Material', value: 'Full-Grain Italian Leather' }, { key: 'Cards', value: '8 Slots' }, { key: 'RFID', value: 'Blocking' }],
  },
  {
    name: 'SilkTouch SPF 50+ Daily Moisturizer',
    price: 28.99, compareAtPrice: 37.99,
    category: 'Beauty & Personal Care', brand: 'SilkTouch',
    countInStock: 50, isFeatured: false,
    description: 'Lightweight daily moisturizer with broad-spectrum SPF 50+ PA++++. Niacinamide and hyaluronic acid formula. Non-greasy, no white cast. Suitable for all skin tones.',
    shortDescription: 'SPF 50+ lightweight daily moisturizer with niacinamide.',
    images: ['https://images.unsplash.com/photo-1570194065650-d99fb4d38abc?auto=format&fit=crop&w=800&q=80'],
    rating: 4.7, numReviews: 45, tags: ['sunscreen', 'moisturizer', 'spf', 'skincare'],
    specifications: [{ key: 'SPF', value: '50+ PA++++' }, { key: 'Volume', value: '50ml' }, { key: 'Key Ingredients', value: 'Niacinamide, Hyaluronic Acid' }],
  },
  {
    name: 'SwiftGear Bike Repair Multi-Tool 16-in-1',
    price: 19.99, compareAtPrice: 27.99,
    category: 'Sports & Recreation', brand: 'SwiftGear',
    countInStock: 60, isFeatured: false,
    description: 'Compact 16-in-1 bicycle multi-tool with hex keys, screwdrivers, spoke wrenches, chain breaker, and tire levers. Hardened CrV steel construction with nylon carry pouch.',
    shortDescription: '16-in-1 bike multi-tool with chain breaker and tire levers.',
    images: ['https://images.unsplash.com/photo-1511994298241-608e28f14fde?auto=format&fit=crop&w=800&q=80'],
    rating: 4.5, numReviews: 21, tags: ['cycling', 'tool', 'repair', 'multi-tool'],
    specifications: [{ key: 'Tools', value: '16 Functions' }, { key: 'Material', value: 'CrV Steel' }, { key: 'Weight', value: '195g' }],
  },
  {
    name: 'CloudNine Weighted Blanket 15 lbs',
    price: 79.99, compareAtPrice: 99.99,
    category: 'Home & Kitchen', brand: 'CloudNine',
    countInStock: 18, isFeatured: false,
    description: 'Premium glass bead weighted blanket with 7-layer construction. Breathable cotton outer with microfiber inner layer. Even weight distribution in small pockets. Machine washable duvet cover.',
    shortDescription: '15 lb premium weighted blanket with breathable cotton cover.',
    images: ['https://images.unsplash.com/photo-1631049552057-403cdb8f0658?auto=format&fit=crop&w=800&q=80'],
    rating: 4.6, numReviews: 37, tags: ['blanket', 'weighted', 'sleep', 'relaxation'],
    specifications: [{ key: 'Weight', value: '15 lbs (for 120-180 lb adults)' }, { key: 'Fill', value: 'Premium Glass Beads' }, { key: 'Size', value: '60 x 80 inches' }, { key: 'Care', value: 'Machine Washable Cover' }],
  },
  {
    name: 'PixelPro 4K Webcam with Ring Light',
    price: 89.99, compareAtPrice: 109.99,
    category: 'Electronics & Gadgets', brand: 'PixelPro',
    countInStock: 22, isFeatured: false,
    description: '4K Ultra HD webcam with built-in adjustable ring light (3 brightness levels), dual noise-cancelling microphones, auto-focus, and privacy shutter. USB-C plug and play.',
    shortDescription: '4K webcam with built-in ring light and dual microphones.',
    images: ['https://images.unsplash.com/photo-1587826080692-f439cd0b70da?auto=format&fit=crop&w=800&q=80'],
    rating: 4.5, numReviews: 19, tags: ['webcam', '4k', 'streaming', 'work-from-home'],
    specifications: [{ key: 'Resolution', value: '4K @ 30fps' }, { key: 'Microphone', value: 'Dual Noise-Cancelling' }, { key: 'Light', value: '3-Level Ring Light' }, { key: 'Connection', value: 'USB-C' }],
  },
];

// ──────────────────────────────────────────────
// COUPONS DATA
// ──────────────────────────────────────────────
const couponsData = [
  { code: 'WELCOME10', discountType: 'percentage', discountValue: 10, minOrderValue: 50, expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) },
  { code: 'SUPER50', discountType: 'fixed', discountValue: 50, minOrderValue: 200, expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) },
  { code: 'NEXUS20', discountType: 'percentage', discountValue: 20, minOrderValue: 100, expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) },
  { code: 'FLASH30', discountType: 'percentage', discountValue: 30, minOrderValue: 150, maxDiscount: 200, expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) },
  { code: 'FREESHIP', discountType: 'fixed', discountValue: 10, minOrderValue: 50, expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) },
];

// ──────────────────────────────────────────────
// SEED FUNCTION
// ──────────────────────────────────────────────
const seedData = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('🌱 Connected to database for seeding...');

    // Clear old data
    await Promise.all([
      User.deleteMany(), Product.deleteMany(), Category.deleteMany(),
      Coupon.deleteMany(), Order.deleteMany(), Brand.deleteMany(),
      Address.deleteMany(), Cart.deleteMany(),
    ]);
    console.log('🧹 Purged all existing collections.');

    // ── Seed Users ──
    const admin = await User.create({
      name: 'Nexus Admin', email: process.env.ADMIN_EMAIL || 'admin@nexus-shop.com',
      password: process.env.ADMIN_PASSWORD || 'AdminSecure2026!', role: 'admin',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80',
    });
    const customer1 = await User.create({
      name: 'John Doe', email: 'john@example.com', password: 'Customer123!', role: 'customer',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
    });
    console.log('👤 Seeded users: Admin and Customer accounts.');

    // ── Seed Address for customer ──
    await Address.create({
      user: customer1._id, label: 'Home', fullName: 'John Doe', phone: '+1 555-0199',
      street: '742 Evergreen Terrace', city: 'Springfield', state: 'OR',
      postalCode: '97477', country: 'United States', isDefault: true,
    });
    console.log('📍 Seeded customer address.');

    // ── Seed Brands (generate slugs since insertMany skips pre-save hooks) ──
    const brandsWithSlugs = brandsData.map(b => ({
      ...b,
      slug: b.name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, ''),
    }));
    await Brand.insertMany(brandsWithSlugs);
    console.log(`🏷️  Seeded ${brandsData.length} brands.`);

    // ── Seed Categories (main + subcategories) ──
    const createdMainCategories = [];
    for (const cat of mainCategories) {
      const created = await Category.create(cat);
      createdMainCategories.push(created);
    }
    console.log(`📁 Seeded ${mainCategories.length} main categories.`);

    let subCount = 0;
    for (const mainCat of createdMainCategories) {
      const subs = subCategoryMap[mainCat.name] || [];
      for (const subName of subs) {
        await Category.create({ name: subName, parent: mainCat._id, icon: mainCat.icon });
        subCount++;
      }
    }
    console.log(`📂 Seeded ${subCount} subcategories.`);

    // ── Seed Products (generate slugs/skus since insertMany skips pre-save hooks) ──
    const productsWithSlugs = productsData.map((p, i) => ({
      ...p,
      slug: p.name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '') + '-' + (1000 + i),
      sku: 'NEX-' + String(100000 + i),
    }));
    const createdProducts = await Product.insertMany(productsWithSlugs);
    console.log(`📦 Seeded ${createdProducts.length} products across ${mainCategories.length} categories.`);

    // ── Seed Coupons ──
    await Coupon.insertMany(couponsData);
    console.log(`🎟️  Seeded ${couponsData.length} coupons.`);

    // ── Seed sample order ──
    await Order.create({
      user: customer1._id,
      orderItems: [{
        product: createdProducts[0]._id, name: createdProducts[0].name,
        image: createdProducts[0].images[0], price: createdProducts[0].price, qty: 1,
      }],
      shippingAddress: {
        fullName: 'John Doe', street: '742 Evergreen Terrace', city: 'Springfield',
        state: 'OR', postalCode: '97477', country: 'United States', phone: '+1 555-0199',
      },
      paymentMethod: 'Credit Card',
      itemsPrice: createdProducts[0].price,
      taxPrice: 24.0, shippingPrice: 0.0, discountAmount: 0.0,
      totalPrice: createdProducts[0].price + 24.0,
      isPaid: true, paidAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      status: 'Delivered', deliveredAt: new Date(),
    });
    console.log('💳 Seeded sample completed order.');

    console.log(`
=============================================================
✨ DATABASE SEEDING COMPLETED SUCCESSFULLY!

📊 Summary:
   • ${brandsData.length} Brands
   • ${mainCategories.length} Main Categories + ${subCount} Subcategories
   • ${createdProducts.length} Products
   • ${couponsData.length} Coupons
   • 2 Users (Admin + Customer)
   • 1 Address, 1 Sample Order

🔑 Admin:    admin@nexus-shop.com / AdminSecure2026!
👤 Customer: john@example.com / Customer123!
=============================================================
    `);
    process.exit(0);
  } catch (error) {
    console.error(`❌ Seeding failed: ${error.message}`);
    console.error(error.stack);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  mongoose.connect(MONGO_URI).then(async () => {
    await Promise.all([
      User.deleteMany(), Product.deleteMany(), Category.deleteMany(),
      Coupon.deleteMany(), Order.deleteMany(), Brand.deleteMany(),
      Address.deleteMany(), Cart.deleteMany(),
    ]);
    console.log('💥 All database data purged!');
    process.exit(0);
  });
} else {
  seedData();
}
