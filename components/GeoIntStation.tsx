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
    <div className="space-y-6 animate-in fade-in duration-700 pb-20 font-tajawal">
      {/* Sovereign Header */}
      <div className="bg-panel p-6 rounded-2xl flex flex-col xl:flex-row items-center justify-between gap-6 border border-border-subtle border-r-4 border-r-brand-accent shadow-elevation relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-accent/5 rounded-full -mr-32 -mt-32 blur-md"></div>
        
        <div className="flex items-center gap-6 relative z-10">
          <div className="w-16 h-16 bg-canvas border border-border-subtle rounded-2xl flex items-center justify-center text-brand-accent shadow-sm relative overflow-hidden">
            <Globe size={32} className={isProcessing ? 'animate-spin-slow' : ''} />
            {isProcessing && <div className="absolute inset-0 border-2 border-brand-accent rounded-2xl animate-ping opacity-50"></div>}
          </div>
          <div>
            <h2 className="text-3xl font-black text-text-primary leading-none uppercase">محطة الاستقصاء الجغرافي (GeoInt)</h2>
            <div className="flex items-center gap-3 mt-3">
               <span className="text-[10px] text-brand-accent font-black uppercase tracking-[0.3em]">Falcon's Eye: Sovereign Mapping</span>
               <div className="h-3 w-px bg-border-subtle"></div>
               <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full shadow-[0_0_8px_rgba(34,197,94,0.4)]"></div>
                  <span className="text-[9px] font-black text-text-subtle uppercase tracking-widest px-1">Local TileServer: Running</span>
               </div>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 items-center relative z-10">
          <div className="bg-canvas p-3 px-6 rounded-xl border border-border-subtle flex items-center gap-8 shadow-inner">
             <div className="flex flex-col border-l border-border-subtle pl-6">
                <span className="text-[8px] font-black text-text-subtle uppercase tracking-widest mb-1">Geospatial Proxy</span>
                <div className="flex items-center gap-2">
                   <ShieldCheck size={14} className={proxyStatus === 'secure' ? 'text-green-500' : 'text-amber-500'} />
                   <span className="text-[10px] font-black text-text-primary uppercase">{proxyStatus === 'secure' ? 'Route Secured' : 'Bypassing...'}</span>
                </div>
             </div>
             <div className="flex flex-col">
                <span className="text-[8px] font-black text-text-subtle uppercase tracking-widest mb-1">TorchGeo Status</span>
                <div className="flex items-center gap-2">
                   <Activity size={14} className="text-brand-primary" />
                   <span className="text-[10px] font-black text-text-primary uppercase tracking-tighter">Engine Standby</span>
                </div>
             </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* GIS Control Sidebar */}
        <div className="xl:col-span-3 space-y-6">
          <div className="bg-panel p-5 rounded-2xl border border-border-subtle shadow-elevation space-y-6">
             <div className="flex items-center gap-3 border-b border-border-subtle pb-4">
                <Layers size={18} className="text-brand-primary" />
                <h3 className="text-xs font-black text-text-primary uppercase tracking-widest font-tajawal">إدارة الطبقات (Layers)</h3>
             </div>

             <div className="space-y-2">
                {layers.map(layer => (
                  <button
                    key={layer.id}
                    onClick={() => setActiveLayer(layer.id)}
                    className={`w-full p-4 rounded-xl border text-right transition-all flex items-center justify-between group ${
                      activeLayer === layer.id 
                      ? 'bg-brand-primary text-white shadow-md border-transparent ring-4 ring-brand-primary/10' 
                      : 'bg-canvas border-border-subtle text-text-secondary hover:border-brand-primary/30'
                    }`}
                  >
                     <div className="flex items-center gap-3 overflow-hidden">
                        <div className={`p-2 rounded-lg transition-colors ${activeLayer === layer.id ? 'bg-white/20' : 'bg-panel text-brand-primary group-hover:text-brand-accent'}`}>
                           {layer.icon}
                        </div>
                        <div className="overflow-hidden">
                           <div className="text-xs font-black uppercase leading-none mb-1 truncate">{layer.name}</div>
                           <div className={`text-[8px] font-bold uppercase ${activeLayer === layer.id ? 'text-blue-100' : 'text-text-subtle'}`}>{layer.provider}</div>
                        </div>
                     </div>
                     {activeLayer === layer.id && <div className="w-1.5 h-1.5 bg-brand-accent rounded-full animate-pulse shadow-glow-gold"></div>}
                  </button>
                ))}
             </div>

             <div className="p-4 bg-canvas rounded-xl border border-border-subtle space-y-4">
                <h4 className="text-[10px] font-black text-text-subtle uppercase tracking-widest">إحداثيات المركز (Center)</h4>
                <div className="grid grid-cols-2 gap-2">
                   <div className="bg-panel p-2 rounded border border-border-subtle text-center">
                      <span className="text-[8px] text-text-subtle block uppercase">LAT</span>
                      <span className="text-xs font-mono font-bold text-text-primary">{coordinates.lat.toFixed(4)}</span>
                   </div>
                   <div className="bg-panel p-2 rounded border border-border-subtle text-center">
                      <span className="text-[8px] text-text-subtle block uppercase">LNG</span>
                      <span className="text-xs font-mono font-bold text-text-primary">{coordinates.lng.toFixed(4)}</span>
                   </div>
                </div>
             </div>

             <button 
               onClick={() => setIsProcessing(true)}
               disabled={isProcessing}
               className="w-full py-4 bg-brand-primary hover:bg-brand-primary-hover text-white rounded-xl font-black text-[10px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 shadow-lg active:scale-95 disabled:opacity-50"
             >
                {isProcessing ? <Loader2 size={16} className="animate-spin" /> : <Zap size={16} className="text-brand-accent" />}
                {isProcessing ? 'جاري التحليل...' : 'تحليل التغيرات الزمنية'}
             </button>
          </div>

          <div className="bg-brand-accent/5 p-5 rounded-2xl border border-brand-accent/20">
             <div className="flex items-start gap-3">
                <AlertTriangle size={18} className="text-brand-accent mt-0.5" />
                <p className="text-[10px] text-text-secondary leading-relaxed font-bold">
                  تنبيه: جميع طلبات Sentinel-2 تمر عبر بروكسي RaidanPro المجهول لمنع تتبع عمليات الاستقصاء الميدانية.
                </p>
             </div>
          </div>
        </div>

        {/* Map Display */}
        <div className="xl:col-span-9">
          <div className="bg-panel rounded-2xl shadow-elevation h-[700px] flex flex-col border border-border-subtle relative overflow-hidden">
            <div className="flex-1 relative bg-canvas">
               <TacticalMap center={[coordinates.lat, coordinates.lng]} zoom={12} />
               
               {/* UI Overlays on Map */}
               <div className="absolute top-6 left-6 z-[400] flex flex-col gap-3">
                  <div className="bg-panel/90 backdrop-blur-md p-3 rounded-xl border border-border-subtle shadow-tactical flex items-center gap-4">
                     <div className="p-2 bg-brand-primary text-white rounded-lg"><Target size={16}/></div>
                     <div>
                        <div className="text-[10px] font-black text-text-primary uppercase leading-none mb-1">Target Area</div>
                        <div className="text-[9px] text-text-subtle font-bold">SANA'A_METRO_ZONE_01</div>
                     </div>
                  </div>
               </div>

               <div className="absolute bottom-6 left-6 z-[400]">
                  <div className="bg-slate-900/90 backdrop-blur-md px-4 py-2 rounded-lg border border-white/10 text-[10px] font-mono text-green-400 shadow-xl">
                     SATELLITE_LINK: ACTIVE // FREQ: 12.4GHz // SYNC: OK
                  </div>
               </div>

               {isProcessing && (
                 <div className="absolute inset-0 z-[1000] bg-panel/80 backdrop-blur-sm flex flex-col items-center justify-center pointer-events-none">
                    <div className="w-full h-1 bg-brand-accent shadow-[0_0_15px_rgba(250,204,21,0.5)] absolute top-0 animate-[scanner_2.5s_ease-in-out_infinite]"></div>
                    <div className="text-center space-y-6">
                       <div className="relative">
                          <Loader2 size={64} className="text-brand-accent animate-spin mx-auto" />
                          <div className="absolute inset-0 flex items-center justify-center">
                             <Satellite size={24} className="text-white" />
                          </div>
                       </div>
                       <div className="space-y-2">
                          <div className="w-80 h-1.5 bg-canvas rounded-full overflow-hidden border border-border-subtle p-0.5">
                             <div className="bg-gradient-to-r from-brand-primary to-brand-accent h-full shadow-sm transition-all duration-300" style={{ width: `${progress}%` }}></div>
                          </div>
                          <div className="flex justify-between text-[10px] font-mono text-text-subtle uppercase px-1">
                             <span>Processing NDVI Pipeline</span>
                             <span className="text-brand-accent">{progress.toFixed(1)}%</span>
                          </div>
                       </div>
                       <span className="text-[9px] font-mono text-text-primary block uppercase tracking-[0.4em] animate-pulse">Running Neural Inference on Pixel Data...</span>
                    </div>
                 </div>
               )}
            </div>
            
            {/* Map Footer Info */}
            <div className="p-4 bg-canvas border-t border-border-subtle flex justify-between items-center text-[10px] font-mono">
               <div className="flex items-center gap-6">
                  <span className="text-text-subtle flex items-center gap-2"><MousePointer2 size={12}/> CURSOR: {coordinates.lat.toFixed(5)}, {coordinates.lng.toFixed(5)}</span>
                  <span className="text-text-subtle flex items-center gap-2"><Maximize2 size={12}/> ZOOM: 12.0</span>
               </div>
               <div className="flex items-center gap-4">
                  <span className="text-brand-primary font-black uppercase">Sovereign OS v4.5</span>
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
               </div>
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
        .animate-spin-slow { animation: spin 6s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default GeoIntStation;