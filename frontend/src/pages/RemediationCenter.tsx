import { useState, useEffect } from 'react';
import {
  CheckCircle,
  Clock,
  Cpu,
  UploadCloud,
  PlayCircle,
  Sparkles,
  UserCheck,
  FileCheck,
  ShieldAlert,
  Building2,
  TrendingDown,
  RotateCcw,
  Check,
  X,
  Edit3,
  AlertTriangle,
  Activity,
  Layers,
  ExternalLink,
  Filter
} from 'lucide-react';

interface RemediationProps {
  dashboardData?: any;
  initialCaseId?: string | null;
}

export default function RemediationCenter({ dashboardData, initialCaseId }: RemediationProps) {
  const auditList = dashboardData?.auditList || [];
  const totalOpenRisks = dashboardData?.totalRisks || 4;
  const criticalCount = dashboardData?.complianceData?.find((c: any) => c.name === 'Non-Compliant')?.value || 2;

  // Build complete list of recovery cases dynamically from the Live Scan!
  const dynamicRecoveryItems: any[] = dashboardData?.fullScan?.results
    ?.filter((r: any) => r.status === 'NON_COMPLIANT' || r.status === 'AT_RISK')
    .map((r: any) => {
      const isCritical = r.status === 'NON_COMPLIANT';
      return {
        id: r.requirement_id,
        title: r.requirement_name || r.requirement_id,
        dept: r.department || 'University Compliance',
        deptId: 'DEPT-001',
        severity: isCritical ? 'CRITICAL' : 'MEDIUM RISK',
        riskBadge: isCritical ? '🔴 Critical Risk' : '🟡 Medium Risk',
        category: isCritical ? 'Critical' : 'At Risk',
        riskScore: isCritical ? 92 : 65,
        required: r.required_value || 'Mandatory',
        actual: r.actual_value || r.issue || 'Failed',
        students: 0,
        currentValue: 0,
        requiredValue: 0,
        gapCount: 1,
        gapUnit: 'compliance gap',
        status: isCritical ? '🔴 NON-COMPLIANT' : '🟡 AT_RISK',
        formula: {
          totalStudents: 0,
          targetRatio: r.required_value || 'Compliance Target',
          requiredStaff: 0,
          currentStaff: 0,
          gap: 1
        },
        impact: r.issue || 'Regulatory non-compliance detected requiring immediate remediation action.',
        flow: {
          req: r.required_value || 'Compliance',
          actual: r.actual_value || 'Failed',
          gap: 'Identified Gap',
          correction: 'Apply Remediation'
        },
        recoveryPlan: [
          { step: '01', title: `Analyze failure: ${r.issue || r.requirement_name}`, owner: r.owner || 'Compliance Officer', support: 'AI Agent Swarm', lead: '1 day', priority: 'High', status: '🔴 In Progress' },
          { step: '02', title: `Submit evidence for: ${r.evidence_required || 'Verification'}`, owner: r.owner || 'Department Head', support: 'Registrar', lead: '3 days', priority: 'High', status: '🟡 Pending' },
          { step: '03', title: 'Verify corrective action against regulation', owner: 'Agent54 Engine', support: 'IQAC', lead: '1 day', priority: 'Medium', status: '🔵 Pending Verification' },
          { step: '04', title: 'Re-evaluate compliance status', owner: 'Agent54 Orchestrator', support: 'System', lead: 'Immediate', priority: 'Standard', status: '🟢 Target: Compliant' }
        ],
        whyText: r.issue || `The system detected that ${r.requirement_name} does not meet the regulatory standard.`,
        evidence: [
          r.evidence_required || 'Required compliance documentation',
          'Approval records',
          'Internal audit sign-off',
          'System logs'
        ]
      };
    }) || [];

  if (dynamicRecoveryItems.length === 0) {
    dynamicRecoveryItems.push({
      id: 'REQ-ALL-000',
      title: 'Full Statutory Compliance Maintained',
      dept: 'All Institutional Departments',
      deptId: 'DEPT-000',
      severity: 'COMPLIANT',
      riskBadge: '🟢 Fully Compliant',
      category: 'Compliant',
      riskScore: 10,
      required: '100% Statutory Alignment',
      actual: '100% Alignment',
      students: 0,
      currentValue: 0,
      requiredValue: 0,
      gapCount: 0,
      gapUnit: 'None',
      status: '🟢 COMPLIANT',
      formula: { totalStudents: 0, targetRatio: 'N/A', requiredStaff: 0, currentStaff: 0, gap: 0 },
      impact: 'All monitored systems are currently fully compliant. No active remediation plans required.',
      flow: { req: 'N/A', actual: 'N/A', gap: '0', correction: 'Maintain' },
      recoveryPlan: [
        { step: '01', title: 'Continuous Monitoring Active', owner: 'Agent54 Engine', support: 'IQAC', lead: 'Ongoing', priority: 'Low', status: '🟢 Active' }
      ],
      whyText: 'No regulatory violations detected in the latest live scan.',
      evidence: ['Live scan log']
    });
  }

  const allRecoveryItems: any[] = dynamicRecoveryItems;

  const [activeCategory, setActiveCategory] = useState<'All' | 'Critical' | 'At Risk' | 'Compliant'>('All');
  
  const filteredItems = allRecoveryItems.filter((item: any) => {
    if (activeCategory === 'All') return true;
    if (activeCategory === 'Critical') return item.category === 'Critical';
    if (activeCategory === 'At Risk') return item.category === 'At Risk';
    if (activeCategory === 'Compliant') return item.category === 'Compliant';
    return true;
  });

  // Helper: find item matching an id/title string (case-insensitive, partial match)
  const findItemByKey = (key: string) => {
    if (!key) return null;
    const lower = key.toLowerCase();
    return allRecoveryItems.find(
      (item: any) =>
        item.id === key ||
        item.id.toLowerCase().includes(lower) ||
        item.title.toLowerCase().includes(lower) ||
        lower.includes(item.title.toLowerCase())
    ) || null;
  };

  const resolvedInitialId = initialCaseId
    ? (findItemByKey(initialCaseId)?.id || 'REQ-FSR-001')
    : 'REQ-FSR-001';

  const [selectedId, setSelectedId] = useState<string>(resolvedInitialId);

  useEffect(() => {
    if (initialCaseId) {
      const match = findItemByKey(initialCaseId);
      if (match) {
        setSelectedId(match.id);
        resetSimulation();
      }
    }
  }, [initialCaseId]);

  const selectedItem = allRecoveryItems.find((item: any) => item.id === selectedId) || allRecoveryItems[0];

  // Interactive state for selected remediation item
  const [approvalStatus, setApprovalStatus] = useState<'pending' | 'approved' | 'modified' | 'rejected'>('pending');
  const [checkedEvidence, setCheckedEvidence] = useState<{ [key: string]: boolean }>({
    item0: true,
    item1: true,
    item2: false,
    item3: false
  });
  const [isUploading, setIsUploading] = useState(false);
  const [evidenceUploaded, setEvidenceUploaded] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifiedResult, setVerifiedResult] = useState<boolean | null>(null);

  const toggleEvidence = (key: string) => {
    setCheckedEvidence(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleUpload = () => {
    setIsUploading(true);
    setTimeout(() => {
      setIsUploading(false);
      setEvidenceUploaded(true);
      setCheckedEvidence({
        item0: true,
        item1: true,
        item2: true,
        item3: true
      });
    }, 1000);
  };

  const handleRunVerification = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setVerifiedResult(true);
    }, 1200);
  };

  const resetSimulation = () => {
    setApprovalStatus('pending');
    setEvidenceUploaded(false);
    setVerifiedResult(null);
    setCheckedEvidence({
      item0: true,
      item1: true,
      item2: false,
      item3: false
    });
  };

  const selectItemById = (id: string) => {
    setSelectedId(id);
    resetSimulation();
  };

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalCaseId, setModalCaseId] = useState<string | null>(null);

  const handleOpenModal = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setModalCaseId(id);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setModalCaseId(null);
  };

  const modalItem = allRecoveryItems.find((item: any) => item.id === modalCaseId) || selectedItem;

  return (
    <div className="space-y-7 font-sans pb-10">

      {/* ── PAGE HEADER ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 to-rose-600 flex items-center justify-center shadow-lg shadow-rose-200 text-white">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-slate-800 leading-none">Remediation Center</h2>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-50 text-rose-700 border border-rose-100 flex items-center gap-1">
                🔴 Compliance Recovery Center
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-semibold mt-1">
              Turn compliance gaps into trackable corrective actions · Live Database Integration
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={resetSimulation}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 text-[11px] font-bold shadow-sm transition-all cursor-pointer"
            title="Reset Simulation State for Demo"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
            Reset Demo State
          </button>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 border border-blue-100 rounded-full">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
            <span className="text-[11px] font-black text-blue-700 uppercase tracking-widest">Recovery Engine Active</span>
          </div>
        </div>
      </div>

      {/* ── 1. TOP KPI STRIP (Dynamic from Database) ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
        {/* Open Issues */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex flex-col gap-3 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-amber-500 flex items-center justify-center shadow-md shadow-amber-200">
              <AlertTriangle className="w-4 h-4 text-white" />
            </div>
            <span className="px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest bg-amber-50 text-amber-700 border border-amber-100 flex items-center gap-1">
              🟡 Action Required
            </span>
          </div>
          <p className="text-3xl font-black text-slate-800 leading-none mt-1">{totalOpenRisks || 5}</p>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-tight">Open Issues</p>
        </div>

        {/* Critical Issues */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex flex-col gap-3 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center shadow-md shadow-red-200">
              <ShieldAlert className="w-4 h-4 text-white" />
            </div>
            <span className="px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest bg-red-50 text-red-700 border border-red-100 flex items-center gap-1">
              🔴 High Risk Exposure
            </span>
          </div>
          <p className="text-3xl font-black text-red-600 leading-none mt-1">{criticalCount}</p>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-tight">Critical Issues</p>
        </div>

        {/* In Progress */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex flex-col gap-3 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-md shadow-blue-200">
              <Activity className="w-4 h-4 text-white" />
            </div>
            <span className="px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest bg-blue-50 text-blue-700 border border-blue-100 flex items-center gap-1">
              🔵 Active Plans
            </span>
          </div>
          <p className="text-3xl font-black text-blue-600 leading-none mt-1">{allRecoveryItems.length}</p>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-tight">Total Regulations Checked</p>
        </div>

        {/* Resolution Progress */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex flex-col gap-3 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-md shadow-emerald-200">
              <CheckCircle className="w-4 h-4 text-white" />
            </div>
            <span className="px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest bg-emerald-50 text-emerald-700 border border-emerald-100 flex items-center gap-1">
              🟢 +14% this week
            </span>
          </div>
          <p className="text-3xl font-black text-emerald-600 leading-none mt-1">72%</p>
          <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden mt-0.5">
            <div className="h-full rounded-full bg-emerald-500" style={{ width: '72%' }} />
          </div>
        </div>
      </div>

      {/* ── SELECTOR STRIP WITH CASE DROPDOWN & FILTER TABS (ALL 6 REGULATIONS) ── */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-4">
        
        {/* Prominent Case Selector Header */}
        <div className="bg-slate-900 rounded-xl p-4 text-white flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/30 border border-blue-400/30 flex items-center justify-center text-cyan-300 flex-shrink-0">
              <Cpu className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-cyan-400 block">
                ⚡ Select Case to View AI Recovery Plan
              </span>
              <h3 className="text-sm font-black text-white flex items-center gap-2">
                <span>{selectedItem.title}</span>
                <span className="text-xs text-slate-300 font-semibold">({selectedItem.dept})</span>
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <label htmlFor="case-select" className="text-[11px] font-bold text-slate-300 whitespace-nowrap hidden sm:inline">
              Choose Case:
            </label>
            <select
              id="case-select"
              value={selectedItem.id}
              onChange={(e) => selectItemById(e.target.value)}
              className="bg-slate-800 text-white text-xs font-bold px-3 py-2 rounded-lg border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer w-full sm:w-auto"
            >
              {allRecoveryItems.map((item: any) => (
                <option key={item.id} value={item.id}>
                  {item.category === 'Critical' ? '🔴' : item.category === 'At Risk' ? '🟠' : '🟢'} {item.title} ({item.dept})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-blue-600" />
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-800">
              All Active Regulations & Remediation Cases ({allRecoveryItems.length})
            </h3>
          </div>
          
          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 bg-slate-50 p-1 rounded-xl border border-slate-200">
            <Filter className="w-3.5 h-3.5 text-slate-400 ml-1.5" />
            {(['All', 'Critical', 'At Risk', 'Compliant'] as const).map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-black transition-all cursor-pointer ${
                  activeCategory === cat
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                {cat} {cat === 'All' ? `(${allRecoveryItems.length})` : cat === 'Critical' ? `(2)` : cat === 'At Risk' ? `(3)` : `(1)`}
              </button>
            ))}
          </div>
        </div>

        {/* 6 Case Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.map((item: any) => (
            <div
              key={item.id}
              onClick={() => selectItemById(item.id)}
              className={`p-4 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-3 group relative overflow-hidden ${
                selectedItem.id === item.id
                  ? 'bg-blue-50/90 border-blue-400 shadow-sm ring-2 ring-blue-500/20'
                  : 'bg-slate-50/70 border-slate-100 hover:bg-slate-100/90 hover:border-slate-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`px-2.5 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest border flex items-center gap-1 ${
                  item.category === 'Critical' ? 'bg-red-100 text-red-700 border-red-200' :
                  item.category === 'At Risk' ? 'bg-amber-100 text-amber-700 border-amber-200' : 'bg-emerald-100 text-emerald-700 border-emerald-200'
                }`}>
                  {item.riskBadge}
                </span>
                <span className="text-[10px] font-bold text-slate-400">{item.dept}</span>
              </div>

              <div>
                <p className="text-xs font-black text-slate-800 leading-snug group-hover:text-blue-600 transition-colors">{item.title}</p>
                <p className="text-[10px] text-slate-500 font-bold mt-1">
                  Gap: <span className="text-slate-700 font-black">{item.gapCount} {item.gapUnit}</span>
                </p>
              </div>

              <div 
                onClick={(e) => handleOpenModal(e, item.id)}
                className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] font-black text-blue-600 group-hover:text-blue-700 cursor-pointer">
                <span>Select Case to View AI Recovery Plan</span>
                <ExternalLink className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── 2. PRIMARY SELECTED REMEDIATION CARD ── */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden border-l-4 border-l-red-500 hover:shadow-md transition-all">
        
        {/* Card Header & Badges */}
        <div className="px-5 py-4 bg-gradient-to-r from-red-50/70 via-white to-white border-b border-slate-100 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest bg-red-100 text-red-700 border border-red-200 flex items-center gap-1">
              <ShieldAlert className="w-3.5 h-3.5" />
              {selectedItem.status}
            </span>
            <span className="px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest bg-slate-100 text-slate-700 border border-slate-200 flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5 text-blue-600" />
              Department: {selectedItem.dept}
            </span>
            <span className="text-xs font-bold text-slate-700">
              Requirement: <strong className="text-slate-900 font-black">{selectedItem.title}</strong>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Compliance Risk Score:</span>
            <div className="px-3 py-1 rounded-lg bg-red-600 text-white font-black text-xs tracking-tight flex items-center gap-1.5 shadow-sm">
              <span>{selectedItem.riskScore} / 100</span>
              <span className="text-[8px] uppercase font-black bg-red-800 px-1.5 py-0.5 rounded">{selectedItem.severity}</span>
            </div>
          </div>
        </div>

        {/* Data Grid & Calculation Formula */}
        <div className="p-5 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          
          {/* Metrics Breakdown Grid */}
          <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="bg-slate-50 border border-slate-100 rounded-xl p-3.5 flex flex-col justify-between">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Required Target</p>
              <p className={`font-black text-slate-800 my-1 leading-snug break-words ${String(selectedItem.required).length > 15 ? 'text-sm' : 'text-2xl'}`}>{selectedItem.required}</p>
              <p className="text-[10px] font-bold text-slate-500">Statutory Norm</p>
            </div>

            <div className="bg-red-50/60 border border-red-100 rounded-xl p-3.5 flex flex-col justify-between">
              <p className="text-[9px] font-black text-red-600 uppercase tracking-widest">Actual Status</p>
              <p className={`font-black text-red-600 my-1 leading-snug break-words ${String(selectedItem.actual).length > 15 ? 'text-sm' : 'text-2xl'}`}>{selectedItem.actual}</p>
              <p className="text-[10px] font-bold text-red-500 flex items-center gap-0.5">🔴 Gap Detected</p>
            </div>

            <div className="bg-slate-50 border border-slate-100 rounded-xl p-3.5 flex flex-col justify-between">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Scope Unit</p>
              <p className="text-2xl font-black text-blue-700 my-1">{selectedItem.students}</p>
              <p className="text-[10px] font-bold text-slate-500">{selectedItem.dept} Scope</p>
            </div>

            <div className="bg-slate-50 border border-slate-100 rounded-xl p-3.5 flex flex-col justify-between">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Current Count</p>
              <p className="text-2xl font-black text-slate-800 my-1">{selectedItem.currentValue}</p>
              <p className="text-[10px] font-bold text-slate-500">Active Value</p>
            </div>

            <div className="bg-slate-50 border border-slate-100 rounded-xl p-3.5 flex flex-col justify-between">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Target Threshold</p>
              <p className="text-2xl font-black text-emerald-600 my-1">{selectedItem.requiredValue}</p>
              <p className="text-[10px] font-bold text-slate-500">Target Value</p>
            </div>

            <div className="bg-red-100/50 border border-red-200 rounded-xl p-3.5 flex flex-col justify-between">
              <p className="text-[9px] font-black text-red-700 uppercase tracking-widest">Required Correction</p>
              <p className="text-2xl font-black text-red-700 my-1">{selectedItem.gapCount}</p>
              <p className="text-[10px] font-bold text-red-600">{selectedItem.gapUnit}</p>
            </div>
          </div>

          {/* Formula Calculation Box */}
          <div className="lg:col-span-5 bg-slate-900 rounded-xl p-4 text-white text-xs space-y-3 shadow-sm">
            <div className="flex items-center gap-2 text-cyan-400 font-bold border-b border-slate-800 pb-2">
              <Cpu className="w-4 h-4 text-cyan-400" />
              <span className="text-[11px] font-black uppercase tracking-wider">Automated Compliance Formula</span>
            </div>
            
            <div className="space-y-1.5 font-mono text-[11px] text-slate-300 bg-slate-950/80 p-3 rounded-lg border border-slate-800">
              <div className="flex justify-between">
                <span className="text-slate-400">Total Department Scope:</span>
                <span className="font-bold text-cyan-300">{selectedItem.formula.totalStudents}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Target Standard:</span>
                <span className="font-bold text-slate-200">{selectedItem.formula.targetRatio}</span>
              </div>
              <div className="flex justify-between border-t border-slate-800 pt-1">
                <span className="text-slate-400">Target Required Count:</span>
                <span className="font-bold text-emerald-400">{selectedItem.formula.requiredStaff}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Current Active Count:</span>
                <span className="font-bold text-rose-400">{selectedItem.formula.currentStaff}</span>
              </div>
              <div className="flex justify-between border-t border-slate-800 pt-1 text-xs">
                <span className="text-rose-300 font-bold">Calculated Shortfall:</span>
                <span className="font-black text-rose-400">{selectedItem.formula.gap} ({selectedItem.gapUnit})</span>
              </div>
            </div>

            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-2.5 text-red-200 text-[11px] leading-relaxed">
              <strong className="text-red-300 font-black">Compliance Impact:</strong> “{selectedItem.impact}”
            </div>
          </div>
        </div>
      </div>

      {/* ── 3. REGULATION → GAP VISUALIZATION ── */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-blue-600" />
          <h3 className="text-xs font-black uppercase tracking-widest text-slate-800">
            Regulation → Compliance Gap Analysis Engine
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 relative">
          {/* Node 1 */}
          <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-4 text-center flex flex-col justify-between">
            <div className="text-[9px] font-black uppercase tracking-widest text-blue-700 mb-1">
              01. REGULATORY REQUIREMENT
            </div>
            <div className={`font-black text-blue-900 leading-snug break-words px-1 my-1 ${String(selectedItem.flow.req).length > 20 ? 'text-sm' : 'text-xl'}`}>{selectedItem.flow.req}</div>
            <div className="text-[10px] font-bold text-slate-500 mt-1">Statutory Target</div>
          </div>

          {/* Node 2 */}
          <div className="bg-red-50/50 border border-red-100 rounded-xl p-4 text-center flex flex-col justify-between">
            <div className="text-[9px] font-black uppercase tracking-widest text-red-700 mb-1">
              🔴 02. UNIVERSITY ACTUAL
            </div>
            <div className={`font-black text-red-600 leading-snug break-words px-1 my-1 ${String(selectedItem.flow.actual).length > 20 ? 'text-sm' : 'text-xl'}`}>{selectedItem.flow.actual}</div>
            <div className="text-[10px] font-bold text-slate-500 mt-1">{selectedItem.dept} Current Load</div>
          </div>

          {/* Node 3 */}
          <div className="bg-amber-50/50 border border-amber-100 rounded-xl p-4 text-center flex flex-col justify-between">
            <div className="text-[9px] font-black uppercase tracking-widest text-amber-700 mb-1">
              🟡 03. COMPLIANCE GAP
            </div>
            <div className={`font-black text-amber-600 leading-snug break-words px-1 my-1 ${String(selectedItem.flow.gap).length > 20 ? 'text-sm' : 'text-xl'}`}>{selectedItem.flow.gap}</div>
            <div className="text-[10px] font-bold text-slate-500 mt-1">Regulatory Overload</div>
          </div>

          {/* Node 4 */}
          <div className="bg-emerald-50/50 border border-emerald-100 rounded-xl p-4 text-center flex flex-col justify-between">
            <div className="text-[9px] font-black uppercase tracking-widest text-emerald-700 mb-1">
              🟢 04. REQUIRED CORRECTION
            </div>
            <div className={`font-black text-emerald-600 leading-snug break-words px-1 my-1 ${String(selectedItem.flow.correction).length > 20 ? 'text-sm' : 'text-xl'}`}>{selectedItem.flow.correction}</div>
            <div className="text-[10px] font-bold text-slate-500 mt-1">To Restore Compliance</div>
          </div>
        </div>
      </div>

      {/* ── GRID LAYOUT FOR RECOVERY PLAN & BEFORE/AFTER ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* ── 4. AI RECOVERY PLAN (Left Column - 7 cols) ── */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center">
                <Cpu className="w-4 h-4 text-blue-600" />
              </div>
              <h3 className="font-black text-slate-800 text-sm">AI Recommended Recovery Plan — {selectedItem.title}</h3>
            </div>
            <span className="text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 border border-blue-100">
              4 Step Action Timeline
            </span>
          </div>

          {/* Step Timeline */}
          <div className="space-y-4 relative before:absolute before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-100">
            {selectedItem.recoveryPlan.map((stepItem: any, i: number) => (
              <div key={i} className="relative pl-10">
                <div className={`absolute left-2.5 top-0 -translate-x-1/2 w-6 h-6 rounded-full text-white font-black text-[10px] flex items-center justify-center ring-4 ring-white shadow-sm ${
                  i === 0 ? 'bg-red-600' : i === 1 ? 'bg-amber-500' : i === 2 ? 'bg-blue-600' : 'bg-emerald-600'
                }`}>
                  {stepItem.step}
                </div>
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 space-y-2">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <h4 className="text-xs font-black text-slate-800">{stepItem.title}</h4>
                    <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase border flex items-center gap-1 ${
                      i === 0 ? 'bg-red-100 text-red-700 border-red-200' : i === 1 ? 'bg-amber-100 text-amber-700 border-amber-200' : i === 2 ? 'bg-blue-100 text-blue-700 border-blue-200' : 'bg-emerald-100 text-emerald-700 border-emerald-200'
                    }`}>
                      Status: {stepItem.status}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] pt-1">
                    <div>
                      <span className="text-slate-400 block text-[9px] font-black uppercase">Owner</span>
                      <span className="text-slate-700 font-bold">{stepItem.owner}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[9px] font-black uppercase">Supporting Unit</span>
                      <span className="text-slate-700 font-bold">{stepItem.support}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[9px] font-black uppercase">Lead Time</span>
                      <span className="text-blue-600 font-bold">{stepItem.lead}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[9px] font-black uppercase">Priority</span>
                      <span className="text-red-600 font-black">{stepItem.priority}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── RIGHT COLUMN (5 cols) - BEFORE/AFTER & AI EXPLANATION & PROJECTED IMPACT ── */}
        <div className="lg:col-span-5 space-y-6">

          {/* ── 5. BEFORE → AFTER VISUAL ── */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-800">
                Current vs Target Compliance State
              </h3>
              <span className="text-[9px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                Projected after remediation
              </span>
            </div>

            {/* Side-by-side comparison */}
            <div className="grid grid-cols-2 gap-3 relative">
              {/* Current State */}
              <div className="bg-red-50/60 border border-red-100 rounded-xl p-3.5 text-center space-y-1">
                <span className="text-[9px] font-black uppercase tracking-widest text-red-600 block">CURRENT STATE</span>
                <p className={`font-black text-red-600 break-words my-1 leading-snug px-1 ${String(selectedItem.actual).length > 15 ? 'text-xs sm:text-sm' : 'text-2xl'}`}>{selectedItem.actual}</p>
                <div className="inline-flex items-center gap-1 text-[9px] font-black text-red-700 bg-red-100 px-2 py-0.5 rounded border border-red-200">
                  🔴 NON-COMPLIANT
                </div>
                <div className="text-[11px] text-slate-600 pt-1 space-y-0.5">
                  <p>Active: <strong className="text-slate-800 font-bold">{selectedItem.currentValue}</strong></p>
                  <p>Shortfall: <strong className="text-red-600 font-black">{selectedItem.gapCount}</strong></p>
                </div>
              </div>

              {/* Target State */}
              <div className="bg-emerald-50/60 border border-emerald-100 rounded-xl p-3.5 text-center space-y-1">
                <span className="text-[9px] font-black uppercase tracking-widest text-emerald-700 block">TARGET STATE</span>
                <p className={`font-black text-emerald-600 break-words my-1 leading-snug px-1 ${String(selectedItem.required).length > 15 ? 'text-xs sm:text-sm' : 'text-2xl'}`}>{selectedItem.required}</p>
                <div className="inline-flex items-center gap-1 text-[9px] font-black text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-200">
                  🟢 COMPLIANT
                </div>
                <div className="text-[11px] text-slate-600 pt-1 space-y-0.5">
                  <p>Target: <strong className="text-slate-800 font-bold">{selectedItem.requiredValue}</strong></p>
                  <p>Shortfall: <strong className="text-emerald-600 font-black">0</strong></p>
                </div>
              </div>
            </div>

            <p className="text-[10px] text-center text-slate-400 font-semibold italic">
              Note: Target values reflect projected status after full execution of corrective actions.
            </p>
          </div>

          {/* ── 6. PROJECTED IMPACT PANEL ── */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-800">
                Projected Impact After Successful Remediation
              </h3>
              <TrendingDown className="w-4 h-4 text-emerald-500" />
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-slate-50 border border-slate-100 p-2.5 rounded-lg flex items-center justify-between">
                <span className="text-slate-500 font-bold">Risk Score:</span>
                <span className="font-black text-red-600">🔴 {selectedItem.riskScore} → <strong className="text-emerald-600">🟢 12 (Low)</strong></span>
              </div>
              <div className="bg-slate-50 border border-slate-100 p-2.5 rounded-lg flex items-center justify-between">
                <span className="text-slate-500 font-bold">Gap Count:</span>
                <span className="font-black text-amber-600">🟡 {selectedItem.gapCount} → <strong className="text-emerald-600">🟢 0</strong></span>
              </div>
              <div className="bg-slate-50 border border-slate-100 p-2.5 rounded-lg flex items-center justify-between">
                <span className="text-slate-500 font-bold">Compliance Status:</span>
                <span className="font-black text-red-600">🔴 Fail → <strong className="text-emerald-600">🟢 Pass</strong></span>
              </div>
              <div className="bg-slate-50 border border-slate-100 p-2.5 rounded-lg flex items-center justify-between">
                <span className="text-slate-500 font-bold">Inspection Readiness:</span>
                <span className="font-black text-amber-600">🔴 Low → <strong className="text-blue-600">🟢 High</strong></span>
              </div>
            </div>
          </div>

          {/* ── 7. AI EXPLANATION ── */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50/50 border border-blue-100 rounded-2xl p-5 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <h3 className="text-xs font-black text-slate-800">Why this remediation?</h3>
              </div>
              <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest bg-blue-100 text-blue-700 border border-blue-200">
                AI Reasoning / Evidence Based
              </span>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed font-medium pt-1">
              “{selectedItem.whyText}”
            </p>
          </div>

        </div>
      </div>

      {/* ── LOWER SECTION: HUMAN APPROVAL & EVIDENCE & RE-CHECK ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ── 8. HUMAN APPROVAL ── */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
              <div className="flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-blue-600" />
                <h3 className="text-sm font-black text-slate-800">Administrator Approval</h3>
              </div>
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Required Gate</span>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed mb-4 font-medium">
              Remediation involves institutional commitments. Administrator formal sign-off is required to activate execution.
            </p>

            {/* Approval Workflow Pipeline */}
            <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 text-[11px] space-y-2 mb-4">
              <div className="flex items-center justify-between text-slate-500 font-bold">
                <span>AI Recommendation</span>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
              </div>
              <div className="flex items-center justify-between text-slate-700 font-bold">
                <span>Administrator Review</span>
                <span className={`text-[9px] uppercase font-black px-1.5 py-0.5 rounded flex items-center gap-1 ${
                  approvalStatus === 'approved' ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' :
                  approvalStatus === 'modified' ? 'bg-amber-100 text-amber-700 border border-amber-200' :
                  approvalStatus === 'rejected' ? 'bg-red-100 text-red-700 border border-red-200' : 'bg-blue-100 text-blue-700 border border-blue-200'
                }`}>
                  {approvalStatus === 'approved' ? '🟢 APPROVED' : approvalStatus === 'modified' ? '🟡 MODIFIED' : approvalStatus === 'rejected' ? '🔴 REJECTED' : '🔵 PENDING'}
                </span>
              </div>
              <div className="flex items-center justify-between text-slate-500 font-bold">
                <span>Action Assignment</span>
                <span className="text-[10px] text-slate-400 font-semibold">Pending Approval</span>
              </div>
            </div>
          </div>

          {/* Approval Action Buttons */}
          <div className="space-y-2">
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setApprovalStatus('approved')}
                className={`py-2 px-2.5 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1 cursor-pointer ${
                  approvalStatus === 'approved'
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-200'
                    : 'bg-slate-100 hover:bg-emerald-50 text-emerald-700 border border-slate-200'
                }`}
              >
                <Check className="w-3.5 h-3.5" />
                Approve
              </button>

              <button
                onClick={() => setApprovalStatus('modified')}
                className={`py-2 px-2.5 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1 cursor-pointer ${
                  approvalStatus === 'modified'
                    ? 'bg-amber-500 text-white shadow-md shadow-amber-200'
                    : 'bg-slate-100 hover:bg-amber-50 text-amber-700 border border-slate-200'
                }`}
              >
                <Edit3 className="w-3.5 h-3.5" />
                Modify
              </button>

              <button
                onClick={() => setApprovalStatus('rejected')}
                className={`py-2 px-2.5 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1 cursor-pointer ${
                  approvalStatus === 'rejected'
                    ? 'bg-red-600 text-white shadow-md shadow-red-200'
                    : 'bg-slate-100 hover:bg-red-50 text-red-700 border border-slate-200'
                }`}
              >
                <X className="w-3.5 h-3.5" />
                Reject
              </button>
            </div>

            {approvalStatus !== 'pending' && (
              <div className="text-[11px] text-center font-bold text-slate-700 bg-slate-50 p-2 rounded-lg border border-slate-100">
                Status updated to <strong className="text-blue-600 font-black">{approvalStatus.toUpperCase()}</strong> by Admin
              </div>
            )}
          </div>
        </div>

        {/* ── 9. EVIDENCE CHECKLIST ── */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
              <div className="flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-emerald-600" />
                <h3 className="text-sm font-black text-slate-800">Required Evidence</h3>
              </div>
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">4 Artifacts</span>
            </div>

            {/* Checklist items */}
            <div className="space-y-2 text-xs">
              {selectedItem.evidence.map((ev: any, i: number) => (
                <label key={i} className="flex items-center gap-2.5 p-2 rounded-lg bg-slate-50 border border-slate-100 cursor-pointer hover:bg-slate-100/60 transition-all">
                  <input
                    type="checkbox"
                    checked={checkedEvidence[`item${i}`]}
                    onChange={() => toggleEvidence(`item${i}`)}
                    className="rounded border-slate-300 text-blue-600 focus:ring-0 cursor-pointer"
                  />
                  <span className={checkedEvidence[`item${i}`] ? 'line-through text-slate-400 font-bold' : 'text-slate-700 font-bold'}>
                    {ev}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-2 pt-2">
            <button
              onClick={handleUpload}
              disabled={isUploading}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-black text-xs flex items-center justify-center gap-2 shadow-md shadow-blue-200 transition-all disabled:opacity-50 cursor-pointer"
            >
              <UploadCloud className="w-4 h-4" />
              {isUploading ? 'Uploading & Parsing Evidence...' : 'Upload Evidence Packages'}
            </button>

            <div className="text-[11px] text-center text-slate-500 font-bold bg-slate-50 py-1.5 rounded-lg border border-slate-100">
              Evidence Status: &nbsp;
              <span className={evidenceUploaded ? 'text-emerald-600 font-black' : 'text-amber-600 font-black'}>
                {evidenceUploaded ? '🟢 Uploaded & Ready for Verification' : '🟡 Pending Verification'}
              </span>
            </div>
          </div>
        </div>

        {/* ── 10. VERIFICATION / RE-CHECK ── */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-4 flex flex-col justify-between relative overflow-hidden">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
              <div className="flex items-center gap-2">
                <PlayCircle className="w-4 h-4 text-emerald-600" />
                <h3 className="text-sm font-black text-slate-800">Compliance Re-check</h3>
              </div>
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Rule Engine v4.2</span>
            </div>

            <p className="text-xs text-slate-500 font-medium leading-relaxed mb-3">
              Automated audit recalculation pipeline. Trigger re-verification after uploading evidence.
            </p>

            {/* Workflow steps */}
            <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 text-[11px] space-y-1.5 mb-3 font-mono">
              <div className="flex items-center justify-between text-slate-600">
                <span>Remediation Completed</span>
                <span className="text-emerald-600 font-bold">✓</span>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <span>Evidence Verified</span>
                <span className={evidenceUploaded ? 'text-emerald-600 font-bold' : 'text-slate-300'}>✓</span>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <span>Rule Engine Recalculates</span>
                <span className={verifiedResult ? 'text-emerald-600 font-bold' : 'text-slate-300'}>✓</span>
              </div>
              <div className="flex items-center justify-between border-t border-slate-200 pt-1 text-slate-800 font-bold">
                <span>Compliance Result</span>
                <span className={verifiedResult ? 'text-emerald-600 font-black' : 'text-amber-600 font-bold'}>
                  {verifiedResult ? '🟢 COMPLIANT' : '🟡 Awaiting Engine'}
                </span>
              </div>
            </div>

            {/* Dynamic Result Output Box */}
            {verifiedResult && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-xs text-emerald-900 space-y-1 animate-fadeIn">
                <div className="flex items-center gap-1.5 font-black text-emerald-700 text-xs">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span>🟢 Compliance Restored Successfully!</span>
                </div>
                <div className="text-[11px] space-y-0.5 pt-1 text-slate-700 font-medium">
                  <p>✓ Evidence verified & hashed</p>
                  <p>✓ Regulatory rule evaluated for {selectedItem.dept}</p>
                  <p>✓ Compliance recalculated: <strong className="text-emerald-700 font-bold">{selectedItem.required} Target Met</strong></p>
                </div>
                <div className="pt-1 text-xs font-black text-emerald-700 border-t border-emerald-200 flex justify-between">
                  <span>Calculated Gap Restored:</span>
                  <span>{selectedItem.gapCount} → 0</span>
                </div>
              </div>
            )}
          </div>

          <div className="pt-2">
            <button
              onClick={handleRunVerification}
              disabled={isVerifying}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md shadow-emerald-200 transition-all disabled:opacity-50 cursor-pointer"
            >
              <PlayCircle className="w-4 h-4" />
              {isVerifying ? 'Recalculating Rules...' : 'Run Verification'}
            </button>
          </div>
        </div>

      </div>

      {/* ── 11. REMEDIATION HISTORY TIMELINE (Real Audit Events) ── */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-blue-600" />
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-800">
              Auditability & Remediation Event History (Agent54 System Log)
            </h3>
          </div>
          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Complete Trace Log</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {(auditList.length > 0 ? auditList.slice(0, 5) : [
            { timestamp: '2026-09-01T09:00:00Z', agent: 'Regulation Agent', action: 'Extracted 5 requirements', status: 'success' },
            { timestamp: '2026-09-01T09:01:10Z', agent: 'Compliance Agent', action: 'Ran checks for all depts', status: 'success' },
            { timestamp: '2026-09-01T09:01:15Z', agent: 'Change Monitoring', action: 'Detected REQ supersession', status: 'success' },
            { timestamp: '2026-09-01T09:02:00Z', agent: 'Risk & Priority Agent', action: 'Scored 4 open gaps', status: 'success' },
            { timestamp: '2026-09-01T09:02:40Z', agent: 'Remediation Agent', action: 'Proposed 3 remediation actions', status: 'success' },
          ]).map((evt: any, i: number) => (
            <div key={i} className="bg-slate-50 border border-slate-100 p-3 rounded-xl">
              <div className="text-[9px] font-black text-slate-400 uppercase">
                {evt.timestamp ? new Date(evt.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : `EVT-00${i+1}`}
              </div>
              <div className="text-xs font-black text-blue-700 mt-0.5">{evt.agent}</div>
              <div className="text-[10px] text-slate-600 font-semibold mt-0.5 line-clamp-2">{evt.action}</div>
            </div>
          ))}
        </div>
      </div>



      {/* ── MODAL: AI RECOVERY PLAN ── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm" onClick={handleCloseModal}>
          <div className="bg-white rounded-2xl border border-slate-100 shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col" onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-200 flex items-center justify-center text-blue-600">
                  <Cpu className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-800">AI Recovery Plan</h3>
                  <p className="text-xs text-slate-500 font-semibold">{modalItem.title} • {modalItem.dept}</p>
                </div>
              </div>
              <button onClick={handleCloseModal} className="p-2 bg-white border border-slate-200 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
            
            {/* Modal Body */}
            <div className="p-5 overflow-y-auto space-y-5">
              
              {/* AI Explanation */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50/50 border border-blue-100 rounded-xl p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-blue-600" />
                  <h4 className="text-xs font-black text-slate-800">Problem & Solution Overview</h4>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed font-medium">
                  {modalItem.whyText}
                </p>
                <div className="pt-2 text-xs font-bold text-red-600">
                  Impact: {modalItem.impact}
                </div>
              </div>

              {/* Step Timeline */}
              <div>
                <h4 className="text-xs font-black text-slate-800 mb-3 uppercase tracking-widest border-b border-slate-100 pb-2">Execution Steps</h4>
                <div className="space-y-4 relative before:absolute before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-100">
                  {modalItem.recoveryPlan.map((stepItem: any, i: number) => (
                    <div key={i} className="relative pl-10">
                      <div className={`absolute left-2.5 top-0 -translate-x-1/2 w-6 h-6 rounded-full text-white font-black text-[10px] flex items-center justify-center ring-4 ring-white shadow-sm ${
                        i === 0 ? 'bg-red-600' : i === 1 ? 'bg-amber-500' : i === 2 ? 'bg-blue-600' : 'bg-emerald-600'
                      }`}>
                        {stepItem.step}
                      </div>
                      <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 space-y-2">
                        <div className="flex items-center justify-between flex-wrap gap-2">
                          <h5 className="text-xs font-black text-slate-800">{stepItem.title}</h5>
                          <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase border flex items-center gap-1 ${
                            i === 0 ? 'bg-red-100 text-red-700 border-red-200' : i === 1 ? 'bg-amber-100 text-amber-700 border-amber-200' : i === 2 ? 'bg-blue-100 text-blue-700 border-blue-200' : 'bg-emerald-100 text-emerald-700 border-emerald-200'
                          }`}>
                            Status: {stepItem.status}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px] pt-1">
                          <div><span className="text-slate-400 block font-black uppercase">Owner</span><span className="text-slate-700 font-bold">{stepItem.owner}</span></div>
                          <div><span className="text-slate-400 block font-black uppercase">Support</span><span className="text-slate-700 font-bold">{stepItem.support}</span></div>
                          <div><span className="text-slate-400 block font-black uppercase">Lead Time</span><span className="text-blue-600 font-bold">{stepItem.lead}</span></div>
                          <div><span className="text-slate-400 block font-black uppercase">Priority</span><span className="text-red-600 font-black">{stepItem.priority}</span></div>
                        </div>
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
  );
}
