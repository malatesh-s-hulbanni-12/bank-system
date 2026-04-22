// components/TrustBadges.jsx
import React from 'react';

const badges = [
  { icon: "🔒", text: "256-bit SSL Encryption" },
  { icon: "🛡️", text: "Two-Factor Authentication" },
  { icon: "✅", text: "RBI Registered Bank" },
  { icon: "📋", text: "ISO 27001 Certified" }
];

const TrustBadges = () => {
  return (
    <section className="py-12 bg-white border-y border-gray-100">
      <div className="container mx-auto px-6">
        <div className="flex flex-wrap justify-center gap-8 md:gap-12">
          {badges.map((badge, idx) => (
            <div key={idx} className="flex items-center gap-2 text-gray-700">
              <span className="text-2xl">{badge.icon}</span>
              <span className="font-medium">{badge.text}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustBadges;