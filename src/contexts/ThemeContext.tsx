import React, { createContext, useContext, useEffect } from 'react';
import { useIndexedDB } from '@/hooks/useIndexedDB';

type Theme = 'light' | 'dark' | 'auto';
type PrimaryColor = 'blue' | 'green' | 'purple' | 'orange' | 'red';
type Currency = 'USD' | 'EUR' | 'GBP' | 'CAD' | 'AUD';
type Density = 'comfortable' | 'compact';

interface ThemeSettings {
  theme: Theme;
  primaryColor: PrimaryColor;
  currency: Currency;
  density: Density;
}

interface ThemeContextType {
  settings: ThemeSettings;
  updateSettings: (newSettings: Partial<ThemeSettings>) => void;
  loading: boolean;
}

const defaultSettings: ThemeSettings = {
  theme: 'auto',
  primaryColor: 'blue',
  currency: 'USD',
  density: 'comfortable',
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings, loading] = useIndexedDB('themeSettings', defaultSettings);

  const updateSettings = (newSettings: Partial<ThemeSettings>) => {
    setSettings({ ...settings, ...newSettings });
  };

  useEffect(() => {
    const applyTheme = () => {
      const root = document.documentElement;
      
      // Apply theme
      if (settings.theme === 'auto') {
        const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        root.classList.toggle('dark', isDark);
      } else {
        root.classList.toggle('dark', settings.theme === 'dark');
      }

      // Apply primary color
      const colorMap = {
        blue: { primary: '221 83% 53%', primaryForeground: '210 40% 98%' },
        green: { primary: '142 71% 45%', primaryForeground: '355.7 100% 97.3%' },
        purple: { primary: '271 81% 56%', primaryForeground: '210 40% 98%' },
        orange: { primary: '25 95% 53%', primaryForeground: '210 40% 98%' },
        red: { primary: '0 84.2% 60.2%', primaryForeground: '210 40% 98%' },
      };

      const colors = colorMap[settings.primaryColor];
      root.style.setProperty('--primary', colors.primary);
      root.style.setProperty('--primary-foreground', colors.primaryForeground);

      // Apply density
      root.classList.toggle('compact', settings.density === 'compact');
    };

    if (!loading) {
      applyTheme();
    }

    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (settings.theme === 'auto') {
        applyTheme();
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [settings, loading]);

  return (
    <ThemeContext.Provider value={{ settings, updateSettings, loading }}>
      {children}
    </ThemeContext.Provider>
  );
};