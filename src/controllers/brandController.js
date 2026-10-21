import Brand from '../models/Brand.js';

// @desc    Get all brands
// @route   GET /api/v1/brands
export const getBrands = async (req, res, next) => {
  try {
    const brands = await Brand.find({ isActive: true }).sort({ name: 1 });
    res.status(200).json({ success: true, count: brands.length, brands });
  } catch (error) {
    next(error);
  }
};

// @desc    Get brand by slug
// @route   GET /api/v1/brands/:slug
export const getBrandBySlug = async (req, res, next) => {
  try {
    const brand = await Brand.findOne({ slug: req.params.slug, isActive: true });
    if (!brand) return res.status(404).json({ success: false, message: 'Brand not found' });
    res.status(200).json({ success: true, brand });
  } catch (error) {
    next(error);
  }
};

// @desc    Create brand (Admin)
// @route   POST /api/v1/brands
export const createBrand = async (req, res, next) => {
  try {
    const { name, logo, description, website } = req.body;
    const brand = await Brand.create({ name, logo, description, website });
    res.status(201).json({ success: true, message: 'Brand created', brand });
  } catch (error) {
    next(error);
  }
};

// @desc    Update brand (Admin)
// @route   PUT /api/v1/brands/:id
export const updateBrand = async (req, res, next) => {
  try {
    const { name, logo, description, website, isActive } = req.body;
    const brand = await Brand.findByIdAndUpdate(req.params.id, { name, logo, description, website, isActive }, { new: true, runValidators: true });
    if (!brand) return res.status(404).json({ success: false, message: 'Brand not found' });
    res.status(200).json({ success: true, message: 'Brand updated', brand });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete brand (Admin)
// @route   DELETE /api/v1/brands/:id
export const deleteBrand = async (req, res, next) => {
  try {
    await Brand.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Brand deleted' });
  } catch (error) {
    next(error);
  }
};
