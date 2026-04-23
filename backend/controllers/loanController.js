const Loan = require('../models/Loan');

const applyLoan = async (req, res) => {
  try {
    console.log('Loan application received:', req.body);
    console.log('File:', req.file);
    
    const { accountNumber, customerName, customerEmail, customerPhone, amount, tenure, loanType, interestRate, employeeName } = req.body;
    const documentUrl = req.file ? req.file.path : '';
    
    const ratePerMonth = parseFloat(interestRate) / (12 * 100);
    const months = parseInt(tenure);
    const loanAmount = parseFloat(amount);
    
    const emi = Math.round(loanAmount * ratePerMonth * Math.pow(1 + ratePerMonth, months) / (Math.pow(1 + ratePerMonth, months) - 1));
    const totalPayable = emi * months;
    const loanId = await Loan.generateLoanId();
    
    const loan = new Loan({
      loanId, accountNumber, customerName, customerEmail, customerPhone,
      amount: loanAmount, tenure: months, interestRate: parseFloat(interestRate),
      emi, totalPayable, loanType, documentUrl, appliedBy: employeeName
    });
    
    await loan.save();
    res.json({ success: true, message: 'Loan application submitted successfully', loan });
  } catch (error) {
    console.error('Error applying loan:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const getAllLoans = async (req, res) => {
  try {
    const loans = await Loan.find().sort({ createdAt: -1 });
    res.json({ success: true, loans });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { applyLoan, getAllLoans };