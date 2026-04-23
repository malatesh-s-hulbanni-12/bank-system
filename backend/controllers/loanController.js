const Loan = require('../models/Loan');

const applyLoan = async (req, res) => {
  try {
    console.log('Loan application received:', req.body);
    
    const { accountNumber, customerName, customerEmail, customerPhone, amount, tenure, loanType, interestRate, employeeName } = req.body;
    
    let documentUrl = '';
    if (req.file) {
      documentUrl = req.file.originalname;
    }
    
    const ratePerMonth = parseFloat(interestRate) / (12 * 100);
    const months = parseInt(tenure);
    const loanAmount = parseFloat(amount);
    
    const emi = Math.round(loanAmount * ratePerMonth * Math.pow(1 + ratePerMonth, months) / (Math.pow(1 + ratePerMonth, months) - 1));
    const totalPayable = emi * months;
    const loanId = await Loan.generateLoanId();
    
    const loan = new Loan({
      loanId,
      accountNumber,
      customerName,
      customerEmail: customerEmail || '',
      customerPhone: customerPhone || '',
      amount: loanAmount,
      tenure: months,
      interestRate: parseFloat(interestRate),
      emi,
      totalPayable,
      loanType,
      documentUrl,
      appliedBy: employeeName || 'Employee'
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
    console.error('Error fetching loans:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get loans by account number - ADD THIS FUNCTION
const getLoansByAccount = async (req, res) => {
  try {
    const { accountNumber } = req.params;
    const loans = await Loan.find({ accountNumber }).sort({ createdAt: -1 });
    res.json({ success: true, loans });
  } catch (error) {
    console.error('Error fetching loans by account:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update loan status
const updateLoanStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, remarks, approvedBy } = req.body;
    
    const updateData = { 
      status, 
      remarks, 
      updatedAt: Date.now() 
    };
    
    if (status === 'Approved') {
      updateData.approvedBy = approvedBy;
      updateData.approvedDate = Date.now();
    }
    
    const loan = await Loan.findByIdAndUpdate(id, updateData, { new: true });
    
    if (!loan) {
      return res.status(404).json({ success: false, message: 'Loan not found' });
    }
    
    res.json({ success: true, message: `Loan ${status} successfully`, loan });
  } catch (error) {
    console.error('Error updating loan status:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { applyLoan, getAllLoans, getLoansByAccount, updateLoanStatus };