
import React, { useState } from 'react';
import { Save, RefreshCcw, Layout } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const LandingPageEditor: React.FC = () => {
  const { t } = useLanguage();
  const [heroTitle, setHeroTitle] = useState({ ar: 'السيادة الرقمية تبدأ هنا', en: 'Digital Sovereignty Starts Here' });
  
  return (
    <div className="space-y-6 animate-in fade-in duration-700 pb-20">
       <div className="bg-panel p-6 rounded-2xl flex items-center justify-between border border-border-subtle shadow-elevation">
          <div className="flex items-center gap-4">
             <div className="p-3 bg-brand-primary/10 rounded-xl text-brand-primary"><Layout size={24}/></div>
             <h2 className="text-xl font-black text-text-primary">{t('marketing_editor_title')}</h2>
          </div>
          <button className="bg-brand-primary text-white px-6 py-2 rounded-xl text-xs font-bold flex items-center gap-2">
             <Save size={16}/> Save Changes
          </button>
       </div>
       
       <div className="bg-panel p-8 rounded-2xl border border-border-subtle space-y-6">
          <h3 className="text-sm font-black text-text-primary uppercase tracking-widest border-b border-border-subtle pb-2">Hero Section</h3>
          <div className="grid grid-cols-2 gap-6">
             <div className="space-y-2">
                <label className="text-xs font-bold">العنوان (العربية)</label>
                <input value={heroTitle.ar} onChange={e => setHeroTitle({...heroTitle, ar: e.target.value})} className="w-full bg-canvas border border-border-subtle rounded-xl p-3 text-sm"/>
             </div>
             <div className="space-y-2">
                <label className="text-xs font-bold">Title (English)</label>
                <input value={heroTitle.en} onChange={e => setHeroTitle({...heroTitle, en: e.target.value})} className="w-full bg-canvas border border-border-subtle rounded-xl p-3 text-sm"/>
             </div>
          </div>
          {/* More fields would go here */}
       </div>
    </div>
  );
};

export default LandingPageEditor;
