// backend/controllers/customerController.js
const Customer = require('../models/Customer');
const { cloudinary } = require('../config/cloudinary');

// Helper function to extract public ID from Cloudinary URL
const getPublicIdFromUrl = (url) => {
  if (!url) return null;
  const parts = url.split('/');
  const filename = parts.pop();
  const folder = parts.slice(-2).join('/');
  return `${folder}/${filename.split('.')[0]}`;
};

// @desc    Create new customer account
// @route   POST /api/customers/create
// @access  Private/Employee
const createCustomer = async (req, res) => {
  try {
    const { body, files } = req;
    
    // Get employee info from request body
    const employeeName = body.employeeName || 'System';
    const employeeId = body.employeeId || 'SYSTEM';
    
    console.log('Files uploaded:', files ? Object.keys(files) : 'No files');
    console.log('Created by employee:', employeeName);
    
    // Check if customer already exists
    const existingCustomer = await Customer.findOne({
      $or: [
        { email: body.email },
        { aadharNumber: body.aadharNumber },
        { panNumber: body.panNumber }
      ]
    });
    
    if (existingCustomer) {
      // Delete uploaded files from Cloudinary if customer exists
      if (files) {
        const deletePromises = [];
        if (files.aadharCard) deletePromises.push(cloudinary.uploader.destroy(getPublicIdFromUrl(files.aadharCard[0].path)));
        if (files.panCard) deletePromises.push(cloudinary.uploader.destroy(getPublicIdFromUrl(files.panCard[0].path)));
        if (files.photo) deletePromises.push(cloudinary.uploader.destroy(getPublicIdFromUrl(files.photo[0].path)));
        if (files.signature) deletePromises.push(cloudinary.uploader.destroy(getPublicIdFromUrl(files.signature[0].path)));
        await Promise.all(deletePromises);
      }
      
      return res.status(400).json({
        success: false,
        message: 'Customer with this email, Aadhar number or PAN number already exists'
      });
    }
    
    // Validate required documents
    if (!files || !files.aadharCard || !files.panCard || !files.photo || !files.signature) {
      return res.status(400).json({
        success: false,
        message: 'Please upload all required documents (Aadhar Card, PAN Card, Photo, Signature)'
      });
    }
    
    // Generate unique account number
    const accountNumber = await Customer.generateAccountNumber();
    
    // Calculate balance from initial deposit
    const initialDeposit = parseFloat(body.initialDeposit);
    const balance = initialDeposit;
    
    // Create new customer with Cloudinary URLs and createdBy info
    const customer = new Customer({
      accountNumber,
      fullName: body.fullName,
      email: body.email,
      phone: body.phone,
      aadharNumber: body.aadharNumber,
      panNumber: body.panNumber,
      dateOfBirth: body.dateOfBirth,
      address: body.address,
      city: body.city,
      state: body.state,
      pincode: body.pincode,
      accountType: body.accountType,
      initialDeposit,
      balance,
      nominee: body.nominee || '',
      occupation: body.occupation,
      createdBy: employeeName,
      createdByEmployeeId: employeeId,
      documents: {
        aadharCard: files.aadharCard[0].path,
        panCard: files.panCard[0].path,
        photo: files.photo[0].path,
        signature: files.signature[0].path
      }
    });
    
    await customer.save();
    
    res.status(201).json({
      success: true,
      message: 'Account created successfully',
      customer: {
        accountNumber: customer.accountNumber,
        fullName: customer.fullName,
        email: customer.email,
        balance: customer.balance,
        accountType: customer.accountType,
        createdBy: customer.createdBy
      }
    });
    
  } catch (error) {
    console.error('Error creating customer:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating account',
      error: error.message
    });
  }
};

// @desc    Get all customers
// @route   GET /api/customers/all
// @access  Private/Admin/Employee
const getAllCustomers = async (req, res) => {
  try {
    const customers = await Customer.find().select('-documents');
    
    res.json({
      success: true,
      count: customers.length,
      customers
    });
  } catch (error) {
    console.error('Error fetching customers:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching customers',
      error: error.message
    });
  }
};

// @desc    Get customer by ID
// @route   GET /api/customers/:id
// @access  Private/Admin/Employee
const getCustomerById = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    
    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found'
      });
    }
    
    res.json({
      success: true,
      customer
    });
  } catch (error) {
    console.error('Error fetching customer:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching customer',
      error: error.message
    });
  }
};

// @desc    Get customer by account number
// @route   GET /api/customers/account/:accountNumber
// @access  Private/Admin/Employee
const getCustomerByAccountNumber = async (req, res) => {
  try {
    const customer = await Customer.findOne({ accountNumber: req.params.accountNumber });
    
    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found'
      });
    }
    
    res.json({
      success: true,
      customer
    });
  } catch (error) {
    console.error('Error fetching customer:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching customer',
      error: error.message
    });
  }
};

// @desc    Get customer by email
// @route   GET /api/customers/email/:email
// @access  Private/Admin/Employee
const getCustomerByEmail = async (req, res) => {
  try {
    const customer = await Customer.findOne({ email: req.params.email });
    
    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found'
      });
    }
    
    res.json({
      success: true,
      customer
    });
  } catch (error) {
    console.error('Error fetching customer:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching customer',
      error: error.message
    });
  }
};

// @desc    Update customer details
// @route   PUT /api/customers/:id
// @access  Private/Admin/Employee
const updateCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const customer = await Customer.findByIdAndUpdate(
      id,
      { ...updates, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );
    
    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Customer updated successfully',
      customer
    });
  } catch (error) {
    console.error('Error updating customer:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating customer',
      error: error.message
    });
  }
};

// @desc    Update customer status (Active/Inactive)
// @route   PUT /api/customers/:id/status
// @access  Private/Admin/Employee
const updateCustomerStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const customer = await Customer.findByIdAndUpdate(
      id,
      { status, updatedAt: Date.now() },
      { new: true }
    );
    
    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found'
      });
    }
    
    res.json({
      success: true,
      message: `Customer status updated to ${status}`,
      customer
    });
  } catch (error) {
    console.error('Error updating customer status:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating status',
      error: error.message
    });
  }
};

// @desc    Delete customer
// @route   DELETE /api/customers/:id
// @access  Private/Admin
const deleteCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const customer = await Customer.findById(id);
    
    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found'
      });
    }
    
    // Delete documents from Cloudinary
    if (customer.documents) {
      const deletePromises = [];
      
      const deleteFromCloudinary = (url) => {
        if (url) {
          const publicId = getPublicIdFromUrl(url);
          if (publicId) deletePromises.push(cloudinary.uploader.destroy(publicId));
        }
      };
      
      deleteFromCloudinary(customer.documents.aadharCard);
      deleteFromCloudinary(customer.documents.panCard);
      deleteFromCloudinary(customer.documents.photo);
      deleteFromCloudinary(customer.documents.signature);
      
      await Promise.all(deletePromises);
    }
    
    await Customer.findByIdAndDelete(id);
    
    res.json({
      success: true,
      message: 'Customer deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting customer:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting customer',
      error: error.message
    });
  }
};

// @desc    Search customers
// @route   GET /api/customers/search/:query
// @access  Private/Admin/Employee
const searchCustomers = async (req, res) => {
  try {
    const { query } = req.params;
    
    const customers = await Customer.find({
      $or: [
        { fullName: { $regex: query, $options: 'i' } },
        { email: { $regex: query, $options: 'i' } },
        { accountNumber: { $regex: query, $options: 'i' } },
        { phone: { $regex: query, $options: 'i' } }
      ]
    }).select('-documents');
    
    res.json({
      success: true,
      count: customers.length,
      customers
    });
  } catch (error) {
    console.error('Error searching customers:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while searching',
      error: error.message
    });
  }
};

// @desc    Get customer statistics
// @route   GET /api/customers/stats/dashboard
// @access  Private/Admin
const getCustomerStats = async (req, res) => {
  try {
    const totalCustomers = await Customer.countDocuments();
    const activeCustomers = await Customer.countDocuments({ status: 'Active' });
    const totalBalance = await Customer.aggregate([
      { $group: { _id: null, total: { $sum: '$balance' } } }
    ]);
    
    const accountTypeStats = await Customer.aggregate([
      { $group: { _id: '$accountType', count: { $sum: 1 } } }
    ]);
    
    res.json({
      success: true,
      stats: {
        totalCustomers,
        activeCustomers,
        inactiveCustomers: totalCustomers - activeCustomers,
        totalBalance: totalBalance[0]?.total || 0,
        accountTypeDistribution: accountTypeStats
      }
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching statistics',
      error: error.message
    });
  }
};

// @desc    Update customer balance (for deposit/withdraw and fixed deposit deduction)
// @route   PUT /api/customers/balance/:accountNumber
// @access  Private/Employee
const updateCustomerBalance = async (req, res) => {
  try {
    const { accountNumber } = req.params;
    const { newBalance } = req.body;
    
    const customer = await Customer.findOneAndUpdate(
      { accountNumber },
      { balance: newBalance, updatedAt: Date.now() },
      { new: true }
    );
    
    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Balance updated successfully',
      balance: customer.balance,
      customer: {
        accountNumber: customer.accountNumber,
        fullName: customer.fullName,
        balance: customer.balance
      }
    });
  } catch (error) {
    console.error('Error updating balance:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating balance',
      error: error.message
    });
  }
};

module.exports = {
  createCustomer,
  getAllCustomers,
  getCustomerById,
  getCustomerByAccountNumber,
  getCustomerByEmail,
  updateCustomer,
  updateCustomerStatus,
  deleteCustomer,
  searchCustomers,
  getCustomerStats,
  updateCustomerBalance
};