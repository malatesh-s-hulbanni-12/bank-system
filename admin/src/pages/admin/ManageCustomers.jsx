// pages/admin/ManageCustomers.jsx
import React, { useState, useEffect } from 'react';
import { FaSearch, FaEdit, FaTrash, FaEye, FaSpinner, FaLock, FaUnlock } from 'react-icons/fa';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const ManageCustomers = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
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
  const deleteCustomer = async (id) => {
    if (window.confirm('Are you sure you want to delete this customer? This will also delete all uploaded documents.')) {
      try {
        const response = await axios.delete(`${API_URL}/customers/${id}`);
        if (response.data.success) {
          fetchCustomers();
          alert('Customer deleted successfully');
        }
      } catch (err) {
        console.error('Error deleting customer:', err);
        alert('Failed to delete customer');
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

  const filteredCustomers = customers.filter(customer =>
    customer.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.accountNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone?.includes(searchTerm)
  );

  if (loading && customers.length === 0) {
    return (
      <div className="p-6">
        <div className="flex justify-center items-center h-64">
          <FaSpinner className="animate-spin text-4xl text-royal-blue" />
          <span className="ml-3 text-gray-600">Loading customers...</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-deep-navy">Manage Customers</h2>
          <p className="text-gray-500 mt-1">View and manage all bank customers</p>
        </div>
      </div>
      
      {/* Search Bar */}
      <div className="bg-white rounded-xl shadow-md p-4 mb-6">
        <div className="relative">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search customers by name, email, account number or phone..."
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
      
      {/* Customers Table */}
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
              {filteredCustomers.map((customer) => (
                <tr key={customer._id} className="hover:bg-gray-50">
                  <td className="px-4 md:px-6 py-4 font-mono text-sm text-royal-blue">
                    {customer.accountNumber}
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
                        onClick={() => { setSelectedCustomer(customer); setShowViewModal(true); }}
                        className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition"
                        title="View Details"
                      >
                        <FaEye />
                      </button>
                      <button
                        onClick={() => { setSelectedCustomer(customer); setShowEditModal(true); }}
                        className="p-2 text-green-500 hover:bg-green-50 rounded-lg transition"
                        title="Edit"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => deleteCustomer(customer._id)}
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
        {filteredCustomers.length === 0 && !loading && (
          <div className="p-8 text-center text-gray-500">No customers found</div>
        )}
      </div>

      {/* View Customer Modal */}
      {showViewModal && selectedCustomer && (
        <ViewCustomerModal customer={selectedCustomer} onClose={() => setShowViewModal(false)} />
      )}

      {/* Edit Customer Modal */}
      {showEditModal && selectedCustomer && (
        <EditCustomerModal 
          customer={selectedCustomer} 
          onClose={() => setShowEditModal(false)}
          onUpdate={handleUpdateCustomer}
          loading={editLoading}
        />
      )}
    </div>
  );
};

// View Customer Modal Component
const ViewCustomerModal = ({ customer, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="p-6 border-b bg-blue-600 rounded-t-2xl">
          <h2 className="text-2xl font-bold text-black">Customer Details</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-xs text-gray-500">Account Number</p>
              <p className="font-mono font-semibold text-royal-blue">{customer.accountNumber}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-xs text-gray-500">Account Type</p>
              <p className="font-semibold text-deep-navy">{customer.accountType}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-xs text-gray-500">Full Name</p>
              <p className="font-semibold text-deep-navy">{customer.fullName}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-xs text-gray-500">Email</p>
              <p className="text-deep-navy">{customer.email}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-xs text-gray-500">Phone</p>
              <p className="text-deep-navy">{customer.phone}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-xs text-gray-500">Balance</p>
              <p className="font-semibold text-green-600">₹{customer.balance?.toLocaleString() || 0}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-xs text-gray-500">Status</p>
              <p className={`font-semibold ${customer.status === 'Active' ? 'text-green-600' : 'text-red-600'}`}>{customer.status}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-xs text-gray-500">Date of Birth</p>
              <p className="text-deep-navy">{customer.dateOfBirth}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-xs text-gray-500">Aadhar Number</p>
              <p className="text-deep-navy">{customer.aadharNumber}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-xs text-gray-500">PAN Number</p>
              <p className="text-deep-navy">{customer.panNumber}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-xs text-gray-500">Occupation</p>
              <p className="text-deep-navy">{customer.occupation}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-xs text-gray-500">Nominee</p>
              <p className="text-deep-navy">{customer.nominee || 'Not specified'}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg col-span-2">
              <p className="text-xs text-gray-500">Address</p>
              <p className="text-deep-navy">{customer.address}, {customer.city}, {customer.state} - {customer.pincode}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg col-span-2">
              <p className="text-xs text-gray-500">Created At</p>
              <p className="text-deep-navy">{new Date(customer.createdAt).toLocaleString()}</p>
            </div>
          </div>
        </div>
        <div className="p-6 border-t">
          <button onClick={onClose} className="w-full py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition">Close</button>
        </div>
      </div>
    </div>
  );
};

// Edit Customer Modal Component
const EditCustomerModal = ({ customer, onClose, onUpdate, loading }) => {
  const [formData, setFormData] = useState({
    fullName: customer.fullName || '',
    email: customer.email || '',
    phone: customer.phone || '',
    address: customer.address || '',
    city: customer.city || '',
    state: customer.state || '',
    pincode: customer.pincode || '',
    occupation: customer.occupation || '',
    nominee: customer.nominee || ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(customer._id, formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="p-6 border-b bg-blue-600 rounded-t-2xl">
          <h2 className="text-2xl font-bold text-black">Edit Customer</h2>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-gray-700 font-medium mb-1">Full Name *</label>
            <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500" required />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">Email *</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500" required />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">Phone *</label>
            <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500" required />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">Address *</label>
            <textarea name="address" value={formData.address} onChange={handleChange} rows="2" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500" required></textarea>
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">City *</label>
            <input type="text" name="city" value={formData.city} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500" required />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">State *</label>
            <input type="text" name="state" value={formData.state} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500" required />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">Pincode *</label>
            <input type="text" name="pincode" value={formData.pincode} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500" required />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">Occupation *</label>
            <select name="occupation" value={formData.occupation} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500" required>
              <option value="Salaried">Salaried</option>
              <option value="Self Employed">Self Employed</option>
              <option value="Business">Business</option>
              <option value="Student">Student</option>
              <option value="Retired">Retired</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">Nominee Name</label>
            <input type="text" name="nominee" value={formData.nominee} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500" />
          </div>
          <div className="flex gap-3 pt-4">
            <button type="submit" disabled={loading} className="flex-1 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition">
              {loading ? 'Updating...' : 'Update Customer'}
            </button>
            <button type="button" onClick={onClose} className="flex-1 py-2 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ManageCustomers;