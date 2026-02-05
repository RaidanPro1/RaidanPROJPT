
import React, { useState } from 'react';
import { 
  Search, Globe, Share2, Save, RefreshCcw, 
  Layout, Type, Image as ImageIcon, CheckCircle2,
  AlertCircle, Shield
} from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import { useLanguage } from '../context/LanguageContext';

const SeoManager: React.FC = () => {
  const { userRole } = useSettings();
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'general' | 'social' | 'sitemap'>('general');
  const [isSaving, setIsSaving] = useState(false);

  // Mock State - In real app, load from backend
  const [config, setConfig] = useState({
    title: 'RaidanPro | Sovereign Intelligence Platform',
    description: 'نظام الاستخبارات والسيادة الرقمية الأول في اليمن. تحليل بيانات، كشف تزييف، ورصد استراتيجي.',
    keywords: 'اليمن, ذكاء اصطناعي, سيادة رقمية, تحليل بيانات, OSINT',
    ogImage: 'https://raidan.pro/og-share.jpg',
    robots: 'index, follow'
  });

  const handleSave = () => {
    setIsSaving(true);
    // Simulate API Call
    setTimeout(() => {
      setIsSaving(false);
    }, 1500);
  };

  if (userRole === 'viewer') {
      return (
          <div className="flex flex-col items-center justify-center h-[500px] text-slate-400">
              <Shield size={48} className="mb-4 text-slate-300" />
              <p>ليس لديك صلاحية الوصول لإعدادات محركات البحث.</p>
          </div>
      );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-700 pb-20 font-tajawal">
      {/* Header */}
      <div className="bg-panel p-6 rounded-2xl flex items-center justify-between border border-border-subtle shadow-elevation">
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 bg-purple-500/10 rounded-xl flex items-center justify-center text-purple-600 border border-purple-500/20">
            <Search size={28} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-text-primary leading-none uppercase">مدير محركات البحث (SEO)</h2>
            <p className="text-[10px] text-purple-500 font-bold uppercase tracking-[0.3em] mt-2">Search Engine Optimization & Metadata</p>
          </div>
        </div>
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-xl font-black text-xs uppercase tracking-[0.2em] transition-all shadow-md flex items-center gap-3 active:scale-95 disabled:opacity-70"
        >
          {isSaving ? <RefreshCcw size={18} className="animate-spin" /> : <Save size={18} />}
          حفظ التغييرات
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Settings Column */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-panel rounded-2xl border border-border-subtle overflow-hidden">
            <div className="flex border-b border-border-subtle">
               {['general', 'social', 'sitemap'].map((tab) => (
                 <button
                   key={tab}
                   onClick={() => setActiveTab(tab as any)}
                   className={`flex-1 py-4 text-xs font-black uppercase tracking-widest transition-colors ${activeTab === tab ? 'bg-brand-primary/5 text-brand-primary border-b-2 border-brand-primary' : 'text-text-subtle hover:bg-canvas'}`}
                 >
                   {tab === 'general' && 'إعدادات عامة'}
                   {tab === 'social' && 'التواصل الاجتماعي'}
                   {tab === 'sitemap' && 'خريطة الموقع'}
                 </button>
               ))}
            </div>

            <div className="p-8 space-y-6">
               {activeTab === 'general' && (
                 <>
                   <InputGroup label="عنوان الموقع (Meta Title)" icon={<Type size={16}/>}>
                      <input 
                        value={config.title} 
                        onChange={e => setConfig({...config, title: e.target.value})}
                        className="w-full bg-canvas border border-border-subtle rounded-xl px-4 py-3 text-sm text-text-primary outline-none focus:border-brand-primary transition-all font-bold"
                      />
                      <p className="text-[10px] text-text-subtle mt-1 flex justify-between">
                        <span>يظهر في شريط المتصفح ونتائج Google.</span>
                        <span className={config.title.length > 60 ? 'text-red-500' : 'text-green-500'}>{config.title.length}/60</span>
                      </p>
                   </InputGroup>

                   <InputGroup label="وصف الموقع (Meta Description)" icon={<Layout size={16}/>}>
                      <textarea 
                        rows={3}
                        value={config.description} 
                        onChange={e => setConfig({...config, description: e.target.value})}
                        className="w-full bg-canvas border border-border-subtle rounded-xl px-4 py-3 text-sm text-text-primary outline-none focus:border-brand-primary transition-all font-medium resize-none"
                      />
                      <p className="text-[10px] text-text-subtle mt-1 flex justify-between">
                        <span>وصف مختصر يظهر تحت العنوان في النتائج.</span>
                        <span className={config.description.length > 160 ? 'text-red-500' : 'text-green-500'}>{config.description.length}/160</span>
                      </p>
                   </InputGroup>

                   <InputGroup label="الكلمات المفتاحية (Keywords)" icon={<Globe size={16}/>}>
                      <input 
                        value={config.keywords} 
                        onChange={e => setConfig({...config, keywords: e.target.value})}
                        className="w-full bg-canvas border border-border-subtle rounded-xl px-4 py-3 text-sm text-text-primary outline-none focus:border-brand-primary transition-all font-mono text-xs"
                      />
                   </InputGroup>
                 </>
               )}

               {activeTab === 'social' && (
                 <>
                    <InputGroup label="صورة المشاركة (OG Image URL)" icon={<ImageIcon size={16}/>}>
                      <div className="flex gap-2">
                        <input 
                          value={config.ogImage} 
                          onChange={e => setConfig({...config, ogImage: e.target.value})}
                          className="flex-1 bg-canvas border border-border-subtle rounded-xl px-4 py-3 text-sm text-text-primary outline-none focus:border-brand-primary transition-all font-mono text-xs"
                        />
                        <button className="px-4 bg-brand-primary/10 text-brand-primary rounded-xl font-bold text-xs hover:bg-brand-primary hover:text-white transition-all">رفع</button>
                      </div>
                   </InputGroup>
                   <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl flex gap-3 items-start">
                      <InfoIcon className="text-blue-500 mt-0.5" />
                      <p className="text-xs text-blue-700 leading-relaxed font-bold">
                        يتم استخدام بروتوكول Open Graph (OG) لضمان ظهور الروابط بشكل جذاب عند مشاركتها على Facebook, Twitter, WhatsApp.
                      </p>
                   </div>
                 </>
               )}

               {activeTab === 'sitemap' && (
                 <div className="text-center py-8">
                    <div className="w-16 h-16 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-200">
                       <CheckCircle2 size={32} />
                    </div>
                    <h3 className="text-lg font-black text-text-primary mb-2">خريطة الموقع مفعلة وتتحدث تلقائياً</h3>
                    <p className="text-sm text-text-subtle mb-6">sitemap.xml يتم تحديثه كل 24 ساعة ليشمل التقارير الجديدة.</p>
                    <div className="bg-canvas p-4 rounded-xl border border-border-subtle font-mono text-xs text-left inline-block" dir="ltr">
                       https://raidan.pro/sitemap.xml
                    </div>
                 </div>
               )}
            </div>
          </div>
        </div>

        {/* Preview Column */}
        <div className="space-y-6">
           <h3 className="text-xs font-black text-text-subtle uppercase tracking-widest px-1">معاينة النتائج (Live Preview)</h3>
           
           {/* Google Preview */}
           <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <div className="flex items-center gap-2 mb-1">
                 <div className="w-6 h-6 bg-slate-100 rounded-full flex items-center justify-center"><Globe size={12} className="text-slate-500"/></div>
                 <div className="flex flex-col">
                    <span className="text-[10px] text-slate-800">raidan.pro</span>
                    <span className="text-[8px] text-slate-500">https://raidan.pro</span>
                 </div>
              </div>
              <h4 className="text-lg text-[#1a0dab] font-serif hover:underline cursor-pointer truncate">{config.title}</h4>
              <p className="text-sm text-slate-600 line-clamp-2 leading-snug mt-1">{config.description}</p>
           </div>

           {/* Social Preview */}
           <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="h-40 bg-slate-200 flex items-center justify-center relative">
                 {config.ogImage ? (
                   <img src={config.ogImage} className="w-full h-full object-cover" alt="OG" />
                 ) : (
                   <ImageIcon size={32} className="text-slate-400" />
                 )}
              </div>
              <div className="p-3 bg-slate-50 border-t border-slate-200">
                 <div className="text-[10px] text-slate-500 uppercase font-bold mb-1">RAIDAN.PRO</div>
                 <h4 className="text-sm font-bold text-slate-900 truncate">{config.title}</h4>
                 <p className="text-xs text-slate-600 line-clamp-1 mt-0.5">{config.description}</p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

const InputGroup: React.FC<{label: string, icon: React.ReactNode, children: React.ReactNode}> = ({label, icon, children}) => (
  <div className="space-y-2">
     <label className="flex items-center gap-2 text-xs font-black text-text-secondary uppercase tracking-wide">
        {icon} {label}
     </label>
     {children}
  </div>
);

const InfoIcon = ({className}: {className?: string}) => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"></circle><path d="M12 16v-4"></path><path d="M12 8h.01"></path></svg>
);

export default SeoManager;
