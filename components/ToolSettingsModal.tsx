
import React, { useState } from 'react';
import { X, Save, History, SlidersHorizontal, BarChart, HardDrive, Shield, Power } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface ToolSettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
    tool: any; // Simplified for demo
    userRole: 'user' | 'root';
}

const SliderControl: React.FC<{ label: string; value: number; min: number; max: number; step: number; onChange: (v: number) => void }> = 
({ label, value, min, max, step, onChange }) => (
    <div className="space-y-2">
        <div className="flex justify-between items-center">
            <label className="text-[10px] font-black text-text-subtle uppercase tracking-widest">{label}</label>
            <span className="text-xs font-mono font-bold text-brand-primary bg-brand-primary/10 px-2 py-0.5 rounded">{value}</span>
        </div>
        <input 
            type="range"
            min={min} max={max} step={step} value={value}
            onChange={(e) => onChange(Number(e.target.value))}
            className="w-full h-2 bg-canvas rounded-lg appearance-none cursor-pointer accent-brand-primary"
        />
    </div>
);

const ToggleControl: React.FC<{ label: string; enabled: boolean; onToggle: () => void }> = ({ label, enabled, onToggle }) => (
    <div className="flex items-center justify-between p-3 bg-canvas rounded-lg border border-border-subtle">
        <label className="text-xs font-bold text-text-secondary uppercase tracking-wider">{label}</label>
        <button onClick={onToggle} className={`w-12 h-6 rounded-full p-1 flex items-center transition-colors ${enabled ? 'bg-brand-primary justify-end' : 'bg-border-subtle justify-start'}`}>
            <div className="w-4 h-4 bg-white rounded-full shadow-md"></div>
        </button>
    </div>
);

const ToolSettingsModal: React.FC<ToolSettingsModalProps> = ({ isOpen, onClose, tool, userRole }) => {
    const { t } = useLanguage();
    
    // Local state for settings, initialized from tool props
    const [settings, setSettings] = useState(tool.settings);

    if (!isOpen) return null;

    const handleSliderChange = (key: string, value: number) => {
        setSettings((prev: any) => ({ ...prev, user: { ...prev.user, [key]: { ...prev.user[key], value } } }));
    };
    
    const handleRootSliderChange = (key: string, value: number) => {
        setSettings((prev: any) => ({ ...prev, root: { ...prev.root, [key]: { ...prev.root[key], value } } }));
    };
    
    const handleToggle = (key: string) => {
        setSettings((prev: any) => ({ ...prev, root: { ...prev.root, [key]: { ...prev.root[key], value: !prev.root[key].value } } }));
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-panel/70 backdrop-blur-md animate-in fade-in duration-300">
            <div className="bg-panel rounded-2xl border border-border-subtle shadow-elevation w-full max-w-2xl overflow-hidden">
                <div className="p-6 border-b border-border-subtle flex justify-between items-center">
                    <div>
                        <h3 className="font-black text-text-primary uppercase tracking-widest">{t('modal_settings_title')}</h3>
                        <p className="text-xs text-brand-primary font-bold">{tool.display_name}</p>
                    </div>
                    <button onClick={onClose} className="p-2 text-text-subtle hover:text-text-primary transition-colors rounded-lg"><X size={18} /></button>
                </div>

                <div className="p-8 space-y-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
                    {/* User Preferences Section */}
                    <section>
                        <h4 className="text-xs font-black text-text-subtle uppercase tracking-widest border-b border-border-subtle pb-3 mb-6 flex items-center gap-3"><SlidersHorizontal size={14} /> {t('modal_user_prefs')}</h4>
                        <div className="space-y-6">
                            {Object.entries(settings.user).map(([key, setting]: [string, any]) => (
                                <SliderControl key={key} label={t(setting.label, setting.label)} value={setting.value} min={setting.min} max={setting.max} step={setting.step} onChange={(v) => handleSliderChange(key, v)} />
                            ))}
                             <button className="w-full text-left p-4 rounded-xl border border-border-subtle bg-canvas hover:border-red-500/50 hover:text-red-600 transition-all flex items-center gap-4 text-red-600/70">
                                <History size={20} />
                                <span className="text-xs font-bold uppercase tracking-wider">{t('modal_clear_history')}</span>
                            </button>
                        </div>
                    </section>

                    {/* Root Options Section (God Mode) */}
                    {userRole === 'root' && (
                         <section className="mt-8 pt-8 border-t-4 border-dashed border-border-subtle">
                             <h4 className="text-xs font-black text-brand-accent uppercase tracking-widest border-b border-border-subtle pb-3 mb-6 flex items-center gap-3"><Shield size={14} /> {t('modal_root_options')}</h4>
                             <div className="space-y-8">
                                <SliderControl label={t(settings.root.ramLimit.label)} value={settings.root.ramLimit.value} min={settings.root.ramLimit.min} max={settings.root.ramLimit.max} step={settings.root.ramLimit.step} onChange={(v) => handleRootSliderChange('ramLimit', v)} />
                                <ToggleControl label={t(settings.root.maintenanceMode.label)} enabled={settings.root.maintenanceMode.value} onToggle={() => handleToggle('maintenanceMode')} />
                                
                                <div className="p-4 bg-canvas rounded-xl border border-border-subtle">
                                    <h5 className="text-[10px] font-black text-text-subtle uppercase tracking-widest mb-3">{t('modal_usage_monitor')}</h5>
                                    <div className="h-24 bg-panel border border-border-subtle rounded-lg flex items-end p-2 gap-1">
                                        {/* Mock Chart */}
                                        {[40, 60, 50, 80, 75, 90, 60].map((h, i) => <div key={i} className="flex-1 bg-brand-primary/50 rounded-t-sm" style={{height: `${h}%`}}></div>)}
                                    </div>
                                </div>
                             </div>
                         </section>
                    )}
                </div>

                <div className="p-6 bg-canvas/80 border-t border-border-subtle flex justify-end">
                    <button className="flex items-center gap-3 bg-brand-primary hover:bg-brand-primary-hover text-white px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all active:scale-95">
                        <Save size={16} /> {t('modal_save_changes')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ToolSettingsModal;
