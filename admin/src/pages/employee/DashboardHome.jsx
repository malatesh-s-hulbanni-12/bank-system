// pages/employee/DashboardHome.jsx
import React, { useState, useEffect } from 'react';
import { FaUsers, FaMoneyBillWave, FaUserPlus, FaChartLine, FaBell, FaClock, FaArrowUp, FaArrowDown, FaSpinner } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import axios from 'axios';

// In any component
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const DashboardHome = () => {
  const employeeName = localStorage.getItem('employeeName') || 'Employee';
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalCustomers: 0,
    activeCustomers: 0,
    totalBalance: 0,
    todayTransactions: 0,
    recentTransactions: [],
    recentCustomers: []
  });

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Fetch all customers
        const customersResponse = await axios.get(`${API_URL}/customers/all`);
        const customers = customersResponse.data.customers || [];
        
        // Calculate stats
        const totalCustomers = customers.length;
        const activeCustomers = customers.filter(c => c.status === 'Active').length;
        const totalBalance = customers.reduce((sum, c) => sum + (c.balance || 0), 0);
        
        // Get today's date (start of day)
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        // Fetch today's transactions
        let todayTransactions = 0;
        let recentTransactions = [];
        
        try {
          // Get recent transactions (last 10)
          const transactionsResponse = await axios.get(`${API_URL}/transactions/all`);
          const allTransactions = transactionsResponse.data.transactions || [];
          
          // Filter today's transactions
          todayTransactions = allTransactions.filter(t => {
            const transDate = new Date(t.createdAt);
            return transDate >= today;
          }).length;
          
          // Get last 5 transactions
          recentTransactions = allTransactions.slice(0, 5);
        } catch (err) {
          console.error('Error fetching transactions:', err);
        }
        
        // Get recent customers (last 5)
        const recentCustomers = customers.slice(-5).reverse();
        
        setStats({
          totalCustomers,
          activeCustomers,
          totalBalance,
          todayTransactions,
          recentTransactions,
          recentCustomers
        });
        
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);

  const quickStats = [
    { 
      title: 'Total Accounts', 
      value: stats.totalCustomers.toLocaleString(), 
      change: '+12%', 
      icon: FaUsers, 
      color: 'bg-blue-500' 
    },
    { 
      title: "Today's Transactions", 
      value: stats.todayTransactions.toLocaleString(), 
      change: '+5%', 
      icon: FaMoneyBillWave, 
      color: 'bg-green-500' 
    },
    { 
      title: 'Active Accounts', 
      value: stats.activeCustomers.toLocaleString(), 
      change: '+8%', 
      icon: FaClock, 
      color: 'bg-orange-500' 
    },
    { 
      title: 'Total Balance', 
      value: `₹${(stats.totalBalance / 10000000).toFixed(2)} Cr`, 
      change: '+3%', 
      icon: FaChartLine, 
      color: 'bg-purple-500' 
    },
  ];

  const getTransactionIcon = (type) => {
    return type === 'deposit' ? <FaArrowUp className="text-green-600" /> : <FaArrowDown className="text-red-600" />;
  };

  const getAmountClass = (type) => {
    return type === 'deposit' ? 'text-green-600' : 'text-red-600';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <FaSpinner className="animate-spin text-4xl text-royal-blue" />
        <span className="ml-3 text-gray-600">Loading dashboard...</span>
      </div>
    );
  }

  return (
    <div>
      {/* Welcome Section */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-deep-navy">Welcome back, {employeeName}!</h1>
        <p className="text-gray-500 mt-1">Here's what's happening at MS Hulbanni Bank today.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
        {quickStats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="bg-white rounded-xl shadow-md p-4 md:p-6 hover:shadow-lg transition group">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-xs md:text-sm">{stat.title}</p>
                  <p className="text-xl md:text-2xl font-bold text-deep-navy mt-1">{stat.value}</p>
                  <p className="text-xs md:text-sm text-green-600 mt-1">{stat.change} from yesterday</p>
                </div>
                <div className={`${stat.color} p-3 rounded-full text-white group-hover:scale-110 transition`}>
                  <Icon className="text-lg md:text-xl" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-md p-4 md:p-6">
          <h2 className="text-lg md:text-xl font-bold text-deep-navy mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <Link to="/employee/create-account">
              <button className="w-full p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2">
                <FaUserPlus />
                Create New Account
              </button>
            </Link>
            <Link to="/employee/transactions">
              <button className="w-full p-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center justify-center gap-2">
                <FaMoneyBillWave />
                Process Transaction
              </button>
            </Link>
            <Link to="/employee/finance">
              <button className="w-full p-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition flex items-center justify-center gap-2">
                <FaChartLine />
                View Reports
              </button>
            </Link>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white rounded-xl shadow-md p-4 md:p-6 lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg md:text-xl font-bold text-deep-navy">Recent Transactions</h2>
            <Link to="/employee/transaction-history">
              <button className="text-sm text-royal-blue hover:text-gold transition">View All</button>
            </Link>
          </div>
          <div className="space-y-3">
            {stats.recentTransactions.length === 0 ? (
              <div className="text-center text-gray-500 py-8">No transactions found</div>
            ) : (
              stats.recentTransactions.map((transaction) => (
                <div key={transaction.transactionId} className="flex items-center justify-between py-2 border-b last:border-0">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm ${
                      transaction.type === 'deposit' ? 'bg-green-500' : 'bg-red-500'
                    }`}>
                      {transaction.customerName?.charAt(0) || 'U'}
                    </div>
                    <div>
                      <p className="font-semibold text-deep-navy text-sm md:text-base">{transaction.customerName}</p>
                      <p className="text-xs md:text-sm text-gray-500">
                        {transaction.type === 'deposit' ? 'Deposit' : 'Withdrawal'}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-semibold text-sm md:text-base ${getAmountClass(transaction.type)}`}>
                      {transaction.type === 'deposit' ? '+' : '-'}₹{transaction.amount?.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-400">
                      {new Date(transaction.createdAt).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Recent Customers */}
      <div className="mt-6">
        <div className="bg-white rounded-xl shadow-md p-4 md:p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg md:text-xl font-bold text-deep-navy">Recent Customers</h2>
            <Link to="/employee/manage-accounts">
              <button className="text-sm text-royal-blue hover:text-gold transition">View All</button>
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Account No</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer Name</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Account Type</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Balance</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {stats.recentCustomers.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-4 py-8 text-center text-gray-500">No customers found</td>
                  </tr>
                ) : (
                  stats.recentCustomers.map((customer) => (
                    <tr key={customer._id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-mono text-sm text-royal-blue">{customer.accountNumber}</td>
                      <td className="px-4 py-3 font-medium text-deep-navy">{customer.fullName}</td>
                      <td className="px-4 py-3 text-gray-600">{customer.accountType}</td>
                      <td className="px-4 py-3 font-semibold text-deep-navy">₹{customer.balance?.toLocaleString() || 0}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          customer.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {customer.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;