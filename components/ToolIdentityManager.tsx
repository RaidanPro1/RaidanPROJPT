import React, { useState, useRef } from 'react';
import { Wrench, Edit, Save, X, Upload, RefreshCcw, Loader2, Search, Filter, Info } from 'lucide-react';
import { useToolRegistry } from '../context/ToolRegistryContext';
import { ModuleRegistryInfo } from '../types';
import { IconRenderer } from './IconRenderer';

const ToolIdentityManager: React.FC = () => {
  const { registry, isLoading, updateToolInfo, uploadToolIcon } = useToolRegistry();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedModule, setSelectedModule] = useState<ModuleRegistryInfo | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
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
    } finally {
      setIsSaving(false);
    }
  };

  // Adding explicit type to the tool parameter to fix "Property does not exist on type 'unknown'" error.
  const filteredTools = Array.from(registry.values()).filter((tool: ModuleRegistryInfo) => 
    tool.display_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tool.module_key.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-700 pb-20">
      <div className="bg-panel p-6 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6 border-border-subtle border border-r-4 border-r-brand-accent shadow-elevation">
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 bg-brand-accent/10 rounded-xl flex items-center justify-center text-brand-accent border border-brand-accent/20">
            <Wrench size={28} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-text-primary leading-none uppercase">إدارة هوية الأدوات</h2>
            <p className="text-[10px] text-brand-accent font-bold uppercase tracking-[0.3em] mt-2">Sovereign Module Identity Registry</p>
          </div>
        </div>
        
        <div className="relative w-full md:w-80 group">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-text-subtle group-focus-within:text-brand-accent transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="بحث في الوحدات..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-canvas border border-border-subtle rounded-xl pr-12 pl-4 py-3 text-sm text-text-primary outline-none focus:border-brand-accent transition-all"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
           <Loader2 size={48} className="text-brand-accent animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredTools.map((module: ModuleRegistryInfo) => (
            <div key={module.module_key} className="bg-panel p-6 rounded-2xl border border-border-subtle shadow-elevation flex flex-col justify-between group hover:border-brand-accent/30 transition-all">
              <div className="flex items-start justify-between">
                <div className="p-3 bg-canvas rounded-xl border border-border-subtle shadow-inner group-hover:border-brand-accent/20 transition-all">
                  <IconRenderer iconName={module.icon_name} className="text-brand-accent" size={24} />
                </div>
                <button onClick={() => openEditModal(module)} className="p-2 bg-canvas/50 rounded-lg text-text-subtle hover:text-brand-accent border border-border-subtle hover:border-brand-accent/30 transition-all">
                  <Edit size={14} />
                </button>
              </div>
              <div className="mt-4">
                <h3 className="text-sm font-black text-text-primary uppercase tracking-wider truncate">{module.display_name}</h3>
                <p className="text-[10px] text-text-subtle font-bold mt-1 line-clamp-2 leading-relaxed">{module.description}</p>
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-border-subtle/50">
                   <code className="text-[8px] font-mono text-text-subtle uppercase">KEY: {module.module_key}</code>
                   {module.is_active ? (
                     <span className="text-[8px] font-black text-green-500 uppercase tracking-tighter bg-green-500/10 px-2 py-0.5 rounded">Active</span>
                   ) : (
                     <span className="text-[8px] font-black text-text-subtle uppercase tracking-tighter bg-canvas px-2 py-0.5 rounded">Standby</span>
                   )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Edit Modal */}
      {isModalOpen && selectedModule && (
         <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-canvas/60 backdrop-blur-sm animate-in fade-in duration-300">
           <div className="bg-panel rounded-2xl border border-border-subtle shadow-elevation w-full max-w-lg overflow-hidden border-t-4 border-t-brand-accent">
             <div className="p-6 border-b border-border-subtle flex justify-between items-center bg-canvas/50">
                <h3 className="font-black text-text-primary uppercase tracking-widest text-sm">تعديل هوية: {selectedModule.display_name}</h3>
                <button onClick={() => setIsModalOpen(false)} className="p-2 text-text-subtle hover:text-text-primary transition-colors rounded-lg bg-canvas"><X size={18} /></button>
             </div>
             <div className="p-8 space-y-6">
                <div className="flex flex-col gap-6">
                    <div className="flex items-center gap-6">
                        <div className="relative">
                            <div className="w-24 h-24 bg-canvas rounded-2xl border border-border-subtle flex items-center justify-center shadow-inner overflow-hidden">
                                {iconPreview ? (
                                    <img src={iconPreview} className="w-full h-full object-cover" />
                                ) : (
                                    <IconRenderer iconName={selectedModule.icon_name} size={40} className="text-brand-accent"/>
                                )}
                            </div>
                            <button onClick={() => fileInputRef.current?.click()} className="absolute -bottom-2 -right-2 p-2 bg-brand-primary rounded-full border-2 border-panel text-white hover:scale-110 transition-transform shadow-lg">
                                <Upload size={14} />
                            </button>
                            <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/png, image/svg+xml, image/jpeg"/>
                        </div>
                        <div className="flex-1 space-y-4">
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-text-subtle uppercase tracking-widest px-1">اسم العرض (Display Name)</label>
                                <input type="text" value={displayName} onChange={e => setDisplayName(e.target.value)} className="w-full bg-canvas border border-border-subtle rounded-xl px-4 py-3 text-sm text-text-primary font-bold outline-none focus:border-brand-accent transition-all shadow-inner"/>
                            </div>
                        </div>
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-text-subtle uppercase tracking-widest px-1">الوصف (Description)</label>
                        <textarea value={description} onChange={e => setDescription(e.target.value)} rows={3} className="w-full bg-canvas border border-border-subtle rounded-xl px-4 py-3 text-xs text-text-secondary outline-none focus:border-brand-accent transition-all resize-none shadow-inner leading-relaxed"/>
                    </div>
                </div>
                
                <div className="p-4 bg-brand-accent/5 border border-brand-accent/20 rounded-xl flex items-start gap-3">
                   <Info size={16} className="text-brand-accent mt-0.5" />
                   <p className="text-[10px] text-text-secondary leading-relaxed font-bold">
                     تغيير الهوية سيظهر فوراً في شريط التنقل الجانبي ولوحات التحكم لجميع المستخدمين.
                   </p>
                </div>

                <div className="flex justify-end gap-4 pt-6 border-t border-border-subtle">
                    <button onClick={() => setIsModalOpen(false)} className="px-6 py-3 rounded-xl text-xs font-black text-text-subtle uppercase tracking-widest hover:bg-canvas transition-colors">إلغاء</button>
                    <button onClick={handleSaveChanges} disabled={isSaving} className="px-8 py-3 rounded-xl text-xs font-black bg-brand-accent text-canvas uppercase tracking-widest flex items-center gap-2 transition-all hover:shadow-glow-accent disabled:opacity-50 active:scale-95">
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