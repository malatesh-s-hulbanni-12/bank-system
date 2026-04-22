// components/WhyChooseUs.jsx
import React from 'react';
import { FaCheckCircle, FaMobileAlt, FaShieldAlt, FaRocket, FaRegClock } from 'react-icons/fa';

const benefits = [
  { icon: FaCheckCircle, text: "100% Digital Process", desc: "Complete online account opening" },
  { icon: FaRocket, text: "Zero Hidden Charges", desc: "No surprise fees ever" },
  { icon: FaRegClock, text: "Instant Account Opening", desc: "Start banking in 5 minutes" },
  { icon: FaShieldAlt, text: "Secure & Encrypted", desc: "Bank-grade security" }
];

const WhyChooseUs = () => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-deep-navy mb-4">Why Customers Choose Us</h2>
          <p className="text-gray-600 text-lg">We combine cutting-edge technology with human-centric service to deliver the best banking experience.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((benefit, idx) => {
            const Icon = benefit.icon;
            return (
              <div key={idx} className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 text-center group">
                <div className="text-4xl mb-4 text-royal-blue group-hover:text-gold transition-colors">
                  <Icon />
                </div>
                <h3 className="text-xl font-bold text-deep-navy mb-2">{benefit.text}</h3>
                <p className="text-gray-500 text-sm">{benefit.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;