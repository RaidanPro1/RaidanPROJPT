
import React, { useState } from 'react';
import { 
  Cloud, Server, Shield, Lock, UploadCloud, RefreshCw, 
  AlertTriangle, Play, CheckCircle2, Terminal, 
  Database, ShieldAlert, Zap, LifeBuoy, Ghost, 
  HardDrive, History, ArrowUpRight, Share2, Trash2, Key, Check
} from 'lucide-react';

const RecoveryPanel: React.FC = () => {
  const [teleportData, setTeleportData] = useState({ ip: '', user: 'root', pass: '' });
  const [isTeleporting, setIsTeleporting] = useState(false);
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [activeTab, setActiveTab] = useState<'disaster' | 'vault' | 'history'>('disaster');

  const handleTeleport = async () => {
    setIsTeleporting(true);
    setTimeout(() => {
        setIsTeleporting(false);
        alert("Teleport Protocol Initiated. Checking remote host integrity...");
    }, 3000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-700 pb-20 font-tajawal text-text-primary">
      {/* Lifeline Header */}
      <div className="bg-panel p-6 rounded-3xl flex flex-col xl:flex-row items-center justify-between gap-6 border border-border-subtle border-r-8 border-r-red-600 shadow-elevation relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>
        
        <div className="flex items-center gap-6 relative z-10">
          <div className="w-16 h-16 bg-red-600/10 rounded-2xl flex items-center justify-center text-red-600 border border-red-600/20 shadow-glow-red">
            <LifeBuoy size={32} />
          </div>
          <div>
            <h2 className="text-3xl font-black text-text-primary leading-none uppercase tracking-tight">وحدة شريان الحياة (Lifeline)</h2>
            <div className="flex items-center gap-3 mt-3">
               <span className="text-[10px] text-red-600 font-black uppercase tracking-[0.3em]">Disaster Recovery & Sovereign Survival</span>
               <div className="h-3 w-px bg-border-subtle"></div>
               <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse shadow-glow-green"></div>
                  <span className="text-[9px] font-black text-text-subtle uppercase tracking-widest px-1">Replication: SYNCED</span>
               </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 relative z-10">
            <div className="bg-slate-900 px-6 py-3 rounded-2xl border border-slate-800 flex items-center gap-5 shadow-2xl">
               <div className="text-center">
                  <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Last Snapshot</p>
                  <p className="text-xs font-black text-white">2h 12m ago</p>
               </div>
               <div className="w-px h-6 bg-slate-800"></div>
               <div className="text-center">
                  <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Enc Integrity</p>
                  <p className="text-xs font-black text-green-500 uppercase">Verified</p>
               </div>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Navigation Sidebar */}
        <div className="lg:col-span-3 space-y-3">
            <RecoveryTab id="disaster" label="الانتقال الآني (Teleport)" icon={<Ghost size={18}/>} active={activeTab} onClick={setActiveTab} />
            <RecoveryTab id="vault" label="خزنة السيادة (G-Vault)" icon={<Lock size={18}/>} active={activeTab} onClick={setActiveTab} />
            <RecoveryTab id="history" label="سجل النسخ والتعافي" icon={<History size={18}/>} active={activeTab} onClick={setActiveTab} />
            
            <div className="mt-8 p-6 bg-red-600/5 border border-red-600/20 rounded-3xl">
               <h4 className="text-[10px] font-black text-red-600 uppercase tracking-widest mb-4 flex items-center gap-2"><ShieldAlert size={14}/> Emergency Protocol</h4>
               <p className="text-[10px] text-text-secondary leading-relaxed font-bold">
                  في حال رصد اختراق فيزيائي للسيرفر، يتم تفعيل بروتوكول التدمير الذاتي (Purge) تلقائياً للمفاتيح الحساسة.
               </p>
               <button className="w-full mt-5 py-3 bg-red-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg hover:bg-red-700 transition-all active:scale-95">Purge Sensitive Data</button>
            </div>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-9 space-y-6">
            <div className="bg-panel rounded-[2.5rem] border border-border-subtle shadow-elevation min-h-[600px] flex flex-col relative overflow-hidden">
                
                {activeTab === 'disaster' && (
                    <div className="p-10 space-y-8 animate-in slide-in-from-bottom-4">
                        <div className="flex flex-col md:flex-row gap-10 items-start">
                            <div className="flex-1 space-y-8">
                               <div>
                                  <h3 className="text-xl font-black text-text-primary uppercase tracking-tighter">بروتوكول الانتقال الآني (Server Teleport)</h3>
                                  <p className="text-xs text-text-subtle font-bold mt-1 uppercase">نقل كامل البنية التحتية والموديلات إلى سيرفر جديد عبر قنوات مشفرة.</p>
                               </div>
                               
                               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                  <InputField label="Remote Host IP" value={teleportData.ip} onChange={v => setTeleportData({...teleportData, ip: v})} placeholder="0.0.0.0" />
                                  <InputField label="SSH User" value={teleportData.user} onChange={v => setTeleportData({...teleportData, user: v})} />
                                  <div className="md:col-span-2">
                                     <InputField label="SSH Private Key / Root Password" value={teleportData.pass} onChange={v => setTeleportData({...teleportData, pass: v})} type="password" />
                                  </div>
                               </div>

                               <div className="p-6 bg-red-600/5 rounded-3xl border border-red-600/20 flex gap-4 items-start">
                                  <AlertTriangle size={24} className="text-red-600 shrink-0 mt-1" />
                                  <p className="text-[11px] text-text-secondary leading-relaxed font-bold uppercase">
                                     سيقوم النظام بضغط كافة مجلدات الـ Volumes (Postgres, Qdrant, MinIO) ونقلها مشفرة. سيتم إيقاف الخدمات مؤقتاً أثناء عملية الـ Snapshot.
                                  </p>
                               </div>
                            </div>

                            <div className="w-full md:w-80 space-y-6">
                               <div className="bg-canvas p-6 rounded-3xl border border-border-subtle shadow-inner">
                                  <h4 className="text-[10px] font-black text-text-subtle uppercase tracking-widest mb-6 flex items-center gap-2"><Ghost size={14}/> Teleport Manifest</h4>
                                  <div className="space-y-4">
                                     <ManifestItem label="DB State (1.2 GB)" checked />
                                     <ManifestItem label="Vectors (450 MB)" checked />
                                     <ManifestItem label="LLM Weights (18 GB)" />
                                     <ManifestItem label="System Configs" checked />
                                  </div>
                               </div>
                               <button 
                                 onClick={handleTeleport}
                                 disabled={isTeleporting}
                                 className="w-full bg-slate-900 hover:bg-slate-800 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-[0.3em] shadow-2xl transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
                               >
                                  {isTeleporting ? <RefreshCw size={18} className="animate-spin" /> : <Zap size={18} fill="currentColor" className="text-brand-accent" />}
                                  {isTeleporting ? 'Initiating...' : 'Start Teleport Sequence'}
                               </button>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'vault' && (
                    <div className="p-10 space-y-8 animate-in fade-in h-full flex flex-col">
                        <div className="flex items-center justify-between border-b border-border-subtle pb-6">
                            <div>
                               <h3 className="text-xl font-black text-text-primary uppercase tracking-tighter">خزنة جوجل المشفرة (G-Vault)</h3>
                               <p className="text-xs text-text-subtle font-bold mt-1 uppercase">تخزين النسخ الاحتياطية المشفرة محلياً (Zero-Knowledge) في سحابة جوجل.</p>
                            </div>
                            <div className="flex items-center gap-3">
                               <div className="p-3 bg-brand-accent/10 text-brand-accent rounded-xl border border-brand-accent/20 shadow-sm"><Lock size={20}/></div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <VaultCard label="آخر نسخة مرفوعة" val="منذ ساعتين" icon={<Cloud size={20}/>} status="Secure" />
                            <VaultCard label="حجم البيانات" val="4.5 GB" icon={<HardDrive size={20}/>} status="Optimal" />
                            <VaultCard label="سياسة التدوير" val="7 أيام / 4 أسابيع" icon={<RefreshCw size={20}/>} status="Active" />
                        </div>

                        <div className="flex-1 bg-canvas border border-border-subtle rounded-[2.5rem] p-8 shadow-inner flex flex-col items-center justify-center space-y-8 text-center">
                            <div className="w-24 h-24 bg-panel rounded-[2rem] border border-border-subtle flex items-center justify-center shadow-lg relative">
                               <Cloud size={48} className="text-brand-accent" />
                               <div className="absolute -bottom-2 -right-2 bg-green-500 rounded-full p-1.5 border-4 border-canvas shadow-lg"><CheckCircle2 size={16} className="text-white"/></div>
                            </div>
                            <div className="max-w-md space-y-4">
                               <h4 className="text-lg font-black text-text-primary uppercase">نظام التشفير السيادي (AES-256-CBC)</h4>
                               <p className="text-xs text-text-subtle font-bold leading-relaxed uppercase">
                                  يتم تشفير كافة البيانات بمفتاح محلي فريد قبل الرفع. جوجل ترى فقط كتل بيانات مشفرة، لا يمكن فكها إلا عبر هذا السيرفر.
                               </p>
                            </div>
                            <button 
                               onClick={() => setIsBackingUp(true)}
                               disabled={isBackingUp}
                               className="bg-brand-primary hover:bg-brand-primary-hover text-white px-12 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.3em] shadow-glow-blue transition-all active:scale-95 disabled:opacity-50 flex items-center gap-4"
                            >
                               {isBackingUp ? <RefreshCw size={18} className="animate-spin" /> : <UploadCloud size={18} />}
                               {isBackingUp ? 'جاري التشفير والرفع...' : 'رفع نسخة احتياطية الآن'}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

const RecoveryTab: React.FC<{id: string, label: string, icon: React.ReactNode, active: string, onClick: (id: any) => void}> = ({id, label, icon, active, onClick}) => (
    <button 
      onClick={() => onClick(id)}
      className={`w-full p-5 rounded-2xl border text-right transition-all flex items-center gap-4 group ${
        active === id 
        ? 'bg-slate-900 text-white border-transparent shadow-xl ring-4 ring-slate-900/10' 
        : 'bg-panel border-border-subtle text-text-secondary hover:border-slate-800 hover:bg-canvas'
      }`}
    >
        <div className={`p-2.5 rounded-xl transition-colors ${active === id ? 'bg-white/20' : 'bg-canvas text-slate-500'}`}>
           {icon}
        </div>
        <div className="text-xs font-black uppercase leading-none truncate">{label}</div>
    </button>
);

const InputField: React.FC<{label: string, value: string, onChange: (v: string) => void, type?: string, placeholder?: string}> = ({label, value, onChange, type = 'text', placeholder}) => (
  <div className="space-y-2 group">
     <label className="text-[10px] font-black text-text-subtle uppercase tracking-widest px-2 group-focus-within:text-brand-primary transition-colors">{label}</label>
     <input 
        type={type} 
        value={value} 
        onChange={e => onChange(e.target.value)} 
        placeholder={placeholder}
        className="w-full bg-canvas border border-border-subtle rounded-xl px-5 py-4 text-xs font-mono outline-none focus:border-brand-primary transition-all shadow-inner text-text-primary"
     />
  </div>
);

const ManifestItem: React.FC<{label: string, checked?: boolean}> = ({label, checked}) => (
  <div className="flex items-center justify-between p-3 bg-panel border border-border-subtle rounded-xl hover:bg-canvas transition-colors">
     <span className="text-[10px] font-bold text-text-secondary uppercase">{label}</span>
     {checked ? <Check size={14} className="text-green-500" /> : <div className="w-3.5 h-3.5 border border-border-subtle rounded-sm"></div>}
  </div>
);

const VaultCard: React.FC<{label: string, val: string, icon: React.ReactNode, status: string}> = ({label, val, icon, status}) => (
  <div className="bg-canvas border border-border-subtle p-5 rounded-3xl shadow-inner group hover:border-brand-accent/30 transition-all">
     <div className="flex items-center gap-3 mb-3">
        <div className="p-2.5 bg-panel rounded-xl text-brand-accent shadow-sm group-hover:scale-110 transition-transform">{icon}</div>
        <span className="text-[9px] font-black text-text-subtle uppercase tracking-widest">{label}</span>
     </div>
     <div className="flex items-end justify-between">
        <span className="text-sm font-black text-text-primary uppercase tracking-tight">{val}</span>
        <span className="text-[8px] font-black text-green-500 uppercase flex items-center gap-1"><Zap size={8} fill="currentColor"/> {status}</span>
     </div>
  </div>
);

export default RecoveryPanel;
