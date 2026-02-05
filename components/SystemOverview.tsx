
import React from 'react';
import { Cpu, Database, HardDrive, Activity, ShieldCheck, Zap } from 'lucide-react';
import { Service } from '../types';

interface SystemOverviewProps {
  services: Service[];
}

const SystemOverview: React.FC<SystemOverviewProps> = ({ services }) => {
  const activeCount = services.filter(s => s.status === 'running').length;
  const totalCpu = services.reduce((acc, s) => acc + s.cpu, 0);
  const totalRam = services.reduce((acc, s) => acc + s.ram, 0);

  const stats = [
    { label: 'الخدمات النشطة', value: `${activeCount}/${services.length}`, icon: <Activity className="text-green-500" />, trend: 'مستقر' },
    { label: 'إجمالي استهلاك المعالج', value: `${totalCpu.toFixed(1)}%`, icon: <Cpu className="text-blue-500" />, trend: 'طبيعي' },
    { label: 'استهلاك الذاكرة', value: `${(totalRam / 1024).toFixed(2)} GB`, icon: <Database className="text-purple-500" />, trend: 'مثالي' },
    { label: 'سعة التخزين', value: '420 GB / 2 TB', icon: <HardDrive className="text-orange-500" />, trend: '21% مستخدم' },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, i) => (
        <div key={i} className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-2">
            <div className="bg-gray-50 p-2 rounded-lg">
              {stat.icon}
            </div>
            <span className="text-[10px] font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded uppercase">
              {stat.trend}
            </span>
          </div>
          <div>
            <h4 className="text-xs font-bold text-gray-400 uppercase mb-1">{stat.label}</h4>
            <div className="text-2xl font-black text-gray-900 tracking-tight">{stat.value}</div>
          </div>
        </div>
      ))}
      
      {/* Sovereignty Status Banner */}
      <div className="lg:col-span-4 bg-gradient-to-r from-yemenBlue to-yemenBlue-dark p-6 rounded-xl text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-lg border-b-4 border-yemenGold">
        <div className="flex items-center gap-5">
            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md">
                <ShieldCheck size={32} className="text-yemenGold" />
            </div>
            <div>
                <h3 className="text-xl font-bold mb-1">بيئة السيادة الرقمية اليمنية YemenJPT</h3>
                <p className="text-blue-100 text-sm max-w-2xl">
                    النظام يعمل بشكل كامل في بيئة معزولة (Self-Hosted). جميع ميكروسيرفس الذكاء الاصطناعي OSINT تعمل محلياً دون تسريب بيانات للخارج.
                </p>
            </div>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
            <button className="flex-1 md:flex-none bg-white/10 hover:bg-white/20 text-white px-5 py-2.5 rounded-lg text-sm font-bold transition-all border border-white/20">
                فحص الأمن
            </button>
            <button className="flex-1 md:flex-none bg-yemenGold hover:bg-yemenGold-light text-yemenBlue-dark px-5 py-2.5 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2">
                <Zap size={16} fill="currentColor" />
                تحسين الأداء
            </button>
        </div>
      </div>
    </div>
  );
};

export default SystemOverview;
