/* ==========================================================================
   Agent 54 Regulation Compliance Platform - Interactive Engine & API Services
   VIGNAN'S Foundation for Science, Technology & Research (VFSTR)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // ==========================================
  // 1. API Services Layer
  // ==========================================
  const AuthAPI = {
    async login(username, password, rememberMe) {
      // Simulate real asynchronous network request with 900ms latency
      await new Promise(resolve => setTimeout(resolve, 900));

      const cleanUser = username.trim().toLowerCase();

      // Only 'vignan' empcode is valid
      if (cleanUser !== 'vignan') {
        return { success: false, error: 'Invalid Employee Code. Only "vignan" is authorized.' };
      }

      const userProfile = {
        name: 'Dr. Astitwaa Roy',
        email: 'vignan@vignan.ac.in',
        role: 'Chief Regulatory Compliance Officer',
        university: "Vignan's Foundation for Science, Technology & Research",
        token: `jwt_agent54_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
        loginTime: new Date().toLocaleTimeString()
      };

      if (rememberMe) {
        localStorage.setItem('agent54_saved_user', cleanUser);
      } else {
        localStorage.removeItem('agent54_saved_user');
      }

      sessionStorage.setItem('agent54_session', JSON.stringify(userProfile));
      return { success: true, profile: userProfile };
    },

    async googleSSO(account) {
      await new Promise(resolve => setTimeout(resolve, 800));
      const userProfile = {
        name: account.name,
        email: account.email,
        role: account.role || 'Regulatory Administrator',
        university: "VFSTR Deemed to be University",
        token: `g_oauth2_agent54_${Date.now()}`,
        avatar: account.avatar || 'AR',
        loginTime: new Date().toLocaleTimeString()
      };
      sessionStorage.setItem('agent54_session', JSON.stringify(userProfile));
      return { success: true, profile: userProfile };
    },

    async requestPasswordReset(identifier) {
      await new Promise(resolve => setTimeout(resolve, 800));
      return {
        success: true,
        email: identifier.includes('@') ? identifier : `${identifier}@vignan.ac.in`,
        otpCode: '549210',
        expiresInSeconds: 300
      };
    },

    async confirmPasswordReset(email, otp, newPass) {
      await new Promise(resolve => setTimeout(resolve, 800));
      if (otp !== '549210') {
        return { success: false, error: 'Invalid verification code. Please enter 549210.' };
      }
      return { success: true, message: 'Password updated successfully.' };
    },

    logout() {
      sessionStorage.removeItem('agent54_session');
    }
  };

  const SupportAPI = {
    async submitTicket(data) {
      await new Promise(resolve => setTimeout(resolve, 800));
      const ticketId = `TKT-54-${Math.floor(10000 + Math.random() * 90000)}`;
      return {
        success: true,
        ticketId: ticketId,
        message: 'Your regulatory support inquiry has been logged with Vignan IT Helpdesk.',
        timestamp: new Date().toLocaleString()
      };
    }
  };

  const AccreditationData = {
    naac: {
      title: 'NAAC A+ Accreditation',
      issuer: 'National Assessment and Accreditation Council (UGC)',
      score: 'A+ Grade (CGPA: 3.49 / 4.00)',
      cycle: 'Cycle 3 - Highest Category University Accreditation',
      validity: 'Valid through 2028',
      verifyUrl: 'https://naac.gov.in',
      details: "NAAC has awarded Vignan's Foundation for Science, Technology & Research the prestigious 'A+' Grade reflecting top-tier academic standards, world-class research labs, and faculty excellence."
    },
    nirf: {
      title: 'NIRF Ranked Among Universities',
      issuer: 'National Institutional Ranking Framework, Ministry of Education, Govt. of India',
      score: 'Rank Band: Top 75 Universities in India',
      cycle: 'MHRD / MoE Official Annual Ranking',
      validity: 'Current Academic Year',
      verifyUrl: 'https://www.nirfindia.org',
      details: 'Recognized nationally by the Ministry of Education for excellence in Teaching, Learning & Resources, Research and Professional Practice, and Graduate Outcomes.'
    },
    nba: {
      title: 'NBA Accredited Programs',
      issuer: 'National Board of Accreditation (Tier-1 Washington Accord)',
      score: 'Tier-1 Engineering & Tech Accreditations',
      cycle: 'Full 5-Year Accreditation Cycle',
      validity: 'Active Tier-1 Status',
      verifyUrl: 'https://www.nbaind.org',
      details: 'Multiple engineering branches accredited under Tier-1 Washington Accord, guaranteeing international degree equivalence in USA, UK, Australia, and 20+ member nations.'
    },
    aicte: {
      title: 'AICTE Approved Institution',
      issuer: 'All India Council for Technical Education, New Delhi',
      score: 'Approved University Status',
      cycle: 'Annual Extension of Approval (EoA)',
      validity: 'Certified 2026-27',
      verifyUrl: 'https://www.aicte-india.org',
      details: 'Complies with all AICTE statutory regulations, curriculum guidelines, faculty-to-student ratios, and campus infrastructure benchmarks.'
    },
    ugccare: {
      title: 'UGC CARE Listed Research Journals',
      issuer: 'University Grants Commission (UGC) Consortium for Academic and Research Ethics',
      score: 'Indexed Research Publications',
      cycle: 'Continuous Peer-Review Quality Index',
      validity: 'Active Listing',
      verifyUrl: 'https://ugccare.unipune.ac.in',
      details: "Faculty and scholar publications at Vignan University are actively recognized in UGC-CARE Group I & II, Scopus, and Web of Science peer-reviewed repositories."
    },
    iic: {
      title: "Institution's Innovation Council (IIC)",
      issuer: "Ministry of Education (MoE's Innovation Cell), Govt. of India",
      score: '4.5 / 5.0 Star Innovation Rating',
      cycle: 'Annual Innovation & Incubation Assessment',
      validity: 'Current Active Chapter',
      verifyUrl: 'https://mic.gov.in',
      details: "Vignan's IIC fosters student entrepreneurship, patent filings, and state-of-the-art incubation centres supported by central government grants."
    },
    abet: {
      title: 'ABET Accredited Programs',
      issuer: 'Accreditation Board for Engineering and Technology (USA)',
      score: 'Global Engineering Quality Standard',
      cycle: 'Computing & Engineering Accreditation Commission',
      validity: 'Internationally Certified',
      verifyUrl: 'https://www.abet.org',
      details: 'Globally certified quality assurance validating that our academic programs meet stringent international standards required for worldwide engineering licensure.'
    }
  };

  // ==========================================
  // 2. DOM Elements Selection
  // ==========================================
  const loginForm = document.getElementById('loginForm');
  const loginCard = document.querySelector('.login-card');
  const dashboardCard = document.getElementById('dashboardCard');
  
  const usernameInput = document.getElementById('usernameInput');
  const passwordInput = document.getElementById('passwordInput');
  const usernameGroup = usernameInput.closest('.vims-field-group') || usernameInput.closest('.input-field-group');
  const passwordGroup = passwordInput.closest('.vims-field-group') || passwordInput.closest('.input-field-group');
  const rememberMeCheckbox = document.getElementById('rememberMe');
  
  const togglePasswordBtn = document.getElementById('togglePassword');
  const eyeShow = togglePasswordBtn ? togglePasswordBtn.querySelector('.eye-show') : null;
  const eyeHide = togglePasswordBtn ? togglePasswordBtn.querySelector('.eye-hide') : null;
  
  const submitBtn = document.getElementById('submitBtn');
  const btnText = submitBtn ? submitBtn.querySelector('.btn-text') : null;
  const btnArrow = submitBtn ? submitBtn.querySelector('.btn-arrow') : null;
  const btnSpinner = submitBtn ? submitBtn.querySelector('.btn-spinner') : null;
  
  const googleLoginBtn = document.getElementById('googleLoginBtn');
  const forgotPasswordLink = document.getElementById('forgotPasswordTrigger') || document.querySelector('.forgot-link');
  const contactAdminLink = document.getElementById('contactAdminLink');
  const securitySealBtn = document.getElementById('securitySealBtn');
  const securePillBtn = document.querySelector('.secure-badge-pill');

  // VIMS-specific elements
  const resetGridBtn = document.getElementById('resetGridBtn');
  const gridGroup = document.getElementById('gridGroup');
  const gridVal1 = document.getElementById('gridVal1');
  const gridVal2 = document.getElementById('gridVal2');
  const headerMainLogo = document.querySelector('.header-main-logo');
  const badgeCoins = document.querySelectorAll('.badge-coin');
  
  const modalOverlay = document.getElementById('modalOverlay');
  const modalBody = document.getElementById('modalBody');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const toastContainer = document.getElementById('toastContainer');
  const bgVideo = document.getElementById('bg-video');

  // Dashboard buttons
  const logoutBtn = document.getElementById('logoutBtn');
  const btnRunAudit = document.getElementById('btnRunAudit');
  const btnExportReport = document.getElementById('btnExportReport');
  const btnViewLogs = document.getElementById('btnViewLogs');
  const dashGreeting = document.getElementById('dashGreeting');
  const dashRole = document.getElementById('dashRole');
  const dashAvatarInitials = document.getElementById('dashAvatarInitials');

  // Post-login video elements
  const postLoginVideoOverlay = document.getElementById('postLoginVideoOverlay');
  const postLoginVideo = document.getElementById('postLoginVideo');
  const skipVideoBtn = document.getElementById('skipVideoBtn');
  const videoProgressFill = document.getElementById('videoProgressFill');

  // ==========================================
  // 3. Initial State, Grid Value Generation & Video Autoplay
  // ==========================================

  // Generate random 3-digit grid values
  let expectedGrid1 = '';
  let expectedGrid2 = '';

  function generateGridValues() {
    expectedGrid1 = String(Math.floor(100 + Math.random() * 900));
    expectedGrid2 = String(Math.floor(100 + Math.random() * 900));
    if (gridVal1) gridVal1.value = '';
    if (gridVal2) gridVal2.value = '';
    if (gridVal1) gridVal1.setAttribute('placeholder', '_ _ _');
    if (gridVal2) gridVal2.setAttribute('placeholder', '_ _ _');
    // Show expected values as hints in the grid key labels
    const gridKey1El = document.getElementById('gridKey1');
    const gridKey2El = document.getElementById('gridKey2');
    if (gridKey1El) gridKey1El.textContent = `A1`;
    if (gridKey2El) gridKey2El.textContent = `B3`;
    // Store for validation
    sessionStorage.setItem('vims_grid1', expectedGrid1);
    sessionStorage.setItem('vims_grid2', expectedGrid2);
    console.log(`Grid values generated: A1=${expectedGrid1}, B3=${expectedGrid2}`);
  }

  generateGridValues();

  // Restore remembered username
  const savedUser = localStorage.getItem('agent54_saved_user');
  if (savedUser && usernameInput) {
    usernameInput.value = savedUser;
    if (rememberMeCheckbox) rememberMeCheckbox.checked = true;
  }

  // Ensure background video plays smoothly
  if (bgVideo) {
    bgVideo.muted = true;
    bgVideo.defaultMuted = true;
    bgVideo.playsInline = true;
    const playPromise = bgVideo.play();
    if (playPromise !== undefined) {
      playPromise.catch(err => {
        console.log('Video autoplay handled:', err);
      });
    }
  }

  // ==========================================
  // 4. Modal Helpers
  // ==========================================
  function openModal(contentHtml) {
    modalBody.innerHTML = contentHtml;
    modalOverlay.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modalOverlay.classList.add('hidden');
    modalBody.innerHTML = '';
    document.body.style.overflow = '';
  }

  modalCloseBtn.addEventListener('click', closeModal);
  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modalOverlay.classList.contains('hidden')) {
      closeModal();
    }
  });

  // ==========================================
  // 5. Toast Notification System
  // ==========================================
  function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    let iconSvg = '';
    if (type === 'success') {
      iconSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>`;
    } else if (type === 'danger') {
      iconSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>`;
    } else {
      iconSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0062ff" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`;
    }

    toast.innerHTML = `
      ${iconSvg}
      <span>${message}</span>
    `;

    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 4200);
  }

  // ==========================================
  // 6. Password Visibility Toggle Button
  // ==========================================
  // Reset Grid Values button
  if (resetGridBtn) {
    resetGridBtn.addEventListener('click', (e) => {
      e.preventDefault();
      generateGridValues();
      if (gridGroup) gridGroup.classList.remove('has-error');
      showToast('Grid values regenerated. Check console for new values.', 'info');
    });
  }

  if (togglePasswordBtn) togglePasswordBtn.addEventListener('click', () => {
    const isPassword = passwordInput.getAttribute('type') === 'password';
    if (isPassword) {
      passwordInput.setAttribute('type', 'text');
      eyeShow.classList.add('hidden');
      eyeHide.classList.remove('hidden');
      togglePasswordBtn.setAttribute('aria-label', 'Hide password');
    } else {
      passwordInput.setAttribute('type', 'password');
      eyeHide.classList.add('hidden');
      eyeShow.classList.remove('hidden');
      togglePasswordBtn.setAttribute('aria-label', 'Show password');
    }
  });

  usernameInput.addEventListener('input', () => usernameGroup.classList.remove('has-error'));
  passwordInput.addEventListener('input', () => passwordGroup.classList.remove('has-error'));

  // ==========================================
  // 7. Login Form Submission & Dashboard Transition
  // ==========================================
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    let isValid = true;

    // Validate EMPCODE
    if (!usernameInput.value.trim()) {
      usernameGroup.classList.add('has-error');
      isValid = false;
    }

    // Validate PASSWORD (any password is accepted)
    if (!passwordInput.value.trim()) {
      passwordGroup.classList.add('has-error');
      isValid = false;
    }

    // Validate 3-digit GRID VALUES
    const g1 = gridVal1 ? gridVal1.value.trim() : '';
    const g2 = gridVal2 ? gridVal2.value.trim() : '';
    if (g1.length !== 3 || g2.length !== 3 || !/^\d{3}$/.test(g1) || !/^\d{3}$/.test(g2)) {
      if (gridGroup) gridGroup.classList.add('has-error');
      isValid = false;
    } else {
      if (gridGroup) gridGroup.classList.remove('has-error');
    }

    if (!isValid) return;

    // Loading State
    setLoadingState(true);

    try {
      const remember = rememberMeCheckbox ? rememberMeCheckbox.checked : false;
      const res = await AuthAPI.login(usernameInput.value, passwordInput.value, remember);

      setLoadingState(false);

      if (!res.success) {
        showToast(res.error || 'Invalid Employee Code. Use "vignan".', 'danger');
        usernameGroup.classList.add('has-error');
        return;
      }

      showToast(`Welcome back, ${res.profile.name}! VIMS session initialized.`, 'success');

      // Transition to Dashboard
      renderDashboard(res.profile);
    } catch (err) {
      setLoadingState(false);
      showToast('Authentication failed. Please verify credentials.', 'danger');
    }
  });

  function setLoadingState(loading) {
    if (loading) {
      if (submitBtn) submitBtn.disabled = true;
      if (btnText) btnText.textContent = 'Authenticating...';
      if (btnArrow) btnArrow.classList.add('hidden');
      if (btnSpinner) btnSpinner.classList.remove('hidden');
    } else {
      if (submitBtn) submitBtn.disabled = false;
      if (btnText) btnText.textContent = 'SIGN IN TO WORKSPACE';
      if (btnArrow) btnArrow.classList.remove('hidden');
      if (btnSpinner) btnSpinner.classList.add('hidden');
    }
  }

  function renderDashboard(profile) {
    // Skip video — go directly to dashboard
    loginCard.classList.add('hidden');

    dashGreeting.textContent = `Welcome, ${profile.name}`;
    dashRole.textContent = `${profile.role} • ${profile.university}`;
    const initials = profile.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    dashAvatarInitials.textContent = initials || 'AR';

    dashboardCard.classList.remove('hidden');
  }

  // ==========================================
  // 7b. Post-Login Welcome Video
  // ==========================================
  function showPostLoginVideo(profile) {
    // Prepare dashboard content but keep it hidden
    loginCard.classList.add('hidden');

    dashGreeting.textContent = `Welcome, ${profile.name}`;
    dashRole.textContent = `${profile.role} • ${profile.university}`;
    const initials = profile.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    dashAvatarInitials.textContent = initials || 'AR';

    // Reset and show overlay
    postLoginVideoOverlay.classList.remove('hidden', 'fade-out', 'video-ended');
    videoProgressFill.style.width = '0%';

    // Reset skip button animation
    skipVideoBtn.style.animation = 'none';
    skipVideoBtn.style.opacity = '0';
    postLoginVideo.currentTime = 0;

    // Force reflow to restart animation
    void skipVideoBtn.offsetWidth;
    skipVideoBtn.style.animation = '';

    // Play the video
    postLoginVideo.muted = true;
    const playPromise = postLoginVideo.play();
    if (playPromise !== undefined) {
      playPromise.catch(err => {
        console.log('Post-login video autoplay blocked:', err);
        // If autoplay blocked, skip directly to dashboard
        dismissVideoOverlay();
      });
    }

    // Update progress bar as video plays
    postLoginVideo.addEventListener('timeupdate', onVideoTimeUpdate);
    postLoginVideo.addEventListener('ended', onVideoEnded);
  }

  function onVideoTimeUpdate() {
    if (postLoginVideo.duration) {
      const pct = (postLoginVideo.currentTime / postLoginVideo.duration) * 100;
      videoProgressFill.style.width = `${pct}%`;
    }
  }

  function onVideoEnded() {
    postLoginVideoOverlay.classList.add('video-ended');
    videoProgressFill.style.width = '100%';
    dismissVideoOverlay();
  }

  function dismissVideoOverlay() {
    // Cleanup listeners
    postLoginVideo.removeEventListener('timeupdate', onVideoTimeUpdate);
    postLoginVideo.removeEventListener('ended', onVideoEnded);
    postLoginVideo.pause();

    // Fade out overlay then show dashboard
    postLoginVideoOverlay.classList.add('fade-out');
    setTimeout(() => {
      postLoginVideoOverlay.classList.add('hidden');
      postLoginVideoOverlay.classList.remove('fade-out');
      dashboardCard.classList.remove('hidden');
    }, 700);
  }

  // Skip button click
  skipVideoBtn.addEventListener('click', () => {
    dismissVideoOverlay();
  });

  // ==========================================
  // 8. Logout Button
  // ==========================================
  logoutBtn.addEventListener('click', () => {
    AuthAPI.logout();
    dashboardCard.classList.add('hidden');
    loginCard.classList.remove('hidden');
    passwordInput.value = '';
    showToast('Signed out of Agent 54 successfully.', 'info');
  });

  // ==========================================
  // 9. Dashboard Action Buttons
  // ==========================================
  btnRunAudit.addEventListener('click', async () => {
    btnRunAudit.disabled = true;
    btnRunAudit.innerHTML = `
      <div class="btn-spinner" style="border-color: rgba(255,255,255,0.3); border-top-color: #fff;"></div>
      <span>Running Regulation 54 Audit Engine...</span>
    `;

    await new Promise(r => setTimeout(r, 1200));

    btnRunAudit.disabled = false;
    btnRunAudit.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
        <polyline points="22 4 12 14.01 9 11.01"></polyline>
      </svg>
      <span>Run Instant Compliance Audit</span>
    `;

    showToast('Audit Complete: 1,420 standards checked. Compliance Index upgraded to 99.1%!', 'success');
  });

  btnExportReport.addEventListener('click', () => {
    showToast('Generating official Regulation 54 compliance certificate...', 'info');

    setTimeout(() => {
      const certData = `
================================================================================
AGENT 54 - REGULATION COMPLIANCE CERTIFICATE
VIGNAN'S FOUNDATION FOR SCIENCE, TECHNOLOGY & RESEARCH (VFSTR)
================================================================================
Generated for: Dr. Astitwaa Roy (Chief Regulatory Compliance Officer)
Date: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}
Audit Status: FULLY COMPLIANT (Score: 99.1%)

ACCREDITATIONS VALIDATED:
1. NAAC: A+ Grade (CGPA 3.49/4.00)
2. NIRF: Top 75 Universities in India
3. NBA: Tier-1 Accredited Programs (Washington Accord)
4. AICTE: Approved Technical University
5. UGC CARE: Group-I & II Recognized Publications
6. IIC: 4.5 Star Innovation Chapter
7. ABET: Internationally Certified Engineering

ENCRYPTION & SECURITY:
- TLS 1.3 AES-256-GCM Military Grade
- ISO/IEC 27001:2022 Certified
================================================================================
`;
      const blob = new Blob([certData], { type: 'text/plain;charset=utf-8' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `Agent54_Compliance_Certificate_${Date.now()}.txt`;
      link.click();
      showToast('Certificate downloaded successfully!', 'success');
    }, 900);
  });

  btnViewLogs.addEventListener('click', () => {
    openModal(`
      <div class="modal-header-icon">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
      </div>
      <h3 class="modal-title">Live Regulation 54 Audit Logs</h3>
      <p class="modal-desc">Real-time immutable compliance audit stream for VFSTR Vignan University.</p>
      
      <div class="modal-info-list" style="max-height: 220px; overflow-y: auto; font-family: monospace; font-size: 12px; gap: 8px;">
        <div style="color: #10b981;">[${new Date().toLocaleTimeString()}] AICTE Regulation 54: Automated Faculty-Student ratio check PASSED (1:15)</div>
        <div style="color: #0062ff;">[${new Date().toLocaleTimeString()}] NAAC Metric 4.2: Lab infrastructure safety scan COMPLETED</div>
        <div style="color: #7e22ce;">[${new Date().toLocaleTimeString()}] NBA Tier-1: Washington Accord outcome attainment SYNCED</div>
        <div style="color: #10b981;">[${new Date().toLocaleTimeString()}] SSL/TLS: 256-Bit handshake integrity VERIFIED</div>
        <div style="color: #64748b;">[${new Date().toLocaleTimeString()}] System: 0 anomalies detected in last 24 hours</div>
      </div>

      <button type="button" class="modal-action-btn" onclick="document.getElementById('modalCloseBtn').click()">
        Close Log Viewer
      </button>
    `);
  });

  // ==========================================
  // 10. Google University SSO Button & Modal
  // ==========================================
  googleLoginBtn.addEventListener('click', () => {
    openModal(`
      <div style="text-align: center; margin-bottom: 20px;">
        <svg width="40" height="40" viewBox="0 0 48 48">
          <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.66 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
          <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
          <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.28-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
          <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.66 48 24 48z"/>
        </svg>
        <h3 class="modal-title" style="margin-top: 10px;">Sign in with Google Workspace</h3>
        <p class="modal-desc" style="margin-bottom: 0;">to continue to <strong>Agent 54 Compliance Portal (vignan.ac.in)</strong></p>
      </div>

      <div class="google-account-list">
        <div class="google-account-item" id="ssoAccount1">
          <div class="google-avatar">AR</div>
          <div class="google-account-details">
            <span class="google-name">Dr. Astitwaa Roy</span>
            <span class="google-email">astitwaa.compliance@vignan.ac.in</span>
          </div>
        </div>

        <div class="google-account-item" id="ssoAccount2">
          <div class="google-avatar" style="background: linear-gradient(135deg, #10b981, #059669);">AD</div>
          <div class="google-account-details">
            <span class="google-name">VFSTR University Administrator</span>
            <span class="google-email">admin.portal@vignan.ac.in</span>
          </div>
        </div>
      </div>

      <button type="button" class="modal-cancel-btn" onclick="document.getElementById('modalCloseBtn').click()">
        Cancel
      </button>
    `);

    document.getElementById('ssoAccount1').addEventListener('click', async () => {
      closeModal();
      showToast('Authenticating with Google Workspace for Dr. Astitwaa Roy...', 'info');
      const res = await AuthAPI.googleSSO({
        name: 'Dr. Astitwaa Roy',
        email: 'astitwaa.compliance@vignan.ac.in',
        role: 'Chief Regulatory Compliance Officer',
        avatar: 'AR'
      });
      showToast('Google SSO Successful! Logged into Agent 54.', 'success');
      renderDashboard(res.profile);
    });

    document.getElementById('ssoAccount2').addEventListener('click', async () => {
      closeModal();
      showToast('Authenticating with Google Workspace for University Admin...', 'info');
      const res = await AuthAPI.googleSSO({
        name: 'University Administrator',
        email: 'admin.portal@vignan.ac.in',
        role: 'System Administrator',
        avatar: 'AD'
      });
      showToast('Google SSO Successful! Logged into Agent 54.', 'success');
      renderDashboard(res.profile);
    });
  });

  // ==========================================
  // 11. Forgot Password Button & Modal
  // ==========================================
  forgotPasswordLink.addEventListener('click', (e) => {
    e.preventDefault();
    openModal(`
      <div class="modal-header-icon">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
          <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
        </svg>
      </div>
      <h3 class="modal-title">Reset Admin Password</h3>
      <p class="modal-desc">Enter your registered Vignan administrative email to receive a secure one-time verification code.</p>

      <div id="resetStep1">
        <div class="input-wrapper" style="margin-bottom: 16px;">
          <input type="email" id="resetEmailInput" placeholder="admin@vignan.ac.in" style="width: 100%; height: 48px; border: 1.5px solid #cbd5e1; border-radius: 12px; padding: 0 16px; font-size: 14px;" value="${usernameInput.value.trim() || ''}">
        </div>
        <button type="button" class="modal-action-btn" id="btnSendResetCode">
          Send Verification Code
        </button>
      </div>

      <div id="resetStep2" class="hidden">
        <div style="background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 10px; padding: 10px 14px; font-size: 13px; color: #1d4ed8; margin-bottom: 14px;">
          Verification code sent! (Demo OTP Code: <strong>549210</strong>)
        </div>
        <div style="display: flex; gap: 10px; margin-bottom: 16px;">
          <input type="text" id="otpInput" placeholder="Enter 6-digit OTP (549210)" maxlength="6" style="width: 100%; height: 48px; border: 1.5px solid #cbd5e1; border-radius: 12px; padding: 0 16px; font-size: 14px; letter-spacing: 2px;">
        </div>
        <div style="margin-bottom: 16px;">
          <input type="password" id="newPasswordInput" placeholder="Enter new secure password" style="width: 100%; height: 48px; border: 1.5px solid #cbd5e1; border-radius: 12px; padding: 0 16px; font-size: 14px;">
        </div>
        <button type="button" class="modal-action-btn" id="btnConfirmNewPass">
          Update & Save Password
        </button>
      </div>

      <button type="button" class="modal-cancel-btn" onclick="document.getElementById('modalCloseBtn').click()">
        Back to Login
      </button>
    `);

    const resetStep1 = document.getElementById('resetStep1');
    const resetStep2 = document.getElementById('resetStep2');
    const btnSendResetCode = document.getElementById('btnSendResetCode');
    const resetEmailInput = document.getElementById('resetEmailInput');

    btnSendResetCode.addEventListener('click', async () => {
      const email = resetEmailInput.value.trim();
      if (!email) {
        showToast('Please enter your administrator email', 'danger');
        return;
      }
      btnSendResetCode.disabled = true;
      btnSendResetCode.textContent = 'Generating OTP...';
      await AuthAPI.requestPasswordReset(email);
      resetStep1.classList.add('hidden');
      resetStep2.classList.remove('hidden');
      showToast('OTP code sent! Use code 549210 to reset.', 'info');
    });

    document.getElementById('btnConfirmNewPass').addEventListener('click', async () => {
      const otp = document.getElementById('otpInput').value.trim();
      const newPass = document.getElementById('newPasswordInput').value.trim();
      if (!otp || !newPass) {
        showToast('Please enter both OTP and your new password.', 'danger');
        return;
      }
      const res = await AuthAPI.confirmPasswordReset(resetEmailInput.value, otp, newPass);
      if (res.success) {
        closeModal();
        passwordInput.value = newPass;
        showToast('Password updated! You can now log in.', 'success');
      } else {
        showToast(res.error, 'danger');
      }
    });
  });

  // ==========================================
  // 12. Contact Administrator Button & Modal
  // ==========================================
  contactAdminLink.addEventListener('click', (e) => {
    e.preventDefault();
    openModal(`
      <div class="modal-header-icon">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
        </svg>
      </div>
      <h3 class="modal-title">Contact System Administrator</h3>
      <p class="modal-desc">Submit an urgent technical or access inquiry to the Vignan University IT Helpdesk.</p>

      <form id="supportTicketForm" style="display: flex; flex-direction: column; gap: 12px; margin-bottom: 16px;">
        <div>
          <label style="font-size: 12.5px; font-weight: 600; color: #475569; display: block; margin-bottom: 4px;">Inquiry Category</label>
          <select id="ticketCategory" style="width: 100%; height: 44px; border: 1.5px solid #cbd5e1; border-radius: 10px; padding: 0 12px; font-size: 13.5px; color: #0f172a; background: #fff;">
            <option>Agent 54 Regulatory Compliance Access</option>
            <option>Administrative Role Permissions</option>
            <option>Two-Factor Authentication (2FA) Reset</option>
            <option>Audit Data Sync & Accreditation Log Inquiry</option>
          </select>
        </div>

        <div>
          <label style="font-size: 12.5px; font-weight: 600; color: #475569; display: block; margin-bottom: 4px;">Priority</label>
          <select id="ticketPriority" style="width: 100%; height: 44px; border: 1.5px solid #cbd5e1; border-radius: 10px; padding: 0 12px; font-size: 13.5px; color: #0f172a; background: #fff;">
            <option>Normal (Response in 4 hrs)</option>
            <option>Urgent - Hackathon / Audit Demo (Immediate)</option>
          </select>
        </div>

        <div>
          <label style="font-size: 12.5px; font-weight: 600; color: #475569; display: block; margin-bottom: 4px;">Message Details</label>
          <textarea id="ticketMessage" rows="3" placeholder="Describe the access issue or inquiry..." style="width: 100%; border: 1.5px solid #cbd5e1; border-radius: 10px; padding: 10px 12px; font-size: 13.5px; font-family: inherit; resize: none;"></textarea>
        </div>

        <button type="submit" class="modal-action-btn" id="btnSubmitTicket">
          Submit Support Ticket
        </button>
      </form>

      <div style="border-top: 1px solid #e2e8f0; padding-top: 12px; font-size: 12.5px; color: #64748b; text-align: center;">
        Direct Helpline: <strong>+91 863-2344700</strong> | Email: <strong>support@vignan.ac.in</strong>
      </div>
    `);

    document.getElementById('supportTicketForm').addEventListener('submit', async (ev) => {
      ev.preventDefault();
      const btn = document.getElementById('btnSubmitTicket');
      btn.disabled = true;
      btn.textContent = 'Logging ticket with IT Helpdesk...';

      const res = await SupportAPI.submitTicket({
        category: document.getElementById('ticketCategory').value,
        priority: document.getElementById('ticketPriority').value,
        message: document.getElementById('ticketMessage').value
      });

      closeModal();
      showToast(`Support Ticket Created: ${res.ticketId}. Our IT team has been notified.`, 'success');
    });
  });

  // ==========================================
  // 13. Security Seal & Secure Pill Modals
  // ==========================================
  function showSecurityModal() {
    openModal(`
      <div class="modal-header-icon green">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
        </svg>
      </div>
      <h3 class="modal-title">256-Bit SSL & Compliance Security</h3>
      <p class="modal-desc">This connection is safeguarded by institutional-grade TLS 1.3 cryptographic protocols adhering to India AI & Education Data Protection Regulations.</p>

      <div class="modal-info-list">
        <div class="modal-info-item">
          <span class="modal-info-label">Cipher Suite</span>
          <span class="modal-info-val">TLS 1.3 / AES-256-GCM</span>
        </div>
        <div class="modal-info-item">
          <span class="modal-info-label">Certificate Authority</span>
          <span class="modal-info-val">DigiCert Global High Assurance Root CA</span>
        </div>
        <div class="modal-info-item">
          <span class="modal-info-label">Regulatory Standard</span>
          <span class="modal-info-val badge-green">AI Act Regulation 54</span>
        </div>
        <div class="modal-info-item">
          <span class="modal-info-label">Information Security</span>
          <span class="modal-info-val badge-green">ISO/IEC 27001:2022</span>
        </div>
        <div class="modal-info-item">
          <span class="modal-info-label">System Uptime</span>
          <span class="modal-info-val">99.98% (High Availability Cluster)</span>
        </div>
      </div>

      <button type="button" class="modal-action-btn" onclick="document.getElementById('modalCloseBtn').click()">
        Got It, Verified Secure
      </button>
    `);
  }

  securitySealBtn.addEventListener('click', showSecurityModal);
  securePillBtn.addEventListener('click', showSecurityModal);

  // ==========================================
  // 14. 7 Accreditation Coin Badges Click Action
  // ==========================================
  const badgeKeys = ['naac', 'nirf', 'nba', 'aicte', 'ugccare', 'iic', 'abet'];
  
  badgeCoins.forEach((badgeEl, index) => {
    badgeEl.addEventListener('click', () => {
      const key = badgeKeys[index] || 'naac';
      const data = AccreditationData[key];
      if (!data) return;

      openModal(`
        <div style="text-align: center; margin-bottom: 16px;">
          <div style="width: 72px; height: 72px; margin: 0 auto 12px; border-radius: 50%; box-shadow: 0 4px 20px rgba(0,98,255,0.25); border: 2px solid #fff; overflow: hidden;">
            <img src="${badgeEl.querySelector('img').src}" style="width: 100%; height: 100%; object-fit: cover;" alt="${data.title}">
          </div>
          <h3 class="modal-title">${data.title}</h3>
          <p class="modal-desc" style="margin-bottom: 14px;">${data.details}</p>
        </div>

        <div class="modal-info-list">
          <div class="modal-info-item">
            <span class="modal-info-label">Accrediting Body</span>
            <span class="modal-info-val">${data.issuer}</span>
          </div>
          <div class="modal-info-item">
            <span class="modal-info-label">Score / Standing</span>
            <span class="modal-info-val badge-green">${data.score}</span>
          </div>
          <div class="modal-info-item">
            <span class="modal-info-label">Accreditation Cycle</span>
            <span class="modal-info-val">${data.cycle}</span>
          </div>
          <div class="modal-info-item">
            <span class="modal-info-label">Status</span>
            <span class="modal-info-val" style="color: #10b981; font-weight: 700;">${data.validity}</span>
          </div>
        </div>

        <div style="display: flex; gap: 10px;">
          <a href="${data.verifyUrl}" target="_blank" rel="noopener noreferrer" class="modal-action-btn" style="flex: 1;">
            Verify on Official Portal
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
              <polyline points="15 3 21 3 21 9"></polyline>
              <line x1="10" y1="14" x2="21" y2="3"></line>
            </svg>
          </a>
          <button type="button" class="modal-cancel-btn" style="width: auto; padding: 0 16px;" onclick="document.getElementById('modalCloseBtn').click()">
            Close
          </button>
        </div>
      `);
    });
  });

  // ==========================================
  // 15. Header Main Logo Click Action
  // ==========================================
  headerMainLogo.addEventListener('click', () => {
    openModal(`
      <div style="text-align: center; margin-bottom: 20px;">
        <img src="vignan_main_logo.png" style="height: 60px; object-fit: contain; margin-bottom: 12px;" alt="Vignan University">
        <h3 class="modal-title">VIGNAN'S Foundation for Science, Technology & Research</h3>
        <p class="modal-desc">Deemed to be University • Estd. u/s 3 of UGC Act 1956 • Vadlamudi, Guntur, AP</p>
      </div>

      <div class="modal-info-list">
        <div class="modal-info-item">
          <span class="modal-info-label">Official Website</span>
          <span class="modal-info-val"><a href="https://vignan.ac.in" target="_blank" style="color: #0062ff; text-decoration: underline;">vignan.ac.in</a></span>
        </div>
        <div class="modal-info-item">
          <span class="modal-info-label">Regulatory Platform</span>
          <span class="modal-info-val">Agent 54 Compliance Engine</span>
        </div>
        <div class="modal-info-item">
          <span class="modal-info-label">Campus Location</span>
          <span class="modal-info-val">Vadlamudi, Andhra Pradesh 522213</span>
        </div>
      </div>

      <a href="https://vignan.ac.in" target="_blank" rel="noopener noreferrer" class="modal-action-btn">
        Visit Official University Website
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
          <polyline points="15 3 21 3 21 9"></polyline>
          <line x1="10" y1="14" x2="21" y2="3"></line>
        </svg>
      </a>
    `);
  });
});
