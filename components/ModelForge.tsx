
import React, { useState, useEffect } from 'react';
import { Brain, Cloud, Server, Save, Download, Trash2, Edit3, Terminal, Activity, CheckCircle2, RotateCcw } from 'lucide-react';

const ModelForge: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'local' | 'cloud' | 'persona'>('local');
  const [localModels, setLocalModels] = useState<any[]>([]);
  const [pullTag, setPullTag] = useState('');
  const [isPulling, setIsPulling] = useState(false);
  const [personaConfig, setPersonaConfig] = useState('');

  // Fetch models on load
  useEffect(() => {
    // Mock data for demo
    setLocalModels([
        { name: 'qwen2.5:32b', size: '18GB', modified: '2 hours ago' },
        { name: 'llama3-sovereign:latest', size: '8GB', modified: '1 day ago' },
        { name: 'mistral-nemo:12b', size: '12GB', modified: '3 days ago' },
    ]);
    
    // Mock Persona Load
    setPersonaConfig(JSON.stringify({
        identity: { name: "المستشار الذكي لمنصة ريدان برو" },
        tone: { dialect: "Yemeni Institutional", strictness: "High" }
    }, null, 2));
  }, []);

  const handlePull = async () => {
    if(!pullTag) return;
    setIsPulling(true);
    // Call API
    setTimeout(() => {
        setIsPulling(false);
        setLocalModels(prev => [...prev, { name: pullTag, size: 'Pending...', modified: 'Just now' }]);
        setPullTag('');
    }, 2000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-700 pb-20 font-tajawal">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl flex items-center justify-between border border-slate-200 border-r-4 border-r-purple-600 shadow-tactical">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 bg-purple-600/10 rounded-2xl flex items-center justify-center text-purple-600 border border-purple-600/20">
            <Brain size={32} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-900 leading-none uppercase">ورشة النماذج (Model Forge)</h2>
            <p className="text-[10px] text-purple-600 font-bold uppercase tracking-[0.3em] mt-2">AI Brain Surgery & Persona Injection</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-2">
            <button onClick={() => setActiveTab('local')} className={`w-full p-4 rounded-xl flex items-center gap-3 transition-all ${activeTab === 'local' ? 'bg-purple-600 text-white shadow-md' : 'bg-white text-slate-600 hover:bg-slate-50'}`}>
                <Server size={18} />
                <span className="text-xs font-black uppercase">Local Models (Ollama)</span>
            </button>
            <button onClick={() => setActiveTab('cloud')} className={`w-full p-4 rounded-xl flex items-center gap-3 transition-all ${activeTab === 'cloud' ? 'bg-purple-600 text-white shadow-md' : 'bg-white text-slate-600 hover:bg-slate-50'}`}>
                <Cloud size={18} />
                <span className="text-xs font-black uppercase">Cloud Gateway (Gemini)</span>
            </button>
            <button onClick={() => setActiveTab('persona')} className={`w-full p-4 rounded-xl flex items-center gap-3 transition-all ${activeTab === 'persona' ? 'bg-purple-600 text-white shadow-md' : 'bg-white text-slate-600 hover:bg-slate-50'}`}>
                <Edit3 size={18} />
                <span className="text-xs font-black uppercase">Persona Matrix</span>
            </button>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm min-h-[500px]">
            
            {activeTab === 'local' && (
                <div className="space-y-6">
                    <div className="flex gap-4 items-end bg-slate-50 p-4 rounded-xl border border-slate-100">
                        <div className="flex-1 space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase">Pull New Model (Library Tag)</label>
                            <div className="relative">
                                <Terminal className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                <input 
                                    value={pullTag}
                                    onChange={(e) => setPullTag(e.target.value)}
                                    placeholder="e.g. qwen2.5-coder:14b" 
                                    className="w-full bg-white border border-slate-300 rounded-lg py-2.5 pl-10 pr-4 text-xs font-mono focus:border-purple-500 outline-none"
                                />
                            </div>
                        </div>
                        <button 
                            onClick={handlePull}
                            disabled={isPulling}
                            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2.5 rounded-lg font-bold text-xs uppercase tracking-widest flex items-center gap-2"
                        >
                            {isPulling ? <RotateCcw size={16} className="animate-spin" /> : <Download size={16} />}
                            Fetch
                        </button>
                    </div>

                    <div className="space-y-3">
                        {localModels.map((model, idx) => (
                            <div key={idx} className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-xl hover:border-purple-200 transition-all group">
                                <div className="flex items-center gap-4">
                                    <div className="p-2 bg-slate-100 rounded-lg text-slate-500 group-hover:text-purple-600 transition-colors">
                                        <Server size={20} />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-black text-slate-800 font-mono">{model.name}</h4>
                                        <p className="text-[10px] text-slate-500 font-bold uppercase">{model.size} • {model.modified}</p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button className="p-2 text-slate-400 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {activeTab === 'persona' && (
                <div className="space-y-6 h-full flex flex-col">
                    <div className="flex items-center justify-between">
                        <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
                            <Edit3 size={16} className="text-purple-600" />
                            مصفوفة الشخصية (JSON Configuration)
                        </h3>
                        <div className="flex gap-2">
                            <button className="text-[10px] font-bold text-purple-600 bg-purple-50 px-3 py-1.5 rounded-lg hover:bg-purple-100">Load Template</button>
                        </div>
                    </div>
                    <textarea 
                        value={personaConfig}
                        onChange={(e) => setPersonaConfig(e.target.value)}
                        className="flex-1 w-full bg-slate-900 text-green-400 font-mono text-xs p-6 rounded-xl outline-none resize-none shadow-inner border border-slate-800"
                        spellCheck={false}
                    />
                    <div className="flex justify-end pt-4">
                        <button className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest flex items-center gap-3 shadow-md active:scale-95">
                            <Save size={16} />
                            Inject Persona to Core
                        </button>
                    </div>
                </div>
            )}

            {activeTab === 'cloud' && (
                <div className="flex flex-col items-center justify-center h-full text-slate-400 space-y-4">
                    <Cloud size={64} className="opacity-20" />
                    <p className="text-sm font-bold uppercase tracking-widest">Cloud Model Management is synced via Env Vars.</p>
                </div>
            )}

        </div>
      </div>
    </div>
  );
};

export default ModelForge;
