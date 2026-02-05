
import React from 'react';
import { Shield, Rocket, Settings, Gauge, Zap, CheckCircle2, Server, Lock, Globe, Database } from 'lucide-react';

const InfrastructureStrategy: React.FC = () => {
  const phases = [
    {
      title: "المرحلة الأولى: الأساس والتحصين (Foundation)",
      icon: <Lock className="text-red-500" />,
      color: "border-red-500",
      items: ["تثبيت Ubuntu 24.04 LTS", "تصليب SSH وتعطيل كلمة المرور", "إعداد UFW و Fail2Ban", "ربط Cloudflare Proxy"]
    },
    {
      title: "المرحلة الثانية: النشر السيادي (Deployment)",
      icon: <Rocket className="text-blue-500" />,
      color: "border-blue-500",
      items: ["تنصيب Docker & Docker Compose", "إعداد شبكة yemenjpt-net", "نشر لوحة Coolify/Portainer", "إعداد Traefik Reverse Proxy"]
    },
    {
      title: "المرحلة الثالثة: التخصيص والتعريب (Localization)",
      icon: <Globe className="text-green-500" />,
      color: "border-green-500",
      items: ["تعريب الواجهات (RTL Support)", "إعداد Keycloak (SSO)", "تخصيص الهوية البصرية YemenJPT", "تحميل حزم اللغة لـ Tesseract"]
    },
    {
      title: "المرحلة الرابعة: تحسين الأداء (Optimization)",
      icon: <Gauge className="text-yemenGold" />,
      color: "border-yemenGold",
      items: ["تفعيل ضغط Brotli/Gzip", "إعداد Redis Caching", "تحسين الصور (WebP Conversion)", "تحديد قيود الموارد (Limits)"]
    },
    {
      title: "المرحلة الخامسة: الأتمتة والنسخ (Automation)",
      icon: <Zap className="text-purple-500" />,
      color: "border-purple-500",
      items: ["أتمتة النسخ الاحتياطي (3-2-1 Strategy)", "إعداد Watchtower للتحديثات", "بناء AI Agents عبر n8n", "تفعيل تنبيهات Signal/Telegram"]
    }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-yemenBlue/5 rounded-full -mr-32 -mt-32"></div>
        <div className="relative z-10">
          <h2 className="text-3xl font-black text-yemenBlue mb-4">استراتيجية التنفيذ السيادي (Master Strategy)</h2>
          <p className="text-gray-600 max-w-3xl leading-relaxed">
            خارطة طريق تقنية لنشر YemenJPT على خادم <code className="bg-gray-100 px-2 py-1 rounded text-yemenBlue font-mono">hosting.raidan.pro</code> 
            مع ضمان السيادة الكاملة والأداء الأقصى في البيئة اليمنية.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {phases.map((phase, idx) => (
          <div key={idx} className={`bg-white rounded-xl border-t-4 ${phase.color} shadow-sm p-6 hover:shadow-md transition-all group`}>
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
          </div>
        ))}

        <div className="lg:col-span-1 bg-yemenBlue text-white rounded-xl p-6 flex flex-col justify-between shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 opacity-10">
             <Server size={120} />
          </div>
          <div>
            <h3 className="text-xl font-bold mb-2">الحالة الراهنة للبنية</h3>
            <div className="space-y-4 mt-4">
              <div className="flex justify-between items-center text-sm">
                <span>توزيع الحمل (Load Balancing)</span>
                <span className="bg-white/20 px-2 py-0.5 rounded text-[10px] font-bold">نشط (Traefik)</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span>الشبكة السيادية</span>
                <span className="bg-green-500 px-2 py-0.5 rounded text-[10px] font-bold">مؤمنة (Air-gapped ready)</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span>النسخ الاحتياطي</span>
                <span className="bg-yemenGold px-2 py-0.5 rounded text-[10px] font-bold text-yemenBlue">مجدول (Off-site)</span>
              </div>
            </div>
          </div>
          <button className="mt-8 bg-white text-yemenBlue font-bold py-2 rounded-lg hover:bg-yemenGold hover:text-yemenBlue-dark transition-colors">
            تحميل تقرير التدقيق الأمني
          </button>
        </div>
      </div>
    </div>
  );
};

export default InfrastructureStrategy;
