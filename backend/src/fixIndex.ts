import mongoose from 'mongoose';

const run = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/serviceapp');
    console.log('Connected to DB');
    
    try {
      await mongoose.connection.collection('users').dropIndex('email_1');
      console.log('Dropped old strict index: email_1');
    } catch(err) {
      console.log('email_1 index did not exist or already dropped');
    }
    
    try {
      await mongoose.connection.collection('users').dropIndex('phone_1');
      console.log('Dropped old strict index: phone_1');
    } catch(err) {
      console.log('phone_1 index did not exist or already dropped');
    }
    
    console.log('Finished. Mongoose will rebuild the sparse indexes automatically on next server boot.');
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};
run();
