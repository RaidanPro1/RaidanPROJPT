import React, { useState, useRef } from 'react';
import { Wrench, Edit, Save, X, Upload, RefreshCcw, Loader2 } from 'lucide-react';
import { useToolRegistry } from '../context/ToolRegistryContext';
import { ModuleRegistryInfo } from '../types';
import { IconRenderer } from './IconRenderer';

const ToolIdentityManager: React.FC = () => {
  const { registry, isLoading, updateToolInfo, uploadToolIcon } = useToolRegistry();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedModule, setSelectedModule] = useState<ModuleRegistryInfo | null>(null);
  
  // State for the edit form
  const [displayName, setDisplayName] = useState('');
  const [description, setDescription] = useState('');
  const [iconFile, setIconFile] = useState<File | null>(null);
  const [iconPreview, setIconPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const openEditModal = (module: ModuleRegistryInfo) => {
    setSelectedModule(module);
    setDisplayName(module.display_name);
    setDescription(module.description);
    setIconFile(null);
    setIconPreview(null);
    setIsModalOpen(true);
  };
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setIconFile(file);
      setIconPreview(URL.createObjectURL(file));
    }
  };

  const handleSaveChanges = async () => {
    if (!selectedModule) return;
    setIsSaving(true);
    try {
      await updateToolInfo(selectedModule.module_key, { display_name: displayName, description });
      if (iconFile) {
        await uploadToolIcon(selectedModule.module_key, iconFile);
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error("Failed to save changes", error);
      // Here you would show a toast notification
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-700 pb-20">
      <div className="glass-panel p-6 rounded-2xl flex items-center justify-between gap-6 border-r-4 border-yemenGold shadow-tactical">
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 bg-yemenGold/10 rounded-xl flex items-center justify-center text-yemenGold border border-yemenGold/20 shadow-glow-gold">
            <Wrench size={28} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-white leading-none uppercase">إدارة هوية الأدوات</h2>
            <p className="text-[10px] text-yemenGold font-bold uppercase tracking-[0.3em] mt-2">Sovereign Module Identity Registry</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from(registry.values()).map(module => (
          <div key={module.module_key} className="glass-panel p-6 rounded-2xl border-slate-800 shadow-tactical flex flex-col justify-between group">
            <div className="flex items-start justify-between">
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 shadow-inner group-hover:border-yemenGold/20 transition-all">
                <IconRenderer iconName={module.icon_name} className="text-yemenGold" size={24} />
              </div>
              <button onClick={() => openEditModal(module)} className="p-2 bg-slate-950/50 rounded-lg text-slate-500 hover:text-white border border-slate-800 hover:border-slate-700 transition-all">
                <Edit size={14} />
              </button>
            </div>
            <div className="mt-4">
              <h3 className="text-sm font-black text-white uppercase tracking-wider truncate">{module.display_name}</h3>
              <p className="text-[10px] text-slate-500 font-bold mt-1 line-clamp-2">{module.description}</p>
              <code className="text-[8px] font-mono text-slate-700 mt-2 block">KEY: {module.module_key}</code>
            </div>
          </div>
        ))}
      </div>
      
      {/* Edit Modal */}
      {isModalOpen && selectedModule && (
         <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-300">
           <div className="glass-panel rounded-2xl border-yemenGold/20 shadow-glow-gold w-full max-w-lg overflow-hidden">
             <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
                <h3 className="font-black text-white uppercase tracking-widest">تعديل هوية: {selectedModule.display_name}</h3>
                <button onClick={() => setIsModalOpen(false)} className="p-2 text-slate-500 hover:text-white transition-colors rounded-lg"><X size={18} /></button>
             </div>
             <div className="p-8 space-y-6">
                <div className="flex items-center gap-6">
                    <div className="relative">
                        <div className="w-24 h-24 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-center shadow-inner">
                            <IconRenderer iconName={iconPreview || selectedModule.icon_name} size={40} className="text-yemenGold"/>
                        </div>
                        <button onClick={() => fileInputRef.current?.click()} className="absolute -bottom-2 -right-2 p-2 bg-yemenBlue rounded-full border-2 border-slate-900 text-white hover:scale-110 transition-transform">
                            <Upload size={14} />
                        </button>
                        <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/png, image/svg+xml, image/jpeg"/>
                    </div>
                    <div className="flex-1 space-y-4">
                        <input type="text" value={displayName} onChange={e => setDisplayName(e.target.value)} placeholder="اسم العرض" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-yemenGold transition-all"/>
                        <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="الوصف" rows={2} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-slate-400 outline-none focus:border-yemenGold transition-all resize-none"/>
                    </div>
                </div>
                <div className="flex justify-end gap-4 pt-6 border-t border-slate-800">
                    <button onClick={() => setIsModalOpen(false)} className="px-6 py-3 rounded-xl text-xs font-black text-slate-400 uppercase tracking-widest hover:bg-slate-800 transition-colors">إلغاء</button>
                    <button onClick={handleSaveChanges} disabled={isSaving} className="px-8 py-3 rounded-xl text-xs font-black bg-yemenGold text-yemenBlue-dark uppercase tracking-widest flex items-center gap-2 transition-all hover:shadow-glow-gold disabled:opacity-50">
                        {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                        {isSaving ? 'جاري الحفظ...' : 'حفظ التغييرات'}
                    </button>
                </div>
             </div>
           </div>
         </div>
      )}
    </div>
  );
};

export default ToolIdentityManager;
