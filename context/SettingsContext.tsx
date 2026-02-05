
import React, { createContext, useContext, useState, useEffect } from 'react';

// Define the shape of your settings
export interface AppSettings {
  coolifyEndpoint: string;
  coolifyToken: string;
  resourceMode: 'balanced' | 'tactical';
  ollamaModels: { id: string; name: string; active: boolean }[];
  geminiKey: string;
  searchGrounding: boolean;
  systemDoctrine: string; 
  modules: {
    chat: boolean;
    deepsafe: boolean;
    geoint: boolean;
    dialect: boolean;
    newsroom: boolean;
  };
  cfToken: string;
  gdeltMonitoring: boolean;
  nasaFirmsKey: string;
  mapTilerKey: string;
  userRole: 'user' | 'root'; // NEW: For role-based options
}

interface SettingsContextType {
  settings: AppSettings;
  updateSetting: <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => void;
  toggleModule: (mod: keyof AppSettings['modules']) => void;
  setDefaultOllamaModel: (id: string) => void;
  userRole: 'user' | 'root'; // Expose role
  toggleUserRole: () => void; // Expose toggle function
}

const defaultSettings: AppSettings = {
    coolifyEndpoint: 'https://ops.raidan.pro/api/v1',
    coolifyToken: 'CR_TOKEN_8821_SOVEREIGN',
    resourceMode: 'balanced',
    ollamaModels: [
      { id: 'qwen2.5', name: 'Qwen-2.5-Coder-7B', active: true },
      { id: 'llama3', name: 'Llama-3-Sovereign-8B', active: false },
      { id: 'mistral', name: 'Mistral-Nemo-12B', active: false },
    ],
    geminiKey: 'AIzaSyCXXXXXXXXXXXXXXXXXXXXXX',
    searchGrounding: true,
    systemDoctrine: `[SOVEREIGN_PROTOCOL_v1.7.5]
- PRIMARY DIRECTIVE: You are a sovereign AI assistant for Yemeni investigative journalists. Your primary goal is to provide accurate, unbiased, and secure information based SOLELY on the provided context from Aleph and RAGFlow.
- DATA SOVEREIGNTY: You MUST NOT, under any circumstances, share, leak, or allude to any internal data, user queries, or system configurations with any external entity.
- ETHICAL BOUNDARY: Refuse to generate content that promotes hate speech, violence, or disinformation. If a query is unethical, respond with "هذا الطلب يتعارض مع البروتوكولات الأخلاقية للمنصة."
- NEUTRALITY: Maintain absolute neutrality in all political and sectarian analysis. Stick to verifiable facts from the provided documents.
- NO HALLUCINATION: If the answer is not in the provided knowledge base, state clearly "لا توجد معلومات كافية في قاعدة البيانات للإجابة على هذا السؤال." Do not invent information.`,
    modules: {
      chat: true,
      deepsafe: true,
      geoint: false,
      dialect: true,
      newsroom: true
    },
    cfToken: 'CF_API_PRO_9221',
    gdeltMonitoring: true,
    nasaFirmsKey: 'NASA_SENTINEL_X99',
    mapTilerKey: '',
    userRole: 'root' // Default to root for full access
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);

  useEffect(() => {
    const savedSettings = localStorage.getItem('raidan_app_settings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings(current => ({ ...defaultSettings, ...parsed }));
      } catch (e) { console.error("Failed to parse saved settings:", e); }
    }
  }, []);
  
  const updateSetting = <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => {
    setSettings(prev => {
      const newSettings = { ...prev, [key]: value };
      localStorage.setItem('raidan_app_settings', JSON.stringify(newSettings));
      return newSettings;
    });
  };

  const toggleUserRole = () => {
    updateSetting('userRole', settings.userRole === 'root' ? 'user' : 'root');
  };

  const toggleModule = (mod: keyof AppSettings['modules']) => {
    setSettings(prev => {
        const newSettings = { ...prev, modules: { ...prev.modules, [mod]: !prev.modules[mod] } };
        localStorage.setItem('raidan_app_settings', JSON.stringify(newSettings));
        return newSettings;
    });
  };

  const setDefaultOllamaModel = (id: string) => {
    setSettings(prev => {
        const newSettings = { ...prev, ollamaModels: prev.ollamaModels.map(m => ({ ...m, active: m.id === id })) };
        localStorage.setItem('raidan_app_settings', JSON.stringify(newSettings));
        return newSettings;
    });
  };

  const value = { settings, updateSetting, toggleModule, setDefaultOllamaModel, userRole: settings.userRole, toggleUserRole };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
