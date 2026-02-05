
import React, { useState } from 'react';
import { Play, ArrowRight, Database, Globe, Shield, Zap, CheckCircle2, AlertCircle, Fingerprint, Activity, Map, Share2, Search } from 'lucide-react';

const WorkflowManager: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    { name: 'TorchGeo Analysis', desc: 'تحليل صور الأقمار الصناعية لكشف الدمار أو التغيرات', icon: <Search size={24} /> },
    { name: 'DeepSafe Verify', desc: 'التحقق الآلي من الفيديوهات المرتبطة وكشف التزييف', icon: <Shield size={24} /> },
    { name: 'RAGFlow Ingest', desc: 'فهرسة التقارير واستخراج الكيانات والجداول بدقة AI', icon: <Database size={24} /> },
    { name: 'Neo4j Graphing', desc: 'رسم علاقات الفساد والارتباطات بين الكيانات المكتشفة', icon: <Share2 size={24} /> }
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
            خط الاستخبارات الهجين (Hybrid Intel Pipeline)
          </h2>
          <p className="text-gray-500 text-sm">أتمتة الربط بين الرصد الفضائي، التحقق الجنائي، وتحليل العلاقات.</p>
        </div>
        <button 
          onClick={triggerPipeline}
          disabled={isRunning}
          className={`px-6 py-2.5 rounded-lg font-bold flex items-center gap-2 transition-all ${
            isRunning ? 'bg-gray-100 text-gray-400' : 'bg-yemenGold text-yemenBlue-dark hover:scale-105 shadow-md'
          }`}
        >
          {isRunning ? <Zap size={18} className="animate-spin" /> : <Play size={18} fill="currentColor" />}
          {isRunning ? 'جاري التحليل الهجين...' : 'تشغيل خط الاستخبارات'}
        </button>
      </div>

      <div className="relative">
        {/* Connection Line */}
        <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-100 -translate-y-1/2 hidden md:block"></div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10">
          {steps.map((s, i) => (
            <div key={i} className="flex flex-col items-center text-center group">
              <div className={`w-14 h-14 rounded-full flex items-center justify-center border-4 transition-all duration-500 ${
                currentStep > i + 1 ? 'bg-green-500 border-green-200 text-white shadow-lg' :
                currentStep === i + 1 ? 'bg-yemenBlue border-blue-200 text-white scale-110 shadow-xl' :
                'bg-white border-gray-100 text-gray-400'
              }`}>
                {currentStep > i + 1 ? <CheckCircle2 size={24} /> : s.icon}
              </div>
              <h4 className={`mt-4 font-bold text-sm ${currentStep === i + 1 ? 'text-yemenBlue' : 'text-gray-900'}`}>{s.name}</h4>
              <p className="text-[10px] text-gray-500 mt-1 px-2 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-10 p-4 bg-yemenBlue-dark rounded-xl border border-yemenGold/30">
        <div className="flex items-start gap-3">
          <Fingerprint size={20} className="text-yemenGold mt-1" />
          <div className="w-full">
            <h5 className="text-xs font-bold text-yemenGold mb-1 uppercase tracking-widest">منطق الأتمتة الهجين (Hybrid Intel Logic):</h5>
            <code className="text-[10px] font-mono text-blue-100 bg-black/40 p-3 block rounded-lg leading-relaxed text-left" dir="ltr">
              {`ON Sentinel_Trigger(area="YEMEN_WEST") {
  Worker_TorchGeo.analyze_pixels(sensor="B8", sensitivity=0.8);
  IF detection.destruction_prob > 0.75 {
    deepsafe.verify_recent_media(geotag="YEMEN_WEST");
    n8n.ingest_to_ragflow(source="Forensic_Batch");
    neo4j.link_entities(context="Infrastructure_Damage");
    Strapi.draft_report(title="Alert: Conflict Anomaly Detected");
  }
}`}
            </code>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkflowManager;
