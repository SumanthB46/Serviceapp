const cloudinary = require('cloudinary').v2;
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function testUpload() {
  console.log('Testing Cloudinary upload...');
  console.log('Cloud Name:', process.env.CLOUDINARY_CLOUD_NAME);
  
  try {
    const result = await cloudinary.uploader.upload('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==', {
      folder: 'serviceapp/test'
    });
    console.log('Upload Success:', result.secure_url);
  } catch (error) {
    console.error('Upload Failed:', error.message);
    if (error.http_code) console.error('HTTP Code:', error.http_code);
  }
}

testUpload();
