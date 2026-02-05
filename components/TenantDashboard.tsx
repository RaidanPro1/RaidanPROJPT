
import React, { useState } from 'react';
import { 
  Layout, Mail, Server, Globe, Users, Wrench, 
  Save, RefreshCcw, ExternalLink, Shield, Settings2,
  PenTool, Share2, Facebook, Twitter, Linkedin
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { Tenant } from '../types';
import TenantPublishing from './TenantPublishing';
import EmailSettingsDashboard from './EmailSettingsDashboard'; // Reusing existing
import DNSManager from './DNSManager'; // Reusing existing

// Placeholder components for other tabs
const HostingPanel = () => <div className="p-8 text-center text-slate-500 font-bold">Hosting Management Panel (Coming Soon)</div>;
const UsersPanel = () => <div className="p-8 text-center text-slate-500 font-bold">User Management Panel (Coming Soon)</div>;
const ToolsPanel = () => <div className="p-8 text-center text-slate-500 font-bold">Tool Configuration Panel (Coming Soon)</div>;

interface TenantDashboardProps {
  tenant: Tenant;
}

const TenantDashboard: React.FC<TenantDashboardProps> = ({ tenant }) => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'overview' | 'publishing' | 'email' | 'hosting' | 'dns' | 'users' | 'tools'>('overview');

  const tabs = [
    { id: 'overview', label: t('tenant_tabs_overview'), icon: <Layout size={16} /> },
    { id: 'publishing', label: t('tenant_tabs_publishing'), icon: <PenTool size={16} /> },
    { id: 'email', label: t('tenant_tabs_email'), icon: <Mail size={16} /> },
    { id: 'hosting', label: t('tenant_tabs_hosting'), icon: <Server size={16} /> },
    { id: 'dns', label: t('tenant_tabs_dns'), icon: <Globe size={16} /> },
    { id: 'users', label: t('tenant_tabs_users'), icon: <Users size={16} /> },
    { id: 'tools', label: t('tenant_tabs_tools'), icon: <Wrench size={16} /> },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      {/* Tenant Header */}
      <div className="bg-panel p-6 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6 border border-border-subtle shadow-elevation">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 bg-brand-primary/10 rounded-2xl flex items-center justify-center text-brand-primary border border-brand-primary/20">
            <Users size={32} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-text-primary leading-none">{tenant.name}</h2>
            <div className="flex items-center gap-2 mt-2">
               <span className="text-xs font-bold text-text-subtle font-mono">{tenant.domain}</span>
               <div className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${tenant.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                 {tenant.status}
               </div>
            </div>
          </div>
        </div>
        <button className="bg-canvas border border-border-subtle hover:bg-brand-primary hover:text-white text-text-secondary px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest transition-all flex items-center gap-2">
           <ExternalLink size={14} /> Visit Site
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 h-[700px]">
        {/* Sidebar Tabs */}
        <div className="lg:w-64 flex flex-col gap-2 bg-panel p-4 rounded-2xl border border-border-subtle h-full">
           {tabs.map(tab => (
             <button
               key={tab.id}
               onClick={() => setActiveTab(tab.id as any)}
               className={`w-full p-3 rounded-xl text-right transition-all flex items-center gap-3 font-bold text-xs ${
                 activeTab === tab.id 
                 ? 'bg-brand-primary text-white shadow-md' 
                 : 'text-text-secondary hover:bg-canvas'
               }`}
             >
                <div className={`p-1.5 rounded-lg ${activeTab === tab.id ? 'bg-white/20' : 'bg-transparent'}`}>
                   {tab.icon}
                </div>
                {tab.label}
             </button>
           ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-panel rounded-2xl border border-border-subtle overflow-y-auto custom-scrollbar relative">
           {activeTab === 'overview' && (
             <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-canvas p-6 rounded-xl border border-border-subtle">
                   <h3 className="text-sm font-black text-text-primary uppercase mb-4">Resource Usage</h3>
                   <div className="space-y-4">
                      <div className="space-y-1">
                         <div className="flex justify-between text-xs font-bold text-text-subtle">
                            <span>CPU</span>
                            <span>{tenant.cpu_usage}%</span>
                         </div>
                         <div className="w-full h-2 bg-border-subtle rounded-full overflow-hidden">
                            <div className="h-full bg-brand-primary" style={{ width: `${tenant.cpu_usage}%` }}></div>
                         </div>
                      </div>
                      <div className="space-y-1">
                         <div className="flex justify-between text-xs font-bold text-text-subtle">
                            <span>RAM</span>
                            <span>{tenant.ram_usage}MB</span>
                         </div>
                         <div className="w-full h-2 bg-border-subtle rounded-full overflow-hidden">
                            <div className="h-full bg-purple-500" style={{ width: '40%' }}></div>
                         </div>
                      </div>
                   </div>
                </div>
             </div>
           )}

           {activeTab === 'publishing' && <TenantPublishing config={tenant.publishing_config} />}
           
           {activeTab === 'email' && (
             <div className="p-6">
                <EmailSettingsDashboard emailConfig={tenant.email_config || {
                    enabled: true, inbound_address: [], forward_to: '', smtp_server: '', smtp_user: '', smtp_port: 0, dns_status: 'failed'
                }} />
             </div>
           )}

           {activeTab === 'dns' && (
             <div className="p-6">
                <DNSManager />
             </div>
           )}

           {activeTab === 'hosting' && <HostingPanel />}
           {activeTab === 'users' && <UsersPanel />}
           {activeTab === 'tools' && <ToolsPanel />}
        </div>
      </div>
    </div>
  );
};

export default TenantDashboard;
