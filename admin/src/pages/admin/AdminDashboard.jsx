// pages/admin/AdminDashboard.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from './AdminLayout';
import Dashboard from './Dashboard';
import ManageEmployees from './ManageEmployees';
import ManageCustomers from './ManageCustomers';
import EmployeeHistory from './EmployeeHistory';
import AdminLoans from './AdminLoans';

const AdminDashboard = () => {
  return (
    <AdminLayout>
      <Routes>
        <Route path="/" element={<Navigate to="dashboard" />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="employees" element={<ManageEmployees />} />
        <Route path="customers" element={<ManageCustomers />} />
        <Route path="employee-history" element={<EmployeeHistory />} />
        <Route path="loans" element={<AdminLoans />} />
      </Routes>
    </AdminLayout>
  );
};

export default AdminDashboard;