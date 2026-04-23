// pages/employee/Finance.jsx
import React, { useState, useEffect } from 'react';
import { FaChartLine, FaMoneyBillWave, FaRupeeSign, FaArrowUp, FaArrowDown, FaSearch, FaCreditCard, FaSpinner, FaPrint, FaHandHoldingUsd, FaChartPie, FaCheckCircle, FaTimesCircle, FaUpload, FaFile, FaImage } from 'react-icons/fa';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const Finance = () => {
  const [activeTab, setActiveTab] = useState('loans');
  const [loading, setLoading] = useState(true);
  const [financeData, setFinanceData] = useState({
    totalLoans: 0,
    pendingLoans: 0,
    approvedLoans: 0,
    totalFixedDeposits: 0,
    activeFDs: 0,
    recentLoans: [],
    recentFixedDeposits: []
  });
  
  // Loan State
  const [showLoanModal, setShowLoanModal] = useState(false);
  const [loanAccountNumber, setLoanAccountNumber] = useState('');
  const [loanCustomer, setLoanCustomer] = useState(null);
  const [loanAmount, setLoanAmount] = useState('');
  const [loanTenure, setLoanTenure] = useState(12);
  const [loanType, setLoanType] = useState('Personal Loan');
  const [loanInterestRate, setLoanInterestRate] = useState(10.5);
  const [loanDocument, setLoanDocument] = useState(null);
  const [loanDocumentPreview, setLoanDocumentPreview] = useState(null);
  const [loanLoading, setLoanLoading] = useState(false);
  const [showLoanSlip, setShowLoanSlip] = useState(false);
  const [lastLoan, setLastLoan] = useState(null);
  const [error, setError] = useState('');
  const [searchLoading, setSearchLoading] = useState(false);

  // Fixed Deposit State
  const [showFDModal, setShowFDModal] = useState(false);
  const [fdAccountNumber, setFdAccountNumber] = useState('');
  const [fdCustomer, setFdCustomer] = useState(null);
  const [fdAmount, setFdAmount] = useState('');
  const [fdTenure, setFdTenure] = useState(12);
  const [fdInterestRate, setFdInterestRate] = useState(7.0);
  const [fdLoading, setFdLoading] = useState(false);
  const [showFDSlip, setShowFDSlip] = useState(false);
  const [lastFD, setLastFD] = useState(null);

  const loanTypes = [
    'Home Loan', 'Personal Loan', 'Car Loan', 'Education Loan', 'Business Loan', 'Gold Loan'
  ];

  // Fetch finance data
  const fetchFinanceData = async () => {
    try {
      setLoading(true);
      const [loansRes, fdRes] = await Promise.all([
        axios.get(`${API_URL}/loans/all`),
        axios.get(`${API_URL}/fixed-deposits/all`)
      ]);
      
      const loans = loansRes.data.loans || [];
      const fixedDeposits = fdRes.data.fixedDeposits || [];
      
      const totalLoans = loans.reduce((sum, l) => sum + l.amount, 0);
      const pendingLoans = loans.filter(l => l.status === 'Pending').length;
      const approvedLoans = loans.filter(l => l.status === 'Approved').length;
      const totalFixedDeposits = fixedDeposits.reduce((sum, f) => sum + f.amount, 0);
      const activeFDs = fixedDeposits.filter(f => f.status === 'Active').length;
      
      setFinanceData({
        totalLoans,
        pendingLoans,
        approvedLoans,
        totalFixedDeposits,
        activeFDs,
        recentLoans: loans.slice(-5).reverse(),
        recentFixedDeposits: fixedDeposits.slice(-5).reverse()
      });
    } catch (error) {
      console.error('Error fetching finance data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFinanceData();
  }, []);

  // Search customer for loan
  const searchLoanCustomer = async () => {
    if (!loanAccountNumber) {
      setError('Please enter account number');
      return;
    }
    setSearchLoading(true);
    setError('');
    setLoanCustomer(null);
    try {
      const response = await axios.get(`${API_URL}/customers/account/${loanAccountNumber}`);
      if (response.data.success) {
        setLoanCustomer(response.data.customer);
      }
    } catch (err) {
      setError('Customer not found');
    } finally {
      setSearchLoading(false);
    }
  };

  // Search customer for FD
  const searchFdCustomer = async () => {
    if (!fdAccountNumber) {
      setError('Please enter account number');
      return;
    }
    setSearchLoading(true);
    setError('');
    setFdCustomer(null);
    try {
      const response = await axios.get(`${API_URL}/customers/account/${fdAccountNumber}`);
      if (response.data.success) {
        setFdCustomer(response.data.customer);
      }
    } catch (err) {
      setError('Customer not found');
    } finally {
      setSearchLoading(false);
    }
  };

  // Handle loan document upload
  const handleLoanDocumentChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLoanDocument(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLoanDocumentPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Calculate EMI
  const calculateEMI = (amount, tenure, rate) => {
    if (!amount || amount <= 0) return 0;
    const principal = amount;
    const ratePerMonth = rate / (12 * 100);
    const months = tenure;
    const emi = principal * ratePerMonth * Math.pow(1 + ratePerMonth, months) / (Math.pow(1 + ratePerMonth, months) - 1);
    return isNaN(emi) ? 0 : Math.round(emi);
  };

  // Calculate FD Maturity Amount
  const calculateMaturityAmount = (amount, tenure, rate) => {
    if (!amount || amount <= 0) return 0;
    return Math.round(amount * Math.pow(1 + (rate / 100), tenure / 12));
  };

  // Process Loan Application
  const handleLoanApplication = async () => {
    if (!loanAmount || loanAmount <= 0) {
      setError('Please enter a valid loan amount');
      return;
    }
    if (!loanDocument) {
      setError('Please upload required document');
      return;
    }
    if (!loanCustomer) {
      setError('Please search and select a customer first');
      return;
    }
    setLoanLoading(true);
    setError('');
    
    const formData = new FormData();
    formData.append('accountNumber', loanCustomer.accountNumber);
    formData.append('customerName', loanCustomer.fullName);
    formData.append('customerEmail', loanCustomer.email);
    formData.append('customerPhone', loanCustomer.phone);
    formData.append('amount', parseFloat(loanAmount));
    formData.append('tenure', loanTenure);
    formData.append('loanType', loanType);
    formData.append('interestRate', loanInterestRate);
    formData.append('document', loanDocument);
    formData.append('employeeName', localStorage.getItem('employeeName') || 'Employee');
    
    try {
      const response = await axios.post(`${API_URL}/loans/apply`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (response.data.success) {
        setLastLoan(response.data.loan);
        setShowLoanSlip(true);
        setShowLoanModal(false);
        setLoanAmount('');
        setLoanDocument(null);
        setLoanDocumentPreview(null);
        setLoanCustomer(null);
        setLoanAccountNumber('');
        setLoanInterestRate(10.5);
        fetchFinanceData();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Loan application failed');
    } finally {
      setLoanLoading(false);
    }
  };

  // Process Fixed Deposit
  const handleFixedDeposit = async () => {
    if (!fdAmount || fdAmount <= 0) {
      setError('Please enter a valid deposit amount');
      return;
    }
    if (!fdCustomer) {
      setError('Please search and select a customer first');
      return;
    }
    if (parseFloat(fdAmount) > fdCustomer.balance) {
      setError('Insufficient balance');
      return;
    }
    setFdLoading(true);
    setError('');
    try {
      const response = await axios.post(`${API_URL}/fixed-deposits/create`, {
        accountNumber: fdCustomer.accountNumber,
        customerName: fdCustomer.fullName,
        customerEmail: fdCustomer.email,
        customerPhone: fdCustomer.phone,
        amount: parseFloat(fdAmount),
        tenure: fdTenure,
        interestRate: fdInterestRate,
        employeeName: localStorage.getItem('employeeName') || 'Employee'
      });
      if (response.data.success) {
        await axios.put(`${API_URL}/customers/balance/${fdCustomer.accountNumber}`, {
          newBalance: fdCustomer.balance - parseFloat(fdAmount)
        });
        setLastFD(response.data.fixedDeposit);
        setShowFDSlip(true);
        setShowFDModal(false);
        setFdAmount('');
        setFdCustomer(null);
        setFdAccountNumber('');
        setFdInterestRate(7.0);
        fetchFinanceData();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Fixed deposit creation failed');
    } finally {
      setFdLoading(false);
    }
  };

  // Print Loan Slip
  const printLoanSlip = () => {
    const printWindow = window.open('', '_blank');
    const emi = calculateEMI(lastLoan.amount, lastLoan.tenure, lastLoan.interestRate);
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head><title>Loan Application</title>
      <style>
        *{margin:0;padding:0;box-sizing:border-box}
        body{font-family:'Courier New',monospace;background:#fff;display:flex;justify-content:center;align-items:center;min-height:100vh;padding:20px}
        .slip{width:400px;background:white;border:2px solid #0A2540;border-radius:8px;padding:20px}
        .header{text-align:center;border-bottom:2px solid #0A2540;padding-bottom:10px;margin-bottom:15px}
        .bank-name{font-size:18px;font-weight:bold;color:#0A2540}
        .title{font-size:14px;font-weight:bold;margin:10px 0}
        .row{display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px dotted #ccc}
        .pending{color:#ff9800;font-weight:bold}
        .footer{text-align:center;margin-top:15px;padding-top:10px;border-top:1px solid #ddd;font-size:10px}
        @media print{body{padding:0}}
      </style>
      </head>
      <body>
        <div class="slip">
          <div class="header"><div class="bank-name">M S HULBANNI BANK</div><div class="title">LOAN APPLICATION ACKNOWLEDGEMENT</div></div>
          <div class="details">
            <div class="row"><span>Loan ID:</span><span>${lastLoan.loanId}</span></div>
            <div class="row"><span>Date:</span><span>${new Date().toLocaleString()}</span></div>
            <div class="row"><span>Customer:</span><span>${lastLoan.customerName}</span></div>
            <div class="row"><span>Account:</span><span>${lastLoan.accountNumber}</span></div>
            <div class="row"><span>Loan Type:</span><span>${lastLoan.loanType}</span></div>
            <div class="row"><span>Loan Amount:</span><span>₹${lastLoan.amount?.toLocaleString()}</span></div>
            <div class="row"><span>Tenure:</span><span>${lastLoan.tenure} months</span></div>
            <div class="row"><span>Interest Rate:</span><span>${lastLoan.interestRate}%</span></div>
            <div class="row"><span>Monthly EMI:</span><span>₹${emi.toLocaleString()}</span></div>
            <div class="row"><span>Status:</span><span class="pending">PENDING APPROVAL</span></div>
          </div>
          <div class="footer">Loan application submitted successfully. Will be processed within 24 hours.</div>
        </div>
        <script>window.onload=function(){window.print();setTimeout(function(){window.close();},1000)}<\/script>
      </body>
      </html>
    `);
    printWindow.document.close();
    setShowLoanSlip(false);
  };

  // Print FD Slip
  const printFDSlip = () => {
    const printWindow = window.open('', '_blank');
    const maturityAmount = calculateMaturityAmount(lastFD.amount, lastFD.tenure, lastFD.interestRate);
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head><title>Fixed Deposit</title>
      <style>
        *{margin:0;padding:0;box-sizing:border-box}
        body{font-family:'Courier New',monospace;background:#fff;display:flex;justify-content:center;align-items:center;min-height:100vh;padding:20px}
        .slip{width:400px;background:white;border:2px solid #0A2540;border-radius:8px;padding:20px}
        .header{text-align:center;border-bottom:2px solid #0A2540;padding-bottom:10px;margin-bottom:15px}
        .bank-name{font-size:18px;font-weight:bold;color:#0A2540}
        .title{font-size:14px;font-weight:bold;margin:10px 0}
        .row{display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px dotted #ccc}
        .amount{color:#2e7d32;font-weight:bold}
        .footer{text-align:center;margin-top:15px;padding-top:10px;border-top:1px solid #ddd;font-size:10px}
        @media print{body{padding:0}}
      </style>
      </head>
      <body>
        <div class="slip">
          <div class="header"><div class="bank-name">M S HULBANNI BANK</div><div class="title">FIXED DEPOSIT ACKNOWLEDGEMENT</div></div>
          <div class="details">
            <div class="row"><span>FD ID:</span><span>${lastFD.fdId}</span></div>
            <div class="row"><span>Date:</span><span>${new Date().toLocaleString()}</span></div>
            <div class="row"><span>Customer:</span><span>${lastFD.customerName}</span></div>
            <div class="row"><span>Account:</span><span>${lastFD.accountNumber}</span></div>
            <div class="row"><span>Deposit Amount:</span><span>₹${lastFD.amount?.toLocaleString()}</span></div>
            <div class="row"><span>Tenure:</span><span>${lastFD.tenure} months</span></div>
            <div class="row"><span>Interest Rate:</span><span>${lastFD.interestRate}% p.a.</span></div>
            <div class="row"><span>Maturity Amount:</span><span class="amount">₹${maturityAmount.toLocaleString()}</span></div>
            <div class="row"><span>Maturity Date:</span><span>${new Date(lastFD.maturityDate).toLocaleDateString()}</span></div>
          </div>
          <div class="footer">Fixed Deposit created successfully. Premature withdrawal charges may apply.</div>
        </div>
        <script>window.onload=function(){window.print();setTimeout(function(){window.close();},1000)}<\/script>
      </body>
      </html>
    `);
    printWindow.document.close();
    setShowFDSlip(false);
  };

  const stats = [
    { title: 'Total Loans Disbursed', value: `₹${(financeData.totalLoans / 100000).toFixed(2)} L`, icon: FaHandHoldingUsd, color: 'text-blue-600', bg: 'bg-blue-100' },
    { title: 'Pending Approvals', value: financeData.pendingLoans, icon: FaSpinner, color: 'text-yellow-600', bg: 'bg-yellow-100' },
    { title: 'Approved Loans', value: financeData.approvedLoans, icon: FaCheckCircle, color: 'text-green-600', bg: 'bg-green-100' },
    { title: 'Fixed Deposits', value: `₹${(financeData.totalFixedDeposits / 100000).toFixed(2)} L`, icon: FaChartPie, color: 'text-purple-600', bg: 'bg-purple-100' },
  ];

  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center h-64">
        <FaSpinner className="animate-spin text-4xl text-royal-blue" />
        <span className="ml-3 text-gray-600">Loading finance data...</span>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-deep-navy">Finance Overview</h1>
        <p className="text-gray-500 mt-1">Manage loans and fixed deposits</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="bg-white rounded-xl shadow-md p-4 hover:shadow-lg transition">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-xs">{stat.title}</p>
                  <p className="text-lg font-bold text-deep-navy">{stat.value}</p>
                </div>
                <div className={`${stat.bg} p-2 rounded-full`}>
                  <Icon className={`text-lg ${stat.color}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-3 mb-8">
        <button onClick={() => setShowLoanModal(true)} className="p-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition">
          <FaHandHoldingUsd className="inline mr-2" /> Apply for Loan
        </button>
        <button onClick={() => setShowFDModal(true)} className="p-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition">
          <FaChartPie className="inline mr-2" /> Create Fixed Deposit
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        <button onClick={() => setActiveTab('loans')} className={`px-4 py-2 rounded-lg font-semibold ${activeTab === 'loans' ? 'bg-royal-blue text-white' : 'bg-gray-200 text-gray-700'}`}>Loans</button>
        <button onClick={() => setActiveTab('fixedDeposits')} className={`px-4 py-2 rounded-lg font-semibold ${activeTab === 'fixedDeposits' ? 'bg-royal-blue text-white' : 'bg-gray-200 text-gray-700'}`}>Fixed Deposits</button>
      </div>

      {/* Loans Table */}
      {activeTab === 'loans' && (
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-4 border-b"><h2 className="font-bold text-deep-navy">Recent Loan Applications</h2></div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-2 text-left text-xs">Date</th>
                  <th className="px-3 py-2 text-left text-xs">Loan ID</th>
                  <th className="px-3 py-2 text-left text-xs">Customer</th>
                  <th className="px-3 py-2 text-left text-xs">Type</th>
                  <th className="px-3 py-2 text-left text-xs">Amount</th>
                  <th className="px-3 py-2 text-left text-xs">Tenure</th>
                  <th className="px-3 py-2 text-left text-xs">Rate</th>
                  <th className="px-3 py-2 text-left text-xs">Status</th>
                </tr>
              </thead>
              <tbody>
                {financeData.recentLoans.map(l => (
                  <tr key={l.loanId} className="border-b hover:bg-gray-50">
                    <td className="px-3 py-2 text-xs">{new Date(l.createdAt).toLocaleDateString()}</td>
                    <td className="px-3 py-2 text-xs font-mono">{l.loanId}</td>
                    <td className="px-3 py-2 text-xs">{l.customerName}</td>
                    <td className="px-3 py-2 text-xs">{l.loanType}</td>
                    <td className="px-3 py-2 text-xs">₹{l.amount?.toLocaleString()}</td>
                    <td className="px-3 py-2 text-xs">{l.tenure} months</td>
                    <td className="px-3 py-2 text-xs">{l.interestRate}%</td>
                    <td className="px-3 py-2"><span className={`px-2 py-0.5 rounded-full text-xs ${l.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' : l.status === 'Approved' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{l.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Fixed Deposits Table */}
      {activeTab === 'fixedDeposits' && (
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-4 border-b"><h2 className="font-bold text-deep-navy">Recent Fixed Deposits</h2></div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-2 text-left text-xs">Date</th>
                  <th className="px-3 py-2 text-left text-xs">FD ID</th>
                  <th className="px-3 py-2 text-left text-xs">Customer</th>
                  <th className="px-3 py-2 text-left text-xs">Amount</th>
                  <th className="px-3 py-2 text-left text-xs">Tenure</th>
                  <th className="px-3 py-2 text-left text-xs">Rate</th>
                  <th className="px-3 py-2 text-left text-xs">Status</th>
                </tr>
              </thead>
              <tbody>
                {financeData.recentFixedDeposits.map(f => (
                  <tr key={f.fdId} className="border-b hover:bg-gray-50">
                    <td className="px-3 py-2 text-xs">{new Date(f.createdAt).toLocaleDateString()}</td>
                    <td className="px-3 py-2 text-xs font-mono">{f.fdId}</td>
                    <td className="px-3 py-2 text-xs">{f.customerName}</td>
                    <td className="px-3 py-2 text-xs">₹{f.amount?.toLocaleString()}</td>
                    <td className="px-3 py-2 text-xs">{f.tenure} months</td>
                    <td className="px-3 py-2 text-xs">{f.interestRate}%</td>
                    <td className="px-3 py-2"><span className={`px-2 py-0.5 rounded-full text-xs ${f.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>{f.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Loan Modal */}
      {showLoanModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto" onClick={() => setShowLoanModal(false)}>
          <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b bg-blue-600 rounded-t-2xl sticky top-0"><h2 className="text-xl font-bold text-white">Apply for Loan</h2></div>
            <div className="p-6">
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">Account Number</label>
                <div className="flex gap-2">
                  <div className="flex-1 relative"><FaCreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" /><input type="text" placeholder="Enter 12-digit Account Number" value={loanAccountNumber} onChange={(e) => setLoanAccountNumber(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && searchLoanCustomer()} className="w-full pl-10 pr-4 py-2 border rounded-lg" maxLength="12" /></div>
                  <button onClick={searchLoanCustomer} disabled={searchLoading} className="px-4 py-2 bg-blue-600 text-white rounded-lg">{searchLoading ? <FaSpinner className="animate-spin" /> : <FaSearch />}</button>
                </div>
              </div>
              {loanCustomer && (<div className="mb-4 p-3 bg-gray-50 rounded-lg"><p className="font-semibold">{loanCustomer.fullName}</p><p className="text-xs text-gray-500">Balance: ₹{loanCustomer.balance?.toLocaleString()}</p></div>)}
              {error && <div className="bg-red-100 text-red-700 p-3 rounded-lg text-sm mb-4">{error}</div>}
              {loanCustomer && (
                <>
                  <div className="mb-4"><label className="block text-gray-700 font-medium mb-2">Loan Type</label><select value={loanType} onChange={(e) => setLoanType(e.target.value)} className="w-full px-4 py-2 border rounded-lg">{loanTypes.map(type => <option key={type} value={type}>{type}</option>)}</select></div>
                  <div className="mb-4"><label className="block text-gray-700 font-medium mb-2">Loan Amount (₹)</label><input type="number" placeholder="Enter loan amount" value={loanAmount} onChange={(e) => setLoanAmount(e.target.value)} className="w-full px-4 py-2 border rounded-lg" /></div>
                  <div className="mb-4"><label className="block text-gray-700 font-medium mb-2">Tenure (Months)</label><select value={loanTenure} onChange={(e) => setLoanTenure(Number(e.target.value))} className="w-full px-4 py-2 border rounded-lg"><option value={12}>12 months</option><option value={24}>24 months</option><option value={36}>36 months</option><option value={48}>48 months</option><option value={60}>60 months</option></select></div>
                  <div className="mb-4"><label className="block text-gray-700 font-medium mb-2">Interest Rate (%)</label><input type="number" step="0.5" placeholder="Enter interest rate" value={loanInterestRate} onChange={(e) => setLoanInterestRate(parseFloat(e.target.value))} className="w-full px-4 py-2 border rounded-lg" /></div>
                  <div className="mb-4"><label className="block text-gray-700 font-medium mb-2">Upload Document (ID Proof/Income Proof)</label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-500 transition cursor-pointer" onClick={() => document.getElementById('loanDocumentInput').click()}>
                      <input type="file" id="loanDocumentInput" accept="image/*,application/pdf" onChange={handleLoanDocumentChange} className="hidden" />
                      {loanDocumentPreview ? (
                        <div className="flex flex-col items-center"><img src={loanDocumentPreview} alt="Preview" className="w-32 h-32 object-cover rounded-lg mb-2" /><p className="text-sm text-green-600">Document uploaded</p></div>
                      ) : (<div><FaUpload className="text-4xl text-gray-400 mx-auto mb-2" /><p className="text-sm text-gray-500">Click to upload document</p></div>)}
                    </div>
                  </div>
                  <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm">Monthly EMI: ₹{calculateEMI(parseFloat(loanAmount || 0), loanTenure, loanInterestRate).toLocaleString()}</p>
                    <p className="text-xs text-gray-500">Total Payable: ₹{(calculateEMI(parseFloat(loanAmount || 0), loanTenure, loanInterestRate) * loanTenure).toLocaleString()}</p>
                  </div>
                  <button onClick={handleLoanApplication} disabled={loanLoading} className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold">{loanLoading ? <FaSpinner className="animate-spin inline mr-2" /> : <FaHandHoldingUsd className="inline mr-2" />}{loanLoading ? 'Processing...' : 'Apply for Loan'}</button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Fixed Deposit Modal */}
      {showFDModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto" onClick={() => setShowFDModal(false)}>
          <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b bg-purple-600 rounded-t-2xl sticky top-0"><h2 className="text-xl font-bold text-white">Create Fixed Deposit</h2></div>
            <div className="p-6">
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">Account Number</label>
                <div className="flex gap-2">
                  <div className="flex-1 relative"><FaCreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" /><input type="text" placeholder="Enter 12-digit Account Number" value={fdAccountNumber} onChange={(e) => setFdAccountNumber(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && searchFdCustomer()} className="w-full pl-10 pr-4 py-2 border rounded-lg" maxLength="12" /></div>
                  <button onClick={searchFdCustomer} disabled={searchLoading} className="px-4 py-2 bg-purple-600 text-white rounded-lg">{searchLoading ? <FaSpinner className="animate-spin" /> : <FaSearch />}</button>
                </div>
              </div>
              {fdCustomer && (<div className="mb-4 p-3 bg-gray-50 rounded-lg"><p className="font-semibold">{fdCustomer.fullName}</p><p className="text-xs text-gray-500">Available Balance: ₹{fdCustomer.balance?.toLocaleString()}</p></div>)}
              {error && <div className="bg-red-100 text-red-700 p-3 rounded-lg text-sm mb-4">{error}</div>}
              {fdCustomer && (
                <>
                  <div className="mb-4"><label className="block text-gray-700 font-medium mb-2">Deposit Amount (₹)</label><input type="number" placeholder="Enter amount" value={fdAmount} onChange={(e) => setFdAmount(e.target.value)} className="w-full px-4 py-2 border rounded-lg" /></div>
                  <div className="mb-4"><label className="block text-gray-700 font-medium mb-2">Tenure (Months)</label>
                    <div className="grid grid-cols-3 gap-2">
                      {[6, 12, 18, 24, 36, 48, 60, 84, 120].map(months => (
                        <button key={months} type="button" onClick={() => setFdTenure(months)} className={`py-2 rounded-lg text-sm ${fdTenure === months ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-700'}`}>{months}M</button>
                      ))}
                    </div>
                  </div>
                  <div className="mb-4"><label className="block text-gray-700 font-medium mb-2">Interest Rate (%)</label><input type="number" step="0.1" placeholder="Enter interest rate" value={fdInterestRate} onChange={(e) => setFdInterestRate(parseFloat(e.target.value))} className="w-full px-4 py-2 border rounded-lg" /></div>
                  <div className="mb-4 p-3 bg-purple-50 rounded-lg">
                    <p className="text-sm font-semibold">Maturity Amount: ₹{calculateMaturityAmount(parseFloat(fdAmount || 0), fdTenure, fdInterestRate).toLocaleString()}</p>
                    <p className="text-xs text-gray-500">Maturity Date: {new Date(Date.now() + fdTenure * 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}</p>
                  </div>
                  <button onClick={handleFixedDeposit} disabled={fdLoading} className="w-full py-3 bg-purple-600 text-white rounded-lg font-semibold">{fdLoading ? <FaSpinner className="animate-spin inline mr-2" /> : <FaChartPie className="inline mr-2" />}{fdLoading ? 'Processing...' : 'Create Fixed Deposit'}</button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Loan Acknowledgement Slip */}
      {showLoanSlip && lastLoan && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full">
            <div className="p-6 border-b bg-blue-600 rounded-t-2xl"><h2 className="text-xl font-bold text-white">Loan Application Submitted!</h2></div>
            <div className="p-6">
              <div className="space-y-3">
                <div className="flex justify-between"><span>Loan ID:</span><span>{lastLoan.loanId}</span></div>
                <div className="flex justify-between"><span>Customer:</span><span>{lastLoan.customerName}</span></div>
                <div className="flex justify-between"><span>Loan Type:</span><span>{lastLoan.loanType}</span></div>
                <div className="flex justify-between"><span>Amount:</span><span className="font-bold">₹{lastLoan.amount?.toLocaleString()}</span></div>
                <div className="flex justify-between"><span>Tenure:</span><span>{lastLoan.tenure} months</span></div>
                <div className="flex justify-between"><span>Interest Rate:</span><span>{lastLoan.interestRate}%</span></div>
                <div className="flex justify-between"><span>EMI:</span><span>₹{calculateEMI(lastLoan.amount, lastLoan.tenure, lastLoan.interestRate).toLocaleString()}</span></div>
                <div className="flex justify-between"><span>Status:</span><span className="text-yellow-600">Pending Approval</span></div>
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={printLoanSlip} className="flex-1 py-2 bg-blue-600 text-white rounded-lg"><FaPrint className="inline mr-1" /> Print</button>
                <button onClick={() => setShowLoanSlip(false)} className="flex-1 py-2 border rounded-lg">Close</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FD Acknowledgement Slip */}
      {showFDSlip && lastFD && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full">
            <div className="p-6 border-b bg-purple-600 rounded-t-2xl"><h2 className="text-xl font-bold text-white">Fixed Deposit Created!</h2></div>
            <div className="p-6">
              <div className="space-y-3">
                <div className="flex justify-between"><span>FD ID:</span><span>{lastFD.fdId}</span></div>
                <div className="flex justify-between"><span>Customer:</span><span>{lastFD.customerName}</span></div>
                <div className="flex justify-between"><span>Amount:</span><span className="font-bold">₹{lastFD.amount?.toLocaleString()}</span></div>
                <div className="flex justify-between"><span>Tenure:</span><span>{lastFD.tenure} months</span></div>
                <div className="flex justify-between"><span>Interest Rate:</span><span>{lastFD.interestRate}%</span></div>
                <div className="flex justify-between"><span>Maturity Amount:</span><span className="text-green-600 font-bold">₹{calculateMaturityAmount(lastFD.amount, lastFD.tenure, lastFD.interestRate).toLocaleString()}</span></div>
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={printFDSlip} className="flex-1 py-2 bg-purple-600 text-white rounded-lg"><FaPrint className="inline mr-1" /> Print</button>
                <button onClick={() => setShowFDSlip(false)} className="flex-1 py-2 border rounded-lg">Close</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Finance;