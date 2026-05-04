import dns from 'node:dns/promises';
(dns as any).setServers(['8.8.8.8', '8.8.4.4']);
import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/serviceapp';
    const conn = await mongoose.connect(mongoURI, {
      connectTimeoutMS: 30000,
      socketTimeoutMS: 45000,
      family: 4,
    });
    
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error: any) {
    console.error(`❌ MongoDB Error: ${error.message}`);
    process.exit(1);
  }
};
