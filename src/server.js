import dotenv from 'dotenv';
dotenv.config();

import app from './app.js';
import connectDB from './config/db.js';

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  // Connect to Database
  await connectDB();

  const server = app.listen(PORT, () => {
    console.log(`
=============================================================
🚀 Nexus E-Commerce Server Running!
📡 Environment: ${process.env.NODE_ENV || 'development'}
🌐 Local URL:   http://localhost:${PORT}
📚 API Docs:    http://localhost:${PORT}/api/v1/health
🛒 Storefront:  http://localhost:${PORT}
⚙️ Admin Panel: http://localhost:${PORT}/admin
=============================================================
    `);
  });

  // Handle unhandled promise rejections
  process.on('unhandledRejection', (err) => {
    console.error(`💥 Unhandled Rejection: ${err.message}`);
  });

  // Graceful shutdown
  const shutdown = () => {
    console.log('🛑 Gracefully shutting down server...');
    server.close(() => {
      console.log('💤 Process terminated.');
      process.exit(0);
    });
  };

  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);
};

startServer();
