const mongoose = require('mongoose');

const loanSchema = new mongoose.Schema({
  loanId: { type: String, required: true, unique: true },
  accountNumber: { type: String, required: true },
  customerName: { type: String, required: true },
  customerEmail: { type: String, default: '' },
  customerPhone: { type: String, default: '' },
  amount: { type: Number, required: true },
  tenure: { type: Number, required: true },
  interestRate: { type: Number, required: true },
  emi: { type: Number, required: true },
  totalPayable: { type: Number, required: true },
  loanType: { type: String, required: true },
  documentUrl: { type: String, default: '' },  // NOT required
  status: { type: String, default: 'Pending' },
  appliedBy: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

loanSchema.statics.generateLoanId = async function() {
  const date = new Date();
  const year = date.getFullYear();
  const random = Math.floor(1000 + Math.random() * 9000);
  return `LN${year}${random}`;
};

module.exports = mongoose.model('Loan', loanSchema);