
import React from 'react';
import { 
  LayoutDashboard, 
  Brain, 
  Binoculars, 
  Microscope, 
  Radio, 
  Database, 
  ShieldCheck, 
  Server,
  Terminal,
  FileCode,
  Zap,
  Map,
  Video,
  Globe,
  Activity,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';
import { ModuleType } from '../types';
import { MODULES } from '../constants';

interface SidebarProps {
  activeModule: ModuleType | 'dashboard' | 'terminal' | 'config' | 'pipeline' | 'strategy' | 'dns' | 'diagnostic';
  setActiveModule: (module: any) => void;
  isOpen: boolean;
  toggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeModule, setActiveModule, isOpen, toggle }) => {
  const getIcon = (id: string) => {
    switch (id) {
      case 'brain': return <Brain size={20} />;
      case 'watchtower': return <Binoculars size={20} />;
      case 'cleanroom': return <Microscope size={20} />;
      case 'warroom': return <Radio size={20} />;
      case 'vault': return <Database size={20} />;
      case 'shield': return <ShieldCheck size={20} />;
      case 'hosting': return <Server size={20} />;
      case 'media': return <Video size={20} />;
      default: return <LayoutDashboard size={20} />;
    }
  };

  return (
    <aside 
      className={`bg-yemenBlue-dark text-white transition-all duration-300 flex flex-col z-50 ${
        isOpen ? 'w-72' : 'w-20'
      }`}
    >
      <div className="h-16 flex items-center px-6 border-b border-yemenBlue/30">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-yemenGold rounded flex items-center justify-center text-yemenBlue-dark font-bold">Y</div>
          {isOpen && <span className="font-bold text-lg tracking-tight">YemenJPT Admin</span>}
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto custom-scrollbar py-4 px-3 space-y-1">
        <button
          onClick={() => setActiveModule('dashboard')}
          className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-colors ${
            activeModule === 'dashboard' ? 'bg-yemenGold text-yemenBlue-dark font-semibold' : 'hover:bg-yemenBlue/50'
          }`}
        >
          <LayoutDashboard size={20} />
          {isOpen && <span>الرئيسية</span>}
        </button>

        <button
          onClick={() => setActiveModule('diagnostic')}
          className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-colors ${
            activeModule === 'diagnostic' ? 'bg-yemenGold text-yemenBlue-dark font-semibold' : 'hover:bg-yemenBlue/50'
          }`}
        >
          <Activity size={20} />
          {isOpen && <span>الفحص الشامل (Diagnostic)</span>}
        </button>

        <button
          onClick={() => setActiveModule('strategy')}
          className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-colors ${
            activeModule === 'strategy' ? 'bg-yemenGold text-yemenBlue-dark font-semibold' : 'hover:bg-yemenBlue/50'
          }`}
        >
          <Map size={20} />
          {isOpen && <span>استراتيجية البنية (Master)</span>}
        </button>

        <button
          onClick={() => setActiveModule('pipeline')}
          className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-colors ${
            activeModule === 'pipeline' ? 'bg-yemenGold text-yemenBlue-dark font-semibold' : 'hover:bg-yemenBlue/50'
          }`}
        >
          <Zap size={20} />
          {isOpen && <span>سير العمل (Pipeline)</span>}
        </button>

        <div className="my-4 border-t border-yemenBlue/20 pt-4">
          {isOpen && <p className="px-3 text-xs font-semibold text-yemenBlue-light uppercase mb-2">الأدوات السيادية</p>}
          {MODULES.map(module => (
            <button
              key={module.id}
              onClick={() => setActiveModule(module.id)}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-colors mb-1 ${
                activeModule === module.id ? 'bg-yemenBlue text-white border-l-4 border-yemenGold' : 'hover:bg-yemenBlue/50'
              }`}
            >
              {getIcon(module.id)}
              {isOpen && (
                <div className="text-right flex-1">
                  <div className="text-sm font-medium">{module.title.split('(')[0]}</div>
                  <div className="text-[10px] opacity-60 truncate">{module.description}</div>
                </div>
              )}
            </button>
          ))}
        </div>

        <div className="my-4 border-t border-yemenBlue/20 pt-4">
          {isOpen && <p className="px-3 text-xs font-semibold text-yemenBlue-light uppercase mb-2">الإدارة الفنية</p>}
          <button
            onClick={() => setActiveModule('dns')}
            className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-colors mb-1 ${
              activeModule === 'dns' ? 'bg-yemenBlue text-white border-l-4 border-yemenGold' : 'hover:bg-yemenBlue/50'
            }`}
          >
            <Globe size={20} />
            {isOpen && <span>إدارة DNS (Technitium)</span>}
          </button>
          <button
            onClick={() => setActiveModule('terminal')}
            className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-colors ${
              activeModule === 'terminal' ? 'bg-yemenBlue text-white border-l-4 border-yemenGold' : 'hover:bg-yemenBlue/50'
            }`}
          >
            <Terminal size={20} />
            {isOpen && <span>وحدة التحكم (Terminal)</span>}
          </button>
          <button
            onClick={() => setActiveModule('config')}
            className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-colors mt-1 ${
              activeModule === 'config' ? 'bg-yemenBlue text-white border-l-4 border-yemenGold' : 'hover:bg-yemenBlue/50'
            }`}
          >
            <FileCode size={20} />
            {isOpen && <span>مولد الإعدادات</span>}
          </button>
        </div>
      </nav>

      <div className="p-4 border-t border-yemenBlue/20">
        <button 
          onClick={toggle}
          className="w-full flex items-center justify-center p-2 rounded bg-yemenBlue/30 hover:bg-yemenBlue/50 transition-colors"
        >
          {isOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
