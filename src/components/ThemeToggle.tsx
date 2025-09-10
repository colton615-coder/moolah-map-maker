import React from 'react';
import { Moon, Sun, Monitor } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';

export const ThemeToggle = () => {
  const { settings, updateSettings } = useTheme();

  const themes = [
    { value: 'light', icon: Sun, label: 'Light' },
    { value: 'dark', icon: Moon, label: 'Dark' },
    { value: 'auto', icon: Monitor, label: 'Auto' },
  ];

  const currentThemeIndex = themes.findIndex(t => t.value === settings.theme);
  const nextTheme = themes[(currentThemeIndex + 1) % themes.length];

  const handleToggle = () => {
    updateSettings({ theme: nextTheme.value as any });
  };

  const CurrentIcon = themes.find(t => t.value === settings.theme)?.icon || Monitor;

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleToggle}
      className="relative overflow-hidden group transition-all duration-300 hover:scale-105"
    >
      <div className="absolute inset-0 bg-gradient-primary opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
      <CurrentIcon className="w-4 h-4 transition-transform duration-300 group-hover:rotate-12" />
      <span className="ml-2 text-xs">{settings.theme}</span>
    </Button>
  );
};