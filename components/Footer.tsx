
import React, { useState, useEffect } from 'react';
import { Activity, Server, Zap, ShieldCheck, Globe, Wifi } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

// Custom Hook for Live Telemetry Simulation
const useTacticalTelemetry = () => {
    const [ping, setPing] = useState(24);
    const [fps, setFps] = useState(60);
    
    useEffect(() => {
        const interval = setInterval(() => {
            // Simulate realistic network fluctuation
            setPing(prev => {
                const noise = Math.floor(Math.random() * 5) - 2;
                return Math.max(12, Math.min(45, prev + noise));
            });
            setFps(Math.floor(Math.random() * (60 - 58) + 58));
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    return { ping, fps };
};

const Footer: React.FC = () => {
  const { t } = useLanguage();
  const { ping } = useTacticalTelemetry();
  const activeModel = "Qwen-2.5-Sovereign"; 

  return (
    <footer className="bg-slate-950 border-t border-brand-accent/30 text-xs z-40 relative shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.5)]">
        <div className="max-w-[1800px] mx-auto px-6 h-14 flex items-center justify-between">
            
            {/* Left Zone: Legal & Copyright */}
            <div className="flex items-center gap-6">
                <div className="flex items-center gap-2 text-text-subtle font-bold opacity-80">
                    <span className="text-brand-accent">© 2026 RaidanPro.</span>
                    <span className="hidden sm:inline">Sovereignty Protected.</span>
                </div>
                <div className="hidden md:flex items-center gap-4 text-[10px] font-bold text-text-subtle/60 uppercase tracking-widest">
                    <a href="#" className="hover:text-text-primary transition-colors hover:underline decoration-brand-accent/50 underline-offset-4">Privacy Protocol</a>
                    <a href="#" className="hover:text-text-primary transition-colors hover:underline decoration-brand-accent/50 underline-offset-4">Legal Doctrine</a>
                </div>
            </div>
            
            {/* Center Zone: Status Indicator (Mobile Hidden) */}
            <div className="hidden lg:flex items-center gap-2 bg-slate-900/50 px-4 py-1.5 rounded-full border border-slate-800">
                <div className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </div>
                <span className="text-[10px] font-black text-green-500 uppercase tracking-[0.2em] font-mono">All Systems Operational</span>
            </div>

            {/* Right Zone: Live Telemetry */}
            <div className="flex items-center gap-6 font-mono text-[10px] font-bold">
                {/* Network Latency */}
                <div className="flex items-center gap-2 text-text-subtle group cursor-help" title="Live Network Latency">
                    <Wifi size={12} className={ping > 100 ? 'text-red-500' : 'text-brand-primary'} />
                    <span>LATENCY:</span>
                    <span className={`${ping < 30 ? 'text-green-400' : 'text-brand-accent'}`}>{ping}ms</span>
                </div>
                
                <div className="w-px h-3 bg-slate-800"></div>

                {/* AI Model Status */}
                <div className="flex items-center gap-2 text-text-subtle">
                    <BrainIcon size={12} className="text-purple-500" />
                    <span className="hidden sm:inline">ACTIVE_CORE:</span>
                    <span className="text-white bg-white/5 px-2 py-0.5 rounded border border-white/10">{activeModel}</span>
                </div>

                <div className="w-px h-3 bg-slate-800 hidden sm:block"></div>

                {/* Secure Connection Badge */}
                <div className="hidden sm:flex items-center gap-1.5 text-brand-accent bg-brand-accent/5 px-2 py-1 rounded border border-brand-accent/10">
                    <ShieldCheck size={10} />
                    <span className="uppercase tracking-tighter">Encrypted</span>
                </div>
            </div>
        </div>
    </footer>
  );
};

// Simple icon wrapper
const BrainIcon: React.FC<{size?: number, className?: string}> = ({size, className}) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z"/><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z"/></svg>
);

export default Footer;
