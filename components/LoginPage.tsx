
import React, { useState } from 'react';
import { ShieldCheck, Mail, Lock, ArrowRight, Loader2, CheckCircle, Github, Globe } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface LoginPageProps {
  onLogin: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const { t, language } = useLanguage();
  const [step, setStep] = useState<'credentials' | 'otp'>('credentials');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);

  const handleCredentialsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setStep('otp');
    }, 1500);
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API Verification
    setTimeout(() => {
      setIsLoading(false);
      onLogin();
    }, 1500);
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    
    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-950 font-tajawal relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 pointer-events-none"></div>
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-primary/20 rounded-full blur-3xl -mr-32 -mt-32 animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-brand-accent/10 rounded-full blur-3xl -ml-32 -mb-32"></div>

      {/* Left Column: Visual & Brand */}
      <div className="hidden lg:flex flex-1 flex-col justify-center px-20 relative z-10">
        <div className="mb-12">
           <div className="w-20 h-20 bg-brand-primary rounded-3xl flex items-center justify-center text-white text-4xl font-black mb-6 shadow-glow-blue border border-brand-primary/50">
             R
           </div>
           <h1 className="text-6xl font-black text-white leading-tight mb-4">
             RAIDAN<span className="text-brand-accent">PRO</span>
           </h1>
           <p className="text-xl text-slate-400 max-w-lg leading-relaxed">
             {t('landing_hero_subtitle')}
           </p>
        </div>
        <div className="flex gap-4">
           <div className="flex items-center gap-2 bg-slate-900/50 px-4 py-2 rounded-lg border border-slate-800">
              <ShieldCheck className="text-green-500" size={18} />
              <span className="text-xs font-bold text-slate-300">End-to-End Encrypted</span>
           </div>
           <div className="flex items-center gap-2 bg-slate-900/50 px-4 py-2 rounded-lg border border-slate-800">
              <Globe className="text-brand-primary" size={18} />
              <span className="text-xs font-bold text-slate-300">Sovereign Hosting</span>
           </div>
        </div>
      </div>

      {/* Right Column: Form */}
      <div className="flex-1 flex flex-col justify-center items-center px-6 lg:px-24 relative z-20 bg-slate-900/50 backdrop-blur-sm border-l border-slate-800">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center lg:text-right">
            <h2 className="text-3xl font-black text-white mb-2">{t('login_title')}</h2>
            <p className="text-slate-400 text-sm">{step === 'credentials' ? t('login_subtitle') : t('login_otp_sent')}</p>
          </div>

          {step === 'credentials' ? (
            <form onSubmit={handleCredentialsSubmit} className="space-y-6">
              <div className="space-y-4">
                <div className="relative group">
                  <Mail className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-brand-primary transition-colors" size={20} />
                  <input 
                    type="email" 
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t('login_email_placeholder')}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-4 pr-12 pl-4 text-white placeholder-slate-600 outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all text-right"
                    dir="rtl"
                  />
                </div>
                <div className="relative group">
                  <Lock className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-brand-primary transition-colors" size={20} />
                  <input 
                    type="password" 
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={t('login_password_placeholder')}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-4 pr-12 pl-4 text-white placeholder-slate-600 outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all text-right"
                    dir="rtl"
                  />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full bg-brand-primary hover:bg-brand-primary-hover text-white py-4 rounded-xl font-black text-sm uppercase tracking-widest transition-all flex items-center justify-center gap-3 shadow-lg shadow-brand-primary/20 active:scale-95 disabled:opacity-70"
              >
                {isLoading ? <Loader2 className="animate-spin" size={20} /> : <ArrowRight size={20} className={language === 'ar' ? 'rotate-180' : ''} />}
                {t('login_button')}
              </button>

              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-800"></div></div>
                <div className="relative flex justify-center text-xs uppercase"><span className="bg-slate-900 px-2 text-slate-500 font-bold">Or Continue With</span></div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button type="button" className="flex items-center justify-center gap-2 bg-slate-950 border border-slate-800 py-3 rounded-xl text-slate-300 hover:bg-slate-800 transition-all font-bold text-xs">
                   <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" className="w-4 h-4" /> Google
                </button>
                <button type="button" className="flex items-center justify-center gap-2 bg-slate-950 border border-slate-800 py-3 rounded-xl text-slate-300 hover:bg-slate-800 transition-all font-bold text-xs">
                   <Github size={16} /> GitHub
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleOtpSubmit} className="space-y-8 animate-in slide-in-from-right-8">
               <div className="flex justify-between gap-2" dir="ltr">
                  {otp.map((digit, i) => (
                    <input
                      key={i}
                      id={`otp-${i}`}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(i, e.target.value)}
                      className="w-12 h-14 bg-slate-950 border border-slate-800 rounded-xl text-center text-2xl font-black text-brand-accent outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent transition-all"
                    />
                  ))}
               </div>
               
               <button 
                type="submit" 
                disabled={isLoading}
                className="w-full bg-brand-accent hover:bg-brand-accent-glow text-slate-900 py-4 rounded-xl font-black text-sm uppercase tracking-widest transition-all flex items-center justify-center gap-3 shadow-lg shadow-brand-accent/20 active:scale-95 disabled:opacity-70"
              >
                {isLoading ? <Loader2 className="animate-spin" size={20} /> : <CheckCircle size={20} />}
                {t('login_verify_button')}
              </button>
              
              <button type="button" onClick={() => setStep('credentials')} className="w-full text-center text-xs text-slate-500 hover:text-white transition-colors">
                 العودة لتسجيل الدخول
              </button>
            </form>
          )}
        </div>
        
        <div className="absolute bottom-8 text-[10px] text-slate-600 font-mono">
           SECURE_SESSION_ID: {Math.random().toString(36).substring(7).toUpperCase()}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
