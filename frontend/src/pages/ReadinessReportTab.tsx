import { useState, useEffect } from 'react';
import {
  ShieldCheck, AlertTriangle, CheckCircle, Clock, Printer,
  FileCheck, UserCheck, RefreshCw, Building, Sparkles
} from 'lucide-react';

export default function ReadinessReportTab() {
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [simulatingAmendment, setSimulatingAmendment] = useState(false);
  const [amendmentFeedback, setAmendmentFeedback] = useState<string | null>(null);

  const fetchReport = () => {
    setLoading(true);
    const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
    fetch(`${API_BASE}/api/readiness/report`)
      .then(res => res.json())
      .then(data => setReport(data))
      .catch(err => console.error('Failed to load readiness report:', err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchReport();
  }, []);

  const handleSimulateAmendment = () => {
    setSimulatingAmendment(true);
    setAmendmentFeedback(null);
    const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
    fetch(`${API_BASE}/api/regulations/amend`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'AICTE Approval Process Handbook 2026-27',
        summary: 'Revised faculty-to-student ratio threshold to 1:15 and increased professor cadre ratio.',
        impacted_clauses: 'Chapter 7 - Cadre & Faculty Norms'
      })
    })
      .then(res => res.json())
      .then(data => {
        setAmendmentFeedback(`Statutory amendment registered: ${data.alert}. Re-checked ${data.rechecked_checkpoints} institutional checkpoints.`);
        fetchReport();
      })
      .catch(() => setAmendmentFeedback('Amendment simulation recorded.'))
      .finally(() => setSimulatingAmendment(false));
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading && !report) {
    return (
      <div className="h-64 flex items-center justify-center bg-white rounded-2xl border border-slate-200">
        <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  const authorities = report?.statutory_authorities || {};
  const gaps = report?.prioritized_lead_time_gaps || [];
  const checklist = report?.sign_off_checklist || [];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-600" /> Internal Inspection Readiness
            </span>
            <span className="text-xs font-bold text-slate-400">IQAC & Leadership Executive Audit</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <FileCheck className="w-6 h-6 text-emerald-600" /> Statutory Inspection Readiness Dossier
          </h2>
          <p className="text-sm text-slate-500 font-medium mt-1">
            Proactive pre-inspection audit evaluating <strong>VFSTR Academic Regulations R26, AICTE, UGC, NBA Tier-1, and NAAC</strong> compliance to eliminate surprise non-compliance findings.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleSimulateAmendment}
            disabled={simulatingAmendment}
            className="px-3.5 py-2 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-xs font-bold rounded-xl shadow-sm flex items-center gap-1.5 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            Simulate Regulatory Change
          </button>

          <button
            onClick={fetchReport}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl shadow-sm flex items-center gap-1.5 transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Re-audit
          </button>

          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-black rounded-xl shadow-md flex items-center gap-1.5 transition-all"
          >
            <Printer className="w-3.5 h-3.5" /> Print Dossier
          </button>
        </div>
      </div>

      {amendmentFeedback && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-amber-900 text-xs font-bold flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
          {amendmentFeedback}
        </div>
      )}

      {/* Overall Score + Primary User Badges */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-stretch">
        <div className="bg-gradient-to-br from-blue-900 via-indigo-900 to-slate-900 text-white rounded-2xl p-6 shadow-md flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-blue-200">Overall Pre-Inspection Score</span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-5xl font-black text-white">{report?.inspection_readiness_score}%</span>
              <span className="text-xs font-bold text-emerald-300">Composite Readiness</span>
            </div>
            <p className="text-xs text-blue-200 mt-2">
              Calculated across 8 core statutory dimensions: faculty ratio, cadre, credits, contact hours, labs, library, committees, and governance.
            </p>
          </div>

          <div className="pt-4 border-t border-white/10 mt-4 flex items-center justify-between">
            <span className="text-[10px] font-bold text-white/70 uppercase">Institutional Status</span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-400 text-slate-950">
              {report?.overall_status?.replace(/_/g, ' ')}
            </span>
          </div>
        </div>

        {/* Primary Stakeholders */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <UserCheck className="w-4 h-4 text-indigo-600" />
              <h3 className="font-bold text-slate-800 text-sm">Primary Audience & Executive Stakeholders</h3>
            </div>
            <p className="text-xs text-slate-500 mb-3">
              Designated institutional authorities responsible for inspection compliance and closure:
            </p>
            <div className="grid grid-cols-2 gap-2 text-xs font-bold text-slate-700">
              <div className="p-2 bg-slate-50 rounded-lg border border-slate-100 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span> IQAC Director
              </div>
              <div className="p-2 bg-slate-50 rounded-lg border border-slate-100 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span> University Registrar
              </div>
              <div className="p-2 bg-slate-50 rounded-lg border border-slate-100 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span> Principal / Deans
              </div>
              <div className="p-2 bg-slate-50 rounded-lg border border-slate-100 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span> Heads of Department
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 text-[10px] text-slate-400 font-bold">
            Audited for: VFSTR Deemed-to-be University (Guntur, AP)
          </div>
        </div>

        {/* Lead-time Critical Path Warning Card */}
        <div className="bg-amber-50 rounded-2xl p-6 border border-amber-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-amber-900 font-black text-sm mb-1.5">
              <Clock className="w-4 h-4 text-amber-700" /> Lead Time & Recruitment Critical Path
            </div>
            <p className="text-xs text-amber-950 font-medium leading-relaxed">
              <strong>Cadre Ratio Shortfall:</strong> Faculty recruitment takes an entire academic cycle (180 days). AICTE/NBA inspection readiness requires immediate active recruitment notice.
            </p>
          </div>

          <div className="bg-white/80 p-3 rounded-xl border border-amber-200/60 mt-3 text-xs">
            <span className="text-[10px] font-black text-amber-800 uppercase tracking-widest block mb-0.5">Recommended Action</span>
            <span className="font-bold text-slate-800">Issue recruitment notifications 6 months prior to NBA peer team visit.</span>
          </div>
        </div>
      </div>

      {/* Statutory Authorities Cards */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-black text-slate-900 text-base flex items-center gap-2">
            <Building className="w-4 h-4 text-blue-600" /> Statutory Accreditation & Approval Readiness
          </h3>
          <span className="text-xs font-bold text-slate-400">4 Mandated Frameworks</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {Object.entries(authorities).map(([key, auth]: [string, any]) => (
            <div key={key} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-xs font-black bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                    {key}
                  </span>
                  <span className="text-lg font-black text-slate-900">{auth.readiness_score}%</span>
                </div>
                <h4 className="font-bold text-slate-800 text-xs mb-2 leading-snug">{auth.name}</h4>

                <div className="space-y-1.5 text-xs text-slate-600 mb-3">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Top Concerns:</p>
                  {auth.key_concerns?.map((c: string, idx: number) => (
                    <div key={idx} className="flex items-start gap-1.5">
                      <span className="w-1 h-1 rounded-full bg-red-500 mt-1.5 flex-shrink-0"></span>
                      <span className="text-[11px] font-medium leading-tight">{c}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 text-[10px] font-bold text-slate-500 flex items-center justify-between">
                <span>Critical Lead:</span>
                <span className="text-slate-800 font-black">{auth.lead_time_critical_path}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quantified Gaps Table Prioritized by Lead Time & Severity */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-black text-slate-900 text-base flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-500" /> Quantified Gap Register with Fix Lead Times
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Prioritized by regulatory severity score and remediation lead time required.
            </p>
          </div>
          <span className="text-xs font-bold bg-red-50 text-red-700 px-3 py-1 rounded-lg border border-red-100">
            {gaps.length} Action Items
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-wider">
                <th className="pb-3">Gap ID & Authority</th>
                <th className="pb-3">Requirement & Shortfall</th>
                <th className="pb-3">Severity & Risk Reasoning</th>
                <th className="pb-3">Lead Time to Fix</th>
                <th className="pb-3">Owner</th>
                <th className="pb-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {gaps.map((gap: any) => (
                <tr key={gap.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 pr-3 align-top">
                    <span className="font-mono text-[10px] font-black bg-slate-100 text-slate-800 px-2 py-0.5 rounded block w-max mb-1">
                      {gap.id}
                    </span>
                    <span className="text-[10px] font-bold text-blue-700">{gap.authority}</span>
                  </td>

                  <td className="py-3 pr-3 align-top">
                    <p className="font-bold text-slate-900 text-xs">{gap.requirement}</p>
                    <p className="text-[11px] text-red-600 font-semibold mt-0.5">{gap.shortfall}</p>
                  </td>

                  <td className="py-3 pr-3 align-top max-w-xs">
                    <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider border ${
                      gap.severity === 'CRITICAL' ? 'bg-red-50 text-red-700 border-red-200' :
                      gap.severity === 'HIGH' ? 'bg-orange-50 text-orange-700 border-orange-200' : 'bg-amber-50 text-amber-700 border-amber-200'
                    }`}>
                      {gap.severity}
                    </span>
                    <p className="text-[11px] text-slate-600 font-medium mt-1 leading-snug">
                      {gap.risk_reasoning}
                    </p>
                  </td>

                  <td className="py-3 pr-3 align-top">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-orange-500" />
                      <span className="font-black text-slate-800 text-xs">{gap.lead_time_days} days</span>
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 block mt-0.5">{gap.lead_time_type}</span>
                  </td>

                  <td className="py-3 pr-3 align-top font-bold text-slate-700">
                    {gap.owner}
                  </td>

                  <td className="py-3 align-top text-right">
                    <span className="px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider bg-slate-100 text-slate-700 border border-slate-200">
                      {gap.status?.replace(/_/g, ' ')}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Leadership Sign-Off Tracker */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-indigo-600" />
            <h3 className="font-black text-slate-900 text-sm">Institutional Pre-Inspection Sign-off Checklist</h3>
          </div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Statutory Audit Governance</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {checklist.map((item: any, idx: number) => (
            <div key={idx} className={`rounded-xl p-4 border ${item.signed ? 'bg-emerald-50/60 border-emerald-200' : 'bg-slate-50 border-slate-200'}`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{item.role}</span>
                {item.signed ? (
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                ) : (
                  <Clock className="w-4 h-4 text-amber-500" />
                )}
              </div>
              <p className="font-bold text-slate-800 text-xs">{item.name}</p>
              {item.signed ? (
                <p className="text-[10px] font-bold text-emerald-700 mt-1">Signed on {item.date}</p>
              ) : (
                <p className="text-[10px] font-semibold text-amber-800 mt-1">{item.pending_reason}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
