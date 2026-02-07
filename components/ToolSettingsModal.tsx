
import React, { useState } from 'react';
// FIX: Imported the 'Lock' icon from lucide-react to resolve the JSX component type error.
import { X, Save, History, SlidersHorizontal, Shield, Loader2, Check, Lock } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import ToolSettingsCard from './ToolSettingsCard';
import { UserRole } from '../context/SettingsContext';

interface ToolSettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
    tool: any; 
    userRole: UserRole;
}

const ToolSettingsModal: React.FC<ToolSettingsModalProps> = ({ isOpen, onClose, tool, userRole }) => {
    const { t } = useLanguage();
    const [settings, setSettings] = useState(tool.settings || { user: {}, root: {} });
    const [isSaving, setIsSaving] = useState(false);
    const [showToast, setShowToast] = useState(false);

    if (!isOpen) return null;

    const handleUserUpdate = (key: string, value: any) => {
        setSettings((prev: any) => ({
            ...prev,
            user: { ...prev.user, [key]: { ...prev.user[key], value } }
        }));
    };

    const handleRootUpdate = (key: string, value: any) => {
        setSettings((prev: any) => ({
            ...prev,
            root: { ...prev.root, [key]: { ...prev.root[key], value } }
        }));
    };

    const saveChanges = () => {
        setIsSaving(true);
        setTimeout(() => {
            setIsSaving(false);
            setShowToast(true);
            setTimeout(() => {
                setShowToast(false);
                onClose();
            }, 2000);
        }, 1000);
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-panel rounded-2xl border border-border-subtle shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col max-h-[90vh]">
                
                {/* Modal Header */}
                <div className="p-6 border-b border-border-subtle flex justify-between items-center bg-panel/80 backdrop-blur-md">
                    <div className="flex items-center gap-4">
                        <div className="p-2 bg-brand-primary/10 rounded-lg text-brand-primary border border-brand-primary/20">
                            <SlidersHorizontal size={20} />
                        </div>
                        <div>
                            <h3 className="text-lg font-black text-text-primary uppercase tracking-widest">{t('modal_settings_title')}</h3>
                            <p className="text-xs text-brand-primary font-bold mt-0.5">{tool.display_name} Configuration Matrix</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 text-text-subtle hover:text-white transition-colors rounded-lg bg-white/5 hover:bg-white/10">
                        <X size={20} />
                    </button>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto custom-scrollbar p-8 bg-canvas">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* User Column */}
                        <div className="space-y-6">
                            <h4 className="text-xs font-black text-text-subtle uppercase tracking-[0.2em] mb-4">Preference Layer</h4>
                            {settings.user && Object.keys(settings.user).length > 0 ? (
                                <ToolSettingsCard 
                                    title={t('modal_user_prefs')} 
                                    settings={settings.user} 
                                    onUpdate={handleUserUpdate} 
                                    variant="user"
                                />
                            ) : (
                                <div className="p-6 border border-dashed border-border-subtle rounded-xl text-center text-text-subtle text-xs">No user preferences available for this tool.</div>
                            )}
                        </div>

                        {/* Root Column */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-2 mb-4">
                                <Shield size={14} className="text-red-500" />
                                <h4 className="text-xs font-black text-text-subtle uppercase tracking-[0.2em]">Sovereign Control Layer</h4>
                            </div>
                            
                            {userRole === 'root' ? (
                                settings.root && Object.keys(settings.root).length > 0 ? (
                                    <ToolSettingsCard 
                                        title={t('modal_root_options')} 
                                        settings={settings.root} 
                                        onUpdate={handleRootUpdate} 
                                        variant="root" 
                                    />
                                ) : (
                                    <div className="p-6 border border-dashed border-border-subtle rounded-xl text-center text-text-subtle text-xs">No root configurations available.</div>
                                )
                            ) : (
                                <div className="h-full bg-panel border border-border-subtle rounded-2xl flex flex-col items-center justify-center p-8 text-center gap-3">
                                    <Lock size={32} className="text-text-subtle" />
                                    <p className="text-sm font-bold text-text-secondary">Access Restricted</p>
                                    <p className="text-[10px] text-text-subtle uppercase tracking-widest">Root privileges required</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="p-6 bg-panel border-t border-border-subtle flex justify-between items-center">
                    <button className="text-xs font-bold text-text-subtle hover:text-red-500 transition-colors flex items-center gap-2">
                        <History size={14} />
                        <span>{t('modal_clear_history')}</span>
                    </button>
                    
                    <div className="flex items-center gap-4">
                        {showToast && (
                            <div className="flex items-center gap-2 text-[10px] font-black text-green-500 uppercase animate-in fade-in slide-in-from-right-4">
                                <Check size={14} /> Changes Applied
                            </div>
                        )}
                        <button 
                            onClick={saveChanges} 
                            disabled={isSaving}
                            className="flex items-center gap-3 bg-brand-primary hover:bg-brand-primary-hover text-white px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all active:scale-95 shadow-lg shadow-brand-primary/20 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                            {isSaving ? 'Processing...' : t('modal_save_changes')}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ToolSettingsModal;