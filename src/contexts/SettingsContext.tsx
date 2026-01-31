import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

export interface AppSettings {
  theme: 'dark' | 'light';
  currencyFormat: 'KRW' | 'USD' | 'JPY';
  dateFormat: 'YYYY-MM-DD' | 'MM/DD/YYYY' | 'DD.MM.YYYY';
  notifications: {
    priceAlert: boolean;
    targetPriceAlert: boolean;
    memoReminder: boolean;
  };
}

const defaultSettings: AppSettings = {
  theme: 'dark',
  currencyFormat: 'KRW',
  dateFormat: 'YYYY-MM-DD',
  notifications: {
    priceAlert: false,
    targetPriceAlert: false,
    memoReminder: false,
  },
};

interface SettingsContextType {
  settings: AppSettings;
  updateSettings: (newSettings: Partial<AppSettings>) => void;
  resetSettings: () => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

const STORAGE_KEY = 'app_settings_v1';

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<AppSettings>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return { ...defaultSettings, ...JSON.parse(stored) };
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
    }
    return defaultSettings;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
  }, [settings]);

  // Apply theme to document
  useEffect(() => {
    const root = document.documentElement;
    if (settings.theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }
  }, [settings.theme]);

  const updateSettings = (newSettings: Partial<AppSettings>) => {
    setSettings(prev => ({
      ...prev,
      ...newSettings,
      notifications: {
        ...prev.notifications,
        ...(newSettings.notifications || {}),
      },
    }));
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings, resetSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
