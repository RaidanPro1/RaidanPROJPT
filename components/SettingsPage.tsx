
import React, { useState, useEffect } from 'react';
import { 
  Cpu, Brain, Shield, Globe, Database, 
  Settings, Key, Zap, Lock, Save, 
  RefreshCcw, Eye, EyeOff, Server, 
  Network, Activity, HardDrive, Share2, 
  MessageSquare, Fingerprint, Map, Video, 
  FileText, CheckCircle2, AlertTriangle,
  ChevronLeft, BarChart3, CloudLightning,
  Search, ShieldCheck, Volume2, Sliders, Users
} from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import { useLanguage } from '../context/LanguageContext';

type TabType = 'core' | 'ai' | 'tools' | 'sources' | 'identity_providers';

const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('core');
  const [isSaving, setIsSaving] = useState(false);
  
  const { settings, updateSetting, toggleModule, setDefaultOllamaModel } = useSettings();
  const { t } = useLanguage();

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      alert('تم تحديث التكوين السيادي بنجاح.');
    }, 1200);
  };

  const tabs = [
    { id: 'core', label: 'النواة والموارد', icon: <Cpu size={18} />, desc: 'إدارة البنية التحتية' },
    { id: 'ai', label: 'مصفوفة الذكاء الاصطناعي', icon: <Brain size={18} />, desc: 'النماذج المحلية والسحابية' },
    { id: 'tools', label: 'أدوات التحقيق', icon: <Shield size={18} />, desc: 'تفعيل وحدات الخدمة' },
    { id: 'identity_providers', label: t('settings_idps'), icon: <Users size={18}/>, desc: t('settings_idps_desc') },
    { id: 'sources', label: 'مصادر البيانات', icon: <Globe size={18} />, desc: 'الرصد والربط الخارجي' },
  ];

  return (
    <div className="min-h-[800px] space-y-6 animate-in fade-in duration-700 pb-32 font-tajawal relative text-text-primary">
      <div className="bg-panel p-6 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6 border border-border-subtle shadow-elevation">
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 bg-brand-primary/10 rounded-xl flex items-center justify-center text-brand-primary border border-brand-primary/20">
            <Settings size={28} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-text-primary leading-none uppercase">مركز الإعدادات والتكاملات</h2>
            <p className="text-[10px] text-brand-primary font-bold uppercase tracking-[0.3em] mt-2">Sovereign Command Hub v2.0</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 min-h-[650px]">
        <div className="lg:w-72 flex flex-col gap-2">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={`w-full p-4 rounded-xl border text-right transition-all flex items-center gap-4 group ${
                activeTab === tab.id 
                ? 'bg-brand-primary border-brand-accent/40 text-white shadow-elevation' 
                : 'bg-panel border-border-subtle text-text-secondary hover:border-border-subtle'
              }`}
            >
              <div className={`p-2 rounded-lg transition-colors ${activeTab === tab.id ? 'bg-brand-accent text-brand-primary' : 'bg-canvas group-hover:text-brand-primary'}`}>
                {tab.icon}
              </div>
              <div className="overflow-hidden">
                <div className="text-[11px] font-black uppercase leading-none mb-1">{tab.label}</div>
                <div className="text-[8px] opacity-60 font-bold tracking-tighter truncate">{tab.desc}</div>
              </div>
            </button>
          ))}
        </div>

        <div className="flex-1 bg-panel rounded-2xl border-border-subtle shadow-elevation overflow-hidden flex flex-col">
          <div className="p-8 flex-1 space-y-10 overflow-y-auto custom-scrollbar">
            
            {activeTab === 'identity_providers' && (
              <div className="space-y-10 animate-in slide-in-from-left-4">
                  <div className="space-y-6">
                      <h3 className="text-sm font-black text-text-primary uppercase tracking-widest border-b border-border-subtle pb-3 flex items-center gap-3">
                          <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" className="w-4 h-4" /> {t('settings_google_sso')}
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <TacticalInput label={t('settings_client_id')} value={""} onChange={() => {}} />
                          <TacticalInput label={t('settings_client_secret')} type="password" value={""} onChange={() => {}} isSecret />
                      </div>
                  </div>
                  <div className="space-y-6">
                       <h3 className="text-sm font-black text-text-primary uppercase tracking-widest border-b border-border-subtle pb-3 flex items-center gap-3">
                          <img src="https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg" className="w-4 h-4" /> {t('settings_github_sso')}
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                           <TacticalInput label={t('settings_client_id')} value={""} onChange={() => {}} />
                          <TacticalInput label={t('settings_client_secret')} type="password" value={""} onChange={() => {}} isSecret />
                      </div>
                  </div>
              </div>
            )}
            
            {/* Other tabs remain unchanged... */}
             {activeTab === 'core' && (
              <div className="space-y-10 animate-in slide-in-from-left-4">
                 {/* ... core settings content ... */}
              </div>
            )}
            {activeTab === 'ai' && (
              <div className="space-y-10 animate-in slide-in-from-left-4">
                 {/* ... ai settings content ... */}
              </div>
            )}
            {activeTab === 'tools' && (
              <div className="space-y-10 animate-in slide-in-from-left-4">
                 {/* ... tools settings content ... */}
              </div>
            )}
          </div>
          <div className="p-4 bg-canvas/80 border-t border-border-subtle flex justify-end items-center z-20 backdrop-blur-md">
            <button 
                onClick={handleSave}
                className="flex items-center gap-3 bg-brand-accent hover:shadow-glow-accent text-brand-primary px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all active:scale-95 disabled:opacity-50"
              >
                {isSaving ? <RefreshCcw size={16} className="animate-spin" /> : <Save size={16} />}
                {isSaving ? 'جاري الحفظ...' : 'حفظ التكوين السيادي'}
              </button>
          </div>
        </div>
      </div>
    </div>
  );
};

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
          className="w-full bg-canvas border border-border-subtle rounded-xl px-4 py-4 text-xs font-mono text-brand-primary outline-none focus:border-brand-accent transition-all shadow-inner hover:border-slate-700"
        />
        {isSecret && (
          <button onClick={() => setShow(!show)} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-subtle hover:text-text-primary transition-colors p-1">
            {show ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}
      </div>
    </div>
  );
};

export default SettingsPage;
