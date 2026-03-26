import { Link } from 'react-router-dom';
import { Activity, Stethoscope, ChevronRight } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="landing-page">
      <nav className="landing-nav">
        <div className="landing-brand">
          <Activity size={32} color="var(--teal)" />
          <span>IHMS Network</span>
        </div>
      </nav>

      <main className="landing-hero">
        <div className="hero-content">
          <h1 className="hero-title">
            The Future of <span>Hospital Management</span> is Here
          </h1>
          <p className="hero-subtitle">
            Unify your hospital's operations, streamline patient care, and connect 
            your medical staff with a beautiful, lightning-fast internal platform.
          </p>
          <Link to="/dashboard" className="hero-cta">
            Enter Dashboard <ChevronRight size={20} />
          </Link>
        </div>

        <div className="hero-image">
          <div className="hero-image-glow"></div>
          <div className="hero-card">
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ background: 'var(--teal-light)', color: 'var(--teal)', padding: '12px', borderRadius: '12px' }}>
                <Stethoscope size={24} />
              </div>
              <div>
                <div style={{ fontSize: '14px', fontWeight: '600' }}>Active Sessions</div>
                <div style={{ fontSize: '13px', color: 'var(--text3)' }}>Across multiple departments</div>
              </div>
            </div>
            <div className="inv-bar" style={{ height: '8px' }}>
              <div className="inv-bar-fill" style={{ width: '75%', background: 'var(--teal)' }}></div>
            </div>
            <div className="hero-stats">
              <div>
                <div style={{ fontSize: '24px', fontWeight: 'bold', fontFamily: "'DM Serif Display', serif" }}>84</div>
                <div style={{ fontSize: '12px', color: 'var(--text3)', textTransform: 'uppercase' }}>OPD Today</div>
              </div>
              <div>
                <div style={{ fontSize: '24px', fontWeight: 'bold', fontFamily: "'DM Serif Display', serif", color: 'var(--red)' }}>3</div>
                <div style={{ fontSize: '12px', color: 'var(--text3)', textTransform: 'uppercase' }}>Critical Alerts</div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
