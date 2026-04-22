// pages/admin/ManageEmployees.jsx
import React, { useState, useEffect } from 'react';
import { FaSearch, FaEdit, FaTrash, FaUserPlus, FaEye, FaToggleOn, FaToggleOff, FaSpinner } from 'react-icons/fa';

const API_URL = 'http://localhost:5000/api';

const ManageEmployees = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch employees from API
  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/employees`);
      const data = await response.json();
      if (data.success) {
        setEmployees(data.employees);
      } else {
        setError('Failed to fetch employees');
      }
    } catch (err) {
      setError('Network error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  // Toggle employee status
  const toggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'Active' ? 'Inactive' : 'Active';
    try {
      const response = await fetch(`${API_URL}/employees/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await response.json();
      if (data.success) {
        fetchEmployees();
      }
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  // Delete employee
  const deleteEmployee = async (id) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        const response = await fetch(`${API_URL}/employees/${id}`, {
          method: 'DELETE'
        });
        const data = await response.json();
        if (data.success) {
          fetchEmployees();
        }
      } catch (err) {
        console.error('Error deleting employee:', err);
      }
    }
  };

  const filteredEmployees = employees.filter(emp =>
    emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-deep-navy">Manage Employees</h2>
          <p className="text-gray-500 mt-1">View and manage all bank employees</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-300 flex items-center gap-2"
        >
          <FaUserPlus className="text-white" />
          Add Employee
        </button>
      </div>
      
      {/* Search Bar */}
      <div className="bg-white rounded-xl shadow-md p-4 mb-6">
        <div className="relative">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search employees by name, email or role..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>
      
      {/* Loading State */}
      {loading && (
        <div className="bg-white rounded-xl shadow-md p-12 text-center">
          <FaSpinner className="animate-spin text-4xl text-blue-600 mx-auto mb-4" />
          <p className="text-gray-500">Loading employees...</p>
        </div>
      )}
      
      {/* Error State */}
      {error && !loading && (
        <div className="bg-red-50 rounded-xl shadow-md p-6 text-center border border-red-200">
          <p className="text-red-600">{error}</p>
          <button onClick={fetchEmployees} className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg">Retry</button>
        </div>
      )}
      
      {/* Employees Table */}
      {!loading && !error && (
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                  <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                  <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                  <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
                  <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredEmployees.map((emp) => (
                  <tr key={emp._id} className="hover:bg-gray-50">
                    <td className="px-4 md:px-6 py-4">
                      <div>
                        <p className="font-medium text-deep-navy">{emp.name}</p>
                        <p className="text-xs text-gray-500">ID: {emp._id.slice(-6).toUpperCase()}</p>
                      </div>
                    </td>
                    <td className="px-4 md:px-6 py-4 text-gray-600">{emp.email}</td>
                    <td className="px-4 md:px-6 py-4 text-gray-600">{emp.role}</td>
                    <td className="px-4 md:px-6 py-4 text-gray-600">{emp.phone}</td>
                    <td className="px-4 md:px-6 py-4">
                      <button
                        onClick={() => toggleStatus(emp._id, emp.status)}
                        className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold transition ${
                          emp.status === 'Active' 
                            ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                            : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                        }`}
                      >
                        {emp.status === 'Active' ? <FaToggleOn className="text-lg text-green-600" /> : <FaToggleOff className="text-lg text-gray-500" />}
                        {emp.status}
                      </button>
                    </td>
                    <td className="px-4 md:px-6 py-4">
                      <div className="flex gap-2">
                        <button 
                          onClick={() => { setSelectedEmployee(emp); setShowViewModal(true); }}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                        >
                          <FaEye />
                        </button>
                        <button 
                          onClick={() => { setSelectedEmployee(emp); setShowEditModal(true); }}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                        >
                          <FaEdit />
                        </button>
                        <button 
                          onClick={() => deleteEmployee(emp._id)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
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
          {filteredEmployees.length === 0 && (
            <div className="p-8 text-center text-gray-500">No employees found</div>
          )}
        </div>
      )}
      
      {/* Add Employee Modal */}
      {showAddModal && (
        <AddEmployeeModal 
          onClose={() => setShowAddModal(false)} 
          onSuccess={fetchEmployees}
        />
      )}
      
      {/* Edit Employee Modal */}
      {showEditModal && selectedEmployee && (
        <EditEmployeeModal 
          employee={selectedEmployee}
          onClose={() => { setShowEditModal(false); setSelectedEmployee(null); }}
          onSuccess={fetchEmployees}
        />
      )}
      
      {/* View Employee Modal */}
      {showViewModal && selectedEmployee && (
        <ViewEmployeeModal 
          employee={selectedEmployee}
          onClose={() => { setShowViewModal(false); setSelectedEmployee(null); }}
        />
      )}
    </div>
  );
};

// Add Employee Modal Component
const AddEmployeeModal = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', role: '', password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('http://localhost:5000/api/employees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      
      if (data.success) {
        onSuccess();
        onClose();
      } else {
        setError(data.message || 'Failed to add employee');
      }
    } catch (err) {
      setError('Network error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="p-6 border-b bg-blue-600 rounded-t-2xl">
          <h2 className="text-2xl font-bold text-white">Add New Employee</h2>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && <div className="bg-red-100 text-red-700 p-3 rounded-lg text-sm">{error}</div>}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Full Name *</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" required />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">Email *</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" required />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">Phone *</label>
            <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" required />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">Role *</label>
            <select name="role" value={formData.role} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500" required>
              <option value="">Select Role</option>
              <option value="Manager">Manager</option>
              <option value="Cashier">Cashier</option>
              <option value="Loan Officer">Loan Officer</option>
              <option value="Accountant">Accountant</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">Password *</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" required />
          </div>
          <div className="flex gap-3 pt-4">
            <button type="submit" disabled={loading} className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition disabled:opacity-50">
              {loading ? 'Adding...' : 'Add Employee'}
            </button>
            <button type="button" onClick={onClose} className="flex-1 py-2 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Edit Employee Modal Component
const EditEmployeeModal = ({ employee, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: employee.name,
    email: employee.email,
    phone: employee.phone,
    role: employee.role
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch(`http://localhost:5000/api/employees/${employee._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      
      if (data.success) {
        onSuccess();
        onClose();
      } else {
        setError(data.message || 'Failed to update employee');
      }
    } catch (err) {
      setError('Network error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="p-6 border-b bg-blue-600 rounded-t-2xl">
          <h2 className="text-2xl font-bold text-white">Edit Employee</h2>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && <div className="bg-red-100 text-red-700 p-3 rounded-lg text-sm">{error}</div>}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Full Name *</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" required />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">Email *</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" required />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">Phone *</label>
            <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" required />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">Role *</label>
            <select name="role" value={formData.role} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500" required>
              <option value="Manager">Manager</option>
              <option value="Cashier">Cashier</option>
              <option value="Loan Officer">Loan Officer</option>
              <option value="Accountant">Accountant</option>
            </select>
          </div>
          <div className="flex gap-3 pt-4">
            <button type="submit" disabled={loading} className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition disabled:opacity-50">
              {loading ? 'Updating...' : 'Update Employee'}
            </button>
            <button type="button" onClick={onClose} className="flex-1 py-2 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

// View Employee Modal Component
const ViewEmployeeModal = ({ employee, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="p-6 border-b bg-blue-600 rounded-t-2xl">
          <h2 className="text-2xl font-bold text-white">Employee Details</h2>
        </div>
        <div className="p-6 space-y-3">
          <div className="flex justify-between py-2 border-b">
            <span className="font-semibold text-gray-600">Name:</span>
            <span className="text-deep-navy">{employee.name}</span>
          </div>
          <div className="flex justify-between py-2 border-b">
            <span className="font-semibold text-gray-600">Email:</span>
            <span className="text-deep-navy">{employee.email}</span>
          </div>
          <div className="flex justify-between py-2 border-b">
            <span className="font-semibold text-gray-600">Phone:</span>
            <span className="text-deep-navy">{employee.phone}</span>
          </div>
          <div className="flex justify-between py-2 border-b">
            <span className="font-semibold text-gray-600">Role:</span>
            <span className="text-deep-navy">{employee.role}</span>
          </div>
          <div className="flex justify-between py-2 border-b">
            <span className="font-semibold text-gray-600">Status:</span>
            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${employee.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {employee.status}
            </span>
          </div>
          <div className="flex justify-between py-2 border-b">
            <span className="font-semibold text-gray-600">Employee ID:</span>
            <span className="text-deep-navy text-xs">{employee._id}</span>
          </div>
          <div className="flex justify-between py-2">
            <span className="font-semibold text-gray-600">Joined:</span>
            <span className="text-deep-navy">{new Date(employee.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
        <div className="p-6 border-t">
          <button onClick={onClose} className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition">Close</button>
        </div>
      </div>
    </div>
  );
};

export default ManageEmployees;