
import React, { useState, useEffect } from 'react';
import { 
  Radar, Activity, ShieldAlert, Zap, Globe, Ship, 
  TrendingUp, BarChart3, AlertTriangle, Clock, 
  Cpu, Search, Filter, RefreshCcw, Bell, ExternalLink,
  Navigation, MessageSquare, Anchor, Waves, 
  Target, Radio, HardDrive, Terminal,
  ShieldCheck, Info, Wheat, CloudRain, Wifi
} from 'lucide-react';

// New Telemetry Widget Component
const TelemetryWidget: React.FC<{title: string, value: string, sub: string, status: 'normal' | 'warning' | 'critical', icon: React.ReactNode}> = ({title, value, sub, status, icon}) => (
    <div className={`p-4 rounded-2xl border flex items-start justify-between group hover:scale-[1.02] transition-all ${status === 'normal' ? 'bg-white border-slate-200' : status === 'warning' ? 'bg-amber-50 border-amber-200' : 'bg-red-50 border-red-200'}`}>
        <div className="flex flex-col gap-1">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{title}</span>
            <span className={`text-2xl font-black font-mono ${status === 'critical' ? 'text-red-600' : 'text-slate-900'}`}>{value}</span>
            <span className="text-[9px] font-bold text-slate-400">{sub}</span>
        </div>
        <div className={`p-2 rounded-xl ${status === 'normal' ? 'bg-slate-100 text-slate-500' : status === 'warning' ? 'bg-amber-100 text-amber-600' : 'bg-red-100 text-red-600'}`}>
            {icon}
        </div>
    </div>
);

const PredictiveCenter: React.FC = () => {
  const [isScanning, setIsScanning] = useState(false);
  
  // Live Data Mockup (Should come from Yemen Core API)
  const telemetry = {
      wheat: { price: "480 USD/Ton", trend: "+2.4%", status: 'warning' as const },
      internet: { speed: "4.2 Mbps", region: "National Avg", status: 'critical' as const },
      climate: { alert: "Heavy Rain", region: "Ibb/Taiz", status: 'warning' as const },
      opinion: { sentiment: "Negative", topic: "Electricity", status: 'normal' as const }
  };

  useEffect(() => {
    // Simulation loop
    const interval = setInterval(() => {
       setIsScanning(prev => !prev);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in duration-700 pb-20">
      
      {/* Sovereign Telemetry Dashboard (New Section) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <TelemetryWidget 
            title="مؤشر الأمن الغذائي (القمح)" 
            value={telemetry.wheat.price} 
            sub={`Global Trend: ${telemetry.wheat.trend}`} 
            status={telemetry.wheat.status} 
            icon={<Wheat size={20}/>} 
          />
          <TelemetryWidget 
            title="الإنذار المبكر (المناخ)" 
            value={telemetry.climate.alert} 
            sub={`Zone: ${telemetry.climate.region}`} 
            status={telemetry.climate.status} 
            icon={<CloudRain size={20}/>} 
          />
          <TelemetryWidget 
            title="البنية التحتية (الإنترنت)" 
            value={telemetry.internet.speed} 
            sub="M-Lab Ping: 140ms" 
            status={telemetry.internet.status} 
            icon={<Wifi size={20}/>} 
          />
          <TelemetryWidget 
            title="مؤشر الرأي العام (GDELT)" 
            value="High Tension" 
            sub="Focus: Public Services" 
            status="warning" 
            icon={<Activity size={20}/>} 
          />
      </div>

      {/* Main Radar View */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <div className="xl:col-span-8 glass-panel p-6 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6 border-r-4 border-yemenGold shadow-tactical relative overflow-hidden">
          {/* Radar Background Decor */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-yemenGold/5 rounded-full -mr-32 -mt-32 blur-3xl animate-pulse"></div>
          
          <div className="flex items-center gap-8 relative z-10">
            <div className="relative w-24 h-24">
               <div className="absolute inset-0 border-2 border-yemenGold/20 rounded-full"></div>
               <div className="absolute inset-2 border border-yemenGold/10 rounded-full"></div>
               <div className={`absolute inset-0 bg-gradient-to-tr from-yemenGold/20 via-transparent to-transparent rounded-full origin-center ${isScanning ? 'animate-[spin_4s_linear_infinite]' : 'opacity-20'}`}></div>
               <div className="absolute inset-0 flex items-center justify-center text-yemenGold drop-shadow-glow-gold">
                 <Radar size={32} />
               </div>
            </div>
            <div>
              <h2 className="text-3xl font-black text-white font-tajawal leading-none mb-2 uppercase">مركز الاستبصار الوطني</h2>
              <div className="flex items-center gap-3">
                <span className="text-[10px] text-yemenGold font-bold uppercase tracking-[0.3em]">Sovereign Watchtower</span>
                <div className="h-3 w-px bg-slate-800"></div>
                <div className="flex items-center gap-1.5">
                  <span className={`w-1.5 h-1.5 rounded-full ${isScanning ? 'bg-green-500 animate-pulse' : 'bg-slate-600'}`}></span>
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{isScanning ? 'Live Data Feed' : 'Syncing...'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="xl:col-span-4 glass-panel p-6 rounded-2xl flex flex-col justify-between border-l-4 border-yemenBlue shadow-glow-blue">
           <div className="flex justify-between items-center">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Yemen Core Status</span>
              <Activity size={18} className="text-green-500" />
           </div>
           <div className="space-y-2 mt-4">
               <div className="flex justify-between text-[10px] text-slate-400 font-bold">
                   <span>World Bank API</span>
                   <span className="text-green-500">Connected</span>
               </div>
               <div className="flex justify-between text-[10px] text-slate-400 font-bold">
                   <span>NASA FIRMS</span>
                   <span className="text-green-500">Connected</span>
               </div>
               <div className="flex justify-between text-[10px] text-slate-400 font-bold">
                   <span>GDELT Stream</span>
                   <span className="text-green-500">Syncing (15m)</span>
               </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default PredictiveCenter;
