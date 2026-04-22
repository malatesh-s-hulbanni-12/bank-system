// backend/routes/employeeRoutes.js
const express = require('express');
const router = express.Router();
const {
  getAllEmployees,
  getEmployeeById,
  addEmployee,
  updateEmployeeStatus,
  updateEmployee,
  deleteEmployee
} = require('../controllers/employeeController');

// Employee routes
router.get('/', getAllEmployees);
router.get('/:id', getEmployeeById);
router.post('/', addEmployee);
router.put('/:id/status', updateEmployeeStatus);
router.put('/:id', updateEmployee);
router.delete('/:id', deleteEmployee);

module.exports = router;