
import React from 'react';
import { CloudLightning, ShieldCheck, Server, Terminal, CheckCircle2, AlertTriangle, Loader2, Activity, Globe } from 'lucide-react';

const ProvisioningMonitor: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm animate-in fade-in duration-700 relative overflow-hidden h-full flex flex-col border border-slate-200">
      <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
        <Activity size={120} className="text-slate-300" />
      </div>
      
      <div className="flex items-center justify-between mb-8 border-b border-slate-100 pb-4">
        <div className="flex items-center gap-4">
          <div className="p-2.5 bg-yemenBlue/10 rounded-xl text-yemenBlue border border-yemenBlue/20">
            <CloudLightning size={20} />
          </div>
          <div>
            <h3 className="font-black text-slate-900 text-lg font-tajawal leading-none">محرك التجهيز الاستراتيجي</h3>
            <p className="text-[9px] text-yemenBlue font-bold uppercase tracking-[0.2em] mt-1">Sovereign Provisioning Engine</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
           <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
           <span className="text-[10px] font-black text-green-600 uppercase tracking-widest">Active Ops: 1</span>
        </div>
      </div>

      <div className="space-y-6 flex-1">
        {/* Step 1: Cloudflare */}
        <div className="relative pl-6 border-r border-green-500/30">
          <div className="absolute top-0 right-[-5px] w-2.5 h-2.5 rounded-full bg-green-500 border-2 border-white"></div>
          <div>
            <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider mb-1">Cloudflare SSL Handshake</h4>
            <p className="text-[10px] text-slate-500 leading-tight">تفعيل وضع SSL Strict وربط السجلات السيادية بنجاح.</p>
          </div>
        </div>

        {/* Step 2: Deployment */}
        <div className="relative pl-6 border-r border-yemenBlue/30">
          <div className="absolute top-0 right-[-5px] w-2.5 h-2.5 rounded-full bg-yemenBlue border-2 border-white animate-pulse"></div>
          <div>
            <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider mb-1">Coolify Stack Injection</h4>
            <p className="text-[10px] text-slate-500 leading-tight">جاري بناء الحاويات المعزولة وحقن مكدس الاستخبارات.</p>
          </div>
        </div>

        {/* Step 3: DNS */}
        <div className="relative pl-6 border-r border-slate-200 opacity-60">
          <div className="absolute top-0 right-[-5px] w-2.5 h-2.5 rounded-full bg-slate-400 border-2 border-white"></div>
          <div>
            <h4 className="text-xs font-black text-slate-500 uppercase tracking-wider mb-1">Sovereign DNS Finalization</h4>
            <p className="text-[10px] text-slate-400 leading-tight">التحقق من انتشار السجلات.</p>
          </div>
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-slate-100">
        <div className="flex items-center gap-3 text-[10px] text-amber-700 font-black uppercase tracking-widest bg-amber-50 px-4 py-2 rounded-xl border border-amber-200">
          <AlertTriangle size={14} className="animate-bounce" />
          <span>تنبيه: لا تغادر اللوحة أثناء عملية الحقن</span>
        </div>
      </div>
    </div>
  );
};

export default ProvisioningMonitor;
