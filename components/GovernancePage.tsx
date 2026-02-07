
import React, { useState } from 'react';
import { 
  BookText, Scale, Shield, Brain, SlidersHorizontal, 
  Database, Zap, Save, RefreshCcw, Search, AlertTriangle, CheckCircle2,
  Check, CloudLightning, Lock, Server, GitBranch, Thermometer,
  Eye, FileText, Gavel, ShieldCheck, HeartPulse, Globe
} from 'lucide-react';
import { useSettings, RoutingScenario } from '../context/SettingsContext';

type Tab = 'constitution' | 'orchestrator' | 'safety' | 'ethics';

const GovernancePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('constitution');
  const { settings, updateGoogleConfig, setRoutingScenario, userRole } = useSettings();

  return (
    <div className="space-y-6 animate-in fade-in duration-700 pb-20 font-tajawal text-text-primary">
      {/* Doctrine Header */}
      <div className="bg-panel p-6 rounded-3xl flex flex-col xl:flex-row items-center justify-between gap-6 border border-border-subtle border-r-8 border-r-brand-primary shadow-elevation relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>
        
        <div className="flex items-center gap-6 relative z-10">
          <div className="w-16 h-16 bg-brand-primary/10 rounded-2xl flex items-center justify-center text-brand-primary border border-brand-primary/20 shadow-inner">
            <BookText size={32} />
          </div>
          <div>
            <h2 className="text-3xl font-black text-text-primary leading-none uppercase tracking-tight">عقيدة النظام (System Doctrine)</h2>
            <div className="flex items-center gap-3 mt-3">
               <span className="text-[10px] text-brand-primary font-black uppercase tracking-[0.3em]">Digital Ethics & Sovereign Protocol</span>
               <div className="h-3 w-px bg-border-subtle"></div>
               <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse shadow-glow-green"></div>
                  <span className="text-[9px] font-black text-text-subtle uppercase tracking-widest px-1">Enforcement: Active</span>
               </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 relative z-10">
            <div className="bg-slate-900 px-6 py-3 rounded-2xl border border-slate-800 flex items-center gap-4 shadow-xl">
               <div className="text-center">
                  <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Risk Level</p>
                  <p className="text-xs font-black text-green-500 uppercase">Minimal</p>
               </div>
               <div className="w-px h-6 bg-slate-800"></div>
               <div className="text-center">
                  <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Compliance</p>
                  <p className="text-xs font-black text-brand-accent uppercase tracking-tighter">Verified_98%</p>
               </div>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Navigation Tabs */}
        <div className="lg:col-span-3 space-y-3">
            <GovernanceTab id="constitution" label="الدستور الرقمي" icon={<Gavel size={18}/>} sub="Yemeni Law Mapping" active={activeTab} onClick={setActiveTab} />
            <GovernanceTab id="orchestrator" label="منسق التوجيه" icon={<GitBranch size={18}/>} sub="AIRouter Logic" active={activeTab} onClick={setActiveTab} />
            <GovernanceTab id="safety" label="فلاتر الأمان" icon={<ShieldCheck size={18}/>} iconColor="text-green-500" sub="Content Moderation" active={activeTab} onClick={setActiveTab} />
            <GovernanceTab id="ethics" label="حوكمة البيانات" icon={<Lock size={18}/>} iconColor="text-red-500" sub="Privacy & RLS Protocols" active={activeTab} onClick={setActiveTab} />
        </div>

        {/* Content Area */}
        <div className="lg:col-span-9 bg-panel rounded-[2.5rem] border border-border-subtle shadow-elevation min-h-[600px] flex flex-col relative overflow-hidden">
            
            {activeTab === 'constitution' && (
                <div className="p-10 space-y-10 animate-in slide-in-from-bottom-4">
                    <div className="flex flex-col md:flex-row gap-10 items-start">
                        <div className="flex-1 space-y-6">
                           <h3 className="text-xl font-black text-text-primary uppercase tracking-tighter border-b border-border-subtle pb-4">القوانين المدمجة في منطق الترسانة</h3>
                           <div className="space-y-4">
                              <LawItem id="L1" law="قانون الصحافة (1990)" desc="الالتزام بعدم نشر ما يمس العقيدة أو يثير الأحقاد." active />
                              <LawItem id="L2" law="قانون الجرائم (المادة 255)" desc="حماية الخصوصية ومنع تحليل البيانات الشخصية." active />
                              <LawItem id="L3" law="ميثاق الشرف الصحفي" desc="المصداقية، الحياد، ونسب المعلومات لمصادرها." active />
                           </div>
                        </div>
                        <div className="w-full md:w-80 bg-canvas p-6 rounded-3xl border border-border-subtle shadow-inner">
                           <h4 className="text-[10px] font-black text-brand-primary uppercase tracking-widest mb-6 flex items-center gap-2"><Shield size={14}/> بصمة التدريع (Hardening)</h4>
                           <div className="space-y-6">
                              <StatCircle label="Constitutional Alignment" val={98} />
                              <div className="p-4 bg-panel rounded-2xl border border-border-subtle">
                                 <p className="text-[9px] text-text-subtle leading-relaxed font-bold uppercase">
                                    تتم مراجعة كافة المخرجات آلياً عبر طبقة الحوكمة قبل عرضها على المحقق.
                                 </p>
                              </div>
                           </div>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'orchestrator' && (
                <div className="p-10 space-y-8 animate-in fade-in">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <ScenarioCard 
                           id="scenario_a" 
                           title="السيادة القصوى (Strict)" 
                           icon={<Lock size={20}/>} 
                           desc="عزل تام عن الإنترنت. استخدام Ollama Native فقط. لا يتم استخدام Gemini."
                           active={settings.activeRoutingScenario === 'scenario_a'}
                           onClick={() => setRoutingScenario('scenario_a')}
                           color="border-red-500"
                        />
                        <ScenarioCard 
                           id="scenario_b" 
                           title="البحث المفتوح (Research)" 
                           icon={<Globe size={20}/>} 
                           desc="تفعيل Gemini Pro مع Google Search للتحقق من المصادر العالمية المفتوحة."
                           active={settings.activeRoutingScenario === 'scenario_b'}
                           onClick={() => setRoutingScenario('scenario_b')}
                           color="border-brand-primary"
                        />
                        <ScenarioCard 
                           id="scenario_c" 
                           title="الوضع الهجين (Adaptive)" 
                           icon={<GitBranch size={20}/>} 
                           desc="التوجيه التلقائي: البيانات الحساسة محلياً، والتدقيق اللغوي والبحث سحابياً."
                           active={settings.activeRoutingScenario === 'scenario_c'}
                           onClick={() => setRoutingScenario('scenario_c')}
                           color="border-brand-accent"
                        />
                    </div>
                    
                    <div className="bg-canvas border border-border-subtle rounded-3xl p-8 shadow-inner">
                        <div className="flex items-center justify-between mb-6">
                           <h4 className="text-xs font-black text-text-primary uppercase tracking-widest">مصفوفة التوجيه الذكي (Routing Matrix)</h4>
                           <div className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-brand-primary rounded-full animate-pulse"></div>
                              <span className="text-[9px] font-black text-brand-primary uppercase">Autonomous Control</span>
                           </div>
                        </div>
                        <div className="space-y-4">
                           <RoutingLogic label="تحليل صور الأقمار الصناعية (Sentinel)" target="Local Worker (Ray Cluster)" />
                           <RoutingLogic label="تفريغ التسجيلات الصوتية (Whisper)" target="Local Node (Native CPU)" />
                           <RoutingLogic label="تحليل المشاعر (Sentiment Analysis)" target="Local Node (AraBERT)" />
                           <RoutingLogic label="البحث عن أخبار عالمية (NewsAPI)" target="Cloud Gateway (Gemini Grounding)" />
                        </div>
                    </div>
                </div>
            )}
            
            {activeTab === 'safety' && (
              <div className="p-10 space-y-10 animate-in slide-in-from-right-4">
                 <div className="bg-canvas p-8 rounded-3xl border border-border-subtle shadow-inner space-y-10">
                    <SliderControl 
                        label="عتبة الحظر التلقائي (Safety Threshold)" 
                        min={0} max={100} step={1} 
                        val={75} unit="%"
                        desc="تتحكم في مدى صرامة النظام في حظر المحتوى المثير للجدل."
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-border-subtle">
                       <SafetyToggle label="حظر خطابات الكراهية" active />
                       <SafetyToggle label="حظر المعلومات المضللة (Deepfake)" active />
                       <SafetyToggle label="منع كشف الهويات (PII Anonymization)" active />
                       <SafetyToggle label="تصفية الانحياز السياسي" />
                    </div>
                 </div>
              </div>
            )}
        </div>
      </div>
    </div>
  );
};

const GovernanceTab: React.FC<{id: Tab, label: string, icon: React.ReactNode, sub: string, active: string, onClick: (id: Tab) => void, iconColor?: string}> = ({id, label, icon, sub, active, onClick, iconColor = 'text-brand-primary'}) => (
    <button 
      onClick={() => onClick(id)}
      className={`w-full p-5 rounded-2xl border text-right transition-all flex items-center justify-between group ${
        active === id 
        ? 'bg-brand-primary text-white border-transparent shadow-xl ring-4 ring-brand-primary/10' 
        : 'bg-panel border-border-subtle text-text-secondary hover:border-brand-primary/30 hover:bg-canvas'
      }`}
    >
        <div className="flex items-center gap-4">
           <div className={`p-2.5 rounded-xl transition-colors ${active === id ? 'bg-white/20' : `bg-canvas ${iconColor}`}`}>
              {icon}
           </div>
           <div className="overflow-hidden text-right">
              <div className="text-xs font-black uppercase leading-none mb-1.5 truncate">{label}</div>
              <div className={`text-[8px] font-bold uppercase tracking-tighter truncate ${active === id ? 'text-blue-100' : 'text-text-subtle'}`}>{sub}</div>
           </div>
        </div>
    </button>
);

const LawItem: React.FC<{id: string, law: string, desc: string, active?: boolean}> = ({id, law, desc, active}) => (
  <div className="flex items-start gap-4 p-5 bg-canvas rounded-2xl border border-border-subtle hover:border-brand-primary/20 transition-all group">
     <div className="w-10 h-10 bg-panel rounded-xl flex items-center justify-center font-black text-brand-primary text-xs shadow-sm group-hover:scale-110 transition-transform">{id}</div>
     <div>
        <h4 className="text-sm font-black text-text-primary mb-1">{law}</h4>
        <p className="text-[11px] text-text-subtle leading-relaxed font-medium">{desc}</p>
     </div>
     {active && <CheckCircle2 size={16} className="text-green-500 ml-auto shrink-0" />}
  </div>
);

const ScenarioCard: React.FC<{id: string, title: string, icon: React.ReactNode, desc: string, active: boolean, onClick: () => void, color: string}> = ({title, icon, desc, active, onClick, color}) => (
  <div 
    onClick={onClick}
    className={`p-6 rounded-[2.5rem] border-2 cursor-pointer transition-all relative overflow-hidden group h-full flex flex-col ${active ? `${color} bg-panel shadow-xl ring-4 ring-brand-primary/5` : 'border-border-subtle bg-canvas opacity-70 hover:opacity-100'}`}
  >
     <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-2xl ${active ? 'bg-brand-primary text-white shadow-lg' : 'bg-panel text-text-subtle'}`}>{icon}</div>
        {active && <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-glow-green"></div>}
     </div>
     <h4 className="text-xs font-black text-text-primary uppercase mb-3 tracking-widest">{title}</h4>
     <p className="text-[10px] text-text-subtle leading-relaxed font-bold uppercase">{desc}</p>
  </div>
);

const RoutingLogic: React.FC<{label: string, target: string}> = ({label, target}) => (
  <div className="flex items-center justify-between p-4 bg-panel border border-border-subtle rounded-xl hover:bg-canvas transition-colors">
     <span className="text-[11px] font-bold text-text-secondary uppercase">{label}</span>
     <div className="flex items-center gap-3">
        <div className="h-px w-10 bg-border-subtle"></div>
        <span className="text-[9px] font-mono font-black text-brand-primary bg-brand-primary/5 px-2.5 py-1 rounded border border-brand-primary/10 uppercase">{target}</span>
     </div>
  </div>
);

const StatCircle: React.FC<{label: string, val: number}> = ({label, val}) => (
  <div className="flex flex-col items-center">
     <div className="relative w-24 h-24 mb-3">
        <svg className="w-full h-full transform -rotate-90">
           <circle cx="48" cy="48" r="42" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-slate-800" />
           <circle cx="48" cy="48" r="42" stroke="currentColor" strokeWidth="6" fill="transparent" strokeDasharray={264} strokeDashoffset={264 - (264 * val) / 100} strokeLinecap="round" className="text-brand-accent transition-all duration-1000" />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
           <span className="text-xl font-black text-text-primary">{val}%</span>
        </div>
     </div>
     <span className="text-[9px] font-black text-text-subtle uppercase tracking-widest text-center">{label}</span>
  </div>
);

const SafetyToggle: React.FC<{label: string, active?: boolean}> = ({label, active}) => (
  <div className="flex items-center justify-between p-4 bg-panel border border-border-subtle rounded-2xl">
     <span className="text-xs font-black text-text-primary uppercase tracking-tight">{label}</span>
     <button className={`w-12 h-6 rounded-full p-1 transition-all ${active ? 'bg-brand-primary justify-end shadow-glow-blue' : 'bg-slate-300 justify-start'}`}>
        <div className="w-4 h-4 bg-white rounded-full shadow-md"></div>
     </button>
  </div>
);

const SliderControl: React.FC<{label: string, min: number, max: number, step: number, val: number, unit: string, desc: string}> = ({label, min, max, step, val, unit, desc}) => (
  <div className="space-y-4">
     <div className="flex justify-between items-center px-1">
        <div className="space-y-1">
           <label className="text-xs font-black text-text-primary uppercase tracking-widest">{label}</label>
           <p className="text-[9px] text-text-subtle font-bold uppercase">{desc}</p>
        </div>
        <span className="text-sm font-mono font-black text-brand-primary bg-brand-primary/10 px-3 py-1 rounded-lg border border-brand-primary/20">{val}{unit}</span>
     </div>
     <input type="range" min={min} max={max} step={step} defaultValue={val} className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-brand-primary" />
  </div>
);

export default GovernancePage;
