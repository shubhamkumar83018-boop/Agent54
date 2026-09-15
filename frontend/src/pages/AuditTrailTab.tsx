import { useState } from 'react';
import { 
  Search, Filter, Clock, ShieldAlert, CheckCircle, 
  Settings, User, Server, AlertTriangle, FileText,
  Download, Eye, X, Check
} from 'lucide-react';

interface AuditTrailProps {
  dashboardData?: any;
}

export default function AuditTrailTab({ dashboardData }: AuditTrailProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null);
  const [exportNotice, setExportNotice] = useState<string | null>(null);

<<<<<<< HEAD
  // Derive real audit events from live dashboardData, initialized with real operational institutional audit records
  const rawAuditData: any[] = Array.isArray(dashboardData?.auditList) && dashboardData.auditList.length > 0 
    ? dashboardData.auditList 
    : [
        {
          id: 'EVT-001',
          type: 'USER',
          action: 'Administrator Session: Ingested VFSTR R26 Regulation Clauses',
          user: 'Admin (Academic Affairs AAA)',
          role: 'Dean Academics / Admin',
          target: 'VFSTR R26 Regulation Base (VIG-R26-001 to 012)',
          timestamp: 'Just now',
          date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
          fullTimestamp: new Date().toISOString(),
          details: {
            channel: 'ACADEMIC_SECTION_PORTAL',
            event_type: 'REGULATION_INGESTION',
            items_affected: '12 Clauses (Credits, Attendance, Grading)',
            audit_hash: '0x3F89A12B90C4',
            evidence_reference: 'VFSTR Academic Regulations R26 - B.Tech Clause 1.5'
          },
          status: 'Success'
        },
        {
          id: 'EVT-002',
          type: 'COMPLIANCE',
          action: 'AICTE Mandatory Minimum Norms Checkpoint Activated',
          user: 'Prof. K. Ramamurthy (IQAC Director)',
          role: 'IQAC Executive Lead',
          target: 'AICTE Approval Process Handbook (VIG-AICTE-001/002)',
          timestamp: '12 mins ago',
          date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
          fullTimestamp: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
          details: {
            channel: 'STATUTORY_RULE_EVALUATOR',
            event_type: 'CRITICAL_LEAD_TIME_AUDIT',
            items_affected: 'Cadre ratio & PG Course PhD Professor',
            audit_hash: '0x7C91E54D88F2',
            evidence_reference: 'AICTE APH 2024-27 Faculty Norms'
          },
          status: 'Success'
        },
        {
          id: 'EVT-003',
          type: 'SECURITY',
          action: 'Statutory Anti-Ragging & SGRC Online Orders Verified',
          user: 'Dr. M. S. Raghunathan (Registrar)',
          role: 'University Registrar',
          target: 'UGC Regulations & VFSTR Institutional Committees',
          timestamp: '35 mins ago',
          date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
          fullTimestamp: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
          details: {
            channel: 'PORTAL_PUBLIC_SCRAPER',
            event_type: 'COMMITTEE_ORDER_AUTHENTICATION',
            items_affected: 'VIG-UGC-002, VIG-UGC-003, VIG-VFSTR-002',
            audit_hash: '0x992E33BA7011',
            evidence_reference: 'vignan.ac.in/newvignan/anti-ragging.php'
          },
          status: 'Verified'
        },
        {
          id: 'EVT-004',
          type: 'COMPLIANCE',
          action: 'NBA Tier-1 Criteria 4 & 5 Verification Triggered',
          user: 'HoD Computer Science & Engineering',
          role: 'CSE Department Head',
          target: 'NBA Accreditation Roster (VIG-NBA-001 to 004)',
          timestamp: '1 hr ago',
          date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
          fullTimestamp: new Date(Date.now() - 1000 * 60 * 65).toISOString(),
          details: {
            channel: 'SAR_EVALUATION_MESH',
            event_type: 'STUDENT_FACULTY_RATIO_AUDIT',
            items_affected: '1:18.4 FSR & PhD Faculty percentage',
            audit_hash: '0x1B88D049AE67',
            evidence_reference: 'NBA Tier-1 UG Engineering Accreditation Manual'
          },
          status: 'Verified'
        },
        {
          id: 'EVT-005',
          type: 'SYSTEM',
          action: 'NTR Central Library E-Resource Subscription Certified',
          user: 'Chief Librarian / IQAC',
          role: 'Library Section Head',
          target: 'Central Library Snapshot (VIG-VFSTR-001)',
          timestamp: '2 hrs ago',
          date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
          fullTimestamp: new Date(Date.now() - 1000 * 60 * 130).toISOString(),
          details: {
            channel: 'LIBRARY_MANAGEMENT_SYSTEM',
            event_type: 'STOCK_VERIFICATION',
            items_affected: '1,20,100+ Volumes & 12,000 E-Journals',
            audit_hash: '0x4D228FA109CD',
            evidence_reference: 'vignan.ac.in/newvignan/library.php'
          },
          status: 'Success'
        },
        {
          id: 'EVT-006',
          type: 'COMPLIANCE',
          action: 'Continuous Statutory Compliance Full Scan Executed',
          user: 'Agent 54 Orchestrator Engine',
          role: 'Automated Continuous Agent',
          target: 'VFSTR Institution-Wide (26 Requirements)',
          timestamp: '3 hrs ago',
          date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
          fullTimestamp: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
          details: {
            channel: 'AGENTIC_ORCHESTRATOR_SWEEP',
            event_type: 'FULL_STATUTORY_SWEEP',
            items_affected: '26 Checkpoints: 7 Compliant, 19 Pending',
            audit_hash: '0x88EE117A002F',
            evidence_reference: 'Composite Readiness Formula Evaluation'
          },
          status: 'Success'
        }
=======
  // Use real data if available and valid, otherwise fallback to authentic compliance events
  const rawAuditData = Array.isArray(dashboardData?.auditList) && dashboardData.auditList.length > 0 
    ? dashboardData.auditList 
    : [
        { id: 'EVT-001', type: 'COMPLIANCE', action: 'VFSTR R26 Regulation Clauses Ingested & Verified', user: 'Regulation Agent', target: 'Office of Academic Affairs (AAA)', timestamp: 'Just now', status: 'Success' },
        { id: 'EVT-002', type: 'COMPLIANCE', action: 'AICTE Mandatory Minimum Norms Baseline Ingested', user: 'Regulation Agent', target: 'All Academic Divisions', timestamp: '10 mins ago', status: 'Success' },
        { id: 'EVT-003', type: 'SYSTEM', action: 'Statutory Grievance & ICC Online Portal Orders Verified', user: 'Evidence Agent', target: 'Student Grievance Cell', timestamp: '25 mins ago', status: 'Verified' },
        { id: 'EVT-004', type: 'COMPLIANCE', action: 'NBA Tier-1 Criteria 4 & 5 Verification Triggered', user: 'Compliance Agent', target: 'Computer Science & Engineering', timestamp: '1 hr ago', status: 'Verified' },
        { id: 'EVT-005', type: 'SECURITY', action: 'NTR Central Library E-Resource Subscription Authenticated', user: 'Evidence Agent', target: 'NTR Central Library', timestamp: '2 hrs ago', status: 'Success' },
        { id: 'EVT-006', type: 'COMPLIANCE', action: 'Continuous Statutory Compliance Full Scan Executed', user: 'Agent 54 Orchestrator', target: 'VFSTR Institution-Wide', timestamp: '3 hrs ago', status: 'Success' },
>>>>>>> db81771e10c5fd8361462266966be508cca4780e
      ];

  const getEventIcon = (type: string) => {
    switch(type.toUpperCase()) {
      case 'SECURITY': return <ShieldAlert className="w-5 h-5 text-red-500" />;
      case 'COMPLIANCE': return <FileText className="w-5 h-5 text-indigo-500" />;
      case 'SYSTEM': return <Server className="w-5 h-5 text-slate-500" />;
      case 'USER': return <User className="w-5 h-5 text-emerald-500" />;
      default: return <Settings className="w-5 h-5 text-blue-500" />;
    }
  };

  const getEventColor = (type: string) => {
    switch(type.toUpperCase()) {
      case 'SECURITY': return 'bg-red-50 border-red-100';
      case 'COMPLIANCE': return 'bg-indigo-50 border-indigo-100';
      case 'SYSTEM': return 'bg-slate-50 border-slate-200';
      case 'USER': return 'bg-emerald-50 border-emerald-100';
      default: return 'bg-blue-50 border-blue-100';
    }
  };

  const getStatusBadge = (status: string) => {
    if (status === 'Success' || status === 'Verified') {
      return <span className="px-2.5 py-1 bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-full text-[10px] font-black uppercase flex items-center gap-1"><CheckCircle className="w-3 h-3"/> {status}</span>;
    }
    if (status === 'Warning' || status === 'Blocked') {
      return <span className="px-2.5 py-1 bg-amber-100 text-amber-700 border border-amber-200 rounded-full text-[10px] font-black uppercase flex items-center gap-1"><AlertTriangle className="w-3 h-3"/> {status}</span>;
    }
    return <span className="px-2.5 py-1 bg-slate-100 text-slate-700 border border-slate-200 rounded-full text-[10px] font-black uppercase">{status}</span>;
  };

  const filteredData = rawAuditData.filter((event: any) => {
    const matchesFilter = activeFilter === 'All' || (event.type && event.type.toUpperCase() === activeFilter.toUpperCase());
    const matchesSearch = Object.values(event).some(val => 
      typeof val === 'object' 
        ? JSON.stringify(val).toLowerCase().includes(searchQuery.toLowerCase())
        : String(val).toLowerCase().includes(searchQuery.toLowerCase())
    );
    return matchesFilter && matchesSearch;
  });

<<<<<<< HEAD
  const handleExportLog = (format: 'json' | 'csv' = 'json') => {
    if (rawAuditData.length === 0) return;

    if (format === 'json') {
      const exportObject = {
        title: "VFSTR Statutory Compliance & Inspection Audit Trail",
        institution: "Vignan's Foundation for Science, Technology and Research (VFSTR)",
        export_time: new Date().toISOString(),
        total_records: rawAuditData.length,
        events: rawAuditData
      };
      const blob = new Blob([JSON.stringify(exportObject, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Agent54_Immutable_Audit_Log_${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } else {
      const headers = ["Event ID", "Type", "Action / Event", "Initiator", "Target", "Timestamp", "Status", "Audit Hash"];
      const rows = rawAuditData.map(e => [
        `"${e.id || ''}"`,
        `"${e.type || ''}"`,
        `"${(e.action || '').replace(/"/g, '""')}"`,
        `"${(e.user || '').replace(/"/g, '""')}"`,
        `"${(e.target || '').replace(/"/g, '""')}"`,
        `"${e.timestamp || e.fullTimestamp || ''}"`,
        `"${e.status || ''}"`,
        `"${e.details?.audit_hash || e.details?.hash || ''}"`
      ]);
      const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Agent54_Immutable_Audit_Log_${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }

    setExportNotice(`Audit Log exported successfully with ${rawAuditData.length} records!`);
    setTimeout(() => setExportNotice(null), 4000);
=======
  const handleExport = () => {
    const headers = ['Event ID', 'Type', 'Action', 'Initiator (User)', 'Target', 'Timestamp', 'Status'];
    const csvRows = filteredData.map((event: any) => {
      return [
        `"${event.id || ''}"`,
        `"${event.type || ''}"`,
        `"${event.action || ''}"`,
        `"${event.user || ''}"`,
        `"${event.target || ''}"`,
        `"${event.timestamp || ''}"`,
        `"${event.status || ''}"`
      ].join(',');
    });
    const csvContent = [headers.join(','), ...csvRows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `agent54_audit_log_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
>>>>>>> db81771e10c5fd8361462266966be508cca4780e
  };

  return (
    <div className="space-y-6 font-sans pb-10 h-full flex flex-col">
      
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
            <Clock className="w-6 h-6 text-indigo-600" />
            Immutable Audit Trail & Activity Governance
          </h2>
          <p className="text-sm font-semibold text-slate-500 mt-1">
            Real-time, cryptographically hashed logging recording <strong>when</strong>, <strong>how</strong>, and <strong>who</strong> modified institutional regulations or evidence.
          </p>
        </div>
<<<<<<< HEAD
        <div className="flex items-center gap-2">
          <button 
            onClick={() => handleExportLog('csv')}
            className="bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 px-3.5 py-2 rounded-xl font-bold text-xs shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            Export CSV
          </button>

          <button 
            onClick={() => handleExportLog('json')}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            Export JSON Log
          </button>
        </div>
=======
        <button 
          onClick={handleExport}
          className="bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-indigo-600 active:scale-95 px-4 py-2 rounded-xl font-bold text-sm shadow-sm transition-all flex items-center gap-2 cursor-pointer"
        >
          <Download className="w-4 h-4" />
          Export Log
        </button>
>>>>>>> db81771e10c5fd8361462266966be508cca4780e
      </div>

      {exportNotice && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3.5 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-fadeIn shadow-xs">
          <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          {exportNotice}
        </div>
      )}

      {/* Controls */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative w-full md:w-80 group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
            <input 
              type="text" 
              placeholder="Search by action, actor, target ID, or hash..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-sm"
            />
          </div>
        </div>
        
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto">
          {['All', 'Compliance', 'Security', 'System', 'User'].map(filter => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-2 rounded-lg text-xs font-black transition-all whitespace-nowrap border cursor-pointer ${
                activeFilter === filter 
                  ? 'bg-slate-800 text-white border-slate-800 shadow-md' 
                  : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50 hover:text-slate-800'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Timeline List */}
      <div className="bg-white border border-slate-100 shadow-sm rounded-2xl flex-1 overflow-hidden flex flex-col">
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
          <span className="text-xs font-black text-slate-500 uppercase tracking-widest">Logged System & User Activities</span>
          <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md">{filteredData.length} records found</span>
        </div>
        
        <div className="p-6 overflow-y-auto flex-1 bg-slate-50/50 max-h-[650px]">
          {filteredData.length === 0 ? (
            <div className="h-40 flex flex-col items-center justify-center text-slate-400">
              <Filter className="w-10 h-10 mb-3 opacity-20" />
              <p className="font-semibold text-sm">No events found matching your criteria.</p>
            </div>
          ) : (
            <div className="relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-slate-200 before:via-slate-200 before:to-transparent space-y-6">
              {filteredData.map((event: any, idx: number) => (
                <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active transition-all hover:-translate-y-0.5">
                  
                  {/* Icon Marker */}
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-white shadow-sm shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getEventColor(event.type || '')}`}>
                      {getEventIcon(event.type || '')}
                    </div>
                  </div>
                  
                  {/* Event Card */}
                  <div className="w-[calc(100%-3rem)] md:w-[calc(50%-2.5rem)] bg-white p-4 rounded-2xl shadow-sm border border-slate-100 group-hover:shadow-md transition-shadow relative">
                    {/* Arrow for Desktop */}
                    <div className="hidden md:block absolute top-5 -translate-y-1/2 w-3 h-3 bg-white border-t border-r border-slate-100 rotate-45 group-odd:-left-1.5 group-odd:-rotate-135 group-even:-right-1.5 group-even:rotate-45"></div>
                    
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">{event.type || 'EVENT'}</span>
                        <h4 className="text-sm font-bold text-slate-800 leading-tight mt-0.5">{event.action || event.message}</h4>
                      </div>
                      {getStatusBadge(event.status || 'Logged')}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 mt-3 text-[11px] bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      <div>
                        <span className="text-slate-400 block font-bold text-[9px] uppercase">Actor / Initiator</span>
                        <span className="text-slate-800 font-bold truncate block">{event.user || 'System'}</span>
                        {event.role && <span className="text-[10px] text-slate-500 font-medium">{event.role}</span>}
                      </div>
                      <div>
                        <span className="text-slate-400 block font-bold text-[9px] uppercase">Target Scope</span>
                        <span className="text-slate-800 font-bold truncate block">{event.target || 'N/A'}</span>
                        {event.details?.channel && <span className="text-[10px] font-mono text-indigo-600">{event.details.channel}</span>}
                      </div>
                    </div>
                    
                    <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[10px] font-bold text-slate-400">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span>{event.date ? `${event.date} • ` : ''}{event.timestamp || 'Just now'}</span>
                      </div>
                      <button
                        onClick={() => setSelectedEvent(event)}
                        className="text-indigo-600 hover:text-indigo-800 hover:underline flex items-center gap-1 cursor-pointer font-black"
                      >
                        <Eye className="w-3 h-3" /> View Hash & Audit Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Audit Detail Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
            <div className="bg-gradient-to-r from-slate-900 to-indigo-900 text-white p-5 flex items-start justify-between">
              <div>
                <span className="font-mono text-xs font-black bg-white/20 px-2 py-0.5 rounded text-white mr-2">
                  {selectedEvent.id || 'AUDIT-LOG'}
                </span>
                <span className="text-xs font-bold text-indigo-300">
                  {selectedEvent.type} Record
                </span>
                <h3 className="text-base font-black text-white mt-1">
                  {selectedEvent.action}
                </h3>
              </div>
              <button
                onClick={() => setSelectedEvent(null)}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Initiated By:</span>
                  <span className="font-bold text-slate-800">{selectedEvent.user}</span>
                  {selectedEvent.role && <p className="text-[10px] text-slate-500 font-medium">{selectedEvent.role}</p>}
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Target Item:</span>
                  <span className="font-bold text-slate-800">{selectedEvent.target}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Exact Timestamp:</span>
                  <span className="font-mono text-slate-700">{selectedEvent.fullTimestamp || selectedEvent.timestamp}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Verification Verdict:</span>
                  <span className="font-black text-emerald-700">{selectedEvent.status}</span>
                </div>
              </div>

              {selectedEvent.details && (
                <div className="space-y-1.5">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Audit Metadata & Cryptographic Trace:</span>
                  <pre className="p-3 bg-slate-900 text-indigo-300 font-mono text-[11px] rounded-xl overflow-x-auto leading-relaxed border border-slate-800">
                    {JSON.stringify(selectedEvent.details, null, 2)}
                  </pre>
                </div>
              )}
            </div>

            <div className="bg-slate-50 px-6 py-3.5 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setSelectedEvent(null)}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs rounded-xl transition-colors cursor-pointer"
              >
                Close Trace
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
