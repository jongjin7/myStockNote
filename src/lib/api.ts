import type { AppData, Account, Stock, StockMemo, Attachment } from '../types';

const BASE_URL = '/api';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`API Request failed: ${response.statusText}`);
  }

  return response.json();
}

export const api = {
  // Global data
  getData: () => request<AppData>('/data'),

  // Accounts
  getAccounts: () => request<Account[]>('/accounts'),
  saveAccount: (account: Account) => request<Account>('/accounts', {
    method: 'POST',
    body: JSON.stringify(account),
  }),
  deleteAccount: (id: string) => request<{ success: boolean }>(`/accounts/${id}`, {
    method: 'DELETE',
  }),

  // Stocks
  getStocks: () => request<Stock[]>('/stocks'),
  saveStock: (stock: Stock) => request<Stock>('/stocks', {
    method: 'POST',
    body: JSON.stringify(stock),
  }),
  deleteStock: (id: string) => request<{ success: boolean }>(`/stocks/${id}`, {
    method: 'DELETE',
  }),

  // Memos
  getMemos: (stockId?: string) => {
    const query = stockId ? `?stockId=${stockId}` : '';
    return request<StockMemo[]>(`/memos${query}`);
  },
  saveMemo: (memo: StockMemo) => request<StockMemo>('/memos', {
    method: 'POST',
    body: JSON.stringify(memo),
  }),

  // Attachments
  getAttachments: (memoId: string) => request<Attachment[]>(`/attachments?memoId=${memoId}`),
  saveAttachment: (attachment: Attachment) => request<Attachment>('/attachments', {
    method: 'POST',
    body: JSON.stringify(attachment),
  }),
  deleteAttachment: (id: string) => request<{ success: boolean }>(`/attachments/${id}`, {
    method: 'DELETE',
  }),
};
