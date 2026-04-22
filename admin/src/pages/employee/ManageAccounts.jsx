// pages/employee/ManageAccounts.jsx
import React, { useState, useEffect } from 'react';
import { FaSearch, FaEye, FaEdit, FaLock, FaUnlock, FaTrash, FaUser, FaEnvelope, FaPhone, FaRupeeSign, FaSpinner, FaSave, FaTimes, FaIdCard, FaCalendarAlt, FaMapMarkerAlt, FaBriefcase, FaUserFriends, FaPrint } from 'react-icons/fa';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const ManageAccounts = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialSearch = queryParams.get('search') || '';
  
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editLoading, setEditLoading] = useState(false);

  // Fetch customers from API
  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/customers/all`);
      if (response.data.success) {
        setCustomers(response.data.customers);
      } else {
        setError('Failed to fetch customers');
      }
    } catch (err) {
      console.error('Error fetching customers:', err);
      setError('Network error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  // Search customers
  const handleSearch = async (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    if (value.trim()) {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/customers/search/${value}`);
        if (response.data.success) {
          setCustomers(response.data.customers);
        }
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setLoading(false);
      }
    } else {
      fetchCustomers();
    }
  };

  // Toggle customer status
  const toggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'Active' ? 'Inactive' : 'Active';
    try {
      const response = await axios.put(`${API_URL}/customers/${id}/status`, { status: newStatus });
      if (response.data.success) {
        fetchCustomers();
      }
    } catch (err) {
      console.error('Error updating status:', err);
      alert('Failed to update status');
    }
  };

  // Delete customer
  const deleteAccount = async (id) => {
    if (window.confirm('Are you sure you want to delete this account? This will also delete all uploaded documents.')) {
      try {
        const response = await axios.delete(`${API_URL}/customers/${id}`);
        if (response.data.success) {
          fetchCustomers();
          alert('Account deleted successfully');
        }
      } catch (err) {
        console.error('Error deleting customer:', err);
        alert('Failed to delete account');
      }
    }
  };

  // Update customer
  const handleUpdateCustomer = async (id, updatedData) => {
    setEditLoading(true);
    try {
      const response = await axios.put(`${API_URL}/customers/${id}`, updatedData);
      if (response.data.success) {
        fetchCustomers();
        setShowEditModal(false);
        alert('Customer updated successfully');
      }
    } catch (err) {
      console.error('Error updating customer:', err);
      alert('Failed to update customer');
    } finally {
      setEditLoading(false);
    }
  };

  // Print Passbook
  const handlePrintPassbook = async (customer) => {
    try {
      // Fetch transactions for this customer
      const transactionsResponse = await axios.get(`${API_URL}/transactions/history/${customer.accountNumber}`);
      const transactions = transactionsResponse.data.transactions || [];
      
      // Create print window
      const printWindow = window.open('', '_blank');
      
      // Generate HTML content
      const htmlContent = generatePassbookHTML(customer, transactions);
      
      printWindow.document.write(htmlContent);
      printWindow.document.close();
      
      // Wait for content to load then print
      printWindow.onload = function() {
        printWindow.print();
        printWindow.onafterprint = function() {
          printWindow.close();
        };
      };
    } catch (err) {
      console.error('Error printing passbook:', err);
      alert('Failed to generate passbook');
    }
  };

  // Generate Passbook HTML - Single Page Layout
  const generatePassbookHTML = (customer, transactions) => {
    const formatDate = (dateString) => {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-GB');
    };

    const formatDateTime = (dateString) => {
      const date = new Date(dateString);
      return date.toLocaleString();
    };

    const getStatusColor = (status) => {
      return status === 'Active' ? '#2e7d32' : '#c62828';
    };

    // Limit transactions to fit on one page (show last 10 only)
    const recentTransactions = transactions.slice(-8).reverse();

    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Passbook - ${customer.fullName}</title>
        <style>
          @page {
            size: A4;
            margin: 0.5cm;
          }
          
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body {
            font-family: 'Courier New', monospace;
            background: #fff;
            margin: 0;
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
          }
          
          .passbook {
            width: 25cm;
            background: white;
            border: 2px solid #0A2540;
            border-radius: 4px;
            padding: 12px;
            page-break-after: avoid;
            break-inside: avoid;
            margin: 0 auto;
          }
          
          .header {
            text-align: center;
            border-bottom: 2px solid #0A2540;
            padding-bottom: 6px;
            margin-bottom: 8px;
          }
          
          .bank-name {
            font-size: 18px;
            font-weight: bold;
            color: #0A2540;
            letter-spacing: 1px;
          }
          
          .bank-tagline {
            font-size: 9px;
            color: #0047AB;
            margin-top: 2px;
          }
          
          .passbook-title {
            font-size: 12px;
            font-weight: bold;
            margin-top: 3px;
          }
          
          .section-title {
            font-size: 11px;
            font-weight: bold;
            background: #0A2540;
            color: white;
            padding: 3px 6px;
            margin: 6px 0 4px 0;
            border-radius: 3px;
          }
          
          .details {
            display: flex;
            flex-wrap: wrap;
            font-size: 9px;
            margin-bottom: 6px;
            background: #f5f5f5;
            padding: 5px;
            border-radius: 4px;
          }
          
          .details-row {
            display: flex;
            width: 100%;
            margin-bottom: 2px;
          }
          
          .detail-item {
            width: 33.33%;
            display: flex;
          }
          
          .label {
            font-weight: bold;
            color: #0A2540;
            min-width: 65px;
            font-size: 9px;
          }
          
          .value {
            color: #333;
            font-size: 9px;
          }
          
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 4px;
            font-size: 8px;
          }
          
          table, th, td {
            border: 1px solid #0A2540;
          }
          
          th {
            background: #0047AB;
            color: white;
            padding: 4px;
            text-align: center;
            font-weight: bold;
            font-size: 8px;
          }
          
          td {
            padding: 3px;
            text-align: center;
            font-size: 8px;
          }
          
          .deposit {
            color: #2e7d32;
            font-weight: bold;
          }
          
          .withdrawal {
            color: #c62828;
            font-weight: bold;
          }
          
          .footer {
            margin-top: 8px;
            padding-top: 4px;
            border-top: 1px solid #ddd;
            font-size: 7px;
            text-align: center;
            color: #666;
          }
          
          .balance-highlight {
            font-size: 11px;
            font-weight: bold;
            color: #0047AB;
          }
          
          @media print {
            body {
              margin: 0;
              padding: 0;
            }
            .passbook {
              border: 1px solid #ccc;
              box-shadow: none;
              margin: 0 auto;
              page-break-after: avoid;
              break-inside: avoid;
            }
            th {
              background: #0047AB !important;
              color: white !important;
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
            .section-title {
              background: #0A2540 !important;
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
          }
        </style>
      </head>
      <body>
        <div class="passbook">
          <!-- Header -->
          <div class="header">
            <div class="bank-name">M S HULBANNI BANK</div>
            <div class="bank-tagline">"Your Trusted Financial Partner"</div>
            <div class="passbook-title">PASSBOOK</div>
          </div>
          
          <!-- Account Details -->
          <div class="section-title">ACCOUNT DETAILS</div>
          <div class="details">
            <div class="details-row">
              <div class="detail-item"><span class="label">Name:</span><span class="value"> ${customer.fullName}</span></div>
              <div class="detail-item"><span class="label">Account No:</span><span class="value"> ${customer.accountNumber}</span></div>
              <div class="detail-item"><span class="label">Type:</span><span class="value"> ${customer.accountType}</span></div>
            </div>
            <div class="details-row">
              <div class="detail-item"><span class="label">DOB:</span><span class="value"> ${customer.dateOfBirth}</span></div>
              <div class="detail-item"><span class="label">Phone:</span><span class="value"> ${customer.phone}</span></div>
              <div class="detail-item"><span class="label">Email:</span><span class="value"> ${customer.email}</span></div>
            </div>
            <div class="details-row">
              <div class="detail-item"><span class="label">Aadhar:</span><span class="value"> ${customer.aadharNumber}</span></div>
              <div class="detail-item"><span class="label">PAN:</span><span class="value"> ${customer.panNumber}</span></div>
              <div class="detail-item"><span class="label">Occupation:</span><span class="value"> ${customer.occupation}</span></div>
            </div>
            <div class="details-row">
              <div class="detail-item"><span class="label">Address:</span><span class="value"> ${customer.address}, ${customer.city}, ${customer.state} - ${customer.pincode}</span></div>
            </div>
            <div class="details-row">
              <div class="detail-item"><span class="label">Nominee:</span><span class="value"> ${customer.nominee || 'Not specified'}</span></div>
              <div class="detail-item"><span class="label">Status:</span><span class="value" style="color: ${getStatusColor(customer.status)}"> ${customer.status}</span></div>
              <div class="detail-item"><span class="label">Balance:</span><span class="value balance-highlight"> ₹${customer.balance?.toLocaleString() || 0}</span></div>
            </div>
          </div>
          
          <!-- Transaction History -->
          <div class="section-title">TRANSACTION HISTORY</div>
          <table>
            <thead>
              <tr>
                <th style="width: 22%">Date</th>
                <th style="width: 13%">Type</th>
                <th style="width: 15%">Amount (₹)</th>
                <th style="width: 15%">Balance (₹)</th>
                <th style="width: 20%">Processed By</th>
              </tr>
            </thead>
            <tbody>
              ${recentTransactions.length === 0 ? `
                <tr>
                  <td colspan="5" style="text-align: center; padding: 10px;">No transactions found</td>
                </tr>
              ` : `
                ${recentTransactions.map(tx => `
                  <tr>
                    <td style="font-size: 7px;">${formatDateTime(tx.createdAt)}</td>
                    <td class="${tx.type === 'deposit' ? 'deposit' : 'withdrawal'}">${tx.type === 'deposit' ? 'DEPOSIT' : 'WITHDRAWAL'}</td>
                    <td class="${tx.type === 'deposit' ? 'deposit' : 'withdrawal'}">${tx.type === 'deposit' ? '+' : '-'} ₹${tx.amount.toLocaleString()}</td>
                    <td>₹${tx.balanceAfter.toLocaleString()}</td>
                    <td style="font-size: 7px;">${tx.processedBy}</td>
                  </tr>
                `).join('')}
              `}
            </tbody>
          </table>
          
          <!-- Footer -->
          <div class="footer">
            <div>This is a computer generated statement. No signature required.</div>
            <div>Generated on: ${new Date().toLocaleString()} | Customer Care: 1800-123-4567</div>
          </div>
        </div>
      </body>
      </html>
    `;
  };

  // Format account number display
  const formatAccountNumber = (accountNumber) => {
    if (!accountNumber) return 'N/A';
    return accountNumber;
  };

  if (loading && customers.length === 0) {
    return (
      <div className="p-6">
        <div className="flex justify-center items-center h-64">
          <FaSpinner className="animate-spin text-4xl text-royal-blue" />
          <span className="ml-3 text-gray-600">Loading accounts...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-deep-navy">Manage Accounts</h1>
        <p className="text-gray-500 mt-1">View, search, and manage all customer accounts</p>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-xl shadow-md p-4 mb-6">
        <div className="relative">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, email, account number or phone..."
            value={searchTerm}
            onChange={handleSearch}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-royal-blue"
          />
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
          <button onClick={fetchCustomers} className="ml-3 underline">Retry</button>
        </div>
      )}

      {/* Accounts Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Account No</th>
                <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer Name</th>
                <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
                <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Account Type</th>
                <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Balance</th>
                <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {customers.map((customer) => (
                <tr key={customer._id} className="hover:bg-gray-50">
                  <td className="px-4 md:px-6 py-4 font-mono text-sm text-royal-blue">
                    {formatAccountNumber(customer.accountNumber)}
                  </td>
                  <td className="px-4 md:px-6 py-4 font-medium text-deep-navy">{customer.fullName}</td>
                  <td className="px-4 md:px-6 py-4 text-gray-600">{customer.email}</td>
                  <td className="px-4 md:px-6 py-4 text-gray-600">{customer.phone}</td>
                  <td className="px-4 md:px-6 py-4">
                    <span className="px-2 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                      {customer.accountType}
                    </span>
                  </td>
                  <td className="px-4 md:px-6 py-4 font-semibold text-deep-navy">
                    ₹{customer.balance?.toLocaleString() || 0}
                  </td>
                  <td className="px-4 md:px-6 py-4">
                    <button
                      onClick={() => toggleStatus(customer._id, customer.status)}
                      className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold transition ${
                        customer.status === 'Active'
                          ? 'bg-green-100 text-green-700 hover:bg-green-200'
                          : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                      }`}
                    >
                      {customer.status === 'Active' ? <FaLock className="text-xs" /> : <FaUnlock className="text-xs" />}
                      {customer.status}
                    </button>
                  </td>
                  <td className="px-4 md:px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => { setSelectedAccount(customer); setShowViewModal(true); }}
                        className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition"
                        title="View Details"
                      >
                        <FaEye />
                      </button>
                      <button
                        onClick={() => handlePrintPassbook(customer)}
                        className="p-2 text-purple-500 hover:bg-purple-50 rounded-lg transition"
                        title="Print Passbook"
                      >
                        <FaPrint />
                      </button>
                      <button
                        onClick={() => { setSelectedAccount(customer); setShowEditModal(true); }}
                        className="p-2 text-green-500 hover:bg-green-50 rounded-lg transition"
                        title="Edit"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => deleteAccount(customer._id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
                        title="Delete"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {customers.length === 0 && !loading && (
          <div className="p-8 text-center text-gray-500">No accounts found</div>
        )}
      </div>

      {/* View Account Modal */}
      {showViewModal && selectedAccount && (
        <ViewAccountModal account={selectedAccount} onClose={() => setShowViewModal(false)} />
      )}

      {/* Edit Account Modal */}
      {showEditModal && selectedAccount && (
        <EditAccountModal 
          account={selectedAccount} 
          onClose={() => setShowEditModal(false)}
          onUpdate={handleUpdateCustomer}
          loading={editLoading}
        />
      )}
    </div>
  );
};

// View Account Modal Component (same as before)
const ViewAccountModal = ({ account, onClose }) => {
  const [showDocuments, setShowDocuments] = useState(false);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="p-6 border-b bg-blue-600 rounded-t-2xl">
          <h2 className="text-2xl font-bold text-black">Account Details</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-xs text-gray-500">Account Number</p>
              <p className="font-mono font-semibold text-royal-blue">{account.accountNumber}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-xs text-gray-500">Account Type</p>
              <p className="font-semibold text-deep-navy">{account.accountType}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-xs text-gray-500">Full Name</p>
              <p className="font-semibold text-deep-navy">{account.fullName}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-xs text-gray-500">Email</p>
              <p className="text-deep-navy">{account.email}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-xs text-gray-500">Phone</p>
              <p className="text-deep-navy">{account.phone}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-xs text-gray-500">Balance</p>
              <p className="font-semibold text-green-600">₹{account.balance?.toLocaleString() || 0}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-xs text-gray-500">Status</p>
              <p className={`font-semibold ${account.status === 'Active' ? 'text-green-600' : 'text-red-600'}`}>{account.status}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-xs text-gray-500">Date of Birth</p>
              <p className="text-deep-navy">{account.dateOfBirth}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-xs text-gray-500">Aadhar Number</p>
              <p className="text-deep-navy">{account.aadharNumber}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-xs text-gray-500">PAN Number</p>
              <p className="text-deep-navy">{account.panNumber}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-xs text-gray-500">Occupation</p>
              <p className="text-deep-navy">{account.occupation}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-xs text-gray-500">Nominee</p>
              <p className="text-deep-navy">{account.nominee || 'Not specified'}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg col-span-2">
              <p className="text-xs text-gray-500">Address</p>
              <p className="text-deep-navy">{account.address}, {account.city}, {account.state} - {account.pincode}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg col-span-2">
              <p className="text-xs text-gray-500">Created At</p>
              <p className="text-deep-navy">{new Date(account.createdAt).toLocaleString()}</p>
            </div>
          </div>

          {/* Documents Section */}
          <div className="mt-6">
            <button
              onClick={() => setShowDocuments(!showDocuments)}
              className="w-full py-2 bg-gray-100 text-deep-navy rounded-lg font-semibold hover:bg-gray-200 transition"
            >
              {showDocuments ? 'Hide Documents' : 'View Uploaded Documents'}
            </button>
            
            {showDocuments && account.documents && (
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                {account.documents.aadharCard && (
                  <div className="border rounded-lg p-3">
                    <p className="text-sm font-semibold text-deep-navy mb-2">Aadhar Card</p>
                    <a href={account.documents.aadharCard} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline text-sm break-all">
                      View Document
                    </a>
                  </div>
                )}
                {account.documents.panCard && (
                  <div className="border rounded-lg p-3">
                    <p className="text-sm font-semibold text-deep-navy mb-2">PAN Card</p>
                    <a href={account.documents.panCard} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline text-sm break-all">
                      View Document
                    </a>
                  </div>
                )}
                {account.documents.photo && (
                  <div className="border rounded-lg p-3">
                    <p className="text-sm font-semibold text-deep-navy mb-2">Photo</p>
                    <img src={account.documents.photo} alt="Customer" className="w-32 h-32 object-cover rounded-lg" />
                  </div>
                )}
                {account.documents.signature && (
                  <div className="border rounded-lg p-3">
                    <p className="text-sm font-semibold text-deep-navy mb-2">Signature</p>
                    <img src={account.documents.signature} alt="Signature" className="w-32 h-32 object-cover rounded-lg" />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        <div className="p-6 border-t">
          <button onClick={onClose} className="w-full py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// Edit Account Modal Component
const EditAccountModal = ({ account, onClose, onUpdate, loading }) => {
  const [formData, setFormData] = useState({
    fullName: account.fullName || '',
    email: account.email || '',
    phone: account.phone || '',
    address: account.address || '',
    city: account.city || '',
    state: account.state || '',
    pincode: account.pincode || '',
    occupation: account.occupation || '',
    nominee: account.nominee || ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(account._id, formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="p-6 border-b bg-blue-600 rounded-t-2xl">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-black">Edit Customer Details</h2>
            <button onClick={onClose} className="text-black hover:text-gray-200 transition">
              <FaTimes className="text-xl" />
            </button>
          </div>
          <p className="text-black text-sm mt-1">Account: {account.accountNumber}</p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-medium mb-1">Full Name *</label>
              <div className="relative">
                <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">Email *</label>
              <div className="relative">
                <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">Phone *</label>
              <div className="relative">
                <FaPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">Occupation *</label>
              <div className="relative">
                <FaBriefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <select
                  name="occupation"
                  value={formData.occupation}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                >
                  <option value="">Select Occupation</option>
                  <option value="Salaried">Salaried</option>
                  <option value="Self Employed">Self Employed</option>
                  <option value="Business">Business</option>
                  <option value="Student">Student</option>
                  <option value="Retired">Retired</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">Nominee Name</label>
              <div className="relative">
                <FaUserFriends className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  name="nominee"
                  value={formData.nominee}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  placeholder="Optional"
                />
              </div>
            </div>

            <div className="col-span-2">
              <label className="block text-gray-700 font-medium mb-1">Address *</label>
              <div className="relative">
                <FaMapMarkerAlt className="absolute left-3 top-3 text-gray-400" />
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  rows="2"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                ></textarea>
              </div>
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">City *</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">State *</label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">Pincode *</label>
              <input
                type="text"
                name="pincode"
                value={formData.pincode}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2"
            >
              {loading ? <FaSpinner className="animate-spin" /> : <FaSave />}
              {loading ? 'Updating...' : 'Update Customer'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ManageAccounts;