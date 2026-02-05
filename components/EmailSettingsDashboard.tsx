
import React from 'react';
import { Mail, CheckCircle2, ShieldCheck, Server, Copy, ArrowRight, ExternalLink, AlertTriangle, Key } from 'lucide-react';

interface EmailSettingsDashboardProps {
  emailConfig: {
    inbound_address: string[];
    forward_to: string;
    smtp_server: string;
    smtp_user: string;
    smtp_port: number;
    dns_status: 'verified' | 'pending' | 'failed';
  };
}

const EmailSettingsDashboard: React.FC<EmailSettingsDashboardProps> = ({ emailConfig }) => {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('تم النسخ إلى الحافظة');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl border border-blue-100">
            <Mail size={24} />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900 font-tajawal">إعدادات البريد الاحترافي</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs text-slate-500 font-bold">حالة النظام:</span>
              {emailConfig.dns_status === 'verified' ? (
                <span className="flex items-center gap-1 text-[10px] bg-green-50 text-green-600 px-2 py-0.5 rounded-full border border-green-200 font-black uppercase">
                  <CheckCircle2 size={10} /> Verified & Active
                </span>
              ) : (
                <span className="flex items-center gap-1 text-[10px] bg-amber-50 text-amber-600 px-2 py-0.5 rounded-full border border-amber-200 font-black uppercase">
                  <AlertTriangle size={10} /> DNS Pending
                </span>
              )}
            </div>
          </div>
        </div>
        <button className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1">
          فتح الويب ميل <ExternalLink size={12} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Inbound Routing */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3 mb-2">
            <ArrowRight size={18} className="text-green-500" />
            <h3 className="font-bold text-slate-900">الاستقبال (Inbound Routing)</h3>
          </div>
          <div className="space-y-3">
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex justify-between items-center">
              <div>
                <span className="text-[10px] text-slate-400 font-black uppercase block">العناوين النشطة</span>
                <div className="flex flex-col gap-1 mt-1">
                  {emailConfig.inbound_address.map(addr => (
                    <span key={addr} className="font-mono text-sm font-bold text-slate-700">{addr}</span>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex justify-center">
                <ArrowRight size={16} className="text-slate-300 rotate-90 my-1" />
            </div>
            <div className="bg-green-50 p-3 rounded-xl border border-green-100 flex items-center gap-3">
               <div className="p-2 bg-white rounded-full text-green-500 shadow-sm"><Mail size={16}/></div>
               <div>
                 <span className="text-[10px] text-green-700 font-black uppercase block">يتم التوجيه إلى</span>
                 <span className="font-mono text-xs font-bold text-slate-700">{emailConfig.forward_to}</span>
               </div>
            </div>
          </div>
        </div>

        {/* Outbound SMTP */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3 mb-2">
            <Server size={18} className="text-yemenBlue" />
            <h3 className="font-bold text-slate-900">الإرسال (SMTP Configuration)</h3>
          </div>
          <div className="space-y-3">
             <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                   <span className="text-[9px] text-slate-400 font-black uppercase block">Server Host</span>
                   <div className="flex items-center justify-between mt-1">
                      <span className="font-mono text-xs text-slate-800">{emailConfig.smtp_server}</span>
                      <button onClick={() => copyToClipboard(emailConfig.smtp_server)} className="text-slate-400 hover:text-blue-500"><Copy size={12}/></button>
                   </div>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                   <span className="text-[9px] text-slate-400 font-black uppercase block">Port (TLS)</span>
                   <span className="font-mono text-xs text-slate-800 font-bold block mt-1">{emailConfig.smtp_port}</span>
                </div>
             </div>
             
             <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                <span className="text-[9px] text-slate-400 font-black uppercase block">Username</span>
                <div className="flex items-center justify-between mt-1">
                   <span className="font-mono text-xs text-slate-800">{emailConfig.smtp_user}</span>
                   <button onClick={() => copyToClipboard(emailConfig.smtp_user)} className="text-slate-400 hover:text-blue-500"><Copy size={12}/></button>
                </div>
             </div>

             <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 flex justify-between items-center">
                <div>
                   <span className="text-[9px] text-slate-400 font-black uppercase block">Password</span>
                   <span className="font-mono text-xs text-slate-800">****************</span>
                </div>
                <button className="text-xs text-blue-500 font-bold hover:underline flex items-center gap-1">
                   <Key size={12} /> إظهار
                </button>
             </div>
          </div>
        </div>
      </div>

      {/* Security Status */}
      <div className="bg-slate-900 text-white p-4 rounded-xl flex items-center justify-between shadow-lg">
         <div className="flex items-center gap-4">
            <ShieldCheck size={24} className="text-green-400" />
            <div>
               <h4 className="font-bold text-sm">التوثيق الأمني (Sender Authentication)</h4>
               <p className="text-[10px] text-slate-400">نظامك محمي ضد الانتحال (Spoofing) لضمان وصول الرسائل للـ Inbox.</p>
            </div>
         </div>
         <div className="flex gap-2">
            <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-[9px] font-mono font-bold border border-green-500/30">SPF: PASS</span>
            <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-[9px] font-mono font-bold border border-green-500/30">DKIM: PASS</span>
            <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-[9px] font-mono font-bold border border-green-500/30">DMARC: QUARANTINE</span>
         </div>
      </div>
    </div>
  );
};

export default EmailSettingsDashboard;
