// backend/server.js
const express = require('express');
const cors = require('cors');
const path = require('path');

// Load environment variables FIRST - before any other imports
const dotenv = require('dotenv');
dotenv.config({ path: path.join(__dirname, '.env') });

// Now import other modules that need env variables
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Import routes
const employeeRoutes = require('./routes/employeeRoutes');
const customerRoutes = require('./routes/customerRoutes');
const transactionRoutes = require('./routes/transactionRoutes');

// Import Cloudinary test connection
const { testConnection } = require('./config/cloudinary');

const app = express();
const PORT = process.env.PORT || 5000;

// Debug: Check if env variables are loaded
console.log('=== Environment Variables Check ===');
console.log('ADMIN_EMAIL:', process.env.ADMIN_EMAIL ? '✓ Set' : '✗ Missing');
console.log('CLOUDINARY_CLOUD_NAME:', process.env.CLOUDINARY_CLOUD_NAME ? '✓ Set' : '✗ Missing');
console.log('CLOUDINARY_API_KEY:', process.env.CLOUDINARY_API_KEY ? '✓ Set' : '✗ Missing');
console.log('CLOUDINARY_API_SECRET:', process.env.CLOUDINARY_API_SECRET ? '✓ Set' : '✗ Missing');
console.log('===================================');

// Middleware
app.use(cors());
app.use(express.json());

// Root route handler - Fix for "Cannot GET /"
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Bank System API is running',
    version: '1.0.0',
    status: 'active',
    endpoints: {
      admin_login: '/api/admin/login',
      employee_login: '/api/employee/login',
      customer_login: '/api/customer/login',
      customers: '/api/customers/all',
      employees: '/api/employees',
      transactions: '/api/transactions',
      test_cloudinary: '/api/test-cloudinary'
    }
  });
});

// MongoDB Connection with serverless support
let cached = global.mongoose;
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }
  
  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };
    cached.promise = mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/bankdb', opts).then((mongoose) => {
      console.log('MongoDB connected successfully');
      return mongoose;
    }).catch(err => {
      console.log('MongoDB connection error:', err.message);
      throw err;
    });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

// Connect to MongoDB
connectDB();

// Test Cloudinary connection
testConnection();

// Admin login endpoint
app.post('/api/admin/login', (req, res) => {
  const { email, password } = req.body;
  
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;
  
  if (email === adminEmail && password === adminPassword) {
    const token = Buffer.from(`${email}:${Date.now()}`).toString('base64');
    
    res.json({
      success: true,
      message: 'Login successful',
      token: token,
      admin: {
        email: email,
        name: 'Super Admin'
      }
    });
  } else {
    res.status(401).json({
      success: false,
      message: 'Invalid email or password'
    });
  }
});

// Test Cloudinary endpoint
app.get('/api/test-cloudinary', (req, res) => {
  res.json({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME ? 'Set' : 'Not Set',
    api_key: process.env.CLOUDINARY_API_KEY ? 'Set' : 'Not Set',
    api_secret: process.env.CLOUDINARY_API_SECRET ? 'Set' : 'Not Set'
  });
});

// Test API endpoint
app.get('/api/test', (req, res) => {
  res.json({
    success: true,
    message: 'API is working!'
  });
});

// Protected route example
app.get('/api/admin/dashboard', (req, res) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    return res.status(401).json({ success: false, message: 'No token provided' });
  }
  
  res.json({
    success: true,
    data: {
      totalCustomers: 15280,
      totalTransactions: 125000,
      totalBalance: '₹450 Cr'
    }
  });
});

// Employee login endpoint
app.post('/api/employee/login', async (req, res) => {
  const { email, password } = req.body;
  
  try {
    await connectDB();
    const Employee = require('./models/Employee');
    
    const employee = await Employee.findOne({ email });
    
    if (!employee) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
    
    if (employee.status !== 'Active') {
      return res.status(401).json({ success: false, message: 'Your account is inactive. Please contact admin.' });
    }
    
    const isPasswordValid = await bcrypt.compare(password, employee.password);
    
    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
    
    const token = Buffer.from(`${email}:${Date.now()}`).toString('base64');
    
    res.json({
      success: true,
      message: 'Login successful',
      token: token,
      employee: {
        id: employee._id,
        name: employee.name,
        email: employee.email,
        role: employee.role,
        phone: employee.phone,
        status: employee.status
      }
    });
  } catch (error) {
    console.error('Employee login error:', error);
    res.status(500).json({ success: false, message: 'Server error. Please try again later.' });
  }
});

// Customer login endpoint - Validates Account Number, PAN, Aadhar, DOB
app.post('/api/customer/login', async (req, res) => {
  const { accountNumber, panNumber, aadharNumber, dateOfBirth } = req.body;
  
  try {
    await connectDB();
    const Customer = require('./models/Customer');
    
    // Find customer by account number
    const customer = await Customer.findOne({ accountNumber });
    
    if (!customer) {
      return res.status(401).json({ success: false, message: 'Invalid account number' });
    }
    
    // Validate PAN number
    if (customer.panNumber !== panNumber) {
      return res.status(401).json({ success: false, message: 'Invalid PAN number' });
    }
    
    // Validate Aadhar number
    if (customer.aadharNumber !== aadharNumber) {
      return res.status(401).json({ success: false, message: 'Invalid Aadhar number' });
    }
    
    // Validate Date of Birth
    if (customer.dateOfBirth !== dateOfBirth) {
      return res.status(401).json({ success: false, message: 'Invalid date of birth' });
    }
    
    // Check if customer is active
    if (customer.status !== 'Active') {
      return res.status(401).json({ success: false, message: 'Your account is inactive. Please contact bank.' });
    }
    
    // Generate token
    const token = Buffer.from(`${accountNumber}:${Date.now()}`).toString('base64');
    
    res.json({
      success: true,
      message: 'Login successful',
      token: token,
      customer: {
        id: customer._id,
        fullName: customer.fullName,
        email: customer.email,
        accountNumber: customer.accountNumber,
        accountType: customer.accountType,
        balance: customer.balance
      }
    });
  } catch (error) {
    console.error('Customer login error:', error);
    res.status(500).json({ success: false, message: 'Server error. Please try again later.' });
  }
});

// Employee routes
app.use('/api/employees', employeeRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/transactions', transactionRoutes);

// Export for Vercel serverless function
if (process.env.VERCEL) {
  module.exports = app;
}

// Start server with error handling for port conflicts (only when not on Vercel)
if (!process.env.VERCEL) {
  const startServer = (port) => {
    const server = app.listen(port, () => {
      console.log(`Backend server running on http://localhost:${port}`);
      console.log(`Admin credentials from backend/.env:`);
      console.log(`  Email: ${process.env.ADMIN_EMAIL}`);
      console.log(`  Password: ${process.env.ADMIN_PASSWORD}`);
    }).on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.log(`Port ${port} is already in use. Trying port ${port + 1}...`);
        startServer(port + 1);
      } else {
        console.log('Server error:', err);
      }
    });
  };
  
  startServer(PORT);
}