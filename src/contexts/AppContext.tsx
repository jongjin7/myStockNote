import { useState, useEffect, createContext, useContext, useCallback, useMemo, type ReactNode } from 'react';
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

  const actions = useMemo(() => ({
    refresh,
    saveAccount: async (account: Account) => {
      try {
        setIsLoading(true);
        await api.saveAccount(account);
        await refresh();
      } catch (err) {
        console.error('Failed to save account:', err);
        alert('계좌 저장에 실패했습니다.');
      } finally {
        setIsLoading(false);
      }
    },
    deleteAccount: async (id: string) => {
      try {
        setIsLoading(true);
        await api.deleteAccount(id);
        await refresh();
      } catch (err) {
        console.error('Failed to delete account:', err);
        alert('계좌 삭제에 실패했습니다.');
      } finally {
        setIsLoading(false);
      }
    },
    saveStock: async (stock: Stock) => {
      try {
        setIsLoading(true);
        await api.saveStock(stock);
        await refresh();
      } catch (err) {
        console.error('Failed to save stock:', err);
        alert('종목 저장에 실패했습니다.');
      } finally {
        setIsLoading(false);
      }
    },
    deleteStock: async (id: string) => {
      try {
        setIsLoading(true);
        await api.deleteStock(id);
        await refresh();
      } catch (err) {
        console.error('Failed to delete stock:', err);
        alert('종목 삭제에 실패했습니다.');
      } finally {
        setIsLoading(false);
      }
    },
    saveMemo: async (memo: StockMemo) => {
      try {
        setIsLoading(true);
        await api.saveMemo(memo);
        await refresh();
      } catch (err) {
        console.error('Failed to save memo:', err);
        alert('메모 저장에 실패했습니다.');
      } finally {
        setIsLoading(false);
      }
    },
    saveAttachment: async (attachment: Attachment) => {
      try {
        setIsLoading(true);
        await api.saveAttachment(attachment);
        await refresh();
      } catch (err) {
        console.error('Failed to save attachment:', err);
      } finally {
        setIsLoading(false);
      }
    },
    deleteAttachment: async (id: string) => {
      try {
        setIsLoading(true);
        await api.deleteAttachment(id);
        await refresh();
      } catch (err) {
        console.error('Failed to delete attachment:', err);
      } finally {
        setIsLoading(false);
      }
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
      } catch (err) {
        console.error('Failed to update price:', err);
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
          await new Promise(resolve => setTimeout(resolve, 500));
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
      } catch (err) {
        console.error('Failed to update all prices:', err);
      } finally {
        setIsLoading(false);
      }
    },
  }), [refresh, data.stocks]);

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

