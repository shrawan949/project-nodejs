import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/nexus_ecommerce', {
      serverSelectionTimeoutMS: 1500,
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.log(`ℹ️ Local MongoDB not detected. Running with integrated In-Memory Catalog mode.`);
    mongoose.set('bufferCommands', false);
    return null;
  }
};

export default connectDB;
