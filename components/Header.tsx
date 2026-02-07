import React from 'react';
import { Bell, Search, Sun, Moon, ChevronDown, User, Settings, LogOut, Command, ShieldAlert } from 'lucide-react';
import { useBranding } from '../context/BrandingContext';
import { useLanguage } from '../context/LanguageContext';
import { useSettings } from '../context/SettingsContext';

const LanguageSwitcher: React.FC = () => {
    const { language, changeLanguage } = useLanguage();
    return (
        <button onClick={() => changeLanguage(language === 'ar' ? 'en' : 'ar')} className="p-2.5 text-text-subtle hover:text-text-primary transition-colors bg-canvas/50 border border-border-subtle rounded-lg shadow-sm backdrop-blur-sm">
           <span className="font-mono text-xs font-bold uppercase">{language === 'ar' ? 'EN' : 'AR'}</span>
        </button>
    );
};

const Header: React.FC = () => {
  const { theme, themeMode, toggleThemeMode } = useBranding();
  const { t } = useLanguage();
  const { userRole } = useSettings();

  return (
    <header className="sticky top-0 z-40 h-20 bg-panel/50 backdrop-blur-glass border-b border-border-glass flex items-center justify-between px-6">
      {/* Left Side: System Status / Dev Mode Indicator */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/20 px-4 py-2 rounded-xl">
           <ShieldAlert size={16} className="text-red-500 animate-pulse" />
           <div className="flex flex-col">
              <span className="text-[10px] font-black text-red-500 uppercase tracking-widest leading-none">Root Development Mode</span>
              <span className="text-[8px] font-bold text-text-subtle uppercase mt-1">Auth Bypass Active</span>
           </div>
        </div>
      </div>

      {/* Right Side (Actions & Profile) */}
      <div className="flex items-center gap-3">
        <button className="hidden md:flex items-center gap-2 bg-canvas/50 border border-border-subtle rounded-lg px-3 py-2 text-xs text-text-subtle font-bold shadow-sm backdrop-blur-sm">
          <Search size={14} /> {t('header_search_placeholder')}
          <div className="flex items-center gap-1 border-l border-border-subtle pl-2 ml-1">
            <Command size={10} />
            <span className="text-[10px]">K</span>
          </div>
        </button>
        
        <div className="w-px h-6 bg-border-subtle mx-2 hidden md:block"></div>

        <LanguageSwitcher />

        <button onClick={toggleThemeMode} className="p-2.5 bg-canvas/50 border border-border-subtle rounded-lg text-text-subtle hover:text-text-primary transition-colors shadow-sm backdrop-blur-sm">
          {themeMode === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
        </button>
        
        <button className="p-2.5 bg-canvas/50 border border-border-subtle rounded-lg text-text-subtle hover:text-text-primary transition-colors shadow-sm relative backdrop-blur-sm">
          <Bell size={16} />
          <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-brand-accent rounded-full border border-panel"></div>
        </button>
        
        <div className="w-px h-6 bg-border-subtle mx-2"></div>

        {/* Unified Role Badge (Fixed for Root in Dev) */}
        <div className="flex items-center gap-2 bg-brand-accent text-slate-900 px-3 py-1.5 rounded-lg border border-brand-accent shadow-sm group">
            <div className="w-2 h-2 bg-slate-900 rounded-full animate-pulse"></div>
            <span className="text-[10px] font-black uppercase tracking-widest">{userRole}</span>
        </div>

        <div className="relative group">
            <button className="w-10 h-10 bg-brand-primary rounded-full flex items-center justify-center text-white font-bold border-2 border-brand-primary/50 group-hover:border-brand-accent transition-colors shadow-glow-blue">
                <User size={20} />
            </button>
            <div className="absolute top-full right-0 mt-2 w-48 bg-panel border border-border-subtle rounded-xl shadow-elevation p-2 opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all duration-300 transform group-hover:translate-y-0 translate-y-2">
                <div className="px-3 py-2 border-b border-border-subtle mb-1">
                   <p className="text-[10px] font-black text-text-subtle uppercase">Logged in as</p>
                   <p className="text-xs font-bold text-text-primary">System Admin (Root)</p>
                </div>
                <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-md text-xs font-bold text-text-secondary hover:bg-canvas hover:text-text-primary"><Settings size={14} /> {t('profile_title')}</a>
                <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-md text-xs font-bold text-text-secondary hover:bg-canvas hover:text-text-primary"><LogOut size={14} /> {t('profile_logout')}</a>
            </div>
        </div>
      </div>
    </header>
  );
};

export default Header;