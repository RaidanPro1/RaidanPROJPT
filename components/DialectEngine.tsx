import React, { useState, useRef, useEffect } from 'react';
import { 
  Volume2, Mic2, Users, Languages, ListMusic, Waves, 
  Play, Pause, RotateCw, Download, FileAudio, 
  Settings2, Activity, Cpu, CheckCircle2, AlertTriangle,
  MessageSquare, UserCircle2, Clock, Zap, Hash,
  Database, HardDrive, BarChart3, Speaker, Headphones,
  Terminal, ShieldAlert, SlidersHorizontal, ArrowUpRight,
  ShieldCheck, Info, Eraser, Filter, Scissors, Music,
  // FIX: Replaced non-existent 'Waveform' with 'Waves' and added 'Maximize2'
  Maximize2, FileSearch, Trash2, Save, Upload, Share2
} from 'lucide-react';

type MunsitTool = 'cleaner' | 'transcribe' | 'diarization' | 'forensics';

const DialectEngine: React.FC = () => {
  const [activeTool, setActiveTool] = useState<MunsitTool>('transcribe');
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [cpuLoad, setCpuLoad] = useState(8);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [logs, setLogs] = useState<string[]>(['[SYSTEM] Munsit Engine XXL (v4.5) Initialized...']);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const addLog = (msg: string) => {
    setLogs(prev => [...prev.slice(-10), `[${new Date().toLocaleTimeString()}] ${msg}`]);
  };

  const simulateProcessing = () => {
    if (!selectedFile) return;
    setIsProcessing(true);
    setProgress(0);
    addLog(`[NATIVE] Booting CPU parallel processing (16 threads)...`);
    
    const interval = setInterval(() => {
      setCpuLoad(Math.floor(Math.random() * 40) + 50);
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsProcessing(false);
          setCpuLoad(8);
          addLog(`[SUCCESS] Process completed. Assets ready for review.`);
          return 100;
        }
        return prev + 2;
      });
    }, 100);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file.name);
      addLog(`[INPUT] Source loaded: ${file.name} (${(file.size / (1024 * 1024)).toFixed(2)} MB)`);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-700 pb-20 font-tajawal text-text-primary">
      {/* Sovereign Header */}
      <div className="bg-panel p-6 rounded-2xl flex flex-col xl:flex-row items-center justify-between gap-6 border border-border-subtle border-r-4 border-r-brand-primary shadow-elevation relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>
        
        <div className="flex items-center gap-6 relative z-10">
          <div className="w-16 h-16 bg-canvas border border-border-subtle rounded-2xl flex items-center justify-center text-brand-primary shadow-sm">
            <Mic2 size={32} className={isProcessing ? 'animate-pulse' : ''} />
          </div>
          <div>
            <h2 className="text-3xl font-black text-text-primary leading-none uppercase tracking-tight">محرك "مُنصت" السيادي</h2>
            <div className="flex items-center gap-3 mt-3">
               <span className="text-[10px] text-brand-primary font-black uppercase tracking-[0.3em]">Dialect Intelligence & Audio Forensics</span>
               <div className="h-3 w-px bg-border-subtle"></div>
               <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full shadow-[0_0_8px_rgba(34,197,94,0.4)]"></div>
                  <span className="text-[9px] font-black text-text-subtle uppercase tracking-widest px-1">Native Processing: ACTIVE</span>
               </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 relative z-10">
          <div className="bg-canvas p-3 px-6 rounded-xl border border-border-subtle flex items-center gap-8 shadow-inner">
             <div className="flex flex-col border-l border-border-subtle pl-6 text-center">
                <span className="text-[8px] font-black text-text-subtle uppercase tracking-widest mb-1">CPU Power</span>
                <span className={`text-sm font-mono font-black ${cpuLoad > 80 ? 'text-red-500' : 'text-brand-primary'}`}>{cpuLoad}%</span>
             </div>
             <div className="flex flex-col text-center">
                <span className="text-[8px] font-black text-text-subtle uppercase tracking-widest mb-1">VRAM Isolation</span>
                <span className="text-[10px] font-black text-green-500 uppercase">Secured</span>
             </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        {/* Sub-Tools Navigation Sidebar */}
        <div className="xl:col-span-3 space-y-4">
           <div className="bg-panel p-4 rounded-2xl border border-border-subtle shadow-elevation">
              <h3 className="text-[10px] font-black text-text-subtle uppercase tracking-[0.2em] mb-4 px-2">ترسانة الأدوات التفصيلية</h3>
              <div className="space-y-2">
                 <ToolNavButton 
                   id="cleaner" active={activeTool} onClick={setActiveTool} 
                   icon={<Eraser size={18}/>} label="تنظيف وعزل الصوت" sub="VR-Architecture" 
                 />
                 <ToolNavButton 
                   id="transcribe" active={activeTool} onClick={setActiveTool} 
                   icon={<Languages size={18}/>} label="تفريغ النص (XXL)" sub="Whisper Native" 
                 />
                 <ToolNavButton 
                   id="diarization" active={activeTool} onClick={setActiveTool} 
                   icon={<Users size={18}/>} label="تمييز المتحدثين" sub="Speaker Mapping" 
                 />
                 <ToolNavButton 
                   id="forensics" active={activeTool} onClick={setActiveTool} 
                   icon={<FileSearch size={18}/>} label="التحليل الجنائي" sub="Spectrogram Lab" 
                 />
              </div>
           </div>

           {/* Quick Upload Panel */}
           <div className="bg-glass backdrop-blur-glass p-6 rounded-2xl border border-border-glass shadow-elevation space-y-6">
              <div className="flex items-center gap-3 border-b border-border-subtle pb-4">
                <Upload size={18} className="text-brand-primary" />
                <h3 className="text-xs font-black text-text-primary uppercase tracking-widest">تغذية المحرك</h3>
              </div>
              
              {!selectedFile ? (
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-border-subtle rounded-xl p-8 flex flex-col items-center justify-center gap-3 hover:border-brand-primary/50 hover:bg-brand-primary/5 transition-all cursor-pointer group"
                >
                   <FileAudio size={24} className="text-text-subtle group-hover:text-brand-primary transition-all" />
                   <p className="text-[10px] font-black text-text-subtle uppercase tracking-widest text-center">اسحب ملف الصوت هنا</p>
                   <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept="audio/*" />
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="bg-canvas p-3 rounded-xl border border-border-subtle flex items-center justify-between">
                     <div className="flex items-center gap-3 overflow-hidden">
                        {/* FIX: Replaced Waveform with Waves */}
                        <Waves size={16} className="text-brand-primary shrink-0" />
                        <span className="text-[10px] font-bold text-text-secondary truncate">{selectedFile}</span>
                     </div>
                     <button onClick={() => setSelectedFile(null)} className="text-text-subtle hover:text-red-500"><Trash2 size={14}/></button>
                  </div>
                  <button 
                    onClick={simulateProcessing}
                    disabled={isProcessing}
                    className="w-full py-4 bg-brand-primary hover:bg-brand-primary-hover text-white rounded-xl font-black text-[10px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 shadow-lg active:scale-95 disabled:opacity-50"
                  >
                    {isProcessing ? <Loader2 size={16} className="animate-spin" /> : <Zap size={16} className="text-brand-accent" />}
                    {isProcessing ? 'جاري المعالجة...' : 'تشغيل الوحدة النشطة'}
                  </button>
                </div>
              )}
           </div>
        </div>

        {/* Dynamic Tool Interface Area */}
        <div className="xl:col-span-9 space-y-6">
           <div className="bg-panel rounded-2xl shadow-elevation border border-border-subtle min-h-[650px] flex flex-col relative overflow-hidden">
              
              {/* Tool Internal Header */}
              <div className="p-5 border-b border-border-subtle bg-canvas/50 flex justify-between items-center z-20">
                 <div className="flex items-center gap-4">
                    <span className="text-xs font-black text-text-primary uppercase tracking-widest">
                       المختبر: <span className="text-brand-primary">
                         {activeTool === 'cleaner' && 'عزل وتنقية الترددات'}
                         {activeTool === 'transcribe' && 'التفريغ النصي اللهجي'}
                         {activeTool === 'diarization' && 'خارطة التفاعل الصوتي'}
                         {activeTool === 'forensics' && 'الفحص الجنائي للويفات'}
                       </span>
                    </span>
                 </div>
                 <div className="flex items-center gap-3">
                    <button className="p-2 bg-canvas border border-border-subtle rounded-lg text-text-subtle hover:text-brand-primary transition-all"><Settings2 size={16}/></button>
                    {/* FIX: Maximize2 is now imported from lucide-react */}
                    <button className="p-2 bg-canvas border border-border-subtle rounded-lg text-text-subtle hover:text-brand-primary transition-all"><Maximize2 size={16}/></button>
                 </div>
              </div>

              {/* Tool Content Rendering */}
              <div className="flex-1 p-8 overflow-y-auto custom-scrollbar bg-canvas/30">
                 {activeTool === 'cleaner' && <VocalCleanerUI isProcessing={isProcessing} progress={progress} />}
                 {activeTool === 'transcribe' && <TranscriptionUI isProcessing={isProcessing} progress={progress} />}
                 {activeTool === 'diarization' && <DiarizationUI isProcessing={isProcessing} progress={progress} />}
                 {activeTool === 'forensics' && <AudioForensicsUI isProcessing={isProcessing} progress={progress} />}
              </div>

              {/* Processing Progress Bar (Global for active tool) */}
              {isProcessing && (
                <div className="absolute bottom-0 left-0 w-full h-1.5 bg-canvas overflow-hidden z-30">
                  <div className="h-full bg-brand-primary transition-all duration-300" style={{ width: `${progress}%` }}></div>
                </div>
              )}

              {/* Terminal Logs Viewport */}
              <div className="h-40 bg-slate-950 border-t border-slate-800 p-4 font-mono text-[10px] text-green-400 overflow-y-auto custom-scrollbar">
                 <div className="flex items-center justify-between mb-2 text-slate-500 border-b border-slate-900 pb-1">
                    <span>MUNSIT_KERNEL_LOGS</span>
                    <Terminal size={12} />
                 </div>
                 {logs.map((log, i) => (
                   <div key={i} className="mb-1">{log}</div>
                 ))}
                 {isProcessing && <div className="animate-pulse">_</div>}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

// --- SUB-COMPONENTS FOR TOOLS ---

const ToolNavButton: React.FC<{id: MunsitTool, active: MunsitTool, onClick: (id: MunsitTool) => void, icon: React.ReactNode, label: string, sub: string}> = ({id, active, onClick, icon, label, sub}) => (
    <button
      onClick={() => onClick(id)}
      className={`w-full p-4 rounded-xl border text-right transition-all flex items-center justify-between group ${
        active === id 
        ? 'bg-brand-primary text-white shadow-md border-transparent ring-4 ring-brand-primary/10 scale-[1.02]' 
        : 'bg-canvas border-border-subtle text-text-secondary hover:border-brand-primary/30'
      }`}
    >
      <div className="flex items-center gap-3">
         <div className={`p-2 rounded-lg ${active === id ? 'bg-white/20' : 'bg-panel text-brand-primary'}`}>
            {icon}
         </div>
         <div>
            <div className="text-xs font-black uppercase leading-none mb-1">{label}</div>
            <div className={`text-[8px] font-bold uppercase ${active === id ? 'text-blue-100' : 'text-text-subtle'}`}>{sub}</div>
         </div>
      </div>
      {active === id && <ArrowUpRight size={14} className="text-brand-accent" />}
    </button>
);

const VocalCleanerUI: React.FC<{isProcessing: boolean, progress: number}> = ({isProcessing, progress}) => (
    <div className="h-full flex flex-col gap-8 animate-in slide-in-from-bottom-4">
       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <CleaningCard icon={<Users className="text-brand-primary"/>} title="استخراج الصوت البشري" desc="فصل الكلمات عن الموسيقى والضجيج المحيط." active />
          <CleaningCard icon={<Music className="text-text-subtle"/>} title="عزل الموسيقى والخلفية" desc="استخراج الترددات غير البشرية للتحليل." />
          <CleaningCard icon={<Scissors className="text-brand-accent"/>} title="إزالة صدى المكان" desc="تصحيح الترددات المرتدة في القاعات المفتوحة." />
          <CleaningCard icon={<Filter className="text-green-500"/>} title="فلترة الرياح والهواء" desc="تنقية التسجيلات الميدانية من صوت الهواء." />
       </div>
       {progress > 80 && (
         <div className="mt-auto bg-green-500/5 border border-green-500/20 p-6 rounded-2xl flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-4">
               <div className="p-3 bg-green-500/20 text-green-600 rounded-full"><CheckCircle2 size={24}/></div>
               <div>
                  <h4 className="text-sm font-black text-text-primary">تمت التنقية بنجاح</h4>
                  <p className="text-xs text-text-subtle font-bold">ملف الصوت الصافي جاهز للتحميل أو التفريغ.</p>
               </div>
            </div>
            <button className="px-6 py-2.5 bg-brand-primary text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-md hover:scale-105 transition-transform">
               <Download size={16}/> تحميل النسخة الصافية
            </button>
         </div>
       )}
    </div>
);

const TranscriptionUI: React.FC<{isProcessing: boolean, progress: number}> = ({isProcessing, progress}) => (
    <div className="h-full flex flex-col gap-6 animate-in fade-in">
       <div className="flex-1 bg-panel border border-border-subtle rounded-2xl p-8 relative shadow-inner overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none"><FileAudio size={120} /></div>
          <div className="relative z-10 text-right space-y-4">
             {progress > 50 ? (
               <p className="text-lg leading-loose font-medium text-text-secondary">
                  <span className="text-brand-primary font-black">[00:01]</span> يا خبير، عزلنا الصوت بالـ VR Arch والآن الكلام طالع صافي جداً بالرغم من ضجيج السوق. <br/>
                  <span className="text-brand-primary font-black">[00:13]</span> ممتاز، الـ XXL موديل على الـ CPU شغال طيارة، كأنه GPU!
               </p>
             ) : isProcessing ? (
                <div className="space-y-4 pt-20">
                   <div className="h-4 bg-canvas rounded-full w-full animate-pulse"></div>
                   <div className="h-4 bg-canvas rounded-full w-3/4 animate-pulse"></div>
                   <div className="h-4 bg-canvas rounded-full w-1/2 animate-pulse"></div>
                   <p className="text-center text-xs font-black text-text-subtle uppercase tracking-widest mt-10">جاري فك التشفير اللهجي...</p>
                </div>
             ) : (
                <div className="h-full flex flex-col items-center justify-center py-20 text-text-subtle gap-4 opacity-40">
                   <Languages size={48} />
                   <p className="text-sm font-black uppercase tracking-widest">انتظار بدء التفريغ...</p>
                </div>
             )}
          </div>
       </div>
       <div className="flex justify-end gap-3">
          <button className="px-6 py-2.5 bg-canvas border border-border-subtle rounded-xl text-xs font-bold flex items-center gap-2 hover:bg-panel transition-all"><Save size={14}/> حفظ المسودة</button>
          <button className="px-6 py-2.5 bg-canvas border border-border-subtle rounded-xl text-xs font-bold flex items-center gap-2 hover:bg-panel transition-all"><Share2 size={14}/> تصدير لغرفة الأخبار</button>
       </div>
    </div>
);

const DiarizationUI: React.FC<{isProcessing: boolean, progress: number}> = ({isProcessing, progress}) => (
    <div className="h-full flex flex-col gap-6 animate-in slide-in-from-left-4">
       <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
          <div className="bg-panel p-5 rounded-2xl border border-border-subtle flex items-center gap-4">
             <div className="w-10 h-10 bg-brand-primary rounded-full flex items-center justify-center text-white font-black">A</div>
             <div>
                <div className="text-xs font-black uppercase">متحدث 1</div>
                <div className="text-[10px] text-green-500 font-bold uppercase">بصمة موثقة</div>
             </div>
          </div>
          <div className="bg-panel p-5 rounded-2xl border border-border-subtle flex items-center gap-4">
             <div className="w-10 h-10 bg-brand-accent rounded-full flex items-center justify-center text-white font-black">B</div>
             <div>
                <div className="text-xs font-black uppercase">متحدث 2</div>
                <div className="text-[10px] text-text-subtle font-bold uppercase">قيد التعرف</div>
             </div>
          </div>
       </div>
       <div className="flex-1 bg-panel border border-border-subtle rounded-2xl p-8 shadow-inner overflow-hidden flex flex-col justify-center gap-8">
          <div className="space-y-4">
             <div className="flex justify-between text-[10px] font-black text-text-subtle uppercase px-2"><span>Timeline</span><span>00:00 - 02:45</span></div>
             <div className="h-12 bg-canvas rounded-xl border border-border-subtle overflow-hidden flex relative">
                {progress > 30 && <div className="h-full bg-brand-primary/40 border-r border-brand-primary" style={{ width: '40%' }}></div>}
                {progress > 60 && <div className="h-full bg-brand-accent/40 border-r border-brand-accent" style={{ width: '25%' }}></div>}
                {progress > 90 && <div className="h-full bg-brand-primary/40 border-r border-brand-primary" style={{ width: '35%' }}></div>}
             </div>
          </div>
          <p className="text-center text-[10px] font-bold text-text-subtle uppercase tracking-widest leading-relaxed">
             محرك Pyannote-audio يقوم الآن برسم العلاقات الزمنية بين الأطراف. <br/> دقة التمييز الحالية: 98.4%
          </p>
       </div>
    </div>
);

const AudioForensicsUI: React.FC<{isProcessing: boolean, progress: number}> = ({isProcessing, progress}) => (
    <div className="h-full flex flex-col gap-6 animate-in zoom-in-95">
       <div className="flex-1 bg-slate-950 rounded-2xl p-8 shadow-2xl relative overflow-hidden flex flex-col border border-slate-800">
          <div className="flex justify-between items-center mb-6 border-b border-slate-800 pb-4">
             <div className="flex items-center gap-2 text-brand-accent">
                <BarChart3 size={18}/>
                <span className="text-[10px] font-black uppercase tracking-widest">Spectrogram Analysis Lab</span>
             </div>
             <div className="flex gap-2">
                <div className="px-3 py-1 bg-red-500/10 text-red-500 rounded-lg text-[9px] font-black uppercase border border-red-500/20 flex items-center gap-1.5">
                   <ShieldAlert size={10}/> Tamper Detection
                </div>
             </div>
          </div>
          
          {/* Simulated Spectrogram */}
          <div className="flex-1 flex items-end gap-1 px-4 opacity-50">
             {[...Array(60)].map((_, i) => (
                <div 
                  key={i} 
                  className={`flex-1 rounded-t-sm transition-all duration-500 ${isProcessing ? 'bg-brand-accent' : 'bg-brand-primary/30'}`}
                  style={{ height: isProcessing ? `${Math.random() * 100}%` : `${Math.random() * 20 + 10}%` }}
                ></div>
             ))}
          </div>
          
          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
             <ForensicStat label="Phase Consistency" value="99.2%" />
             <ForensicStat label="Noise Floor" value="-48dB" />
             <ForensicStat label="Metadata Hash" value="0x8F22A" />
             <ForensicStat label="Splicing Check" value="Safe" color="text-green-500" />
          </div>
       </div>
    </div>
);

const ForensicStat: React.FC<{label: string, value: string, color?: string}> = ({label, value, color = "text-text-primary"}) => (
    <div className="bg-white/5 border border-white/10 p-3 rounded-xl text-center">
       <div className="text-[8px] text-slate-500 font-black uppercase mb-1">{label}</div>
       <div className={`text-xs font-mono font-bold ${color}`}>{value}</div>
    </div>
);

const CleaningCard: React.FC<{icon: React.ReactNode, title: string, desc: string, active?: boolean}> = ({icon, title, desc, active}) => (
    <div className={`p-5 rounded-2xl border transition-all cursor-pointer ${active ? 'bg-brand-primary/5 border-brand-primary/40 shadow-sm' : 'bg-panel border-border-subtle hover:border-brand-primary/20'}`}>
       <div className="flex items-start gap-4">
          <div className={`p-2.5 rounded-xl ${active ? 'bg-brand-primary text-white shadow-md' : 'bg-canvas'}`}>
             {icon}
          </div>
          <div className="text-right">
             <h4 className="text-xs font-black text-text-primary mb-1">{title}</h4>
             <p className="text-[9px] text-text-subtle font-bold leading-relaxed uppercase">{desc}</p>
          </div>
       </div>
    </div>
);

const Loader2 = ({className, size}: {className?: string, size?: number}) => (
  <RotateCw className={className} size={size} />
);

export default DialectEngine;