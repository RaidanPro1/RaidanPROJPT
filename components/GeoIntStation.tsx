
import React, { useState, useEffect } from 'react';
import { 
  Map as MapIcon, Globe, Satellite, Layers, Target, 
  Navigation, Crosshair, Download, Maximize2, 
  ShieldCheck, ShieldAlert, Cpu, Activity, Zap, 
  Eye, Filter, MousePointer2, Thermometer, Waves,
  Box, Anchor, AlertTriangle, RefreshCcw, Search,
  Compass, Info, CheckCircle2, ArrowUpRight, Loader2
} from 'lucide-react';
import TacticalMap from './TacticalMap';

const GeoIntStation: React.FC = () => {
  const [activeLayer, setActiveLayer] = useState('satellite');
  const [isProcessing, setIsProcessing] = useState(false);
  const [proxyStatus, setProxyStatus] = useState<'secure' | 'connecting' | 'warning'>('secure');
  const [coordinates, setCoordinates] = useState({ lat: 15.3694, lng: 44.1910 }); // Sana'a coordinates
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let interval: any;
    if (isProcessing) {
      interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            setIsProcessing(false);
            return 100;
          }
          return prev + 1.5;
        });
      }, 50);
    }
    return () => clearInterval(interval);
  }, [isProcessing]);

  const layers = [
    { id: 'osm_local', name: 'خريطة المتجه المحلية', icon: <MapIcon size={16} />, provider: 'TileServer-GL' },
    { id: 'satellite', name: 'صور Sentinel-2 الحية', icon: <Satellite size={16} />, provider: 'Anonymous Proxy' },
    { id: 'ndvi', name: 'مؤشر الغطاء النباتي (NDVI)', icon: <Waves size={16} />, provider: 'TorchGeo Engine' },
    { id: 'firms', name: 'رصد الحرائق (NASA FIRMS)', icon: <Thermometer size={16} />, provider: 'Real-time Feed' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-700 pb-20">
      {/* Sovereign Header */}
      <div className="bg-white p-6 rounded-2xl flex flex-col xl:flex-row items-center justify-between gap-6 border border-slate-200 border-r-4 border-r-yemenGold shadow-tactical relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-yemenGold/5 rounded-full -mr-32 -mt-32 blur-md"></div>
        
        <div className="flex items-center gap-6 relative z-10">
          <div className="w-16 h-16 bg-slate-100 border border-slate-200 rounded-2xl flex items-center justify-center text-yemenGold shadow-sm relative overflow-hidden">
            <Globe size={32} className={isProcessing ? 'animate-spin-slow' : ''} />
            {isProcessing && <div className="absolute inset-0 border-2 border-yemenGold rounded-2xl animate-ping opacity-50"></div>}
          </div>
          <div>
            <h2 className="text-3xl font-black text-slate-900 font-tajawal leading-none uppercase">محطة الاستقصاء الجغرافي (GeoInt)</h2>
            <div className="flex items-center gap-3 mt-2">
               <span className="text-[10px] text-yemenGold font-bold uppercase tracking-[0.3em]">Falcon's Eye: Sovereign Mapping</span>
               <div className="h-3 w-px bg-slate-200"></div>
               <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full shadow-sm"></div>
                  <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest px-1">Local TileServer: Running</span>
               </div>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 items-center relative z-10">
          <div className="bg-slate-50 p-3 px-6 rounded-xl border border-slate-200 flex items-center gap-8 shadow-inner">
             <div className="flex flex-col border-l border-slate-200 pl-6">
                <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Proxy Tunnel</span>
                <div className="flex items-center gap-2">
                   <ShieldCheck size={14} className={proxyStatus === 'secure' ? 'text-green-500' : 'text-amber-500'} />
                   <span className="text-[10px] font-black text-slate-900 uppercase">{proxyStatus === 'secure' ? 'Encrypted' : 'Connecting'}</span>
                </div>
             </div>
             <div className="flex flex-col">
                <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Satellite Refresh</span>
                <div className="flex items-center gap-2">
                   <RefreshCcw size={14} className="text-slate-500"/>
                   <span className="text-[10px] font-black text-slate-900 uppercase">T-12:40:01</span>
                </div>
             </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* GIS Control Sidebar */}
        <div className="xl:col-span-3 space-y-6">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-6">
             <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                <Layers size={18} className="text-yemenBlue" />
                <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest font-tajawal">إدارة الطبقات (Layers)</h3>
             </div>

             <div className="space-y-2">
                {layers.map(layer => (
                  <button
                    key={layer.id}
                    onClick={() => setActiveLayer(layer.id)}
                    className={`w-full p-4 rounded-xl border text-right transition-all flex items-center justify-between group ${
                      activeLayer === layer.id 
                      ? 'bg-yemenBlue text-white shadow-md border-transparent' 
                      : 'bg-white border-slate-100 text-slate-500 hover:border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                     <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${activeLayer === layer.id ? 'bg-white/20' : 'bg-slate-100 text-slate-600'}`}>
                           {layer.icon}
                        </div>
                        <div>
                           <div className="text-xs font-black uppercase leading-none mb-1">{layer.name}</div>
                           <div className="text-[8px] opacity-70 font-bold uppercase tracking-widest">{layer.provider}</div>
                        </div>
                     </div>
                     {activeLayer === layer.id && <div className="w-1.5 h-1.5 bg-yemenGold rounded-full shadow-md animate-pulse"></div>}
                  </button>
                ))}
             </div>

             <button 
               onClick={() => setIsProcessing(true)}
               disabled={isProcessing}
               className="w-full py-4 bg-yemenBlue hover:bg-yemenBlue-hover text-white rounded-xl font-black text-[10px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 shadow-md disabled:opacity-50"
             >
                <Zap size={16} className="text-yemenGold" />
                تحليل التغيرات الزمنية
             </button>
          </div>
        </div>

        {/* Map Display */}
        <div className="xl:col-span-9">
          <div className="rounded-2xl shadow-sm h-[700px] flex flex-col border border-slate-200 relative bg-slate-100">
            <div className="flex-1 relative">
               <TacticalMap center={[coordinates.lat, coordinates.lng]} zoom={12} />
               
               {isProcessing && (
                 <div className="absolute inset-0 z-[1000] bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center pointer-events-none">
                    <div className="w-full h-1 bg-yemenGold shadow-md absolute top-0 animate-[scanner_2.5s_ease-in-out_infinite]"></div>
                    <div className="text-center space-y-4">
                       <Loader2 size={48} className="text-yemenGold animate-spin mx-auto" />
                       <div className="w-64 h-1 bg-slate-200 rounded-full overflow-hidden border border-slate-300">
                          <div className="bg-yemenGold h-full shadow-sm transition-all duration-300" style={{ width: `${progress}%` }}></div>
                       </div>
                       <span className="text-[9px] font-mono text-slate-800 block uppercase tracking-[0.3em] animate-pulse">Running TorchGeo NDVI Pipeline... {progress.toFixed(1)}%</span>
                    </div>
                 </div>
               )}
            </div>
          </div>
        </div>
      </div>
      
      <style>{`
        @keyframes scanner {
          0% { top: -2%; }
          50% { top: 102%; }
          100% { top: -2%; }
        }
        .animate-spin-slow { animation: spin 4s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default GeoIntStation;
