// pages/employee/EmployeeNavbar.jsx
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaUserPlus, FaUsers, FaMoneyBillWave, FaSignOutAlt, FaUniversity, FaUser, FaBars, FaTimes, FaTachometerAlt, FaExchangeAlt, FaHistory } from 'react-icons/fa';

const EmployeeNavbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  
  const employeeName = localStorage.getItem('employeeName') || 'Employee';

  const navLinks = [
    { name: 'Dashboard', path: '/employee/dashboard', icon: FaTachometerAlt },
    { name: 'Create Account', path: '/employee/create-account', icon: FaUserPlus },
    { name: 'Manage Accounts', path: '/employee/manage-accounts', icon: FaUsers },
    { name: 'Deposit / Withdraw', path: '/employee/transactions', icon: FaExchangeAlt },
    { name: 'Transaction History', path: '/employee/transaction-history', icon: FaHistory },
    { name: 'Finance', path: '/employee/finance', icon: FaMoneyBillWave },
  ];

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    localStorage.removeItem('employeeLoggedIn');
    localStorage.removeItem('employeeEmail');
    localStorage.removeItem('employeeName');
    localStorage.removeItem('employeeToken');
    navigate('/');
  };

  return (
    <>
      <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/employee/dashboard" className="flex items-center gap-2">
              <FaUniversity className="text-2xl text-royal-blue" />
              <span className="font-bold text-lg text-deep-navy">Employee Portal</span>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center gap-6">
              {navLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    className={`flex items-center gap-2 transition py-1 ${
                      isActive(link.path)
                        ? 'text-royal-blue font-semibold border-b-2 border-royal-blue'
                        : 'text-gray-700 hover:text-royal-blue'
                    }`}
                  >
                    <Icon className="text-sm" />
                    <span className="text-sm whitespace-nowrap">{link.name}</span>
                  </Link>
                );
              })}
            </div>

            {/* Desktop User Menu */}
            <div className="hidden md:flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-royal-blue rounded-full flex items-center justify-center text-white font-bold">
                  {employeeName.charAt(0)}
                </div>
                <span className="text-sm font-medium text-deep-navy">{employeeName}</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-3 py-1.5 text-red-600 hover:bg-red-50 rounded-lg transition"
              >
                <FaSignOutAlt />
                <span>Logout</span>
              </button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-deep-navy">
                {isMobileMenuOpen ? <FaTimes className="text-xl" /> : <FaBars className="text-xl" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t py-4 px-4">
            {/* Mobile Navigation Links */}
            <div className="flex flex-col space-y-2">
              {navLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center gap-3 py-2 px-3 rounded-lg ${
                      isActive(link.path)
                        ? 'bg-royal-blue/10 text-royal-blue font-semibold'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Icon />
                    <span>{link.name}</span>
                  </Link>
                );
              })}
              <div className="pt-3 border-t mt-2">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 py-2 px-3 text-red-600 hover:bg-red-50 rounded-lg"
                >
                  <FaSignOutAlt />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

export default EmployeeNavbar;