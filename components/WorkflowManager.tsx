
import React, { useState } from 'react';
import { Play, ArrowRight, Database, Globe, Shield, Zap, CheckCircle2, AlertCircle } from 'lucide-react';

const WorkflowManager: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    { name: 'Huginn Scan', desc: 'جلب البيانات من المواقع الحكومية اليمنية', status: 'idle' },
    { name: 'Translation', desc: 'ترجمة المحتوى عبر LibreTranslate محلياً', status: 'idle' },
    { name: 'Forensics', desc: 'فحص ميتاداتا الملفات عبر ExifTool', status: 'idle' },
    { name: 'Vault Ingest', desc: 'أرشفة البيانات في Aleph Central', status: 'idle' }
  ];

  const triggerPipeline = () => {
    setIsRunning(true);
    setCurrentStep(1);
    
    // Simulate pipeline flow
    let step = 1;
    const interval = setInterval(() => {
      step++;
      setCurrentStep(step);
      if (step > 4) {
        clearInterval(interval);
        setTimeout(() => {
          setIsRunning(false);
          setCurrentStep(0);
        }, 2000);
      }
    }, 1500);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-xl font-bold text-yemenBlue flex items-center gap-2">
            <Zap className="text-yemenGold" />
            YemenJPT Intelligence Pipeline
          </h2>
          <p className="text-gray-500 text-sm">أتمتة تدفق البيانات السيادية بين الأدوات المختلفة.</p>
        </div>
        <button 
          onClick={triggerPipeline}
          disabled={isRunning}
          className={`px-6 py-2.5 rounded-lg font-bold flex items-center gap-2 transition-all ${
            isRunning ? 'bg-gray-100 text-gray-400' : 'bg-yemenGold text-yemenBlue-dark hover:scale-105'
          }`}
        >
          {isRunning ? <Zap size={18} className="animate-spin" /> : <Play size={18} fill="currentColor" />}
          {isRunning ? 'جاري التنفيذ...' : 'تشغيل Pipeline'}
        </button>
      </div>

      <div className="relative">
        {/* Connection Line */}
        <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-100 -translate-y-1/2 hidden md:block"></div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10">
          {steps.map((s, i) => (
            <div key={i} className="flex flex-col items-center text-center group">
              <div className={`w-14 h-14 rounded-full flex items-center justify-center border-4 transition-all duration-500 ${
                currentStep > i + 1 ? 'bg-green-500 border-green-200 text-white' :
                currentStep === i + 1 ? 'bg-yemenBlue border-blue-200 text-white scale-110 shadow-lg' :
                'bg-white border-gray-100 text-gray-400'
              }`}>
                {currentStep > i + 1 ? <CheckCircle2 size={24} /> : <span>{i + 1}</span>}
              </div>
              <h4 className={`mt-4 font-bold text-sm ${currentStep === i + 1 ? 'text-yemenBlue' : 'text-gray-900'}`}>{s.name}</h4>
              <p className="text-[10px] text-gray-500 mt-1 px-2">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-10 p-4 bg-gray-50 rounded-lg border border-dashed border-gray-200">
        <div className="flex items-start gap-3">
          <Shield size={20} className="text-yemenBlue mt-1" />
          <div>
            <h5 className="text-xs font-bold text-gray-700 mb-1">منطق الأتمتة (Sovereign Logic):</h5>
            <code className="text-[10px] font-mono text-blue-800 bg-blue-50 p-2 block rounded">
              {`IF event(Huginn.new_entry) {
  DATA = LibreTranslate.process(entry.content, 'ar', 'en');
  METADATA = ExifTool.sanitize(entry.attachments);
  Aleph.ingest({ content: DATA, files: METADATA, collection: 'Yemen_Gov_Watch' });
  Notify(Dashboard, 'تمت أرشفة وثيقة جديدة بنجاح');
}`}
            </code>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkflowManager;
