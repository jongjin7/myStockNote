import { storage } from './storage';
import { supabaseApi } from './supabase-api';
import type { AppData } from '../types';

export interface MigrationResult {
  success: boolean;
  count: {
    accounts: number;
    stocks: number;
    memos: number;
    attachments: number;
  };
  error?: string;
}

/**
 * Converts a Base64 string to a File object
 */
async function base64ToFile(base64: string, fileName: string, mimeType: string): Promise<File> {
  const res = await fetch(base64);
  const blob = await res.blob();
  return new File([blob], fileName, { type: mimeType });
}

export const migration = {
  /**
   * Checks if there is data in LocalStorage that can be migrated
   */
  hasLocalData: (): boolean => {
    const data = storage.load();
    return (
      data.accounts.length > 0 ||
      data.stocks.length > 0 ||
      data.memos.length > 0 ||
      data.attachments.length > 0
    );
  },

  /**
   * Migrates all data from LocalStorage to Supabase for the given user
   */
  migrateToSupabase: async (userId: string): Promise<MigrationResult> => {
    const localData: AppData = storage.load();
    const result: MigrationResult = {
      success: false,
      count: { accounts: 0, stocks: 0, memos: 0, attachments: 0 }
    };

    try {
      // 1. Accounts
      for (const account of localData.accounts) {
        await supabaseApi.saveAccount(userId, account);
        result.count.accounts++;
      }

      // 2. Stocks
      for (const stock of localData.stocks) {
        await supabaseApi.saveStock(userId, stock);
        result.count.stocks++;
      }

      // 3. Memos
      for (const memo of localData.memos) {
        await supabaseApi.saveMemo(userId, memo);
        result.count.memos++;
      }

      // 4. Attachments (Base64 -> Supabase Storage -> DB Record)
      for (const attachment of localData.attachments) {
        try {
          // If it's already a URL (maybe partially migrated), skip upload
          let storageUrl = attachment.data;
          
          if (attachment.data.startsWith('data:')) {
            const file = await base64ToFile(attachment.data, attachment.fileName, attachment.mimeType);
            storageUrl = await supabaseApi.uploadImage(userId, file);
          }

          await supabaseApi.saveAttachment(userId, {
            ...attachment,
            data: storageUrl
          });
          result.count.attachments++;
        } catch (attErr) {
          console.error(`Failed to migrate attachment ${attachment.id}:`, attErr);
          // Continue with other attachments
        }
      }

      result.success = true;
      return result;
    } catch (err: any) {
      console.error('Migration failed:', err);
      result.error = err.message || '데이터 이전 중 오류가 발생했습니다.';
      return result;
    }
  },

  /**
   * Clears local data after successful migration
   */
  clearLocalData: () => {
    storage.clear();
  }
};
