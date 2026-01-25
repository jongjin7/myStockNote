import type { AppData, Account, Stock, StockMemo, Attachment } from '../types';

const STORAGE_KEY = 'stock_note_data_v1';

export const initialData: AppData = {
  accounts: [],
  stocks: [],
  memos: [],
  attachments: [],
};

export const storage = {
  load: (): AppData => {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return initialData;
    try {
      return JSON.parse(data);
    } catch (e) {
      console.error('Failed to load data from localStorage', e);
      return initialData;
    }
  },

  save: (data: AppData) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.error('Failed to save data to localStorage', e);
      // Handle quota exceeded error
      if (e instanceof DOMException && e.name === 'QuotaExceededError') {
        alert('저장 공간이 부족합니다. 오래된 첨부파일을 삭제하거나 데이터를 백업해 주세요.');
      }
    }
  },

  // Account operations
  getAccounts: () => storage.load().accounts,
  saveAccount: (account: Account) => {
    const data = storage.load();
    const index = data.accounts.findIndex(a => a.id === account.id);
    if (index >= 0) {
      data.accounts[index] = account;
    } else {
      data.accounts.push(account);
    }
    storage.save(data);
  },
  deleteAccount: (id: string) => {
    const data = storage.load();
    data.accounts = data.accounts.filter(a => a.id !== id);
    // Also handle stocks linked to this account? 
    // PRD says WATCHLIST stocks have null accountId. 
    // Maybe set accountId to null for attached stocks?
    data.stocks = data.stocks.map(s => s.accountId === id ? { ...s, accountId: null, status: 'WATCHLIST' as const } : s);
    storage.save(data);
  },

  // Stock operations
  getStocks: () => storage.load().stocks,
  saveStock: (stock: Stock) => {
    const data = storage.load();
    const index = data.stocks.findIndex(s => s.id === stock.id);
    if (index >= 0) {
      data.stocks[index] = stock;
    } else {
      data.stocks.push(stock);
    }
    storage.save(data);
  },
  deleteStock: (id: string) => {
    const data = storage.load();
    const memoIdsToClean = data.memos.filter(m => m.stockId === id).map(m => m.id);
    data.stocks = data.stocks.filter(s => s.id !== id);
    data.memos = data.memos.filter(m => m.stockId !== id);
    data.attachments = data.attachments.filter(a => !memoIdsToClean.includes(a.memoId));
    storage.save(data);
  },

  // Memo operations
  getMemos: (stockId?: string) => {
    const memos = storage.load().memos;
    return stockId ? memos.filter(m => m.stockId === stockId) : memos;
  },
  saveMemo: (memo: StockMemo) => {
    const data = storage.load();
    const index = data.memos.findIndex(m => m.id === memo.id);
    if (index >= 0) {
      data.memos[index] = memo;
    } else {
      data.memos.push(memo);
    }
    storage.save(data);
  },

  // Attachment operations
  getAttachments: (memoId: string) => storage.load().attachments.filter(a => a.memoId === memoId),
  saveAttachment: (attachment: Attachment) => {
    const data = storage.load();
    data.attachments.push(attachment);
    storage.save(data);
  },
  deleteAttachment: (id: string) => {
    const data = storage.load();
    data.attachments = data.attachments.filter(a => a.id !== id);
    storage.save(data);
  }
};
