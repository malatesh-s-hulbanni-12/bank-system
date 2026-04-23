// pages/customer/CustomerDashboard.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUniversity, FaSignOutAlt, FaUser, FaWallet, FaHistory, FaChartLine, FaSpinner, FaArrowUp, FaArrowDown, FaHandHoldingUsd, FaChartPie, FaPrint, FaDownload, FaCalendarAlt } from 'react-icons/fa';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const CustomerDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('transactions');
  const [customerData, setCustomerData] = useState({
    name: '',
    accountNumber: '',
    email: '',
    balance: 0,
    accountType: '',
    transactions: [],
    loans: [],
    fixedDeposits: []
  });
  const [error, setError] = useState('');
  
  // Date filter state
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [showDateFilter, setShowDateFilter] = useState(false);

  const customerName = localStorage.getItem('customerName') || 'Customer';
  const customerAccountNumber = localStorage.getItem('customerAccountNumber') || '';
  const customerEmail = localStorage.getItem('customerEmail') || '';

  // Fetch all customer data
  const fetchCustomerData = async () => {
    try {
      setLoading(true);
      
      // Fetch customer details
      const customerResponse = await axios.get(`${API_URL}/customers/account/${customerAccountNumber}`);
      
      if (customerResponse.data.success) {
        const customer = customerResponse.data.customer;
        
        // Fetch transactions
        const transactionsResponse = await axios.get(`${API_URL}/transactions/history/${customerAccountNumber}`);
        
        // Fetch loans
        const loansResponse = await axios.get(`${API_URL}/loans/account/${customerAccountNumber}`);
        
        // Fetch fixed deposits
        const fdResponse = await axios.get(`${API_URL}/fixed-deposits/account/${customerAccountNumber}`);
        
        setCustomerData({
          name: customer.fullName,
          accountNumber: customer.accountNumber,
          email: customer.email,
          balance: customer.balance || 0,
          accountType: customer.accountType,
          transactions: transactionsResponse.data.transactions || [],
          loans: loansResponse.data.loans || [],
          fixedDeposits: fdResponse.data.fixedDeposits || []
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

  // Filter transactions by date range
  const getFilteredTransactions = () => {
    let filtered = customerData.transactions;
    if (fromDate) {
      filtered = filtered.filter(t => new Date(t.createdAt) >= new Date(fromDate));
    }
    if (toDate) {
      filtered = filtered.filter(t => new Date(t.createdAt) <= new Date(toDate));
    }
    return filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  };

  // Print transaction statement
  const printStatement = () => {
    const filteredTransactions = getFilteredTransactions();
    const printWindow = window.open('', '_blank');
    const totalDeposits = filteredTransactions.filter(t => t.type === 'deposit').reduce((sum, t) => sum + t.amount, 0);
    const totalWithdrawals = filteredTransactions.filter(t => t.type === 'withdraw').reduce((sum, t) => sum + t.amount, 0);
    
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Account Statement - ${customerData.name}</title>
        <style>
          *{margin:0;padding:0;box-sizing:border-box}
          body{font-family:Arial,sans-serif;background:#fff;padding:20px}
          .statement{max-width:1000px;margin:0 auto;border:2px solid #0A2540;border-radius:8px;padding:20px}
          .header{text-align:center;border-bottom:2px solid #0A2540;padding-bottom:15px;margin-bottom:20px}
          .bank-name{font-size:24px;font-weight:bold;color:#0A2540}
          .title{font-size:18px;margin-top:5px}
          .info-section{display:flex;flex-wrap:wrap;gap:15px;margin-bottom:20px;padding:15px;background:#f5f5f5;border-radius:8px}
          .info-item{flex:1;min-width:150px}
          .info-label{font-size:12px;color:#666}
          .info-value{font-size:14px;font-weight:bold;color:#0A2540}
          table{width:100%;border-collapse:collapse;margin-top:15px}
          th,td{border:1px solid #ddd;padding:8px;text-align:left}
          th{background:#0A2540;color:white}
          .deposit{color:#2e7d32}
          .withdrawal{color:#c62828}
          .summary{display:flex;justify-content:space-between;margin-top:20px;padding:15px;background:#e8f0fe;border-radius:8px}
          .footer{text-align:center;margin-top:20px;padding-top:10px;border-top:1px solid #ddd;font-size:12px;color:#666}
          @media print{body{padding:0}}
        </style>
      </head>
      <body>
        <div class="statement">
          <div class="header">
            <div class="bank-name">M S HULBANNI BANK</div>
            <div class="title">ACCOUNT STATEMENT</div>
          </div>
          <div class="info-section">
            <div class="info-item"><div class="info-label">Account Holder</div><div class="info-value">${customerData.name}</div></div>
            <div class="info-item"><div class="info-label">Account Number</div><div class="info-value">${customerData.accountNumber}</div></div>
            <div class="info-item"><div class="info-label">Account Type</div><div class="info-value">${customerData.accountType}</div></div>
            <div class="info-item"><div class="info-label">Statement Period</div><div class="info-value">${fromDate || 'Start'} to ${toDate || 'Present'}</div></div>
          </div>
          <table>
            <thead><tr><th>Date</th><th>Transaction ID</th><th>Description</th><th>Amount</th><th>Balance</th></tr></thead>
            <tbody>
              ${filteredTransactions.map(t => `
                <tr>
                  <td>${new Date(t.createdAt).toLocaleString()}</td>
                  <td>${t.transactionId}</td>
                  <td class="${t.type === 'deposit' ? 'deposit' : 'withdrawal'}">${t.type === 'deposit' ? 'DEPOSIT' : 'WITHDRAWAL'}</td>
                  <td class="${t.type === 'deposit' ? 'deposit' : 'withdrawal'}">${t.type === 'deposit' ? '+' : '-'}₹${t.amount.toLocaleString()}</td>
                  <td>₹${t.balanceAfter.toLocaleString()}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          <div class="summary">
            <div><strong>Total Deposits:</strong> ₹${totalDeposits.toLocaleString()}</div>
            <div><strong>Total Withdrawals:</strong> ₹${totalWithdrawals.toLocaleString()}</div>
            <div><strong>Closing Balance:</strong> ₹${customerData.balance.toLocaleString()}</div>
          </div>
          <div class="footer">This is a computer generated statement. Generated on: ${new Date().toLocaleString()}</div>
        </div>
        <script>window.onload=function(){window.print();setTimeout(function(){window.close();},1000)}<\/script>
      </body>
      </html>
    `);
    printWindow.document.close();
  };

  const getTransactionIcon = (type) => {
    return type === 'deposit' ? <FaArrowUp className="text-green-600" /> : <FaArrowDown className="text-red-600" />;
  };

  const getAmountClass = (type) => {
    return type === 'deposit' ? 'text-green-600' : 'text-red-600';
  };

  const getLoanStatusBadge = (status) => {
    switch(status) {
      case 'Approved': return 'bg-green-100 text-green-700';
      case 'Rejected': return 'bg-red-100 text-red-700';
      default: return 'bg-yellow-100 text-yellow-700';
    }
  };

  const getFdStatusBadge = (status) => {
    switch(status) {
      case 'Matured': return 'bg-green-100 text-green-700';
      case 'Closed': return 'bg-red-100 text-red-700';
      default: return 'bg-blue-100 text-blue-700';
    }
  };

  const stats = [
    { title: 'Account Balance', value: `₹${customerData.balance?.toLocaleString() || 0}`, icon: FaWallet, color: 'bg-green-500' },
    { title: 'Total Transactions', value: customerData.transactions.length.toString(), icon: FaHistory, color: 'bg-blue-500' },
    { title: 'Active Loans', value: customerData.loans.filter(l => l.status === 'Approved').length.toString(), icon: FaHandHoldingUsd, color: 'bg-orange-500' },
    { title: 'Fixed Deposits', value: customerData.fixedDeposits.filter(f => f.status === 'Active').length.toString(), icon: FaChartPie, color: 'bg-purple-500' },
  ];

  const filteredTransactions = getFilteredTransactions();
  const recentTransactions = filteredTransactions.slice(0, 5);

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
          <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition">
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-deep-navy">Welcome, {customerData.name || customerName}!</h1>
          <p className="text-gray-500 mt-1">Account: {customerData.accountNumber || customerAccountNumber}</p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
            <button onClick={fetchCustomerData} className="ml-3 underline">Retry</button>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div key={idx} className="bg-white rounded-xl shadow-md p-4 hover:shadow-lg transition">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-xs">{stat.title}</p>
                    <p className="text-xl font-bold text-deep-navy">{stat.value}</p>
                  </div>
                  <div className={`${stat.color} p-2 rounded-full text-white`}>
                    <Icon className="text-lg" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          <button onClick={() => setActiveTab('transactions')} className={`px-4 py-2 rounded-lg font-semibold ${activeTab === 'transactions' ? 'bg-royal-blue text-white' : 'bg-gray-200 text-gray-700'}`}>Transactions</button>
          <button onClick={() => setActiveTab('loans')} className={`px-4 py-2 rounded-lg font-semibold ${activeTab === 'loans' ? 'bg-royal-blue text-white' : 'bg-gray-200 text-gray-700'}`}>Loans</button>
          <button onClick={() => setActiveTab('fixedDeposits')} className={`px-4 py-2 rounded-lg font-semibold ${activeTab === 'fixedDeposits' ? 'bg-royal-blue text-white' : 'bg-gray-200 text-gray-700'}`}>Fixed Deposits</button>
        </div>

        {/* Transactions Tab */}
        {activeTab === 'transactions' && (
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex flex-wrap justify-between items-center mb-4 gap-3">
              <h2 className="text-xl font-bold text-deep-navy">Transaction History</h2>
              <div className="flex gap-2">
                <button onClick={() => setShowDateFilter(!showDateFilter)} className="px-3 py-1 border rounded-lg text-sm flex items-center gap-1 hover:bg-gray-50">
                  <FaCalendarAlt /> Filter by Date
                </button>
                <button onClick={printStatement} className="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm flex items-center gap-1 hover:bg-blue-700">
                  <FaPrint /> Print Statement
                </button>
              </div>
            </div>
            
            {showDateFilter && (
              <div className="flex flex-wrap gap-3 mb-4 p-3 bg-gray-50 rounded-lg">
                <div><label className="text-sm text-gray-600">From:</label><input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} className="ml-2 px-2 py-1 border rounded" /></div>
                <div><label className="text-sm text-gray-600">To:</label><input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} className="ml-2 px-2 py-1 border rounded" /></div>
                <button onClick={() => { setFromDate(''); setToDate(''); }} className="px-3 py-1 bg-gray-500 text-white rounded text-sm">Clear</button>
              </div>
            )}
            
            {filteredTransactions.length === 0 ? (
              <div className="text-center text-gray-500 py-8">No transactions found for selected period</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr><th className="px-3 py-2 text-left text-xs">Date</th><th className="px-3 py-2 text-left text-xs">Transaction ID</th><th className="px-3 py-2 text-left text-xs">Type</th><th className="px-3 py-2 text-left text-xs">Amount</th><th className="px-3 py-2 text-left text-xs">Balance</th></tr>
                  </thead>
                  <tbody>
                    {filteredTransactions.map(t => (
                      <tr key={t.transactionId} className="border-b">
                        <td className="px-3 py-2 text-xs">{new Date(t.createdAt).toLocaleDateString()}</td>
                        <td className="px-3 py-2 text-xs font-mono">{t.transactionId}</td>
                        <td className="px-3 py-2"><span className={`px-2 py-0.5 rounded-full text-xs ${t.type === 'deposit' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{t.type}</span></td>
                        <td className={`px-3 py-2 text-xs font-semibold ${getAmountClass(t.type)}`}>{t.type === 'deposit' ? '+' : '-'}₹{t.amount.toLocaleString()}</td>
                        <td className="px-3 py-2 text-xs">₹{t.balanceAfter.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Loans Tab */}
        {activeTab === 'loans' && (
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-deep-navy mb-4">My Loan Applications</h2>
            {customerData.loans.length === 0 ? (
              <div className="text-center text-gray-500 py-8">No loan applications found</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr><th className="px-3 py-2 text-left text-xs">Date</th><th className="px-3 py-2 text-left text-xs">Loan ID</th><th className="px-3 py-2 text-left text-xs">Type</th><th className="px-3 py-2 text-left text-xs">Amount</th><th className="px-3 py-2 text-left text-xs">Tenure</th><th className="px-3 py-2 text-left text-xs">EMI</th><th className="px-3 py-2 text-left text-xs">Status</th></tr>
                  </thead>
                  <tbody>
                    {customerData.loans.map(l => (
                      <tr key={l.loanId} className="border-b">
                        <td className="px-3 py-2 text-xs">{new Date(l.createdAt).toLocaleDateString()}</td>
                        <td className="px-3 py-2 text-xs font-mono">{l.loanId}</td>
                        <td className="px-3 py-2 text-xs">{l.loanType}</td>
                        <td className="px-3 py-2 text-xs">₹{l.amount?.toLocaleString()}</td>
                        <td className="px-3 py-2 text-xs">{l.tenure} months</td>
                        <td className="px-3 py-2 text-xs">₹{l.emi?.toLocaleString()}</td>
                        <td className="px-3 py-2"><span className={`px-2 py-0.5 rounded-full text-xs ${getLoanStatusBadge(l.status)}`}>{l.status}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Fixed Deposits Tab */}
        {activeTab === 'fixedDeposits' && (
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-deep-navy mb-4">My Fixed Deposits</h2>
            {customerData.fixedDeposits.length === 0 ? (
              <div className="text-center text-gray-500 py-8">No fixed deposits found</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr><th className="px-3 py-2 text-left text-xs">Date</th><th className="px-3 py-2 text-left text-xs">FD ID</th><th className="px-3 py-2 text-left text-xs">Amount</th><th className="px-3 py-2 text-left text-xs">Tenure</th><th className="px-3 py-2 text-left text-xs">Rate</th><th className="px-3 py-2 text-left text-xs">Maturity Amount</th><th className="px-3 py-2 text-left text-xs">Maturity Date</th><th className="px-3 py-2 text-left text-xs">Status</th></tr>
                  </thead>
                  <tbody>
                    {customerData.fixedDeposits.map(f => (
                      <tr key={f.fdId} className="border-b">
                        <td className="px-3 py-2 text-xs">{new Date(f.createdAt).toLocaleDateString()}</td>
                        <td className="px-3 py-2 text-xs font-mono">{f.fdId}</td>
                        <td className="px-3 py-2 text-xs">₹{f.amount?.toLocaleString()}</td>
                        <td className="px-3 py-2 text-xs">{f.tenure} months</td>
                        <td className="px-3 py-2 text-xs">{f.interestRate}%</td>
                        <td className="px-3 py-2 text-xs font-semibold text-green-600">₹{f.maturityAmount?.toLocaleString()}</td>
                        <td className="px-3 py-2 text-xs">{new Date(f.maturityDate).toLocaleDateString()}</td>
                        <td className="px-3 py-2"><span className={`px-2 py-0.5 rounded-full text-xs ${getFdStatusBadge(f.status)}`}>{f.status}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Account Summary Card - Black Text on White Background */}
        <div className="mt-6 bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <h3 className="text-lg font-bold text-deep-navy mb-4">Account Summary</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-xs text-gray-500">Account Number</p>
              <p className="font-mono text-sm text-black font-semibold">{customerData.accountNumber}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-xs text-gray-500">Account Type</p>
              <p className="font-semibold text-black">{customerData.accountType}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-xs text-gray-500">Current Balance</p>
              <p className="font-bold text-xl text-green-600">₹{customerData.balance?.toLocaleString() || 0}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-xs text-gray-500">Total Transactions</p>
              <p className="font-semibold text-black">{customerData.transactions.length}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;