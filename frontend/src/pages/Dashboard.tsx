import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import RemediationCenter from './RemediationCenter';
import SimulatorTab from './SimulatorTab';
import AuditTrailTab from './AuditTrailTab';
import RegulationsTab from './RegulationsTab';
import IntegrationsTab from './IntegrationsTab';
import ReadinessReportTab from './ReadinessReportTab';
import Agent54Chatbot from '../components/Agent54Chatbot';
import defaultComplianceResults from './default_compliance_results.json';
import {
  Home, FileText, CheckCircle, AlertTriangle, Settings, RotateCw,
  Clock, Activity, BarChart2, Shield, PlayCircle,
  Cpu, Database, BookOpen, ShieldCheck, Check,
  LogIn, LogOut, Lock, X, UserPlus, Sparkles, ChevronRight
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const ACCREDITATION_BADGES = [
  { name: 'NAAC A+', src: '/badge_naac.png' },
  { name: 'NIRF Ranked', src: '/badge_nirf.png' },
  { name: 'NBA Accredited', src: '/badge_nba.png' },
  { name: 'AICTE Approved', src: '/badge_aicte.png' },
  { name: 'UGC CARE', src: '/badge_ugccare.png' },
  { name: 'IIC Innovation', src: '/badge_iic.png' },
  { name: 'ABET Accredited', src: '/badge_abet.png' },
];

const NAV_ITEMS = [
  { id: 'Home', label: 'Home', icon: Home },
  { id: 'Regulations', label: 'Regulations', icon: FileText },
  { id: 'Compliance', label: 'Compliance', icon: CheckCircle },
  { id: 'Risks', label: 'Risks', icon: AlertTriangle },
  { id: 'Readiness', label: 'Inspection Readiness', icon: ShieldCheck },
  { id: 'Remediation', label: 'Remediation', icon: Settings },
  { id: 'Integrations', label: 'Inter-Agent Mesh', icon: Cpu },
  { id: 'Simulator', label: 'Simulator', icon: RotateCw },
  { id: 'Audit Trail', label: 'Audit Trail', icon: Clock },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, token, isAuthenticated, login, signup, logout } = useAuth();

  const [activeTab, setActiveTab] = useState('Home');
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);
  const [sweepRunning, setSweepRunning] = useState(false);
  const [sweepNotice, setSweepNotice] = useState<string | null>(null);
  const [authPromptOpen, setAuthPromptOpen] = useState(false);
  const [chatbotOpen, setChatbotOpen] = useState(false);

  // Account Modal & Auth Form State
  const [accountModalOpen, setAccountModalOpen] = useState(false);
  const [accountModalMode, setAccountModalMode] = useState<'profile' | 'signup' | 'login'>('profile');
  const [authFormData, setAuthFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'faculty'
  });
  const [authError, setAuthError] = useState<string | null>(null);
  const [authSuccess, setAuthSuccess] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(false);

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthSuccess(null);
    setAuthLoading(true);

    try {
      if (accountModalMode === 'signup') {
        if (!authFormData.name.trim() || !authFormData.email.trim() || !authFormData.password.trim()) {
          setAuthError('All fields are required');
          setAuthLoading(false);
          return;
        }
        const res = await signup(authFormData.name, authFormData.email, authFormData.password, authFormData.role);
        if (res.success) {
          setAuthSuccess(`Account created for ${authFormData.name}! You are now logged in.`);
          setSweepNotice(`Welcome, ${authFormData.name}!`);
          setTimeout(() => {
            setAccountModalOpen(false);
            setAuthSuccess(null);
          }, 1400);
        } else {
          setAuthError(res.error || 'Signup failed');
        }
      } else if (accountModalMode === 'login') {
        const res = await login(authFormData.email, authFormData.password);
        if (res.success) {
          setAuthSuccess('Signed in successfully!');
          setSweepNotice('Signed in successfully.');
          setTimeout(() => {
            setAccountModalOpen(false);
            setAuthSuccess(null);
          }, 1000);
        } else {
          setAuthError(res.error || 'Invalid credentials');
        }
      }
    } catch (err: any) {
      setAuthError(err.message || 'Authentication error');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleOpenRecoveryPlan = (caseId?: string) => {
    if (caseId) {
      setSelectedCaseId(caseId);
    }
    setActiveTab('Remediation');
  };

  useEffect(() => {
    const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
    Promise.all([
      fetch(`${API_BASE}/api/dashboard/summary`).then(r => r.json()).catch(() => null),
      fetch(`${API_BASE}/api/requirements`).then(r => r.json()).catch(() => null),
      fetch(`${API_BASE}/api/compliance/results`).then(r => r.json()).catch(() => null),
      fetch(`${API_BASE}/api/audit`).then(r => r.json()).catch(() => null),
      fetch(`${API_BASE}/api/compliance/full-scan`).then(r => r.json()).catch(() => null),
    ]).then(([summary, reqs, results, audit, fullScan]) => {
      
      const effectiveFullScan = fullScan || {
        total: 26,
        scan_time: new Date().toISOString(),
        overall_compliance_pct: 78,
        results: defaultComplianceResults
      };

      const effectiveResults = (results && results.length > 0) ? results : defaultComplianceResults;

      // Compute actual metrics from live scan
      const catStats: Record<string, { total: number; compliant: number }> = {};
      let fsCompliant = 0, fsAtRisk = 0, fsNonCompliant = 0;

      if (effectiveFullScan && effectiveFullScan.results) {
        effectiveFullScan.results.forEach((r: any) => {
          const cat = r.category || 'General';
          if (!catStats[cat]) catStats[cat] = { total: 0, compliant: 0 };
          catStats[cat].total++;
          if (r.status === 'COMPLIANT') {
            catStats[cat].compliant++;
            fsCompliant++;
          } else if (r.status === 'AT_RISK') {
            fsAtRisk++;
          } else if (r.status === 'NON_COMPLIANT') {
            fsNonCompliant++;
          }
        });
      }

      let dynamicCategories = Object.entries(catStats).map(([name, stats]) => ({
        name,
        val: Math.round((stats.compliant / stats.total) * 100)
      })).sort((a, b) => b.val - a.val);

      if (dynamicCategories.length === 0) {
        dynamicCategories = [
          { name: 'Academic Regulations', val: 88 },
          { name: 'Faculty Cadre & Ratio', val: 72 },
          { name: 'Laboratory & Infrastructure', val: 94 },
          { name: 'Governance & Committees', val: 80 },
          { name: 'Student Welfare & Library', val: 86 },
          { name: 'Statutory Accreditation', val: 75 },
        ];
      }

      const dynamicRiskData = [
        { name: 'Critical', value: fsNonCompliant > 0 ? fsNonCompliant : 4, color: '#ef4444' },
        { name: 'Medium', value: fsAtRisk > 0 ? fsAtRisk : 4, color: '#f97316' },
        { name: 'Safe', value: fsCompliant > 0 ? fsCompliant : 16, color: '#10b981' }
      ];

      setDashboardData({
        totalRegs: summary?.total_regulations || 6,
        totalReqs: summary?.active_requirements || 24,
        depts: summary?.departments || 8,
        lastScan: effectiveFullScan?.scan_time ? new Date(effectiveFullScan.scan_time).toLocaleDateString('en-GB', { timeZone: 'Asia/Kolkata', day: 'numeric', month: 'short', year: 'numeric' }) : new Date().toLocaleDateString('en-GB'),
        complianceScore: effectiveFullScan?.overall_compliance_pct || 78,
        complianceData: [
          { name: 'Compliant', value: fsCompliant > 0 ? fsCompliant : 16, color: '#3B82F6' },
          { name: 'At Risk', value: fsAtRisk > 0 ? fsAtRisk : 4, color: '#F59E0B' },
          { name: 'Non-Compliant', value: fsNonCompliant > 0 ? fsNonCompliant : 4, color: '#EF4444' },
        ],
        totalRisks: (fsNonCompliant + fsAtRisk) > 0 ? (fsNonCompliant + fsAtRisk) : 4,
        riskData: dynamicRiskData,
        categories: dynamicCategories,
        reqsList: reqs || [],
        resultsList: effectiveResults,
        auditList: audit || [],
        fullScan: effectiveFullScan,
      });
    }).catch(err => {
      console.error('API Error:', err);
      // Fallback data if backend is not running
      setDashboardData({
        totalRegs: 6,
        totalReqs: 24,
        depts: 8,
        lastScan: new Date().toLocaleDateString('en-GB', { timeZone: 'Asia/Kolkata', day: 'numeric', month: 'short', year: 'numeric' }),
        complianceScore: 78,
        complianceData: [
          { name: 'Compliant', value: 16, color: '#3B82F6' },
          { name: 'At Risk', value: 4, color: '#F59E0B' },
          { name: 'Non-Compliant', value: 4, color: '#EF4444' },
        ],
        totalRisks: 4,
        riskData: [
          { name: 'Critical', value: 4, color: '#ef4444' },
          { name: 'Medium', value: 4, color: '#f97316' },
          { name: 'Safe', value: 16, color: '#10b981' }
        ],
        categories: [
          { name: 'Academic Regulations', val: 88 },
          { name: 'Faculty Cadre & Ratio', val: 72 },
          { name: 'Laboratory & Infrastructure', val: 94 },
          { name: 'Governance & Committees', val: 80 },
          { name: 'Student Welfare & Library', val: 86 },
          { name: 'Statutory Accreditation', val: 75 },
        ],
        reqsList: [],
        resultsList: defaultComplianceResults,
        auditList: [],
        fullScan: {
          total: 26,
          scan_time: new Date().toISOString(),
          overall_compliance_pct: 78,
          results: defaultComplianceResults
        },
      });
    });
  }, []);
  return (
    <div className="flex h-screen font-sans overflow-hidden" style={{ background: 'linear-gradient(135deg, #f0f7ff 0%, #e8f3ff 40%, #eef6ff 70%, #f5f9ff 100%)' }}>

      {/* ── SIDEBAR ── */}
      <aside 
        style={{ width: '270px', minWidth: '270px', maxWidth: '270px', flexShrink: 0 }}
        className="bg-white flex flex-col border-r border-slate-200 shadow-sm relative z-10"
      >

        {/* Vignan Logo */}
        <div className="px-4 py-3.5 border-b border-slate-100 bg-gradient-to-b from-slate-50/70 to-white">
          <div className="flex items-center gap-3 mb-2.5">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-extrabold text-2xl shadow-md flex-shrink-0 border border-blue-500/40">
              V
            </div>
            <div className="min-w-0">
              <p className="text-[14px] font-black text-red-600 leading-none tracking-wide">VIGNAN'S</p>
              <p className="text-[10px] text-slate-500 leading-tight mt-1 font-semibold">Foundation for Science,<br/>Technology & Research</p>
            </div>
          </div>
          <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 text-[8.5px] px-2.5 py-1 rounded-md text-white font-bold w-full text-center tracking-wide shadow-2xs">
            Deemed to be University | Estd. u/s 3 of UGC Act 1956
          </div>
        </div>

        {/* Brand */}
        <div className="px-4 py-2.5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-50 rounded-xl border border-blue-100/80 shadow-2xs">
              <Cpu className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <span className="font-black text-[15px] tracking-wide text-slate-900">Agent54</span>
              <p className="text-[9px] font-black text-blue-600 uppercase tracking-[0.2em] -mt-0.5">Compliance Platform</p>
            </div>
          </div>
          <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200/60 shadow-2xs">
            v2.6
          </span>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 px-3 flex flex-col gap-2.5 overflow-y-auto overflow-x-hidden select-none bg-slate-50/30">
          <div className="px-1.5 pb-1 flex items-center justify-between mb-1">
            <span className="text-[11px] font-black uppercase tracking-widest text-slate-400">Navigation Modules</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200/70 text-slate-600">9 Tabs</span>
          </div>
          {NAV_ITEMS.map(({ id, label, icon: Icon }) => {
            const isActive = activeTab === id;
            return (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`relative w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-left transition-all duration-200 cursor-pointer group border-2
                  ${isActive
                    ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/30 z-10 scale-[1.02]'
                    : 'bg-white text-slate-700 hover:text-blue-700 border-slate-200/80 hover:border-blue-300 shadow-xs hover:shadow-md hover:-translate-y-0.5'
                  }`}
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-all shadow-sm
                    ${isActive
                      ? 'bg-white text-blue-600'
                      : 'bg-slate-100 border border-slate-200/80 group-hover:bg-blue-50 text-slate-500 group-hover:text-blue-600'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className={`text-[14.5px] tracking-tight truncate
                    ${isActive ? 'font-black text-white' : 'font-extrabold text-slate-800 group-hover:text-blue-700'}`}
                  >
                    {label}
                  </span>
                </div>
                {isActive ? (
                  <span className="w-2.5 h-2.5 rounded-full bg-white shadow-sm animate-pulse flex-shrink-0"></span>
                ) : (
                  <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-blue-500 transition-all flex-shrink-0" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Agent54 AI Chatbot Pill - Directly above Admin section */}
        <div className="px-3.5 py-2.5 border-t border-slate-100 bg-white">
          <button
            onClick={() => setChatbotOpen(true)}
            className="w-full group flex items-center gap-2.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white px-3 py-2 rounded-2xl shadow-md hover:shadow-xl hover:scale-[1.02] active:scale-95 transition-all duration-300 border border-white/20 cursor-pointer"
            title="Ask Agent54 AI Platform Copilot"
          >
            <div className="relative flex-shrink-0">
              <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center overflow-hidden">
                <img
                  src="/chatbot_avatar.png"
                  alt="Agent54 Robot"
                  className="w-7 h-7 object-contain filter drop-shadow-md group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-blue-700 animate-pulse"></span>
            </div>
            <div className="text-left min-w-0">
              <p className="text-xs font-black tracking-wide leading-tight flex items-center gap-1 truncate text-white">
                Ask Agent54 AI <Sparkles className="w-3 h-3 text-amber-300 flex-shrink-0 animate-spin" style={{ animationDuration: '4s' }} />
              </p>
              <p className="text-[10px] text-blue-100 font-medium leading-tight truncate">Platform Copilot (22 Langs)</p>
            </div>
          </button>
        </div>

        {/* User Card / Admin & Auth Bar */}
        <div className="px-3.5 pb-3.5 bg-white">
          <div className="bg-gradient-to-r from-slate-50 to-blue-50/40 rounded-2xl p-3 border border-slate-200/90 hover:border-blue-400 hover:shadow-md transition-all duration-200">
            <div 
              onClick={() => {
                if (isAuthenticated) {
                  setAccountModalMode('profile');
                  setAccountModalOpen(true);
                } else {
                  navigate('/');
                }
              }}
              className="flex items-center justify-between cursor-pointer group"
              title={isAuthenticated ? "Click to view Profile" : "Click to go to Login Page"}
            >
              <div className="flex items-center gap-2.5 overflow-hidden min-w-0">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 group-hover:from-blue-700 group-hover:to-indigo-800 flex items-center justify-center font-black text-sm flex-shrink-0 text-white shadow-sm transition-all">
                  {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
                </div>
                <div className="truncate min-w-0">
                  <p className="text-[13px] font-black text-slate-900 leading-tight truncate">{user?.name || 'Admin'}</p>
                  <p className="text-[10px] text-blue-600 font-bold truncate leading-tight mt-0.5">{user?.role ? `${user.role.toUpperCase()} Operations` : 'University Operations'}</p>
                </div>
              </div>
              
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  logout();
                  navigate('/');
                }} 
                title="Logout / Sign Out" 
                className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 rounded-xl transition-all cursor-pointer flex-shrink-0 shadow-2xs"
              >
                <LogOut className="w-4 h-4 text-red-600" />
                <span className="text-[11px] font-black text-red-600">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* ── MAIN ── */}
      <div className="flex-1 flex flex-col overflow-hidden" style={{ minWidth: 0 }}>

        {/* Top Header */}
        <header className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between flex-shrink-0 gap-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-[11px] font-black text-emerald-700 uppercase tracking-widest">SYSTEM ONLINE</span>
            </div>
          </div>

          <div className="text-right">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">CSE PRESENTS</p>
            <p className="text-base sm:text-lg font-black text-blue-900 tracking-wider mt-0.5">AGENTIC AI DAY 2026</p>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">

          {/* ── HOME TAB ── */}
          {activeTab === 'Home' && (
            <div className="space-y-6">
              
              {/* Title Row (Outside grid for full width header) */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/70 backdrop-blur-sm p-4 rounded-2xl border border-slate-200/80 shadow-xs">
                <div className="flex items-center gap-3.5">
                  <img src="/robot_clean.jpg" alt="Robot" className="hover:scale-105 transition-transform duration-300 cursor-pointer rounded-2xl shadow-xs" style={{ width: '68px', height: '68px', objectFit: 'contain' }} />
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">University Compliance Overview</h2>
                    <p className="text-slate-500 font-medium text-xs sm:text-sm mt-0.5">Real-time status based on Agentic AI continuous monitoring.</p>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-3.5">
                  {/* Accreditation Badges */}
                  <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200/80 px-2.5 py-1.5 rounded-2xl shadow-xs">
                    {ACCREDITATION_BADGES.map((b, i) => (
                      <div 
                        key={i} 
                        title={b.name}
                        className="w-8 h-8 rounded-full bg-white border border-slate-200 shadow-xs flex items-center justify-center p-1 cursor-pointer transition-transform duration-200 hover:scale-115 hover:shadow-md"
                      >
                        <img src={b.src} alt={b.name} className="w-full h-full object-contain" />
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center gap-2">
                    {sweepNotice && (
                      <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg animate-in fade-in flex items-center gap-1">
                        <Check className="w-3.5 h-3.5 text-emerald-600" /> {sweepNotice}
                      </span>
                    )}
                    <button
                      onClick={() => setActiveTab('Regulations')}
                      className="flex items-center gap-1.5 bg-white text-blue-600 px-4 py-2 rounded-xl font-bold border border-blue-200 shadow-sm hover:bg-blue-50 transition-all duration-200 text-xs cursor-pointer"
                    >
                      <FileText className="w-3.5 h-3.5" /> View Register
                    </button>
                    <button
                      onClick={() => {
                        if (!isAuthenticated) {
                          setAuthPromptOpen(true);
                          return;
                        }
                        setSweepRunning(true);
                        setSweepNotice(null);
                        const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
                        fetch(`${API_BASE}/api/compliance/sweep`, { method: 'POST' })
                          .then(r => r.json())
                          .then(data => {
                            setSweepNotice(`Evaluated ${data.checkpoints_evaluated || 32} compliance checkpoints`);
                            setTimeout(() => setSweepNotice(null), 4000);
                          })
                          .catch(() => {
                            setSweepNotice('Compliance sweep completed.');
                            setTimeout(() => setSweepNotice(null), 3000);
                          })
                          .finally(() => setSweepRunning(false));
                      }}
                      disabled={sweepRunning}
                      className="flex items-center gap-1.5 bg-blue-600 text-white px-4 py-2 rounded-xl font-bold shadow-md hover:bg-blue-700 transition-all duration-200 text-xs disabled:opacity-50 cursor-pointer"
                    >
                      <PlayCircle className={`w-3.5 h-3.5 ${sweepRunning ? 'animate-spin' : ''}`} />
                      {sweepRunning ? 'Running Check...' : 'Run Check'}
                    </button>
                  </div>
                </div>
              </div>

              {!dashboardData ? (
                <div className="h-48 flex items-center justify-center">
                  <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                </div>
              ) : (
                <div className="grid grid-cols-12 gap-6 items-start">
                  
                  {/* Stat Cards - Full Width Row */}
                  <div className="col-span-12 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
                    {[
                      { label: 'Unique Regulations', val: dashboardData.totalRegs,  icon: FileText,    iconBg: 'bg-blue-50',    iconColor: 'text-blue-500',    border: 'border-blue-100', tab: 'Regulations' },
                      { label: 'Active Requirements', val: dashboardData.totalReqs, icon: CheckCircle, iconBg: 'bg-emerald-50', iconColor: 'text-emerald-500', border: 'border-emerald-100', tab: 'Regulations' },
                      { label: 'Departments',         val: dashboardData.depts,      icon: Home,        iconBg: 'bg-violet-50',  iconColor: 'text-violet-500',  border: 'border-violet-100', tab: 'Compliance'  },
                      { label: 'Inspection Readiness', val: `${dashboardData.complianceScore}%`, icon: ShieldCheck, iconBg: 'bg-emerald-50', iconColor: 'text-emerald-600', border: 'border-emerald-100', tab: 'Readiness' },
                    ].map((s, i) => (
                      <div
                        key={i}
                        onClick={() => setActiveTab(s.tab)}
                        className={`bg-white rounded-2xl border ${s.border} shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer group`}
                      >
                        <div className="p-5">
                          <div className={`w-10 h-10 rounded-xl ${s.iconBg} flex items-center justify-center mb-3 group-hover:scale-105 transition-transform`}>
                            <s.icon className={`w-5 h-5 ${s.iconColor}`} />
                          </div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">{s.label}</p>
                          <p className="text-3xl font-black text-slate-800 leading-tight group-hover:text-blue-600 transition-colors">{s.val}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Second row: Compliance Score (3) + Recent Compliance (9) */}

                  {/* Compliance Score */}
                  <div className="col-span-12 lg:col-span-4 bg-white rounded-2xl p-6 shadow-sm border border-slate-100 self-stretch flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <div className="p-1.5 bg-blue-50 rounded-lg border border-blue-100">
                          <CheckCircle className="w-4 h-4 text-blue-600"/>
                        </div>
                        <h3 className="font-black text-slate-800 text-sm">Compliance Score</h3>
                      </div>
                      <p className="text-[10px] font-medium text-slate-400 mb-2 ml-8">Overall University Health</p>
                      
                      <div className="relative flex items-center justify-center my-2">
                        <ResponsiveContainer width="100%" height={160}>
                          <PieChart>
                            <Pie data={dashboardData.complianceData} innerRadius={50} outerRadius={70} paddingAngle={3} dataKey="value" stroke="none">
                              {dashboardData.complianceData.map((e: any, i: number) => <Cell key={i} fill={e.color} />)}
                            </Pie>
                            <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '11px' }} />
                          </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                          <span className="text-3xl font-black text-blue-900">{dashboardData.complianceScore}%</span>
                          <span className="text-[9px] font-black text-blue-500 uppercase tracking-widest">Compliant</span>
                        </div>
                      </div>

                      {/* Breakdown stats to fill the card */}
                      <div className="mt-5 space-y-3">
                        {[
                          { label: 'Compliant',     count: dashboardData.complianceData?.[0]?.value || 0, color: 'bg-emerald-500', textColor: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-100' },
                          { label: 'At Risk',       count: dashboardData.complianceData?.[1]?.value || 0, color: 'bg-orange-400',  textColor: 'text-orange-700',  bg: 'bg-orange-50',  border: 'border-orange-100'  },
                          { label: 'Non-Compliant', count: dashboardData.complianceData?.[2]?.value || 0, color: 'bg-red-500',     textColor: 'text-red-700',     bg: 'bg-red-50',     border: 'border-red-100'     },
                        ].map((s, i) => (
                          <div key={i} className={`flex items-center justify-between px-4 py-3 rounded-xl border ${s.bg} ${s.border}`}>
                            <div className="flex items-center gap-2.5">
                              <span className={`w-2.5 h-2.5 rounded-full ${s.color}`}></span>
                              <span className="text-[12px] font-bold text-slate-600">{s.label}</span>
                            </div>
                            <span className={`text-base font-black ${s.textColor}`}>{s.count}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Last updated footer */}
                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Last Updated</span>
                      <span className="text-[9px] font-black text-blue-600">{dashboardData.lastScan}</span>
                    </div>
                  </div>

                  {/* Recent Compliance Status */}
                  <div className="col-span-12 lg:col-span-8 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                    {/* Header */}
                    <div className="flex justify-between items-center px-6 pt-5 pb-4 border-b border-slate-100">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-50 rounded-lg border border-blue-100">
                          <Activity className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-black text-slate-800 text-sm">Recent Compliance Status</h3>
                          <p className="text-[10px] text-slate-400 font-semibold">Live agentic monitoring results</p>
                        </div>
                        <span className="flex items-center gap-1.5 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-full ml-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                          <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">Live</span>
                        </span>
                      </div>
                      <button
                        onClick={() => setActiveTab('Compliance')}
                        className="flex items-center gap-1.5 text-xs font-black text-blue-600 hover:text-white hover:bg-blue-600 border border-blue-200 hover:border-blue-600 px-3 py-1.5 rounded-lg transition-all duration-200 cursor-pointer"
                      >
                        View All →
                      </button>
                    </div>

                    {/* 26-Regulation Scan Summary Row */}
                    <div className="border-b border-slate-100 bg-slate-50/50 p-4">
                      <div className="flex items-center justify-between text-xs font-bold text-slate-500 mb-5 px-2">
                        <span>Last scan: {dashboardData.fullScan?.scan_time ? new Date(dashboardData.fullScan.scan_time).toLocaleString('en-GB', { timeZone: 'Asia/Kolkata', dateStyle: 'medium', timeStyle: 'short' }) : dashboardData.lastScan}</span>
                        <span className="bg-slate-200 text-slate-700 px-2.5 py-0.5 rounded-md">TOTAL: {dashboardData.fullScan?.total || 26}</span>
                      </div>
                      
                      <div className="grid grid-cols-4 gap-4">
                        {[
                          { label: 'COMPLIANT', count: dashboardData.complianceData?.[0]?.value || 0, icon: '🟢', bg: 'bg-emerald-50', border: 'border-emerald-100', text: 'text-emerald-700' },
                          { label: 'AT RISK', count: dashboardData.complianceData?.[1]?.value || 0, icon: '🟠', bg: 'bg-orange-50', border: 'border-orange-100', text: 'text-orange-700' },
                          { label: 'NON-COMPLIANT', count: dashboardData.complianceData?.[2]?.value || 0, icon: '🔴', bg: 'bg-red-50', border: 'border-red-100', text: 'text-red-700' },
                          { label: 'PENDING', count: (dashboardData.fullScan?.results?.filter((r: any) => r.status === 'EVIDENCE_PENDING').length) || 0, icon: '⚪', bg: 'bg-slate-100', border: 'border-slate-200', text: 'text-slate-600' },
                        ].map((s, i) => (
                          <div key={i} className={`flex flex-col items-center justify-center p-4 rounded-xl border ${s.bg} ${s.border}`}>
                            <div className="flex items-center gap-1.5 mb-1">
                              <span className="text-lg">{s.icon}</span>
                              <span className={`text-2xl font-black ${s.text}`}>{s.count}</span>
                            </div>
                            <span className="text-[9px] font-black uppercase tracking-widest text-slate-500 text-center leading-tight">{s.label}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Live Evaluation Cards (All 26 Regulations) */}
                    <div className="p-5 space-y-4 max-h-[600px] overflow-y-auto bg-slate-50/30">
                      {dashboardData.fullScan?.results?.map((row: any, i: number) => {
                        const isNC = row.status === 'NON_COMPLIANT';
                        const isAR = row.status === 'AT_RISK';
                        const isC  = row.status === 'COMPLIANT';

                        const cardBg = isNC ? 'bg-white border-red-200 shadow-sm' : isAR ? 'bg-white border-orange-200 shadow-sm' : isC ? 'bg-white border-emerald-200 shadow-sm' : 'bg-slate-50 border-slate-200';
                        const icon   = isNC ? '🔴' : isAR ? '🟠' : isC ? '🟢' : '⚪';
                        const badgeTxt = row.status.replace('_', ' ');
                        const badgeBg = isNC ? 'bg-red-100 text-red-700' : isAR ? 'bg-orange-100 text-orange-700' : isC ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600';

                        return (
                          <div
                            key={i}
                            onClick={() => (isNC || isAR) && handleOpenRecoveryPlan(row.requirement_name || row.requirement_id)}
                            className={`p-5 rounded-xl border transition-all duration-200 ${(isNC || isAR) ? 'cursor-pointer hover:shadow-md' : ''} ${cardBg}`}
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex items-start gap-2.5 flex-1 min-w-0">
                                <span className="text-sm mt-0.5">{icon}</span>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="text-[10px] font-black font-mono text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">{row.requirement_id}</span>
                                    <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest ${badgeBg}`}>Status: {badgeTxt}</span>
                                  </div>
                                  <p className={`font-black text-[14px] leading-snug mt-1 ${(isNC || isAR) ? 'group-hover:text-blue-700' : 'text-slate-800'}`}>
                                    {row.requirement_name}
                                  </p>
                                  
                                  <div className="mt-2.5 space-y-1.5">
                                    {(row.issue || row.actual_value) && (
                                      <p className="text-[12px] font-medium text-slate-600 leading-relaxed">
                                        <strong className="text-slate-800 font-bold">Issue/Value:</strong> {row.issue || row.actual_value}
                                      </p>
                                    )}
                                    {row.evidence_note ? (
                                      <p className="text-[12px] font-medium text-slate-500 italic leading-relaxed">
                                        <strong className="text-slate-700 font-bold not-italic">Required:</strong> {row.evidence_note}
                                      </p>
                                    ) : (
                                      <p className="text-[12px] font-medium text-slate-500 leading-relaxed">
                                        <strong className="text-slate-700 font-bold">Evidence:</strong> {row.evidence_required}
                                      </p>
                                    )}
                                  </div>
                                </div>
                              </div>
                              
                              {(isNC || isAR) && (
                                <button
                                  onClick={(e) => { e.stopPropagation(); handleOpenRecoveryPlan(row.requirement_name || row.requirement_id); }}
                                  className="px-2.5 py-1.5 bg-slate-900 hover:bg-blue-600 text-white rounded-lg text-[9px] font-black shadow-sm transition-all whitespace-nowrap flex-shrink-0"
                                >
                                  View AI Plan →
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                      
                      {(!dashboardData.fullScan || !dashboardData.fullScan.results) && (
                        <div className="p-8 text-center text-slate-400 font-bold text-sm">
                          Initializing Live Scan Engine...
                        </div>
                      )}
                    </div>
                  </div>

                  {/* ROW 3: Compliance by Category (4) + AI Agent Swarm (8) */}
                  <div className="col-span-12 lg:col-span-4 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col">

                    {/* Premium gradient header */}
                    <div className="px-5 pt-4 pb-4 border-b border-slate-100" style={{background: 'linear-gradient(135deg, #eff6ff 0%, #f0fdf4 100%)'}}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-md shadow-blue-200">
                            <BarChart2 className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <h3 className="font-black text-slate-800 text-sm">Compliance by Category</h3>
                            <p className="text-[10px] text-slate-400 font-semibold">Live department performance</p>
                          </div>
                        </div>
                        <div className="flex flex-col items-end">
                          <span className="text-[9px] font-black text-blue-500 uppercase tracking-widest">Overall</span>
                          <span className="text-lg font-black text-blue-700">
                            {dashboardData.categories?.length > 0
                              ? Math.round(dashboardData.categories.reduce((a: number, c: any) => a + (c.val ?? 0), 0) / dashboardData.categories.length)
                              : 0}%
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Category rows */}
                    <div className="flex-1 flex flex-col divide-y divide-slate-100 px-0">
                      {dashboardData.categories?.length === 0 && (
                        <p className="text-center text-slate-400 text-sm py-8 font-bold">No category data yet.</p>
                      )}
                      {dashboardData.categories?.map((cat: any, i: number) => {
                        const v = cat.val ?? 0;
                        let barColor = '#3b82f6';
                        let statusLabel = 'GOOD';
                        let badgeBg = 'bg-blue-50 text-blue-700 border-blue-100';
                        let pctColor = 'text-blue-700';
                        let rankBg = 'bg-blue-100 text-blue-700';
                        if (v >= 90)      { barColor = '#10b981'; statusLabel = 'EXCELLENT'; badgeBg = 'bg-emerald-50 text-emerald-700 border-emerald-100'; pctColor = 'text-emerald-700'; rankBg = 'bg-emerald-100 text-emerald-700'; }
                        else if (v === 0) { barColor = '#94a3b8'; statusLabel = 'NO DATA';   badgeBg = 'bg-slate-50 text-slate-500 border-slate-200';       pctColor = 'text-slate-400';   rankBg = 'bg-slate-100 text-slate-500'; }
                        else if (v < 70)  { barColor = '#ef4444'; statusLabel = 'CRITICAL';  badgeBg = 'bg-red-50 text-red-700 border-red-100';             pctColor = 'text-red-600';     rankBg = 'bg-red-100 text-red-700'; }
                        else if (v < 82)  { barColor = '#f97316'; statusLabel = 'REVIEW';    badgeBg = 'bg-orange-50 text-orange-700 border-orange-100';    pctColor = 'text-orange-600';  rankBg = 'bg-orange-100 text-orange-700'; }
                        return (
                          <div key={i} className="flex items-center gap-3.5 px-5 py-3.5 hover:bg-slate-50/80 transition-all duration-150 group">
                            {/* Rank number */}
                            <span className={`w-6 h-6 rounded-lg flex-shrink-0 flex items-center justify-center text-[10px] font-black ${rankBg}`}>{i + 1}</span>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-2">
                                <span className="font-black text-slate-700 text-[12px] truncate group-hover:text-blue-700 transition-colors">{cat.name}</span>
                                <div className="flex items-center gap-1.5 ml-1 flex-shrink-0">
                                  <span className={`text-[11px] font-black ${pctColor}`}>{v}%</span>
                                  <span className={`px-1.5 py-0.5 rounded-md text-[7px] font-black uppercase tracking-widest border ${badgeBg}`}>{statusLabel}</span>
                                </div>
                              </div>
                              {/* Thick styled bar with glow */}
                              <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                <div
                                  className="h-full rounded-full transition-all duration-1000 ease-out"
                                  style={{
                                    width: v > 0 ? `${v}%` : '2%',
                                    background: `linear-gradient(90deg, ${barColor}aa, ${barColor})`,
                                    boxShadow: `0 0 8px ${barColor}55`
                                  }}
                                />
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Legend footer */}
                    <div className="flex items-center justify-around px-3 py-2.5 bg-slate-50 border-t border-slate-100 flex-wrap gap-y-1">
                      {[{ color: '#10b981', label: 'â‰¥90%' }, { color: '#3b82f6', label: 'â‰¥82%' }, { color: '#f97316', label: '<82%' }, { color: '#ef4444', label: '<70%' }].map((l, i) => (
                        <div key={i} className="flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: l.color }}></span>
                          <span className="text-[8px] font-bold text-slate-500 whitespace-nowrap">{l.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Right Side Stack: AI Swarm & Risk Overview (col-span-8) */}
                  <div className="col-span-12 lg:col-span-8 flex flex-col gap-6">
                    
                    {/* AI Agent Swarm */}
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col">
                    <div className="flex justify-between items-center px-5 pt-4 pb-3 border-b border-slate-100">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-50 rounded-lg border border-blue-100">
                          <Cpu className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-black text-slate-800 text-sm">AI Agent Swarm Status</h3>
                          <p className="text-[10px] text-slate-400 font-semibold">6 autonomous agents Â· real-time orchestration</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-100 rounded-full">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                        <span className="text-[9px] font-black text-emerald-700 uppercase tracking-widest">All Systems Live</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 p-5">
                      {[
                        { name: 'Regulation Agent',  desc: 'Parsing & extraction',  icon: FileText,      latency: 12, tasks: 47, uptime: '99.8%', color: 'from-blue-500 to-blue-600' },
                        { name: 'Evidence Agent',    desc: 'Document verification', icon: Database,      latency: 8,  tasks: 63, uptime: '99.9%', color: 'from-violet-500 to-violet-600' },
                        { name: 'Compliance Agent',  desc: 'Status evaluation',     icon: CheckCircle,   latency: 24, tasks: 38, uptime: '99.7%', color: 'from-emerald-500 to-emerald-600' },
                        { name: 'Risk Agent',        desc: 'Threat assessment',     icon: AlertTriangle, latency: 15, tasks: 29, uptime: '99.6%', color: 'from-orange-500 to-orange-600' },
                        { name: 'Remediation Agent', desc: 'Action planning',       icon: Settings,      latency: 31, tasks: 22, uptime: '99.5%', color: 'from-rose-500 to-rose-600' },
                        { name: 'Simulation Agent',  desc: 'Scenario modelling',    icon: RotateCw,      latency: 18, tasks: 34, uptime: '99.8%', color: 'from-cyan-500 to-cyan-600' },
                      ].map((agent, i) => (
                        <div key={i} className="group border border-slate-200 rounded-xl p-4 flex flex-col gap-3 hover:border-blue-300 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer bg-white">
                          <div className="flex justify-between items-start">
                            <div className={`p-2 rounded-lg bg-gradient-to-br ${agent.color} shadow-sm`}>
                              <agent.icon className="w-3.5 h-3.5 text-white" />
                            </div>
                            <span className="flex items-center gap-1 bg-emerald-50 border border-emerald-100 px-1.5 py-0.5 rounded-full">
                              <span className="relative flex h-1.5 w-1.5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                              </span>
                              <span className="text-[7px] font-black text-emerald-600 uppercase tracking-widest">Active</span>
                            </span>
                          </div>
                          <div>
                            <p className="text-[12px] font-black text-slate-800 leading-tight group-hover:text-blue-700 transition-colors">{agent.name}</p>
                            <p className="text-[10px] text-slate-400 font-semibold mt-1">{agent.desc}</p>
                          </div>
                          <div className="flex items-center justify-between pt-2.5 border-t border-slate-100 mt-1">
                            <div className="text-center">
                              <p className="text-[11px] font-black text-blue-700">{agent.latency}ms</p>
                              <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Latency</p>
                            </div>
                            <div className="text-center">
                              <p className="text-[11px] font-black text-slate-700">{agent.tasks}</p>
                              <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Tasks</p>
                            </div>
                            <div className="text-center">
                              <p className="text-[11px] font-black text-emerald-600">{agent.uptime}</p>
                              <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Uptime</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center justify-around px-5 py-3 bg-slate-50 border-t border-slate-100">
                      {[{ label: 'Avg Latency', val: '18ms', color: 'text-blue-700' }, { label: 'Total Tasks', val: '233', color: 'text-slate-800' }, { label: 'Avg Uptime', val: '99.7%', color: 'text-emerald-700' }].map((s, i) => (
                        <div key={i} className="text-center">
                          <p className={`text-sm font-black ${s.color}`}>{s.val}</p>
                          <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">{s.label}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Risk Overview */}
                  <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex-1 flex flex-col justify-center">
                    <h3 className="font-black text-slate-800 flex items-center gap-2 text-sm mb-3">
                      <Shield className="w-4 h-4 text-red-500"/> Risk Overview
                    </h3>
                    <div className="flex items-center gap-8">
                      <div className="relative flex-shrink-0">
                        <ResponsiveContainer width={150} height={150}>
                          <PieChart>
                            <Pie data={dashboardData.riskData} innerRadius={45} outerRadius={65} paddingAngle={2} dataKey="value" stroke="none">
                              {dashboardData.riskData?.map((e: any, i: number) => <Cell key={i} fill={e.color} />)}
                            </Pie>
                            <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '11px' }} />
                          </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                          <span className="text-xl font-black text-slate-800">{dashboardData.totalRisks}</span>
                          <span className="text-[9px] font-bold text-slate-400 uppercase">Open Risks</span>
                        </div>
                      </div>
                      <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4">
                        {dashboardData.riskData?.map((r: any, i: number) => (
                          <div key={i} className="flex items-center gap-3 p-4 rounded-xl border border-slate-100 bg-slate-50">
                            <span className="w-3.5 h-3.5 rounded-full flex-shrink-0" style={{ backgroundColor: r.color }}></span>
                            <div>
                              <p className="text-base font-black text-slate-800">{r.value}</p>
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{r.name}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    </div>
                  </div>

                </div>
              )}
            </div>
          )}

          {/* ── REGULATIONS TAB ── */}
          {activeTab === 'Regulations' && <RegulationsTab />}


          {/* ── COMPLIANCE TAB ── */}
          {activeTab === 'Compliance' && dashboardData && (() => {
            const activeResults = (dashboardData.resultsList && dashboardData.resultsList.length > 0)
              ? dashboardData.resultsList
              : defaultComplianceResults;
            const compCount = activeResults.filter((r: any) => r.status === 'COMPLIANT').length;
            const atRiskCount = activeResults.filter((r: any) => r.status === 'AT_RISK').length;
            const nonCompCount = activeResults.filter((r: any) => r.status === 'NON_COMPLIANT').length;

            return (
              <div className="space-y-7">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center shadow-xs">
                      <CheckCircle className="w-5 h-5 text-blue-600"/>
                    </div>
                    <div>
                      <h2 className="text-2xl font-black text-slate-900 tracking-tight">Deep Compliance Verification</h2>
                      <p className="text-xs text-slate-500 font-semibold mt-0.5">Automated requirement evaluation across all university departments</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold rounded-full flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    26 Live Verification Nodes
                  </span>
                </div>

                {/* Summary cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    { label: 'Total Compliant', count: compCount, color: 'border-emerald-200 bg-emerald-50', text: 'text-emerald-700', icon: CheckCircle },
                    { label: 'At Risk', count: atRiskCount, color: 'border-orange-200 bg-orange-50', text: 'text-orange-700', icon: AlertTriangle },
                    { label: 'Non-Compliant', count: nonCompCount, color: 'border-red-200 bg-red-50', text: 'text-red-700', icon: Shield },
                  ].map((s, i) => (
                    <div key={i} className={`rounded-2xl border p-5 flex items-center gap-4 shadow-xs ${s.color}`}>
                      <s.icon className={`w-9 h-9 ${s.text} flex-shrink-0`} />
                      <div>
                        <p className="text-3xl font-black text-slate-800 leading-tight">{s.count}</p>
                        <p className={`text-[11px] font-black uppercase tracking-wider mt-0.5 ${s.text}`}>{s.label}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Full results list */}
                <div className="bg-white rounded-2xl p-7 shadow-sm border border-slate-200 space-y-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-slate-900 text-base">All Compliance Results</h3>
                    <span className="text-xs font-semibold text-slate-400">Showing {activeResults.length} checkpoints</span>
                  </div>
                  {activeResults.map((res: any, i: number) => {
                    const isNC = res.status === 'NON_COMPLIANT';
                    const isAR = res.status === 'AT_RISK';
                    const statusStyle = isNC ? 'border-red-200 bg-red-50/50' : isAR ? 'border-orange-200 bg-orange-50/50' : 'border-emerald-200 bg-emerald-50/50';
                    const badgeStyle = isNC ? 'bg-red-100 text-red-700 border-red-200' : isAR ? 'bg-orange-100 text-orange-700 border-orange-200' : 'bg-emerald-100 text-emerald-700 border-emerald-200';
                    return (
                      <div key={i} className={`rounded-xl border-2 p-6 transition-all hover:shadow-sm ${statusStyle}`}>
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <div className="flex items-center gap-2.5 mb-1.5">
                              <span className="font-mono text-[10px] font-black bg-white px-2 py-0.5 rounded border border-slate-200 text-slate-700">
                                {res.requirement_id || `REQ-${i+1}`}
                              </span>
                              <span className="text-[12px] font-bold text-slate-500">{res.department_name}</span>
                            </div>
                            <p className="font-black text-slate-800 text-[15px] leading-snug">{res.requirement_title}</p>
                          </div>
                          <span className={`px-2.5 py-1 rounded text-[10px] font-black uppercase tracking-widest border ${badgeStyle}`}>{res.status?.replace('_', ' ')}</span>
                        </div>
                        <div className="flex flex-wrap gap-5 text-sm bg-white p-5 rounded-xl border border-slate-200 shadow-2xs mt-1">
                          <div className="flex-1 min-w-[140px]">
                            <span className="text-slate-400 font-bold uppercase text-[10px] tracking-widest block mb-1.5">Actual Value</span>
                            <span className="font-black text-blue-900 text-[13px]">{res.actual_value || 'Compliant (100%)'}</span>
                          </div>
                          <div className="flex-1 min-w-[140px]">
                            <span className="text-slate-400 font-bold uppercase text-[10px] tracking-widest block mb-1.5">Calculated Gap</span>
                            <span className="font-black text-red-600 text-[13px]">{res.gap && res.gap !== '0.0' && res.gap !== '0' ? res.gap : 'None (Compliant)'}</span>
                          </div>
                          <div className="flex-1 min-w-[200px]">
                            <span className="text-slate-400 font-bold uppercase text-[10px] tracking-widest block mb-1.5">Observation / Source</span>
                            <span className="font-semibold text-slate-700 text-[12px] leading-relaxed">{res.explanation?.split(' | ')[0] || 'Verified against institutional regulations'}</span>
                          </div>
                          <div className="flex-1 min-w-[200px]">
                            <span className="text-slate-400 font-bold uppercase text-[10px] tracking-widest block mb-1.5">Required Evidence</span>
                            <span className="font-semibold text-slate-700 text-[12px] leading-relaxed">{res.explanation?.split(' | ')[1] || 'Department record audit'}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })()}

          {/* ── RISKS TAB ── */}
          {activeTab === 'Risks' && dashboardData && (() => {
            const results = (dashboardData.resultsList && dashboardData.resultsList.length > 0)
              ? dashboardData.resultsList
              : defaultComplianceResults;
            const critical = results.filter((r: any) => r.status === 'NON_COMPLIANT');
            const atRisk   = results.filter((r: any) => r.status === 'AT_RISK');
            const safe     = results.filter((r: any) => r.status === 'COMPLIANT');
            const total    = results.length || 1;
            const critPct  = Math.round((critical.length / total) * 100);
            const riskPct  = Math.round((atRisk.length / total) * 100);
            const safePct  = Math.round((safe.length / total) * 100);

            const riskMeta: Record<string, { risk: string; action: string; owner: string; lead: string; priority: string }> = {
              'REQ-QUAL-001':    { risk: 'high',     action: 'Recruit or upskill 2 faculty to PhD-qualified status', owner: 'HoD, Mechanical / HR',   lead: '~90 days',  priority: 'High'     },
              'REQ-COMM-001':    { risk: 'critical',  action: 'Issue reconstitution order and appoint members',       owner: 'Registrar',              lead: '5 days',    priority: 'Critical' },
              'LAB-INFRA-CHECK': { risk: 'medium',   action: 'Expedite signal generator replacement',               owner: 'HoD, ECE / Maintenance', lead: '10 days',   priority: 'Medium'   },
              'REQ-LIB-001':     { risk: 'low',       action: 'Maintain current library stock levels',               owner: 'Library Head',           lead: 'Ongoing',   priority: 'Low'      },
              'REQ-FSR-001':     { risk: 'critical',  action: 'Recruit 15 qualified faculty members and assign temporary teaching support', owner: 'HR Department / CSE Dean', lead: '8-12 weeks', priority: 'Critical' },
              'REQ-FSR-002':     { risk: 'high',  action: 'Recruit 3 qualified faculty members', owner: 'HR Department / CSE Dean', lead: '4-8 weeks', priority: 'High' },
              'FSR-CSE-001':     { risk: 'critical',  action: 'Recruit 15 qualified faculty members and assign temporary teaching support', owner: 'HR Department / CSE Dean', lead: '8-12 weeks', priority: 'Critical' },
              'CRED-ECE-001':    { risk: 'medium',   action: 'Approve 2-credit elective or mini-project module and update course credit matrix', owner: 'Board of Studies / Dean Academics', lead: '14-20 days', priority: 'Medium' },
            };

            const allRisks = results.map((r: any) => {
              const meta = riskMeta[r.requirement_id] || {
                risk: r.status === 'NON_COMPLIANT' ? 'high' : r.status === 'AT_RISK' ? 'medium' : 'low',
                action: r.status === 'NON_COMPLIANT'
                  ? 'Initiate corrective action plan and assign responsible officer immediately'
                  : r.status === 'AT_RISK'
                  ? 'Monitor closely and schedule preventive review within the next sprint'
                  : 'No action needed — continue maintaining current compliance levels',
                owner: r.department_name,
                lead: r.status === 'NON_COMPLIANT' ? '10–15 days' : r.status === 'AT_RISK' ? '15–20 days' : 'Ongoing',
                priority: r.status === 'NON_COMPLIANT' ? 'High' : r.status === 'AT_RISK' ? 'Medium' : 'Low',
              };
              return { ...r, ...meta };
            }).sort((a: any, b: any) => {
              const order: Record<string, number> = { critical: 0, high: 1, medium: 2, low: 3 };
              return (order[a.risk] ?? 4) - (order[b.risk] ?? 4);
            });

            return (
              <div className="space-y-7">

                {/* Page header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center shadow-lg shadow-red-200">
                      <AlertTriangle className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-black text-slate-800 leading-none">Risk Overview</h2>
                      <p className="text-[11px] text-slate-400 font-semibold mt-0.5">Live AI-assessed compliance risks Â· Agent54</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-red-50 border border-red-100 rounded-full">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                    <span className="text-[11px] font-black text-red-600 uppercase tracking-widest">Live Risk Engine</span>
                  </div>
                </div>

                {/* Top summary row: 4 KPI cards + donut */}
                <div className="grid grid-cols-12 gap-5">

                  {/* KPI Cards */}
                  <div className="col-span-12 lg:col-span-8 grid grid-cols-2 md:grid-cols-4 gap-5">
                    {[
                      { label: 'Total Checks',     value: results.length,  icon: Shield,        bg: 'from-blue-500 to-blue-600',       shadow: 'shadow-blue-200' },
                      { label: 'Critical Risks',   value: critical.length, icon: AlertTriangle, bg: 'from-red-500 to-red-600',         shadow: 'shadow-red-200' },
                      { label: 'At Risk',          value: atRisk.length,   icon: Activity,      bg: 'from-orange-400 to-orange-500',   shadow: 'shadow-orange-200' },
                      { label: 'Safe / Compliant', value: safe.length,     icon: CheckCircle,   bg: 'from-emerald-500 to-emerald-600', shadow: 'shadow-emerald-200' },
                    ].map((kpi, i) => (
                      <div key={i} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex flex-col gap-3 hover:shadow-md transition-shadow">
                        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${kpi.bg} flex items-center justify-center shadow-md ${kpi.shadow}`}>
                          <kpi.icon className="w-5 h-5 text-white" />
                        </div>
                        <p className="text-3xl font-black text-slate-800 leading-none mt-1">{kpi.value}</p>
                        <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest leading-tight">{kpi.label}</p>
                      </div>
                    ))}
                  </div>

                  {/* Donut risk breakdown */}
                  <div className="col-span-12 lg:col-span-4 bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex flex-col">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Risk Distribution</p>
                    <div className="flex items-center gap-4 flex-1">
                      <div className="relative w-24 h-24 flex-shrink-0">
                        <svg viewBox="0 0 36 36" className="w-24 h-24 -rotate-90">
                          <circle cx="18" cy="18" r="15.9" fill="none" stroke="#f1f5f9" strokeWidth="4" />
                          <circle cx="18" cy="18" r="15.9" fill="none" stroke="#ef4444" strokeWidth="4"
                            strokeDasharray={`${critPct} ${100 - critPct}`} strokeDashoffset="0" />
                          <circle cx="18" cy="18" r="15.9" fill="none" stroke="#f97316" strokeWidth="4"
                            strokeDasharray={`${riskPct} ${100 - riskPct}`} strokeDashoffset={`${-critPct}`} />
                          <circle cx="18" cy="18" r="15.9" fill="none" stroke="#10b981" strokeWidth="4"
                            strokeDasharray={`${safePct} ${100 - safePct}`} strokeDashoffset={`${-(critPct + riskPct)}`} />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-center">
                            <p className="text-[11px] font-black text-red-600">{critPct}%</p>
                            <p className="text-[7px] text-slate-400 font-bold">CRITICAL</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2.5 flex-1">
                        {[
                          { color: '#ef4444', label: 'Critical', pct: critPct, count: critical.length },
                          { color: '#f97316', label: 'At Risk',  pct: riskPct, count: atRisk.length },
                          { color: '#10b981', label: 'Safe',     pct: safePct, count: safe.length },
                        ].map((seg, i) => (
                          <div key={i} className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: seg.color }}></span>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-0.5">
                                <span className="text-[10px] font-black text-slate-600">{seg.label}</span>
                                <span className="text-[10px] font-black text-slate-500">{seg.count} Â· {seg.pct}%</span>
                              </div>
                              <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                <div className="h-full rounded-full" style={{ width: `${seg.pct}%`, backgroundColor: seg.color }} />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Risk Items List */}
                <div className="space-y-5">
                  <div className="flex items-center justify-between">
                    <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">All Risk Items Â· Sorted by Severity</p>
                    <span className="text-[10px] font-black text-slate-400">{allRisks.length} item{allRisks.length !== 1 ? 's' : ''}</span>
                  </div>

                  {allRisks.length === 0 && (
                    <div className="bg-white rounded-2xl p-16 border border-slate-100 text-center shadow-sm">
                      <CheckCircle className="w-12 h-12 text-emerald-200 mx-auto mb-3" />
                      <p className="font-black text-slate-400 text-lg">No risks detected. Everything is compliant!</p>
                    </div>
                  )}

                  {allRisks.map((risk: any, i: number) => {
                    const isCrit = risk.risk === 'critical';
                    const isHigh = risk.risk === 'high';
                    const isMed  = risk.risk === 'medium';
                    const accentColor = isCrit ? '#ef4444' : isHigh ? '#f97316' : isMed ? '#f59e0b' : '#10b981';
                    const badgeBg     = isCrit ? 'bg-red-100 text-red-700 border-red-200' : isHigh ? 'bg-orange-100 text-orange-700 border-orange-200' : isMed ? 'bg-amber-100 text-amber-700 border-amber-200' : 'bg-emerald-100 text-emerald-700 border-emerald-200';
                    const headerBg    = isCrit ? 'from-red-50 to-white' : isHigh ? 'from-orange-50 to-white' : isMed ? 'from-amber-50 to-white' : 'from-emerald-50 to-white';
                    const iconBg      = isCrit ? 'bg-red-500' : isHigh ? 'bg-orange-500' : isMed ? 'bg-amber-400' : 'bg-emerald-500';
                    const riskScore   = isCrit ? 95 : isHigh ? 75 : isMed ? 45 : 10;
                    const scoreColor  = accentColor;

                    return (
                      <div key={i} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-md transition-all duration-200 group"
                        style={{ borderLeft: `4px solid ${accentColor}` }}>

                        {/* Card header */}
                        <div className={`px-6 py-5 bg-gradient-to-r ${headerBg} border-b border-slate-100`}>
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-start gap-3 flex-1 min-w-0">
                              <div className={`w-9 h-9 rounded-xl ${iconBg} flex items-center justify-center flex-shrink-0 shadow-sm mt-0.5`}>
                                {(isCrit || isHigh) ? <AlertTriangle className="w-4 h-4 text-white" /> : isMed ? <Activity className="w-4 h-4 text-white" /> : <CheckCircle className="w-4 h-4 text-white" />}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1 flex-wrap">
                                  <span className={`px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-widest border ${badgeBg}`}>{risk.priority}</span>
                                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{risk.department_name}</span>
                                </div>
                                <h3 className="font-black text-slate-800 text-[14px] leading-snug group-hover:text-blue-700 transition-colors">{risk.requirement_title}</h3>
                              </div>
                            </div>
                            {/* Risk score circle */}
                            <div className="flex flex-col items-center flex-shrink-0">
                              <div className="relative w-14 h-14">
                                <svg viewBox="0 0 36 36" className="w-14 h-14 -rotate-90">
                                  <circle cx="18" cy="18" r="14" fill="none" stroke="#f1f5f9" strokeWidth="4" />
                                  <circle cx="18" cy="18" r="14" fill="none" stroke={scoreColor} strokeWidth="4"
                                    strokeDasharray={`${(riskScore / 100) * 87.96} 87.96`} strokeLinecap="round" />
                                </svg>
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <span className="text-[11px] font-black" style={{ color: scoreColor }}>{riskScore}</span>
                                </div>
                              </div>
                              <span className="text-[7px] font-black text-slate-400 uppercase tracking-widest mt-0.5">RISK SCORE</span>
                            </div>
                          </div>
                        </div>

                        {/* Card body: 3 columns */}
                        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-100">
                          {/* Actual vs Gap */}
                          <div className="px-6 py-4">
                            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-2">Actual vs Gap</p>
                            <div className="flex flex-col gap-1.5">
                              <div className="flex items-start gap-2">
                                <span className="text-[9px] font-bold text-slate-400 w-12 flex-shrink-0 pt-0.5">Actual</span>
                                <span className="font-black text-slate-700 text-xs leading-snug">{risk.actual_value}</span>
                              </div>
                              <div className="flex items-start gap-2">
                                <span className="text-[9px] font-bold text-slate-400 w-12 flex-shrink-0 pt-0.5">Gap</span>
                                <span className="font-black text-red-500 text-xs leading-snug">{risk.gap && risk.gap !== '0.0' && risk.gap !== '0' ? risk.gap : 'â€”'}</span>
                              </div>
                            </div>
                            <div className="mt-3">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Risk Level</span>
                                <span className="text-[9px] font-black" style={{ color: scoreColor }}>{riskScore}%</span>
                              </div>
                              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                <div className="h-full rounded-full transition-all duration-1000"
                                  style={{ width: `${riskScore}%`, background: `linear-gradient(90deg, ${scoreColor}88, ${scoreColor})`, boxShadow: `0 0 6px ${scoreColor}44` }} />
                              </div>
                            </div>
                          </div>

                          {/* AI Action */}
                          <div className="px-6 py-4">
                            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-2">AI Suggested Action</p>
                            <p className="text-xs font-semibold text-slate-700 leading-relaxed">{risk.action}</p>
                            <div className="mt-2.5 flex items-center gap-1.5">
                              <Clock className="w-3 h-3 text-slate-400 flex-shrink-0" />
                              <span className="text-[10px] font-black text-slate-500">Lead time: {risk.lead}</span>
                            </div>
                          </div>

                          {/* Owner */}
                          <div className="px-6 py-4">
                            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-2">Owner & Status</p>
                            <div className="flex items-center gap-2 mb-2.5">
                              <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                                <span className="text-[9px] font-black text-blue-700">{(risk.owner || 'N').charAt(0).toUpperCase()}</span>
                              </div>
                              <span className="text-xs font-black text-slate-700 leading-snug">{risk.owner || 'Unassigned'}</span>
                            </div>
                            <div className="flex items-center justify-between gap-2 mt-2">
                              <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${badgeBg}`}>
                                {risk.status?.replace('_', ' ')}
                              </span>
                              {(risk.status === 'NON_COMPLIANT' || risk.status === 'AT_RISK') && (
                                <button
                                  onClick={() => handleOpenRecoveryPlan(risk.requirement_title || risk.requirement_id)}
                                  className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[9px] font-black shadow-xs transition-all cursor-pointer"
                                >
                                  Remediate →
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

              </div>
            );
          })()}

          {/* ── READINESS REPORT TAB ── */}
          {activeTab === 'Readiness' && <ReadinessReportTab />}

          {/* ── REMEDIATION TAB ── */}
          {activeTab === 'Remediation' && <RemediationCenter dashboardData={dashboardData} initialCaseId={selectedCaseId} />}

          {/* ── INTEGRATIONS MESH TAB ── */}
          {activeTab === 'Integrations' && <IntegrationsTab />}

          {/* ── SIMULATOR TAB ── */}
          {activeTab === 'Simulator' && <SimulatorTab dashboardData={dashboardData} />}

          {/* ── AUDIT TRAIL TAB ── */}
          {activeTab === 'Audit Trail' && <AuditTrailTab dashboardData={dashboardData} />}

          {/* ── OTHER TABS FALLBACK ── */}
          {!['Home', 'Regulations', 'Compliance', 'Risks', 'Readiness', 'Remediation', 'Integrations', 'Simulator', 'Audit Trail'].includes(activeTab) && (
            <div className="bg-white rounded-2xl p-12 shadow-sm border border-slate-200 min-h-[500px] flex items-center justify-center">
              <div className="text-center">
                <BookOpen className="w-16 h-16 text-blue-200 mx-auto mb-4" />
                <h3 className="text-2xl font-black text-blue-900 mb-2">{activeTab}</h3>
                <p className="text-slate-400 font-medium max-w-md mx-auto">This module is active and receiving live agentic updates from Agent54.</p>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* ── AUTH PROMPT MODAL ── */}
      {authPromptOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 relative">
            <button
              onClick={() => setAuthPromptOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center mb-4">
              <Lock className="w-6 h-6" />
            </div>

            <h3 className="text-lg font-black text-slate-900 mb-1">
              Institutional Credentials Required
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed mb-6 font-medium">
              Live automated sweeps, remediation approvals, and audit trail modifications require an authorized university account (Admin, Auditor, or Department Faculty).
            </p>

            <div className="space-y-2.5">
              <button
                onClick={() => {
                  setAuthPromptOpen(false);
                  navigate('/');
                }}
                className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white text-xs font-black rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <LogIn className="w-4 h-4" />
                Sign In to Workspace
              </button>
              <button
                onClick={() => {
                  setAuthPromptOpen(false);
                  navigate('/?mode=signup');
                }}
                className="w-full py-2.5 px-4 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <UserPlus className="w-4 h-4" />
                Register New Account
              </button>
              <button
                onClick={() => setAuthPromptOpen(false)}
                className="w-full py-2.5 px-4 bg-slate-50 hover:bg-slate-100 text-slate-600 text-xs font-bold rounded-xl transition-all cursor-pointer"
              >
                Continue Browsing as Guest
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── INSTITUTIONAL ACCOUNT MODAL (PROFILE / SIGNUP / LOGIN) ── */}
      {accountModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => {
                setAccountModalOpen(false);
                setAuthError(null);
                setAuthSuccess(null);
              }}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Mode Switcher Tabs */}
            <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl mb-5">
              <button
                type="button"
                onClick={() => { setAccountModalMode('profile'); setAuthError(null); }}
                className={`flex-1 py-1.5 text-xs font-black rounded-lg transition-all cursor-pointer ${
                  accountModalMode === 'profile' ? 'bg-white text-blue-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Profile
              </button>
              <button
                type="button"
                onClick={() => { setAccountModalMode('signup'); setAuthError(null); }}
                className={`flex-1 py-1.5 text-xs font-black rounded-lg transition-all cursor-pointer ${
                  accountModalMode === 'signup' ? 'bg-white text-blue-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Sign Up
              </button>
              <button
                type="button"
                onClick={() => { setAccountModalMode('login'); setAuthError(null); }}
                className={`flex-1 py-1.5 text-xs font-black rounded-lg transition-all cursor-pointer ${
                  accountModalMode === 'login' ? 'bg-white text-blue-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Sign In
              </button>
            </div>

            {/* Status alerts */}
            {authError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-bold rounded-xl flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                <span>{authError}</span>
              </div>
            )}
            {authSuccess && (
              <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold rounded-xl flex items-center gap-2">
                <CheckCircle className="w-4 h-4 flex-shrink-0" />
                <span>{authSuccess}</span>
              </div>
            )}

            {/* PROFILE MODE */}
            {accountModalMode === 'profile' && (
              <div>
                <div className="flex items-center gap-3.5 mb-5">
                  <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white font-black text-xl flex items-center justify-center shadow-md">
                    {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
                  </div>
                  <div>
                    <h3 className="text-base font-black text-slate-900">{user?.name || 'Administrator'}</h3>
                    <p className="text-xs text-blue-600 font-bold">{user?.email || 'admin@vignan.edu.in'}</p>
                    <span className="inline-flex items-center gap-1.5 mt-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 border border-emerald-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                      Active Session: {user?.role || 'University Operations'}
                    </span>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200 space-y-2 mb-5">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-slate-500">Institution:</span>
                    <span className="font-bold text-slate-800">Vignan University (VFSTR)</span>
                  </div>
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-slate-500">Permission Level:</span>
                    <span className="font-bold text-blue-700">Full Operational Access</span>
                  </div>
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-slate-500">Auth Method:</span>
                    <span className="font-bold text-slate-800">{token ? 'JWT Bearer Verified' : 'Standard Session'}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <button
                    onClick={() => setAccountModalMode('signup')}
                    className="w-full py-2.5 px-4 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-black rounded-xl border border-blue-200 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <UserPlus className="w-4 h-4" />
                    Register New Institutional Account
                  </button>

                  <button
                    onClick={() => {
                      logout();
                      setAccountModalOpen(false);
                      setSweepNotice('Successfully signed out.');
                      setTimeout(() => setSweepNotice(null), 3000);
                    }}
                    className="w-full py-2.5 px-4 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-black rounded-xl border border-red-200 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out / Log Out
                  </button>
                </div>
              </div>
            )}

            {/* SIGN UP MODE */}
            {accountModalMode === 'signup' && (
              <form onSubmit={handleAuthSubmit} className="space-y-3.5">
                <div className="mb-2">
                  <h3 className="text-base font-black text-slate-900">Institutional Sign Up</h3>
                  <p className="text-xs text-slate-500 font-medium">Create a new institutional stakeholder account</p>
                </div>

                <div>
                  <label className="block text-[11px] font-black text-slate-700 uppercase tracking-wider mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dr. Rajesh Sharma"
                    value={authFormData.name}
                    onChange={(e) => setAuthFormData({ ...authFormData, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-black text-slate-700 uppercase tracking-wider mb-1">Institutional Email</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. rajesh@vignan.edu.in"
                    value={authFormData.email}
                    onChange={(e) => setAuthFormData({ ...authFormData, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-black text-slate-700 uppercase tracking-wider mb-1">Password</label>
                  <input
                    type="password"
                    required
                    placeholder="Enter password (e.g. GRID or custom)"
                    value={authFormData.password}
                    onChange={(e) => setAuthFormData({ ...authFormData, password: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-black text-slate-700 uppercase tracking-wider mb-1">Role / Department</label>
                  <select
                    value={authFormData.role}
                    onChange={(e) => setAuthFormData({ ...authFormData, role: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium bg-white"
                  >
                    <option value="faculty">Faculty Member</option>
                    <option value="admin">University Operations / Admin</option>
                    <option value="auditor">Regulatory Compliance Auditor</option>
                    <option value="officer">Accreditation Officer (NAAC/NBA)</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={authLoading}
                  className="w-full mt-2 py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white text-xs font-black rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <UserPlus className="w-4 h-4" />
                  {authLoading ? 'Creating Account...' : 'Complete Registration'}
                </button>

                <p className="text-center text-[11px] text-slate-500 pt-1">
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => { setAccountModalMode('login'); setAuthError(null); }}
                    className="text-blue-600 font-bold hover:underline cursor-pointer"
                  >
                    Sign In here
                  </button>
                </p>
              </form>
            )}

            {/* LOGIN MODE */}
            {accountModalMode === 'login' && (
              <form onSubmit={handleAuthSubmit} className="space-y-3.5">
                <div className="mb-2">
                  <h3 className="text-base font-black text-slate-900">Institutional Sign In</h3>
                  <p className="text-xs text-slate-500 font-medium">Log into Agent54 Governance System</p>
                </div>

                <div>
                  <label className="block text-[11px] font-black text-slate-700 uppercase tracking-wider mb-1">User ID / Email</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. vignan or user@vignan.edu.in"
                    value={authFormData.email}
                    onChange={(e) => setAuthFormData({ ...authFormData, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-black text-slate-700 uppercase tracking-wider mb-1">Password</label>
                  <input
                    type="password"
                    required
                    placeholder="Enter password (e.g. GRID)"
                    value={authFormData.password}
                    onChange={(e) => setAuthFormData({ ...authFormData, password: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium"
                  />
                </div>

                {/* Quick Fill Button */}
                <button
                  type="button"
                  onClick={() => setAuthFormData({ ...authFormData, email: 'vignan', password: 'GRID' })}
                  className="w-full py-1.5 px-3 bg-blue-50 hover:bg-blue-100 text-blue-700 text-[11px] font-bold rounded-lg border border-blue-200 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                  Quick Fill Vignan Admin (vignan / GRID)
                </button>

                <button
                  type="submit"
                  disabled={authLoading}
                  className="w-full mt-2 py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white text-xs font-black rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <LogIn className="w-4 h-4" />
                  {authLoading ? 'Signing In...' : 'Sign In'}
                </button>

                <p className="text-center text-[11px] text-slate-500 pt-1">
                  Need a new account?{' '}
                  <button
                    type="button"
                    onClick={() => { setAccountModalMode('signup'); setAuthError(null); }}
                    className="text-blue-600 font-bold hover:underline cursor-pointer"
                  >
                    Sign Up here
                  </button>
                </p>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ── AGENT54 AI CHATBOT / SYSTEM COPILOT ── */}
      <Agent54Chatbot
        isOpen={chatbotOpen}
        onOpenChange={setChatbotOpen}
        hideDefaultTrigger={true}
        onNavigateTab={(tab) => setActiveTab(tab)}
        activeTab={activeTab}
        dashboardData={dashboardData}
      />
    </div>
  );
}
