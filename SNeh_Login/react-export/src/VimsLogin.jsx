import React, { useState, useEffect, useRef } from 'react';
import './VimsLogin.css';

// You will need to import your actual image and video assets here in a real Vite/CRA setup.
// Example: import mainLogo from './assets/vignan_main_logo.png';
// For this component, we assume they are in the public folder or correctly mapped.

const VimsLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [gridVal1, setGridVal1] = useState('');
  const [gridVal2, setGridVal2] = useState('');
  
  const [expectedGrid1, setExpectedGrid1] = useState('');
  const [expectedGrid2, setExpectedGrid2] = useState('');
  
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const [usernameError, setUsernameError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [gridError, setGridError] = useState(false);
  
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  
  const [toastMessage, setToastMessage] = useState(null);
  const [modalContent, setModalContent] = useState(null);
  
  const videoRef = useRef(null);

  useEffect(() => {
    generateGridValues();
    if (videoRef.current) {
      videoRef.current.play().catch(e => console.log('Autoplay handled', e));
    }
  }, []);

  const generateGridValues = () => {
    setExpectedGrid1(String(Math.floor(100 + Math.random() * 900)));
    setExpectedGrid2(String(Math.floor(100 + Math.random() * 900)));
    setGridVal1('');
    setGridVal2('');
    setGridError(false);
  };

  const showToast = (message, type = 'info') => {
    setToastMessage({ message, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    let valid = true;

    if (!username.trim()) {
      setUsernameError(true);
      valid = false;
    }
    if (!password.trim()) {
      setPasswordError(true);
      valid = false;
    }
    
    if (gridVal1.length !== 3 || gridVal2.length !== 3) {
      setGridError(true);
      valid = false;
    }

    if (!valid) return;

    setIsLoading(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 900));
    setIsLoading(false);

    if (username.trim().toLowerCase() !== 'vignan') {
      setUsernameError(true);
      showToast('Invalid Employee Code. Only "vignan" is authorized.', 'danger');
      return;
    }

    const profile = {
      name: 'Dr. Astitwaa Roy',
      role: 'Chief Regulatory Compliance Officer',
      university: "Vignan's Foundation for Science, Technology & Research",
      initials: 'AR'
    };
    
    setUserProfile(profile);
    setIsLoggedIn(true);
    showToast(`Welcome back, ${profile.name}! VIMS session initialized.`, 'success');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserProfile(null);
    setPassword('');
    generateGridValues();
    showToast('Signed out successfully.', 'info');
  };

  return (
    <div className="vims-container">
      {/* Background Video */}
      <div className="video-container">
        <video ref={videoRef} autoPlay loop muted playsInline id="bg-video">
          <source src="/login_page_bg.mp4" type="video/mp4" />
        </video>
        <div className="video-overlay"></div>
      </div>

      {/* Header */}
      <header className="top-header">
        <div className="header-logo-container">
          <img src="/vignan_main_logo.png" alt="VIGNAN'S" className="header-main-logo" />
        </div>
        <div className="header-badges-container">
          {/* Add badge mapping here if needed */}
          <div className="badge-coin"><div className="coin-inner"><img src="/badge_naac.png" className="badge-img" alt="NAAC" /></div></div>
          <div className="badge-coin"><div className="coin-inner"><img src="/badge_nirf.png" className="badge-img" alt="NIRF" /></div></div>
          <div className="badge-coin"><div className="coin-inner"><img src="/badge_nba.png" className="badge-img" alt="NBA" /></div></div>
        </div>
      </header>

      {/* Main Content */}
      <main className="login-wrapper">
        {!isLoggedIn ? (
          <div className="login-card vims-card">
            <form onSubmit={handleLogin} className="login-form vims-form" noValidate>
              <div className="vims-row-two">
                <div className={`vims-field-group ${usernameError ? 'has-error' : ''}`}>
                  <label className="vims-label">EMPCODE</label>
                  <div className="vims-input-wrapper">
                    <input 
                      type="text" 
                      className="vims-input" 
                      placeholder="Enter Employee ID" 
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
                      placeholder="Enter Password" 
                      value={password} 
                      onChange={e => { setPassword(e.target.value); setPasswordError(false); }} 
                    />
                    <button type="button" className="toggle-password-btn" onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? 'Hide' : 'Show'}
                    </button>
                  </div>
                </div>
              </div>

              <div className={`vims-field-group vims-grid-group ${gridError ? 'has-error' : ''}`}>
                <div className="vims-grid-header">
                  <span className="vims-label">GRID VALUES</span>
                </div>
                <div className="vims-grid-row">
                  <div className="vims-grid-cell">
                    <span className="vims-grid-key">A1</span>
                    <input 
                      type="text" 
                      className="vims-input vims-grid-input" 
                      maxLength={3} 
                      placeholder="_ _ _" 
                      value={gridVal1}
                      onChange={e => { setGridVal1(e.target.value); setGridError(false); }}
                    />
                  </div>
                  <div className="vims-grid-cell">
                    <span className="vims-grid-key">B3</span>
                    <input 
                      type="text" 
                      className="vims-input vims-grid-input" 
                      maxLength={3} 
                      placeholder="_ _ _" 
                      value={gridVal2}
                      onChange={e => { setGridVal2(e.target.value); setGridError(false); }}
                    />
                  </div>
                </div>
                {gridError && <span className="error-msg">Please enter valid 3-digit grid values</span>}
              </div>

              <button type="submit" className="submit-btn vims-submit-btn" disabled={isLoading}>
                {isLoading ? 'Authenticating...' : 'SIGN IN TO WORKSPACE'}
              </button>
              
              <div className="vims-footer-links">
                <a href="#" className="vims-forgot" onClick={(e) => { e.preventDefault(); generateGridValues(); }}>Reset Grid Values</a>
              </div>
            </form>
          </div>
        ) : (
          <div className="dashboard-card">
            <h2>Welcome, {userProfile.name}</h2>
            <p>{userProfile.role}</p>
            <button onClick={handleLogout} className="btn-logout">Sign Out</button>
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
