// backend/routes/customerRoutes.js
const express = require('express');
const router = express.Router();
const { upload } = require('../config/cloudinary');
const {
  createCustomer,
  getAllCustomers,
  getCustomerById,
  getCustomerByAccountNumber,
  getCustomerByEmail,
  updateCustomer,
  updateCustomerStatus,
  deleteCustomer,
  searchCustomers,
  getCustomerStats
} = require('../controllers/customerController');

// Multer configuration for multiple file uploads
const uploadFiles = upload.fields([
  { name: 'aadharCard', maxCount: 1 },
  { name: 'panCard', maxCount: 1 },
  { name: 'photo', maxCount: 1 },
  { name: 'signature', maxCount: 1 }
]);

// Customer routes
router.post('/create', uploadFiles, createCustomer);
router.get('/all', getAllCustomers);
router.get('/stats/dashboard', getCustomerStats);
router.get('/search/:query', searchCustomers);
router.get('/account/:accountNumber', getCustomerByAccountNumber);
router.get('/email/:email', getCustomerByEmail);
router.get('/:id', getCustomerById);
router.put('/:id', updateCustomer);
router.put('/:id/status', updateCustomerStatus);
router.delete('/:id', deleteCustomer);

module.exports = router;