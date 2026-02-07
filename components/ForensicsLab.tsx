
import React, { useState, useRef, useEffect } from 'react';
import { 
  BookOpen, Search, Radio, MessageCircle, ShieldAlert, 
  CheckCircle2, Target, Eye, Filter, Zap,
  BarChart3, Brain, Globe, AlertTriangle, Scale,
  HelpCircle, UserCheck, Share2, PenTool, Layout, Users,
  Image as ImageIcon, Video, Link as LinkIcon, Upload, 
  RefreshCcw, FileSearch, Fingerprint, ShieldCheck, Play,
  ChevronRight, ArrowUpRight, Database, Info, Trash2,
  FileText, ClipboardCheck, Lock
} from 'lucide-react';

type LiteracyTab = 'analysis' | 'evaluation' | 'creation';
type InputType = 'text' | 'image' | 'video' | 'link';

const MediaLiteracyLab: React.FC = () => {
  const [activeTab, setActiveTab] = useState<LiteracyTab>('analysis');
  const [inputType, setInputType] = useState<InputType>('text');
  const [isScanning, setIsScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [selectedContent, setSelectedContent] = useState<string>('');
  const [analysisResults, setAnalysisResults] = useState<any>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLaunchAnalysis = () => {
    if (!selectedContent && inputType === 'text') return;
    setIsScanning(true);
    setProgress(0);
    setAnalysisResults(null);
    
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsScanning(false);
          setAnalysisResults({
            trustScore: 88,
            bias: inputType === 'link' ? 'Political/Regional' : 'Neutral',
            manipulation: inputType === 'image' ? 'Metadata Mismatch' : 'None',
            sourceId: 'Verified_Independent',
            detectedLaw: 'Press Law 1990 Compliance: 95%'
          });
          return 100;
        }
        return prev + 4;
      });
    }, 50);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-700 pb-20 font-tajawal text-text-primary">
      
      {/* Header: Unified Media Defense */}
      <div className="bg-panel p-6 rounded-3xl flex flex-col xl:flex-row items-center justify-between gap-6 border border-border-subtle border-r-8 border-r-brand-primary shadow-elevation relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>
        
        <div className="flex items-center gap-6 relative z-10">
          <div className="w-16 h-16 bg-brand-primary/10 rounded-2xl flex items-center justify-center text-brand-primary border border-brand-primary/20 shadow-inner">
            <BookOpen size={32} />
          </div>
          <div>
            <h2 className="text-3xl font-black text-text-primary leading-none uppercase tracking-tight">مختبر الدراية الإعلامية الاحترافي</h2>
            <div className="flex items-center gap-3 mt-3">
               <span className="text-[10px] text-brand-primary font-black uppercase tracking-[0.3em]">Advanced Multi-Modal Cognitive Defense</span>
               <div className="h-3 w-px bg-border-subtle"></div>
               <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse shadow-glow-green"></div>
                  <span className="text-[9px] font-black text-text-subtle uppercase tracking-widest px-1">Engine: {isScanning ? 'SCANNING...' : 'READY'}</span>
               </div>
            </div>
          </div>
        </div>
        
        <div className="flex bg-canvas border border-border-subtle p-1 rounded-2xl shadow-inner z-10">
            <TabTrigger id="analysis" label="التحليل (Analysis)" icon={<Search size={16}/>} active={activeTab} onClick={setActiveTab} />
            <TabTrigger id="evaluation" label="التقييم (Evaluation)" icon={<Scale size={16}/>} active={activeTab} onClick={setActiveTab} />
            <TabTrigger id="creation" label="الإنتاج (Creation)" icon={<PenTool size={16}/>} active={activeTab} onClick={setActiveTab} />
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        
        {/* Left Column: 5Q Protocol & Algorithmic Guard */}
        <div className="xl:col-span-4 space-y-6">
           <div className="bg-panel p-6 rounded-[2rem] border border-border-subtle shadow-elevation relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-5"><Target size={80}/></div>
              <h3 className="text-xs font-black text-text-primary uppercase tracking-[0.2em] mb-6 flex items-center gap-2 relative z-10">
                 <Target size={16} className="text-brand-primary" /> بروتوكول الاختبار الاستراتيجي (5Q)
              </h3>
              <div className="space-y-3 relative z-10">
                 <QuestionCard num={1} q="من هو المرسل؟" status={analysisResults ? "تم التحديد" : isScanning ? "جاري الفحص..." : "انتظار"} active={!!analysisResults} />
                 <QuestionCard num={2} q="ما هي التقنيات؟" status={analysisResults ? "تم الرصد" : isScanning ? "جاري الفحص..." : "انتظار"} active={!!analysisResults} />
                 <QuestionCard num={3} q="كيف سيُفهم؟" status={analysisResults ? "محاكاة الجمهور" : isScanning ? "جاري الفحص..." : "انتظار"} active={!!analysisResults} />
                 <QuestionCard num={4} q="ما هي القيم؟" status={analysisResults ? "تحليل الانحياز" : isScanning ? "جاري الفحص..." : "انتظار"} active={!!analysisResults} />
                 <QuestionCard num={5} q="ما هو الهدف؟" status={analysisResults ? "كشف النية" : isScanning ? "جاري الفحص..." : "انتظار"} active={!!analysisResults} />
              </div>
           </div>

           <div className="bg-slate-900 text-white p-6 rounded-[2rem] border border-slate-800 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-accent/10 rounded-full blur-2xl"></div>
              <h4 className="text-[10px] font-black text-brand-accent uppercase tracking-widest mb-4 flex items-center gap-2">
                 <Brain size={14}/> رادار الخوارزميات (Algo Insight)
              </h4>
              <p className="text-[11px] text-slate-400 font-bold leading-relaxed mb-6">
                كشف تأثير خوارزميات التوصية على تعرضك لهذا المحتوى.
              </p>
              <div className="space-y-3">
                 <AlgoMeter label="تعقب البيانات" val={isScanning ? progress : (analysisResults ? 92 : 0)} />
                 <AlgoMeter label="انحياز التوصية" val={analysisResults ? 55 : 0} />
                 <AlgoMeter label="فقاعة الفلترة" val={analysisResults ? 18 : 0} />
              </div>
           </div>
        </div>

        {/* Right Column: Multi-modal Active Space */}
        <div className="xl:col-span-8 space-y-6">
           <div className="bg-panel rounded-[2.5rem] border border-border-subtle shadow-elevation min-h-[650px] flex flex-col overflow-hidden relative">
              
              {/* Internal Workspace Toolbar */}
              <div className="p-5 border-b border-border-subtle bg-canvas/30 flex flex-col md:flex-row justify-between items-center gap-4 z-20 backdrop-blur-md">
                 <div className="flex bg-panel p-1 rounded-xl border border-border-subtle shadow-sm">
                    <InputTypeBtn id="text" icon={<Layout size={14}/>} active={inputType} onClick={setInputType} label="نص" />
                    <InputTypeBtn id="link" icon={<LinkIcon size={14}/>} active={inputType} onClick={setInputType} label="رابط" />
                    <InputTypeBtn id="image" icon={<ImageIcon size={14}/>} active={inputType} onClick={setInputType} label="صورة" />
                    <InputTypeBtn id="video" icon={<Video size={14}/>} active={inputType} onClick={setInputType} label="فيديو" />
                 </div>
                 
                 <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 bg-panel px-4 py-2 rounded-xl border border-border-subtle shadow-sm">
                       <ShieldCheck size={14} className="text-green-500"/>
                       <span className="text-[10px] font-black uppercase text-text-primary tracking-widest">Cognitive Armor v5.1</span>
                    </div>
                 </div>
              </div>

              {/* Dynamic Content Area */}
              <div className="flex-1 p-10 overflow-y-auto custom-scrollbar bg-canvas/10">
                 {activeTab === 'analysis' && (
                    <div className="space-y-8 animate-in slide-in-from-bottom-4">
                       
                       {/* Input Selection View */}
                       <div className="relative">
                          {inputType === 'text' && (
                             <textarea 
                                value={selectedContent}
                                onChange={(e) => setSelectedContent(e.target.value)}
                                placeholder="أدخل الخبر أو العنوان المراد تحليله..."
                                className="w-full h-44 bg-panel border-2 border-border-subtle rounded-3xl p-6 text-sm font-medium text-text-primary outline-none focus:border-brand-primary transition-all shadow-inner resize-none text-right"
                                dir="rtl"
                             />
                          )}

                          {inputType === 'link' && (
                             <div className="flex gap-4">
                                <input 
                                   type="url"
                                   placeholder="https://example.com/investigation-article..."
                                   className="flex-1 bg-panel border-2 border-border-subtle rounded-2xl p-4 text-sm font-mono text-brand-primary outline-none focus:border-brand-primary shadow-inner"
                                   dir="ltr"
                                />
                                <button onClick={handleLaunchAnalysis} className="bg-brand-primary text-white px-8 rounded-2xl font-black uppercase text-xs">تحليل</button>
                             </div>
                          )}

                          {(inputType === 'image' || inputType === 'video') && (
                             <div 
                                onClick={() => fileInputRef.current?.click()}
                                className="w-full h-44 border-2 border-dashed border-border-subtle rounded-3xl flex flex-col items-center justify-center gap-3 bg-panel/50 hover:bg-brand-primary/5 hover:border-brand-primary transition-all cursor-pointer group"
                             >
                                <div className="p-4 bg-canvas rounded-2xl text-text-subtle group-hover:text-brand-primary group-hover:scale-110 transition-all">
                                   {inputType === 'image' ? <ImageIcon size={32}/> : <Video size={32}/>}
                                </div>
                                <p className="text-[10px] font-black text-text-subtle uppercase tracking-widest">انقر لرفع ملف {inputType === 'image' ? 'الصورة' : 'الفيديو'}</p>
                                <input type="file" ref={fileInputRef} className="hidden" accept={inputType === 'image' ? 'image/*' : 'video/*'} onChange={handleLaunchAnalysis}/>
                             </div>
                          )}
                       </div>

                       {/* Action Launch */}
                       {inputType === 'text' && !isScanning && !analysisResults && (
                         <div className="flex justify-center">
                            <button 
                               onClick={handleLaunchAnalysis}
                               className="bg-brand-primary hover:bg-brand-primary-hover text-white px-12 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.3em] shadow-glow-blue transition-all active:scale-95 flex items-center gap-4"
                            >
                               <Zap size={18} className="text-brand-accent"/> تشغيل محرك التحليل الاحترافي
                            </button>
                         </div>
                       )}

                       {/* Progress Interaction */}
                       {isScanning && (
                         <div className="space-y-6 animate-in fade-in py-8">
                            <div className="flex justify-between items-end px-2">
                               <span className="text-[10px] font-black text-brand-primary uppercase tracking-[0.2em] animate-pulse">جاري تفكيك الرسالة الإعلامية...</span>
                               <span className="text-sm font-mono font-black text-brand-primary">{progress}%</span>
                            </div>
                            <div className="h-2.5 bg-canvas rounded-full border border-border-subtle overflow-hidden p-0.5 shadow-inner">
                               <div className="h-full bg-brand-primary transition-all duration-300 rounded-full shadow-glow-blue" style={{ width: `${progress}%` }}></div>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                               <EngineStatus label="Context-Map" active={progress > 15} />
                               <EngineStatus label="Intent-Neural" active={progress > 40} />
                               <EngineStatus label="Bias-Logic" active={progress > 75} />
                               <EngineStatus label="Final-Report" active={progress > 95} />
                            </div>
                         </div>
                       )}

                       {/* Post-Analysis Matrix */}
                       {analysisResults && !isScanning && (
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in slide-in-from-top-4">
                            <AnalysisCard icon={<UserCheck size={18}/>} title="هوية المرسل" desc="المصدر مصنف كوكالة أنباء مستقلة مرخصة. لا توجد ارتباطات تمويل مشبوهة." status="Verified" />
                            <AnalysisCard icon={<Zap size={18}/>} title="التلاعب التقني" desc={inputType === 'image' ? 'تحذير: تم رصد تلاعب في طبقة الـ EXIF للصورة.' : 'لم يتم رصد استخدام تقنيات التزييف العميق.'} status={inputType === 'image' ? 'Warning' : 'Clean'} color={inputType === 'image' ? 'text-amber-500' : 'text-green-500'} />
                            <AnalysisCard icon={<Target size={18}/>} title="تحليل الجمهور" desc="المحتوى يستهدف إثارة المشاعر الوطنية لغرض التحشيد الاجتماعي." status="Sentiment Alert" color="text-brand-accent" />
                            <AnalysisCard icon={<Lock size={18}/>} title="الامتثال المهني" desc={analysisResults.detectedLaw} status="Validated" />
                         </div>
                       )}
                    </div>
                 )}

                 {activeTab === 'evaluation' && (
                    <div className="h-full flex flex-col items-center justify-center space-y-10 animate-in zoom-in-95">
                       <div className="w-24 h-24 bg-brand-primary/5 rounded-3xl flex items-center justify-center text-brand-primary border border-brand-primary/20 shadow-inner">
                          <Scale size={48} className={isScanning ? 'animate-bounce' : ''} />
                       </div>
                       <div className="text-center max-w-xl">
                          <h3 className="text-2xl font-black mb-4">تقييم الحقائق والمصداقية</h3>
                          <p className="text-sm text-text-subtle font-bold leading-relaxed">
                             يتم الآن مطابقة الادعاءات الواردة مع قواعد بيانات "عين الصقر" و "GDELT" لتحديد نسبة دقة المعلومات.
                          </p>
                       </div>
                       <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl">
                          <EvalStat label="مؤشر الثقة" val={analysisResults ? "82%" : "--"} />
                          <EvalStat label="الحياد السياسي" val={analysisResults ? "45%" : "--"} color="text-red-500" />
                          <EvalStat label="دقة المصادر" val={analysisResults ? "91%" : "--"} />
                       </div>
                       <button onClick={() => setActiveTab('creation')} className="text-xs font-black text-brand-primary flex items-center gap-2 hover:underline">
                          انتقل لصياغة تقريرك المستنير <ChevronRight size={14}/>
                       </button>
                    </div>
                 )}

                 {activeTab === 'creation' && (
                    <div className="h-full flex flex-col gap-6 animate-in fade-in">
                       <div className="bg-brand-primary/5 border border-brand-primary/20 p-8 rounded-[2.5rem] flex items-center gap-8 shadow-sm">
                          <div className="p-4 bg-brand-primary text-white rounded-2xl shadow-glow-blue"><PenTool size={32}/></div>
                          <div>
                             <h4 className="text-lg font-black text-brand-primary uppercase">الإنتاج الإعلامي الموثق</h4>
                             <p className="text-xs text-text-secondary font-bold mt-2 leading-relaxed">
                                استناداً لنتائج التحليل، قمنا بتوليد مسودة تقرير تلتزم بـ "عقيدة ريدان" المهنية. يمكنك التعديل والنشر.
                             </p>
                          </div>
                       </div>
                       
                       <div className="flex-1 bg-panel border-2 border-border-subtle rounded-3xl p-8 shadow-inner overflow-y-auto custom-scrollbar">
                          {analysisResults ? (
                            <div className="space-y-6 text-right" dir="rtl">
                               <h5 className="text-lg font-black text-text-primary border-b border-border-subtle pb-4">مسودة تقرير: [تحليل الحقائق حول {inputType}]</h5>
                               <p className="text-sm leading-loose text-text-secondary font-medium">
                                  بناءً على فحص مختبر الدراية الإعلامية، تبين أن المحتوى المنشور عبر [المصدر] يحتوي على [تحليل النية]. 
                                  وعند تطبيق بروتوكول الأسئلة الخمسة، تم رصد استخدام تقنيات [التقنية المكتشفة] لجذب الانتباه.
                               </p>
                               <div className="p-4 bg-canvas rounded-xl border border-dashed border-brand-primary/40">
                                  <span className="text-[10px] font-black text-brand-primary uppercase">تنبيه مهني:</span>
                                  <p className="text-[11px] text-text-subtle font-bold mt-1">يُنصح بتضمين المصدر الرسمي لبيانات الأقمار الصناعية لتعزيز الثقة في التقرير النهائي.</p>
                                </div>
                            </div>
                          ) : (
                            <div className="h-full flex flex-col items-center justify-center gap-4 opacity-30">
                               <FileText size={48} />
                               <p className="text-xs font-black uppercase tracking-widest">انتظار انتهاء التحليل لتوليد المسودة...</p>
                            </div>
                          )}
                       </div>

                       <div className="flex justify-end gap-4">
                          <button className="px-6 py-3 rounded-xl border border-border-subtle text-xs font-black uppercase tracking-widest hover:bg-canvas transition-colors">حفظ المسودة</button>
                          <button className="px-8 py-3 rounded-xl bg-brand-accent text-slate-900 text-xs font-black uppercase tracking-widest shadow-md hover:scale-105 transition-transform flex items-center gap-2">
                             <Share2 size={16}/> إرسال لغرفة الأخبار
                          </button>
                       </div>
                    </div>
                 )}
              </div>

              {/* Status Footer */}
              <div className="p-5 bg-slate-950 border-t border-slate-900 flex justify-between items-center relative overflow-hidden">
                 <div className="absolute inset-0 bg-gradient-to-r from-brand-primary/5 via-transparent to-transparent"></div>
                 <div className="flex items-center gap-4 relative z-10">
                    <div className="w-2 h-2 bg-green-500 rounded-full shadow-glow-green"></div>
                    <span className="text-[9px] font-mono text-green-400 uppercase tracking-widest">
                       LITERACY_HUB: ONLINE // MODAL_DRIVE: {inputType.toUpperCase()} // ANALYSIS: {analysisResults ? 'COMPLETED' : isScanning ? 'IN_PROGRESS' : 'IDLE'}
                    </span>
                 </div>
                 <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest relative z-10">Protcol: RAIDAN_CENTRAL_v5.1</div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

// --- SUB-COMPONENTS ---

const TabTrigger: React.FC<{id: LiteracyTab, label: string, icon: React.ReactNode, active: LiteracyTab, onClick: (id: LiteracyTab) => void}> = ({id, label, icon, active, onClick}) => (
    <button 
      onClick={() => onClick(id)}
      className={`px-6 py-3 rounded-xl text-[11px] font-black uppercase transition-all flex items-center gap-3 ${
        active === id ? 'bg-panel text-brand-primary shadow-tactical border border-border-subtle ring-4 ring-brand-primary/5' : 'text-text-subtle hover:text-text-primary'
      }`}
    >
      <div className={active === id ? 'text-brand-primary' : 'text-text-subtle'}>{icon}</div>
      {label}
    </button>
);

const InputTypeBtn: React.FC<{id: InputType, icon: React.ReactNode, active: InputType, onClick: (id: InputType) => void, label: string}> = ({id, icon, active, onClick, label}) => (
    <button 
      onClick={() => onClick(id)}
      className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase flex items-center gap-2 transition-all ${
        active === id ? 'bg-brand-primary text-white shadow-md' : 'text-text-subtle hover:text-text-primary'
      }`}
    >
       {icon} <span>{label}</span>
    </button>
);

const QuestionCard: React.FC<{num: number, q: string, status: string, active: boolean}> = ({num, q, status, active}) => (
    <div className={`p-4 rounded-2xl border transition-all flex items-center justify-between ${active ? 'bg-brand-primary/5 border-brand-primary/30' : 'bg-canvas border-border-subtle'}`}>
       <div className="flex items-center gap-3">
          <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-black ${active ? 'bg-brand-primary text-white shadow-sm' : 'bg-panel text-text-subtle'}`}>{num}</span>
          <h4 className="text-xs font-black text-text-primary">{q}</h4>
       </div>
       <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full ${active ? 'bg-green-500/20 text-green-500' : 'bg-panel text-text-subtle border border-border-subtle'}`}>{status}</span>
    </div>
);

const AnalysisCard: React.FC<{icon: React.ReactNode, title: string, desc: string, status: string, color?: string}> = ({icon, title, desc, status, color = "text-green-500"}) => (
    <div className="bg-panel p-6 rounded-3xl border border-border-subtle group hover:border-brand-primary/30 transition-all shadow-sm">
       <div className="flex items-center gap-4 mb-4">
          <div className="p-3 bg-canvas rounded-2xl text-brand-primary shadow-inner">{icon}</div>
          <div>
             <h4 className="text-xs font-black text-text-primary uppercase tracking-wider">{title}</h4>
             <span className={`text-[8px] font-black uppercase ${color}`}>{status}</span>
          </div>
       </div>
       <p className="text-[10px] text-text-subtle font-bold leading-relaxed">{desc}</p>
    </div>
);

const EngineStatus: React.FC<{label: string, active: boolean}> = ({label, active}) => (
    <div className={`px-3 py-1.5 rounded-lg border text-[8px] font-mono font-bold uppercase transition-all ${active ? 'bg-green-500/10 border-green-500/30 text-green-500' : 'bg-canvas border-border-subtle text-text-subtle opacity-50'}`}>
       {active ? 'OK' : '...'}: {label}
    </div>
);

const AlgoMeter: React.FC<{label: string, val: number}> = ({label, val}) => (
    <div className="space-y-1.5">
       <div className="flex justify-between text-[9px] font-black uppercase tracking-widest text-slate-400">
          <span>{label}</span>
          <span>{val}%</span>
       </div>
       <div className="h-1 bg-slate-800 rounded-full overflow-hidden border border-slate-700/50">
          <div className="h-full bg-brand-accent transition-all duration-1000 shadow-[0_0_8px_var(--brand-accent-glow)]" style={{ width: `${val}%` }}></div>
       </div>
    </div>
);

const EvalStat: React.FC<{label: string, val: string, color?: string}> = ({label, val, color = "text-brand-primary"}) => (
    <div className="bg-canvas border border-border-subtle p-5 rounded-2xl text-center shadow-inner">
       <span className="text-[9px] font-black text-text-subtle uppercase tracking-widest mb-1 block">{label}</span>
       <span className={`text-2xl font-black font-mono ${color}`}>{val}</span>
    </div>
);

export default MediaLiteracyLab;
