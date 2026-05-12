import express, { Request, Response } from 'express';
// Last updated: 2026-05-11T15:36
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
import offerRoutes    from './routes/admin/offerRoutes';
import adminReportRoutes from './routes/admin/adminReportRoutes';
import notificationRoutes from './routes/user/notificationRoutes';
import paymentRoutes   from './routes/user/paymentRoutes';
import providerServiceRoutes from './routes/provider/providerServiceRoutes';
import complaintRoutes from './routes/admin/complaintRoutes';
import locationRoutes from './routes/admin/locationRoutes';
import subServiceRoutes from './routes/admin/subServiceRoutes';
import cartRoutes from './routes/user/cartRoutes';




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
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});
app.use(express.json({ limit: '10mb' })); // increased limit for base64 images
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/users',      userRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/services',   serviceRoutes);
app.use('/api/providers',  providerRoutes);
app.use('/api/addresses',  addressRoutes);
app.use('/api/bookings',   bookingRoutes);
app.use('/api/reviews',    reviewRoutes);
app.use('/api/banners',    bannerRoutes);
app.use('/api/offers',     offerRoutes);
app.use('/api/reports',    adminReportRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/payments',   paymentRoutes);
app.use('/api/provider-services', providerServiceRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/locations', locationRoutes);
app.use('/api/sub-services', subServiceRoutes);
app.use('/api/cart', cartRoutes);




app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', message: 'FIXVO Backend is active' });
});
// app.get("/", (req, res) => {
//   res.send("API is working");
// });

const server = app.listen(Number(port), '0.0.0.0', () => {
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
  process.exit(1);
});

// Port 5001 - Active
 
