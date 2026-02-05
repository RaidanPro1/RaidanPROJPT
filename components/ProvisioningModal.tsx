
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
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={onClose}></div>
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl relative overflow-hidden animate-in zoom-in-95 duration-300 border border-slate-200">
        <div className="h-1.5 bg-gradient-to-r from-yemenBlue via-yemenGold to-yemenBlue"></div>
        
        <div className="p-8">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-yemenBlue/10 rounded-xl flex items-center justify-center text-yemenBlue border border-yemenBlue/20">
                <Server size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-black text-slate-900 font-tajawal">تجهيز مستأجر جديد (Protocol V2)</h2>
                <p className="text-[10px] text-yemenBlue font-bold uppercase tracking-[0.3em]">Full Infrastructure Provisioning</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-800 transition-colors bg-slate-100 rounded-lg">
              <X size={20} />
            </button>
          </div>

          <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); onProvision(formData); }}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
               <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">اسم العميل (Organization)</label>
                  <input required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-yemenBlue transition-all" 
                    onChange={e => setFormData({...formData, name: e.target.value})} placeholder="مؤسسة الصحافة الحديثة"
                  />
               </div>
               <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">النطاق الرئيسي (Base Domain)</label>
                  <input required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-yemenBlue transition-all font-mono" 
                    onChange={e => setFormData({...formData, domain: e.target.value})} placeholder="modernpress.net"
                  />
               </div>
            </div>

            {/* Subdomain Preview */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                <h4 className="text-xs font-black text-slate-700 uppercase tracking-widest mb-2">سيتم إنشاء البنية التحتية التالية تلقائياً:</h4>
                <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center gap-2 text-xs font-mono text-slate-600 bg-white p-2 rounded border border-slate-100">
                        <Brain size={14} className="text-yemenBlue"/> ai.{formData.domain || 'domain.com'}
                    </div>
                    <div className="flex items-center gap-2 text-xs font-mono text-slate-600 bg-white p-2 rounded border border-slate-100">
                        <LayoutTemplate size={14} className="text-purple-500"/> wp.{formData.domain || 'domain.com'} (WordPress)
                    </div>
                    <div className="flex items-center gap-2 text-xs font-mono text-slate-600 bg-white p-2 rounded border border-slate-100">
                        <Search size={14} className="text-green-500"/> dash.{formData.domain || 'domain.com'}
                    </div>
                    <div className="flex items-center gap-2 text-xs font-mono text-slate-600 bg-white p-2 rounded border border-slate-100">
                        <Info size={14} className="text-slate-400"/> yemenjpt.{formData.domain || 'domain.com'}
                    </div>
                </div>
            </div>
            
            <div className="flex gap-4 pt-4">
              <button 
                type="submit"
                className="flex-1 bg-yemenBlue hover:bg-yemenBlue-hover text-white font-black py-4 rounded-xl text-xs uppercase tracking-[0.2em] transition-all shadow-md active:scale-95 flex items-center justify-center gap-3"
              >
                <Zap size={18} fill="currentColor" className="text-yemenGold" />
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
