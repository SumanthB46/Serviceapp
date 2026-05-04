import express, { Request, Response } from 'express';
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

dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();
const port = 5005;

app.use(cors());
app.use(express.json({ limit: '10mb' })); // increased limit for base64 images

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


app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', message: 'ServiceSwift Backend is active' });
});
// app.get("/", (req, res) => {
//   res.send("API is working");
// });

app.listen(Number(port), '0.0.0.0', () => {
  console.log(`🚀 Server ready at http://localhost:${port}`);
});

// Port 5001 - Active
