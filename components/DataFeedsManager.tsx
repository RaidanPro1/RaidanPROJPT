import React, { useState, useEffect } from 'react';
import { 
  DatabaseZap, Rss, Plus, Edit, Save, X, Eye, EyeOff, 
  Loader2, CheckCircle2, AlertTriangle, Key, Clock, Terminal, Power
} from 'lucide-react';
import { DataSource } from '../types';

const API_BASE_URL = 'http://127.0.0.1:8001'; // Yemen Core API is on port 8001

// Tactical Toggle Switch Component
const ToggleSwitch: React.FC<{ active: boolean, onToggle: () => void }> = ({ active, onToggle }) => (
  <button 
    onClick={onToggle}
    className={`w-14 h-7 rounded-full p-1 transition-all duration-300 relative ${active ? 'bg-yemenGold shadow-[0_0_15px_rgba(212,175,55,0.4)]' : 'bg-slate-800'}`}
  >
    <div className={`w-5 h-5 rounded-full bg-white shadow-lg transition-all duration-300 transform ${active ? 'translate-x-7' : 'translate-x-0'}`}></div>
  </button>
);

const DataFeedsManager: React.FC = () => {
  const [sources, setSources] = useState<DataSource[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSources = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/core/sources`);
      if (!response.ok) throw new Error('Failed to connect to Yemen Core API.');
      const data: DataSource[] = await response.json();
      setSources(data);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSources();
  }, []);

  const handleToggleActive = async (source: DataSource) => {
    // Optimistic update
    setSources(sources.map(s => s.id === source.id ? { ...s, is_active: !s.is_active } : s));
    try {
      await fetch(`${API_BASE_URL}/api/v1/core/sources/${source.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          is_active: !source.is_active,
          fetch_frequency: source.fetch_frequency,
          auth_type: source.auth_type,
        }),
      });
    } catch (e) {
      // Revert on error
      setSources(sources.map(s => s.id === source.id ? { ...s, is_active: source.is_active } : s));
      alert("Failed to update source status.");
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-full"><Loader2 className="w-12 h-12 animate-spin text-yemenGold" /></div>;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center p-8 bg-slate-900/50 border border-red-500/30 rounded-2xl">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-white">خطأ في الاتصال بنواة البيانات</h3>
          <p className="text-slate-400 mt-2">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col gap-6 p-4">
      {/* Header */}
      <div className="glass-panel p-6 rounded-2xl flex items-center justify-between gap-6 border-r-4 border-yemenGold shadow-tactical">
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 bg-yemenGold/10 rounded-xl flex items-center justify-center text-yemenGold border border-yemenGold/20 shadow-glow-gold">
            <DatabaseZap size={28} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-white leading-none uppercase">لوحة تحكم مصادر البيانات</h2>
            <p className="text-[10px] text-yemenGold font-bold uppercase tracking-[0.3em] mt-2">Yemen Core Ingestion Control</p>
          </div>
        </div>
        <button className="bg-yemenGold hover:shadow-glow-gold text-yemenBlue-dark px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest flex items-center gap-3 transition-all active:scale-95">
          <Plus size={16} /> إضافة مصدر جديد
        </button>
      </div>
      
      {/* Cards Grid */}
      <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 -mr-2">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {sources.map(source => (
            <div key={source.id} className={`glass-panel p-6 rounded-2xl border transition-all flex flex-col justify-between group relative overflow-hidden ${source.is_active ? 'border-yemenBlue/40 bg-yemenBlue/5 shadow-glow-blue' : 'border-slate-800 bg-slate-950/30 opacity-60 grayscale'}`}>
              <div className="flex justify-between items-start mb-4 z-10">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl transition-colors ${source.is_active ? 'bg-yemenBlue text-white' : 'bg-slate-900 text-slate-700'}`}>
                    <Rss size={20} />
                  </div>
                  <h3 className="text-sm font-black text-white uppercase tracking-wider">{source.name}</h3>
                </div>
                <ToggleSwitch active={source.is_active} onToggle={() => handleToggleActive(source)} />
              </div>
              
              <div className="space-y-4 z-10">
                <div className="space-y-2">
                  <label className="text-[9px] font-bold text-slate-500 uppercase px-1">API Key / Credentials</label>
                  <div className="flex items-center gap-2">
                     <input type="password" value="**************" readOnly className="flex-1 bg-slate-950/80 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-blue-400 outline-none" />
                     <button className="p-2 bg-slate-900 rounded-lg text-slate-500 hover:text-white border border-slate-800"><Edit size={14} /></button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[9px] font-bold text-slate-500 uppercase px-1">Fetch Frequency</label>
                  <select defaultValue={source.fetch_frequency} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-300 outline-none focus:border-yemenGold transition-all appearance-none cursor-pointer">
                    <option value="hourly">Hourly</option>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-slate-800/50 z-10">
                 <div className="flex items-center gap-3 text-[10px] text-slate-500">
                    {source.last_status === 'success' ? <CheckCircle2 size={12} className="text-green-500" /> : <AlertTriangle size={12} className="text-red-500" />}
                    <span className="font-bold uppercase">Last Status:</span>
                    <span className="font-mono truncate">{source.last_status}</span>
                 </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DataFeedsManager;