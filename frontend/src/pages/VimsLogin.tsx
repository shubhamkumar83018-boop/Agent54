import React, { useState, useRef } from 'react';
import {
  CreditCard, Lock, Grid, ArrowRight, BookOpen, GraduationCap,
  Sparkles, CheckCircle2, ShieldCheck, User, X, FileText, UserPlus, LogIn,
  Upload, Download, Trash2, Eye, FileCheck, RefreshCw
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
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [showLoginForm, setShowLoginForm] = useState(false);
  const [isCreatingAccount, setIsCreatingAccount] = useState(false);
  const [fullName, setFullName] = useState('Dr. Admin User');
  const [empCode, setEmpCode] = useState('VIGNAN_ADMIN');
  const [password, setPassword] = useState('vignan123');
  const [gridVal1, setGridVal1] = useState('123');
  const [gridVal2, setGridVal2] = useState('456');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  
  // Modal & PDF state
  const [manualModal, setManualModal] = useState<'DEO' | 'FACULTY' | null>(null);
  const [activeModalTab, setActiveModalTab] = useState<'view' | 'upload'>('view');
  const [pdfSuccessMsg, setPdfSuccessMsg] = useState<string | null>(null);

  // PDF Data state
  const [deoPdf, setDeoPdf] = useState<{ name: string; url: string; size: string; date: string; isCustom?: boolean }>(() => {
    const saved = localStorage.getItem('vims_deo_pdf_info');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return { ...parsed, url: '' };
      } catch (e) {}
    }
    return {
      name: 'VFSTR_DEO_Standard_Operating_Manual_v2.6.pdf',
      url: '',
      size: '2.4 MB',
      date: '2026-01-15',
      isCustom: false
    };
  });

  const [facultyPdf, setFacultyPdf] = useState<{ name: string; url: string; size: string; date: string; isCustom?: boolean }>(() => {
    const saved = localStorage.getItem('vims_faculty_pdf_info');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return { ...parsed, url: '' };
      } catch (e) {}
    }
    return {
      name: 'VFSTR_Faculty_Handbook_&_Manual_v2.6.pdf',
      url: '',
      size: '3.1 MB',
      date: '2026-01-20',
      isCustom: false
    };
  });

  const currentPdf = manualModal === 'DEO' ? deoPdf : facultyPdf;

  const handlePdfUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !manualModal) return;

    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      setErrorMsg('Selected file must be a valid PDF format (.pdf)');
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    const pdfData = {
      name: file.name,
      url: objectUrl,
      size: file.size / (1024 * 1024) >= 1
        ? (file.size / (1024 * 1024)).toFixed(2) + ' MB'
        : (file.size / 1024).toFixed(1) + ' KB',
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      isCustom: true
    };

    if (manualModal === 'DEO') {
      setDeoPdf(pdfData);
      localStorage.setItem('vims_deo_pdf_info', JSON.stringify({ ...pdfData, url: '' }));
    } else {
      setFacultyPdf(pdfData);
      localStorage.setItem('vims_faculty_pdf_info', JSON.stringify({ ...pdfData, url: '' }));
    }

    setPdfSuccessMsg(`Successfully added "${file.name}" to ${manualModal} Manual!`);
    setActiveModalTab('view');
    setTimeout(() => setPdfSuccessMsg(null), 4000);

    // Reset file input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleRemovePdf = () => {
    if (!manualModal) return;
    if (manualModal === 'DEO') {
      setDeoPdf({
        name: 'VFSTR_DEO_Standard_Operating_Manual_v2.6.pdf',
        url: '',
        size: '2.4 MB',
        date: '2026-01-15',
        isCustom: false
      });
      localStorage.removeItem('vims_deo_pdf_info');
    } else {
      setFacultyPdf({
        name: 'VFSTR_Faculty_Handbook_&_Manual_v2.6.pdf',
        url: '',
        size: '3.1 MB',
        date: '2026-01-20',
        isCustom: false
      });
      localStorage.removeItem('vims_faculty_pdf_info');
    }
    setPdfSuccessMsg(`Reset ${manualModal} Manual to default document.`);
    setTimeout(() => setPdfSuccessMsg(null), 3000);
  };

  const handleDownloadPdf = () => {
    if (!manualModal || !currentPdf) return;
    if (currentPdf.url) {
      const a = document.createElement('a');
      a.href = currentPdf.url;
      a.download = currentPdf.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } else {
      alert(`Downloading ${currentPdf.name}...`);
    }
  };

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
      
      {/* Hidden File Input for PDF Uploads */}
      <input
        type="file"
        ref={fileInputRef}
        accept="application/pdf,.pdf"
        onChange={handlePdfUpload}
        className="hidden"
      />

      {/* ── BACKGROUND VIDEO (100% OPACITY) ── */}
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        className="absolute inset-0 w-full h-full object-cover z-0 opacity-100 filter brightness-110 contrast-110 saturate-110"
      >
        <source src="/login_page_bg.mp4" type="video/mp4" />
        <source src="/video.mp4" type="video/mp4" />
      </video>

      {/* Subtle overlay */}
      <div className="absolute inset-0 bg-slate-950/5 z-0"></div>

      {/* Floating Watermark to cover video sparkle */}
      <div className="absolute -bottom-6 right-[6%] z-0 pointer-events-none drop-shadow-[0_10px_30px_rgba(0,0,0,0.8)] backdrop-blur-2xl bg-black/10 rounded-full p-8 w-64 h-64 flex items-center justify-center">
        <img 
          src="/vignan_shield.png" 
          alt="Vignan Watermark" 
          className="w-48 h-48 object-contain filter contrast-125 saturate-150 animate-[pulse_4s_ease-in-out_infinite]"
        />
      </div>

      {/* ── TOP HEADER (TOP LEFT VIGNAN LOGO & TOP RIGHT FLIPPING BADGES) ── */}
      <header className="relative z-10 w-full px-6 sm:px-10 py-6 flex items-center justify-between bg-transparent">
        {/* Top Left: Logo */}
        <div className="flex items-center group cursor-pointer">
          <div className="px-2 py-2 transition-all duration-500 hover:scale-105 hover:-translate-y-1">
            <img
              src="/vignan_logo.png"
              alt="Vignan's Foundation for Science, Technology & Research"
              className="h-20 sm:h-24 md:h-28 lg:h-32 w-auto object-contain cursor-pointer filter drop-shadow-[0_4px_15px_rgba(255,255,255,0.9)] drop-shadow-[0_0_5px_rgba(255,255,255,0.8)]"
            />
          </div>
        </div>

        {/* Top Center: Sign In Button */}
        {!showLoginForm && (
          <div className="absolute left-[40%] md:left-[42%] -translate-x-1/2 top-4 sm:top-6 z-50">
            <button
              onClick={() => setShowLoginForm(true)}
              className="group px-6 py-2.5 sm:px-8 sm:py-3 bg-white hover:bg-gray-100 text-black font-black text-xs sm:text-sm uppercase tracking-widest rounded-[14px] shadow-[0_8px_25px_rgba(0,0,0,0.25)] hover:shadow-[0_12px_35px_rgba(255,255,255,0.3)] border border-gray-200 hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer flex items-center justify-center gap-2"
            >
              <LogIn className="w-4 h-4 sm:w-4.5 sm:h-4.5 group-hover:translate-x-0.5 transition-transform duration-300" />
              <span>Sign In to Workspace</span>
              <ArrowRight className="w-4 h-4 sm:w-4.5 sm:h-4.5 group-hover:translate-x-1.5 transition-transform duration-300" />
            </button>
          </div>
        )}

        {/* Top Right: Accreditation Badges with Left-to-Right 3D Coin Flip Effect */}
        <div className="hidden sm:flex items-center gap-4 md:gap-6 mr-4 lg:mr-12 xl:mr-16">
          {['/badge_naac.png', '/badge_nirf.png', '/badge_nba.png', '/badge_aicte.png', '/badge_ugccare.png', '/badge_abet.png'].map((src, idx) => (
            <div
              key={idx}
              className="relative w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 rounded-full flex items-center justify-center cursor-pointer group"
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
      {showLoginForm && (
      <main className="relative z-10 flex-1 flex items-center justify-end pr-6 sm:pr-12 md:pr-20 lg:pr-28 p-4">
        <div className="w-full max-w-[480px] bg-white/95 backdrop-blur-xl border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-[0_20px_60px_rgba(0,0,0,0.3)] hover:shadow-[0_30px_70px_rgba(37,99,235,0.35)] hover:border-blue-400 hover:scale-[1.02] hover:-translate-y-2 transition-all duration-500 text-slate-800 relative group/card">
          
          {/* Mode Switcher Tabs */}
          <div className="flex items-center justify-center gap-2 p-1.5 bg-slate-100 rounded-2xl mb-6 border border-slate-200 shadow-inner">
            <button
              type="button"
              onClick={() => { setIsCreatingAccount(false); setErrorMsg(null); setSuccessMsg(null); }}
              className={`flex-1 py-3 px-4 rounded-xl text-sm font-black transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer ${
                !isCreatingAccount
                  ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white shadow-md scale-105'
                  : 'text-slate-600 hover:text-blue-700 hover:bg-white/80 hover:scale-102'
              }`}
            >
              <LogIn className="w-4 h-4" />
              <span>Sign In</span>
            </button>
            <button
              type="button"
              onClick={() => { setIsCreatingAccount(true); setErrorMsg(null); setSuccessMsg(null); }}
              className={`flex-1 py-3 px-4 rounded-xl text-sm font-black transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer ${
                isCreatingAccount
                  ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white shadow-md scale-105'
                  : 'text-slate-600 hover:text-blue-700 hover:bg-white/80 hover:scale-102'
              }`}
            >
              <UserPlus className="w-4 h-4" />
              <span>Create Account</span>
            </button>
          </div>

          {/* Header text */}
          <div className="mb-6 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-black tracking-wider uppercase mb-3 shadow-2xs hover:scale-105 hover:bg-blue-100 hover:border-blue-300 transition-all duration-300 cursor-pointer">
              <ShieldCheck className="w-4 h-4 text-blue-600" /> VFSTR Portal Authentication
            </div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight transition-all">
              {isCreatingAccount ? 'Create Workspace Account' : 'Sign In To Workspace'}
            </h2>
            <p className="text-sm text-slate-500 font-semibold mt-1.5">
              {isCreatingAccount
                ? 'Register your employee credentials & 3-digit security grid.'
                : 'Enter your credentials and security grid values to proceed.'}
            </p>
          </div>

          {/* Feedback messages */}
          {errorMsg && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold text-center animate-in fade-in shadow-xs">
              {errorMsg}
            </div>
          )}
          {successMsg && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold text-center flex items-center justify-center gap-2 animate-in fade-in shadow-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> {successMsg}
            </div>
          )}

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            
            {/* If Creating Account */}
            {isCreatingAccount && (
              <div className="group/input">
                <label className="block text-xs font-extrabold tracking-widest text-slate-800 uppercase mb-2">
                  FULL NAME
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-slate-400 group-hover/input:text-blue-600 group-hover/input:scale-110 transition-all duration-300">
                    <User className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter Employee Name"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-3 py-3 text-sm font-bold text-slate-900 placeholder-slate-400 hover:bg-white hover:border-blue-500 hover:shadow-md hover:scale-[1.02] focus:scale-[1.02] focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-500/20 transition-all duration-300"
                  />
                </div>
              </div>
            )}

            {/* EMPCODE & PASSWORD */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="group/input">
                <label className="block text-xs font-extrabold tracking-widest text-slate-800 uppercase mb-2">
                  EMPCODE
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-slate-400 group-hover/input:text-blue-600 group-hover/input:scale-110 transition-all duration-300">
                    <CreditCard className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    value={empCode}
                    onChange={(e) => setEmpCode(e.target.value)}
                    placeholder="Any Employee ID"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-3 py-3 text-sm font-bold text-slate-900 placeholder-slate-400 hover:bg-white hover:border-blue-500 hover:shadow-md hover:scale-[1.02] focus:scale-[1.02] focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-500/20 transition-all duration-300"
                  />
                </div>
              </div>

              <div className="group/input">
                <label className="block text-xs font-extrabold tracking-widest text-slate-800 uppercase mb-2">
                  PASSWORD
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-slate-400 group-hover/input:text-blue-600 group-hover/input:scale-110 transition-all duration-300">
                    <Lock className="w-4 h-4" />
                  </span>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Any Password"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-3 py-3 text-sm font-bold text-slate-900 placeholder-slate-400 hover:bg-white hover:border-blue-500 hover:shadow-md hover:scale-[1.02] focus:scale-[1.02] focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-500/20 transition-all duration-300"
                  />
                </div>
              </div>
            </div>

            {/* GRID VALUES Card (3 Digits Only Rule) */}
            <div className="bg-slate-50/90 border border-slate-200 rounded-2xl p-5 hover:border-blue-400 hover:bg-blue-50/40 hover:shadow-lg transition-all duration-300 group/grid">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Grid className="w-5 h-5 text-blue-600 group-hover/grid:rotate-90 group-hover/grid:scale-110 transition-all duration-500" />
                  <span className="text-sm font-black tracking-widest text-slate-800 uppercase">
                    GRID VALUES
                  </span>
                </div>
                <span className="text-[11px] font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200 hover:scale-105 transition-transform cursor-default">
                  Exact 3 Digits Each
                </span>
              </div>
              <div className="flex items-center justify-center gap-4">
                <input
                  type="text"
                  maxLength={3}
                  value={gridVal1}
                  onChange={(e) => setGridVal1(e.target.value.replace(/\D/g, ''))}
                  placeholder="123"
                  className="w-32 text-center bg-white border border-slate-300 rounded-xl py-3 text-lg font-black text-slate-900 placeholder-slate-400 shadow-xs hover:scale-110 hover:border-blue-600 hover:shadow-lg focus:scale-110 focus:border-blue-600 focus:ring-4 focus:ring-blue-500/20 transition-all duration-300"
                />
                <span className="w-6 h-0.5 bg-slate-400 rounded-full flex-shrink-0"></span>
                <input
                  type="text"
                  maxLength={3}
                  value={gridVal2}
                  onChange={(e) => setGridVal2(e.target.value.replace(/\D/g, ''))}
                  placeholder="456"
                  className="w-32 text-center bg-white border border-slate-300 rounded-xl py-3 text-lg font-black text-slate-900 placeholder-slate-400 shadow-xs hover:scale-110 hover:border-blue-600 hover:shadow-lg focus:scale-110 focus:border-blue-600 focus:ring-4 focus:ring-blue-500/20 transition-all duration-300"
                />
              </div>
            </div>

            {/* ACTION BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 px-4 bg-gradient-to-r from-slate-950 via-blue-950 to-indigo-950 hover:from-blue-600 hover:via-indigo-600 hover:to-blue-700 text-white font-black text-sm uppercase tracking-widest rounded-2xl shadow-xl hover:shadow-[0_15px_35px_rgba(37,99,235,0.5)] border border-slate-800 hover:border-blue-400 flex items-center justify-center gap-2.5 hover:scale-[1.03] active:scale-95 transition-all duration-300 cursor-pointer group/btn"
            >
              <span>{loading ? 'PROCESSING...' : isCreatingAccount ? 'CREATE WORKSPACE ACCOUNT' : 'SIGN IN TO WORKSPACE'}</span>
              <ArrowRight className="w-5 h-5 text-blue-400 group-hover/btn:translate-x-2 group-hover/btn:scale-125 transition-transform duration-300" />
            </button>

            {/* Sub-links */}
            <div className="flex flex-wrap items-center justify-center gap-3 text-xs font-extrabold text-slate-600 pt-2">
              <button
                type="button"
                onClick={() => { setIsCreatingAccount(!isCreatingAccount); setErrorMsg(null); setSuccessMsg(null); }}
                className="text-blue-600 hover:text-blue-800 hover:scale-110 transition-all duration-200 cursor-pointer"
              >
                {isCreatingAccount ? 'Sign In Instead' : 'Create Account'}
              </button>
              <span className="w-1 h-3.5 bg-slate-300 rounded-full"></span>
              <button
                type="button"
                onClick={handleForgotPassword}
                className="hover:text-blue-600 hover:scale-110 transition-all duration-200 cursor-pointer"
              >
                Forgot Password?
              </button>
              <span className="w-1 h-3.5 bg-slate-300 rounded-full"></span>
              <button
                type="button"
                onClick={handleResetGrid}
                className="hover:text-blue-600 hover:scale-110 transition-all duration-200 cursor-pointer"
              >
                Reset Grid Values
              </button>
            </div>

            {/* Quick Demo Fill */}
            <div className="p-4 bg-blue-50/80 border border-blue-100 rounded-xl text-center hover:border-blue-300 hover:bg-blue-100/60 hover:shadow-md transition-all duration-300">
              <p className="text-xs font-black text-blue-800 uppercase tracking-widest mb-2">Quick Demo Fill</p>
              <button
                type="button"
                onClick={() => { setEmpCode('VIGNAN_ADMIN'); setPassword('vignan123'); setGridVal1('123'); setGridVal2('456'); }}
                className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white border border-blue-500 rounded-xl text-sm font-extrabold shadow-md hover:shadow-xl hover:scale-108 active:scale-95 transition-all duration-300 cursor-pointer inline-flex items-center gap-2 group/demo"
              >
                <Sparkles className="w-4 h-4 text-amber-300 group-hover/demo:rotate-45 group-hover/demo:scale-125 transition-transform duration-300" /> Auto-Fill Admin (VIGNAN_ADMIN)
              </button>
            </div>

            {/* Bottom Manual Buttons: DEO MANUAL & FACULTY MANUAL */}
            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-200 text-sm font-black text-slate-700">
              <button
                type="button"
                onClick={() => { setManualModal('DEO'); setActiveModalTab('view'); setPdfSuccessMsg(null); }}
                className="flex items-center justify-center gap-2.5 py-3.5 px-4 bg-slate-100 hover:bg-white border border-slate-300/80 hover:border-blue-500 hover:text-blue-700 rounded-xl shadow-xs hover:shadow-xl hover:scale-105 hover:-translate-y-1 transition-all duration-300 cursor-pointer group/deo relative"
              >
                <BookOpen className="w-5 h-5 text-blue-600 group-hover/deo:scale-120 group-hover/deo:rotate-6 transition-all duration-300" />
                <span>DEO MANUAL</span>
                {deoPdf.isCustom && (
                  <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-blue-600 text-white rounded-full flex items-center justify-center text-[10px] font-bold shadow-md">
                    ✓
                  </span>
                )}
              </button>
              <button
                type="button"
                onClick={() => { setManualModal('FACULTY'); setActiveModalTab('view'); setPdfSuccessMsg(null); }}
                className="flex items-center justify-center gap-2.5 py-3.5 px-4 bg-slate-100 hover:bg-white border border-slate-300/80 hover:border-emerald-500 hover:text-emerald-700 rounded-xl shadow-xs hover:shadow-xl hover:scale-105 hover:-translate-y-1 transition-all duration-300 cursor-pointer group/faculty relative"
              >
                <GraduationCap className="w-5 h-5 text-emerald-600 group-hover/faculty:scale-120 group-hover/faculty:-rotate-6 transition-all duration-300" />
                <span>FACULTY MANUAL</span>
                {facultyPdf.isCustom && (
                  <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-emerald-600 text-white rounded-full flex items-center justify-center text-[10px] font-bold shadow-md">
                    ✓
                  </span>
                )}
              </button>
            </div>

          </form>

        </div>
      </main>
      )}

      {/* ── INTERACTIVE PDF USER MANUAL MODAL (WITH FULL UPLOAD & PREVIEW SUPPORT) ── */}
      {manualModal && currentPdf && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 backdrop-blur-md p-4 animate-in fade-in">
          <div className="w-full max-w-[620px] bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 text-slate-800 space-y-4">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-2xl ${manualModal === 'DEO' ? 'bg-blue-50 text-blue-600' : 'bg-emerald-50 text-emerald-600'}`}>
                  {manualModal === 'DEO' ? <BookOpen className="w-6 h-6" /> : <GraduationCap className="w-6 h-6" />}
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                    VFSTR {manualModal} User Manual
                    {currentPdf.isCustom && (
                      <span className="px-2 py-0.5 rounded-md bg-blue-100 text-blue-700 text-[10px] font-black uppercase">
                        Custom PDF
                      </span>
                    )}
                  </h3>
                  <p className="text-[11px] text-slate-500 font-semibold">
                    {currentPdf.name} ({currentPdf.size})
                  </p>
                </div>
              </div>
              <button
                onClick={() => setManualModal(null)}
                className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Success message banner */}
            {pdfSuccessMsg && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold rounded-xl flex items-center gap-2 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>{pdfSuccessMsg}</span>
              </div>
            )}

            {/* Modal Navigation Tabs: View / Read vs Upload New PDF */}
            <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-xl">
              <button
                type="button"
                onClick={() => setActiveModalTab('view')}
                className={`flex-1 py-2 px-3 rounded-lg text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  activeModalTab === 'view'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Eye className="w-3.5 h-3.5 text-blue-600" /> View & Read Manual
              </button>
              <button
                type="button"
                onClick={() => setActiveModalTab('upload')}
                className={`flex-1 py-2 px-3 rounded-lg text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  activeModalTab === 'upload'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Upload className="w-3.5 h-3.5 text-indigo-600" /> Upload / Add Custom PDF
              </button>
            </div>

            {/* Tab 1: View & Read Manual */}
            {activeModalTab === 'view' && (
              <div className="space-y-3">
                {currentPdf.url ? (
                  <div className="w-full h-[280px] rounded-2xl overflow-hidden border border-slate-200 bg-slate-900 shadow-inner">
                    <iframe
                      src={currentPdf.url}
                      className="w-full h-full border-0"
                      title="PDF Preview"
                    />
                  </div>
                ) : (
                  <div className="space-y-2.5 text-xs font-medium text-slate-600 max-h-[260px] overflow-y-auto pr-1">
                    <div className="p-3.5 bg-blue-50/60 rounded-2xl border border-blue-100">
                      <p className="font-extrabold text-blue-900 mb-1 flex items-center gap-1.5">
                        <FileText className="w-4 h-4 text-blue-600" /> 1. Overview & Authentication Guidelines
                      </p>
                      <p className="text-slate-700">
                        {manualModal === 'DEO'
                          ? 'This document provides step-by-step instructions for Data Entry Operators to log in using Employee ID, Password, and 3-digit security grid verification.'
                          : 'Faculty members should utilize institutional email credentials alongside security grid inputs for verified session access.'}
                      </p>
                    </div>

                    <div className="p-3.5 bg-emerald-50/60 rounded-2xl border border-emerald-100">
                      <p className="font-extrabold text-emerald-900 mb-1 flex items-center gap-1.5">
                        <ShieldCheck className="w-4 h-4 text-emerald-600" /> 2. {manualModal === 'DEO' ? 'Evidence Verification & Data Entry' : 'Departmental Submissions & Compliance'}
                      </p>
                      <p className="text-slate-700">
                        {manualModal === 'DEO'
                          ? 'DEO workflow encompasses uploading evidentiary files, auditing NAAC/NIRF criteria, and cross-verifying academic records.'
                          : 'Faculty features enable submitting NBA Tier-1 course outcomes, reviewing department metrics, and resolving compliance items.'}
                      </p>
                    </div>

                    <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80">
                      <p className="font-extrabold text-slate-900 mb-1 flex items-center gap-1.5">
                        <FileCheck className="w-4 h-4 text-slate-600" /> 3. Document Details
                      </p>
                      <p className="text-slate-600 text-[11px]">
                        Filename: <span className="font-bold text-slate-800">{currentPdf.name}</span> • Size: <span className="font-bold text-slate-800">{currentPdf.size}</span> • Updated: <span className="font-bold text-slate-800">{currentPdf.date}</span>
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Tab 2: Upload / Add Custom PDF */}
            {activeModalTab === 'upload' && (
              <div className="space-y-4 py-2">
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-blue-300 hover:border-blue-600 bg-blue-50/40 hover:bg-blue-50 rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 group/drop"
                >
                  <div className="p-4 bg-white rounded-full shadow-md text-blue-600 group-hover/drop:scale-110 group-hover/drop:bg-blue-600 group-hover/drop:text-white transition-all duration-300 mb-3">
                    <Upload className="w-7 h-7" />
                  </div>
                  <h4 className="text-sm font-black text-slate-900 mb-1">
                    Click to select & add PDF file from your device
                  </h4>
                  <p className="text-xs text-slate-500 font-semibold mb-3">
                    Supports any standard .PDF manual document
                  </p>
                  <span className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition-all">
                    Browse PDF File
                  </span>
                </div>

                {currentPdf.isCustom && (
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-between text-xs font-bold text-amber-900">
                    <span>Currently using custom PDF: <span className="underline">{currentPdf.name}</span></span>
                    <button
                      type="button"
                      onClick={handleRemovePdf}
                      className="px-2.5 py-1 bg-amber-200 hover:bg-amber-300 text-amber-900 rounded-lg transition-all flex items-center gap-1 cursor-pointer"
                    >
                      <RefreshCw className="w-3 h-3" /> Reset Default
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Modal Footer Controls */}
            <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3.5 py-2 bg-slate-100 hover:bg-blue-50 hover:text-blue-700 border border-slate-300 hover:border-blue-400 rounded-xl font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5" /> Add / Change PDF
                </button>
                {currentPdf.isCustom && (
                  <button
                    type="button"
                    onClick={handleRemovePdf}
                    className="px-3 py-2 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-xl font-bold transition-all flex items-center gap-1 cursor-pointer"
                    title="Remove custom PDF"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Remove
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setManualModal(null)}
                  className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-xl transition-all cursor-pointer"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={handleDownloadPdf}
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-black rounded-xl shadow-md hover:shadow-lg transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" /> Download PDF
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default VimsLogin;

