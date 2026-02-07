
import React, { useState, useEffect } from 'react';
import { 
  Activity, ShieldCheck, Wifi, Brain, 
  Cpu, Database, HardDrive, Lock, 
  ChevronUp, Globe, Zap, AlertTriangle
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useSettings } from '../context/SettingsContext';

// Custom Hook for Live Tactical Telemetry Simulation
const useTacticalTelemetry = () => {
    const [stats, setStats] = useState({
        ping: 24,
        cpu: 12.4,
        ram: 4.2,
        load: 0.45
    });
    
    useEffect(() => {
        const interval = setInterval(() => {
            setStats(prev => {
                const noise = (Math.random() - 0.5) * 2;
                return {
                    ping: Math.max(12, Math.min(45, Math.round(prev.ping + noise))),
                    cpu: Math.max(5, Math.min(65, Number((prev.cpu + noise).toFixed(1)))),
                    ram: Math.max(2, Math.min(16, Number((prev.ram + (noise * 0.1)).toFixed(1)))),
                    load: Math.max(0.1, Math.min(1.2, Number((prev.load + (noise * 0.05)).toFixed(2))))
                };
            });
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    return stats;
};

const Footer: React.FC = () => {
  const { t, language } = useLanguage();
  const { userRole } = useSettings();
  const stats = useTacticalTelemetry();
  const activeModel = "سيف (Saif-Native-INT8)"; 

  return (
    <footer className="bg-panel/90 backdrop-blur-glass border-t border-border-glass text-[10px] z-50 relative shrink-0 font-mono">
        {/* Progress bar / System Load visualization */}
        <div className="absolute top-0 left-0 w-full h-[1px] bg-border-subtle overflow-hidden">
            <div 
              className="h-full bg-brand-primary transition-all duration-1000 shadow-glow-blue" 
              style={{ width: `${(stats.cpu / 100) * 100}%` }}
            ></div>
        </div>

        <div className="max-w-[1800px] mx-auto px-6 h-12 flex items-center justify-between">
            
            {/* Left Zone: Brand & Legal */}
            <div className="flex items-center gap-6">
                <div className="flex items-center gap-2 group cursor-default">
                    <div className="w-5 h-5 bg-brand-primary rounded flex items-center justify-center text-white text-[10px] font-black group-hover:bg-brand-accent transition-colors">R</div>
                    <div className="flex flex-col">
                        <span className="text-text-primary font-black uppercase tracking-tighter leading-none">RaidanPro OS</span>
                        <span className="text-[8px] text-text-subtle font-bold uppercase tracking-widest mt-0.5">Sovereign Edition v4.5</span>
                    </div>
                </div>

                <div className="hidden xl:flex items-center gap-4 text-text-subtle border-r border-border-subtle pr-4 mr-2">
                    <span className="hover:text-brand-primary cursor-pointer transition-colors">{t('footer_privacy')}</span>
                    <div className="w-1 h-1 bg-border-subtle rounded-full"></div>
                    <span className="hover:text-brand-primary cursor-pointer transition-colors">{t('footer_terms')}</span>
                </div>
            </div>
            
            {/* Center Zone: Real-time Status Heartbeat */}
            <div className="hidden md:flex items-center gap-6 bg-canvas/40 px-6 py-1.5 rounded-full border border-border-glass shadow-inner">
                <div className="flex items-center gap-2.5">
                    <div className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-600"></span>
                    </div>
                    <span className="text-[9px] font-black text-green-500 uppercase tracking-[0.2em]">Kernel_Link: Stable</span>
                </div>

                <div className="w-px h-3 bg-border-subtle"></div>

                <div className="flex items-center gap-4">
                    <TelemetryItem icon={<Cpu size={12}/>} label="CPU" value={`${stats.cpu}%`} />
                    <TelemetryItem icon={<Database size={12}/>} label="MEM" value={`${stats.ram}GB`} />
                    <TelemetryItem icon={<Wifi size={12}/>} label="LAT" value={`${stats.ping}ms`} color={stats.ping > 40 ? 'text-brand-accent' : 'text-text-primary'} />
                </div>
            </div>

            {/* Right Zone: Security & Authority Badge */}
            <div className="flex items-center gap-6">
                {/* Active AI Model Badge */}
                <div className="flex items-center gap-2 group cursor-help" title="Active Local LLM Node">
                    <Brain size={12} className="text-brand-primary" />
                    <span className="text-text-subtle font-bold uppercase tracking-tighter hidden lg:inline">Core:</span>
                    <span className="bg-brand-primary/10 text-brand-primary border border-brand-primary/20 px-2 py-0.5 rounded font-black text-[9px] uppercase">{activeModel}</span>
                </div>

                <div className="w-px h-4 bg-border-subtle hidden sm:block"></div>

                {/* Authority Badge */}
                <div className={`flex items-center gap-2 px-3 py-1 rounded border transition-all ${
                  userRole === 'root' 
                  ? 'bg-red-500/10 border-red-500/20 text-red-500 shadow-[0_0_10px_rgba(239,68,68,0.1)]' 
                  : 'bg-green-500/10 border-green-500/20 text-green-500'
                }`}>
                    <ShieldCheck size={12} />
                    <span className="font-black uppercase tracking-widest text-[8px]">
                        {userRole === 'root' ? 'ROOT_ENFORCED' : 'SECURED_USER'}
                    </span>
                </div>

                {/* Session Timer / Region */}
                <div className="hidden lg:flex items-center gap-2 text-text-subtle font-bold">
                    <Globe size={12} />
                    <span className="uppercase">Region: YE/SNA</span>
                </div>
            </div>
        </div>
    </footer>
  );
};

interface TelemetryItemProps {
    icon: React.ReactNode;
    label: string;
    value: string;
    color?: string;
}

const TelemetryItem: React.FC<TelemetryItemProps> = ({ icon, label, value, color = 'text-text-primary' }) => (
    <div className="flex items-center gap-1.5 transition-all">
        <span className="text-text-subtle opacity-70">{icon}</span>
        <span className="text-text-subtle font-bold uppercase mr-0.5">{label}:</span>
        <span className={`${color} font-black`}>{value}</span>
    </div>
);

export default Footer;
