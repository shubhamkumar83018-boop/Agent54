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
  const { login } = useAuth();
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
      const res = await login(activeEmp, activePass);

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
      setErrorMsg(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden flex flex-col font-sans select-none bg-slate-950">
      
      {/* ── BACKGROUND VIDEO ── */}
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        className="absolute inset-0 w-full h-full object-cover z-0 filter brightness-90 contrast-105"
      >
        <source src="/login_page_bg.mp4" type="video/mp4" />
        <source src="/video.mp4" type="video/mp4" />
      </video>

      {/* Dark overlay for contrast */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/70 via-slate-900/60 to-slate-950/80 z-0"></div>

      {/* ── TOP HEADER ── */}
      <header className="relative z-10 w-full px-6 py-4 flex items-center justify-between border-b border-white/10 bg-slate-950/40 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-extrabold text-2xl shadow-lg border border-blue-400/40">
            V
          </div>
          <div>
            <h1 className="text-lg font-black tracking-wide text-red-500 leading-none">VIGNAN'S</h1>
            <p className="text-[10px] text-slate-300 font-semibold leading-tight mt-0.5">
              Foundation for Science, Technology & Research
            </p>
          </div>
        </div>

        {/* Accreditation Coins */}
        <div className="hidden sm:flex items-center gap-2">
          {['/badge_naac.png', '/badge_nirf.png', '/badge_nba.png', '/badge_aicte.png', '/badge_ugccare.png', '/badge_abet.png'].map((src, idx) => (
            <div key={idx} className="w-8 h-8 rounded-full bg-white/90 p-1 border border-white/30 shadow-md flex items-center justify-center hover:scale-110 transition-transform cursor-pointer">
              <img src={src} alt="badge" className="w-full h-full object-contain" />
            </div>
          ))}
        </div>
      </header>

      {/* ── MAIN LOGIN SECTION (MATCHING IMAGE 2) ── */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-[500px] bg-slate-900/80 backdrop-blur-xl border border-white/20 rounded-3xl p-6 sm:p-8 shadow-2xl text-white">
          
          {/* Header text */}
          <div className="mb-6 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-[11px] font-black tracking-wider uppercase mb-2">
              <ShieldCheck className="w-3.5 h-3.5" /> VFSTR Portal Authentication
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight">Sign In To Workspace</h2>
            <p className="text-xs text-slate-300 font-medium mt-1">Enter your credentials and security grid values to proceed.</p>
          </div>

          {/* Feedback messages */}
          {errorMsg && (
            <div className="mb-4 p-3 rounded-xl bg-red-500/20 border border-red-500/40 text-red-200 text-xs font-bold text-center animate-in fade-in">
              {errorMsg}
            </div>
          )}
          {successMsg && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-200 text-xs font-bold text-center flex items-center justify-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> {successMsg}
            </div>
          )}

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            
            {/* Top Row: EMPCODE & PASSWORD (Matching Image 2) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-black tracking-widest text-slate-300 uppercase mb-1.5">
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
                    className="w-full bg-white/10 border border-white/20 rounded-xl pl-9 pr-3 py-2 text-xs font-bold text-white placeholder-slate-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-500/30 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black tracking-widest text-slate-300 uppercase mb-1.5">
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
                    className="w-full bg-white/10 border border-white/20 rounded-xl pl-9 pr-3 py-2 text-xs font-bold text-white placeholder-slate-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-500/30 transition-all"
                  />
                </div>
              </div>
            </div>

            {/* GRID VALUES Card (Matching Image 2) */}
            <div className="bg-white/10 border border-white/20 rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <Grid className="w-4 h-4 text-blue-400" />
                <span className="text-[11px] font-black tracking-widest text-slate-200 uppercase">
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
                  className="w-28 text-center bg-white/15 border border-white/25 rounded-xl py-2 text-sm font-black text-white placeholder-slate-400 focus:outline-none focus:border-blue-400 transition-all"
                />
                <span className="w-5 h-0.5 bg-slate-400 rounded-full flex-shrink-0"></span>
                <input
                  type="text"
                  maxLength={3}
                  value={gridVal2}
                  onChange={(e) => setGridVal2(e.target.value.replace(/\D/g, ''))}
                  placeholder="456"
                  className="w-28 text-center bg-white/15 border border-white/25 rounded-xl py-2 text-sm font-black text-white placeholder-slate-400 focus:outline-none focus:border-blue-400 transition-all"
                />
              </div>
            </div>

            {/* SIGN IN TO WORKSPACE -> Dark Navy Button (Matching Image 2) */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-slate-950 via-blue-950 to-indigo-950 hover:from-blue-900 hover:to-indigo-900 text-white font-black text-xs uppercase tracking-widest rounded-2xl shadow-xl border border-blue-400/30 flex items-center justify-center gap-2.5 transition-all duration-200 cursor-pointer hover:scale-[1.01] active:scale-95 disabled:opacity-50"
            >
              <span>{loading ? 'AUTHENTICATING...' : 'SIGN IN TO WORKSPACE'}</span>
              <ArrowRight className="w-4 h-4 text-blue-400" />
            </button>

            {/* Sub-links (Forgot Password? | Reset Grid Values) */}
            <div className="flex items-center justify-center gap-3 text-[11px] font-extrabold text-slate-300 pt-1">
              <button
                type="button"
                onClick={() => setErrorMsg('Reset link sent to your institutional email.')}
                className="hover:text-blue-300 transition-colors cursor-pointer"
              >
                Forgot Password?
              </button>
              <span className="w-1 h-3 bg-slate-500 rounded-full"></span>
              <button
                type="button"
                onClick={() => { setGridVal1('123'); setGridVal2('456'); }}
                className="hover:text-blue-300 transition-colors cursor-pointer"
              >
                Reset Grid Values
              </button>
            </div>

            {/* Quick Demo Credentials */}
            <div className="p-3 bg-white/5 border border-white/10 rounded-xl text-center">
              <p className="text-[10px] font-black text-blue-300 uppercase tracking-widest mb-1.5">Quick Demo Fill</p>
              <button
                type="button"
                onClick={() => { setEmpCode('VIGNAN_ADMIN'); setPassword('vignan123'); setGridVal1('123'); setGridVal2('456'); }}
                className="px-3 py-1 bg-blue-600/40 hover:bg-blue-600/60 border border-blue-400/40 rounded-lg text-[11px] font-extrabold text-white transition-all cursor-pointer inline-flex items-center gap-1"
              >
                <Sparkles className="w-3 h-3 text-amber-300" /> Auto-Fill Admin (VIGNAN_ADMIN)
              </button>
            </div>

            {/* Bottom Manual Buttons: DEO MANUAL & FACULTY MANUAL (Matching Image 2) */}
            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-white/15 text-xs font-black text-slate-200">
              <button
                type="button"
                onClick={() => alert('DEO Manual PDF downloading...')}
                className="flex items-center justify-center gap-2 py-2.5 px-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl transition-all cursor-pointer hover:border-blue-400"
              >
                <BookOpen className="w-4 h-4 text-blue-300" />
                <span>DEO MANUAL</span>
              </button>
              <button
                type="button"
                onClick={() => alert('Faculty Manual PDF downloading...')}
                className="flex items-center justify-center gap-2 py-2.5 px-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl transition-all cursor-pointer hover:border-emerald-400"
              >
                <GraduationCap className="w-4 h-4 text-emerald-300" />
                <span>FACULTY MANUAL</span>
              </button>
            </div>

          </form>

        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-3 text-center text-[10px] font-bold text-slate-400 border-t border-white/10 bg-slate-950/60 backdrop-blur-md">
        © 2026 Vignan's Foundation for Science, Technology & Research (Deemed to be University) • All Rights Reserved
      </footer>
    </div>
  );
};

export default VimsLogin;
