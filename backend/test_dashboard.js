const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
require('dotenv').config({ path: './.env' });

async function test() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to DB");
  
  const User = require('./src/models/User').User;
  // Get an admin user
  const admin = await User.findOne({ role: 'admin' });
  if (!admin) {
     console.log("No admin found");
     process.exit(1);
  }
  
  const token = jwt.sign({ id: admin._id, role: admin.role }, process.env.JWT_SECRET || 'secret', { expiresIn: '1d' });
  
  try {
     const res = await fetch('http://localhost:5005/api/reports/dashboard', {
        headers: {
           Authorization: `Bearer ${token}`
        }
     });
     const text = await res.text();
     console.log("Status:", res.status);
     console.log("Response:", text.substring(0, 500));
  } catch (e) {
     console.error(e);
  }
  
  process.exit(0);
}

test();
