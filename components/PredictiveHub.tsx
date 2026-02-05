
import React from 'react';
import { 
  Globe, TrendingUp, AlertTriangle, Wind, 
  Wifi, Wheat, Anchor, Activity, ArrowRight,
  Share2, Info
} from 'lucide-react';
import { useBranding } from '../context/BrandingContext';

const PredictiveHub: React.FC = () => {
  const { theme } = useBranding();

  const indicators = [
    {
      id: 'food_security',
      title: 'مؤشر الأمن الغذائي',
      value: 'Critical',
      trend: '+12% الأسعار',
      desc: 'رصد أسعار القمح والمواد الأساسية في الأسواق المحلية مقارنة بالبورصة العالمية.',
      icon: <Wheat size={24} className="text-amber-500" />,
      color: 'border-amber-500'
    },
    {
      id: 'climate_risk',
      title: 'الإنذار المناخي المبكر',
      value: 'High Alert',
      trend: 'أمطار غزيرة (إب)',
      desc: 'تحليل بيانات الأقمار الصناعية للتنبؤ بالسيول والفيضانات قبل حدوثها بـ 24 ساعة.',
      icon: <Wind size={24} className="text-blue-500" />,
      color: 'border-blue-500'
    },
    {
      id: 'connectivity',
      title: 'استقرار الشبكة الوطنية',
      value: 'Stable',
      trend: '4.2 Mbps Avg',
      desc: 'مراقبة حية لجودة وسرعة الإنترنت في المحافظات الرئيسية عبر نقاط رصد متعددة.',
      icon: <Wifi size={24} className="text-green-500" />,
      color: 'border-green-500'
    },
    {
      id: 'conflict_monitor',
      title: 'رصد النزاع (GDELT)',
      value: 'Elevated',
      trend: 'توتر في الساحل',
      desc: 'تحليل الأخبار العالمية والتقارير المفتوحة لتحديد بؤر التوتر المحتملة.',
      icon: <Activity size={24} className="text-red-500" />,
      color: 'border-red-500'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-tajawal animate-in fade-in duration-700">
      {/* Simulated SEO Head Injection */}
      <div className="hidden">
        <title>RaidanPro | بوابة المؤشرات الاستراتيجية</title>
        <meta name="description" content="منصة رصد حية للمؤشرات الوطنية في اليمن: الأمن الغذائي، المناخ، والاقتصاد." />
      </div>

      {/* Landing Header */}
      <header className="bg-slate-900 text-white py-20 px-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-primary/30 rounded-full blur-3xl"></div>
        
        <div className="max-w-6xl mx-auto relative z-10 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-1.5 rounded-full border border-white/20 mb-6 backdrop-blur-sm">
            <Globe size={16} className="text-yemenGold" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-100">Sovereign Foresight System</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black mb-6 leading-tight">
            بوابة <span className="text-transparent bg-clip-text bg-gradient-to-r from-yemenGold to-amber-300">المؤشرات الاستراتيجية</span>
          </h1>
          <p className="text-slate-300 max-w-2xl mx-auto text-lg leading-relaxed">
            منظومة رصد ذكية تعتمد على البيانات المفتوحة والذكاء الاصطناعي لتقديم رؤية استباقية حول الوضع الإنساني، الاقتصادي، والبيئي في اليمن.
          </p>
        </div>
      </header>

      {/* Main Grid */}
      <main className="max-w-7xl mx-auto px-6 py-16 -mt-10 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {indicators.map((item) => (
            <div key={item.id} className={`bg-white p-6 rounded-2xl shadow-xl border-t-4 ${item.color} hover:-translate-y-2 transition-transform duration-300 flex flex-col justify-between h-80 group`}>
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-slate-50 rounded-xl group-hover:scale-110 transition-transform">
                    {item.icon}
                  </div>
                  <ArrowRight size={20} className="text-slate-300 group-hover:text-brand-primary transition-colors -rotate-45" />
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-2">{item.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
              </div>
              
              <div className="pt-6 border-t border-slate-100">
                <div className="flex justify-between items-end">
                  <div>
                    <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest block mb-1">Current Status</span>
                    <span className="text-2xl font-black text-slate-800 font-mono">{item.value}</span>
                  </div>
                  <div className="text-right">
                    <span className={`text-xs font-bold px-2 py-1 rounded-lg ${item.color.replace('border', 'bg').replace('500', '100')} ${item.color.replace('border', 'text').replace('500', '700')}`}>
                      {item.trend}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Detailed Section */}
        <section className="mt-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <h2 className="text-3xl font-black text-slate-900">منهجية الرصد السيادي</h2>
            <p className="text-slate-600 leading-loose">
              تعتمد مؤشراتنا على تقاطع البيانات من مصادر متعددة (Satellite Imagery, GDELT, Local Sensors) ومعالجتها محلياً باستخدام خوارزميات RaidanPro لضمان دقة التنبؤ بعيداً عن التحيزات الخارجية.
            </p>
            <div className="flex gap-4">
              <div className="flex items-center gap-3 p-4 bg-white rounded-xl shadow-sm border border-slate-200">
                <Share2 className="text-brand-primary" />
                <div>
                  <div className="font-bold text-slate-900">API مفتوح</div>
                  <div className="text-xs text-slate-500">للشركاء المعتمدين</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-white rounded-xl shadow-sm border border-slate-200">
                <Info className="text-brand-primary" />
                <div>
                  <div className="font-bold text-slate-900">تحديث لحظي</div>
                  <div className="text-xs text-slate-500">كل 15 دقيقة</div>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-slate-900 rounded-3xl p-8 relative overflow-hidden shadow-2xl">
             <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-brand-primary/20 to-transparent"></div>
             <div className="relative z-10 text-white space-y-6">
                <div className="flex justify-between items-center border-b border-white/10 pb-4">
                   <span className="font-mono text-yemenGold">SYSTEM_STATUS</span>
                   <div className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                      <span className="text-xs font-bold">ONLINE</span>
                   </div>
                </div>
                <div className="space-y-4 font-mono text-sm text-blue-200">
                   <p>> Initiating Satellite Feed...</p>
                   <p>> Analyzing Wheat Prices (Global vs Local)...</p>
                   <p>> Calculating Conflict Probability Index...</p>
                   <p className="text-green-400">> Prediction Model: 98% Confidence.</p>
                </div>
             </div>
          </div>
        </section>
      </main>

      <footer className="bg-white border-t border-slate-200 py-12 mt-12">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-slate-500 text-sm font-bold">© 2026 RaidanPro. Powered by Sovereign AI.</p>
        </div>
      </footer>
    </div>
  );
};

export default PredictiveHub;
