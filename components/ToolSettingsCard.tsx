import React from 'react';
import { Settings2, Info } from 'lucide-react';

interface SettingItem {
  type: 'slider' | 'toggle' | 'select' | 'checkboxes';
  label: string;
  value: any;
  min?: number;
  max?: number;
  step?: number;
  options?: string[];
  description?: string;
}

interface ToolSettingsCardProps {
  title: string;
  settings: Record<string, SettingItem>;
  onUpdate: (key: string, value: any) => void;
  variant?: 'user' | 'root';
}

const ToolSettingsCard: React.FC<ToolSettingsCardProps> = ({ title, settings, onUpdate, variant = 'user' }) => {
  
  const cardBorder = variant === 'root' ? 'border-red-500/30' : 'border-border-subtle';
  const headerColor = variant === 'root' ? 'text-red-500' : 'text-brand-primary';
  const bgClass = variant === 'root' ? 'bg-red-500/5' : 'bg-canvas';

  return (
    <div className={`rounded-2xl border ${cardBorder} ${bgClass} overflow-hidden shadow-sm transition-all duration-300 hover:shadow-elevation`}>
      <div className="p-5 border-b border-border-subtle flex items-center gap-3">
        <Settings2 size={18} className={headerColor} />
        <h3 className="text-sm font-black text-text-primary uppercase tracking-widest">{title}</h3>
      </div>
      
      <div className="p-6 grid grid-cols-1 gap-6">
        {Object.entries(settings).map(([key, rawConfig]) => {
          const config = rawConfig as SettingItem;
          return (
          <div key={key} className="flex flex-col gap-3">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-text-secondary uppercase tracking-wide flex items-center gap-2">
                {config.label}
                {config.description && (
                    <div className="group relative">
                        <Info size={12} className="text-text-subtle cursor-help" />
                        <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-48 p-2 bg-slate-900 text-[10px] text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-xl">
                            {config.description}
                        </div>
                    </div>
                )}
              </label>
              {config.type === 'slider' && (
                <span className="text-[10px] font-mono font-black text-brand-accent bg-brand-accent/10 px-2 py-0.5 rounded border border-brand-accent/20">
                  {config.value}
                </span>
              )}
            </div>

            {/* CONTROL RENDERER */}
            <div className="h-8 flex items-center">
              
              {/* SLIDER */}
              {config.type === 'slider' && (
                <div className="w-full relative group">
                    <input 
                        type="range"
                        min={config.min} max={config.max} step={config.step}
                        value={config.value}
                        onChange={(e) => onUpdate(key, Number(e.target.value))}
                        className="w-full h-1.5 bg-border-subtle rounded-lg appearance-none cursor-pointer accent-brand-primary hover:accent-brand-accent transition-all"
                    />
                </div>
              )}

              {/* TOGGLE */}
              {config.type === 'toggle' && (
                <button 
                    onClick={() => onUpdate(key, !config.value)}
                    className={`w-12 h-6 rounded-full p-1 flex items-center transition-all duration-300 ${config.value ? 'bg-brand-primary justify-end shadow-glow-blue' : 'bg-border-subtle justify-start'}`}
                >
                    <div className="w-4 h-4 bg-white rounded-full shadow-md transform transition-transform"></div>
                </button>
              )}

              {/* SELECT */}
              {config.type === 'select' && config.options && (
                <div className="w-full relative">
                    <select 
                        value={config.value}
                        onChange={(e) => onUpdate(key, e.target.value)}
                        className="w-full bg-panel border border-border-subtle rounded-lg px-3 py-1.5 text-xs text-text-primary font-bold outline-none focus:border-brand-primary transition-all appearance-none cursor-pointer"
                    >
                        {config.options.map(opt => (
                            <option key={opt} value={opt}>{opt.replace(/_/g, ' ').toUpperCase()}</option>
                        ))}
                    </select>
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-text-subtle">
                        <svg width="10" height="6" viewBox="0 0 10 6" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 1L5 5L9 1"/></svg>
                    </div>
                </div>
              )}
            </div>
          </div>
        );
        })}
      </div>
    </div>
  );
};

export default ToolSettingsCard;