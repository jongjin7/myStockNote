import { useNavigate } from 'react-router-dom';
import { LayoutList, TrendingUp, Target, PlusCircle, ArrowUpRight } from 'lucide-react';
import { Card, Badge } from '../../components/ui';
import { cn, formatCurrency } from '../../lib/utils';
import type { Stock, StockMemo, StockStatus } from '../../types';

interface PortfolioSectionProps {
  holdingStocks: Stock[];
  watchlistStocks: Stock[];
  memos: StockMemo[];
  onAddClick: (status: StockStatus) => void;
}

export function PortfolioSection({ holdingStocks, watchlistStocks, memos, onAddClick }: PortfolioSectionProps) {
  const navigate = useNavigate();

  // Calculate portfolio metrics
  const totalValue = holdingStocks.reduce((acc, curr) => {
    const currentPrice = curr.currentPrice || curr.avgPrice;
    return acc + (curr.quantity * currentPrice);
  }, 0);

  const profitableStocks = holdingStocks.filter(s => {
    const currentPrice = s.currentPrice || s.avgPrice;
    return currentPrice > s.avgPrice;
  }).length;

  const losingStocks = holdingStocks.length - profitableStocks;

  return (
    <div className="space-y-12 px-4 pb-20">
      {/* 1. Summary Header Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h2 className="text-[2.75rem] font-black text-gray-600 tracking-tight leading-none">Portfolio</h2>
            <span className="text-2xl font-light text-gray-800 leading-none">|</span>
            <span className="text-xl font-bold text-gray-600 leading-none">포트폴리오</span>
          </div>
          
          <button 
            onClick={() => navigate('/accounts')} 
            className="p-3 bg-gray-900/50 hover:bg-gray-800/80 text-gray-500 hover:text-gray-300 rounded-full transition-all border border-white/[0.03] hover:border-white/[0.08] group"
          >
            <LayoutList size={20} className="group-hover:scale-110 transition-transform" />
          </button>
        </div>

        {/* Ultra-Clean Info Card */}
        <Card className="relative overflow-hidden bg-[#0d0f14]/60 backdrop-blur-sm border border-white/[0.02] rounded-[2rem] p-10 min-h-[160px] flex items-center group/card shadow-2xl">
          <TrendingUp 
            size={200} 
            className="absolute right-[-30px] bottom-[-50px] text-white/[0.015] -rotate-12 group-hover/card:text-white/[0.025] transition-all duration-1000 ease-out pointer-events-none" 
          />

          <div className="relative z-10 flex items-center gap-10 w-full">
            <div className="w-16 h-16 bg-success/[0.06] rounded-[1.25rem] flex items-center justify-center border border-success/[0.08] shadow-inner">
              <TrendingUp className="text-success/80" size={28} strokeWidth={2.5} />
            </div>

            <div className="flex-1 flex flex-col md:flex-row md:items-center justify-between gap-8">
              <div className="space-y-1">
                <p className="text-[10px] font-black text-gray-600 uppercase tracking-[0.25em] leading-none">Portfolio</p>
                <div className="flex items-baseline gap-2.5 mt-2">
                  <span className="text-5xl font-black text-white/95 tabular-nums tracking-tighter leading-none">
                    {holdingStocks.length}
                  </span>
                  <span className="text-lg font-bold text-gray-600 leading-none">종목</span>
                </div>
              </div>

              <div className="flex items-center gap-10 ml-auto">
                <div className="space-y-1.5">
                  <p className="text-[9px] font-black text-gray-700 uppercase tracking-[0.15em]">Total Value</p>
                  <p className="text-xl font-black text-white/90 tabular-nums tracking-tight">
                    {totalValue > 100000000 
                      ? `${(totalValue / 100000000).toFixed(1)}억` 
                      : formatCurrency(totalValue)}
                  </p>
                </div>
                
                <div className="space-y-1.5">
                  <p className="text-[9px] font-black text-gray-700 uppercase tracking-[0.15em]">Performance</p>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-success/70 bg-success/[0.08] px-2.5 py-1 rounded-lg border border-success/[0.1]">
                      {profitableStocks} 수익
                    </span>
                    <span className="text-xs font-black text-danger-light/70 bg-danger/[0.08] px-2.5 py-1 rounded-lg border border-danger/[0.1]">
                      {losingStocks} 손실
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* 2. Detailed Lists Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Left: Holding Stocks */}
        <div className="space-y-6">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-3">
              <h3 className="text-2xl font-black text-white/80 tracking-tight">Holdings</h3>
              <span className="text-sm font-bold text-gray-600">보유 종목</span>
            </div>
            <button 
              onClick={() => onAddClick('HOLDING')}
              className="p-2 hover:bg-white/5 rounded-full text-gray-500 hover:text-primary-400 transition-colors"
            >
              <PlusCircle size={20} />
            </button>
          </div>
          <StockList stocks={holdingStocks} memos={memos} emptyMessage="보유 중인 종목이 없습니다." onAddClick={() => onAddClick('HOLDING')} />
        </div>

        {/* Right: Watchlist */}
        <div className="space-y-6">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-3">
              <h3 className="text-2xl font-black text-white/80 tracking-tight">Watchlist</h3>
              <span className="text-sm font-bold text-gray-600">관심 종목</span>
            </div>
            <button 
              onClick={() => onAddClick('WATCHLIST')}
              className="p-2 hover:bg-white/5 rounded-full text-gray-500 hover:text-primary-400 transition-colors"
            >
              <PlusCircle size={20} />
            </button>
          </div>
          <StockList stocks={watchlistStocks} memos={memos} emptyMessage="관심 종목이 없습니다." onAddClick={() => onAddClick('WATCHLIST')} />
        </div>
      </div>
    </div>
  );
}

function StockList({ stocks, memos, emptyMessage, onAddClick }: { stocks: Stock[], memos: StockMemo[], emptyMessage: string, onAddClick: () => void }) {
  if (stocks.length === 0) {
    return (
      <button 
        onClick={onAddClick}
        className="w-full h-32 border-2 border-dashed border-white/5 rounded-3xl flex flex-col items-center justify-center gap-2 hover:bg-white/[0.02] hover:border-white/10 transition-all group"
      >
        <PlusCircle size={24} className="text-gray-700 group-hover:text-gray-500 transition-colors" />
        <span className="text-xs font-bold text-gray-600 group-hover:text-gray-400">{emptyMessage}</span>
      </button>
    );
  }

  return (
    <div className="space-y-3">
      {stocks.map(stock => (
        <StockCard key={stock.id} stock={stock} memos={memos} />
      ))}
    </div>
  );
}

function StockCard({ stock, memos }: { stock: Stock, memos: StockMemo[] }) {
  const navigate = useNavigate();
  const stockMemos = memos.filter(m => m.stockId === stock.id);
  const currentPrice = stock.currentPrice || stock.avgPrice;
  const profit = (currentPrice - stock.avgPrice) * stock.quantity;
  const profitRate = stock.avgPrice > 0 ? ((currentPrice - stock.avgPrice) / stock.avgPrice) * 100 : 0;

  return (
    <Card 
      onClick={() => navigate(`/stocks/${stock.id}`)}
      className="p-4 bg-gray-900/40 hover:bg-gray-900/60 border-none rounded-2xl flex items-center justify-between group transition-all duration-300 cursor-pointer"
    >
      <div className="flex items-center gap-4">
        <div className="p-3 bg-gray-950 rounded-xl group-hover:scale-105 transition-transform">
          <Target size={18} className={stockMemos.length > 0 ? "text-primary-500" : "text-gray-700"} />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-base font-bold text-white group-hover:text-primary-400 transition-colors">{stock.name}</span>
            {stock.symbol && <span className="text-[10px] font-black text-gray-600 uppercase tracking-tighter">{stock.symbol}</span>}
          </div>
          <div className="flex items-center gap-2 text-[11px] font-bold text-gray-600">
            <span>{stock.quantity.toLocaleString()}주</span>
            <span className="w-0.5 h-0.5 rounded-full bg-gray-800" />
            <span>{formatCurrency(stock.avgPrice)}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-6">
        {stock.status === 'HOLDING' ? (
          <div className="text-right">
            <div className={cn("text-sm font-black tabular-nums", profit >= 0 ? "text-danger-light" : "text-info-light")}>
              {profit >= 0 ? '+' : ''}{formatCurrency(profit)}
            </div>
            <div className={cn("text-[10px] font-black tabular-nums", profit >= 0 ? "text-danger-light/60" : "text-info-light/60")}>
              {profitRate > 0 ? '+' : ''}{profitRate.toFixed(2)}%
            </div>
          </div>
        ) : (
          <Badge status={stock.status} size="sm" />
        )}
        <ArrowUpRight size={16} className="text-gray-800 group-hover:text-gray-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
      </div>
    </Card>
  );
}
