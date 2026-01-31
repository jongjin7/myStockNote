import { useState, useEffect, createContext, useContext, useCallback, useMemo, type ReactNode } from 'react';
import type { AppData, Account, Stock, StockMemo, Attachment } from '../types';
import { initialData } from '../lib/storage';
import { supabaseApi } from '../lib/supabase-api';
import { supabase } from '../lib/supabase';
import { fetchStockPrice } from '../lib/stockApi';
import { useAuth } from './AuthContext';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface AppContextType {
  data: AppData;
  isLoading: boolean;
  isSyncing: boolean;
  error: Error | null;
  actions: {
    refresh: () => Promise<void>;
    saveAccount: (account: Account) => Promise<void>;
    deleteAccount: (id: string) => Promise<void>;
    saveStock: (stock: Stock) => Promise<void>;
    deleteStock: (id: string) => Promise<void>;
    saveMemo: (memo: StockMemo) => Promise<void>;
    deleteMemo: (id: string) => Promise<void>;
    saveAttachment: (attachment: Attachment) => Promise<void>;
    deleteAttachment: (id: string) => Promise<void>;
    updateStockPrice: (stockId: string) => Promise<void>;
    updateAllStockPrices: () => Promise<void>;
  };
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [data, setData] = useState<AppData>(initialData);
  const [isSyncing, setIsSyncing] = useState(false);

  // Fetch all data
  const { data: serverData, isLoading, error: queryError, refetch } = useQuery({
    queryKey: ['appData', user?.id],
    queryFn: () => user ? supabaseApi.getAllData(user.id) : Promise.resolve(initialData),
    enabled: !!user,
  });

  // Sync serverData with local state for backward compatibility
  useEffect(() => {
    if (serverData) {
      setData(serverData);
    }
  }, [serverData]);

  // Realtime Subscriptions (MSW 모드에서는 비활성화)
  useEffect(() => {
    if (!user || import.meta.env.VITE_USE_MSW === 'true') return;

    const channel = supabase
      .channel('db-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', filter: `user_id=eq.${user.id}` },
        (payload: any) => {
          console.log('Realtime change received:', payload);
          queryClient.invalidateQueries({ queryKey: ['appData', user.id] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, queryClient]);

  const refresh = useCallback(async () => {
    await refetch();
  }, [refetch]);

  const error = useMemo(() => {
    return queryError instanceof Error ? queryError : null;
  }, [queryError]);

  // Mutations
  const accountMutation = useMutation({
    mutationFn: (account: Account) => supabaseApi.saveAccount(user!.id, account),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['appData', user?.id] }),
  });

  const deleteAccountMutation = useMutation({
    mutationFn: (id: string) => supabaseApi.deleteAccount(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['appData', user?.id] }),
  });

  const stockMutation = useMutation({
    mutationFn: (stock: Stock) => supabaseApi.saveStock(user!.id, stock),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['appData', user?.id] }),
  });

  const deleteStockMutation = useMutation({
    mutationFn: (id: string) => supabaseApi.deleteStock(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['appData', user?.id] }),
  });

  const memoMutation = useMutation({
    mutationFn: (memo: StockMemo) => supabaseApi.saveMemo(user!.id, memo),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['appData', user?.id] }),
  });

  const deleteMemoMutation = useMutation({
    mutationFn: (id: string) => supabaseApi.deleteMemo(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['appData', user?.id] }),
  });

  const attachmentMutation = useMutation({
    mutationFn: (attachment: Attachment) => supabaseApi.saveAttachment(user!.id, attachment),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['appData', user?.id] }),
  });

  const deleteAttachmentMutation = useMutation({
    mutationFn: (id: string) => supabaseApi.deleteAttachment(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['appData', user?.id] }),
  });

  const actions = useMemo(() => ({
    refresh,
    saveAccount: async (account: Account) => {
      await accountMutation.mutateAsync(account);
    },
    deleteAccount: async (id: string) => {
      await deleteAccountMutation.mutateAsync(id);
    },
    saveStock: async (stock: Stock) => {
      await stockMutation.mutateAsync(stock);
    },
    deleteStock: async (id: string) => {
      await deleteStockMutation.mutateAsync(id);
    },
    saveMemo: async (memo: StockMemo) => {
      await memoMutation.mutateAsync(memo);
    },
    deleteMemo: async (id: string) => {
      await deleteMemoMutation.mutateAsync(id);
    },
    saveAttachment: async (attachment: Attachment) => {
      await attachmentMutation.mutateAsync(attachment);
    },
    deleteAttachment: async (id: string) => {
      await deleteAttachmentMutation.mutateAsync(id);
    },
    updateStockPrice: async (stockId: string) => {
      const stock = data.stocks.find(s => s.id === stockId);
      if (!stock || !stock.symbol) return;
      
      try {
        const newPrice = await fetchStockPrice(stock.symbol);
        if (newPrice !== null && newPrice !== stock.currentPrice) {
          // 가격이 실제로 변경되었을 때만 updatedAt 업데이트
          await stockMutation.mutateAsync({
            ...stock,
            currentPrice: newPrice,
            updatedAt: Date.now()
          });
        }
      } catch (err) {
        console.error('Failed to update price:', err);
      }
    },
    updateAllStockPrices: async () => {
      const stocksToUpdate = data.stocks.filter(s => s.symbol && (s.status === 'HOLDING' || s.status === 'PARTIAL_SOLD' || s.status === 'WATCHLIST'));
      if (stocksToUpdate.length === 0 || isSyncing) return;

      setIsSyncing(true);
      try {
        for (const stock of stocksToUpdate) {
          if (!stock.symbol) continue;
          
          try {
            // Rate limit avoidance
            await new Promise(resolve => setTimeout(resolve, 800));
            const newPrice = await fetchStockPrice(stock.symbol);
            
            if (newPrice !== null && newPrice !== stock.currentPrice) {
              await stockMutation.mutateAsync({
                ...stock,
                currentPrice: newPrice,
                updatedAt: Date.now()
              });
            }
          } catch (err) {
            console.error(`Failed to update price for ${stock.symbol}:`, err);
            // Continue with other stocks
          }
        }
      } catch (err) {
        console.error('Failed to update all prices:', err);
      } finally {
        setIsSyncing(false);
      }
    },
  }), [refresh, data.stocks, user, accountMutation, deleteAccountMutation, stockMutation, deleteStockMutation, memoMutation, attachmentMutation, deleteAttachmentMutation]);

  return (
    <AppContext.Provider value={{ data, isLoading, isSyncing, error, actions }}>
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

