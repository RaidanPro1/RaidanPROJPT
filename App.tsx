
import React, { useState } from 'react';
import { 
  ShieldCheck, Activity, Zap, Brain, Fingerprint, 
  Map as MapIcon, Radar, Share2, Newspaper, 
  TowerControl, Mic2, LayoutDashboard, ChevronRight,
  Database, Globe, Lock, Cpu, Settings, BookText,
  AlertTriangle, CheckCircle2, Info, X, Wrench, DatabaseZap,
  Settings2, MessageSquare
} from 'lucide-react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Footer from './components/Footer';
import ToolSettingsModal from './components/ToolSettingsModal';
import SystemOverview from './components/SystemOverview';
import WorkflowManager from './components/WorkflowManager';
import TenantManager from './components/TenantManager';
import TenantDashboard from './components/TenantDashboard'; // NEW
import ForensicsLab from './components/ForensicsLab';
import PredictiveCenter from './components/PredictiveCenter';
import DialectEngine from './components/DialectEngine';
import GeoIntStation from './components/GeoIntStation';
import DataJournalism from './components/DataJournalism';
import SmartNewsroom from './components/SmartNewsroom';
import RootCommandCenter from './components/RootCommandCenter';
import SettingsPage from './components/SettingsPage';
import BrandingPage from './components/BrandingPage';
import GovernancePage from './components/GovernancePage';
import ToolIdentityManager from './components/ToolIdentityManager';
import TerminalConsole from './components/TerminalConsole';
import DataFeedsManager from './components/DataFeedsManager';
import ProfilePage from './components/ProfilePage';
import PublicChatInterface from './components/PublicChatInterface';
import PredictiveHub from './components/PredictiveHub';
import SeoManager from './components/SeoManager';
import MarketingLanding from './components/MarketingLanding'; // NEW
import LandingPageEditor from './components/LandingPageEditor'; // NEW
import LoginPage from './components/LoginPage'; // NEW
import ModelForge from './components/ModelForge'; // NEW
import { Service, ActiveModule, Tenant } from './types';
import { INITIAL_SERVICES } from './constants';
import { useBranding } from './context/BrandingContext';
import { useToolRegistry } from './context/ToolRegistryContext';
import { useSettings } from './context/SettingsContext';
import AIAssistant from './components/AIAssistant';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeModule, setActiveModule] = useState<ActiveModule>('dashboard');
  const [services] = useState<Service[]>(INITIAL_SERVICES);
  const { getToolInfo } = useToolRegistry();
  const { userRole } = useSettings();
  const [toast, setToast] = useState<{ message: string; type: 'info' | 'success' | 'error'; visible: boolean }>({ message: '', type: 'info', visible: false });

  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [selectedTool, setSelectedTool] = useState<any>(null);
  
  // Temporary Tenant for Demo
  const mockTenant: Tenant = {
    id: 'demo-1',
    name: 'مؤسسة الصحافة الحديثة',
    domain: 'modernpress.net',
    status: 'active',
    cf_status: 'connected',
    cpu_usage: 45,
    ram_usage: 2048,
    services: ['wordpress', 'ghost'],
    created_at: '2025-01-01',
    publishing_config: { wordpress_url: 'https://demo.wp.com', social_connections: { facebook: true, twitter: false, linkedin: true } },
    email_config: { 
        enabled: true, 
        inbound_address: ['info@modernpress.net'], 
        forward_to: 'admin@raidan.pro', 
        smtp_server: 'mail.raidan.pro', 
        smtp_user: 'admin@raidan.pro', 
        smtp_port: 587, 
        dns_status: 'verified' 
    }
  };

  if (!isLoggedIn) {
     // Check if user is visiting landing page explicitly (URL logic simplified here)
     const showLanding = window.location.pathname === '/landing';
     if(showLanding) return <MarketingLanding />;
     
     return <LoginPage onLogin={() => setIsLoggedIn(true)} />;
  }

  const renderContent = () => {
    switch (activeModule) {
      case 'dashboard':
        return (
          <div className="space-y-8 animate-in fade-in duration-700">
            <SystemOverview services={services} />
            <div className="space-y-6">
              <h3 className="text-sm font-black text-text-primary uppercase tracking-[0.2em]">ترسانة العمليات السيادية</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                 <ArsenalCard toolKey="public_chat" onClick={() => setActiveModule('public_chat')} onSettingsClick={() => openToolSettings('public_chat')} />
                 <ArsenalCard toolKey="smart_newsroom" onClick={() => setActiveModule('smart_newsroom')} onSettingsClick={() => openToolSettings('smart_newsroom')} />
                 <ArsenalCard toolKey="forensics_lab" onClick={() => setActiveModule('forensics_lab')} onSettingsClick={() => openToolSettings('forensics_lab')} />
                 <ArsenalCard toolKey="predictive_hub" onClick={() => setActiveModule('predictive_hub')} onSettingsClick={() => openToolSettings('predictive_hub')} />
                 <ArsenalCard toolKey="geo_int_station" onClick={() => setActiveModule('geo_int_station')} onSettingsClick={() => openToolSettings('geo_int_station')} />
                 <ArsenalCard toolKey="predictive_center" onClick={() => setActiveModule('predictive_center')} onSettingsClick={() => openToolSettings('predictive_center')} />
                 <ArsenalCard toolKey="dialect_engine" onClick={() => setActiveModule('dialect_engine')} onSettingsClick={() => openToolSettings('dialect_engine')} />
                 <ArsenalCard toolKey="data_journalism" onClick={() => setActiveModule('data_journalism')} onSettingsClick={() => openToolSettings('data_journalism')} />
                 <ArsenalCard toolKey="root_command" onClick={() => setActiveModule('root_command')} onSettingsClick={() => openToolSettings('root_command')} />
                 <ArsenalCard toolKey="governance" onClick={() => setActiveModule('governance')} onSettingsClick={() => openToolSettings('governance')} />
              </div>
            </div>
          </div>
        );
      
      case 'public_chat': return <PublicChatInterface />;
      case 'predictive_hub': return <PredictiveHub />;
      case 'marketing_editor': return <LandingPageEditor />;
      case 'seo_manager': return <SeoManager />;
      case 'smart_newsroom': return <SmartNewsroom />;
      case 'forensics_lab': return <ForensicsLab />;
      case 'predictive_center': return <PredictiveCenter />;
      case 'dialect_engine': return <DialectEngine />;
      case 'geo_int_station': return <GeoIntStation />;
      case 'data_journalism': return <DataJournalism />;
      case 'root_command': return <RootCommandCenter />;
      case 'governance': return <GovernancePage />;
      case 'branding': return <BrandingPage />;
      case 'tenants': return <TenantDashboard tenant={mockTenant} />;
      case 'core_settings': return <SettingsPage />;
      case 'tool_identity': return <ToolIdentityManager />;
      case 'terminal': return <TerminalConsole />;
      case 'data_feeds': return <DataFeedsManager />;
      case 'profile': return <ProfilePage />;
      // @ts-ignore
      case 'model_forge': return <ModelForge />; // Added ModelForge
      default: return <div className="p-20 text-center bg-panel border-2 border-dashed border-border-subtle rounded-2xl text-text-subtle font-black uppercase tracking-widest">الوحدة قيد التجهيز...</div>;
    }
  };

  // Helper functions
  const showToast = (message: string, type: 'info' | 'success' | 'error' = 'info') => {
    setToast({ message, type, visible: true });
    setTimeout(() => setToast(prev => ({ ...prev, visible: false })), 5000);
  };

  const openToolSettings = (toolKey: string) => {
    const tool = getToolInfo(toolKey);
    if (tool && (tool as any).settings) { 
      setSelectedTool(tool);
      setIsSettingsModalOpen(true);
    } else {
        const mockTool = {
            display_name: tool?.display_name || "Default Tool",
            settings: {
                user: { creativity: { type: "slider", label: "مستوى الإبداع", value: 0.7, min: 0, max: 1, step: 0.1 }},
                root: { ramLimit: { type: "slider", label: "حد الذاكرة (MB)", value: 512, min: 128, max: 2048, step: 128 }, maintenanceMode: { type: "toggle", label: "وضع الصيانة", value: false }}
            }
        };
        setSelectedTool(mockTool);
        setIsSettingsModalOpen(true);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-canvas text-text-primary font-tajawal overflow-hidden">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar activeModule={activeModule} setActiveModule={setActiveModule} isOpen={true} toggle={() => {}} />
        <main className="flex-1 overflow-y-auto custom-scrollbar relative">
          <div className="p-8 max-w-[1800px] mx-auto pb-24">
            {renderContent()}
          </div>
        </main>
      </div>
      <Footer />
      
      <AIAssistant />
      
      {isSettingsModalOpen && selectedTool && (
        <ToolSettingsModal 
            isOpen={isSettingsModalOpen}
            onClose={() => setIsSettingsModalOpen(false)}
            tool={selectedTool}
            userRole={userRole}
        />
      )}

      {toast.visible && <Toast message={toast.message} type={toast.type} onDismiss={() => setToast({ ...toast, visible: false })} />}
    </div>
  );
};

// --- ArsenalCard (Kept Same) ---
const ArsenalCard: React.FC<{ toolKey: string, onClick: () => void, onSettingsClick: () => void }> = ({ toolKey, onClick, onSettingsClick }) => {
  const { getToolInfo } = useToolRegistry();
  const tool = getToolInfo(toolKey);

  const defaultIcons: { [key: string]: React.ReactNode } = {
    smart_newsroom: <Newspaper size={24} />,
    forensics_lab: <Fingerprint size={24} />,
    geo_int_station: <MapIcon size={24} />,
    predictive_center: <Radar size={24} />,
    dialect_engine: <Mic2 size={24} />,
    data_journalism: <Share2 size={24} />,
    root_command: <TowerControl size={24} />,
    governance: <BookText size={24} />,
    public_chat: <MessageSquare size={24} />,
    predictive_hub: <Globe size={24} />,
  };
  
  if (!tool) return null;

  return (
      <div className="bg-panel p-6 rounded-2xl border border-border-subtle flex flex-col justify-between h-56 group relative hover:translate-y-[-4px] shadow-sm hover:shadow-elevation">
        <div className="flex justify-between items-start mb-4 z-10">
          <div className="p-4 rounded-xl transition-all shadow-sm group-hover:scale-110 border bg-canvas border-border-subtle text-brand-primary">{defaultIcons[toolKey]}</div>
          <button onClick={(e) => { e.stopPropagation(); onSettingsClick(); }} className="p-2 bg-canvas rounded-lg border border-border-subtle text-text-subtle hover:text-brand-primary hover:border-brand-primary/50 transition-all opacity-0 group-hover:opacity-100">
            <Settings2 size={14} />
          </button>
        </div>
        <div onClick={onClick} className="cursor-pointer">
          <h4 className="text-sm font-black text-text-primary uppercase group-hover:text-brand-primary transition-colors mb-1 font-tajawal">{tool.display_name}</h4>
          <p className="text-[9px] text-text-subtle font-bold uppercase tracking-widest leading-relaxed line-clamp-2">{tool.description}</p>
        </div>
      </div>
  );
};

const Toast: React.FC<{ message: string; type: 'info' | 'success' | 'error'; onDismiss: () => void; }> = ({ message, type, onDismiss }) => {
  const baseClasses = "fixed top-24 right-6 z-[200] flex items-center gap-4 p-4 rounded-xl shadow-2xl border animate-in slide-in-from-top-12 duration-500";
  const typeClasses = {
    info: "bg-brand-primary text-white border-brand-accent/30",
    success: "bg-green-600 text-white border-green-400/30",
    error: "bg-red-600 text-white border-red-400/30",
  };
  const Icon = { info: <Info size={20} />, success: <CheckCircle2 size={20} />, error: <AlertTriangle size={20} />,}[type];
  return (
    <div className={`${baseClasses} ${typeClasses[type]}`}>
      {Icon}
      <p className="text-sm font-bold">{message}</p>
      <button onClick={onDismiss} className="p-1 rounded-full hover:bg-white/10"><X size={16} /></button>
    </div>
  );
};

export default App;
