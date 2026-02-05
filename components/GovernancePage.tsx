import React, { useState } from 'react';
import { 
  BookText, Scale, Shield, Brain, SlidersHorizontal, 
  Database, Zap, Save, RefreshCcw, Search, AlertTriangle, CheckCircle2,
  Check
} from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

type Tab = 'legal' | 'models' | 'fallback' | 'knowledge';

const GovernancePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('legal');
  const { settings, updateSetting } = useSettings();
  
  const handleSave = () => {
    // The context already saves to localStorage on change.
    // This is just for user feedback.
    alert('تم حفظ وتعميم عقيدة النظام الجديدة بنجاح.');
  };
  
  // A local state to manage the textarea to avoid re-rendering on every keystroke
  // but still get the initial value from context.
  const [doctrine, setDoctrine] = useState(settings.systemDoctrine);


  return (
    <div className="space-y-6 animate-in fade-in duration-700 pb-20 font-tajawal">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl flex flex-col xl:flex-row items-center justify-between gap-6 border border-slate-200 border-r-4 border-yemenBlue shadow-tactical">
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 bg-yemenBlue/10 rounded-xl flex items-center justify-center text-yemenBlue border border-yemenBlue/20">
            <BookText size={28} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-900 leading-none uppercase">إدارة عقيدة النظام (System Doctrine)</h2>
            <p className="text-[10px] text-yemenBlue font-bold uppercase tracking-[0.3em] mt-2">AI Ethics, Behavior & Knowledge Source Control</p>
          </div>
        </div>
        <button 
          onClick={() => {
            // Update context on save
            updateSetting('systemDoctrine', doctrine);
            handleSave();
          }}
          className="bg-yemenBlue hover:bg-yemenBlue-hover text-white px-8 py-3 rounded-xl font-black text-xs uppercase tracking-[0.2em] transition-all shadow-md flex items-center gap-3 active:scale-95"
        >
          <Save size={18} />
          حفظ وتعميم العقيدة
        </button>
      </div>

      {/* Tabs */}
      <div className="bg-slate-100 p-2 rounded-xl border border-slate-200 flex flex-wrap gap-2">
        <TabButton id="legal" activeTab={activeTab} setActiveTab={setActiveTab} icon={<Scale />}>البروتوكولات الأخلاقية</TabButton>
        <TabButton id="models" activeTab={activeTab} setActiveTab={setActiveTab} icon={<Brain />}>تكييف النماذج</TabButton>
        <TabButton id="fallback" activeTab={activeTab} setActiveTab={setActiveTab} icon={<Zap />}>استراتيجية النسخ الاحتياطي</TabButton>
        <TabButton id="knowledge" activeTab={activeTab} setActiveTab={setActiveTab} icon={<Database />}>مصادر المعرفة (RAG)</TabButton>
      </div>

      {/* Tab Content */}
      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm min-h-[600px]">
        {activeTab === 'legal' && <LegalProtocolsTab doctrine={doctrine} setDoctrine={setDoctrine} />}
        {activeTab === 'models' && <ModelConditioningTab />}
        {activeTab === 'fallback' && <FallbackStrategyTab />}
        {activeTab === 'knowledge' && <KnowledgeSourcesTab />}
      </div>
    </div>
  );
};

// --- Sub-Components for Tabs ---

const TabButton: React.FC<{id: Tab, activeTab: Tab, setActiveTab: (t: Tab) => void, icon: React.ReactNode, children: React.ReactNode}> = ({ id, activeTab, setActiveTab, icon, children }) => (
  <button 
    onClick={() => setActiveTab(id)}
    className={`flex-1 px-5 py-3 rounded-lg text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-3 ${
      activeTab === id ? 'bg-white text-yemenBlue shadow-md' : 'text-slate-500 hover:bg-white/50'
    }`}
  >
    {icon} {children}
  </button>
);

const LegalProtocolsTab: React.FC<{doctrine: string, setDoctrine: (d: string) => void}> = ({ doctrine, setDoctrine }) => (
  <div className="space-y-8 animate-in fade-in-25 duration-300">
    <div className="pt-8">
      <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-3">السياسة التشغيلية (Safety Layer Constitution)</h3>
      <textarea 
        className="w-full h-96 bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs text-slate-700 outline-none focus:border-yemenBlue transition-all font-mono shadow-inner"
        placeholder="اكتب هنا الدستور الأخلاقي الذي يتم حقنه في كل طلب للذكاء الاصطناعي..."
        value={doctrine}
        onChange={(e) => setDoctrine(e.target.value)}
      />
    </div>
  </div>
);

const ModelConditioningTab: React.FC = () => (
    // UI elements for model conditioning
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in-25 duration-300">
      <div className="space-y-6">
        <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">إعدادات النموذج</h3>
        <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 outline-none focus:border-yemenBlue transition-all font-tajawal">
          <option>Ollama / Qwen-2.5-Coder-7B (Local)</option>
          <option>Gemini Pro 1.5 (Cloud Fallback)</option>
        </select>
        <textarea 
          className="w-full h-80 bg-slate-900 text-blue-300 font-mono text-xs border border-slate-700 rounded-xl p-4 outline-none focus:border-yemenGold transition-all"
          placeholder="System instruction override for selected model..."
          defaultValue={`You are an expert Yemeni dialect analyst. Your task is to transcribe and identify the region of the speaker.`}
        />
      </div>
      <div className="space-y-8 pt-10">
        <SliderControl label="Temperature (الإبداع)" min={0} max={1} step={0.1} defaultValue={0.2} />
        <SliderControl label="Context Window (الذاكرة)" min={2048} max={16384} step={1024} defaultValue={8192} unit="tokens" />
        <button className="w-full py-3 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl text-xs font-black text-slate-700 uppercase tracking-widest transition-all">
          تفريغ النموذج من الذاكرة (Unload Model)
        </button>
      </div>
    </div>
);

const FallbackStrategyTab: React.FC = () => (
    <div className="max-w-2xl mx-auto space-y-12 pt-8 animate-in fade-in-25 duration-300">
        <SliderControl label="مستوى تعقيد الطلب (Threshold Trigger)" min={0} max={100} step={10} defaultValue={80} unit="%" info="إذا تجاوز تعقيد الطلب هذا المستوى، يتم التحويل إلى Gemini." />
        <ToggleControl 
            title="تنقيح البيانات (Data Sanitization)"
            description="حذف الأسماء والأرقام والهويات تلقائياً قبل إرسال أي طلب إلى Google Gemini لضمان الخصوصية."
            enabled={true}
        />
        <ToggleControl 
            title="التوثيق بالبحث (Google Search Grounding)"
            description="السماح لـ Gemini باستخدام بحث Google للتحقق من المعلومات وتقديم إجابات مستندة إلى مصادر حية."
            enabled={true}
        />
    </div>
);

const KnowledgeSourcesTab: React.FC = () => (
  <div className="max-w-3xl mx-auto space-y-12 pt-8 animate-in fade-in-25 duration-300">
    <div className="space-y-4">
       <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">المصدر الأساسي للمعرفة (Primary RAG Source)</h3>
       <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 outline-none focus:border-yemenBlue transition-all font-tajawal">
         <option>Ollama Sovereign Knowledge Base (Local Vector DB)</option>
         <option>External Pinecone Index (Managed)</option>
       </select>
    </div>
    <div className="space-y-4">
      <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">التغذية الخارجية (External Feeds)</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <CheckboxControl label="أرشيف GDELT العالمي" defaultChecked={true} />
        <CheckboxControl label="أرشيف الوثائق (Aleph)" defaultChecked={true} />
        <CheckboxControl label="تقارير المراسلين الميدانية" />
        <CheckboxControl label="قاعدة بيانات العقوبات (OpenSanctions)" />
      </div>
    </div>
    <div className="pt-8 border-t border-slate-100">
      <button className="w-full py-4 bg-yemenGold hover:bg-amber-400 text-yemenBlue-dark rounded-xl font-black text-xs uppercase tracking-[0.2em] transition-all shadow-md flex items-center justify-center gap-3">
        <RefreshCcw size={18} />
        إعادة فهرسة المصادر المختارة
      </button>
    </div>
  </div>
);

// --- Helper UI Components ---

const SliderControl: React.FC<{label: string, min: number, max: number, step: number, defaultValue: number, unit?: string, info?: string}> = ({label, min, max, step, defaultValue, unit, info}) => {
    const [value, setValue] = useState(defaultValue);
    return (
        <div className="space-y-3">
            <div className="flex justify-between items-center">
                <label className="text-xs font-black text-slate-600 uppercase tracking-widest">{label}</label>
                <span className="text-sm font-mono font-bold text-yemenBlue bg-blue-50 px-3 py-1 rounded-md border border-blue-100">{value}{unit}</span>
            </div>
            <input 
                type="range"
                min={min}
                max={max}
                step={step}
                value={value}
                onChange={(e) => setValue(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-yemenBlue" 
            />
            {info && <p className="text-[10px] text-slate-500 font-bold px-1">{info}</p>}
        </div>
    );
};

const ToggleControl: React.FC<{title: string, description: string, enabled: boolean}> = ({title, description, enabled}) => {
    const [isOn, setIsOn] = useState(enabled);
    return (
        <div className={`p-6 rounded-2xl flex items-center justify-between transition-all ${isOn ? 'bg-green-50 border border-green-200' : 'bg-slate-50 border border-slate-200'}`}>
            <div className="pr-6">
                <h4 className={`text-xs font-black uppercase tracking-widest ${isOn ? 'text-green-800' : 'text-slate-800'}`}>{title}</h4>
                <p className="text-[10px] text-slate-500 font-bold mt-2 max-w-md">{description}</p>
            </div>
            <button onClick={() => setIsOn(!isOn)} className={`w-12 h-6 rounded-full p-1 flex items-center transition-colors ${isOn ? 'bg-yemenBlue justify-end' : 'bg-slate-300 justify-start'}`}>
                <div className="w-4 h-4 bg-white rounded-full shadow-md"></div>
            </button>
        </div>
    );
};

const CheckboxControl: React.FC<{label: string, defaultChecked?: boolean}> = ({label, defaultChecked=false}) => {
    const [isChecked, setIsChecked] = useState(defaultChecked);
    return(
        <label className={`p-4 rounded-xl flex items-center gap-4 cursor-pointer transition-all ${isChecked ? 'bg-blue-50 border border-yemenBlue' : 'bg-slate-50 border border-slate-200 hover:border-slate-300'}`}>
            <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${isChecked ? 'bg-yemenBlue border-yemenBlue' : 'bg-white border-slate-300'}`}>
                {isChecked && <Check size={12} className="text-white"/>}
            </div>
            <span className="text-xs font-bold text-slate-700">{label}</span>
        </label>
    )
}


export default GovernancePage;