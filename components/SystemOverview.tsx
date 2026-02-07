
import React, { useState, useEffect } from 'react';
import { Cpu, Database, Activity, Globe, ShieldCheck, Zap, Server, BarChart3 } from 'lucide-react';
import { Service } from '../types';

interface SystemOverviewProps {
  services: Service[];
}

const SystemOverview: React.FC<SystemOverviewProps> = ({ services }) => {
  const [telemetry, setTelemetry] = useState({
    gpuLoad: 42,
    vramUsed: 12.4,
    networkSec: '99.9%'
  });

  // Simulate live telemetry from Ray Cluster
  useEffect(() => {
    const interval = setInterval(() => {
      setTelemetry(prev => ({
        ...prev,
        gpuLoad: Math.max(10, Math.min(95, prev.gpuLoad + (Math.random() * 10 - 5))),
        vramUsed: Math.max(8, Math.min(22, prev.vramUsed + (Math.random() * 0.5 - 0.25)))
      }));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const stats = [
    { 
        label: 'الحالة التشغيلية للنواة', 
        value: `${services.filter(s => s.status === 'running').length}/${services.length} ACTIVE`, 
        icon: <Activity className="text-green-400" />, 
        color: 'from-green-500/10 to-transparent', 
        borderColor: 'border-green-500/20',
        badge: 'STABLE'
    },
    { 
        label: 'حمولة العنقود (GPU/NPU)', 
        value: `${telemetry.gpuLoad.toFixed(1)}%`, 
        icon: <Zap className="text-brand-accent" />, 
        color: 'from-brand-accent/10 to-transparent', 
        borderColor: 'border-brand-accent/20',
        badge: 'HYBRID_LOAD'
    },
    { 
        label: 'ذاكرة الفيديو (VRAM)', 
        value: `${telemetry.vramUsed.toFixed(1)} GB`, 
        icon: <Database className="text-purple-400" />, 
        color: 'from-purple-500/10 to-transparent', 
        borderColor: 'border-purple-500/20',
        badge: 'INT8_QUANT'
    },
    { 
        label: 'نزاهة التشفير السيادي', 
        value: telemetry.networkSec, 
        icon: <ShieldCheck className="text-brand-primary" />, 
        color: 'from-brand-primary/10 to-transparent', 
        borderColor: 'border-brand-primary/20',
        badge: 'AES_XTS_512'
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-in slide-in-from-top-4 duration-500">
      {stats.map((stat, i) => (
        <div key={i} className={`bg-panel backdrop-blur-md p-6 rounded-[2.5rem] border ${stat.borderColor} shadow-elevation flex flex-col justify-between hover:shadow-glow-blue transition-all group relative overflow-hidden h-44`}>
          <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-40 group-hover:opacity-70 transition-opacity`}></div>
          
          <div className="flex justify-between items-start relative z-10">
            <div className="bg-canvas/50 p-3 rounded-2xl border border-border-subtle group-hover:scale-110 transition-transform shadow-inner text-text-primary">
              {stat.icon}
            </div>
            <span className="text-[8px] font-black text-text-primary bg-slate-900/10 dark:bg-slate-900/80 px-2.5 py-1 rounded border border-black/5 dark:border-white/10 uppercase tracking-widest font-mono">
              {stat.badge}
            </span>
          </div>

          <div className="relative z-10">
            <h4 className="text-[9px] font-black text-text-subtle uppercase tracking-[0.2em] mb-1 font-tajawal">{stat.label}</h4>
            <div className="text-2xl font-black text-text-primary font-mono tracking-tighter flex items-center gap-2">
                {stat.value}
                <div className={`w-2 h-2 rounded-full ${i === 0 ? 'bg-green-500 animate-pulse' : 'bg-brand-primary/40'}`}></div>
            </div>
          </div>
          
          <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-brand-primary/20 to-transparent group-hover:via-brand-accent/40 transition-all"></div>
        </div>
      ))}
    </div>
  );
};

export default SystemOverview;
