import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import expressLayouts from 'express-ejs-layouts';
import rateLimit from 'express-rate-limit';

import apiRoutes from './routes/apiRoutes.js';
import pageRoutes from './routes/pageRoutes.js';
import { optionalAuth } from './middleware/auth.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Security Headers with relaxed CSP for CDN libraries (Tailwind, FontAwesome, AlpineJS, Chart.js)
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
  })
);

// Compression & Logging
app.use(compression());
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());

// Rate Limiting for API routes
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests, please try again later.' },
});
app.use('/api/', apiLimiter);

// View Engine (EJS & Layouts)
app.use(expressLayouts);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.set('layout', 'layouts/main');

// Static Assets
app.use(express.static(path.join(__dirname, 'public')));

// Global locals & optional auth for all views
app.use(optionalAuth);
app.use((req, res, next) => {
  res.locals.currentPath = req.path;
  res.locals.appName = 'Nexus Shop';
  next();
});

// Top-level Health Check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', uptime: process.uptime(), timestamp: new Date() });
});

// Mount Routes
app.use('/api/v1', apiRoutes);
app.use('/', pageRoutes);

// Error Handling
app.use(notFound);
app.use(errorHandler);

export default app;
