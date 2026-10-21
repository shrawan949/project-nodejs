import Address from '../models/Address.js';

// @desc    Get all addresses for current user
// @route   GET /api/v1/addresses
export const getAddresses = async (req, res, next) => {
  try {
    const addresses = await Address.find({ user: req.user._id }).sort({ isDefault: -1, createdAt: -1 });
    res.status(200).json({ success: true, count: addresses.length, addresses });
  } catch (error) {
    next(error);
  }
};

// @desc    Create address
// @route   POST /api/v1/addresses
export const createAddress = async (req, res, next) => {
  try {
    const { label, fullName, phone, street, city, state, postalCode, country, isDefault } = req.body;

    // If setting as default, unset other defaults
    if (isDefault) {
      await Address.updateMany({ user: req.user._id }, { isDefault: false });
    }

    const address = await Address.create({
      user: req.user._id, label, fullName, phone, street, city, state, postalCode, country: country || 'India', isDefault: isDefault || false,
    });

    res.status(201).json({ success: true, message: 'Address saved', address });
  } catch (error) {
    next(error);
  }
};

// @desc    Update address
// @route   PUT /api/v1/addresses/:id
export const updateAddress = async (req, res, next) => {
  try {
    const address = await Address.findOne({ _id: req.params.id, user: req.user._id });
    if (!address) return res.status(404).json({ success: false, message: 'Address not found' });

    const { label, fullName, phone, street, city, state, postalCode, country, isDefault } = req.body;
    if (isDefault) {
      await Address.updateMany({ user: req.user._id }, { isDefault: false });
    }

    Object.assign(address, { label, fullName, phone, street, city, state, postalCode, country, isDefault });
    await address.save();
    res.status(200).json({ success: true, message: 'Address updated', address });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete address
// @route   DELETE /api/v1/addresses/:id
export const deleteAddress = async (req, res, next) => {
  try {
    const address = await Address.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!address) return res.status(404).json({ success: false, message: 'Address not found' });
    res.status(200).json({ success: true, message: 'Address deleted' });
  } catch (error) {
    next(error);
  }
};
