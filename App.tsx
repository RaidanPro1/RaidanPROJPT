
import React, { useState, useEffect } from 'react';
import { Layout, Dashboard, Settings, Brain, Shield, Database, Microscope, Radio, HardDrive, Terminal, Zap, Map, Globe, Activity } from 'lucide-react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import ServicesGrid from './components/ServicesGrid';
import SystemOverview from './components/SystemOverview';
import AIAssistant from './components/AIAssistant';
import ConfigGenerator from './components/ConfigGenerator';
import WorkflowManager from './components/WorkflowManager';
import InfrastructureStrategy from './components/InfrastructureStrategy';
import DNSManager from './components/DNSManager';
import SystemDiagnostic from './components/SystemDiagnostic';
import { Service, ModuleType } from './types';
import { INITIAL_SERVICES } from './constants';

const App: React.FC = () => {
  const [activeModule, setActiveModule] = useState<ModuleType | 'dashboard' | 'terminal' | 'config' | 'pipeline' | 'strategy' | 'dns' | 'diagnostic'>('dashboard');
  const [services, setServices] = useState<Service[]>(INITIAL_SERVICES);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Simulate dynamic service status updates
  useEffect(() => {
    const interval = setInterval(() => {
      setServices(prev => prev.map(s => {
        if (s.status === 'running') {
          return {
            ...s,
            cpu: Math.max(0.5, Math.min(95, s.cpu + (Math.random() * 4 - 2))),
            ram: Math.max(128, Math.min(8192, s.ram + (Math.random() * 100 - 50)))
          };
        }
        return s;
      }));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleServiceAction = async (id: string, action: 'start' | 'stop' | 'restart') => {
    const serviceName = services.find(s => s.id === id)?.name;
    console.log(`[SYSTEM] Initiating ${action} for ${serviceName} via /api/v1/system/services/${id}/${action}`);

    // Optimistic UI Update: Change status locally before API confirms
    setServices(prev => prev.map(s => {
      if (s.id === id) {
        if (action === 'start') return { ...s, status: 'restarting' }; // Transition state
        if (action === 'stop') return { ...s, status: 'restarting' }; 
        if (action === 'restart') return { ...s, status: 'restarting' };
      }
      return s;
    }));

    // Simulate API Latency (1.5 seconds)
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Confirm Change
    setServices(prev => prev.map(s => {
      if (s.id === id) {
        if (action === 'start' || action === 'restart') {
          return { ...s, status: 'running', cpu: 2, ram: 512 };
        }
        if (action === 'stop') {
          return { ...s, status: 'stopped', cpu: 0, ram: 0 };
        }
      }
      return s;
    }));
  };

  const renderContent = () => {
    switch (activeModule) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            <SystemOverview services={services} />
            <WorkflowManager />
            <ServicesGrid services={services} onAction={handleServiceAction} />
          </div>
        );
      case 'strategy':
        return <InfrastructureStrategy />;
      case 'pipeline':
        return <WorkflowManager />;
      case 'config':
        return <ConfigGenerator />;
      case 'dns':
        return <DNSManager />;
      case 'diagnostic':
        return <SystemDiagnostic services={services} />;
      case 'terminal':
        return (
          <div className="bg-black text-green-500 p-4 font-mono h-[calc(100vh-160px)] rounded-lg shadow-inner overflow-y-auto custom-scrollbar">
            <div className="mb-2"># YemenJPT Sovereign-Admin v1.2.0-STABLE</div>
            <div className="mb-2">[OK] Infrastructure: yemenjpt-net attached</div>
            <div className="mb-2">[OK] Node: hosting.raidan.pro (NVMe Storage)</div>
            <div className="mb-2">[OK] GPU: NVIDIA RTX Passthrough Active</div>
            <div className="mb-2">[OK] Proxy: Traefik routing 16 services</div>
            <div className="mb-2">$ docker-compose ps</div>
            <div className="grid grid-cols-4 gap-4 border-b border-green-800 pb-1 mb-2 opacity-70">
              <div>SERVICE</div><div>MODULE</div><div>STATUS</div><div>RESOURCE</div>
            </div>
            {services.map(s => (
              <div key={s.id} className="grid grid-cols-4 gap-4 py-1 text-sm">
                <div>{s.name}</div>
                <div className="truncate opacity-60 text-xs">{s.module}</div>
                <div className={s.status === 'running' ? 'text-green-400' : s.status === 'restarting' ? 'text-yellow-400' : 'text-red-400'}>
                    {s.status.toUpperCase()}
                </div>
                <div className="opacity-50 text-[10px]">{s.cpu.toFixed(1)}% | {(s.ram / 1024).toFixed(1)}GB</div>
              </div>
            ))}
            <div className="mt-4 animate-pulse">_</div>
          </div>
        );
      default:
        const filteredServices = services.filter(s => s.module === activeModule);
        return (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
              <div className="bg-yemenBlue text-white p-3 rounded-lg">
                <Layout size={24} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-yemenBlue">إدارة وحدة: {activeModule}</h2>
                <p className="text-gray-500">تحكم كامل في ميكروسيرفس السيادة الرقمية اليمنية.</p>
              </div>
            </div>
            <ServicesGrid services={filteredServices} onAction={handleServiceAction} />
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-50 text-gray-900 font-tajawal overflow-hidden">
      <Sidebar 
        activeModule={activeModule} 
        setActiveModule={setActiveModule} 
        isOpen={isSidebarOpen}
        toggle={() => setIsSidebarOpen(!isSidebarOpen)}
      />
      
      <main className="flex-1 flex flex-col overflow-hidden">
        <Header toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
        
        <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
          <div className="max-w-7xl mx-auto">
            {renderContent()}
          </div>
        </div>

        <AIAssistant />
      </main>
    </div>
  );
};

export default App;
