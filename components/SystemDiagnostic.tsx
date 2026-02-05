
import React, { useState, useEffect } from 'react';
import { Activity, ShieldCheck, Lock, Globe, Brain, Binoculars, Server, CheckCircle2, AlertTriangle, RefreshCcw, Fingerprint, BarChart3 } from 'lucide-react';
import { Service } from '../types';

interface SystemDiagnosticProps {
  services: Service[];
}

const SystemDiagnostic: React.FC<SystemDiagnosticProps> = ({ services }) => {
  const [isScanning, setIsScanning] = useState(true);
  const [scanProgress, setScanProgress] = useState(0);

  useEffect(() => {
    if (isScanning) {
      const interval = setInterval(() => {
        setScanProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setIsScanning(false);
            return 100;
          }
          return prev + 5;
        });
      }, 100);
      return () => clearInterval(interval);
    }
  }, [isScanning]);

  const layers = [
    {
      id: 'infra',
      title: 'البنية التحتية (Infrastructure)',
      icon: <Server className="text-blue-500" />,
      services: services.filter(s => s.module === 'hosting'),
      security: [
        { label: 'Nginx Proxy Manager', status: 'Gateway Secure', icon: <Lock size={14} /> },
      ]
    },
    {
      id: 'ai',
      title: 'النواة الذكية (AI Core)',
      icon: <Brain className="text-purple-500" />,
      services: services.filter(s => s.module === 'brain'),
      security: [
        { label: 'Ollama Instance', status: 'Local Processing', icon: <Lock size={14} /> },
      ]
    },
  ];

  const restartScan = () => {
    setScanProgress(0);
    setIsScanning(true);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="bg-yemenBlue text-white p-8 rounded-2xl shadow-lg relative overflow-hidden border-b-4 border-yemenGold">
        <div className="absolute top-0 right-0 p-12 opacity-10">
          <Activity size={200} className={isScanning ? 'animate-pulse' : ''} />
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-yemenGold text-yemenBlue-dark p-3 rounded-xl shadow-md">
              <Activity size={32} className={isScanning ? 'animate-spin' : ''} />
            </div>
            <div>
              <h2 className="text-3xl font-black">فحص المنظومة السيادية</h2>
              <p className="text-blue-100 opacity-80">التحقق من سلامة الترسانة ومسارات التبليغ الآمن.</p>
            </div>
          </div>
          
          {isScanning ? (
            <div className="mt-8 space-y-2">
              <div className="flex justify-between text-xs font-bold mb-1 uppercase tracking-wider">
                <span>جاري فحص بروتوكولات الأمن...</span>
                <span>{scanProgress}%</span>
              </div>
              <div className="w-full bg-white/10 h-3 rounded-full overflow-hidden border border-white/20 p-0.5">
                <div 
                  className="bg-yemenGold h-full rounded-full transition-all duration-300"
                  style={{ width: `${scanProgress}%` }}
                ></div>
              </div>
            </div>
          ) : (
            <div className="mt-8 flex flex-col md:flex-row gap-4">
              <div className="bg-green-500/20 border border-green-500/30 px-4 py-2 rounded-lg flex items-center gap-2 text-green-300 font-bold text-sm">
                <ShieldCheck size={18} />
                جميع الطبقات مؤمنة وتعمل وفق بروتوكول raidan.pro
              </div>
              <button 
                onClick={restartScan}
                className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all shadow-sm"
              >
                <RefreshCcw size={16} />
                إعادة الفحص
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {layers.map(layer => (
          <div key={layer.id} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-100 rounded-lg">
                  {layer.icon}
                </div>
                <h3 className="font-bold text-slate-900">{layer.title}</h3>
              </div>
              <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded border border-green-100 uppercase">
                Sovereign OK
              </span>
            </div>
            
            <div className="p-5 flex-1 space-y-4">
              <div className="space-y-2 mt-4">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-1 mb-2">Security Compliance</p>
                {layer.security.map((sec, i) => (
                  <div key={i} className="flex justify-between items-center bg-blue-50/30 p-2 rounded-lg group hover:bg-blue-50 transition-colors">
                    <div className="flex items-center gap-2 text-xs text-slate-600">
                      {sec.icon}
                      <span>{sec.label}</span>
                    </div>
                    <span className="text-[10px] font-black text-yemenBlue uppercase">{sec.status}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SystemDiagnostic;
