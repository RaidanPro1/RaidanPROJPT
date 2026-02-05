
import React, { useState, useEffect } from 'react';
import { 
  FileText, BarChart, PenTool, Layout, 
  Eye, Save, Send, Share2, Languages, 
  Sparkles, CheckCircle2, AlertCircle, 
  Activity, Coffee, Terminal, BookOpen, 
  PieChart, Map as MapIcon, Link2, 
  Search, ShieldCheck, Download, 
  ChevronRight, ArrowRight, MessageSquare,
  FileSearch, Target, TrendingUp, History,
  Cpu, Database, Zap, Globe, FileEdit,
  RotateCcw, Maximize2, RefreshCcw, Settings2
} from 'lucide-react';

const SmartNewsroom: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'editor' | 'dashboards' | 'proofing'>('editor');
  const [content, setContent] = useState('بناءً على المعلومات المستخرجة من سجلات موانئ عدن للفترة من يونيو إلى أغسطس 2024، تبين وجود نمط غير معتاد في تفريغ شحنات الوقود عبر شركات صرافة محلية...');
  const [isSaving, setIsSaving] = useState(false);
  const [jvmMemory, setJvmMemory] = useState(640); 
  const [proofingAlerts, setProofingAlerts] = useState<{msg: string, type: 'error' | 'warning'}[]>([]);

  // Simulation of Content Intelligence Side Feed (Tools Integration)
  const intelFeed = [
    { type: 'forensic', text: 'رصد تلاعب بنسبة 87% في صورة "عقد الشحن 402".', icon: <Target size={12} className="text-red-500" /> },
    { type: 'geoint', text: 'رصد سفينة غير مسجلة في رصيف 4 بميناء المكلا.', icon: <MapIcon size={12} className="text-yemenGold" /> },
    { type: 'osint', text: 'علاقة مشبوهة في Neo4j بين "الشركة س" و "المسؤول ص".', icon: <Share2 size={12} className="text-blue-400" /> },
  ];

  const handleProofing = () => {
    setProofingAlerts([
      { msg: 'خطأ إملائي: "قد وقعوش" -> يفضل "لم يوقعوا"', type: 'error' },
      { msg: 'أسلوب: يفضل استخدام "بناءً على" بدلاً من "علي حسب"', type: 'warning' },
      { msg: 'تنبيه سيادي: تجنب ذكر أسماء المصادر الميدانية بشكل صريح.', type: 'warning' }
    ]);
  };

  const saveDraft = () => {
    setIsSaving(true);
    setTimeout(() => setIsSaving(false), 800);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-700 pb-20 font-tajawal">
      {/* Production Cockpit Header */}
      <div className="bg-white p-6 rounded-2xl flex flex-col xl:flex-row items-center justify-between gap-6 border border-slate-200 border-r-4 border-r-yemenBlue shadow-tactical relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-yemenBlue/5 rounded-full -mr-32 -mt-32 blur-md"></div>
        
        <div className="flex items-center gap-6 relative z-10">
          <div className="w-16 h-16 bg-slate-100 border border-slate-200 rounded-2xl flex items-center justify-center text-yemenBlue shadow-sm">
            <FileText size={32} />
          </div>
          <div>
            <h2 className="text-3xl font-black text-slate-900 leading-none uppercase tracking-tight">غرفة الأخبار الذكية (Newsroom)</h2>
            <div className="flex items-center gap-3 mt-2">
               <span className="text-[10px] text-yemenBlue font-bold uppercase tracking-[0.3em]">Headless Strapi + Superset Viz + Java LT</span>
               <div className="h-3 w-px bg-slate-200"></div>
               <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.3)]"></div>
                  <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest px-1">Production Node: Master</span>
               </div>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 items-center relative z-10">
          <div className="bg-slate-50 p-3 px-6 rounded-xl border border-slate-200 flex items-center gap-8 shadow-inner">
             <div className="flex flex-col border-l border-slate-200 pl-6">
                <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">LT JVM Memory</span>
                <div className="flex items-center gap-2">
                   <Database size={14} className="text-purple-500" />
                   <span className="text-sm font-black text-slate-900 font-mono">{jvmMemory} / 1024 MB</span>
                </div>
             </div>
             <div className="flex flex-col">
                <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Auto-Sync State</span>
                <div className="flex items-center gap-2 text-green-600">
                   <CheckCircle2 size={14} />
                   <span className="text-[10px] font-black uppercase">Vault Sync OK</span>
                </div>
             </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Newsroom Navigation & Sidebar Tools */}
        <div className="xl:col-span-3 space-y-6">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-6">
             <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                <Layout size={18} className="text-yemenBlue" />
                <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest font-tajawal">وحدات الإنتاج</h3>
             </div>

             <div className="space-y-2">
                {[
                  { id: 'editor', label: 'المحرر الاستقصائي', icon: <PenTool size={16} />, desc: 'إدارة مسودات التقارير' },
                  { id: 'dashboards', label: 'التمثيل البصري (Viz)', icon: <BarChart size={16} />, desc: 'لوحات Superset المدمجة' },
                  { id: 'proofing', label: 'التدقيق السيادي', icon: <Languages size={16} />, desc: 'LanguageTool Local Engine' },
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`w-full p-4 rounded-xl border text-right transition-all flex items-center justify-between group ${
                      activeTab === tab.id 
                      ? 'bg-yemenBlue text-white shadow-md border-transparent' 
                      : 'bg-white border-slate-100 text-slate-500 hover:border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                     <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${activeTab === tab.id ? 'bg-white/20' : 'bg-slate-100 text-slate-600'}`}>
                           {tab.icon}
                        </div>
                        <div>
                           <div className="text-xs font-black uppercase leading-none mb-1">{tab.label}</div>
                           <div className="text-[8px] opacity-70 font-bold tracking-tighter uppercase">{tab.desc}</div>
                        </div>
                     </div>
                     {activeTab === tab.id && <ChevronRight size={16} />}
                  </button>
                ))}
             </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
             <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <Sparkles size={14} className="text-yemenGold" />
                  <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">موجز الترسانة الحي</span>
                </div>
                <button className="text-[9px] text-yemenBlue font-bold hover:underline">مزامنة</button>
             </div>
             <div className="space-y-3">
                {intelFeed.map((item, i) => (
                  <div key={i} className="p-3 bg-slate-50 rounded-xl border border-slate-100 group hover:border-yemenBlue/20 transition-all cursor-copy">
                     <div className="flex items-start gap-3">
                        <div className="mt-1">{item.icon}</div>
                        <p className="text-[10px] text-slate-600 font-bold leading-relaxed font-tajawal group-hover:text-slate-900 transition-colors">
                          {item.text}
                          <span className="block text-[8px] text-slate-400 mt-1 uppercase font-mono tracking-tighter">Click to link in Strapi</span>
                        </p>
                     </div>
                  </div>
                ))}
             </div>
          </div>
        </div>

        {/* Main Production Workspace */}
        <div className="xl:col-span-9">
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden min-h-[750px] flex flex-col border border-slate-200 relative">
             {/* Main Toolbar */}
             <div className="p-4 bg-slate-50/80 border-b border-slate-100 flex justify-between items-center z-20 backdrop-blur-md">
                <div className="flex items-center gap-3">
                   <button 
                     onClick={saveDraft}
                     className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-600 hover:text-slate-900 hover:border-yemenBlue/50 transition-all flex items-center gap-2 group shadow-sm"
                   >
                      {isSaving ? <RotateCcw size={18} className="animate-spin text-yemenBlue" /> : <Save size={18} />}
                      <span className="text-[10px] font-black uppercase tracking-widest">{isSaving ? 'جاري الحفظ...' : 'حفظ المسودة'}</span>
                   </button>
                   <button className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-600 hover:text-slate-900 transition-all shadow-sm">
                      <History size={18} />
                   </button>
                </div>

                <div className="flex items-center gap-3">
                   <button className="px-5 py-2.5 bg-white border border-slate-200 rounded-xl text-[10px] font-black text-slate-600 hover:text-slate-900 transition-all flex items-center gap-2 uppercase tracking-widest shadow-sm">
                      <Eye size={16} /> معاينة
                   </button>
                   <button className="px-6 py-2.5 bg-yemenBlue text-white rounded-xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center gap-3 shadow-md border border-yemenBlue/20 active:scale-95 group">
                      <Send size={16} className="text-yemenGold group-hover:translate-x-1 transition-transform" /> نشر في Ghost
                   </button>
                </div>
             </div>

             {/* Dynamic Content Views */}
             <div className="flex-1 overflow-hidden">
                {activeTab === 'editor' && (
                  <div className="h-full flex flex-col p-10 gap-8 animate-in slide-in-from-right-4">
                     <div className="flex items-center gap-4 border-b border-slate-100 pb-4">
                        <FileEdit size={24} className="text-yemenGold" />
                        <input 
                          type="text" 
                          placeholder="عنوان التقرير الاستقصائي..." 
                          className="bg-transparent text-2xl font-black text-slate-900 outline-none focus:border-yemenGold transition-all text-right font-tajawal w-full"
                          dir="rtl"
                          defaultValue="التحقيق في سلاسل توريد الوقود غير المشروعة عبر موانئ البحر الأحمر"
                        />
                     </div>
                     <textarea 
                       placeholder="ابدأ بكتابة مسودة التقرير هنا..."
                       className="flex-1 bg-transparent text-slate-700 py-4 text-lg leading-loose outline-none resize-none custom-scrollbar text-right font-tajawal"
                       dir="rtl"
                       value={content}
                       onChange={(e) => setContent(e.target.value)}
                     />
                  </div>
                )}

                {activeTab === 'dashboards' && (
                  <div className="h-full p-8 flex flex-col gap-6 animate-in zoom-in-95 bg-slate-50">
                     <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                           <BarChart size={24} className="text-blue-500" />
                           <div>
                              <h4 className="text-lg font-black text-slate-900 uppercase tracking-tight">Apache Superset Embedded</h4>
                              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Live Data Visualization Matrix</p>
                           </div>
                        </div>
                        <div className="flex gap-2">
                           <button className="p-2 bg-white border border-slate-200 rounded-lg text-slate-500 hover:text-slate-900"><Maximize2 size={16} /></button>
                           <button className="p-2 bg-white border border-slate-200 rounded-lg text-slate-500 hover:text-slate-900"><RefreshCcw size={16} /></button>
                        </div>
                     </div>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white p-6 rounded-2xl border border-slate-200 flex flex-col justify-center items-center gap-6 group hover:border-yemenGold/40 transition-all cursor-pointer h-72 border-b-4 border-b-yemenGold shadow-sm">
                           <div className="relative">
                              <PieChart size={80} className="text-yemenGold/40 group-hover:text-yemenGold transition-colors" />
                              <div className="absolute inset-0 flex items-center justify-center">
                                 <Zap size={24} className="text-slate-800 opacity-0 group-hover:opacity-100 transition-opacity" />
                              </div>
                           </div>
                           <div className="text-center">
                              <span className="text-xs font-black text-slate-900 uppercase tracking-widest block mb-1">توزيع تدفقات الوقود 2024</span>
                              <span className="text-[9px] text-slate-500 font-bold">SOURCE: SQL_VAULT_MASTER</span>
                           </div>
                        </div>
                        <div className="bg-white p-6 rounded-2xl border border-slate-200 flex flex-col justify-center items-center gap-6 group hover:border-yemenBlue/40 transition-all cursor-pointer h-72 border-b-4 border-b-yemenBlue shadow-sm">
                           <div className="relative">
                              <TrendingUp size={80} className="text-yemenBlue/40 group-hover:text-yemenBlue transition-colors" />
                           </div>
                           <div className="text-center">
                              <span className="text-xs font-black text-slate-900 uppercase tracking-widest block mb-1">نمو الكيانات المرتبطة بالعقوبات</span>
                              <span className="text-[9px] text-slate-500 font-bold">SOURCE: NEO4J_GRAPH_EXPORT</span>
                           </div>
                        </div>
                     </div>
                  </div>
                )}
                
                {activeTab === 'proofing' && (
                  <div className="h-full p-8 flex flex-col gap-8 animate-in slide-in-from-left-4 overflow-y-auto custom-scrollbar bg-slate-50">
                     <div className="flex items-center justify-between border-b border-slate-100 pb-6">
                        <div className="flex items-center gap-4">
                           <div className="p-3 bg-purple-100 rounded-xl text-purple-600 border border-purple-200">
                              <Languages size={24} />
                           </div>
                           <div>
                              <h4 className="text-lg font-black text-slate-900 uppercase tracking-tight">المدقق اللغوي السيادي (Local LT)</h4>
                              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Privacy-First Grammar Engine v6.0</p>
                           </div>
                        </div>
                        <button 
                          onClick={handleProofing}
                          className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-md active:scale-95 flex items-center gap-3 border border-purple-400/20"
                        >
                           <ShieldCheck size={16} /> تشغيل الفحص السيادي
                        </button>
                     </div>

                     <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="md:col-span-2 space-y-6">
                           <div className="bg-white p-8 rounded-2xl border border-slate-200 min-h-[400px] text-right font-tajawal text-slate-800 leading-loose text-lg shadow-inner" dir="rtl">
                              {content || "اكتب شيئاً في المحرر لبدء التدقيق..."}
                           </div>
                        </div>
                        <div className="space-y-6">
                           <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block px-1 flex items-center gap-2">
                             <AlertCircle size={12} /> قائمة تنبيهات التدقيق
                           </span>
                           <div className="space-y-3">
                              {proofingAlerts.length > 0 ? (
                                proofingAlerts.map((alert, i) => (
                                  <div key={i} className={`p-4 rounded-xl border flex items-start gap-4 animate-in slide-in-from-top-2 ${alert.type === 'error' ? 'bg-red-50 border-red-200 text-red-800' : 'bg-amber-50 border-amber-200 text-amber-800'}`}>
                                     <div className="mt-1 flex-shrink-0">
                                       {alert.type === 'error' ? <AlertCircle size={16} className="text-red-500" /> : <Zap size={16} className="text-amber-500" />}
                                     </div>
                                     <p className="text-[11px] font-bold leading-relaxed text-right w-full font-tajawal" dir="rtl">{alert.msg}</p>
                                  </div>
                                ))
                              ) : (
                                <div className="p-10 bg-slate-100 rounded-2xl border border-dashed border-slate-200 flex flex-col items-center gap-6 text-slate-400 group hover:border-slate-300 hover:text-slate-500 transition-all">
                                   <CheckCircle2 size={48} />
                                   <div className="text-center">
                                      <span className="text-[10px] font-black uppercase tracking-widest block">النص متوافق تماماً</span>
                                      <span className="text-[8px] font-bold block mt-1 uppercase">Sovereign Validation Passed</span>
                                   </div>
                                </div>
                              )}
                           </div>
                        </div>
                     </div>
                  </div>
                )}
             </div>

             {/* Footer */}
             <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-between items-center z-20 relative">
                <div className="flex items-center gap-6">
                   <div className="flex items-center gap-2">
                     <Activity size={14} className="text-blue-500" />
                     <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Strapi v4.x Engine: Running</span>
                   </div>
                </div>
                <div className="flex items-center gap-3 text-[9px] font-black text-slate-400 uppercase font-mono">
                  <Coffee size={12} /> Press House Protocol_v1.7
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SmartNewsroom;
