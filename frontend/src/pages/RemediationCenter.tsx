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
  const atRiskCount = dashboardData?.complianceData?.find((c: any) => c.name === 'At Risk')?.value || 2;

  // Build complete list of ALL 6 regulations and recovery cases
  const allRecoveryItems = [
    {
      id: 'FSR-CSE-001',
      title: 'FSR-CSE-001',
      dept: 'CSE',
      deptId: 'DEPT-CSE',
      severity: 'CRITICAL',
      riskBadge: '🔴 Critical Risk',
      category: 'Critical',
      riskScore: 92,
      required: '1 : 20',
      actual: '1 : 26.67',
      students: 1200,
      currentValue: 45,
      requiredValue: 60,
      gapCount: 15,
      gapUnit: 'faculty members',
      status: '🔴 NON-COMPLIANT',
      formula: {
        totalStudents: 1200,
        targetRatio: '1 : 20',
        requiredStaff: 60,
        currentStaff: 45,
        gap: 15
      },
      impact: '15 additional qualified faculty members are required to reach the regulatory 1:20 threshold.',
      flow: {
        req: '1 : 20',
        actual: '1 : 26.67',
        gap: '+6.67 overload',
        correction: '+15 Faculty'
      },
      recoveryPlan: [
        { step: '01', title: 'Recruit 15 qualified faculty', owner: 'HR Department', support: 'CSE Dean', lead: '8–12 weeks', priority: 'Critical', status: '🔴 In Progress' },
        { step: '02', title: 'Assign temporary teaching support', owner: 'CSE Dean', support: 'Academic Council', lead: '1–2 weeks', priority: 'High', status: '🟡 In Progress' },
        { step: '03', title: 'Verify appointment & qualification evidence', owner: 'Registrar', support: 'HR Team', lead: '3–5 days', priority: 'Medium', status: '🔵 Pending Verification' },
        { step: '04', title: 'Re-run compliance verification', owner: 'Agent54 Engine', support: 'Compliance Officer', lead: 'Immediate', priority: 'Standard', status: '🟢 Target: 1:20' }
      ],
      whyText: 'The current CSE faculty strength (45) does not satisfy the required 1:20 ratio for 1,200 students. Adding 15 qualified faculty is the minimum correction required to reach compliance.',
      evidence: [
        'Faculty appointment records',
        'Qualification certificates',
        'Updated faculty database',
        'Department approval'
      ]
    },
    {
      id: 'REQ-COMM-001',
      title: 'Mandatory Anti-Ragging Committee Active Status',
      dept: 'Institutional Governance',
      deptId: 'INST-001',
      severity: 'CRITICAL',
      riskBadge: '🔴 Critical Risk',
      category: 'Critical',
      riskScore: 95,
      required: 'Active Status',
      actual: 'Lapsed 40 Days Ago',
      students: 320,
      currentValue: 0,
      requiredValue: 1,
      gapCount: 1,
      gapUnit: 'reconstitution order',
      status: '🔴 NON-COMPLIANT',
      formula: {
        totalStudents: 320,
        targetRatio: 'Statutory Active',
        requiredStaff: 1,
        currentStaff: 0,
        gap: 1
      },
      impact: 'Statutory mandate requires immediate committee reconstitution and member notification.',
      flow: {
        req: 'Active Status',
        actual: 'Lapsed (40d)',
        gap: 'Mandate Violation',
        correction: 'Reconstitute Committee'
      },
      recoveryPlan: [
        { step: '01', title: 'Draft committee reconstitution order', owner: 'Registrar', support: 'Legal Officer', lead: '2 days', priority: 'Critical', status: '🔴 In Progress' },
        { step: '02', title: 'Appoint faculty & student members', owner: 'Principal / Vice Chancellor', support: 'Deans', lead: '3 days', priority: 'Critical', status: '🔴 In Progress' },
        { step: '03', title: 'Upload signed notification & minutes', owner: 'Registrar Office', support: 'IQAC', lead: '1 day', priority: 'High', status: '🔵 Pending Verification' },
        { step: '04', title: 'Re-verify committee compliance status', owner: 'Agent54 Engine', support: 'Compliance Team', lead: 'Immediate', priority: 'Standard', status: '🟢 Target: Active' }
      ],
      whyText: 'Statutory anti-ragging committee expired 40 days ago. Immediate reconstitution order is mandated by UGC/University Regulations.',
      evidence: [
        'Reconstitution order copy',
        'Member appointment letters',
        'Student representative list',
        'Gazette / Portal notification'
      ]
    },
    {
      id: 'REQ-QUAL-001',
      title: 'Minimum PhD Faculty Cadre Ratio',
      dept: 'Mechanical Engineering',
      deptId: 'DEPT-MECH',
      severity: 'HIGH RISK',
      riskBadge: '🟠 High Risk',
      category: 'At Risk',
      riskScore: 78,
      required: '40% PhD Ratio',
      actual: '22.2% PhD (2 of 9)',
      students: 80,
      currentValue: 2,
      requiredValue: 4,
      gapCount: 2,
      gapUnit: 'PhD faculty',
      status: '🔴 NON-COMPLIANT',
      formula: {
        totalStudents: 80,
        targetRatio: '40% Cadre',
        requiredStaff: 4,
        currentStaff: 2,
        gap: 2
      },
      impact: '2 additional PhD-qualified faculty are required in Mechanical Dept to satisfy the 40% cadre norm.',
      flow: {
        req: '40% PhD Cadre',
        actual: '22.2% Actual',
        gap: '-17.8% Cadre Gap',
        correction: '+2 PhD Faculty'
      },
      recoveryPlan: [
        { step: '01', title: 'Issue targeted recruitment call for PhD holders', owner: 'HoD Mechanical', support: 'HR Department', lead: '60 days', priority: 'High', status: '🟠 In Progress' },
        { step: '02', title: 'Provide fast-track PhD completion support', owner: 'Dean Academics', support: 'Research Cell', lead: '90 days', priority: 'Medium', status: '🟡 In Progress' },
        { step: '03', title: 'Verify doctoral degree certificates', owner: 'Academic Council', support: 'HR', lead: '5 days', priority: 'High', status: '🔵 Pending Verification' },
        { step: '04', title: 'Recalculate PhD cadre percentage', owner: 'Agent54 Engine', support: 'IQAC Officer', lead: 'Immediate', priority: 'Standard', status: '🟢 Target: 40%' }
      ],
      whyText: 'Mechanical department has only 2 PhD faculty out of 9 (22.2%), below the mandatory 40% UGC cadre ratio.',
      evidence: [
        'Doctoral degree certificates',
        'Relieving & Joining reports',
        'Updated department roster',
        'Academic Council approval'
      ]
    },
    {
      id: 'LAB-INFRA-CHECK',
      title: 'Laboratory Infrastructure Readiness',
      dept: 'ECE Department',
      deptId: 'DEPT-ECE',
      severity: 'MEDIUM RISK',
      riskBadge: '🟡 Medium Risk',
      category: 'At Risk',
      riskScore: 55,
      required: 'All Functional',
      actual: '1 Lab Maintenance',
      students: 80,
      currentValue: 1,
      requiredValue: 2,
      gapCount: 1,
      gapUnit: 'lab restoration',
      status: '🟡 AT_RISK',
      formula: {
        totalStudents: 80,
        targetRatio: '100% Functional',
        requiredStaff: 2,
        currentStaff: 1,
        gap: 1
      },
      impact: 'Communication Systems Lab needs signal generator replacement to restore full practical session capacity.',
      flow: {
        req: '2 Functional Labs',
        actual: '1 Under Repair',
        gap: '1 Lab Capacity Gap',
        correction: 'Replace Generator'
      },
      recoveryPlan: [
        { step: '01', title: 'Expedite signal generator procurement & installation', owner: 'HoD ECE', support: 'Maintenance Cell', lead: '10 days', priority: 'Medium', status: '🟡 In Progress' },
        { step: '02', title: 'Temporarily route sessions to Virtual Labs', owner: 'Lab In-Charge', support: 'IT Infra', lead: '1 day', priority: 'Low', status: '🟡 Active' },
        { step: '03', title: 'Inspect equipment commissioning certificate', owner: 'Store Officer', support: 'ECE Tech', lead: '2 days', priority: 'Medium', status: '🔵 Pending Verification' },
        { step: '04', title: 'Re-run lab infrastructure readiness check', owner: 'Agent54 Engine', support: 'Inspection Team', lead: 'Immediate', priority: 'Standard', status: '🟢 Target: Functional' }
      ],
      whyText: 'Communication Systems Lab in ECE is currently under maintenance for signal generator replacement, creating a temporary lab session bottleneck.',
      evidence: [
        'Equipment purchase order',
        'Commissioning certificate',
        'Lab inspection logbook',
        'HoD handover report'
      ]
    },
    {
      id: 'CRED-ECE-001',
      title: 'CRED-ECE-001',
      dept: 'ECE Department',
      deptId: 'DEPT-ECE',
      severity: 'AT RISK',
      riskBadge: '🟡 At Risk',
      category: 'At Risk',
      riskScore: 48,
      required: '160 Credits',
      actual: '158 Assigned',
      students: 80,
      currentValue: 158,
      requiredValue: 160,
      gapCount: 2,
      gapUnit: 'credits shortfall',
      status: '🟡 AT_RISK',
      formula: {
        totalStudents: 80,
        targetRatio: '160 Credits',
        requiredStaff: 160,
        currentStaff: 158,
        gap: 2
      },
      impact: '2-credit curriculum shortfall in B.Tech ECE program requires academic council credit realignment.',
      flow: {
        req: '160 Credits Norm',
        actual: '158 Assigned',
        gap: '-2 Credits Gap',
        correction: '+2 Credit Elective'
      },
      recoveryPlan: [
        { step: '01', title: 'Approve 2-credit elective / mini-project module', owner: 'Board of Studies', support: 'Academic Council', lead: '14 days', priority: 'Medium', status: '🟡 In Progress' },
        { step: '02', title: 'Update course credit matrix in ERP', owner: 'Controller of Exams', support: 'IT Cell', lead: '3 days', priority: 'Medium', status: '🟡 In Progress' },
        { step: '03', title: 'Verify gazette curriculum amendment', owner: 'Dean Academics', support: 'BOS Convener', lead: '2 days', priority: 'Medium', status: '🔵 Pending Verification' },
        { step: '04', title: 'Re-evaluate program credit total', owner: 'Agent54 Engine', support: 'Academic Auditor', lead: 'Immediate', priority: 'Standard', status: '🟢 Target: 160 Credits' }
      ],
      whyText: 'B.Tech ECE curriculum schema currently assigns 158 credits, leaving a 2-credit shortfall against statutory 160-credit degree requirements.',
      evidence: [
        'Board of Studies resolution',
        'Academic Council notification',
        'Updated course catalog',
        'ERP credit matrix dump'
      ]
    },
    {
      id: 'REQ-LIB-001',
      title: 'Library Titles per Student',
      dept: 'Library & Learning Resource',
      deptId: 'LIB-001',
      severity: 'COMPLIANT',
      riskBadge: '🟢 Compliant / Safe',
      category: 'Compliant',
      riskScore: 10,
      required: '1 title per 10 students',
      actual: '1 title per 7.8 students',
      students: 320,
      currentValue: 2500,
      requiredValue: 2500,
      gapCount: 0,
      gapUnit: 'titles (Exceeds Target)',
      status: '🟢 COMPLIANT',
      formula: {
        totalStudents: 320,
        targetRatio: '1 : 10',
        requiredStaff: 2500,
        currentStaff: 2500,
        gap: 0
      },
      impact: 'Library title capacity (2,500 titles for 320 students = 1:7.8) fully satisfies NBA Criterion 5 norms.',
      flow: {
        req: '1 : 10 Target',
        actual: '1 : 7.8 Actual',
        gap: '0 (Exceeds)',
        correction: 'Maintain Status'
      },
      recoveryPlan: [
        { step: '01', title: 'Maintain quarterly journal & title acquisitions', owner: 'Librarian', support: 'Library Committee', lead: 'Ongoing', priority: 'Low', status: '🟢 Active' },
        { step: '02', title: 'Verify e-journal digital access tokens', owner: 'Library Tech', support: 'NIC / Delnet', lead: 'Monthly', priority: 'Low', status: '🟢 Active' },
        { step: '03', title: 'Inspect physical volume accession register', owner: 'Auditor', support: 'Library Team', lead: 'Quarterly', priority: 'Low', status: '🟢 Verified' },
        { step: '04', title: 'Re-run NBA library adequacy check', owner: 'Agent54 Engine', support: 'IQAC Coordinator', lead: 'Immediate', priority: 'Standard', status: '🟢 Target Met' }
      ],
      whyText: 'Library has 2,500 titles for 320 students (1:7.8 ratio), which comfortably exceeds the NBA statutory threshold of 1 title per 10 students.',
      evidence: [
        'Library accession register',
        'E-journal subscription receipt',
        'NBA audit compliance certificate',
        'Physical inventory report'
      ]
    },
    {
      id: 'REQ-FSR-001',
      title: 'Faculty-Student Ratio',
      dept: 'CSE',
      deptId: 'DEPT-CSE',
      severity: 'CRITICAL',
      riskBadge: '🔴 Critical Risk',
      category: 'Critical',
      riskScore: 92,
      required: '<= 20 students per faculty',
      actual: '1200 / 45 = 26.67 students',
      students: 1200,
      currentValue: 45,
      requiredValue: 60,
      gapCount: 15,
      gapUnit: 'faculty members',
      status: '🔴 NON-COMPLIANT',
      formula: {
        totalStudents: 1200,
        targetRatio: '<= 20',
        requiredStaff: 60,
        currentStaff: 45,
        gap: 15
      },
      impact: '15 additional qualified faculty members are required to reach the regulatory <= 20 threshold.',
      flow: {
        req: '<= 20 Target',
        actual: '26.67 Actual',
        gap: '+6.67 overload',
        correction: '+15 Faculty'
      },
      recoveryPlan: [
        { step: '01', title: 'Recruit 15 qualified faculty', owner: 'HR Department', support: 'CSE Dean', lead: '8–12 weeks', priority: 'Critical', status: '🔴 In Progress' },
        { step: '02', title: 'Assign temporary teaching support', owner: 'CSE Dean', support: 'Academic Council', lead: '1–2 weeks', priority: 'High', status: '🟡 In Progress' },
        { step: '03', title: 'Verify appointment & qualification evidence', owner: 'Registrar', support: 'HR Team', lead: '3–5 days', priority: 'Medium', status: '🔵 Pending Verification' },
        { step: '04', title: 'Re-run compliance verification', owner: 'Agent54 Engine', support: 'Compliance Officer', lead: 'Immediate', priority: 'Standard', status: '🟢 Target: <= 20' }
      ],
      whyText: 'The current CSE faculty strength (45) does not satisfy the required <= 20 ratio for 1,200 students. Adding 15 qualified faculty is the minimum correction required to reach compliance.',
      evidence: [
        'Faculty appointment records',
        'Qualification certificates',
        'Updated faculty database',
        'Department approval'
      ]
    },
    {
      id: 'REQ-FSR-002',
      title: 'Faculty-Student Ratio (Amended)',
      dept: 'CSE',
      deptId: 'DEPT-CSE',
      severity: 'HIGH RISK',
      riskBadge: '🟠 High Risk',
      category: 'At Risk',
      riskScore: 75,
      required: '<= 25 students per faculty',
      actual: '1200 / 45 = 26.67 students',
      students: 1200,
      currentValue: 45,
      requiredValue: 48,
      gapCount: 3,
      gapUnit: 'faculty members',
      status: '🔴 NON-COMPLIANT',
      formula: {
        totalStudents: 1200,
        targetRatio: '<= 25',
        requiredStaff: 48,
        currentStaff: 45,
        gap: 3
      },
      impact: '3 additional qualified faculty members are required to reach the amended <= 25 threshold.',
      flow: {
        req: '<= 25 Target',
        actual: '26.67 Actual',
        gap: '+1.67 overload',
        correction: '+3 Faculty'
      },
      recoveryPlan: [
        { step: '01', title: 'Recruit 3 qualified faculty', owner: 'HR Department', support: 'CSE Dean', lead: '4–8 weeks', priority: 'High', status: '🟠 In Progress' },
        { step: '02', title: 'Assign temporary teaching support', owner: 'CSE Dean', support: 'Academic Council', lead: '1–2 weeks', priority: 'Medium', status: '🟡 In Progress' },
        { step: '03', title: 'Verify appointment evidence', owner: 'Registrar', support: 'HR Team', lead: '3–5 days', priority: 'Medium', status: '🔵 Pending Verification' },
        { step: '04', title: 'Re-run amended ratio check', owner: 'Agent54 Engine', support: 'Compliance Officer', lead: 'Immediate', priority: 'Standard', status: '🟢 Target: <= 25' }
      ],
      whyText: 'The current CSE faculty strength (45) does not satisfy the amended <= 25 ratio for 1,200 students. Adding 3 qualified faculty is the minimum correction required to reach compliance under new norms.',
      evidence: [
        'Faculty appointment records',
        'Qualification certificates',
        'Updated faculty database',
        'Department approval'
      ]
    }
  ];

  const [activeCategory, setActiveCategory] = useState<'All' | 'Critical' | 'At Risk' | 'Compliant'>('All');
  
  const filteredItems = allRecoveryItems.filter(item => {
    if (activeCategory === 'All') return true;
    if (activeCategory === 'Critical') return item.category === 'Critical';
    if (activeCategory === 'At Risk') return item.category === 'At Risk';
    if (activeCategory === 'Compliant') return item.category === 'Compliant';
    return true;
  });

  const [selectedId, setSelectedId] = useState<string>(initialCaseId || 'REQ-FSR-001');

  useEffect(() => {
    if (initialCaseId) {
      const match = allRecoveryItems.find(
        item => item.id === initialCaseId || item.id.toLowerCase().includes(initialCaseId.toLowerCase())
      );
      if (match) {
        setSelectedId(match.id);
        resetSimulation();
      }
    }
  }, [initialCaseId]);

  const selectedItem = allRecoveryItems.find(item => item.id === selectedId) || allRecoveryItems[0];

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

  const modalItem = allRecoveryItems.find(item => item.id === modalCaseId) || selectedItem;

  return (
    <div className="space-y-6 font-sans pb-10">

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
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Open Issues */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex flex-col gap-2 hover:shadow-md transition-shadow">
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
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex flex-col gap-2 hover:shadow-md transition-shadow">
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
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex flex-col gap-2 hover:shadow-md transition-shadow">
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
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex flex-col gap-2 hover:shadow-md transition-shadow">
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
              {allRecoveryItems.map((item) => (
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredItems.map((item) => (
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
            <div className="bg-slate-50 border border-slate-100 rounded-xl p-3.5">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Required Target</p>
              <p className="text-2xl font-black text-slate-800 mt-0.5">{selectedItem.required}</p>
              <p className="text-[10px] font-bold text-slate-500">Statutory Norm</p>
            </div>

            <div className="bg-red-50/60 border border-red-100 rounded-xl p-3.5">
              <p className="text-[9px] font-black text-red-600 uppercase tracking-widest">Actual Status</p>
              <p className="text-2xl font-black text-red-600 mt-0.5">{selectedItem.actual}</p>
              <p className="text-[10px] font-bold text-red-500 flex items-center gap-0.5">🔴 Gap Detected</p>
            </div>

            <div className="bg-slate-50 border border-slate-100 rounded-xl p-3.5">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Scope Unit</p>
              <p className="text-2xl font-black text-blue-700 mt-0.5">{selectedItem.students}</p>
              <p className="text-[10px] font-bold text-slate-500">{selectedItem.dept} Scope</p>
            </div>

            <div className="bg-slate-50 border border-slate-100 rounded-xl p-3.5">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Current Count</p>
              <p className="text-2xl font-black text-slate-800 mt-0.5">{selectedItem.currentValue}</p>
              <p className="text-[10px] font-bold text-slate-500">Active Value</p>
            </div>

            <div className="bg-slate-50 border border-slate-100 rounded-xl p-3.5">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Target Threshold</p>
              <p className="text-2xl font-black text-emerald-600 mt-0.5">{selectedItem.requiredValue}</p>
              <p className="text-[10px] font-bold text-slate-500">Target Value</p>
            </div>

            <div className="bg-red-100/50 border border-red-200 rounded-xl p-3.5">
              <p className="text-[9px] font-black text-red-700 uppercase tracking-widest">Required Correction</p>
              <p className="text-2xl font-black text-red-700 mt-0.5">{selectedItem.gapCount}</p>
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
          <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-4 text-center">
            <div className="text-[9px] font-black uppercase tracking-widest text-blue-700 mb-1">
              01. REGULATORY REQUIREMENT
            </div>
            <div className="text-2xl font-black text-blue-900">{selectedItem.flow.req}</div>
            <div className="text-[10px] font-bold text-slate-500 mt-1">Statutory Target</div>
          </div>

          {/* Node 2 */}
          <div className="bg-red-50/50 border border-red-100 rounded-xl p-4 text-center">
            <div className="text-[9px] font-black uppercase tracking-widest text-red-700 mb-1">
              🔴 02. UNIVERSITY ACTUAL
            </div>
            <div className="text-2xl font-black text-red-600">{selectedItem.flow.actual}</div>
            <div className="text-[10px] font-bold text-slate-500 mt-1">{selectedItem.dept} Current Load</div>
          </div>

          {/* Node 3 */}
          <div className="bg-amber-50/50 border border-amber-100 rounded-xl p-4 text-center">
            <div className="text-[9px] font-black uppercase tracking-widest text-amber-700 mb-1">
              🟡 03. COMPLIANCE GAP
            </div>
            <div className="text-2xl font-black text-amber-600">{selectedItem.flow.gap}</div>
            <div className="text-[10px] font-bold text-slate-500 mt-1">Regulatory Overload</div>
          </div>

          {/* Node 4 */}
          <div className="bg-emerald-50/50 border border-emerald-100 rounded-xl p-4 text-center">
            <div className="text-[9px] font-black uppercase tracking-widest text-emerald-700 mb-1">
              🟢 04. REQUIRED CORRECTION
            </div>
            <div className="text-2xl font-black text-emerald-600">{selectedItem.flow.correction}</div>
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
            {selectedItem.recoveryPlan.map((stepItem, i) => (
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
                <p className="text-2xl font-black text-red-600">{selectedItem.actual}</p>
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
                <p className="text-2xl font-black text-emerald-600">{selectedItem.required}</p>
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
              {selectedItem.evidence.map((ev, i) => (
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
                  {modalItem.recoveryPlan.map((stepItem, i) => (
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
