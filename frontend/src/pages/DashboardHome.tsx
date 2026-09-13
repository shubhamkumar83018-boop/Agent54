import { useState, useEffect } from 'react';
import { 
  FileText, CheckCircle, AlertTriangle, Settings, 
  Activity, Clock, BarChart2, Shield, UploadCloud, PlayCircle, AlertOctagon, Cpu, Database, RotateCw, Home
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

export default function DashboardHome() {
  const [dashboardData, setDashboardData] = useState<any>(null);

  useEffect(() => {
    const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
    Promise.all([
      fetch(`${API_BASE}/api/dashboard/summary`).then(res => res.json()),
      fetch(`${API_BASE}/api/requirements`).then(res => res.json()),
      fetch(`${API_BASE}/api/compliance/results`).then(res => res.json()),
      fetch(`${API_BASE}/api/audit`).then(res => res.json())
    ]).then(([summary, reqs, results, audit]) => {
      setDashboardData({
        totalRegs: summary.total_regulations || 0,
        totalReqs: summary.active_requirements || 0,
        depts: summary.departments || 0,
        lastScan: new Date().toLocaleDateString('en-GB', { timeZone: 'Asia/Kolkata', day: 'numeric', month: 'short', year: 'numeric' }),
        complianceScore: summary.overall_compliance || 0,
        complianceData: [
          { name: 'Compliant', value: summary.compliant_count || 0, color: '#10B981' },
          { name: 'At Risk', value: summary.at_risk_count || 0, color: '#F59E0B' },
          { name: 'Non-Compliant', value: summary.non_compliant_count || 0, color: '#EF4444' },
        ],
        totalRisks: summary.total_open_risks || 0,
        riskData: summary.riskData || [],
        categories: (summary.categories || []).map((cat: any) => ({
          name: cat.name,
          val: cat.val,
          color: cat.val < 70 ? 'bg-orange-400' : 'bg-blue-500'
        })),
        reqsList: reqs,
        resultsList: results,
        auditList: audit
      });
    }).catch(err => console.error("API Error:", err));
  }, []);

  if (!dashboardData) return <div className="h-full flex justify-center items-center font-bold text-xl text-blue-900">Loading Agent54...</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="flex items-center gap-2">
          <img 
            src="/robot.png" 
            alt="Robot" 
            style={{ width: '80px', height: '80px', objectFit: 'contain' }}
          />
          <div>
            <h2 className="text-3xl font-black text-blue-900 tracking-tight">University Compliance Overview</h2>
            <p className="text-slate-500 font-medium">Real-time status based on Agentic AI continuous monitoring.</p>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <img 
            src="/logos.png" 
            alt="Accreditations" 
            style={{ height: '44px', objectFit: 'contain' }}
          />
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 bg-white text-blue-600 px-4 py-2 rounded-lg font-bold border border-blue-200 shadow-sm hover:bg-blue-50 transition">
              <UploadCloud className="w-4 h-4" /> Upload
            </button>
            <button className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-lg font-bold shadow-md shadow-blue-600/20 hover:bg-blue-700 transition">
              <PlayCircle className="w-4 h-4" /> Run Check
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* ROW 1 */}
        <div className="col-span-12 lg:col-span-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Unique Regulations', val: dashboardData.totalRegs, icon: FileText, c: 'text-blue-500', bg: 'bg-blue-50 border-blue-100' },
            { label: 'Active Requirements', val: dashboardData.totalReqs, icon: CheckCircle, c: 'text-emerald-500', bg: 'bg-emerald-50 border-emerald-100' },
            { label: 'Departments', val: dashboardData.depts, icon: Home, c: 'text-purple-500', bg: 'bg-purple-50 border-purple-100' },
            { label: 'Last Scan', val: dashboardData.lastScan, icon: Clock, c: 'text-orange-500', bg: 'bg-orange-50 border-orange-100' }
          ].map((s, i) => (
            <div key={i} className={`rounded-2xl p-5 flex flex-col justify-between shadow-sm border ${s.bg}`}>
              <s.icon className={`w-5 h-5 mb-2 ${s.c}`} />
              <div>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">{s.label}</p>
                <p className="text-3xl font-black text-slate-800 leading-tight">{s.val}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="col-span-12 lg:col-span-4 bg-white rounded-2xl p-6 shadow-sm border border-slate-200 relative overflow-hidden">
          <h3 className="font-bold text-blue-900 flex items-center gap-2 mb-1"><CheckCircle className="w-5 h-5 text-blue-600"/> Compliance Score</h3>
          <p className="text-xs font-medium text-slate-500 mb-4">Overall University Health</p>
          <div className="flex items-center justify-center relative -mt-4">
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie data={dashboardData.complianceData} innerRadius={55} outerRadius={75} paddingAngle={2} dataKey="value" stroke="none">
                  {dashboardData.complianceData.map((e: any, i: number) => <Cell key={`cell-${i}`} fill={e.color} />)}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center mt-2 pointer-events-none">
              <span className="text-3xl font-black text-blue-900">{dashboardData.complianceScore}%</span>
              <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">Compliant</span>
            </div>
          </div>
        </div>

        {/* ROW 2 */}
        <div className="col-span-12 lg:col-span-7 bg-white rounded-2xl p-6 shadow-sm border border-slate-200 flex flex-col h-full">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-blue-900 flex items-center gap-2"><Activity className="w-5 h-5 text-blue-600"/> Recent Compliance Status</h3>
            <button className="text-xs font-bold text-blue-600 hover:text-blue-800">View All →</button>
          </div>
          <div className="flex-1 flex flex-col gap-3">
            {dashboardData.resultsList?.slice(0, 4).map((row: any, i: number) => {
              let bgClass = 'bg-emerald-50 border-emerald-100 text-emerald-700';
              let icon = <CheckCircle className="w-4 h-4 text-emerald-500" />;
              if (row.status === 'NON_COMPLIANT') {
                bgClass = 'bg-red-50 border-red-100 text-red-700';
                icon = <AlertOctagon className="w-4 h-4 text-red-500" />;
              } else if (row.status === 'AT_RISK') {
                bgClass = 'bg-orange-50 border-orange-100 text-orange-700';
                icon = <AlertTriangle className="w-4 h-4 text-orange-500" />;
              }
              const explanation = row.explanation?.split(' | ')[1] || '';
              return (
                <div key={i} className={`p-4 rounded-xl border flex flex-col gap-3 shadow-sm ${bgClass.split(' ')[0]} ${bgClass.split(' ')[1]}`}>
                  <div className="flex justify-between items-start">
                    <div className="flex gap-3">
                      <div className="mt-0.5">{icon}</div>
                      <div>
                        <p className="font-black text-slate-800 text-sm leading-tight mb-1">{row.requirement_title}</p>
                        <div className="flex items-center gap-3 text-xs font-semibold text-slate-500">
                          <span className="flex items-center gap-1"><Home className="w-3 h-3"/> {row.department_name}</span>
                          <span className="flex items-center gap-1"><Clock className="w-3 h-3"/> {new Date(row.checked_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                        </div>
                      </div>
                    </div>
                    <span className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-widest bg-white/50 border ${bgClass.split(' ')[1]} ${bgClass.split(' ')[2]}`}>
                      {row.status.replace('_', ' ')}
                    </span>
                  </div>
                  {explanation && <div className="ml-7 text-xs font-bold opacity-80">{explanation}</div>}
                </div>
              );
            })}
          </div>
        </div>

        <div className="col-span-12 lg:col-span-5 bg-white rounded-2xl p-6 shadow-sm border border-slate-200 flex flex-col h-full">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-blue-900 flex items-center gap-2"><BarChart2 className="w-5 h-5 text-blue-600"/> Compliance by Category</h3>
          </div>
          <div className="flex-1 flex flex-col justify-center gap-6">
            {dashboardData.categories?.map((cat: any, i: number) => {
              let colorClass = 'bg-blue-500';
              let statusLabel = 'GOOD';
              let labelColor = 'text-blue-500 bg-blue-50';
              if(cat.val >= 95) { colorClass = 'bg-emerald-500'; statusLabel = 'EXCELLENT'; labelColor = 'text-emerald-600 bg-emerald-50'; } 
              else if (cat.val < 70) { colorClass = 'bg-red-500'; statusLabel = 'CRITICAL'; labelColor = 'text-red-600 bg-red-50'; } 
              else if (cat.val < 85) { colorClass = 'bg-orange-400'; statusLabel = 'NEEDS REVIEW'; labelColor = 'text-orange-600 bg-orange-50'; }
              return (
                <div key={i} className="group">
                  <div className="flex justify-between text-sm mb-2 items-end">
                    <div>
                      <span className="font-black text-slate-800">{cat.name}</span>
                      <span className={`ml-3 px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest ${labelColor}`}>{statusLabel}</span>
                    </div>
                    <span className={`font-black ${colorClass.replace('bg-', 'text-')}`}>{cat.val}%</span>
                  </div>
                  <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden shadow-inner border border-slate-200/60">
                    <div className={`h-full ${colorClass} rounded-full transition-all duration-1000 ease-out`} style={{ width: `${cat.val}%` }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        
        {/* ROW 3 */}
        <div className="col-span-12 lg:col-span-6 bg-white rounded-2xl p-6 shadow-sm border border-slate-200 flex flex-col h-full">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-blue-900 flex items-center gap-2"><Cpu className="w-5 h-5 text-blue-600"/> AI Agent Swarm Status</h3>
            <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 border border-emerald-100 rounded-full">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">All Systems Live</span>
            </div>
          </div>
          <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 gap-4">
            {[
              { name: 'Regulation Agent', task: 'Monitoring Docs', icon: FileText, c: 'text-indigo-600', bg: 'bg-indigo-50 border-indigo-100', p: 12 },
              { name: 'Evidence Agent', task: 'Indexing Data', icon: Database, c: 'text-blue-600', bg: 'bg-blue-50 border-blue-100', p: 8 },
              { name: 'Compliance Agent', task: 'Verifying Rules', icon: CheckCircle, c: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-100', p: 24 },
              { name: 'Risk Agent', task: 'Scoring Gaps', icon: AlertTriangle, c: 'text-amber-600', bg: 'bg-amber-50 border-amber-100', p: 15 },
              { name: 'Remediation Agent', task: 'Drafting Plans', icon: Settings, c: 'text-purple-600', bg: 'bg-purple-50 border-purple-100', p: 31 },
              { name: 'Simulation Agent', task: 'Running Scenarios', icon: RotateCw, c: 'text-cyan-600', bg: 'bg-cyan-50 border-cyan-100', p: 18 }
            ].map((agent, i) => (
              <div key={i} className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col shadow-sm">
                <div className="flex items-start justify-between mb-3">
                  <div className={`p-2 rounded-lg border ${agent.bg}`}><agent.icon className={`w-4 h-4 ${agent.c}`} /></div>
                  <div className="flex flex-col items-end">
                    <span className="text-[9px] font-black text-emerald-500 uppercase flex items-center gap-1.5 mb-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Active
                    </span>
                    <span className="text-[8px] font-bold text-slate-400">{agent.p}ms ping</span>
                  </div>
                </div>
                <span className="text-xs font-black text-slate-800 leading-tight mb-1">{agent.name}</span>
                <span className="text-[9px] font-bold text-slate-500">{agent.task}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="col-span-12 lg:col-span-6 bg-white rounded-2xl p-6 shadow-sm border border-slate-200 flex flex-col">
          <h3 className="font-bold text-blue-900 flex items-center gap-2 mb-2"><Shield className="w-5 h-5 text-red-500"/> Risk Overview</h3>
          <div className="flex-1 flex items-center justify-center relative -mt-4">
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie data={dashboardData.riskData} innerRadius={65} outerRadius={85} paddingAngle={2} dataKey="value" stroke="none">
                  {dashboardData.riskData?.map((entry: any, index: number) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center mt-4 pointer-events-none">
              <span className="text-3xl font-black text-slate-800">{dashboardData.totalRisks}</span>
              <span className="text-[10px] font-bold text-slate-500 uppercase">Open Risks</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
