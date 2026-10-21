export const sampleCategories = [
  {
    name: 'TVs & Appliances',
    icon: 'tv',
    image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=600&q=80',
    description: 'Samsung 4K Neo QLED TVs, Smart Washing Machines, and Inverter ACs.',
  },
  {
    name: 'Smartphones & Tablets',
    icon: 'mobile-screen',
    image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=600&q=80',
    description: 'Samsung Galaxy S24 Ultra, iPhones, 5G flagship devices and tablets.',
  },
  {
    name: 'Puma & Footwear',
    icon: 'shoe-prints',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80',
    description: 'Authentic Puma Nitro running shoes, retro sneakers, and casual kicks.',
  },
  {
    name: 'Sportswear & Apparel',
    icon: 'shirt',
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80',
    description: 'Puma T7 tracksuits, breathable gym wear, and active lifestyle apparel.',
  },
  {
    name: 'Sports & Fitness Gear',
    icon: 'volleyball',
    image: 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&w=600&q=80',
    description: 'Cricket kits, footballs, Yonex badminton, gym dumbbells, and treadmills.',
  },
  {
    name: 'Laptops & Tech',
    icon: 'laptop',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80',
    description: 'MacBooks, gaming laptops, noise-cancelling headphones, and audio gear.',
  },
];

export const sampleBrands = ['Samsung', 'Puma', 'Apple', 'Sony', 'LG', 'Yonex', 'SS Cricket'];

export const sampleProducts = [
  // --- SAMSUNG ELECTRONICS & APPLIANCES ---
  {
    _id: '6712b101b234567890abcdef',
    name: 'Samsung 65" Neo QLED 4K Smart TV (QA65QN90D)',
    slug: 'samsung-65-neo-qled-4k-smart-tv',
    price: 149990,
    compareAtPrice: 189990,
    category: 'TVs & Appliances',
    brand: 'Samsung',
    countInStock: 12,
    isFeatured: true,
    description: 'Experience breathtaking clarity with Samsung Quantum Matrix Technology and Neo Quantum HDR+. Features Dolby Atmos 60W 4.2.2Ch audio, 144Hz VRR motion xcelerator, and Neural Quantum Processor 4K for cinema-grade home entertainment.',
    shortDescription: '65-inch 4K Neo QLED with Quantum Matrix, Dolby Atmos, and 144Hz Gaming.',
    images: [
      'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1593784991095-a205069470b6?auto=format&fit=crop&w=800&q=80',
    ],
    rating: 4.9,
    numReviews: 42,
    tags: ['samsung', 'tv', '4k', 'qled', 'bestseller'],
    sku: 'SAM-TV65-Q90',
    reviews: [
      { name: 'Rajesh Sharma', rating: 5, comment: 'Picture quality is phenomenal. Blacks are as deep as OLED with zero burn-in risk. Worth every rupee!', createdAt: new Date() },
      { name: 'Vikram Mehta', rating: 5, comment: 'Delivered and installed next day. 144Hz with PS5 is buttery smooth.', createdAt: new Date() }
    ]
  },
  {
    _id: '6712b102b234567890abcdef',
    name: 'Samsung 8.0 kg AI EcoBubble Front Load Washing Machine',
    slug: 'samsung-8kg-ai-ecobubble-washing-machine',
    price: 36990,
    compareAtPrice: 45990,
    category: 'TVs & Appliances',
    brand: 'Samsung',
    countInStock: 18,
    isFeatured: true,
    description: 'Smart AI Control memorizes your washing habits and suggests optimal cycles. Features EcoBubble technology that cleans thoroughly at low temperatures, Hygiene Steam cycle removing 99.9% of bacteria, and Digital Inverter Motor with 20-year warranty.',
    shortDescription: '8kg AI Control front loader with Hygiene Steam and 20-Year Motor Warranty.',
    images: [
      'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?auto=format&fit=crop&w=800&q=80',
    ],
    rating: 4.8,
    numReviews: 29,
    tags: ['samsung', 'washing-machine', 'home-appliances', 'ecobubble'],
    sku: 'SAM-WM80-AI',
    reviews: [
      { name: 'Pooja Iyer', rating: 5, comment: 'Super silent operation! Uses very little electricity and removes tough collar stains easily.', createdAt: new Date() }
    ]
  },
  {
    _id: '6712b103b234567890abcdef',
    name: 'Samsung Galaxy S24 Ultra 5G (Titanium Gray, 256GB)',
    slug: 'samsung-galaxy-s24-ultra-5g',
    price: 129999,
    compareAtPrice: 134999,
    category: 'Smartphones & Tablets',
    brand: 'Samsung',
    countInStock: 25,
    isFeatured: true,
    description: 'The pinnacle of smartphone engineering. Titanium armor frame, built-in S Pen, 200MP quad telephoto camera system with Galaxy AI photo editing, and Snapdragon 8 Gen 3 for Galaxy processor.',
    shortDescription: 'Flagship with Titanium frame, 200MP camera, built-in S Pen, and Galaxy AI.',
    images: [
      'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=800&q=80',
    ],
    rating: 4.9,
    numReviews: 67,
    tags: ['samsung', 'galaxy', 's24-ultra', 'smartphone', '5g'],
    sku: 'SAM-S24U-256',
    reviews: [
      { name: 'Amit Patel', rating: 5, comment: 'Circle to Search and the 5x optical 50MP zoom camera are game changers for travel photography.', createdAt: new Date() }
    ]
  },
  {
    _id: '6712b104b234567890abcdef',
    name: 'Samsung 253L 3-Star Inverter Double Door Refrigerator',
    slug: 'samsung-253l-double-door-refrigerator',
    price: 24490,
    compareAtPrice: 31990,
    category: 'TVs & Appliances',
    brand: 'Samsung',
    countInStock: 14,
    isFeatured: false,
    description: 'Digital Inverter technology provides automatic cooling adjustment with 50% power savings. Features All-Round Cooling, MoistFresh Zone, toughened glass shelves, and stabilizer-free operation.',
    shortDescription: 'Frost-free double door with digital inverter and All-Round Cooling.',
    images: [
      'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?auto=format&fit=crop&w=800&q=80',
    ],
    rating: 4.7,
    numReviews: 19,
    tags: ['samsung', 'refrigerator', 'kitchen'],
    sku: 'SAM-REF253-3S',
    reviews: []
  },
  {
    _id: '6712b105b234567890abcdef',
    name: 'Samsung WindFree 1.5 Ton 5-Star Inverter Split AC',
    slug: 'samsung-windfree-1-5-ton-split-ac',
    price: 44990,
    compareAtPrice: 58990,
    category: 'TVs & Appliances',
    brand: 'Samsung',
    countInStock: 9,
    isFeatured: false,
    description: 'Eliminates unpleasant direct cold draft through 23,000 micro-air holes. Features AI Auto Cooling, PM 2.5 air filtration, Copper Anti-Bacterial filter, and ultra-energy-efficient Digital Inverter Boost.',
    shortDescription: 'WindFree draughtless cooling with PM 2.5 air purification filter.',
    images: [
      'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=800&q=80',
    ],
    rating: 4.8,
    numReviews: 15,
    tags: ['samsung', 'air-conditioner', 'appliances'],
    sku: 'SAM-AC15-WF',
    reviews: []
  },

  // --- PUMA SPORTSWEAR & SHOES ---
  {
    _id: '6712b106b234567890abcdef',
    name: 'Puma Deviate Nitro 2 Elite Marathon Running Shoes',
    slug: 'puma-deviate-nitro-2-running-shoes',
    price: 11999,
    compareAtPrice: 15999,
    category: 'Puma & Footwear',
    brand: 'Puma',
    countInStock: 35,
    isFeatured: true,
    description: 'Engineered with dual-density NITRO Elite foam and a thermo-formed INNOPLATE carbon composite plate for maximum propulsion and effortless energy return on long distance road runs.',
    shortDescription: 'Carbon-plated elite marathon shoe with dual NITRO foam cushioning.',
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=800&q=80',
    ],
    rating: 4.9,
    numReviews: 38,
    tags: ['puma', 'shoes', 'running', 'carbon-plate', 'bestseller'],
    sku: 'PUM-DEV-NITRO2',
    reviews: [
      { name: 'Kunal Joshi', rating: 5, comment: 'Ran Mumbai Half Marathon with these. Shaved 4 minutes off my personal best! Featherlight and super responsive.', createdAt: new Date() }
    ]
  },
  {
    _id: '6712b107b234567890abcdef',
    name: 'Puma RS-X Efekt Retro Unisex Chunky Sneakers',
    slug: 'puma-rs-x-efekt-retro-sneakers',
    price: 6499,
    compareAtPrice: 8999,
    category: 'Puma & Footwear',
    brand: 'Puma',
    countInStock: 28,
    isFeatured: true,
    description: 'Iconic chunky silhouette featuring Puma Running System technology. Mesh upper with nubuck overlays, rugged angular rubber outsole, and ultra-cushioned PU midsole for streetwear culture.',
    shortDescription: 'Bold retro chunky sneaker with signature RS foam cushioning.',
    images: [
      'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=800&q=80',
    ],
    rating: 4.7,
    numReviews: 24,
    tags: ['puma', 'sneakers', 'streetwear', 'retro'],
    sku: 'PUM-RSX-EFEKT',
    reviews: []
  },
  {
    _id: '6712b108b234567890abcdef',
    name: 'Puma T7 Iconic Tracksuit Set (Jacket + Pants)',
    slug: 'puma-t7-iconic-tracksuit-set',
    price: 4999,
    compareAtPrice: 6999,
    category: 'Sportswear & Apparel',
    brand: 'Puma',
    countInStock: 40,
    isFeatured: true,
    description: 'Straight from the Puma archives. The T7 track jacket and track pants feature the legendary 7cm contrast stripe down the sleeves and legs. Crafted from sustainable recycled poly-cotton blend with ribbed cuffs and full zip.',
    shortDescription: 'Classic vintage tracksuit set with iconic 7cm heritage contrast stripe.',
    images: [
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=800&q=80',
    ],
    rating: 4.8,
    numReviews: 19,
    tags: ['puma', 'tracksuit', 'apparel', 'sportswear'],
    sku: 'PUM-T7-SET',
    reviews: []
  },
  {
    _id: '6712b109b234567890abcdef',
    name: 'Puma Scuderia Ferrari Motorsport Team Polo',
    slug: 'puma-scuderia-ferrari-team-polo',
    price: 3299,
    compareAtPrice: 4499,
    category: 'Sportswear & Apparel',
    brand: 'Puma',
    countInStock: 22,
    isFeatured: false,
    description: 'Official Scuderia Ferrari F1 team collection. Features dryCELL moisture-wicking fabric, authentic Ferrari shield badge on chest, and Italian flag collar accents.',
    shortDescription: 'Official Ferrari F1 Team dryCELL athletic polo shirt.',
    images: [
      'https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&w=800&q=80',
    ],
    rating: 4.9,
    numReviews: 14,
    tags: ['puma', 'ferrari', 'f1', 'polo'],
    sku: 'PUM-SF-POLO',
    reviews: []
  },
  {
    _id: '6712b110b234567890abcdef',
    name: 'Puma Smash v2 Classic Leather Sneakers',
    slug: 'puma-smash-v2-leather-sneakers',
    price: 2799,
    compareAtPrice: 4299,
    category: 'Puma & Footwear',
    brand: 'Puma',
    countInStock: 50,
    isFeatured: false,
    description: 'Tennis-inspired classic silhouette made with soft genuine leather, durable traction rubber outsole, and SoftFoam+ comfort insert for all-day cushioned walking.',
    shortDescription: 'Soft leather tennis sneakers with SoftFoam+ comfort insole.',
    images: [
      'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=800&q=80',
    ],
    rating: 4.6,
    numReviews: 31,
    tags: ['puma', 'sneakers', 'leather', 'everyday'],
    sku: 'PUM-SMASH-V2',
    reviews: []
  },

  // --- SPORTS & FITNESS GEAR ---
  {
    _id: '6712b111b234567890abcdef',
    name: 'SS Ton Professional English Willow Cricket Bat',
    slug: 'ss-ton-english-willow-cricket-bat',
    price: 14999,
    compareAtPrice: 19999,
    category: 'Sports & Fitness Gear',
    brand: 'SS Cricket',
    countInStock: 16,
    isFeatured: true,
    description: 'Handcrafted from Grade 1 air-dried English Willow. Features massive 40mm contoured edges, deep mid-to-low sweet spot, 12-piece Sarawak cane handle, and laser-engraved authenticity hologram.',
    shortDescription: 'Grade 1 English Willow cricket bat with huge sweet spot and cane handle.',
    images: [
      'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=800&q=80',
    ],
    rating: 5.0,
    numReviews: 22,
    tags: ['cricket', 'bat', 'ss', 'sports'],
    sku: 'SS-TON-GRADE1',
    reviews: [
      { name: 'Arjun Singhania', rating: 5, comment: 'Incredible punch and balance. The grain count is 9 straight grains. Perfect bat for match play.', createdAt: new Date() }
    ]
  },
  {
    _id: '6712b112b234567890abcdef',
    name: 'Kookaburra Complete Adult Cricket Kit with Duffle Bag',
    slug: 'kookaburra-complete-cricket-kit',
    price: 18499,
    compareAtPrice: 24999,
    category: 'Sports & Fitness Gear',
    brand: 'Kookaburra',
    countInStock: 10,
    isFeatured: false,
    description: 'Full competition setup including English willow bat, test batting pads, leather batting gloves, titanium reinforced helmet, thigh guard, arm guard, and heavy-duty wheelie duffle bag.',
    shortDescription: 'All-in-one complete professional cricket kit with protective gear.',
    images: [
      'https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&w=800&q=80',
    ],
    rating: 4.8,
    numReviews: 11,
    tags: ['cricket', 'kit', 'sports'],
    sku: 'KB-KIT-FULL',
    reviews: []
  },
  {
    _id: '6712b113b234567890abcdef',
    name: 'Yonex Astrox 99 Pro Badminton Racket (Made in Japan)',
    slug: 'yonex-astrox-99-pro-badminton-racket',
    price: 13490,
    compareAtPrice: 16990,
    category: 'Sports & Fitness Gear',
    brand: 'Yonex',
    countInStock: 20,
    isFeatured: false,
    description: 'Weapon of choice for elite smashers. Head-heavy balance with Rotational Generator System, Namd graphite shaft for explosive snapback, and Volume Cut Resin grommets.',
    shortDescription: 'Head-heavy offensive racket with Namd snapback carbon technology.',
    images: [
      'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=800&q=80',
    ],
    rating: 4.9,
    numReviews: 27,
    tags: ['badminton', 'yonex', 'racket', 'sports'],
    sku: 'YNX-AX99-PRO',
    reviews: []
  },
  {
    _id: '6712b114b234567890abcdef',
    name: 'PowerMax Fitness 3.0 HP Motorized Folding Treadmill',
    slug: 'powermax-motorized-folding-treadmill',
    price: 28990,
    compareAtPrice: 42000,
    category: 'Sports & Fitness Gear',
    brand: 'PowerMax',
    countInStock: 7,
    isFeatured: true,
    description: '3.0 HP peak DC motor with up to 14 km/h speed, 12 preset workout programs, dual spring shock absorption system, 5.5" LCD screen, heart rate sensor, and space-saving hydraulic folding.',
    shortDescription: '3.0 HP motorized home treadmill with shock absorption and LCD console.',
    images: [
      'https://images.unsplash.com/photo-1576678927484-cc907957088c?auto=format&fit=crop&w=800&q=80',
    ],
    rating: 4.7,
    numReviews: 16,
    tags: ['treadmill', 'gym', 'fitness', 'home-workout'],
    sku: 'PM-TRM-30HP',
    reviews: []
  },
  {
    _id: '6712b115b234567890abcdef',
    name: 'Bullrock Rubber Hex Dumbbell Set (Pair of 10kg)',
    slug: 'bullrock-rubber-hex-dumbbell-set-10kg',
    price: 4200,
    compareAtPrice: 5500,
    category: 'Sports & Fitness Gear',
    brand: 'Bullrock',
    countInStock: 30,
    isFeatured: false,
    description: 'Cast iron core encased in heavy-duty virgin rubber to protect floors. Anti-roll hexagonal shape with ergonomically contoured knurled chrome handles for superior grip.',
    shortDescription: 'Pair of 10kg anti-roll rubber hex dumbbells with knurled grip.',
    images: [
      'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=800&q=80',
    ],
    rating: 4.8,
    numReviews: 34,
    tags: ['dumbbells', 'fitness', 'weights', 'gym'],
    sku: 'BR-HEX-10KG',
    reviews: []
  },

  // --- PREMIUM COMPUTING & AUDIO ---
  {
    _id: '6712b116b234567890abcdef',
    name: 'Apple MacBook Pro 14" (M3 Pro Chip, 18GB RAM, 512GB SSD)',
    slug: 'apple-macbook-pro-14-m3-pro',
    price: 199900,
    compareAtPrice: 209900,
    category: 'Laptops & Tech',
    brand: 'Apple',
    countInStock: 15,
    isFeatured: true,
    description: '11-core CPU, 14-core GPU, Liquid Retina XDR display with 120Hz ProMotion, 1000 nits sustained brightness, up to 18 hours of battery life, and Space Black finish.',
    shortDescription: 'M3 Pro chip with Liquid Retina XDR display and 18h battery life.',
    images: [
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80',
    ],
    rating: 5.0,
    numReviews: 45,
    tags: ['apple', 'macbook', 'laptop', 'pro'],
    sku: 'APL-MBP14-M3',
    reviews: []
  },
  {
    _id: '6712b117b234567890abcdef',
    name: 'Sony WH-1000XM5 Wireless Noise Cancelling Headphones',
    slug: 'sony-wh1000xm5-noise-cancelling-headphones',
    price: 28990,
    compareAtPrice: 34990,
    category: 'Laptops & Tech',
    brand: 'Sony',
    countInStock: 22,
    isFeatured: true,
    description: 'Industry-leading noise cancellation powered by two processors and 8 microphones. Specially designed 30mm carbon driver unit, 30-hour battery life, and crystal-clear hands-free calling.',
    shortDescription: 'World-class dual-chip ANC headphones with 30-hour battery life.',
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
    ],
    rating: 4.9,
    numReviews: 53,
    tags: ['sony', 'headphones', 'anc', 'audio'],
    sku: 'SNY-WH1000-M5',
    reviews: []
  },
  {
    _id: '6712b118b234567890abcdef',
    name: 'LG 55" 4K OLED Smart Cinema TV (OLED55C3)',
    slug: 'lg-55-4k-oled-smart-tv',
    price: 114990,
    compareAtPrice: 159990,
    category: 'TVs & Appliances',
    brand: 'LG',
    countInStock: 8,
    isFeatured: false,
    description: 'Self-lit OLED pixels delivering infinite contrast and 100% color fidelity. α9 AI Processor Gen6, Dolby Vision IQ, Dolby Atmos, and 0.1ms response time with 4x HDMI 2.1 ports for next-gen gaming.',
    shortDescription: '55" OLED with α9 Gen6 AI processor and infinite contrast.',
    images: [
      'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=800&q=80',
    ],
    rating: 4.8,
    numReviews: 18,
    tags: ['lg', 'oled', 'tv', '4k'],
    sku: 'LG-OLED55-C3',
    reviews: []
  }
];

export const sampleAdminStats = {
  totalRevenue: 1485600.00,
  totalOrders: 342,
  totalProducts: sampleProducts.length,
  totalUsers: 218,
};

export const sampleOrders = [
  {
    _id: '6712b201b234567890abcdef',
    orderNumber: 'ORD-98214-IN',
    user: { name: 'Rohan Deshmukh', email: 'rohan@example.com' },
    orderItems: [
      { name: 'Samsung 65" Neo QLED 4K Smart TV', price: 149990, qty: 1, image: sampleProducts[0].images[0] }
    ],
    shippingAddress: { fullName: 'Rohan Deshmukh', city: 'Mumbai', country: 'India' },
    paymentMethod: 'Credit Card',
    totalPrice: 149990,
    isPaid: true,
    status: 'Delivered',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
  },
  {
    _id: '6712b202b234567890abcdef',
    orderNumber: 'ORD-77142-IN',
    user: { name: 'Ananya Sen', email: 'ananya@example.com' },
    orderItems: [
      { name: 'Puma Deviate Nitro 2 Running Shoes', price: 11999, qty: 1, image: sampleProducts[5].images[0] },
      { name: 'Puma T7 Iconic Tracksuit Set', price: 4999, qty: 1, image: sampleProducts[7].images[0] }
    ],
    shippingAddress: { fullName: 'Ananya Sen', city: 'Bengaluru', country: 'India' },
    paymentMethod: 'UPI',
    totalPrice: 16998,
    isPaid: true,
    status: 'Processing',
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000)
  }
];

export const sampleUsers = [
  {
    _id: '6712b301b234567890abcdef',
    name: 'Nexus Admin India',
    email: 'admin@nexus-shop.com',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80',
    isActive: true,
    createdAt: new Date('2026-01-01')
  },
  {
    _id: '6712b302b234567890abcdef',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'customer',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
    isActive: true,
    createdAt: new Date('2026-02-15')
  }
];
