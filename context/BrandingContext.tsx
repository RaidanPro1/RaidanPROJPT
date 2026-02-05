import React, { createContext, useContext, useState, useEffect } from 'react';

export interface TypographyStyle {
  fontFamily: string;
  fontSize: string;
  fontWeight: string;
  color: string;
}

export interface TypographyConfig {
  heading: TypographyStyle;
  body: TypographyStyle;
  label: TypographyStyle;
}

interface ThemeConfig {
  primary: string;
  accent: string;
  bgBase: string;
  logoUrl: string | null;
}

interface Nomenclature {
  [key: string]: string;
}

type ThemeMode = 'light' | 'dark';

interface BrandingContextType {
  theme: ThemeConfig;
  typography: TypographyConfig;
  nomenclature: Nomenclature;
  themeMode: ThemeMode;
  toggleThemeMode: () => void;
  updateTheme: (config: Partial<ThemeConfig>) => void;
  updateTypography: (element: keyof TypographyConfig, style: Partial<TypographyStyle>) => void;
  updateNomenclature: (key: string, value: string) => void;
  applyTheme: (themeConfig: ThemeConfig, typographyConfig: TypographyConfig) => void;
}

const BrandingContext = createContext<BrandingContextType | undefined>(undefined);

export const BrandingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [themeMode, setThemeMode] = useState<ThemeMode>('dark');
  const [theme, setTheme] = useState<ThemeConfig>({
    primary: '#003087',
    accent: '#D4AF37',
    bgBase: '#f8fafc',
    logoUrl: null
  });

  const [typography, setTypography] = useState<TypographyConfig>({
    heading: { fontFamily: 'Tajawal, sans-serif', fontSize: '2rem', fontWeight: '900', color: '#0f172a' },
    body: { fontFamily: 'Tajawal, sans-serif', fontSize: '1rem', fontWeight: '400', color: '#1e293b' },
    label: { fontFamily: 'Tajawal, sans-serif', fontSize: '0.75rem', fontWeight: '700', color: '#64748b' },
  });

  const [nomenclature, setNomenclature] = useState<Nomenclature>({
    chat_module: 'Sovereign Chat',
    forensics_lab: 'DeepSafe Lab',
    geo_station: 'GeoInt Station',
    dialect_engine: 'Dialect Engine',
    newsroom_cms: 'Smart Newsroom'
  });
  
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-theme', themeMode);
    localStorage.setItem('raidan_theme_mode', themeMode);
  }, [themeMode]);

  const toggleThemeMode = () => {
    setThemeMode(prev => prev === 'light' ? 'dark' : 'light');
  };


  const applyTheme = (themeConfig: ThemeConfig, typographyConfig: TypographyConfig) => {
    const root = document.documentElement;
    root.style.setProperty('--color-primary', themeConfig.primary);
    root.style.setProperty('--color-accent', themeConfig.accent);
    root.style.setProperty('--color-bg-base', themeConfig.bgBase);
    
    // Auto-generate variants
    root.style.setProperty('--color-accent-dim', themeConfig.accent + '1A');
    root.style.setProperty('--color-accent-glow', themeConfig.accent + 'CC');
    
    // Apply Typography
    root.style.setProperty('--font-family-heading', typographyConfig.heading.fontFamily);
    root.style.setProperty('--font-size-heading', typographyConfig.heading.fontSize);
    root.style.setProperty('--font-weight-heading', typographyConfig.heading.fontWeight);
    root.style.setProperty('--color-text-heading', typographyConfig.heading.color);

    root.style.setProperty('--font-family-body', typographyConfig.body.fontFamily);
    root.style.setProperty('--font-size-body', typographyConfig.body.fontSize);
    root.style.setProperty('--font-weight-body', typographyConfig.body.fontWeight);
    root.style.setProperty('--color-text-body', typographyConfig.body.color);
    
    root.style.setProperty('--font-family-label', typographyConfig.label.fontFamily);
    root.style.setProperty('--font-size-label', typographyConfig.label.fontSize);
    root.style.setProperty('--font-weight-label', typographyConfig.label.fontWeight);
    root.style.setProperty('--color-text-label', typographyConfig.label.color);
  };

  const updateTheme = (config: Partial<ThemeConfig>) => {
    const newTheme = { ...theme, ...config };
    setTheme(newTheme);
    applyTheme(newTheme, typography);
    localStorage.setItem('raidan_branding_theme', JSON.stringify(newTheme));
  };

  const updateTypography = (element: keyof TypographyConfig, style: Partial<TypographyStyle>) => {
    const newTypography = { ...typography, [element]: { ...typography[element], ...style } };
    setTypography(newTypography);
    applyTheme(theme, newTypography);
    localStorage.setItem('raidan_typography', JSON.stringify(newTypography));
  };

  const updateNomenclature = (key: string, value: string) => {
    const newNom = { ...nomenclature, [key]: value };
    setNomenclature(newNom);
    localStorage.setItem('raidan_nomenclature', JSON.stringify(newNom));
  };

  useEffect(() => {
    const savedMode = localStorage.getItem('raidan_theme_mode');
    if (savedMode === 'light' || savedMode === 'dark') {
      setThemeMode(savedMode);
    }
  }, []);

  return (
    <BrandingContext.Provider value={{ theme, nomenclature, typography, themeMode, toggleThemeMode, updateTheme, updateNomenclature, updateTypography, applyTheme }}>
      {children}
    </BrandingContext.Provider>
  );
};

export const useBranding = () => {
  const context = useContext(BrandingContext);
  if (!context) throw new Error('useBranding must be used within BrandingProvider');
  return context;
};