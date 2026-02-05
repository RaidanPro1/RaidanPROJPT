
import React, { useState } from 'react';
import { 
  BookText, Scale, Shield, Brain, SlidersHorizontal, 
  Database, Zap, Save, RefreshCcw, Search, AlertTriangle, CheckCircle2,
  Check, CloudLightning, Lock, Server, GitBranch, Thermometer
} from 'lucide-react';
import { useSettings, RoutingScenario } from '../context/SettingsContext';

type Tab = 'hybrid_orchestrator' | 'legal' | 'models' | 'knowledge';

const GovernancePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('hybrid_orchestrator');
  const { settings, updateSetting, updateGoogleConfig, setRoutingScenario, userRole } = useSettings();
  
  // Local state for text areas to prevent excessive re-renders
  const [sysInstruction, setSysInstruction] = useState(settings.googleConfig.systemInstruction);

  if (userRole !== 'root') {
      return (
          <div className="flex flex-col items-center justify-center h-[600px] text-center space-y-4">
              <Shield size={64} className="text-slate-300" />
              <h2 className="text-xl font-black text-slate-700 uppercase">صلاحيات الوصول مقيدة</h2>
              <p className="text-sm text-slate-500">إدارة العقيدة والذكاء الهجين تتطلب صلاحيات (Root Authority).</p>
          </div>
      );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-700 pb-20 font-tajawal">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl flex flex-col xl:flex-row items-center justify-between gap-6 border border-slate-200 border-r-4 border-r-yemenBlue shadow-tactical">
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 bg-yemenBlue/10 rounded-xl flex items-center justify-center text-yemenBlue border border-yemenBlue/20">
            <GitBranch size={28} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-900 leading-none uppercase">منسق الذكاء الهجين (The Orchestrator)</h2>
            <p className="text-[10px] text-yemenBlue font-bold uppercase tracking-[0.3em] mt-2">Routing Logic • Safety Filters • Sovereign Context</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
            <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full uppercase">
                Active Scenario: <span className="text-yemenBlue">{settings.activeRoutingScenario.replace('_', ' ').toUpperCase()}</span>
            </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-slate-100 p-2 rounded-xl border border-slate-200 flex flex-wrap gap-2">
        <TabButton id="hybrid_orchestrator" activeTab={activeTab} setActiveTab={setActiveTab} icon={<GitBranch />}>استراتيجية التوجيه</TabButton>
        <TabButton id="legal" activeTab={activeTab} setActiveTab={setActiveTab} icon={<Scale />}>الدستور الرقمي</TabButton>
        <TabButton id="models" activeTab={activeTab} setActiveTab={setActiveTab} icon={<Brain />}>تخصيص Gemini</TabButton>
        <TabButton id="knowledge" activeTab={activeTab} setActiveTab={setActiveTab} icon={<Database />}>مصادر المعرفة</TabButton>
      </div>

      {/* Tab Content */}
      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm min-h-[600px]">
        
        {activeTab === 'hybrid_orchestrator' && (
            <div className="space-y-8 animate-in fade-in-25">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Scenario A */}
                    <div 
                        onClick={() => setRoutingScenario('scenario_a')}
                        className={`p-6 rounded-2xl border-2 cursor-pointer transition-all relative overflow-hidden group ${settings.activeRoutingScenario === 'scenario_a' ? 'border-yemenBlue bg-blue-50/50' : 'border-slate-200 hover:border-slate-300'}`}
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-red-100 text-red-600 rounded-xl"><Lock size={20} /></div>
                            {settings.activeRoutingScenario === 'scenario_a' && <CheckCircle2 size={20} className="text-yemenBlue" />}
                        </div>
                        <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-2">Scenario A: High Security</h3>
                        <p className="text-[10px] text-slate-600 leading-relaxed font-bold">
                            عزل تام. استخدام النماذج المحلية (Local LLM) فقط لأي وثائق أو استفسارات. يمنع الاتصال بـ Google Gemini نهائياً.
                        </p>
                        <div className="mt-4 flex gap-2">
                            <span className="text-[8px] bg-white border border-slate-200 px-2 py-1 rounded font-mono">OFFLINE_ONLY</span>
                        </div>
                    </div>

                    {/* Scenario B */}
                    <div 
                        onClick={() => setRoutingScenario('scenario_b')}
                        className={`p-6 rounded-2xl border-2 cursor-pointer transition-all relative overflow-hidden group ${settings.activeRoutingScenario === 'scenario_b' ? 'border-yemenBlue bg-blue-50/50' : 'border-slate-200 hover:border-slate-300'}`}
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-purple-100 text-purple-600 rounded-xl"><Search size={20} /></div>
                            {settings.activeRoutingScenario === 'scenario_b' && <CheckCircle2 size={20} className="text-yemenBlue" />}
                        </div>
                        <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-2">Scenario B: Research Mode</h3>
                        <p className="text-[10px] text-slate-600 leading-relaxed font-bold">
                            أولوية للبحث. استخدام Gemini Pro 1.5 مع Google Grounding للبحث في الويب وتلخيص التقارير الدولية المفتوحة.
                        </p>
                        <div className="mt-4 flex gap-2">
                            <span className="text-[8px] bg-white border border-slate-200 px-2 py-1 rounded font-mono">WEB_ACCESS</span>
                        </div>
                    </div>

                    {/* Scenario C */}
                    <div 
                        onClick={() => setRoutingScenario('scenario_c')}
                        className={`p-6 rounded-2xl border-2 cursor-pointer transition-all relative overflow-hidden group ${settings.activeRoutingScenario === 'scenario_c' ? 'border-yemenBlue bg-blue-50/50' : 'border-slate-200 hover:border-slate-300'}`}
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-yemenGold/20 text-yemenBlue-dark rounded-xl"><GitBranch size={20} /></div>
                            {settings.activeRoutingScenario === 'scenario_c' && <CheckCircle2 size={20} className="text-yemenBlue" />}
                        </div>
                        <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-2">Scenario C: Hybrid (Adaptive)</h3>
                        <p className="text-[10px] text-slate-600 leading-relaxed font-bold">
                            الوضع الذكي. استخدام Local LLM للصياغة الأولية والبيانات الحساسة، و Gemini للتدقيق اللغوي والبحث عن معلومات تكميلية غير سرية.
                        </p>
                        <div className="mt-4 flex gap-2">
                            <span className="text-[8px] bg-white border border-slate-200 px-2 py-1 rounded font-mono">AUTO_ROUTING</span>
                        </div>
                    </div>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 mt-8">
                    <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <Server size={14} className="text-yemenBlue" />
                        حالة مسارات التوجيه (Routing Paths Status)
                    </h4>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center bg-white p-3 rounded-xl border border-slate-100">
                            <span className="text-[10px] font-bold text-slate-600">Local Pathway (Ollama/Qwen)</span>
                            <span className="text-[9px] font-black text-green-600 bg-green-50 px-2 py-1 rounded uppercase">Active / Secure</span>
                        </div>
                        <div className={`flex justify-between items-center bg-white p-3 rounded-xl border border-slate-100 opacity-${settings.activeRoutingScenario === 'scenario_a' ? '50' : '100'}`}>
                            <span className="text-[10px] font-bold text-slate-600">Cloud Pathway (Google Gemini)</span>
                            <span className={`text-[9px] font-black px-2 py-1 rounded uppercase ${settings.activeRoutingScenario === 'scenario_a' ? 'text-red-600 bg-red-50' : 'text-blue-600 bg-blue-50'}`}>
                                {settings.activeRoutingScenario === 'scenario_a' ? 'Blocked (Firewall)' : 'Filtered Proxy'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        )}

        {activeTab === 'models' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in-25">
                <div className="space-y-6">
                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                        <Brain size={16} className="text-yemenGold" />
                        تخصيص نموذج Gemini
                    </h3>
                    
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-500 uppercase px-1">System Instruction (Context Injection)</label>
                        <textarea 
                            className="w-full h-64 bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs text-slate-800 outline-none focus:border-yemenBlue transition-all font-mono leading-relaxed"
                            placeholder="تعليمات النظام المحقونة..."
                            value={sysInstruction}
                            onChange={(e) => setSysInstruction(e.target.value)}
                            onBlur={() => updateGoogleConfig({ systemInstruction: sysInstruction })}
                        />
                        <p className="text-[9px] text-slate-400">سيتم إرسال هذه التعليمات مع كل طلب لـ Gemini لضمان السياق اليمني.</p>
                    </div>
                </div>

                <div className="space-y-8 pt-2">
                    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-6">
                        <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest">ضوابط الإبداع والأمان</h4>
                        
                        <SliderControl 
                            label="Creativity (Temperature)" 
                            min={0} max={1} step={0.1} 
                            defaultValue={settings.googleConfig.temperature}
                            unit=""
                            onChange={(val) => updateGoogleConfig({ temperature: val })}
                            icon={<Thermometer size={14} />}
                        />

                        <div className="space-y-3">
                            <label className="text-xs font-black text-slate-600 uppercase tracking-widest flex items-center gap-2">
                                <Shield size={14} /> فلاتر الأمان (Safety Filters)
                            </label>
                            <div className="grid grid-cols-3 gap-2">
                                {['block_all', 'block_some', 'allow_adult'].map((level) => (
                                    <button 
                                        key={level}
                                        onClick={() => updateGoogleConfig({ safetyThreshold: level as any })}
                                        className={`py-2 rounded-lg text-[9px] font-black uppercase border transition-all ${settings.googleConfig.safetyThreshold === level ? 'bg-yemenBlue text-white border-yemenBlue' : 'bg-white text-slate-500 border-slate-200'}`}
                                    >
                                        {level.replace('_', ' ')}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )}

        {/* Other tabs remain similar but simplified for brevity in this update */}
        {activeTab === 'legal' && <div className="p-12 text-center text-slate-400 text-sm">تم نقل إعدادات الدستور إلى صفحة منفصلة.</div>}
        {activeTab === 'knowledge' && <div className="p-12 text-center text-slate-400 text-sm">إعدادات RAG تحت الصيانة.</div>}

      </div>
    </div>
  );
};

const TabButton: React.FC<{id: Tab, activeTab: Tab, setActiveTab: (t: Tab) => void, icon: React.ReactNode, children: React.ReactNode}> = ({ id, activeTab, setActiveTab, icon, children }) => (
  <button 
    onClick={() => setActiveTab(id)}
    className={`flex-1 px-5 py-3 rounded-lg text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-3 ${
      activeTab === id ? 'bg-white text-yemenBlue shadow-md border border-slate-100' : 'text-slate-500 hover:bg-white/50'
    }`}
  >
    {icon} {children}
  </button>
);

const SliderControl: React.FC<{label: string, min: number, max: number, step: number, defaultValue: number, unit?: string, onChange: (val: number) => void, icon?: React.ReactNode}> = ({label, min, max, step, defaultValue, unit, onChange, icon}) => {
    const [value, setValue] = useState(defaultValue);
    return (
        <div className="space-y-3">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                    {icon}
                    <label className="text-xs font-black text-slate-600 uppercase tracking-widest">{label}</label>
                </div>
                <span className="text-sm font-mono font-bold text-yemenBlue bg-blue-50 px-3 py-1 rounded-md border border-blue-100">{value}{unit}</span>
            </div>
            <input 
                type="range"
                min={min}
                max={max}
                step={step}
                value={value}
                onChange={(e) => { setValue(Number(e.target.value)); onChange(Number(e.target.value)); }}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-yemenBlue" 
            />
        </div>
    );
};

export default GovernancePage;
