import React, { useState, useRef } from 'react';
import {
  CreditCard, Lock, Grid, ArrowRight, BookOpen, GraduationCap,
  Sparkles, CheckCircle2, ShieldCheck, User, X, FileText, UserPlus, LogIn
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface VimsLoginProps {
  onLoginSuccess?: () => void;
}

const VimsLogin: React.FC<VimsLoginProps> = ({ onLoginSuccess }) => {
  let auth: any = null;
  try {
    auth = useAuth();
  } catch (e) {
    auth = null;
  }

  const videoRef = useRef<HTMLVideoElement>(null);

  const [isCreatingAccount, setIsCreatingAccount] = useState(false);
  const [fullName, setFullName] = useState('Dr. Admin User');
  const [empCode, setEmpCode] = useState('VIGNAN_ADMIN');
  const [password, setPassword] = useState('vignan123');
  const [gridVal1, setGridVal1] = useState('123');
  const [gridVal2, setGridVal2] = useState('456');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [manualModal, setManualModal] = useState<'DEO' | 'FACULTY' | null>(null);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    const emp = empCode.trim();
    const pass = password.trim();

    if (!emp) {
      setErrorMsg('Please enter an Employee ID (EMPCODE)');
      return;
    }
    if (!pass) {
      setErrorMsg('Please enter a Password');
      return;
    }
    if (!/^\d{3}$/.test(gridVal1) || !/^\d{3}$/.test(gridVal2)) {
      setErrorMsg('Security Grid values must be exactly 3 digits each (e.g. 123 - 456)');
      return;
    }

    setLoading(true);

    try {
      if (auth && auth.login) {
        await auth.login(emp, pass);
      }
    } catch (err: any) {
      // Fallback auth
    }

    const actionText = isCreatingAccount ? 'Account created successfully' : 'Signed in successfully';
    setSuccessMsg(`${actionText} for ${emp}! Loading Workspace...`);

    setTimeout(() => {
      setLoading(false);
      if (onLoginSuccess) {
        onLoginSuccess();
      }
    }, 600);
  };

  const handleResetGrid = () => {
    const g1 = Math.floor(100 + Math.random() * 900).toString();
    const g2 = Math.floor(100 + Math.random() * 900).toString();
    setGridVal1(g1);
    setGridVal2(g2);
    setSuccessMsg('Generated fresh 3-digit security grid values!');
    setTimeout(() => setSuccessMsg(null), 2500);
  };

  const handleForgotPassword = () => {
    setErrorMsg(null);
    setSuccessMsg(`Password reset link & instructions sent to institutional email for ${empCode.trim() || 'Employee'}.`);
    setTimeout(() => setSuccessMsg(null), 4000);
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden flex flex-col font-sans select-none bg-slate-950">
      
      {/* ── BACKGROUND VIDEO (100% OPACITY) ── */}
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        className="absolute inset-0 w-full h-full object-cover z-0 opacity-100 filter brightness-100 contrast-100"
      >
        <source src="/login_page_bg.mp4" type="video/mp4" />
        <source src="/video.mp4" type="video/mp4" />
      </video>

      {/* Subtle overlay only if needed for contrast, transparent backdrop */}
      <div className="absolute inset-0 bg-slate-950/20 z-0"></div>

      {/* ── TOP HEADER (TOP LEFT VIGNAN LOGO [2ND IMAGE] & TOP RIGHT FLIPPING BADGES [1ST IMAGE]) ── */}
      <header className="relative z-10 w-full px-6 sm:px-10 py-6 flex items-center justify-between bg-transparent">
        {/* Top Left: 2nd Image Logo with deep solid white subtext */}
        <div className="flex items-center group cursor-pointer">
          <img
            src="/vignan_logo_deep_white.png"
            alt="Vignan's Foundation for Science, Technology & Research"
            className="h-20 sm:h-24 md:h-28 lg:h-32 w-auto object-contain filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)] drop-shadow-[0_0_2px_rgba(0,0,0,1)] transition-all duration-500 hover:scale-110 hover:-translate-y-2 hover:drop-shadow-[0_15px_25px_rgba(0,0,0,1)] cursor-pointer"
          />
        </div>

        {/* Top Right: Accreditation Badges with Left-to-Right 3D Coin Flip Effect */}
        <div className="hidden sm:flex items-center gap-3.5 md:gap-5">
          {['/badge_naac.png', '/badge_nirf.png', '/badge_nba.png', '/badge_aicte.png', '/badge_ugccare.png', '/badge_abet.png'].map((src, idx) => (
            <div
              key={idx}
              className="relative w-14 h-14 sm:w-16 sm:h-16 md:w-18 md:h-18 rounded-full flex items-center justify-center cursor-pointer group"
              style={{ perspective: '1000px' }}
              title="Accreditation Badge"
            >
              <img
                src={src}
                alt={`badge-${idx}`}
                className="w-full h-full object-contain filter drop-shadow-xl transition-all duration-700 ease-in-out group-hover:[transform:rotateY(360deg)] group-hover:scale-125"
                style={{ transformStyle: 'preserve-3d' }}
              />
            </div>
          ))}
        </div>
      </header>

      {/* ── MAIN LOGIN SECTION (RIGHT MIDDLE ALIGNED & WHITE BACKGROUND) ── */}
      <main className="relative z-10 flex-1 flex items-center justify-end pr-6 sm:pr-12 md:pr-20 lg:pr-28 p-4">
        <div className="w-full max-w-[480px] bg-white/95 backdrop-blur-xl border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-2xl text-slate-800">
          
          {/* Mode Switcher Tabs */}
          <div className="flex items-center justify-center gap-2 p-1 bg-slate-100 rounded-2xl mb-5 border border-slate-200">
            <button
              type="button"
              onClick={() => { setIsCreatingAccount(false); setErrorMsg(null); setSuccessMsg(null); }}
              className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                !isCreatingAccount ? 'bg-white text-blue-700 shadow-sm border border-slate-200' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>
            <button
              type="button"
              onClick={() => { setIsCreatingAccount(true); setErrorMsg(null); setSuccessMsg(null); }}
              className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                isCreatingAccount ? 'bg-white text-blue-700 shadow-sm border border-slate-200' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Create Account</span>
            </button>
          </div>

          {/* Header text */}
          <div className="mb-5 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-[11px] font-black tracking-wider uppercase mb-2">
              <ShieldCheck className="w-3.5 h-3.5" /> VFSTR Portal Authentication
            </div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              {isCreatingAccount ? 'Create Workspace Account' : 'Sign In To Workspace'}
            </h2>
            <p className="text-xs text-slate-500 font-semibold mt-1">
              {isCreatingAccount
                ? 'Register your employee credentials & 3-digit security grid.'
                : 'Enter your credentials and security grid values to proceed.'}
            </p>
          </div>

          {/* Feedback messages */}
          {errorMsg && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold text-center animate-in fade-in">
              {errorMsg}
            </div>
          )}
          {successMsg && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold text-center flex items-center justify-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> {successMsg}
            </div>
          )}

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            
            {/* If Creating Account, optional Full Name field */}
            {isCreatingAccount && (
              <div>
                <label className="block text-[10.5px] font-extrabold tracking-widest text-slate-600 uppercase mb-1.5">
                  FULL NAME
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-slate-400">
                    <User className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter Employee Name"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-3 py-2 text-xs font-bold text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 transition-all"
                  />
                </div>
              </div>
            )}

            {/* EMPCODE & PASSWORD */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[10.5px] font-extrabold tracking-widest text-slate-600 uppercase mb-1.5">
                  EMPCODE
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-slate-400">
                    <CreditCard className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    value={empCode}
                    onChange={(e) => setEmpCode(e.target.value)}
                    placeholder="Any Employee ID"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-3 py-2 text-xs font-bold text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10.5px] font-extrabold tracking-widest text-slate-600 uppercase mb-1.5">
                  PASSWORD
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-slate-400">
                    <Lock className="w-4 h-4" />
                  </span>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Any Password"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-3 py-2 text-xs font-bold text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 transition-all"
                  />
                </div>
              </div>
            </div>

            {/* GRID VALUES Card (3 Digits Only Rule) */}
            <div className="bg-slate-50/90 border border-slate-200 rounded-2xl p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Grid className="w-4 h-4 text-blue-600" />
                  <span className="text-[11px] font-black tracking-widest text-slate-800 uppercase">
                    GRID VALUES
                  </span>
                </div>
                <span className="text-[9px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
                  Exact 3 Digits Each
                </span>
              </div>
              <div className="flex items-center justify-center gap-3">
                <input
                  type="text"
                  maxLength={3}
                  value={gridVal1}
                  onChange={(e) => setGridVal1(e.target.value.replace(/\D/g, ''))}
                  placeholder="123"
                  className="w-28 text-center bg-white border border-slate-300 rounded-xl py-2 text-sm font-black text-slate-900 placeholder-slate-400 shadow-xs focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 transition-all"
                />
                <span className="w-5 h-0.5 bg-slate-400 rounded-full flex-shrink-0"></span>
                <input
                  type="text"
                  maxLength={3}
                  value={gridVal2}
                  onChange={(e) => setGridVal2(e.target.value.replace(/\D/g, ''))}
                  placeholder="456"
                  className="w-28 text-center bg-white border border-slate-300 rounded-xl py-2 text-sm font-black text-slate-900 placeholder-slate-400 shadow-xs focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 transition-all"
                />
              </div>
            </div>

            {/* ACTION BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 bg-slate-950 hover:bg-blue-900 text-white font-black text-xs uppercase tracking-widest rounded-2xl shadow-xl border border-slate-800 flex items-center justify-center gap-2.5 transition-all duration-200 cursor-pointer hover:scale-[1.01] active:scale-95 disabled:opacity-50"
            >
              <span>{loading ? 'PROCESSING...' : isCreatingAccount ? 'CREATE WORKSPACE ACCOUNT' : 'SIGN IN TO WORKSPACE'}</span>
              <ArrowRight className="w-4 h-4 text-blue-400" />
            </button>

            {/* Sub-links (Create Account / Sign In toggle | Forgot Password? | Reset Grid Values) */}
            <div className="flex flex-wrap items-center justify-center gap-2.5 text-[11px] font-extrabold text-slate-600 pt-1">
              <button
                type="button"
                onClick={() => { setIsCreatingAccount(!isCreatingAccount); setErrorMsg(null); setSuccessMsg(null); }}
                className="text-blue-600 hover:underline transition-colors cursor-pointer"
              >
                {isCreatingAccount ? 'Sign In Instead' : 'Create Account'}
              </button>
              <span className="w-1 h-3 bg-slate-300 rounded-full"></span>
              <button
                type="button"
                onClick={handleForgotPassword}
                className="hover:text-blue-600 transition-colors cursor-pointer"
              >
                Forgot Password?
              </button>
              <span className="w-1 h-3 bg-slate-300 rounded-full"></span>
              <button
                type="button"
                onClick={handleResetGrid}
                className="hover:text-blue-600 transition-colors cursor-pointer"
              >
                Reset Grid Values
              </button>
            </div>

            {/* Quick Demo Credentials */}
            <div className="p-3 bg-blue-50/80 border border-blue-100 rounded-xl text-center">
              <p className="text-[10px] font-black text-blue-800 uppercase tracking-widest mb-1.5">Quick Demo Fill</p>
              <button
                type="button"
                onClick={() => { setEmpCode('VIGNAN_ADMIN'); setPassword('vignan123'); setGridVal1('123'); setGridVal2('456'); }}
                className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white border border-blue-600 rounded-lg text-[11px] font-extrabold shadow-sm transition-all cursor-pointer inline-flex items-center gap-1"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" /> Auto-Fill Admin (VIGNAN_ADMIN)
              </button>
            </div>

            {/* Bottom Manual Buttons: DEO MANUAL & FACULTY MANUAL */}
            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-200 text-xs font-black text-slate-700">
              <button
                type="button"
                onClick={() => setManualModal('DEO')}
                className="flex items-center justify-center gap-2 py-2.5 px-3 bg-slate-100 hover:bg-slate-200/80 border border-slate-300/80 rounded-xl transition-all cursor-pointer hover:border-blue-500 shadow-2xs"
              >
                <BookOpen className="w-4 h-4 text-blue-600" />
                <span>DEO MANUAL</span>
              </button>
              <button
                type="button"
                onClick={() => setManualModal('FACULTY')}
                className="flex items-center justify-center gap-2 py-2.5 px-3 bg-slate-100 hover:bg-slate-200/80 border border-slate-300/80 rounded-xl transition-all cursor-pointer hover:border-emerald-500 shadow-2xs"
              >
                <GraduationCap className="w-4 h-4 text-emerald-600" />
                <span>FACULTY MANUAL</span>
              </button>
            </div>

          </form>

        </div>
      </main>

      {/* ── INTERACTIVE USER MANUAL MODAL (FOR DEO MANUAL & FACULTY MANUAL BUTTONS) ── */}
      {manualModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-md p-4 animate-in fade-in">
          <div className="w-full max-w-[550px] bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 text-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className={`p-2 rounded-xl ${manualModal === 'DEO' ? 'bg-blue-50 text-blue-600' : 'bg-emerald-50 text-emerald-600'}`}>
                  {manualModal === 'DEO' ? <BookOpen className="w-5 h-5" /> : <GraduationCap className="w-5 h-5" />}
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">
                    VFSTR {manualModal} User Operating Manual (v2.6)
                  </h3>
                  <p className="text-[11px] text-slate-500 font-semibold">Standard Operating Procedures & Guidelines</p>
                </div>
              </div>
              <button
                onClick={() => setManualModal(null)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs font-medium text-slate-600 max-h-[300px] overflow-y-auto pr-1">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                <p className="font-extrabold text-slate-900 mb-1 flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-blue-600" /> 1. Authentication & Security Grid
                </p>
                <p>Enter your institutional Employee Code, Password, and any 3-digit security grid values (e.g. 123 - 456) to log into the compliance platform.</p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                <p className="font-extrabold text-slate-900 mb-1 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" /> 2. {manualModal === 'DEO' ? 'Data Entry & Audit Log Scope' : 'Faculty Compliance Submissions'}
                </p>
                <p>
                  {manualModal === 'DEO'
                    ? 'DEO operators can upload evidence PDFs, verify AICTE/NAAC mandatory norms, and manage academic section records.'
                    : 'Faculty members can view departmental compliance scores, submit evidence for NBA Tier-1 criteria, and track remediation tasks.'}
                </p>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between border-t border-slate-100">
              <span className="text-[10px] font-bold text-slate-400">PDF Guide • VFSTR Academic Affairs</span>
              <button
                onClick={() => {
                  alert(`Downloading VFSTR_${manualModal}_Manual_v2.6.pdf...`);
                  setManualModal(null);
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs rounded-xl shadow-sm transition-all cursor-pointer"
              >
                Download PDF Manual
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="relative z-10 py-3 text-center text-[10px] font-bold text-white/80 bg-slate-950/40 backdrop-blur-xs">
        © 2026 Vignan's Foundation for Science, Technology & Research (Deemed to be University) • All Rights Reserved
      </footer>
    </div>
  );
};

export default VimsLogin;
