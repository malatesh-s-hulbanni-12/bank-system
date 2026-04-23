const FixedDeposit = require('../models/FixedDeposit');

const createFixedDeposit = async (req, res) => {
  try {
    const { accountNumber, customerName, customerEmail, customerPhone, amount, tenure, interestRate, employeeName } = req.body;
    
    const maturityAmount = Math.round(amount * Math.pow(1 + (interestRate / 100), tenure / 12));
    const maturityDate = new Date();
    maturityDate.setMonth(maturityDate.getMonth() + tenure);
    const fdId = await FixedDeposit.generateFdId();
    
    const fixedDeposit = new FixedDeposit({
      fdId, accountNumber, customerName, customerEmail, customerPhone,
      amount, tenure, interestRate, maturityAmount, maturityDate,
      createdBy: employeeName
    });
    
    await fixedDeposit.save();
    res.json({ success: true, message: 'Fixed Deposit created successfully', fixedDeposit });
  } catch (error) {
    console.error('Error creating FD:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const getAllFixedDeposits = async (req, res) => {
  try {
    const fixedDeposits = await FixedDeposit.find().sort({ createdAt: -1 });
    res.json({ success: true, fixedDeposits });
  } catch (error) {
    console.error('Error fetching FDs:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get FDs by account number - ADD THIS FUNCTION
const getFixedDepositsByAccount = async (req, res) => {
  try {
    const { accountNumber } = req.params;
    const fixedDeposits = await FixedDeposit.find({ accountNumber }).sort({ createdAt: -1 });
    res.json({ success: true, fixedDeposits });
  } catch (error) {
    console.error('Error fetching FDs by account:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateFdStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const fixedDeposit = await FixedDeposit.findByIdAndUpdate(id, { status, updatedAt: Date.now() }, { new: true });
    res.json({ success: true, message: `FD status updated to ${status}`, fixedDeposit });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { createFixedDeposit, getAllFixedDeposits, getFixedDepositsByAccount, updateFdStatus };