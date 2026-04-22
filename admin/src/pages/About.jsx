// pages/About.jsx
import React from 'react';
import { FaShieldAlt, FaClock, FaUsers, FaGlobe } from 'react-icons/fa';

const About = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-20">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-deep-navy mb-4">About MS Hulbanni Bank</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">Your trusted financial partner since 2024</p>
        </div>
        
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
          <p className="text-lg text-gray-700 mb-6">
            MS Hulbanni Bank is a modern, digital-first bank committed to providing secure, simple, and accessible banking solutions to all Indians. With cutting-edge technology and customer-centric approach, we're redefining banking for the digital age.
          </p>
          <p className="text-lg text-gray-700">
            Our mission is to empower individuals and businesses with transparent, hassle-free banking services that put customers first.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl p-6 text-center shadow-md">
            <FaShieldAlt className="text-4xl text-royal-blue mx-auto mb-4" />
            <h3 className="text-xl font-bold text-deep-navy mb-2">Secure Banking</h3>
            <p className="text-gray-600">Bank-grade security with 256-bit encryption</p>
          </div>
          <div className="bg-white rounded-xl p-6 text-center shadow-md">
            <FaClock className="text-4xl text-royal-blue mx-auto mb-4" />
            <h3 className="text-xl font-bold text-deep-navy mb-2">24/7 Support</h3>
            <p className="text-gray-600">Round-the-clock customer assistance</p>
          </div>
          <div className="bg-white rounded-xl p-6 text-center shadow-md">
            <FaUsers className="text-4xl text-royal-blue mx-auto mb-4" />
            <h3 className="text-xl font-bold text-deep-navy mb-2">10,000+ Customers</h3>
            <p className="text-gray-600">Trusted by thousands across India</p>
          </div>
          <div className="bg-white rounded-xl p-6 text-center shadow-md">
            <FaGlobe className="text-4xl text-royal-blue mx-auto mb-4" />
            <h3 className="text-xl font-bold text-deep-navy mb-2">Pan India Presence</h3>
            <p className="text-gray-600">150+ branches nationwide</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;