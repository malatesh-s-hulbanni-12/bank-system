const FixedDeposit = require('../models/FixedDeposit');

const createFixedDeposit = async (req, res) => {
  try {
    console.log('FD creation received:', req.body);
    
    const { accountNumber, customerName, customerEmail, customerPhone, amount, tenure, interestRate, employeeName } = req.body;
    
    const depositAmount = parseFloat(amount);
    const months = parseInt(tenure);
    const rate = parseFloat(interestRate);
    
    const maturityAmount = Math.round(depositAmount * Math.pow(1 + (rate / 100), months / 12));
    const maturityDate = new Date();
    maturityDate.setMonth(maturityDate.getMonth() + months);
    const fdId = await FixedDeposit.generateFdId();
    
    const fixedDeposit = new FixedDeposit({
      fdId, accountNumber, customerName, customerEmail, customerPhone,
      amount: depositAmount, tenure: months, interestRate: rate,
      maturityAmount, maturityDate, createdBy: employeeName
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
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { createFixedDeposit, getAllFixedDeposits };