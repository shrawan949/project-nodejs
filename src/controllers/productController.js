import Product from '../models/Product.js';

// @desc    Get all products with filtering, search, sorting & pagination
// @route   GET /api/v1/products
export const getProducts = async (req, res, next) => {
  try {
    const pageSize = parseInt(req.query.limit, 10) || 12;
    const page = parseInt(req.query.page, 10) || 1;

    // Search query
    const keyword = req.query.keyword
      ? {
          $or: [
            { name: { $regex: req.query.keyword, $options: 'i' } },
            { description: { $regex: req.query.keyword, $options: 'i' } },
            { brand: { $regex: req.query.keyword, $options: 'i' } },
          ],
        }
      : {};

    // Category filter
    const category = req.query.category && req.query.category !== 'all'
      ? { category: req.query.category }
      : {};

    // Price range
    const minPrice = parseFloat(req.query.minPrice) || 0;
    const maxPrice = parseFloat(req.query.maxPrice) || Number.MAX_SAFE_INTEGER;
    const priceFilter = { price: { $gte: minPrice, $lte: maxPrice } };

    // In-stock only
    const stockFilter = req.query.inStock === 'true' ? { countInStock: { $gt: 0 } } : {};

    const filter = { ...keyword, ...category, ...priceFilter, ...stockFilter };

    // Sorting
    let sortOption = { createdAt: -1 };
    if (req.query.sort === 'price-asc') sortOption = { price: 1 };
    if (req.query.sort === 'price-desc') sortOption = { price: -1 };
    if (req.query.sort === 'rating') sortOption = { rating: -1 };
    if (req.query.sort === 'popular') sortOption = { numReviews: -1 };

    const count = await Product.countDocuments(filter);
    const products = await Product.find(filter)
      .sort(sortOption)
      .limit(pageSize)
      .skip(pageSize * (page - 1));

    res.status(200).json({
      success: true,
      count,
      page,
      pages: Math.ceil(count / pageSize),
      products,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single product by ID or Slug
// @route   GET /api/v1/products/:id
export const getProductById = async (req, res, next) => {
  try {
    const isObjectId = req.params.id.match(/^[0-9a-fA-F]{24}$/);
    const product = isObjectId
      ? await Product.findById(req.params.id)
      : await Product.findOne({ slug: req.params.id });

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.status(200).json({ success: true, product });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a product (Admin)
// @route   POST /api/v1/products
export const createProduct = async (req, res, next) => {
  try {
    const { name, price, description, category, brand, countInStock, images, isFeatured } = req.body;

    const product = await Product.create({
      name,
      price: parseFloat(price),
      description,
      category,
      brand: brand || 'Nexus',
      countInStock: parseInt(countInStock, 10) || 0,
      images: Array.isArray(images) ? images : [images || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80'],
      isFeatured: isFeatured === 'true' || isFeatured === true,
    });

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      product,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a product (Admin)
// @route   PUT /api/v1/products/:id
export const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      product,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a product (Admin)
// @route   DELETE /api/v1/products/:id
export const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new review
// @route   POST /api/v1/products/:id/reviews
export const createProductReview = async (req, res, next) => {
  try {
    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      return res.status(400).json({ success: false, message: 'You have already reviewed this product' });
    }

    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id,
    };

    product.reviews.push(review);
    product.numReviews = product.reviews.length;
    product.rating =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length;

    await product.save();

    res.status(201).json({
      success: true,
      message: 'Review submitted successfully',
      review,
    });
  } catch (error) {
    next(error);
  }
};
