
import React from 'react';
import { Bell, Search, Sun, Moon, ChevronDown, User, Settings, LogOut, Command } from 'lucide-react';
import { useBranding } from '../context/BrandingContext';
import { useLanguage } from '../context/LanguageContext';
import { useSettings } from '../context/SettingsContext';

// This is a simplified version of the LanguageSwitcher from the previous step
const LanguageSwitcher: React.FC = () => {
    const { language, changeLanguage } = useLanguage();
    return (
        <button onClick={() => changeLanguage(language === 'ar' ? 'en' : 'ar')} className="p-2.5 text-text-subtle hover:text-text-primary transition-colors bg-canvas border border-border-subtle rounded-lg shadow-sm">
           <span className="font-mono text-xs font-bold uppercase">{language === 'ar' ? 'EN' : 'AR'}</span>
        </button>
    );
};

const Header: React.FC = () => {
  const { theme, themeMode, toggleThemeMode } = useBranding();
  const { t } = useLanguage();
  const { userRole, toggleUserRole } = useSettings();

  return (
    <header className="sticky top-0 z-50 h-20 bg-panel/80 backdrop-blur-md border-b border-border-subtle flex items-center justify-between px-6">
      {/* Left Side (Brand & Nav) */}
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-3">
          {theme.logoUrl ? <img src={theme.logoUrl} alt="Brand" className="h-8" /> : <div className="w-8 h-8 bg-brand-primary rounded-lg flex items-center justify-center text-white font-black text-lg">R</div>}
          <span className="font-black text-lg text-text-primary hidden md:block">RaidanPro</span>
        </div>
        {/* Mega Menu Placeholder */}
        <nav className="hidden lg:flex items-center gap-6">
            <span className="text-xs font-bold text-text-secondary hover:text-text-primary cursor-pointer transition-colors">{t('header_menu_intel')}</span>
            <span className="text-xs font-bold text-text-secondary hover:text-text-primary cursor-pointer transition-colors">{t('header_menu_data')}</span>
            <span className="text-xs font-bold text-text-secondary hover:text-text-primary cursor-pointer transition-colors">{t('header_menu_core')}</span>
        </nav>
      </div>

      {/* Right Side (Actions & Profile) */}
      <div className="flex items-center gap-3">
        <button className="hidden md:flex items-center gap-2 bg-canvas border border-border-subtle rounded-lg px-3 py-2 text-xs text-text-subtle font-bold shadow-sm">
          <Search size={14} /> {t('header_search_placeholder')}
          <div className="flex items-center gap-1 border-l border-border-subtle pl-2 ml-1">
            <Command size={10} />
            <span className="text-[10px]">K</span>
          </div>
        </button>
        
        <div className="w-px h-6 bg-border-subtle mx-2 hidden md:block"></div>

        <LanguageSwitcher />

        <button onClick={toggleThemeMode} className="p-2.5 bg-canvas border border-border-subtle rounded-lg text-text-subtle hover:text-text-primary transition-colors shadow-sm">
          {themeMode === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
        </button>
        
        <button className="p-2.5 bg-canvas border border-border-subtle rounded-lg text-text-subtle hover:text-text-primary transition-colors shadow-sm relative">
          <Bell size={16} />
          <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-brand-accent rounded-full border border-panel"></div>
        </button>
        
        <div className="w-px h-6 bg-border-subtle mx-2"></div>

        {/* Demo Role Switcher */}
        <button onClick={toggleUserRole} className="p-2.5 bg-brand-accent/20 border border-brand-accent/30 rounded-lg text-brand-accent text-xs font-black uppercase shadow-sm">
            {userRole}
        </button>

        <div className="relative group">
            <button className="w-10 h-10 bg-brand-primary rounded-full flex items-center justify-center text-white font-bold border-2 border-brand-primary/50 group-hover:border-brand-accent transition-colors">
                <User size={20} />
            </button>
            <div className="absolute top-full right-0 mt-2 w-48 bg-panel border border-border-subtle rounded-xl shadow-elevation p-2 opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all duration-300 transform group-hover:translate-y-0 translate-y-2">
                <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-md text-xs font-bold text-text-secondary hover:bg-canvas hover:text-text-primary"><Settings size={14} /> {t('profile_title')}</a>
                <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-md text-xs font-bold text-text-secondary hover:bg-canvas hover:text-text-primary"><LogOut size={14} /> {t('profile_logout')}</a>
            </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
