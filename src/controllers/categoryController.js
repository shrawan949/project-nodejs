import Category from '../models/Category.js';

// @desc    Get all categories (hierarchical)
// @route   GET /api/v1/categories
export const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find({ isActive: true }).sort({ order: 1, name: 1 });

    // Build hierarchy
    const mainCategories = categories.filter(c => !c.parent);
    const result = mainCategories.map(main => {
      const subs = categories.filter(c => c.parent && c.parent.toString() === main._id.toString());
      return { ...main.toObject(), subcategories: subs };
    });

    res.status(200).json({ success: true, count: categories.length, categories: result });
  } catch (error) {
    next(error);
  }
};

// @desc    Get category by slug
// @route   GET /api/v1/categories/:slug
export const getCategoryBySlug = async (req, res, next) => {
  try {
    const category = await Category.findOne({ slug: req.params.slug, isActive: true });
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    const subcategories = await Category.find({ parent: category._id, isActive: true }).sort({ order: 1 });
    res.status(200).json({ success: true, category: { ...category.toObject(), subcategories } });
  } catch (error) {
    next(error);
  }
};

// @desc    Create category (Admin)
// @route   POST /api/v1/categories
export const createCategory = async (req, res, next) => {
  try {
    const { name, icon, image, description, parent, order } = req.body;
    const category = await Category.create({ name, icon, image, description, parent: parent || null, order: order || 0 });
    res.status(201).json({ success: true, message: 'Category created', category });
  } catch (error) {
    next(error);
  }
};

// @desc    Update category (Admin)
// @route   PUT /api/v1/categories/:id
export const updateCategory = async (req, res, next) => {
  try {
    const { name, icon, image, description, parent, order, isActive } = req.body;
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      { name, icon, image, description, parent, order, isActive },
      { new: true, runValidators: true }
    );
    if (!category) return res.status(404).json({ success: false, message: 'Category not found' });
    res.status(200).json({ success: true, message: 'Category updated', category });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete category (Admin)
// @route   DELETE /api/v1/categories/:id
export const deleteCategory = async (req, res, next) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    // Also remove subcategories
    await Category.deleteMany({ parent: req.params.id });
    res.status(200).json({ success: true, message: 'Category and its subcategories deleted' });
  } catch (error) {
    next(error);
  }
};
