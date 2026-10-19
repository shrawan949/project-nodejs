export const sampleCategories = [
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

export const sampleProducts = [
  {
    _id: '6712a101b234567890abcdef',
    name: 'AcousticPro Wireless ANC Headphones',
    slug: 'acousticpro-wireless-anc-headphones',
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
    sku: 'NEX-882104',
    reviews: [
      { name: 'Marcus Sterling', rating: 5, comment: 'Incredible soundstage and ANC! Better than Sony WH-1000XM5.', createdAt: new Date() },
      { name: 'Elena Rostova', rating: 5, comment: 'The memory foam earcups make these wearable for 8 hours without fatigue.', createdAt: new Date() }
    ]
  },
  {
    _id: '6712a102b234567890abcdef',
    name: 'Chronos Titanium Smartwatch Series 7',
    slug: 'chronos-titanium-smartwatch-series-7',
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
    sku: 'NEX-992105',
    reviews: [
      { name: 'David Kim', rating: 5, comment: 'Battery lasts 6 days on a single charge with GPS enabled. Outstanding build.', createdAt: new Date() }
    ]
  },
  {
    _id: '6712a103b234567890abcdef',
    name: 'Minimalist Artisan Leather Backpack',
    slug: 'minimalist-artisan-leather-backpack',
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
    sku: 'NEX-442106',
    reviews: []
  },
  {
    _id: '6712a104b234567890abcdef',
    name: 'BaristaTouch Precision Espresso Machine',
    slug: 'baristatouch-precision-espresso-machine',
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
    sku: 'NEX-772107',
    reviews: []
  },
  {
    _id: '6712a105b234567890abcdef',
    name: 'Velocity Aero Carbon Road Running Shoes',
    slug: 'velocity-aero-carbon-road-running-shoes',
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
    sku: 'NEX-112108',
    reviews: []
  },
  {
    _id: '6712a106b234567890abcdef',
    name: 'ErgoComfort Mechanical Gaming Keyboard',
    slug: 'ergocomfort-mechanical-gaming-keyboard',
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
    sku: 'NEX-332109',
    reviews: []
  },
  {
    _id: '6712a107b234567890abcdef',
    name: 'Lumina Smart Ambient Studio Lamp',
    slug: 'lumina-smart-ambient-studio-lamp',
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
    sku: 'NEX-552110',
    reviews: []
  },
  {
    _id: '6712a108b234567890abcdef',
    name: 'Summit Waterproof Tactical Duffel 55L',
    slug: 'summit-waterproof-tactical-duffel-55l',
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
    sku: 'NEX-662111',
    reviews: []
  },
];

export const sampleAdminStats = {
  totalRevenue: 24890.50,
  totalOrders: 142,
  totalProducts: sampleProducts.length,
  totalUsers: 89,
};

export const sampleOrders = [
  {
    _id: '6712a201b234567890abcdef',
    orderNumber: 'ORD-991204-582',
    user: { name: 'Sophia Chen', email: 'sophia@example.com' },
    orderItems: [
      { name: 'AcousticPro Wireless ANC Headphones', price: 299.99, qty: 1, image: sampleProducts[0].images[0] }
    ],
    shippingAddress: { fullName: 'Sophia Chen', city: 'Seattle', country: 'United States' },
    paymentMethod: 'Credit Card',
    totalPrice: 323.99,
    isPaid: true,
    status: 'Delivered',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
  },
  {
    _id: '6712a202b234567890abcdef',
    orderNumber: 'ORD-881205-319',
    user: { name: 'Liam Walker', email: 'liam@example.com' },
    orderItems: [
      { name: 'Chronos Titanium Smartwatch Series 7', price: 399.00, qty: 1, image: sampleProducts[1].images[0] }
    ],
    shippingAddress: { fullName: 'Liam Walker', city: 'Austin', country: 'United States' },
    paymentMethod: 'Stripe',
    totalPrice: 430.92,
    isPaid: true,
    status: 'Processing',
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000)
  }
];

export const sampleUsers = [
  {
    _id: '6712a301b234567890abcdef',
    name: 'Nexus Admin',
    email: 'admin@nexus-shop.com',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80',
    isActive: true,
    createdAt: new Date('2026-01-01')
  },
  {
    _id: '6712a302b234567890abcdef',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'customer',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
    isActive: true,
    createdAt: new Date('2026-02-15')
  }
];
