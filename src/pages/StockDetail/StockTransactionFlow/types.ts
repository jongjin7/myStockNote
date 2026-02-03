export interface TransactionNode {
  id: string;
  date: string;
  type: 'BUY' | 'SELL' | 'CURRENT';
  quantity: number;
  price: number;
  total: number;
  profit?: number;
  profitRate?: number;
  avgPriceChange?: number;
  holdingsAfter: number;
}

export interface DayGroup {
  date: string;
  transactions: TransactionNode[];
  memo?: string;
}
