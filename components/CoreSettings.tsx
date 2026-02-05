
import React, { useState } from 'react';
import { Settings, Shield, Key, Thermometer, Cpu, Database, Save, Zap, AlertTriangle, Eye, EyeOff, BarChart3, Fingerprint, Lock, ShieldCheck, Activity, Globe, Wifi } from 'lucide-react';

const CoreSettings: React.FC = () => {
  const [showKeys, setShowKeys] = useState(false);
  const [apiKeys, setApiKeys] = useState({
    gemini: 'AIzaSyCXXXXXXXXXXXXXXXXXXXXXX',
    sentinel: 'SENT_HUB_XXXXXXXXXXXXXXXXXXXX',
    maps: 'MAPS_PLATFORM_XXXXXXXXXXXXXXX'
  });

  const metrics = [
    { label: 'حرارة المعالج (CPU Core Temp)', value: 58, unit: '°C', color: 'from-blue-500 to-red-500', icon: <Thermometer size={14} />, status: 'Optimized' },
    { label: 'استهلاك الذاكرة الكلي (Total RAM)', value: 64, unit: '%', color: 'from-yemenBlue to-purple-500', icon: <Database size={14} />, status: 'Steady' },
    { label: 'حمولة السيرفر (Global Load)', value: 42, unit: '%', color: 'from-green-500 to-yemenGold', icon: <Activity size={14} />, status: 'Managed' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-700 pb-20">
      {/* High-Impact Tactical Gauges */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {metrics.map(metric => (
          <div key={metric.label} className="glass-panel p-8 rounded-2xl shadow-tactical group relative overflow-hidden flex flex-col items-center">
            {/* Background Grid Pattern */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
            
            <div className="relative w-32 h-32 mb-6">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="64"
                  cy="64"
                  r="58"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  className="text-slate-800/50"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="58"
                  stroke="url(#gradient)"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray={364}
                  strokeDashoffset={364 - (364 * metric.value) / 100}
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-out"
                />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#003087" />
                    <stop offset="100%" stopColor="#D4AF37" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-black text-white font-mono leading-none">{metric.value}</span>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{metric.unit}</span>
              </div>
            </div>

            <div className="text-center relative z-10">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">{metric.label}</h4>
              <div className="flex items-center gap-2 justify-center">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                <span className="text-[9px] font-black text-green-500 uppercase tracking-widest">{metric.status}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Central API Control Vault */}
        <div className="glass-panel rounded-2xl shadow-tactical flex flex-col overflow-hidden border-yemenGold/20">
          <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-yemenGold/10 rounded-xl text-yemenGold border border-yemenGold/20">
                <Key size={24} />
              </div>
              <div>
                <h3 className="font-black text-white text-lg uppercase tracking-widest font-tajawal leading-none">مفاتيح النواة المركزية</h3>
                <p className="text-[9px] text-slate-500 font-bold uppercase tracking-tighter mt-1">Sovereign API Management Hub</p>
              </div>
            </div>
            <button 
              onClick={() => setShowKeys(!showKeys)}
              className="p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-500 hover:text-white transition-all shadow-inner"
            >
              {showKeys ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          <div className="p-8 space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between px-1">
                  <div className="flex items-center gap-2">
                    <Zap size={14} className="text-yemenGold" />
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Google Gemini API Key</label>
                  </div>
                  <span className="text-[8px] font-bold text-slate-600 uppercase">Encrypted</span>
                </div>
                <input 
                  type={showKeys ? "text" : "password"}
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-4 text-xs font-mono text-blue-400 outline-none focus:border-yemenGold transition-all shadow-inner"
                  value={apiKeys.gemini}
                  onChange={e => setApiKeys({...apiKeys, gemini: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between px-1">
                  <div className="flex items-center gap-2">
                    <Globe size={14} className="text-blue-400" />
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sentinel Hub API (GeoInt)</label>
                  </div>
                  <span className="text-[8px] font-bold text-slate-600 uppercase">Encrypted</span>
                </div>
                <input 
                  type={showKeys ? "text" : "password"}
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-4 text-xs font-mono text-blue-400 outline-none focus:border-yemenGold transition-all shadow-inner"
                  value={apiKeys.sentinel}
                  onChange={e => setApiKeys({...apiKeys, sentinel: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between px-1">
                  <div className="flex items-center gap-2">
                    <Wifi size={14} className="text-green-400" />
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Global Proxy Gateway Key</label>
                  </div>
                  <span className="text-[8px] font-bold text-slate-600 uppercase">Secure</span>
                </div>
                <input 
                  type={showKeys ? "text" : "password"}
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-4 text-xs font-mono text-blue-400 outline-none focus:border-yemenGold transition-all shadow-inner"
                  value={apiKeys.maps}
                  onChange={e => setApiKeys({...apiKeys, maps: e.target.value})}
                />
              </div>
            </div>
            <button className="w-full bg-yemenBlue hover:bg-yemenBlue-light text-white py-5 rounded-xl font-black text-xs uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-3 border border-white/5 shadow-glow-blue group active:scale-95">
              <Save size={18} className="group-hover:scale-110 transition-transform" />
              تحديث وحماية بيانات النواة
            </button>
          </div>
        </div>

        {/* System Integrity & Safety Status */}
        <div className="glass-panel rounded-2xl shadow-tactical flex flex-col overflow-hidden border-yemenBlue/20">
          <div className="p-6 border-b border-slate-800 flex items-center gap-4 bg-slate-900/50">
            <div className="p-3 bg-green-500/10 rounded-xl text-green-500 border border-green-500/20">
              <ShieldCheck size={24} />
            </div>
            <div>
              <h3 className="font-black text-white text-lg uppercase tracking-widest font-tajawal leading-none">نزاهة وبروتوكولات الأمان</h3>
              <p className="text-[9px] text-slate-500 font-bold uppercase tracking-tighter mt-1">Deep Security Compliance Logs</p>
            </div>
          </div>
          <div className="p-8 space-y-6 flex-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-slate-950/50 p-5 rounded-2xl border border-slate-800 hover:border-yemenBlue/30 transition-colors group">
                <Lock className="text-yemenBlue mb-3 group-hover:scale-110 transition-transform" size={20} />
                <h4 className="text-[11px] font-black text-white uppercase mb-1">Root Encryption</h4>
                <p className="text-[9px] text-slate-500 font-medium leading-relaxed">تشفير قاعدة البيانات الرئيسية عبر AES-256 مع عزل المستأجرين بنظام RLS.</p>
              </div>
              <div className="bg-slate-950/50 p-5 rounded-2xl border border-slate-800 hover:border-yemenGold/30 transition-colors group">
                <Fingerprint className="text-yemenGold mb-3 group-hover:scale-110 transition-transform" size={20} />
                <h4 className="text-[11px] font-black text-white uppercase mb-1">Audit Protocol</h4>
                <p className="text-[9px] text-slate-500 font-medium leading-relaxed">تتبع كل عملية تجهيز أو تعديل في السجل الاستخباراتي غير القابل للحذف.</p>
              </div>
            </div>

            <div className="bg-slate-950/30 border border-slate-800 p-6 rounded-2xl">
               <div className="flex items-center justify-between mb-4">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">تحليل المخاطر (Cyber Risk)</span>
                    <span className="text-[8px] text-slate-600 uppercase font-bold">Scanning Real-time...</span>
                  </div>
                  <span className="text-[10px] font-black text-green-500 uppercase flex items-center gap-1.5 bg-green-500/10 px-3 py-1 rounded-full border border-green-500/20">
                    <Shield size={10} />
                    Low Risk
                  </span>
               </div>
               <div className="flex gap-2 h-2.5">
                  <div className="flex-1 bg-green-500 rounded-full shadow-glow-gold"></div>
                  <div className="flex-1 bg-green-500 rounded-full"></div>
                  <div className="flex-1 bg-slate-800 rounded-full"></div>
                  <div className="flex-1 bg-slate-800 rounded-full"></div>
                  <div className="flex-1 bg-slate-800 rounded-full"></div>
               </div>
            </div>

            <div className="mt-auto">
              <div className="p-5 bg-red-500/5 border border-red-500/20 rounded-2xl flex items-center gap-5 group cursor-pointer hover:bg-red-500/10 transition-all">
                <div className="p-4 bg-red-500/20 rounded-2xl text-red-500 group-hover:animate-pulse shadow-lg">
                  <AlertTriangle size={32} />
                </div>
                <div className="flex-1">
                  <h4 className="text-[11px] font-black text-red-500 uppercase tracking-widest mb-1">تدمير النواة (Purge All)</h4>
                  <p className="text-[9px] text-slate-500 font-bold leading-relaxed">سيؤدي هذا الإجراء إلى حذف كافة المستأجرين وإعادة ضبط مفاتيح API للمصنع.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoreSettings;
