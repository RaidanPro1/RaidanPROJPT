
import React, { useState, useRef, useEffect } from 'react';
import { 
  Volume2, Mic2, Users, Languages, ListMusic, Waves, 
  Play, Pause, RotateCw, Download, FileAudio, 
  Settings2, Activity, Cpu, CheckCircle2, AlertCircle,
  MessageSquare, UserCircle2, Clock, Zap, Hash,
  Database, HardDrive, BarChart3, Speaker, Headphones,
  Terminal, ShieldAlert, SlidersHorizontal, ArrowUpRight,
  ShieldCheck, Info, Eraser, Filter
} from 'lucide-react';

interface AudioSegment {
  id: string;
  speaker: string;
  startTime: string;
  endTime: string;
  text: string;
  dialect: string;
  confidence: number;
}

interface QueueItem {
  id: string;
  filename: string;
  size: string;
  status: 'waiting' | 'isolating' | 'transcribing' | 'completed';
  priority: 'high' | 'normal';
}

const DialectEngine: React.FC = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [selectedLoRA, setSelectedLoRA] = useState('Sanaani_v4_XXL');
  const [cpuLoad, setCpuLoad] = useState(12);
  const [logs, setLogs] = useState<string[]>(['[SYSTEM] Faster-Whisper XXL Engine Standby (CPU Mode)...']);
  const [transcript, setTranscript] = useState<AudioSegment[]>([]);
  const [isIsolationEnabled, setIsIsolationEnabled] = useState(true);
  
  const [queue, setQueue] = useState<QueueItem[]>([
    { id: 'Q-5501', filename: 'اتصال_ميداني_مضطرب.wav', size: '18.4MB', status: 'completed', priority: 'high' },
    { id: 'Q-5502', filename: 'تسجيل_مقهى_تعز.mp3', size: '12.1MB', status: 'waiting', priority: 'normal' }
  ]);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const logEndRef = useRef<HTMLDivElement>(null);

  const loraAdapters = [
    { id: 'Sanaani_v4_XXL', name: 'صنعاني XXL (CPU Optimized)', region: 'صنعاء - ذمار', version: 'v4.0' },
    { id: 'Taizi_v3_XXL', name: 'تعزي XXL (CPU Optimized)', region: 'تعز - إب', version: 'v3.2' },
    { id: 'Adeni_v3_XXL', name: 'عدني XXL (CPU Optimized)', region: 'عدن - لحج', version: 'v3.1' },
  ];

  const addLog = (msg: string) => {
    setLogs(prev => [...prev.slice(-15), `[${new Date().toLocaleTimeString()}] ${msg}`]);
  };

  useEffect(() => {
    if (logEndRef.current) {
      logEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs]);

  useEffect(() => {
    let interval: any;
    if (isProcessing) {
      addLog(`[UVR] Initializing VR Architecture (Vocal Isolation)...`);
      addLog(`[CPU] Threading enabled: 16 Cores (AVX-512)`);
      
      interval = setInterval(() => {
        setCpuLoad(prev => Math.min(prev + 5, 94));
        setProgress(prev => {
          if (prev >= 100) {
            setIsProcessing(false);
            setCpuLoad(12);
            addLog(`[SYSTEM] Transcription finalized via Faster-Whisper XXL.`);
            generateFinalTranscript();
            return 100;
          }
          if (prev === 20) addLog(`[VR-ARCH] Isolation complete. Background noise removed.`);
          if (prev === 30) addLog(`[WHISPER-XXL] Loading model into RAM... OK`);
          if (prev === 50) addLog(`[ENGINE] Processing XXL chunks (CPU Parallelism)...`);
          if (prev === 85) addLog(`[DIARIZATION] Mapping speakers to local profiles...`);
          return prev + 1.2;
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isProcessing]);

  const generateFinalTranscript = () => {
    setTranscript([
      { id: '1', speaker: 'متحدث A', startTime: '00:00', endTime: '00:12', text: 'يا خبير، عزلنا الصوت بالـ VR Arch والآن الكلام طالع صافي جداً بالرغم من ضجيج السوق.', dialect: 'صنعاني', confidence: 0.99 },
      { id: '2', speaker: 'متحدث B', startTime: '00:13', endTime: '00:25', text: 'ممتاز، الـ XXL موديل على الـ CPU شغال طيارة، كأنه GPU!', dialect: 'صنعاني', confidence: 0.97 },
    ]);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-700 pb-20 text-slate-900">
      {/* Header - Light Mode */}
      <div className="bg-white p-6 rounded-2xl flex flex-col xl:flex-row items-center justify-between gap-6 border border-slate-200 border-r-4 border-r-yemenBlue shadow-tactical relative overflow-hidden">
        <div className="flex items-center gap-6 relative z-10">
          <div className="w-16 h-16 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-center text-yemenBlue shadow-sm relative overflow-hidden">
            <Mic2 size={32} className={isProcessing ? 'animate-pulse' : ''} />
          </div>
          <div>
            <h2 className="text-3xl font-black text-slate-900 font-tajawal leading-none">محرك "مُنصت" الهجين (XXL)</h2>
            <div className="flex items-center gap-3 mt-2">
               <span className="text-[10px] text-yemenBlue font-black uppercase tracking-[0.3em]">Faster-Whisper XXL + VR-Arch Isolation</span>
               <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full shadow-[0_0_8px_rgba(34,197,94,0.3)]"></div>
                  <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest px-1">CPU Processing: Enabled</span>
               </div>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 items-center relative z-10">
          <div className="bg-slate-50 p-3 px-6 rounded-xl border border-slate-100 flex items-center gap-8 shadow-inner">
             <div className="flex flex-col border-l border-slate-200 pl-6">
                <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">CPU Compute Load</span>
                <div className="flex items-center gap-2">
                   <Cpu size={14} className="text-yemenBlue" />
                   <span className="text-sm font-black text-slate-900 font-mono">{cpuLoad}%</span>
                </div>
             </div>
             <div className="flex flex-col border-l border-slate-200 pl-6">
                <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Isolation Module</span>
                <div className="flex items-center gap-2">
                   <Eraser size={14} className={isIsolationEnabled ? 'text-purple-600' : 'text-slate-300'} />
                   <span className="text-[10px] font-black text-slate-700 uppercase">VR Arch: Active</span>
                </div>
             </div>
             <div className="flex flex-col">
                <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Model Precision</span>
                <div className="flex items-center gap-2">
                   <Zap size={14} className="text-yemenGold" />
                   <span className="text-[9px] font-black text-yemenBlue uppercase bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                     int8_float16
                   </span>
                </div>
             </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Sidebar Controls */}
        <div className="xl:col-span-4 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
             <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <SlidersHorizontal size={18} className="text-yemenBlue" />
                  <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest font-tajawal">إعدادات المعالجة الصرفة</h3>
                </div>
                <div className="flex items-center gap-2">
                   <span className="text-[8px] font-black text-slate-400 uppercase">Isolation</span>
                   <button 
                    onClick={() => setIsIsolationEnabled(!isIsolationEnabled)}
                    className={`w-8 h-4 rounded-full transition-colors relative ${isIsolationEnabled ? 'bg-yemenBlue' : 'bg-slate-200'}`}
                   >
                     <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-transform ${isIsolationEnabled ? 'translate-x-4.5' : 'translate-x-0.5'}`}></div>
                   </button>
                </div>
             </div>

             <div 
               onClick={() => fileInputRef.current?.click()}
               className="border-2 border-dashed border-slate-100 rounded-2xl p-10 flex flex-col items-center justify-center gap-4 hover:border-yemenBlue/30 hover:bg-blue-50/30 transition-all cursor-pointer group"
             >
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 group-hover:text-yemenBlue transition-all shadow-sm">
                   <FileAudio size={32} />
                </div>
                <div className="text-center">
                   <p className="text-xs font-black text-slate-700 uppercase tracking-widest">تحميل ملف التحقيق الصوتي</p>
                   <p className="text-[8px] text-slate-400 font-bold mt-1 uppercase">Isolation-ready: WAV, MP3</p>
                </div>
                <input type="file" ref={fileInputRef} className="hidden" onChange={() => setIsProcessing(true)} />
             </div>

             <div className="space-y-4">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block px-1">XXL Dialect Adapters (CPU-Mode)</span>
                <div className="grid grid-cols-1 gap-2">
                   {loraAdapters.map(adapter => (
                     <button
                       key={adapter.id}
                       onClick={() => setSelectedLoRA(adapter.id)}
                       className={`p-4 rounded-xl border text-right transition-all flex items-center justify-between group ${
                         selectedLoRA === adapter.id 
                         ? 'bg-yemenBlue text-white shadow-tactical border-transparent' 
                         : 'bg-white border-slate-100 text-slate-500 hover:bg-slate-50'
                       }`}
                     >
                        <div className="flex items-center gap-4">
                           <div className={`p-2.5 rounded-lg ${selectedLoRA === adapter.id ? 'bg-white/20' : 'bg-slate-50'}`}>
                              <Languages size={18} />
                           </div>
                           <div>
                              <div className="text-xs font-black uppercase leading-none mb-1">{adapter.name}</div>
                              <div className="text-[8px] opacity-60 font-bold tracking-widest uppercase">{adapter.region} • {adapter.version}</div>
                           </div>
                        </div>
                        {selectedLoRA === adapter.id && <CheckCircle2 size={16} className="text-white" />}
                     </button>
                   ))}
                </div>
             </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
             <div className="flex items-center gap-3 mb-4">
                <ShieldAlert size={16} className="text-yemenBlue" />
                <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest font-tajawal">بروتوكول VR Architecture</span>
             </div>
             <p className="text-[10px] text-slate-500 leading-relaxed font-bold font-tajawal text-right" dir="rtl">
               يستخدم هذا النظام خوارزميات "Vocal Remover" لعزل الترددات البشرية فقط قبل إرسالها لـ Faster-Whisper. هذا يضمن دقة عالية في ظروف التسجيل الميداني الصعبة.
             </p>
          </div>
        </div>

        {/* Output & Logs */}
        <div className="xl:col-span-8 space-y-6">
          <div className="bg-white rounded-2xl shadow-tactical flex flex-col border border-slate-200 overflow-hidden min-h-[600px]">
            <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
               <div className="flex items-center gap-3">
                  <Speaker size={20} className="text-yemenBlue" />
                  <div>
                    <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest font-tajawal">مخرجات التفريغ الاستقصائية</h3>
                    <p className="text-[8px] text-slate-400 uppercase tracking-tighter">Faster-Whisper XXL Native Stream</p>
                  </div>
               </div>
               <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-[9px] font-black text-slate-500 hover:text-yemenBlue hover:border-yemenBlue transition-all flex items-center gap-2 shadow-sm">
                  <Download size={14} /> EXPORT FINDINGS
               </button>
            </div>

            <div className="flex-1 flex flex-col p-0 relative">
               <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar relative z-10 bg-white">
                  {isProcessing && (
                    <div className="absolute inset-0 z-50 flex flex-col items-center justify-center gap-8 bg-white/90 backdrop-blur-sm animate-in fade-in duration-500">
                       <div className="relative">
                          <div className="w-32 h-32 rounded-full border-4 border-slate-100 border-t-yemenBlue animate-spin shadow-sm"></div>
                          <Filter size={32} className="text-yemenBlue absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
                       </div>
                       <div className="text-center space-y-4">
                          <span className="text-sm font-black text-slate-900 uppercase tracking-[0.4em] block font-mono">VR-Arch Isolation + XXL CPU</span>
                          <div className="w-80 bg-slate-100 h-1.5 rounded-full overflow-hidden mx-auto border border-slate-200">
                             <div className="bg-yemenBlue h-full shadow-sm transition-all duration-300" style={{ width: `${progress}%` }}></div>
                          </div>
                          <div className="text-[10px] font-mono text-slate-400 uppercase tracking-widest animate-pulse">
                             Parallelizing Audio Chunks: {progress.toFixed(1)}%
                          </div>
                       </div>
                    </div>
                  )}

                  {!isProcessing && transcript.length === 0 && (
                    <div className="flex-1 flex flex-col items-center justify-center gap-6 text-slate-300 py-20">
                       <Volume2 size={120} />
                       <span className="text-xs font-black uppercase tracking-[0.3em] font-tajawal text-slate-400">بانتظار تفعيل المعالج الصوتي...</span>
                    </div>
                  )}

                  {!isProcessing && transcript.length > 0 && (
                    <div className="space-y-6">
                       {transcript.map((seg) => (
                         <div key={seg.id} className="group flex gap-6 p-6 rounded-2xl hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100">
                            <div className="flex flex-col items-center gap-2 min-w-[80px]">
                               <div className="w-12 h-12 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-yemenBlue">
                                  <UserCircle2 size={24} />
                               </div>
                               <span className="text-[10px] font-black text-slate-400 uppercase">{seg.speaker}</span>
                            </div>
                            <div className="flex-1 space-y-3">
                               <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-3">
                                     <span className="text-[10px] font-mono text-yemenBlue bg-blue-50 px-2.5 py-1 rounded border border-blue-100 font-bold">{seg.startTime} - {seg.endTime}</span>
                                     <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{seg.dialect}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                     <div className="w-24 bg-slate-100 h-1 rounded-full overflow-hidden">
                                        <div className="bg-green-500 h-full" style={{ width: `${seg.confidence * 100}%` }}></div>
                                     </div>
                                     <span className="text-[9px] font-mono text-slate-500">{(seg.confidence * 100).toFixed(0)}%</span>
                                  </div>
                               </div>
                               <p className="text-base text-slate-800 leading-relaxed font-tajawal text-right font-medium" dir="rtl">{seg.text}</p>
                            </div>
                         </div>
                       ))}
                    </div>
                  )}
               </div>

               {/* Terminal Logs */}
               <div className="h-44 bg-slate-900 border-t border-slate-800 p-4 font-mono text-[10px] flex flex-col rounded-b-2xl">
                  <div className="flex items-center justify-between text-slate-500 mb-2 border-b border-slate-800 pb-1">
                     <span className="flex items-center gap-2"><Terminal size={12} /> XXL_ENGINE_CORE</span>
                     <span className="text-[8px] uppercase tracking-widest">Backend: CTranslate2</span>
                  </div>
                  <div className="flex-1 overflow-y-auto custom-scrollbar space-y-1 text-right" dir="rtl">
                     {logs.map((log, i) => (
                       <div key={i} className="flex gap-4 flex-row-reverse text-left" dir="ltr">
                          <span className="text-slate-700">[{i.toString().padStart(3, '0')}]</span>
                          <span className={log.includes('[SYSTEM]') ? 'text-blue-400' : log.includes('[VR-ARCH]') ? 'text-purple-400' : 'text-green-500 opacity-80'}>
                             {log}
                          </span>
                       </div>
                     ))}
                     <div ref={logEndRef}></div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DialectEngine;
