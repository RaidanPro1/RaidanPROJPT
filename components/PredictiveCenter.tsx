
import React, { useState, useEffect } from 'react';
/* Added missing ShieldCheck and Info icons to lucide-react imports */
import { 
  Radar, Activity, ShieldAlert, Zap, Globe, Ship, 
  TrendingUp, BarChart3, AlertTriangle, Clock, 
  Cpu, Search, Filter, RefreshCcw, Bell, ExternalLink,
  Navigation, MessageSquare, Anchor, Waves, 
  Target, Radio, HardDrive, Terminal,
  ShieldCheck, Info
} from 'lucide-react';

interface AlertEvent {
  id: string;
  source: 'GDELT' | 'AIS' | 'OSINT';
  timestamp: string;
  location: string;
  sentiment: number;
  angerLevel: number;
  summary: string;
  keywords: string[];
  reliability: number;
}

const PredictiveCenter: React.FC = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [threatLevel, setThreatLevel] = useState<'low' | 'moderate' | 'high'>('high');
  const [cpuUsage, setCpuUsage] = useState(8);
  const [activeWorkflow, setActiveWorkflow] = useState<string | null>(null);
  const [alerts, setAlerts] = useState<AlertEvent[]>([
    {
      id: '1',
      source: 'GDELT',
      timestamp: '15:45:12',
      location: 'ميناء الحديدة',
      sentiment: -0.88,
      angerLevel: 0.94,
      summary: 'رصد تزايد حدة الخطاب الاحتجاجي بخصوص نقص إمدادات الديزل في مراكز التوزيع الرئيسية.',
      keywords: ['احتجاج', 'ميناء', 'وقود'],
      reliability: 92
    },
    {
      id: '2',
      source: 'AIS',
      timestamp: '15:42:00',
      location: 'مضيق باب المندب',
      sentiment: -0.1,
      angerLevel: 0.2,
      summary: 'ناقلة نفط ترفع علم دولة أجنبية تغير مسارها بشكل مفاجئ دون بلاغ رسمي.',
      keywords: ['ناقلة', 'AIS', 'انحراف'],
      reliability: 100
    },
    {
      id: '3',
      source: 'OSINT',
      timestamp: '15:30:45',
      location: 'عدن - المنطقة الحرة',
      sentiment: -0.45,
      angerLevel: 0.6,
      summary: 'تداول صور فضائية تظهر نشاطاً غير معتاد في أرصفة الحاويات خارج ساعات العمل.',
      keywords: ['صور_فضائية', 'نشاط_ليلي'],
      reliability: 75
    }
  ]);

  // محاكاة دورة الرصد التكتيكي (Section 3: Cron Job Logic)
  useEffect(() => {
    const runScan = () => {
      setIsScanning(true);
      setActiveWorkflow('n8n: Triggering GDELT API...');
      setCpuUsage(45); // AraBERT Analysis Start
      
      setTimeout(() => {
        setActiveWorkflow('AraBERT: Analyzing Sentiment Patterns...');
        setCpuUsage(78);
      }, 2000);

      setTimeout(() => {
        setIsScanning(false);
        setActiveWorkflow(null);
        setCpuUsage(8);
      }, 6000);
    };

    const interval = setInterval(runScan, 20000); // Demo interval
    runScan();
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in duration-700 pb-20">
      {/* Tactical Radar Sweep Display */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <div className="xl:col-span-8 glass-panel p-6 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6 border-r-4 border-yemenGold shadow-tactical relative overflow-hidden">
          {/* Radar Background Decor */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-yemenGold/5 rounded-full -mr-32 -mt-32 blur-3xl animate-pulse"></div>
          
          <div className="flex items-center gap-8 relative z-10">
            <div className="relative w-24 h-24">
               {/* Radar Visual */}
               <div className="absolute inset-0 border-2 border-yemenGold/20 rounded-full"></div>
               <div className="absolute inset-2 border border-yemenGold/10 rounded-full"></div>
               <div className="absolute inset-6 border border-yemenGold/5 rounded-full"></div>
               {/* Scanning Sweep */}
               <div className={`absolute inset-0 bg-gradient-to-tr from-yemenGold/20 via-transparent to-transparent rounded-full origin-center ${isScanning ? 'animate-[spin_4s_linear_infinite]' : 'opacity-20'}`}></div>
               {/* Center Icon */}
               <div className="absolute inset-0 flex items-center justify-center text-yemenGold drop-shadow-glow-gold">
                 <Radar size={32} />
               </div>
               {/* Signal Blobs */}
               <div className="absolute top-4 left-4 w-1.5 h-1.5 bg-red-500 rounded-full animate-ping"></div>
               <div className="absolute bottom-6 right-8 w-1 h-1 bg-yemenGold rounded-full animate-pulse"></div>
            </div>
            <div>
              <h2 className="text-3xl font-black text-white font-tajawal leading-none mb-2 uppercase">مركز الاستبصار والرصد</h2>
              <div className="flex items-center gap-3">
                <span className="text-[10px] text-yemenGold font-bold uppercase tracking-[0.3em]">Predictive Intel Unit (S3)</span>
                <div className="h-3 w-px bg-slate-800"></div>
                <div className="flex items-center gap-1.5">
                  <span className={`w-1.5 h-1.5 rounded-full ${isScanning ? 'bg-green-500 animate-pulse' : 'bg-slate-600'}`}></span>
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{isScanning ? 'Active Scanning' : 'Standby'}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 min-w-[200px] relative z-10">
            <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800 flex flex-col gap-2">
               <div className="flex justify-between items-center text-[8px] font-black text-slate-500 uppercase tracking-widest">
                  <span>AraBERT CPU Load</span>
                  <span className="text-yemenGold">{cpuUsage}%</span>
               </div>
               <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-yemenGold h-full transition-all duration-700 shadow-glow-gold" style={{ width: `${cpuUsage}%` }}></div>
               </div>
               {activeWorkflow && (
                 <div className="flex items-center gap-2 mt-1 animate-pulse">
                    <Terminal size={10} className="text-blue-400" />
                    <span className="text-[8px] font-mono text-blue-400 truncate">{activeWorkflow}</span>
                 </div>
               )}
            </div>
          </div>
        </div>

        <div className="xl:col-span-4 glass-panel p-6 rounded-2xl flex flex-col justify-between border-l-4 border-yemenBlue shadow-glow-blue">
           <div className="flex justify-between items-center">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Global Risk Sentiment</span>
              <AlertTriangle size={18} className="text-red-500 animate-bounce" />
           </div>
           <div className="flex flex-col items-center py-2">
              <span className="text-4xl font-black text-white font-mono leading-none">HIGH</span>
              <span className="text-[9px] text-red-500 font-bold uppercase tracking-[0.2em] mt-2">Critical Anomaly Detected</span>
           </div>
           <button className="w-full py-3 bg-yemenBlue hover:bg-yemenBlue-light text-white rounded-xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-glow-blue active:scale-95 group">
             <Radio size={16} className="group-hover:animate-pulse" />
             بث التحذير للوحدات الميدانية
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Main Event Stream */}
        <div className="xl:col-span-8 space-y-4">
          <div className="glass-panel rounded-2xl border-slate-800 overflow-hidden shadow-tactical">
            <div className="p-5 border-b border-slate-800 bg-slate-900/50 flex justify-between items-center">
               <div className="flex items-center gap-3">
                  <Target size={18} className="text-yemenGold" />
                  <h3 className="text-xs font-black text-white uppercase tracking-widest font-tajawal">شريط الرصد الاستباقي (GDELT + AIS)</h3>
               </div>
               <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 text-[10px] text-slate-500">
                    <Clock size={12} />
                    <span>Sync: 15:45 (Every 15m)</span>
                  </div>
                  <button className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-500 transition-colors">
                     <Filter size={14} />
                  </button>
               </div>
            </div>

            <div className="divide-y divide-slate-800/50">
               {alerts.map((alert) => (
                 <div key={alert.id} className="p-6 hover:bg-slate-900/30 transition-all group">
                    <div className="flex flex-col md:flex-row gap-6">
                       <div className="flex flex-col items-center justify-center gap-3 border-l border-slate-800 pl-6 min-w-[110px]">
                          <div className={`p-4 rounded-2xl ${alert.source === 'GDELT' ? 'bg-blue-500/10 text-blue-400' : 'bg-orange-500/10 text-orange-400 shadow-glow-gold'}`}>
                             {alert.source === 'GDELT' ? <Globe size={28} /> : <Anchor size={28} />}
                          </div>
                          <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{alert.source}</span>
                       </div>

                       <div className="flex-1 space-y-3">
                          <div className="flex justify-between items-start">
                             <div>
                                <h4 className="text-sm font-black text-white font-tajawal group-hover:text-yemenGold transition-colors">{alert.location}</h4>
                                <div className="flex items-center gap-3 mt-1.5">
                                   <span className="text-[10px] font-mono text-slate-600">[{alert.timestamp}]</span>
                                   <div className="flex items-center gap-1">
                                      <ShieldCheck size={10} className="text-green-500" />
                                      <span className="text-[9px] font-bold text-slate-500 uppercase">Reliability: {alert.reliability}%</span>
                                   </div>
                                </div>
                             </div>
                             <div className="flex gap-2">
                                {alert.angerLevel > 0.8 && (
                                  <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 px-3 py-1 rounded-full text-red-500 animate-pulse">
                                     <AlertTriangle size={12} />
                                     <span className="text-[8px] font-black uppercase">AraBERT Alert: Severe Anger</span>
                                  </div>
                                )}
                             </div>
                          </div>
                          <p className="text-xs text-slate-300 leading-relaxed font-tajawal">{alert.summary}</p>
                          <div className="flex flex-wrap gap-2">
                             {alert.keywords.map(kw => (
                               <span key={kw} className="px-3 py-1 bg-slate-950 text-[9px] font-bold text-slate-500 rounded-lg border border-slate-800 flex items-center gap-1">
                                  <Search size={10} className="text-yemenGold" />
                                  #{kw}
                               </span>
                             ))}
                          </div>
                       </div>

                       <div className="flex flex-col justify-center items-end border-r border-slate-800 pr-6 min-w-[150px] gap-4">
                          <div className="w-full space-y-2">
                             <div className="flex justify-between text-[8px] font-black text-slate-500 uppercase">
                                <span>Sentiment Index</span>
                                <span className={alert.sentiment < 0 ? 'text-red-400' : 'text-green-400'}>
                                   {(alert.sentiment * 100).toFixed(0)}%
                                </span>
                             </div>
                             <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden border border-slate-800">
                                <div 
                                  className={`h-full ${alert.sentiment < 0 ? 'bg-red-500' : 'bg-green-500'} transition-all duration-1000`}
                                  style={{ width: `${Math.abs(alert.sentiment) * 100}%` }}
                                ></div>
                             </div>
                          </div>
                          <button className="p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-500 hover:text-white transition-all shadow-inner">
                             <ExternalLink size={16} />
                          </button>
                       </div>
                    </div>
                 </div>
               ))}
            </div>
            
            <div className="p-4 bg-slate-950/80 text-center border-t border-slate-800">
               <button className="text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-yemenGold transition-colors">عرض السجل التاريخي للأزمات</button>
            </div>
          </div>
        </div>

        {/* AraBERT Analytical Gauges & AIS Map Placeholder */}
        <div className="xl:col-span-4 space-y-6">
          <div className="glass-panel p-6 rounded-2xl border-slate-800 shadow-tactical flex flex-col h-full">
            <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-widest mb-8 flex items-center gap-3">
              <BarChart3 size={16} className="text-yemenGold shadow-glow-gold" />
              AraBERT Deep Intelligence
            </h3>

            <div className="space-y-10 flex-1 flex flex-col justify-center">
               <div className="relative w-48 h-48 mx-auto">
                  <svg className="w-full h-full transform -rotate-90 drop-shadow-glow-gold">
                    <circle cx="96" cy="96" r="84" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-slate-800/40" />
                    <circle
                      cx="96"
                      cy="96"
                      r="84"
                      stroke="url(#bert_grad)"
                      strokeWidth="12"
                      fill="transparent"
                      strokeDasharray={528}
                      strokeDashoffset={528 - (528 * 0.94)}
                      strokeLinecap="round"
                      className="transition-all duration-1000 ease-out"
                    />
                    <defs>
                      <linearGradient id="bert_grad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#ef4444" />
                        <stop offset="100%" stopColor="#D4AF37" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-5xl font-black text-white font-mono tracking-tighter">0.94</span>
                    <span className="text-[10px] font-black text-red-500 uppercase tracking-widest mt-1">Anger Level</span>
                  </div>
               </div>
               
               <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                    <span className="text-[8px] font-black text-slate-500 uppercase block mb-2">Fear Index</span>
                    <div className="flex items-center gap-3">
                       <div className="flex-1 bg-slate-900 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-blue-500 h-full w-[65%]"></div>
                       </div>
                       <span className="text-[10px] font-bold text-white">65%</span>
                    </div>
                  </div>
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                    <span className="text-[8px] font-black text-slate-500 uppercase block mb-2">Stability</span>
                    <div className="flex items-center gap-3">
                       <div className="flex-1 bg-slate-900 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-green-500 h-full w-[22%]"></div>
                       </div>
                       <span className="text-[10px] font-bold text-white">22%</span>
                    </div>
                  </div>
               </div>

               <div className="p-4 bg-yemenGold/5 rounded-xl border border-yemenGold/10 flex items-start gap-3">
                  <Info size={16} className="text-yemenGold mt-0.5 flex-shrink-0" />
                  <p className="text-[10px] text-slate-400 font-bold leading-relaxed font-tajawal">
                    تحليل AraBERT يشير إلى وجود "تركيز مكثف" لمصطلحات حادة تسبق عادة حدوث اضطرابات لوجستية في الموانئ بنسبة دقة 89%.
                  </p>
               </div>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-800 space-y-3">
               <div className="flex items-center justify-between text-[10px] font-black text-slate-500 uppercase mb-2">
                 <span>AIS Maritime Radar</span>
                 <span className="text-green-500">2 Ships Tracked</span>
               </div>
               <div className="space-y-2">
                  {[
                    { name: 'TANKER-YEM-01', risk: 'High', status: 'Deviating' },
                    { name: 'CARGO-X-99', risk: 'Low', status: 'Anchored' }
                  ].map(ship => (
                    <div key={ship.name} className="flex justify-between items-center bg-slate-950 p-3 rounded-lg border border-slate-800 group hover:border-yemenBlue/50 transition-all cursor-default">
                       <div className="flex items-center gap-2">
                          <Navigation size={12} className={`rotate-45 ${ship.risk === 'High' ? 'text-red-500 animate-pulse' : 'text-slate-500'}`} />
                          <span className="text-[10px] font-black text-white">{ship.name}</span>
                       </div>
                       <span className={`text-[8px] font-black px-2 py-0.5 rounded ${ship.risk === 'High' ? 'bg-red-500/20 text-red-500' : 'bg-slate-800 text-slate-500'}`}>
                         {ship.status}
                       </span>
                    </div>
                  ))}
               </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* n8n Orchestrator Logic Simulation Footer */}
      <div className="glass-panel p-4 rounded-xl border border-blue-500/20 bg-yemenBlue/5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Zap size={18} className="text-yemenGold animate-bounce" />
          <div className="space-y-0.5">
            <h4 className="text-[10px] font-black text-white uppercase tracking-widest">n8n Sovereign Orchestrator</h4>
            <p className="text-[9px] text-slate-500 font-bold">CRON Job: Active [Next Run: T-12:42] | Sources: GDELT, AIS, OpenSanctions</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
           <div className="text-[9px] font-mono text-blue-400 bg-black/40 px-3 py-1.5 rounded-lg border border-blue-500/20 uppercase">
             Status: Data_Stream_Healthy
           </div>
           <button className="p-2 text-slate-500 hover:text-white transition-colors">
              <RefreshCcw size={16} />
           </button>
        </div>
      </div>
    </div>
  );
};

export default PredictiveCenter;
