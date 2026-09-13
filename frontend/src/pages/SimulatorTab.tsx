import { useState } from 'react';
import { 
  PlayCircle, Activity, TrendingUp, TrendingDown, 
  Settings, Save, AlertTriangle, ShieldCheck, Zap, RotateCcw
} from 'lucide-react';

interface SimulatorProps {
  dashboardData?: any;
}

const DEFAULT_PARAMS = {
  facultyCount: 15,
  studentEnrollment: 10,
  budgetCut: 0,
  infraExpansion: 5
};

export default function SimulatorTab({ dashboardData }: SimulatorProps) {
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationResult, setSimulationResult] = useState<any>(null);

  const [params, setParams] = useState(DEFAULT_PARAMS);

  const baseScore = dashboardData?.complianceScore || 78;

  const runSimulation = async () => {
    setIsSimulating(true);
    setSimulationResult(null);
    
    try {
      const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
      const response = await fetch(`${API_BASE}/api/simulation/predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          facultyCount: params.facultyCount,
          studentEnrollment: params.studentEnrollment,
          budgetCut: params.budgetCut,
          infraExpansion: params.infraExpansion,
          baseScore: baseScore
        })
      });
      const data = await response.json();
      setSimulationResult(data);
    } catch (e) {
      console.error(e);
      // Fallback if backend is down
      let scoreChange = 0;
      scoreChange += (params.facultyCount * 0.5);
      scoreChange -= (params.studentEnrollment * 0.2);
      scoreChange -= (params.budgetCut * 0.4);
      scoreChange += (params.infraExpansion * 0.3);

      const newScore = Math.min(100, Math.max(0, baseScore + scoreChange));
      setSimulationResult({
        oldScore: baseScore,
        newScore: Math.round(newScore),
        status: newScore > 85 ? 'Excellent' : newScore > 75 ? 'Stable' : 'At Risk',
        impacts: [
          { area: 'Faculty-Student Ratio', change: params.facultyCount > 0 ? '+ Improved' : '- Declined' },
          { area: 'Infrastructure Readiness', change: params.infraExpansion > 0 ? '+ Expanded' : 'No Change' },
          { area: 'Financial Health', change: params.budgetCut > 0 ? '- Strained' : 'Stable' }
        ]
      });
    } finally {
      setIsSimulating(false);
    }
  };

  return (
    <div className="space-y-7 font-sans pb-10">
      
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
            <Zap className="w-6 h-6 text-indigo-600" />
            Agentic Compliance Simulator
          </h2>
          <p className="text-sm font-semibold text-slate-500 mt-1">
            Run "What-If" scenarios to predict how organizational changes will impact your compliance standing.
          </p>
        </div>
        <button 
          onClick={runSimulation}
          disabled={isSimulating}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-md transition-all flex items-center gap-2 disabled:opacity-50"
        >
          {isSimulating ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <PlayCircle className="w-4 h-4" />
          )}
          {isSimulating ? 'Simulating...' : 'Run Simulation'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Controls Panel */}
        <div className="lg:col-span-1 bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-6 flex flex-col justify-between min-h-[460px]">
          <div>
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3 mb-5">
              <Settings className="w-4 h-4 text-slate-400" />
              <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider">Simulation Parameters</h3>
            </div>

            {/* Sliders */}
            <div className="space-y-5">
              <div>
                <div className="flex justify-between text-xs font-bold mb-2">
                  <span className="text-slate-700">New Faculty Hires</span>
                  <span className="text-indigo-600 font-black">+{params.facultyCount}</span>
                </div>
                <input type="range" min="0" max="100" value={params.facultyCount} 
                  onChange={(e) => setParams({...params, facultyCount: parseInt(e.target.value)})}
                  className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600" />
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold mb-2">
                  <span className="text-slate-700">Student Enrollment Increase (%)</span>
                  <span className="text-orange-600 font-black">+{params.studentEnrollment}%</span>
                </div>
                <input type="range" min="0" max="100" value={params.studentEnrollment} 
                  onChange={(e) => setParams({...params, studentEnrollment: parseInt(e.target.value)})}
                  className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-orange-500" />
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold mb-2">
                  <span className="text-slate-700">Budget Cuts (%)</span>
                  <span className="text-red-600 font-black">-{params.budgetCut}%</span>
                </div>
                <input type="range" min="0" max="100" value={params.budgetCut} 
                  onChange={(e) => setParams({...params, budgetCut: parseInt(e.target.value)})}
                  className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-red-500" />
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold mb-2">
                  <span className="text-slate-700">Infrastructure Expansion (%)</span>
                  <span className="text-emerald-600 font-black">+{params.infraExpansion}%</span>
                </div>
                <input type="range" min="0" max="100" value={params.infraExpansion} 
                  onChange={(e) => setParams({...params, infraExpansion: parseInt(e.target.value)})}
                  className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-emerald-500" />
              </div>
            </div>
          </div>

          <button
            onClick={() => { setParams(DEFAULT_PARAMS); setSimulationResult(null); }}
            className="w-full py-2.5 px-3 bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer mt-4"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset to Defaults
          </button>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-2 bg-slate-900 rounded-2xl shadow-lg border border-slate-800 p-6 flex flex-col justify-between relative overflow-hidden min-h-[460px]">
          {/* Subtle background glow */}
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-indigo-500/10 blur-[100px] rounded-full pointer-events-none"></div>

          <div className="flex items-center gap-2 border-b border-slate-800 pb-3 mb-6 relative z-10">
            <Activity className="w-4 h-4 text-indigo-400" />
            <h3 className="text-sm font-black text-white uppercase tracking-wider">AI Prediction Engine</h3>
          </div>

          {!simulationResult && !isSimulating && (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-500 relative z-10 py-8">
              <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700 mb-6 text-center min-w-[220px]">
                <p className="text-xs font-bold text-slate-400 mb-2 uppercase tracking-widest">Current Score</p>
                <p className="text-5xl font-black text-slate-200">{baseScore}</p>
              </div>
              <Activity className="w-12 h-12 mb-3 opacity-20" />
              <p className="font-semibold text-sm">Adjust parameters and click "Run Simulation" to generate AI predictions.</p>
            </div>
          )}

          {isSimulating && (
            <div className="flex-1 flex flex-col items-center justify-center relative z-10 py-8">
              <div className="relative w-24 h-24 mb-4">
                <div className="absolute inset-0 border-4 border-indigo-900 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-indigo-400 border-t-transparent rounded-full animate-spin"></div>
                <Zap className="absolute inset-0 m-auto w-8 h-8 text-indigo-400 animate-pulse" />
              </div>
              <p className="font-black text-indigo-300 animate-pulse">Running Neural Models...</p>
            </div>
          )}

          {simulationResult && !isSimulating && (
            <div className="relative z-10 animate-in fade-in zoom-in duration-500 flex-1 flex flex-col justify-between">
              <div>
                <div className="grid grid-cols-2 gap-6 mb-6">
                  {/* Score Comparison */}
                  <div className="bg-slate-800/50 rounded-xl p-5 border border-slate-700">
                    <p className="text-xs font-bold text-slate-400 mb-1">Current Score</p>
                    <p className="text-3xl font-black text-slate-300">{simulationResult.oldScore}</p>
                  </div>
                  
                  <div className="bg-indigo-900/30 rounded-xl p-5 border border-indigo-500/30">
                    <p className="text-xs font-bold text-indigo-300 mb-1">Predicted Score</p>
                    <div className="flex items-center gap-3">
                      <p className="text-4xl font-black text-white">{simulationResult.newScore}</p>
                      {simulationResult.newScore > simulationResult.oldScore ? (
                        <div className="flex items-center text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded text-xs font-bold">
                          <TrendingUp className="w-3 h-3 mr-1" />
                          +{simulationResult.newScore - simulationResult.oldScore}
                        </div>
                      ) : simulationResult.newScore < simulationResult.oldScore ? (
                        <div className="flex items-center text-red-400 bg-red-400/10 px-2 py-1 rounded text-xs font-bold">
                          <TrendingDown className="w-3 h-3 mr-1" />
                          {simulationResult.newScore - simulationResult.oldScore}
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>

                {/* Status and Impacts */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Predicted Posture</h4>
                    <div className="flex items-center gap-3 bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                      {simulationResult.status === 'Excellent' ? (
                        <ShieldCheck className="w-8 h-8 text-emerald-400" />
                      ) : simulationResult.status === 'At Risk' ? (
                        <AlertTriangle className="w-8 h-8 text-red-400" />
                      ) : (
                        <Activity className="w-8 h-8 text-indigo-400" />
                      )}
                      <div>
                        <p className="font-black text-white">{simulationResult.status}</p>
                        <p className="text-xs font-medium text-slate-400">Based on multi-variable projection</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Key Area Impacts</h4>
                    <div className="space-y-2">
                      {simulationResult.impacts.map((impact: any, idx: number) => (
                        <div key={idx} className="flex justify-between items-center bg-slate-800/30 border border-slate-700/50 rounded p-2 text-xs">
                          <span className="font-bold text-slate-300">{impact.area}</span>
                          <span className={`font-black ${
                            impact.change.includes('+') ? 'text-emerald-400' : 
                            impact.change.includes('-') ? 'text-red-400' : 'text-slate-400'
                          }`}>{impact.change}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button className="flex items-center gap-2 text-xs font-bold text-slate-300 hover:text-white transition-colors bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-lg">
                  <Save className="w-3.5 h-3.5" />
                  Save Projection Report
                </button>
              </div>

            </div>
          )}
        </div>
      </div>

      {/* Quick Regulatory Scenarios & Sensitivity Analysis Guide */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div 
          onClick={() => setParams({ facultyCount: 20, studentEnrollment: 5, budgetCut: 0, infraExpansion: 10 })}
          className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-black uppercase tracking-wider bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-md border border-indigo-100">Scenario A</span>
            <span className="text-xs font-bold text-slate-400 group-hover:text-indigo-600 transition-colors">Apply Preset →</span>
          </div>
          <h4 className="text-sm font-black text-slate-800 mb-1">AICTE Faculty Augmentation</h4>
          <p className="text-xs text-slate-500 mb-3 leading-relaxed">
            Adds 20 faculty hires and 10% infrastructure expansion to resolve Cadre Ratio deficit in Tier-2 branches.
          </p>
          <div className="flex items-center gap-2 text-[10px] font-bold text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-100">
            <span>+20 Faculty</span> • <span>+10% Infra</span> • <span>0% Cuts</span>
          </div>
        </div>

        <div 
          onClick={() => setParams({ facultyCount: 30, studentEnrollment: 10, budgetCut: 0, infraExpansion: 25 })}
          className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:border-emerald-300 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-md border border-emerald-100">Scenario B</span>
            <span className="text-xs font-bold text-slate-400 group-hover:text-emerald-600 transition-colors">Apply Preset →</span>
          </div>
          <h4 className="text-sm font-black text-slate-800 mb-1">NAAC A++ Strategic Push</h4>
          <p className="text-xs text-slate-500 mb-3 leading-relaxed">
            Maximal investment model with 30 faculty appointments, library volume acquisitions, and research labs.
          </p>
          <div className="flex items-center gap-2 text-[10px] font-bold text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-100">
            <span>+30 Faculty</span> • <span>+25% Infra</span> • <span>+10% Intake</span>
          </div>
        </div>

        <div 
          onClick={() => setParams({ facultyCount: 5, studentEnrollment: 15, budgetCut: 10, infraExpansion: 0 })}
          className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:border-amber-300 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-black uppercase tracking-wider bg-amber-50 text-amber-700 px-2.5 py-1 rounded-md border border-amber-100">Scenario C</span>
            <span className="text-xs font-bold text-slate-400 group-hover:text-amber-600 transition-colors">Apply Preset →</span>
          </div>
          <h4 className="text-sm font-black text-slate-800 mb-1">Budget Optimization Stress Test</h4>
          <p className="text-xs text-slate-500 mb-3 leading-relaxed">
            Tests resilience under 10% budget contraction and 15% student growth to identify early regulatory risk points.
          </p>
          <div className="flex items-center gap-2 text-[10px] font-bold text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-100">
            <span>+5 Faculty</span> • <span>-10% Budget</span> • <span>+15% Intake</span>
          </div>
        </div>
      </div>
    </div>
  );
}
