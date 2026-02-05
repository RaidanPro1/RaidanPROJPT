
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

type Language = 'ar' | 'en';

interface LanguageContextType {
  language: Language;
  changeLanguage: (lang: Language) => void;
  t: (key: string, fallback?: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('ar');
  const [translations, setTranslations] = useState<Record<string, string>>({});

  const fetchTranslations = useCallback(async (lang: Language) => {
    try {
      const response = await fetch(`/locales/${lang}.json`);
      if (!response.ok) {
        throw new Error(`Could not load ${lang}.json`);
      }
      const data = await response.json();
      setTranslations(data);
    } catch (error) {
      console.error(error);
      setTranslations({}); // Fallback to empty
    }
  }, []);

  useEffect(() => {
    const savedLang = localStorage.getItem('raidan_language') as Language;
    const initialLang = savedLang || 'ar';
    setLanguage(initialLang);
    fetchTranslations(initialLang);
  }, [fetchTranslations]);

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [language]);

  const changeLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('raidan_language', lang);
    fetchTranslations(lang);
  };

  const t = (key: string, fallback?: string): string => {
    return translations[key] || fallback || key;
  };

  const value = { language, changeLanguage, t };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
