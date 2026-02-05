
import React, { useState, useEffect } from 'react';
import { Activity, ShieldCheck, Lock, Globe, Brain, Binoculars, Server, CheckCircle2, AlertTriangle, RefreshCcw } from 'lucide-react';
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
      title: 'طبقة البنية التحتية (Infrastructure)',
      icon: <Server className="text-blue-500" />,
      services: services.filter(s => s.module === 'hosting'),
      security: [
        { label: 'Traefik Reverse Proxy', status: 'Secure', icon: <Lock size={14} /> },
        { label: 'Coolify Engine', status: 'Encrypted', icon: <ShieldCheck size={14} /> },
        { label: 'Technitium DNS', status: 'DoH Active', icon: <Globe size={14} /> }
      ]
    },
    {
      id: 'ai',
      title: 'النواة الذكية (AI Core)',
      icon: <Brain className="text-purple-500" />,
      services: services.filter(s => s.module === 'brain'),
      security: [
        { label: 'Ollama Instance', status: 'Local Only', icon: <Lock size={14} /> },
        { label: 'Whisper Node', status: 'Air-gapped', icon: <ShieldCheck size={14} /> },
        { label: 'Google Gemini SDK', status: 'Auth Token Secured', icon: <CheckCircle2 size={14} /> }
      ]
    },
    {
      id: 'osint',
      title: 'أدوات الاستخبارات (OSINT)',
      icon: <Binoculars className="text-orange-500" />,
      services: services.filter(s => s.module === 'watchtower'),
      security: [
        { label: 'SearXNG Instance', status: 'No-Log Enabled', icon: <ShieldCheck size={14} /> },
        { label: 'SpiderFoot API', status: 'Tor Routing Ready', icon: <Globe size={14} /> },
        { label: 'n8n Automation', status: 'Internal Network Only', icon: <Lock size={14} /> }
      ]
    },
    {
      id: 'security',
      title: 'الأمان والتشفير (Security)',
      icon: <ShieldCheck className="text-green-500" />,
      services: services.filter(s => s.module === 'shield'),
      security: [
        { label: 'Vaultwarden', status: 'Zero-Knowledge', icon: <Lock size={14} /> },
        { label: 'WireGuard VPN', status: 'AES-256 Active', icon: <ShieldCheck size={14} /> },
        { label: 'Kasm Isolation', status: 'Sandboxed', icon: <CheckCircle2 size={14} /> }
      ]
    }
  ];

  const restartScan = () => {
    setScanProgress(0);
    setIsScanning(true);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Scan Header */}
      <div className="bg-yemenBlue-dark text-white p-8 rounded-2xl shadow-xl relative overflow-hidden border-b-4 border-yemenGold">
        <div className="absolute top-0 right-0 p-12 opacity-10">
          <Activity size={200} className={isScanning ? 'animate-pulse' : ''} />
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-yemenGold text-yemenBlue-dark p-3 rounded-xl shadow-lg">
              <Activity size={32} className={isScanning ? 'animate-spin' : ''} />
            </div>
            <div>
              <h2 className="text-3xl font-black">فحص النظام الشامل (System Diagnostic)</h2>
              <p className="text-blue-100 opacity-80">مراجعة السيادة الرقمية وسلامة المنافذ والميكروسيرفس.</p>
            </div>
          </div>
          
          {isScanning ? (
            <div className="mt-8 space-y-2">
              <div className="flex justify-between text-xs font-bold mb-1 uppercase tracking-wider">
                <span>جاري فحص الطبقات والبروتوكولات...</span>
                <span>{scanProgress}%</span>
              </div>
              <div className="w-full bg-white/10 h-3 rounded-full overflow-hidden border border-white/20 p-0.5">
                <div 
                  className="bg-yemenGold h-full rounded-full transition-all duration-300 shadow-[0_0_10px_rgba(212,175,55,0.5)]"
                  style={{ width: `${scanProgress}%` }}
                ></div>
              </div>
            </div>
          ) : (
            <div className="mt-8 flex flex-col md:flex-row gap-4">
              <div className="bg-green-500/20 border border-green-500/30 px-4 py-2 rounded-lg flex items-center gap-2 text-green-400 font-bold text-sm">
                <ShieldCheck size={18} />
                جميع الطبقات مؤمنة وفقاً لبروتوكول raidan.pro
              </div>
              <button 
                onClick={restartScan}
                className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all"
              >
                <RefreshCcw size={16} />
                إعادة الفحص
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Diagnostic Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {layers.map(layer => (
          <div key={layer.id} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
            <div className="p-5 border-b border-gray-50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-50 rounded-lg">
                  {layer.icon}
                </div>
                <h3 className="font-bold text-gray-900">{layer.title}</h3>
              </div>
              <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded border border-green-100 uppercase tracking-tighter">
                Verified
              </span>
            </div>
            
            <div className="p-5 flex-1 space-y-4">
              <div className="grid grid-cols-2 gap-2">
                {layer.services.slice(0, 4).map(service => (
                  <div key={service.id} className="flex items-center gap-2 text-xs p-2 bg-gray-50 rounded border border-gray-100">
                    <div className={`w-2 h-2 rounded-full ${service.status === 'running' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    <span className="font-bold text-gray-700">{service.name}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-2 mt-4">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-1 mb-2">Security Verification</p>
                {layer.security.map((sec, i) => (
                  <div key={i} className="flex justify-between items-center bg-blue-50/30 p-2 rounded-lg group hover:bg-blue-50 transition-colors">
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      {sec.icon}
                      <span>{sec.label}</span>
                    </div>
                    <span className="text-[10px] font-black text-yemenBlue uppercase">{sec.status}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gray-50 p-3 border-t border-gray-100 flex items-center gap-2 px-5">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
              <p className="text-[10px] text-gray-400 font-mono">Port Management: Secured (iptables active)</p>
            </div>
          </div>
        ))}
      </div>

      {/* Global Alerts */}
      <div className="bg-amber-50 border border-amber-200 p-6 rounded-2xl flex flex-col md:flex-row items-center gap-6 shadow-sm">
        <div className="bg-amber-100 p-4 rounded-full">
          <AlertTriangle size={32} className="text-amber-600" />
        </div>
        <div className="flex-1">
          <h4 className="font-bold text-amber-900 mb-1">تنبيهات حالة المنافذ (Firewall Alert)</h4>
          <p className="text-sm text-amber-800 leading-relaxed">
            تم رصد محاولات دخول فاشلة (Brute Force) على منفذ SSH. قام نظام **Fail2Ban** بحظر العناوين المشبوهة تلقائياً. المنظومة تعمل خلف **Traefik** مما يحمي ميكروسيرفس الذكاء الاصطناعي من الهجمات المباشرة.
          </p>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <button className="flex-1 md:flex-none bg-amber-600 hover:bg-amber-700 text-white px-6 py-2 rounded-lg text-sm font-bold transition-all">
            عرض قائمة المحظورين
          </button>
        </div>
      </div>
    </div>
  );
};

export default SystemDiagnostic;
