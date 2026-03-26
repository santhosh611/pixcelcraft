import { Link } from 'react-router-dom';
import { Activity, Shield, Users, Stethoscope, ChevronRight, ActivitySquare, HeartPulse } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="landing-page">
      <nav className="landing-nav">
        <div className="landing-brand">
          <Activity size={32} color="var(--teal)" />
          <span>IHMS Network</span>
        </div>
        <div className="landing-nav-links">
          <Link to="/login" className="btn btn-primary" style={{ padding: '10px 24px' }}>
            Login / Portal Access
          </Link>
        </div>
      </nav>

      <main className="landing-hero">
        <div className="hero-content">
          <div className="hero-badge">
            <ActivitySquare size={16} /> Welcome to the Next Generation
          </div>
          <h1 className="hero-title">
            The Future of <span className="text-gradient">Hospital Management</span> is Here.
          </h1>
          <p className="hero-subtitle">
            Unify your hospital's operations, streamline patient care, and connect 
            your medical staff with a beautiful, lightning-fast internal platform.
          </p>
          <div className="hero-actions">
            <Link to="/login" className="hero-cta">
              Get Started <ChevronRight size={20} />
            </Link>
            <a href="#features" className="hero-cta-secondary">
              View Features
            </a>
          </div>
        </div>

        <div className="hero-image">
          <div className="hero-image-glow"></div>
          <div className="hero-card">
            <div className="hero-card-header">
              <div className="hero-card-icon">
                <HeartPulse size={24} />
              </div>
              <div>
                <div className="hero-card-title">Live Hospital Vitals</div>
                <div className="hero-card-subtitle">Real-time sync across departments</div>
              </div>
            </div>
            
            <div className="hero-stats">
              <div className="stat-box">
                <div className="stat-val">84</div>
                <div className="stat-label">OPD Today</div>
              </div>
              <div className="stat-box">
                <div className="stat-val alert">3</div>
                <div className="stat-label">Critical Alerts</div>
              </div>
            </div>

            <div className="hero-card-pulse">
              <div className="pulse-dot"></div> Active Secure Connection
            </div>
          </div>
        </div>
      </main>

      <section id="features" className="features-section">
        <div className="features-header">
          <h2>Transforming Healthcare Delivery</h2>
          <p>Everything you need to manage a modern hospital effectively.</p>
        </div>
        
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon" style={{ background: 'var(--purple-light)', color: 'var(--purple)' }}>
              <Shield size={28} />
            </div>
            <h3>Role-Based Access</h3>
            <p>Distinct experiences for doctors, nurses, receptionists, and administrators with secure access.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon" style={{ background: 'var(--teal-light)', color: 'var(--teal)' }}>
              <Users size={28} />
            </div>
            <h3>Patient & IPD Tracking</h3>
            <p>Monitor inpatient health and bed availability with real-time updates and interactive mapping.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon" style={{ background: 'var(--amber-light)', color: 'var(--amber)' }}>
              <ActivitySquare size={28} />
            </div>
            <h3>Critical Alerts System</h3>
            <p>Instantly notify medical staff of abnormal vitals or urgent lab results sent straight to their dashboard.</p>
          </div>
        </div>
      </section>

      <footer className="landing-footer">
        <p>&copy; 2026 Vetri Hospital Network. All rights reserved.</p>
      </footer>
    </div>
  );
}
