// pages/admin/AdminLoans.jsx
import React, { useState, useEffect } from 'react';
import { FaSpinner, FaEye, FaDownload, FaCheckCircle, FaTimesCircle, FaSearch, FaFile, FaImage, FaRupeeSign, FaCalendarAlt, FaUser, FaEnvelope, FaPhone } from 'react-icons/fa';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const AdminLoans = () => {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [remarks, setRemarks] = useState('');
  const [processingId, setProcessingId] = useState(null);

  // Fetch all loans
  const fetchLoans = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/loans/all`);
      if (response.data.success) {
        setLoans(response.data.loans);
      }
    } catch (err) {
      console.error('Error fetching loans:', err);
      setError('Failed to fetch loans');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLoans();
  }, []);

  // Update loan status
  const updateLoanStatus = async (loanId, status) => {
    setProcessingId(loanId);
    try {
      const response = await axios.put(`${API_URL}/loans/${loanId}/status`, {
        status,
        remarks,
        approvedBy: localStorage.getItem('adminEmail') || 'Admin'
      });
      if (response.data.success) {
        fetchLoans();
        setShowViewModal(false);
        setRemarks('');
        alert(`Loan ${status} successfully`);
      }
    } catch (err) {
      console.error('Error updating loan:', err);
      alert('Failed to update loan status');
    } finally {
      setProcessingId(null);
    }
  };

  // View document
  const viewDocument = (documentUrl) => {
    if (documentUrl) {
      window.open(documentUrl, '_blank');
    } else {
      alert('No document available');
    }
  };

  // Download document
  const downloadDocument = (documentUrl, fileName) => {
    if (documentUrl) {
      const link = document.createElement('a');
      link.href = documentUrl;
      link.download = fileName;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      alert('No document available');
    }
  };

  const filteredLoans = loans.filter(loan =>
    loan.loanId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    loan.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    loan.accountNumber?.includes(searchTerm) ||
    loan.loanType?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Pending':
        return <span className="px-2 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700">Pending</span>;
      case 'Approved':
        return <span className="px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">Approved</span>;
      case 'Rejected':
        return <span className="px-2 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700">Rejected</span>;
      default:
        return <span className="px-2 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700">{status}</span>;
    }
  };

  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center h-64">
        <FaSpinner className="animate-spin text-4xl text-royal-blue" />
        <span className="ml-3 text-gray-600">Loading loan applications...</span>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-deep-navy">Loan Approvals</h1>
        <p className="text-gray-500 mt-1">Review, approve, or reject loan applications</p>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-xl shadow-md p-4 mb-6">
        <div className="relative">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by Loan ID, Customer Name, Account Number, or Loan Type..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-royal-blue"
          />
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
          <button onClick={fetchLoans} className="ml-3 underline">Retry</button>
        </div>
      )}

      {/* Loans Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Loan ID</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Account No</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Loan Type</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tenure</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">EMI</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredLoans.map((loan) => (
                <tr key={loan._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono text-sm text-royal-blue">{loan.loanId}</td>
                  <td className="px-4 py-3 text-gray-600">{new Date(loan.createdAt).toLocaleDateString()}</td>
                  <td className="px-4 py-3 font-medium text-deep-navy">{loan.customerName}</td>
                  <td className="px-4 py-3 font-mono text-sm text-gray-600">{loan.accountNumber}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                      {loan.loanType}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-semibold text-deep-navy">₹{loan.amount?.toLocaleString()}</td>
                  <td className="px-4 py-3 text-gray-600">{loan.tenure} months</td>
                  <td className="px-4 py-3 text-gray-600">₹{loan.emi?.toLocaleString()}</td>
                  <td className="px-4 py-3">{getStatusBadge(loan.status)}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => { setSelectedLoan(loan); setShowViewModal(true); }}
                      className="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition flex items-center gap-1"
                    >
                      <FaEye className="text-xs" /> Review
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredLoans.length === 0 && (
          <div className="p-8 text-center text-gray-500">No loan applications found</div>
        )}
      </div>

      {/* View Loan Modal */}
      {showViewModal && selectedLoan && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto" onClick={() => setShowViewModal(false)}>
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b bg-blue-600 rounded-t-2xl sticky top-0">
              <h2 className="text-xl font-bold text-white">Loan Application Details</h2>
            </div>
            <div className="p-6">
              {/* Loan Information */}
              <div className="mb-6">
                <h3 className="text-lg font-bold text-deep-navy border-b pb-2 mb-4">Loan Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div><p className="text-xs text-gray-500">Loan ID</p><p className="font-mono text-royal-blue">{selectedLoan.loanId}</p></div>
                  <div><p className="text-xs text-gray-500">Applied Date</p><p>{new Date(selectedLoan.createdAt).toLocaleString()}</p></div>
                  <div><p className="text-xs text-gray-500">Loan Type</p><p className="font-semibold">{selectedLoan.loanType}</p></div>
                  <div><p className="text-xs text-gray-500">Loan Amount</p><p className="font-bold text-green-600">₹{selectedLoan.amount?.toLocaleString()}</p></div>
                  <div><p className="text-xs text-gray-500">Tenure</p><p>{selectedLoan.tenure} months</p></div>
                  <div><p className="text-xs text-gray-500">Interest Rate</p><p>{selectedLoan.interestRate}% p.a.</p></div>
                  <div><p className="text-xs text-gray-500">Monthly EMI</p><p className="font-semibold">₹{selectedLoan.emi?.toLocaleString()}</p></div>
                  <div><p className="text-xs text-gray-500">Total Payable</p><p>₹{selectedLoan.totalPayable?.toLocaleString()}</p></div>
                  <div><p className="text-xs text-gray-500">Applied By</p><p>{selectedLoan.appliedBy}</p></div>
                  <div><p className="text-xs text-gray-500">Status</p><p>{getStatusBadge(selectedLoan.status)}</p></div>
                </div>
              </div>

              {/* Customer Information */}
              <div className="mb-6">
                <h3 className="text-lg font-bold text-deep-navy border-b pb-2 mb-4">Customer Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div><p className="text-xs text-gray-500">Full Name</p><p className="font-semibold">{selectedLoan.customerName}</p></div>
                  <div><p className="text-xs text-gray-500">Account Number</p><p className="font-mono">{selectedLoan.accountNumber}</p></div>
                  <div><p className="text-xs text-gray-500">Email</p><p>{selectedLoan.customerEmail}</p></div>
                  <div><p className="text-xs text-gray-500">Phone</p><p>{selectedLoan.customerPhone}</p></div>
                </div>
              </div>

              {/* Document Section */}
              {selectedLoan.documentUrl && (
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-deep-navy border-b pb-2 mb-4">Supporting Document</h3>
                  <div className="flex gap-3">
                    <button
                      onClick={() => viewDocument(selectedLoan.documentUrl)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
                    >
                      <FaEye /> View Document
                    </button>
                    <button
                      onClick={() => downloadDocument(selectedLoan.documentUrl, `Loan_${selectedLoan.loanId}_Document`)}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center gap-2"
                    >
                      <FaDownload /> Download Document
                    </button>
                  </div>
                  {selectedLoan.documentUrl.includes('.jpg') || selectedLoan.documentUrl.includes('.png') || selectedLoan.documentUrl.includes('.jpeg') ? (
                    <div className="mt-4 border rounded-lg p-2">
                      <img src={selectedLoan.documentUrl} alt="Document" className="max-w-full max-h-64 mx-auto" />
                    </div>
                  ) : null}
                </div>
              )}

              {/* Approval Section (only for pending loans) */}
              {selectedLoan.status === 'Pending' && (
                <div className="border-t pt-4 mt-4">
                  <h3 className="text-lg font-bold text-deep-navy mb-4">Take Action</h3>
                  <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2">Remarks (Optional)</label>
                    <textarea
                      value={remarks}
                      onChange={(e) => setRemarks(e.target.value)}
                      rows="2"
                      placeholder="Add any remarks or comments..."
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-royal-blue"
                    ></textarea>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => updateLoanStatus(selectedLoan._id, 'Approved')}
                      disabled={processingId === selectedLoan._id}
                      className="flex-1 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition flex items-center justify-center gap-2"
                    >
                      {processingId === selectedLoan._id ? <FaSpinner className="animate-spin" /> : <FaCheckCircle />}
                      Approve Loan
                    </button>
                    <button
                      onClick={() => updateLoanStatus(selectedLoan._id, 'Rejected')}
                      disabled={processingId === selectedLoan._id}
                      className="flex-1 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition flex items-center justify-center gap-2"
                    >
                      {processingId === selectedLoan._id ? <FaSpinner className="animate-spin" /> : <FaTimesCircle />}
                      Reject Loan
                    </button>
                  </div>
                </div>
              )}

              {selectedLoan.status !== 'Pending' && selectedLoan.remarks && (
                <div className="border-t pt-4 mt-4">
                  <h3 className="text-lg font-bold text-deep-navy mb-2">Remarks</h3>
                  <p className="text-gray-600 bg-gray-50 p-3 rounded-lg">{selectedLoan.remarks}</p>
                  {selectedLoan.approvedBy && (
                    <p className="text-xs text-gray-500 mt-2">Processed by: {selectedLoan.approvedBy} on {new Date(selectedLoan.approvedDate).toLocaleString()}</p>
                  )}
                </div>
              )}
            </div>
            <div className="p-6 border-t">
              <button onClick={() => setShowViewModal(false)} className="w-full py-2 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700 transition">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminLoans;