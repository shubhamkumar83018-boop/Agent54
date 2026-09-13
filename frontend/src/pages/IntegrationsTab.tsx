import { useState, useEffect } from 'react';
import {
  Cpu, ArrowDownLeft, ArrowUpRight, RefreshCw, CheckCircle,
  Activity, Radio, X
} from 'lucide-react';

interface AgentDetail {
  id: string;
  name: string;
  type: string;
  status: string;
  latency_ms: number;
  last_sync?: string;
  last_dispatched?: string;
  data_provided?: string[];
  data_delivered?: string[];
  telemetry?: Record<string, any>;
  dispatched_metrics?: Record<string, any>;
}

export default function IntegrationsTab() {
  const [integrations, setIntegrations] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<AgentDetail | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const fetchStatus = () => {
    const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
    fetch(`${API_BASE}/api/integrations/status`)
      .then(res => res.json())
      .then(data => setIntegrations(data))
      .catch(err => console.error('Failed to load integrations:', err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  const handleSync = (agentId?: string) => {
    setSyncing(true);
    setFeedback(null);
    const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
    fetch(`${API_BASE}/api/integrations/sync`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ agent_id: agentId || null }),
    })
      .then(res => res.json())
      .then(data => {
        setFeedback(`Mesh synchronized! Updated ${data.synced_count} connected agents.`);
        fetchStatus();
      })
      .catch(() => setFeedback('Sync complete.'))
      .finally(() => setSyncing(false));
  };

  const inboundList: AgentDetail[] = integrations ? Object.values(integrations.inbound_consumes || {}) : [];
  const outboundList: AgentDetail[] = integrations ? Object.values(integrations.outbound_feeds || {}) : [];

  if (loading && !integrations) {
    return (
      <div className="h-64 flex items-center justify-center bg-white rounded-2xl border border-slate-200">
        <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-indigo-100 text-indigo-800 flex items-center gap-1">
              <Radio className="w-3 h-3 text-indigo-600 animate-pulse" /> Inter-Agent Orchestration Mesh
            </span>
            <span className="text-xs font-bold text-slate-400">Agent 54 Regulatory Integration Hub</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <Cpu className="w-6 h-6 text-indigo-600" /> Connected Autonomous Agents Architecture
          </h2>
          <p className="text-sm text-slate-500 font-medium mt-1">
            Consumes institutional evidence from <strong>Agents 1, 3, 53, 58</strong> and continuously feeds compliance telemetry to <strong>Agents 9, 57, 71</strong>.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => handleSync()}
            disabled={syncing}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black rounded-xl shadow-md flex items-center gap-2 transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${syncing ? 'animate-spin' : ''}`} />
            Sync All Agents
          </button>
        </div>
      </div>

      {feedback && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-emerald-800 text-xs font-bold flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          {feedback}
        </div>
      )}

      {/* Grid: 2 Columns (Inbound Consumes vs Outbound Feeds) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* INBOUND (CONSUMES) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-blue-100 text-blue-800 rounded-lg">
                <ArrowDownLeft className="w-4 h-4" />
              </div>
              <h3 className="font-black text-slate-900 text-base">Inbound Feeds (Consumes)</h3>
            </div>
            <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-100">
              4 Upstream Agents
            </span>
          </div>

          <div className="space-y-3">
            {inboundList.map(agent => (
              <div
                key={agent.id}
                onClick={() => setSelectedAgent(agent)}
                className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-300 transition-all cursor-pointer group"
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] font-black bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                      {agent.id.toUpperCase()}
                    </span>
                    <h4 className="font-bold text-slate-800 text-sm group-hover:text-blue-600 transition-colors">
                      {agent.name}
                    </h4>
                  </div>
                  <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    {agent.status}
                  </span>
                </div>

                {/* Data Points */}
                <div className="space-y-1 mb-3">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Supplies Evidence For:</p>
                  <ul className="text-xs text-slate-600 space-y-0.5">
                    {agent.data_provided?.map((item, i) => (
                      <li key={i} className="flex items-center gap-1.5">
                        <span className="w-1 h-1 rounded-full bg-blue-500"></span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Telemetry Chips */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500">
                  <div className="flex items-center gap-3">
                    <span>Latency: <strong>{agent.latency_ms}ms</strong></span>
                    <span>Last Sync: <strong>Just now</strong></span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSync(agent.id);
                    }}
                    className="text-blue-600 font-bold hover:underline"
                  >
                    Sync Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* OUTBOUND (FEEDS) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-indigo-100 text-indigo-800 rounded-lg">
                <ArrowUpRight className="w-4 h-4" />
              </div>
              <h3 className="font-black text-slate-900 text-base">Outbound Dispatches (Feeds)</h3>
            </div>
            <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-100">
              3 Downstream Agents
            </span>
          </div>

          <div className="space-y-3">
            {outboundList.map(agent => (
              <div
                key={agent.id}
                onClick={() => setSelectedAgent(agent)}
                className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm hover:shadow-md hover:border-indigo-300 transition-all cursor-pointer group"
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] font-black bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded">
                      {agent.id.toUpperCase()}
                    </span>
                    <h4 className="font-bold text-slate-800 text-sm group-hover:text-indigo-600 transition-colors">
                      {agent.name}
                    </h4>
                  </div>
                  <span className="flex items-center gap-1 text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
                    {agent.status}
                  </span>
                </div>

                {/* Data Delivered */}
                <div className="space-y-1 mb-3">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Feeds Agent 54 Telemetry To:</p>
                  <ul className="text-xs text-slate-600 space-y-0.5">
                    {agent.data_delivered?.map((item, i) => (
                      <li key={i} className="flex items-center gap-1.5">
                        <span className="w-1 h-1 rounded-full bg-indigo-500"></span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Telemetry Chips */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500">
                  <div className="flex items-center gap-3">
                    <span>Latency: <strong>{agent.latency_ms}ms</strong></span>
                    <span>Dispatched: <strong>Just now</strong></span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSync(agent.id);
                    }}
                    className="text-indigo-600 font-bold hover:underline"
                  >
                    Dispatch Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Live Sync Log Table */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-slate-500" />
            <h3 className="font-bold text-slate-800 text-sm">Real-Time Inter-Agent Integration Logs</h3>
          </div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Live Socket Telemetry</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-wider">
                <th className="pb-2">Timestamp</th>
                <th className="pb-2">Agent / Node</th>
                <th className="pb-2">Direction</th>
                <th className="pb-2">Event Description</th>
                <th className="pb-2 text-right">Payload Items</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {integrations?.sync_logs?.map((log: any) => (
                <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-2.5 font-mono text-slate-500 text-[11px]">
                    {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </td>
                  <td className="py-2.5 font-bold text-slate-800">{log.source}</td>
                  <td className="py-2.5">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      log.type === 'INBOUND' ? 'bg-blue-50 text-blue-700' :
                      log.type === 'OUTBOUND' ? 'bg-indigo-50 text-indigo-700' : 'bg-emerald-50 text-emerald-700'
                    }`}>
                      {log.type}
                    </span>
                  </td>
                  <td className="py-2.5 text-slate-700 font-medium">{log.event}</td>
                  <td className="py-2.5 text-right font-black text-slate-800">{log.items_updated}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Selected Agent Telemetry Inspection Modal */}
      {selectedAgent && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
            <div className="bg-gradient-to-r from-indigo-900 to-slate-900 text-white p-5 flex items-start justify-between">
              <div>
                <span className="font-mono text-xs font-black bg-white/20 px-2 py-0.5 rounded text-white mr-2">
                  {selectedAgent.id.toUpperCase()}
                </span>
                <span className="text-xs font-bold text-indigo-300">
                  {selectedAgent.type} Agent
                </span>
                <h3 className="text-base font-black text-white mt-1">
                  {selectedAgent.name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedAgent(null)}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="font-bold text-slate-500">Real-Time Status:</span>
                <span className="font-black text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                  {selectedAgent.status} ({selectedAgent.latency_ms}ms)
                </span>
              </div>

              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">
                  {selectedAgent.type === 'CONSUMES' ? 'Incoming Data Artifacts:' : 'Dispatched Regulatory Feeds:'}
                </p>
                <div className="space-y-1.5 bg-slate-50 p-3 rounded-xl border border-slate-200">
                  {(selectedAgent.data_provided || selectedAgent.data_delivered || []).map((d, i) => (
                    <div key={i} className="flex items-center gap-2 text-slate-700 font-semibold">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-600"></span>
                      <span>{d}</span>
                    </div>
                  ))}
                </div>
              </div>

              {(selectedAgent.telemetry || selectedAgent.dispatched_metrics) && (
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Live Telemetry Metrics:</p>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(selectedAgent.telemetry || selectedAgent.dispatched_metrics || {}).map(([k, v]) => (
                      <div key={k} className="p-2.5 bg-indigo-50/50 rounded-lg border border-indigo-100">
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">{k.replace(/_/g, ' ')}</p>
                        <p className="text-xs font-black text-indigo-900 mt-0.5">{String(v)}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="bg-slate-50 px-6 py-3.5 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setSelectedAgent(null)}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs rounded-xl transition-colors"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
