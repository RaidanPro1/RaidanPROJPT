
import React from 'react';
import { CloudLightning, ShieldCheck, Server, Terminal, CheckCircle2, AlertTriangle, Loader2, Activity, Globe } from 'lucide-react';

const ProvisioningMonitor: React.FC = () => {
  return (
    <div className="glass-panel rounded-2xl p-6 shadow-tactical animate-in fade-in duration-700 relative overflow-hidden h-full flex flex-col">
      <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
        <Activity size={120} />
      </div>
      
      <div className="flex items-center justify-between mb-8 border-b border-slate-800/50 pb-4">
        <div className="flex items-center gap-4">
          <div className="p-2.5 bg-yemenGold/10 rounded-xl text-yemenGold border border-yemenGold/20 shadow-glow-gold">
            <CloudLightning size={20} />
          </div>
          <div>
            <h3 className="font-black text-white text-lg font-tajawal leading-none">محرك التجهيز الاستراتيجي</h3>
            <p className="text-[9px] text-slate-500 font-bold uppercase tracking-[0.2em] mt-1">Sovereign Provisioning Engine v1.7.2</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
           <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
           <span className="text-[10px] font-black text-green-500 uppercase tracking-widest">Active Ops: 1</span>
        </div>
      </div>

      <div className="space-y-6 flex-1">
        {/* Step 1: Cloudflare */}
        <div className="relative pl-6 border-r border-green-500/30">
          <div className="absolute top-0 right-[-5px] w-2.5 h-2.5 rounded-full bg-green-500 border-2 border-slate-900 shadow-glow-gold"></div>
          <div className="flex justify-between items-start mb-2">
            <div>
              <h4 className="text-xs font-black text-white uppercase tracking-wider mb-1">Cloudflare SSL Handshake</h4>
              <p className="text-[10px] text-slate-500 leading-tight">تفعيل وضع SSL Strict وربط السجلات السيادية بنجاح.</p>
            </div>
            <span className="text-[8px] font-mono text-green-500 font-bold">100% SECURE</span>
          </div>
          <div className="text-[9px] font-mono text-green-400 bg-slate-950/80 p-3 rounded-lg border border-slate-800/50 shadow-inner">
             [SUCCESS] CF_ZONE_ID: 0x9212A... MODE: FULL_STRICT
          </div>
        </div>

        {/* Step 2: Deployment */}
        <div className="relative pl-6 border-r border-yemenBlue/30">
          <div className="absolute top-0 right-[-5px] w-2.5 h-2.5 rounded-full bg-yemenBlue border-2 border-slate-900 animate-pulse shadow-glow-blue"></div>
          <div className="flex justify-between items-start mb-2">
            <div>
              <h4 className="text-xs font-black text-white uppercase tracking-wider mb-1">Coolify Stack Injection</h4>
              <p className="text-[10px] text-slate-500 leading-tight">جاري بناء الحاويات المعزولة وحقن مكدس الاستخبارات.</p>
            </div>
            <div className="flex items-center gap-1">
              <Loader2 size={10} className="animate-spin text-yemenBlue" />
              <span className="text-[8px] font-mono text-yemenBlue font-bold">DEPLOYING...</span>
            </div>
          </div>
          <div className="text-[9px] font-mono text-blue-400 bg-slate-950/80 p-3 rounded-lg border border-slate-800/50 shadow-inner">
             [RUNNING] Spawning [ollama, deepsafe, pg16] for tenant_921...
          </div>
        </div>

        {/* Step 3: DNS */}
        <div className="relative pl-6 border-r border-slate-800 opacity-40">
          <div className="absolute top-0 right-[-5px] w-2.5 h-2.5 rounded-full bg-slate-700 border-2 border-slate-900"></div>
          <div className="flex justify-between items-start">
            <div>
              <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-1">Sovereign DNS Finalization</h4>
              <p className="text-[10px] text-slate-600 leading-tight">التحقق من انتشار السجلات عبر عقد Technitium المحلية.</p>
            </div>
            <span className="text-[8px] font-mono text-slate-600 font-bold italic">WAITING...</span>
          </div>
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-slate-800/50 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 text-[10px] text-amber-500 font-black uppercase tracking-widest bg-amber-500/5 px-4 py-2 rounded-xl border border-amber-500/10">
          <AlertTriangle size={14} className="animate-bounce" />
          <span>تنبيه: لا تغادر لوحة القيادة أثناء عملية الحقن</span>
        </div>
        <button className="text-[9px] font-black text-yemenGold hover:text-white transition-colors uppercase tracking-[0.2em] border-b border-yemenGold/30 pb-1">
          مشاهدة سجلات النواة الخام (Raw Engine Logs)
        </button>
      </div>
    </div>
  );
};

export default ProvisioningMonitor;
