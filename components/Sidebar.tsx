
import React from 'react';
import { 
  ShieldCheck, LayoutDashboard, MessageSquare, Globe, TowerControl, 
  Newspaper, Fingerprint, Map, Mic2, Share2, Radar, 
  Palette, Search, Users, Wrench, LifeBuoy, 
  Sliders, Terminal, Brain, BookText, PenTool, 
  User, Briefcase, Activity, GitBranch
} from 'lucide-react';
import { useToolRegistry } from '../context/ToolRegistryContext';
import { useLanguage } from '../context/LanguageContext';
import { useSettings } from '../context/SettingsContext'; 
import { IconRenderer } from './IconRenderer';

interface SidebarProps {
  activeModule: any;
  setActiveModule: (module: any) => void;
  isOpen: boolean;
  toggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeModule, setActiveModule, isOpen, toggle }) => {
  const { getToolInfo } = useToolRegistry();
  const { t, language } = useLanguage();
  const { userRole } = useSettings();

  const menuClass = (id: string) => `w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 mb-1.5 group border ${
    activeModule === id 
    ? 'bg-brand-primary text-white font-black shadow-glow-blue border-brand-primary/50' 
    : 'text-text-secondary hover:bg-canvas hover:text-brand-primary border-transparent'
  }`;
  
  const getMenuItem = (key: string, defaultIcon: string, defaultName: string) => {
    const info = getToolInfo(key);
    return {
      key,
      name: t(info?.display_name || defaultName, info?.display_name || defaultName),
      icon: info?.icon_name || defaultIcon
    };
  };

  const investigationTools = [
    getMenuItem('smart_newsroom', 'Newspaper', 'غرفة الأخبار'),
    getMenuItem('forensics_lab', 'Fingerprint', 'مختبر الجنايات'),
    getMenuItem('geo_int_station', 'Map', 'المحطة الجغرافية'),
    getMenuItem('dialect_engine', 'Mic2', 'محرك الصوت'),
  ];

  const orgTools = [
    getMenuItem('tenants', 'Briefcase', 'إدارة المؤسسة'),
    getMenuItem('branding', 'Palette', 'تخصيص الهوية'),
    getMenuItem('seo_manager', 'Search', 'إدارة SEO'),
  ];

  const rootTools = [
    getMenuItem('root_command', 'TowerControl', 'برج المراقبة'),
    getMenuItem('model_forge', 'Brain', 'ورشة النماذج'),
    getMenuItem('governance', 'BookText', 'بروتوكول النظام'),
    getMenuItem('tool_identity', 'Wrench', 'هوية الأدوات'),
    getMenuItem('recovery_vault', 'LifeBuoy', 'شريان الحياة'),
    getMenuItem('terminal', 'Terminal', 'Terminal'),
    getMenuItem('core_settings', 'Sliders', 'الإعدادات المتقدمة'),
  ];

  return (
    <aside className={`bg-panel/80 backdrop-blur-glass text-text-primary transition-all duration-300 flex flex-col z-50 border-e border-border-glass relative hw-accel h-full ${isOpen ? 'w-80' : 'w-24'}`}>
      <div className={`absolute inset-y-0 w-px bg-gradient-to-b from-transparent via-brand-primary/20 to-transparent ${language === 'ar' ? 'left-0' : 'right-0'}`}></div>

      <div className="h-20 flex items-center justify-center px-6 border-b border-border-glass shrink-0">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-brand-primary rounded-xl flex items-center justify-center text-white font-black shadow-glow-blue border border-brand-primary/50 text-xs">YJPT</div>
          {isOpen && (
            <div className="flex flex-col animate-in slide-in-from-left-4">
              <span className="font-black text-lg tracking-tighter leading-none uppercase text-text-primary">YemenJPT</span>
              <span className="text-[9px] text-brand-primary font-bold uppercase tracking-[0.3em] mt-1 opacity-70">Strategic Ecosystem</span>
            </div>
          )}
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto custom-scrollbar py-6 px-4">
        <div className="mb-6">
          <button onClick={() => setActiveModule('dashboard')} className={menuClass('dashboard')}>
            <LayoutDashboard size={20} />
            {isOpen && <span className="text-xs uppercase tracking-wide truncate">الرئيسية</span>}
          </button>
          <button onClick={() => setActiveModule('public_chat')} className={menuClass('public_chat')}>
            <MessageSquare size={20} />
            {isOpen && <span className="text-xs uppercase tracking-wide truncate">المحادثة السيادية</span>}
          </button>
        </div>

        <div className="mb-6">
          {isOpen && <p className="px-3 text-[10px] font-black text-text-subtle uppercase mb-3 tracking-[0.2em]">ترسانة الاستقصاء المتقدمة</p>}
          {investigationTools.map(item => (
            <button key={item.key} onClick={() => setActiveModule(item.key)} className={menuClass(item.key)}>
              <IconRenderer iconName={item.icon} />
              {isOpen && <span className="text-xs uppercase tracking-wide truncate">{item.name}</span>}
            </button>
          ))}
        </div>
        
        {(userRole === 'root' || userRole === 'org_admin') && (
          <div className="mb-6">
            {isOpen && <p className="px-3 text-[10px] font-black text-text-subtle uppercase mb-3 tracking-[0.2em]">إدارة المؤسسة</p>}
            {orgTools.map(item => (
              <button key={item.key} onClick={() => setActiveModule(item.key)} className={menuClass(item.key)}>
                <IconRenderer iconName={item.icon} />
                {isOpen && <span className="text-xs uppercase tracking-wide truncate">{item.name}</span>}
              </button>
            ))}
          </div>
        )}

        {userRole === 'root' && (
          <div className="mb-6">
            {isOpen && <p className="px-3 text-[10px] font-black text-red-500 uppercase mb-3 tracking-[0.2em]">التحكم بالنواة (Root)</p>}
            {rootTools.map(item => (
              <button key={item.key} onClick={() => setActiveModule(item.key)} className={menuClass(item.key)}>
                <IconRenderer iconName={item.icon} className={activeModule === item.key ? 'text-white' : 'text-red-500/70'} />
                {isOpen && <span className="text-xs uppercase tracking-wide truncate">{item.name}</span>}
              </button>
            ))}
          </div>
        )}

        <div className="mt-auto mb-6">
           <button onClick={() => setActiveModule('profile')} className={menuClass('profile')}>
              <User size={20} />
              {isOpen && <span className="text-xs uppercase tracking-wide truncate">{t('sidebar_profile')}</span>}
            </button>
        </div>
      </nav>

      <div className="p-4 border-t border-border-glass shrink-0">
        <div className="bg-canvas/50 rounded-xl p-3 flex items-center justify-center gap-3 border border-border-subtle group hover:border-brand-primary/30 transition-all cursor-pointer overflow-hidden">
            <ShieldCheck size={16} className="text-green-500 shrink-0" />
            {isOpen && <span className="text-[10px] font-black text-text-subtle uppercase tracking-widest whitespace-nowrap">
              {userRole === 'root' ? 'Kernel Mode' : 'Secured Session'}
            </span>}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
