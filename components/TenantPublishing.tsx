
import React, { useState } from 'react';
import { Share2, PenTool, Globe, Save, RefreshCcw, Check, Lock } from 'lucide-react';

interface TenantPublishingProps {
  config?: any;
}

const TenantPublishing: React.FC<TenantPublishingProps> = ({ config }) => {
  const [formData, setFormData] = useState(config || {
    wordpress_url: '', wordpress_api_key: '', 
    ghost_url: '', ghost_admin_key: '',
    social: { facebook: false, twitter: false, linkedin: false }
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => setIsSaving(false), 1000);
  };

  return (
    <div className="p-8 space-y-8 animate-in fade-in">
       {/* WordPress Section */}
       <section className="space-y-4">
          <div className="flex items-center gap-3 border-b border-border-subtle pb-2">
             <div className="p-2 bg-blue-100 text-blue-700 rounded-lg"><Globe size={18}/></div>
             <h3 className="text-sm font-black text-text-primary uppercase tracking-widest">WordPress Integration</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="space-y-2">
                <label className="text-[10px] font-bold text-text-subtle uppercase px-1">Site URL</label>
                <input 
                  value={formData.wordpress_url}
                  onChange={e => setFormData({...formData, wordpress_url: e.target.value})}
                  className="w-full bg-canvas border border-border-subtle rounded-xl px-4 py-3 text-sm outline-none focus:border-brand-primary transition-all font-mono"
                  placeholder="https://news.org"
                />
             </div>
             <div className="space-y-2">
                <label className="text-[10px] font-bold text-text-subtle uppercase px-1">Application Password (API)</label>
                <div className="relative">
                    <input 
                      type="password"
                      value={formData.wordpress_api_key}
                      onChange={e => setFormData({...formData, wordpress_api_key: e.target.value})}
                      className="w-full bg-canvas border border-border-subtle rounded-xl px-4 py-3 text-sm outline-none focus:border-brand-primary transition-all font-mono"
                      placeholder="**** **** ****"
                    />
                    <Lock size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-subtle" />
                </div>
             </div>
          </div>
       </section>

       {/* Ghost Section */}
       <section className="space-y-4">
          <div className="flex items-center gap-3 border-b border-border-subtle pb-2">
             <div className="p-2 bg-slate-100 text-slate-700 rounded-lg"><PenTool size={18}/></div>
             <h3 className="text-sm font-black text-text-primary uppercase tracking-widest">Ghost CMS</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="space-y-2">
                <label className="text-[10px] font-bold text-text-subtle uppercase px-1">Admin URL</label>
                <input 
                  value={formData.ghost_url}
                  onChange={e => setFormData({...formData, ghost_url: e.target.value})}
                  className="w-full bg-canvas border border-border-subtle rounded-xl px-4 py-3 text-sm outline-none focus:border-brand-primary transition-all font-mono"
                  placeholder="https://news.org/ghost"
                />
             </div>
             <div className="space-y-2">
                <label className="text-[10px] font-bold text-text-subtle uppercase px-1">Admin API Key</label>
                <div className="relative">
                    <input 
                      type="password"
                      value={formData.ghost_admin_key}
                      onChange={e => setFormData({...formData, ghost_admin_key: e.target.value})}
                      className="w-full bg-canvas border border-border-subtle rounded-xl px-4 py-3 text-sm outline-none focus:border-brand-primary transition-all font-mono"
                      placeholder="Token..."
                    />
                    <Lock size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-subtle" />
                </div>
             </div>
          </div>
       </section>

       {/* Social Section */}
       <section className="space-y-4">
          <div className="flex items-center gap-3 border-b border-border-subtle pb-2">
             <div className="p-2 bg-purple-100 text-purple-700 rounded-lg"><Share2 size={18}/></div>
             <h3 className="text-sm font-black text-text-primary uppercase tracking-widest">Auto-Post Channels</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
             {['facebook', 'twitter', 'linkedin'].map(platform => (
                <div key={platform} className="p-4 rounded-xl border border-border-subtle bg-canvas flex items-center justify-between">
                   <span className="text-xs font-bold uppercase">{platform}</span>
                   <button 
                     onClick={() => setFormData({...formData, social: {...formData.social, [platform]: !formData.social?.[platform]}})}
                     className={`w-10 h-5 rounded-full p-0.5 flex items-center transition-all ${formData.social?.[platform] ? 'bg-green-500 justify-end' : 'bg-slate-300 justify-start'}`}
                   >
                      <div className="w-4 h-4 bg-white rounded-full shadow-sm"></div>
                   </button>
                </div>
             ))}
          </div>
       </section>

       <div className="pt-6 border-t border-border-subtle flex justify-end">
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="bg-brand-primary hover:bg-brand-primary-hover text-white px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-md flex items-center gap-3 active:scale-95 disabled:opacity-70"
          >
            {isSaving ? <RefreshCcw size={16} className="animate-spin" /> : <Save size={16} />}
            حفظ إعدادات النشر
          </button>
       </div>
    </div>
  );
};

export default TenantPublishing;
