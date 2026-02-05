import React, { useState } from 'react';
// FIX: Added the 'X' icon to the import from lucide-react.
import { User, Shield, Palette, Save, Key, Lock, Bell, LogOut, Smartphone, Check, X } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useBranding } from '../context/BrandingContext';

const ProfilePage: React.FC = () => {
    const { t } = useLanguage();
    const { themeMode, toggleThemeMode } = useBranding();
    const { language, changeLanguage } = useLanguage();

    return (
        <div className="space-y-8 animate-in fade-in duration-700 pb-20 font-tajawal">
            {/* Header */}
            <div className="bg-panel p-6 rounded-2xl flex items-center justify-between gap-6 border border-border-subtle shadow-elevation">
                <div className="flex items-center gap-5">
                    <div className="w-14 h-14 bg-brand-primary/10 rounded-xl flex items-center justify-center text-brand-primary border border-brand-primary/20">
                        <User size={28} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-black text-text-primary leading-none uppercase">{t('profile_title')}</h2>
                        <p className="text-[10px] text-brand-primary font-bold uppercase tracking-[0.3em] mt-2">{t('profile_description')}</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: User Info & Preferences */}
                <div className="lg:col-span-2 space-y-8">
                    {/* User Info */}
                    <section className="bg-panel p-8 rounded-2xl border border-border-subtle shadow-elevation">
                        <h3 className="text-sm font-black text-text-primary uppercase tracking-widest mb-6 border-b border-border-subtle pb-4 flex items-center gap-3">
                            <User size={16} className="text-brand-primary" /> {t('profile_user_info')}
                        </h3>
                        <div className="flex items-center gap-8">
                            <div className="w-24 h-24 bg-brand-primary border-4 border-brand-primary/10 text-white rounded-full flex items-center justify-center font-bold text-4xl shadow-lg">
                                R
                            </div>
                            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
                                <InputField label={t('profile_full_name')} defaultValue="Root Administrator" />
                                <InputField label={t('profile_email')} defaultValue="admin@raidan.pro" />
                            </div>
                        </div>
                        <div className="flex justify-end mt-8">
                             <button className="bg-brand-primary hover:bg-brand-primary-hover text-white px-8 py-3 rounded-xl font-black text-xs uppercase tracking-[0.2em] transition-all shadow-md flex items-center gap-3 active:scale-95">
                                <Save size={16} /> {t('profile_update_info')}
                            </button>
                        </div>
                    </section>
                    
                    {/* Preferences */}
                    <section className="bg-panel p-8 rounded-2xl border border-border-subtle shadow-elevation">
                        <h3 className="text-sm font-black text-text-primary uppercase tracking-widest mb-6 border-b border-border-subtle pb-4 flex items-center gap-3">
                           <Palette size={16} className="text-brand-primary" /> {t('profile_preferences')}
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-text-subtle uppercase tracking-widest px-1">{t('profile_language')}</label>
                                <select value={language} onChange={e => changeLanguage(e.target.value as any)} className="w-full bg-canvas border border-border-subtle rounded-xl px-4 py-3 text-sm text-text-primary outline-none focus:border-brand-primary transition-all font-tajawal">
                                    <option value="ar">العربية (Yemen)</option>
                                    <option value="en">English (US)</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-text-subtle uppercase tracking-widest px-1">{t('profile_theme')}</label>
                                <div className="flex bg-canvas p-1 rounded-xl border border-border-subtle">
                                    <ThemeOption label={t('profile_theme_light')} current={themeMode} value="light" onClick={() => themeMode !== 'light' && toggleThemeMode()} />
                                    <ThemeOption label={t('profile_theme_dark')} current={themeMode} value="dark" onClick={() => themeMode !== 'dark' && toggleThemeMode()} />
                                </div>
                            </div>
                        </div>
                    </section>
                </div>

                {/* Right Column: Security */}
                <div className="bg-panel p-8 rounded-2xl border border-border-subtle shadow-elevation">
                     <h3 className="text-sm font-black text-text-primary uppercase tracking-widest mb-6 border-b border-border-subtle pb-4 flex items-center gap-3">
                        <Shield size={16} className="text-brand-primary" /> {t('profile_security')}
                    </h3>
                    <div className="space-y-8">
                        <button className="w-full text-left p-4 rounded-xl border border-border-subtle bg-canvas hover:border-brand-primary/50 transition-all flex items-center gap-4">
                            <Key size={20} className="text-brand-primary" />
                            <span className="text-xs font-bold text-text-secondary uppercase tracking-wider">{t('profile_change_password')}</span>
                        </button>

                        <div className="p-6 rounded-xl border border-border-subtle bg-canvas space-y-4">
                            <div className="flex items-center gap-4">
                                <Smartphone size={20} className="text-brand-primary" />
                                <h4 className="text-xs font-bold text-text-secondary uppercase tracking-wider">{t('profile_2fa')}</h4>
                            </div>
                            <p className="text-[10px] text-text-subtle font-bold leading-relaxed">{t('profile_2fa_description')}</p>
                            <button className="w-full bg-brand-primary/10 text-brand-primary border border-brand-primary/20 hover:bg-brand-primary/20 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest">{t('profile_2fa_enable')}</button>
                        </div>

                        <div className="space-y-4">
                            <h4 className="text-[10px] font-black text-text-subtle uppercase tracking-widest px-1">{t('profile_active_sessions')}</h4>
                            <div className="space-y-3">
                                <SessionItem device="Chrome on macOS" location="Sana'a, YEM" isCurrent />
                                <SessionItem device="Safari on iPhone" location="Aden, YEM" />
                            </div>
                            <button className="w-full text-center text-xs text-red-600 hover:underline font-bold mt-4">{t('profile_terminate_all')}</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const InputField: React.FC<{ label: string; defaultValue: string }> = ({ label, defaultValue }) => (
    <div className="space-y-2">
        <label className="text-[10px] font-black text-text-subtle uppercase tracking-widest px-1">{label}</label>
        <input 
            type="text" 
            defaultValue={defaultValue}
            className="w-full bg-canvas border border-border-subtle rounded-xl px-4 py-3 text-sm text-text-primary outline-none focus:border-brand-primary transition-all"
        />
    </div>
);

const ThemeOption: React.FC<{label: string, current: string, value: string, onClick: () => void}> = ({label, current, value, onClick}) => (
    <button onClick={onClick} className={`flex-1 px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
      current === value ? 'bg-panel text-brand-primary shadow-md' : 'text-text-subtle hover:bg-panel/50'
    }`}>
     {current === value && <Check size={14}/>} {label}
    </button>
);

const SessionItem: React.FC<{ device: string, location: string, isCurrent?: boolean }> = ({ device, location, isCurrent }) => (
    <div className="flex items-center justify-between p-3 bg-canvas border border-border-subtle rounded-xl">
        <div>
            <p className="text-xs font-bold text-text-secondary">{device}</p>
            <p className="text-[9px] text-text-subtle font-bold">{location}</p>
        </div>
        {isCurrent ? (
            <span className="text-[9px] font-black text-green-600 bg-green-100 px-2 py-0.5 rounded-full border border-green-200">Active</span>
        ) : (
            <button className="text-text-subtle hover:text-red-600"><X size={14}/></button>
        )}
    </div>
);

export default ProfilePage;