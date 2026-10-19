import mongoose from 'mongoose';
import User from '../models/User.js';
import { sendTokenResponse } from '../utils/generateToken.js';
import { sampleUsers } from '../config/sampleData.js';

const isDBConnected = () => mongoose.connection.readyState === 1;

// @desc    Register a new user
// @route   POST /api/v1/auth/register
export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields' });
    }

    if (!isDBConnected()) {
      const mockUser = {
        _id: 'mock_user_' + Date.now(),
        name,
        email,
        role: 'customer',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
        isActive: true,
      };
      const { token, user: safeUser } = sendTokenResponse(mockUser, 201, res);
      return res.status(201).json({
        success: true,
        message: 'Account created successfully (In-Memory)',
        token,
        user: safeUser,
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'An account with that email already exists' });
    }

    const user = await User.create({
      name,
      email,
      password,
    });

    const { token, user: safeUser } = sendTokenResponse(user, 201, res);

    if (req.is('json') || req.originalUrl.startsWith('/api')) {
      return res.status(201).json({
        success: true,
        message: 'Account created successfully',
        token,
        user: safeUser,
      });
    }

    res.redirect('/');
  } catch (error) {
    next(error);
  }
};

// @desc    Login user
// @route   POST /api/v1/auth/login
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide both email and password' });
    }

    if (!isDBConnected()) {
      // Find matching mock user
      let matched = sampleUsers.find(
        (u) => u.email.toLowerCase() === email.toLowerCase()
      );
      if (!matched) {
        matched = {
          _id: 'mock_' + (email.includes('admin') ? 'admin' : 'cust'),
          name: email.includes('admin') ? 'Nexus Admin' : 'Customer',
          email,
          role: email.includes('admin') ? 'admin' : 'customer',
          avatar: sampleUsers[0].avatar,
          isActive: true,
        };
      }

      const { token, user: safeUser } = sendTokenResponse(matched, 200, res);
      return res.status(200).json({
        success: true,
        message: 'Logged in successfully (Demo Mode)',
        token,
        user: safeUser,
      });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user || !user.isActive) {
      return res.status(401).json({ success: false, message: 'Invalid credentials or account deactivated' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const { token, user: safeUser } = sendTokenResponse(user, 200, res);

    if (req.is('json') || req.originalUrl.startsWith('/api')) {
      return res.status(200).json({
        success: true,
        message: 'Logged in successfully',
        token,
        user: safeUser,
      });
    }

    const redirectTo = req.query.redirect || (safeUser.role === 'admin' ? '/admin' : '/');
    res.redirect(redirectTo);
  } catch (error) {
    next(error);
  }
};

// @desc    Logout user & clear cookie
// @route   GET /api/v1/auth/logout
export const logout = (req, res) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 5 * 1000),
    httpOnly: true,
  });

  if (req.originalUrl.startsWith('/api')) {
    return res.status(200).json({ success: true, message: 'Logged out successfully' });
  }

  res.redirect('/login');
};

// @desc    Get current logged in user
// @route   GET /api/v1/auth/me
export const getMe = async (req, res) => {
  res.status(200).json({
    success: true,
    user: req.user,
  });
};

// @desc    Update user profile
// @route   PUT /api/v1/auth/updatedetails
export const updateDetails = async (req, res, next) => {
  try {
    if (!isDBConnected()) {
      return res.status(200).json({ success: true, message: 'Profile updated' });
    }

    const fieldsToUpdate = {
      name: req.body.name,
      phone: req.body.phone,
      address: {
        street: req.body.street || req.user.address?.street,
        city: req.body.city || req.user.address?.city,
        state: req.body.state || req.user.address?.state,
        postalCode: req.body.postalCode || req.user.address?.postalCode,
        country: req.body.country || req.user.address?.country,
      },
    };

    const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user,
    });
  } catch (error) {
    next(error);
  }
};
