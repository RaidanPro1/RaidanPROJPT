
import React, { useState } from 'react';
import { Play, Square, RotateCw, MoreVertical, Terminal, Cpu, Database, Loader2, Info } from 'lucide-react';
import { Service } from '../types';

interface ServicesGridProps {
  services: Service[];
  onAction: (id: string, action: 'start' | 'stop' | 'restart') => void;
}

const ServicesGrid: React.FC<ServicesGridProps> = ({ services, onAction }) => {
  const [showLogs, setShowLogs] = useState<Record<string, boolean>>({});

  const toggleLogs = (id: string) => {
    setShowLogs(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {services.map(service => (
        <div 
          key={service.id} 
          className={`bg-white rounded-xl border transition-all duration-300 overflow-hidden group relative ${
            service.status === 'restarting' ? 'border-yemenGold ring-2 ring-yemenGold/20 scale-[0.98]' : 'border-gray-200 hover:shadow-lg'
          }`}
        >
          {/* Restarting Overlay */}
          {service.status === 'restarting' && (
            <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] z-10 flex flex-col items-center justify-center space-y-3">
                <Loader2 size={32} className="text-yemenBlue animate-spin" />
                <p className="text-xs font-bold text-yemenBlue animate-pulse uppercase tracking-widest">Communicating with Docker Daemon...</p>
            </div>
          )}

          <div className="p-5">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
                  service.status === 'running' ? 'bg-green-100 text-green-700' : 
                  service.status === 'restarting' ? 'bg-yemenGold/20 text-yemenGold-dark' : 'bg-gray-100 text-gray-700'
                }`}>
                  <Terminal size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 leading-tight">{service.name}</h3>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className={`text-[9px] px-1.5 py-0.5 rounded-full uppercase font-bold border ${
                        service.status === 'running' 
                        ? 'bg-green-50 text-green-600 border-green-200' 
                        : service.status === 'restarting' ? 'bg-yemenGold/10 text-yemenGold-dark border-yemenGold/30' : 'bg-red-50 text-red-600 border-red-200'
                    }`}>
                        {service.status === 'running' ? 'نشط' : service.status === 'restarting' ? 'جاري المعالجة' : 'متوقف'}
                    </span>
                    <span className="text-[9px] text-gray-400 font-mono hidden group-hover:block">{service.id.toUpperCase()}</span>
                  </div>
                </div>
              </div>
              <button className="text-gray-400 hover:text-gray-600 p-1">
                <MoreVertical size={18} />
              </button>
            </div>

            <p className="text-xs text-gray-500 mb-6 line-clamp-2 h-8 leading-relaxed">
              {service.description}
            </p>

            {/* Live Metrics */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="bg-gray-50 p-2.5 rounded-lg border border-gray-100">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-1.5 text-[9px] text-gray-500 uppercase font-bold">
                    <Cpu size={11} className="text-blue-500" />
                    <span>CPU Usage</span>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-gray-900">{service.cpu.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-blue-500 h-full transition-all duration-1000" 
                    style={{ width: `${service.cpu}%` }}
                  ></div>
                </div>
              </div>
              <div className="bg-gray-50 p-2.5 rounded-lg border border-gray-100">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-1.5 text-[9px] text-gray-500 uppercase font-bold">
                    <Database size={11} className="text-purple-500" />
                    <span>Memory</span>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-gray-900">
                    {service.status === 'running' ? `${(service.ram / 1024).toFixed(1)}GB` : '0GB'}
                  </span>
                </div>
                <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-purple-500 h-full transition-all duration-1000" 
                    style={{ width: `${(service.ram / 8192) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 pt-4 border-t border-gray-100">
              {service.status === 'stopped' ? (
                <button 
                  onClick={() => onAction(service.id, 'start')}
                  className="flex-1 flex items-center justify-center gap-2 bg-yemenBlue text-white py-2 rounded-lg hover:bg-yemenBlue-dark transition-all text-xs font-bold active:scale-95"
                >
                  <Play size={14} fill="currentColor" />
                  تشغيل الخدمة
                </button>
              ) : (
                <>
                  <button 
                    onClick={() => onAction(service.id, 'stop')}
                    className="flex-1 flex items-center justify-center gap-2 bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-red-50 hover:text-red-600 transition-all text-xs font-bold active:scale-95 border border-transparent hover:border-red-100"
                  >
                    <Square size={14} fill="currentColor" />
                    إيقاف
                  </button>
                  <button 
                    onClick={() => onAction(service.id, 'restart')}
                    className="p-2 text-yemenBlue hover:bg-yemenBlue hover:text-white rounded-lg border border-blue-100 transition-all active:rotate-180 duration-500"
                    title="إعادة تشغيل"
                  >
                    <RotateCw size={16} />
                  </button>
                </>
              )}
            </div>
          </div>
          
          {/* Terminal / Logs Overlay */}
          {showLogs[service.id] && (
            <div className="bg-black text-[10px] font-mono p-4 h-32 border-t border-gray-800 animate-in slide-in-from-bottom-2">
                <div className="flex items-center justify-between text-gray-500 mb-2 border-b border-gray-800 pb-1">
                    <span className="flex items-center gap-1"><Info size={10} /> LIVE_LOGS</span>
                    <span className="text-[8px] opacity-50">{new Date().toLocaleTimeString()}</span>
                </div>
                <div className="text-green-400 opacity-80 space-y-0.5 custom-scrollbar overflow-y-auto h-20">
                    <p>[INFO] Initializing ${service.name} environment...</p>
                    <p>[INFO] Mounting volume /data/${service.id}</p>
                    <p>[INFO] Port forwarding ${Math.floor(Math.random() * 9000 + 1000)} -> 80</p>
                    <p className="text-blue-400"># Container ID: ${service.image.split('/')[0]}_${Math.random().toString(36).substr(2, 5)}</p>
                    <p className="animate-pulse">_</p>
                </div>
            </div>
          )}

          <div className="bg-gray-50 px-5 py-2.5 border-t border-gray-100 flex justify-between items-center">
            <span className="text-[9px] font-mono text-gray-400 uppercase tracking-tighter truncate max-w-[150px]">{service.image}</span>
            <button 
                onClick={() => toggleLogs(service.id)}
                className={`text-[10px] font-bold transition-colors flex items-center gap-1 ${showLogs[service.id] ? 'text-red-500' : 'text-yemenBlue hover:underline'}`}
            >
                {showLogs[service.id] ? 'إغلاق السجلات' : 'عرض السجلات'}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ServicesGrid;
