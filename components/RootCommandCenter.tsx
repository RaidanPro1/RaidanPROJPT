
import React, { useState, useEffect } from 'react';
import { 
  Shield, Rocket, Settings, Gauge, Zap, CheckCircle2, 
  Server, Lock, Globe, Database, Cpu, Search, 
  Activity, Share2, Mail, Terminal, Fingerprint, 
  RefreshCcw, AlertTriangle, Key, Users, Sliders,
  Thermometer, Monitor, HardDrive, BarChart3,
  LockKeyhole, UserCheck, Power, ShieldCheck,
  Headphones, Loader2, PowerOff, ShieldAlert,
  // Added missing icons to fix errors
  Clock, ExternalLink
} from 'lucide-react';

const RootCommandCenter: React.FC = () => {
  const [governorStatus, setGovernorStatus] = useState<'idle' | 'allocating'>('idle');
  const [gpuPriority, setGpuPriority] = useState<'llm' | 'audio' | 'forensics'>('llm');
  const [sysTemp, setSysTemp] = useState(54);
  const [isSsoActive, setIsSsoActive] = useState(true);
  const [provisioningStatus, setProvisioningStatus] = useState<Record<string, 'asleep' | 'waking' | 'active'>>({
    'Forensics': 'asleep',
    'Satellite': 'active',
    'Ollama': 'active',
    'Audio': 'asleep'
  });

  // محاكاة قاعدة الـ 5 ثوانٍ لبدء الخدمات (Cold Start)
  const wakeService = (service: string) => {
    setProvisioningStatus(prev => ({ ...prev, [service]: 'waking' }));
    setTimeout(() => {
      setProvisioningStatus(prev => ({ ...prev, [service]: 'active' }));
    }, 4500); // إيقاظ الخدمة في أقل من 5 ثوانٍ
  };

  // محاكاة منطق حوكمة الموارد (Governance Logic)
  const handleGpuSwitch = (target: 'llm' | 'audio' | 'forensics') => {
    setGovernorStatus('allocating');
    setTimeout(() => {
      setGpuPriority(target);
      setGovernorStatus('idle');
      // إذا كانت الخدمة نائمة، أيقظها
      const serviceMap: Record<string, string> = { llm: 'Ollama', audio: 'Audio', forensics: 'Forensics' };
      if (provisioningStatus[serviceMap[target]] === 'asleep') {
        wakeService(serviceMap[target]);
      }
    }, 1500);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-700 pb-20 font-tajawal">
      {/* Root Command Header - RaidanPro Tactical Design */}
      <div className="glass-panel p-6 rounded-2xl flex flex-col xl:flex-row items-center justify-between gap-6 border-r-4 border-yemenGold shadow-tactical relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-yemenBlue/10 rounded-full -mr-32 -mt-32 blur-3xl animate-pulse"></div>
        
        <div className="flex items-center gap-6 relative z-10">
          <div className="w-16 h-16 bg-slate-950 border border-slate-800 rounded-2xl flex items-center justify-center text-yemenGold shadow-glow-gold">
            <TowerControlIcon size={32} />
          </div>
          <div>
            <h2 className="text-3xl font-black text-white leading-none uppercase tracking-tight">برج المراقبة (Root Command)</h2>
            <div className="flex items-center gap-3 mt-2">
               <span className="text-[10px] text-yemenGold font-bold uppercase tracking-[0.3em]">Hakam Al-Idari: Coolify + Authentik + Governor</span>
               <div className="h-3 w-px bg-slate-800"></div>
               <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.5)]"></div>
                  <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest px-1">Sovereign Authority: Active</span>
               </div>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 items-center relative z-10">
          <div className="bg-slate-950/80 p-3 px-6 rounded-xl border border-slate-800 flex items-center gap-8 shadow-inner">
             <div className="flex flex-col border-l border-slate-800 pl-6">
                <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Authentik SSO Gateway</span>
                <div className="flex items-center gap-2">
                   <UserCheck size={14} className={isSsoActive ? 'text-green-500' : 'text-red-500'} />
                   <span className="text-[10px] font-black text-white uppercase">{isSsoActive ? 'Gate Secured' : 'Breach Detected'}</span>
                </div>
             </div>
             <div className="flex flex-col">
                <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Governance Logic</span>
                <div className="flex items-center gap-2">
                   <Activity size={14} className="text-yemenGold" />
                   <span className="text-sm font-black text-white font-mono uppercase">Optimized</span>
                </div>
             </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Sovereign Governance & Resource Governor (Python Script Simulator) */}
        <div className="xl:col-span-4 space-y-6">
          <div className="glass-panel p-6 rounded-2xl border-slate-800 shadow-tactical space-y-8">
             <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
                <Gauge size={18} className="text-yemenGold" />
                <h3 className="text-xs font-black text-white uppercase tracking-widest font-tajawal">منسق الموارد (Resource Governor)</h3>
             </div>

             <div className="space-y-6">
                <div className="flex flex-col items-center">
                   <div className="relative w-40 h-40 flex items-center justify-center">
                      <svg className="w-full h-full transform -rotate-90">
                        <circle cx="80" cy="80" r="72" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-800/50" />
                        <circle cx="80" cy="80" r="72" stroke="url(#temp_grad)" strokeWidth="8" fill="transparent" strokeDasharray={452} strokeDashoffset={452 - (452 * (sysTemp/100))} strokeLinecap="round" className="transition-all duration-1000" />
                        <defs>
                          <linearGradient id="temp_grad" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#22c55e" />
                            <stop offset="70%" stopColor="#D4AF37" />
                            <stop offset="100%" stopColor="#ef4444" />
                          </linearGradient>
                        </defs>
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                         <Thermometer size={24} className={sysTemp > 70 ? 'text-red-500 animate-bounce' : 'text-yemenGold'} />
                         <span className="text-3xl font-black text-white font-mono leading-none mt-1">{sysTemp}°C</span>
                         <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Sovereign Temp</span>
                      </div>
                   </div>
                </div>

                <div className="space-y-4">
                   <div className="flex items-center justify-between px-1">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">GPU Arbitration (Python SDK)</span>
                      {governorStatus === 'allocating' && <Loader2 size={12} className="text-yemenGold animate-spin" />}
                   </div>
                   <div className="grid grid-cols-1 gap-2">
                      {[
                        { id: 'llm', label: 'النماذج اللغوية (Ollama)', icon: <Share2 size={14} />, desc: 'تخصيص VRAM للتحليل والدردشة' },
                        { id: 'audio', label: 'محرك مٌنصت (Whisper)', icon: <Headphones size={14} />, desc: 'تخصيص VRAM للتفريغ الصوتي' },
                        { id: 'forensics', label: 'مختبر الجنايات (DeepSafe)', icon: <ShieldCheck size={14} />, desc: 'تخصيص VRAM لكشف التزييف' },
                      ].map(item => (
                        <button
                          key={item.id}
                          onClick={() => handleGpuSwitch(item.id as any)}
                          className={`p-4 rounded-xl border text-right transition-all flex items-center justify-between group ${
                            gpuPriority === item.id 
                            ? 'bg-yemenBlue border-yemenGold/40 text-white shadow-glow-blue' 
                            : 'bg-slate-950 border-slate-800 text-slate-500 hover:border-slate-700'
                          }`}
                        >
                           <div className="flex items-center gap-3">
                              <div className={`p-2 rounded-lg ${gpuPriority === item.id ? 'bg-yemenGold text-yemenBlue-dark' : 'bg-slate-900'}`}>
                                 {item.icon}
                              </div>
                              <div className="text-right">
                                 <div className="text-[11px] font-black uppercase leading-none mb-1">{item.label}</div>
                                 <div className="text-[8px] opacity-60 font-bold tracking-tighter">{item.desc}</div>
                              </div>
                           </div>
                           {gpuPriority === item.id && <Zap size={14} className="text-yemenGold fill-yemenGold animate-pulse" />}
                        </button>
                      ))}
                   </div>
                </div>
             </div>
          </div>

          <div className="glass-panel p-5 rounded-2xl border-slate-800 shadow-tactical">
             <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                   <Clock size={16} className="text-yemenGold" />
                   <span className="text-[10px] font-black text-white uppercase tracking-widest font-tajawal">حالة خدمات "عند الطلب"</span>
                </div>
                <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Rule: 5s Cold Start</span>
             </div>
             <div className="space-y-3">
                {Object.entries(provisioningStatus).map(([name, status]) => (
                  <div key={name} className="flex items-center justify-between p-3 bg-slate-950 rounded-xl border border-slate-800">
                     <span className="text-[10px] font-black text-white uppercase tracking-tighter">{name} Engine</span>
                     <div className="flex items-center gap-2">
                        <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded ${
                          status === 'active' ? 'bg-green-500/10 text-green-500' : 
                          status === 'waking' ? 'bg-yemenGold/10 text-yemenGold animate-pulse' : 'bg-slate-800 text-slate-600'
                        }`}>
                           {status}
                        </span>
                        {status === 'asleep' && (
                          <button onClick={() => wakeService(name)} className="p-1 hover:text-yemenGold transition-colors">
                            <Zap size={12} />
                          </button>
                        )}
                     </div>
                  </div>
                ))}
             </div>
          </div>
        </div>

        {/* Global Orchestration & SSO Control */}
        <div className="xl:col-span-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             {/* Coolify Fleet Manager */}
             <div className="glass-panel rounded-2xl border-slate-800 shadow-tactical flex flex-col h-[400px] overflow-hidden">
                <div className="p-4 border-b border-slate-800 bg-slate-900/50 flex justify-between items-center">
                   <div className="flex items-center gap-3">
                      <Rocket size={18} className="text-blue-400" />
                      <h3 className="text-[11px] font-black text-white uppercase tracking-widest">أتمتة النشر (Coolify Orchestrator)</h3>
                   </div>
                   <button className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-500 transition-colors">
                      <RefreshCcw size={14} />
                   </button>
                </div>
                <div className="flex-1 p-5 overflow-y-auto custom-scrollbar space-y-4">
                   {[
                     { name: 'Sovereign Mailu Node', status: 'completed', progress: 100, color: 'bg-green-500' },
                     { name: 'Ollama Native Core', status: 'completed', progress: 100, color: 'bg-green-500' },
                     { name: 'DeepSafe Cluster', status: 'deploying', progress: 68, color: 'bg-blue-500' },
                     { name: 'Neo4j Bolt Engine', status: 'waiting', progress: 0, color: 'bg-slate-700' }
                   ].map(task => (
                     <div key={task.name} className="p-4 bg-slate-950/50 border border-slate-800 rounded-xl space-y-3 group hover:border-blue-500/20 transition-all">
                        <div className="flex justify-between items-center">
                           <span className="text-[10px] font-black text-white uppercase tracking-tight">{task.name}</span>
                           <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded ${task.status === 'deploying' ? 'bg-blue-500/10 text-blue-400 animate-pulse' : task.status === 'completed' ? 'bg-green-500/10 text-green-500' : 'bg-slate-800 text-slate-500'}`}>
                             {task.status}
                           </span>
                        </div>
                        <div className="w-full bg-slate-900 h-1 rounded-full overflow-hidden">
                           <div className={`h-full ${task.color} transition-all duration-1000`} style={{ width: `${task.progress}%` }}></div>
                        </div>
                     </div>
                   ))}
                </div>
             </div>

             {/* Authentik SSO Access Control */}
             <div className="glass-panel rounded-2xl border-slate-800 shadow-tactical flex flex-col h-[400px] overflow-hidden border-l-4 border-yemenGold">
                <div className="p-4 border-b border-slate-800 bg-slate-900/50 flex justify-between items-center">
                   <div className="flex items-center gap-3">
                      <LockKeyhole size={18} className="text-yemenGold" />
                      <h3 className="text-[11px] font-black text-white uppercase tracking-widest">بوابة النفاذ Authentik SSO</h3>
                   </div>
                   <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-[8px] font-black text-green-500 uppercase">Vault Secure</span>
                   </div>
                </div>
                <div className="flex-1 p-5 flex flex-col">
                   <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-center justify-between mb-6">
                      <div className="flex items-center gap-4">
                         <div className="w-10 h-10 rounded-full bg-yemenBlue/20 flex items-center justify-center text-yemenGold shadow-inner font-black border border-yemenGold/20">Root</div>
                         <div>
                            <div className="text-xs font-black text-white">System.Ruler</div>
                            <div className="text-[8px] font-mono text-slate-500 uppercase tracking-tighter">Authorized via Hardware Token</div>
                         </div>
                      </div>
                      <ShieldCheck size={16} className="text-green-500" />
                   </div>

                   <div className="space-y-4 flex-1">
                      <h4 className="text-[9px] font-black text-slate-500 uppercase tracking-widest border-b border-slate-800 pb-2 flex justify-between">
                         Active Identities
                         <span className="text-yemenGold">3 Active Sessions</span>
                      </h4>
                      <div className="space-y-3 max-h-[140px] overflow-y-auto custom-scrollbar pr-2">
                        {[
                          { user: 'Investigator_1', app: 'OCCRP Aleph', last: '2m ago' },
                          { user: 'Forensic_Tech', app: 'DeepSafe', last: 'Active' },
                          { user: 'Editor_Main', app: 'Strapi CMS', last: '15m ago' }
                        ].map((id, i) => (
                          <div key={i} className="flex justify-between items-center text-[10px] py-2 border-b border-slate-800/30 group">
                             <div className="flex items-center gap-3">
                                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                                <span className="font-black text-slate-300">{id.user}</span>
                             </div>
                             <div className="flex items-center gap-3">
                                <span className="text-slate-600 uppercase text-[8px] font-bold">{id.app}</span>
                                <span className={`text-[8px] font-mono ${id.last === 'Active' ? 'text-green-500' : 'text-slate-700'}`}>{id.last}</span>
                             </div>
                          </div>
                        ))}
                      </div>
                   </div>

                   <div className="mt-4">
                      <button className="w-full py-3 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-white rounded-xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-3 group">
                         <Key size={14} className="text-yemenGold group-hover:rotate-12 transition-transform" />
                         إدارة تراخيص الوصول الموحد
                      </button>
                   </div>
                </div>
             </div>
          </div>

          {/* Infrastructure Resource Map - Multi-Tenant Isolation */}
          <div className="glass-panel rounded-2xl shadow-tactical overflow-hidden border-slate-800 flex flex-col border-b-4 border-yemenBlue">
             <div className="p-5 border-b border-slate-800 bg-slate-900/50 flex justify-between items-center">
                <div className="flex items-center gap-3">
                   <HardDrive size={20} className="text-yemenBlue shadow-glow-blue" />
                   <div>
                     <h3 className="text-xs font-black text-white uppercase tracking-widest font-tajawal">مصفوفة التخزين المعزولة (MinIO)</h3>
                     <p className="text-[8px] text-slate-500 uppercase tracking-tighter">Encrypted S3 Multi-Tenant Cluster</p>
                   </div>
                </div>
                <div className="flex items-center gap-4">
                   <div className="text-[9px] font-black text-slate-500 uppercase bg-slate-950 px-3 py-1 rounded-lg border border-slate-800">
                     Pool: <span className="text-white">10 TB Sovereign</span>
                   </div>
                </div>
             </div>
             
             <div className="p-6 grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                  { label: 'Tenant_Aden_DB', usage: '1.2TB', files: 14201, health: 'Optimized' },
                  { label: 'Tenant_Intel_Graph', usage: '480GB', files: 8902, health: 'Replicating' },
                  { label: 'Global_Media_Vault', usage: '3.1TB', files: 54101, health: 'Healthy' },
                  { label: 'Archive_Sovereign', usage: '890GB', files: 1204, health: 'Off-site' }
                ].map(bucket => (
                  <div key={bucket.label} className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col gap-3 group hover:border-yemenGold/20 transition-all cursor-default">
                     <div className="flex justify-between items-start">
                        <Database size={16} className="text-yemenGold group-hover:scale-110 transition-transform" />
                        <span className="text-[7px] font-black text-green-500 uppercase px-1.5 py-0.5 bg-green-500/10 rounded">{bucket.health}</span>
                     </div>
                     <div>
                        <div className="text-[9px] font-black text-white truncate mb-1">{bucket.label}</div>
                        <div className="flex justify-between text-[8px] font-bold text-slate-600 uppercase">
                           <span>{bucket.files} Obj</span>
                           <span className="text-blue-400">{bucket.usage}</span>
                        </div>
                     </div>
                  </div>
                ))}
             </div>

             <div className="p-4 bg-slate-900/80 border-t border-slate-800 flex justify-between items-center relative z-20">
                <div className="flex items-center gap-6">
                   <div className="flex items-center gap-2">
                     <Activity size={12} className="text-green-500" />
                     <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Data Sovereignty: Maintained</span>
                   </div>
                </div>
                <button className="text-[9px] font-black text-yemenGold hover:text-white transition-colors uppercase tracking-[0.2em] flex items-center gap-2">
                   <ExternalLink size={12} />
                   فتح واجهة MinIO الإدارية
                </button>
             </div>
          </div>
        </div>
      </div>
      
      {/* Emergency Purge Footer - Military Grade */}
      <div className="glass-panel p-5 rounded-2xl border border-red-500/30 bg-red-500/5 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl relative overflow-hidden">
         <div className="absolute top-0 left-0 w-full h-0.5 bg-red-500/20"></div>
         <div className="flex items-center gap-5 relative z-10">
            <div className="w-14 h-14 bg-red-500/20 rounded-2xl flex items-center justify-center text-red-500 border border-red-500/30 shadow-[0_0_20px_rgba(239,68,68,0.2)] animate-pulse">
               <ShieldAlert size={28} />
            </div>
            <div>
               <h4 className="text-sm font-black text-red-500 uppercase tracking-widest flex items-center gap-2">
                 بروتوكول "تدمير النواة" (Operational Purge)
                 <span className="text-[8px] bg-red-500 text-white px-2 py-0.5 rounded">HIGH_RISK</span>
               </h4>
               <p className="text-[10px] text-slate-400 font-bold leading-relaxed mt-1 max-w-2xl">
                 تحذير: سيؤدي تفعيل هذا البروتوكول إلى مسح كافة مفاتيح التشفير (Master Keys)، تعطيل كافة الحاويات في Coolify، وحذف سجلات DNS السيادية فوراً لمنع تسريب أي بيانات استخباراتية في حال اختراق السيرفر مادياً أو رقمياً.
               </p>
            </div>
         </div>
         <button className="bg-red-500 hover:bg-red-600 text-white px-10 py-4 rounded-xl font-black text-xs uppercase tracking-[0.2em] transition-all shadow-lg active:scale-95 flex items-center gap-3 relative z-10 group">
            <PowerOff size={18} className="group-hover:rotate-90 transition-transform" />
            تفعيل التدمير الفوري (Execute Purge)
         </button>
      </div>
    </div>
  );
};

// Custom Icon for Tower Control
const TowerControlIcon: React.FC<{size?: number, className?: string}> = ({size = 24, className = ""}) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M12 21h9" />
    <path d="M12 21H3" />
    <path d="M12 21V7" />
    <path d="m7 12 5-5 5 5" />
    <path d="M12 3v4" />
    <circle cx="12" cy="7" r="1" />
  </svg>
);

export default RootCommandCenter;
