import React, { useState } from 'react';
import { X, Zap, Shield, Mail, Brain, Binoculars, Map, Server, Globe, Lock, CheckCircle2, Info, Database, Search, LayoutTemplate } from 'lucide-react';

interface ProvisioningModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProvision: (data: any) => void;
}

const ProvisioningModal: React.FC<ProvisioningModalProps> = ({ isOpen, onClose, onProvision }) => {
  const [formData, setFormData] = useState({
    name: '',
    domain: '',
    cf_token: '',
    services: {
      ai_chat: true,
      wordpress: true,
      docs: true
    }
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-canvas/50 backdrop-blur-sm" onClick={onClose}></div>
      <div className="bg-panel w-full max-w-2xl rounded-2xl shadow-xl relative overflow-hidden animate-in zoom-in-95 duration-300 border border-border-subtle">
        <div className="h-1.5 bg-gradient-to-r from-brand-primary via-brand-accent to-brand-primary"></div>
        
        <div className="p-8">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-brand-primary/10 rounded-xl flex items-center justify-center text-brand-primary border border-brand-primary/20">
                <Server size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-black text-text-primary font-tajawal">تجهيز مستأجر جديد (Protocol V2)</h2>
                <p className="text-[10px] text-brand-primary font-bold uppercase tracking-[0.3em]">Full Infrastructure Provisioning</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 text-text-subtle hover:text-text-primary transition-colors bg-canvas rounded-lg">
              <X size={20} />
            </button>
          </div>

          <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); onProvision(formData); }}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
               <div className="space-y-1">
                  <label className="text-[10px] font-black text-text-subtle uppercase tracking-widest px-1">اسم العميل (Organization)</label>
                  <input required className="w-full bg-canvas border border-border-subtle rounded-xl px-4 py-3 text-sm outline-none focus:border-brand-primary transition-all text-text-primary" 
                    onChange={e => setFormData({...formData, name: e.target.value})} placeholder="مؤسسة الصحافة الحديثة"
                  />
               </div>
               <div className="space-y-1">
                  <label className="text-[10px] font-black text-text-subtle uppercase tracking-widest px-1">النطاق الرئيسي (Base Domain)</label>
                  <input required className="w-full bg-canvas border border-border-subtle rounded-xl px-4 py-3 text-sm outline-none focus:border-brand-primary transition-all font-mono text-text-primary" 
                    onChange={e => setFormData({...formData, domain: e.target.value})} placeholder="modernpress.net"
                  />
               </div>
            </div>

            {/* Subdomain Preview */}
            <div className="bg-canvas p-4 rounded-xl border border-border-subtle space-y-3">
                <h4 className="text-xs font-black text-text-secondary uppercase tracking-widest mb-2">سيتم إنشاء البنية التحتية التالية تلقائياً:</h4>
                <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center gap-2 text-xs font-mono text-text-subtle bg-panel p-2 rounded border border-border-subtle">
                        <Brain size={14} className="text-brand-primary"/> ai.{formData.domain || 'domain.com'}
                    </div>
                    <div className="flex items-center gap-2 text-xs font-mono text-text-subtle bg-panel p-2 rounded border border-border-subtle">
                        <LayoutTemplate size={14} className="text-purple-500"/> wp.{formData.domain || 'domain.com'} (WordPress)
                    </div>
                    <div className="flex items-center gap-2 text-xs font-mono text-text-subtle bg-panel p-2 rounded border border-border-subtle">
                        <Search size={14} className="text-green-500"/> dash.{formData.domain || 'domain.com'}
                    </div>
                    <div className="flex items-center gap-2 text-xs font-mono text-text-subtle bg-panel p-2 rounded border border-border-subtle">
                        <Info size={14} className="text-text-subtle"/> yemenjpt.{formData.domain || 'domain.com'}
                    </div>
                </div>
            </div>
            
            <div className="flex gap-4 pt-4">
              <button 
                type="submit"
                className="flex-1 bg-brand-primary hover:bg-brand-primary-hover text-white font-black py-4 rounded-xl text-xs uppercase tracking-[0.2em] transition-all shadow-md active:scale-95 flex items-center justify-center gap-3"
              >
                <Zap size={18} fill="currentColor" className="text-brand-accent" />
                تفعيل النشر الآلي (Deploy V2)
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProvisioningModal;