// pages/employee/Finance.jsx
import React, { useState } from 'react';
import { FaChartLine, FaMoneyBillWave, FaRupeeSign, FaArrowUp, FaArrowDown, FaCalendarAlt, FaDownload } from 'react-icons/fa';

const Finance = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('monthly');

  const stats = [
    { title: 'Total Deposits', value: '₹25,40,000', change: '+12%', icon: FaArrowUp, color: 'text-green-600', bg: 'bg-green-100' },
    { title: 'Total Withdrawals', value: '₹18,20,000', change: '+5%', icon: FaArrowDown, color: 'text-red-600', bg: 'bg-red-100' },
    { title: 'Total Transactions', value: '1,245', change: '+8%', icon: FaMoneyBillWave, color: 'text-blue-600', bg: 'bg-blue-100' },
    { title: 'Total Balance', value: '₹4,50,00,000', change: '+3%', icon: FaRupeeSign, color: 'text-green-600', bg: 'bg-green-100' },
  ];

  const recentTransactions = [
    { id: 1, date: '2024-01-15', customer: 'Rahul Sharma', type: 'Deposit', amount: 5000, status: 'Completed' },
    { id: 2, date: '2024-01-14', customer: 'Priya Patel', type: 'Withdrawal', amount: 2000, status: 'Completed' },
    { id: 3, date: '2024-01-13', customer: 'Amit Kumar', type: 'Transfer', amount: 1000, status: 'Pending' },
    { id: 4, date: '2024-01-12', customer: 'Neha Gupta', type: 'Deposit', amount: 10000, status: 'Completed' },
    { id: 5, date: '2024-01-11', customer: 'Vikram Singh', type: 'Withdrawal', amount: 500, status: 'Completed' },
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-deep-navy">Finance Overview</h1>
        <p className="text-gray-500 mt-1">Track deposits, withdrawals, and overall bank financials</p>
      </div>

      {/* Period Selector */}
      <div className="flex gap-3 mb-6">
        <button
          onClick={() => setSelectedPeriod('daily')}
          className={`px-4 py-2 rounded-lg font-semibold transition ${
            selectedPeriod === 'daily' ? 'bg-royal-blue text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Daily
        </button>
        <button
          onClick={() => setSelectedPeriod('weekly')}
          className={`px-4 py-2 rounded-lg font-semibold transition ${
            selectedPeriod === 'weekly' ? 'bg-royal-blue text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Weekly
        </button>
        <button
          onClick={() => setSelectedPeriod('monthly')}
          className={`px-4 py-2 rounded-lg font-semibold transition ${
            selectedPeriod === 'monthly' ? 'bg-royal-blue text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Monthly
        </button>
        <button
          onClick={() => setSelectedPeriod('yearly')}
          className={`px-4 py-2 rounded-lg font-semibold transition ${
            selectedPeriod === 'yearly' ? 'bg-royal-blue text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Yearly
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">{stat.title}</p>
                  <p className="text-2xl font-bold text-deep-navy mt-1">{stat.value}</p>
                  <p className={`text-sm mt-1 ${stat.color}`}>{stat.change} from last period</p>
                </div>
                <div className={`${stat.bg} p-3 rounded-full`}>
                  <Icon className={`text-xl ${stat.color}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Chart Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-deep-navy">Transaction Trends</h2>
            <FaChartLine className="text-royal-blue text-xl" />
          </div>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            <p className="text-gray-400">Chart will be displayed here</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-deep-navy">Income vs Expense</h2>
            <FaMoneyBillWave className="text-royal-blue text-xl" />
          </div>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            <p className="text-gray-400">Pie chart will be displayed here</p>
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-6 border-b flex justify-between items-center">
          <h2 className="text-lg font-bold text-deep-navy">Recent Transactions</h2>
          <button className="flex items-center gap-2 text-royal-blue hover:text-gold transition">
            <FaDownload />
            Export Report
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {recentTransactions.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-gray-50">
                  <td className="px-4 md:px-6 py-4 text-gray-600">{transaction.date}</td>
                  <td className="px-4 md:px-6 py-4 font-medium text-deep-navy">{transaction.customer}</td>
                  <td className="px-4 md:px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      transaction.type === 'Deposit' ? 'bg-green-100 text-green-700' : 
                      transaction.type === 'Withdrawal' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {transaction.type}
                    </span>
                  </td>
                  <td className={`px-4 md:px-6 py-4 font-semibold ${
                    transaction.type === 'Deposit' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {transaction.type === 'Deposit' ? '+' : '-'}₹{transaction.amount.toLocaleString()}
                  </td>
                  <td className="px-4 md:px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      transaction.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {transaction.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Finance;