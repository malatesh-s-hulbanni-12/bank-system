// App.jsx
import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Hero from './components/Hero';
import Features from './components/Features';
import WhyChooseUs from './components/WhyChooseUs';
import AccountTypes from './components/AccountTypes';
import Testimonials from './components/Testimonials';
import TrustBadges from './components/TrustBadges';
import FAQ from './components/FAQ';
import About from './pages/About';
import Contact from './pages/Contact';
import AdminDashboard from './pages/admin/AdminDashboard';
import EmployeeDashboard from './pages/employee/EmployeeDashboard';
import CustomerDashboard from './pages/customer/CustomerDashboard';
import Loans from './components/Loans';
import FixedDeposit from './components/FixedDeposit';

// Protected Route component for admin
const ProtectedRoute = ({ children }) => {
  const isAdminLoggedIn = localStorage.getItem('adminLoggedIn') === 'true';
  return isAdminLoggedIn ? children : <Navigate to="/" />;
};

// Protected Route component for employee
const ProtectedEmployeeRoute = ({ children }) => {
  const isEmployeeLoggedIn = localStorage.getItem('employeeLoggedIn') === 'true';
  return isEmployeeLoggedIn ? children : <Navigate to="/" />;
};

// Protected Route component for customer
const ProtectedCustomerRoute = ({ children }) => {
  const isCustomerLoggedIn = localStorage.getItem('customerLoggedIn') === 'true';
  return isCustomerLoggedIn ? children : <Navigate to="/" />;
};

// Preloader Animation Component - Only changed dotted text to plain text
const Preloader = ({ onComplete }) => {
  const [phase, setPhase] = useState('arrow');
  const [arrowX, setArrowX] = useState(0);
  const [frame, setFrame] = useState(0);
  const [particles, setParticles] = useState([]);
  const [targets, setTargets] = useState([]);
  const canvasRef = React.useRef(null);
  const animationRef = React.useRef(null);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    canvas.width = window.innerWidth;
    canvas.height = 300;

    let currentPhase = phase;
    let currentArrowX = arrowX;
    let currentFrame = frame;
    let currentParticles = [...particles];
    let currentTargets = [...targets];

    // CHANGED: Draw plain text instead of creating targets
    const drawPlainTextForm = () => {
      const fontSize = Math.min(60, canvas.width / 8);
      ctx.font = `bold ${fontSize}px Arial`;
      ctx.textAlign = 'center';
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
      gradient.addColorStop(0, '#FFD700');
      gradient.addColorStop(1, '#0047AB');
      ctx.fillStyle = gradient;
      ctx.fillText('MS HULBANNI', canvas.width / 2, canvas.height / 2 + 20);
    };

    // Draw arrow
    const drawArrow = (x) => {
      ctx.strokeStyle = '#0047AB';
      ctx.lineWidth = 3;
      
      ctx.beginPath();
      ctx.moveTo(x, canvas.height / 2);
      ctx.lineTo(x + 40, canvas.height / 2);
      ctx.stroke();
      
      ctx.beginPath();
      ctx.moveTo(x + 40, canvas.height / 2);
      ctx.lineTo(x + 30, canvas.height / 2 - 6);
      ctx.lineTo(x + 30, canvas.height / 2 + 6);
      ctx.closePath();
      ctx.fillStyle = '#0047AB';
      ctx.fill();
    };

    const animate = () => {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      if (currentPhase === 'arrow') {
        currentArrowX += 5;
        drawArrow(currentArrowX);
        setArrowX(currentArrowX);
        
        if (currentArrowX >= canvas.width / 2 - 40) {
          currentPhase = 'loading';
          setPhase('loading');
          currentFrame = 0;
        }
      }
      
      if (currentPhase === 'loading') {
        currentFrame++;
        setFrame(currentFrame);
        
        const cx = canvas.width / 2;
        const cy = canvas.height / 2;
        const particleCount = canvas.width < 768 ? 5 : 8;
        
        for (let i = 0; i < particleCount; i++) {
          const angle = currentFrame * 0.1 + i;
          const x = cx + Math.cos(angle) * 50;
          const y = cy + Math.sin(angle) * 30;
          
          currentParticles.push({
            x, y,
            vx: Math.random() * 2 - 1,
            vy: Math.random() * 2 - 1,
            life: 50
          });
        }
        setParticles([...currentParticles]);
        
        if (currentFrame > 70) {
          currentPhase = 'form';
          setPhase('form');
        }
      }
      
      // CHANGED: Draw plain text directly instead of particle dots
      if (currentPhase === 'form') {
        drawPlainTextForm();
        
        // Add some decorative particles around the text
        for (let i = 0; i < 5; i++) {
          const x = canvas.width / 2 + (Math.random() - 0.5) * 200;
          const y = canvas.height / 2 + (Math.random() - 0.5) * 60;
          currentParticles.push({
            x, y,
            vx: Math.random() * 2 - 1,
            vy: Math.random() * 2 - 1,
            life: 30
          });
        }
        
        setTimeout(() => {
          onComplete();
        }, 1000);
      }
      
      if (currentPhase === 'loading') {
        currentParticles = currentParticles.filter(p => {
          p.x += p.vx;
          p.y += p.vy;
          p.life--;
          
          ctx.beginPath();
          const opacity = Math.min(1, p.life / 50);
          ctx.fillStyle = `rgba(255, 100, 0, ${opacity})`;
          ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
          ctx.fill();
          
          return p.life > 0;
        });
        setParticles(currentParticles);
      }
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animate();
    
    const handleResize = () => {
      canvas.width = window.innerWidth;
    };
    window.addEventListener('resize', handleResize);
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div style={{ 
      position: 'fixed', 
      top: 0, 
      left: 0, 
      width: '100%', 
      height: '100%',
      backgroundColor: '#ffffff',
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <canvas 
        ref={canvasRef} 
        style={{ 
          width: '100%', 
          height: '300px',
          display: 'block'
        }} 
      />
    </div>
  );
};

function App() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ customers: 0, transactions: 0, branches: 0 });
  const location = useLocation();
  
  const isAdminRoute = location.pathname.startsWith('/admin');
  const isEmployeeRoute = location.pathname.startsWith('/employee');
  const isCustomerRoute = location.pathname.startsWith('/customer');
  const hideNavbarFooter = isAdminRoute || isEmployeeRoute || isCustomerRoute;

  useEffect(() => {
    const animateValue = (start, end, duration, setter) => {
      const range = end - start;
      const increment = range / (duration / 10);
      let current = start;
      const timer = setInterval(() => {
        current += increment;
        if (current >= end) {
          clearInterval(timer);
          setter(end.toLocaleString());
        } else {
          setter(Math.floor(current).toLocaleString());
        }
      }, 10);
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateValue(0, 15280, 2000, (val) => setStats(prev => ({ ...prev, customers: val })));
          animateValue(0, 125000, 2000, (val) => setStats(prev => ({ ...prev, transactions: val })));
          animateValue(0, 150, 2000, (val) => setStats(prev => ({ ...prev, branches: val })));
          observer.disconnect();
        }
      });
    });
    const statsSection = document.getElementById('stats-section');
    if (statsSection) observer.observe(statsSection);
    return () => observer.disconnect();
  }, []);

  if (loading) {
    return <Preloader onComplete={() => setLoading(false)} />;
  }

  return (
    <div className="font-sans">
      {!hideNavbarFooter && <Navbar />}
      
      <Routes>
        <Route path="/" element={
          <>
            <Hero />
            <Features />
            <WhyChooseUs />
            <AccountTypes />
            <Testimonials />
            <section id="stats-section" className="bg-gradient-to-r from-blue-50 to-white py-16">
              <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                  <div className="p-6">
                    <div className="text-4xl font-bold text-deep-navy mb-2">{stats.customers}+</div>
                    <div className="text-xl text-gray-700">Happy Customers</div>
                  </div>
                  <div className="p-6">
                    <div className="text-4xl font-bold text-deep-navy mb-2">{stats.transactions}+</div>
                    <div className="text-xl text-gray-700">Transactions</div>
                  </div>
                  <div className="p-6">
                    <div className="text-4xl font-bold text-deep-navy mb-2">{stats.branches}+</div>
                    <div className="text-xl text-gray-700">Branches Nationwide</div>
                  </div>
                </div>
              </div>
            </section>
            <TrustBadges />
            <FAQ />
          </>
        } />
        
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/loans" element={<Loans />} />
        <Route path="/fixed-deposit" element={<FixedDeposit />} />
        
        <Route path="/admin/*" element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        } />
        
        <Route path="/employee/*" element={
          <ProtectedEmployeeRoute>
            <EmployeeDashboard />
          </ProtectedEmployeeRoute>
        } />
        
        <Route path="/customer/dashboard" element={
          <ProtectedCustomerRoute>
            <CustomerDashboard />
          </ProtectedCustomerRoute>
        } />
      </Routes>
      
      {!hideNavbarFooter && <Footer />}
    </div>
  );
}

export default App;