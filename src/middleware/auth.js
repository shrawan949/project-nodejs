import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import User from '../models/User.js';
import { sampleUsers } from '../config/sampleData.js';

const isDBConnected = () => mongoose.connection.readyState === 1;

// Protect routes - verify JWT token from Header or Cookie
export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    if (req.originalUrl.startsWith('/api')) {
      return res.status(401).json({ success: false, message: 'Not authorized to access this route' });
    }
    return res.redirect(`/login?redirect=${encodeURIComponent(req.originalUrl)}`);
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'nexus_secret_default_key');

    let user;
    if (!isDBConnected() || String(decoded.id).startsWith('mock_')) {
      user = sampleUsers.find((u) => u._id === decoded.id) || sampleUsers[0];
    } else {
      user = await User.findById(decoded.id);
    }

    if (!user || !user.isActive) {
      if (req.originalUrl.startsWith('/api')) {
        return res.status(401).json({ success: false, message: 'User account not found or deactivated' });
      }
      res.clearCookie('token');
      return res.redirect('/login');
    }

    req.user = user;
    res.locals.user = user;
    next();
  } catch (err) {
    if (req.originalUrl.startsWith('/api')) {
      return res.status(401).json({ success: false, message: 'Token is invalid or expired' });
    }
    res.clearCookie('token');
    return res.redirect('/login');
  }
};

// Grant access to specific roles
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      if (req.originalUrl.startsWith('/api')) {
        return res.status(403).json({
          success: false,
          message: `User role '${req.user ? req.user.role : 'guest'}' is not authorized to access this route`,
        });
      }
      return res.status(403).render('pages/error', {
        title: 'Access Forbidden',
        statusCode: 403,
        message: 'You do not have administrative privileges to access this page.',
      });
    }
    next();
  };
};

// Optional auth - inject user into locals if logged in, but don't block
export const optionalAuth = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'nexus_secret_default_key');
      let user;
      if (!isDBConnected() || String(decoded.id).startsWith('mock_')) {
        user = sampleUsers.find((u) => u._id === decoded.id) || sampleUsers[0];
      } else {
        user = await User.findById(decoded.id);
      }

      if (user && user.isActive) {
        req.user = user;
        res.locals.user = user;
      }
    } catch {
      res.clearCookie('token');
    }
  }

  if (!res.locals.user) {
    res.locals.user = null;
  }

  next();
};
