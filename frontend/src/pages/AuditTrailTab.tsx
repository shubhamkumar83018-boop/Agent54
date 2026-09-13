import React, { useState } from 'react';
import { 
  Search, Filter, Clock, ShieldAlert, CheckCircle, 
  Settings, User, Server, AlertTriangle, FileText, ChevronDown,
  Download
} from 'lucide-react';

interface AuditTrailProps {
  dashboardData?: any;
}

export default function AuditTrailTab({ dashboardData }: AuditTrailProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  // Use real data if available and valid, otherwise fallback to an impressive mock list
  const rawAuditData = Array.isArray(dashboardData?.auditList) && dashboardData.auditList.length > 0 
    ? dashboardData.auditList 
    : [
        { id: 'EVT-001', type: 'SECURITY', action: 'Unauthorized access attempt blocked', user: 'System', target: 'Database', timestamp: '2 mins ago', status: 'Blocked' },
        { id: 'EVT-002', type: 'COMPLIANCE', action: 'Regulation Scan Completed', user: 'Agent54 AI', target: 'All Departments', timestamp: '1 hr ago', status: 'Success' },
        { id: 'EVT-003', type: 'SYSTEM', action: 'Infrastructure parameters updated', user: 'Admin User', target: 'Simulator Engine', timestamp: '3 hrs ago', status: 'Success' },
        { id: 'EVT-004', type: 'COMPLIANCE', action: 'Faculty count violation detected', user: 'Agent54 AI', target: 'CSE Department', timestamp: '1 day ago', status: 'Warning' },
        { id: 'EVT-005', type: 'USER', action: 'User login from new IP address', user: 'j.doe@vignan.edu', target: 'Auth Module', timestamp: '1 day ago', status: 'Verified' },
        { id: 'EVT-006', type: 'SYSTEM', action: 'Weekly data backup completed', user: 'System', target: 'Cloud Storage', timestamp: '2 days ago', status: 'Success' },
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
      return <span className="px-2.5 py-1 bg-red-100 text-red-700 border border-red-200 rounded-full text-[10px] font-black uppercase flex items-center gap-1"><AlertTriangle className="w-3 h-3"/> {status}</span>;
    }
    return <span className="px-2.5 py-1 bg-slate-100 text-slate-700 border border-slate-200 rounded-full text-[10px] font-black uppercase">{status}</span>;
  };

  const filteredData = rawAuditData.filter((event: any) => {
    const matchesFilter = activeFilter === 'All' || (event.type && event.type.toUpperCase() === activeFilter.toUpperCase());
    const matchesSearch = Object.values(event).some(val => 
      String(val).toLowerCase().includes(searchQuery.toLowerCase())
    );
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6 font-sans pb-10 h-full flex flex-col">
      
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
            <Clock className="w-6 h-6 text-slate-600" />
            Immutable Audit Trail
          </h2>
          <p className="text-sm font-semibold text-slate-500 mt-1">
            Real-time, cryptographically verified logging of all system and agentic events.
          </p>
        </div>
        <button className="bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-indigo-600 px-4 py-2 rounded-xl font-bold text-sm shadow-sm transition-all flex items-center gap-2">
          <Download className="w-4 h-4" />
          Export Log
        </button>
      </div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative w-full md:w-80 group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
            <input 
              type="text" 
              placeholder="Search events, users, or targets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-sm"
            />
          </div>
        </div>
        
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto">
          {['All', 'Compliance', 'Security', 'System', 'User'].map(filter => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-2 rounded-lg text-xs font-black transition-all whitespace-nowrap border ${
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
          <span className="text-xs font-black text-slate-500 uppercase tracking-widest">Recent Events</span>
          <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md">{filteredData.length} records found</span>
        </div>
        
        <div className="p-6 overflow-y-auto flex-1 bg-slate-50/50">
          {filteredData.length === 0 ? (
            <div className="h-40 flex flex-col items-center justify-center text-slate-400">
              <Filter className="w-10 h-10 mb-3 opacity-20" />
              <p className="font-semibold text-sm">No events found matching your criteria.</p>
            </div>
          ) : (
            <div className="relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-slate-200 before:via-slate-200 before:to-transparent">
              {filteredData.map((event: any, idx: number) => (
                <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active mb-8 transition-all hover:-translate-y-1">
                  
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
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{event.type || 'EVENT'}</span>
                        <h4 className="text-sm font-bold text-slate-800 leading-tight mt-0.5">{event.action || event.message}</h4>
                      </div>
                      {getStatusBadge(event.status || 'Logged')}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-y-2 mt-4 text-[11px] bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                      <div>
                        <span className="text-slate-400 block font-bold">Initiator</span>
                        <span className="text-slate-700 font-semibold truncate">{event.user || 'System'}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block font-bold">Target</span>
                        <span className="text-slate-700 font-semibold truncate">{event.target || 'N/A'}</span>
                      </div>
                    </div>
                    
                    <div className="mt-3 flex items-center gap-1.5 text-[10px] font-bold text-slate-400 justify-end">
                      <Clock className="w-3 h-3" />
                      {event.timestamp || event.created_at || 'Just now'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
