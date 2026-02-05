
import React, { useState } from 'react';
import { Cloud, Server, Shield, Lock, UploadCloud, RefreshCw, AlertTriangle, Play, CheckCircle2 } from 'lucide-react';

const RecoveryPanel: React.FC = () => {
  const [teleportData, setTeleportData] = useState({ ip: '', user: 'root', pass: '' });
  const [isTeleporting, setIsTeleporting] = useState(false);
  const [isBackingUp, setIsBackingUp] = useState(false);

  const handleTeleport = async () => {
    setIsTeleporting(true);
    // Simulate API call
    try {
        await fetch('http://localhost:8000/api/v1/lifeline/teleport', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ target_ip: teleportData.ip, ssh_user: teleportData.user, ssh_pass: teleportData.pass })
        });
        alert("Teleport Sequence Initiated. Monitor server logs.");
    } catch (e) {
        alert("Connection failed.");
    }
    setTimeout(() => setIsTeleporting(false), 5000);
  };

  const handleBackup = async () => {
    setIsBackingUp(true);
    try {
        await fetch('http://localhost:8000/api/v1/lifeline/backup/now', { method: 'POST' });
        alert("Backup started in background.");
    } catch (e) {
        alert("Backup trigger failed.");
    }
    setTimeout(() => setIsBackingUp(false), 3000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between border-l-4 border-l-red-500">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-red-100 text-red-600 rounded-xl">
            <Shield size={28} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-900 leading-none">وحدة شريان الحياة (Lifeline)</h2>
            <p className="text-xs text-red-500 font-bold uppercase tracking-widest mt-1">Disaster Recovery & Continuity</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Teleport Card */}
        <div className="bg-slate-950 text-white p-8 rounded-2xl shadow-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
          
          <div className="flex items-center gap-3 mb-6 relative z-10">
            <Server className="text-blue-400" />
            <h3 className="text-lg font-black uppercase tracking-widest">الانتقال الآني (Server Teleport)</h3>
          </div>
          
          <div className="space-y-4 relative z-10">
            <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800 text-[10px] text-slate-400 leading-relaxed">
              <AlertTriangle size={14} className="inline mr-2 text-amber-500" />
              تحذير: ستقوم هذه العملية بنقل كامل النظام (قواعد البيانات، الملفات، التكوين) إلى خادم جديد عبر SSH. سيتوقف النظام الحالي مؤقتاً.
            </div>
            
            <div className="space-y-3">
                <input 
                    placeholder="Target IP Address (e.g., 192.168.1.50)" 
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-4 py-3 text-xs font-mono focus:border-blue-500 outline-none transition-all"
                    value={teleportData.ip}
                    onChange={e => setTeleportData({...teleportData, ip: e.target.value})}
                />
                <input 
                    type="password"
                    placeholder="Root Password / SSH Key" 
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-4 py-3 text-xs font-mono focus:border-blue-500 outline-none transition-all"
                    value={teleportData.pass}
                    onChange={e => setTeleportData({...teleportData, pass: e.target.value})}
                />
            </div>

            <button 
                onClick={handleTeleport}
                disabled={isTeleporting}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-4 rounded-xl uppercase tracking-widest text-xs flex items-center justify-center gap-3 transition-all active:scale-95 disabled:opacity-50"
            >
                {isTeleporting ? <RefreshCw size={16} className="animate-spin" /> : <Play size={16} />}
                {isTeleporting ? 'Teleporting...' : 'Start Migration Sequence'}
            </button>
          </div>
        </div>

        {/* Cloud Vault Card */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 relative overflow-hidden">
          <div className="flex items-center gap-3 mb-6 relative z-10">
            <Cloud className="text-yemenGold" />
            <h3 className="text-lg font-black text-slate-900 uppercase tracking-widest">خزنة جوجل المشفرة (G-Vault)</h3>
          </div>

          <div className="space-y-6 relative z-10">
             <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                <div className="flex items-center gap-3">
                    <Lock size={18} className="text-green-500" />
                    <div>
                        <div className="text-xs font-black text-slate-800">التشفير السيادي (AES-256)</div>
                        <div className="text-[10px] text-slate-500">المفاتيح محفوظة محلياً فقط.</div>
                    </div>
                </div>
                <div className="text-[10px] font-mono bg-white px-2 py-1 rounded border border-slate-200 text-slate-600">Strict Mode</div>
             </div>

             <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold text-slate-600">
                    <span>Last Backup</span>
                    <span>2 hours ago</span>
                </div>
                <div className="flex justify-between text-xs font-bold text-slate-600">
                    <span>Rotation Policy</span>
                    <span>7 Daily / 4 Weekly</span>
                </div>
             </div>

             <button 
                onClick={handleBackup}
                disabled={isBackingUp}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-black py-4 rounded-xl uppercase tracking-widest text-xs flex items-center justify-center gap-3 transition-all active:scale-95"
            >
                {isBackingUp ? <RefreshCw size={16} className="animate-spin" /> : <UploadCloud size={16} />}
                {isBackingUp ? 'Encrypting & Uploading...' : 'Backup Now'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecoveryPanel;
