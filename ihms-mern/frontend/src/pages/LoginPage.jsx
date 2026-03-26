import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Shield, User, Stethoscope, TestTube, Pill } from 'lucide-react';

const roles = [
  { id: 'admin', title: 'Administrator', icon: <Shield size={24} />, desc: 'System control & analytics', color: 'var(--purple)' },
  { id: 'reception', title: 'Receptionist', icon: <Building2 size={24} />, desc: 'Front desk operations', color: 'var(--amber)' },
  { id: 'doctor', title: 'Doctor', icon: <Stethoscope size={24} />, desc: 'Consultations & IPD', color: 'var(--teal)' },
  { id: 'nurse', title: 'Nurse', icon: <User size={24} />, desc: 'Patient care & vitals', color: 'var(--blue)' },
  { id: 'lab', title: 'Lab Technician', icon: <TestTube size={24} />, desc: 'Tests & results', color: 'var(--red)' },
  { id: 'pharmacy', title: 'Pharmacist', icon: <Pill size={24} />, desc: 'Inventory & dispense', color: 'var(--green)' },
  { id: 'patient', title: 'Patient Portal', icon: <User size={24} />, desc: 'Personal health records', color: 'var(--text)' },
];

export default function LoginPage() {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState(null);

  const handleLogin = (e) => {
    e.preventDefault();
    if (selectedRole) {
      navigate(`/dashboard?role=${selectedRole}`);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <h1 className="login-title">Welcome to IHMS</h1>
          <p className="login-subtitle">Select your role to access the portal</p>
        </div>

        <div className="roles-grid">
          {roles.map(role => (
            <div 
              key={role.id}
              className={`role-card ${selectedRole === role.id ? 'active' : ''}`}
              onClick={() => setSelectedRole(role.id)}
              style={{ '--role-color': role.color }}
            >
              <div className="role-icon-wrapper">{role.icon}</div>
              <div className="role-info">
                <h3>{role.title}</h3>
                <p>{role.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <form onSubmit={handleLogin} className="login-form">
          <div className="form-group">
            <input 
              type="text" 
              className="form-input" 
              placeholder="Username / Employee ID" 
              required 
              disabled={!selectedRole}
              defaultValue={selectedRole ? `${selectedRole}_user` : ''}
            />
          </div>
          <div className="form-group">
            <input 
              type="password" 
              className="form-input" 
              placeholder="Password" 
              required 
              disabled={!selectedRole}
              defaultValue={selectedRole ? 'password123' : ''}
            />
          </div>
          <button type="submit" className="btn btn-primary login-btn" disabled={!selectedRole}>
            Secure Login
          </button>
        </form>
      </div>
    </div>
  );
}
