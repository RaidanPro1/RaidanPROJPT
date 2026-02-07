import React, { useState } from 'react';
import { 
  Globe, Plus, Trash2, ShieldCheck, Search, Loader2, 
  CheckCircle, AlertCircle, User, Filter, Zap, Server, 
  Activity, ArrowRight, Shield, Database, Layout, 
  Video, CloudLightning, Settings2, Clock, CheckSquare, Square,
  Mail, MessageSquare, Map, FileText, Cpu, Eye, BarChart, Terminal, Lock, Info, Camera, Radio,
  SearchCode, BarChart3, TrendingUp, AlertTriangle, FileSearch, Link2, BookOpen, Fingerprint, Share2,
  // Added CheckCircle2 to fix missing component errors
  CheckCircle2
} from 'lucide-react';
import { Domain, DomainStatus } from '../types';

const DomainManager: React.FC = () => {
  const [domains, setDomains] = useState<Domain[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [provisioningId, setProvisioningId] = useState<string | null>(null);
  const [provisioningStep, setProvisioningStep] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [formData, setFormData] = useState({
    domain_name: '',
    client_name: '',
    service_stack: {} as Record<string, boolean>
  });

  const toolCategories = [
    {
      name: 'العقل والذكاء السيادي',
      tools: [
        { id: 'ollama_native', name: 'Ollama Native', icon: <Cpu size={14} />, desc: 'تثبيت أصلي لأقصى أداء', req: '8GB RAM' },
        { id: 'ragflow_neo4j', name: 'RAGFlow + Neo4j', icon: <Share2 size={14} />, desc: 'فهم المحتوى ورسم العلاقات', req: '16GB RAM' },
        { id: 'strapi', name: 'Strapi CMS', icon: <Layout size={14} />, desc: 'واجهة التقارير الاستخباراتية', req: '2GB RAM' },
        { id: 'ghost', name: 'Ghost Publish', icon: <FileText size={14} />, desc: 'نشر المقالات والنشرات البريدية', req: '1GB RAM' },
      ]
    },
    {
      name: 'التحقق والاستخبارات',
      tools: [
        { id: 'deepsafe_ytdlp', name: 'DeepSafe + yt-dlp', icon: <Video size={14} />, desc: 'خط كشف التزييف العميق', req: '8GB RAM' },
        { id: 'maigret', name: 'Maigret OSINT', icon: <SearchCode size={14} />, desc: 'تعقب اليوزرات عبر المنصات', req: '1GB RAM' },
        { id: 'searxng', name: 'SearXNG Privacy', icon: <Search size={14} />, desc: 'البحث المجهول والخصوصي', req: '1GB RAM' },
        { id: 'torchgeo', name: 'TorchGeo Worker', icon: <Map size={14} />, desc: 'تحليل الأقمار الصناعية', req: '16GB RAM' },
      ]
    },
    {
      name: 'الاتصال والأمن',
      tools: [
        { id: 'mailu', name: 'Mailu Server', icon: <Mail size={14} />, desc: 'سيرفر البريد السيادي المشفر', req: '4GB RAM' },
        { id: 'vaultwarden', name: 'Vaultwarden', icon: <Lock size={14} />, desc: 'خزنة كلمات المرور للفريق', req: '512MB RAM' },
        { id: 'globaleaks', name: 'GlobaLeaks', icon: <Fingerprint size={14} />, desc: 'صندوق التسريبات الآمن', req: '2GB RAM' },
        { id: 'kasm', name: 'Kasm Isolation', icon: <Globe size={14} />, desc: 'متصفح معزول للتحقيق الآمن', req: '8GB RAM' },
      ]
    },
    {
      name: 'البنية التحتية والبيانات',
      tools: [
        { id: 'npm', name: 'Nginx Proxy Manager', icon: <Zap size={14} />, desc: 'الحارس وبوابة التوجيه', req: '512MB RAM' },
        { id: 'coolify', name: 'Coolify Manager', icon: <Server size={14} />, desc: 'المايسترو لإدارة السيرفر', req: '4GB RAM' },
        { id: 'n8n', name: 'n8n Automation', icon: <CloudLightning size={14} />, desc: 'أتمتة سير العمل الاستقصائي', req: '2GB RAM' },
        { id: 'minio', name: 'MinIO S3', icon: <Database size={14} />, desc: 'الخزنة المركزية (S3)', req: '2GB RAM' },
      ]
    }
  ];

  const provisioningLogs = [
    "Checking domain DNS resolution via Technitium...",
    "Injecting Sovereign Arsenal labels...",
    "Configuring Mailu Secure Domains and SSL...",
    "Initializing Ollama Native Environment...",
    "Linking RAGFlow with Neo4j Data Graph...",
    "Configuring yt-dlp for automated media ingest...",
    "Deployment complete. Sovereign Intelligence is active."
  ];

  const toggleService = (id: string) => {
    setFormData(prev => ({
      ...prev,
      service_stack: {
        ...prev.service_stack,
        [id]: !prev.service_stack[id]
      }
    }));
  };

  const handleAddDomain = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.domain_name || !formData.client_name) return;

    const newId = Math.random().toString(36).substr(2, 9);
    setProvisioningId(newId);
    setProvisioningStep(0);
    
    for (let i = 0; i <= provisioningLogs.length; i++) {
      setProvisioningStep(i);
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    const now = new Date().toISOString();
    const newDomain: Domain = {
      id: newId,
      domain_name: formData.domain_name,
      client_name: formData.client_name,
      status: 'active',
      service_stack: formData.service_stack,
      created_at: now,
      updated_at: now
    };

    setDomains([newDomain, ...domains]);
    setProvisioningId(null);
    setIsAdding(false);
    setFormData({ domain_name: '', client_name: '', service_stack: {} });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      <div className="bg-panel p-8 rounded-2xl border border-border-subtle shadow-elevation flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 bg-brand-primary text-white rounded-2xl flex items-center justify-center shadow-lg">
            <Globe size={32} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-text-primary">إدارة النطاقات والعملاء</h2>
            <p className="text-text-subtle text-sm">تجهيز غرف الأخبار الاستقصائية والاتصال السيادي المخصص.</p>
          </div>
        </div>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          disabled={!!provisioningId}
          className={`px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-md ${
            isAdding ? 'bg-canvas text-text-secondary' : 'bg-brand-accent text-canvas hover:scale-105 active:scale-95'
          }`}
        >
          {isAdding ? 'إلغاء' : <><Plus size={20} /> إضافة عميل جديد</>}
        </button>
      </div>

      {provisioningId && (
        <div className="bg-panel rounded-2xl p-8 text-white shadow-2xl border-b-8 border-brand-accent animate-in zoom-in-95 duration-300">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <Mail className="text-brand-accent animate-pulse" size={32} />
              <div>
                <h3 className="text-xl font-bold tracking-tight">جاري تجهيز الاتصال والبيئة لـ: {formData.domain_name}</h3>
                <p className="text-text-subtle text-xs">عملية النشر السيادي (Provisioning) قيد التنفيذ...</p>
              </div>
            </div>
            <div className="text-brand-accent font-mono text-3xl font-black">
              {Math.round((provisioningStep / provisioningLogs.length) * 100)}%
            </div>
          </div>
          <div className="bg-canvas p-5 rounded-2xl border border-border-subtle h-48 overflow-y-auto custom-scrollbar font-mono text-xs text-left" dir="ltr">
            {provisioningLogs.slice(0, provisioningStep).map((log, i) => (
              <div key={i} className="flex items-center gap-3 text-green-400 mb-2 border-l-2 border-green-500/30 pl-3">
                {/* Fixed: CheckCircle2 is now imported from lucide-react */}
                <CheckCircle2 size={14} className="flex-shrink-0" />
                <span>{log}</span>
              </div>
            ))}
            {provisioningStep < provisioningLogs.length && (
              <div className="flex items-center gap-3 text-brand-accent animate-pulse mb-2 border-l-2 border-brand-accent/30 pl-3">
                <Settings2 size={14} className="animate-spin" />
                <span>{provisioningLogs[provisioningStep]}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {isAdding && !provisioningId && (
        <div className="bg-panel p-8 rounded-2xl shadow-xl border border-border-subtle animate-in slide-in-from-top-4 duration-300">
          <h3 className="text-brand-primary font-black mb-8 flex items-center gap-2 text-xl border-b border-border-subtle pb-4">
            <Zap className="text-brand-accent" /> اختيار مكدس الترسانة السيادية (Sovereign Arsenal Stack)
          </h3>
          <form onSubmit={handleAddDomain} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-text-subtle text-xs font-bold uppercase tracking-widest">اسم النطاق الفرعي</label>
                <input 
                  required
                  placeholder="investigation.client.org"
                  className="w-full bg-canvas border border-border-subtle rounded-xl px-4 py-3 text-text-primary outline-none focus:ring-2 ring-brand-primary/10 font-mono"
                  value={formData.domain_name}
                  onChange={e => setFormData({...formData, domain_name: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-text-subtle text-xs font-bold uppercase tracking-widest">اسم المؤسسة المستفيدة</label>
                <input 
                  required
                  placeholder="وحدة التحقيق - تعز"
                  className="w-full bg-canvas border border-border-subtle rounded-xl px-4 py-3 text-text-primary outline-none focus:ring-2 ring-brand-primary/10"
                  value={formData.client_name}
                  onChange={e => setFormData({...formData, client_name: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-10">
                {toolCategories.map((cat, idx) => (
                  <div key={idx} className="space-y-4">
                    <h4 className="text-sm font-black text-brand-primary bg-brand-primary/10 px-4 py-2 rounded-lg inline-block border-r-4 border-brand-accent">{cat.name}</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {cat.tools.map(tool => (
                        <div key={tool.id} className="group relative">
                          <button
                            type="button"
                            onClick={() => toggleService(tool.id)}
                            className={`w-full p-4 rounded-xl border-2 transition-all flex items-center gap-3 text-right group ${
                              formData.service_stack[tool.id]
                              ? 'border-brand-primary bg-brand-primary/10 text-brand-primary shadow-md ring-4 ring-brand-primary/5'
                              : 'border-border-subtle bg-panel text-text-subtle hover:border-border-glass'
                            }`}
                          >
                            <div className={`p-2.5 rounded-lg transition-colors ${formData.service_stack[tool.id] ? 'bg-brand-primary text-white' : 'bg-canvas group-hover:bg-border-subtle'}`}>
                              {tool.icon}
                            </div>
                            <div className="flex-1 overflow-hidden text-right">
                                <span className="text-[11px] font-black uppercase block leading-none mb-1 truncate">{tool.name}</span>
                                <span className="text-[9px] opacity-60 block leading-tight truncate">{tool.req}</span>
                            </div>
                            {formData.service_stack[tool.id] && <CheckSquare size={16} className="text-brand-primary animate-in zoom-in duration-200" />}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end pt-6 border-t border-border-subtle">
              <button 
                type="submit"
                className="bg-brand-primary hover:bg-brand-primary-hover text-white px-12 py-4 rounded-xl font-black transition-all flex items-center gap-3 shadow-xl active:scale-95"
              >
                <Zap size={20} fill="currentColor" className="text-brand-accent" /> تفعيل ونشر الاتصال والترسانة السيادية
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Domain Table Section */}
      <div className="bg-panel rounded-2xl border border-border-subtle shadow-elevation overflow-hidden">
        <div className="p-6 border-b border-border-subtle flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="relative w-full md:w-96">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-text-subtle" size={18} />
            <input 
              type="text" 
              placeholder="البحث في الدومينات أو العملاء..."
              className="w-full bg-canvas border-none rounded-xl pr-10 pl-4 py-3 outline-none focus:ring-2 ring-brand-primary/10 text-sm text-text-primary"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-4">
             <div className="text-[10px] font-black text-text-subtle uppercase tracking-widest flex items-center gap-2">
                <Activity size={12} className="text-green-500" /> الحالة: جميع الأنظمة الاستقصائية مستقرة
             </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead className="bg-canvas/50">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-text-subtle uppercase">النطاق والعميل</th>
                <th className="px-6 py-4 text-xs font-bold text-text-subtle uppercase">المكدس المخصص</th>
                <th className="px-6 py-4 text-xs font-bold text-text-subtle uppercase text-center">الإدارة</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle">
              {domains.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-6 py-24 text-center">
                    <div className="flex flex-col items-center gap-3 opacity-30 grayscale">
                      <Globe size={48} />
                      <p className="text-sm font-bold">لا يوجد عملاء حالياً. ابدأ بتجهيز الاتصال والترسانة السيادية.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                domains.filter(d => d.domain_name.includes(searchTerm) || d.client_name.includes(searchTerm)).map(domain => (
                  <tr key={domain.id} className="hover:bg-canvas/80 transition-all group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4 text-right">
                        <div className="w-10 h-10 rounded-xl bg-brand-primary/10 text-brand-primary flex items-center justify-center font-bold">
                          <Server size={20} />
                        </div>
                        <div>
                          <span className="font-black text-brand-primary text-sm block">{domain.domain_name}</span>
                          <span className="text-[11px] text-text-subtle font-bold">{domain.client_name}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 flex-wrap max-w-[350px]">
                        {Object.entries(domain.service_stack).map(([key, active]) => active && (
                          <div key={key} className="flex items-center gap-1 px-2 py-1 bg-panel border border-border-subtle text-text-subtle rounded-lg text-[9px] font-bold hover:border-brand-accent transition-all uppercase">
                            {/* Fixed: CheckCircle2 is now imported from lucide-react */}
                            <CheckCircle2 size={10} className="text-green-500" />
                            {key}
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button className="p-2 text-text-subtle hover:text-brand-primary hover:bg-brand-primary/10 rounded-xl transition-all shadow-sm bg-canvas border border-border-subtle" title="إعدادات المكدس">
                          <Settings2 size={18} />
                        </button>
                        <button className="p-2 text-text-subtle hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all shadow-sm bg-canvas border border-border-subtle" title="حذف النطاق">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DomainManager;