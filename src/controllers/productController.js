import Product from '../models/Product.js';
import multer from 'multer';
import csvParser from 'csv-parser';
import { Readable } from 'stream';

// @desc    Search autocomplete suggestions
// @route   GET /api/v1/products/autocomplete
export const getAutocomplete = async (req, res, next) => {
  try {
    const q = (req.query.q || '').trim();
    if (q.length < 2) {
      return res.status(200).json({ success: true, suggestions: [] });
    }

    const regex = new RegExp(q, 'i');
    const products = await Product.find({
      $or: [
        { name: regex },
        { brand: regex },
        { category: regex },
      ],
    })
      .select('name slug price images brand category')
      .limit(8);

    const suggestions = products.map(p => ({
      id: p._id,
      name: p.name,
      slug: p.slug,
      price: p.price,
      image: p.images[0] || '',
      brand: p.brand,
      category: p.category,
    }));

    res.status(200).json({ success: true, suggestions });
  } catch (error) {
    next(error);
  }
};

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

// @desc    Import products via CSV
// @route   POST /api/v1/products/import
export const importProducts = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload a CSV file' });
    }

    const results = [];
    const errors = [];
    let rowNum = 0;

    const stream = Readable.from(req.file.buffer.toString());

    await new Promise((resolve, reject) => {
      stream
        .pipe(csvParser())
        .on('data', (row) => {
          rowNum++;
          // Validate required fields
          if (!row.name || !row.price || !row.category || !row.description) {
            errors.push({ row: rowNum, message: 'Missing required fields (name, price, category, description)' });
            return;
          }
          const price = parseFloat(row.price);
          if (isNaN(price) || price < 0) {
            errors.push({ row: rowNum, message: `Invalid price: ${row.price}` });
            return;
          }

          results.push({
            name: row.name.trim(),
            price,
            compareAtPrice: parseFloat(row.compareAtPrice) || 0,
            category: row.category.trim(),
            brand: row.brand || 'Nexus',
            description: row.description.trim(),
            shortDescription: (row.shortDescription || '').trim(),
            countInStock: parseInt(row.countInStock, 10) || 0,
            images: row.images ? row.images.split('|').map(s => s.trim()) : ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80'],
            isFeatured: row.isFeatured === 'true' || row.isFeatured === '1',
            tags: row.tags ? row.tags.split('|').map(s => s.trim()) : [],
            slug: row.name.trim().toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '') + '-' + Date.now().toString().slice(-4),
            sku: 'NEX-' + Math.floor(100000 + Math.random() * 900000),
          });
        })
        .on('end', resolve)
        .on('error', reject);
    });

    let imported = 0;
    if (results.length > 0) {
      const inserted = await Product.insertMany(results, { ordered: false }).catch(err => {
        if (err.insertedDocs) return err.insertedDocs;
        throw err;
      });
      imported = Array.isArray(inserted) ? inserted.length : 0;
    }

    res.status(200).json({
      success: true,
      message: `Imported ${imported} product(s). ${errors.length} row(s) had errors.`,
      imported,
      errors: errors.slice(0, 20),
    });
  } catch (error) {
    next(error);
  }
};
