import React from 'react';
import * as LucideIcons from 'lucide-react';

const API_BASE_URL = 'http://127.0.0.1:8000';

interface IconRendererProps {
  iconName: string;
  className?: string;
  size?: number;
}

export const IconRenderer: React.FC<IconRendererProps> = ({ iconName, className, size = 20 }) => {
  // If the iconName is a URL path (starts with /), render an img tag
  if (iconName && iconName.startsWith('/')) {
    const fullUrl = `${API_BASE_URL}${iconName}`;
    return <img src={fullUrl} alt={iconName} width={size} height={size} className={className} />;
  }

  // Otherwise, render a Lucide icon
  const IconComponent = (LucideIcons as any)[iconName];

  if (!IconComponent) {
    // Fallback icon if the name is not found
    return <LucideIcons.HelpCircle size={size} className={className} />;
  }

  return <IconComponent size={size} className={className} />;
};