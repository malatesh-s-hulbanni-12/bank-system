// pages/admin/AdminSidebar.jsx
import React from 'react';
import { FaTachometerAlt, FaUsers, FaUserTie, FaSignOutAlt, FaUniversity, FaTimes, FaHistory } from 'react-icons/fa';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const AdminSidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { id: 'dashboard', name: 'Dashboard', path: '/admin/dashboard', icon: FaTachometerAlt },
    { id: 'employees', name: 'Manage Employees', path: '/admin/employees', icon: FaUserTie },
    { id: 'customers', name: 'Manage Customers', path: '/admin/customers', icon: FaUsers },
    { id: 'employee-history', name: 'Employee History', path: '/admin/employee-history', icon: FaHistory },
  ];

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    localStorage.removeItem('adminLoggedIn');
    localStorage.removeItem('adminEmail');
    localStorage.removeItem('adminToken');
    navigate('/');
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar - Deep Navy Background */}
      <div className={`fixed md:relative z-50 w-64 bg-deep-navy text-white h-full transition-transform duration-300 ease-in-out flex flex-col ${
        isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      }`}>
        {/* Logo Section */}
        <div className="p-4 flex items-center justify-between border-b border-royal-blue/30">
          <div className="flex items-center gap-2">
            <FaUniversity className="text-2xl text-gold" />
            <span className="font-bold text-lg">Admin Panel</span>
          </div>
          <button onClick={onClose} className="md:hidden text-white hover:text-gold transition">
            <FaTimes className="text-xl" />
          </button>
        </div>
        
        {/* Navigation Menu - Takes remaining space */}
        <nav className="flex-1 py-6">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.id}
                to={item.path}
                onClick={onClose}
                className={`flex items-center gap-3 px-4 py-3 transition ${
                  isActive(item.path)
                    ? 'bg-royal-blue text-white border-l-4 border-gold'
                    : 'hover:bg-royal-blue/20 text-gray-300'
                }`}
              >
                <Icon className="text-xl" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
        
        {/* Logout Button at Bottom */}
        <div className="p-4 border-t border-royal-blue/30">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-red-600/20 hover:text-red-400 rounded-lg transition"
          >
            <FaSignOutAlt className="text-xl" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default AdminSidebar;