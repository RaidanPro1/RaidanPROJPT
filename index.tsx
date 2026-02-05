
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { BrandingProvider } from './context/BrandingContext';
import { ToolRegistryProvider } from './context/ToolRegistryContext';
import { SettingsProvider } from './context/SettingsContext';
import { LanguageProvider } from './context/LanguageContext';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = createRoot(rootElement);
root.render(
  <React.StrictMode>
    <BrandingProvider>
      <LanguageProvider>
        <ToolRegistryProvider>
          <SettingsProvider>
            <App />
          </SettingsProvider>
        </ToolRegistryProvider>
      </LanguageProvider>
    </BrandingProvider>
  </React.StrictMode>
);
