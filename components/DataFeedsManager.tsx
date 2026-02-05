
import React, { useState, useEffect } from 'react';
import { 
  DatabaseZap, Rss, Plus, Edit, Save, X, Eye, EyeOff, 
  Loader2, CheckCircle2, AlertTriangle, Key, Clock
} from 'lucide-react';
import { DataSource } from '../types';

const API_BASE_URL = 'http://127.0.0.1:8001'; // Yemen Core API is on port 8001

const DataFeedsManager: React.FC = () => {
  const [sources, setSources] = useState<DataSource[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSources = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // In a real app, this would be a proxy or CORS-enabled request
      const response = await fetch(`${API_BASE_URL}/api/v1/core/sources`);
      if (!response.ok) throw new Error('Failed to connect to Yemen Core API.');
      const data: DataSource[] = await response.json();
      setSources(data);
    } catch (e: any) {
      setError(e.message);
      // Fallback mock data for demonstration if API fails
      setSources([
        { id: 1, name: 'Central Bank of Yemen', is_active: true, fetch_frequency: 'daily', auth_type: 'no_auth', last_status: 'success', last_run_log: 'OK', last_crawled_at: '2024-05-20' },
        { id: 2, name: 'World Bank API', is_active: true, fetch_frequency: 'monthly', auth_type: 'no_auth', last_status: 'success', last_run_log: 'OK', last_crawled_at: '2024-05-01' },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSources();
  }, []);

  if (isLoading) {
    return <div className="flex items-center justify-center h-full"><Loader2 className="w-12 h-12 animate-spin text-yemenGold" /></div>;
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
                <div className={`w-3 h-3 rounded-full ${source.is_active ? 'bg-green-500 animate-pulse shadow-glow-gold' : 'bg-red-500'}`}></div>
              </div>
              
              <div className="space-y-4 z-10">
                <div className="flex items-center justify-between text-[10px] text-slate-400 font-bold uppercase tracking-wider bg-slate-950/50 p-2 rounded-lg border border-slate-800">
                   <span className="flex items-center gap-2"><Clock size={12}/> Frequency</span>
                   <span className="text-white">{source.fetch_frequency}</span>
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-400 font-bold uppercase tracking-wider bg-slate-950/50 p-2 rounded-lg border border-slate-800">
                   <span className="flex items-center gap-2"><Key size={12}/> Auth Type</span>
                   <span className="text-white">{source.auth_type}</span>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-slate-800/50 z-10">
                 <div className="flex items-center justify-between">
                    <span className="text-[9px] text-slate-500 font-mono">{source.last_crawled_at || 'Never'}</span>
                    <button className="text-[9px] font-black text-yemenGold hover:underline uppercase tracking-widest">تعديل الإعدادات</button>
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
