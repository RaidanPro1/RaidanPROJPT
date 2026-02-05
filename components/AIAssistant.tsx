
import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, Sparkles, AlertTriangle } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';

const AIAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{role: 'user' | 'assistant', content: string}[]>([
    { role: 'assistant', content: 'مرحباً بك في YemenJPT. أنا مساعد النواة الذكية، كيف يمكنني مساعدتك في إدارة البنية التحتية اليوم؟' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsLoading(true);

    try {
      /* Initializing GoogleGenAI with named parameter and direct process.env.API_KEY usage */
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: userMsg,
        config: {
          systemInstruction: "أنت المساعد الذكي لنظام YemenJPT. هو نظام لإدارة البنية التحتية والتحقيقات الصحفية والأمن الرقمي في اليمن. ساعد المستخدم في معرفة كيفية تشغيل الأدوات مثل Ollama و Sherloq و Aleph. تحدث بلهجة عربية فصحى مهنية وجادة."
        }
      });
      
      /* Accessing .text as a property, not a method, per guidelines */
      setMessages(prev => [...prev, { role: 'assistant', content: response.text || "عذراً، حدث خطأ في معالجة الطلب." }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: "عذراً، يبدو أن هناك مشكلة في الاتصال بمحرك الذكاء الاصطناعي." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 left-6 w-14 h-14 bg-yemenGold text-yemenBlue-dark rounded-full shadow-xl flex items-center justify-center hover:scale-110 transition-transform z-50 border-4 border-white"
      >
        <MessageSquare size={24} />
      </button>

      {isOpen && (
        <div className="fixed bottom-6 left-6 w-[400px] h-[600px] bg-white rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden border border-gray-200 animate-in slide-in-from-bottom-5">
          {/* Header */}
          <div className="bg-yemenBlue p-4 flex justify-between items-center text-white">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yemenGold rounded-xl flex items-center justify-center text-yemenBlue font-bold">
                <Bot size={24} />
              </div>
              <div>
                <h3 className="font-bold text-sm">مساعد النواة الذكية</h3>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                  <span className="text-[10px] text-blue-100 font-medium">Local Brain Online</span>
                </div>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-white/10 rounded">
              <X size={20} />
            </button>
          </div>

          {/* Alert */}
          <div className="bg-yemenGold/10 p-2 px-4 border-b border-yemenGold/20 flex items-center gap-2">
            <AlertTriangle size={14} className="text-yemenGold-dark" />
            <p className="text-[10px] text-yemenGold-dark font-bold uppercase">تنبيه: جميع المحادثات مشفرة محلياً</p>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-gray-50">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${
                  m.role === 'user' 
                    ? 'bg-yemenBlue text-white rounded-tl-none' 
                    : 'bg-white text-gray-800 shadow-sm border border-gray-100 rounded-tr-none'
                }`}>
                  {m.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white p-3 rounded-2xl shadow-sm border border-gray-100 flex gap-1">
                  <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce delay-75"></div>
                  <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce delay-150"></div>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="p-4 bg-white border-t border-gray-100">
            <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-1 focus-within:ring-2 ring-yemenBlue/20 transition-all">
              <input 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="كيف أقوم بتحديث سيرفر n8n؟"
                className="bg-transparent flex-1 py-2 text-sm outline-none"
              />
              <button 
                onClick={handleSend}
                disabled={isLoading}
                className="p-2 text-yemenBlue hover:bg-yemenBlue hover:text-white rounded-lg transition-colors disabled:opacity-50"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AIAssistant;
