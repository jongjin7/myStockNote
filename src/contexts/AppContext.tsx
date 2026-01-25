import { useState, useEffect, createContext, useContext, useCallback, type ReactNode } from 'react';
import type { AppData, Account, Stock, StockMemo, Attachment } from '../types';
import { storage, initialData } from '../lib/storage';

interface AppContextType {
  data: AppData;
  actions: {
    refresh: () => void;
    saveAccount: (account: Account) => void;
    deleteAccount: (id: string) => void;
    saveStock: (stock: Stock) => void;
    deleteStock: (id: string) => void;
    saveMemo: (memo: StockMemo) => void;
    saveAttachment: (attachment: Attachment) => void;
    deleteAttachment: (id: string) => void;
  };
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<AppData>(initialData);

  const refresh = useCallback(() => {
    const loaded = storage.load();
    setData(loaded);
  }, []);

  useEffect(() => {
    refresh();

    // Listen for storage changes from other tabs
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'stock_note_data_v1') {
        refresh();
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [refresh]);

  const actions = {
    refresh,
    saveAccount: (account: Account) => {
      storage.saveAccount(account);
      refresh();
    },
    deleteAccount: (id: string) => {
      storage.deleteAccount(id);
      refresh();
    },
    saveStock: (stock: Stock) => {
      storage.saveStock(stock);
      refresh();
    },
    deleteStock: (id: string) => {
      storage.deleteStock(id);
      refresh();
    },
    saveMemo: (memo: StockMemo) => {
      storage.saveMemo(memo);
      refresh();
    },
    saveAttachment: (attachment: Attachment) => {
      storage.saveAttachment(attachment);
      refresh();
    },
    deleteAttachment: (id: string) => {
      storage.deleteAttachment(id);
      refresh();
    },
  };

  return (
    <AppContext.Provider value={{ data, actions }}>
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
