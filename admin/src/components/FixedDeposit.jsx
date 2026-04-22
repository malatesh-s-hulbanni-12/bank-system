// src/components/FixedDeposit.jsx
import React, { useState } from 'react';
import { FaRupeeSign, FaCalendarAlt, FaPercent, FaChartLine, FaShieldAlt, FaClock, FaCheckCircle, FaGift, FaUsers } from 'react-icons/fa';

const FixedDeposit = () => {
  const [depositAmount, setDepositAmount] = useState(100000);
  const [tenure, setTenure] = useState(12);
  const [interestRate, setInterestRate] = useState(7.2);

  const getInterestRate = (months) => {
    if (months < 6) return 5.5;
    if (months < 12) return 6.0;
    if (months < 24) return 7.0;
    if (months < 36) return 7.5;
    if (months < 60) return 8.0;
    return 8.5;
  };

  const handleTenureChange = (e) => {
    const months = parseInt(e.target.value);
    setTenure(months);
    setInterestRate(getInterestRate(months));
  };

  const handleInterestRateChange = (e) => {
    setInterestRate(parseFloat(e.target.value));
  };

  const calculateMaturityAmount = () => {
    const rate = interestRate / 100;
    const timeInYears = tenure / 12;
    const maturityAmount = depositAmount * Math.pow(1 + rate, timeInYears);
    return Math.round(maturityAmount);
  };

  const calculateInterestEarned = () => {
    return calculateMaturityAmount() - depositAmount;
  };

  const fdPlans = [
    { tenure: '6 months', rate: '5.5%', minAmount: '₹10,000', icon: FaClock, color: 'bg-green-500' },
    { tenure: '1 year', rate: '7.0%', minAmount: '₹10,000', icon: FaCalendarAlt, color: 'bg-blue-500' },
    { tenure: '2 years', rate: '7.5%', minAmount: '₹10,000', icon: FaChartLine, color: 'bg-purple-500' },
    { tenure: '5 years', rate: '8.0%', minAmount: '₹10,000', icon: FaGift, color: 'bg-orange-500' },
  ];

  const features = [
    { title: 'Guaranteed Returns', desc: 'Fixed returns with no market risk', icon: FaShieldAlt },
    { title: 'Flexible Tenure', desc: 'Choose from 6 months to 10 years', icon: FaCalendarAlt },
    { title: 'Higher Interest', desc: 'Senior citizens get additional 0.5%', icon: FaPercent },
    { title: 'Loan Against FD', desc: 'Get loan up to 90% of FD amount', icon: FaRupeeSign },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-deep-navy mb-4">Fixed Deposit</h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">Secure your savings with guaranteed returns. Choose from flexible tenures and enjoy higher interest rates.</p>
        </div>

        <div className="mb-16">
          <h2 className="text-2xl font-bold text-deep-navy mb-6 text-center">FD Interest Rates</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {fdPlans.map((plan, idx) => {
              const Icon = plan.icon;
              return (
                <div key={idx} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition text-center">
                  <div className={`${plan.color} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4`}><Icon className="text-2xl text-white" /></div>
                  <h3 className="text-xl font-bold text-deep-navy mb-2">{plan.tenure}</h3>
                  <p className="text-2xl font-bold text-deep-navy">{plan.rate}</p>
                  <p className="text-sm text-gray-700 mt-2">Min: {plan.minAmount}</p>
                  <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition w-full">Invest Now</button>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-8 mb-16">
          <h2 className="text-2xl font-bold text-deep-navy mb-6 text-center">FD Calculator</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Side - Sliders */}
            <div className="space-y-8">
              {/* Deposit Amount Slider */}
              <div>
                <label className="block text-black font-semibold text-lg mb-3">Deposit Amount (₹)</label>
                <input
                  type="range"
                  min="10000"
                  max="10000000"
                  step="10000"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(Number(e.target.value))}
                  className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  style={{ WebkitAppearance: 'none', appearance: 'none' }}
                />
                <div className="flex justify-between mt-3">
                  <span className="text-sm text-black font-medium">₹10,000</span>
                  <span className="text-sm text-black font-medium">₹25 Lakhs</span>
                  <span className="text-sm text-black font-medium">₹50 Lakhs</span>
                  <span className="text-sm text-black font-medium">₹1 Cr</span>
                </div>
                <div className="mt-3 p-3 bg-blue-50 rounded-lg text-center">
                  <p className="text-black font-bold text-xl">₹{depositAmount.toLocaleString()}</p>
                </div>
              </div>

              {/* Tenure Slider */}
              <div>
                <label className="block text-black font-semibold text-lg mb-3">Tenure</label>
                <input
                  type="range"
                  min="6"
                  max="120"
                  step="6"
                  value={tenure}
                  onChange={handleTenureChange}
                  className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  style={{ WebkitAppearance: 'none', appearance: 'none' }}
                />
                <div className="flex justify-between mt-3">
                  <span className="text-sm text-black font-medium">6M</span>
                  <span className="text-sm text-black font-medium">1Y</span>
                  <span className="text-sm text-black font-medium">2Y</span>
                  <span className="text-sm text-black font-medium">3Y</span>
                  <span className="text-sm text-black font-medium">5Y</span>
                  <span className="text-sm text-black font-medium">10Y</span>
                </div>
                <div className="mt-3 p-3 bg-blue-50 rounded-lg text-center">
                  <p className="text-black font-bold text-xl">{tenure} months ({Math.floor(tenure / 12)} years {tenure % 12} months)</p>
                </div>
              </div>

              {/* Interest Rate Slider */}
              <div>
                <label className="block text-black font-semibold text-lg mb-3">Interest Rate (%)</label>
                <input
                  type="range"
                  min="4"
                  max="12"
                  step="0.1"
                  value={interestRate}
                  onChange={handleInterestRateChange}
                  className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  style={{ WebkitAppearance: 'none', appearance: 'none' }}
                />
                <div className="flex justify-between mt-3">
                  <span className="text-sm text-black font-medium">4%</span>
                  <span className="text-sm text-black font-medium">6%</span>
                  <span className="text-sm text-black font-medium">8%</span>
                  <span className="text-sm text-black font-medium">10%</span>
                  <span className="text-sm text-black font-medium">12%</span>
                </div>
                <div className="mt-3 p-3 bg-blue-50 rounded-lg text-center">
                  <p className="text-black font-bold text-xl">{interestRate}% per annum</p>
                </div>
                <p className="text-sm text-gray-600 mt-2 text-center">*Adjust interest rate manually or select tenure</p>
              </div>
            </div>

            {/* Right Side - Results with BLACK Text */}
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
              <div className="text-center mb-6">
                <p className="text-sm text-gray-600">Maturity Amount</p>
                <p className="text-4xl font-bold text-black">₹{calculateMaturityAmount().toLocaleString()}</p>
              </div>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-sm text-gray-600">Principal Amount</p>
                  <p className="text-xl font-semibold text-black">₹{depositAmount.toLocaleString()}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-sm text-gray-600">Interest Earned</p>
                  <p className="text-xl font-semibold text-green-600">₹{calculateInterestEarned().toLocaleString()}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3 col-span-2">
                  <p className="text-sm text-gray-600">Effective Yield</p>
                  <p className="text-xl font-semibold text-black">{((calculateMaturityAmount() / depositAmount - 1) * 100).toFixed(2)}%</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-8 mb-16">
          <h2 className="text-2xl font-bold text-deep-navy mb-4 text-center">Senior Citizen Benefits</h2>
          <p className="text-center text-gray-700 mb-6">Senior citizens get additional 0.50% interest on all FD plans</p>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-3 text-left text-black font-semibold">Tenure</th>
                  <th className="px-4 py-3 text-left text-black font-semibold">Regular Rate</th>
                  <th className="px-4 py-3 text-left text-black font-semibold">Senior Citizen Rate</th>
                  <th className="px-4 py-3 text-left text-black font-semibold">Additional Benefit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-black">6 months</td>
                  <td className="px-4 py-3 text-gray-700">5.50%</td>
                  <td className="px-4 py-3 text-green-700 font-semibold">6.00%</td>
                  <td className="px-4 py-3 text-black">+0.50%</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-black">1 year</td>
                  <td className="px-4 py-3 text-gray-700">7.00%</td>
                  <td className="px-4 py-3 text-green-700 font-semibold">7.50%</td>
                  <td className="px-4 py-3 text-black">+0.50%</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-black">2 years</td>
                  <td className="px-4 py-3 text-gray-700">7.50%</td>
                  <td className="px-4 py-3 text-green-700 font-semibold">8.00%</td>
                  <td className="px-4 py-3 text-black">+0.50%</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-black">3 years</td>
                  <td className="px-4 py-3 text-gray-700">8.00%</td>
                  <td className="px-4 py-3 text-green-700 font-semibold">8.50%</td>
                  <td className="px-4 py-3 text-black">+0.50%</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-black">5 years</td>
                  <td className="px-4 py-3 text-gray-700">8.50%</td>
                  <td className="px-4 py-3 text-green-700 font-semibold">9.00%</td>
                  <td className="px-4 py-3 text-black">+0.50%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="mb-16">
          <h2 className="text-2xl font-bold text-deep-navy mb-6 text-center">Why Choose MS Hulbanni Bank FD?</h2>
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
            <p className="flex items-start gap-2"><FaCheckCircle className="text-green-600 mt-1 flex-shrink-0" /> Minimum deposit amount is ₹10,000 for Fixed Deposit accounts.</p>
            <p className="flex items-start gap-2"><FaCheckCircle className="text-green-600 mt-1 flex-shrink-0" /> Interest rates are subject to change as per RBI guidelines.</p>
            <p className="flex items-start gap-2"><FaCheckCircle className="text-green-600 mt-1 flex-shrink-0" /> Premature withdrawal charges may apply as per bank policy.</p>
            <p className="flex items-start gap-2"><FaCheckCircle className="text-green-600 mt-1 flex-shrink-0" /> Tax deducted at source (TDS) as per applicable tax laws.</p>
            <p className="flex items-start gap-2"><FaCheckCircle className="text-green-600 mt-1 flex-shrink-0" /> Senior citizen benefits applicable for individuals above 60 years.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FixedDeposit;