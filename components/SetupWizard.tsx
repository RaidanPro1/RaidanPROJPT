
import React, { useState, useEffect, useRef } from 'react';
import { 
  Server, ShieldCheck, Cloud, Globe, Lock, Cpu, 
  CheckCircle2, AlertTriangle, ArrowRight, 
  Terminal, Database, Play, Key, Activity, Scale,
  RefreshCcw, XCircle, Loader2
} from 'lucide-react';

const SetupWizard: React.FC = () => {
  const [step, setStep] = useState(1);
  const [logs, setLogs] = useState<string[]>([]);
  const terminalEndRef = useRef<HTMLDivElement>(null);
  
  const [config, setConfig] = useState({ systemName: 'RaidanPro', domain: 'raidan.pro', dbPass: '' });
  const [legalAccepted, setLegalAccepted] = useState(false);
  const [isDeploying, setIsDeploying] = useState(false);
  const [deploymentComplete, setDeploymentComplete] = useState(false);
  const [deployError, setDeployError] = useState<string | null>(null);

  // Diagnostics State
  const [diagnosticState, setDiagnosticState] = useState<{
    status: 'idle' | 'running' | 'success' | 'error';
    data: any;
    error?: string;
  }>({ status: 'idle', data: null });

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  // Run Diagnostics on Step 1 load
  useEffect(() => {
    if (step === 1) {
        runDiagnostics();
    }
  }, [step]);

  const runDiagnostics = async () => {
    setDiagnosticState(prev => ({ ...prev, status: 'running', error: undefined }));
    try {
        // Mocking API call latency for UX
        await new Promise(resolve => setTimeout(resolve, 800));

        // In a real scenario, fetch from /api/v1/install/diagnostics
        // const res = await fetch('/api/v1/install/diagnostics');
        
        // Mock response for frontend demo robustness test
        // Randomly fail for demonstration if not connected to real backend
        const isConnected = true; // Assume connected for now, can be toggleable
        
        if (!isConnected) {
             throw new Error("Connection timed out. Backend unreachable.");
        }

        // Simulating backend response structure
        const data = {
            os_version: "Debian 13 (Trixie)",
            ram_status: "pass",
            disk_status: "pass",
            internet: "connected",
            docker_socket: "connected",
            ollama_native: "detected"
        };
        
        // Validation Logic
        const hasFailures = 
            data.ram_status !== 'pass' || 
            data.disk_status !== 'pass' || 
            data.docker_socket !== 'connected';

        setDiagnosticState({
            status: hasFailures ? 'error' : 'success',
            data: data,
            error: hasFailures ? 'System requirements not met. Please upgrade hardware.' : undefined
        });

    } catch (e: any) {
        setDiagnosticState({
            status: 'error',
            data: null,
            error: e.message || 'Critical failure during system diagnostics.'
        });
    }
  };

  const startDeployment = () => {
    setIsDeploying(true);
    setDeployError(null);
    setLogs([]); // Clear previous logs on retry

    try {
        const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
        // Check if we are in a browser environment that can connect
        const wsUrl = `${protocol}://${window.location.host}/api/v1/install/ws/deploy`;
        
        // For demo purposes, we might default to a simulated stream if WS fails immediately
        // But the requirement is robust error handling for connection tests.
        
        const ws = new WebSocket(wsUrl);

        ws.onopen = () => {
            setLogs(prev => [...prev, "[INIT] WebSocket Connection Established."]);
        };

        ws.onmessage = (event) => {
            const message = event.data;
            if (message === "DONE") {
                setDeploymentComplete(true);
                setIsDeploying(false);
                ws.close();
            } else {
                setLogs(prev => [...prev, message]);
            }
        };

        ws.onerror = (e) => {
            setDeployError("Connection interrupted. WebSocket stream failed.");
            setLogs(prev => [...prev, "[CRITICAL] Connection lost to installer agent."]);
            setIsDeploying(false);
        };

        ws.onclose = () => {
            if (!deploymentComplete && !deployError) {
                 // If closed unexpectedly
            }
        };

    } catch (e: any) {
        setDeployError(`Deployment Initiation Failed: ${e.message}`);
        setIsDeploying(false);
    }
  };

  const steps = [
    { num: 1, label: 'التشخيص', icon: <Activity size={18}/> },
    { num: 2, label: 'الإعدادات', icon: <Server size={18}/> },
    { num: 3, label: 'السيادة', icon: <Scale size={18}/> },
    { num: 4, label: 'التنفيذ', icon: <Terminal size={18}/> },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-tajawal flex items-center justify-center p-6" dir="rtl">
      <div className="w-full max-w-5xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col min-h-[650px] relative">
        
        {/* Background Grid */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none"></div>

        {/* Header */}
        <div className="bg-slate-950/80 backdrop-blur-md p-6 border-b border-slate-800 flex justify-between items-center z-10">
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-yemenBlue rounded-xl flex items-center justify-center text-white font-black text-2xl shadow-glow-blue">R</div>
                <div>
                    <h1 className="text-2xl font-black text-white uppercase tracking-wider">معالج التثبيت الهجين</h1>
                    <p className="text-[10px] text-yemenGold font-bold uppercase tracking-[0.2em]">RaidanPro Hybrid Installer v3.0</p>
                </div>
            </div>
            <div className="flex gap-2">
                {steps.map(s => (
                    <div key={s.num} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-colors ${step === s.num ? 'bg-yemenGold/10 border-yemenGold text-yemenGold' : step > s.num ? 'bg-green-900/20 border-green-900/50 text-green-500' : 'bg-slate-900 border-slate-800 text-slate-500'}`}>
                        {step > s.num ? <CheckCircle2 size={16} /> : s.icon}
                        <span className="text-xs font-bold hidden md:inline">{s.label}</span>
                    </div>
                ))}
            </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 p-10 z-10">
            
            {/* Step 1: System Check */}
            {step === 1 && (
                <div className="space-y-8 animate-in fade-in slide-in-from-left-8">
                    <div className="text-center space-y-2">
                        <h2 className="text-3xl font-black text-white">فحص سلامة البيئة (Environment Integrity)</h2>
                        <p className="text-slate-400">جاري التحقق من موارد السيرفر وقابلية التثبيت الهجين.</p>
                    </div>

                    {diagnosticState.status === 'running' ? (
                        <div className="flex flex-col items-center justify-center py-12 space-y-4">
                            <Loader2 size={48} className="text-yemenGold animate-spin" />
                            <p className="text-slate-400 text-sm font-mono animate-pulse">Running diagnostics...</p>
                        </div>
                    ) : diagnosticState.status === 'error' ? (
                        <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-8 text-center space-y-4 animate-in zoom-in-95">
                            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto text-red-500">
                                <XCircle size={32} />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white mb-2">فشل الفحص الأولي</h3>
                                <p className="text-red-300 max-w-lg mx-auto">{diagnosticState.error}</p>
                            </div>
                            <button 
                                onClick={runDiagnostics}
                                className="bg-red-600 hover:bg-red-500 text-white px-6 py-2 rounded-xl font-bold text-sm transition-all flex items-center gap-2 mx-auto shadow-lg"
                            >
                                <RefreshCcw size={16} /> إعادة المحاولة
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <StatusCard 
                                label="نظام التشغيل" 
                                value={diagnosticState.data?.os_version || "Unknown"} 
                                status={diagnosticState.data ? 'pass' : 'fail'} 
                            />
                            <StatusCard 
                                label="الذاكرة العشوائية" 
                                value={diagnosticState.data?.ram_status === 'pass' ? "Sufficient" : "Insufficient"} 
                                status={diagnosticState.data?.ram_status || 'fail'} 
                                sub="Required: >16GB" 
                            />
                            <StatusCard 
                                label="المحرك المحلي" 
                                value={diagnosticState.data?.ollama_native === 'detected' ? "Detected" : "Missing"} 
                                status={diagnosticState.data?.ollama_native === 'detected' ? 'pass' : 'warning'} 
                                sub="Ollama Service" 
                            />
                            <StatusCard 
                                label="Docker Socket" 
                                value={diagnosticState.data?.docker_socket === 'connected' ? "Connected" : "Disconnected"} 
                                status={diagnosticState.data?.docker_socket === 'connected' ? 'pass' : 'fail'} 
                            />
                            <StatusCard 
                                label="اتصال الإنترنت" 
                                value={diagnosticState.data?.internet === 'connected' ? "Online" : "Offline"} 
                                status={diagnosticState.data?.internet === 'connected' ? 'pass' : 'warning'} 
                            />
                            <StatusCard 
                                label="التخزين" 
                                value={diagnosticState.data?.disk_status === 'pass' ? "OK" : "Low Space"} 
                                status={diagnosticState.data?.disk_status || 'fail'} 
                            />
                        </div>
                    )}
                </div>
            )}

            {/* Step 2: Config */}
            {step === 2 && (
                <div className="space-y-8 animate-in fade-in slide-in-from-left-8">
                    <h2 className="text-3xl font-black text-white text-center">إعدادات النواة (Core Configuration)</h2>
                    <div className="bg-slate-950 p-8 rounded-2xl border border-slate-800 grid grid-cols-2 gap-8">
                        <InputGroup label="اسم المنصة" value={config.systemName} onChange={v => setConfig({...config, systemName: v})} />
                        <InputGroup label="نطاق النظام (System Host)" value="host.raidan.pro" onChange={() => {}} disabled />
                        <InputGroup label="نطاق الذكاء (AI Host)" value="ai.raidan.pro" onChange={() => {}} disabled />
                        <InputGroup label="كلمة مرور قاعدة البيانات" value={config.dbPass} type="password" onChange={v => setConfig({...config, dbPass: v})} />
                    </div>
                    <div className="flex gap-4 p-4 bg-blue-900/20 border border-blue-500/30 rounded-xl">
                        <Cloud className="text-blue-400" />
                        <div className="text-xs text-blue-200">
                            <strong>ملاحظة هامة:</strong> سيتم استخدام النطاق الرئيسي <code>raidan.pro</code> لاحقاً للموقع التعريفي. حالياً سيتم تثبيت الخدمات على النطاقات الفرعية فقط.
                        </div>
                    </div>
                </div>
            )}

            {/* Step 3: Legal */}
            {step === 3 && (
                <div className="space-y-8 animate-in fade-in slide-in-from-left-8">
                    <h2 className="text-3xl font-black text-white text-center">التحصين القانوني (Sovereign Legal Injection)</h2>
                    <div className="bg-slate-950 p-6 rounded-xl border border-slate-800 h-64 overflow-y-auto custom-scrollbar font-serif leading-loose text-justify px-8 relative">
                        <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-r from-yemenGold via-transparent to-transparent"></div>
                        <h3 className="text-center font-bold text-lg mb-4 text-yemenGold">ميثاق التشغيل وفق القانون اليمني</h3>
                        <p className="mb-4 text-slate-300">
                            استناداً إلى قانون الصحافة والمطبوعات لعام 1990 وقانون الجرائم والعقوبات لعام 1994، يلتزم مشغل هذا النظام بما يلي:
                        </p>
                        <ul className="list-disc space-y-2 pr-4 text-slate-400">
                            <li>عدم استخدام تقنيات الذكاء الاصطناعي لإنتاج محتوى يمس بالثوابت الوطنية أو يثير النعرات.</li>
                            <li>احترام الخصوصية الرقمية للمواطنين وعدم تسريب البيانات (المادة 255).</li>
                            <li>تخضع جميع البيانات لقوانين الجمهورية اليمنية وتخزن محلياً.</li>
                        </ul>
                    </div>
                    <label className="flex items-center gap-4 p-5 bg-yemenBlue/10 border border-yemenBlue/30 rounded-2xl cursor-pointer hover:bg-yemenBlue/20 transition-all">
                        <input type="checkbox" checked={legalAccepted} onChange={e => setLegalAccepted(e.target.checked)} className="w-6 h-6 rounded border-slate-600 bg-slate-800 text-yemenGold focus:ring-yemenGold" />
                        <span className="font-bold text-sm text-white">أقر أنا (كبير مهندسي النظام) بالالتزام الكامل بهذه الضوابط وتحمل المسؤولية القانونية.</span>
                    </label>
                </div>
            )}

            {/* Step 4: Install */}
            {step === 4 && (
                <div className="h-full flex flex-col animate-in fade-in slide-in-from-left-8">
                    {!deploymentComplete ? (
                        <>
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-black text-white flex items-center gap-3">
                                    <Terminal size={24} className="text-yemenGold" />
                                    سجل التنفيذ الحي (Live Deployment Stream)
                                </h2>
                                
                                <div className="flex gap-3">
                                    {deployError && (
                                        <button onClick={startDeployment} className="bg-red-600 hover:bg-red-500 text-white px-6 py-2 rounded-xl font-bold text-xs uppercase tracking-widest shadow-md flex items-center gap-2 transition-all">
                                            <RefreshCcw size={14} /> إعادة المحاولة
                                        </button>
                                    )}
                                    {!isDeploying && logs.length === 0 && (
                                        <button onClick={startDeployment} className="bg-yemenGold hover:bg-amber-400 text-slate-900 px-8 py-3 rounded-xl font-black text-sm uppercase tracking-widest shadow-glow-gold flex items-center gap-2 hover:scale-105 transition-all">
                                            <Play size={18} fill="currentColor" /> بدء التنفيذ
                                        </button>
                                    )}
                                </div>
                            </div>
                            
                            {deployError && (
                                <div className="mb-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-400 text-xs font-bold">
                                    <AlertTriangle size={16} />
                                    {deployError}
                                </div>
                            )}

                            <div className="flex-1 bg-black rounded-xl border border-slate-800 p-6 font-mono text-xs text-green-400 overflow-y-auto custom-scrollbar shadow-inner relative min-h-[400px]">
                                {logs.length === 0 && !isDeploying && !deployError && (
                                    <div className="absolute inset-0 flex items-center justify-center text-slate-700 pointer-events-none">
                                        <div className="text-center">
                                            <Terminal size={48} className="mx-auto mb-2 opacity-20" />
                                            <p>Waiting to initiate sequence...</p>
                                        </div>
                                    </div>
                                )}
                                {logs.map((log, i) => (
                                    <div key={i} className={`mb-1 break-all ${log.includes('[ERROR]') || log.includes('[CRITICAL]') ? 'text-red-500' : log.includes('[INIT]') ? 'text-blue-400' : ''}`}>{log}</div>
                                ))}
                                {isDeploying && (
                                    <div className="flex gap-1 mt-2">
                                        <span className="w-1.5 h-3 bg-green-500 animate-pulse"></span>
                                    </div>
                                )}
                                <div ref={terminalEndRef}></div>
                            </div>
                        </>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-center space-y-8 py-10 animate-in zoom-in duration-500">
                            <div className="w-28 h-28 bg-green-500 rounded-full flex items-center justify-center shadow-glow-green animate-bounce">
                                <CheckCircle2 size={56} className="text-slate-900" />
                            </div>
                            <div>
                                <h2 className="text-4xl font-black text-white mb-3">تم التجهيز بنجاح!</h2>
                                <p className="text-slate-400 text-lg">النظام السيادي يعمل الآن بكامل طاقته الهجينة.</p>
                            </div>
                            <div className="flex gap-6">
                                <a href={`https://host.${config.domain}`} className="bg-slate-800 hover:bg-slate-700 text-white px-8 py-4 rounded-xl font-bold uppercase tracking-widest transition-all border border-slate-700">
                                    لوحة تحكم النظام
                                </a>
                                <a href={`https://ai.${config.domain}`} className="bg-yemenBlue hover:bg-blue-600 text-white px-8 py-4 rounded-xl font-bold uppercase tracking-widest shadow-glow-blue transition-all">
                                    الذهاب للدردشة (AI)
                                </a>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>

        {/* Footer Navigation */}
        {step < 4 && (
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
                    disabled={(step === 3 && !legalAccepted) || (step === 1 && diagnosticState.status !== 'success')}
                    className="bg-yemenGold hover:bg-amber-400 text-slate-900 px-8 py-3 rounded-xl font-black uppercase tracking-widest shadow-md transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    التالي <ArrowRight size={18} className="rotate-180" />
                </button>
            </div>
        )}
      </div>
    </div>
  );
};

const StatusCard: React.FC<{label: string, value: string, status: 'pass' | 'fail' | 'warning' | 'loading', sub?: string}> = ({label, value, status, sub}) => (
    <div className={`p-4 rounded-xl border flex flex-col gap-2 transition-all ${
        status === 'pass' ? 'bg-green-900/10 border-green-500/30' : 
        status === 'fail' ? 'bg-red-900/10 border-red-500/30' : 
        status === 'warning' ? 'bg-amber-900/10 border-amber-500/30' :
        'bg-slate-800 border-slate-700'
    }`}>
        <div className="flex items-center justify-between">
            <span className="text-slate-400 text-xs font-bold">{label}</span>
            {status === 'pass' && <CheckCircle2 size={16} className="text-green-500" />}
            {status === 'fail' && <XCircle size={16} className="text-red-500" />}
            {status === 'warning' && <AlertTriangle size={16} className="text-amber-500" />}
            {status === 'loading' && <Loader2 size={16} className="text-slate-500 animate-spin" />}
        </div>
        <div className="text-lg font-black text-white">{value}</div>
        {sub && <div className={`text-[10px] uppercase font-bold tracking-wider ${
            status === 'pass' ? 'text-green-600' :
            status === 'fail' ? 'text-red-600' :
            status === 'warning' ? 'text-amber-600' : 'text-slate-500'
        }`}>{sub}</div>}
    </div>
);

const InputGroup: React.FC<{label: string, value: string, onChange: (v: string) => void, type?: string, disabled?: boolean}> = ({label, value, onChange, type = "text", disabled = false}) => (
    <div className="space-y-2">
        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">{label}</label>
        <input 
            type={type}
            value={value}
            disabled={disabled}
            onChange={e => onChange(e.target.value)}
            className={`w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:border-yemenGold transition-all font-mono ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        />
    </div>
);

export default SetupWizard;
