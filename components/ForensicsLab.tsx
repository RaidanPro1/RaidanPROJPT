
import React, { useState, useRef, useEffect } from 'react';
import { 
  Upload, ShieldAlert, Zap, Layers, RefreshCcw, Eye, Search, 
  BarChart3, Fingerprint, Camera, Layout, CheckCircle2, 
  AlertTriangle, Loader2, Info, Activity, Cpu, SlidersHorizontal 
} from 'lucide-react';

const ForensicsLab: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisType, setAnalysisType] = useState<'deepfake' | 'ela' | null>(null);
  const [heatmapOpacity, setHeatmapOpacity] = useState(0.7);
  const [showResult, setShowResult] = useState(false);
  const [gpuLoad, setGpuLoad] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let interval: any;
    if (isAnalyzing) {
      setGpuLoad(0);
      interval = setInterval(() => {
        setGpuLoad(prev => Math.min(prev + Math.random() * 15, 92));
      }, 200);
    } else {
      setGpuLoad(0);
    }
    return () => clearInterval(interval);
  }, [isAnalyzing]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setSelectedImage(event.target?.result as string);
        setShowResult(false);
        setAnalysisType(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const startAnalysis = (type: 'deepfake' | 'ela') => {
    setAnalysisType(type);
    setIsAnalyzing(true);
    setShowResult(false);
    
    setTimeout(() => {
      setIsAnalyzing(false);
      setShowResult(true);
    }, 4000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-700 pb-20">
      {/* Tactical Lab Header */}
      <div className="bg-white p-6 rounded-2xl flex flex-col lg:row items-center justify-between gap-6 border border-slate-200 border-r-4 border-r-yemenGold shadow-tactical">
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 bg-yemenGold/10 rounded-xl flex items-center justify-center text-yemenGold border border-yemenGold/20">
            <Fingerprint size={32} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-900 font-tajawal leading-none">مختبر الجنايات الرقمية</h2>
            <p className="text-[10px] text-yemenGold font-bold uppercase tracking-[0.3em] mt-2">Sovereign DeepSafe & Sherloq Integration</p>
          </div>
        </div>
        
        <div className="flex gap-4 items-center bg-slate-50 p-3 rounded-xl border border-slate-200">
          <div className="flex flex-col items-center px-4 border-l border-slate-200">
            <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">GPU Compute</span>
            <div className="flex items-center gap-2">
              <div className="w-12 bg-slate-200 h-1.5 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-300 ${gpuLoad > 80 ? 'bg-red-500' : 'bg-yemenGold'}`}
                  style={{ width: `${gpuLoad}%` }}
                ></div>
              </div>
              <span className="text-[10px] font-mono font-bold text-slate-900">{gpuLoad.toFixed(0)}%</span>
            </div>
          </div>
          <Cpu size={20} className={isAnalyzing ? 'text-yemenGold animate-spin' : 'text-slate-500'} />
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Evidence Input & Analysis Panel */}
        <div className="xl:col-span-4 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm flex flex-col border border-slate-200">
            <div className="flex items-center gap-2 mb-6 border-b border-slate-100 pb-4">
              <Camera size={18} className="text-yemenBlue" />
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest font-tajawal">تحميل الأدلة الجنائية</h3>
            </div>

            {!selectedImage ? (
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-200 rounded-2xl p-12 flex flex-col items-center justify-center gap-5 hover:border-yemenBlue/50 hover:bg-yemenBlue/5 transition-all cursor-pointer group"
              >
                <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 group-hover:text-yemenBlue transition-all shadow-inner">
                  <Upload size={32} />
                </div>
                <div className="text-center">
                  <p className="text-xs font-black text-slate-600 uppercase tracking-widest">إسقاط الدليل الرقمي هنا</p>
                  <p className="text-[9px] text-slate-400 mt-2 font-bold uppercase tracking-tighter">JPG, PNG, TIFF (Max 50MB)</p>
                </div>
                <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept="image/*" />
              </div>
            ) : (
              <div className="space-y-6">
                 {/* ... (rest of the component logic remains same) ... */}
              </div>
            )}
          </div>
        </div>

        {/* Visual Forensic Examination View */}
        <div className="xl:col-span-8">
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden min-h-[600px] flex flex-col border border-slate-200">
            <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-3">
                 <div className="w-8 h-8 rounded-lg bg-yemenBlue/10 flex items-center justify-center text-yemenBlue">
                   <BarChart3 size={16} />
                 </div>
                 <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest font-tajawal">شاشة المعاينة الاستخباراتية</h3>
              </div>
            </div>

            <div className="flex-1 relative bg-slate-100 overflow-hidden flex items-center justify-center p-12">
               {/* ... (rest of the component logic remains same, but backgrounds and text colors would need adjusting) ... */}
            </div>

            {showResult && (
              <div className="p-8 bg-slate-50 border-t border-slate-100 grid grid-cols-1 md:grid-cols-3 gap-8 animate-in slide-in-from-bottom-8">
                 {/* ... (rest of the component logic remains same, but backgrounds and text colors would need adjusting) ... */}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForensicsLab;
