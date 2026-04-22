// backend/models/Transaction.js
const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  transactionId: { type: String, required: true, unique: true },
  accountNumber: { type: String, required: true },
  customerName: { type: String, required: true },
  type: { type: String, enum: ['deposit', 'withdraw'], required: true },
  amount: { type: Number, required: true },
  balanceAfter: { type: Number, required: true },
  processedBy: { type: String, required: true },
  status: { type: String, enum: ['success', 'failed'], default: 'success' },
  description: { type: String },
  createdAt: { type: Date, default: Date.now }
});

// Generate unique transaction ID
transactionSchema.statics.generateTransactionId = async function() {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const random = Math.floor(1000 + Math.random() * 9000);
  return `TXN${year}${month}${day}${random}`;
};

module.exports = mongoose.model('Transaction', transactionSchema);