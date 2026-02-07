import React, { useState } from 'react';
import { Play, Square, RotateCw, MoreVertical, Terminal, Cpu, Database, Loader2, Info, HardDrive, ShieldAlert, X } from 'lucide-react';
import { Service } from '../types';
import TerminalConsole from './TerminalConsole';

interface ServicesGridProps {
  services: Service[];
  onAction: (id: string, action: 'start' | 'stop' | 'restart') => void;
}

const ServicesGrid: React.FC<ServicesGridProps> = ({ services, onAction }) => {
  const [showLogs, setShowLogs] = useState<Record<string, boolean>>({});

  const toggleLogs = (id: string) => {
    setShowLogs(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {services.map(service => (
        <div 
          key={service.id} 
          className={`bg-glass backdrop-blur-glass rounded-2xl border transition-all duration-300 overflow-hidden group relative flex flex-col ${
            service.status === 'restarting' ? 'border-brand-accent ring-2 ring-brand-accent/20 scale-[0.98]' : 'border-border-glass hover:shadow-glow-blue'
          }`}
        >
          {/* Restarting Overlay */}
          {service.status === 'restarting' && (
            <div className="absolute inset-0 bg-panel/70 backdrop-blur-sm z-10 flex flex-col items-center justify-center space-y-3">
                <Loader2 size={32} className="text-brand-primary animate-spin" />
                <p className="text-xs font-bold text-brand-primary animate-pulse uppercase tracking-widest">Communicating with Docker Daemon...</p>
            </div>
          )}

          <div className="p-5 flex-1 flex flex-col">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors border ${
                  service.status === 'running' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 
                  service.status === 'restarting' ? 'bg-brand-accent/10 text-brand-accent border-brand-accent/20' : 'bg-red-500/10 text-red-500 border-red-500/20'
                }`}>
                  <Terminal size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-text-primary leading-tight">{service.name}</h3>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className={`text-[9px] px-1.5 py-0.5 rounded-full uppercase font-bold border ${
                        service.status === 'running' ? 'bg-green-500/10 text-green-400 border-green-500/20' 
                        : service.status === 'restarting' ? 'bg-brand-accent/10 text-brand-accent border-brand-accent/20' : 'bg-red-500/10 text-red-500 border-red-500/20'
                    }`}>
                        {service.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <p className="text-xs text-text-subtle mb-4 leading-relaxed line-clamp-3 hover:line-clamp-none transition-all duration-300 cursor-default flex-1">
              {service.description}
            </p>

            {/* Live Metrics */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <MetricBar label="CPU Usage" value={service.cpu} unit="%" color="bg-brand-primary" />
              <MetricBar label="Memory" value={service.ram} maxValue={8192} unit="MB" color="bg-purple-500" />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 pt-4 border-t border-border-subtle">
              {service.status === 'stopped' ? (
                <button 
                  onClick={() => onAction(service.id, 'start')}
                  className="flex-1 flex items-center justify-center gap-2 bg-brand-primary text-white py-2 rounded-lg hover:bg-brand-primary-hover transition-all text-xs font-bold active:scale-95 shadow-sm"
                >
                  <Play size={14} fill="currentColor" />
                  Start Service
                </button>
              ) : (
                <>
                  <button 
                    onClick={() => onAction(service.id, 'stop')}
                    className="flex-1 flex items-center justify-center gap-2 bg-panel text-text-secondary py-2 rounded-lg hover:bg-red-500/10 hover:text-red-500 transition-all text-xs font-bold active:scale-95 border border-border-subtle hover:border-red-500/20"
                  >
                    <Square size={14} fill="currentColor" />
                    Stop
                  </button>
                  <button 
                    onClick={() => onAction(service.id, 'restart')}
                    className="p-2 text-brand-primary hover:bg-brand-primary/10 rounded-lg border border-border-subtle transition-all active:rotate-180 duration-500"
                    title="Restart"
                  >
                    <RotateCw size={16} />
                  </button>
                </>
              )}
            </div>
          </div>
          
          {/* Terminal / Logs Overlay */}
          {showLogs[service.id] && (
            <div className="bg-slate-950 text-[10px] font-mono p-4 h-48 border-t border-border-subtle animate-in slide-in-from-bottom-2 flex flex-col">
                <div className="flex items-center justify-between text-text-subtle mb-2 border-b border-border-subtle pb-1">
                    <span className="flex items-center gap-1"><Info size={10} /> LIVE_LOGS: {service.name}</span>
                    <button onClick={() => toggleLogs(service.id)} className="hover:text-red-500"><X size={12}/></button>
                </div>
                <div className="text-green-400 flex-1 overflow-y-auto custom-scrollbar">
                    {/* Simplified Log */}
                    <p>[INFO] Initializing environment...</p>
                    <p className="text-blue-400">[DOCKER] Container ID: {service.image.split('/')[0]}_{Math.random().toString(36).substr(2, 5)}</p>
                    <p className="animate-pulse">_</p>
                </div>
            </div>
          )}

          <div className="bg-panel/50 px-5 py-2.5 border-t border-border-subtle flex justify-between items-center">
            <span className="text-[9px] font-mono text-text-subtle uppercase tracking-tighter truncate max-w-[150px]">{service.image}</span>
            <button 
                onClick={() => toggleLogs(service.id)}
                className={`text-[10px] font-bold transition-colors flex items-center gap-1 ${showLogs[service.id] ? 'text-red-500' : 'text-brand-primary hover:underline'}`}
            >
                {showLogs[service.id] ? 'Close Logs' : 'View Logs'}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

const MetricBar: React.FC<{label: string, value: number, maxValue?: number, unit: string, color: string}> = ({label, value, maxValue=100, unit, color}) => (
    <div className="bg-panel p-2.5 rounded-lg border border-border-subtle">
        <div className="flex items-center justify-between mb-1.5">
          <div className="text-[9px] text-text-subtle uppercase font-bold">{label}</div>
          <span className="text-[10px] font-mono font-bold text-text-primary">{value.toFixed(unit === 'MB' ? 0 : 1)}{unit}</span>
        </div>
        <div className="w-full bg-border-subtle h-1.5 rounded-full overflow-hidden">
          <div 
            className={`${color} h-full transition-all duration-1000`} 
            style={{ width: `${(value / maxValue) * 100}%` }}
          ></div>
        </div>
      </div>
);

export default ServicesGrid;