// components/Navbar.jsx
import React, { useState } from 'react';
import { FaHome, FaInfoCircle, FaServicestack, FaEnvelope, FaSignInAlt, FaBars, FaTimes, FaUniversity, FaUser, FaUserTie, FaUsers, FaIdCard, FaCalendarAlt, FaCreditCard, FaHandHoldingUsd, FaChartLine } from 'react-icons/fa';
import { Link, useLocation, useNavigate } from 'react-router-dom';

// In any component
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoginDropdownOpen, setIsLoginDropdownOpen] = useState(false);
  const [isServicesDropdownOpen, setIsServicesDropdownOpen] = useState(false);
  const [activeModal, setActiveModal] = useState(null);
  const [selectedRole, setSelectedRole] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  const navLinks = [
    { name: "Home", path: "/", icon: FaHome },
    { name: "About", path: "/about", icon: FaInfoCircle },
    { name: "Services", path: "#", icon: FaServicestack, hasDropdown: true },
    { name: "Contact", path: "/contact", icon: FaEnvelope }
  ];

  const servicesLinks = [
    { name: "Loans", path: "/loans", icon: FaHandHoldingUsd },
    { name: "Fixed Deposit", path: "/fixed-deposit", icon: FaChartLine }
  ];

  const isActive = (path) => location.pathname === path;

  const loginOptions = [
    { type: "Admin", icon: FaUserTie, role: "admin" },
    { type: "Customer", icon: FaUser, role: "customer" },
    { type: "Employee", icon: FaUsers, role: "employee" }
  ];

  const openModal = (role) => {
    setSelectedRole(role);
    setActiveModal(role);
    setIsLoginDropdownOpen(false);
    setIsOpen(false);
  };

  const closeModal = () => {
    setActiveModal(null);
    setSelectedRole('');
  };

  const handleAdminLoginSuccess = () => {
    closeModal();
    navigate('/admin/dashboard');
  };

  const handleEmployeeLoginSuccess = () => {
    closeModal();
    navigate('/employee/dashboard');
  };

  const handleCustomerLoginSuccess = () => {
    closeModal();
    navigate('/customer/dashboard');
  };

  return (
    <>
      <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2 hover:opacity-90 transition">
              <FaUniversity className="text-3xl text-royal-blue" />
              <span className="font-bold text-xl md:text-2xl text-deep-navy">MS Hulbanni Bank</span>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              {navLinks.map((link) => {
                const Icon = link.icon;
                if (link.hasDropdown) {
                  return (
                    <div
                      key={link.name}
                      className="relative"
                      onMouseEnter={() => setIsServicesDropdownOpen(true)}
                      onMouseLeave={() => setIsServicesDropdownOpen(false)}
                    >
                      <button
                        className={`flex items-center gap-2 transition py-1 ${
                          servicesLinks.some(s => isActive(s.path))
                            ? 'text-royal-blue font-semibold border-b-2 border-royal-blue'
                            : 'text-gray-700 hover:text-royal-blue'
                        }`}
                      >
                        <Icon className="text-sm" />
                        <span>{link.name}</span>
                      </button>
                      {isServicesDropdownOpen && (
                        <div className="absolute top-full left-0 mt-2 bg-white rounded-xl shadow-lg border border-gray-100 w-48 overflow-hidden z-50 animate-fadeIn">
                          {servicesLinks.map((service) => {
                            const ServiceIcon = service.icon;
                            return (
                              <Link
                                key={service.name}
                                to={service.path}
                                onClick={() => setIsServicesDropdownOpen(false)}
                                className="w-full px-4 py-3 text-left flex items-center gap-3 hover:bg-royal-blue/10 transition text-gray-700"
                              >
                                <ServiceIcon className="text-royal-blue" />
                                <span>{service.name}</span>
                              </Link>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                }
                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    className={`flex items-center gap-2 transition ${
                      isActive(link.path)
                        ? "text-royal-blue font-semibold border-b-2 border-royal-blue"
                        : "text-gray-700 hover:text-royal-blue"
                    }`}
                  >
                    <Icon className="text-sm" />
                    <span>{link.name}</span>
                  </Link>
                );
              })}
            </div>

            {/* Desktop Login Button with Dropdown */}
            <div className="hidden md:flex items-center">
              <div 
                className="relative"
                onMouseEnter={() => setIsLoginDropdownOpen(true)}
                onMouseLeave={() => setIsLoginDropdownOpen(false)}
              >
                <button className="px-5 py-2 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition flex items-center gap-2">
                  <FaSignInAlt />
                  Login
                </button>
                {isLoginDropdownOpen && (
                  <div className="absolute top-full right-0 mt-2 bg-white rounded-xl shadow-lg border border-gray-100 w-48 overflow-hidden z-50 animate-fadeIn">
                    {loginOptions.map((option) => {
                      const Icon = option.icon;
                      return (
                        <button
                          key={option.type}
                          onClick={() => openModal(option.role)}
                          className="w-full px-4 py-3 text-left flex items-center gap-3 hover:bg-royal-blue/10 transition text-gray-700"
                        >
                          <Icon className="text-royal-blue" />
                          <span>{option.type} Login</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button onClick={() => setIsOpen(!isOpen)} className="text-deep-navy focus:outline-none">
                {isOpen ? <FaTimes className="h-6 w-6" /> : <FaBars className="h-6 w-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isOpen && (
            <div className="md:hidden pb-4 animate-fadeIn">
              <div className="flex flex-col space-y-3">
                {navLinks.map((link) => {
                  const Icon = link.icon;
                  if (link.hasDropdown) {
                    return (
                      <div key={link.name} className="flex flex-col">
                        <span className="flex items-center gap-3 py-2 px-3 text-gray-700">
                          <Icon />
                          <span>{link.name}</span>
                        </span>
                        <div className="pl-8 flex flex-col space-y-2">
                          {servicesLinks.map((service) => {
                            const ServiceIcon = service.icon;
                            return (
                              <Link
                                key={service.name}
                                to={service.path}
                                onClick={() => setIsOpen(false)}
                                className="flex items-center gap-3 py-2 px-3 text-gray-600 hover:text-royal-blue"
                              >
                                <ServiceIcon className="text-sm" />
                                <span>{service.name}</span>
                              </Link>
                            );
                          })}
                        </div>
                      </div>
                    );
                  }
                  return (
                    <Link
                      key={link.name}
                      to={link.path}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center gap-3 py-2 px-3 rounded-lg transition ${
                        isActive(link.path)
                          ? "bg-royal-blue/10 text-royal-blue font-semibold"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      <Icon />
                      <span>{link.name}</span>
                    </Link>
                  );
                })}
                
                {/* Mobile Login Options */}
                <div className="pt-4 border-t border-gray-200">
                  <p className="text-xs text-gray-500 px-3 mb-2">LOGIN AS</p>
                  {loginOptions.map((option) => {
                    const Icon = option.icon;
                    return (
                      <button
                        key={option.type}
                        onClick={() => {
                          openModal(option.role);
                          setIsOpen(false);
                        }}
                        className="w-full flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                      >
                        <Icon className="text-royal-blue" />
                        <span>{option.type} Login</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Modals - Same as before */}
      {activeModal === 'admin' && (
        <Modal title="Admin Login" onClose={closeModal}>
          <AdminLoginForm onSuccess={handleAdminLoginSuccess} />
        </Modal>
      )}
      {activeModal === 'customer' && (
        <Modal title="Customer Login" onClose={closeModal}>
          <CustomerLoginForm onSuccess={handleCustomerLoginSuccess} />
        </Modal>
      )}
      {activeModal === 'employee' && (
        <Modal title="Employee Login" onClose={closeModal}>
          <EmployeeLoginForm onSuccess={handleEmployeeLoginSuccess} />
        </Modal>
      )}
    </>
  );
};

// Modal Component (same as before)
const Modal = ({ title, onClose, children }) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fadeIn" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-md mx-4 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold text-deep-navy">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition">
            <FaTimes className="text-xl" />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};

// Admin Login Form (same as before)
const AdminLoginForm = ({ onSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill all fields');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${API_URL}/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setSuccess('Login successful! Redirecting...');
        localStorage.setItem('adminLoggedIn', 'true');
        localStorage.setItem('adminEmail', email);
        localStorage.setItem('adminToken', data.token);
        setTimeout(() => onSuccess(), 1500);
      } else {
        setError(data.message || 'Invalid credentials');
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && <div className="bg-red-100 text-red-700 p-3 rounded-lg text-sm">{error}</div>}
      {success && <div className="bg-green-100 text-green-700 p-3 rounded-lg text-sm">{success}</div>}
      <input type="email" placeholder="Admin Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-3 border rounded-lg" />
      <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-3 border rounded-lg" />
      <button type="submit" disabled={loading} className="w-full py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition">
        {loading ? 'Verifying...' : 'Login as Admin'}
      </button>
    </form>
  );
};

// Customer Login Form (same as before)
const CustomerLoginForm = ({ onSuccess }) => {
  const [accountNumber, setAccountNumber] = useState('');
  const [panNumber, setPanNumber] = useState('');
  const [aadharNumber, setAadharNumber] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!accountNumber || !panNumber || !aadharNumber || !dateOfBirth) {
      setError('Please fill all fields');
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/customer/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accountNumber, panNumber, aadharNumber, dateOfBirth }),
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setSuccess('Login successful! Redirecting...');
        localStorage.setItem('customerLoggedIn', 'true');
        localStorage.setItem('customerAccountNumber', accountNumber);
        localStorage.setItem('customerName', data.customer.fullName);
        localStorage.setItem('customerEmail', data.customer.email);
        localStorage.setItem('customerToken', data.token);
        setTimeout(() => onSuccess(), 1500);
      } else {
        setError(data.message || 'Invalid credentials');
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="bg-red-100 text-red-700 p-3 rounded-lg text-sm">{error}</div>}
      {success && <div className="bg-green-100 text-green-700 p-3 rounded-lg text-sm">{success}</div>}
      <div className="relative"><FaCreditCard className="absolute left-3 top-1/2 text-gray-400" /><input type="text" placeholder="Account Number" value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} className="w-full pl-10 pr-4 py-3 border rounded-lg" /></div>
      <div className="relative"><FaIdCard className="absolute left-3 top-1/2 text-gray-400" /><input type="text" placeholder="PAN Number" value={panNumber} onChange={(e) => setPanNumber(e.target.value.toUpperCase())} className="w-full pl-10 pr-4 py-3 border rounded-lg" /></div>
      <div className="relative"><FaIdCard className="absolute left-3 top-1/2 text-gray-400" /><input type="text" placeholder="Aadhar Number" value={aadharNumber} onChange={(e) => setAadharNumber(e.target.value)} className="w-full pl-10 pr-4 py-3 border rounded-lg" /></div>
      <div className="relative"><FaCalendarAlt className="absolute left-3 top-1/2 text-gray-400" /><input type="date" value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)} className="w-full pl-10 pr-4 py-3 border rounded-lg" /></div>
      <button type="submit" disabled={loading} className="w-full py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition">
        {loading ? 'Verifying...' : 'Login as Customer'}
      </button>
    </form>
  );
};

// Employee Login Form (same as before)
const EmployeeLoginForm = ({ onSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill all fields');
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/employee/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setSuccess('Login successful! Redirecting...');
        localStorage.setItem('employeeLoggedIn', 'true');
        localStorage.setItem('employeeEmail', email);
        localStorage.setItem('employeeName', data.employee.name);
        localStorage.setItem('employeeToken', data.token);
        setTimeout(() => onSuccess(), 1500);
      } else {
        setError(data.message || 'Invalid credentials');
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && <div className="bg-red-100 text-red-700 p-3 rounded-lg text-sm">{error}</div>}
      {success && <div className="bg-green-100 text-green-700 p-3 rounded-lg text-sm">{success}</div>}
      <input type="email" placeholder="Employee Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-3 border rounded-lg" />
      <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-3 border rounded-lg" />
      <button type="submit" disabled={loading} className="w-full py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition">
        {loading ? 'Verifying...' : 'Login as Employee'}
      </button>
    </form>
  );
};

export default Navbar;