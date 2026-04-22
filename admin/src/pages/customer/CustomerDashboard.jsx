// pages/customer/CustomerDashboard.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUniversity, FaSignOutAlt, FaUser, FaWallet, FaHistory, FaChartLine, FaSpinner, FaArrowUp, FaArrowDown } from 'react-icons/fa';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const CustomerDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [customerData, setCustomerData] = useState({
    name: '',
    accountNumber: '',
    email: '',
    balance: 0,
    accountType: '',
    transactions: []
  });
  const [error, setError] = useState('');

  const customerName = localStorage.getItem('customerName') || 'Customer';
  const customerAccountNumber = localStorage.getItem('customerAccountNumber') || '';
  const customerEmail = localStorage.getItem('customerEmail') || '';
  const customerToken = localStorage.getItem('customerToken') || '';

  // Fetch customer data from API
  const fetchCustomerData = async () => {
    try {
      setLoading(true);
      
      // Fetch customer details by account number
      const customerResponse = await axios.get(`${API_URL}/customers/account/${customerAccountNumber}`);
      
      if (customerResponse.data.success) {
        const customer = customerResponse.data.customer;
        
        // Fetch transaction history for this customer
        const transactionsResponse = await axios.get(`${API_URL}/transactions/history/${customerAccountNumber}`);
        
        setCustomerData({
          name: customer.fullName,
          accountNumber: customer.accountNumber,
          email: customer.email,
          balance: customer.balance || 0,
          accountType: customer.accountType,
          transactions: transactionsResponse.data.transactions || []
        });
      } else {
        setError('Failed to fetch customer data');
      }
    } catch (err) {
      console.error('Error fetching customer data:', err);
      setError('Network error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (customerAccountNumber) {
      fetchCustomerData();
    } else {
      setLoading(false);
      setError('No account number found. Please login again.');
    }
  }, [customerAccountNumber]);

  const handleLogout = () => {
    localStorage.removeItem('customerLoggedIn');
    localStorage.removeItem('customerAccountNumber');
    localStorage.removeItem('customerName');
    localStorage.removeItem('customerEmail');
    localStorage.removeItem('customerToken');
    navigate('/');
  };

  const getTransactionIcon = (type) => {
    return type === 'deposit' ? <FaArrowUp className="text-green-600" /> : <FaArrowDown className="text-red-600" />;
  };

  const getAmountClass = (type) => {
    return type === 'deposit' ? 'text-green-600' : 'text-red-600';
  };

  const stats = [
    { 
      title: 'Account Balance', 
      value: `₹${customerData.balance?.toLocaleString() || 0}`, 
      icon: FaWallet, 
      color: 'bg-green-500' 
    },
    { 
      title: 'Total Transactions', 
      value: customerData.transactions.length.toString(), 
      icon: FaHistory, 
      color: 'bg-blue-500' 
    },
    { 
      title: 'Account Type', 
      value: customerData.accountType || 'Savings', 
      icon: FaUser, 
      color: 'bg-purple-500' 
    },
  ];

  // Get last 5 transactions
  const recentTransactions = customerData.transactions.slice(-5).reverse();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex justify-center items-center">
        <FaSpinner className="animate-spin text-4xl text-royal-blue" />
        <span className="ml-3 text-gray-600">Loading dashboard...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top Navbar */}
      <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <FaUniversity className="text-2xl text-royal-blue" />
          <span className="font-bold text-xl text-deep-navy">Customer Portal</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
              {customerData.name.charAt(0) || customerName.charAt(0)}
            </div>
            <div className="hidden md:block">
              <p className="text-sm font-semibold text-deep-navy">{customerData.name || customerName}</p>
              <p className="text-xs text-gray-500">{customerData.accountNumber || customerAccountNumber}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
          >
            <FaSignOutAlt />
            Logout
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-deep-navy">Welcome, {customerData.name || customerName}!</h1>
          <p className="text-gray-500 mt-1">Account: {customerData.accountNumber || customerAccountNumber}</p>
          <p className="text-gray-500">Email: {customerData.email || customerEmail}</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
            <button onClick={fetchCustomerData} className="ml-3 underline">Retry</button>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div key={idx} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm">{stat.title}</p>
                    <p className="text-2xl font-bold text-deep-navy mt-1">{stat.value}</p>
                  </div>
                  <div className={`${stat.color} p-3 rounded-full text-white`}>
                    <Icon className="text-xl" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Recent Transactions */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-deep-navy">Recent Transactions</h2>
            <button className="text-sm text-royal-blue hover:text-gold transition">View All</button>
          </div>
          
          {recentTransactions.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              No transactions found for this account
            </div>
          ) : (
            <div className="space-y-3">
              {recentTransactions.map((transaction) => (
                <div key={transaction.transactionId} className="flex justify-between items-center py-3 border-b last:border-0">
                  <div>
                    <div className="flex items-center gap-2">
                      {getTransactionIcon(transaction.type)}
                      <p className="font-semibold text-deep-navy">
                        {transaction.type === 'deposit' ? 'Deposit' : 'Withdrawal'}
                      </p>
                    </div>
                    <p className="text-xs text-gray-500">
                      {new Date(transaction.createdAt).toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-400 font-mono">
                      ID: {transaction.transactionId}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className={`font-semibold ${getAmountClass(transaction.type)}`}>
                      {transaction.type === 'deposit' ? '+' : '-'}₹{transaction.amount.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-400">
                      Balance: ₹{transaction.balanceAfter.toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Account Summary Card */}
        <div className="mt-6 bg-gradient-to-r from-royal-blue to-deep-navy rounded-xl shadow-md p-6 text-white">
          <h3 className="text-lg font-bold mb-3">Account Summary</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm opacity-80">Account Number</p>
              <p className="font-mono text-sm">{customerData.accountNumber || customerAccountNumber}</p>
            </div>
            <div>
              <p className="text-sm opacity-80">Account Type</p>
              <p className="font-semibold">{customerData.accountType || 'Savings'}</p>
            </div>
            <div>
              <p className="text-sm opacity-80">Current Balance</p>
              <p className="font-semibold text-xl">₹{customerData.balance?.toLocaleString() || 0}</p>
            </div>
            <div>
              <p className="text-sm opacity-80">Total Transactions</p>
              <p className="font-semibold">{customerData.transactions.length}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;