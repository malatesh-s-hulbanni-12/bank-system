// components/Footer.jsx
import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-deep-navy text-gray-300 pt-16 pb-8">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">🏦</span>
              <span className="font-bold text-xl text-white">MS Hulbanni Bank</span>
            </div>
            <p className="text-sm">Your trusted financial partner since 2024. Secure, simple, and 100% digital banking.</p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-gold transition">About</a></li>
              <li><a href="#" className="hover:text-gold transition">Services</a></li>
              <li><a href="#" className="hover:text-gold transition">Contact</a></li>
              <li><a href="#" className="hover:text-gold transition">Blog</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-gold transition">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-gold transition">Terms</a></li>
              <li><a href="#" className="hover:text-gold transition">Security</a></li>
              <li><a href="#" className="hover:text-gold transition">FAQ</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-sm">
              <li>📧 support@mshulbanni.com</li>
              <li>📞 1800-123-4567</li>
              <li>📍 Mumbai, India</li>
              <li className="flex gap-4 pt-2">
                <span className="cursor-pointer hover:text-gold">📘</span>
                <span className="cursor-pointer hover:text-gold">🐦</span>
                <span className="cursor-pointer hover:text-gold">📷</span>
                <span className="cursor-pointer hover:text-gold">🔗</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-700 pt-8 flex flex-col md:flex-row justify-between items-center text-sm">
          <p>© 2024 MS Hulbanni Bank. All rights reserved.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <input type="email" placeholder="Your email" className="px-4 py-2 rounded-l-lg text-deep-navy" />
            <button className="bg-gold text-deep-navy px-4 py-2 rounded-r-lg font-semibold">Subscribe</button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;