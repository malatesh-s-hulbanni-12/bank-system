// backend/routes/transactionRoutes.js
const express = require('express');
const router = express.Router();
const {
  processTransaction,
  getTransactionHistory,
  getAllTransactions,
  getTransactionById,
  getTransactionSummary
} = require('../controllers/transactionController');

// Transaction routes
router.post('/', processTransaction);
router.get('/history/:accountNumber', getTransactionHistory);
router.get('/all', getAllTransactions);
router.get('/summary/:accountNumber', getTransactionSummary);
router.get('/:transactionId', getTransactionById);

module.exports = router;