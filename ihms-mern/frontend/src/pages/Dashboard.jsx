import React, { useState, useEffect } from 'react';

const ROLE_CONFIG = {
  admin: {
    name: 'Admin', initials: 'AD', label: 'Administrator',
    nav: [
      { label: 'Dashboard', page: 'admin', icon: '◈' },
      { section: 'Management' },
      { label: 'Patients', page: 'patient-detail', icon: '👤' },
      { label: 'Bed Map', page: 'bed-map', icon: '🛏️' },
      { label: 'Billing', page: 'billing', icon: '₹', badge: 4 },
      { label: 'Staff & Users', page: 'staff-users', icon: '👥' },
      { section: 'Reports' },
      { label: 'Analytics', page: 'analytics', icon: '📊' },
      { label: 'Revenue', page: 'revenue', icon: '📈' },
    ]
  },
  reception: {
    name: 'Priya Rajan', initials: 'PR', label: 'Receptionist',
    nav: [
      { label: 'Token Queue', page: 'reception', icon: '🎟️' },
      { label: 'Register Patient', page: 'register', icon: '➕' },
      { label: 'Search Patient', page: 'patient-detail', icon: '🔍' },
      { section: 'Appointments' },
      { label: 'Today\'s Queue', page: 'reception', icon: '📋' },
      { label: 'Billing', page: 'billing', icon: '₹' },
    ]
  },
  doctor: {
    name: 'Dr. Aravind', initials: 'AK', label: 'Cardiologist',
    nav: [
      { label: 'My Queue', page: 'doctor', icon: '🩺', badge: 9 },
      { label: 'Consultation', page: 'doctor', icon: '📝' },
      { section: 'Patients' },
      { label: 'My Patients', page: 'patient-detail', icon: '👤' },
      { label: 'Lab Results', page: 'lab', icon: '🔬', badge: 4 },
      { label: 'IPD Patients', page: 'vitals', icon: '🛏️' },
    ]
  },
  nurse: {
    name: 'Kavitha Devi', initials: 'KD', label: 'Staff Nurse',
    nav: [
      { label: 'IPD Monitoring', page: 'vitals', icon: '📊', badge: 2 },
      { label: 'Record Vitals', page: 'vitals', icon: '💉' },
      { label: 'Bed Map', page: 'bed-map', icon: '🛏️' },
      { section: 'Patients' },
      { label: 'Ward Patients', page: 'patient-detail', icon: '👤' },
    ]
  },
  lab: {
    name: 'Senthil Kumar', initials: 'SK', label: 'Lab Technician',
    nav: [
      { label: 'Pending Orders', page: 'lab', icon: '🔬', badge: 12 },
      { label: 'Upload Results', page: 'lab', icon: '📤' },
      { section: 'History' },
      { label: 'Completed', page: 'lab', icon: '✓' },
    ]
  },
  pharmacy: {
    name: 'Lakshmi Priya', initials: 'LP', label: 'Pharmacist',
    nav: [
      { label: 'Prescriptions', page: 'pharmacy', icon: '💊', badge: 6 },
      { label: 'Dispense', page: 'pharmacy', icon: '📦' },
      { section: 'Inventory' },
      { label: 'Stock Levels', page: 'pharmacy', icon: '📉' },
      { label: 'Low Stock Alerts', page: 'pharmacy', icon: '⚠️', badge: 3 },
    ]
  },
  patient: {
    name: 'Rajesh Kumar', initials: 'RK', label: 'Patient Profile',
    nav: [
      { label: 'My Health', page: 'patient-home', icon: '❤️' },
      { label: 'Prescriptions', page: 'patient-home', icon: '💊', badge: 2 },
      { label: 'Follow-ups', page: 'patient-home', icon: '🗓️', badge: 1 },
    ]
  }
};

export default function Dashboard() {
  const [currentRole, setCurrentRole] = useState('admin');
  const [currentPage, setCurrentPage] = useState('admin');
  const [time, setTime] = useState(new Date().toLocaleTimeString('en-IN', {hour:'2-digit', minute:'2-digit', second:'2-digit'}));
  const [rxList, setRxList] = useState([{ id: 1, val: 'Amlodipine 5mg — 1-0-1 — 30 days — After food' }]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedTests, setSelectedTests] = useState(['CBC']);

  // -- NEW MOCK STATE --
  const [toastMsg, setToastMsg] = useState('');
  const showToast = (msg) => { setToastMsg(msg); setTimeout(() => setToastMsg(''), 3000); };
  
  const [billingPaid, setBillingPaid] = useState(2000);
  const [prescriptions, setPrescriptions] = useState([
    { id: 1, patient: 'Rajesh Kumar', doctor: 'Dr. Aravind', items: '3 medicines', time: '10:45' },
    { id: 2, patient: 'Anbu K.', doctor: 'Dr. Aravind', items: '2 medicines', time: '11:10' },
    { id: 3, patient: 'Lakshmi D.', doctor: 'Dr. Meenakshi', items: '1 medicine', time: '11:25' }
  ]);
  const [labPending, setLabPending] = useState([
    { id: 'VH-L-00441', patient: 'Rajesh K.', tests: 'ECG, CBC', priority: 'urgent' },
    { id: 'VH-L-00442', patient: 'Murugan S.', tests: 'CBC, LFT, RFT', priority: 'urgent' },
    { id: 'VH-L-00443', patient: 'Lakshmi D.', tests: 'HbA1c', priority: 'routine' }
  ]);
  const [doctorQueue, setDoctorQueue] = useState([
    { id: '09', name: 'Sundaram N.', age: 'M/58', complaint: 'Palpitations', status: 'active' },
    { id: '10', name: 'Anbu K.', age: 'M/42', complaint: 'Chest pain', status: 'waiting' },
    { id: '11', name: 'Revathi M.', age: 'F/35', complaint: 'Follow-up', status: 'waiting' },
  ]);
  const [beds, setBeds] = useState([
    { id: 'C-201', type: 'General', patient: 'Anbu K.', status: 'occupied' },
    { id: 'C-202', type: 'General', patient: 'Selvam R.', status: 'occupied' },
    { id: 'C-203', type: 'General', patient: 'Free', status: 'available' },
    { id: 'C-204', type: 'General', patient: 'Rajesh K.⚠', status: 'occupied' },
    { id: 'C-205', type: 'Semi-pvt', patient: 'Free', status: 'available' },
    { id: 'C-206', type: 'Private', patient: 'Devi M.', status: 'occupied' },
    { id: 'C-207', type: 'General', patient: 'Repair', status: 'maintenance' },
    { id: 'C-208', type: 'General', patient: 'Free', status: 'available' },
    { id: 'C-209', type: 'Semi-pvt', patient: 'Karthik V.', status: 'occupied' },
    { id: 'C-210', type: 'Private', patient: 'Free', status: 'available' },
  ]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString('en-IN', {hour:'2-digit', minute:'2-digit', second:'2-digit'}));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const toggleTest = (test) => {
    setSelectedTests(prev => 
      prev.includes(test) ? prev.filter(t => t !== test) : [...prev, test]
    );
  };

  const switchRole = (role) => {
    setCurrentRole(role);
    const config = ROLE_CONFIG[role];
    const defaultPage = config.nav.find(n => n.page)?.page || 'admin';
    setCurrentPage(defaultPage);
  };

  const config = ROLE_CONFIG[currentRole];

  return (
    <div className="app">
      {toastMsg && (
        <div style={{position:'fixed', top:'20px', left:'50%', transform:'translateX(-50%)', background:'var(--teal-dark)', color:'white', padding:'12px 24px', borderRadius:'8px', zIndex:9999, boxShadow:'0 4px 12px rgba(0,0,0,0.15)', fontWeight:'bold'}}>
          {toastMsg}
        </div>
      )}
      {/* SIDEBAR */}
      <aside className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-logo">
          <div className="sidebar-logo-title">IHMS</div>
          <div className="sidebar-logo-sub">Vetri Hospital Network</div>
        </div>

        <div className="sidebar-role-picker">
          <label>Viewing as</label>
          <select value={currentRole} onChange={(e) => {
            switchRole(e.target.value);
            setIsSidebarOpen(false);
          }}>
            <option value="admin">👤 Administrator</option>
            <option value="reception">🏥 Receptionist</option>
            <option value="doctor">🩺 Doctor</option>
            <option value="nurse">💊 Nurse</option>
            <option value="lab">🔬 Lab Technician</option>
            <option value="pharmacy">💊 Pharmacist</option>
            <option value="patient">🧑 Patient Profile</option>
          </select>
        </div>

        <nav className="sidebar-nav">
          {config.nav.map((item, idx) => {
            if (item.section) {
              return <div key={idx} className="nav-section-label">{item.section}</div>;
            } else {
              return (
                <div 
                  key={idx} 
                  className={`nav-item ${currentPage === item.page ? 'active' : ''}`}
                  onClick={() => { if(item.page) setCurrentPage(item.page); setIsSidebarOpen(false); }}
                >
                  <span className="icon">{item.icon}</span>{item.label}
                  {item.badge && <span className="nav-badge">{item.badge}</span>}
                </div>
              );
            }
          })}
        </nav>
      </aside>

      {isSidebarOpen && <div className="sidebar-overlay" onClick={() => setIsSidebarOpen(false)}></div>}

      {/* MAIN */}
      <div className="main">
        {/* HEADER */}
        <header className="header">
          <button className="menu-toggle" onClick={() => setIsSidebarOpen(true)}>☰</button>
          <div className="header-search">
            <input type="text" placeholder="Search patient by name, ID, phone…" />
          </div>
          <div className="header-alerts" onClick={() => setCurrentPage('alerts')}>
            ⚠️ 3 Critical Alerts
          </div>
          <div className="header-time">{time}</div>
          <div className="header-user">
            <div className="header-avatar">{config.initials}</div>
            <div>
              <div style={{fontSize:'13px', fontWeight:'500'}}>{config.name}</div>
              <div style={{fontSize:'11px', color:'var(--text3)'}}>{config.label}</div>
            </div>
          </div>
        </header>

        {/* CONTENT */}
        <div className="content">

          {/* PAGE: ADMIN */}
          <div className={`page ${currentPage === 'admin' ? 'active' : ''}`}>
            {currentPage === 'admin' && (
              <>
                <div className="page-header">
                  <div>
                    <div className="page-title">Good morning, Admin</div>
                    <div className="page-subtitle">Thursday, 26 March 2026 — Vetri Hospital, Kallakurichi</div>
                  </div>
                  <button className="btn btn-primary" onClick={() => setCurrentPage('register')}>+ Register Patient</button>
                </div>

                <div className="stats-grid">
                  <div className="stat-card">
                    <div className="stat-icon">🏥</div>
                    <div className="stat-label">OPD Today</div>
                    <div className="stat-value">84</div>
                    <div className="stat-change up">↑ 12 from yesterday</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-icon">🛏️</div>
                    <div className="stat-label">Beds Occupied</div>
                    <div className="stat-value">38<span style={{fontSize:'16px', color:'var(--text3)'}}>/60</span></div>
                    <div className="stat-change neutral">63% occupancy</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-icon">🔬</div>
                    <div className="stat-label">Lab Pending</div>
                    <div className="stat-value">12</div>
                    <div className="stat-change down">↑ 5 since 9am</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-icon">₹</div>
                    <div className="stat-label">Revenue Today</div>
                    <div className="stat-value">₹1.84L</div>
                    <div className="stat-change up">↑ 8% vs avg</div>
                  </div>
                </div>

                <div className="grid-2">
                  <div className="card">
                    <div className="card-header">
                      <div>
                        <div className="card-title">Department-wise OPD</div>
                        <div className="card-subtitle">Today's patient distribution</div>
                      </div>
                    </div>
                    <table>
                      <thead><tr><th>Department</th><th>Patients</th><th>Avg Wait</th><th>Status</th></tr></thead>
                      <tbody>
                        <tr><td>General Medicine</td><td>24</td><td>18 min</td><td><span className="badge badge-green">Normal</span></td></tr>
                        <tr><td>Cardiology</td><td>18</td><td>22 min</td><td><span className="badge badge-green">Normal</span></td></tr>
                        <tr><td>Orthopaedics</td><td>15</td><td>35 min</td><td><span className="badge badge-amber">Busy</span></td></tr>
                        <tr><td>Paediatrics</td><td>14</td><td>12 min</td><td><span className="badge badge-green">Normal</span></td></tr>
                        <tr><td>Gynaecology</td><td>8</td><td>20 min</td><td><span className="badge badge-green">Normal</span></td></tr>
                        <tr><td>Dermatology</td><td>5</td><td>8 min</td><td><span className="badge badge-green">Normal</span></td></tr>
                      </tbody>
                    </table>
                  </div>

                  <div className="card">
                    <div className="card-header">
                      <div className="card-title">Active Alerts</div>
                      <span className="badge badge-red">3 Critical</span>
                    </div>
                    <div className="alert-item alert-critical">
                      <div className="alert-dot"></div>
                      <div>
                        <div style={{fontSize:'13px', fontWeight:'500', color:'var(--red)'}}>Critical BP — Room C-204</div>
                        <div style={{fontSize:'12px', color:'var(--text2)', marginTop:'2px'}}>Rajesh Kumar (VH-2024-00142) — BP 182/110 mmHg recorded 10 min ago</div>
                      </div>
                    </div>
                    <div className="alert-item alert-critical">
                      <div className="alert-dot"></div>
                      <div>
                        <div style={{fontSize:'13px', fontWeight:'500', color:'var(--red)'}}>Low SpO₂ — ICU Bed 2</div>
                        <div style={{fontSize:'12px', color:'var(--text2)', marginTop:'2px'}}>Murugan S. (VH-2024-00003) — SpO₂ 88% — requires attention</div>
                      </div>
                    </div>
                    <div className="alert-item alert-warning">
                      <div className="alert-dot"></div>
                      <div>
                        <div style={{fontSize:'13px', fontWeight:'500', color:'var(--amber)'}}>Low Stock — Pharmacy</div>
                        <div style={{fontSize:'12px', color:'var(--text2)', marginTop:'2px'}}>Metformin 500mg — only 120 tablets remaining (reorder: 500)</div>
                      </div>
                    </div>
                    <div className="alert-item alert-info">
                      <div className="alert-dot" style={{background:'var(--blue)'}}></div>
                      <div>
                        <div style={{fontSize:'13px', fontWeight:'500', color:'var(--blue)'}}>Lab Results Ready</div>
                        <div style={{fontSize:'12px', color:'var(--text2)', marginTop:'2px'}}>4 reports uploaded and awaiting doctor review</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="card">
                  <div className="card-header">
                    <div className="card-title">Recent Registrations</div>
                    <button className="btn btn-outline btn-sm" onClick={() => setCurrentPage('reception')}>View All</button>
                  </div>
                  <table>
                    <thead>
                      <tr><th>Patient</th><th>ID</th><th>Department</th><th>Doctor</th><th>Type</th><th>Status</th><th>Action</th></tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td><div style={{display:'flex', alignItems:'center', gap:'8px'}}><div className="patient-photo">RK</div> Rajesh Kumar</div></td>
                        <td style={{color:'var(--text3)', fontSize:'12px'}}>VH-2024-00142</td><td>Cardiology</td><td>Dr. Aravind</td>
                        <td><span className="badge badge-red">IPD</span></td><td><span className="badge badge-amber">Admitted</span></td>
                        <td><button className="btn btn-outline btn-sm" onClick={() => setCurrentPage('patient-detail')}>View</button></td>
                      </tr>
                      <tr>
                        <td><div style={{display:'flex', alignItems:'center', gap:'8px'}}><div className="patient-photo" style={{background:'var(--purple-light)', color:'var(--purple)'}}>LD</div> Lakshmi Devi</div></td>
                        <td style={{color:'var(--text3)', fontSize:'12px'}}>VH-2024-00143</td><td>Gynaecology</td><td>Dr. Meenakshi</td>
                        <td><span className="badge badge-blue">OPD</span></td><td><span className="badge badge-green">Completed</span></td>
                        <td><button className="btn btn-outline btn-sm">View</button></td>
                      </tr>
                      <tr>
                        <td><div style={{display:'flex', alignItems:'center', gap:'8px'}}><div className="patient-photo" style={{background:'var(--amber-light)', color:'var(--amber)'}}>MS</div> Murugan S.</div></td>
                        <td style={{color:'var(--text3)', fontSize:'12px'}}>VH-2024-00003</td><td>General Medicine</td><td>Dr. Aravind</td>
                        <td><span className="badge badge-red">ICU</span></td><td><span className="badge badge-red">Critical</span></td>
                        <td><button className="btn btn-outline btn-sm" onClick={() => setCurrentPage('vitals')}>Vitals</button></td>
                      </tr>
                      <tr>
                        <td><div style={{display:'flex', alignItems:'center', gap:'8px'}}><div className="patient-photo" style={{background:'var(--green-light)', color:'var(--green)'}}>PK</div> Priya K.</div></td>
                        <td style={{color:'var(--text3)', fontSize:'12px'}}>VH-2024-00144</td><td>Paediatrics</td><td>Dr. Ramesh</td>
                        <td><span className="badge badge-blue">OPD</span></td><td><span className="badge badge-teal">In Queue</span></td>
                        <td><button className="btn btn-outline btn-sm">View</button></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </>
             )}
          </div>

          {/* PAGE: RECEPTION */}
          <div className={`page ${currentPage === 'reception' ? 'active' : ''}`}>
            {currentPage === 'reception' && (
              <>
                <div className="page-header">
                  <div>
                    <div className="page-title">Reception Desk</div>
                    <div className="page-subtitle">Token & Patient Management</div>
                  </div>
                  <div style={{display:'flex', gap:'8px'}}>
                    <button className="btn btn-outline" onClick={() => setCurrentPage('search')}>🔍 Find Patient</button>
                    <button className="btn btn-primary" onClick={() => setCurrentPage('register')}>+ New Patient</button>
                  </div>
                </div>

                <div className="grid-2" style={{marginBottom:'16px'}}>
                  <div className="card">
                    <div className="card-header">
                      <div>
                        <div className="card-title">Token Queue — Cardiology</div>
                        <div className="card-subtitle">Dr. Aravind Kumar • 18 patients today</div>
                      </div>
                      <select className="form-select" style={{width:'auto', fontSize:'12px'}}>
                        <option>Cardiology</option><option>General Medicine</option><option>Orthopaedics</option>
                      </select>
                    </div>
                    <div className="token-grid">
                      <div className="token done">01<sub>Done</sub></div>
                      <div className="token done">02<sub>Done</sub></div>
                      <div className="token done">03<sub>Done</sub></div>
                      <div className="token done">04<sub>Done</sub></div>
                      <div className="token done">05<sub>Done</sub></div>
                      <div className="token done">06<sub>Done</sub></div>
                      <div className="token done">07<sub>Done</sub></div>
                      <div className="token done">08<sub>Done</sub></div>
                      <div className="token active">09<sub>Now</sub></div>
                      <div className="token waiting">10<sub>Waiting</sub></div>
                      <div className="token waiting">11<sub>Waiting</sub></div>
                      <div className="token waiting">12<sub>Waiting</sub></div>
                      <div className="token skipped">13<sub>Absent</sub></div>
                      <div className="token waiting">14<sub>Waiting</sub></div>
                      <div className="token waiting">15<sub>Waiting</sub></div>
                    </div>
                    <div style={{marginTop:'12px', display:'flex', gap:'8px'}}>
                      <button className="btn btn-outline btn-sm" onClick={() => showToast('Patient Skipped.')}>⏭ Skip</button>
                      <button className="btn btn-primary btn-sm" onClick={() => showToast('Token 10 Called to Cabin!')}>✓ Call Next (10)</button>
                    </div>
                  </div>

                  <div className="card">
                    <div className="card-header">
                      <div className="card-title">Quick Token Issue</div>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Patient ID or Phone</label>
                      <input type="text" className="form-input" placeholder="VH-2024-XXXXX or mobile number" />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Department</label>
                      <select className="form-select">
                        <option>Cardiology</option><option>General Medicine</option><option>Orthopaedics</option><option>Paediatrics</option><option>Gynaecology</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Visit Type</label>
                      <div style={{display:'flex', gap:'8px'}}>
                        <label style={{display:'flex', alignItems:'center', gap:'5px', fontSize:'13px'}}><input type="radio" name="vtype" defaultChecked /> OPD</label>
                        <label style={{display:'flex', alignItems:'center', gap:'5px', fontSize:'13px'}}><input type="radio" name="vtype" /> Emergency</label>
                      </div>
                    </div>
                    <button className="btn btn-primary" style={{width:'100%'}} onClick={() => showToast('Token #16 Issued Successfully!')}>Issue Token #16</button>
                  </div>
                </div>

                <div className="card">
                  <div className="card-header"><div className="card-title">Today's Appointments</div></div>
                  <table>
                    <thead><tr><th>Token</th><th>Patient</th><th>Department</th><th>Doctor</th><th>Time</th><th>Status</th></tr></thead>
                    <tbody>
                      <tr><td style={{fontWeight:'700', color:'var(--teal)'}}>#09</td><td>Sundaram N.</td><td>Cardiology</td><td>Dr. Aravind</td><td>11:20</td><td><span className="badge badge-teal">In Consultation</span></td></tr>
                      <tr><td style={{fontWeight:'700'}}>#10</td><td>Anbu K.</td><td>Cardiology</td><td>Dr. Aravind</td><td>11:35</td><td><span className="badge badge-gray">Waiting</span></td></tr>
                      <tr><td style={{fontWeight:'700'}}>#11</td><td>Revathi M.</td><td>Cardiology</td><td>Dr. Aravind</td><td>11:50</td><td><span className="badge badge-gray">Waiting</span></td></tr>
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>

          {/* PAGE: DOCTOR */}
          <div className={`page ${currentPage === 'doctor' ? 'active' : ''}`}>
             {currentPage === 'doctor' && (
              <>
                <div className="page-header">
                  <div>
                    <div className="page-title">Dr. Aravind Kumar</div>
                    <div className="page-subtitle">Cardiology • 18 patients today • Token 09 active</div>
                  </div>
                </div>
                <div className="grid-3">
                  <div>
                    <div className="card" style={{marginBottom:'16px'}}>
                      <div className="card-header"><div className="card-title">My Queue Today</div><span className="badge badge-teal">{doctorQueue.length} Remaining</span></div>
                      <table>
                        <thead><tr><th>#</th><th>Patient</th><th>Chief Complaint</th><th>Status</th></tr></thead>
                        <tbody>
                          {doctorQueue.map((pt, i) => (
                            <tr key={pt.id} style={i===0 ? {background:'var(--teal-light)'} : {}}>
                              <td style={i===0 ? {fontWeight:'700', color:'var(--teal)'} : {}}>{pt.id}</td>
                              <td><b>{pt.name}</b><br/><small style={{color:'var(--text3)'}}>{pt.age}</small></td>
                              <td>{pt.complaint}</td>
                              <td><span className={`badge ${i===0 ? 'badge-teal' : 'badge-gray'}`}>{i===0 ? 'Active' : 'Waiting'}</span></td>
                            </tr>
                          ))}
                          {doctorQueue.length === 0 && <tr><td colSpan="4" style={{textAlign:'center', padding:'20px', color:'var(--text3)'}}>Queue empty. Great job!</td></tr>}
                        </tbody>
                      </table>
                    </div>

                    <div className="card">
                      <div className="card-header"><div className="card-title">Lab Results to Review</div><span className="badge badge-red">4 New</span></div>
                      <div style={{display:'flex', flexDirection:'column', gap:'8px'}}>
                        <div style={{padding:'8px', background:'var(--blue-light)', borderRadius:'7px', border:'1px solid #bfdbfe'}}>
                          <div style={{fontSize:'13px', fontWeight:'500'}}>ECG — Rajesh Kumar</div>
                          <div style={{fontSize:'11px', color:'var(--text3)'}}>Uploaded 20 min ago</div>
                          <button className="btn btn-outline btn-sm" style={{marginTop:'6px'}}>View Report</button>
                        </div>
                        <div style={{padding:'8px', background:'var(--blue-light)', borderRadius:'7px', border:'1px solid #bfdbfe'}}>
                          <div style={{fontSize:'13px', fontWeight:'500'}}>CBC + LFT — Murugan S.</div>
                          <div style={{fontSize:'11px', color:'var(--text3)'}}>Uploaded 45 min ago</div>
                          <button className="btn btn-outline btn-sm" style={{marginTop:'6px'}}>View Report</button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="card">
                    <div className="card-header">
                      <div>
                        <div className="card-title">Consultation — Token #09</div>
                        <div className="card-subtitle">Sundaram Narayanan • M/58 • VH-2024-00139</div>
                      </div>
                      <span className="badge badge-amber">Hypertension</span>
                    </div>

                    <div className="section-title">Patient History</div>
                    <div style={{background:'var(--surface2)', borderRadius:'8px', padding:'10px 12px', marginBottom:'14px', fontSize:'12px'}}>
                      <div style={{display:'flex', gap:'16px', flexWrap:'wrap'}}>
                        <span>🩸 Blood: <b>B+</b></span>
                        <span>⚠️ Allergy: <b>Sulfa drugs</b></span>
                        <span>💊 Chronic: <b>HTN, T2DM</b></span>
                        <span>🔄 Visits: <b>14</b></span>
                      </div>
                    </div>

                    <div className="form-grid-2" style={{marginBottom:'12px'}}>
                      <div className="form-group">
                        <label className="form-label">Chief Complaint</label>
                        <input className="form-input" type="text" defaultValue="Palpitations, dizziness for 3 days" />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Diagnosis</label>
                        <input className="form-input" type="text" placeholder="Enter diagnosis / ICD code" />
                      </div>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Clinical Notes</label>
                      <textarea className="form-textarea" placeholder="Examination findings, clinical observations…"></textarea>
                    </div>

                    <div className="section-title" style={{marginTop:'4px'}}>Prescriptions</div>
                    <div>
                      {rxList.map(rx => (
                        <div className="rx-item" key={rx.id}>
                          <div className="rx-icon">💊</div>
                          <div style={{flex:1}}>
                            <input className="form-input" style={{marginBottom:'4px'}} type="text" defaultValue={rx.val} />
                          </div>
                          <button className="btn btn-outline btn-sm" style={{color:'var(--red)', borderColor:'#fca5a5'}} onClick={() => setRxList(rxList.filter(r => r.id !== rx.id))}>✕</button>
                        </div>
                      ))}
                    </div>
                    <button className="btn btn-outline btn-sm" onClick={() => setRxList([...rxList, {id: Date.now(), val: ''}])} style={{marginTop:'8px'}}>+ Add Medicine</button>

                    <div className="section-title" style={{marginTop:'14px'}}>Lab Orders</div>
                    <div style={{display:'flex', flexWrap:'wrap', gap:'6px', marginBottom:'8px'}}>
                      {['CBC', 'ECG', 'Echo', 'HbA1c', 'Lipid Profile', 'RFT', 'LFT'].map(test => (
                        <span 
                          key={test} 
                          className={`badge ${selectedTests.includes(test) ? 'badge-teal' : 'badge-gray'}`} 
                          style={{cursor:'pointer'}}
                          onClick={() => toggleTest(test)}
                        >
                          {test} {selectedTests.includes(test) && '✓'}
                        </span>
                      ))}
                    </div>

                    <div style={{display:'flex', gap:'8px', marginTop:'16px', alignItems:'center'}}>
                      <label style={{fontSize:'13px', display:'flex', alignItems:'center', gap:'5px'}}><input type="checkbox" /> Admit Patient (IPD)</label>
                      <button className="btn btn-outline" style={{marginLeft:'auto'}} onClick={() => showToast('Draft Saved')}>Save Draft</button>
                      <button className="btn btn-primary" onClick={() => {
                        showToast('Consultation Saved! Next patient called.');
                        setDoctorQueue(prev => prev.slice(1));
                      }}>Save & Next Patient</button>
                    </div>
                  </div>
                </div>
              </>
              )}
          </div>

          {/* PAGE: VITALS */}
          <div className={`page ${currentPage === 'vitals' ? 'active' : ''}`}>
            {currentPage === 'vitals' && (
              <>
                <div className="page-header">
                  <div>
                    <div className="page-title">IPD Monitoring</div>
                    <div className="page-subtitle">Ward C — Cardiology</div>
                  </div>
                  <button className="btn btn-primary" onClick={() => setCurrentPage('bed-map')}>🛏️ Bed Map</button>
                </div>

                <div style={{background:'var(--red-light)', border:'1px solid #fca5a5', borderRadius:'10px', padding:'12px 16px', marginBottom:'16px', display:'flex', alignItems:'center', gap:'12px'}}>
                  <span style={{fontSize:'20px'}}>⚠️</span>
                  <div>
                    <div style={{fontWeight:'600', color:'var(--red)'}}>Critical Alert — Room C-204, Bed 3</div>
                    <div style={{fontSize:'13px', color:'#7f1d1d'}}>Rajesh Kumar — BP 182/110 mmHg recorded at 11:02 AM. Notify Dr. Aravind Kumar immediately.</div>
                  </div>
                  <button className="btn btn-red btn-sm" style={{marginLeft:'auto'}}>Acknowledge</button>
                </div>

                <div className="grid-2" style={{marginBottom:'16px'}}>
                  <div className="card">
                    <div className="card-header">
                      <div>
                        <div className="card-title">Rajesh Kumar — C-204</div>
                        <div className="card-subtitle">VH-2024-00142 • M/52 • Day 3 of admission</div>
                      </div>
                      <span className="badge badge-red">Critical</span>
                    </div>
                    <div className="vitals-grid">
                      <div className="vital-card">
                        <div className="vital-label">Blood Pressure</div>
                        <div className="vital-value vital-critical">182/110</div>
                        <div className="vital-unit">mmHg</div>
                        <div className="vital-alert">⚠ Hypertensive Crisis</div>
                      </div>
                      <div className="vital-card">
                        <div className="vital-label">Heart Rate</div>
                        <div className="vital-value vital-warning">104</div>
                        <div className="vital-unit">bpm</div>
                        <div className="vital-alert" style={{background:'var(--amber-light)', color:'var(--amber)'}}>↑ Tachycardia</div>
                      </div>
                      <div className="vital-card">
                        <div className="vital-label">SpO₂</div>
                        <div className="vital-value vital-normal">97</div>
                        <div className="vital-unit">%</div>
                      </div>
                      <div className="vital-card">
                        <div className="vital-label">Temperature</div>
                        <div className="vital-value vital-normal">37.1</div>
                        <div className="vital-unit">°C</div>
                      </div>
                      <div className="vital-card">
                        <div className="vital-label">RR</div>
                        <div className="vital-value vital-warning">22</div>
                        <div className="vital-unit">breaths/min</div>
                      </div>
                      <div className="vital-card">
                        <div className="vital-label">Last Recorded</div>
                        <div className="vital-value" style={{fontSize:'15px', color:'var(--text)'}}>11:02</div>
                        <div className="vital-unit">AM today</div>
                      </div>
                    </div>
                    <div style={{marginTop:'14px'}}>
                      <button className="btn btn-primary" style={{width:'100%'}}>+ Record New Vitals</button>
                    </div>
                  </div>

                  <div className="card">
                    <div className="card-header"><div className="card-title">Record Vitals</div></div>
                    <div className="form-group">
                      <label className="form-label">Patient Room / Bed</label>
                      <select className="form-select"><option>C-204 — Rajesh Kumar</option><option>C-201 — Anbu K.</option><option>ICU-02 — Murugan S.</option></select>
                    </div>
                    <div className="form-grid-2">
                      <div className="form-group"><label className="form-label">BP Systolic</label><input className="form-input" type="number" placeholder="120" /></div>
                      <div className="form-group"><label className="form-label">BP Diastolic</label><input className="form-input" type="number" placeholder="80" /></div>
                      <div className="form-group"><label className="form-label">Pulse (bpm)</label><input className="form-input" type="number" placeholder="72" /></div>
                      <div className="form-group"><label className="form-label">Temperature (°C)</label><input className="form-input" type="number" placeholder="37.0" step="0.1" /></div>
                      <div className="form-group"><label className="form-label">SpO₂ (%)</label><input className="form-input" type="number" placeholder="98" /></div>
                      <div className="form-group"><label className="form-label">RR (breaths/min)</label><input className="form-input" type="number" placeholder="16" /></div>
                    </div>
                    <div className="form-group"><label className="form-label">Nurse Notes</label><textarea className="form-textarea" placeholder="Any observations…" style={{minHeight:'60px'}}></textarea></div>
                    <button className="btn btn-primary" style={{width:'100%'}}>Save Vitals</button>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* PAGE: BED MAP */}
          <div className={`page ${currentPage === 'bed-map' ? 'active' : ''}`}>
            {currentPage === 'bed-map' && (
              <>
                <div className="page-header">
                  <div>
                    <div className="page-title">Bed Management</div>
                    <div className="page-subtitle">38 occupied • 18 available • 4 under maintenance</div>
                  </div>
                  <div style={{display:'flex', gap:'8px', alignItems:'center', fontSize:'12px'}}>
                    <span style={{display:'flex', alignItems:'center', gap:'4px'}}><span style={{width:'10px', height:'10px', background:'var(--green-light)', border:'1px solid #bbf7d0', borderRadius:'2px', display:'inline-block'}}></span>Available</span>
                    <span style={{display:'flex', alignItems:'center', gap:'4px'}}><span style={{width:'10px', height:'10px', background:'#fef2f2', border:'1px solid #fca5a5', borderRadius:'2px', display:'inline-block'}}></span>Occupied</span>
                    <span style={{display:'flex', alignItems:'center', gap:'4px'}}><span style={{width:'10px', height:'10px', background:'var(--amber-light)', border:'1px solid #fde68a', borderRadius:'2px', display:'inline-block'}}></span>Maintenance</span>
                  </div>
                </div>
                <div className="card" style={{marginBottom:'16px'}}>
                  <div className="card-header"><div className="card-title">Cardiology Ward — Floor 2</div></div>
                  <div className="bed-map">
                    <div className="bed occupied"><div className="bed-num">C-201</div><div className="bed-type">General</div><div style={{fontSize:'10px', marginTop:'4px', color:'inherit'}}>Anbu K.</div></div>
                    <div className="bed occupied"><div className="bed-num">C-202</div><div className="bed-type">General</div><div style={{fontSize:'10px', marginTop:'4px', color:'inherit'}}>Selvam R.</div></div>
                    <div className="bed available" onClick={(e) => { e.currentTarget.className='bed occupied'; e.currentTarget.children[2].innerText='Assigned'; showToast('Bed Assigned Successfully!'); }}><div className="bed-num">C-203</div><div className="bed-type">General</div><div style={{fontSize:'10px', marginTop:'4px'}}>Free</div></div>
                    <div className="bed occupied"><div className="bed-num">C-204</div><div className="bed-type">General</div><div style={{fontSize:'10px', marginTop:'4px', color:'inherit'}}>Rajesh K.⚠</div></div>
                    <div className="bed available" onClick={(e) => { e.currentTarget.className='bed occupied'; e.currentTarget.children[2].innerText='Assigned'; showToast('Bed Assigned Successfully!'); }}><div className="bed-num">C-205</div><div className="bed-type">Semi-pvt</div><div style={{fontSize:'10px', marginTop:'4px'}}>Free</div></div>
                    <div className="bed occupied"><div className="bed-num">C-206</div><div className="bed-type">Private</div><div style={{fontSize:'10px', marginTop:'4px', color:'inherit'}}>Devi M.</div></div>
                    <div className="bed maintenance"><div className="bed-num">C-207</div><div className="bed-type">General</div><div style={{fontSize:'10px', marginTop:'4px'}}>Repair</div></div>
                    <div className="bed available" onClick={(e) => { e.currentTarget.className='bed occupied'; e.currentTarget.children[2].innerText='Assigned'; showToast('Bed Assigned Successfully!'); }}><div className="bed-num">C-208</div><div className="bed-type">General</div><div style={{fontSize:'10px', marginTop:'4px'}}>Free</div></div>
                    <div className="bed occupied"><div className="bed-num">C-209</div><div className="bed-type">Semi-pvt</div><div style={{fontSize:'10px', marginTop:'4px', color:'inherit'}}>Karthik V.</div></div>
                    <div className="bed available" onClick={(e) => { e.currentTarget.className='bed occupied'; e.currentTarget.children[2].innerText='Assigned'; showToast('Bed Assigned Successfully!'); }}><div className="bed-num">C-210</div><div className="bed-type">Private</div><div style={{fontSize:'10px', marginTop:'4px'}}>Free</div></div>
                  </div>
                </div>
                <div className="card">
                  <div className="card-header"><div className="card-title">ICU — Ground Floor</div><span className="badge badge-red">2/4 Critical</span></div>
                  <div className="bed-map" style={{gridTemplateColumns:'repeat(4,1fr)'}}>
                    <div className="bed occupied"><div className="bed-num">ICU-01</div><div className="bed-type">ICU</div><div style={{fontSize:'10px', marginTop:'4px', color:'inherit'}}>Balu R.</div></div>
                    <div className="bed occupied"><div className="bed-num">ICU-02</div><div className="bed-type">ICU</div><div style={{fontSize:'10px', marginTop:'4px', color:'inherit'}}>Murugan S.⚠</div></div>
                    <div className="bed available" onClick={(e) => { e.currentTarget.className='bed occupied'; e.currentTarget.children[2].innerText='Assigned'; showToast('Bed Assigned Successfully!'); }}><div className="bed-num">ICU-03</div><div className="bed-type">ICU</div><div style={{fontSize:'10px', marginTop:'4px'}}>Free</div></div>
                    <div className="bed available" onClick={(e) => { e.currentTarget.className='bed occupied'; e.currentTarget.children[2].innerText='Assigned'; showToast('Bed Assigned Successfully!'); }}><div className="bed-num">ICU-04</div><div className="bed-type">ICU</div><div style={{fontSize:'10px', marginTop:'4px'}}>Free</div></div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* PAGE: PHARMACY */}
          <div className={`page ${currentPage === 'pharmacy' ? 'active' : ''}`}>
            {currentPage === 'pharmacy' && (
              <>
                <div className="page-header">
                  <div>
                    <div className="page-title">Pharmacy</div>
                    <div className="page-subtitle">Prescriptions • Dispensing • Inventory</div>
                  </div>
                  <button className="btn btn-outline">📦 View Inventory</button>
                </div>
                <div className="grid-2">
                  <div className="card">
                    <div className="card-header"><div className="card-title">Pending Prescriptions</div><span className="badge badge-amber">6 Pending</span></div>
                    <table>
                      <thead><tr><th>Patient</th><th>Doctor</th><th>Items</th><th>Time</th><th>Action</th></tr></thead>
                      <tbody>
                        {prescriptions.map(rx => (
                          <tr key={rx.id}>
                            <td>{rx.patient}</td><td>{rx.doctor}</td><td>{rx.items}</td><td>{rx.time}</td>
                            <td><button className="btn btn-primary btn-sm" onClick={() => {
                              showToast(`Medicines dispensed for ${rx.patient}`);
                              setPrescriptions(prev => prev.filter(p => p.id !== rx.id));
                            }}>Dispense</button></td>
                          </tr>
                        ))}
                        {prescriptions.length === 0 && <tr><td colSpan="5" style={{textAlign:'center', padding:'20px', color:'var(--text3)'}}>No pending prescriptions</td></tr>}
                      </tbody>
                    </table>
                  </div>
                  <div className="card">
                    <div className="card-header"><div className="card-title">Low Stock Alerts</div><span className="badge badge-red">3 Items</span></div>
                    <div style={{display:'flex', flexDirection:'column', gap:'10px'}}>
                      <div>
                        <div style={{display:'flex', justifyContent:'space-between', fontSize:'13px'}}><span><b>Metformin 500mg</b></span><span style={{color:'var(--red)'}}>120 left</span></div>
                        <div className="inv-bar"><div className="inv-bar-fill" style={{width:'12%', background:'var(--red)'}}></div></div>
                        <div style={{fontSize:'11px', color:'var(--text3)'}}>Reorder level: 500 • Cipla Ltd.</div>
                      </div>
                      <div>
                        <div style={{display:'flex', justifyContent:'space-between', fontSize:'13px'}}><span><b>Atorvastatin 20mg</b></span><span style={{color:'var(--amber)'}}>280 left</span></div>
                        <div className="inv-bar"><div className="inv-bar-fill" style={{width:'28%', background:'var(--amber)'}}></div></div>
                        <div style={{fontSize:'11px', color:'var(--text3)'}}>Reorder level: 300 • Sun Pharma</div>
                      </div>
                      <div>
                        <div style={{display:'flex', justifyContent:'space-between', fontSize:'13px'}}><span><b>Clopidogrel 75mg</b></span><span style={{color:'var(--amber)'}}>340 left</span></div>
                        <div className="inv-bar"><div className="inv-bar-fill" style={{width:'34%', background:'var(--amber)'}}></div></div>
                        <div style={{fontSize:'11px', color:'var(--text3)'}}>Reorder level: 400 • Hetero Drugs</div>
                      </div>
                      <div>
                        <div style={{display:'flex', justifyContent:'space-between', fontSize:'13px'}}><span><b>Aspirin 75mg</b></span><span style={{color:'var(--green)'}}>2400 left</span></div>
                        <div className="inv-bar"><div className="inv-bar-fill" style={{width:'80%', background:'var(--green)'}}></div></div>
                        <div style={{fontSize:'11px', color:'var(--text3)'}}>Reorder level: 500 • Cipla Ltd.</div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* PAGE: LAB */}
          <div className={`page ${currentPage === 'lab' ? 'active' : ''}`}>
            {currentPage === 'lab' && (
              <>
                <div className="page-header">
                  <div>
                    <div className="page-title">Lab Management</div>
                    <div className="page-subtitle">Test orders • Sample collection • Results upload</div>
                  </div>
                </div>
                <div className="grid-2">
                  <div className="card">
                    <div className="card-header"><div className="card-title">Pending Test Orders</div><span className="badge badge-red">{labPending.length} Pending</span></div>
                    <table>
                      <thead><tr><th>Order ID</th><th>Patient</th><th>Tests</th><th>Priority</th><th>Status</th></tr></thead>
                      <tbody>
                        {labPending.map(lab => (
                          <tr key={lab.id}>
                            <td style={{fontSize:'12px', color:'var(--text3)'}}>{lab.id}</td>
                            <td>{lab.patient}</td><td>{lab.tests}</td>
                            <td><span className={lab.priority==='urgent' ? 'badge badge-red' : 'badge badge-gray'}>{lab.priority==='urgent' ? 'Urgent' : 'Routine'}</span></td>
                            <td><button className="btn btn-primary btn-sm" onClick={() => {
                              showToast(`Results uploaded for ${lab.patient}`);
                              setLabPending(prev => prev.filter(l => l.id !== lab.id));
                            }}>Upload</button></td>
                          </tr>
                        ))}
                        {labPending.length === 0 && <tr><td colSpan="5" style={{textAlign:'center', padding:'20px', color:'var(--text3)'}}>No pending tests</td></tr>}
                      </tbody>
                    </table>
                  </div>
                  <div className="card">
                    <div className="card-header"><div className="card-title">Upload Results</div></div>
                    <div className="form-group"><label className="form-label">Order ID</label><input className="form-input" type="text" placeholder="VH-L-XXXXX" /></div>
                    <div className="form-group"><label className="form-label">Test Name</label><select className="form-select"><option>CBC</option><option>ECG</option><option>LFT</option><option>RFT</option><option>HbA1c</option></select></div>
                    <div className="form-group">
                      <label className="form-label">Upload Report (PDF)</label>
                      <div style={{border:'2px dashed var(--border2)', borderRadius:'8px', padding:'20px', textAlign:'center', color:'var(--text3)', fontSize:'13px', cursor:'pointer'}}>
                        📄 Click or drag PDF here
                      </div>
                    </div>
                    <div className="form-group"><label className="form-label">Interpretation / Notes</label><textarea className="form-textarea" placeholder="Key findings…" style={{minHeight:'60px'}}></textarea></div>
                    <button className="btn btn-primary" style={{width:'100%'}} onClick={() => showToast('Lab Results Submitted Successfully!')}>Submit Results</button>
                  </div>
                </div>
              </>
             )}
          </div>

          {/* PAGE: REGISTER PATIENT */}
          <div className={`page ${currentPage === 'register' ? 'active' : ''}`}>
            {currentPage === 'register' && (
              <>
                <div className="page-header">
                  <div>
                    <div className="page-title">Register New Patient</div>
                    <div className="breadcrumb">Reception → <span>New Registration</span></div>
                  </div>
                  <div style={{background:'var(--teal-light)', border:'1px solid #99f6e4', borderRadius:'8px', padding:'8px 14px', fontSize:'13px', color:'var(--teal-dark)'}}>
                    Auto ID: <b>VH-2026-00145</b>
                  </div>
                </div>
                <div className="card">
                  <div className="section-title">Personal Information</div>
                  <div className="form-grid-3">
                    <div className="form-group"><label className="form-label">Full Name *</label><input className="form-input" type="text" placeholder="Patient's full name" /></div>
                    <div className="form-group"><label className="form-label">Date of Birth *</label><input className="form-input" type="date" /></div>
                    <div className="form-group"><label className="form-label">Gender *</label><select className="form-select"><option>Male</option><option>Female</option><option>Other</option></select></div>
                    <div className="form-group"><label className="form-label">Phone *</label><input className="form-input" type="tel" placeholder="10-digit mobile" /></div>
                    <div className="form-group"><label className="form-label">Blood Group</label><select className="form-select"><option>--</option><option>A+</option><option>A-</option><option>B+</option><option>B-</option><option>O+</option><option>O-</option><option>AB+</option><option>AB-</option></select></div>
                    <div className="form-group"><label className="form-label">Aadhar No.</label><input className="form-input" type="text" placeholder="XXXX-XXXX-XXXX" /></div>
                  </div>
                  <div className="form-group"><label className="form-label">Address</label><input className="form-input" type="text" placeholder="Street, City, Pincode" /></div>
                  <div className="form-grid-2" style={{marginTop:'4px'}}>
                    <div className="form-group"><label className="form-label">Allergies</label><input className="form-input" type="text" placeholder="e.g. Penicillin, Sulfa (comma separated)" /></div>
                    <div className="form-group"><label className="form-label">Chronic Conditions</label><input className="form-input" type="text" placeholder="e.g. Hypertension, Diabetes" /></div>
                  </div>

                  <div className="section-title" style={{marginTop:'8px'}}>Visit Details</div>
                  <div className="form-grid-3">
                    <div className="form-group"><label className="form-label">Visit Type *</label><select className="form-select"><option>OPD</option><option>IPD</option><option>Emergency</option></select></div>
                    <div className="form-group"><label className="form-label">Department *</label><select className="form-select"><option>General Medicine</option><option>Cardiology</option><option>Orthopaedics</option><option>Paediatrics</option><option>Gynaecology</option><option>Dermatology</option><option>Neurology</option></select></div>
                    <div className="form-group"><label className="form-label">Assign Doctor *</label><select className="form-select"><option>Dr. Aravind Kumar</option><option>Dr. Meenakshi Sundaram</option><option>Dr. Ramesh Babu</option></select></div>
                  </div>
                  <div className="form-group"><label className="form-label">Chief Complaint</label><input className="form-input" type="text" placeholder="Reason for visit" /></div>

                  <div style={{display:'flex', justifyContent:'flex-end', gap:'8px', marginTop:'8px'}}>
                    <button className="btn btn-outline" onClick={() => setCurrentPage('reception')}>Cancel</button>
                    <button className="btn btn-primary" onClick={() => {
                        showToast('Patient Registered Successfully! Token Issued.');
                        setCurrentPage('reception');
                    }}>Register & Issue Token</button>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* PAGE: BILLING */}
          <div className={`page ${currentPage === 'billing' ? 'active' : ''}`}>
            {currentPage === 'billing' && (
              <>
                <div className="page-header">
                  <div>
                    <div className="page-title">Billing</div>
                    <div className="page-subtitle">Invoice #VH-INV-2026-00781 — Rajesh Kumar</div>
                  </div>
                  <button className="btn btn-outline" onClick={() => { showToast('PDF Generated and Downloading...'); window.print(); }}>📄 Download PDF</button>
                </div>
                <div className="grid-3">
                  <div className="card">
                    <div className="section-title">Invoice Details</div>
                    <table>
                      <thead><tr><th>Description</th><th style={{textAlign:'right'}}>Amount</th></tr></thead>
                      <tbody>
                        <tr><td>OPD Consultation — Cardiology</td><td style={{textAlign:'right'}}>₹ 500</td></tr>
                        <tr><td>ECG (12-lead)</td><td style={{textAlign:'right'}}>₹ 300</td></tr>
                        <tr><td>CBC Test</td><td style={{textAlign:'right'}}>₹ 250</td></tr>
                        <tr><td>Amlodipine 5mg × 30</td><td style={{textAlign:'right'}}>₹ 165</td></tr>
                        <tr><td>General Ward — 3 days @ ₹1500</td><td style={{textAlign:'right'}}>₹ 4,500</td></tr>
                        <tr style={{background:'var(--surface2)'}}><td style={{fontWeight:'600'}}>Subtotal</td><td style={{textAlign:'right', fontWeight:'600'}}>₹ 5,715</td></tr>
                        <tr><td style={{color:'var(--green)'}}>Discount (Staff)</td><td style={{textAlign:'right', color:'var(--green)'}}>- ₹ 200</td></tr>
                        <tr style={{background:'var(--teal-light)'}}><td style={{fontWeight:'700', color:'var(--teal-dark)'}}>Total</td><td style={{textAlign:'right', fontWeight:'700', color:'var(--teal-dark)'}}>₹ 5,515</td></tr>
                      </tbody>
                    </table>
                    <div style={{marginTop:'14px', padding:'10px 12px', background:'var(--amber-light)', borderRadius:'8px', border:'1px solid #fde68a'}}>
                      <div style={{fontSize:'12px', color:'var(--text2)'}}>Amount Paid: <b>₹ {billingPaid.toLocaleString('en-IN')}</b></div>
                      <div style={{fontSize:'13px', fontWeight:'700', color:'var(--amber)', marginTop:'2px'}}>Balance Due: ₹ {(5515 - billingPaid).toLocaleString('en-IN')}</div>
                    </div>
                  </div>
                  <div className="card">
                    <div className="section-title">Record Payment</div>
                    <div className="form-group"><label className="form-label">Amount</label><input id="payment-input" className="form-input" type="number" placeholder="Enter amount" defaultValue="3515" /></div>
                    <div className="form-group"><label className="form-label">Payment Mode</label>
                      <select className="form-select">
                        <option>Cash</option><option>UPI</option><option>Card</option><option>Insurance</option><option>Cheque</option>
                      </select>
                    </div>
                    <div className="form-group"><label className="form-label">Reference / UPI ID</label><input className="form-input" type="text" placeholder="Transaction reference" /></div>
                    <button className="btn btn-primary" style={{width:'100%'}} onClick={() => {
                        const amt = parseInt(document.getElementById('payment-input').value) || 0;
                        if(amt > 0) {
                          setBillingPaid(prev => prev + amt);
                          showToast(`Payment of ₹${amt} Recorded Successfully!`);
                          document.getElementById('payment-input').value = '';
                        }
                    }}>Record Payment</button>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* PAGE: PATIENT DETAIL */}
          <div className={`page ${currentPage === 'patient-detail' ? 'active' : ''}`}>
            {currentPage === 'patient-detail' && (
              <>
                <div className="page-header">
                  <div>
                    <div className="page-title">Rajesh Kumar</div>
                    <div className="page-subtitle">VH-2024-00142 • M/52 • B+ • Admitted — Cardiology</div>
                  </div>
                  <div style={{display:'flex', gap:'8px'}}>
                    <button className="btn btn-outline" onClick={() => setCurrentPage('vitals')}>📊 Vitals</button>
                    <button className="btn btn-outline" onClick={() => setCurrentPage('billing')}>🧾 Billing</button>
                    <button className="btn btn-primary" onClick={() => showToast('Patient Discharged Successfully!')}>Discharge</button>
                  </div>
                </div>
                <div className="grid-3">
                  <div>
                    <div className="card" style={{marginBottom:'16px'}}>
                      <div className="card-header"><div className="card-title">Patient Info</div></div>
                      <table>
                        <tbody>
                          <tr><td style={{color:'var(--text3)'}}>DOB</td><td>15 Mar 1974</td></tr>
                          <tr><td style={{color:'var(--text3)'}}>Phone</td><td>9994001001</td></tr>
                          <tr><td style={{color:'var(--text3)'}}>Address</td><td>12 Anna Nagar, Kallakurichi</td></tr>
                          <tr><td style={{color:'var(--text3)'}}>Allergies</td><td><span className="badge badge-red">Penicillin</span></td></tr>
                          <tr><td style={{color:'var(--text3)'}}>Chronic</td><td>HTN, T2DM</td></tr>
                          <tr><td style={{color:'var(--text3)'}}>Emergency</td><td>Lakshmi — 9994001002</td></tr>
                        </tbody>
                      </table>
                    </div>
                    <div className="card">
                      <div className="card-header"><div className="card-title">Current Vitals</div><span className="badge badge-red">Critical</span></div>
                      <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'8px'}}>
                        <div style={{padding:'8px', background:'var(--red-light)', borderRadius:'7px', textAlign:'center'}}>
                          <div style={{fontSize:'10px', color:'var(--text3)'}}>BP</div>
                          <div style={{fontSize:'18px', fontWeight:'700', color:'var(--red)'}}>182/110</div>
                        </div>
                        <div style={{padding:'8px', background:'var(--amber-light)', borderRadius:'7px', textAlign:'center'}}>
                          <div style={{fontSize:'10px', color:'var(--text3)'}}>Pulse</div>
                          <div style={{fontSize:'18px', fontWeight:'700', color:'var(--amber)'}}>104</div>
                        </div>
                        <div style={{padding:'8px', background:'var(--green-light)', borderRadius:'7px', textAlign:'center'}}>
                          <div style={{fontSize:'10px', color:'var(--text3)'}}>SpO₂</div>
                          <div style={{fontSize:'18px', fontWeight:'700', color:'var(--green)'}}>97%</div>
                        </div>
                        <div style={{padding:'8px', background:'var(--surface2)', borderRadius:'7px', textAlign:'center'}}>
                          <div style={{fontSize:'10px', color:'var(--text3)'}}>Temp</div>
                          <div style={{fontSize:'18px', fontWeight:'700'}}>37.1°</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="card">
                    <div className="card-header"><div className="card-title">Visit Timeline</div></div>
                    <div className="timeline-item">
                      <div className="timeline-dot" style={{background:'var(--red)'}}></div>
                      <div>
                        <div style={{fontSize:'13px', fontWeight:'500'}}>Critical BP Alert</div>
                        <div style={{fontSize:'11px', color:'var(--text3)'}}>Today 11:02 AM • Nurse Kavitha</div>
                        <div style={{fontSize:'12px', color:'var(--text2)', marginTop:'3px'}}>BP 182/110 recorded. Doctor notified.</div>
                      </div>
                    </div>
                    <div className="timeline-item">
                      <div className="timeline-dot" style={{background:'var(--blue)'}}></div>
                      <div>
                        <div style={{fontSize:'13px', fontWeight:'500'}}>Lab Results Ready</div>
                        <div style={{fontSize:'11px', color:'var(--text3)'}}>Today 09:30 AM • Lab Tech Senthil</div>
                        <div style={{fontSize:'12px', color:'var(--text2)', marginTop:'3px'}}>ECG, CBC uploaded. Mild anaemia noted.</div>
                      </div>
                    </div>
                    <div className="timeline-item">
                      <div className="timeline-dot"></div>
                      <div>
                        <div style={{fontSize:'13px', fontWeight:'500'}}>Doctor Visit + Rx Updated</div>
                        <div style={{fontSize:'11px', color:'var(--text3)'}}>Yesterday 6:00 PM • Dr. Aravind Kumar</div>
                        <div style={{fontSize:'12px', color:'var(--text2)', marginTop:'3px'}}>Diagnosis: NSTEMI. Added Heparin 5000 IU IV.</div>
                      </div>
                    </div>
                    <div className="timeline-item">
                      <div className="timeline-dot"></div>
                      <div>
                        <div style={{fontSize:'13px', fontWeight:'500'}}>Lab Orders Placed</div>
                        <div style={{fontSize:'11px', color:'var(--text3)'}}>Yesterday 2:15 PM • Dr. Aravind Kumar</div>
                        <div style={{fontSize:'12px', color:'var(--text2)', marginTop:'3px'}}>ECG, CBC, Troponin-I ordered.</div>
                      </div>
                    </div>
                    <div className="timeline-item">
                      <div className="timeline-dot" style={{background:'var(--teal)'}}></div>
                      <div>
                        <div style={{fontSize:'13px', fontWeight:'500'}}>Admitted to Ward C-204</div>
                        <div style={{fontSize:'11px', color:'var(--text3)'}}>24 Mar 2026 • Receptionist Priya</div>
                        <div style={{fontSize:'12px', color:'var(--text2)', marginTop:'3px'}}>IPD admission. Chief complaint: chest pain.</div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* PAGE: STAFF & USERS */}
          <div className={`page ${currentPage === 'staff-users' ? 'active' : ''}`}>
            {currentPage === 'staff-users' && (
              <>
                <div className="page-header">
                  <div>
                    <div className="page-title">Staff & Users Management</div>
                    <div className="page-subtitle">Manage hospital personnel, access controls, and schedules</div>
                  </div>
                  <button className="btn btn-primary">+ Add New Staff</button>
                </div>
                <div className="card">
                  <div className="card-header">
                    <div className="card-title">Active Personnel</div>
                    <div className="header-search" style={{maxWidth: '300px'}}>
                      <input type="text" placeholder="Search staff..." className="form-input" />
                    </div>
                  </div>
                  <table>
                    <thead>
                      <tr><th>Name</th><th>Employee ID</th><th>Role</th><th>Department</th><th>Status</th><th>Actions</th></tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td><div style={{display:'flex', alignItems:'center', gap:'8px'}}><div className="patient-photo" style={{background:'var(--teal-light)', color:'var(--teal)'}}>AK</div> Dr. Aravind Kumar</div></td>
                        <td style={{color:'var(--text3)', fontSize:'12px'}}>EMP-1042</td><td>Doctor</td><td>Cardiology</td>
                        <td><span className="badge badge-green">On Duty</span></td>
                        <td><button className="btn btn-outline btn-sm">Edit</button></td>
                      </tr>
                      <tr>
                        <td><div style={{display:'flex', alignItems:'center', gap:'8px'}}><div className="patient-photo" style={{background:'var(--purple-light)', color:'var(--purple)'}}>MS</div> Dr. Meenakshi S.</div></td>
                        <td style={{color:'var(--text3)', fontSize:'12px'}}>EMP-1088</td><td>Doctor</td><td>Gynaecology</td>
                        <td><span className="badge badge-gray">Off Duty</span></td>
                        <td><button className="btn btn-outline btn-sm">Edit</button></td>
                      </tr>
                      <tr>
                        <td><div style={{display:'flex', alignItems:'center', gap:'8px'}}><div className="patient-photo" style={{background:'var(--blue-light)', color:'var(--blue)'}}>PR</div> Priya Rajan</div></td>
                        <td style={{color:'var(--text3)', fontSize:'12px'}}>EMP-2104</td><td>Receptionist</td><td>Front Desk</td>
                        <td><span className="badge badge-green">On Duty</span></td>
                        <td><button className="btn btn-outline btn-sm">Edit</button></td>
                      </tr>
                      <tr>
                        <td><div style={{display:'flex', alignItems:'center', gap:'8px'}}><div className="patient-photo" style={{background:'var(--amber-light)', color:'var(--amber)'}}>SK</div> Senthil Kumar</div></td>
                        <td style={{color:'var(--text3)', fontSize:'12px'}}>EMP-3045</td><td>Lab Tech</td><td>Laboratory</td>
                        <td><span className="badge badge-green">On Duty</span></td>
                        <td><button className="btn btn-outline btn-sm">Edit</button></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>

          {/* PAGE: ANALYTICS */}
          <div className={`page ${currentPage === 'analytics' ? 'active' : ''}`}>
            {currentPage === 'analytics' && (
              <>
                <div className="page-header">
                  <div>
                    <div className="page-title">Hospital Analytics</div>
                    <div className="page-subtitle">Performance metrics and patient statistics</div>
                  </div>
                  <select className="form-select" style={{width: 'auto'}}>
                    <option>This Week</option>
                    <option>This Month</option>
                    <option>This Year</option>
                  </select>
                </div>
                
                <div className="stats-grid">
                  <div className="stat-card">
                    <div className="stat-label">Total Admissions</div>
                    <div className="stat-value">428</div>
                    <div className="stat-change up">↑ 12% vs last week</div>
                    <div className="mini-chart" style={{marginTop:'12px'}}>
                      <div className="mini-bar" style={{height:'40%', width:'10%'}}></div>
                      <div className="mini-bar" style={{height:'60%', width:'10%'}}></div>
                      <div className="mini-bar" style={{height:'45%', width:'10%'}}></div>
                      <div className="mini-bar" style={{height:'80%', width:'10%'}}></div>
                      <div className="mini-bar" style={{height:'50%', width:'10%'}}></div>
                      <div className="mini-bar" style={{height:'100%', width:'10%', background:'var(--teal-dark)'}}></div>
                    </div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-label">Average Wait Time</div>
                    <div className="stat-value">18m</div>
                    <div className="stat-change down">↓ 4m vs last week</div>
                    <div className="mini-chart" style={{marginTop:'12px'}}>
                      <div className="mini-bar" style={{height:'80%', width:'10%', background:'var(--amber)'}}></div>
                      <div className="mini-bar" style={{height:'70%', width:'10%', background:'var(--amber)'}}></div>
                      <div className="mini-bar" style={{height:'60%', width:'10%', background:'var(--amber)'}}></div>
                      <div className="mini-bar" style={{height:'55%', width:'10%', background:'var(--green)'}}></div>
                      <div className="mini-bar" style={{height:'40%', width:'10%', background:'var(--green)'}}></div>
                      <div className="mini-bar" style={{height:'45%', width:'10%', background:'var(--green)'}}></div>
                    </div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-label">Surgeries Performed</div>
                    <div className="stat-value">34</div>
                    <div className="stat-change up">↑ 8% vs last week</div>
                    <div className="mini-chart" style={{marginTop:'12px'}}>
                      <div className="mini-bar" style={{height:'20%', width:'10%', background:'var(--purple)'}}></div>
                      <div className="mini-bar" style={{height:'30%', width:'10%', background:'var(--purple)'}}></div>
                      <div className="mini-bar" style={{height:'50%', width:'10%', background:'var(--purple)'}}></div>
                      <div className="mini-bar" style={{height:'40%', width:'10%', background:'var(--purple)'}}></div>
                      <div className="mini-bar" style={{height:'80%', width:'10%', background:'var(--purple)'}}></div>
                      <div className="mini-bar" style={{height:'70%', width:'10%', background:'var(--purple)'}}></div>
                    </div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-label">Patient Satisfaction</div>
                    <div className="stat-value">4.8<span style={{fontSize:'16px', color:'var(--text3)'}}>/5</span></div>
                    <div className="stat-change up">↑ 0.2 vs last week</div>
                    <div className="mini-chart" style={{marginTop:'12px'}}>
                      <div className="mini-bar" style={{height:'90%', width:'10%', background:'var(--blue)'}}></div>
                      <div className="mini-bar" style={{height:'85%', width:'10%', background:'var(--blue)'}}></div>
                      <div className="mini-bar" style={{height:'88%', width:'10%', background:'var(--blue)'}}></div>
                      <div className="mini-bar" style={{height:'92%', width:'10%', background:'var(--blue)'}}></div>
                      <div className="mini-bar" style={{height:'95%', width:'10%', background:'var(--blue)'}}></div>
                      <div className="mini-bar" style={{height:'100%', width:'10%', background:'var(--blue)'}}></div>
                    </div>
                  </div>
                </div>

                <div className="grid-2">
                  <div className="card">
                    <div className="card-header"><div className="card-title">Department Performance Focus</div></div>
                    <table>
                      <thead><tr><th>Department</th><th>OPD</th><th>IPD</th><th>Wait Time</th></tr></thead>
                      <tbody>
                        <tr><td>Cardiology</td><td>412</td><td>68</td><td><span className="badge badge-amber">22 min</span></td></tr>
                        <tr><td>Orthopaedics</td><td>380</td><td>84</td><td><span className="badge badge-red">35 min</span></td></tr>
                        <tr><td>General Medicine</td><td>890</td><td>112</td><td><span className="badge badge-green">14 min</span></td></tr>
                        <tr><td>Paediatrics</td><td>450</td><td>25</td><td><span className="badge badge-green">12 min</span></td></tr>
                      </tbody>
                    </table>
                  </div>
                  <div className="card">
                    <div className="card-header"><div className="card-title">Patient Demographics</div></div>
                    <div style={{display:'flex', alignItems:'center', justifyContent:'center', height:'200px', color:'var(--text3)'}}>
                      [ Demographic Donut Chart Placeholder ]
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* PAGE: REVENUE */}
          <div className={`page ${currentPage === 'revenue' ? 'active' : ''}`}>
            {currentPage === 'revenue' && (
              <>
                <div className="page-header">
                  <div>
                    <div className="page-title">Revenue & Finance</div>
                    <div className="page-subtitle">Billing tracking and financial reports</div>
                  </div>
                  <button className="btn btn-outline" onClick={() => setCurrentPage('billing')}>Generate Invoice</button>
                </div>

                <div className="stats-grid">
                  <div className="stat-card" style={{background:'var(--teal-light)', borderColor:'#99f6e4'}}>
                    <div className="stat-icon" style={{color:'var(--teal)'}}>₹</div>
                    <div className="stat-label">Total Revenue (Weekly)</div>
                    <div className="stat-value" style={{color:'var(--teal-dark)'}}>₹12.4L</div>
                    <div className="stat-change up">↑ 14% vs last week</div>
                  </div>
                  <div className="stat-card" style={{background:'var(--red-light)', borderColor:'#fecaca'}}>
                    <div className="stat-icon" style={{color:'var(--red)'}}>!</div>
                    <div className="stat-label">Pending Dues</div>
                    <div className="stat-value" style={{color:'var(--red)'}}>₹2.8L</div>
                    <div className="stat-change down">14 Invoices pending</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-label">Insurance Claims</div>
                    <div className="stat-value">₹4.2L</div>
                    <div className="stat-change neutral">Processing</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-label">Operating Expenses</div>
                    <div className="stat-value">₹3.1L</div>
                    <div className="stat-change down">↓ 2% vs last week</div>
                  </div>
                </div>

                <div className="card">
                  <div className="card-header">
                    <div className="card-title">Recent Transactions</div>
                    <button className="btn btn-outline btn-sm">Export CSV</button>
                  </div>
                  <table>
                    <thead>
                      <tr><th>Txn ID</th><th>Date/Time</th><th>Patient</th><th>Category</th><th>Method</th><th>Amount</th><th>Status</th></tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td style={{color:'var(--text3)', fontSize:'12px'}}>TXN-90412</td><td>Today, 11:45 AM</td><td>Rajesh Kumar</td><td>IPD + Lab</td>
                        <td><span className="badge badge-blue">UPI</span></td>
                        <td style={{fontWeight:'600'}}>₹ 2,000</td>
                        <td><span className="badge badge-green">Success</span></td>
                      </tr>
                      <tr>
                        <td style={{color:'var(--text3)', fontSize:'12px'}}>TXN-90411</td><td>Today, 10:30 AM</td><td>Priya K.</td><td>OPD</td>
                        <td><span className="badge badge-gray">Cash</span></td>
                        <td style={{fontWeight:'600'}}>₹ 500</td>
                        <td><span className="badge badge-green">Success</span></td>
                      </tr>
                      <tr>
                        <td style={{color:'var(--text3)', fontSize:'12px'}}>TXN-90410</td><td>Today, 09:15 AM</td><td>Murugan S.</td><td>Pharmacy</td>
                        <td><span className="badge badge-amber">Card</span></td>
                        <td style={{fontWeight:'600'}}>₹ 1,450</td>
                        <td><span className="badge badge-green">Success</span></td>
                      </tr>
                      <tr>
                        <td style={{color:'var(--text3)', fontSize:'12px'}}>TXN-90409</td><td>Yest, 04:20 PM</td><td>Lakshmi Devi</td><td>IPD Final Bill</td>
                        <td><span className="badge badge-purple">Insurance</span></td>
                        <td style={{fontWeight:'600'}}>₹ 45,000</td>
                        <td><span className="badge badge-amber">Pending</span></td>
                      </tr>
                    </tbody>
                  </table>
                </div>

              </>
            )}
          </div>

          {/* PAGE: PATIENT VIEW */}
          <div className={`page ${currentPage === 'patient-home' ? 'active' : ''}`}>
            {currentPage === 'patient-home' && (
              <>
                <div className="page-header">
                  <div>
                    <div className="page-title">Welcome, Rajesh Kumar</div>
                    <div className="page-subtitle">Patient ID: VH-2024-00142 • Phone: +91 9876543210</div>
                  </div>
                  <button className="btn btn-outline" onClick={() => showToast('Profile settings selected')}>My Profile</button>
                </div>
                
                <div style={{background:'var(--blue-light)', border:'1px solid #bfdbfe', borderRadius:'10px', padding:'16px', marginBottom:'16px', display:'flex', alignItems:'center', gap:'16px'}}>
                  <span style={{fontSize:'24px'}}>🛎️</span>
                  <div>
                    <div style={{fontWeight:'600', color:'var(--blue-dark)'}}>Weekly Reminder: Next Follow-up</div>
                    <div style={{fontSize:'13px', color:'var(--text2)', marginTop:'4px'}}>You have an upcoming Cardiology follow-up with Dr. Aravind Kumar on <b>Friday, 29 Mar at 10:30 AM</b>. Don't forget to take your morning dose of Atorvastatin!</div>
                  </div>
                </div>

                <div className="grid-2">
                  <div className="card">
                    <div className="card-header"><div className="card-title">My Prescriptions</div></div>
                    <div style={{display:'flex', flexDirection:'column', gap:'12px'}}>
                      <div style={{padding:'12px', border:'1px solid var(--border)', borderRadius:'8px', background:'var(--surface)'}}>
                        <div style={{display:'flex', justifyContent:'space-between', marginBottom:'4px'}}>
                          <b style={{color:'var(--teal-dark)'}}>Amlodipine 5mg</b>
                          <span className="badge badge-amber">1-0-1</span>
                        </div>
                        <div style={{fontSize:'12px', color:'var(--text2)'}}>Take 1 tablet after breakfast and 1 after dinner.</div>
                        <label style={{display:'flex', alignItems:'center', gap:'6px', marginTop:'10px', fontSize:'13px', cursor:'pointer'}} onClick={(e) => { e.preventDefault(); showToast('Morning dose marked as taken!'); }}>
                          <input type="checkbox" /> Mark morning dose as taken
                        </label>
                      </div>
                      <div style={{padding:'12px', border:'1px solid var(--border)', borderRadius:'8px', background:'var(--surface)'}}>
                        <div style={{display:'flex', justifyContent:'space-between', marginBottom:'4px'}}>
                          <b style={{color:'var(--teal-dark)'}}>Atorvastatin 20mg</b>
                          <span className="badge badge-amber">0-0-1</span>
                        </div>
                        <div style={{fontSize:'12px', color:'var(--text2)'}}>Take 1 tablet after dinner.</div>
                        <label style={{display:'flex', alignItems:'center', gap:'6px', marginTop:'10px', fontSize:'13px', cursor:'pointer'}} onClick={(e) => { e.preventDefault(); showToast('Evening dose marked as taken!'); }}>
                          <input type="checkbox" /> Mark evening dose as taken
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="card">
                    <div className="card-header"><div className="card-title">My Follow-ups</div></div>
                    <div style={{borderLeft:'3px solid var(--teal)', paddingLeft:'12px', marginBottom:'16px'}}>
                      <div style={{fontWeight:'600', fontSize:'14px'}}>Dr. Aravind Kumar — Cardiology</div>
                      <div style={{fontSize:'12px', color:'var(--text3)'}}>29 Mar 2026, 10:30 AM</div>
                      <div style={{marginTop:'6px'}}><span className="badge badge-teal">Upcoming</span></div>
                    </div>
                    <div style={{borderLeft:'3px solid var(--border2)', paddingLeft:'12px'}}>
                      <div style={{fontWeight:'600', fontSize:'14px', color:'var(--text2)'}}>Dr. Meenakshi — General Medicine</div>
                      <div style={{fontSize:'12px', color:'var(--text3)'}}>05 Mar 2026, 11:00 AM</div>
                      <div style={{marginTop:'6px'}}><span className="badge badge-gray">Completed</span></div>
                    </div>
                    
                    <button className="btn btn-outline" style={{width:'100%', marginTop:'24px'}} onClick={() => showToast('Redirecting to appointment booking...')}>+ Book New Appointment</button>
                  </div>
                </div>
              </>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
