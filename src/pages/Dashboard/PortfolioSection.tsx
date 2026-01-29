import { useNavigate } from 'react-router-dom';
import { LayoutList, TrendingUp, PlusCircle, Bookmark, LayoutDashboard } from 'lucide-react';
import { Card, SectionHeader, Badge } from '../../components/ui';
import { formatCurrency } from '../../lib/utils';
import type { Stock, StockMemo, StockStatus } from '../../types';
import { StockCard } from '../../components/StockCard';

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
        <SectionHeader 
          icon={TrendingUp}
          title="보유 종목"
          extra={
            <button 
              onClick={() => navigate('/accounts')} 
              className="p-3 bg-gray-900/50 hover:bg-gray-800/80 text-gray-500 hover:text-gray-300 rounded-full transition-all border border-white/[0.03] hover:border-white/[0.08] group"
            >
              <LayoutList size={20} className="group-hover:scale-110 transition-transform" />
            </button>
          }
        />

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
                <p className="text-[10px] font-black text-gray-600 uppercase tracking-[0.25em] leading-none">Holdings</p>
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
                    <Badge variant="success" className="font-black py-1 px-3">
                      {profitableStocks} 수익
                    </Badge>
                    <Badge variant="danger" className="font-black py-1 px-3">
                      {losingStocks} 손실
                    </Badge>
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
          <SectionHeader 
            icon={LayoutDashboard}
            title="보유 리스트"
            count={holdingStocks.length}
            extra={
              <button 
                onClick={() => onAddClick('HOLDING')}
                className="p-2 hover:bg-white/5 rounded-full text-gray-500 hover:text-primary-400 transition-colors"
              >
                <PlusCircle size={20} />
              </button>
            }
          />
          <StockList stocks={holdingStocks} memos={memos} emptyMessage="보유 중인 종목이 없습니다." onAddClick={() => onAddClick('HOLDING')} />
        </div>

        {/* Right: Watchlist */}
        <div className="space-y-6">
          <SectionHeader 
            icon={Bookmark}
            title="관심 리스트"
            count={watchlistStocks.length}
            extra={
              <button 
                onClick={() => onAddClick('WATCHLIST')}
                className="p-2 hover:bg-white/5 rounded-full text-gray-500 hover:text-primary-400 transition-colors"
              >
                <PlusCircle size={20} />
              </button>
            }
          />
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
      {stocks.map(stock => {
        const hasNote = memos.some(m => m.stockId === stock.id);
        return (
          <StockCard 
            key={stock.id} 
            stock={stock} 
            hasNote={hasNote} 
            compact 
          />
        );
      })}
    </div>
  );
}
