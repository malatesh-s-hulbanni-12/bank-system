// components/FAQ.jsx
import React, { useState } from 'react';

const faqs = [
  { q: "How do I open an account with MS Hulbanni Bank?", a: "You can open an account online in just 3 simple steps: Enter your email, verify OTP, and complete your KYC. No paperwork needed!" },
  { q: "Is my money safe with MS Hulbanni Bank?", a: "Absolutely! We use 256-bit SSL encryption, two-factor authentication, and are RBI registered. Your money is insured up to ₹5 Lakhs under DICGC." },
  { q: "How long does OTP verification take?", a: "OTP is delivered instantly via SMS/Email. Verification takes less than 30 seconds." },
  { q: "What are the charges for money transfer?", a: "We offer zero charges on NEFT, RTGS, and IMPS for all savings account holders. Unlimited free transfers!" }
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);
  
  const toggle = (index) => setOpenIndex(openIndex === index ? null : index);
  
  const handleMouseEnter = (index) => setOpenIndex(index);
  
  const handleMouseLeave = () => setOpenIndex(null);

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-6 max-w-4xl">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-deep-navy mb-4">Frequently Asked Questions</h2>
        <p className="text-gray-600 text-center mb-12">Got questions? We've got answers.</p>
        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div 
              key={idx} 
              className="bg-white rounded-xl shadow-sm overflow-hidden transition-all duration-300"
              onMouseEnter={() => handleMouseEnter(idx)}
              onMouseLeave={handleMouseLeave}
            >
              <button 
                onClick={() => toggle(idx)} 
                className="w-full px-6 py-4 text-left font-semibold text-deep-navy flex justify-between items-center hover:bg-gray-50 transition cursor-pointer"
              >
                {faq.q}
                <span className="text-royal-blue text-xl transition-transform duration-300" style={{ transform: openIndex === idx ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                  {openIndex === idx ? "−" : "+"}
                </span>
              </button>
              {openIndex === idx && (
                <div className="px-6 pb-4 text-gray-600 border-t animate-fadeIn">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;