-- 1. Create Tables

-- Accounts Table
CREATE TABLE public.accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    broker_name TEXT NOT NULL,
    cash_balance NUMERIC DEFAULT 0,
    memo TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Stocks Table
CREATE TABLE public.stocks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    account_id UUID REFERENCES public.accounts(id) ON DELETE SET NULL,
    symbol TEXT,
    name TEXT NOT NULL,
    quantity NUMERIC DEFAULT 0,
    avg_price NUMERIC DEFAULT 0,
    current_price NUMERIC,
    status TEXT NOT NULL, -- e.g., 'HOLDING', 'WATCHLIST', 'PARTIAL_SOLD', 'SOLD'
    category TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Memos Table
CREATE TABLE public.memos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    stock_id UUID NOT NULL REFERENCES public.stocks(id) ON DELETE CASCADE,
    type TEXT NOT NULL, -- e.g., 'PURCHASE', 'SELL', 'GENERAL'
    buy_reason TEXT,
    expected_scenario TEXT,
    risks TEXT,
    current_thought TEXT,
    sell_review TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Attachments Table
CREATE TABLE public.attachments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    memo_id UUID NOT NULL REFERENCES public.memos(id) ON DELETE CASCADE,
    type TEXT NOT NULL, -- e.g., 'IMAGE'
    file_name TEXT NOT NULL,
    file_size NUMERIC NOT NULL,
    mime_type TEXT NOT NULL,
    storage_url TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public.accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.memos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attachments ENABLE ROW LEVEL SECURITY;

-- 3. Create RLS Policies

-- Accounts Policies
CREATE POLICY "Users can view their own accounts" ON public.accounts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own accounts" ON public.accounts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own accounts" ON public.accounts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own accounts" ON public.accounts FOR DELETE USING (auth.uid() = user_id);

-- Stocks Policies
CREATE POLICY "Users can view their own stocks" ON public.stocks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own stocks" ON public.stocks FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own stocks" ON public.stocks FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own stocks" ON public.stocks FOR DELETE USING (auth.uid() = user_id);

-- Memos Policies
CREATE POLICY "Users can view their own memos" ON public.memos FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own memos" ON public.memos FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own memos" ON public.memos FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own memos" ON public.memos FOR DELETE USING (auth.uid() = user_id);

-- Attachments Policies
CREATE POLICY "Users can view their own attachments" ON public.attachments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own attachments" ON public.attachments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own attachments" ON public.attachments FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own attachments" ON public.attachments FOR DELETE USING (auth.uid() = user_id);

-- 4. Create Storage Buckets and Policies

-- Note: You should create the 'stock-images' bucket manually in the Supabase Dashboard,
-- or use the following SQL if your Supabase setup supports it.
-- INSERT INTO storage.buckets (id, name, public) VALUES ('stock-images', 'stock-images', true);

-- Storage Policies for 'stock-images'
-- CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'stock-images');
-- CREATE POLICY "Users can upload their own images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'stock-images' AND auth.uid()::text = (storage.foldername(name))[1]);
-- CREATE POLICY "Users can delete their own images" ON storage.objects FOR DELETE USING (bucket_id = 'stock-images' AND auth.uid()::text = (storage.foldername(name))[1]);
