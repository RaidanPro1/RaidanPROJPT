
import { Shield, Rocket, Settings, Gauge, Zap, CheckCircle2, Server, Lock, Globe, Database, Cpu, Search } from 'lucide-react';
import React from 'react';

const InfrastructureStrategy: React.FC = () => {
  const phases = [
    {
      title: "المرحلة الأولى: التأسيس والتحصين السيادي (Sovereign Foundation)",
      icon: <Lock className="text-red-500" />,
      color: "border-red-500",
      items: [
        "تثبيت Ubuntu 24.04 LTS المستقر",
        "تصليب SSH (تعطيل Root Login وكلمات المرور)",
        "إعداد Technitium DNS لإدارة النطاقات محلياً ومنع الحجب",
        "تفعيل DoH (DNS-over-HTTPS) لتشفير استعلامات الشبكة"
      ]
    },
    {
      title: "المرحلة الثانية: بيئة الحاويات والربط (Docker Mesh & Routing)",
      icon: <Rocket className="text-blue-500" />,
      color: "border-blue-500",
      items: [
        "إعداد شبكة yemenjpt-net المعزولة برمجياً",
        "تنصيب Traefik v3.0 كبوابة توجيه ذكية (Edge Proxy)",
        "نشر Coolify لإدارة دورة حياة الميكروسيرفس",
        "إعداد SSL محلي عبر Let's Encrypt و DNS Challenge"
      ]
    },
    {
      title: "المرحلة الثالثة: النواة الذكية والتعريب (AI Core & Localization)",
      icon: <Brain className="text-purple-500" size={20} />,
      color: "border-purple-500",
      items: [
        "نشر Ollama مع دعم Llama 3 و Qwen محلياً",
        "إعداد Open WebUI كواجهة تفاعلية سيادية أساسية",
        "تفعيل LibreTranslate للترجمة الفورية دون إنترنت",
        "دمج Whisper لعمليات التفريغ الصوتي الاستقصائي"
      ]
    },
    {
      title: "المرحلة الرابعة: الذاكرة والأداء العالي (Storage & Optimization)",
      icon: <Database className="text-yemenGold" />,
      color: "border-yemenGold",
      items: [
        "نشر Qdrant كقاعدة بيانات شعاعية (Vector DB) للذاكرة العميقة",
        "إعداد Redis لإدارة الكاش وتسريع استجابة الواجهات",
        "تحسين استهلاك الذاكرة عبر قيود Docker Resource Limits",
        "تفعيل ضغط Brotli على مستوى Traefik لتقليل حجم البيانات"
      ]
    },
    {
      title: "المرحلة الخامسة: الأتمتة والأرشفة الدائمة (Intelligence Pipeline)",
      icon: <Zap className="text-orange-500" />,
      color: "border-orange-500",
      items: [
        "بناء تدفقات n8n لجمع البيانات من SearXNG و Huginn",
        "إعداد ArchiveBox للأرشفة الفورية للأدلة الرقمية",
        "تفعيل نظام النسخ الاحتياطي المشفر 3-2-1 إلى Off-site",
        "نشر ميكروسيرفس Sentinel-2 لتحليل صور الأقمار الصناعية"
      ]
    }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Hero Section */}
      <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-yemenBlue/5 rounded-full -mr-32 -mt-32"></div>
        <div className="relative z-10">
          <h2 className="text-3xl font-black text-yemenBlue mb-4">استراتيجية التنفيذ السيادي v1.5 (Master Strategy)</h2>
          <p className="text-gray-600 max-w-3xl leading-relaxed">
            خارطة الطريق التقنية المحدثة لنشر نظام YemenJPT. تركز هذه الاستراتيجية على دمج "الذاكرة الشعاعية" (Qdrant) و"الواجهة الموحدة" (Open WebUI) لضمان أداء استثنائي وسيادة رقمية كاملة.
          </p>
          <div className="flex gap-4 mt-6">
            <div className="flex items-center gap-2 text-xs font-bold text-yemenBlue bg-blue-50 px-3 py-1.5 rounded-full">
              <Cpu size={14} />
              Host: hosting.raidan.pro
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-green-700 bg-green-50 px-3 py-1.5 rounded-full">
              <Shield size={14} />
              Protocol: Air-gapped Ready
            </div>
          </div>
        </div>
      </div>

      {/* Strategy Phases Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {phases.map((phase, idx) => (
          <div key={idx} className={`bg-white rounded-xl border-t-4 ${phase.color} shadow-sm p-6 hover:shadow-md transition-all group relative`}>
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-gray-50 rounded-lg group-hover:scale-110 transition-transform">
                {phase.icon}
              </div>
              <h3 className="font-bold text-gray-900 leading-tight">{phase.title}</h3>
            </div>
            <ul className="space-y-3">
              {phase.items.map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-sm text-gray-600">
                  <CheckCircle2 size={16} className="text-green-500 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <div className="absolute top-4 left-4 text-gray-100 font-black text-4xl -z-0 opacity-10 group-hover:opacity-20 transition-opacity">
              0{idx + 1}
            </div>
          </div>
        ))}

        {/* Global Status Card */}
        <div className="lg:col-span-1 bg-gradient-to-br from-yemenBlue-dark to-yemenBlue text-white rounded-xl p-6 flex flex-col justify-between shadow-lg relative overflow-hidden border-b-4 border-yemenGold">
          <div className="absolute top-0 right-0 opacity-10 rotate-12">
             <Server size={140} />
          </div>
          <div className="relative z-10">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Gauge size={20} className="text-yemenGold" />
              مؤشرات السيادة الحالية
            </h3>
            <div className="space-y-4">
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] uppercase font-bold text-blue-200 tracking-wider">
                  <span>تغطية الأرشفة الذاتية</span>
                  <span>92%</span>
                </div>
                <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-yemenGold h-full w-[92%] shadow-[0_0_8px_rgba(212,175,55,0.4)]"></div>
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] uppercase font-bold text-blue-200 tracking-wider">
                  <span>نسبة استقلالية الـ AI</span>
                  <span>100% (Air-gapped)</span>
                </div>
                <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-green-400 h-full w-full"></div>
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] uppercase font-bold text-blue-200 tracking-wider">
                  <span>كفاءة البحث الشعاعي</span>
                  <span>88% (Qdrant Indexed)</span>
                </div>
                <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-blue-400 h-full w-[88%]"></div>
                </div>
              </div>
            </div>
          </div>
          <button className="mt-8 bg-yemenGold hover:bg-yemenGold-light text-yemenBlue-dark font-black py-2.5 rounded-lg text-xs transition-all flex items-center justify-center gap-2">
            <Search size={14} />
            تحميل تقرير الامتثال السيادي
          </button>
        </div>
      </div>
    </div>
  );
};

const Brain: React.FC<{size?: number, className?: string}> = ({size = 24, className = ""}) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .52 8.105 4 4 0 0 0 6.003 0 4 4 0 0 0 .52-8.105 4 4 0 0 0-2.526-5.77A3 3 0 0 0 12 5Z" />
    <path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.52 8.105 4 4 0 0 1-6.003 0 4 4 0 0 1-.52-8.105 4 4 0 0 1 2.526-5.77A3 3 0 0 1 12 5Z" />
    <path d="M9 13a4.5 4.5 0 0 0 3 4 4.5 4.5 0 0 0 3-4" />
    <path d="M12 17v4" />
    <path d="M12 12V5" />
  </svg>
);

export default InfrastructureStrategy;
