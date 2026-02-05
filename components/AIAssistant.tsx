
import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, Sparkles, AlertTriangle, Scale, Book, Search, ShieldCheck, Share2, FileSearch, FunctionSquare, Globe } from 'lucide-react';
import { GoogleGenAI, FunctionDeclaration, Type } from '@google/genai';
import { useSettings } from '../context/SettingsContext';

// MCP Protocol: Define system tools for Gemini Function Calling
const systemTools: FunctionDeclaration[] = [
  {
    name: 'query_yemen_stats',
    description: 'Fetches time-series statistical data for Yemen from the Yemen Core database.',
    parameters: {
      type: Type.OBJECT,
      properties: {
        indicator: {
          type: Type.STRING,
          description: 'The specific indicator code to query, e.g., "gdp_usd" or "population_total".'
        },
      },
      required: ['indicator'],
    },
  },
];


const AIAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{role: 'user' | 'assistant' | 'tool', content: string, metadata?: any}[]>([
    { 
      role: 'assistant', 
      content: 'مرحباً بك في وحدة الاستشارة والتحقيق السيادية. أنا خبير "ريدان"، مدمج بالكامل مع أرشيف Aleph و خدمات Google المؤمنة. كيف يمكنني مساعدتك؟' 
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [personaSystemPrompt, setPersonaSystemPrompt] = useState<string>('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const { settings } = useSettings();

  useEffect(() => {
    const loadPersona = async () => {
      try {
        const response = await fetch('/data/config/ai_persona.json');
        if (response.ok) {
          const data = await response.json();
          let template = data.system_prompt_template || '';
          
          // Interpolate template values
          template = template.replace(/\{([\w\.]+)\}/g, (_: string, key: string) => {
            const keys = key.split('.');
            let val = data;
            for (const k of keys) {
              val = val?.[k];
              if (val === undefined) return '';
            }
            return String(val);
          });
          
          setPersonaSystemPrompt(template);
        }
      } catch (error) {
        console.error("Failed to load AI persona:", error);
      }
    };
    loadPersona();
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);
  
  // MCP Protocol: Function to handle tool calls from Gemini
  const handleToolCall = async (toolCall: any) => {
    const { name, args } = toolCall;
    if (name === 'query_yemen_stats') {
        setMessages(prev => [...prev, { role: 'assistant', content: `استدعاء أداة MCP: جارٍ الاستعلام عن مؤشر \`${args.indicator}\` من Yemen Core...`, metadata: {isToolLog: true} }]);
        try {
            // This would be an API call to the Yemen Core backend
            const response = await fetch(`http://127.0.0.1:8001/api/v1/core/statistic/${args.indicator}`);
            if (!response.ok) throw new Error(`API Error: ${response.statusText}`);
            const data = await response.json();
            
            // Return the result to Gemini
            return {
                toolCall,
                toolResponse: {
                    name,
                    response: { result: JSON.stringify(data) }
                }
            };
        } catch (error: any) {
            return {
                toolCall,
                toolResponse: {
                    name,
                    response: { error: `Failed to fetch data: ${error.message}` }
                }
            };
        }
    }
    return null; // Tool not found
  };


  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsLoading(true);

    try {
      // Use the API key from environment variable, falling back to process.env if available in context logic
      const apiKey = process.env.API_KEY; 
      const ai = new GoogleGenAI({ apiKey: apiKey });
      
      // CONFIGURATION GOVERNANCE:
      // Combine the dynamic Settings Doctrine with the loaded Persona
      const combinedSystemInstruction = [
        personaSystemPrompt,
        settings.systemDoctrine
      ].filter(Boolean).join("\n\n--- OPERATIONAL DOCTRINE ---\n");

      const genAIConfig: any = {
        systemInstruction: combinedSystemInstruction,
        tools: [{functionDeclarations: systemTools}], // MCP Tools
      };
      
      // Feature Flag: Enable Google Search Grounding if Root permitted it
      if (settings.googleConfig.enableSearchGrounding) {
        genAIConfig.tools.push({googleSearch: {}});
      }

      // Feature Flag: Enable Thinking if budget is allocated
      if (settings.googleConfig.thinkingBudget > 0) {
          genAIConfig.thinkingConfig = { thinkingBudget: settings.googleConfig.thinkingBudget };
      }

      const modelName = settings.googleConfig.thinkingBudget > 0 ? 'gemini-2.5-flash-thinking-preview-0121' : 'gemini-3-pro-preview';

      const response = await ai.models.generateContent({
        model: modelName,
        contents: userMsg,
        config: genAIConfig
      });
      
      // Check for function calls (MCP Protocol)
      if (response.functionCalls && response.functionCalls.length > 0) {
        const toolCall = response.functionCalls[0];
        const toolResult = await handleToolCall(toolCall);
        if (toolResult) {
            // Send the tool response back to the model
            const finalResponse = await ai.models.generateContent({
                model: modelName,
                // FIX: The `contents` array for a multi-turn request must be an array of `Content` objects.
                contents: [
                  { role: 'user', parts: [{ text: userMsg }] },
                  response.candidates[0].content, // Model's previous turn with the function call
                  { role: 'tool', parts: [{ functionResponse: toolResult.toolResponse }] },
                ],
                config: genAIConfig
            });
            
            // Check for grounding in the final response
            let groundingText = "";
            if (finalResponse.candidates?.[0]?.groundingMetadata?.groundingChunks) {
                const chunks = finalResponse.candidates[0].groundingMetadata.groundingChunks;
                const urls = chunks.map((c: any) => c.web?.uri).filter(Boolean);
                if (urls.length > 0) {
                    groundingText = "\n\n**المصادر الموثقة (Google Grounding):**\n" + urls.map((u: string) => `- [${new URL(u).hostname}](${u})`).join("\n");
                }
            }

            setMessages(prev => [...prev, { role: 'assistant', content: (finalResponse.text || "تم تنفيذ الأداة.") + groundingText }]);
        }
      } else {
        // Normal response with Grounding check
        let groundingText = "";
        if (response.candidates?.[0]?.groundingMetadata?.groundingChunks) {
            const chunks = response.candidates[0].groundingMetadata.groundingChunks;
            const urls = chunks.map((c: any) => c.web?.uri).filter(Boolean);
            if (urls.length > 0) {
                groundingText = "\n\n**المصادر الموثقة (Google Grounding):**\n" + urls.map((u: string) => `- [${new URL(u).hostname}](${u})`).join("\n");
            }
        }

        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: (response.text || "عذراً، تعذر الوصول لبروتوكول التحليل الاستقصائي حالياً.") + groundingText
        }]);
      }

    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { role: 'assistant', content: "خطأ في الاتصال بنواة الذكاء الاستقصائي. يرجى التحقق من حالة سيرفر Aleph المحلي أو مفتاح Gemini API." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 left-6 w-16 h-16 bg-brand-primary text-white rounded-2xl shadow-elevation flex items-center justify-center hover:scale-105 transition-all z-50 border-2 border-brand-accent/50 group"
      >
        <Scale size={28} className="group-hover:rotate-12 transition-transform" />
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-panel animate-pulse"></div>
      </button>

      {isOpen && (
        <div className="fixed bottom-24 left-6 w-[450px] h-[650px] bg-panel rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden border border-border-subtle animate-in slide-in-from-bottom-5">
          <div className="bg-panel p-5 border-b border-border-subtle flex justify-between items-center relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-primary via-brand-accent to-brand-primary"></div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-brand-primary/10 rounded-xl flex items-center justify-center text-brand-primary border border-brand-primary/20">
                <Share2 size={24} />
              </div>
              <div>
                <h3 className="font-black text-text-primary text-sm uppercase tracking-widest font-tajawal leading-none">مستشار ريدان الاستقصائي</h3>
                <div className="flex items-center gap-1.5 mt-1.5">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-[9px] text-text-subtle font-bold uppercase tracking-widest">
                    {settings.googleConfig.enableSearchGrounding ? "Google Grounding ON" : "Local Context Only"}
                  </span>
                </div>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="p-2 text-text-subtle hover:text-text-primary transition-colors bg-canvas rounded-lg">
              <X size={18} />
            </button>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-6 custom-scrollbar bg-canvas">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {m.metadata?.isToolLog ? (
                    <div className="max-w-[90%] p-3 rounded-lg text-xs bg-slate-800 text-yemenGold font-mono flex items-center gap-3 animate-in fade-in">
                        <FunctionSquare size={16} />
                        {m.content}
                    </div>
                ) : (
                    <div className={`relative max-w-[90%] p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${
                      m.role === 'user' 
                        ? 'bg-brand-primary text-white rounded-br-none' 
                        : 'bg-panel text-text-secondary border border-border-subtle rounded-bl-none'
                    }`}>
                      <div dangerouslySetInnerHTML={{__html: m.content.replace(/\n/g, '<br/>').replace(/\*\*(.*?)\*\*/g, '<b>$1</b>').replace(/- \[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" class="text-blue-500 hover:underline flex items-center gap-1 mt-1"><Globe size={10}/> $1</a>')}} />
                    </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-panel p-4 rounded-2xl border border-border-subtle flex gap-1.5">
                  <div className="w-1.5 h-1.5 bg-brand-accent rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-brand-accent rounded-full animate-bounce delay-75"></div>
                  <div className="w-1.5 h-1.5 bg-brand-accent rounded-full animate-bounce delay-150"></div>
                </div>
              </div>
            )}
          </div>

          <div className="p-5 bg-panel/80 border-t border-border-subtle backdrop-blur-sm">
            <div className="flex items-center gap-3 bg-panel border border-border-subtle rounded-xl px-4 py-2 focus-within:border-brand-primary transition-all shadow-sm">
              <input 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="اسأل عن إحصائيات الناتج المحلي..."
                className="bg-transparent flex-1 py-2 text-xs outline-none text-text-primary font-tajawal"
                dir="rtl"
              />
              <button 
                onClick={handleSend}
                disabled={isLoading}
                className="p-2.5 bg-brand-primary text-white hover:bg-brand-primary-hover rounded-lg transition-all disabled:opacity-30 shadow-md"
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
