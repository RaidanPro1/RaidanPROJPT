
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { ModuleRegistryInfo } from '../types';

// The backend API is no longer the source of truth for the registry as per the new design.
// We will fetch from the local config file.
// const API_BASE_URL = 'http://127.0.0.1:8000';

interface ToolRegistryContextType {
  registry: Map<string, ModuleRegistryInfo>;
  getToolInfo: (key: string) => ModuleRegistryInfo | undefined;
  updateToolInfo: (key: string, data: { display_name: string; description: string }) => Promise<void>;
  uploadToolIcon: (key: string, file: File) => Promise<void>;
  isLoading: boolean;
}

const ToolRegistryContext = createContext<ToolRegistryContextType | undefined>(undefined);

export const ToolRegistryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [registry, setRegistry] = useState<Map<string, ModuleRegistryInfo>>(new Map());
  const [isLoading, setIsLoading] = useState(true);

  const fetchRegistry = useCallback(async () => {
    setIsLoading(true);
    try {
      // Fetch from the local JSON file instead of the backend API
      const response = await fetch(`/config/tools_registry.json`);
      if (!response.ok) throw new Error('Failed to fetch tool registry from /config/tools_registry.json');
      const data: ModuleRegistryInfo[] = await response.json();
      
      const registryMap = new Map<string, ModuleRegistryInfo>();
      data.forEach(item => registryMap.set(item.module_key, item));
      setRegistry(registryMap);
    } catch (error) {
      console.error("Error fetching tool registry:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRegistry();
  }, [fetchRegistry]);

  const getToolInfo = (key: string): ModuleRegistryInfo | undefined => {
    return registry.get(key);
  };

  // Note: These update functions will only update the in-memory state.
  // They cannot write to the static JSON file. This is for UI demonstration.
  const updateToolInfo = async (key: string, data: { display_name: string; description: string }) => {
    setRegistry((prev: Map<string, ModuleRegistryInfo>) => {
        const newRegistry = new Map<string, ModuleRegistryInfo>(prev);
        const current = newRegistry.get(key);
        if(current) {
            const updated: ModuleRegistryInfo = { ...current, ...data };
            newRegistry.set(key, updated);
        }
        return newRegistry;
    });
    // Simulate async operation
    return Promise.resolve();
  };
  
  const uploadToolIcon = async (key: string, file: File) => {
     // This would require a backend to persist. For now, we simulate.
     const iconUrl = URL.createObjectURL(file);
     setRegistry((prev: Map<string, ModuleRegistryInfo>) => {
        const newRegistry = new Map<string, ModuleRegistryInfo>(prev);
        const current = newRegistry.get(key);
        if(current) {
            const updated: ModuleRegistryInfo = { ...current, icon_name: iconUrl };
            newRegistry.set(key, updated);
        }
        return newRegistry;
    });
    return Promise.resolve();
  };

  const value = { registry, getToolInfo, updateToolInfo, uploadToolIcon, isLoading };

  return (
    <ToolRegistryContext.Provider value={value}>
      {children}
    </ToolRegistryContext.Provider>
  );
};

export const useToolRegistry = () => {
  const context = useContext(ToolRegistryContext);
  if (context === undefined) {
    throw new Error('useToolRegistry must be used within a ToolRegistryProvider');
  }
  return context;
};
