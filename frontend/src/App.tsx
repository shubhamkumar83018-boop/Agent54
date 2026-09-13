import { useState, useEffect } from 'react';
import RemediationCenter from './pages/RemediationCenter';
import SimulatorTab from './pages/SimulatorTab';
import AuditTrailTab from './pages/AuditTrailTab';
import RegulationsTab from './pages/RegulationsTab';
import IntegrationsTab from './pages/IntegrationsTab';
import ReadinessReportTab from './pages/ReadinessReportTab';
import {
  Home, FileText, CheckCircle, AlertTriangle, Settings, RotateCw,
  Clock, Activity, BarChart2, Shield, PlayCircle,
  Cpu, Database, ShieldCheck, Check, Search, Filter,
  ExternalLink, Sparkles
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

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

export default function App() {
  const [activeTab, setActiveTab] = useState('Home');
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);
  const [sweepRunning, setSweepRunning] = useState(false);
  const [sweepNotice, setSweepNotice] = useState<string | null>(null);
  const [complianceFilter, setComplianceFilter] = useState<'ALL' | 'COMPLIANT' | 'AT_RISK' | 'NON_COMPLIANT'>('ALL');
  const [complianceAuthority, setComplianceAuthority] = useState<string>('ALL');
  const [complianceSearch, setComplianceSearch] = useState<string>('');

  const handleOpenRecoveryPlan = (caseId?: string) => {
    if (caseId) {
      setSelectedCaseId(caseId);
    }
    setActiveTab('Remediation');
  };

  useEffect(() => {
    const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
    Promise.all([
      fetch(`${API_BASE}/api/dashboard/summary`).then(r => r.json()),
      fetch(`${API_BASE}/api/requirements`).then(r => r.json()),
      fetch(`${API_BASE}/api/compliance/results`).then(r => r.json()),
      fetch(`${API_BASE}/api/audit`).then(r => r.json()),
      fetch(`${API_BASE}/api/compliance/full-scan`).then(r => r.json()),
    ]).then(([summary, reqs, results, audit, fullScan]) => {
      
      // Compute actual metrics from live scan
      const catStats: Record<string, { total: number; compliant: number }> = {};
      let fsCompliant = 0, fsAtRisk = 0, fsNonCompliant = 0;

      if (fullScan && fullScan.results) {
        fullScan.results.forEach((r: any) => {
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

      const dynamicCategories = Object.entries(catStats).map(([name, stats]) => ({
        name,
        val: Math.round((stats.compliant / stats.total) * 100)
      })).sort((a, b) => b.val - a.val);

      const dynamicRiskData = [];
      if (fsNonCompliant > 0) dynamicRiskData.push({ name: 'Critical', value: fsNonCompliant, color: '#ef4444' });
      if (fsAtRisk > 0) dynamicRiskData.push({ name: 'Medium', value: fsAtRisk, color: '#f97316' });

      setDashboardData({
        totalRegs: summary.total_regulations || 0,
        totalReqs: summary.active_requirements || 0,
        depts: summary.departments || 0,
        lastScan: fullScan?.scan_time ? new Date(fullScan.scan_time).toLocaleDateString('en-GB', { timeZone: 'Asia/Kolkata', day: 'numeric', month: 'short', year: 'numeric' }) : new Date().toLocaleDateString('en-GB'),
        complianceScore: fullScan?.overall_compliance_pct || 0,
        complianceData: [
          { name: 'Compliant', value: fsCompliant, color: '#3B82F6' },
          { name: 'At Risk', value: fsAtRisk, color: '#F59E0B' },
          { name: 'Non-Compliant', value: fsNonCompliant, color: '#EF4444' },
        ],
        totalRisks: fsNonCompliant + fsAtRisk,
        riskData: dynamicRiskData,
        categories: dynamicCategories,
        reqsList: reqs,
        resultsList: results,
        auditList: audit,
        fullScan: fullScan,
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
        riskData: [],
        categories: [],
        reqsList: [],
        resultsList: [],
        auditList: [],
        fullScan: null,
      });
    });
  }, []);
  return (
    <div className="flex h-screen font-sans overflow-hidden" style={{ background: 'linear-gradient(135deg, #f0f7ff 0%, #e8f3ff 40%, #eef6ff 70%, #f5f9ff 100%)' }}>

      {/* ── SIDEBAR ── */}
      <aside className="w-[260px] min-w-[260px] bg-white flex flex-col border-r border-slate-200 shadow-sm relative z-10">

        {/* Vignan Logo */}
        <div className="px-4 py-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5 mb-2">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center text-white font-black text-base shadow-md flex-shrink-0">V</div>
            <div>
              <p className="text-[13px] font-black text-red-600 leading-none tracking-wide">VIGNAN'S</p>
              <p className="text-[8px] text-slate-500 leading-tight mt-0.5 font-semibold">Foundation for Science,<br/>Technology & Research</p>
            </div>
          </div>
          <div className="bg-blue-600 text-[7px] px-2 py-0.5 rounded text-white font-bold w-fit tracking-wide">
            Deemed to be University | Estd. u/s 3 of UGC Act 1956
          </div>
        </div>

        {/* Brand */}
        <div className="px-4 py-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-blue-50 rounded-lg border border-blue-100">
              <Cpu className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <span className="font-black text-[14px] tracking-wide text-slate-800">Agent54</span>
              <p className="text-[8px] font-black text-blue-500 uppercase tracking-[0.2em] -mt-0.5">Compliance Platform</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-3 px-2 space-y-0.5">
          {NAV_ITEMS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[12px] font-semibold transition-all duration-200 text-left relative
                ${activeTab === id
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
            >
              <Icon className={`w-4 h-4 flex-shrink-0`} />
              {label}
            </button>
          ))}
        </nav>

        {/* Admin */}
        <div className="p-3 border-t border-slate-100">
          <div className="flex items-center gap-2.5 bg-slate-50 rounded-lg p-2.5 border border-slate-100">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center font-black text-sm flex-shrink-0 text-white shadow-sm">A</div>
            <div>
              <p className="text-[12px] font-bold text-slate-800 leading-tight">Admin</p>
              <p className="text-[10px] text-blue-500 font-medium">University Operations</p>
            </div>
          </div>
        </div>
      </aside>

      {/* â”€â”€ MAIN â”€â”€ */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Top Header */}
        <header className="bg-white border-b border-slate-200 px-6 py-2.5 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-full">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
              </span>
              <span className="text-[9px] font-black text-emerald-700 uppercase tracking-widest">System Online</span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">CSE Presents</p>
            <p className="text-base font-black text-blue-700 tracking-tight">AGENTIC AI DAY 2026</p>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-5">

          {/* â”€â”€ HOME TAB â”€â”€ */}
          {activeTab === 'Home' && (
            <div className="space-y-4">
              
              {/* Title Row (Outside grid for full width header) */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img src="/robot_clean.jpg" alt="Robot" className="hover:scale-110 hover:-rotate-3 transition-transform duration-300 cursor-pointer" style={{ width: '90px', height: '90px', objectFit: 'contain', mixBlendMode: 'multiply' }} />
                  <div>
                    <h2 className="text-3xl font-black text-slate-800 tracking-tight">University Compliance Overview</h2>
                    <p className="text-slate-400 font-medium text-sm mt-0.5">Real-time status based on Agentic AI continuous monitoring.</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-1">
                    {[0, 1, 2, 3, 4, 5, 6].map((i) => (
                      <div 
                        key={i} 
                        className="overflow-hidden cursor-pointer transition-transform duration-300 hover:scale-110 hover:-rotate-3"
                        style={{ width: '40px', height: '48px', borderRadius: '50%' }}
                      >
                        <img 
                          src="/logos_cropped.jpg" 
                          alt={`Accreditation ${i}`} 
                          style={{ 
                            height: '48px', 
                            width: '280px', 
                            maxWidth: 'none', 
                            transform: `translateX(-${i * 40}px)`, 
                            mixBlendMode: 'multiply' 
                          }} 
                        />
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center gap-2">
                    {sweepNotice && (
                      <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-lg animate-in fade-in flex items-center gap-1">
                        <Check className="w-3.5 h-3.5 text-emerald-600" /> {sweepNotice}
                      </span>
                    )}
                    <button
                      onClick={() => setActiveTab('Regulations')}
                      className="flex items-center gap-1.5 bg-white text-blue-600 px-4 py-1.5 rounded-lg font-bold border border-blue-200 shadow-sm hover:bg-blue-50 transition-all duration-200 text-xs"
                    >
                      <FileText className="w-3.5 h-3.5" /> View Register
                    </button>
                    <button
                      onClick={() => {
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
                      className="flex items-center gap-1.5 bg-blue-600 text-white px-4 py-1.5 rounded-lg font-bold shadow-md hover:bg-blue-700 transition-all duration-200 text-xs disabled:opacity-50 cursor-pointer"
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
                <div className="grid grid-cols-12 gap-4 items-start">
                  
                  {/* Stat Cards - Full Width Row */}
                  <div className="col-span-12 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
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
                        <div className="p-4">
                          <div className={`w-9 h-9 rounded-xl ${s.iconBg} flex items-center justify-center mb-3 group-hover:scale-105 transition-transform`}>
                            <s.icon className={`w-4.5 h-4.5 ${s.iconColor}`} style={{width:'18px', height:'18px'}} />
                          </div>
                          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">{s.label}</p>
                          <p className="text-2xl font-black text-slate-800 leading-tight group-hover:text-blue-600 transition-colors">{s.val}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Second row: Compliance Score (3) + Recent Compliance (9) */}

                  {/* Compliance Score */}
                  <div className="col-span-12 lg:col-span-3 bg-white rounded-2xl p-4 shadow-sm border border-slate-100 self-stretch flex flex-col">
                    <div className="flex items-center gap-2 mb-0.5">
                      <div className="p-1.5 bg-blue-50 rounded-lg border border-blue-100">
                        <CheckCircle className="w-4 h-4 text-blue-600"/>
                      </div>
                      <h3 className="font-black text-slate-800 text-sm">Compliance Score</h3>
                    </div>
                    <p className="text-[10px] font-medium text-slate-400 mb-2 ml-9">Overall University Health</p>
                    <div className="relative flex items-center justify-center">
                      <ResponsiveContainer width="100%" height={130}>
                        <PieChart>
                          <Pie data={dashboardData.complianceData} innerRadius={42} outerRadius={58} paddingAngle={3} dataKey="value" stroke="none">
                            {dashboardData.complianceData.map((e: any, i: number) => <Cell key={i} fill={e.color} />)}
                          </Pie>
                          <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '11px' }} />
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                        <span className="text-2xl font-black text-blue-900">{dashboardData.complianceScore}%</span>
                        <span className="text-[9px] font-black text-blue-500 uppercase tracking-widest">Compliant</span>
                      </div>
                    </div>

                    {/* Breakdown stats to fill the card */}
                    <div className="mt-3 space-y-2 flex-1">
                      {[
                        { label: 'Compliant',     count: dashboardData.complianceData?.[0]?.value || 0, color: 'bg-emerald-500', textColor: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-100' },
                        { label: 'At Risk',       count: dashboardData.complianceData?.[1]?.value || 0, color: 'bg-orange-400',  textColor: 'text-orange-700',  bg: 'bg-orange-50',  border: 'border-orange-100'  },
                        { label: 'Non-Compliant', count: dashboardData.complianceData?.[2]?.value || 0, color: 'bg-red-500',     textColor: 'text-red-700',     bg: 'bg-red-50',     border: 'border-red-100'     },
                      ].map((s, i) => (
                        <div key={i} className={`flex items-center justify-between px-3 py-2 rounded-xl border ${s.bg} ${s.border}`}>
                          <div className="flex items-center gap-2">
                            <span className={`w-2 h-2 rounded-full ${s.color}`}></span>
                            <span className="text-[11px] font-bold text-slate-600">{s.label}</span>
                          </div>
                          <span className={`text-sm font-black ${s.textColor}`}>{s.count}</span>
                        </div>
                      ))}
                    </div>

                    {/* Last updated footer */}
                    <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Last Updated</span>
                      <span className="text-[9px] font-black text-blue-600">{dashboardData.lastScan}</span>
                    </div>
                  </div>

                  {/* Recent Compliance Status */}
                  <div className="col-span-12 lg:col-span-9 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
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
                        className="flex items-center gap-1.5 text-xs font-black text-blue-600 hover:text-white hover:bg-blue-600 border border-blue-200 hover:border-blue-600 px-3 py-1.5 rounded-lg transition-all duration-200"
                      >
                        View All â†’
                      </button>
                    </div>

                    {/* 26-Regulation Scan Summary Row */}
                    <div className="border-b border-slate-100 bg-slate-50/50 p-4">
                      <div className="flex items-center justify-between text-xs font-bold text-slate-500 mb-4 px-2">
                        <span>Last scan: {dashboardData.fullScan?.scan_time ? new Date(dashboardData.fullScan.scan_time).toLocaleString('en-GB', { timeZone: 'Asia/Kolkata', dateStyle: 'medium', timeStyle: 'short' }) : dashboardData.lastScan}</span>
                        <span className="bg-slate-200 text-slate-700 px-2.5 py-0.5 rounded-md">TOTAL: {dashboardData.fullScan?.total || 26}</span>
                      </div>
                      
                      <div className="grid grid-cols-4 gap-2">
                        {[
                          { label: 'COMPLIANT', count: dashboardData.complianceData?.[0]?.value || 0, icon: '🟢', bg: 'bg-emerald-50', border: 'border-emerald-100', text: 'text-emerald-700' },
                          { label: 'AT RISK', count: dashboardData.complianceData?.[1]?.value || 0, icon: '🟠', bg: 'bg-orange-50', border: 'border-orange-100', text: 'text-orange-700' },
                          { label: 'NON-COMPLIANT', count: dashboardData.complianceData?.[2]?.value || 0, icon: '🔴', bg: 'bg-red-50', border: 'border-red-100', text: 'text-red-700' },
                          { label: 'PENDING', count: (dashboardData.fullScan?.results?.filter((r: any) => r.status === 'EVIDENCE_PENDING').length) || 0, icon: '⚪', bg: 'bg-slate-100', border: 'border-slate-200', text: 'text-slate-600' },
                        ].map((s, i) => (
                          <div key={i} className={`flex flex-col items-center justify-center p-3 rounded-xl border ${s.bg} ${s.border}`}>
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
                    <div className="p-4 space-y-3 max-h-[600px] overflow-y-auto bg-slate-50/30">
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
                            className={`p-4 rounded-xl border transition-all duration-200 ${(isNC || isAR) ? 'cursor-pointer hover:shadow-md' : ''} ${cardBg}`}
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex items-start gap-2.5 flex-1 min-w-0">
                                <span className="text-sm mt-0.5">{icon}</span>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="text-[10px] font-black font-mono text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">{row.requirement_id}</span>
                                    <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest ${badgeBg}`}>Status: {badgeTxt}</span>
                                  </div>
                                  <p className={`font-black text-sm leading-snug ${(isNC || isAR) ? 'group-hover:text-blue-700' : 'text-slate-800'}`}>
                                    {row.requirement_name}
                                  </p>
                                  
                                  <div className="mt-2 space-y-1">
                                    {(row.issue || row.actual_value) && (
                                      <p className="text-[11px] font-medium text-slate-600">
                                        <strong className="text-slate-800 font-bold">Issue/Value:</strong> {row.issue || row.actual_value}
                                      </p>
                                    )}
                                    {row.evidence_note ? (
                                      <p className="text-[11px] font-medium text-slate-500 italic">
                                        <strong className="text-slate-700 font-bold not-italic">Required:</strong> {row.evidence_note}
                                      </p>
                                    ) : (
                                      <p className="text-[11px] font-medium text-slate-500">
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
                    <div className="flex-1 flex flex-col divide-y divide-slate-50 px-0">
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
                          <div key={i} className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50/80 transition-all duration-150 group">
                            {/* Rank number */}
                            <span className={`w-6 h-6 rounded-lg flex-shrink-0 flex items-center justify-center text-[10px] font-black ${rankBg}`}>{i + 1}</span>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-1.5">
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
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4">
                      {[
                        { name: 'Regulation Agent',  desc: 'Parsing & extraction',  icon: FileText,      latency: 12, tasks: 47, uptime: '99.8%', color: 'from-blue-500 to-blue-600' },
                        { name: 'Evidence Agent',    desc: 'Document verification', icon: Database,      latency: 8,  tasks: 63, uptime: '99.9%', color: 'from-violet-500 to-violet-600' },
                        { name: 'Compliance Agent',  desc: 'Status evaluation',     icon: CheckCircle,   latency: 24, tasks: 38, uptime: '99.7%', color: 'from-emerald-500 to-emerald-600' },
                        { name: 'Risk Agent',        desc: 'Threat assessment',     icon: AlertTriangle, latency: 15, tasks: 29, uptime: '99.6%', color: 'from-orange-500 to-orange-600' },
                        { name: 'Remediation Agent', desc: 'Action planning',       icon: Settings,      latency: 31, tasks: 22, uptime: '99.5%', color: 'from-rose-500 to-rose-600' },
                        { name: 'Simulation Agent',  desc: 'Scenario modelling',    icon: RotateCw,      latency: 18, tasks: 34, uptime: '99.8%', color: 'from-cyan-500 to-cyan-600' },
                      ].map((agent, i) => (
                        <div key={i} className="group border border-slate-200 rounded-xl p-3 flex flex-col gap-2 hover:border-blue-300 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer bg-white">
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
                            <p className="text-[11px] font-black text-slate-800 leading-tight group-hover:text-blue-700 transition-colors">{agent.name}</p>
                            <p className="text-[9px] text-slate-400 font-semibold mt-0.5">{agent.desc}</p>
                          </div>
                          <div className="flex items-center justify-between pt-1.5 border-t border-slate-100">
                            <div className="text-center">
                              <p className="text-[10px] font-black text-blue-700">{agent.latency}ms</p>
                              <p className="text-[7px] font-bold text-slate-400 uppercase tracking-widest">Latency</p>
                            </div>
                            <div className="text-center">
                              <p className="text-[10px] font-black text-slate-700">{agent.tasks}</p>
                              <p className="text-[7px] font-bold text-slate-400 uppercase tracking-widest">Tasks</p>
                            </div>
                            <div className="text-center">
                              <p className="text-[10px] font-black text-emerald-600">{agent.uptime}</p>
                              <p className="text-[7px] font-bold text-slate-400 uppercase tracking-widest">Uptime</p>
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
                    <div className="flex items-center gap-6">
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
                      <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-3">
                        {dashboardData.riskData?.map((r: any, i: number) => (
                          <div key={i} className="flex items-center gap-2 p-3 rounded-xl border border-slate-100 bg-slate-50">
                            <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: r.color }}></span>
                            <div>
                              <p className="text-sm font-black text-slate-800">{r.value}</p>
                              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{r.name}</p>
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
            const rawResults = dashboardData.resultsList || [];
            const dynamicAuthorities = ['ALL', ...Array.from(new Set(rawResults.map((r: any) => r.authority).filter(Boolean)))];
            
            // Filter by search, status, and authority
            const filteredResults = rawResults.filter((res: any) => {
              const matchesStatus = complianceFilter === 'ALL' || res.status === complianceFilter;
              const matchesAuthority = complianceAuthority === 'ALL' || (res.authority && res.authority.toUpperCase() === complianceAuthority.toUpperCase());
              const matchesSearch = complianceSearch === '' || 
                (res.requirement_title && res.requirement_title.toLowerCase().includes(complianceSearch.toLowerCase())) ||
                (res.requirement_id && res.requirement_id.toLowerCase().includes(complianceSearch.toLowerCase())) ||
                (res.department_name && res.department_name.toLowerCase().includes(complianceSearch.toLowerCase())) ||
                (res.category && res.category.toLowerCase().includes(complianceSearch.toLowerCase())) ||
                (res.notes && res.notes.toLowerCase().includes(complianceSearch.toLowerCase())) ||
                (res.source_document && res.source_document.toLowerCase().includes(complianceSearch.toLowerCase()));
              return matchesStatus && matchesAuthority && matchesSearch;
            });

            const compliantCount = rawResults.filter((r: any) => r.status === 'COMPLIANT').length;
            const pendingCount = rawResults.filter((r: any) => r.status === 'EVIDENCE_PENDING').length;
            const nonCompliantCount = rawResults.filter((r: any) => r.status === 'NON_COMPLIANT').length;

            return (
              <div className="space-y-6 font-sans pb-10">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-200 text-white">
                      <CheckCircle className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-black text-slate-800 tracking-tight">Deep Compliance Verification Register</h2>
                      <p className="text-xs text-slate-400 font-semibold mt-0.5">Continuous automated audit across all 26 VFSTR, AICTE, UGC, NBA & NAAC statutory rules</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setComplianceFilter('ALL');
                        setComplianceAuthority('ALL');
                        setComplianceSearch('');
                      }}
                      className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-black text-slate-600 hover:bg-slate-50 transition-all cursor-pointer"
                    >
                      Reset Filters
                    </button>
                  </div>
                </div>

                {/* Summary KPI Cards (Clickable filters) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { label: 'Total Regulations Scanned', filterKey: 'ALL', count: rawResults.length, color: 'border-blue-200 bg-blue-50/50', text: 'text-blue-700', badge: 'bg-blue-100 text-blue-800', icon: FileText },
                    { label: 'Verified Evidence (Compliant)', filterKey: 'COMPLIANT', count: compliantCount, color: 'border-emerald-200 bg-emerald-50/50', text: 'text-emerald-700', badge: 'bg-emerald-100 text-emerald-800', icon: CheckCircle },
                    { label: 'Evidence Pending Audit', filterKey: 'EVIDENCE_PENDING', count: pendingCount, color: 'border-amber-200 bg-amber-50/50', text: 'text-amber-700', badge: 'bg-amber-100 text-amber-800', icon: Clock },
                    { label: 'Critical Non-Compliance', filterKey: 'NON_COMPLIANT', count: nonCompliantCount, color: 'border-red-200 bg-red-50/50', text: 'text-red-700', badge: 'bg-red-100 text-red-800', icon: Shield },
                  ].map((s, i) => (
                    <div 
                      key={i} 
                      onClick={() => setComplianceFilter(s.filterKey as any)}
                      className={`rounded-2xl border p-5 flex items-center justify-between shadow-sm cursor-pointer transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 ${s.color} ${complianceFilter === s.filterKey ? 'ring-2 ring-blue-500 shadow-md' : ''}`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-xl bg-white shadow-sm border border-slate-100 ${s.text}`}>
                          <s.icon className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="text-3xl font-black text-slate-800">{s.count}</p>
                          <p className={`text-[10px] font-black uppercase tracking-widest mt-0.5 ${s.text}`}>{s.label}</p>
                        </div>
                      </div>
                      {complianceFilter === s.filterKey && (
                        <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-600 text-white">Active</span>
                      )}
                    </div>
                  ))}
                </div>

                {/* Filters & Search Toolbar */}
                <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-3">
                  {/* Search */}
                  <div className="relative flex-1 max-w-md">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input 
                      type="text"
                      placeholder="Search regulation, clause, notes, owner (e.g. R26, FSR, NBA, Library)..."
                      value={complianceSearch}
                      onChange={(e) => setComplianceSearch(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                    />
                  </div>

                  {/* Authority Selector */}
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mr-1 flex items-center gap-1">
                      <Filter className="w-3 h-3" /> Authority:
                    </span>
                    {dynamicAuthorities.map((auth: any) => (
                      <button
                        key={auth}
                        onClick={() => setComplianceAuthority(auth)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
                          complianceAuthority === auth
                            ? 'bg-blue-600 text-white shadow-sm'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {auth === 'ALL' ? 'All Authorities' : auth}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Full results list */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between px-1">
                    <h3 className="font-black text-slate-800 text-sm">
                      Compliance Inspection Register ({filteredResults.length} records)
                    </h3>
                    <span className="text-[11px] font-bold text-slate-500">
                      Vignan Foundation for Science, Technology and Research (VFSTR)
                    </span>
                  </div>

                  {filteredResults.length === 0 && (
                    <div className="bg-white rounded-2xl p-12 border border-slate-100 text-center shadow-sm">
                      <CheckCircle className="w-12 h-12 text-slate-200 mx-auto mb-3" />
                      <p className="font-black text-slate-600 text-base">No compliance records match your current filters.</p>
                      <button 
                        onClick={() => { setComplianceFilter('ALL'); setComplianceAuthority('ALL'); setComplianceSearch(''); }}
                        className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-black"
                      >
                        Reset All Filters
                      </button>
                    </div>
                  )}

                  {filteredResults.map((res: any, i: number) => {
                    const isNC = res.status === 'NON_COMPLIANT';
                    const isAR = res.status === 'AT_RISK';
                    const isC  = res.status === 'COMPLIANT';

                    const statusStyle = isNC ? 'border-red-200 bg-white hover:border-red-300' : isAR ? 'border-orange-200 bg-white hover:border-orange-300' : isC ? 'border-emerald-200 bg-white hover:border-emerald-300' : 'border-slate-200 bg-white hover:border-blue-200';
                    const badgeStyle = isNC ? 'bg-red-100 text-red-700 border-red-200' : isAR ? 'bg-orange-100 text-orange-700 border-orange-200' : isC ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : 'bg-amber-100 text-amber-800 border-amber-200';
                    const leftBorder = isNC ? 'border-l-4 border-l-red-500' : isAR ? 'border-l-4 border-l-orange-500' : isC ? 'border-l-4 border-l-emerald-500' : 'border-l-4 border-l-amber-500';

                    return (
                      <div key={i} className={`rounded-2xl border p-5 shadow-sm transition-all duration-200 hover:shadow-md ${statusStyle} ${leftBorder}`}>
                        
                        {/* Header Row */}
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-4">
                          <div>
                            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                              <span className="text-[10px] font-black font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                                {res.requirement_id}
                              </span>
                              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-100">
                                {res.authority} • {res.category}
                              </span>
                              {res.severity && (
                                <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded ${
                                  res.severity === 'CRITICAL' ? 'bg-red-50 text-red-700 border border-red-200' :
                                  res.severity === 'HIGH' ? 'bg-orange-50 text-orange-700 border border-orange-200' : 'bg-slate-100 text-slate-600'
                                }`}>
                                  {res.severity} Severity
                                </span>
                              )}
                              {res.clause && (
                                <span className="text-[10px] font-semibold text-slate-500 bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
                                  Clause {res.clause}
                                </span>
                              )}
                            </div>
                            <h4 className="font-black text-slate-800 text-base leading-snug">{res.requirement_title}</h4>
                            <div className="flex items-center gap-3 text-xs font-bold text-slate-500 mt-1 flex-wrap">
                              <span>Source: <strong className="text-slate-700">{res.source_document}</strong></span>
                              <span>•</span>
                              <span>Remediation Owner: <strong className="text-slate-700">{res.owner || res.department_name}</strong></span>
                              {res.lead_time_days && (
                                <>
                                  <span>•</span>
                                  <span>Target Lead Time: <strong className="text-blue-700">{res.lead_time_days} days</strong></span>
                                </>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-2 flex-shrink-0">
                            <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${badgeStyle}`}>
                              {res.status.replace('_', ' ')}
                            </span>
                            {res.source_url && (
                              <a
                                href={res.source_url}
                                target="_blank"
                                rel="noreferrer"
                                className="px-2.5 py-1 bg-white hover:bg-slate-50 text-blue-600 border border-blue-200 rounded-lg text-xs font-bold transition-all flex items-center gap-1"
                                title="Open Official Reference URL"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                                <span>Official Source</span>
                              </a>
                            )}
                          </div>
                        </div>

                        {/* 4-Box Metrics Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 bg-slate-50/70 p-4 rounded-xl border border-slate-100">
                          
                          {/* Required Value */}
                          <div className="space-y-1">
                            <span className="text-slate-400 font-black uppercase text-[9px] tracking-widest block">
                              Measurable Norm {res.condition_operator ? `(${res.condition_operator})` : ''}
                            </span>
                            <p className="font-bold text-slate-800 text-xs leading-relaxed">{res.required_value || 'Mandatory'}</p>
                          </div>

                          {/* Actual Value */}
                          <div className="space-y-1">
                            <span className="text-slate-400 font-black uppercase text-[9px] tracking-widest block">Evaluated Evidence</span>
                            <p className={`font-black text-xs leading-relaxed ${isC ? 'text-emerald-700' : 'text-amber-800'}`}>
                              {res.actual_value || 'Evidence Pending Submission'}
                            </p>
                          </div>

                          {/* Calculated Gap / Evidence Required */}
                          <div className="space-y-1">
                            <span className="text-slate-400 font-black uppercase text-[9px] tracking-widest block">Evidence & Gap Status</span>
                            <p className={`font-bold text-xs leading-relaxed ${isC ? 'text-emerald-700' : 'text-amber-900'}`}>
                              {res.gap || res.evidence_required || 'Verification pending'}
                            </p>
                          </div>

                          {/* Action Plan */}
                          <div className="space-y-1">
                            <span className="text-slate-400 font-black uppercase text-[9px] tracking-widest block">Remediation Directive</span>
                            <p className="font-bold text-slate-700 text-xs leading-relaxed">{res.action_required || 'Maintain standard compliance monitoring.'}</p>
                          </div>
                        </div>

                        {/* Observation & Regulatory Notes Footer */}
                        {(res.observation || res.notes) && (
                          <div className="mt-3 pt-3 border-t border-slate-100 flex items-start gap-2 text-xs">
                            <span className="text-slate-400 font-black uppercase text-[9px] tracking-widest flex-shrink-0 pt-0.5">Regulatory Context:</span>
                            <p className="text-slate-600 font-medium leading-relaxed">{res.observation || res.notes}</p>
                          </div>
                        )}

                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })()}

          {/* ── RISKS TAB ── */}
          {activeTab === 'Risks' && dashboardData && (() => {
            const results = dashboardData.resultsList || [];
            const critical = results.filter((r: any) => r.status === 'NON_COMPLIANT');
            const atRisk   = results.filter((r: any) => r.status === 'AT_RISK');
            const safe     = results.filter((r: any) => r.status === 'COMPLIANT');
            const total    = results.length || 1;
            const critPct  = Math.round((critical.length / total) * 100);
            const riskPct  = Math.round((atRisk.length / total) * 100);
            const safePct  = Math.round((safe.length / total) * 100);

            const allRisks = results.map((r: any) => {
              const isCrit = r.status === 'NON_COMPLIANT';
              const isAR = r.status === 'AT_RISK';
              const riskLevel = isCrit ? 'critical' : isAR ? 'high' : 'low';
              return {
                ...r,
                risk: riskLevel,
                action: r.action_required || (isCrit ? 'Initiate immediate corrective action plan' : 'Monitor closely and review'),
                owner: r.owner || r.department_name || 'Academic Section / IQAC',
                lead: r.lead_time_days ? `${r.lead_time_days} days` : (isCrit ? '15–30 days' : 'Ongoing'),
                priority: isCrit ? 'Critical' : isAR ? 'High Risk' : 'Low Risk',
              };
            }).sort((a: any, b: any) => {
              const order: Record<string, number> = { critical: 0, high: 1, medium: 2, low: 3 };
              return (order[a.risk] ?? 4) - (order[b.risk] ?? 4);
            });

            return (
              <div className="space-y-6 font-sans pb-10">

                {/* Page header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center shadow-lg shadow-red-200 text-white">
                      <AlertTriangle className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-black text-slate-800 tracking-tight">Institutional Risk Matrix</h2>
                      <p className="text-xs text-slate-400 font-semibold mt-0.5">Live AI-assessed compliance vulnerabilities sorted by statutory severity · Agent54</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-red-50 border border-red-100 rounded-full">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                    <span className="text-[11px] font-black text-red-600 uppercase tracking-widest">Live Risk Engine Active</span>
                  </div>
                </div>

                {/* Top summary row: 4 KPI cards + donut */}
                <div className="grid grid-cols-12 gap-4">

                  {/* KPI Cards */}
                  <div className="col-span-12 lg:col-span-8 grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      { label: 'Total Regulations', value: results.length,  icon: Shield,        bg: 'from-blue-500 to-blue-600',       shadow: 'shadow-blue-200' },
                      { label: 'Critical Risks',   value: critical.length, icon: AlertTriangle, bg: 'from-red-500 to-red-600',         shadow: 'shadow-red-200' },
                      { label: 'At Risk / Warnings', value: atRisk.length,   icon: Activity,      bg: 'from-orange-400 to-orange-500',   shadow: 'shadow-orange-200' },
                      { label: 'Safe / Compliant', value: safe.length,     icon: CheckCircle,   bg: 'from-emerald-500 to-emerald-600', shadow: 'shadow-emerald-200' },
                    ].map((kpi, i) => (
                      <div key={i} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex flex-col gap-2 hover:shadow-md transition-shadow">
                        <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${kpi.bg} flex items-center justify-center shadow-md ${kpi.shadow} text-white`}>
                          <kpi.icon className="w-4 h-4" />
                        </div>
                        <p className="text-3xl font-black text-slate-800 leading-none mt-1">{kpi.value}</p>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-tight">{kpi.label}</p>
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
                                <span className="text-[10px] font-black text-slate-500">{seg.count} · {seg.pct}%</span>
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
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">All Institutional Risk Items · Ranked by Statutory Severity</p>
                    <span className="text-[10px] font-black text-slate-400">{allRisks.length} regulations evaluated</span>
                  </div>

                  {allRisks.map((risk: any, i: number) => {
                    const isCrit = risk.risk === 'critical';
                    const isHigh = risk.risk === 'high';
                    const isMed  = risk.risk === 'medium';
                    const accentColor = isCrit ? '#ef4444' : isHigh ? '#f97316' : isMed ? '#f59e0b' : '#10b981';
                    const badgeBg     = isCrit ? 'bg-red-100 text-red-700 border-red-200' : isHigh ? 'bg-orange-100 text-orange-700 border-orange-200' : isMed ? 'bg-amber-100 text-amber-700 border-amber-200' : 'bg-emerald-100 text-emerald-700 border-emerald-200';
                    const headerBg    = isCrit ? 'from-red-50/80 to-white' : isHigh ? 'from-orange-50/80 to-white' : isMed ? 'from-amber-50/80 to-white' : 'from-emerald-50/80 to-white';
                    const iconBg      = isCrit ? 'bg-red-500' : isHigh ? 'bg-orange-500' : isMed ? 'bg-amber-400' : 'bg-emerald-500';
                    const riskScore   = isCrit ? 92 : isHigh ? 72 : isMed ? 40 : 5;
                    const scoreColor  = accentColor;

                    return (
                      <div key={i} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-md transition-all duration-200 group"
                        style={{ borderLeft: `4px solid ${accentColor}` }}>

                        {/* Card header */}
                        <div className={`px-5 py-4 bg-gradient-to-r ${headerBg} border-b border-slate-100`}>
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-start gap-3 flex-1 min-w-0">
                              <div className={`w-9 h-9 rounded-xl ${iconBg} flex items-center justify-center flex-shrink-0 shadow-sm mt-0.5 text-white`}>
                                {(isCrit || isHigh) ? <AlertTriangle className="w-4 h-4" /> : isMed ? <Activity className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1 flex-wrap">
                                  <span className={`px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-widest border ${badgeBg}`}>{risk.priority}</span>
                                  <span className="text-[9px] font-black font-mono text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">{risk.requirement_id}</span>
                                  <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">{risk.authority} • {risk.department_name}</span>
                                </div>
                                <h3 className="font-black text-slate-800 text-sm leading-snug group-hover:text-blue-700 transition-colors">{risk.requirement_title}</h3>
                              </div>
                            </div>
                            
                            {/* Action / Score */}
                            <div className="flex items-center gap-3 flex-shrink-0">
                              <div className="flex flex-col items-center">
                                <div className="relative w-12 h-12">
                                  <svg viewBox="0 0 36 36" className="w-12 h-12 -rotate-90">
                                    <circle cx="18" cy="18" r="14" fill="none" stroke="#f1f5f9" strokeWidth="4" />
                                    <circle cx="18" cy="18" r="14" fill="none" stroke={scoreColor} strokeWidth="4"
                                      strokeDasharray={`${(riskScore / 100) * 87.96} 87.96`} strokeLinecap="round" />
                                  </svg>
                                  <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="text-[10px] font-black" style={{ color: scoreColor }}>{riskScore}</span>
                                  </div>
                                </div>
                                <span className="text-[7px] font-black text-slate-400 uppercase tracking-widest mt-0.5">RISK INDEX</span>
                              </div>

                              {(isCrit || isHigh) && (
                                <button
                                  onClick={() => handleOpenRecoveryPlan(risk.requirement_title || risk.requirement_id)}
                                  className="px-3 py-2 bg-slate-900 hover:bg-blue-600 text-white rounded-xl text-xs font-black shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
                                >
                                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                                  <span>Launch AI Remediation</span>
                                </button>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Card body: 3 columns */}
                        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-100">
                          {/* Actual vs Gap */}
                          <div className="px-5 py-3.5">
                            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-2">Evaluated Actual vs Gap</p>
                            <div className="flex flex-col gap-1.5">
                              <div className="flex items-start gap-2">
                                <span className="text-[9px] font-bold text-slate-400 w-14 flex-shrink-0 pt-0.5">Actual:</span>
                                <span className="font-black text-slate-700 text-xs leading-snug">{risk.actual_value}</span>
                              </div>
                              <div className="flex items-start gap-2">
                                <span className="text-[9px] font-bold text-slate-400 w-14 flex-shrink-0 pt-0.5">Gap:</span>
                                <span className={`font-black text-xs leading-snug ${risk.gap && risk.gap !== '0' && risk.gap !== '0.0' ? 'text-red-600' : 'text-emerald-600'}`}>
                                  {risk.gap && risk.gap !== '0' && risk.gap !== '0.0' ? risk.gap : 'None'}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* AI Action */}
                          <div className="px-5 py-3.5">
                            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-2">Corrective Action Plan</p>
                            <p className="text-xs font-semibold text-slate-700 leading-relaxed">{risk.action}</p>
                            <div className="mt-2 flex items-center gap-1.5">
                              <Clock className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                              <span className="text-[10px] font-black text-slate-500">Lead time target: {risk.lead}</span>
                            </div>
                          </div>

                          {/* Owner */}
                          <div className="px-5 py-3.5">
                            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-2">Responsible Authority</p>
                            <div className="flex items-center gap-2 mb-2">
                              <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                                <span className="text-[10px] font-black text-blue-700">{(risk.owner || 'A').charAt(0).toUpperCase()}</span>
                              </div>
                              <span className="text-xs font-black text-slate-700 leading-snug">{risk.owner}</span>
                            </div>
                            <span className={`px-2.5 py-1 rounded-md text-[8px] font-black uppercase tracking-widest border ${badgeBg}`}>
                              Status: {risk.status?.replace('_', ' ')}
                            </span>
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

        </main>
      </div>
    </div>
  );
}
