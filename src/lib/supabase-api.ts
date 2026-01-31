import { supabase } from './supabase';
import type { Account, Stock, StockMemo, Attachment, AppData } from '../types';

export const supabaseApi = {
  // Storage
  uploadImage: async (userId: string, file: File): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}/${Date.now()}.${fileExt}`;
    const { data, error } = await supabase.storage
      .from('stock-images')
      .upload(fileName, file);

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
      .from('stock-images')
      .getPublicUrl(data.path);

    return publicUrl;
  },

  // Accounts
  getAccounts: async (userId: string): Promise<Account[]> => {
    const { data, error } = await supabase
      .from('accounts')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data.map(mapAccountFromDb);
  },

  saveAccount: async (userId: string, account: Account): Promise<Account> => {
    const dbAccount = mapAccountToDb(userId, account);
    const { data, error } = await supabase
      .from('accounts')
      .upsert(dbAccount)
      .select()
      .single();

    if (error) throw error;
    return mapAccountFromDb(data);
  },

  deleteAccount: async (id: string): Promise<void> => {
    const { error } = await supabase
      .from('accounts')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  // Stocks
  getStocks: async (userId: string): Promise<Stock[]> => {
    const { data, error } = await supabase
      .from('stocks')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data.map(mapStockFromDb);
  },

  saveStock: async (userId: string, stock: Stock): Promise<Stock> => {
    const dbStock = mapStockToDb(userId, stock);
    const { data, error } = await supabase
      .from('stocks')
      .upsert(dbStock)
      .select()
      .single();

    if (error) throw error;
    return mapStockFromDb(data);
  },

  deleteStock: async (id: string): Promise<void> => {
    const { error } = await supabase
      .from('stocks')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  // Memos
  getMemos: async (userId: string, stockId?: string): Promise<StockMemo[]> => {
    let query = supabase
      .from('memos')
      .select('*')
      .eq('user_id', userId);

    if (stockId) {
      query = query.eq('stock_id', stockId);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) throw error;
    return data.map(mapMemoFromDb);
  },

  saveMemo: async (userId: string, memo: StockMemo): Promise<StockMemo> => {
    const dbMemo = mapMemoToDb(userId, memo);
    const { data, error } = await supabase
      .from('memos')
      .upsert(dbMemo)
      .select()
      .single();

    if (error) throw error;
    return mapMemoFromDb(data);
  },

  // Attachments
  getAttachments: async (userId: string, memoId: string): Promise<Attachment[]> => {
    const { data, error } = await supabase
      .from('attachments')
      .select('*')
      .eq('user_id', userId)
      .eq('memo_id', memoId);

    if (error) throw error;
    return data.map(mapAttachmentFromDb);
  },

  saveAttachment: async (userId: string, attachment: Attachment): Promise<Attachment> => {
    const dbAttachment = mapAttachmentToDb(userId, attachment);
    const { data, error } = await supabase
      .from('attachments')
      .upsert(dbAttachment)
      .select()
      .single();

    if (error) throw error;
    return mapAttachmentFromDb(data);
  },

  deleteAttachment: async (id: string): Promise<void> => {
    const { error } = await supabase
      .from('attachments')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  // Global Data
  getAllData: async (userId: string): Promise<AppData> => {
    const [accounts, stocks, memos, attachments] = await Promise.all([
      supabaseApi.getAccounts(userId),
      supabaseApi.getStocks(userId),
      supabaseApi.getMemos(userId),
      // We don't fetch all attachments at once in the cloud version usually, 
      // but if we need a full dump/sync, we select * from attachments where user_id = userId
      supabase.from('attachments').select('*').eq('user_id', userId).then(({data}) => (data || []).map(mapAttachmentFromDb))
    ]);

    return { accounts, stocks, memos, attachments };
  }
};

// Helper Mappers
function mapAccountToDb(userId: string, account: Account) {
  return {
    id: account.id,
    user_id: userId,
    broker_name: account.brokerName,
    cash_balance: account.cashBalance,
    memo: account.memo,
    updated_at: new Date().toISOString()
  };
}

function mapAccountFromDb(db: any): Account {
  return {
    id: db.id,
    brokerName: db.broker_name,
    cashBalance: db.cash_balance,
    memo: db.memo,
    createdAt: new Date(db.created_at).getTime(),
    updatedAt: new Date(db.updated_at).getTime()
  };
}

function mapStockToDb(userId: string, stock: Stock) {
  return {
    id: stock.id,
    user_id: userId,
    account_id: stock.accountId,
    symbol: stock.symbol,
    name: stock.name,
    quantity: stock.quantity,
    avg_price: stock.avgPrice,
    current_price: stock.currentPrice,
    status: stock.status,
    category: stock.category,
    updated_at: new Date().toISOString()
  };
}

function mapStockFromDb(db: any): Stock {
  return {
    id: db.id,
    accountId: db.account_id,
    symbol: db.symbol,
    name: db.name,
    quantity: db.quantity,
    avgPrice: db.avg_price,
    currentPrice: db.current_price,
    status: db.status as any,
    category: db.category,
    createdAt: new Date(db.created_at).getTime(),
    updatedAt: new Date(db.updated_at).getTime()
  };
}

function mapMemoToDb(userId: string, memo: StockMemo) {
  return {
    id: memo.id,
    user_id: userId,
    stock_id: memo.stockId,
    type: memo.type,
    buy_reason: memo.buyReason,
    expected_scenario: memo.expectedScenario,
    risks: memo.risks,
    current_thought: memo.currentThought,
    sell_review: memo.sellReview,
    updated_at: new Date().toISOString()
  };
}

function mapMemoFromDb(db: any): StockMemo {
  return {
    id: db.id,
    stockId: db.stock_id,
    type: db.type as any,
    buyReason: db.buy_reason,
    expectedScenario: db.expected_scenario,
    risks: db.risks,
    currentThought: db.current_thought,
    sellReview: db.sell_review,
    createdAt: new Date(db.created_at).getTime(),
    updatedAt: new Date(db.updated_at).getTime()
  };
}

function mapAttachmentToDb(userId: string, attachment: Attachment) {
  return {
    id: attachment.id,
    user_id: userId,
    memo_id: attachment.memoId,
    type: attachment.type,
    file_name: attachment.fileName,
    file_size: attachment.fileSize,
    mime_type: attachment.mimeType,
    storage_url: attachment.data, // In v2, data field holds the URL
    // created_at is handled by default
  };
}

function mapAttachmentFromDb(db: any): Attachment {
  return {
    id: db.id,
    memoId: db.memo_id,
    type: db.type as any,
    fileName: db.file_name,
    fileSize: db.file_size,
    mimeType: db.mime_type,
    data: db.storage_url,
    createdAt: new Date(db.created_at).getTime()
  };
}
