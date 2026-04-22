// backend/models/Employee.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const employeeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  role: { type: String, required: true, enum: ['Manager', 'Cashier', 'Loan Officer', 'Accountant'] },
  status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

// Hash password before saving - Without using next
employeeSchema.pre('save', async function() {
  // Only hash the password if it has been modified (or is new)
  if (this.isModified('password')) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
});

module.exports = mongoose.model('Employee', employeeSchema);