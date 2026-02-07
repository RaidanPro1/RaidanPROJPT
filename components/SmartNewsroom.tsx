
import React, { useState, useEffect } from 'react';
import { 
  PenTool, Share2, Globe, Send, Layers, 
  Sparkles, ShieldCheck, History, Eye, 
  Twitter, Facebook, Send as Telegram, 
  ExternalLink, Hash, Image as ImageIcon, 
  Map as MapIcon, Mic2, Fingerprint, Database,
  Plus, Search, Filter, CheckCircle2, AlertTriangle,
  Layout, BarChart3, Settings2, Clock, Check,
  Download, Copy, Scissors, Square
} from 'lucide-react';

type NewsroomView = 'editor' | 'planner' | 'distribution' | 'analytics' | 'settings';

const SmartNewsroom: React.FC = () => {
  const [view, setView] = useState<NewsroomView>('editor');
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');

  // Assets available from other Sovereign modules
  const availableAssets = [
    { id: 'geo-1', type: 'map', title: 'رصد التحركات في ميناء الصليف', module: 'GeoInt', icon: <MapIcon size={14}/>, color: 'text-blue-500' },
    { id: 'for-1', type: 'forensic', title: 'فحص ELA لوثيقة المناقصة', module: 'Forensics', icon: <Fingerprint size={14}/>, color: 'text-brand-accent' },
    { id: 'aud-1', type: 'audio', title: 'تفريغ مكالمة (لهجة تهامية)', module: 'Dialect', icon: <Mic2 size={14}/>, color: 'text-green-500' },
    { id: 'data-1', type: 'graph', title: 'شبكة علاقات شركة "أ"', module: 'OSINT', icon: <Database size={14}/>, color: 'text-purple-500' },
  ];

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col gap-4 animate-in fade-in duration-700 font-tajawal">
      
      {/* Sovereign Header with Protocol Status */}
      <div className="bg-panel border border-border-subtle rounded-3xl p-5 flex items-center justify-between shadow-elevation relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-primary via-brand-accent to-brand-primary"></div>
        
        <div className="flex items-center gap-6">
            <div className="flex items-center gap-4 border-l border-border-subtle pl-8">
                <div className="w-12 h-12 bg-brand-primary/10 rounded-2xl flex items-center justify-center text-brand-primary border border-brand-primary/20 shadow-inner">
                    <PenTool size={24} />
                </div>
                <div>
                    <h2 className="text-xl font-black text-text-primary leading-none uppercase">Sovereign Newsroom</h2>
                    <span className="text-[10px] text-brand-primary font-black uppercase tracking-[0.2em] mt-2 block opacity-70">Publishing Protocol v5.0</span>
                </div>
            </div>

            <nav className="flex items-center gap-1 bg-canvas p-1 rounded-2xl border border-border-subtle">
                <NavTab active={view === 'editor'} onClick={() => setView('editor')} icon={<PenTool size={16}/>} label="المحرر الذكي" />
                <NavTab active={view === 'planner'} onClick={() => setView('planner')} icon={<Layers size={16}/>} label="المصادر والمخطط" />
                <NavTab active={view === 'distribution'} onClick={() => setView('distribution')} icon={<Share2 size={16}/>} label="مصفوفة النشر" />
                <NavTab active={view === 'settings'} onClick={() => setView('settings')} icon={<Settings2 size={16}/>} label="إعدادات القنوات" />
            </nav>
        </div>

        <div className="flex items-center gap-4">
            <div className="hidden xl:flex items-center gap-3 bg-green-500/10 border border-green-500/20 px-4 py-2 rounded-full">
                <ShieldCheck size={14} className="text-green-500" />
                <span className="text-[10px] font-black text-green-600 uppercase tracking-widest">Compliance Verification: PASS</span>
            </div>
            <button className="bg-brand-accent hover:shadow-glow-accent text-canvas px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all active:scale-95 shadow-lg">
                حفظ كمسودة نهائية
            </button>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-12 gap-6 overflow-hidden">
        
        {/* Left Pane: Intelligence Asset Arsenal */}
        <div className="col-span-3 flex flex-col gap-4 overflow-hidden">
            <div className="bg-panel rounded-[2rem] border border-border-subtle p-6 shadow-sm flex flex-col h-full overflow-hidden">
                <div className="flex justify-between items-center mb-6 border-b border-border-subtle pb-4">
                    <h3 className="text-[10px] font-black text-text-subtle uppercase tracking-[0.2em]">أصول الترسانة السيادية</h3>
                    <button className="p-1.5 bg-canvas rounded-lg hover:bg-brand-primary/10 text-brand-primary transition-colors border border-border-subtle">
                        <Plus size={16} />
                    </button>
                </div>
                
                <div className="space-y-4 overflow-y-auto custom-scrollbar flex-1 pr-1">
                    {availableAssets.map(asset => (
                        <div key={asset.id} className="p-4 bg-canvas border border-border-subtle rounded-2xl hover:border-brand-primary/40 transition-all group cursor-copy relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                               <Square size={10} className="text-brand-primary"/>
                            </div>
                            <div className="flex items-center gap-3 mb-3">
                                <div className={`p-2 rounded-xl bg-panel border border-border-subtle shadow-sm group-hover:scale-110 transition-transform ${asset.color}`}>
                                    {asset.icon}
                                </div>
                                <span className="text-[9px] font-black text-text-subtle uppercase tracking-widest">{asset.module} UNIT</span>
                            </div>
                            <p className="text-xs font-bold text-text-primary leading-snug group-hover:text-brand-primary transition-colors">{asset.title}</p>
                            <div className="mt-4 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
                                <span className="text-[8px] font-black text-brand-primary uppercase">اسحب للإدراج في النص</span>
                                <Download size={12} className="text-text-subtle" />
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-8 pt-6 border-t border-border-subtle space-y-4">
                   <div className="flex items-center justify-between">
                      <h4 className="text-[10px] font-black text-text-subtle uppercase tracking-[0.2em]">رادارات OSINT النشطة</h4>
                      <div className="flex items-center gap-1.5 bg-green-500/10 px-2 py-0.5 rounded-full">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-[8px] font-black text-green-600 uppercase">Live</span>
                      </div>
                   </div>
                   <div className="grid grid-cols-2 gap-2">
                      <RadarStatus label="GDELT" status="OK" />
                      <RadarStatus label="ALEPH" status="OK" />
                      <RadarStatus label="AIS" status="LOCKED" />
                      <RadarStatus label="FIRMS" status="OK" />
                   </div>
                </div>
            </div>
        </div>

        {/* Center Pane: Advanced Investigative Editor */}
        <div className="col-span-6 flex flex-col bg-panel rounded-[3rem] border border-border-subtle shadow-elevation overflow-hidden relative group/editor">
            {view === 'editor' ? (
                <>
                    <div className="p-5 border-b border-border-subtle bg-canvas/30 flex items-center justify-between backdrop-blur-sm z-20">
                        <div className="flex items-center gap-2 bg-panel p-1.5 rounded-xl border border-border-subtle shadow-sm">
                            <EditorTool icon={<ImageIcon size={18}/>} />
                            <EditorTool icon={<MapIcon size={18}/>} />
                            <EditorTool icon={<Hash size={18}/>} />
                            <div className="w-px h-5 bg-border-subtle mx-2"></div>
                            <EditorTool icon={<Layout size={18}/>} />
                            <EditorTool icon={<Scissors size={18}/>} />
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <Clock size={14} className="text-text-subtle" />
                                <span className="text-[10px] font-mono text-text-subtle uppercase">Last Edit: 12:45:02 (Local)</span>
                            </div>
                            <div className="h-4 w-px bg-border-subtle"></div>
                            <span className="text-[10px] font-mono text-brand-primary font-black tracking-[0.2em]">FILE: INV_9921_A</span>
                        </div>
                    </div>

                    <div className="flex-1 p-16 overflow-y-auto custom-scrollbar bg-[url('https://www.transparenttextures.com/patterns/notebook.png')] bg-fixed opacity-95">
                        <input 
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full bg-transparent border-none outline-none text-5xl font-black text-text-primary placeholder:text-text-subtle mb-12 text-right font-tajawal tracking-tighter"
                            placeholder="عنوان التحقيق الاستقصائي..."
                            dir="rtl"
                        />
                        <textarea 
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            className="w-full h-full bg-transparent border-none outline-none text-2xl text-text-secondary leading-[1.8] placeholder:text-text-subtle resize-none text-right font-tajawal"
                            placeholder="ابدأ بصياغة الحقيقة. استخدم مصفوفة الأصول على اليمين لدعم تقريرك بالأدلة الرقمية الموثقة..."
                            dir="rtl"
                        />
                    </div>

                    {/* Sovereign AI Co-Pilot Context Overlay */}
                    <div className="p-6 bg-brand-primary/5 border-t border-border-subtle flex items-center justify-between backdrop-blur-xl z-20">
                        <div className="flex items-center gap-5">
                            <div className="w-10 h-10 bg-brand-primary rounded-2xl flex items-center justify-center text-white shadow-glow-blue animate-pulse border border-white/10">
                                <Sparkles size={20} />
                            </div>
                            <p className="text-xs font-bold text-text-secondary leading-relaxed">
                                مساعد ريدان: لقد رصدت تشابهاً بنسبة <span className="text-brand-primary font-black">94%</span> مع وثائق "شركة الغاز" المسربة في ALEPH. هل تريد تضمين الارتباطات؟
                            </p>
                        </div>
                        <button className="bg-canvas border border-brand-primary/30 text-brand-primary px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-brand-primary hover:text-white transition-all shadow-sm">
                            إجراء الربط الدلالي
                        </button>
                    </div>
                </>
            ) : (
                <div className="flex-1 flex flex-col items-center justify-center opacity-30 space-y-6 grayscale">
                    <History size={80} className="text-text-subtle" />
                    <div className="text-center">
                       <p className="text-lg font-black uppercase tracking-[0.3em]">Module Maintenance</p>
                       <p className="text-xs font-bold mt-2 tracking-widest">Protocol Syncing with host.raidan.pro</p>
                    </div>
                </div>
            )}
        </div>

        {/* Right Pane: Omni-Channel Distribution Matrix */}
        <div className="col-span-3 flex flex-col gap-6 overflow-y-auto custom-scrollbar pr-1">
            
            <div className="bg-panel rounded-[2rem] border border-border-subtle p-7 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-brand-accent/20"></div>
                <h3 className="text-[10px] font-black text-text-subtle uppercase tracking-[0.2em] mb-8 flex items-center gap-3">
                    <Share2 size={16} className="text-brand-accent"/> مصفوفة النشر المتزامن
                </h3>
                
                <div className="space-y-4">
                    <ChannelToggle 
                        icon={<Globe size={18} className="text-blue-500"/>} 
                        label="Ghost CMS (الرسمي)" 
                        sub="investigations.raidan.pro"
                        active 
                    />
                    <ChannelToggle 
                        icon={<Layout size={18} className="text-purple-500"/>} 
                        label="WordPress Archive" 
                        sub="archive.raidan.pro"
                    />
                    
                    <div className="h-px bg-border-subtle my-8 opacity-50"></div>
                    
                    <ChannelToggle 
                        icon={<Twitter size={18} className="text-sky-500"/>} 
                        label="X (Thread Generation)" 
                        sub="Sovereign AI Mode"
                        active 
                    />
                    <ChannelToggle 
                        icon={<Telegram size={18} className="text-blue-400"/>} 
                        label="Telegram Broadcast" 
                        sub="Direct Channel Link"
                        active
                    />
                </div>

                <div className="mt-12 space-y-4">
                    <button className="w-full bg-brand-primary hover:bg-brand-primary-hover text-white py-5 rounded-2xl font-black text-xs uppercase tracking-[0.3em] shadow-glow-blue transition-all active:scale-95 flex items-center justify-center gap-3 border border-white/5">
                        <Send size={18} />
                        إطلاق النشر السيادي
                    </button>
                    <div className="p-4 bg-canvas/80 border border-border-subtle rounded-2xl flex items-center gap-3 shadow-inner">
                        <ShieldCheck size={18} className="text-green-500 shrink-0" />
                        <span className="text-[9px] font-bold text-text-subtle leading-normal uppercase">
                            سيتم تشفير نسخة أصلية في "خزنة السيادة" (Local Vault) قبل النشر العام تلقائياً.
                        </span>
                    </div>
                </div>
            </div>

            <div className="bg-panel rounded-[2rem] border border-border-subtle p-6 shadow-sm">
                <h3 className="text-[10px] font-black text-text-subtle uppercase tracking-[0.2em] mb-5 flex items-center gap-3">
                    <CheckCircle2 size={16} className="text-green-500"/> بروتوكول التحقق النهائي
                </h3>
                <div className="space-y-3">
                    <FactCheckItem label="أسماء المصادر محمية" status="pass" />
                    <FactCheckItem label="الأدلة الجنائية موثقة" status="pass" />
                    <FactCheckItem label="مطابقة قانون الصحافة" status="warning" />
                    <FactCheckItem label="حقوق الملكية الفكرية" status="pass" />
                </div>
            </div>
        </div>

      </div>
    </div>
  );
};

// --- Newsroom Sub-Components ---

const NavTab: React.FC<{active: boolean, onClick: () => void, icon: React.ReactNode, label: string}> = ({active, onClick, icon, label}) => (
    <button 
      onClick={onClick}
      className={`px-5 py-2.5 rounded-xl text-[11px] font-black uppercase transition-all flex items-center gap-3 ${
        active ? 'bg-panel text-brand-primary shadow-sm border border-border-subtle ring-4 ring-brand-primary/5' : 'text-text-subtle hover:text-text-primary'
      }`}
    >
        <div className={active ? 'text-brand-primary' : 'text-text-subtle'}>{icon}</div>
        {label}
    </button>
);

const EditorTool: React.FC<{icon: React.ReactNode}> = ({icon}) => (
    <button className="p-2.5 text-text-subtle hover:text-brand-primary hover:bg-canvas rounded-xl transition-all border border-transparent hover:border-border-subtle group">
        <div className="group-hover:scale-110 transition-transform">{icon}</div>
    </button>
);

const RadarStatus: React.FC<{label: string, status: string}> = ({label, status}) => (
    <div className="flex flex-col gap-1.5 bg-canvas/60 p-3 rounded-xl border border-border-subtle shadow-inner">
        <span className="text-[8px] font-black text-text-subtle uppercase tracking-widest">{label}</span>
        <div className="flex items-center gap-1.5">
            <div className={`w-1.5 h-1.5 rounded-full ${status === 'OK' ? 'bg-green-500 shadow-glow-green' : status === 'LOCKED' ? 'bg-brand-accent' : 'bg-red-500'}`}></div>
            <span className={`text-[9px] font-black uppercase ${status === 'OK' ? 'text-green-500' : 'text-text-primary'}`}>{status}</span>
        </div>
    </div>
);

const ChannelToggle: React.FC<{icon: React.ReactNode, label: string, sub: string, active?: boolean}> = ({icon, label, sub, active}) => (
    <div className={`flex items-center justify-between p-4 rounded-2xl border transition-all cursor-pointer group ${active ? 'bg-brand-primary/5 border-brand-primary/30' : 'bg-canvas border-border-subtle opacity-60 hover:opacity-100'}`}>
        <div className="flex items-center gap-4">
            <div className={`p-2.5 rounded-xl transition-all border ${active ? 'bg-brand-primary text-white border-white/10 shadow-lg' : 'bg-panel border-border-subtle'}`}>
                {icon}
            </div>
            <div className="overflow-hidden">
                <span className="text-xs font-black text-text-primary block leading-none mb-1.5 truncate">{label}</span>
                <span className="text-[9px] text-text-subtle font-bold uppercase tracking-tight truncate block">{sub}</span>
            </div>
        </div>
        <div className={`w-10 h-5 rounded-full p-1 flex items-center transition-all ${active ? 'bg-brand-primary justify-end shadow-inner' : 'bg-slate-300 justify-start'}`}>
            <div className="w-3 h-3 bg-white rounded-full shadow-md"></div>
        </div>
    </div>
);

const FactCheckItem: React.FC<{label: string, status: 'pass' | 'warning' | 'fail'}> = ({label, status}) => (
    <div className="flex items-center justify-between p-4 rounded-2xl bg-canvas/40 border border-border-subtle hover:border-brand-primary/20 transition-colors">
        <span className="text-[10px] font-black text-text-secondary uppercase tracking-widest">{label}</span>
        {status === 'pass' ? (
            <div className="w-6 h-6 rounded-full bg-green-500/10 flex items-center justify-center"><Check size={12} className="text-green-500" /></div>
        ) : (
            <div className="w-6 h-6 rounded-full bg-amber-500/10 flex items-center justify-center"><AlertTriangle size={12} className="text-amber-500" /></div>
        )}
    </div>
);

export default SmartNewsroom;
