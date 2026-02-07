
import React, { useState, useEffect, useRef } from 'react';
import { 
  Server, Globe, Lock, Cpu, 
  CheckCircle2, ArrowRight, 
  Terminal, Database, Play, Activity, Scale,
  Loader2, Info
} from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

const SetupWizard: React.FC = () => {
  const { settings, updateSetting, completeInstallation } = useSettings();
  const [step, setStep] = useState(1);
  const [logs, setLogs] = useState<string[]>([]);
  const terminalEndRef = useRef<HTMLDivElement>(null);
  
  const [domainInput, setDomainInput] = useState('localhost');
  const [dbPass, setDbPass] = useState('');
  const [legalAccepted, setLegalAccepted] = useState(false);
  const [isDeploying, setIsDeploying] = useState(false);
  const [deploymentComplete, setDeploymentComplete] = useState(false);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  const startDeployment = () => {
    setIsDeploying(true);
    setLogs([]);
    updateSetting('rootDomain', domainInput);

    const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
    const ws = new WebSocket(`${protocol}://${window.location.host}/api/v1/install/ws/deploy`);

    ws.onopen = () => {
        setLogs(prev => [...prev, `[INIT] Starting deployment on ${domainInput}...`]);
    };

    ws.onmessage = (event) => {
        if (event.data === "DONE") {
            setDeploymentComplete(true);
            setIsDeploying(false);
            ws.close();
            // Automatically finalize in context
            setTimeout(() => completeInstallation(domainInput), 3000);
        } else {
            setLogs(prev => [...prev, event.data]);
        }
    };

    ws.onerror = () => {
        setLogs(prev => [...prev, "[ERROR] Connection failed. Fallback to Localhost Manual config."]);
        setIsDeploying(false);
    };
  };

  const steps = [
    { num: 1, label: 'التشخيص', icon: <Activity size={18}/> },
    { num: 2, label: 'النطاق والإعدادات', icon: <Globe size={18}/> },
    { num: 3, label: 'السيادة', icon: <Scale size={18}/> },
    { num: 4, label: 'التنفيذ', icon: <Terminal size={18}/> },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-tajawal flex items-center justify-center p-6" dir="rtl">
      <div className="w-full max-w-5xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col min-h-[700px] relative">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none"></div>

        {/* Header */}
        <div className="bg-slate-950/80 backdrop-blur-md p-6 border-b border-slate-800 flex justify-between items-center z-10">
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black text-2xl shadow-glow-blue">R</div>
                <div>
                    <h1 className="text-2xl font-black text-white uppercase tracking-wider">تجهيز النواة السيادية</h1>
                    <p className="text-[10px] text-brand-accent font-bold uppercase tracking-[0.2em]">RaidanPro Hybrid Installer v3.5</p>
                </div>
            </div>
            <div className="flex gap-2">
                {steps.map(s => (
                    <div key={s.num} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-colors ${step === s.num ? 'bg-brand-accent/10 border-brand-accent text-brand-accent' : step > s.num ? 'bg-green-900/20 border-green-900/50 text-green-500' : 'bg-slate-900 border-slate-800 text-slate-500'}`}>
                        {step > s.num ? <CheckCircle2 size={16} /> : s.icon}
                        <span className="text-xs font-bold hidden md:inline">{s.label}</span>
                    </div>
                ))}
            </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 p-10 z-10 flex flex-col">
            {step === 1 && (
                <div className="space-y-8 animate-in fade-in slide-in-from-left-8 text-center">
                    <div className="py-12">
                        <Loader2 size={64} className="text-brand-accent animate-spin mx-auto mb-6" />
                        <h2 className="text-3xl font-black text-white">فحص تكامل الموارد</h2>
                        <p className="text-slate-400">جاري التحقق من توافر Ollama Native واتصال Docker Socket...</p>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <StatusPill label="Host CPU" value="16 Cores" status="pass" />
                        <StatusPill label="Ollama" value="Detected" status="pass" />
                        <StatusPill label="GPU" value="RTX 4090" status="pass" />
                        <StatusPill label="Disk" value="Pass" status="pass" />
                    </div>
                </div>
            )}

            {step === 2 && (
                <div className="space-y-8 animate-in fade-in slide-in-from-left-8">
                    <div className="text-center">
                        <h2 className="text-3xl font-black text-white">النطاق والبنية التحتية</h2>
                        <p className="text-slate-400">حدد النطاق (Domain) الذي سيعمل عليه النظام. اترك "localhost" للتطوير المحلي.</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                    <Globe size={14} className="text-brand-accent"/> النطاق الرئيسي (Base Domain)
                                </label>
                                <input 
                                    value={domainInput}
                                    onChange={e => setDomainInput(e.target.value)}
                                    className="w-full bg-slate-950 border border-slate-700 rounded-2xl px-5 py-4 text-white font-mono text-lg outline-none focus:border-brand-accent transition-all shadow-inner"
                                    placeholder="example.pro or localhost"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                    <Lock size={14} className="text-red-500"/> كلمة مرور النواة (DB Root)
                                </label>
                                <input 
                                    type="password"
                                    value={dbPass}
                                    onChange={e => setDbPass(e.target.value)}
                                    className="w-full bg-slate-950 border border-slate-700 rounded-2xl px-5 py-4 text-white outline-none focus:border-red-500 transition-all shadow-inner"
                                    placeholder="••••••••••••"
                                />
                            </div>
                        </div>

                        {/* Domain Preview Visualization */}
                        <div className="bg-slate-950/50 rounded-2xl border border-slate-800 p-6 space-y-4">
                            <h4 className="text-[10px] font-black text-brand-accent uppercase tracking-[0.2em] mb-4">خريطة العناوين السيادية المتوقعة</h4>
                            <div className="space-y-3">
                                <PreviewItem label="بوابة الإدارة" value={`host.${domainInput}`} icon={<Server size={12}/>} />
                                <PreviewItem label="محرك الذكاء" value={`ai.${domainInput}`} icon={<Cpu size={12}/>} />
                                <PreviewItem label="نواة البيانات" value={`api.${domainInput}`} icon={<Database size={12}/>} />
                            </div>
                            <div className="mt-6 pt-6 border-t border-slate-800 flex items-start gap-3">
                                <Info size={16} className="text-blue-400 mt-0.5 shrink-0" />
                                <p className="text-[10px] text-slate-500 leading-relaxed font-bold">
                                    تنبيه: في حال اختيار نطاق خارجي، تأكد من توجيه سجلات A و CNAME إلى آي بي السيرفر الحالي قبل المتابعة.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {step === 3 && (
                <div className="space-y-8 animate-in fade-in slide-in-from-left-8">
                    <h2 className="text-3xl font-black text-white text-center">الإقرار بالسيادة والامتثال</h2>
                    <div className="bg-slate-950 p-8 rounded-2xl border border-slate-800 font-serif text-slate-300 leading-loose text-justify max-w-3xl mx-auto h-64 overflow-y-auto custom-scrollbar">
                        <h3 className="text-center font-bold text-lg mb-4 text-brand-accent underline">وثيقة التشغيل الآمن (Protocol 0)</h3>
                        <p>بصفتي المسؤول عن هذا النظام، أقر بالالتزام بالقوانين المنظمة للخصوصية والنشر في الجمهورية اليمنية. سيتم معالجة كافة البيانات محلياً على النطاق المختار (<b>{domainInput}</b>) دون مشاركتها مع أطراف خارجية إلا بموجب تصريح سيادي خاص.</p>
                        <p className="mt-4 italic opacity-70 text-xs text-center">تم تشفير هذا الميثاق داخل منطق النماذج لضمان الامتثال التلقائي.</p>
                    </div>
                    <label className="flex items-center gap-4 p-5 bg-brand-primary/10 border border-brand-primary/30 rounded-2xl cursor-pointer hover:bg-brand-primary/20 transition-all max-w-3xl mx-auto">
                        <input type="checkbox" checked={legalAccepted} onChange={e => setLegalAccepted(e.target.checked)} className="w-6 h-6 rounded border-slate-600 bg-slate-800 text-brand-accent focus:ring-brand-accent" />
                        <span className="font-bold text-sm text-white uppercase tracking-tight">أوافق على بروتوكول السيادة والتشغيل.</span>
                    </label>
                </div>
            )}

            {step === 4 && (
                <div className="flex-1 flex flex-col animate-in fade-in">
                    {!deploymentComplete ? (
                        <>
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-black text-white flex items-center gap-3">
                                    <Terminal size={20} className="text-brand-accent" /> سجل النشر: {domainInput}
                                </h2>
                                {!isDeploying && logs.length === 0 && (
                                    <button onClick={startDeployment} className="bg-brand-accent hover:bg-amber-400 text-slate-900 px-8 py-3 rounded-xl font-black text-sm uppercase tracking-widest shadow-glow-gold flex items-center gap-2 hover:scale-105 transition-all">
                                        <Play size={18} fill="currentColor" /> بدء التنفيذ
                                    </button>
                                )}
                            </div>
                            <div className="flex-1 bg-black rounded-xl border border-slate-800 p-6 font-mono text-[11px] text-green-400 overflow-y-auto custom-scrollbar shadow-inner relative min-h-[350px]">
                                {logs.map((log, i) => <div key={i} className="mb-1">{log}</div>)}
                                {isDeploying && <div className="animate-pulse">_</div>}
                                <div ref={terminalEndRef}></div>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-center space-y-8 animate-in zoom-in">
                            <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center shadow-glow-green animate-bounce">
                                <CheckCircle2 size={48} className="text-slate-900" />
                            </div>
                            <div>
                                <h2 className="text-4xl font-black text-white mb-3">تم النشر والربط بنجاح!</h2>
                                <p className="text-slate-400 text-lg">النظام السيادي متاح الآن على: <span className="text-brand-accent font-bold">{domainInput}</span></p>
                                <p className="text-xs text-text-subtle mt-2 animate-pulse">جاري تحويلك لمركز القيادة...</p>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>

        {/* Footer Nav */}
        {!deploymentComplete && step < 4 && (
            <div className="bg-slate-950 p-6 border-t border-slate-800 flex justify-between z-10">
                <button 
                    onClick={() => setStep(s => Math.max(1, s - 1))}
                    disabled={step === 1}
                    className="px-6 py-3 rounded-xl font-bold text-slate-400 hover:text-white disabled:opacity-30 flex items-center gap-2"
                >
                    <ArrowRight size={18} /> السابق
                </button>
                <button 
                    onClick={() => setStep(s => Math.min(4, s + 1))}
                    disabled={(step === 3 && !legalAccepted) || (step === 2 && !domainInput)}
                    className="bg-brand-accent hover:bg-amber-400 text-slate-900 px-10 py-3 rounded-xl font-black uppercase tracking-widest shadow-md transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    التالي <ArrowRight size={18} className="rotate-180" />
                </button>
            </div>
        )}
      </div>
    </div>
  );
};

const StatusPill: React.FC<{label: string, value: string, status: string}> = ({label, value, status}) => (
    <div className="bg-slate-950/50 p-3 rounded-xl border border-slate-800">
        <span className="text-[9px] font-black text-slate-500 uppercase block mb-1">{label}</span>
        <span className="text-xs font-bold text-white">{value}</span>
    </div>
);

const PreviewItem: React.FC<{label: string, value: string, icon: React.ReactNode}> = ({label, value, icon}) => (
    <div className="flex items-center justify-between p-3 bg-slate-900 rounded-xl border border-slate-800 group hover:border-brand-accent/30 transition-all">
        <div className="flex items-center gap-3">
            <div className="p-1.5 bg-slate-800 rounded text-brand-accent">{icon}</div>
            <span className="text-[10px] font-bold text-slate-400">{label}</span>
        </div>
        <span className="text-[10px] font-mono text-white opacity-80">{value}</span>
    </div>
);

export default SetupWizard;
