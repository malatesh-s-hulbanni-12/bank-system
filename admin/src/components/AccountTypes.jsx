// components/AccountTypes.jsx
import React from 'react';

const accounts = [
  { type: "Savings Account", best: "Individuals", interest: "4% per annum", feature: "Zero balance option", button: "Open Now" },
  { type: "Current Account", best: "Businesses", interest: "2% cashback", feature: "Unlimited transactions + Free NEFT/RTGS", button: "Open Now" },
  { type: "Fixed Deposit", best: "Investors", interest: "Up to 7.5% per annum", feature: "Flexible tenure", button: "Invest Now" }
];

const AccountTypes = () => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-deep-navy mb-4">Account Types</h2>
        <p className="text-gray-600 text-center max-w-2xl mx-auto mb-16">Choose the account that fits your financial needs</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {accounts.map((acc, idx) => (
            <div key={idx} className="bg-white rounded-2xl shadow-md p-8 hover:shadow-xl transition-all group">
              <h3 className="text-2xl font-bold text-deep-navy mb-4">{acc.type}</h3>
              <p className="text-gray-500 mb-2">Best for: <span className="font-semibold text-deep-navy">{acc.best}</span></p>
              <p className="text-royal-blue font-bold text-xl mb-2">{acc.interest}</p>
              <p className="text-gray-600 mb-6">{acc.feature}</p>
              <button className="w-full py-3 bg-gradient-to-r from-royal-blue to-deep-navy text-white rounded-xl font-semibold hover:shadow-lg transition">{acc.button}</button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AccountTypes;