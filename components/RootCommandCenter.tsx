import React, { useState, useEffect } from 'react';
import { 
  TowerControl, Activity, Cpu, Database, HardDrive, 
  RefreshCcw, ShieldCheck, Zap, Server, Loader2,
  Box, AlertTriangle, Monitor, Sliders, GitBranch,
  Network, Share2, Terminal, ShieldAlert, Radio
} from 'lucide-react';
import ServicesGrid from './ServicesGrid';
import TerminalConsole from './TerminalConsole';
import { Service } from '../types';
import { INITIAL_SERVICES } from '../constants';

const RootCommandCenter: React.FC = () => {
  const [services, setServices] = useState<Service[]>(INITIAL_SERVICES);
  const [gpuLoad, setGpuLoad] = useState(42);
  const [activeRouter, setActiveRouter] = useState<'local' | 'hybrid'>('hybrid');

  const handleServiceAction = (id: string, action: 'start' | 'stop' | 'restart') => {
    setServices(prev => prev.map(s => {
      if (s.id === id) {
        if (action === 'restart') {
          s.status = 'restarting';
          setTimeout(() => setServices(p => p.map(x => x.id === id ? {...x, status: 'running'} : x)), 2000);
        } else {
          s.status = action === 'start' ? 'running' : 'stopped';
        }
      }
      return s;
    }));
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-700 pb-20 font-tajawal text-text-primary">
      {/* Tactical NOC Header */}
      <div className="bg-panel p-6 rounded-3xl flex flex-col xl:flex-row items-center justify-between gap-6 border border-border-subtle border-r-8 border-r-brand-accent shadow-elevation relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-accent/5 rounded-full -mr-32 -mt-32 blur-3xl animate-pulse"></div>
        
        <div className="flex items-center gap-6 relative z-10">
          <div className="w-16 h-16 bg-canvas border border-border-subtle rounded-2xl flex items-center justify-center text-brand-accent shadow-glow-accent">
            <TowerControl size={32} />
          </div>
          <div>
            <h2 className="text-3xl font-black text-text-primary leading-none uppercase tracking-tight">برج المراقبة المركزي (NOC)</h2>
            <div className="flex items-center gap-3 mt-3">
               <span className="text-[10px] text-brand-accent font-black uppercase tracking-[0.3em]">Sovereign Infrastructure Monitor v2.0</span>
               <div className="h-3 w-px bg-border-subtle"></div>
               <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse shadow-glow-green"></div>
                  <span className="text-[9px] font-black text-green-500 uppercase tracking-widest px-1">AIRouter: Online</span>
               </div>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 items-center relative z-10">
           <div className="flex bg-canvas p-1 rounded-xl border border-border-subtle shadow-inner">
              <button 
                onClick={() => setActiveRouter('local')}
                className={`px-4 py-2 rounded-lg text-[9px] font-black uppercase transition-all ${activeRouter === 'local' ? 'bg-red-500 text-white shadow-lg' : 'text-text-subtle hover:text-text-primary'}`}
              >Local Only</button>
              <button 
                onClick={() => setActiveRouter('hybrid')}
                className={`px-4 py-2 rounded-lg text-[9px] font-black uppercase transition-all ${activeRouter === 'hybrid' ? 'bg-brand-primary text-white shadow-lg' : 'text-text-subtle hover:text-text-primary'}`}
              >Hybrid Active</button>
           </div>
           <ResourceGauge label="Cluster Load" value={gpuLoad} color="bg-brand-accent" />
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Main Services Control */}
        <div className="xl:col-span-8 space-y-6">
            <div className="bg-panel rounded-[2.5rem] p-8 border border-border-subtle shadow-elevation relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none"><Monitor size={120} /></div>
                <div className="flex items-center justify-between mb-8 relative z-10">
                    <div>
                      <h3 className="text-sm font-black text-text-primary uppercase tracking-widest flex items-center gap-2">
                          <Box size={16} className="text-brand-primary"/> مصفوفة الوحدات الاستراتيجية
                      </h3>
                      <p className="text-[10px] text-text-subtle font-bold mt-1 uppercase">Docker Containerized Services Management</p>
                    </div>
                    <div className="flex items-center gap-3">
                       <button className="p-2.5 text-text-subtle hover:text-brand-primary transition-all bg-canvas rounded-xl border border-border-subtle shadow-sm active:scale-95"><RefreshCcw size={16}/></button>
                    </div>
                </div>
                <ServicesGrid services={services} onAction={handleServiceAction} />
            </div>
        </div>

        {/* Real-time Telemetry & AIRouter Logic */}
        <div className="xl:col-span-4 flex flex-col gap-6">
            <div className="bg-slate-900 text-white rounded-[2rem] p-6 border border-slate-800 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-primary via-brand-accent to-brand-primary"></div>
                <h3 className="text-xs font-black text-brand-accent uppercase tracking-widest mb-6 flex items-center gap-2">
                   <Network size={16} /> منطق التوجيه (AIRouter Telemetry)
                </h3>
                <div className="space-y-4">
                   <RouterStat label="Local Requests (Ollama)" count={1242} percentage={65} color="bg-green-500" />
                   <RouterStat label="Cloud Requests (Gemini)" count={652} percentage={35} color="bg-brand-primary" />
                   <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                         <Zap size={14} className="text-brand-accent" />
                         <span className="text-[10px] font-bold text-slate-400 uppercase">Avg Response Time</span>
                      </div>
                      <span className="text-xs font-mono font-bold text-brand-accent">450ms</span>
                   </div>
                </div>
            </div>

            <div className="bg-panel rounded-[2rem] p-6 border border-border-subtle shadow-elevation">
                <h3 className="text-xs font-black text-text-primary uppercase tracking-widest mb-6 flex items-center gap-2">
                   <ShieldAlert size={16} className="text-red-500" /> تنبيهات الحوكمة (Sovereign Alerts)
                </h3>
                <div className="space-y-3">
                   <AlertItem type="info" msg="تم حظر طلب وصول لبيانات شخصية (Constitutional Guard)" />
                   <AlertItem type="warning" msg="Ollama VRAM usage exceeded 85% - Scaling..." />
                   <AlertItem type="success" msg="تمت مزامنة سجلات الـ AIRouter بنجاح." />
                </div>
            </div>

            <div className="flex-1 bg-slate-950 rounded-[2rem] p-6 border border-slate-800 shadow-elevation overflow-hidden flex flex-col min-h-[300px]">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <Terminal size={14} /> Kernel Shell Access
                  </h3>
                  <div className="flex gap-1">
                     <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                     <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                     <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  </div>
                </div>
                <div className="flex-1">
                    <TerminalConsole />
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

const ResourceGauge: React.FC<{label: string, value: number, color: string}> = ({label, value, color}) => (
    <div className="bg-canvas border border-border-subtle p-3 px-5 rounded-xl shadow-inner min-w-[160px] group hover:border-brand-accent/30 transition-all">
        <div className="flex justify-between items-center mb-2">
            <span className="text-[9px] font-black text-text-subtle uppercase tracking-widest">{label}</span>
            <span className="text-xs font-mono font-black text-text-primary">{value}%</span>
        </div>
        <div className="w-full bg-border-subtle h-1 rounded-full overflow-hidden">
            <div className={`${color} h-full transition-all duration-1000 shadow-glow-blue`} style={{ width: `${value}%` }}></div>
        </div>
    </div>
);

const RouterStat: React.FC<{label: string, count: number, percentage: number, color: string}> = ({label, count, percentage, color}) => (
    <div className="space-y-1.5">
       <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase">
          <span>{label}</span>
          <span className="font-mono">{count}</span>
       </div>
       <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
          <div className={`${color} h-full transition-all duration-700`} style={{ width: `${percentage}%` }}></div>
       </div>
    </div>
);

const AlertItem: React.FC<{type: 'info' | 'warning' | 'success', msg: string}> = ({type, msg}) => {
  const colors = {
    info: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    warning: 'bg-red-500/10 text-red-500 border-red-500/20',
    success: 'bg-green-500/10 text-green-500 border-green-500/20'
  };
  return (
    <div className={`p-3 rounded-xl border text-[10px] font-bold leading-relaxed animate-in slide-in-from-right-2 ${colors[type]}`}>
       {msg}
    </div>
  );
};

export default RootCommandCenter;