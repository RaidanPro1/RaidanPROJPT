
import React, { useState, useMemo, useEffect } from 'react';
import { 
  Radar, TrendingUp, TrendingDown, Minus, 
  ShoppingCart, DollarSign, Swords, Gavel, 
  Zap, HeartPulse, CloudRain, Ship, 
  Cpu, GraduationCap, Heart, Laugh, 
  Ghost, Share2, MapPin, Activity,
  Search, Download, Maximize2, RefreshCcw,
  Brain, Sparkles, X, ChevronRight,
  Database, ShieldCheck, ShieldAlert,
  Loader2, Wand2, Info, ArrowUpRight,
  AlertCircle, Network, Flame, Droplets, 
  Wifi, BarChart3, Clock, Eye, Target,
  FileSearch, Scale, Globe, Satellite
} from 'lucide-react';
import { GoogleGenAI } from '@google/genai';
import { useSettings } from '../context/SettingsContext';

// --- TYPES ---

type ClusterType = 
  | 'ECONOMY' | 'EXCHANGE' | 'MILITARY' | 'TRIBAL' 
  | 'INFRA' | 'HEALTH' | 'CLIMATE' | 'MOBILITY' | 'DEVELOPMENT' 
  | 'SOCIAL' | 'HUMANITARIAN' | 'PSYCHOLOGY' | 'NARRATIVES' 
  | 'NETWORKS' | 'LOCAL' | 'TRENDS';

type AggregatorType = 'SPACE' | 'FINANCE' | 'FORENSIC_MEDIA' | 'SOVEREIGN_CORE';

interface Indicator {
  id: string;
  cluster: ClusterType;
  name: string;
  value: string | number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  status: 'stable' | 'warning' | 'critical';
  shortDesc: string; 
  gatheringLogic: string; 
  aggregator: AggregatorType;
  history: number[];
}

interface ClusterMeta {
  id: ClusterType;
  label: string;
  icon: React.ReactNode;
  color: string;
  desc: string;
}

const PredictiveHub: React.FC = () => {
  const { settings } = useSettings();
  const [selectedInd, setSelectedInd] = useState<Indicator | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiReport, setAiReport] = useState<string | null>(null);

  // Live Telemetry for the 16 Doors
  const [telemetry, setTelemetry] = useState({
    forex_sanaa: 535,
    forex_aden: 1148,
    bread: 550,
    anger: 86,
    bots: 4200
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setTelemetry(prev => ({
        ...prev,
        forex_sanaa: prev.forex_sanaa + (Math.random() > 0.5 ? 1 : -1),
        forex_aden: prev.forex_aden + (Math.random() * 4 - 2),
        bread: prev.bread + (Math.random() > 0.98 ? 5 : 0),
        anger: Math.max(60, Math.min(98, prev.anger + (Math.random() * 2 - 1))),
        bots: prev.bots + Math.floor(Math.random() * 100 - 50)
      }));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const CLUSTERS: ClusterMeta[] = [
    { id: 'ECONOMY', label: '1. الاقتصاد وتكلفة المعيشة', icon: <ShoppingCart size={20}/>, color: 'text-blue-500', desc: 'GDP، سعر الخبز (500جم)، لتر الحليب، الإيجارات، وتكلفة الإنترنت.' },
    { id: 'EXCHANGE', label: '2. سوق الصرف والسيولة', icon: <DollarSign size={20}/>, color: 'text-brand-accent', desc: 'أسعار الصرف SNA/ADE، الفجوة السعرية، عمولات التحويل والسيولة.' },
    { id: 'MILITARY', label: '3. الأمن والديناميكيات العسكرية', icon: <Swords size={20}/>, color: 'text-red-500', desc: 'خريطة الجبهات، المسيرات، الاغتيالات، ونزاعات الأراضي.' },
    { id: 'TRIBAL', label: '4. السياسة والقبيلة', icon: <Gavel size={20}/>, color: 'text-amber-700', desc: 'النكف القبلي، الثأر، والتحليل اللغوي للخطاب السياسي.' },
    { id: 'INFRA', label: '5. البنية التحتية والخدمات', icon: <Zap size={20}/>, color: 'text-yellow-500', desc: 'ساعات الكهرباء، سعر وايت الماء، وسرعة إنترنت يمن نت/عدن نت.' },
    { id: 'HEALTH', label: '6. الصحة والوبائيات', icon: <HeartPulse size={20}/>, color: 'text-rose-500', desc: 'كوليرا، ضنك، وفيات الأمهات، وتوفر أدوية السرطان.' },
    { id: 'CLIMATE', label: '7. الطقس والبيئة', icon: <CloudRain size={20}/>, color: 'text-sky-500', desc: 'AQI، رطوبة التربة NDVI، الإشعاع الشمسي وتوقعات السيول.' },
    { id: 'MOBILITY', label: '8. الطيران والملاحة', icon: <Ship size={20}/>, color: 'text-indigo-500', desc: 'حركة السفن، زمن الانتظار في الغاطس، والطائرات المحلقة.' },
    { id: 'DEVELOPMENT', label: '9. التنمية والتقنية', icon: <Cpu size={20}/>, color: 'text-emerald-500', desc: 'تغطية 4G، اشتراكات النطاق العريض، والإنفاق على البحث.' },
    { id: 'SOCIAL', label: '10. الاجتماع والتعليم', icon: <GraduationCap size={20}/>, color: 'text-violet-500', desc: 'الأمية، البطالة، ومؤشر جيني للعدالة الاجتماعية.' },
    { id: 'HUMANITARIAN', label: '11. العمل الإنساني', icon: <Heart size={20}/>, color: 'text-pink-500', desc: 'نازحين، تمويل خطة الاستجابة، وتصنيفات IPC الغذائية.' },
    { id: 'PSYCHOLOGY', label: '12. المشاعر والتوجهات النفسية', icon: <Laugh size={20}/>, color: 'text-orange-500', desc: 'مؤشر الغضب، الخوف، والسخرية السياسية (الكهرباء ما تطفاش).' },
    { id: 'NARRATIVES', label: '13. السرديات وكشف التلاعب', icon: <Ghost size={20}/>, color: 'text-purple-500', desc: 'نشاط الـ Bots، السلوك المنسق CIB، ومؤشر الذباب الإلكتروني.' },
    { id: 'NETWORKS', label: '14. الكيانات والشبكات', icon: <Share2 size={20}/>, color: 'text-cyan-500', desc: 'حصة الصوت SOV، ارتباطات التجار والسياسيين، وغرف الصدى.' },
    { id: 'LOCAL', label: '15. السياق المحلي (Hyper-Local)', icon: <MapPin size={20}/>, color: 'text-brand-primary', desc: 'توزيع اللهجات، ومؤشر الطيرمانة لتحليل نقاشات المقيل.' },
    { id: 'TRENDS', label: '16. الاتجاهات والمواضيع', icon: <TrendingUp size={20}/>, color: 'text-green-500', desc: 'سحابة الكلمات، حياة الترند، وتوقع الأزمات قبل 24 ساعة.' },
  ];

  // --- THE 250+ INDICATORS MATRIX ---
  const matrix: Indicator[] = useMemo(() => {
    const list: Indicator[] = [
      // 1. Economy
      { id: 'eco-bread', cluster: 'ECONOMY', name: 'رغيف الخبز (500جم)', value: telemetry.bread, unit: 'YER', trend: 'up', status: 'critical', aggregator: 'SOVEREIGN_CORE', shortDesc: 'سعر الوحدة في المخابز الشعبية.', gatheringLogic: 'سحب آلي لتقارير WFP ومطابقتها مع بلاغات Street_Pulse الميدانية.', history: [450, 480, 500, 520, telemetry.bread] },
      { id: 'eco-internet', cluster: 'ECONOMY', name: 'تكلفة 1GB إنترنت', value: '1,200', unit: 'YER', trend: 'stable', status: 'stable', aggregator: 'SOVEREIGN_CORE', shortDesc: 'متوسط تكلفة البيانات المتنقلة.', gatheringLogic: 'تحليل باقات المزودين الرسميين وسعر السوق السوداء لكروت الشحن.', history: [1200, 1200, 1200, 1200, 1200] },
      
      // 2. Exchange
      { id: 'exc-gap', cluster: 'EXCHANGE', name: 'الفجوة السعرية SNA/ADE', value: telemetry.forex_aden - telemetry.forex_sanaa, unit: 'YER', trend: 'up', status: 'critical', aggregator: 'FINANCE', shortDesc: 'فارق صرف الدولار بين صنعاء وعدن.', gatheringLogic: 'المجمع المالي: سحب لحظي من 5 قنوات تليجرام و Binance P2P باستخدام Regex لفلترة الأسعار الحقيقية.', history: [400, 450, 500, 550, telemetry.forex_aden - telemetry.forex_sanaa] },
      
      // 3. Military
      { id: 'mil-drone', cluster: 'MILITARY', name: 'هجمات المسيرات المرصودة', value: 4, unit: 'Event/24h', trend: 'up', status: 'warning', aggregator: 'SPACE', shortDesc: 'نشاط جوي مرصود في مناطق النزاع.', gatheringLogic: 'المجمع الفضائي: تحليل صور Sentinel-2 لرصد البصمات الحرارية وبلاغات OSINT الموثقة.', history: [1, 2, 0, 3, 4] },

      // 7. Climate
      { id: 'cli-ndvi', cluster: 'CLIMATE', name: 'صحة المحاصيل (NDVI)', value: '0.42', unit: 'Index', trend: 'down', status: 'warning', aggregator: 'SPACE', shortDesc: 'مؤشر الغطاء النباتي في قاع جهر.', gatheringLogic: 'المجمع الفضائي: معالجة صور NASA VIIRS لرصد رطوبة التربة وكثافة الكلوروفيل.', history: [0.6, 0.55, 0.5, 0.45, 0.42] },

      // 12. Psych
      { id: 'psy-anger', cluster: 'PSYCHOLOGY', name: 'مؤشر الغضب العام', value: telemetry.anger, unit: '%', trend: 'up', status: 'critical', aggregator: 'FORENSIC_MEDIA', shortDesc: 'مستوى الاحتقان الشعبي الرقمي.', gatheringLogic: 'تحليل دلالي (NLP) للهاشتاجات المتعلقة بالرواتب والخدمات عبر منصة X.', history: [65, 72, 80, 84, telemetry.anger] },

      // 13. Narratives
      { id: 'nar-bots', cluster: 'NARRATIVES', name: 'نشاط الذباب الإلكتروني', value: telemetry.bots, unit: 'Bot/h', trend: 'up', status: 'warning', aggregator: 'FORENSIC_MEDIA', shortDesc: 'كثافة الحسابات الآلية الموجهة.', gatheringLogic: 'المجمع الجنائي: فحص السلوك المنسق CIB وتتبع بصمات البروباغندا الرقمية.', history: [1200, 2400, 3200, 3800, telemetry.bots] },
    ];

    // Systematic populate to simulate 250+
    CLUSTERS.forEach(cluster => {
      const existing = list.filter(i => i.cluster === cluster.id).length;
      for (let i = existing + 1; i <= 15; i++) {
        list.push({
          id: `${cluster.id.toLowerCase()}-${i}`,
          cluster: cluster.id,
          name: `مؤشر ${cluster.label.split(' ')[1]} #${i}`,
          value: Math.floor(Math.random() * 500) + 50,
          unit: 'Metric',
          trend: Math.random() > 0.5 ? 'up' : 'down',
          status: Math.random() > 0.8 ? 'critical' : Math.random() > 0.6 ? 'warning' : 'stable',
          aggregator: i % 3 === 0 ? 'SPACE' : i % 3 === 1 ? 'FINANCE' : 'FORENSIC_MEDIA',
          shortDesc: `بيان استقصائي دوري مرصود ضمن الباب الاستراتيجي رقم ${cluster.id}.`,
          gatheringLogic: 'يتم التجميع عبر بروتوكول المجمع الذكي المعتمد في النواة.',
          history: Array.from({length: 5}, () => Math.floor(Math.random() * 100))
        });
      }
    });

    return list;
  }, [telemetry]);

  const generateStrategicReport = async () => {
    setIsGenerating(true);
    setAiReport(null);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const criticals = matrix.filter(i => i.status === 'critical').slice(0, 12);
      const prompt = `
        بصفتك "المحلل الاستراتيجي لليمنJPT"، قم بتحليل التقاطعات بين هذه المؤشرات الـ 16:
        ${criticals.map(i => `- ${i.name}: ${i.value} (${i.aggregator})`).join('\n')}
        
        المطلوب:
        1. ربط أثر الفجوة السعرية (المجمع المالي) على مؤشر الغضب (المجمع الجنائي).
        2. تحليل تأثير صحة المحاصيل (المجمع الفضائي) على الأمن الغذائي القادم.
        3. توقع وقوع أزمة في الـ 24 ساعة القادمة.
        اللغة: عربية رصينة واستخباراتية.
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: { systemInstruction: settings.googleConfig.systemInstruction, temperature: 0.1 }
      });
      setAiReport(response.text || "فشل توليد التحليل.");
    } catch (e) {
      setAiReport("خطأ في الاتصال بالنواة. تحقق من بروتوكول API.");
    } finally {
      setIsGenerating(false);
    }
  };

  const filteredIndicators = (cid: ClusterType) => matrix.filter(ind => 
    ind.cluster === cid && 
    (ind.name.includes(searchTerm) || ind.shortDesc.includes(searchTerm))
  );

  return (
    <div className="min-h-screen bg-canvas font-tajawal animate-in fade-in duration-700 pb-40 text-text-primary">
      
      {/* Sovereign Matrix Header */}
      <header className="bg-panel/80 backdrop-blur-md sticky top-0 z-40 border-b border-border-subtle shadow-elevation">
        <div className="max-w-[1800px] mx-auto p-6 flex flex-col xl:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-5 text-right">
             <div className="w-14 h-14 bg-brand-primary rounded-2xl flex items-center justify-center text-white shadow-glow-blue border border-white/10 relative group overflow-hidden">
                <Radar size={32} className="group-hover:scale-110 transition-transform"/>
                <div className="absolute inset-0 bg-white/20 animate-pulse opacity-0 group-hover:opacity-100"></div>
             </div>
             <div>
                <h1 className="text-2xl font-black text-text-primary leading-none uppercase tracking-tighter">بوابة المؤشرات السيادية (YemenJPT)</h1>
                <p className="text-[10px] text-brand-primary font-black uppercase tracking-[0.4em] mt-2 flex items-center gap-2">
                   <ShieldCheck size={12} /> Strategic Matrix v6.5 • 16 Active Doors
                </p>
             </div>
          </div>

          {/* Master Search */}
          <div className="flex flex-1 max-w-xl relative group">
             <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-text-subtle group-focus-within:text-brand-primary transition-colors" size={18} />
             <input 
               type="text" 
               placeholder="ابحث في الـ 250 مؤشر (خبز، صرف، NDVI، ذباب...)"
               className="w-full bg-canvas border border-border-subtle rounded-2xl pr-12 pl-4 py-4 text-sm text-text-primary outline-none focus:ring-4 ring-brand-primary/5 transition-all shadow-inner"
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
             />
          </div>

          <div className="flex items-center gap-4">
             <button 
               onClick={generateStrategicReport}
               disabled={isGenerating}
               className="bg-slate-900 hover:bg-slate-800 text-brand-accent px-8 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center gap-3 border border-brand-accent/20 shadow-glow-accent group disabled:opacity-50 active:scale-95"
             >
                {isGenerating ? <Loader2 size={18} className="animate-spin" /> : <Brain size={18} className="group-hover:rotate-12 transition-transform" />}
                تحليل التقاطعات (Gemini)
             </button>
          </div>
        </div>

        {/* 16 Doors Pillars Navigation */}
        <div className="max-w-[1800px] mx-auto px-6 pb-4 flex gap-2 overflow-x-auto no-scrollbar scroll-smooth">
           {CLUSTERS.map(c => (
              <a 
                key={c.id} 
                href={`#cluster-${c.id}`}
                className="px-4 py-2.5 bg-canvas border border-border-subtle rounded-xl text-[10px] font-black uppercase text-text-subtle hover:text-brand-primary hover:border-brand-primary transition-all whitespace-nowrap flex items-center gap-2 group shadow-sm active:scale-95"
              >
                <span className="opacity-70 group-hover:scale-110 transition-transform">{c.icon}</span>
                {c.label}
              </a>
           ))}
        </div>
      </header>

      <main className="max-w-[1800px] mx-auto p-8 space-y-24">
        
        {/* Aggregator Hub Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <AggregatorCard 
             type="SPACE" 
             icon={<Satellite size={24}/>} 
             title="المجمع الفضائي" 
             desc="رصد NASA/Sentinel-2" 
             activeNode="VIIRS-NDVI"
           />
           <AggregatorCard 
             type="FINANCE" 
             icon={<Network size={24}/>} 
             title="المجمع المالي" 
             desc="Binance P2P + Telegram Regex" 
             activeNode="YER-INDEX"
           />
           <AggregatorCard 
             type="FORENSIC_MEDIA" 
             icon={<FileSearch size={24}/>} 
             title="المجمع الجنائي للإعلام" 
             desc="Deepfake Check & CIB detection" 
             activeNode="NLP-ARABERT"
           />
        </div>

        {/* AI Report Overlay */}
        {aiReport && (
            <div className="bg-slate-900 border border-brand-accent/30 rounded-[3rem] p-10 shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-500">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-brand-accent via-brand-primary to-brand-accent"></div>
                <div className="flex justify-between items-start mb-8">
                   <div className="flex items-center gap-5 flex-row-reverse">
                      <div className="p-4 bg-brand-accent/20 text-brand-accent rounded-3xl border border-brand-accent/20 shadow-glow-accent"><Sparkles size={32}/></div>
                      <div className="text-right">
                         <h2 className="text-2xl font-black text-white uppercase tracking-tight">تقرير الاستبصار المتقاطع (YemenJPT AI)</h2>
                         <p className="text-[10px] text-brand-accent font-bold uppercase mt-2 tracking-widest">Cross-Aggregator Neural Synthesis</p>
                      </div>
                   </div>
                   <button onClick={() => setAiReport(null)} className="p-3 bg-white/5 text-white/40 hover:text-red-500 transition-colors rounded-xl"><X size={24}/></button>
                </div>
                <div className="bg-slate-950/50 p-8 rounded-[2rem] border border-white/5 text-right font-tajawal leading-loose text-lg text-slate-300 shadow-inner">
                   <p className="whitespace-pre-wrap">{aiReport}</p>
                </div>
                <div className="mt-8 flex justify-end gap-4">
                   <button className="px-10 py-3 bg-brand-accent text-slate-950 rounded-xl text-[11px] font-black uppercase shadow-lg hover:scale-105 transition-all flex items-center gap-3">
                      <Share2 size={16}/> إرسال لغرفة الأخبار
                   </button>
                </div>
            </div>
        )}

        {/* The 16 Doors Grid */}
        {CLUSTERS.map(cluster => {
            const clusterIndicators = filteredIndicators(cluster.id);
            if (searchTerm && clusterIndicators.length === 0) return null;

            return (
                <section key={cluster.id} id={`cluster-${cluster.id}`} className="space-y-10 animate-in slide-in-from-bottom-8 duration-700">
                    <div className="flex items-center justify-between border-b-2 border-border-subtle pb-8 flex-row-reverse">
                        <div className="flex items-center gap-8 flex-row-reverse">
                            <div className={`p-5 rounded-2xl bg-panel border border-border-subtle shadow-elevation ${cluster.color}`}>
                                {cluster.icon}
                            </div>
                            <div className="text-right">
                                <h2 className="text-3xl font-black text-text-primary uppercase tracking-tighter">{cluster.label}</h2>
                                <div className="flex items-center gap-5 mt-3 flex-row-reverse">
                                    <span className="text-xs text-text-subtle font-black uppercase tracking-widest bg-canvas px-4 py-1.5 rounded-full border border-border-subtle">{cluster.desc}</span>
                                    <div className="h-1.5 w-1.5 bg-border-subtle rounded-full"></div>
                                    <span className="text-xs font-black text-brand-primary uppercase">{clusterIndicators.length} مؤشر نشط</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                           <button className="p-3 text-text-subtle hover:text-brand-primary transition-all bg-panel border border-border-subtle rounded-xl shadow-sm hover:scale-110 active:scale-95"><RefreshCcw size={16}/></button>
                           <button className="p-3 text-text-subtle hover:text-brand-primary transition-all bg-panel border border-border-subtle rounded-xl shadow-sm hover:scale-110 active:scale-95"><Maximize2 size={16}/></button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-8">
                        {clusterIndicators.map(ind => (
                            <IndicatorCard 
                                key={ind.id} 
                                indicator={ind} 
                                onClick={() => setSelectedInd(ind)}
                            />
                        ))}
                    </div>
                </section>
            );
        })}
      </main>

      {/* Detail Slide-over Panel */}
      {selectedInd && (
        <DetailedPanel 
           indicator={selectedInd} 
           onClose={() => setSelectedInd(null)} 
        />
      )}
    </div>
  );
};

// --- SUB-COMPONENTS ---

const AggregatorCard: React.FC<{type: AggregatorType, icon: React.ReactNode, title: string, desc: string, activeNode: string}> = ({type, icon, title, desc, activeNode}) => {
    const colors = {
        SPACE: 'text-sky-500 bg-sky-500/10 border-sky-500/20',
        FINANCE: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
        FORENSIC_MEDIA: 'text-purple-500 bg-purple-500/10 border-purple-500/20',
        SOVEREIGN_CORE: 'text-brand-primary bg-brand-primary/10 border-brand-primary/20'
    };

    return (
        <div className={`p-6 rounded-3xl border-2 transition-all hover:shadow-lg ${colors[type]}`}>
            <div className="flex items-center gap-4 mb-3">
                <div className="p-3 bg-panel rounded-2xl shadow-sm">{icon}</div>
                <div>
                    <h4 className="text-sm font-black uppercase text-text-primary leading-tight">{title}</h4>
                    <p className="text-[10px] font-bold text-text-subtle mt-1">{desc}</p>
                </div>
            </div>
            <div className="flex items-center justify-between mt-4 bg-panel/50 px-3 py-1.5 rounded-xl border border-white/10">
                <span className="text-[9px] font-black uppercase opacity-60">Active Cluster</span>
                <span className="text-[9px] font-mono font-black">{activeNode}</span>
            </div>
        </div>
    );
};

const IndicatorCard: React.FC<{indicator: Indicator, onClick: () => void}> = ({indicator, onClick}) => {
  const isCritical = indicator.status === 'critical';
  const isWarning = indicator.status === 'warning';

  return (
    <div 
      onClick={onClick}
      className={`bg-panel p-8 rounded-[2.5rem] border-2 transition-all duration-500 group cursor-pointer shadow-sm relative overflow-hidden flex flex-col justify-between h-96 text-right ${
        isCritical ? 'border-red-500/30 hover:border-red-500/60 hover:shadow-red-500/10' : 'border-border-subtle hover:border-brand-primary/40 hover:shadow-glow-blue'
      }`}
    >
      <div className="relative z-10 flex justify-between items-start mb-6 flex-row-reverse">
        <div className="text-right overflow-hidden flex-1">
          <h3 className="text-lg font-black text-text-primary leading-tight mb-2 truncate group-hover:text-brand-primary transition-colors">{indicator.name}</h3>
          <div className="flex items-center gap-2 flex-row-reverse">
             <div className={`w-2 h-2 rounded-full ${isCritical ? 'bg-red-500 animate-pulse' : 'bg-brand-primary'}`}></div>
             <span className="text-[9px] font-mono font-black uppercase tracking-widest text-text-subtle">{indicator.aggregator}</span>
          </div>
        </div>
        <div className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase border shadow-sm transition-all group-hover:scale-105 ${
           isCritical ? 'bg-red-500/10 text-red-500 border-red-500/20' : 
           isWarning ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' : 
           'bg-green-500/10 text-green-500 border-green-500/20'
        }`}>
          {indicator.status}
        </div>
      </div>

      <p className="relative z-10 text-[13px] text-text-subtle font-bold leading-relaxed mb-8 line-clamp-3 group-hover:text-text-secondary transition-colors" dir="rtl">
         {indicator.shortDesc}
      </p>

      <div className="relative z-10 flex flex-col items-end mt-auto">
        <div className="flex items-baseline gap-2 mb-6 flex-row-reverse">
           <span className={`text-6xl font-black font-mono tracking-tighter transition-all group-hover:scale-110 origin-right ${isCritical ? 'text-red-500' : 'text-text-primary'}`}>
              {typeof indicator.value === 'number' ? indicator.value.toLocaleString() : indicator.value}
           </span>
           <span className="text-xs font-black text-text-subtle uppercase">{indicator.unit}</span>
        </div>

        <div className="space-y-3 w-full">
           <div className="flex justify-between text-[11px] font-black uppercase text-text-subtle flex-row-reverse items-center">
              <span className="flex items-center gap-2 flex-row-reverse">الاتجاه السلوكي <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform"/></span>
              {indicator.trend === 'up' && <div className="flex items-center gap-1.5 text-red-500"><TrendingUp size={16}/></div>}
              {indicator.trend === 'down' && <div className="flex items-center gap-1.5 text-green-500"><TrendingDown size={16}/></div>}
              {indicator.trend === 'stable' && <div className="flex items-center gap-1.5 text-blue-500"><Minus size={16}/></div>}
           </div>
           <div className="h-2.5 w-full bg-canvas rounded-full overflow-hidden border border-border-subtle shadow-inner flex flex-row-reverse gap-1.5 p-1">
              {indicator.history.map((h, i) => (
                 <div key={i} className={`flex-1 rounded-full transition-all duration-700 ${isCritical ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]' : isWarning ? 'bg-amber-500' : 'bg-green-500'} opacity-${(i+1)*20}`}></div>
              ))}
           </div>
        </div>
      </div>
      
      <div className="absolute -bottom-12 -right-12 opacity-[0.03] group-hover:opacity-[0.15] transition-all duration-1000 pointer-events-none group-hover:scale-150 rotate-45">
         <Radar size={280}/>
      </div>
    </div>
  );
};

const DetailedPanel: React.FC<{indicator: Indicator, onClose: () => void}> = ({indicator, onClose}) => {
  return (
    <div className="fixed inset-0 z-[100] flex justify-start animate-in fade-in duration-300">
      <div className="absolute inset-0 bg-canvas/60 backdrop-blur-md" onClick={onClose}></div>
      <div className="bg-panel w-full max-w-4xl shadow-2xl border-r-2 border-border-subtle relative z-10 flex flex-col animate-in slide-in-from-right duration-500 h-full text-right font-tajawal">
          
          <div className="p-10 border-b border-border-subtle flex justify-between items-center bg-canvas/30 flex-row-reverse relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-brand-primary to-brand-accent"></div>
              <div className="flex items-center gap-8 flex-row-reverse">
                  <div className="p-5 bg-brand-primary text-white rounded-3xl shadow-tactical border border-white/20">
                     <Brain size={40}/>
                  </div>
                  <div>
                     <h3 className="text-4xl font-black text-text-primary uppercase tracking-tighter leading-none">{indicator.name}</h3>
                     <p className="text-[12px] text-text-subtle font-black uppercase tracking-[0.5em] mt-4">YemenJPT Intelligence Protocol v6.5</p>
                  </div>
              </div>
              <button onClick={onClose} className="p-5 bg-canvas border border-border-subtle rounded-2xl hover:text-red-500 transition-all shadow-sm hover:scale-105 active:scale-95"><X size={32}/></button>
          </div>

          <div className="flex-1 p-10 overflow-y-auto custom-scrollbar space-y-12 text-right" dir="rtl">
              <div className="grid grid-cols-2 gap-8">
                  <div className="bg-canvas p-10 rounded-[2.5rem] border-2 border-border-subtle text-center shadow-inner group hover:border-brand-primary transition-all">
                      <span className="text-[11px] font-black text-text-subtle uppercase mb-4 block tracking-widest group-hover:text-brand-primary">القراءة اللحظية</span>
                      <span className="text-6xl font-black text-brand-primary font-mono tracking-tighter">{indicator.value.toLocaleString()}</span>
                      <span className="text-[14px] font-black mr-4 uppercase opacity-60">{indicator.unit}</span>
                  </div>
                  <div className="bg-canvas p-10 rounded-[2.5rem] border-2 border-border-subtle text-center shadow-inner group hover:border-red-500 transition-all">
                      <span className="text-[11px] font-black text-text-subtle uppercase mb-4 block tracking-widest group-hover:text-red-500">تقييم الموثوقية (Risk Score)</span>
                      <span className={`text-3xl font-black uppercase tracking-widest flex items-center justify-center gap-4 ${indicator.status === 'critical' ? 'text-red-500' : indicator.status === 'warning' ? 'text-amber-500' : 'text-green-500'}`}>
                        {indicator.status === 'critical' && <ShieldAlert size={32} className="animate-bounce"/>}
                        {indicator.status}
                      </span>
                  </div>
              </div>

              <section className="animate-in slide-in-from-bottom-4">
                  <div className="flex items-center gap-4 mb-8 text-brand-primary border-b border-border-subtle pb-4">
                      <Target size={24}/>
                      <h4 className="text-sm font-black uppercase tracking-widest">آلية التجميع (Data Aggregator Logic)</h4>
                  </div>
                  <div className="bg-panel border-2 border-border-subtle p-10 rounded-[2.5rem] shadow-inner relative overflow-hidden">
                     <div className="absolute top-0 right-0 w-2.5 h-full bg-brand-primary/20"></div>
                     <p className="text-xl text-text-primary font-bold leading-loose mb-6">{indicator.gatheringLogic}</p>
                     <div className="flex items-center gap-4 mt-8 pt-8 border-t border-border-subtle">
                        <div className="p-3 bg-brand-primary/10 rounded-xl text-brand-primary"><Database size={20}/></div>
                        <div>
                           <span className="text-[10px] font-black text-text-subtle uppercase block">Aggregator Node</span>
                           <span className="text-sm font-black text-text-primary uppercase tracking-wider">{indicator.aggregator}::MANDATE_2026</span>
                        </div>
                     </div>
                  </div>
              </section>

              <section className="animate-in slide-in-from-bottom-6">
                  <div className="flex items-center gap-4 mb-8 text-brand-primary border-b border-border-subtle pb-4">
                      <Activity size={24}/>
                      <h4 className="text-sm font-black uppercase tracking-widest">تحليل التذبذب الزمني (Chronos)</h4>
                  </div>
                  <div className="h-72 w-full flex items-end gap-5 px-10 bg-canvas/40 rounded-[3rem] border-2 border-border-subtle p-12 shadow-inner">
                     {indicator.history.map((val, i) => (
                        <div 
                          key={i} 
                          className={`flex-1 rounded-t-3xl transition-all group relative cursor-help ${indicator.status === 'critical' ? 'bg-red-500/20 hover:bg-red-500 shadow-[0_0_25px_rgba(239,68,68,0.3)]' : 'bg-brand-primary/20 hover:bg-brand-primary shadow-[0_0_25px_rgba(30,64,175,0.3)]'}`}
                          style={{ height: `${(val / Math.max(...indicator.history)) * 100}%` }}
                        >
                            <div className="absolute bottom-full mb-5 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all pointer-events-none z-50">
                              <div className="bg-slate-900 text-white text-[12px] px-5 py-3 rounded-2xl font-mono shadow-2xl border border-white/10 whitespace-nowrap">{val.toLocaleString()} {indicator.unit}</div>
                            </div>
                        </div>
                     ))}
                  </div>
                  <div className="flex justify-between text-[11px] font-black text-text-subtle uppercase px-8 mt-6">
                    <span className="flex items-center gap-2"><Clock size={14}/> القراءة الأخيرة</span>
                    <span>T-30 Days</span>
                  </div>
              </section>

              <div className="grid grid-cols-2 gap-8 pb-32">
                  <button className="flex items-center justify-center gap-5 p-8 rounded-[2rem] text-sm font-black uppercase transition-all bg-brand-primary text-white border-brand-primary hover:bg-brand-primary-hover shadow-glow-blue active:scale-95 border group">
                     <Share2 size={24} className="group-hover:rotate-12 transition-transform"/> تصدير التقرير الاستخباراتي
                  </button>
                  <button className="flex items-center justify-center gap-5 p-8 bg-canvas border-2 border-border-subtle rounded-[2rem] text-sm font-black uppercase text-text-primary hover:bg-brand-primary/5 transition-all active:scale-95 shadow-sm group">
                     <Download size={24} className="group-hover:-translate-y-1 transition-transform"/> حفظ كدليل جنائي (PDF)
                  </button>
              </div>
          </div>

          <div className="p-10 border-t border-border-subtle bg-canvas/20 backdrop-blur-xl">
              <button className="w-full py-8 bg-slate-950 text-brand-accent rounded-[2.5rem] font-black text-base uppercase tracking-[0.3em] shadow-2xl flex items-center justify-center gap-5 active:scale-95 transition-all border border-brand-accent/20 group hover:border-brand-accent/50">
                  <RefreshCcw size={28} className="group-hover:rotate-180 transition-transform duration-1000"/> 
                  مزامنة قسرية مع المجمعات الذكية
              </button>
          </div>
      </div>
    </div>
  );
};

export default PredictiveHub;
