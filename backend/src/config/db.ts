import dns from 'node:dns';
dns.setServers(['8.8.8.8', '8.8.4.4']);

import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/serviceapp';
    const conn = await mongoose.connect(mongoURI, {
      connectTimeoutMS: 30000,
      socketTimeoutMS: 45000,
    });
    
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error: any) {
    console.error(`❌ MongoDB Error: ${error.message}`);
    // Instead of exiting, we can log and let the app stay alive 
    // to respond with 500 errors instead of crashing the process
    // process.exit(1);
  }
};