
import React from 'react';
import { RotateCcw, Activity, Cpu, ShieldCheck } from 'lucide-react';

interface ServerStatusCardProps {
  name?: string;
  status?: 'Active' | 'Offline' | 'Maintenance';
  memoryUsage?: number;
  onRestart?: () => void;
}

const ServerStatusCard: React.FC<ServerStatusCardProps> = ({
  name = "Ollama Core",
  status = "Active",
  memoryUsage = 64,
  onRestart
}) => {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 w-full max-w-sm relative overflow-hidden group hover:border-yemenBlue/30 transition-all duration-500 shadow-sm">
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-yemenBlue/5 rounded-full blur-3xl group-hover:bg-yemenBlue/10 transition-colors duration-500"></div>
      
      <div className="flex justify-between items-start mb-6 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-slate-100 border border-slate-200 rounded-xl flex items-center justify-center text-yemenBlue group-hover:text-yemenGold transition-colors">
            <ShieldCheck size={20} />
          </div>
          <div>
            <h3 className="font-black text-slate-900 text-sm tracking-tight font-tajawal">{name}</h3>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{status}</span>
            </div>
          </div>
        </div>
        <div className="text-[9px] font-black text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200 uppercase tracking-tighter">
          Sovereign Node
        </div>
      </div>

      <div className="space-y-4 mb-8 relative z-10">
        <div className="space-y-2">
          <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-slate-500">
            <div className="flex items-center gap-1.5">
              <Cpu size={12} className="text-yemenBlue" />
              <span>استهلاك الذاكرة (Memory)</span>
            </div>
            <span className="text-slate-900 font-mono">{memoryUsage}%</span>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden border border-slate-200 p-0.5">
            <div 
              className="bg-gradient-to-r from-yemenBlue to-blue-400 h-full rounded-full transition-all duration-1000"
              style={{ width: `${memoryUsage}%` }}
            ></div>
          </div>
        </div>
      </div>

      <div className="relative z-10">
        <button 
          onClick={onRestart}
          className="w-full bg-yemenBlue hover:bg-yemenBlue-hover text-white py-3 rounded-xl font-black text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 border border-yemenBlue/20 hover:border-yemenGold/50 shadow-md active:scale-95 group/btn"
        >
          <RotateCcw size={14} className="group-hover/btn:rotate-180 transition-transform duration-500" />
          إعادة التشغيل (System Restart)
        </button>
      </div>
    </div>
  );
};

export default ServerStatusCard;
