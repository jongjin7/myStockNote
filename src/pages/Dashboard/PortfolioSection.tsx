import { ChevronRight, PlusCircle, Target } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, Badge, Button } from '../../components/ui';
import { cn, formatCurrency } from '../../lib/utils';
import type { Stock, StockMemo } from '../../types';

interface StockListItemProps {
  stock: Stock;
  memos: StockMemo[];
}

function StockListItem({ stock, memos }: StockListItemProps) {
  const stockMemos = memos.filter(m => m.stockId === stock.id);
  const hasNote = stockMemos.length > 0;
  const currentPrice = stock.currentPrice || stock.avgPrice;
  const profit = (currentPrice - stock.avgPrice) * stock.quantity;
  const profitRate = stock.avgPrice > 0 ? ((currentPrice - stock.avgPrice) / stock.avgPrice) * 100 : 0;

  return (
    <Link to={`/stocks/${stock.id}`}>
      <Card interactive className="p-6 border-gray-800/40 bg-gray-900/20 hover:bg-gray-900/60 flex items-center group transition-all duration-500 relative overflow-hidden backdrop-blur-sm">
        <div className={cn(
          "absolute right-0 top-0 bottom-0 w-1 opacity-40 transition-all group-hover:w-2",
          profit >= 0 ? "bg-danger shadow-[0_0_15px_rgba(239,68,68,0.4)]" : "bg-info shadow-[0_0_15px_rgba(14,165,233,0.4)]"
        )} />

        <div className="p-4 bg-gray-950 rounded-2xl mr-6 border border-gray-800/80 shadow-inner group-hover:border-primary-500/50 group-hover:scale-105 transition-all">
          <Target size={24} className={hasNote ? "text-primary-500" : "text-gray-700"} />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-1.5">
            <span className="font-bold text-xl text-white group-hover:text-primary-400 transition-colors truncate">{stock.name}</span>
            {stock.symbol && (
              <span className="text-[9px] font-black font-mono text-gray-500 bg-gray-950 px-2 py-0.5 rounded-lg border border-gray-800/80 uppercase tracking-tighter">
                {stock.symbol}
              </span>
            )}
          </div>
          <div className="text-[11px] font-bold text-gray-600 flex items-center gap-3 uppercase tracking-widest">
            <span className="text-gray-400 font-num">{stock.quantity.toLocaleString()}</span>
            <span className="text-gray-500 mr-2 -ml-2 text-[10px] lowercase font-sans">주</span>
            <span className="w-1 h-1 rounded-full bg-gray-800" />
            <span className="text-gray-600 lowercase font-sans">평단</span>
            <span className="font-num text-gray-400 -ml-1">{formatCurrency(stock.avgPrice)}</span>
          </div>
        </div>

        <div className="flex flex-col items-end gap-1.5 mr-10 text-right min-w-[120px]">
          <div className={cn(
            "text-lg font-black tracking-tighter tabular-nums",
            profit > 0 ? "text-danger-light" : profit < 0 ? "text-info-light" : "text-gray-500"
          )}>
            {profit > 0 ? '+' : ''}{formatCurrency(profit)}
          </div>
          <div className={cn(
            "text-[10px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider font-num",
            profit > 0 ? "bg-danger/10 text-danger-light" : profit < 0 ? "bg-info/10 text-info-light" : "bg-gray-800 text-gray-500"
          )}>
            {profit > 0 ? '+' : ''}{profitRate.toFixed(2)}%
          </div>
        </div>

        <div className="flex flex-col items-end gap-3 shrink-0">
          <Badge status={stock.status} className="px-3 py-1 shadow-sm" />
          <div className={cn(
            "text-[9px] font-black px-2.5 py-1 rounded-lg uppercase tracking-widest transition-colors",
            hasNote ? 'text-primary-400 bg-primary-500/10' : 'text-warning/80 bg-warning/5 border border-warning/10'
          )}>
            {hasNote ? `${stockMemos.length}건의 기록` : '기록 없음'}
          </div>
        </div>
      </Card>
    </Link>
  );
}

interface PortfolioSectionProps {
  holdingStocks: Stock[];
  memos: StockMemo[];
  watchlistCount: number;
}

export function PortfolioSection({ holdingStocks, memos, watchlistCount }: PortfolioSectionProps) {
  return (
    <section className="lg:col-span-3 space-y-8">
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-4">
          <h2 className="text-3xl font-black text-white tracking-tight">주요 포트폴리오</h2>
          <div className="px-3 py-1 bg-gray-900 border border-gray-800 rounded-full text-[10px] font-black text-gray-500 uppercase tracking-widest font-num">
            {holdingStocks.length} ITEMS
          </div>
        </div>
        <Link to="/watchlist" className="group text-xs font-black text-primary-500 hover:text-primary-400 flex items-center transition-all uppercase tracking-widest">
          관심 종목 리스트 ({watchlistCount})
          <ChevronRight size={14} className="ml-1 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
      
      <div className="space-y-5">
        {holdingStocks.length > 0 ? (
          holdingStocks.map((stock) => (
            <StockListItem key={stock.id} stock={stock} memos={memos} />
          ))
        ) : (
          <div className="bg-gray-950/20 border-2 border-dashed border-gray-800/50 rounded-[32px] p-20 text-center">
            <div className="mb-8 inline-flex p-8 bg-gray-900/50 rounded-full text-gray-700 shadow-inner">
              <PlusCircle size={64} />
            </div>
            <h3 className="text-2xl font-black text-gray-400 mb-3 tracking-tight">Empty Portfolio</h3>
            <p className="text-gray-600 mb-10 max-w-xs mx-auto text-sm font-medium leading-relaxed">준비된 자산이 없습니다. 계좌를 등록하고 첫 번째 투자 종목을 추가해 보세요.</p>
            <Link to="/accounts">
              <Button size="lg" className="shadow-2xl shadow-primary-500/30 px-12 h-14 rounded-2xl font-black">
                <PlusCircle size={20} className="mr-3" />
                <span>Get Started</span>
              </Button>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
