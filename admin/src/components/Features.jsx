// components/Features.jsx
import React from 'react';

const features = [
  { icon: "📱", title: "Mobile Banking", desc: "Manage your money anytime, anywhere" },
  { icon: "🔒", title: "Secure Transactions", desc: "Advanced encryption for your safety" },
  { icon: "💸", title: "Instant Transfer", desc: "Send money to any bank in seconds" },
  { icon: "📞", title: "24/7 Support", desc: "Customer service always available" },
  { icon: "💳", title: "Zero Balance Account", desc: "No minimum balance required" },
  { icon: "🎯", title: "Smart Investments", desc: "Grow your wealth with expert guidance" }
];

const Features = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-deep-navy mb-4">Our Key Features</h2>
        <p className="text-gray-600 text-center max-w-2xl mx-auto mb-16">Experience banking redefined with our innovative digital solutions</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="group bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100">
              <div className="text-5xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold text-deep-navy mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;