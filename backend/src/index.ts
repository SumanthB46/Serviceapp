import dns from 'dns';
dns.setServers(['8.8.8.8', '8.8.4.4']);

import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
// Last updated: 2026-05-18T10:24
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db';
import userRoutes     from './routes/user/userRoutes';
import categoryRoutes from './routes/admin/categoryRoutes';
import serviceRoutes  from './routes/admin/serviceRoutes';
import providerRoutes from './routes/provider/providerRoutes';
import addressRoutes  from './routes/user/addressRoutes';
import bookingRoutes  from './routes/user/bookingRoutes';
import reviewRoutes   from './routes/user/reviewRoutes';
import bannerRoutes   from './routes/admin/bannerRoutes';
import couponRoutes from './routes/admin/couponRoutes';
import adminReportRoutes from './routes/admin/adminReportRoutes';
import notificationRoutes from './routes/user/notificationRoutes';
import paymentRoutes   from './routes/user/paymentRoutes';
import providerServiceRoutes from './routes/provider/providerServiceRoutes';
import complaintRoutes from './routes/admin/complaintRoutes';
import locationRoutes from './routes/admin/locationRoutes';
import subServiceRoutes from './routes/admin/subServiceRoutes';
import cartRoutes from './routes/user/cartRoutes';
import walletRoutes from './routes/provider/walletRoutes';
import membershipRoutes from './routes/admin/membershipRoutes';




import { cleanupExpiredDocs } from './utils/cleanupVerification';

dotenv.config();

// Connect to MongoDB
connectDB().then(() => {
  // Run cleanup job on startup
  cleanupExpiredDocs();
});

const app = express();
const port = process.env.PORT || 5005;

app.use(cors({
  origin: function(origin, callback) {
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});
app.use(express.json({ limit: '50mb' })); // increased limit for large base64 uploads (PDFs/Images)
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/memberships', membershipRoutes);
app.use('/api/users',      userRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/services',   serviceRoutes);
app.use('/api/providers',  providerRoutes);
app.use('/api/addresses',  addressRoutes);
app.use('/api/bookings',   bookingRoutes);
app.use('/api/reviews',    reviewRoutes);
app.use('/api/banners',    bannerRoutes);
app.use('/api/admin/coupons', couponRoutes);
app.use('/api/reports',    adminReportRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/payments',   paymentRoutes);
app.use('/api/provider-services', providerServiceRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/locations', locationRoutes);
app.use('/api/sub-services', subServiceRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/wallets', walletRoutes);




app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', message: 'FIXVO Backend is active' });
});
// app.get("/", (req, res) => {
//   res.send("API is working");
// });

import http from 'http';
import { initSocket } from './services/socketService';

const server = http.createServer(app);

initSocket(server);

server.listen(Number(port), '0.0.0.0', () => {
  console.log(`🚀 Server ready at http://localhost:${port}`);
});

server.on('error', (error: any) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`❌ Port ${port} is already in use.`);
  } else {
    console.error('❌ Server error:', error);
  }
});

process.on('uncaughtException', (err) => {
  console.error('🔥 Uncaught Exception:', err.message);
  console.error(err.stack);
  process.exit(1);
});

process.on('unhandledRejection', (reason: any, promise) => {
  console.error('🔥 Unhandled Rejection at:', promise);
  console.error('Reason:', reason?.message || reason);
  if (reason?.stack) console.error(reason.stack);
  // process.exit(1); // Don't exit on rejection, just log it
});

server.on('error', (err: any) => {
  console.error('🔥 Server socket error:', err);
});

const gracefulShutdown = () => {
  console.log('👋 Shutting down gracefully...');
  server.close(() => {
    console.log('🚀 Server closed.');
    mongoose.connection.close(false).then(() => {
        console.log('📂 MongoDB connection closed.');
        process.exit(0);
    });
  });
};

process.on('SIGUSR2', gracefulShutdown); // For nodemon
process.on('SIGINT', gracefulShutdown);  // For Ctrl+C
process.on('SIGTERM', gracefulShutdown); // For kill commands

// Port 5001 - Active
// Triggering restart...
