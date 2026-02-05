
import React, { useState } from 'react';
import { 
  Send, Bot, User, Sparkles, Zap, Image as ImageIcon, 
  Mic, Paperclip, ChevronDown, RefreshCcw, MoreVertical,
  Settings2, Code2, PenTool, Search, Shield
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
  const { settings, userRole } = useSettings();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: 'مرحباً بك في واجهة الدردشة السيادية. أنا مساعدك الذكي المزود بقدرات RaidanPro الهجينة. يمكنك اختيار النموذج المناسب لمهمتك من القائمة في الأعلى.',
      timestamp: new Date(),
      model: 'System'
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [selectedModel, setSelectedModel] = useState<string>('gemini-1.5-pro');
  const [operationMode, setOperationMode] = useState<'general' | 'analysis' | 'coding' | 'creative'>('general');
  const [isTyping, setIsTyping] = useState(false);

  const models = [
    { id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro (Cloud)', type: 'cloud', desc: 'للتحليل العميق والبحث' },
    { id: 'gemini-1.5-flash', name: 'Gemini 1.5 Flash (Cloud)', type: 'cloud', desc: 'للسرعة والاستجابات القصيرة' },
    { id: 'qwen-2.5-32b', name: 'Qwen 2.5 32B (Local)', type: 'local', desc: 'للسيادة والخصوصية التامة' },
    { id: 'llama-3-70b', name: 'Llama 3 70B (Local)', type: 'local', desc: 'للمهام الإبداعية المعقدة' },
  ];

  const operationModes = [
    { id: 'general', label: 'عام', icon: <Sparkles size={16} /> },
    { id: 'analysis', label: 'تحليل', icon: <Search size={16} /> },
    { id: 'coding', label: 'برمجة', icon: <Code2 size={16} /> },
    { id: 'creative', label: 'إبداع', icon: <PenTool size={16} /> },
  ];

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI Response
    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `هذا رد محاكاة من الموديل **${selectedModel}** في وضع **${operationMode}**. \n\nيعتمد هذا النظام على التوجيه الهجين لضمان أقصى درجات الأمان والخصوصية للبيانات.`,
        timestamp: new Date(),
        model: selectedModel
      }]);
    }, 2000);
  };

  return (
    <div className="flex h-[calc(100vh-140px)] gap-6 animate-in fade-in duration-700">
      
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-panel rounded-3xl border border-border-subtle shadow-elevation overflow-hidden relative">
        
        {/* Header & Controls */}
        <div className="p-4 border-b border-border-subtle bg-panel/80 backdrop-blur-md z-10 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="relative group">
              <button className="flex items-center gap-2 px-4 py-2 bg-canvas border border-border-subtle rounded-xl text-sm font-black text-text-primary hover:border-brand-primary transition-all">
                <Bot size={18} className={selectedModel.includes('local') ? 'text-green-500' : 'text-brand-accent'} />
                <span>{models.find(m => m.id === selectedModel)?.name}</span>
                <ChevronDown size={14} className="text-text-subtle" />
              </button>
              
              {/* Dropdown */}
              <div className="absolute top-full right-0 mt-2 w-72 bg-panel border border-border-subtle rounded-xl shadow-2xl p-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                <span className="text-[10px] font-black text-text-subtle px-2 py-1 block uppercase tracking-widest">Select Intelligence Core</span>
                {models.map(model => (
                  <button 
                    key={model.id}
                    onClick={() => setSelectedModel(model.id)}
                    className={`w-full text-right p-3 rounded-lg flex items-start gap-3 transition-colors ${selectedModel === model.id ? 'bg-brand-primary/10 border border-brand-primary/20' : 'hover:bg-canvas'}`}
                  >
                    <div className={`mt-1 w-2 h-2 rounded-full ${model.type === 'local' ? 'bg-green-500' : 'bg-brand-accent'}`}></div>
                    <div>
                      <div className="text-xs font-bold text-text-primary">{model.name}</div>
                      <div className="text-[10px] text-text-subtle">{model.desc}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="h-6 w-px bg-border-subtle"></div>

            <div className="flex bg-canvas p-1 rounded-xl border border-border-subtle">
              {operationModes.map(mode => (
                <button
                  key={mode.id}
                  onClick={() => setOperationMode(mode.id as any)}
                  className={`px-3 py-1.5 rounded-lg flex items-center gap-2 text-[10px] font-bold transition-all ${
                    operationMode === mode.id 
                    ? 'bg-brand-primary text-white shadow-md' 
                    : 'text-text-subtle hover:text-text-primary hover:bg-panel'
                  }`}
                >
                  {mode.icon}
                  <span className="hidden xl:inline">{mode.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
             <button className="p-2 text-text-subtle hover:text-brand-primary transition-colors"><RefreshCcw size={18} /></button>
             <button className="p-2 text-text-subtle hover:text-brand-primary transition-colors"><Settings2 size={18} /></button>
          </div>
        </div>

        {/* Chat Stream */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                msg.role === 'assistant' 
                ? 'bg-gradient-to-br from-brand-primary to-brand-primary-hover text-white shadow-lg' 
                : 'bg-canvas border border-border-subtle text-text-secondary'
              }`}>
                {msg.role === 'assistant' ? <Sparkles size={20} /> : <User size={20} />}
              </div>
              
              <div className={`max-w-[70%] space-y-2 ${msg.role === 'user' ? 'items-end flex flex-col' : ''}`}>
                {msg.role === 'assistant' && (
                  <div className="flex items-center gap-2 text-[10px] text-text-subtle font-bold uppercase tracking-wider">
                    <span>{msg.model}</span>
                    <span className="text-text-subtle/50">•</span>
                    <span>{msg.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                  </div>
                )}
                
                <div className={`p-5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap shadow-sm ${
                  msg.role === 'user' 
                  ? 'bg-brand-primary text-white rounded-tr-none' 
                  : 'bg-canvas border border-border-subtle text-text-primary rounded-tl-none'
                }`}>
                  {msg.content}
                </div>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex gap-4">
               <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-primary to-brand-primary-hover flex items-center justify-center shadow-lg">
                  <Bot size={20} className="text-white animate-pulse" />
               </div>
               <div className="bg-canvas border border-border-subtle p-4 rounded-2xl rounded-tl-none flex items-center gap-1.5">
                  <div className="w-2 h-2 bg-brand-accent rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-brand-accent rounded-full animate-bounce delay-75"></div>
                  <div className="w-2 h-2 bg-brand-accent rounded-full animate-bounce delay-150"></div>
               </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-6 pt-0 z-20">
          <div className="bg-canvas border border-border-subtle rounded-3xl p-2 shadow-lg flex flex-col gap-2 focus-within:border-brand-primary/50 focus-within:shadow-glow-accent transition-all duration-300">
             <textarea 
               value={inputValue}
               onChange={(e) => setInputValue(e.target.value)}
               onKeyDown={(e) => { if(e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
               placeholder="اكتب رسالتك هنا... (Shift+Enter لسطر جديد)"
               className="w-full bg-transparent border-none outline-none text-text-primary px-4 py-3 min-h-[60px] max-h-[200px] resize-none font-tajawal custom-scrollbar"
               dir="rtl"
             />
             
             <div className="flex justify-between items-center px-2 pb-1">
                <div className="flex items-center gap-1">
                   <button className="p-2 text-text-subtle hover:text-brand-primary hover:bg-panel rounded-xl transition-all" title="إرفاق صورة"><ImageIcon size={18} /></button>
                   <button className="p-2 text-text-subtle hover:text-brand-primary hover:bg-panel rounded-xl transition-all" title="تسجيل صوتي"><Mic size={18} /></button>
                   <button className="p-2 text-text-subtle hover:text-brand-primary hover:bg-panel rounded-xl transition-all" title="إرفاق ملف"><Paperclip size={18} /></button>
                </div>
                
                <button 
                  onClick={handleSend}
                  disabled={!inputValue.trim() || isTyping}
                  className="bg-brand-primary hover:bg-brand-primary-hover text-white p-3 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md flex items-center gap-2"
                >
                   <span className="text-xs font-black px-2 hidden md:inline">إرسال</span>
                   <Send size={18} className={inputValue.trim() ? '' : 'opacity-50'} />
                </button>
             </div>
          </div>
          <p className="text-center text-[10px] text-text-subtle mt-3 font-bold">
            قد يقوم النموذج بتوليد معلومات غير دقيقة. يرجى التحقق من المعلومات الحساسة. النظام محمي بموجب بروتوكول RaidanPro السيادي.
          </p>
        </div>
      </div>

      {/* History Sidebar (Collapsible) */}
      <div className="w-80 hidden xl:flex flex-col bg-panel rounded-3xl border border-border-subtle shadow-elevation overflow-hidden">
         <div className="p-5 border-b border-border-subtle bg-slate-50/50 backdrop-blur-sm">
            <h3 className="text-sm font-black text-text-primary uppercase tracking-widest">سجل المحادثات</h3>
         </div>
         <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
            {['تحليل بيانات الميناء', 'صياغة تقرير استقصائي', 'بحث عن شركات وهمية', 'ترجمة وثائق قانونية'].map((chat, i) => (
               <button key={i} className="w-full text-right p-3 rounded-xl hover:bg-canvas transition-all group flex justify-between items-center border border-transparent hover:border-border-subtle">
                  <span className="text-xs font-bold text-text-secondary truncate">{chat}</span>
                  <ChevronDown size={14} className="text-text-subtle opacity-0 group-hover:opacity-100 -rotate-90" />
               </button>
            ))}
         </div>
         <div className="p-4 border-t border-border-subtle">
            <button className="w-full py-3 rounded-xl border border-dashed border-border-subtle text-text-subtle hover:text-brand-primary hover:border-brand-primary hover:bg-canvas transition-all flex items-center justify-center gap-2 text-xs font-black uppercase tracking-widest">
               <Shield size={14} /> أرشيف آمن
            </button>
         </div>
      </div>
    </div>
  );
};

export default PublicChatInterface;
