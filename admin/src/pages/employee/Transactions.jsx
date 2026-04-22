// pages/employee/Transactions.jsx
import React, { useState } from 'react';
import { FaSearch, FaRupeeSign, FaArrowUp, FaArrowDown, FaWallet, FaCreditCard, FaSpinner } from 'react-icons/fa';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const Transactions = () => {
  const [accountNumber, setAccountNumber] = useState('');
  const [customer, setCustomer] = useState(null);
  const [amount, setAmount] = useState('');
  const [transactionType, setTransactionType] = useState('deposit');
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [customerNotFound, setCustomerNotFound] = useState(false);

  // Search customer by account number - Press Enter also works
  const searchCustomer = async () => {
    if (!accountNumber) {
      setError('Please enter account number');
      return;
    }

    setSearchLoading(true);
    setError('');
    setCustomer(null);
    setCustomerNotFound(false);

    try {
      const response = await axios.get(`${API_URL}/customers/account/${accountNumber}`);
      if (response.data.success) {
        setCustomer(response.data.customer);
        setCustomerNotFound(false);
      }
    } catch (err) {
      console.error('Error fetching customer:', err);
      setCustomerNotFound(true);
      setError('Customer not found with this account number');
    } finally {
      setSearchLoading(false);
    }
  };

  // Handle Enter key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      searchCustomer();
    }
  };

  // Handle deposit/withdraw transaction
  const handleTransaction = async () => {
    if (!amount || amount <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    if (transactionType === 'withdraw' && parseFloat(amount) > customer.balance) {
      setError('Insufficient balance');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await axios.post(`${API_URL}/transactions`, {
        accountNumber: customer.accountNumber,
        type: transactionType,
        amount: parseFloat(amount),
        employeeName: localStorage.getItem('employeeName') || 'Employee'
      });

      if (response.data.success) {
        setSuccess(`${transactionType === 'deposit' ? 'Deposit' : 'Withdrawal'} of ₹${amount} successful! Transaction ID: ${response.data.transaction.transactionId}`);
        setAmount('');
        // Update customer balance
        setCustomer({ ...customer, balance: response.data.newBalance });
      }
    } catch (err) {
      console.error('Transaction error:', err);
      setError(err.response?.data?.message || 'Transaction failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-deep-navy">Deposit / Withdraw</h1>
        <p className="text-gray-500 mt-1">Process customer deposits and withdrawals</p>
      </div>

      {/* Search Customer */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <h2 className="text-lg font-bold text-deep-navy mb-4">Find Customer Account</h2>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <FaCreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Enter 12-digit Account Number"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-royal-blue"
              maxLength="12"
            />
          </div>
          <button
            onClick={searchCustomer}
            disabled={searchLoading}
            className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition flex items-center gap-2 justify-center"
          >
            {searchLoading ? <FaSpinner className="animate-spin" /> : <FaSearch />}
            Search
          </button>
        </div>
      </div>

      {/* Customer Details */}
      {customer && (
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h2 className="text-lg font-bold text-deep-navy mb-4">Customer Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-xs text-gray-500">Account Number</p>
              <p className="font-mono font-semibold text-royal-blue">{customer.accountNumber}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-xs text-gray-500">Customer Name</p>
              <p className="font-semibold text-deep-navy">{customer.fullName}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-xs text-gray-500">Account Type</p>
              <p className="text-deep-navy">{customer.accountType}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-xs text-gray-500">Current Balance</p>
              <p className="font-semibold text-green-600 text-xl">₹{customer.balance?.toLocaleString() || 0}</p>
            </div>
          </div>
        </div>
      )}

      {/* Transaction Form */}
      {customer && (
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-lg font-bold text-deep-navy mb-4">Process Transaction</h2>
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}
          
          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-4">
              {success}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 font-medium mb-2">Transaction Type</label>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setTransactionType('deposit')}
                  className={`flex-1 py-3 rounded-lg font-semibold transition flex items-center justify-center gap-2 ${
                    transactionType === 'deposit'
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  <FaArrowUp />
                  Deposit
                </button>
                <button
                  type="button"
                  onClick={() => setTransactionType('withdraw')}
                  className={`flex-1 py-3 rounded-lg font-semibold transition flex items-center justify-center gap-2 ${
                    transactionType === 'withdraw'
                      ? 'bg-red-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  <FaArrowDown />
                  Withdraw
                </button>
              </div>
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">Amount (₹)</label>
              <div className="relative">
                <FaRupeeSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="number"
                  placeholder="Enter amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-royal-blue"
                />
              </div>
            </div>
          </div>

          <button
            onClick={handleTransaction}
            disabled={loading}
            className="w-full mt-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2"
          >
            {loading ? <FaSpinner className="animate-spin" /> : <FaWallet />}
            {loading ? 'Processing...' : `Process ${transactionType === 'deposit' ? 'Deposit' : 'Withdrawal'}`}
          </button>
        </div>
      )}

      {customerNotFound && !customer && (
        <div className="bg-yellow-50 border border-yellow-400 text-yellow-700 px-4 py-3 rounded-lg text-center">
          No customer found with this account number. Please check and try again.
        </div>
      )}
    </div>
  );
};

export default Transactions;