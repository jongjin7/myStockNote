import { useState, useEffect, createContext, useContext, useCallback, type ReactNode } from 'react';
import type { AppData, Account, Stock, StockMemo, Attachment } from '../types';
import { initialData } from '../lib/storage';
import { api } from '../lib/api';

interface AppContextType {
  data: AppData;
  isLoading: boolean;
  error: Error | null;
  actions: {
    refresh: () => Promise<void>;
    saveAccount: (account: Account) => Promise<void>;
    deleteAccount: (id: string) => Promise<void>;
    saveStock: (stock: Stock) => Promise<void>;
    deleteStock: (id: string) => Promise<void>;
    saveMemo: (memo: StockMemo) => Promise<void>;
    saveAttachment: (attachment: Attachment) => Promise<void>;
    deleteAttachment: (id: string) => Promise<void>;
  };
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<AppData>(initialData);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const refresh = useCallback(async () => {
    try {
      setIsLoading(true);
      const loaded = await api.getData();
      setData(loaded);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch data:', err);
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const actions = {
    refresh,
    saveAccount: async (account: Account) => {
      await api.saveAccount(account);
      await refresh();
    },
    deleteAccount: async (id: string) => {
      await api.deleteAccount(id);
      await refresh();
    },
    saveStock: async (stock: Stock) => {
      await api.saveStock(stock);
      await refresh();
    },
    deleteStock: async (id: string) => {
      await api.deleteStock(id);
      await refresh();
    },
    saveMemo: async (memo: StockMemo) => {
      await api.saveMemo(memo);
      await refresh();
    },
    saveAttachment: async (attachment: Attachment) => {
      await api.saveAttachment(attachment);
      await refresh();
    },
    deleteAttachment: async (id: string) => {
      await api.deleteAttachment(id);
      await refresh();
    },
  };

  return (
    <AppContext.Provider value={{ data, isLoading, error, actions }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}

