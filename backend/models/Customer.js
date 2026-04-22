// backend/models/Customer.js
const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  accountNumber: { type: String, required: true, unique: true },
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  aadharNumber: { type: String, required: true, unique: true },
  panNumber: { type: String, required: true, unique: true },
  dateOfBirth: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  pincode: { type: String, required: true },
  accountType: { type: String, enum: ['Savings', 'Current', 'Fixed Deposit'], required: true },
  initialDeposit: { type: Number, required: true },
  balance: { type: Number, default: 0 },
  nominee: { type: String },
  occupation: { type: String, enum: ['Salaried', 'Self Employed', 'Business', 'Student', 'Retired'], required: true },
  status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
  createdBy: { 
    type: String, 
    required: true,
    default: 'System'
  },
  createdByEmployeeId: { 
    type: String,
    default: 'SYSTEM'
  },
  documents: {
    aadharCard: { type: String, required: true },
    panCard: { type: String, required: true },
    photo: { type: String, required: true },
    signature: { type: String, required: true }
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Generate unique 12-digit account number
customerSchema.statics.generateAccountNumber = async function() {
  let accountNumber;
  let isUnique = false;
  
  while (!isUnique) {
    // Generate 12-digit random number (100000000000 to 999999999999)
    accountNumber = Math.floor(100000000000 + Math.random() * 900000000000).toString();
    const existing = await this.findOne({ accountNumber });
    if (!existing) {
      isUnique = true;
    }
  }
  return accountNumber;
};

// Update timestamp on save - WITHOUT using next
customerSchema.pre('save', function() {
  this.updatedAt = Date.now();
});

module.exports = mongoose.model('Customer', customerSchema);