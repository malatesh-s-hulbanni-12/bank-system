// pages/employee/CreateAccount.jsx
import React, { useState } from 'react';
import { FaUser, FaEnvelope, FaPhone, FaIdCard, FaRupeeSign, FaSave, FaTimes, FaUpload, FaFile, FaImage, FaSignature } from 'react-icons/fa';
import axios from 'axios';

const CreateAccount = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    aadharNumber: '',
    panNumber: '',
    dateOfBirth: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    accountType: 'Savings',
    initialDeposit: '',
    nominee: '',
    occupation: ''
  });
  
  const [documents, setDocuments] = useState({
    aadharCard: null,
    panCard: null,
    photo: null,
    signature: null
  });
  
  const [documentPreviews, setDocumentPreviews] = useState({
    aadharCard: null,
    panCard: null,
    photo: null,
    signature: null
  });
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e, documentType) => {
    const file = e.target.files[0];
    if (file) {
      setDocuments({ ...documents, [documentType]: file });
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setDocumentPreviews({ ...documentPreviews, [documentType]: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Validate documents
    if (!documents.aadharCard || !documents.panCard || !documents.photo || !documents.signature) {
      setError('Please upload all required documents (Aadhar Card, PAN Card, Photo, Signature)');
      setLoading(false);
      return;
    }

    const submitData = new FormData();
    
    // Add form data
    Object.keys(formData).forEach(key => {
      submitData.append(key, formData[key]);
    });
    
    // Add employee info who is creating the account
    const employeeName = localStorage.getItem('employeeName') || 'Employee';
    const employeeEmail = localStorage.getItem('employeeEmail') || 'unknown';
    
    submitData.append('employeeName', employeeName);
    submitData.append('employeeId', employeeEmail);
    
    // Add documents
    submitData.append('aadharCard', documents.aadharCard);
    submitData.append('panCard', documents.panCard);
    submitData.append('photo', documents.photo);
    submitData.append('signature', documents.signature);

    try {
      const response = await axios.post('http://localhost:5000/api/customers/create', submitData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      if (response.data.success) {
        setSuccess(`Account created successfully for ${formData.fullName}! Account Number: ${response.data.customer.accountNumber} | Created by: ${response.data.customer.createdBy}`);
        // Reset form
        setFormData({
          fullName: '', email: '', phone: '', aadharNumber: '', panNumber: '',
          dateOfBirth: '', address: '', city: '', state: '', pincode: '',
          accountType: 'Savings', initialDeposit: '', nominee: '', occupation: ''
        });
        setDocuments({ aadharCard: null, panCard: null, photo: null, signature: null });
        setDocumentPreviews({ aadharCard: null, panCard: null, photo: null, signature: null });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-deep-navy">Create New Account</h1>
        <p className="text-gray-500 mt-1">Fill in the customer details to open a new bank account</p>
      </div>

      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-6">
          {success}
        </div>
      )}
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Personal Information */}
          <div className="col-span-2">
            <h2 className="text-lg font-bold text-deep-navy border-b pb-2 mb-4">Personal Information</h2>
          </div>
          
          <div>
            <label className="block text-gray-700 font-medium mb-1">Full Name *</label>
            <div className="relative">
              <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-royal-blue"
                placeholder="Enter full name"
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Email Address *</label>
            <div className="relative">
              <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-royal-blue"
                placeholder="Enter email address"
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Phone Number *</label>
            <div className="relative">
              <FaPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-royal-blue"
                placeholder="Enter phone number"
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Date of Birth *</label>
            <input
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-royal-blue"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Aadhar Number *</label>
            <div className="relative">
              <FaIdCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                name="aadharNumber"
                value={formData.aadharNumber}
                onChange={handleChange}
                required
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-royal-blue"
                placeholder="Enter Aadhar number"
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">PAN Number *</label>
            <input
              type="text"
              name="panNumber"
              value={formData.panNumber}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-royal-blue"
              placeholder="Enter PAN number"
            />
          </div>

          {/* Address Information */}
          <div className="col-span-2">
            <h2 className="text-lg font-bold text-deep-navy border-b pb-2 mb-4 mt-4">Address Information</h2>
          </div>

          <div className="col-span-2">
            <label className="block text-gray-700 font-medium mb-1">Address *</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
              rows="2"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-royal-blue"
              placeholder="Enter street address"
            ></textarea>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">City *</label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-royal-blue"
              placeholder="Enter city"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">State *</label>
            <input
              type="text"
              name="state"
              value={formData.state}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-royal-blue"
              placeholder="Enter state"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Pincode *</label>
            <input
              type="text"
              name="pincode"
              value={formData.pincode}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-royal-blue"
              placeholder="Enter pincode"
            />
          </div>

          {/* Account Information */}
          <div className="col-span-2">
            <h2 className="text-lg font-bold text-deep-navy border-b pb-2 mb-4 mt-4">Account Information</h2>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Account Type *</label>
            <select
              name="accountType"
              value={formData.accountType}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-royal-blue"
            >
              <option value="Savings">Savings Account</option>
              <option value="Current">Current Account</option>
              <option value="Fixed Deposit">Fixed Deposit</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Initial Deposit (₹) *</label>
            <div className="relative">
              <FaRupeeSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="number"
                name="initialDeposit"
                value={formData.initialDeposit}
                onChange={handleChange}
                required
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-royal-blue"
                placeholder="Enter initial deposit amount"
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Occupation *</label>
            <select
              name="occupation"
              value={formData.occupation}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-royal-blue"
            >
              <option value="">Select Occupation</option>
              <option value="Salaried">Salaried</option>
              <option value="Self Employed">Self Employed</option>
              <option value="Business">Business</option>
              <option value="Student">Student</option>
              <option value="Retired">Retired</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Nominee Name</label>
            <input
              type="text"
              name="nominee"
              value={formData.nominee}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-royal-blue"
              placeholder="Enter nominee name (optional)"
            />
          </div>

          {/* Document Upload Section */}
          <div className="col-span-2">
            <h2 className="text-lg font-bold text-deep-navy border-b pb-2 mb-4 mt-4">Document Upload</h2>
            <p className="text-sm text-gray-500 mb-4">Please upload clear copies of the following documents (JPG, PNG, or PDF)</p>
          </div>

          {/* Aadhar Card Upload */}
          <div className="col-span-2 md:col-span-1">
            <label className="block text-gray-700 font-medium mb-1">Aadhar Card *</label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-royal-blue transition">
              <input
                type="file"
                accept="image/*,application/pdf"
                onChange={(e) => handleFileChange(e, 'aadharCard')}
                className="hidden"
                id="aadharUpload"
                required
              />
              <label htmlFor="aadharUpload" className="cursor-pointer flex flex-col items-center">
                {documentPreviews.aadharCard ? (
                  <img src={documentPreviews.aadharCard} alt="Aadhar Preview" className="w-32 h-32 object-cover rounded-lg mb-2" />
                ) : (
                  <FaFile className="text-4xl text-gray-400 mb-2" />
                )}
                <span className="text-sm text-gray-500">Click to upload Aadhar Card</span>
              </label>
            </div>
          </div>

          {/* PAN Card Upload */}
          <div className="col-span-2 md:col-span-1">
            <label className="block text-gray-700 font-medium mb-1">PAN Card *</label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-royal-blue transition">
              <input
                type="file"
                accept="image/*,application/pdf"
                onChange={(e) => handleFileChange(e, 'panCard')}
                className="hidden"
                id="panUpload"
                required
              />
              <label htmlFor="panUpload" className="cursor-pointer flex flex-col items-center">
                {documentPreviews.panCard ? (
                  <img src={documentPreviews.panCard} alt="PAN Preview" className="w-32 h-32 object-cover rounded-lg mb-2" />
                ) : (
                  <FaFile className="text-4xl text-gray-400 mb-2" />
                )}
                <span className="text-sm text-gray-500">Click to upload PAN Card</span>
              </label>
            </div>
          </div>

          {/* Photo Upload */}
          <div className="col-span-2 md:col-span-1">
            <label className="block text-gray-700 font-medium mb-1">Passport Size Photo *</label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-royal-blue transition">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(e, 'photo')}
                className="hidden"
                id="photoUpload"
                required
              />
              <label htmlFor="photoUpload" className="cursor-pointer flex flex-col items-center">
                {documentPreviews.photo ? (
                  <img src={documentPreviews.photo} alt="Photo Preview" className="w-32 h-32 object-cover rounded-lg mb-2" />
                ) : (
                  <FaImage className="text-4xl text-gray-400 mb-2" />
                )}
                <span className="text-sm text-gray-500">Click to upload Photo</span>
              </label>
            </div>
          </div>

          {/* Signature Upload */}
          <div className="col-span-2 md:col-span-1">
            <label className="block text-gray-700 font-medium mb-1">Signature *</label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-royal-blue transition">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(e, 'signature')}
                className="hidden"
                id="signatureUpload"
                required
              />
              <label htmlFor="signatureUpload" className="cursor-pointer flex flex-col items-center">
                {documentPreviews.signature ? (
                  <img src={documentPreviews.signature} alt="Signature Preview" className="w-32 h-32 object-cover rounded-lg mb-2" />
                ) : (
                  <FaSignature className="text-4xl text-gray-400 mb-2" />
                )}
                <span className="text-sm text-gray-500">Click to upload Signature</span>
              </label>
            </div>
          </div>
        </div>

        <div className="flex gap-4 mt-8">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
          >
            <FaSave />
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
          <button
            type="reset"
            onClick={() => {
              setFormData({
                fullName: '', email: '', phone: '', aadharNumber: '', panNumber: '',
                dateOfBirth: '', address: '', city: '', state: '', pincode: '',
                accountType: 'Savings', initialDeposit: '', nominee: '', occupation: ''
              });
              setDocuments({ aadharCard: null, panCard: null, photo: null, signature: null });
              setDocumentPreviews({ aadharCard: null, panCard: null, photo: null, signature: null });
            }}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition flex items-center gap-2"
          >
            <FaTimes />
            Reset
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateAccount;