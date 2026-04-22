// backend/controllers/transactionController.js
const Transaction = require('../models/Transaction');
const Customer = require('../models/Customer');

// Process deposit or withdrawal
const processTransaction = async (req, res) => {
  try {
    const { accountNumber, type, amount, employeeName } = req.body;
    
    // Validate input
    if (!accountNumber || !type || !amount) {
      return res.status(400).json({ 
        success: false, 
        message: 'Account number, transaction type, and amount are required' 
      });
    }
    
    if (amount <= 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Amount must be greater than zero' 
      });
    }
    
    // Find customer
    const customer = await Customer.findOne({ accountNumber });
    
    if (!customer) {
      return res.status(404).json({ 
        success: false, 
        message: 'Customer not found' 
      });
    }
    
    // Check if customer is active
    if (customer.status !== 'Active') {
      return res.status(400).json({ 
        success: false, 
        message: 'Customer account is inactive. Cannot process transaction.' 
      });
    }
    
    let newBalance = customer.balance;
    let description = '';
    
    // Process based on transaction type
    if (type === 'deposit') {
      newBalance = customer.balance + amount;
      description = `Deposit of ₹${amount} to account ${accountNumber}`;
    } else if (type === 'withdraw') {
      if (customer.balance < amount) {
        return res.status(400).json({ 
          success: false, 
          message: 'Insufficient balance' 
        });
      }
      newBalance = customer.balance - amount;
      description = `Withdrawal of ₹${amount} from account ${accountNumber}`;
    } else {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid transaction type. Use "deposit" or "withdraw"' 
      });
    }
    
    // Update customer balance
    customer.balance = newBalance;
    customer.updatedAt = Date.now();
    await customer.save();
    
    // Generate transaction ID
    const transactionId = await Transaction.generateTransactionId();
    
    // Create transaction record
    const transaction = new Transaction({
      transactionId,
      accountNumber: customer.accountNumber,
      customerName: customer.fullName,
      type,
      amount,
      balanceAfter: newBalance,
      processedBy: employeeName || 'System',
      status: 'success',
      description
    });
    
    await transaction.save();
    
    res.json({
      success: true,
      message: `${type === 'deposit' ? 'Deposit' : 'Withdrawal'} successful`,
      newBalance,
      transaction: {
        transactionId: transaction.transactionId,
        type: transaction.type,
        amount: transaction.amount,
        balanceAfter: transaction.balanceAfter,
        date: transaction.createdAt
      }
    });
    
  } catch (error) {
    console.error('Transaction error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while processing transaction',
      error: error.message 
    });
  }
};

// Get transaction history by account number
const getTransactionHistory = async (req, res) => {
  try {
    const { accountNumber } = req.params;
    
    const transactions = await Transaction.find({ accountNumber })
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      count: transactions.length,
      transactions
    });
    
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while fetching transaction history',
      error: error.message 
    });
  }
};

// Get all transactions (for admin/employee)
const getAllTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find()
      .sort({ createdAt: -1 })
      .limit(100);
    
    res.json({
      success: true,
      count: transactions.length,
      transactions
    });
    
  } catch (error) {
    console.error('Error fetching all transactions:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while fetching transactions',
      error: error.message 
    });
  }
};

// Get transaction by transaction ID
const getTransactionById = async (req, res) => {
  try {
    const { transactionId } = req.params;
    
    const transaction = await Transaction.findOne({ transactionId });
    
    if (!transaction) {
      return res.status(404).json({ 
        success: false, 
        message: 'Transaction not found' 
      });
    }
    
    res.json({
      success: true,
      transaction
    });
    
  } catch (error) {
    console.error('Error fetching transaction:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while fetching transaction',
      error: error.message 
    });
  }
};

// Get transaction summary (total deposits, withdrawals, etc.)
const getTransactionSummary = async (req, res) => {
  try {
    const { accountNumber } = req.params;
    
    const transactions = await Transaction.find({ accountNumber });
    
    const totalDeposits = transactions
      .filter(t => t.type === 'deposit')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const totalWithdrawals = transactions
      .filter(t => t.type === 'withdraw')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const transactionCount = transactions.length;
    
    res.json({
      success: true,
      summary: {
        totalDeposits,
        totalWithdrawals,
        transactionCount,
        lastTransaction: transactions[0] || null
      }
    });
    
  } catch (error) {
    console.error('Error fetching transaction summary:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while fetching summary',
      error: error.message 
    });
  }
};

module.exports = {
  processTransaction,
  getTransactionHistory,
  getAllTransactions,
  getTransactionById,
  getTransactionSummary
};