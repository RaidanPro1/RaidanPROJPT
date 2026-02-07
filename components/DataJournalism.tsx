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
  Zap, Sheet
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
      <div className="bg-panel p-6 rounded-2xl flex flex-col xl:flex-row items-center justify-between gap-6 border border-border-subtle border-r-4 border-r-brand-accent shadow-elevation relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-accent/5 rounded-full -mr-32 -mt-32 blur-md animate-pulse"></div>
        
        <div className="flex items-center gap-6 relative z-10">
          <div className="w-16 h-16 bg-canvas border border-border-subtle rounded-2xl flex items-center justify-center text-brand-accent shadow-sm">
            <Share2 size={32} className={isSyncing ? 'animate-pulse' : ''} />
          </div>
          <div>
            <h2 className="text-3xl font-black text-text-primary font-tajawal leading-none uppercase tracking-tight">كاشف الفساد (Investigative Core)</h2>
            <div className="flex items-center gap-3 mt-2">
               <span className="text-[10px] text-brand-accent font-bold uppercase tracking-[0.3em]">Neo4j Bolt + OCCRP Aleph API</span>
               <div className="h-3 w-px bg-border-subtle"></div>
               <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.5)]"></div>
                  <span className="text-[9px] font-black text-text-subtle uppercase tracking-widest">Aleph Indexer: Active</span>
               </div>
            </div>
          </div>
        </div>
        {/* ... */}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Investigative Filters & Tools Sidebar */}
        <div className="xl:col-span-3 space-y-6">
          <div className="bg-glass backdrop-blur-glass p-5 rounded-2xl border border-border-glass shadow-elevation space-y-6">
             <div className="flex items-center gap-3 border-b border-border-subtle pb-4">
                <Filter size={18} className="text-brand-primary" />
                <h3 className="text-xs font-black text-text-primary uppercase tracking-widest font-tajawal">محددات البحث الاستقصائي</h3>
             </div>
             {/* ... */}
          </div>
        </div>

        {/* Investigative Viewport */}
        <div className="xl:col-span-9">
          <div className="bg-panel rounded-2xl shadow-elevation overflow-hidden min-h-[700px] flex flex-col border border-border-subtle relative">
             <div className="p-2 bg-canvas/80 border-b border-border-subtle flex justify-between items-center gap-4 relative z-20 backdrop-blur-md">
                <div className="flex">
                    <TabButton id="graph" activeTab={viewMode} setTab={setViewMode} icon={<Network />}>عرض رسومي</TabButton>
                    <TabButton id="documents" activeTab={viewMode} setTab={setViewMode} icon={<FileSearch />}>الوثائق</TabButton>
                    <TabButton id="query" activeTab={viewMode} setTab={setViewMode} icon={<Code2 />}>استعلام Cypher</TabButton>
                    <TabButton id="openrefine" activeTab={viewMode} setTab={setViewMode} icon={<Sheet />}>تنظيف البيانات</TabButton>
                </div>
             </div>
             
             {viewMode === 'graph' && <GraphViewport />}
             {viewMode === 'documents' && <DocumentList documents={documents} />}
             {viewMode === 'query' && <CypherQueryInterface />}
             {viewMode === 'openrefine' && <div className="p-10 text-center text-text-subtle">OpenRefine Integration Placeholder</div>}

          </div>
        </div>
      </div>
      
      <style>{`
        @keyframes dash { to { stroke-dashoffset: -100; } }
      `}</style>
    </div>
  );
};

// --- Sub-components for DataJournalism ---

const TabButton: React.FC<{id: any, activeTab: any, setTab: (t:any) => void, icon: React.ReactNode, children: React.ReactNode}> = ({ id, activeTab, setTab, icon, children }) => (
    <button onClick={() => setTab(id)} className={`flex-1 px-5 py-3 rounded-lg text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-3 ${activeTab === id ? 'bg-brand-primary/10 text-brand-primary' : 'text-text-subtle hover:bg-canvas'}`}>
        {icon} {children}
    </button>
);

const GraphViewport: React.FC = () => (
    <div className="flex-1 bg-canvas flex items-center justify-center p-8 text-center text-text-subtle">
        <p>Graph Visualization (Neo4j) Placeholder. Imagine a network of entities here.</p>
    </div>
);

const DocumentList: React.FC<{documents: Document[]}> = ({documents}) => (
    <div className="flex-1 overflow-y-auto custom-scrollbar">
        <table className="w-full text-right">
            <thead className="sticky top-0 bg-canvas/90 backdrop-blur-sm">
                <tr>
                    <th className="px-6 py-4 text-[10px] font-black text-text-subtle uppercase tracking-widest">العنوان</th>
                    <th className="px-6 py-4 text-[10px] font-black text-text-subtle uppercase tracking-widest">المصدر</th>
                    <th className="px-6 py-4 text-[10px] font-black text-text-subtle uppercase tracking-widest">التاريخ</th>
                    <th className="px-6 py-4 text-[10px] font-black text-text-subtle uppercase tracking-widest">الكيانات</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle">
                {documents.map(doc => (
                    <tr key={doc.id} className="hover:bg-brand-primary/5">
                        <td className="px-6 py-4 text-xs font-bold text-text-primary">{doc.title}</td>
                        <td className="px-6 py-4 text-xs font-mono text-text-subtle">{doc.source}</td>
                        <td className="px-6 py-4 text-xs text-text-subtle">{doc.date}</td>
                        <td className="px-6 py-4 text-xs font-black text-brand-accent">{doc.entities_found}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);

const CypherQueryInterface: React.FC = () => (
    <div className="flex-1 flex flex-col h-full">
        <textarea 
            defaultValue={'MATCH (p:Person)-[:WORKS_FOR]->(o:Organization) RETURN p.name, o.name LIMIT 10'}
            className="w-full h-32 bg-slate-900 p-4 font-mono text-xs text-amber-300 resize-none outline-none border-b-4 border-brand-accent"
        />
        <div className="flex-1 bg-canvas p-4 text-xs font-mono text-text-secondary overflow-y-auto custom-scrollbar">
            <p>&gt; Query results would appear here in a table format...</p>
        </div>
    </div>
);


export default DataJournalism;