import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db';
import userRoutes     from './routes/userRoutes';
import categoryRoutes from './routes/categoryRoutes';
import serviceRoutes  from './routes/serviceRoutes';
import providerRoutes from './routes/providerRoutes';
import addressRoutes  from './routes/addressRoutes';
import bookingRoutes  from './routes/bookingRoutes';
import reviewRoutes   from './routes/reviewRoutes';
import bannerRoutes   from './routes/bannerRoutes';
import offerRoutes    from './routes/offerRoutes';
import adminReportRoutes from './routes/adminReportRoutes';
import notificationRoutes from './routes/notificationRoutes';
import paymentRoutes   from './routes/paymentRoutes';
import providerServiceRoutes from './routes/providerServiceRoutes';
import complaintRoutes from './routes/complaintRoutes';
import locationRoutes from './routes/locationRoutes';

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
