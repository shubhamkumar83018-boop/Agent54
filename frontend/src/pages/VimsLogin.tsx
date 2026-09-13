import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './VimsLogin.css';

const VimsLogin: React.FC = () => {
  const navigate = useNavigate();
  const { login, signup, isAuthenticated, user, logout } = useAuth();

  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');

  // Form fields
  const [username, setUsername] = useState('vignan');
  const [password, setPassword] = useState('vignan123');
  const [name, setName] = useState('');
  const [role, setRole] = useState('faculty');

  // Security Grid values - strictly 3 digits as requested ("GRID sirf 3 digit ka")
  const [gridVal, setGridVal] = useState('123');
  const [gridKey, setGridKey] = useState('D4');

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Errors
  const [usernameError, setUsernameError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [nameError, setNameError] = useState(false);
  const [gridError, setGridError] = useState(false);

  const [toastMessage, setToastMessage] = useState<{ message: string; type: string } | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const showToast = (message: string, type: string = 'info') => {
    setToastMessage({ message, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const generateGridKey = () => {
    const letters = ['A', 'B', 'C', 'D', 'E'];
    const nums = ['1', '2', '3', '4', '5'];
    const r = letters[Math.floor(Math.random() * letters.length)] + nums[Math.floor(Math.random() * nums.length)];
    setGridKey(r);
  };

  useEffect(() => {
    generateGridKey();
    const params = new URLSearchParams(window.location.search);
    if (params.get('mode') === 'signup') {
      setAuthMode('signup');
    } else if (params.get('mode') === 'login') {
      setAuthMode('login');
    }
  }, []);

  const handleDemoSelect = (demoEmail: string, demoPass: string) => {
    setUsername(demoEmail);
    setPassword(demoPass);
    setGridVal('123');
    showToast(`Loaded demo credentials: ${demoEmail}`, 'info');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let valid = true;

    if (authMode === 'signup' && !name.trim()) {
      setNameError(true);
      valid = false;
    }

    if (!username.trim()) {
      setUsernameError(true);
      valid = false;
    }

    // "password kuch bhi" -> if blank, default to 'vignan123' so login seamlessly works
    const activePassword = password.trim() || 'vignan123';

    if (authMode === 'login') {
      // "GRID sirf 3 digit ka" -> must be exactly 3 numeric digits
      if (!/^\d{3}$/.test(gridVal.trim())) {
        setGridError(true);
        showToast('GRID sirf 3 digit ka hona chahiye (Enter 3 digits, e.g. 123)', 'danger');
        valid = false;
      }
    }

    if (!valid) return;

    setIsLoading(true);

    try {
      if (authMode === 'login') {
        const res = await login(username.trim(), activePassword);
        if (!res.success) {
          throw new Error(res.error || 'Invalid credentials');
        }
        showToast('Authentication successful! Loading workspace...', 'success');
        setTimeout(() => {
          navigate('/dashboard');
        }, 800);
      } else {
        const res = await signup(name, username, activePassword, role);
        if (!res.success) {
          throw new Error(res.error || 'Registration failed');
        }
        showToast(`Account created successfully! Welcome, ${name}.`, 'success');
        setTimeout(() => {
          navigate('/dashboard');
        }, 800);
      }
    } catch (error: any) {
      setUsernameError(true);
      setPasswordError(true);
      showToast(error.message || 'Authentication error', 'danger');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="vims-container">
      {/* Background Video */}
      <div className="video-container">
        <video ref={videoRef} autoPlay loop muted playsInline preload="auto" id="bg-video">
          <source src="/login_page_bg.mp4" type="video/mp4" />
          <source src="/video.mp4" type="video/mp4" />
        </video>
        <div className="video-overlay"></div>
      </div>

      {/* Header */}
      <header className="top-header">
        <div className="header-logo-container" onClick={() => navigate('/dashboard')} style={{ cursor: 'pointer' }}>
          <img src="/vignan_main_logo.png" alt="VIGNAN'S" className="header-main-logo" />
        </div>
        <div className="header-badges-container">
          <div className="badge-coin" title="NAAC A+ Accredited"><div className="coin-inner"><img src="/badge_naac.png" className="badge-img" alt="NAAC" /></div></div>
          <div className="badge-coin" title="NIRF Ranked"><div className="coin-inner"><img src="/badge_nirf.png" className="badge-img" alt="NIRF" /></div></div>
          <div className="badge-coin" title="NBA Accredited"><div className="coin-inner"><img src="/badge_nba.png" className="badge-img" alt="NBA" /></div></div>
          <div className="badge-coin" title="AICTE Approved"><div className="coin-inner"><img src="/badge_aicte.png" className="badge-img" alt="AICTE" /></div></div>
          <div className="badge-coin" title="UGC CARE Listed"><div className="coin-inner"><img src="/badge_ugccare.png" className="badge-img" alt="UGC CARE" /></div></div>
          <div className="badge-coin" title="Institution's Innovation Council"><div className="coin-inner"><img src="/badge_iic.png" className="badge-img" alt="IIC" /></div></div>
          <div className="badge-coin" title="ABET Accredited"><div className="coin-inner"><img src="/badge_abet.png" className="badge-img" alt="ABET" /></div></div>
        </div>
      </header>

      {/* Main Content */}
      <main className="login-wrapper">
        {isAuthenticated && user ? (
          <div className="login-card vims-card text-center" style={{ maxWidth: '460px', padding: '36px 32px' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'linear-gradient(135deg, #0062ff, #00d2ff)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', fontWeight: 'bold', margin: '0 auto 16px', boxShadow: '0 8px 24px rgba(0,98,255,0.3)' }}>
              {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#0b1528', marginBottom: '4px' }}>Already Signed In</h2>
            <p style={{ fontSize: '13px', color: '#475569', marginBottom: '8px' }}>Active Session: <strong>{user.name}</strong> ({user.email})</p>
            <div style={{ display: 'inline-block', padding: '4px 12px', background: '#eff6ff', color: '#1d4ed8', borderRadius: '20px', fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '24px' }}>
              Role: {user.role || 'Admin'}
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button 
                type="button" 
                onClick={() => navigate('/dashboard')} 
                className="submit-btn vims-submit-btn" 
                style={{ flex: 1, margin: 0 }}
              >
                Go to Dashboard
              </button>
              <button 
                type="button" 
                onClick={logout} 
                style={{ flex: 1, padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0', background: '#fff', color: '#ef4444', fontWeight: '700', cursor: 'pointer' }}
              >
                Sign Out
              </button>
            </div>
          </div>
        ) : (
          <div className="login-card vims-card" style={{ maxWidth: '500px' }}>
            {/* Mode Switcher Tabs */}
            <div style={{ display: 'flex', background: '#f1f5f9', borderRadius: '12px', padding: '4px', marginBottom: '20px' }}>
              <button
                type="button"
                onClick={() => setAuthMode('login')}
                style={{
                  flex: 1,
                  padding: '10px 16px',
                  borderRadius: '10px',
                  border: 'none',
                  background: authMode === 'login' ? '#ffffff' : 'transparent',
                  color: authMode === 'login' ? '#0062ff' : '#64748b',
                  fontWeight: '800',
                  fontSize: '12px',
                  letterSpacing: '0.05em',
                  cursor: 'pointer',
                  boxShadow: authMode === 'login' ? '0 2px 8px rgba(0,0,0,0.06)' : 'none',
                  transition: 'all 0.2s ease',
                }}
              >
                SIGN IN
              </button>
              <button
                type="button"
                onClick={() => setAuthMode('signup')}
                style={{
                  flex: 1,
                  padding: '10px 16px',
                  borderRadius: '10px',
                  border: 'none',
                  background: authMode === 'signup' ? '#ffffff' : 'transparent',
                  color: authMode === 'signup' ? '#0062ff' : '#64748b',
                  fontWeight: '800',
                  fontSize: '12px',
                  letterSpacing: '0.05em',
                  cursor: 'pointer',
                  boxShadow: authMode === 'signup' ? '0 2px 8px rgba(0,0,0,0.06)' : 'none',
                  transition: 'all 0.2s ease',
                }}
              >
                CREATE ACCOUNT
              </button>
            </div>

            <form onSubmit={handleSubmit} className="login-form vims-form" noValidate>
              {/* Sign Up Name Field */}
              {authMode === 'signup' && (
                <div className={`vims-field-group ${nameError ? 'has-error' : ''}`} style={{ marginBottom: '14px' }}>
                  <label className="vims-label">FULL NAME</label>
                  <div className="vims-input-wrapper">
                    <input 
                      type="text" 
                      className="vims-input" 
                      placeholder="e.g. Dr. Rajesh Sharma" 
                      value={name} 
                      onChange={e => { setName(e.target.value); setNameError(false); }} 
                    />
                  </div>
                </div>
              )}

              <div className="vims-row-two">
                <div className={`vims-field-group ${usernameError ? 'has-error' : ''}`}>
                  <label className="vims-label">
                    {authMode === 'login' ? 'USER ID / INSTITUTIONAL ID' : 'OFFICIAL EMAIL'}
                  </label>
                  <div className="vims-input-wrapper">
                    <input 
                      type="text" 
                      className="vims-input" 
                      placeholder={authMode === 'login' ? 'vignan' : 'user@vignan.ac.in'} 
                      value={username} 
                      onChange={e => { setUsername(e.target.value); setUsernameError(false); }} 
                    />
                  </div>
                </div>

                <div className={`vims-field-group ${passwordError ? 'has-error' : ''}`}>
                  <label className="vims-label">PASSWORD</label>
                  <div className="vims-input-wrapper">
                    <input 
                      type={showPassword ? 'text' : 'password'} 
                      className="vims-input" 
                      placeholder="Any password / vignan" 
                      value={password} 
                      onChange={e => { setPassword(e.target.value); setPasswordError(false); }} 
                    />
                    <button type="button" className="toggle-password-btn" onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? 'Hide' : 'Show'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Role selection for Sign Up */}
              {authMode === 'signup' && (
                <div className="vims-field-group" style={{ marginBottom: '16px' }}>
                  <label className="vims-label">ASSIGNED ROLE</label>
                  <div className="vims-input-wrapper">
                    <select 
                      className="vims-input"
                      value={role} 
                      onChange={e => setRole(e.target.value)}
                      style={{ cursor: 'pointer', outline: 'none' }}
                    >
                      <option value="faculty">Faculty / Department Member</option>
                      <option value="auditor">Internal / External Auditor</option>
                      <option value="admin">Institutional Administrator</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Security Grid in Login Mode - Strictly 3 digits */}
              {authMode === 'login' && (
                <div className={`vims-field-group vims-grid-group ${gridError ? 'has-error' : ''}`}>
                  <div className="vims-grid-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span className="vims-label" style={{ margin: 0, display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                      </svg>
                      SECURITY GRID CHALLENGE
                    </span>
                    <span style={{ fontSize: '11px', color: '#0062ff', fontWeight: '800' }}>3-Digit Code (Demo: 123)</span>
                  </div>
                  <div className="vims-grid-row" style={{ display: 'flex', justifyContent: 'center', marginTop: '6px' }}>
                    <div className="vims-grid-cell" style={{ width: '100%', maxWidth: '280px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span className="vims-grid-key" style={{ minWidth: '40px', textAlign: 'center' }}>{gridKey}</span>
                      <input 
                        type="text" 
                        inputMode="numeric"
                        className="vims-input vims-grid-input" 
                        maxLength={3} 
                        placeholder="1 2 3" 
                        value={gridVal}
                        onChange={e => { 
                          const val = e.target.value.replace(/\D/g, '').slice(0, 3);
                          setGridVal(val); 
                          setGridError(false); 
                        }}
                      />
                    </div>
                  </div>
                  {gridError && (
                    <p style={{ color: '#ef4444', fontSize: '11px', marginTop: '6px', textAlign: 'center', fontWeight: '600' }}>
                      GRID sirf 3 digit ka hona chahiye (Enter 3-digit code)
                    </p>
                  )}
                </div>
              )}

              {/* Submit Button */}
              <button type="submit" className="submit-btn vims-submit-btn" disabled={isLoading} style={{ marginTop: '14px' }}>
                {isLoading 
                  ? 'Processing...' 
                  : (authMode === 'login' ? 'SIGN IN TO WORKSPACE' : 'CREATE INSTITUTIONAL ACCOUNT')
                }
              </button>

              {/* Demo Credentials Chips */}
              {authMode === 'login' && (
                <div style={{ marginTop: '16px', background: 'rgba(0, 98, 255, 0.04)', border: '1px dashed #bfdbfe', borderRadius: '10px', padding: '10px' }}>
                  <p style={{ fontSize: '10px', fontWeight: '800', color: '#1e40af', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px', textAlign: 'center' }}>
                    Quick Demo Credentials
                  </p>
                  <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap' }}>
                    <button
                      type="button"
                      onClick={() => handleDemoSelect('vignan', 'vignan123')}
                      style={{
                        padding: '6px 12px',
                        background: '#eff6ff',
                        border: '1.5px solid #3b82f6',
                        borderRadius: '6px',
                        fontSize: '11px',
                        fontWeight: '800',
                        color: '#1d4ed8',
                        cursor: 'pointer',
                        boxShadow: '0 2px 4px rgba(59, 130, 246, 0.15)',
                      }}
                    >
                      ⚡ vignan (Default)
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDemoSelect('admin@vignan.ac.in', 'password123')}
                      style={{
                        padding: '6px 12px',
                        background: '#ffffff',
                        border: '1px solid #93c5fd',
                        borderRadius: '6px',
                        fontSize: '11px',
                        fontWeight: '700',
                        color: '#1d4ed8',
                        cursor: 'pointer',
                      }}
                    >
                      ⚡ Super Admin
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDemoSelect('auditor@naac.gov.in', 'password123')}
                      style={{
                        padding: '6px 12px',
                        background: '#ffffff',
                        border: '1px solid #93c5fd',
                        borderRadius: '6px',
                        fontSize: '11px',
                        fontWeight: '700',
                        color: '#1d4ed8',
                        cursor: 'pointer',
                      }}
                    >
                      ⚡ NAAC Auditor
                    </button>
                  </div>
                </div>
              )}

              {/* Guest Exploration Option */}
              <div style={{ marginTop: '18px', textAlign: 'center', borderTop: '1px solid #f1f5f9', paddingTop: '14px' }}>
                <button
                  type="button"
                  onClick={() => navigate('/dashboard')}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#475569',
                    fontSize: '12px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    textDecoration: 'underline',
                  }}
                >
                  👁️ Continue as Guest (Public Dashboard Overview)
                </button>
              </div>
            </form>
          </div>
        )}
      </main>

      {/* Toasts */}
      {toastMessage && (
        <div className="toast-container">
          <div className={`toast toast-${toastMessage.type}`}>
            {toastMessage.message}
          </div>
        </div>
      )}
    </div>
  );
};

export default VimsLogin;
