
import React from 'react';
import { Cpu, Database, HardDrive, Activity } from 'lucide-react';
import { Service } from '../types';

interface SystemOverviewProps {
  services: Service[];
}

const SystemOverview: React.FC<SystemOverviewProps> = ({ services }) => {
  const activeCount = services.filter(s => s.status === 'running').length;
  const totalCpu = services.reduce((acc, s) => acc + s.cpu, 0);
  const totalRam = services.reduce((acc, s) => acc + s.ram, 0);

  const stats = [
    { label: 'الخدمات النشطة', value: `${activeCount}/${services.length}`, icon: <Activity className="text-green-600" />, trend: 'Healthy' },
    { label: 'استهلاك المعالج', value: `${totalCpu.toFixed(1)}%`, icon: <Cpu className="text-yemenBlue" />, trend: 'Steady' },
    { label: 'الذاكرة المشغولة', value: `${(totalRam / 1024).toFixed(2)} GB`, icon: <Database className="text-purple-600" />, trend: 'Optimal' },
    { label: 'السعة السيادية', value: '420 GB / 2 TB', icon: <HardDrive className="text-orange-600" />, trend: '21% Used' },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, i) => (
        <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between hover:border-yemenBlue/20 transition-all group">
          <div className="flex justify-between items-start mb-4">
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 group-hover:scale-110 transition-transform">
              {stat.icon}
            </div>
            <span className="text-[9px] font-black text-green-600 bg-green-50 px-3 py-1 rounded-full border border-green-100 uppercase tracking-widest">
              {stat.trend}
            </span>
          </div>
          <div>
            <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2">{stat.label}</h4>
            <div className="text-2xl font-black text-slate-900 font-mono tracking-tight">{stat.value}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SystemOverview;
