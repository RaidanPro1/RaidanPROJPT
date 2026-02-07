
import React, { useState, useEffect } from 'react';
import { 
  Brain, Cloud, Server, Save, Download, Trash2, Edit3, 
  Terminal, Activity, CheckCircle2, RotateCcw, Zap,
  Wand2, ShieldCheck, Microscope, Database, ArrowUpRight
} from 'lucide-react';

const ModelForge: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'local' | 'persona' | 'adapters'>('local');
  const [localModels, setLocalModels] = useState<any[]>([]);
  const [pullTag, setPullTag] = useState('');
  const [isPulling, setIsPulling] = useState(false);
  const [personaConfig, setPersonaConfig] = useState('');

  useEffect(() => {
    setLocalModels([
        { name: 'سيف (Saif-Sovereign):14b', size: '9.2GB', modified: 'Just now', status: 'active', type: 'Native' },
        { name: 'حكيم (Hakim-Local):8b', size: '4.7GB', modified: '2 days ago', status: 'standby', type: 'Native' },
        { name: 'نبراس (Nibras-Embed):latest', size: '274MB', modified: '1 week ago', status: 'active', type: 'Native' },
    ]);
    
    setPersonaConfig(JSON.stringify({
        identity: { 
            name: "المحقق الرقمي (YemenJPT Saif Agent)",
            role: "خبير استقصائي يمني ملتزم بقانون الصحافة 1990."
        },
        constraints: [
            "عدم تسريب بيانات المستخدم نهائياً (Native Mode Enforced)",
            "التدقيق الجنائي للمصادر قبل الإجابة",
            "استخدام اللهجة اليمنية الرسمية في التقارير الميدانية"
        ],
        safety_layer: "Strict_Yemen_Constitution_v2.0"
    }, null, 2));
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in duration-700 pb-20 font-tajawal text-text-primary">
      {/* Forge Header */}
      <div className="bg-panel p-6 rounded-3xl flex flex-col xl:flex-row items-center justify-between gap-6 border border-border-subtle border-r-8 border-r-purple-600 shadow-elevation relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>
        
        <div className="flex items-center gap-6 relative z-10">
          <div className="w-16 h-16 bg-purple-600/10 rounded-2xl flex items-center justify-center text-purple-600 border border-purple-600/20 shadow-glow-accent">
            <Brain size={32} />
          </div>
          <div>
            <h2 className="text-3xl font-black text-text-primary leading-none uppercase tracking-tight">ورشة النماذج السيادية (Model Forge)</h2>
            <div className="flex items-center gap-3 mt-3">
               <span className="text-[10px] text-purple-600 font-black uppercase tracking-[0.3em]">AI Brain Surgery & Persona Injection</span>
               <div className="h-3 w-px bg-border-subtle"></div>
               <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-[9px] font-black text-text-subtle uppercase tracking-widest px-1">Native Core: Optimized</span>
               </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 relative z-10">
           <div className="bg-canvas border border-border-subtle p-3 rounded-2xl flex items-center gap-5 shadow-inner">
              <div className="text-center">
                 <p className="text-[8px] font-black text-text-subtle uppercase tracking-widest mb-1">VRAM Ready</p>
                 <p className="text-xs font-mono font-black text-purple-600">22.4 GB</p>
              </div>
              <div className="w-px h-6 bg-border-subtle"></div>
              <div className="text-center">
                 <p className="text-[8px] font-black text-text-subtle uppercase tracking-widest mb-1">Quantization</p>
                 <p className="text-xs font-mono font-black text-green-500">INT8 / GGUF</p>
              </div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Navigation Sidebar */}
        <div className="lg:col-span-3 space-y-3">
            <ForgeTab id="local" label="الموديلات المحلية" active={activeTab} onClick={setActiveTab} icon={<Server size={18}/>} sub="Ollama Native Engine" />
            <ForgeTab id="persona" label="جراحة الشخصية" active={activeTab} onClick={setActiveTab} icon={<Microscope size={18}/>} sub="Persona & System Prompt" />
            <ForgeTab id="adapters" label="محولات اللهجة (LoRA)" active={activeTab} onClick={setActiveTab} icon={<Zap size={18}/>} sub="Adapters & Fine-tuning" />
            
            <div className="mt-8 p-6 bg-brand-primary/5 border border-brand-primary/20 rounded-2xl">
               <h4 className="text-[10px] font-black text-brand-primary uppercase tracking-widest mb-3 flex items-center gap-2"><ShieldCheck size={14}/> Sovereign Hardening</h4>
               <p className="text-[10px] text-text-secondary leading-relaxed font-bold">
                  تتم كافة المعالجات في الطبقة الصفرية (Native) للاستفادة القصوى من الـ GPU وتجنب تسريب البيانات.
               </p>
            </div>
        </div>

        {/* Dynamic Content Area */}
        <div className="lg:col-span-9 bg-panel rounded-[2.5rem] border border-border-subtle shadow-elevation overflow-hidden flex flex-col min-h-[600px] relative">
            
            {activeTab === 'local' && (
                <div className="p-8 space-y-8 animate-in slide-in-from-bottom-4">
                    <div className="flex gap-4 items-end bg-canvas p-6 rounded-3xl border border-border-subtle shadow-inner">
                        <div className="flex-1 space-y-3">
                            <label className="text-[10px] font-black text-text-subtle uppercase tracking-widest px-2">استيراد موديل جديد (Ollama Pull)</label>
                            <div className="relative group">
                                <Terminal className="absolute left-4 top-1/2 -translate-y-1/2 text-text-subtle group-focus-within:text-purple-500 transition-colors" size={18} />
                                <input 
                                    value={pullTag}
                                    onChange={(e) => setPullTag(e.target.value)}
                                    placeholder="مثال: qwen2.5-coder:14b" 
                                    className="w-full bg-panel border-2 border-border-subtle rounded-2xl py-4 pl-12 pr-6 text-sm font-mono focus:border-purple-500 outline-none text-text-primary transition-all"
                                />
                            </div>
                        </div>
                        <button 
                            onClick={() => {setIsPulling(true); setTimeout(() => setIsPulling(false), 2000)}}
                            disabled={isPulling || !pullTag}
                            className="bg-purple-600 hover:bg-purple-700 text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-lg transition-all flex items-center gap-3 disabled:opacity-50 active:scale-95"
                        >
                            {isPulling ? <RotateCcw size={18} className="animate-spin" /> : <Download size={18} />}
                            {isPulling ? 'جاري السحب...' : 'سحب الموديل'}
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {localModels.map((model, idx) => (
                            <div key={idx} className="bg-canvas border border-border-subtle rounded-2xl p-5 hover:border-purple-500/30 transition-all group relative overflow-hidden">
                                <div className="flex items-center justify-between relative z-10">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-panel rounded-xl text-text-subtle group-hover:text-purple-500 transition-colors shadow-sm">
                                            <Database size={20} />
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-black text-text-primary font-mono">{model.name}</h4>
                                            <p className="text-[10px] text-text-subtle font-bold uppercase mt-1">{model.size} • {model.type} Mode</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                       <button className="p-2 text-text-subtle hover:text-red-500 transition-all bg-panel rounded-lg border border-border-subtle"><Trash2 size={16} /></button>
                                    </div>
                                </div>
                                <div className="mt-4 flex items-center justify-between relative z-10">
                                   <span className={`text-[8px] font-black px-2.5 py-1 rounded-full uppercase ${model.status === 'active' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-panel text-text-subtle border border-border-subtle'}`}>
                                      {model.status}
                                   </span>
                                   <span className="text-[9px] font-bold text-text-subtle">{model.modified}</span>
                                </div>
                                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-600/5 rounded-full -mr-16 -mt-16 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {activeTab === 'persona' && (
                <div className="p-8 h-full flex flex-col space-y-6 animate-in slide-in-from-right-4">
                    <div className="flex items-center justify-between">
                        <div>
                           <h3 className="text-sm font-black text-text-primary uppercase tracking-widest flex items-center gap-2">
                               <Edit3 size={18} className="text-purple-500" /> مصفوفة الشخصية (JSON Logic)
                           </h3>
                           <p className="text-[10px] text-text-subtle font-bold mt-1 uppercase tracking-tighter">هنا يتم حقن الدستور الرقمي والقيود القانونية.</p>
                        </div>
                        <div className="flex gap-3">
                            <button className="px-4 py-2 bg-canvas border border-border-subtle rounded-xl text-[10px] font-black uppercase text-text-subtle hover:text-purple-500 transition-all">تحميل الدستور اليمني</button>
                        </div>
                    </div>
                    <div className="flex-1 relative">
                        <textarea 
                            value={personaConfig}
                            onChange={(e) => setPersonaConfig(e.target.value)}
                            className="w-full h-full bg-slate-950 text-green-400 font-mono text-xs p-8 rounded-3xl outline-none resize-none shadow-inner border border-slate-800 leading-relaxed"
                            spellCheck={false}
                        />
                        <div className="absolute bottom-6 left-6 text-[8px] font-mono text-slate-600 uppercase tracking-widest pointer-events-none">Sovereign_Persona_Core_v2.0</div>
                    </div>
                    <div className="flex justify-end pt-4 gap-4">
                        <button className="px-8 py-4 bg-canvas border border-border-subtle rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-panel transition-all">إعادة ضبط</button>
                        <button className="bg-purple-600 hover:bg-purple-700 text-white px-12 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.3em] shadow-glow-accent transition-all active:scale-95 flex items-center gap-3">
                            <Zap size={18} fill="currentColor" /> حقن في الموديل (Inject)
                        </button>
                    </div>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

const ForgeTab: React.FC<{id: string, label: string, icon: React.ReactNode, sub: string, active: string, onClick: (id: any) => void}> = ({id, label, icon, sub, active, onClick}) => (
    <button 
      onClick={() => onClick(id)}
      className={`w-full p-5 rounded-2xl border text-right transition-all flex items-center justify-between group ${
        active === id 
        ? 'bg-purple-600 text-white border-transparent shadow-xl ring-4 ring-purple-600/10 scale-[1.02]' 
        : 'bg-panel border-border-subtle text-text-secondary hover:border-purple-600/30 hover:bg-canvas'
      }`}
    >
        <div className="flex items-center gap-4">
           <div className={`p-2.5 rounded-xl transition-colors ${active === id ? 'bg-white/20' : 'bg-canvas text-purple-600 group-hover:text-purple-500'}`}>
              {icon}
           </div>
           <div className="overflow-hidden text-right">
              <div className="text-xs font-black uppercase leading-none mb-1.5 truncate">{label}</div>
              <div className={`text-[8px] font-bold uppercase tracking-tighter truncate ${active === id ? 'text-purple-100' : 'text-text-subtle'}`}>{sub}</div>
           </div>
        </div>
        {active === id && <ArrowUpRight size={14} className="text-white opacity-60" />}
    </button>
);

export default ModelForge;
