import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a product name'],
      trim: true,
      maxlength: [120, 'Name cannot exceed 120 characters'],
    },
    slug: {
      type: String,
      lowercase: true,
      unique: true,
    },
    description: {
      type: String,
      required: [true, 'Please provide product description'],
    },
    shortDescription: {
      type: String,
      maxlength: [200, 'Short description cannot exceed 200 characters'],
    },
    price: {
      type: Number,
      required: [true, 'Please provide product price'],
      min: [0, 'Price must be positive'],
    },
    compareAtPrice: {
      type: Number,
      default: 0,
    },
    category: {
      type: String,
      required: [true, 'Please specify a product category'],
      trim: true,
    },
    brand: {
      type: String,
      default: 'Nexus',
    },
    images: [
      {
        type: String,
        required: true,
      },
    ],
    countInStock: {
      type: Number,
      required: [true, 'Please specify inventory count in stock'],
      default: 0,
      min: 0,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    numReviews: {
      type: Number,
      default: 0,
    },
    reviews: [reviewSchema],
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isNewArrival: {
      type: Boolean,
      default: false,
    },
    tags: [String],
    sku: {
      type: String,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

// Auto-generate slug and SKU
productSchema.pre('save', function (next) {
  if (this.isModified('name')) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '') + '-' + Date.now().toString().slice(-4);
  }
  if (!this.sku) {
    this.sku = 'NEX-' + Math.floor(100000 + Math.random() * 900000);
  }
  next();
});

const Product = mongoose.model('Product', productSchema);
export default Product;
