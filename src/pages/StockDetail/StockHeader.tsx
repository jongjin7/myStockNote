import { Pencil, Trash2, Activity, Calendar } from 'lucide-react';
import { Button, Badge, BackButton } from '../../components/ui';
import { cn, formatCurrency, formatDate } from '../../lib/utils';
import type { Stock, Account } from '../../types';

interface StockHeaderProps {
  stock: Stock;
  account?: Account;
  currentPrice: number;
  onEdit: () => void;
  onDelete: () => void;
}

export function StockHeader({ 
  stock, 
  account, 
  currentPrice, 
  onEdit, 
  onDelete
}: StockHeaderProps) {
  const getHeroCardBg = (s: string) => {
    switch (s) {
      case 'HOLDING': return 'from-success-dark/80 to-success/60';
      case 'WATCHLIST': return 'from-info-dark/80 to-info/60';
      case 'PARTIAL_SOLD': return 'from-primary-700/80 to-primary-500/60';
      case 'SOLD': return 'from-gray-700 to-gray-500';
      default: return 'from-gray-800 to-gray-600';
    }
  };

  return (
    <header className="flex flex-col space-y-6">
      <div className="flex items-center justify-between w-full">
        <BackButton to={stock.status === 'WATCHLIST' ? '/watchlist' : '/holdings'} />
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onDelete}
            className="h-10 px-4 rounded-xl font-bold text-white/30 hover:text-danger-light hover:bg-danger/10 transition-all"
          >
            <Trash2 size={16} className="mr-2" />
            <span>삭제</span>
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={onEdit}
            className="h-10 px-4 rounded-xl font-bold bg-white/5 border-white/10 hover:bg-white/10 text-white/80 transition-all"
          >
            <Pencil size={16} className="mr-2" />
            <span>수정</span>
          </Button>
        </div>
      </div>

      <div className="relative rounded-3xl shadow-xl overflow-hidden border border-white/10 group">
        {/* Dynamic Background Layer */}
        <div className={cn(
          "absolute inset-0 bg-gradient-to-r opacity-90",
          getHeroCardBg(stock.status)
        )} />
        <div className="absolute inset-0 bg-black/10" />
        <div className="absolute -right-10 -top-10 w-64 h-64 bg-white/10 rounded-full blur-3xl opacity-50" />

        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between p-7 gap-5">
          {/* Left: Stock Info */}
          <div className="flex flex-col gap-4 w-full lg:flex-1 min-w-0">
            <div className="flex items-center gap-4 flex-wrap">
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white drop-shadow-sm break-keep leading-[1.1]">
                {stock.name}
              </h1>
              <Badge 
                status={stock.status} 
                className="bg-white/10 text-white/80 border-white/5 py-1 px-4 text-sm font-semibold uppercase tracking-widest flex-shrink-0" 
              />
            </div>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-white/70">
              {stock.symbol && (
                <span className="bg-black/30 px-2 py-0.5 rounded-md text-xs font-medium tracking-widest text-white/80 shrink-0">
                  {stock.symbol}
                </span>
              )}
              <div className="flex items-center gap-2 text-sm font-medium whitespace-nowrap">
                <Activity size={16} className="opacity-60" />
                <span>{account?.brokerName || '계좌 미지정'}</span>
              </div>
              <div className="flex items-center gap-2 text-sm font-medium whitespace-nowrap">
                <Calendar size={16} className="opacity-60" />
                <span>{formatDate(new Date(stock.createdAt))}</span>
              </div>
            </div>
          </div>

          {/* Right: Focused Evaluation Box */}
          <div className="bg-black/30 backdrop-blur-sm px-6 py-5 md:px-8 md:py-7 rounded-2xl border border-white/5 shadow-2xl flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-10 w-full lg:w-auto">
            <div className="flex flex-col min-w-0 flex-1 sm:flex-none">
              <span className="text-[10px] md:text-sm font-normal text-white/40 uppercase tracking-[0.2em] mb-1.5 whitespace-nowrap">
                {stock.status === 'WATCHLIST' ? '현재 종목가' : '현재 평가금액'}
              </span>
              <div className="text-2xl md:text-4xl font-black text-white tracking-tighter tabular-nums leading-none">
                {stock.status === 'WATCHLIST' ? formatCurrency(currentPrice) : formatCurrency(stock.quantity * currentPrice)}
              </div>
            </div>

            {stock.status !== 'WATCHLIST' && (
              <div className="flex flex-row sm:flex-col items-center sm:items-end gap-3 sm:gap-0 mt-2 sm:mt-0">
                <div className={cn(
                  "text-base md:text-xl font-black tabular-nums tracking-tighter leading-none sm:mb-2 px-3 py-1.5 rounded-full shadow-lg whitespace-nowrap",
                  (currentPrice - stock.avgPrice) >= 0 ? "bg-danger text-white" : "bg-info text-white"
                )}>
                  {(currentPrice - stock.avgPrice) >= 0 ? '+' : ''}
                  {(((currentPrice - stock.avgPrice) / (stock.avgPrice || 1)) * 100).toFixed(2)}%
                </div>
                <div className={cn(
                  "text-xs md:text-sm font-black tabular-nums tracking-tight whitespace-nowrap",
                  (currentPrice - stock.avgPrice) >= 0 ? "text-danger-light" : "text-info-light"
                )}>
                  {(currentPrice - stock.avgPrice) >= 0 ? '+' : ''}
                  {formatCurrency((currentPrice - stock.avgPrice) * stock.quantity)}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
