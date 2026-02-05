
import React from 'react';
import { Volume2, Cpu, Mic2, Code2, Zap, Play, FileAudio, Settings, CheckCircle2, Headphones } from 'lucide-react';

const PiperTTSGuide: React.FC = () => {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header Section */}
      <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-yemenBlue/5 rounded-full -mr-32 -mt-32"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-yemenBlue text-white p-3 rounded-xl shadow-lg">
              <Volume2 size={28} />
            </div>
            <h2 className="text-3xl font-black text-yemenBlue">[المتحدث الرقمي: محرك Piper TTS المحلي]</h2>
          </div>
          <p className="text-gray-600 max-w-4xl leading-relaxed">
            بروتوكول تفعيل **Piper TTS** كواجهة صوتية سيادية. يتميز المحرك بكفاءة استثنائية على المعالجات العادية (CPU Optimized) مع توفير جودة نطق طبيعية جداً للغة العربية دون الحاجة للاتصال بالإنترنت.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Step 1: Binary Installation */}
        <div className="lg:col-span-2 space-y-6">
          <section className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3 mb-4 border-b border-gray-100 pb-3">
              <Zap className="text-yemenGold" />
              <h3 className="text-xl font-bold text-gray-900">1. التثبيت المحلي (CPU Optimized)</h3>
            </div>
            <div className="space-y-4">
              <p className="text-sm text-gray-600">تثبيت Piper عبر النسخة المصرفة مسبقاً لضمان أفضل أداء على المعالج:</p>
              <div className="bg-black rounded-xl p-4 font-mono text-xs text-blue-100 space-y-2 text-left" dir="ltr">
                <p className="text-gray-500"># Download Piper Binary (Linux x86_64)</p>
                <p>wget https://github.com/rhasspy/piper/releases/latest/download/piper_linux_x86_64.tar.gz</p>
                <p>tar -xf piper_linux_x86_64.tar.gz</p>
                <p className="text-gray-500 mt-2"># Download Arabic Natural Voice (Khaled Model)</p>
                <p>wget https://huggingface.co/rhasspy/piper-voices/resolve/main/ar/ar_JO/khaled/medium/ar_JO-khaled-medium.onnx</p>
                <p>wget https://huggingface.co/rhasspy/piper-voices/resolve/main/ar/ar_JO/khaled/medium/ar_JO-khaled-medium.onnx.json</p>
              </div>
            </div>
          </section>

          {/* Step 2: Python Integration Script */}
          <section className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3 mb-4 border-b border-gray-100 pb-3">
              <Code2 className="text-blue-500" />
              <h3 className="text-xl font-bold text-gray-900">2. سكربت الربط (Python Bridge)</h3>
            </div>
            <div className="space-y-4">
              <p className="text-sm text-gray-600">سكربت لاستلام النصوص من RAGFlow وتحويلها إلى تيار صوتي:</p>
              <div className="bg-black rounded-xl p-4 font-mono text-xs text-blue-100 space-y-2 text-left" dir="ltr">
                <p className="text-green-400">import subprocess</p>
                <p className="text-green-400">def speak_sovereign(text, output_file="response.wav"):</p>
                <p className="pl-4 text-gray-300">command = [</p>
                <p className="pl-8">"./piper/piper",</p>
                <p className="pl-8">"--model", "ar_JO-khaled-medium.onnx",</p>
                <p className="pl-8">"--output_file", output_file</p>
                <p className="pl-4">]</p>
                <p className="pl-4">process = subprocess.Popen(command, stdin=subprocess.PIPE)</p>
                <p className="pl-4">process.communicate(input=text.encode('utf-8'))</p>
                <p className="pl-4 text-gray-500"># To play immediately:</p>
                <p className="pl-4">subprocess.run(["aplay", output_file])</p>
              </div>
            </div>
          </section>

          {/* Step 3: RAGFlow Workflow Link */}
          <section className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3 mb-4 border-b border-gray-100 pb-3">
              <Settings className="text-green-500" />
              <h3 className="text-xl font-bold text-gray-900">3. ربط مخرجات RAGFlow بالصوت</h3>
            </div>
            <div className="space-y-4 text-sm text-gray-600 leading-relaxed">
              <p>يتم إعداد خطاف (Webhook) في n8n يستقبل استجابة RAGFlow النهائية، ثم يقوم بإرسالها إلى سيرفر Piper المحلي عبر ميكروسيرفس بسيط:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-100 flex items-start gap-2">
                  <Play size={16} className="text-yemenBlue mt-1" />
                  <span>توليد ملفات WAV مؤقتة لكل إجابة لضمان سلاسة التشغيل.</span>
                </div>
                <div className="p-3 bg-green-50 rounded-lg border border-green-100 flex items-start gap-2">
                  <Mic2 size={16} className="text-green-600 mt-1" />
                  <span>دعم البث المباشر (Streaming) لتقليل زمن الاستجابة (Latency).</span>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Audio Profiles Sidebar */}
        <div className="space-y-6">
          <div className="bg-yemenBlue-dark p-6 rounded-2xl text-white border-b-4 border-yemenGold shadow-lg">
            <h4 className="font-black mb-4 flex items-center gap-2">
              <Headphones className="text-yemenGold" size={20} />
              النماذج الصوتية المختارة
            </h4>
            <div className="space-y-4">
              <div className="bg-white/10 p-3 rounded-lg border border-white/5">
                <span className="text-[10px] text-blue-200 font-bold block mb-1 uppercase tracking-widest">Model: ar_JO-khaled</span>
                <p className="text-sm font-bold">صوت ذكوري (متزن/إخباري)</p>
                <p className="text-[10px] opacity-60 mt-1 italic">مثالي لقراءة التقارير الاستخباراتية.</p>
              </div>
              <div className="bg-white/10 p-3 rounded-lg border border-white/5">
                <span className="text-[10px] text-blue-200 font-bold block mb-1 uppercase tracking-widest">Model: ar_JO-karl</span>
                <p className="text-sm font-bold">صوت ذكوري (عالي الوضوح)</p>
                <p className="text-[10px] opacity-60 mt-1 italic">مناسب للتنبيهات العاجلة والتحذيرات.</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
            <h4 className="font-bold text-yemenBlue mb-4 flex items-center gap-2">
              <FileAudio size={20} />
              مؤشرات جودة الصوت
            </h4>
            <div className="space-y-4">
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] uppercase font-bold text-gray-500">
                  <span>Naturalness (MOS)</span>
                  <span>4.2/5.0</span>
                </div>
                <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-green-500 h-full w-[84%]"></div>
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] uppercase font-bold text-gray-500">
                  <span>CPU Latency (i5/i7)</span>
                  <span>~150ms</span>
                </div>
                <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-blue-500 h-full w-[95%]"></div>
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] uppercase font-bold text-gray-500">
                  <span>Arabic Diacritics Sync</span>
                  <span>90%</span>
                </div>
                <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-yemenGold h-full w-[90%]"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PiperTTSGuide;
