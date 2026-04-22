// pages/admin/EmployeeHistory.jsx
import React, { useState, useEffect } from 'react';
import { FaSearch, FaEye, FaSpinner, FaUserTie, FaEnvelope, FaPhone, FaCalendarAlt, FaBriefcase, FaUsers, FaMoneyBillWave, FaUserPlus, FaChartLine, FaDownload } from 'react-icons/fa';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const EmployeeHistory = () => {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [employeeStats, setEmployeeStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  // Fetch employees from API
  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/employees`);
      if (response.data.success) {
        setEmployees(response.data.employees);
      } else {
        setError('Failed to fetch employees');
      }
    } catch (err) {
      console.error('Error fetching employees:', err);
      setError('Network error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  // Fetch employee statistics (accounts created, transactions processed)
  const fetchEmployeeStats = async (employee) => {
    setStatsLoading(true);
    setEmployeeStats(null);
    
    try {
      // Fetch all customers
      const customersResponse = await axios.get(`${API_URL}/customers/all`);
      const customers = customersResponse.data.customers || [];
      
      // Fetch all transactions
      const transactionsResponse = await axios.get(`${API_URL}/transactions/all`);
      const transactions = transactionsResponse.data.transactions || [];
      
      // Filter customers created by this employee
      const accountsCreated = customers.filter(c => 
        c.createdBy === employee.name || 
        c.createdBy === employee.email ||
        c.createdByEmployeeId === employee._id ||
        c.createdByEmployeeId === employee.email
      );
      
      // Filter transactions processed by this employee
      const employeeTransactions = transactions.filter(t => 
        t.processedBy === employee.name || 
        t.processedBy === employee.email
      );
      
      // Calculate statistics
      const totalDeposits = employeeTransactions
        .filter(t => t.type === 'deposit')
        .reduce((sum, t) => sum + t.amount, 0);
      
      const totalWithdrawals = employeeTransactions
        .filter(t => t.type === 'withdraw')
        .reduce((sum, t) => sum + t.amount, 0);
      
      const totalTransactions = employeeTransactions.length;
      
      // Calculate total balance from accounts created by this employee
      const totalAccountsBalance = accountsCreated.reduce((sum, c) => sum + (c.balance || 0), 0);
      
      // Get recent transactions (last 10)
      const recentTransactions = employeeTransactions.slice(-10).reverse();
      
      // Get accounts created by this employee (last 5)
      const recentAccounts = accountsCreated.slice(-5).reverse();
      
      setEmployeeStats({
        employee,
        totalAccountsCreated: accountsCreated.length,
        totalAccountsBalance,
        accountsCreatedList: recentAccounts,
        totalTransactions,
        totalDeposits,
        totalWithdrawals,
        recentTransactions,
        lastActive: new Date().toLocaleString()
      });
      
    } catch (err) {
      console.error('Error fetching employee stats:', err);
      setError('Failed to fetch employee statistics');
    } finally {
      setStatsLoading(false);
    }
  };

  const handleEmployeeSelect = async (employeeId) => {
    const employee = employees.find(e => e._id === employeeId);
    setSelectedEmployee(employee);
    if (employee) {
      await fetchEmployeeStats(employee);
    }
  };

  const handleSearch = (e) => {
    if (e.key === 'Enter' && selectedEmployee) {
      fetchEmployeeStats(selectedEmployee);
    }
  };

  if (loading && employees.length === 0) {
    return (
      <div className="p-6">
        <div className="flex justify-center items-center h-64">
          <FaSpinner className="animate-spin text-4xl text-royal-blue" />
          <span className="ml-3 text-gray-600">Loading employee history...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-deep-navy">Employee History</h1>
        <p className="text-gray-500 mt-1">Select an employee to view their activity and transaction history</p>
      </div>

      {/* Employee Selection Dropdown */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <h2 className="text-lg font-bold text-deep-navy mb-4">Select Employee</h2>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <FaUserTie className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <select
              value={selectedEmployee?._id || ''}
              onChange={(e) => handleEmployeeSelect(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-royal-blue appearance-none bg-white"
            >
              <option value="">-- Select an Employee --</option>
              {employees.map((employee) => (
                <option key={employee._id} value={employee._id}>
                  {employee.name} - {employee.role} ({employee.email})
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={() => selectedEmployee && fetchEmployeeStats(selectedEmployee)}
            onKeyPress={handleSearch}
            className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition flex items-center gap-2 justify-center"
          >
            <FaSearch />
            Search Activity
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
          <button onClick={() => fetchEmployeeStats(selectedEmployee)} className="ml-3 underline">Retry</button>
        </div>
      )}

      {/* Employee Statistics */}
      {statsLoading && (
        <div className="bg-white rounded-xl shadow-md p-12 text-center">
          <FaSpinner className="animate-spin text-4xl text-royal-blue mx-auto mb-4" />
          <p className="text-gray-500">Loading employee activity...</p>
        </div>
      )}

      {employeeStats && !statsLoading && (
        <>
          {/* Employee Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow-md p-4 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90">Total Accounts</p>
                  <p className="text-2xl font-bold">{employeeStats.totalAccountsCreated}</p>
                  <p className="text-xs opacity-75 mt-1">Created by employee</p>
                </div>
                <FaUserPlus className="text-3xl opacity-75" />
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl shadow-md p-4 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90">Total Transactions</p>
                  <p className="text-2xl font-bold">{employeeStats.totalTransactions}</p>
                  <p className="text-xs opacity-75 mt-1">Processed</p>
                </div>
                <FaMoneyBillWave className="text-3xl opacity-75" />
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl shadow-md p-4 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90">Total Deposits</p>
                  <p className="text-2xl font-bold">₹{employeeStats.totalDeposits.toLocaleString()}</p>
                  <p className="text-xs opacity-75 mt-1">Amount processed</p>
                </div>
                <FaArrowUp className="text-3xl opacity-75" />
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-xl shadow-md p-4 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90">Total Withdrawals</p>
                  <p className="text-2xl font-bold">₹{employeeStats.totalWithdrawals.toLocaleString()}</p>
                  <p className="text-xs opacity-75 mt-1">Amount processed</p>
                </div>
                <FaArrowDown className="text-3xl opacity-75" />
              </div>
            </div>
          </div>

          {/* Employee Details Card */}
          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-bold text-deep-navy">{employeeStats.employee.name}</h2>
                <p className="text-gray-500">{employeeStats.employee.role} • {employeeStats.employee.email}</p>
                <div className="flex gap-4 mt-3">
                  <span className="text-sm text-gray-500">📞 {employeeStats.employee.phone}</span>
                  <span className={`text-sm px-2 py-1 rounded-full ${
                    employeeStats.employee.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {employeeStats.employee.status}
                  </span>
                </div>
              </div>
              <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition flex items-center gap-2">
                <FaDownload />
                Export Report
              </button>
            </div>
          </div>

          {/* Accounts Created Section */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
            <div className="p-6 border-b">
              <h2 className="text-lg font-bold text-deep-navy">Accounts Created</h2>
              <p className="text-sm text-gray-500 mt-1">Total {employeeStats.totalAccountsCreated} accounts created by this employee</p>
            </div>
            
            {employeeStats.accountsCreatedList.length === 0 ? (
              <div className="p-12 text-center text-gray-500">
                No accounts created by this employee
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Account No</th>
                      <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer Name</th>
                      <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Account Type</th>
                      <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Balance</th>
                      <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {employeeStats.accountsCreatedList.map((account) => (
                      <tr key={account._id} className="hover:bg-gray-50">
                        <td className="px-4 md:px-6 py-4 font-mono text-sm text-royal-blue">
                          {account.accountNumber}
                        </td>
                        <td className="px-4 md:px-6 py-4 font-medium text-deep-navy">{account.fullName}</td>
                        <td className="px-4 md:px-6 py-4">
                          <span className="px-2 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                            {account.accountType}
                          </span>
                        </td>
                        <td className="px-4 md:px-6 py-4 font-semibold text-deep-navy">
                          ₹{account.balance?.toLocaleString() || 0}
                        </td>
                        <td className="px-4 md:px-6 py-4 text-gray-600">
                          {new Date(account.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {employeeStats.totalAccountsCreated > 5 && (
              <div className="p-4 text-center border-t">
                <button className="text-sm text-royal-blue hover:text-gold transition">View all {employeeStats.totalAccountsCreated} accounts →</button>
              </div>
            )}
          </div>

          {/* Recent Transactions Table */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-6 border-b">
              <h2 className="text-lg font-bold text-deep-navy">Recent Transactions Processed</h2>
              <p className="text-sm text-gray-500 mt-1">Last {employeeStats.recentTransactions.length} transactions handled by this employee</p>
            </div>
            
            {employeeStats.recentTransactions.length === 0 ? (
              <div className="p-12 text-center text-gray-500">
                No transactions processed by this employee
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Transaction ID</th>
                      <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                      <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                      <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                      <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Balance After</th>
                      <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date & Time</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {employeeStats.recentTransactions.map((transaction) => (
                      <tr key={transaction.transactionId} className="hover:bg-gray-50">
                        <td className="px-4 md:px-6 py-4 font-mono text-xs text-royal-blue">
                          {transaction.transactionId}
                        </td>
                        <td className="px-4 md:px-6 py-4 font-medium text-deep-navy">
                          {transaction.customerName}
                        </td>
                        <td className="px-4 md:px-6 py-4">
                          <span className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold w-24 ${
                            transaction.type === 'deposit' 
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-red-100 text-red-700'
                          }`}>
                            {transaction.type === 'deposit' ? <FaArrowUp className="text-xs" /> : <FaArrowDown className="text-xs" />}
                            {transaction.type === 'deposit' ? 'Deposit' : 'Withdrawal'}
                          </span>
                        </td>
                        <td className={`px-4 md:px-6 py-4 font-semibold ${
                          transaction.type === 'deposit' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {transaction.type === 'deposit' ? '+' : '-'}₹{transaction.amount.toLocaleString()}
                        </td>
                        <td className="px-4 md:px-6 py-4 font-semibold text-deep-navy">
                          ₹{transaction.balanceAfter.toLocaleString()}
                        </td>
                        <td className="px-4 md:px-6 py-4 text-gray-600">
                          {new Date(transaction.createdAt).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Summary Card */}
          <div className="mt-6 bg-blue-50 rounded-xl shadow-md p-6">
            <h3 className="text-lg font-bold text-deep-navy mb-3">Performance Summary</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-royal-blue">{employeeStats.totalAccountsCreated}</p>
                <p className="text-xs text-gray-600">Accounts Created</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">₹{employeeStats.totalDeposits.toLocaleString()}</p>
                <p className="text-xs text-gray-600">Total Deposits</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-red-600">₹{employeeStats.totalWithdrawals.toLocaleString()}</p>
                <p className="text-xs text-gray-600">Total Withdrawals</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-purple-600">{employeeStats.totalTransactions}</p>
                <p className="text-xs text-gray-600">Total Transactions</p>
              </div>
            </div>
          </div>
        </>
      )}

      {!selectedEmployee && !statsLoading && (
        <div className="bg-yellow-50 border border-yellow-400 text-yellow-700 px-4 py-3 rounded-lg text-center">
          Please select an employee to view their activity history
        </div>
      )}
    </div>
  );
};

// Helper components for icons
const FaArrowUp = ({ className }) => <svg className={className} fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" /></svg>;

const FaArrowDown = ({ className }) => <svg className={className} fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 10.293a1 1 0 010 1.414l-6 6a1 1 0 01-1.414 0l-6-6a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l4.293-4.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>;

export default EmployeeHistory;