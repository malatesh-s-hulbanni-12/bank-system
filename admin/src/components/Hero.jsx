// components/Hero.jsx
import React from 'react';

const Hero = () => {
  return (
    <section id="home" className="relative bg-gradient-to-br from-blue-50 to-white py-20 md:py-28 overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-royal-blue opacity-10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-gold opacity-5 rounded-full blur-3xl"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col items-center justify-center text-center max-w-4xl mx-auto">
          <div className="inline-block bg-gold/10 text-gold px-4 py-1 rounded-full text-sm font-semibold mb-6">
            Trusted Since 2024
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-deep-navy leading-tight mb-4">
            Welcome to <span className="text-royal-blue">MS Hulbanni Bank</span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-4">
            Experience banking that puts you first. Secure, simple, and 100% digital.
          </p>
          
          <p className="text-lg text-gray-500 mb-8">
            Open your account in 5 minutes. No paperwork. Zero hidden charges.
          </p>
          
          <div className="flex flex-wrap gap-4 mb-8 justify-center">
            <button className="px-8 py-3 border-2 border-royal-blue text-royal-blue rounded-xl font-semibold hover:bg-royal-blue hover:text-white transition flex items-center gap-2">
              Get Started <span>→</span>
            </button>
            <button className="px-8 py-3 border-2 border-royal-blue text-royal-blue rounded-xl font-semibold hover:bg-royal-blue hover:text-white transition">
              Learn More
            </button>
          </div>
          
          <div className="flex items-center justify-center gap-2 text-gray-500">
            <span className="text-gold">★★★★★</span>
            <span>Trusted by 10,000+ customers</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;