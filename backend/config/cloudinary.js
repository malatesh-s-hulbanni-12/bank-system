// backend/config/cloudinary.js
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// Debug: Check if env variables are accessible
console.log('Cloudinary Config - Reading env:');
console.log('CLOUDINARY_CLOUD_NAME:', process.env.CLOUDINARY_CLOUD_NAME);
console.log('CLOUDINARY_API_KEY:', process.env.CLOUDINARY_API_KEY ? '***HIDDEN***' : 'Missing');
console.log('CLOUDINARY_API_SECRET:', process.env.CLOUDINARY_API_SECRET ? '***HIDDEN***' : 'Missing');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Test Cloudinary connection
const testConnection = async () => {
  try {
    // Try to ping Cloudinary
    const result = await cloudinary.api.ping();
    console.log('✅ Cloudinary connected successfully!', result);
    return true;
  } catch (error) {
    console.error('❌ Cloudinary connection failed:', error.message);
    console.log('Please check your Cloudinary credentials in .env file');
    return false;
  }
};

// Configure storage for documents
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'bank-documents',
    allowed_formats: ['jpg', 'png', 'jpeg', 'pdf'],
    transformation: [{ width: 800, height: 800, crop: 'limit' }]
  }
});

const upload = multer({ storage: storage });

// Test upload function
const testUpload = async () => {
  try {
    // This is just to verify cloudinary is configured
    console.log('Cloudinary configuration complete');
  } catch (error) {
    console.error('Cloudinary storage error:', error);
  }
};

testUpload();

module.exports = { cloudinary, upload, testConnection };