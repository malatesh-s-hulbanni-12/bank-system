const mongoose = require('mongoose');

const fixedDepositSchema = new mongoose.Schema({
  fdId: { type: String, required: true, unique: true },
  accountNumber: { type: String, required: true },
  customerName: { type: String, required: true },
  customerEmail: { type: String, required: true },
  customerPhone: { type: String, required: true },
  amount: { type: Number, required: true },
  tenure: { type: Number, required: true },
  interestRate: { type: Number, required: true },
  maturityAmount: { type: Number, required: true },
  maturityDate: { type: Date, required: true },
  status: { type: String, default: 'Active' },
  createdBy: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

fixedDepositSchema.statics.generateFdId = async function() {
  const date = new Date();
  const year = date.getFullYear();
  const random = Math.floor(1000 + Math.random() * 9000);
  return `FD${year}${random}`;
};

module.exports = mongoose.model('FixedDeposit', fixedDepositSchema);