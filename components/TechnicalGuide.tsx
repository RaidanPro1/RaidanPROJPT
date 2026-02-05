
import React from 'react';
import { Terminal, Cpu, BookOpen, Code2, ShieldCheck, Zap, Layers, FileText, CheckCircle2, Volume2, Filter, Users } from 'lucide-react';

const TechnicalGuide: React.FC = () => {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 font-tajawal text-slate-900">
      {/* Header Section */}
      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-yemenBlue/5 rounded-full -mr-32 -mt-32"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-yemenBlue text-white p-3 rounded-xl shadow-md">
              <BookOpen size={28} />
            </div>
            <h2 className="text-3xl font-black text-slate-900">[إدارة وحدة الصوت: Faster-Whisper XXL + VR Arch]</h2>
          </div>
          <p className="text-slate-600 max-w-4xl leading-relaxed">
            الدليل الفني لتثبيت مكدس الصوت الاستخباراتي المتقدم. تم تصميم هذا الإعداد ليعمل بالكامل على **المعالج المركزي (CPU Only)** مع تفعيل عزل الصوت المتقدم لضمان الخصوصية القصوى في البيئات الميدانية.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Step 1: Vocal Isolation */}
          <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-3 mb-4 border-b border-slate-100 pb-3">
              <Filter className="text-purple-600" />
              <h3 className="text-xl font-bold text-slate-900">1. عزل الصوت (UVR VR-Architecture)</h3>
            </div>
            <div className="space-y-4">
              <p className="text-sm text-slate-600">تنقية التسجيل من الضجيج والموسيقى باستخدام خوارزميات عزل الترددات:</p>
              <div className="bg-slate-900 rounded-xl p-4 font-mono text-xs text-blue-300 space-y-2 text-left" dir="ltr">
                <p className="text-slate-500"># Install UVR CLI Bridge</p>
                <p>pip install audio-separator[cpu]</p>
                <p className="text-slate-500 mt-2"># Run Isolation using VR Arch Model</p>
                <p>audio-separator input.wav --model_filename UVR-MDX-NET-Voc_FT.onnx --output_dir ./isolated</p>
              </div>
            </div>
          </section>

          {/* Step 2: Faster-Whisper XXL CPU */}
          <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-3 mb-4 border-b border-slate-100 pb-3">
              <Cpu className="text-yemenBlue" />
              <h3 className="text-xl font-bold text-slate-900">2. تشغيل Faster-Whisper XXL (CPU Optimized)</h3>
            </div>
            <div className="space-y-4">
              <p className="text-sm text-slate-600">استخدام مكتبة CTranslate2 لتحقيق سرعة مذهلة على المعالجات العادية بدون GPU:</p>
              <div className="bg-slate-900 rounded-xl p-4 font-mono text-xs text-blue-300 space-y-2 text-left" dir="ltr">
                <p className="text-slate-500"># Install Faster-Whisper with CPU focus</p>
                <p>pip install faster-whisper</p>
                <p className="text-slate-500 mt-2"># Load Model with INT8 quantization</p>
                <p className="text-green-400">from faster_whisper import WhisperModel</p>
                <p>model = WhisperModel("large-v3", device="cpu", compute_type="int8")</p>
                <p className="text-slate-500 mt-2"># Transcribe Isolated Audio</p>
                <p>segments, info = model.transcribe("isolated_vocals.wav", beam_size=5)</p>
              </div>
            </div>
          </section>

          {/* Step 3: Pyannote Diarization */}
          <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-3 mb-4 border-b border-slate-100 pb-3">
              <Users className="text-green-600" />
              <h3 className="text-xl font-bold text-slate-900">3. تمييز المتحدثين (Speaker Diarization)</h3>
            </div>
            <div className="space-y-4 text-sm text-slate-600">
               <p>ربط مخرجات Whisper XXL بمكتبة **Pyannote-audio** محلياً لفرز الأصوات المتقاطعة:</p>
               <div className="bg-slate-900 rounded-xl p-4 font-mono text-xs text-blue-300 text-left" dir="ltr">
                 <p>from pyannote.audio import Pipeline</p>
                 <p>pipeline = Pipeline.from_pretrained("pyannote/speaker-diarization", use_auth_token="YOUR_TOKEN")</p>
                 <p>diarization = pipeline("input.wav", num_speakers=2)</p>
               </div>
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-yemenBlue p-6 rounded-2xl text-white shadow-lg border-b-4 border-yemenGold">
            <h4 className="font-black mb-4 flex items-center gap-2 uppercase tracking-widest text-xs">
              <ShieldCheck className="text-yemenGold" size={16} />
              معايير الخصوصية الصوتية
            </h4>
            <ul className="space-y-4 text-[11px] font-bold">
              <li className="flex gap-3">
                <CheckCircle2 size={14} className="text-yemenGold flex-shrink-0" />
                <span>**CPU Hardening:** المعالجة تتم في الذاكرة الرامية (RAM) دون ترك أثر في ملفات الـ Swap.</span>
              </li>
              <li className="flex gap-3">
                <CheckCircle2 size={14} className="text-yemenGold flex-shrink-0" />
                <span>**Isolation:** فصل الضجيج يمنع الـ AI من "تخيل" كلمات بناءً على أصوات الخلفية.</span>
              </li>
              <li className="flex gap-3">
                <CheckCircle2 size={14} className="text-yemenGold flex-shrink-0" />
                <span>**Offline Force:** لا يتم تحميل نماذج Pyannote إلا من الكاش المحلي المشفر.</span>
              </li>
            </ul>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Cpu size={18} className="text-yemenBlue" />
              متطلبات المعالج (CPU Specs)
            </h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-slate-50">
                <span className="text-[10px] text-slate-500 font-bold uppercase">Threads</span>
                <span className="text-xs font-black">16 Minimum</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-50">
                <span className="text-[10px] text-slate-500 font-bold uppercase">Instruction Set</span>
                <span className="text-xs font-black">AVX2 / AVX-512</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-[10px] text-slate-500 font-bold uppercase">RAM Cache</span>
                <span className="text-xs font-black">8GB Optimized</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TechnicalGuide;
