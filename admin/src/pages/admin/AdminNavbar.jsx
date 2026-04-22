// pages/admin/AdminNavbar.jsx
import React from 'react';
import { FaBars, FaBell, FaUserCircle } from 'react-icons/fa';

const AdminNavbar = ({ onMenuClick }) => {
  const adminEmail = localStorage.getItem('adminEmail') || 'admin@mshulbanni.com';

  return (
    <header className="bg-white shadow-md px-4 md:px-6 py-4 flex justify-between items-center">
      <button 
        onClick={onMenuClick}
        className="md:hidden text-deep-navy hover:text-royal-blue transition"
      >
        <FaBars className="text-2xl" />
      </button>
      
      <h1 className="text-xl md:text-2xl font-bold text-deep-navy hidden md:block">
        Welcome back, Admin
      </h1>
      <div className="hidden md:block" />
      
      <div className="flex items-center gap-4">
        <button className="text-gray-500 hover:text-royal-blue transition relative">
          <FaBell className="text-xl" />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">3</span>
        </button>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-royal-blue to-deep-navy rounded-full flex items-center justify-center text-white font-bold">
            A
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-semibold text-deep-navy">Admin User</p>
            <p className="text-xs text-gray-500">{adminEmail}</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminNavbar;