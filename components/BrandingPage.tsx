import React, { useState, useRef } from 'react';
import { 
  Palette, Type, Image as ImageIcon, Save, 
  RefreshCcw, Eye, Upload, CheckCircle2, 
  Terminal, ShieldCheck, Activity, Brain, 
  MessageSquare, Fingerprint, Map, Layout, 
  Maximize2, MousePointer2, AlertTriangle, Zap
} from 'lucide-react';
import { useBranding, TypographyStyle } from '../context/BrandingContext';

const BrandingPage: React.FC = () => {
  const { theme, nomenclature, typography, updateTheme, updateNomenclature, updateTypography } = useBranding();
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleColorChange = (key: 'primary' | 'accent' | 'bgBase', val: string) => {
    updateTheme({ [key]: val });
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        updateTheme({ logoUrl: event.target?.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerSave = () => {
    setIsSaving(true);
    setTimeout(() => setIsSaving(false), 1200);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-20 font-tajawal">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6 border border-slate-200 border-r-4 border-r-yemenGold shadow-tactical">
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 bg-yemenGold/10 rounded-xl flex items-center justify-center text-yemenGold border border-yemenGold/20">
            <Palette size={28} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-900 leading-none uppercase">إدارة الهوية والتخصيص</h2>
            <p className="text-[10px] text-yemenGold font-bold uppercase tracking-[0.3em] mt-2">White-Labeling & Sovereign Branding Engine</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
           <button 
             onClick={triggerSave}
             className="bg-yemenGold hover:bg-amber-400 text-yemenBlue-dark px-8 py-3 rounded-xl font-black text-xs uppercase tracking-[0.2em] transition-all shadow-md flex items-center gap-3 active:scale-95"
           >
             {isSaving ? <RefreshCcw size={18} className="animate-spin" /> : <Save size={18} />}
             تثبيت الهوية الجديدة
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        {/* Appearance Panel */}
        <div className="xl:col-span-8 space-y-8">
          <section className="bg-white p-8 rounded-2xl border-slate-200 border shadow-sm space-y-8">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <Palette size={20} className="text-yemenBlue" />
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">محرك السمات (Theming Engine)</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <ColorSettingItem 
                label="اللون الرئيسي (Primary)" 
                value={theme.primary} 
                onChange={(val) => handleColorChange('primary', val)} 
                desc="يستخدم في الأزرار الرئيسية والهيدر"
              />
              <ColorSettingItem 
                label="اللون الثانوي (Accent)" 
                value={theme.accent} 
                onChange={(val) => handleColorChange('accent', val)} 
                desc="يستخدم للتنبيهات واللمسات الجمالية"
              />
               <ColorSettingItem 
                label="خلفية القاعدة (Base BG)" 
                value={theme.bgBase} 
                onChange={(val) => handleColorChange('bgBase', val)} 
                desc="يتحكم في لون خلفية النظام"
              />
            </div>

            <div className="pt-8 border-t border-slate-100">
               <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-4">شعار المنصة السيادي (Sovereign Logo)</label>
               <div 
                 onClick={() => fileInputRef.current?.click()}
                 className="group relative border-2 border-dashed border-slate-200 rounded-2xl p-10 flex flex-col items-center justify-center gap-4 hover:border-yemenBlue/50 hover:bg-yemenBlue/5 transition-all cursor-pointer overflow-hidden bg-slate-50/50"
               >
                  {theme.logoUrl ? (
                    <img src={theme.logoUrl} alt="Logo Preview" className="h-16 object-contain relative z-10" />
                  ) : (
                    <div className="w-16 h-16 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 group-hover:text-yemenBlue transition-all">
                       <ImageIcon size={32} />
                    </div>
                  )}
                  <div className="text-center relative z-10">
                    <p className="text-xs font-black text-slate-800 uppercase tracking-widest">رفع شعار جديد</p>
                    <p className="text-[9px] text-slate-500 font-bold uppercase mt-1">SVG, PNG Transparent (Max 2MB)</p>
                  </div>
                  <input type="file" ref={fileInputRef} className="hidden" accept="image/png, image/svg+xml" onChange={handleLogoUpload} />
                  <div className="absolute inset-0 bg-yemenBlue/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
               </div>
            </div>
          </section>

          {/* Typography Engine */}
          <section className="bg-white p-8 rounded-2xl border-slate-200 border shadow-sm space-y-8">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <Type size={20} className="text-yemenBlue" />
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">محرك الخطوط (Typography Engine)</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <TypographySettingItem title="العناوين (Headings)" elementKey="heading" />
              <TypographySettingItem title="النصوص الأساسية (Body)" elementKey="body" />
              <TypographySettingItem title="التسميات (Labels)" elementKey="label" />
            </div>
          </section>

          {/* Nomenclature Panel */}
          <section className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <Type size={20} className="text-yemenBlue" />
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">قاموس التسميات (Nomenclature Map)</h3>
            </div>
            <div className="grid grid-cols-1 gap-4">
               {Object.entries(nomenclature).map(([key, label]) => (
                 <div key={key} className="flex flex-col md:flex-row items-center gap-4 bg-slate-50/50 p-4 rounded-xl border border-slate-100 group hover:border-yemenBlue/20 transition-all">
                    <div className="md:w-48 text-right border-l-0 md:border-l border-slate-200 pl-0 md:pl-4">
                       <code className="text-[9px] font-mono text-slate-500 uppercase font-black">{key}</code>
                    </div>
                    <div className="flex-1 w-full">
                       <input 
                         type="text" 
                         value={label}
                         onChange={(e) => updateNomenclature(key, e.target.value)}
                         className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-xs text-slate-900 outline-none focus:border-yemenBlue transition-all font-bold"
                       />
                    </div>
                 </div>
               ))}
            </div>
          </section>
        </div>

        {/* Live Preview Side Panel */}
        <div className="xl:col-span-4 space-y-6">
          <div className="sticky top-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-6 overflow-hidden">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                   <Eye size={18} className="text-yemenBlue" />
                   <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest">المعاينة الفورية</h3>
                </div>
                <div className="flex items-center gap-1.5 px-2 py-0.5 bg-green-50 border border-green-200 rounded-full">
                   <div className="w-1 h-1 bg-green-500 rounded-full animate-pulse"></div>
                   <span className="text-[8px] font-black text-green-700 uppercase">Live Render</span>
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50 overflow-hidden shadow-inner scale-95 origin-top transition-all">
                 <div className="h-12 flex items-center justify-between px-4 border-b border-slate-100" style={{ backgroundColor: theme.primary }}>
                    <div className="flex items-center gap-2">
                       {theme.logoUrl ? (
                         <img src={theme.logoUrl} className="h-6 object-contain" alt="Logo Preview"/>
                       ) : (
                         <div className="w-4 h-4 rounded-sm" style={{ backgroundColor: theme.accent }}></div>
                       )}
                       <span className="text-[8px] font-black text-white uppercase tracking-tighter">Sovereign_OS</span>
                    </div>
                 </div>
                 <div className="p-4 space-y-4 min-h-[300px]" style={{ backgroundColor: theme.bgBase }}>
                    <div className="flex justify-between items-center">
                       <div className="h-3 w-20 rounded" style={{ backgroundColor: typography.label.color, opacity: 0.2 }}></div>
                       <div className="h-5 w-5 rounded border flex items-center justify-center" style={{ backgroundColor: theme.accent+'1A', borderColor: theme.accent+'4D' }}>
                          <Brain size={10} style={{ color: theme.accent }} />
                       </div>
                    </div>
                    <div className="space-y-2">
                       <h4 style={{ fontFamily: typography.heading.fontFamily, fontWeight: typography.heading.fontWeight, color: typography.heading.color, fontSize: '1.1rem' }}>عنوان رئيسي</h4>
                       <p style={{ fontFamily: typography.body.fontFamily, fontWeight: typography.body.fontWeight, color: typography.body.color, fontSize: '0.8rem', lineHeight: '1.5' }}>هذا نص أساسي للمعاينة، يوضح كيف سيبدو المحتوى بعد تطبيق إعدادات الخط الجديدة.</p>
                    </div>
                    <button className="w-full h-8 rounded-lg mt-4 flex items-center justify-center" style={{ backgroundColor: theme.accent }}>
                       <Zap size={12} style={{ color: theme.primary }} />
                    </button>
                 </div>
              </div>

              <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
                 <div className="flex items-start gap-3">
                    <AlertTriangle size={14} className="text-amber-500 mt-0.5" />
                    <p className="text-[9px] text-amber-800 font-bold leading-relaxed uppercase">
                      ملاحظة: تغيير الألوان والخطوط قد يتطلب إعادة تحميل الصفحة لتطبيقه على كافة أجزاء النظام.
                    </p>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ColorSettingItem: React.FC<{ label: string, value: string, onChange: (val: string) => void, desc: string }> = ({ label, value, onChange, desc }) => (
  <div className="space-y-4 group">
    <div className="flex flex-col gap-1 px-1">
      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest group-focus-within:text-yemenBlue transition-colors">{label}</label>
      <span className="text-[8px] text-slate-400 font-bold uppercase">{desc}</span>
    </div>
    <div className="relative">
      <div 
        className="w-full h-14 rounded-xl border-2 border-slate-100 transition-all flex items-center gap-4 px-4 bg-slate-50/50 hover:border-slate-200"
      >
        <div className="relative w-8 h-8 rounded-lg overflow-hidden border border-slate-200 shadow-md">
          <input 
            type="color" 
            value={value} 
            onChange={(e) => onChange(e.target.value)}
            className="absolute inset-0 w-[200%] h-[200%] -translate-x-1/4 -translate-y-1/4 cursor-pointer"
          />
        </div>
        <div className="flex-1">
          <input 
            type="text" 
            value={value.toUpperCase()}
            onChange={(e) => onChange(e.target.value)}
            className="bg-transparent text-xs font-mono text-slate-800 outline-none w-full font-black uppercase"
          />
        </div>
      </div>
    </div>
  </div>
);

const TypographySettingItem: React.FC<{
  title: string;
  elementKey: 'heading' | 'body' | 'label';
}> = ({ title, elementKey }) => {
  const { typography, updateTypography } = useBranding();
  const style = typography[elementKey];

  const handleStyleChange = (prop: keyof TypographyStyle, value: string) => {
    updateTypography(elementKey, { [prop]: value });
  };
  
  const commonInputClass = "w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 outline-none focus:border-yemenBlue transition-all font-bold";

  return (
    <div className="bg-slate-50/50 p-6 rounded-2xl border border-slate-200 space-y-4">
      <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest">{title}</h4>
      
      <div className="space-y-1">
        <label className="text-[9px] font-bold text-slate-500 uppercase px-1">نوع الخط</label>
        <select value={style.fontFamily} onChange={(e) => handleStyleChange('fontFamily', e.target.value)} className={commonInputClass}>
          <option value="'Tajawal', sans-serif">Tajawal</option>
          <option value="'Cairo', sans-serif">Cairo</option>
          <option value="sans-serif">System Default</option>
        </select>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
         <div className="space-y-1">
            <label className="text-[9px] font-bold text-slate-500 uppercase px-1">الحجم</label>
            <input type="text" value={style.fontSize} onChange={(e) => handleStyleChange('fontSize', e.target.value)} className={commonInputClass} placeholder="e.g., 1rem"/>
         </div>
         <div className="space-y-1">
            <label className="text-[9px] font-bold text-slate-500 uppercase px-1">الوزن</label>
            <select value={style.fontWeight} onChange={(e) => handleStyleChange('fontWeight', e.target.value)} className={commonInputClass}>
              <option value="300">Light</option>
              <option value="400">Normal</option>
              <option value="500">Medium</option>
              <option value="700">Bold</option>
              <option value="900">Black</option>
            </select>
         </div>
      </div>

      <div className="space-y-2">
        <label className="text-[9px] font-bold text-slate-500 uppercase px-1">اللون</label>
        <div className="relative w-full h-10 rounded-lg overflow-hidden border border-slate-200 shadow-inner bg-white">
          <input 
            type="color" 
            value={style.color} 
            onChange={(e) => handleStyleChange('color', e.target.value)}
            className="absolute inset-0 w-full h-full cursor-pointer opacity-0"
          />
          <div className="w-full h-full flex items-center justify-between px-3" style={{ backgroundColor: style.color }}>
             <span className="font-mono text-xs font-bold" style={{ color: style.color }}>{style.color.toUpperCase()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrandingPage;