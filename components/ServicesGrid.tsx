
import React from 'react';
import { Play, Square, RotateCw, MoreVertical, Terminal, Cpu, Database } from 'lucide-react';
import { Service } from '../types';

interface ServicesGridProps {
  services: Service[];
  onAction: (id: string, action: 'start' | 'stop' | 'restart') => void;
}

const ServicesGrid: React.FC<ServicesGridProps> = ({ services, onAction }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {services.map(service => (
        <div 
          key={service.id} 
          className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden group"
        >
          <div className="p-5">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  service.status === 'running' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                }`}>
                  <Terminal size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">{service.name}</h3>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full uppercase font-bold border ${
                    service.status === 'running' 
                      ? 'bg-green-50 text-green-600 border-green-200' 
                      : 'bg-red-50 text-red-600 border-red-200'
                  }`}>
                    {service.status === 'running' ? 'نشط' : 'متوقف'}
                  </span>
                </div>
              </div>
              <button className="text-gray-400 hover:text-gray-600 p-1">
                <MoreVertical size={18} />
              </button>
            </div>

            <p className="text-sm text-gray-500 mb-6 line-clamp-2">
              {service.description}
            </p>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-50 p-2 rounded-lg border border-gray-100">
                <div className="flex items-center gap-2 text-[10px] text-gray-500 uppercase font-bold mb-1">
                  <Cpu size={12} />
                  <span>CPU</span>
                </div>
                <div className="text-lg font-mono font-bold text-yemenBlue">
                  {service.cpu.toFixed(1)}%
                </div>
                <div className="w-full bg-gray-200 h-1 rounded-full mt-1 overflow-hidden">
                  <div 
                    className="bg-yemenBlue h-full transition-all duration-500" 
                    style={{ width: `${service.cpu}%` }}
                  ></div>
                </div>
              </div>
              <div className="bg-gray-50 p-2 rounded-lg border border-gray-100">
                <div className="flex items-center gap-2 text-[10px] text-gray-500 uppercase font-bold mb-1">
                  <Database size={12} />
                  <span>RAM</span>
                </div>
                <div className="text-lg font-mono font-bold text-yemenBlue">
                  {service.status === 'running' ? `${(service.ram / 1024).toFixed(1)} GB` : '0 MB'}
                </div>
                <div className="w-full bg-gray-200 h-1 rounded-full mt-1 overflow-hidden">
                  <div 
                    className="bg-yemenGold h-full transition-all duration-500" 
                    style={{ width: `${(service.ram / 8192) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-4 border-t border-gray-100">
              {service.status === 'stopped' ? (
                <button 
                  onClick={() => onAction(service.id, 'start')}
                  className="flex-1 flex items-center justify-center gap-2 bg-yemenBlue text-white py-2 rounded-lg hover:bg-yemenBlue-dark transition-colors text-sm font-bold"
                >
                  <Play size={16} fill="currentColor" />
                  تشغيل
                </button>
              ) : (
                <>
                  <button 
                    onClick={() => onAction(service.id, 'stop')}
                    className="flex-1 flex items-center justify-center gap-2 bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 transition-colors text-sm font-bold"
                  >
                    <Square size={16} fill="currentColor" />
                    إيقاف
                  </button>
                  <button 
                    onClick={() => onAction(service.id, 'restart')}
                    className="p-2 text-yemenBlue hover:bg-blue-50 rounded-lg border border-blue-100 transition-colors"
                    title="إعادة تشغيل"
                  >
                    <RotateCw size={18} />
                  </button>
                </>
              )}
            </div>
          </div>
          
          <div className="bg-gray-50 px-5 py-3 border-t border-gray-100 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="text-[10px] font-mono text-gray-400 uppercase">{service.image}</span>
            <button className="text-[10px] font-bold text-yemenBlue hover:underline">عرض السجلات</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ServicesGrid;
