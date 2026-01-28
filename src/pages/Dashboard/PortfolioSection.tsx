import { PlusCircle, Target, TrendingUp, Plus } from 'lucide-react';
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
 <Link to={`/stocks/${stock.id}`} className="block">
  <Card interactive className="p-6 border-none bg-gray-900/40 hover:bg-gray-900/60 flex items-center group transition-all duration-500 relative overflow-hidden">
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
    <span className="text-[9px] font-black text-gray-500 bg-gray-950 px-2 py-0.5 rounded-lg border border-gray-800/80 uppercase tracking-tighter">
    {stock.symbol}
    </span>
   )}
   </div>
   <div className="text-[11px] font-bold text-gray-600 flex items-center gap-3 uppercase tracking-widest">
   <span className="text-gray-400">{stock.quantity.toLocaleString()}</span>
   <span className="text-gray-500 mr-2 -ml-2 text-sm lowercase ">주</span>
   <span className="w-1 h-1 rounded-full bg-gray-800" />
   <span className="text-gray-600 lowercase ">평단</span>
   <span className="text-gray-400 -ml-1">{formatCurrency(stock.avgPrice)}</span>
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
   "text-sm font-black px-2 py-0.5 rounded-md uppercase tracking-wider",
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

interface SectionTitleProps {
 title: string;
 subtitle: string;
 onAddClick?: () => void;
}

function SectionTitle({ title, subtitle, onAddClick }: SectionTitleProps) {
 return (
 <div className="flex items-center justify-between mb-4 px-3">
  <div className="flex items-center gap-4">
  <h2 className="text-4xl text-gray-600 font-bold">
   {title}
  </h2>
  <span className="text-lg text-gray-600">|</span>
  <span className="text-xl text-gray-600">{subtitle}</span>
  </div>
  {onAddClick && (
  <Button 
   variant="ghost" 
   size="sm" 
   onClick={onAddClick}
   className="bg-gray-900/40 hover:bg-gray-800 text-gray-400 hover:text-white rounded-full p-2 h-auto"
  >
   <Plus size={24} />
  </Button>
  )}
 </div>
 );
}

interface StatsCardProps {
 title: string;
 count: number;
 variant: 'portfolio' | 'watchlist';
}

function StatsCard({ title, count, variant }: StatsCardProps) {
 return (
 <div className="p-6 bg-gray-800/40 border border-white/5 rounded-2xl relative overflow-hidden shadow-sm">
  <div className="absolute top-0 right-0 p-6 opacity-5">
  <TrendingUp size={80} />
  </div>
  <div className="relative z-10">
  <div className="flex items-center gap-3 mb-4">
   <div className={cn(
   "p-3 rounded-xl",
   variant === "portfolio" ? "bg-success/10 text-success" : "bg-primary-500/10 text-primary-400"
   )}>
   <TrendingUp size={20} />
   </div>
   <div>
   <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">{title}</div>
   <div className="text-2xl text-white tracking-tighter tabular-nums font-bold">
    {count} <span className="text-sm text-gray-500">종목</span>
   </div>
   </div>
  </div>
  </div>
 </div>
 );
}

interface StockListProps {
 stocks: Stock[];
 memos: StockMemo[];
 emptyMessage: string;
 variant: 'portfolio' | 'watchlist';
 onAddClick: () => void;
}

function StockList({ stocks, memos, emptyMessage, variant, onAddClick }: StockListProps) {
 return (
 <div className="relative">
  <div className="flex flex-col gap-4">
  {stocks.length > 0 ? (
   stocks.map((stock) => (
   <StockListItem key={stock.id} stock={stock} memos={memos} />
   ))
  ) : (
   <button 
   onClick={onAddClick}
   className={cn(
    "border-2 border-dashed rounded-2xl p-12 text-center transition-all group",
    variant === "portfolio" 
    ? "bg-gray-950/20 border-gray-800/50 hover:border-gray-600 hover:bg-gray-950/30" 
    : "bg-gray-950/20 border-primary-500/20 hover:border-primary-500/40 hover:bg-primary-500/5"
   )}
   >
   <div className={cn(
    "mb-6 inline-flex p-6 rounded-full shadow-inner transition-transform group-hover:scale-110",
    variant === "portfolio" 
    ? "bg-gray-900/50 text-gray-700 group-hover:text-gray-500" 
    : "bg-primary-500/5 text-primary-700 group-hover:text-primary-500"
   )}>
    <PlusCircle size={48} />
   </div>
   <h3 className="text-xl font-black text-gray-400 mb-2 tracking-tight">Empty</h3>
   <p className="text-gray-600 text-xs font-medium">{emptyMessage}</p>
   </button>
  )}
  </div>
 </div>
 );
}

interface StockSectionCardProps {
 title: string;
 subtitle: string;
 stockCount: number;
 stocks: Stock[];
 memos: StockMemo[];
 emptyMessage: string;
 variant: 'portfolio' | 'watchlist';
 onAddClick: () => void;
}

function StockSectionCard({
 title,
 subtitle,
 stockCount,
 stocks,
 memos,
 emptyMessage,
 variant,
 onAddClick
}: StockSectionCardProps) {
 return (
 <div className="">
  {/* 섹션 타이틀 */}
  <SectionTitle title={title} subtitle={subtitle} onAddClick={onAddClick} />

  <div className="space-y-8">
  {/* 통계 카드 */}
  <StatsCard title={title} count={stockCount} variant={variant} />

  {/* 종목 리스트 */}
  <StockList 
   stocks={stocks} 
   memos={memos} 
   emptyMessage={emptyMessage} 
   variant={variant} 
   onAddClick={onAddClick}
  />
  </div>
 </div>
 );
}

interface PortfolioSectionProps {
 holdingStocks: Stock[];
 watchlistStocks: Stock[];
 memos: StockMemo[];
 onAddClick: (status: 'HOLDING' | 'WATCHLIST') => void;
}

export function PortfolioSection({ holdingStocks, watchlistStocks, memos, onAddClick }: PortfolioSectionProps) {
 return (
 <section className="lg:col-span-3">
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
  {/* 포트폴리오 섹션 (좌측) */}
  <StockSectionCard
   title="Portfolio"
   subtitle="포트폴리오"
   stockCount={holdingStocks.length}
   stocks={holdingStocks}
   memos={memos}
   emptyMessage="종목을 추가해 보세요"
   variant="portfolio"
   onAddClick={() => onAddClick('HOLDING')}
  />

  {/* 관심 종목 섹션 (우측) */}
  <StockSectionCard
   title="Watchlist"
   subtitle="관심 종목"
   stockCount={watchlistStocks.length}
   stocks={watchlistStocks}
   memos={memos}
   emptyMessage="관심 종목을 추가해 보세요"
   variant="watchlist"
   onAddClick={() => onAddClick('WATCHLIST')}
  />
  </div>
 </section>
 );
}
