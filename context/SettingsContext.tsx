
import React, { createContext, useContext, useState, useEffect } from 'react';

// RBAC Roles
export type UserRole = 'root' | 'org_admin' | 'org_user' | 'journalist' | 'viewer';

export interface RoutingScenario {
  id: 'scenario_a' | 'scenario_b' | 'scenario_c';
  label: string;
  description: string;
  enforceLocalForSecret: boolean;
  allowWebSearch: boolean;
}

// Define the shape of your settings
export interface AppSettings {
  coolifyEndpoint: string;
  coolifyToken: string;
  resourceMode: 'balanced' | 'tactical';
  ollamaModels: { id: string; name: string; active: boolean }[];
  
  // Google Services Governance Config (Hybrid Intelligence)
  googleConfig: {
    apiKey: string; 
    enableSearchGrounding: boolean;
    thinkingBudget: number; 
    safetyThreshold: 'block_all' | 'block_some' | 'allow_adult';
    temperature: number; // 0.0 - 1.0
    systemInstruction: string; // The injected constitution
  };
  
  // Adaptive Routing Logic
  activeRoutingScenario: 'scenario_a' | 'scenario_b' | 'scenario_c';

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
  
  // Identity & Access
  userRole: UserRole;
  orgName?: string;
}

interface SettingsContextType {
  settings: AppSettings;
  userRole: UserRole;
  updateSetting: <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => void;
  updateGoogleConfig: (config: Partial<AppSettings['googleConfig']>) => void;
  setRoutingScenario: (scenario: AppSettings['activeRoutingScenario']) => void;
  toggleModule: (mod: keyof AppSettings['modules']) => void;
  setDefaultOllamaModel: (id: string) => void;
  toggleUserRole: () => void;
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
    googleConfig: {
        apiKey: process.env.API_KEY || '', 
        enableSearchGrounding: true,
        thinkingBudget: 0,
        safetyThreshold: 'block_some',
        temperature: 0.3,
        systemInstruction: `أنت نظام ذكاء اصطناعي يمني سيادي. 
يجب عليك الالتزام بقانون الصحافة لعام 1990 وميثاق الشرف المهني.
يمنع منعاً باتاً توليد محتوى يمس الثوابت الوطنية أو يثير النعرات.
في التحليل السياسي، التزم الحياد التام والمصادر الموثقة.`
    },
    activeRoutingScenario: 'scenario_c', // Hybrid by default
    systemDoctrine: `[SOVEREIGN_PROTOCOL_v2.0]
- CLASSIFICATION: CONFIDENTIAL
- JURISDICTION: REPUBLIC OF YEMEN`,
    modules: {
      chat: true,
      deepsafe: true,
      geoint: true,
      dialect: true,
      newsroom: true
    },
    cfToken: 'CF_API_PRO_9221',
    gdeltMonitoring: true,
    nasaFirmsKey: 'NASA_SENTINEL_X99',
    mapTilerKey: '',
    userRole: 'root' 
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);

  useEffect(() => {
    const savedSettings = localStorage.getItem('raidan_app_settings_v2');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings(current => ({ 
            ...defaultSettings, 
            ...parsed, 
            googleConfig: { ...defaultSettings.googleConfig, ...parsed.googleConfig } 
        }));
      } catch (e) { console.error("Failed to parse saved settings:", e); }
    }
  }, []);
  
  const save = (newSettings: AppSettings) => {
      setSettings(newSettings);
      localStorage.setItem('raidan_app_settings_v2', JSON.stringify(newSettings));
  };

  const updateSetting = <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => {
    save({ ...settings, [key]: value });
  };

  const updateGoogleConfig = (config: Partial<AppSettings['googleConfig']>) => {
      save({ ...settings, googleConfig: { ...settings.googleConfig, ...config } });
  };

  const setRoutingScenario = (scenario: AppSettings['activeRoutingScenario']) => {
      save({ ...settings, activeRoutingScenario: scenario });
  };

  const toggleUserRole = () => {
    const roles: UserRole[] = ['root', 'org_admin', 'org_user'];
    const currentIndex = roles.indexOf(settings.userRole);
    const nextRole = roles[(currentIndex + 1) % roles.length];
    updateSetting('userRole', nextRole);
  };

  const toggleModule = (mod: keyof AppSettings['modules']) => {
    save({ ...settings, modules: { ...settings.modules, [mod]: !settings.modules[mod] } });
  };

  const setDefaultOllamaModel = (id: string) => {
    save({ ...settings, ollamaModels: settings.ollamaModels.map(m => ({ ...m, active: m.id === id })) });
  };

  const value = { 
      settings, 
      userRole: settings.userRole,
      updateSetting, 
      updateGoogleConfig, 
      setRoutingScenario,
      toggleModule, 
      setDefaultOllamaModel, 
      toggleUserRole 
  };

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
