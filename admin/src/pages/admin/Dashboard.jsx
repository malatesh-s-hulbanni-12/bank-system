// pages/admin/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { FaUsers, FaMoneyBillWave, FaWallet, FaChartLine, FaUserTie, FaUserPlus, FaSpinner } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import axios from 'axios';

// In any component
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    totalCustomers: 0,
    activeCustomers: 0,
    totalEmployees: 0,
    activeEmployees: 0,
    totalTransactions: 0,
    totalBalance: 0,
    recentActivities: [],
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
        
        // Fetch all employees
        const employeesResponse = await axios.get(`${API_URL}/employees`);
        const employees = employeesResponse.data.employees || [];
        
        // Fetch all transactions
        const transactionsResponse = await axios.get(`${API_URL}/transactions/all`);
        const transactions = transactionsResponse.data.transactions || [];
        
        // Calculate stats
        const totalCustomers = customers.length;
        const activeCustomers = customers.filter(c => c.status === 'Active').length;
        const totalEmployees = employees.length;
        const activeEmployees = employees.filter(e => e.status === 'Active').length;
        
        // Calculate total balance by summing all customer balances
        const totalBalance = customers.reduce((sum, c) => sum + (c.balance || 0), 0);
        const totalTransactions = transactions.length;
        
        // Get recent activities (last 5)
        const recentActivities = [];
        
        // Add recent customer signups
        const recentCustomersList = [...customers].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);
        recentCustomersList.forEach(customer => {
          recentActivities.push({
            id: `customer_${customer._id}`,
            user: customer.fullName,
            action: 'Opened new account',
            time: new Date(customer.createdAt).toLocaleString(),
            icon: FaUserPlus,
            type: 'customer'
          });
        });
        
        // Add recent transactions
        const recentTransactionsList = [...transactions].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);
        recentTransactionsList.forEach(transaction => {
          recentActivities.push({
            id: `transaction_${transaction.transactionId}`,
            user: transaction.customerName,
            action: `${transaction.type === 'deposit' ? 'Deposited' : 'Withdrawn'} ₹${transaction.amount.toLocaleString()}`,
            time: new Date(transaction.createdAt).toLocaleString(),
            icon: FaMoneyBillWave,
            type: 'transaction'
          });
        });
        
        // Sort by time (newest first)
        recentActivities.sort((a, b) => {
          return new Date(b.time) - new Date(a.time);
        });
        
        setDashboardData({
          totalCustomers,
          activeCustomers,
          totalEmployees,
          activeEmployees,
          totalTransactions,
          totalBalance,
          recentActivities: recentActivities.slice(0, 5),
          recentCustomers: recentCustomersList
        });
        
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);

  // Format total balance
  const formatTotalBalance = (balance) => {
    if (balance >= 10000000) {
      return `₹${(balance / 10000000).toFixed(2)} Cr`;
    } else if (balance >= 100000) {
      return `₹${(balance / 100000).toFixed(2)} Lakhs`;
    } else {
      return `₹${balance.toLocaleString()}`;
    }
  };

  const stats = [
    { 
      title: 'Total Customers', 
      value: dashboardData.totalCustomers.toLocaleString(), 
      icon: FaUsers, 
      color: 'bg-blue-500', 
      change: '+12%',
      subValue: `${dashboardData.activeCustomers} Active`
    },
    { 
      title: 'Total Employees', 
      value: dashboardData.totalEmployees.toLocaleString(), 
      icon: FaUserTie, 
      color: 'bg-green-500', 
      change: '+5%',
      subValue: `${dashboardData.activeEmployees} Active`
    },
    { 
      title: 'Total Transactions', 
      value: dashboardData.totalTransactions.toLocaleString(), 
      icon: FaMoneyBillWave, 
      color: 'bg-purple-500', 
      change: '+8%',
      subValue: 'All time'
    },
    { 
      title: 'Total Balance', 
      value: formatTotalBalance(dashboardData.totalBalance), 
      icon: FaWallet, 
      color: 'bg-orange-500', 
      change: '+3%',
      subValue: `Sum of all customer accounts`
    },
  ];

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
      <div className="mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-deep-navy">Dashboard Overview</h2>
        <p className="text-gray-500 mt-1">Welcome back, Admin! Here's what's happening with your bank today.</p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="bg-white rounded-xl shadow-md p-4 md:p-6 hover:shadow-lg transition group">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">{stat.title}</p>
                  <p className="text-2xl md:text-3xl font-bold text-deep-navy mt-1">{stat.value}</p>
                  <p className="text-green-600 text-xs md:text-sm mt-1">{stat.change} from last month</p>
                  <p className="text-gray-400 text-xs mt-1">{stat.subValue}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-full text-white group-hover:scale-110 transition`}>
                  <Icon className="text-xl md:text-2xl" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <div className="bg-white rounded-xl shadow-md p-4 md:p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg md:text-xl font-bold text-deep-navy">Recent Activities</h3>
            <button className="text-sm text-royal-blue hover:text-gold transition">View All</button>
          </div>
          <div className="space-y-4">
            {dashboardData.recentActivities.length === 0 ? (
              <div className="text-center text-gray-500 py-8">No recent activities</div>
            ) : (
              dashboardData.recentActivities.map((activity) => {
                const Icon = activity.icon;
                return (
                  <div key={activity.id} className="flex items-center gap-3 py-2 border-b last:border-0">
                    <div className="w-10 h-10 bg-royal-blue/10 rounded-full flex items-center justify-center text-royal-blue">
                      <Icon className="text-lg" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-deep-navy">{activity.user}</p>
                      <p className="text-sm text-gray-500">{activity.action}</p>
                    </div>
                    <p className="text-xs text-gray-400">{activity.time}</p>
                  </div>
                );
              })
            )}
          </div>
        </div>
        
        {/* Recent Customers */}
        <div className="bg-white rounded-xl shadow-md p-4 md:p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg md:text-xl font-bold text-deep-navy">Recent Customers</h3>
            <Link to="/admin/customers">
              <button className="text-sm text-royal-blue hover:text-gold transition">View All</button>
            </Link>
          </div>
          <div className="space-y-4">
            {dashboardData.recentCustomers.length === 0 ? (
              <div className="text-center text-gray-500 py-8">No customers found</div>
            ) : (
              dashboardData.recentCustomers.map((customer) => (
                <div key={customer._id} className="flex items-center gap-3 py-2 border-b last:border-0">
                  <div className="w-10 h-10 bg-green-500/10 rounded-full flex items-center justify-center text-green-600">
                    <FaUsers className="text-lg" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-deep-navy">{customer.fullName}</p>
                    <p className="text-sm text-gray-500">Account: {customer.accountNumber}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-deep-navy">₹{customer.balance?.toLocaleString() || 0}</p>
                    <p className="text-xs text-gray-400">{new Date(customer.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      
      {/* Quick Stats Cards - Second Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-bold text-deep-navy mb-4">Quick Stats</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-deep-navy">{dashboardData.activeCustomers}</p>
              <p className="text-sm text-gray-600">Active Customers</p>
            </div>
            <div className="bg-green-50 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-deep-navy">{dashboardData.activeEmployees}</p>
              <p className="text-sm text-gray-600">Active Employees</p>
            </div>
            <div className="bg-purple-50 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-deep-navy">{dashboardData.totalTransactions}</p>
              <p className="text-sm text-gray-600">Total Transactions</p>
            </div>
            <div className="bg-orange-50 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-deep-navy">{formatTotalBalance(dashboardData.totalBalance)}</p>
              <p className="text-sm text-gray-600">Total Balance</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-bold text-deep-navy mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-4">
            <Link to="/admin/employees">
              <button className="w-full p-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition text-center">
                <FaUserTie className="text-2xl mx-auto mb-2" />
                <span className="text-sm font-semibold">Manage Employees</span>
              </button>
            </Link>
            <Link to="/admin/customers">
              <button className="w-full p-4 bg-green-600 text-white rounded-xl hover:bg-green-700 transition text-center">
                <FaUsers className="text-2xl mx-auto mb-2" />
                <span className="text-sm font-semibold">Manage Customers</span>
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;