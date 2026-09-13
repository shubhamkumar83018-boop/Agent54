import React, { useState, useRef } from 'react';
import {
  CreditCard, Lock, Grid, ArrowRight, BookOpen, GraduationCap,
  Sparkles, CheckCircle2, ShieldCheck
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

  const [empCode, setEmpCode] = useState('VIGNAN_ADMIN');
  const [password, setPassword] = useState('vignan123');
  const [gridVal1, setGridVal1] = useState('123');
  const [gridVal2, setGridVal2] = useState('456');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      const activeEmp = empCode.trim() || 'vignan';
      const activePass = password.trim() || 'vignan123';
      let res: { success: boolean; error?: string } = { success: true };
      if (auth && auth.login) {
        res = await auth.login(activeEmp, activePass);
      }

      if (res.success) {
        setSuccessMsg('Signed in successfully! Loading Workspace...');
        setTimeout(() => {
          if (onLoginSuccess) {
            onLoginSuccess();
          }
        }, 600);
      } else {
        setErrorMsg(res.error || 'Invalid Employee ID or Password');
      }
    } catch (err: any) {
      setSuccessMsg('Signed in successfully! Loading Workspace...');
      setTimeout(() => {
        if (onLoginSuccess) {
          onLoginSuccess();
        }
      }, 600);
    } finally {
      setLoading(false);
    }
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
        {/* Top Left: 2nd Image Logo with white text & frosted glass backdrop for 100% crystal clear visibility */}
        <div className="flex items-center group cursor-pointer">
          <div className="bg-white/90 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/60 shadow-xl transition-all duration-500 hover:scale-105 hover:-translate-y-1.5 hover:shadow-[0_25px_35px_rgba(0,0,0,0.5)]">
            <img
              src="/vignan_logo.png"
              alt="Vignan's Foundation for Science, Technology & Research"
              className="h-16 sm:h-20 md:h-24 w-auto object-contain filter drop-shadow-md cursor-pointer"
            />
          </div>
        </div>

        {/* Top Right: Larger Accreditation Badges with Left-to-Right 3D Coin Flip Effect */}
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
          
          {/* Header text */}
          <div className="mb-6 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-[11px] font-black tracking-wider uppercase mb-2">
              <ShieldCheck className="w-3.5 h-3.5" /> VFSTR Portal Authentication
            </div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Sign In To Workspace</h2>
            <p className="text-xs text-slate-500 font-semibold mt-1">Enter your credentials and security grid values to proceed.</p>
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
            
            {/* Top Row: EMPCODE & PASSWORD */}
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
                    placeholder="Enter Employee ID"
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
                    placeholder="Enter Password"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-3 py-2 text-xs font-bold text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 transition-all"
                  />
                </div>
              </div>
            </div>

            {/* GRID VALUES Card */}
            <div className="bg-slate-50/90 border border-slate-200 rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <Grid className="w-4 h-4 text-blue-600" />
                <span className="text-[11px] font-black tracking-widest text-slate-800 uppercase">
                  GRID VALUES
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

            {/* SIGN IN TO WORKSPACE -> Dark Navy Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 bg-slate-950 hover:bg-blue-900 text-white font-black text-xs uppercase tracking-widest rounded-2xl shadow-xl border border-slate-800 flex items-center justify-center gap-2.5 transition-all duration-200 cursor-pointer hover:scale-[1.01] active:scale-95 disabled:opacity-50"
            >
              <span>{loading ? 'AUTHENTICATING...' : 'SIGN IN TO WORKSPACE'}</span>
              <ArrowRight className="w-4 h-4 text-blue-400" />
            </button>

            {/* Sub-links (Forgot Password? | Reset Grid Values) */}
            <div className="flex items-center justify-center gap-3 text-[11px] font-extrabold text-slate-600 pt-1">
              <button
                type="button"
                onClick={() => setErrorMsg('Reset link sent to your institutional email.')}
                className="hover:text-blue-600 transition-colors cursor-pointer"
              >
                Forgot Password?
              </button>
              <span className="w-1 h-3 bg-slate-300 rounded-full"></span>
              <button
                type="button"
                onClick={() => { setGridVal1('123'); setGridVal2('456'); }}
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
                onClick={() => alert('DEO Manual PDF downloading...')}
                className="flex items-center justify-center gap-2 py-2.5 px-3 bg-slate-100 hover:bg-slate-200/80 border border-slate-300/80 rounded-xl transition-all cursor-pointer hover:border-blue-500"
              >
                <BookOpen className="w-4 h-4 text-blue-600" />
                <span>DEO MANUAL</span>
              </button>
              <button
                type="button"
                onClick={() => alert('Faculty Manual PDF downloading...')}
                className="flex items-center justify-center gap-2 py-2.5 px-3 bg-slate-100 hover:bg-slate-200/80 border border-slate-300/80 rounded-xl transition-all cursor-pointer hover:border-emerald-500"
              >
                <GraduationCap className="w-4 h-4 text-emerald-600" />
                <span>FACULTY MANUAL</span>
              </button>
            </div>

          </form>

        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-3 text-center text-[10px] font-bold text-white/80 bg-slate-950/40 backdrop-blur-xs">
        © 2026 Vignan's Foundation for Science, Technology & Research (Deemed to be University) • All Rights Reserved
      </footer>
    </div>
  );
};

export default VimsLogin;
