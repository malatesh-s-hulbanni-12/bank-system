// backend/controllers/employeeController.js
const Employee = require('../models/Employee');

// Get all employees
const getAllEmployees = async (req, res) => {
  try {
    const employees = await Employee.find().select('-password');
    res.json({ success: true, employees });
  } catch (error) {
    console.error('Error fetching employees:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get single employee by ID
const getEmployeeById = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id).select('-password');
    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }
    res.json({ success: true, employee });
  } catch (error) {
    console.error('Error fetching employee:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Add new employee
const addEmployee = async (req, res) => {
  try {
    const { name, email, phone, role, password } = req.body;
    
    // Validate required fields
    if (!name || !email || !phone || !role || !password) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }
    
    // Check if employee already exists
    const existingEmployee = await Employee.findOne({ email });
    if (existingEmployee) {
      return res.status(400).json({ success: false, message: 'Employee with this email already exists' });
    }
    
    // Create new employee
    const employee = new Employee({ name, email, phone, role, password });
    await employee.save();
    
    const savedEmployee = await Employee.findById(employee._id).select('-password');
    res.json({ success: true, message: 'Employee added successfully', employee: savedEmployee });
  } catch (error) {
    console.error('Error adding employee:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update employee status (Active/Inactive)
const updateEmployeeStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const employee = await Employee.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    ).select('-password');
    
    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }
    res.json({ success: true, message: 'Status updated successfully', employee });
  } catch (error) {
    console.error('Error updating status:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update employee details
const updateEmployee = async (req, res) => {
  try {
    const { name, email, phone, role } = req.body;
    const employee = await Employee.findByIdAndUpdate(
      req.params.id,
      { name, email, phone, role },
      { new: true, runValidators: true }
    ).select('-password');
    
    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }
    res.json({ success: true, message: 'Employee updated successfully', employee });
  } catch (error) {
    console.error('Error updating employee:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete employee
const deleteEmployee = async (req, res) => {
  try {
    const employee = await Employee.findByIdAndDelete(req.params.id);
    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }
    res.json({ success: true, message: 'Employee deleted successfully' });
  } catch (error) {
    console.error('Error deleting employee:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAllEmployees,
  getEmployeeById,
  addEmployee,
  updateEmployeeStatus,
  updateEmployee,
  deleteEmployee
};