import mongoose from 'mongoose';
import { getDashboardStats } from './src/controllers/admin/adminReportController';
import dotenv from 'dotenv';
dotenv.config();

async function run() {
  await mongoose.connect(process.env.MONGO_URI || '');
  console.log('Connected DB');
  
  const req: any = {};
  const res: any = {
    json: (data: any) => {
       console.log('Success:', JSON.stringify(data).substring(0, 500));
       process.exit(0);
    },
    status: (code: any) => {
       console.log('Status code:', code);
       return {
         json: (data: any) => {
            console.error('Error:', data);
            process.exit(1);
         }
       }
    }
  };
  
  try {
     await getDashboardStats(req, res);
  } catch(e) {
     console.error("Uncaught error:", e);
     process.exit(1);
  }
}
run();
