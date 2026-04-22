// components/Testimonials.jsx
import React from 'react';
import { FaStar, FaStarHalfAlt, FaRegStar, FaQuoteLeft, FaUserCircle } from 'react-icons/fa';

const testimonials = [
  { 
    name: "Rahul S.", 
    location: "Mumbai", 
    quote: "Best banking experience! OTP verification is super fast.", 
    rating: 5 
  },
  { 
    name: "Priya M.", 
    location: "Delhi", 
    quote: "Very secure and easy to use mobile app.", 
    rating: 5 
  },
  { 
    name: "Amit K.", 
    location: "Bangalore", 
    quote: "Customer support responds within minutes.", 
    rating: 5 
  }
];

const StarRating = ({ rating }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;
  
  return (
    <div className="flex text-gold">
      {[...Array(fullStars)].map((_, i) => (
        <FaStar key={i} className="fill-current" />
      ))}
      {hasHalfStar && <FaStarHalfAlt className="fill-current" />}
      {[...Array(5 - Math.ceil(rating))].map((_, i) => (
        <FaRegStar key={i} className="fill-current" />
      ))}
    </div>
  );
};

const Testimonials = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-deep-navy mb-4">What Our Customers Say</h2>
        <p className="text-gray-600 text-center max-w-2xl mx-auto mb-16">Join thousands of satisfied customers who trust MS Hulbanni Bank</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, idx) => (
            <div key={idx} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <FaUserCircle className="text-4xl text-royal-blue" />
                  <div>
                    <div className="font-bold text-deep-navy text-lg">{t.name}</div>
                    <div className="text-gray-500 text-sm">{t.location}</div>
                  </div>
                </div>
                <StarRating rating={t.rating} />
              </div>
              <FaQuoteLeft className="text-gold/30 text-3xl mb-3" />
              <p className="text-gray-700 leading-relaxed">"{t.quote}"</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;