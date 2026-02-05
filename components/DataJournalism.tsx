import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, Link2, Database, Share2, FileSearch, 
  Users, Building2, Landmark, Briefcase, 
  ChevronRight, Filter, Download, ExternalLink,
  ShieldCheck, AlertCircle, Info, Activity, 
  Network, Cpu, HardDrive, LayoutGrid, List,
  ArrowUpRight, Target, Fingerprint, History,
  Maximize2, ZoomIn, MoreVertical, BookOpen,
  RefreshCcw, Terminal, Code2, ShieldAlert,
  Zap, Sheet // Added Sheet icon for OpenRefine
} from 'lucide-react';

interface Entity {
  id: string;
  name: string;
  type: 'person' | 'company' | 'bank' | 'asset';
  connections: number;
  risk: 'low' | 'medium' | 'high';
}

interface Document {
  id: string;
  title: string;
  type: string;
  source: string;
  date: string;
  entities_found: number;
}

const DataJournalism: React.FC = () => {
  const [viewMode, setViewMode] = useState<'graph' | 'documents' | 'query' | 'openrefine'>('graph');
  const [isSyncing, setIsSyncing] = useState(false);
  const [memUsage, setMemUsage] = useState(3.1); // GB
  const [isMemoryAlert, setIsMemoryAlert] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [cypherQuery, setCypherQuery] = useState('MATCH (p:Person)-[r:INVESTED_IN]->(c:Company) RETURN p, r, c LIMIT 25');
  
  const queryEndRef = useRef<HTMLDivElement>(null);

  const entities: Entity[] = [
    { id: '1', name: 'مجموعة النور التجارية', type: 'company', connections: 12, risk: 'high' },
    { id: '2', name: 'أحمد صالح اليماني', type: 'person', connections: 8, risk: 'medium' },
    { id: '3', name: 'البنك الوطني للتجارة', type: 'bank', connections: 45, risk: 'low' },
    { id: '4', name: 'عقار "فيلا السبعين"', type: 'asset', connections: 3, risk: 'high' },
  ];

  const documents: Document[] = [
    { id: 'DOC-991', title: 'عقود مناقصات وقود الكهرباء 2024', type: 'PDF', source: 'سجلات حكومية', date: '2025-01-12', entities_found: 14 },
    { id: 'DOC-882', title: 'كشف حوالات "شركة صرافة س"', type: 'XLSX', source: 'تسريبات خاصة', date: '2024-12-05', entities_found: 32 },
    { id: 'DOC-773', title: 'سجل مساهمي بنك الأمل', type: 'PDF', source: 'قاعدة بيانات Aleph', date: '2024-11-20', entities_found: 8 },
  ];

  useEffect(() => {
    if (isSyncing) {
      const timer = setTimeout(() => setIsSyncing(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [isSyncing]);

  useEffect(() => {
    if (memUsage > 3.8) setIsMemoryAlert(true);
    else setIsMemoryAlert(false);
  }, [memUsage]);

  return (
    <div className="space-y-6 animate-in fade-in duration-700 pb-20 font-tajawal">
      {/* Investigative Command Header */}
      <div className="bg-white p-6 rounded-2xl flex flex-col xl:flex-row items-center justify-between gap-6 border border-slate-200 border-r-4 border-r-yemenGold shadow-tactical relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-yemenGold/5 rounded-full -mr-32 -mt-32 blur-md animate-pulse"></div>
        
        <div className="flex items-center gap-6 relative z-10">
          <div className="w-16 h-16 bg-slate-100 border border-slate-200 rounded-2xl flex items-center justify-center text-yemenGold shadow-sm">
            <Share2 size={32} className={isSyncing ? 'animate-pulse' : ''} />
          </div>
          <div>
            <h2 className="text-3xl font-black text-slate-900 font-tajawal leading-none uppercase tracking-tight">كاشف الفساد (Investigative Core)</h2>
            <div className="flex items-center gap-3 mt-2">
               <span className="text-[10px] text-yemenGold font-bold uppercase tracking-[0.3em]">Neo4j Bolt + OCCRP Aleph API</span>
               <div className="h-3 w-px bg-slate-200"></div>
               <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.5)]"></div>
                  <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Aleph Indexer: Active</span>
               </div>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 items-center relative z-10">
          <div className="bg-slate-50 p-3 px-6 rounded-xl border border-slate-200 flex items-center gap-8 shadow-inner">
             <div className="flex flex-col border-l border-slate-200 pl-6">
                <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Aleph RAM Sentry</span>
                <div className="flex items-center gap-2">
                   <Activity size={14} className={isMemoryAlert ? 'text-red-500 animate-pulse' : 'text-blue-500'} />
                   <span className={`text-sm font-black font-mono ${isMemoryAlert ? 'text-red-500' : 'text-slate-900'}`}>
                     {memUsage.toFixed(1)} / 4.0 GB
                   </span>
                </div>
                <div className="w-24 bg-slate-200 h-1 rounded-full mt-1 overflow-hidden">
                   <div className={`h-full transition-all duration-500 ${isMemoryAlert ? 'bg-red-500' : 'bg-yemenBlue'}`} style={{ width: `${(memUsage/4)*100}%` }}></div>
                </div>
             </div>
             <div className="flex flex-col">
                <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Bolt Connections</span>
                <div className="flex items-center gap-2">
                   <Network size={14} className="text-yemenGold" />
                   <span className="text-sm font-black text-slate-900">Neo4j: Connected</span>
                </div>
             </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Investigative Filters & Tools Sidebar */}
        <div className="xl:col-span-3 space-y-6">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-6">
             <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                <Filter size={18} className="text-yemenBlue" />
                <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest font-tajawal">محددات البحث الاستقصائي</h3>
             </div>

             <div className="space-y-4">
                <div>
                   <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2 block px-1">تصفية حسب نوع الكيان</label>
                   <div className="space-y-2">
                      {[
                        { id: 'person', label: 'أشخاص (PNs)', icon: <Users size={14} /> },
                        { id: 'company', label: 'شركات وكيانات', icon: <Building2 size={14} /> },
                        { id: 'bank', label: 'بنوك ومؤسسات مالية', icon: <Landmark size={14} /> },
                        { id: 'asset', label: 'أصول وعقارات', icon: <Briefcase size={14} /> },
                      ].map(type => (
                        <label key={type.id} className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-white hover:bg-slate-50 cursor-pointer transition-all group">
                           <div className="flex items-center gap-3">
                              <span className="text-yemenBlue group-hover:scale-110 transition-transform">{type.icon}</span>
                              <span className="text-[11px] font-bold text-slate-800 font-tajawal">{type.label}</span>
                           </div>
                           <input type="checkbox" className="w-4 h-4 rounded border-slate-300 bg-slate-100 text-yemenBlue focus:ring-yemenBlue focus:ring-offset-white" />
                        </label>
                      ))}
                   </div>
                </div>

                <div>
                   <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2 block px-1">قاعدة بيانات Aleph</label>
                   <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-800 outline-none focus:border-yemenBlue transition-all font-tajawal">
                      <option>سجلات الشركات اليمنية (Unified)</option>
                      <option>قاعدة بيانات PANAMA PAPERS</option>
                      <option>تسريبات حوالات الصرافة</option>
                      <option>سجلات الموانئ الاستراتيجية</option>
                   </select>
                </div>
             </div>

             <button 
               onClick={() => setIsSyncing(true)}
               className="w-full py-4 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-800 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-3 shadow-sm"
             >
                <RefreshCcw size={16} className={isSyncing ? 'animate-spin' : ''} />
                مزامنة Aleph ↔ Neo4j
             </button>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
             <div className="flex items-center gap-3 mb-4">
                <ShieldAlert size={16} className="text-red-600 animate-pulse" />
                <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest font-tajawal">بروتوكول الذاكرة المكثفة</span>
             </div>
             <p className="text-[10px] text-slate-500 leading-relaxed font-bold font-tajawal text-right" dir="rtl">
               يتم تشغيل `OCCRP Aleph` بحد أقصى للذاكرة `4GB`. في حال وصول الاستهلاك للحد الأقصى، سيقوم النظام تلقائياً بتعليق عمليات الفهرسة وحماية واجهة البحث.
             </p>
          </div>
        </div>

        {/* Investigative Viewport */}
        <div className="xl:col-span-9">
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden min-h-[700px] flex flex-col border border-slate-200 relative">
             <div className="p-4 bg-slate-50/80 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4 relative z-20 backdrop-blur-md">
                <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 flex-wrap">
                   <button 
                     onClick={() => setViewMode('graph')}
                     className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${viewMode === 'graph' ? 'bg-yemenBlue text-white shadow-md' : 'text-slate-500 hover:text-slate-900'}`}
                   >
                      <Share2 size={14} /> مستكشف العلاقات
                   </button>
                   <button 
                     onClick={() => setViewMode('documents')}
                     className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${viewMode === 'documents' ? 'bg-yemenBlue text-white shadow-md' : 'text-slate-500 hover:text-slate-900'}`}
                   >
                      <BookOpen size={14} /> أرشيف Aleph
                   </button>
                   <button 
                     onClick={() => setViewMode('openrefine')}
                     className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${viewMode === 'openrefine' ? 'bg-yemenBlue text-white shadow-md' : 'text-slate-500 hover:text-slate-900'}`}
                   >
                      <Sheet size={14} /> تنظيف البيانات
                   </button>
                   <button 
                     onClick={() => setViewMode('query')}
                     className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${viewMode === 'query' ? 'bg-yemenBlue text-white shadow-md' : 'text-slate-500 hover:text-slate-900'}`}
                   >
                      <Terminal size={14} /> واجهة الاستعلام
                   </button>
                </div>

                <div className="relative group w-full sm:w-auto">
                   <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-yemenBlue transition-colors" size={16} />
                   <input 
                     type="text" 
                     placeholder="البحث الدلالي في الوثائق..." 
                     className="bg-white border border-slate-200 rounded-xl pr-10 pl-4 py-2.5 text-xs text-slate-900 outline-none focus:border-yemenBlue/50 transition-all w-full sm:w-64 text-right font-tajawal"
                     dir="rtl"
                   />
                </div>
             </div>

             <div className="flex-1 relative bg-slate-50 overflow-hidden flex flex-col">
                {viewMode === 'graph' && (
                  <div className="absolute inset-0 flex items-center justify-center p-12">
                     <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/grid-me.png')]"></div>
                     <div className="relative w-full h-full border border-slate-200 rounded-3xl overflow-hidden flex items-center justify-center bg-white/50">
                        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40">
                           <line x1="25%" y1="25%" x2="50%" y2="50%" stroke="#D4AF37" strokeWidth="2" strokeDasharray="5,5" className="animate-[dash_10s_linear_infinite]" />
                           <line x1="66%" y1="75%" x2="50%" y2="50%" stroke="#D4AF37" strokeWidth="2" />
                        </svg>
                     </div>
                  </div>
                )}

                {viewMode === 'documents' && (
                  <div className="p-8 h-full overflow-y-auto custom-scrollbar">
                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {documents.map(doc => (
                          <div key={doc.id} className="bg-white p-5 rounded-2xl border border-slate-100 hover:border-yemenBlue/40 transition-all group cursor-pointer shadow-sm hover:shadow-lg flex flex-col justify-between h-48 relative overflow-hidden">
                             {/* ... content for document cards ... */}
                          </div>
                        ))}
                     </div>
                  </div>
                )}

                {viewMode === 'openrefine' && (
                   <div className="flex-1 flex flex-col p-6 gap-4 animate-in slide-in-from-bottom-4 bg-slate-100">
                     <div className="flex items-center gap-3 p-4 bg-white rounded-xl border border-slate-200">
                       <div className="p-2 bg-blue-100 text-yemenBlue rounded-lg">
                         <Info size={16} />
                       </div>
                       <p className="text-xs text-slate-600 font-bold">
                         واجهة **OpenRefine** لتنظيف البيانات. قم برفع ملف (CSV, XLSX) لبدء عملية التنقية والتحويل قبل إدخالها إلى Neo4j.
                       </p>
                     </div>
                     <div className="flex-1 bg-white rounded-xl overflow-hidden border-2 border-slate-200 shadow-inner">
                       <iframe 
                         src="http://localhost:3333" 
                         className="w-full h-full border-0"
                         title="OpenRefine Interface"
                       ></iframe>
                     </div>
                   </div>
                )}

                {viewMode === 'query' && (
                   <div className="flex-1 flex flex-col p-8 gap-6 animate-in slide-in-from-bottom-4">
                      <div className="bg-slate-900 flex-1 rounded-2xl border border-slate-800 p-6 font-mono relative group">
                         <textarea 
                           value={cypherQuery}
                           onChange={(e) => setCypherQuery(e.target.value)}
                           className="w-full h-full bg-transparent text-blue-400 text-sm outline-none resize-none custom-scrollbar pt-6"
                           dir="ltr"
                         />
                         <button className="absolute bottom-6 right-6 bg-yemenBlue hover:bg-yemenBlue-hover text-white px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-md transition-all active:scale-95 flex items-center gap-3">
                            <Zap size={14} className="text-yemenGold" />
                            Run Investigation Query
                         </button>
                      </div>
                   </div>
                )}
             </div>

             <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-between items-center relative z-20">
                <div className="flex items-center gap-6">
                   <div className="flex items-center gap-2">
                     <Activity size={14} className="text-blue-500" />
                     <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Aleph Worker: Healthy</span>
                   </div>
                </div>
                <div className="flex items-center gap-3">
                   <button className="px-5 py-2 bg-white border border-slate-200 rounded-xl text-[10px] font-black text-slate-600 hover:text-slate-900 transition-all uppercase tracking-widest">
                      <Download size={14} /> Export Findings
                   </button>
                </div>
             </div>
          </div>
        </div>
      </div>
      
      <style>{`
        @keyframes dash {
          to {
            stroke-dashoffset: -100;
          }
        }
      `}</style>
    </div>
  );
};

export default DataJournalism;