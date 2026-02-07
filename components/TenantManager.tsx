import React, { useState } from 'react';
import { Users, Search, Plus, MoreVertical, Globe, ShieldCheck, Cpu, Database, Trash2, ExternalLink, Activity, CloudLightning, Filter, ArrowUpRight, ShieldAlert } from 'lucide-react';
import { Tenant } from '../types';
import ProvisioningModal from './ProvisioningModal';

const MOCK_TENANTS: Tenant[] = [
  {
    id: '1',
    name: 'وحدة الاستقصاء - عدن',
    domain: 'aden.news.pro',
    status: 'active',
    cf_status: 'connected',
    cpu_usage: 18.2,
    ram_usage: 3072,
    services: ['web_hosting', 'ai_chat', 'monitoring'],
    created_at: '2025-05-01'
  },
];

const TenantManager: React.FC = () => {
  const [tenants, setTenants] = useState<Tenant[]>(MOCK_TENANTS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTenants = tenants.filter(t => 
    t.name.includes(searchTerm) || t.domain.includes(searchTerm)
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="bg-panel p-8 rounded-2xl border border-border-subtle shadow-elevation flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 bg-brand-primary/10 text-brand-primary rounded-2xl flex items-center justify-center shadow-sm border border-brand-primary/20">
            <Users size={32} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-text-primary">سجل الكيانات السيادية</h2>
            <p className="text-sm text-brand-primary font-bold uppercase tracking-wider">Sovereign Tenant Registry</p>
          </div>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-md bg-brand-accent text-canvas hover:scale-105 active:scale-95"
        >
          <Plus size={20} /> إضافة مستأجر جديد
        </button>
      </div>

      <div className="bg-panel rounded-2xl border border-border-subtle shadow-elevation overflow-hidden">
        <div className="p-6 border-b border-border-subtle flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="relative w-full md:w-96 group">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-text-subtle group-focus-within:text-brand-primary transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="بحث تكتيكي (اسم الكيان أو الدومين)..."
              className="w-full bg-canvas border border-border-subtle rounded-xl pr-12 pl-4 py-3 text-sm outline-none focus:border-brand-primary/50 transition-all text-text-primary"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="overflow-x-auto">
           {/* Table content would go here, refactored for dark theme */}
        </div>
      </div>
      
      <ProvisioningModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onProvision={(data) => {
          console.log('Provisioning started:', data);
          setIsModalOpen(false);
        }} 
      />
    </div>
  );
};

export default TenantManager;