// pages/Contact.jsx
import React, { useState } from 'react';
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock, FaFacebook, FaTwitter, FaLinkedin, FaInstagram } from 'react-icons/fa';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-20">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-deep-navy mb-4">Contact Us</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">We're here to help. Reach out to us anytime.</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Info */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-md">
              <div className="flex items-center gap-4 mb-4">
                <FaMapMarkerAlt className="text-2xl text-royal-blue" />
                <div>
                  <h3 className="font-bold text-deep-navy">Visit Us</h3>
                  <p className="text-gray-600">MS Hulbanni Bank Tower,<br />Andheri East, Mumbai - 400069</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl p-6 shadow-md">
              <div className="flex items-center gap-4 mb-4">
                <FaPhone className="text-2xl text-royal-blue" />
                <div>
                  <h3 className="font-bold text-deep-navy">Call Us</h3>
                  <p className="text-gray-600">Toll Free: 1800-123-4567<br />24/7 Customer Support</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl p-6 shadow-md">
              <div className="flex items-center gap-4 mb-4">
                <FaEnvelope className="text-2xl text-royal-blue" />
                <div>
                  <h3 className="font-bold text-deep-navy">Email Us</h3>
                  <p className="text-gray-600">support@mshulbanni.com<br />care@mshulbanni.com</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl p-6 shadow-md">
              <div className="flex items-center gap-4 mb-4">
                <FaClock className="text-2xl text-royal-blue" />
                <div>
                  <h3 className="font-bold text-deep-navy">Working Hours</h3>
                  <p className="text-gray-600">Mon-Fri: 9:00 AM - 6:00 PM<br />Sat: 10:00 AM - 2:00 PM</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl p-6 shadow-md">
              <h3 className="font-bold text-deep-navy mb-4">Follow Us</h3>
              <div className="flex gap-4">
                <FaFacebook className="text-2xl text-royal-blue cursor-pointer hover:text-gold transition" />
                <FaTwitter className="text-2xl text-royal-blue cursor-pointer hover:text-gold transition" />
                <FaLinkedin className="text-2xl text-royal-blue cursor-pointer hover:text-gold transition" />
                <FaInstagram className="text-2xl text-royal-blue cursor-pointer hover:text-gold transition" />
              </div>
            </div>
          </div>
          
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl p-8 shadow-md">
              <h2 className="text-2xl font-bold text-deep-navy mb-6">Send us a Message</h2>
              {submitted ? (
                <div className="bg-green-100 text-green-700 p-4 rounded-lg text-center">
                  Thank you! We'll get back to you soon.
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Your Name</label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-royal-blue"
                      placeholder="Enter your name"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-royal-blue"
                      placeholder="Enter your email"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Message</label>
                    <textarea
                      name="message"
                      required
                      rows="5"
                      value={formData.message}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-royal-blue"
                      placeholder="How can we help you?"
                    ></textarea>
                  </div>
                  <button
                    type="submit"
                    className="w-full py-3 bg-gradient-to-r from-royal-blue to-deep-navy text-white rounded-xl font-semibold hover:shadow-lg transition"
                  >
                    Send Message
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;