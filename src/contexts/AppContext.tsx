import { useState, useEffect, createContext, useContext, useCallback, type ReactNode } from 'react';
import type { AppData, Account, Stock, StockMemo, Attachment } from '../types';
import { initialData } from '../lib/storage';
import { api } from '../lib/api';
import { fetchStockPrice } from '../lib/stockApi';

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
 updateStockPrice: (stockId: string) => Promise<void>;
 updateAllStockPrices: () => Promise<void>;
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
 updateStockPrice: async (stockId: string) => {
    const stock = data.stocks.find(s => s.id === stockId);
    if (!stock || !stock.symbol) return;
    
    setIsLoading(true);
    try {
      const newPrice = await fetchStockPrice(stock.symbol);
      if (newPrice !== null) {
        await api.saveStock({
          ...stock,
          currentPrice: newPrice,
          updatedAt: Date.now()
        });
        await refresh();
      }
    } finally {
      setIsLoading(false);
    }
  },
  updateAllStockPrices: async () => {
    const stocksToUpdate = data.stocks.filter(s => s.symbol && (s.status === 'HOLDING' || s.status === 'PARTIAL_SOLD' || s.status === 'WATCHLIST'));
    if (stocksToUpdate.length === 0) return;

    setIsLoading(true);
    try {
      for (const stock of stocksToUpdate) {
        if (!stock.symbol) continue;
        const newPrice = await fetchStockPrice(stock.symbol);
        if (newPrice !== null) {
          await api.saveStock({
            ...stock,
            currentPrice: newPrice,
            updatedAt: Date.now()
          });
        }
      }
      await refresh();
    } finally {
      setIsLoading(false);
    }
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

