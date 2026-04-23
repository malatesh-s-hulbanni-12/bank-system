// pages/employee/TransactionHistory.jsx
import React, { useState } from 'react';
import { FaSearch, FaCreditCard, FaSpinner, FaDownload, FaArrowUp, FaArrowDown, FaFileExcel, FaFilePdf } from 'react-icons/fa';
import axios from 'axios';

// In any component
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const TransactionHistory = () => {
  const [accountNumber, setAccountNumber] = useState('');
  const [transactions, setTransactions] = useState([]);
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [error, setError] = useState('');
  const [showExportMenu, setShowExportMenu] = useState(false);

  // Search customer and fetch transaction history
  const searchCustomer = async () => {
    if (!accountNumber) {
      setError('Please enter account number');
      return;
    }

    setSearchLoading(true);
    setError('');
    setCustomer(null);
    setTransactions([]);

    try {
      // Fetch customer details
      const customerResponse = await axios.get(`${API_URL}/customers/account/${accountNumber}`);
      if (customerResponse.data.success) {
        setCustomer(customerResponse.data.customer);
        
        // Fetch transaction history
        const transactionResponse = await axios.get(`${API_URL}/transactions/history/${accountNumber}`);
        if (transactionResponse.data.success) {
          setTransactions(transactionResponse.data.transactions);
        }
      }
    } catch (err) {
      console.error('Error:', err);
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

  // Export to CSV
  const exportToCSV = () => {
    if (transactions.length === 0) {
      setError('No transactions to export');
      return;
    }

    const headers = ['Transaction ID', 'Date', 'Type', 'Amount', 'Balance After', 'Processed By'];
    const csvData = transactions.map(t => [
      t.transactionId,
      new Date(t.createdAt).toLocaleString(),
      t.type,
      t.amount,
      t.balanceAfter,
      t.processedBy
    ]);

    const csvContent = [headers, ...csvData].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transactions_${customer.accountNumber}_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setShowExportMenu(false);
  };

  // Export to JSON
  const exportToJSON = () => {
    if (transactions.length === 0) {
      setError('No transactions to export');
      return;
    }

    const exportData = {
      accountNumber: customer.accountNumber,
      customerName: customer.fullName,
      exportDate: new Date().toISOString(),
      totalTransactions: transactions.length,
      transactions: transactions.map(t => ({
        transactionId: t.transactionId,
        date: t.createdAt,
        type: t.type,
        amount: t.amount,
        balanceAfter: t.balanceAfter,
        processedBy: t.processedBy
      }))
    };

    const jsonStr = JSON.stringify(exportData, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transactions_${customer.accountNumber}_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setShowExportMenu(false);
  };

  // Print/Save as PDF
  const printTransactions = () => {
    if (transactions.length === 0) {
      setError('No transactions to print');
      return;
    }

    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Transaction History - ${customer.accountNumber}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            h1 { color: #0A2540; }
            h2 { color: #0047AB; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #0A2540; color: white; }
            .header { margin-bottom: 20px; }
            .footer { margin-top: 20px; font-size: 12px; color: #666; text-align: center; }
            .amount-positive { color: green; }
            .amount-negative { color: red; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>MS Hulbanni Bank</h1>
            <h2>Transaction History</h2>
            <p><strong>Account Number:</strong> ${customer.accountNumber}</p>
            <p><strong>Customer Name:</strong> ${customer.fullName}</p>
            <p><strong>Current Balance:</strong> ₹${customer.balance?.toLocaleString() || 0}</p>
            <p><strong>Generated On:</strong> ${new Date().toLocaleString()}</p>
          </div>
          <table>
            <thead>
              <tr>
                <th>Transaction ID</th>
                <th>Date</th>
                <th>Type</th>
                <th>Amount</th>
                <th>Balance After</th>
                <th>Processed By</th>
              </tr>
            </thead>
            <tbody>
              ${transactions.map(t => `
                <tr>
                  <td>${t.transactionId}</td>
                  <td>${new Date(t.createdAt).toLocaleString()}</td>
                  <td>${t.type === 'deposit' ? 'Deposit' : 'Withdrawal'}</td>
                  <td class="${t.type === 'deposit' ? 'amount-positive' : 'amount-negative'}">
                    ${t.type === 'deposit' ? '+' : '-'}₹${t.amount.toLocaleString()}
                  </td>
                  <td>₹${t.balanceAfter.toLocaleString()}</td>
                  <td>${t.processedBy}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          <div class="footer">
            <p>This is a system generated statement. For any discrepancies, please contact the bank.</p>
          </div>
          <script>
            window.onload = function() { window.print(); setTimeout(function() { window.close(); }, 500); }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
    setShowExportMenu(false);
  };

  const getTransactionIcon = (type) => {
    return type === 'deposit' ? <FaArrowUp className="text-green-600" /> : <FaArrowDown className="text-red-600" />;
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-deep-navy">Transaction History</h1>
        <p className="text-gray-500 mt-1">View all transactions for a customer account</p>
      </div>

      {/* Search Customer */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <h2 className="text-lg font-bold text-deep-navy mb-4">Search Account</h2>
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
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-deep-navy">Customer Details</h2>
            {/* Export Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowExportMenu(!showExportMenu)}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
              >
                <FaDownload />
                Export
              </button>
              {showExportMenu && (
                <div className="absolute right-0 mt-2 bg-white rounded-lg shadow-lg border z-10 w-48">
                  <button
                    onClick={exportToCSV}
                    className="w-full px-4 py-2 text-left hover:bg-gray-100 rounded-t-lg flex items-center gap-2"
                  >
                    <FaFileExcel className="text-green-600" />
                    Export as CSV
                  </button>
                  <button
                    onClick={exportToJSON}
                    className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center gap-2"
                  >
                    <FaFileExcel className="text-blue-600" />
                    Export as JSON
                  </button>
                  <button
                    onClick={printTransactions}
                    className="w-full px-4 py-2 text-left hover:bg-gray-100 rounded-b-lg flex items-center gap-2"
                  >
                    <FaFilePdf className="text-red-600" />
                    Print / Save as PDF
                  </button>
                </div>
              )}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-xs text-gray-500">Account Number</p>
              <p className="font-mono font-semibold text-royal-blue">{customer.accountNumber}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-xs text-gray-500">Customer Name</p>
              <p className="font-semibold text-deep-navy">{customer.fullName}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-xs text-gray-500">Current Balance</p>
              <p className="font-semibold text-green-600 text-xl">₹{customer.balance?.toLocaleString() || 0}</p>
            </div>
          </div>
        </div>
      )}

      {/* Transaction History Table */}
      {customer && (
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-6 border-b">
            <h2 className="text-lg font-bold text-deep-navy">Transaction History</h2>
            <p className="text-sm text-gray-500 mt-1">Total {transactions.length} transactions found</p>
          </div>
          
          {transactions.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              No transactions found for this account
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Transaction ID</th>
                    <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                    <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                    <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Balance After</th>
                    <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Processed By</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {transactions.map((transaction) => (
                    <tr key={transaction.transactionId} className="hover:bg-gray-50">
                      <td className="px-4 md:px-6 py-4 font-mono text-xs text-royal-blue">
                        {transaction.transactionId}
                      </td>
                      <td className="px-4 md:px-6 py-4 text-gray-600">
                        {new Date(transaction.createdAt).toLocaleString()}
                      </td>
                      <td className="px-4 md:px-6 py-4">
                        <span className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold w-24 ${
                          transaction.type === 'deposit' 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {getTransactionIcon(transaction.type)}
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
                        {transaction.processedBy}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {error && !customer && (
        <div className="bg-yellow-50 border border-yellow-400 text-yellow-700 px-4 py-3 rounded-lg text-center">
          {error}
        </div>
      )}
    </div>
  );
};

export default TransactionHistory;