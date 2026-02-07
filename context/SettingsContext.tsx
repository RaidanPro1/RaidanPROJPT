
import React, { createContext, useContext, useState, useEffect } from 'react';

// RBAC Roles
export type UserRole = 'root' | 'org_admin' | 'org_user' | 'journalist' | 'viewer';
export type RoutingScenario = 'scenario_a' | 'scenario_b' | 'scenario_c';

export interface AppSettings {
  isInstalled: boolean;
  rootDomain: string; 
  coolifyEndpoint: string;
  coolifyToken: string;
  resourceMode: 'balanced' | 'tactical';
  ollamaModels: { id: string; name: string; active: boolean }[];
  
  googleConfig: {
    apiKey: string; 
    enableSearchGrounding: boolean;
    thinkingBudget: number; 
    safetyThreshold: 'block_all' | 'block_some' | 'allow_adult';
    temperature: number;
    systemInstruction: string;
    defaultModel: string;
  };

  apiMatrix: {
    geoNames: string;
    nasaEarth: string;
    worldBank: string;
    hdx: string;
    who: string;
    newsApi: string;
    alphaVantage: string;
    openSky: string;
    openAq: string;
    coinGecko: string;
    monitoredNewsSites: { name: string; url: string; category: 'official' | 'opposition' | 'independent' }[];
    socialKeywords: string[];
  };
  
  activeRoutingScenario: RoutingScenario;
  systemDoctrine: string; 
  modules: {
    chat: boolean;
    deepsafe: boolean;
    geoint: boolean;
    dialect: boolean;
    newsroom: boolean;
  };
  userRole: UserRole;
}

const defaultSystemInstruction = `بروتوكول التفعيل الذاتي لمركز YemenJPT - المحرك السيادي "علام" (إصدار 2026 - v7.0)
أنت "علام" (Allam)، نظام الاستخبارات العربي والسيادي الأول لليمن.

مهمتك المركزية: تقديم إجابات دقيقة، رصينة، وتلتزم بالهوية الوطنية اليمنية.
استخدم دائماً الحقائق الموثقة واجعل ردودك موجهة لدعم صناع القرار والصحفيين الاستقصائيين.`;

const defaultSettings: AppSettings = {
    isInstalled: false,
    rootDomain: 'localhost', 
    coolifyEndpoint: 'https://ops.yemenjpt.pro/api/v1',
    coolifyToken: 'YJPT_TOKEN_SOVEREIGN',
    resourceMode: 'balanced',
    ollamaModels: [
      { id: 'qwen2.5-sovereign', name: 'سيف (Saif-14B Native)', active: false },
      { id: 'allam-native', name: 'علام (Allam-Arabic-Core)', active: true },
    ],
    googleConfig: {
        apiKey: process.env.API_KEY || '', 
        enableSearchGrounding: true,
        thinkingBudget: 0,
        safetyThreshold: 'block_some',
        temperature: 0.2,
        systemInstruction: defaultSystemInstruction,
        defaultModel: 'gemini-3-flash-preview'
    },
    apiMatrix: {
      geoNames: 'YJPT_GEO',
      nasaEarth: 'NASA_LENS',
      worldBank: 'Active',
      hdx: 'YEM_HUMANITARIAN',
      who: 'WHO_DATA_PORTAL',
      newsApi: 'YEMEN_NEWS_STREAM',
      alphaVantage: 'FX_MONITOR',
      openSky: 'AIR_TRAFFIC',
      openAq: 'CLIMATE_AIR',
      coinGecko: 'P2P_INDEX',
      monitoredNewsSites: [
        { name: 'وكالة سبأ', url: 'saba.ye', category: 'official' },
        { name: 'عدن الغد', url: 'adengad.net', category: 'independent' }
      ],
      socialKeywords: ['رواتب', 'انقطاع الكهرباء', 'صرف الدولار', 'مظاهرات']
    },
    activeRoutingScenario: 'scenario_c',
    systemDoctrine: `[ALLAM_SOVEREIGN_PROTOCOL_v7.0]`,
    modules: {
      chat: true,
      deepsafe: true,
      geoint: true,
      dialect: true,
      newsroom: true
    },
    userRole: 'root'
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);

  useEffect(() => {
    const savedSettings = localStorage.getItem('yemenjpt_app_settings_v12');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings({ ...defaultSettings, ...parsed, userRole: 'root' });
      } catch (e) { console.error(e); }
    }
  }, []);
  
  const updateSetting = <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    localStorage.setItem('yemenjpt_app_settings_v12', JSON.stringify(newSettings));
  };

  const updateGoogleConfig = (config: Partial<AppSettings['googleConfig']>) => {
      updateSetting('googleConfig', { ...settings.googleConfig, ...config });
  };

  const updateApiMatrix = (config: Partial<AppSettings['apiMatrix']>) => {
      updateSetting('apiMatrix', { ...settings.apiMatrix, ...config });
  };

  const setRoutingScenario = (scenario: RoutingScenario) => {
      updateSetting('activeRoutingScenario', scenario);
  };

  const setDefaultOllamaModel = (id: string) => {
    const updatedModels = settings.ollamaModels.map(m => ({
      ...m,
      active: m.id === id
    }));
    updateSetting('ollamaModels', updatedModels);
  };

  const completeInstallation = (domain: string) => {
    const newSettings = { 
        ...settings, 
        isInstalled: true, 
        rootDomain: domain 
    };
    setSettings(newSettings);
    localStorage.setItem('yemenjpt_app_settings_v12', JSON.stringify(newSettings));
  };

  return (
    <SettingsContext.Provider value={{ settings, userRole: 'root', updateSetting, updateGoogleConfig, updateApiMatrix, setRoutingScenario, setDefaultOllamaModel, completeInstallation }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) throw new Error('useSettings must be used within a SettingsProvider');
  return context;
};

interface SettingsContextType {
  settings: AppSettings;
  userRole: UserRole;
  updateSetting: <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => void;
  updateGoogleConfig: (config: Partial<AppSettings['googleConfig']>) => void;
  updateApiMatrix: (config: Partial<AppSettings['apiMatrix']>) => void;
  setRoutingScenario: (scenario: RoutingScenario) => void;
  setDefaultOllamaModel: (id: string) => void;
  completeInstallation: (domain: string) => void;
}
