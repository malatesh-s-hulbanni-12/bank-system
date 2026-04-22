// pages/employee/EmployeeDashboard.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import EmployeeNavbar from './EmployeeNavbar';
import DashboardHome from './DashboardHome';
import CreateAccount from './CreateAccount';
import ManageAccounts from './ManageAccounts';
import Finance from './Finance';
import Transactions from './Transactions';
import TransactionHistory from './TransactionHistory';

const EmployeeDashboard = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <EmployeeNavbar />
      <div className="container mx-auto px-4 py-6">
        <Routes>
          <Route path="/" element={<Navigate to="dashboard" />} />
          <Route path="dashboard" element={<DashboardHome />} />
          <Route path="create-account" element={<CreateAccount />} />
          <Route path="manage-accounts" element={<ManageAccounts />} />
          <Route path="transactions" element={<Transactions />} />
          <Route path="transaction-history" element={<TransactionHistory />} />
          <Route path="finance" element={<Finance />} />
        </Routes>
      </div>
    </div>
  );
};

export default EmployeeDashboard;