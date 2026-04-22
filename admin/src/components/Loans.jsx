// src/components/Loans.jsx
import React, { useState } from 'react';
import { FaHome, FaHandHoldingUsd, FaRupeeSign, FaCalendarAlt, FaPercent, FaChartLine, FaShieldAlt, FaClock, FaCheckCircle, FaCar, FaGraduationCap, FaBriefcase } from 'react-icons/fa';

const Loans = () => {
  const [loanAmount, setLoanAmount] = useState(500000);
  const [loanTenure, setLoanTenure] = useState(5);
  const [interestRate, setInterestRate] = useState(9.5);

  const calculateEMI = () => {
    const principal = loanAmount;
    const ratePerMonth = interestRate / (12 * 100);
    const months = loanTenure * 12;
    const emi = principal * ratePerMonth * Math.pow(1 + ratePerMonth, months) / (Math.pow(1 + ratePerMonth, months) - 1);
    return isNaN(emi) ? 0 : Math.round(emi);
  };

  const calculateTotalInterest = () => {
    const emi = calculateEMI();
    const totalAmount = emi * loanTenure * 12;
    return totalAmount - loanAmount;
  };

  const loanTypes = [
    { name: 'Home Loan', minRate: '8.5%', maxAmount: '₹5 Cr', tenure: '30 years', icon: FaHome, color: 'bg-blue-500' },
    { name: 'Personal Loan', minRate: '10.5%', maxAmount: '₹50 Lakhs', tenure: '5 years', icon: FaBriefcase, color: 'bg-green-500' },
    { name: 'Car Loan', minRate: '8.75%', maxAmount: '₹2 Cr', tenure: '7 years', icon: FaCar, color: 'bg-purple-500' },
    { name: 'Education Loan', minRate: '8.0%', maxAmount: '₹1.5 Cr', tenure: '15 years', icon: FaGraduationCap, color: 'bg-orange-500' },
  ];

  const features = [
    { title: 'Low Interest Rates', desc: 'Starting from just 8.5% per annum', icon: FaPercent },
    { title: 'Quick Approval', desc: 'Loan approval within 24 hours', icon: FaClock },
    { title: 'Flexible Tenure', desc: 'Choose tenure from 1 to 30 years', icon: FaCalendarAlt },
    { title: 'No Hidden Charges', desc: 'Transparent processing fees', icon: FaShieldAlt },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-deep-navy mb-4">Loans</h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">Explore our wide range of loan products tailored to meet your financial needs</p>
        </div>

        <div className="mb-16">
          <h2 className="text-2xl font-bold text-deep-navy mb-6 text-center">Our Loan Products</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {loanTypes.map((loan, idx) => {
              const Icon = loan.icon;
              return (
                <div key={idx} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition text-center">
                  <div className={`${loan.color} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4`}>
                    <Icon className="text-2xl text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-deep-navy mb-2">{loan.name}</h3>
                  <p className="text-sm text-gray-700">Interest Rate: {loan.minRate}</p>
                  <p className="text-sm text-gray-700">Max Amount: {loan.maxAmount}</p>
                  <p className="text-sm text-gray-700">Tenure: {loan.tenure}</p>
                  <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition w-full">Apply Now</button>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-8 mb-16">
          <h2 className="text-2xl font-bold text-deep-navy mb-6 text-center">EMI Calculator</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Side - Sliders */}
            <div className="space-y-6">
              {/* Loan Amount Slider */}
              <div>
                <label className="block text-black font-semibold text-lg mb-3">Loan Amount (₹)</label>
                <input
                  type="range"
                  min="10000"
                  max="5000000"
                  step="10000"
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(Number(e.target.value))}
                  className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  style={{ WebkitAppearance: 'none', appearance: 'none' }}
                />
                <div className="flex justify-between mt-3">
                  <span className="text-sm text-black font-medium">₹10,000</span>
                  <span className="text-sm text-black font-medium">₹10 Lakhs</span>
                  <span className="text-sm text-black font-medium">₹25 Lakhs</span>
                  <span className="text-sm text-black font-medium">₹50 Lakhs</span>
                </div>
                <div className="mt-3 p-3 bg-blue-50 rounded-lg text-center">
                  <p className="text-black font-bold text-xl">₹{loanAmount.toLocaleString()}</p>
                </div>
              </div>

              {/* Loan Tenure Slider */}
              <div>
                <label className="block text-black font-semibold text-lg mb-3">Loan Tenure (Years)</label>
                <input
                  type="range"
                  min="1"
                  max="30"
                  value={loanTenure}
                  onChange={(e) => setLoanTenure(Number(e.target.value))}
                  className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  style={{ WebkitAppearance: 'none', appearance: 'none' }}
                />
                <div className="flex justify-between mt-3">
                  <span className="text-sm text-black font-medium">1Y</span>
                  <span className="text-sm text-black font-medium">5Y</span>
                  <span className="text-sm text-black font-medium">10Y</span>
                  <span className="text-sm text-black font-medium">15Y</span>
                  <span className="text-sm text-black font-medium">20Y</span>
                  <span className="text-sm text-black font-medium">30Y</span>
                </div>
                <div className="mt-3 p-3 bg-blue-50 rounded-lg text-center">
                  <p className="text-black font-bold text-xl">{loanTenure} years ({loanTenure * 12} months)</p>
                </div>
              </div>

              {/* Interest Rate Slider */}
              <div>
                <label className="block text-black font-semibold text-lg mb-3">Interest Rate (%)</label>
                <input
                  type="range"
                  min="5"
                  max="20"
                  step="0.5"
                  value={interestRate}
                  onChange={(e) => setInterestRate(Number(e.target.value))}
                  className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  style={{ WebkitAppearance: 'none', appearance: 'none' }}
                />
                <div className="flex justify-between mt-3">
                  <span className="text-sm text-black font-medium">5%</span>
                  <span className="text-sm text-black font-medium">8%</span>
                  <span className="text-sm text-black font-medium">10%</span>
                  <span className="text-sm text-black font-medium">12%</span>
                  <span className="text-sm text-black font-medium">15%</span>
                  <span className="text-sm text-black font-medium">20%</span>
                </div>
                <div className="mt-3 p-3 bg-blue-50 rounded-lg text-center">
                  <p className="text-black font-bold text-xl">{interestRate}% per annum</p>
                </div>
              </div>
            </div>

            {/* Right Side - Results with BLACK Text */}
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
              <div className="text-center mb-6">
                <p className="text-sm text-gray-600">Monthly EMI</p>
                <p className="text-4xl font-bold text-black">₹{calculateEMI().toLocaleString()}</p>
              </div>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-sm text-gray-600">Principal Amount</p>
                  <p className="text-xl font-semibold text-black">₹{loanAmount.toLocaleString()}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-sm text-gray-600">Total Interest</p>
                  <p className="text-xl font-semibold text-green-600">₹{calculateTotalInterest().toLocaleString()}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3 col-span-2">
                  <p className="text-sm text-gray-600">Total Amount Payable</p>
                  <p className="text-2xl font-bold text-black">₹{(loanAmount + calculateTotalInterest()).toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-16">
          <h2 className="text-2xl font-bold text-deep-navy mb-6 text-center">Why Choose MS Hulbanni Bank Loans?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <div key={idx} className="bg-white rounded-xl shadow-md p-6 text-center hover:shadow-lg transition">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4"><Icon className="text-2xl text-royal-blue" /></div>
                  <h3 className="text-lg font-bold text-deep-navy mb-2">{feature.title}</h3>
                  <p className="text-sm text-gray-700">{feature.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-8">
          <h2 className="text-2xl font-bold text-deep-navy mb-4">Terms & Conditions</h2>
          <div className="space-y-3 text-gray-800">
            <p className="flex items-start gap-2"><FaCheckCircle className="text-green-600 mt-1 flex-shrink-0" /> Loan approval subject to credit verification and document validation.</p>
            <p className="flex items-start gap-2"><FaCheckCircle className="text-green-600 mt-1 flex-shrink-0" /> Interest rates may vary based on customer profile and market conditions.</p>
            <p className="flex items-start gap-2"><FaCheckCircle className="text-green-600 mt-1 flex-shrink-0" /> Processing fees and other charges apply as per bank policy.</p>
            <p className="flex items-start gap-2"><FaCheckCircle className="text-green-600 mt-1 flex-shrink-0" /> Terms and conditions are subject to change at bank's discretion.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Loans;