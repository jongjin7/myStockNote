export type StockStatus = 'WATCHLIST' | 'HOLDING' | 'PARTIAL_SOLD' | 'SOLD';
export type MemoType = 'PURCHASE' | 'SELL' | 'GENERAL';
export type AttachmentType = 'IMAGE' | 'TEXT';

export interface Account {
  id: string;
  brokerName: string;
  cashBalance: number;
  memo: string | null;
  createdAt: number;
  updatedAt: number;
}

export interface Stock {
  id: string;
  accountId: string | null;
  symbol: string | null;
  name: string;
  quantity: number;
  avgPrice: number;
  currentPrice?: number | null;
  status: StockStatus;
  category?: string | null;
  createdAt: number;
  updatedAt: number;
}

export interface StockMemo {
  id: string;
  stockId: string;
  type: MemoType;
  buyReason: string | null;
  expectedScenario: string | null;
  risks: string | null;
  currentThought: string | null;
  sellReview: string | null;
  createdAt: number;
  updatedAt: number;
}

export interface Attachment {
  id: string;
  memoId: string;
  type: AttachmentType;
  fileName: string;
  fileSize: number;
  mimeType: string;
  data: string; // Base64 for images or text content
  createdAt: number;
}

export interface AppData {
  accounts: Account[];
  stocks: Stock[];
  memos: StockMemo[];
  attachments: Attachment[];
}
