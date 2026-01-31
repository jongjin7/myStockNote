export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      accounts: {
        Row: {
          id: string
          user_id: string
          broker_name: string
          cash_balance: number
          memo: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          broker_name: string
          cash_balance?: number
          memo?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          broker_name?: string
          cash_balance?: number
          memo?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      stocks: {
        Row: {
          id: string
          user_id: string
          account_id: string | null
          symbol: string | null
          name: string
          quantity: number
          avg_price: number
          current_price: number | null
          status: string
          category: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          account_id?: string | null
          symbol?: string | null
          name: string
          quantity?: number
          avg_price?: number
          current_price?: number | null
          status: string
          category?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          account_id?: string | null
          symbol?: string | null
          name?: string
          quantity?: number
          avg_price?: number
          current_price?: number | null
          status?: string
          category?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      memos: {
        Row: {
          id: string
          user_id: string
          stock_id: string
          type: string
          buy_reason: string | null
          expected_scenario: string | null
          risks: string | null
          current_thought: string | null
          sell_review: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          stock_id: string
          type: string
          buy_reason?: string | null
          expected_scenario?: string | null
          risks?: string | null
          current_thought?: string | null
          sell_review?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          stock_id?: string
          type?: string
          buy_reason?: string | null
          expected_scenario?: string | null
          risks?: string | null
          current_thought?: string | null
          sell_review?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      attachments: {
        Row: {
          id: string
          user_id: string
          memo_id: string
          type: string
          file_name: string
          file_size: number
          mime_type: string
          storage_url: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          memo_id: string
          type: string
          file_name: string
          file_size: number
          mime_type: string
          storage_url: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          memo_id?: string
          type?: string
          file_name?: string
          file_size?: number
          mime_type?: string
          storage_url?: string
          created_at?: string
        }
      }
    }
  }
}
