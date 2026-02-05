
import React from 'react';
import { ChevronLeft, ChevronRight, Zap, ShieldCheck, Palette, Wrench, Database, User, Globe, MessageSquare, PenTool, Brain } from 'lucide-react';
import { useBranding } from '../context/BrandingContext';
import { useToolRegistry } from '../context/ToolRegistryContext';
import { useLanguage } from '../context/LanguageContext';
import { useSettings } from '../context/SettingsContext'; // Need this for Role check
import { IconRenderer } from './IconRenderer';

interface SidebarProps {
  activeModule: any;
  setActiveModule: (module: any) => void;
  isOpen: boolean;
  toggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeModule, setActiveModule, isOpen, toggle }) => {
  const { theme } = useBranding();
  const { getToolInfo } = useToolRegistry();
  const { t, language } = useLanguage();
  const { userRole } = useSettings();

  const menuClass = (id: string) => `w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-300 mb-1.5 group border border-transparent ${
    activeModule === id 
    ? 'bg-brand-primary text-white font-black shadow-elevation' 
    : 'text-text-secondary hover:bg-canvas hover:text-brand-primary border-transparent hover:border-border-subtle'
  }`;
  
  const getMenuItem = (key: string, defaultIcon: string, defaultName: string) => {
    const info = getToolInfo(key);
    return {
      key,
      name: t(info?.display_name || defaultName, info?.display_name || defaultName),
      icon: info?.icon_name || defaultIcon
    };
  };

  const centralControl = [
    getMenuItem('dashboard', 'LayoutDashboard', 'الرئيسية (System Hub)',),
    getMenuItem('public_chat', 'MessageSquare', 'المحادثة السيادية'), 
    getMenuItem('predictive_hub', 'Globe', 'بوابة المؤشرات'), 
    getMenuItem('root_command', 'TowerControl', 'برج المراقبة (Root)'),
    getMenuItem('governance', 'BookText', 'عقيدة النظام'),
  ];
  
  const investigationModules = [
    getMenuItem('smart_newsroom', 'Newspaper', 'غرفة الأخبار'),
    getMenuItem('forensics_lab', 'Fingerprint', 'مختبر الجنايات'),
    getMenuItem('predictive_center', 'Radar', 'مركز الاستبصار'),
    getMenuItem('geo_int_station', 'Map', 'المحطة الجغرافية'),
    getMenuItem('dialect_engine', 'Mic2', 'محرك الصوت'),
    getMenuItem('data_journalism', 'Share2', 'كاشف الفساد'),
  ];

  const identityProvisioning = [
      getMenuItem('branding', 'Palette', 'تخصيص الواجهة'),
      getMenuItem('seo_manager', 'Search', 'إدارة SEO'), 
      getMenuItem('tenants', 'Users', 'إدارة المستأجرين'),
      getMenuItem('tool_identity', 'Wrench', 'هوية الأدوات'),
  ];
  
  const dataCoreModules = [
      getMenuItem('data_feeds', 'DatabaseZap', 'إدارة مصادر البيانات'),
  ];

  const coreModules = [
      getMenuItem('core_settings', 'Sliders', 'الإعدادات'),
      getMenuItem('terminal', 'Terminal', 'Terminal'),
  ];

  const userProfile = {
      key: 'profile',
      name: t('sidebar_profile'),
      icon: 'User'
  };


  return (
    <aside 
      className={`bg-panel text-text-primary transition-all duration-500 flex flex-col z-50 border-e border-border-subtle relative ${
        isOpen ? 'w-80' : 'w-24'
      }`}
    >
      <div className={`absolute inset-y-0 w-1 bg-gradient-to-b from-transparent via-brand-primary/10 to-transparent ${language === 'ar' ? 'left-0' : 'right-0'}`}></div>

      <div className="h-20 flex items-center px-6 border-b border-border-subtle bg-panel/80 backdrop-blur-md">
        <div className="flex items-center gap-4">
          {theme.logoUrl ? (
            <img src={theme.logoUrl} className="w-10 h-10 object-contain shadow-sm rounded-lg" />
          ) : (
            <div className="w-10 h-10 bg-brand-primary rounded-xl flex items-center justify-center text-white font-black shadow-sm text-xl">R</div>
          )}
          {isOpen && (
            <div className="flex flex-col animate-in slide-in-from-left-4">
              <span className="font-black text-lg tracking-tighter leading-none uppercase text-text-primary">RaidanPro</span>
              <span className="text-[9px] text-brand-primary font-bold uppercase tracking-[0.3em] mt-1 opacity-70">Sovereign Ecosystem</span>
            </div>
          )}
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto custom-scrollbar py-6 px-4">
        
        {/* User Profile Link */}
        <div className="mb-8">
             <button key={userProfile.key} onClick={() => setActiveModule(userProfile.key)} className={menuClass(userProfile.key)}>
              <IconRenderer iconName={userProfile.icon} className={activeModule === userProfile.key ? 'text-white' : 'text-brand-primary'} />
              {isOpen && <span className="text-xs uppercase tracking-wide truncate">{userProfile.name}</span>}
            </button>
        </div>

        <div className="mb-8">
          {isOpen && <p className="px-3 text-[10px] font-black text-text-subtle uppercase mb-4 tracking-[0.2em] flex items-center gap-2"><Zap size={10} className="text-brand-accent" /> {t('sidebar_section_central')}</p>}
          {centralControl.map(item => (
            <button key={item.key} onClick={() => setActiveModule(item.key)} className={menuClass(item.key)}>
              <IconRenderer iconName={item.icon} className={activeModule === item.key ? 'text-white' : 'text-brand-primary'} />
              {isOpen && <span className="text-xs uppercase tracking-wide truncate">{item.name}</span>}
            </button>
          ))}
        </div>

        <div className="mb-8">
          {isOpen && <p className="px-3 text-[10px] font-black text-text-subtle uppercase mb-4 tracking-[0.2em] flex items-center gap-2"><ShieldCheck size={10} className="text-brand-primary" /> {t('sidebar_section_investigation')}</p>}
          {investigationModules.map(item => (
            <button key={item.key} onClick={() => setActiveModule(item.key)} className={menuClass(item.key)}>
              <IconRenderer iconName={item.icon} />
              {isOpen && <span className="text-xs uppercase tracking-wide truncate">{item.name}</span>}
            </button>
          ))}
        </div>
        
        <div className="mb-8">
          {isOpen && <p className="px-3 text-[10px] font-black text-text-subtle uppercase mb-4 tracking-[0.2em] flex items-center gap-2"><Database size={10} className="text-purple-600" /> {t('sidebar_section_data_core')}</p>}
           {dataCoreModules.map(item => (
            <button key={item.key} onClick={() => setActiveModule(item.key)} className={menuClass(item.key)}>
              <IconRenderer iconName={item.icon} />
              {isOpen && <span className="text-xs uppercase tracking-wide truncate">{item.name}</span>}
            </button>
          ))}
        </div>

        <div className="mb-8">
          {isOpen && <p className="px-3 text-[10px] font-black text-text-subtle uppercase mb-4 tracking-[0.2em] flex items-center gap-2"><Palette size={10} className="text-purple-600" /> {t('sidebar_section_identity')}</p>}
           {identityProvisioning.map(item => (
            <button key={item.key} onClick={() => setActiveModule(item.key)} className={menuClass(item.key)}>
              <IconRenderer iconName={item.icon} />
              {isOpen && <span className="text-xs uppercase tracking-wide truncate">{item.name}</span>}
            </button>
          ))}
          {/* Marketing Editor - Root Only */}
          {userRole === 'root' && (
             <button key="marketing_editor" onClick={() => setActiveModule('marketing_editor')} className={menuClass('marketing_editor')}>
               <PenTool size={20} />
               {isOpen && <span className="text-xs uppercase tracking-wide truncate">{t('marketing_editor_title')}</span>}
             </button>
          )}
        </div>

        <div className="mb-8">
          {isOpen && <p className="px-3 text-[10px] font-black text-text-subtle uppercase mb-4 tracking-[0.2em]">{t('sidebar_section_core')}</p>}
          
          {/* New Model Forge Link - Root Only */}
          {userRole === 'root' && (
             <button key="model_forge" onClick={() => setActiveModule('model_forge')} className={menuClass('model_forge')}>
               <Brain size={20} />
               {isOpen && <span className="text-xs uppercase tracking-wide truncate">ورشة النماذج (Model Forge)</span>}
             </button>
          )}

          {coreModules.map(item => (
            <button key={item.key} onClick={() => setActiveModule(item.key)} className={menuClass(item.key)}>
              <IconRenderer iconName={item.icon} />
              {isOpen && <span className={`text-xs uppercase tracking-wide ${item.key === 'terminal' ? 'font-mono' : ''}`}>{item.name}</span>}
            </button>
          ))}
        </div>
      </nav>

      <div className="p-4 border-t border-border-subtle bg-canvas/50">
        <button 
          onClick={toggle}
          className="w-full flex items-center justify-center p-3 rounded-xl bg-panel hover:bg-brand-primary hover:text-white transition-all duration-300 border border-border-subtle shadow-sm group"
        >
          {isOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
