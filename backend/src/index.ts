import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db';
import userRoutes from './routes/userRoutes';

dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/users', userRoutes);

app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', message: 'ServiceSwift Backend is active' });
});
// app.get("/", (req, res) => {
//   res.send("API is working");
// });

app.listen(port, () => {
  console.log(`🚀 Server ready at http://localhost:${port}`);
});
