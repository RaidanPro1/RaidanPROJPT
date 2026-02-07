import React, { useState } from 'react';
import { 
  Cpu, Brain, Shield, Globe, Settings, Key, 
  Save, RefreshCcw, Eye, EyeOff, Server, 
  CheckCircle2, CloudLightning,
  Lock, AlertTriangle, Sliders, Users,
  Check, Database, Zap, Activity,
  HeartPulse, Coins, Plane, Newspaper, Plus, Trash2,
  Filter, Search, ArrowUpRight, Network, Wifi,
  BarChart3, Thermometer, Satellite
} from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import { useLanguage } from '../context/LanguageContext';

type TabType = 'ai' | 'api_matrix' | 'watchlist' | 'telemetry';

const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('ai');
  const [isSaving, setIsSaving] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  
  const { settings, updateGoogleConfig, updateApiMatrix } = useSettings();

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setToastMsg('تم تحديث بروتوكولات النواة بنجاح.');
      setTimeout(() => setToastMsg(null), 3000);
    }, 1500);
  };

  const tabs = [
    { id: 'ai', label: 'الذكاء الهجين', icon: <Brain size={18} />, desc: 'Gemini, Ollama & Routing' },
    { id: 'api_matrix', label: 'مصفوفة الـ APIs', icon: <Network size={18} />, desc: 'Data Ingestion Matrix' },
    { id: 'watchlist', label: 'الرصد الاستراتيجي', icon: <Newspaper size={18} />, desc: 'Monitored News & Social' },
    { id: 'telemetry', label: 'القياس والتكلفة', icon: <BarChart3 size={18} />, desc: 'System Telemetry & Billing' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-700 pb-32 font-tajawal text-text-primary">
      
      {/* Settings Header */}
      <div className="bg-panel p-8 rounded-[2.5rem] flex flex-col md:flex-row items-center justify-between gap-6 border border-border-subtle border-r-8 border-r-brand-primary shadow-elevation relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>
        <div className="flex items-center gap-6 relative z-10">
          <div className="w-16 h-16 bg-brand-primary/10 rounded-3xl flex items-center justify-center text-brand-primary border border-brand-primary/20 shadow-glow-blue">
            <Settings size={32} />
          </div>
          <div>
            <h2 className="text-3xl font-black text-text-primary leading-none uppercase tracking-tighter">الإعدادات المتقدمة (Kernel Config)</h2>
            <p className="text-[10px] text-brand-primary font-black uppercase tracking-[0.4em] mt-2">Sovereign Strategic Matrix Control v2.2</p>
          </div>
        </div>
        
        {toastMsg && (
            <div className="bg-green-500/10 text-green-600 border border-green-500/20 px-6 py-2.5 rounded-full flex items-center gap-2 animate-in slide-in-from-top-4">
                <CheckCircle2 size={16} />
                <span className="text-xs font-black uppercase tracking-widest">{toastMsg}</span>
            </div>
        )}
      </div>

      <div className="flex flex-col lg:flex-row gap-6 min-h-[650px]">
        {/* Navigation Sidebar */}
        <div className="lg:w-80 flex flex-col gap-2">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={`w-full p-5 rounded-2xl border text-right transition-all flex items-center justify-between group relative overflow-hidden ${
                activeTab === tab.id 
                ? 'bg-brand-primary text-white border-transparent shadow-xl ring-4 ring-brand-primary/10' 
                : 'bg-panel border-border-subtle text-text-secondary hover:border-brand-primary/30 hover:bg-canvas'
              }`}
            >
              <div className="flex items-center gap-4 relative z-10">
                 <div className={`p-2.5 rounded-xl transition-colors ${activeTab === tab.id ? 'bg-white/20' : 'bg-canvas text-brand-primary group-hover:text-brand-accent'}`}>
                   {tab.icon}
                 </div>
                 <div className="overflow-hidden text-right">
                   <div className="text-xs font-black uppercase leading-none mb-1.5 truncate">{tab.label}</div>
                   <div className={`text-[9px] font-bold tracking-tight truncate ${activeTab === tab.id ? 'text-blue-100' : 'text-text-subtle'}`}>{tab.desc}</div>
                 </div>
              </div>
              {activeTab === tab.id && <ArrowUpRight size={14} className="text-white opacity-60 relative z-10" />}
            </button>
          ))}
          
          <div className="mt-auto bg-slate-900 p-6 rounded-3xl border border-slate-800 shadow-2xl relative overflow-hidden group">
             <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
             <div className="flex items-center gap-3 text-brand-accent mb-4">
                <Shield size={18} />
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Kernel Security</span>
             </div>
             <p className="text-[9px] text-slate-500 leading-relaxed font-bold uppercase mb-4">
                كافة التغييرات يتم تسجيلها في سجل التدقيق غير القابل للتلاعب (Immutable Audit Log).
             </p>
             <button className="text-[9px] font-black text-brand-accent hover:underline uppercase tracking-[0.2em] flex items-center gap-2">
                Download System Audit <DownloadIcon size={12}/>
             </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-panel rounded-[2.5rem] border border-border-subtle shadow-elevation overflow-hidden flex flex-col relative">
          <div className="p-10 flex-1 space-y-12 overflow-y-auto custom-scrollbar bg-canvas/30">
            
            {activeTab === 'ai' && (
              <div className="space-y-10 animate-in slide-in-from-right-4">
                  <div className="flex items-center justify-between border-b border-border-subtle pb-6">
                     <div>
                        <h3 className="text-xl font-black text-text-primary uppercase tracking-tighter">محرر الذكاء الهجين</h3>
                        <p className="text-[10px] text-text-subtle font-bold mt-1 uppercase tracking-widest">Global AI Engine & Adaptive Logic</p>
                     </div>
                     <div className="flex items-center gap-2 bg-brand-primary/10 px-4 py-2 rounded-xl border border-brand-primary/20">
                        <Activity size={14} className="text-brand-primary" />
                        <span className="text-[10px] font-black text-brand-primary uppercase">Engine Status: Optimal</span>
                     </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     <TacticalInput 
                        label="Google Gemini 1.5 API Key" 
                        value={settings.googleConfig.apiKey} 
                        onChange={(v) => updateGoogleConfig({ apiKey: v })} 
                        isSecret 
                        desc="تستخدم للبحث العميق والاستخبارات السحابية المفلترة."
                     />
                     <TacticalInput 
                        label="Ollama Native Host" 
                        value={settings.ollamaModels[0]?.id || 'localhost:11434'} 
                        onChange={() => {}} 
                        desc="محرك الذكاء الاصطناعي المحلي (السيادي)."
                     />
                  </div>
                  
                  <div className="space-y-4">
                     <label className="text-[10px] font-black text-text-subtle uppercase tracking-widest px-2">موجه النظام الأعظم (Master System Instruction)</label>
                     <textarea 
                        value={settings.googleConfig.systemInstruction}
                        onChange={(e) => updateGoogleConfig({ systemInstruction: e.target.value })}
                        rows={6}
                        className="w-full bg-canvas border-2 border-border-subtle rounded-3xl p-6 text-xs font-mono text-text-secondary outline-none focus:border-brand-primary transition-all shadow-inner leading-relaxed"
                     />
                  </div>
              </div>
            )}

            {activeTab === 'api_matrix' && (
              <div className="space-y-10 animate-in slide-in-from-right-4">
                  <div className="flex items-center justify-between border-b border-border-subtle pb-6">
                     <div>
                        <h3 className="text-xl font-black text-text-primary uppercase tracking-tighter">مصفوفة الربط (YemenCore Matrix)</h3>
                        <p className="text-[10px] text-text-subtle font-bold mt-1 uppercase tracking-widest">External Intelligence Ingestion Matrix</p>
                     </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     <div className="space-y-6">
                        <h4 className="text-[10px] font-black text-text-subtle uppercase tracking-[0.2em] flex items-center gap-2"><Satellite size={14} className="text-blue-500"/> الرصد الفضائي والبيئي</h4>
                        <TacticalInput label="Sentinel Hub API Key" value={settings.apiMatrix.nasaEarth} onChange={(v) => updateApiMatrix({ nasaEarth: v })} isSecret />
                        <TacticalInput label="OpenAQ Access Token" value={settings.apiMatrix.openAq} onChange={(v) => updateApiMatrix({ openAq: v })} isSecret />
                     </div>
                     <div className="space-y-6">
                        <h4 className="text-[10px] font-black text-text-subtle uppercase tracking-[0.2em] flex items-center gap-2"><Coins size={14} className="text-brand-accent"/> المؤشرات الاقتصادية</h4>
                        <TacticalInput label="Binance P2P Scraper Key" value={settings.apiMatrix.coinGecko} onChange={(v) => updateApiMatrix({ coinGecko: v })} isSecret />
                        <TacticalInput label="AlphaVantage (Stock/FX)" value={settings.apiMatrix.alphaVantage} onChange={(v) => updateApiMatrix({ alphaVantage: v })} isSecret />
                     </div>
                  </div>
              </div>
            )}
            
            {activeTab === 'telemetry' && (
              <div className="space-y-10 animate-in slide-in-from-right-4">
                  <div className="flex items-center justify-between border-b border-border-subtle pb-6">
                     <div>
                        <h3 className="text-xl font-black text-text-primary uppercase tracking-tighter">القياس وتحليل التكلفة</h3>
                        <p className="text-[10px] text-text-subtle font-bold mt-1 uppercase tracking-widest">Infrastructure Telemetry & AI Token Usage</p>
                     </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                     <MetricBox label="Server Uptime" value="142d 12h" unit="System" color="text-green-500" />
                     <MetricBox label="Avg Token Cost" value="$0.0012" unit="per 1k" color="text-brand-primary" />
                     <MetricBox label="Storage Health" value="84%" unit="Encrypted" color="text-brand-accent" />
                  </div>

                  <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800 shadow-2xl space-y-6">
                     <div className="flex items-center justify-between">
                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Real-time Bandwidth (Sovereign Proxy)</h4>
                        <div className="flex items-center gap-1.5">
                           <Wifi size={12} className="text-green-500" />
                           <span className="text-[9px] font-mono text-green-400">12.4 MB/s</span>
                        </div>
                     </div>
                     <div className="h-24 flex items-end gap-1 px-2">
                        {[...Array(40)].map((_, i) => (
                           <div key={i} className="flex-1 bg-brand-primary/20 rounded-t-sm animate-pulse" style={{ height: `${Math.random() * 100}%`, animationDelay: `${i * 50}ms` }}></div>
                        ))}
                     </div>
                  </div>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="p-6 bg-panel/90 border-t border-border-subtle flex justify-between items-center z-20 backdrop-blur-md">
            <div className="text-[10px] text-text-subtle font-mono uppercase tracking-widest flex items-center gap-3">
                <Lock size={12} className="text-green-500"/> Protocol: <span className="text-brand-primary font-black">SECURED_V2.2</span>
            </div>
            <button 
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center gap-3 bg-brand-accent hover:bg-brand-accent-glow text-slate-950 px-12 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all active:scale-95 shadow-lg"
              >
                {isSaving ? <RefreshCcw size={18} className="animate-spin" /> : <Save size={18} />}
                {isSaving ? 'جاري الحفظ...' : 'حفظ التكوين المركزي'}
              </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Reusable Components
const TacticalInput: React.FC<{ label: string, value: string, onChange: (val: string) => void, isSecret?: boolean, desc?: string }> = ({ label, value, onChange, isSecret, desc }) => {
  const [show, setShow] = useState(false);
  return (
    <div className="space-y-2 group">
      <label className="text-[10px] font-black text-text-subtle uppercase tracking-widest px-2 group-focus-within:text-brand-primary transition-colors">{label}</label>
      <div className="relative">
        <input 
          type={isSecret && !show ? 'password' : 'text'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-canvas border-2 border-border-subtle rounded-2xl px-5 py-3.5 text-xs font-mono text-text-primary outline-none focus:border-brand-primary transition-all shadow-inner placeholder-text-subtle"
          placeholder="Enter Matrix Key..."
        />
        {isSecret && (
          <button onClick={() => setShow(!show)} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-subtle hover:text-text-primary transition-colors">
            {show ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}
      </div>
      {desc && <p className="text-[9px] text-text-subtle font-bold uppercase px-2">{desc}</p>}
    </div>
  );
};

const MetricBox: React.FC<{label: string, value: string, unit: string, color: string}> = ({label, value, unit, color}) => (
   <div className="bg-canvas border border-border-subtle p-6 rounded-3xl shadow-inner group hover:border-brand-primary/20 transition-all">
      <span className="text-[9px] font-black text-text-subtle uppercase tracking-widest block mb-2">{label}</span>
      <div className="flex items-baseline gap-2">
         <span className={`text-2xl font-black ${color} tracking-tighter`}>{value}</span>
         <span className="text-[10px] font-bold text-text-subtle uppercase">{unit}</span>
      </div>
   </div>
);

const DownloadIcon = ({size}: {size: number}) => (
   <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
);

export default SettingsPage;