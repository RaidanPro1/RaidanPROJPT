
import React, { useState } from 'react';
import { X, Zap, Shield, Mail, Brain, Binoculars, Map, Server, Globe, Lock, CheckCircle2, Info, Database, Search } from 'lucide-react';

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
      web_hosting: true,
      mail_server: false,
      ai_chat: true,
    }
  });

  if (!isOpen) return null;

  const categories = [
    { id: 'web_hosting', name: 'استضافة الويب', icon: <Globe size={18} /> },
    { id: 'mail_server', name: 'البريد الإلكتروني', icon: <Mail size={18} /> },
    { id: 'ai_chat', name: 'الذكاء الاصطناعي', icon: <Brain size={18} /> },
  ];

  const handleToggle = (id: string) => {
    setFormData(prev => ({
      ...prev,
      services: { ...prev.services, [id]: !prev.services[id as keyof typeof prev.services] }
    }));
  };

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
                <h2 className="text-2xl font-black text-slate-900 font-tajawal">بروتوكول تجهيز مستأجر جديد</h2>
                <p className="text-[10px] text-yemenBlue font-bold uppercase tracking-[0.3em]">Operational Provisioning Module</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-800 transition-colors bg-slate-100 rounded-lg">
              <X size={20} />
            </button>
          </div>

          <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); onProvision(formData); }}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
               {/* Form fields */}
            </div>
            
            <div className="flex gap-4 pt-4">
              <button 
                type="submit"
                className="flex-1 bg-yemenBlue hover:bg-yemenBlue-hover text-white font-black py-4 rounded-xl text-xs uppercase tracking-[0.2em] transition-all shadow-md active:scale-95 flex items-center justify-center gap-3"
              >
                <Zap size={18} fill="currentColor" className="text-yemenGold" />
                تجهيز ونشر المكدس
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProvisioningModal;
