
import React from 'react';
import { Search, Brain, FileText, Database, ShieldAlert, Zap, Layers, RefreshCcw, CheckCircle2, Languages } from 'lucide-react';

const RAGOptimizationGuide: React.FC = () => {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header Section */}
      <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-yemenGold/5 rounded-full -mr-32 -mt-32"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-yemenGold text-yemenBlue-dark p-3 rounded-xl shadow-lg">
              <Languages size={28} />
            </div>
            <h2 className="text-3xl font-black text-yemenBlue">[بروتوكول تحسين الاسترجاع: دقة الاستجابة الصفرية]</h2>
          </div>
          <p className="text-gray-600 max-w-4xl leading-relaxed">
            استراتيجية متقدمة لضبط محركات البحث الدلالي في **RAGFlow** باستخدام نماذج التضمين (Embedding) العالمية مع تحسينات خاصة للغة العربية واللهجات اليمنية لضمان عدم الهلوسة (Zero-hallucination).
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Step 1: Embedding & Retrieval */}
        <div className="lg:col-span-2 space-y-6">
          <section className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3 mb-4 border-b border-gray-100 pb-3">
              <Database className="text-blue-500" />
              <h3 className="text-xl font-bold text-gray-900">1. محرك التضمين (BGE-M3 / Multilingual-E5)</h3>
            </div>
            <div className="space-y-4">
              <p className="text-sm text-gray-600">نعتمد نموذج **BGE-M3** لدعمه لخاصية (Hybrid Retrieval) التي تدمج البحث الكثيف والبحث المتفرق:</p>
              <div className="bg-black rounded-xl p-4 font-mono text-xs text-blue-100 space-y-2 text-left" dir="ltr">
                <p className="text-gray-500"># Configure BGE-M3 for Dense & Sparse Search</p>
                <p>embedding_model: "BAAI/bge-m3"</p>
                <p>use_hybrid_search: true</p>
                <p className="text-gray-500 mt-2"># Multilingual-E5 Configuration for Long Context</p>
                <p>query_prefix: "query: "</p>
                <p>document_prefix: "passage: "</p>
                <p className="text-gray-500 mt-2"># Enable Cross-Encoder Reranking</p>
                <p>reranker_model: "BAAI/bge-reranker-v2-m3"</p>
              </div>
            </div>
          </section>

          {/* Step 2: Semantic Chunking */}
          <section className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3 mb-4 border-b border-gray-100 pb-3">
              <Layers className="text-purple-500" />
              <h3 className="text-xl font-bold text-gray-900">2. استراتيجية التقطيع (Chunking) للوثائق العربية</h3>
            </div>
            <div className="space-y-4">
              <p className="text-sm text-gray-600">الوثائق الرسمية العربية تتطلب تقطيعاً يحترم علامات الترقيم وبنية الفقرات (RTL Awareness):</p>
              <ul className="space-y-3">
                <li className="flex gap-3 text-xs text-gray-700 bg-gray-50 p-3 rounded-lg border-r-4 border-purple-400">
                  <CheckCircle2 size={16} className="text-purple-500 flex-shrink-0" />
                  <span>**Recursive Character Splitting:** استخدام علامات الترقيم (، ؛ .) كفواصل أساسية للحفاظ على وحدة المعنى.</span>
                </li>
                <li className="flex gap-3 text-xs text-gray-700 bg-gray-50 p-3 rounded-lg border-r-4 border-purple-400">
                  <CheckCircle2 size={16} className="text-purple-500 flex-shrink-0" />
                  <span>**Overlap Window (15%):** تداخل بنسبة 15% بين المقاطع لضمان استمرارية السياق عند الاسترجاع.</span>
                </li>
                <li className="flex gap-3 text-xs text-gray-700 bg-gray-50 p-3 rounded-lg border-r-4 border-purple-400">
                  <CheckCircle2 size={16} className="text-purple-500 flex-shrink-0" />
                  <span>**Header Injection:** حقن عناوين الأقسام الرئيسية في كل مقطع (Chunk) لتعزيز الدقة الدلالية.</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Step 3: Dialect & MSA Mapping */}
          <section className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3 mb-4 border-b border-gray-100 pb-3">
              <Brain className="text-yemenGold" />
              <h3 className="text-xl font-bold text-gray-900">3. التعامل مع اللهجات في Command R7B</h3>
            </div>
            <div className="space-y-4">
              <p className="text-sm text-gray-600">يتميز **Command R7B Arabic** بقدرة فطرية على مطابقة مفردات اللهجة بالحقائق المسجلة بالفصحى:</p>
              <div className="bg-yemenBlue/5 p-4 rounded-xl border border-yemenBlue/10">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[10px] font-bold text-yemenBlue uppercase">Logic Architecture</span>
                  <Zap size={14} className="text-yemenGold" />
                </div>
                <p className="text-[11px] text-gray-700 leading-relaxed italic">
                  "عند ورود استعلام باللهجة اليمنية (مثلاً: 'وين راح المال العام؟')، يقوم النموذج بعملية **Query Expansion** داخلياً لمطابقتها مع مفاهيم 'الفساد المالي' و 'الاختلاس' المخزنة في قاعدة بيانات Neo4j و RAGFlow، ثم يستنتج الإجابة بناءً على الحقائق المسترجعة حصراً."
                </p>
              </div>
            </div>
          </section>
        </div>

        {/* Hallucination Control Sidebar */}
        <div className="space-y-6">
          <div className="bg-yemenBlue-dark p-6 rounded-2xl text-white border-b-4 border-yemenGold shadow-lg">
            <h4 className="font-black mb-4 flex items-center gap-2">
              <ShieldAlert className="text-yemenGold" size={20} />
              التحكم في الهلوسة
            </h4>
            <div className="space-y-4">
              <div className="bg-white/10 p-3 rounded-lg">
                <span className="text-[10px] text-blue-200 font-bold block mb-1 uppercase">Temperature Setting</span>
                <p className="text-sm font-black">0.1 (Strict Truth)</p>
              </div>
              <div className="bg-white/10 p-3 rounded-lg">
                <span className="text-[10px] text-blue-200 font-bold block mb-1 uppercase">RAG Prompt Template</span>
                <p className="text-[10px] leading-relaxed opacity-80">
                  "استخدم الحقائق المرفقة فقط. إذا لم تجد الإجابة، قل لا أعلم. يمنع ذكر أي معلومات من تدريبك المسبق."
                </p>
              </div>
              <div className="bg-white/10 p-3 rounded-lg">
                <span className="text-[10px] text-blue-200 font-bold block mb-1 uppercase">Citation Enforcement</span>
                <p className="text-xs">إلزام النموذج بذكر [المصدر: اسم الوثيقة/رقم الصفحة] لكل جملة.</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
            <h4 className="font-bold text-yemenBlue mb-4 flex items-center gap-2">
              <RefreshCcw size={20} />
              مؤشرات جودة الاسترجاع
            </h4>
            <div className="space-y-4">
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] uppercase font-bold text-gray-500">
                  <span>Context Relevance</span>
                  <span>98%</span>
                </div>
                <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-green-500 h-full w-[98%]"></div>
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] uppercase font-bold text-gray-500">
                  <span>Faithfulness (Truth)</span>
                  <span>100%</span>
                </div>
                <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-blue-500 h-full w-full"></div>
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] uppercase font-bold text-gray-500">
                  <span>Dialect Alignment</span>
                  <span>92%</span>
                </div>
                <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-yemenGold h-full w-[92%]"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RAGOptimizationGuide;
