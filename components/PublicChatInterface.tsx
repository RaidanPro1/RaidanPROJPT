
import React, { useState } from 'react';
// Added missing ArrowUpRight icon to imports
import { 
  Send, Bot, User, Sparkles, Zap, Image as ImageIcon, 
  Mic, Paperclip, ChevronDown, RefreshCcw, MoreVertical,
  Settings2, Code2, PenTool, Search, Shield, Server, Cloud,
  // FIX: Import 'History' icon from lucide-react.
  ArrowUpRight, History
} from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  model?: string;
}

const PublicChatInterface: React.FC = () => {
  const { settings } = useSettings();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: 'مرحباً بك في مركز التحقيق السيادي. أنا مساعدك الذكي **علام (Allam)**. كيف يمكنني دعم مهمتك الاستقصائية اليوم؟',
      timestamp: new Date(),
      model: 'Allam'
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [selectedModel, setSelectedModel] = useState<string>('allam-hybrid');
  const [isTyping, setIsTyping] = useState(false);

  const models = [
    { id: 'allam-hybrid', name: 'علام (Allam-Sovereign-Hybrid)', type: 'cloud', desc: 'المحرك الافتراضي للبحث الاستراتيجي والذكاء العربي' },
    { id: 'saif-native', name: 'سيف (Saif-14B Native)', type: 'local', desc: 'للمنطق العالي والخصوصية القصوى (قانون 1990)' },
    { id: 'hakim-local', name: 'حكيم (Hakim-8B Local)', type: 'local', desc: 'للمحادثة العامة والتلخيص السريع' },
  ];

  const handleSend = () => {
    if (!inputValue.trim()) return;
    const newMessage: Message = { id: Date.now().toString(), role: 'user', content: inputValue, timestamp: new Date() };
    setMessages(prev => [...prev, newMessage]);
    setInputValue('');
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `استجابة من المحرك **${models.find(m => m.id === selectedModel)?.name}**: \n\nتم تحليل طلبك وفق مصفوفة السيادة اليمنية. جاري استحضار البيانات المطلوبة من المجمعات الذكية.`,
        timestamp: new Date(),
        model: selectedModel
      }]);
    }, 1500);
  };

  return (
    <div className="h-[calc(100vh-140px)] grid grid-cols-12 gap-6 animate-in fade-in duration-700 font-tajawal">
      
      {/* Main Chat Area */}
      <div className="col-span-12 xl:col-span-9 flex flex-col bg-panel/80 backdrop-blur-md rounded-[2.5rem] border border-border-subtle shadow-elevation overflow-hidden">
        
        {/* Header & Controls */}
        <div className="p-5 border-b border-border-subtle bg-canvas/30 flex justify-between items-center">
          <div className="relative group">
            <button className="flex items-center gap-3 px-5 py-2.5 bg-panel border border-border-subtle rounded-2xl text-sm font-black text-text-primary hover:border-brand-primary transition-all shadow-sm">
              <div className="w-2.5 h-2.5 rounded-full bg-brand-accent shadow-glow-accent animate-pulse"></div>
              <span>{models.find(m => m.id === selectedModel)?.name}</span>
              <ChevronDown size={16} className="text-text-subtle" />
            </button>
            <div className="absolute top-full right-0 mt-2 w-80 bg-panel border border-border-subtle rounded-2xl shadow-2xl p-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
              {models.map(model => (
                <button 
                  key={model.id}
                  onClick={() => setSelectedModel(model.id)}
                  className={`w-full text-right p-3.5 rounded-xl flex items-start gap-3 transition-colors ${selectedModel === model.id ? 'bg-brand-primary/10' : 'hover:bg-canvas'}`}
                >
                  {model.type === 'local' ? <Server size={18} className="text-green-500 mt-1"/> : <Cloud size={18} className="text-brand-accent mt-1"/>}
                  <div className="text-right">
                    <div className="text-xs font-black text-text-primary">{model.name}</div>
                    <div className="text-[10px] text-text-subtle mt-1 font-bold">{model.desc}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-3">
             <button className="p-3 text-text-subtle hover:text-brand-primary transition-all bg-panel rounded-xl border border-border-subtle shadow-sm active:scale-90"><RefreshCcw size={18} /></button>
             <button className="p-3 text-text-subtle hover:text-brand-primary transition-all bg-panel rounded-xl border border-border-subtle shadow-sm active:scale-90"><Settings2 size={18} /></button>
          </div>
        </div>

        {/* Chat Stream */}
        <div className="flex-1 overflow-y-auto p-8 space-y-10 custom-scrollbar">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex gap-5 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg ${msg.role === 'assistant' ? 'bg-brand-primary text-white border border-white/10' : 'bg-panel border border-border-subtle text-text-secondary'}`}>
                {msg.role === 'assistant' ? <Zap size={22} fill="currentColor" className="text-brand-accent"/> : <User size={24} />}
              </div>
              <div className={`max-w-[75%] space-y-2 ${msg.role === 'user' ? 'items-end flex flex-col' : ''}`}>
                <div className={`p-6 rounded-[2rem] text-sm leading-relaxed whitespace-pre-wrap shadow-sm border ${msg.role === 'user' ? 'bg-brand-primary text-white border-transparent rounded-tr-none' : 'bg-panel border-border-subtle text-text-primary rounded-tl-none'}`}>
                  {msg.content}
                </div>
                <div className="text-[9px] font-black text-text-subtle uppercase tracking-widest px-2">
                   {msg.timestamp.toLocaleTimeString()} {msg.model && `• ${msg.model}`}
                </div>
              </div>
            </div>
          ))}
          {isTyping && (
             <div className="flex gap-5">
               <div className="w-12 h-12 rounded-2xl bg-brand-primary flex items-center justify-center shadow-lg border border-white/10"><Bot size={24} className="text-white animate-pulse" /></div>
               <div className="bg-panel border border-border-subtle p-5 rounded-[2rem] rounded-tl-none flex items-center gap-2">
                  <div className="w-2 h-2 bg-brand-accent rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-brand-accent rounded-full animate-bounce delay-75"></div>
                  <div className="w-2 h-2 bg-brand-accent rounded-full animate-bounce delay-150"></div>
               </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-6 bg-canvas/50 border-t border-border-subtle backdrop-blur-md">
          <div className="max-w-[1000px] mx-auto bg-panel border-2 border-border-subtle rounded-3xl p-2.5 flex items-center gap-3 focus-within:border-brand-primary transition-all shadow-inner relative group">
             <div className="absolute -top-12 right-0 opacity-0 group-focus-within:opacity-100 transition-opacity">
                <span className="text-[10px] font-black text-brand-primary uppercase tracking-widest bg-brand-primary/5 px-3 py-1 rounded-full border border-brand-primary/10">Allam_Core_v7.0: Active</span>
             </div>
             <textarea 
               value={inputValue}
               onChange={(e) => setInputValue(e.target.value)}
               onKeyDown={(e) => { if(e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
               placeholder="اكتب استفسارك السيادي هنا..."
               className="w-full bg-transparent border-none outline-none text-text-primary px-4 py-3 flex-1 resize-none font-tajawal text-sm custom-scrollbar"
               dir="rtl"
               rows={1}
             />
             <div className="flex items-center gap-2 px-2">
               <button className="p-3 text-text-subtle hover:text-brand-primary hover:bg-canvas rounded-2xl transition-all"><Paperclip size={20} /></button>
               <button className="p-3 text-text-subtle hover:text-brand-accent hover:bg-canvas rounded-2xl transition-all"><Mic size={20} /></button>
               <button onClick={handleSend} disabled={!inputValue.trim() || isTyping} className="bg-brand-primary hover:bg-brand-primary-hover text-white p-4 rounded-2xl transition-all disabled:opacity-50 shadow-glow-blue active:scale-95"><Send size={20} /></button>
             </div>
          </div>
        </div>
      </div>

      {/* Sidebar: Archive */}
      <div className="hidden xl:block xl:col-span-3 flex flex-col bg-panel/50 backdrop-blur-md rounded-[2.5rem] border border-border-subtle shadow-elevation overflow-hidden">
         <div className="p-6 border-b border-border-subtle bg-canvas/30">
            <h3 className="text-xs font-black text-text-primary uppercase tracking-[0.2em] flex items-center gap-3"><History size={16} className="text-brand-primary"/> أرشيف التحقيقات</h3>
         </div>
         <div className="flex-1 overflow-y-auto p-5 space-y-3 custom-scrollbar">
            {['تحليل ميزانية الميناء', 'فحص تزييف فيديو الوزير', 'رصد Bots الحملة الأخيرة'].map((chat, i) => (
               <button key={i} className="w-full text-right p-4 rounded-2xl hover:bg-panel transition-all group flex justify-between items-center border border-transparent hover:border-border-subtle hover:shadow-sm">
                  <span className="text-[11px] font-black text-text-secondary truncate">{chat}</span>
                  <ArrowUpRight size={14} className="text-brand-primary opacity-0 group-hover:opacity-100 transition-opacity" />
               </button>
            ))}
         </div>
         <div className="p-5 border-t border-border-subtle bg-slate-950/10">
            <button className="w-full py-4 rounded-2xl border-2 border-dashed border-border-subtle text-text-subtle hover:text-brand-primary hover:border-brand-primary hover:bg-panel transition-all flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-widest">
               <Shield size={16} /> الوصول للأرشيف الميداني
            </button>
         </div>
      </div>
    </div>
  );
};

export default PublicChatInterface;
