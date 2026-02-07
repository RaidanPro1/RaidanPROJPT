
import React, { useState, useRef, useEffect } from 'react';
import { 
    X, Send, Sparkles, MessageSquareText, Mic, MicOff, 
    Volume2, VolumeX, ShieldCheck, Zap, Radio, Loader2,
    Activity, Play, Pause, Waves
} from 'lucide-react';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';
import { useSettings } from '../context/SettingsContext';

// Audio Helpers
function encode(bytes: Uint8Array) {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(data: Uint8Array, ctx: AudioContext, sampleRate: number, numChannels: number): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

const AIAssistant: React.FC = () => {
  const { settings } = useSettings();
  const [isOpen, setIsOpen] = useState(false);
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const [isLiveActive, setIsLiveActive] = useState(false);
  const [messages, setMessages] = useState<{role: 'user' | 'assistant', content: string}[]>([
    { role: 'assistant', content: 'مرحباً بك في مركز التحقيق الصوتي. أنا "علام"، كيف يمكنني مساعدتك اليوم؟' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const sessionRef = useRef<any>(null);
  const nextStartTimeRef = useRef(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isOpen, isLiveActive]);

  const toggleVoiceMode = async () => {
    if (isLiveActive) {
      stopLiveSession();
    } else {
      await startLiveSession();
    }
  };

  const startLiveSession = async () => {
    setIsLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const inputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      const outputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      audioContextRef.current = outputCtx;
      
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
        callbacks: {
          onopen: () => {
            setIsLiveActive(true);
            setIsLoading(false);
            const source = inputCtx.createMediaStreamSource(stream);
            const scriptProcessor = inputCtx.createScriptProcessor(4096, 1, 1);
            scriptProcessor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const l = inputData.length;
              const int16 = new Int16Array(l);
              for (let i = 0; i < l; i++) int16[i] = inputData[i] * 32768;
              const pcmBlob = {
                data: encode(new Uint8Array(int16.buffer)),
                mimeType: 'audio/pcm;rate=16000',
              };
              sessionPromise.then(s => s.sendRealtimeInput({ media: pcmBlob }));
            };
            source.connect(scriptProcessor);
            scriptProcessor.connect(inputCtx.destination);
          },
          onmessage: async (message: LiveServerMessage) => {
            const audioData = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (audioData) {
              const ctx = audioContextRef.current!;
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, ctx.currentTime);
              const audioBuffer = await decodeAudioData(decode(audioData), ctx, 24000, 1);
              const source = ctx.createBufferSource();
              source.buffer = audioBuffer;
              source.connect(ctx.destination);
              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current += audioBuffer.duration;
              sourcesRef.current.add(source);
              source.onended = () => sourcesRef.current.delete(source);
            }
            if (message.serverContent?.interrupted) {
              sourcesRef.current.forEach(s => s.stop());
              sourcesRef.current.clear();
              nextStartTimeRef.current = 0;
            }
          },
          onclose: () => stopLiveSession(),
          onerror: (e) => { console.error(e); stopLiveSession(); }
        },
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Puck' } } },
          systemInstruction: settings.googleConfig.systemInstruction
        }
      });
      sessionRef.current = sessionPromise;
    } catch (err) {
      console.error(err);
      setIsLoading(false);
    }
  };

  const stopLiveSession = () => {
    setIsLiveActive(false);
    if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
        streamRef.current = null;
    }
    if (sessionRef.current) {
        sessionRef.current.then((s: any) => s.close());
        sessionRef.current = null;
    }
    sourcesRef.current.forEach(s => s.stop());
    sourcesRef.current.clear();
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: settings.googleConfig.defaultModel,
        contents: userMsg,
        config: { systemInstruction: settings.googleConfig.systemInstruction, temperature: 0.2 }
      });
      setMessages(prev => [...prev, { role: 'assistant', content: response.text || "عذراً، لم أستطع معالجة طلبك." }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: "خطأ في الاتصال بالنواة." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 left-8 w-20 h-20 bg-brand-primary text-white rounded-[2rem] shadow-2xl flex items-center justify-center hover:scale-110 transition-all z-50 border-2 border-brand-accent/40 group overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-brand-primary to-brand-accent opacity-0 group-hover:opacity-20 transition-opacity"></div>
        <MessageSquareText size={32} className="group-hover:rotate-6 transition-transform text-white" />
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-panel animate-pulse shadow-glow-green"></div>
      </button>

      {isOpen && (
        <div className="fixed bottom-32 left-8 w-[480px] h-[700px] bg-panel/95 backdrop-blur-xl rounded-[3rem] shadow-elevation z-50 flex flex-col overflow-hidden border border-border-subtle animate-in slide-in-from-bottom-8 duration-500">
          
          {/* Header */}
          <div className="p-6 border-b border-border-subtle flex justify-between items-center relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-primary via-brand-accent to-brand-primary"></div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-brand-primary rounded-2xl flex items-center justify-center text-white border border-white/10 shadow-lg relative overflow-hidden">
                {isLiveActive ? <Activity size={24} className="animate-pulse text-brand-accent" /> : <Sparkles size={24} />}
                {isLiveActive && <div className="absolute inset-0 bg-brand-accent/10 animate-ping"></div>}
              </div>
              <div>
                <h3 className="font-black text-text-primary text-lg uppercase tracking-tight leading-none">علام (Allam-AI)</h3>
                <span className={`text-[10px] font-black uppercase mt-1.5 block tracking-widest ${isLiveActive ? 'text-brand-accent animate-pulse' : 'text-green-500'}`}>
                    {isLiveActive ? 'Live Voice Session' : 'Sovereign Connection: Active'}
                </span>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="p-3 text-text-subtle hover:text-red-500 transition-all bg-canvas rounded-xl border border-border-subtle">
              <X size={20} />
            </button>
          </div>

          {/* Messages Area */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar bg-canvas/30">
            {isLiveActive && (
                <div className="h-full flex flex-col items-center justify-center space-y-10 animate-in zoom-in-95">
                    <div className="flex items-center gap-1.5 h-16">
                        {[...Array(12)].map((_, i) => (
                            <div key={i} className="w-1.5 bg-brand-primary rounded-full animate-bounce shadow-glow-blue" style={{ height: `${Math.random() * 100}%`, animationDelay: `${i * 100}ms` }}></div>
                        ))}
                    </div>
                    <p className="text-sm font-black text-brand-primary uppercase tracking-[0.3em] animate-pulse">علام يستمع إليك الآن...</p>
                    <button onClick={stopLiveSession} className="bg-red-500/10 border border-red-500/20 text-red-500 px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all shadow-lg active:scale-95">إنهاء الجلسة الصوتية</button>
                </div>
            )}

            {!isLiveActive && messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`relative max-w-[85%] p-5 rounded-[2rem] text-sm leading-relaxed shadow-sm border ${
                  m.role === 'user' 
                    ? 'bg-brand-primary text-white border-transparent rounded-br-none font-bold' 
                    : 'bg-panel text-text-primary border-border-subtle rounded-bl-none shadow-md'
                }`}>
                  {m.content}
                </div>
              </div>
            ))}
            
            {!isLiveActive && isLoading && (
              <div className="flex justify-start">
                 <div className="bg-panel border border-border-subtle p-5 rounded-[2rem] rounded-bl-none flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-brand-primary rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 bg-brand-primary rounded-full animate-bounce delay-75"></div>
                    <div className="w-1.5 h-1.5 bg-brand-primary rounded-full animate-bounce delay-150"></div>
                 </div>
              </div>
            )}
          </div>

          {/* Footer UI */}
          <div className="p-6 bg-panel/90 border-t border-border-subtle backdrop-blur-xl">
            <div className="flex items-center gap-4">
              <button 
                onClick={toggleVoiceMode}
                disabled={isLoading}
                className={`p-4 rounded-2xl transition-all shadow-lg active:scale-90 flex-shrink-0 ${
                    isLiveActive 
                    ? 'bg-red-500 text-white shadow-red-500/20' 
                    : 'bg-brand-accent text-slate-950 shadow-brand-accent/20 hover:scale-105'
                }`}
                title="المحادثة الصوتية المباشرة"
              >
                {isLiveActive ? <MicOff size={24} /> : <Mic size={24} />}
              </button>

              {!isLiveActive && (
                <div className="flex-1 bg-canvas border-2 border-border-subtle rounded-2xl p-1.5 flex items-center gap-2 focus-within:border-brand-primary transition-all shadow-inner">
                  <input 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="اسأل علام..."
                    className="bg-transparent flex-1 py-2 px-3 text-sm outline-none text-text-primary font-tajawal"
                    dir="rtl"
                  />
                  <button 
                    onClick={handleSend}
                    disabled={isLoading || !input.trim()}
                    className="p-2.5 bg-brand-primary text-white hover:bg-brand-primary-hover rounded-xl transition-all disabled:opacity-30 shadow-md"
                  >
                    <Send size={18} />
                  </button>
                </div>
              )}
            </div>
            {isLiveActive && (
                <div className="mt-4 flex justify-center">
                    <div className="flex gap-1 items-center">
                       <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-ping"></span>
                       <span className="text-[10px] font-black text-text-subtle uppercase tracking-widest">Sovereign Voice Stream Active</span>
                    </div>
                </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default AIAssistant;
