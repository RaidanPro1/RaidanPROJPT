import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Footer from './components/Footer';
import SystemOverview from './components/SystemOverview';
import MediaLiteracyLab from './components/ForensicsLab'; 
import PredictiveHub from './components/PredictiveHub';
import DialectEngine from './components/DialectEngine';
import GeoIntStation from './components/GeoIntStation';
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
import SeoManager from './components/SeoManager';
import LandingPageEditor from './components/LandingPageEditor'; 
import ModelForge from './components/ModelForge'; 
import RecoveryPanel from './components/RecoveryPanel';
import TenantDashboard from './components/TenantDashboard';
import { Service, ActiveModule, Tenant } from './types';
import { INITIAL_SERVICES } from './constants';
import { useSettings } from './context/SettingsContext';
import AIAssistant from './components/AIAssistant';
import { 
    Monitor, Brain, TowerControl, MessageSquare, Zap, Fingerprint, 
    Mic2, Activity, Workflow, BarChart3, Box, Newspaper, Palette, 
    Search, Users, Globe, UserCheck, Database, Map, Share2, ShieldCheck, 
    GitBranch, Terminal, Shield, LayoutDashboard, Radio, BookOpen
} from 'lucide-react';

const App: React.FC = () => {
  const [activeModule, setActiveModule] = useState<ActiveModule>('dashboard');
  const [rootTab, setRootTab] = useState<'usage' | 'intel' | 'system'>('usage');
  const [services] = useState<Service[]>(INITIAL_SERVICES);
  const { userRole, settings } = useSettings();

  const mockTenant: Tenant = {
    id: 'demo-1',
    name: 'مؤسسة الصحافة اليمنية',
    domain: 'yemenpress.pro',
    status: 'active',
    cf_status: 'connected',
    cpu_usage: 24.5,
    ram_usage: 4096,
    services: ['ai_chat', 'cms_ghost', 'forensics'],
    created_at: '2025-01-01'
  };

  const renderDashboard = () => {
    switch (userRole) {
      case 'root': return <RootDashboard services={services} activeTab={rootTab} setTab={setRootTab} setModule={setActiveModule} />;
      case 'org_admin': return <OrgDashboard tenant={mockTenant} setModule={setActiveModule} />;
      default: return <UserArsenal setModule={setActiveModule} />;
    }
  };

  const renderContent = () => {
    if (activeModule === 'dashboard') return renderDashboard();
    
    switch (activeModule) {
      case 'public_chat': return <PublicChatInterface />;
      case 'smart_newsroom': return <SmartNewsroom />;
      case 'forensics_lab': return <MediaLiteracyLab />;
      case 'predictive_center': return <PredictiveHub />;
      case 'predictive_hub': return <PredictiveHub />;
      case 'dialect_engine': return <DialectEngine />;
      case 'geo_int_station': return <GeoIntStation />;
      case 'root_command': return <RootCommandCenter />;
      case 'governance': return <GovernancePage />;
      case 'branding': return <BrandingPage />;
      case 'core_settings': return <SettingsPage />;
      case 'tool_identity': return <ToolIdentityManager />;
      case 'terminal': return <TerminalConsole />;
      case 'data_feeds': return <DataFeedsManager />;
      case 'profile': return <ProfilePage />;
      case 'model_forge': return <ModelForge />;
      case 'recovery_vault': return <RecoveryPanel />;
      case 'seo_manager': return <SeoManager />;
      case 'marketing_editor': return <LandingPageEditor />;
      case 'tenants': return <TenantDashboard tenant={mockTenant} />;
      default: return <div className="p-20 text-center bg-panel border-2 border-dashed border-border-subtle rounded-2xl text-text-subtle font-black uppercase tracking-widest">الوحدة قيد التهيئة...</div>;
    }
  };

  return (
    <div className="h-screen flex flex-col bg-canvas text-text-primary font-tajawal overflow-hidden">
      <Header />
      
      <div className="flex-1 flex overflow-hidden relative">
        <Sidebar activeModule={activeModule} setActiveModule={setActiveModule} isOpen={true} toggle={() => {}} />
        <main className="flex-1 overflow-y-auto custom-scrollbar relative bg-canvas">
          <div className="p-8 max-w-[1800px] mx-auto pb-24 min-h-full">
            {renderContent()}
          </div>
        </main>
      </div>
      <Footer />
      <AIAssistant />
    </div>
  );
};

const RootDashboard: React.FC<any> = ({ services, activeTab, setTab, setModule }) => (
  <div className="space-y-8 animate-in fade-in duration-700">
    <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-red-500/10 rounded-2xl flex items-center justify-center text-red-500 border border-red-500/20 shadow-sm">
                <TowerControl size={32} />
            </div>
            <div>
                <h2 className="text-3xl font-black text-text-primary uppercase tracking-tighter leading-none">مركز إدارة العمليات (NOC)</h2>
                <p className="text-[10px] text-text-subtle font-black uppercase tracking-[0.4em] mt-2">Professional Cluster Management • Zone 01</p>
            </div>
        </div>
        <button onClick={() => setModule('terminal')} className="bg-slate-900 text-green-400 px-6 py-3 rounded-2xl border border-slate-800 hover:border-green-500/50 transition-all flex items-center gap-3 shadow-xl group">
            <Terminal size={18} className="group-hover:scale-110 transition-transform" />
            <span className="text-[10px] font-black uppercase tracking-widest">Execute Kernel Shell</span>
        </button>
    </div>

    <SystemOverview services={services} />

    <div className="flex bg-panel/50 backdrop-blur-md border border-border-subtle p-1.5 rounded-2xl w-fit mx-auto shadow-elevation sticky top-0 z-30">
      <TabButton active={activeTab === 'usage'} onClick={() => setTab('usage')} icon={<Monitor size={16}/>} label="العمليات التشغيلية" />
      <TabButton active={activeTab === 'intel'} onClick={() => setTab('intel')} icon={<Brain size={16}/>} label="مصفوفة الاستخبارات" />
      <TabButton active={activeTab === 'system'} onClick={() => setTab('system')} icon={<GitBranch size={16}/>} label="إدارة النواة" />
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-1 pb-12">
      {activeTab === 'usage' && (
        <>
          <ModuleCard title="إدارة Docker" desc="Portainer Stack Control & Image Registry" icon={<Box/>} onClick={() => window.open('http://172.28.0.45', '_blank')} badge="Kernel Mode" variant="system" />
          <ModuleCard title="المحادثة الاحترافية" desc="Multi-Agent AI Orchestration (Hybrid)" icon={<MessageSquare/>} onClick={() => setModule('public_chat')} badge="Hybrid AI" />
          <ModuleCard title="Grafana Monitor" desc="System Performance & Thermal Telemetry" icon={<BarChart3/>} onClick={() => window.open('http://172.28.0.46', '_blank')} variant="accent" />
        </>
      )}
      {activeTab === 'intel' && (
        <>
          <ModuleCard title="أتمتة n8n" desc="Agentic Workflow Automation Pipelines" icon={<Workflow/>} onClick={() => window.open('http://172.28.0.15', '_blank')} variant="accent" badge="Active" />
          <ModuleCard title="الدراية الإعلامية" desc="Defense Against Misinformation & Analysis" icon={<BookOpen/>} onClick={() => setModule('forensics_lab')} badge="Online" />
          <ModuleCard title="ورشة النماذج" desc="Ollama Model Personalization & Forge" icon={<Brain/>} onClick={() => setModule('model_forge')} variant="accent" />
        </>
      )}
      {activeTab === 'system' && (
        <>
          <ModuleCard title="إدارة النطاقات" desc="Technitium DNS & Subdomains" icon={<Globe/>} onClick={() => setModule('tenants')} variant="system" />
          <ModuleCard title="شريان الحياة" desc="Disaster Recovery & Node Replication" icon={<ShieldCheck/>} onClick={() => setModule('recovery_vault')} variant="system" />
          <ModuleCard title="هوية الأدوات" desc="Module Registry & Public Nomenclature" icon={<Palette/>} onClick={() => setModule('tool_identity')} variant="system" />
          <ModuleCard title="العقيدة الأمنية" desc="Hardening & Safety Filters" icon={<Shield/>} onClick={() => setModule('governance')} variant="system" />
        </>
      )}
    </div>
  </div>
);

const UserArsenal: React.FC<any> = ({ setModule }) => (
  <div className="space-y-8 animate-in fade-in duration-700 h-full flex flex-col">
    <div className="bg-panel p-10 rounded-[3rem] border border-border-subtle flex items-center justify-between shadow-elevation relative overflow-hidden group">
       <div className="absolute inset-0 bg-gradient-to-r from-brand-primary/5 via-transparent to-brand-primary/5 opacity-50"></div>
       <div className="flex items-center gap-8 relative z-10">
          <div className="w-24 h-24 bg-brand-primary/10 rounded-[2.5rem] flex items-center justify-center text-brand-primary border border-brand-primary/20 shadow-inner group-hover:scale-105 transition-transform duration-500">
             <UserCheck size={54}/>
          </div>
          <div>
            <h2 className="text-4xl font-black text-text-primary uppercase tracking-tight font-tajawal leading-tight">ترسانة الاستقصاء الاحترافية</h2>
            <p className="text-[11px] text-text-subtle font-black uppercase tracking-[0.4em] mt-2 flex items-center gap-2">
                <ShieldCheck size={14} className="text-brand-primary" />
                Strategic Tactical Mission Suite v5.0
            </p>
          </div>
       </div>
       <div className="text-right relative z-10 hidden md:block">
           <span className="text-[9px] font-black text-text-subtle uppercase tracking-widest block mb-1 opacity-60">Node Status</span>
           <span className="text-xs font-bold text-brand-primary font-mono tracking-tighter uppercase">SANA'A HUB // NODE_772</span>
       </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 flex-1 pb-10">
       <ModuleCard title="غرفة الأخبار" desc="Strategic Investigation Editor & Publisher" icon={<Newspaper/>} onClick={() => setModule('smart_newsroom')} badge="Mission Active" />
       <ModuleCard title="الدراية الإعلامية" desc="Analysis, Fact-Check & Media Creation" icon={<BookOpen/>} onClick={() => setModule('forensics_lab')} badge="Protection" />
       <ModuleCard title="محرك الصوت" desc="Dialect Intelligence & Audio Purification" icon={<Mic2/>} onClick={() => setModule('dialect_engine')} badge="Native" />
       <ModuleCard title="المحطة الجغرافية" desc="Sentinel-2 Satellite Mapping & OSINT" icon={<Map/>} onClick={() => setModule('geo_int_station')} />
       <ModuleCard title="بوابة المؤشرات" desc="Strategic National Indicators Hub" icon={<Globe/>} onClick={() => setModule('predictive_hub')} variant="accent" />
       <ModuleCard title="المحادثة الاحترافية" desc="Hybrid AI Investigative Co-Pilot" icon={<MessageSquare/>} onClick={() => setModule('public_chat')} variant="accent" />
    </div>
  </div>
);

const OrgDashboard: React.FC<any> = ({ tenant, setModule }) => (
  <div className="space-y-8 animate-in fade-in duration-700">
    <div className="bg-panel p-10 rounded-[2.5rem] border border-border-subtle shadow-elevation flex items-center justify-between border-r-8 border-r-brand-primary relative overflow-hidden">
       <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/5 rounded-full -mr-16 -mt-16"></div>
       <div className="flex items-center gap-8 relative z-10">
          <div className="w-24 h-24 bg-brand-primary rounded-[2rem] flex items-center justify-center text-white shadow-glow-blue border border-white/10"><Users size={48}/></div>
          <div>
            <h2 className="text-4xl font-black text-text-primary tracking-tighter uppercase">{tenant.name}</h2>
            <div className="flex items-center gap-6 mt-3">
               <div className="flex items-center gap-2 bg-canvas px-3 py-1 rounded-full border border-border-subtle">
                  <Globe size={12} className="text-brand-primary" />
                  <span className="text-[10px] font-mono font-bold text-text-secondary">{tenant.domain}</span>
               </div>
               <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-glow-green"></div>
                  <span className="text-[10px] font-black uppercase text-green-500 tracking-[0.2em]">Verified Entity</span>
               </div>
            </div>
          </div>
       </div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
       <ModuleCard title="غرفة الأخبار" desc="Manage Team Investigations" icon={<Newspaper/>} onClick={() => setModule('smart_newsroom')} />
       <ModuleCard title="إدارة الفريق" desc="RBAC Roles & Team Access" icon={<Users/>} onClick={() => setModule('tenants')} />
       <ModuleCard title="تخصيص الهوية" desc="White-label Branding Configuration" icon={<Palette/>} onClick={() => setModule('branding')} />
       <ModuleCard title="إدارة SEO" desc="Public Visibility & Meta Matrix" icon={<Search/>} onClick={() => setModule('seo_manager')} />
    </div>
  </div>
);

const TabButton: React.FC<{active: boolean, onClick: () => void, icon: React.ReactNode, label: string}> = ({active, onClick, icon, label}) => (
    <button onClick={onClick} className={`px-8 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest flex items-center gap-3 transition-all ${active ? 'bg-brand-primary text-white shadow-glow-blue' : 'text-text-subtle hover:bg-canvas hover:text-text-primary'}`}>
        {icon} {label}
    </button>
);

const ModuleCard: React.FC<{title: string, desc: string, icon: React.ReactNode, onClick: () => void, badge?: string, variant?: 'default' | 'accent' | 'system'}> = ({ title, desc, icon, onClick, badge, variant = 'default' }) => {
  const styles = {
    default: { border: 'border-border-glass group-hover:border-brand-primary/40', icon: 'text-brand-primary', badge: 'bg-brand-primary/10 text-brand-primary border-brand-primary/20', glow: 'group-hover:shadow-glow-blue' },
    accent: { border: 'border-brand-accent/20 group-hover:border-brand-accent/40', icon: 'text-brand-accent', badge: 'bg-brand-accent/10 text-brand-accent border-brand-accent/20', glow: 'group-hover:shadow-glow-accent' },
    system: { border: 'border-red-500/20 group-hover:border-red-500/40', icon: 'text-red-500', badge: 'bg-red-500/10 text-red-500 border-red-500/20', glow: 'group-hover:shadow-red-500/20' }
  }[variant];

  return (
    <div onClick={onClick} className={`bg-glass backdrop-blur-glass p-7 rounded-[2.5rem] border ${styles.border} flex flex-col justify-between h-64 group hover:-translate-y-2 shadow-elevation ${styles.glow} transition-all duration-500 cursor-pointer relative overflow-hidden`}>
      <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
      <div className="flex justify-between items-start z-10">
        <div className={`p-4 rounded-2xl transition-all shadow-sm group-hover:scale-110 border bg-panel/80 border-border-subtle ${styles.icon}`}>{icon}</div>
        {badge && <span className={`text-[8px] font-black px-2.5 py-1 rounded-full uppercase tracking-tighter border ${styles.badge} animate-in fade-in`}>{badge}</span>}
      </div>
      <div className="z-10 mt-auto">
        <h4 className="text-lg font-black text-text-primary uppercase group-hover:text-brand-primary transition-colors mb-2 truncate leading-none tracking-tight font-tajawal">{title}</h4>
        <p className="text-[10px] text-text-subtle font-bold uppercase tracking-widest leading-relaxed line-clamp-2 h-10 opacity-70 group-hover:opacity-100 transition-opacity">{desc}</p>
      </div>
      <div className="absolute -bottom-6 -right-6 opacity-0 group-hover:opacity-5 transition-opacity duration-700 pointer-events-none">
         {React.isValidElement(icon) && React.cloneElement(icon as React.ReactElement<any>, { size: 160 })}
      </div>
    </div>
  );
};

export default App;