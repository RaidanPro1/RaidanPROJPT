
import React, { useState, useEffect } from 'react';
import { CheckCircle, Zap } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

// Mock fetching telemetry data
const useTelemetry = () => {
    const [status, setStatus] = useState<'online' | 'offline'>('online');
    const [latency, setLatency] = useState(12);

    useEffect(() => {
        const interval = setInterval(() => {
            // Simulate latency fluctuations
            setLatency(Math.floor(Math.random() * (25 - 8) + 8));
            // Simulate occasional connection drops
            setStatus(Math.random() > 0.95 ? 'offline' : 'online');
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    return { status, latency };
};

const Footer: React.FC = () => {
  const { t } = useLanguage();
  const telemetry = useTelemetry();
  const activeModel = "Qwen-2.5-32b"; // This would come from config/state

  return (
    <footer className="h-12 bg-panel border-t border-border-subtle flex items-center justify-between px-6 z-40 text-xs">
        {/* Left Side: Copyright & Links */}
        <div className="flex items-center gap-4 text-text-subtle font-bold">
            <span>{t('footer_copyright')}</span>
            <div className="w-px h-4 bg-border-subtle"></div>
            <a href="#" className="hover:text-text-primary transition-colors">{t('footer_privacy')}</a>
            <a href="#" className="hover:text-text-primary transition-colors">{t('footer_terms')}</a>
        </div>
        
        {/* Right Side: System Telemetry */}
        <div className="flex items-center gap-6 font-mono text-[10px] font-black uppercase">
            <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${telemetry.status === 'online' ? 'bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.5)]' : 'bg-red-500'}`}></div>
                <span className={telemetry.status === 'online' ? 'text-green-500' : 'text-red-500'}>
                   {telemetry.status}
                </span>
            </div>

            <div className="flex items-center gap-2 text-text-subtle">
                <span>Latency:</span>
                <span className="text-brand-primary">{telemetry.latency}ms</span>
            </div>
            
            <div className="flex items-center gap-2 text-text-subtle">
                <span>AI Model:</span>
                <span className="text-brand-accent">{activeModel}</span>
            </div>
        </div>
    </footer>
  );
};

export default Footer;
