
import React from 'react';
import { 
  ShieldCheck, Globe, Zap, Cpu, ArrowRight, CheckCircle2, 
  Terminal, Lock, Database, PlayCircle, BarChart3, Users 
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useBranding } from '../context/BrandingContext';

interface MarketingLandingProps {
  config?: any; // Config passed from Root editor
}

const MarketingLanding: React.FC<MarketingLandingProps> = ({ config }) => {
  const { t, language } = useLanguage();
  const { theme } = useBranding();

  // Default content if no config provided
  const content = config || {
    heroTitle: t('landing_hero_title'),
    heroSubtitle: t('landing_hero_subtitle'),
    features: [
      { title: "Sovereign AI", desc: "Local LLM execution with zero data egress.", icon: "Cpu" },
      { title: "Military-Grade Security", desc: "End-to-end encryption & ISO 27001 compliance.", icon: "ShieldCheck" },
      { title: "Hybrid Intelligence", desc: "Adaptive routing between local and cloud models.", icon: "Zap" },
    ]
  };

  return (
    <div className="min-h-screen bg-slate-950 font-tajawal text-white overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-brand-primary rounded-xl flex items-center justify-center text-white font-black text-xl shadow-glow-blue">R</div>
            <span className="font-black text-xl tracking-tighter">RAIDAN<span className="text-brand-accent">PRO</span></span>
          </div>
          <div className="flex items-center gap-6">
             <a href="#features" className="text-sm font-bold text-slate-300 hover:text-white transition-colors hidden md:block">المميزات</a>
             <a href="#security" className="text-sm font-bold text-slate-300 hover:text-white transition-colors hidden md:block">الأمان</a>
             <button className="bg-white text-slate-950 px-6 py-2 rounded-full font-black text-xs uppercase tracking-widest hover:bg-brand-accent transition-all">
               {t('login_button')}
             </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="pt-32 pb-20 px-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-brand-primary/10 rounded-full blur-[120px] -mr-64 -mt-64 animate-pulse"></div>
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
          <div className="space-y-8 animate-in slide-in-from-bottom-10 duration-1000">
            <div className="inline-flex items-center gap-2 bg-slate-900 border border-slate-800 px-4 py-1.5 rounded-full">
               <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
               <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">System v2.1 Live</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black leading-tight">
              {content.heroTitle}
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-brand-primary via-brand-accent to-brand-primary bg-[length:200%_auto] animate-[gradient_5s_ease_infinite]">
                Sovereign Intelligence
              </span>
            </h1>
            <p className="text-lg text-slate-400 leading-relaxed max-w-xl">
              {content.heroSubtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="bg-brand-primary hover:bg-brand-primary-hover text-white px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-glow-blue transition-all active:scale-95 flex items-center justify-center gap-3">
                {t('landing_cta')} <ArrowRight size={18} className={language === 'ar' ? 'rotate-180' : ''} />
              </button>
              <button className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest border border-slate-800 transition-all flex items-center justify-center gap-3">
                <PlayCircle size={18} /> عرض تقديمي
              </button>
            </div>
          </div>
          
          <div className="relative animate-in zoom-in-95 duration-1000 delay-200">
             <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 shadow-2xl rotate-3 hover:rotate-0 transition-all duration-500">
                <div className="bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 relative h-[400px]">
                   {/* Fake Dashboard UI */}
                   <div className="p-4 border-b border-slate-800 flex items-center gap-4">
                      <div className="flex gap-2">
                         <div className="w-3 h-3 rounded-full bg-red-500"></div>
                         <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                         <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      </div>
                      <div className="flex-1 bg-slate-900 h-6 rounded-lg mx-4"></div>
                   </div>
                   <div className="p-6 grid grid-cols-2 gap-4">
                      <div className="bg-slate-900/50 h-32 rounded-xl border border-slate-800 animate-pulse"></div>
                      <div className="bg-slate-900/50 h-32 rounded-xl border border-slate-800 animate-pulse delay-75"></div>
                      <div className="col-span-2 bg-slate-900/50 h-40 rounded-xl border border-slate-800 flex items-center justify-center text-slate-700 font-mono text-xs">
                         > System.Initiate(Protocol_Zero)...
                      </div>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </header>

      {/* Features Grid */}
      <section id="features" className="py-24 bg-slate-900/50 border-t border-slate-800 relative">
         <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
               <h2 className="text-3xl font-black mb-4">قدرات لا تضاهى</h2>
               <p className="text-slate-400">بنية تحتية مصممة للعمليات الحساسة والمعقدة.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               <FeatureCard 
                 icon={<Cpu size={32} className="text-brand-primary" />} 
                 title="معالجة محلية" 
                 desc="نماذج ذكاء اصطناعي تعمل بالكامل على خوادمك دون إرسال بايت واحد للخارج." 
               />
               <FeatureCard 
                 icon={<ShieldCheck size={32} className="text-green-500" />} 
                 title="تشفير عسكري" 
                 desc="حماية البيانات أثناء النقل والتخزين باستخدام بروتوكولات AES-256." 
               />
               <FeatureCard 
                 icon={<Globe size={32} className="text-brand-accent" />} 
                 title="نشر متعدد القنوات" 
                 desc="أتمتة النشر إلى WordPress, Ghost وشبكات التواصل من مكان واحد." 
               />
            </div>
         </div>
      </section>

      {/* Interactive Stats */}
      <section className="py-24 relative overflow-hidden">
         <div className="absolute inset-0 bg-brand-primary/5 -skew-y-3 transform origin-bottom-right"></div>
         <div className="max-w-7xl mx-auto px-6 relative z-10 grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <StatItem value="99.9%" label="Uptime" />
            <StatItem value="0ms" label="Data Leakage" />
            <StatItem value="AES-256" label="Encryption" />
            <StatItem value="24/7" label="Support" />
         </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 py-12 border-t border-slate-800">
         <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
               <div className="w-8 h-8 bg-brand-primary rounded-lg flex items-center justify-center text-white font-bold">R</div>
               <span className="font-bold text-slate-300">RaidanPro © 2026</span>
            </div>
            <div className="flex gap-6 text-sm text-slate-500 font-bold">
               <a href="#" className="hover:text-white transition-colors">Privacy</a>
               <a href="#" className="hover:text-white transition-colors">Terms</a>
               <a href="#" className="hover:text-white transition-colors">Contact</a>
            </div>
         </div>
      </footer>
    </div>
  );
};

const FeatureCard: React.FC<{icon: React.ReactNode, title: string, desc: string}> = ({icon, title, desc}) => (
  <div className="bg-slate-950 p-8 rounded-3xl border border-slate-800 hover:border-brand-primary/30 hover:bg-slate-900 transition-all group">
     <div className="mb-6 p-4 bg-slate-900 rounded-2xl inline-block group-hover:scale-110 transition-transform border border-slate-800 group-hover:border-slate-700">
        {icon}
     </div>
     <h3 className="text-xl font-black mb-3">{title}</h3>
     <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
  </div>
);

const StatItem: React.FC<{value: string, label: string}> = ({value, label}) => (
  <div>
     <div className="text-4xl font-black text-white mb-2 font-mono">{value}</div>
     <div className="text-xs font-bold text-brand-accent uppercase tracking-widest">{label}</div>
  </div>
);

export default MarketingLanding;
