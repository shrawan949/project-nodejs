import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      process.env.MONGO_URI || 'mongodb://localhost:27017/nexus_ecommerce',
      { serverSelectionTimeoutMS: 5000 }
    );
    console.log(`MongoDB connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    // In production, never silently start an application that cannot persist orders,
    // users, carts, or inventory. Development can still use the sample-data mode.
    if (process.env.NODE_ENV === 'production') {
      console.error('MongoDB connection failed; refusing to start in production.');
      throw error;
    }
    console.warn('MongoDB unavailable in development; sample-data mode may be limited.');
    mongoose.set('bufferCommands', false);
    return null;
  }
};

export default connectDB;
