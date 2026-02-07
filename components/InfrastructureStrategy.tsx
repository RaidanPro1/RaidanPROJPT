import { Shield, Rocket, Settings, Gauge, Zap, CheckCircle2, Server, Lock, Globe, Database, Cpu, Search, Activity, Share2, Mail, Terminal, GitBranch, Brain } from 'lucide-react';
import React from 'react';

const InfrastructureStrategy: React.FC = () => {
  const phases = [
    {
      title: "المرحلة 1: التكوين والتشخيص (Configuration & Diagnostics)",
      icon: <Settings className="text-blue-500" />,
      color: "border-blue-500",
      items: [
        "تشغيل المعالج التفاعلي لجمع الإعدادات (النطاق، مفاتيح API).",
        "توليد ملف البيئة الآمن (.env) مركزيًا.",
        "تنفيذ بروتوكول 'الأرض المحروقة' (Scorched Earth) لضمان بيئة نظيفة.",
        "تثبيت المتطلبات الأساسية للنظام (Docker, Python, UFW)."
      ]
    },
    {
      title: "المرحلة 2: نشر النواة الأصلية والخدمات (Native & Core Services)",
      icon: <Cpu className="text-purple-500" />,
      color: "border-purple-500",
      items: [
        "تثبيت Ollama مباشرة على نظام التشغيل (Native) للأداء الأقصى.",
        "سحب نماذج الذكاء الاصطناعي الأساسية (Qwen, Nomic Embed).",
        "إنشاء الشبكة السيادية المعزولة (172.28.0.0/16).",
        "نشر حاويات البنية التحتية (Postgres, Traefik) بآيبيهات ثابتة."
      ]
    },
    {
      title: "المرحلة 3: التدريع القانوني والتطبيقات (Hardening & Apps)",
      icon: <Shield className="text-red-500" />,
      color: "border-red-500",
      items: [
        "حقن الدستور الرقمي (القانون اليمني) في شخصية الذكاء الاصطناعي.",
        "إنشاء موديلات 'sovereign' معدلة وملتزمة بالقانون.",
        "نشر حاويات التطبيقات (Backend API, Frontend UI).",
        "التحقق من صحة الاتصال بين جميع الطبقات (API, DB, AI)."
      ]
    },
    {
      title: "المرحلة 4: الأتمتة والتسليم (Automation & Handover)",
      icon: <Rocket className="text-green-500" />,
      color: "border-green-500",
      items: [
        "تشغيل الأتمتة لمزامنة سجلات DNS مع Cloudflare.",
        "نشر خدمة البريد الإلكتروني السيادي (Mailcow).",
        "إنشاء المستخدم الجذر (Root Admin) وتشفير كلمة المرور.",
        "تفعيل جدار الحماية (UFW) وتوليد تقرير النشر النهائي."
      ]
    }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-yemenBlue/5 rounded-full -mr-32 -mt-32"></div>
        <div className="relative z-10">
          <h2 className="text-3xl font-black text-yemenBlue mb-4">استراتيجية النشر السيادي v2.0 (The Agentic Strategy)</h2>
          <p className="text-gray-600 max-w-3xl leading-relaxed">
            خارطة الطريق التقنية المحدثة لتثبيت المنصة بالكامل عبر المايسترو الآلي. يضمن هذا البروتوكول عملية نشر متسقة، آمنة، وقابلة للتكرار من سطر الأوامر.
          </p>
          <div className="flex gap-4 mt-6">
            <div className="flex items-center gap-2 text-xs font-bold text-yemenBlue bg-blue-50 px-3 py-1.5 rounded-full">
              <Terminal size={14} />
              Orchestrator: Master Shell Script
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-green-700 bg-green-50 px-3 py-1.5 rounded-full">
              <GitBranch size={14} />
              Process: Phased & Validated
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
      </div>
    </div>
  );
};


const BrainIcon: React.FC<{size?: number, className?: string}> = ({size = 24, className = ""}) => (
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