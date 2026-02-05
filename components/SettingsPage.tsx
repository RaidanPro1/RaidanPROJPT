
import React, { useState } from 'react';
import { 
  Cpu, Brain, Shield, Globe, Settings, Key, 
  Save, RefreshCcw, Eye, EyeOff, Server, 
  CheckCircle2, CloudLightning,
  Lock, AlertTriangle, Sliders, Users,
  Check
} from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import { useLanguage } from '../context/LanguageContext';

type TabType = 'core' | 'ai' | 'tools' | 'sources' | 'identity_providers';

const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('ai');
  const [isSaving, setIsSaving] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  
  const { settings, updateSetting, updateGoogleConfig, setDefaultOllamaModel, userRole } = useSettings();
  const { t } = useLanguage();

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setToastMsg('تم تحديث بروتوكولات النواة بنجاح.');
      setTimeout(() => setToastMsg(null), 3000);
    }, 1500);
  };

  const tabs = [
    { id: 'core', label: 'النواة والموارد', icon: <Cpu size={18} />, desc: 'إدارة البنية التحتية' },
    { id: 'ai', label: 'مصفوفة الذكاء الاصطناعي', icon: <Brain size={18} />, desc: 'Gemini, Ollama & Governance' },
    { id: 'tools', label: 'أدوات التحقيق', icon: <Shield size={18} />, desc: 'تفعيل وحدات الخدمة' },
    { id: 'identity_providers', label: t('settings_idps'), icon: <Users size={18}/>, desc: t('settings_idps_desc') },
    { id: 'sources', label: 'مصادر البيانات', icon: <Globe size={18} />, desc: 'الرصد والربط الخارجي' },
  ];

  return (
    <div className="min-h-[800px] space-y-6 animate-in fade-in duration-700 pb-32 font-tajawal relative text-text-primary">
      
      {/* Page Header */}
      <div className="glass-panel p-8 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6 border border-border-subtle shadow-elevation relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>
        <div className="flex items-center gap-6 relative z-10">
          <div className="w-16 h-16 bg-brand-primary/10 rounded-2xl flex items-center justify-center text-brand-primary border border-brand-primary/20 shadow-glow-accent">
            <Settings size={32} />
          </div>
          <div>
            <h2 className="text-3xl font-black text-text-primary leading-none uppercase">مركز القيادة والإعدادات</h2>
            <p className="text-[10px] text-brand-accent font-bold uppercase tracking-[0.3em] mt-2">Sovereign Command Hub v2.1</p>
          </div>
        </div>
        
        {/* Toast Notification */}
        {toastMsg && (
            <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-green-500/10 text-green-500 border border-green-500/20 px-6 py-2 rounded-full flex items-center gap-2 animate-in slide-in-from-top-4 fade-in">
                <CheckCircle2 size={16} />
                <span className="text-xs font-bold">{toastMsg}</span>
            </div>
        )}
      </div>

      <div className="flex flex-col lg:flex-row gap-8 min-h-[650px]">
        {/* Navigation Sidebar */}
        <div className="lg:w-80 flex flex-col gap-3">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={`w-full p-5 rounded-xl border text-right transition-all flex items-center gap-4 group relative overflow-hidden ${
                activeTab === tab.id 
                ? 'bg-brand-primary text-white border-brand-accent/50 shadow-lg' 
                : 'bg-panel border-border-subtle text-text-secondary hover:border-brand-primary/30 hover:bg-canvas'
              }`}
            >
              {activeTab === tab.id && <div className="absolute inset-0 bg-gradient-to-r from-brand-accent/20 to-transparent opacity-20"></div>}
              <div className={`p-2.5 rounded-lg transition-colors ${activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-canvas group-hover:text-brand-primary'}`}>
                {tab.icon}
              </div>
              <div className="overflow-hidden relative z-10">
                <div className="text-xs font-black uppercase leading-none mb-1.5">{tab.label}</div>
                <div className={`text-[9px] font-bold tracking-tight truncate ${activeTab === tab.id ? 'text-blue-100' : 'text-text-subtle'}`}>{tab.desc}</div>
              </div>
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-panel rounded-2xl border border-border-subtle shadow-elevation overflow-hidden flex flex-col relative">
          <div className="p-8 flex-1 space-y-10 overflow-y-auto custom-scrollbar">
            
            {activeTab === 'ai' && (
              <div className="space-y-8 animate-in slide-in-from-right-4 fade-in duration-500">
                 
                 {/* Google Services Section */}
                 <div className={`rounded-2xl border transition-all relative overflow-hidden ${userRole === 'root' ? 'bg-slate-950 border-brand-accent/20' : 'bg-slate-50 border-slate-200'}`}>
                    {userRole === 'root' && <div className="absolute top-0 right-0 w-32 h-32 bg-brand-accent/5 rounded-full blur-2xl -mr-10 -mt-10"></div>}
                    
                    <div className="p-6 border-b border-border-subtle flex justify-between items-center relative z-10">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-brand-accent/10 rounded-lg text-brand-accent">
                                <CloudLightning size={20} />
                            </div>
                            <h3 className={`text-sm font-black uppercase tracking-widest ${userRole === 'root' ? 'text-white' : 'text-slate-900'}`}>خدمات Google السيادية (Gemini)</h3>
                        </div>
                        {userRole !== 'root' && <Lock size={16} className="text-slate-400" />}
                    </div>

                    {userRole === 'root' ? (
                        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                            <div className="space-y-6">
                                <TacticalInput 
                                    label="Gemini API Key (Env Injected)" 
                                    value={settings.googleConfig.apiKey ? "********************" : ""} 
                                    onChange={() => {}} 
                                    isSecret 
                                />
                                <div className="p-4 rounded-xl bg-green-500/5 border border-green-500/10 flex gap-3 items-start">
                                    <CheckCircle2 size={16} className="text-green-500 mt-0.5" />
                                    <p className="text-[10px] text-green-400 leading-relaxed font-bold">
                                        تم تحميل المفاتيح بنجاح من متغيرات البيئة المشفرة. الاتصال بالنواة آمن.
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <ToggleControl 
                                    label="التوثيق بالبحث (Grounding)"
                                    description="تفعيل البحث المباشر للتحقق من المعلومات."
                                    enabled={settings.googleConfig.enableSearchGrounding}
                                    onToggle={() => updateGoogleConfig({ enableSearchGrounding: !settings.googleConfig.enableSearchGrounding })}
                                />
                                
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-text-subtle uppercase tracking-widest px-1">ميزانية التفكير (Thinking Budget)</label>
                                    <div className="relative">
                                        <select 
                                            value={settings.googleConfig.thinkingBudget}
                                            onChange={(e) => updateGoogleConfig({ thinkingBudget: Number(e.target.value) })}
                                            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-xs font-bold text-white outline-none focus:border-brand-accent transition-all appearance-none cursor-pointer"
                                        >
                                            <option value={0}>Disabled (Fastest)</option>
                                            <option value={1024}>Low (1k Tokens)</option>
                                            <option value={8192}>Balanced (8k Tokens)</option>
                                            <option value={32768}>Deep Think (32k Tokens)</option>
                                        </select>
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">▼</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="p-12 text-center">
                            <p className="text-sm font-bold text-slate-500">الإعدادات المتقدمة متاحة فقط للمشرف الجذر.</p>
                        </div>
                    )}
                 </div>

                 {/* Local Models Grid */}
                 <div>
                    <h3 className="text-xs font-black text-text-primary uppercase tracking-widest mb-4 border-b border-border-subtle pb-2 flex items-center gap-2">
                        <Server size={14} /> النماذج المحلية (Ollama Local)
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {settings.ollamaModels.map(model => (
                            <button 
                                key={model.id}
                                onClick={() => setDefaultOllamaModel(model.id)}
                                className={`relative p-5 rounded-2xl border text-right transition-all group overflow-hidden ${
                                    model.active 
                                    ? 'bg-brand-primary border-brand-accent/50 shadow-lg' 
                                    : 'bg-canvas border-border-subtle hover:border-brand-primary/30'
                                }`}
                            >
                                <div className="flex justify-between items-start mb-3 relative z-10">
                                    <div className={`w-3 h-3 rounded-full ${model.active ? 'bg-green-400 shadow-[0_0_10px_rgba(74,222,128,0.6)]' : 'bg-slate-700'}`}></div>
                                    {model.active && <Check size={16} className="text-white" />}
                                </div>
                                <div className="relative z-10">
                                    <h4 className={`text-sm font-black uppercase ${model.active ? 'text-white' : 'text-text-primary'}`}>{model.name}</h4>
                                    <p className={`text-[10px] font-bold mt-1 ${model.active ? 'text-blue-200' : 'text-text-subtle'}`}>{model.active ? 'Active Core' : 'Standby'}</p>
                                </div>
                                {model.active && <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>}
                            </button>
                        ))}
                    </div>
                 </div>
              </div>
            )}
            
            {/* Identity Providers Tab */}
            {activeTab === 'identity_providers' && (
              <div className="space-y-8 animate-in slide-in-from-right-4 fade-in">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="bg-canvas border border-border-subtle p-6 rounded-2xl space-y-6">
                          <h3 className="text-sm font-black text-text-primary uppercase tracking-widest flex items-center gap-3">
                              <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" className="w-5 h-5" /> {t('settings_google_sso')}
                          </h3>
                          <TacticalInput label={t('settings_client_id')} value={""} onChange={() => {}} />
                          <TacticalInput label={t('settings_client_secret')} type="password" value={""} onChange={() => {}} isSecret />
                      </div>
                      <div className="bg-canvas border border-border-subtle p-6 rounded-2xl space-y-6">
                           <h3 className="text-sm font-black text-text-primary uppercase tracking-widest flex items-center gap-3">
                              <img src="https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg" className="w-5 h-5" /> {t('settings_github_sso')}
                          </h3>
                           <TacticalInput label={t('settings_client_id')} value={""} onChange={() => {}} />
                          <TacticalInput label={t('settings_client_secret')} type="password" value={""} onChange={() => {}} isSecret />
                      </div>
                  </div>
              </div>
            )}
            
            {/* Placeholders for other tabs */}
             {(activeTab === 'core' || activeTab === 'tools' || activeTab === 'sources') && (
              <div className="flex flex-col items-center justify-center h-full text-text-subtle opacity-50 space-y-4">
                 <Sliders size={48} />
                 <p className="text-sm font-black uppercase tracking-widest">Unit Configuration Interface</p>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="p-6 bg-panel/90 border-t border-border-subtle flex justify-between items-center z-20 backdrop-blur-md absolute bottom-0 left-0 right-0">
            <div className="text-[10px] text-text-subtle font-mono">
                SESSION_ID: <span className="text-brand-primary">ROOT_9921X</span>
            </div>
            <button 
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center gap-3 bg-brand-accent hover:shadow-glow-accent text-brand-primary px-10 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? <RefreshCcw size={16} className="animate-spin" /> : <Save size={16} />}
                {isSaving ? 'Processing...' : 'حفظ التكوين السيادي'}
              </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Reusable Components
const TacticalInput: React.FC<{ label: string, value: string, type?: string, onChange: (val: string) => void, isSecret?: boolean }> = ({ label, value, type = 'text', onChange, isSecret }) => {
  const [show, setShow] = useState(false);
  const inputType = isSecret ? (show ? 'text' : 'password') : type;
  return (
    <div className="space-y-2 group">
      <label className="text-[10px] font-black text-text-subtle uppercase tracking-widest px-1 block group-focus-within:text-brand-accent transition-colors">{label}</label>
      <div className="relative">
        <input 
          type={inputType}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3.5 text-xs font-mono text-white outline-none focus:border-brand-accent transition-all shadow-inner placeholder-slate-600"
          placeholder="ENTER_VALUE..."
        />
        {isSecret && (
          <button onClick={() => setShow(!show)} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors p-1">
            {show ? <EyeOff size={14} /> : <Eye size={14} />}
          </button>
        )}
      </div>
    </div>
  );
};

const ToggleControl: React.FC<{label: string, description: string, enabled: boolean, onToggle: () => void}> = ({label, description, enabled, onToggle}) => {
    return (
        <div className={`p-5 rounded-2xl flex items-center justify-between transition-all border ${enabled ? 'bg-green-500/5 border-green-500/20' : 'bg-slate-900 border-slate-800'}`}>
            <div className="pr-2">
                <h4 className={`text-xs font-black uppercase tracking-widest ${enabled ? 'text-green-400' : 'text-slate-400'}`}>{label}</h4>
                <p className="text-[9px] text-slate-500 font-bold mt-1 max-w-md">{description}</p>
            </div>
            <button onClick={onToggle} className={`w-12 h-6 rounded-full p-1 flex items-center transition-colors ${enabled ? 'bg-brand-primary justify-end shadow-glow-accent' : 'bg-slate-700 justify-start'}`}>
                <div className="w-4 h-4 bg-white rounded-full shadow-md"></div>
            </button>
        </div>
    );
};

export default SettingsPage;
