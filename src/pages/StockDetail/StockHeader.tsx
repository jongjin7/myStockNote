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

export function StockHeader({ stock, account, currentPrice, onEdit, onDelete }: StockHeaderProps) {
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
        <BackButton />
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

        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between px-8 py-10 gap-10">
          {/* Left: Stock Info */}
          <div className="flex flex-col gap-4 w-full lg:w-auto">
            <div className="flex items-center gap-4">
              <h1 className="text-4xl font-black tracking-tighter text-white drop-shadow-sm">{stock.name}</h1>
              <Badge status={stock.status} className="bg-white/10 text-white border-white/5 py-1 px-4 text-[11px] font-black uppercase tracking-widest" />
            </div>

            <div className="flex flex-wrap items-center gap-6 text-white/70">
              {stock.symbol && (
                <span className="bg-black/30 border border-white/10 px-2.5 py-1 rounded-lg text-[11px] font-black tracking-widest text-white">
                  {stock.symbol}
                </span>
              )}
              <div className="flex items-center gap-2 text-sm font-bold">
                <Activity size={16} className="opacity-60" />
                <span>{account?.brokerName || '계좌 미지정'}</span>
              </div>
              <div className="flex items-center gap-2 text-sm font-bold">
                <Calendar size={16} className="opacity-60" />
                <span>{formatDate(new Date(stock.createdAt))}</span>
              </div>
            </div>
          </div>

          {/* Right: Focused Evaluation Box */}
          <div className="bg-black/30 backdrop-blur-md px-8 py-7 rounded-2xl border border-white/5 shadow-2xl flex items-center gap-10 w-full lg:w-auto justify-between lg:justify-end">
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] mb-1.5">
                {stock.status === 'WATCHLIST' ? 'Current Price' : 'Current Value'}
              </span>
              <div className="text-4xl font-black text-white tracking-tighter tabular-nums text-right leading-none">
                {stock.status === 'WATCHLIST' ? formatCurrency(currentPrice) : formatCurrency(stock.quantity * currentPrice)}
              </div>
            </div>

            {stock.status !== 'WATCHLIST' && (
              <div className="flex flex-col items-end">
                <div className={cn(
                  "text-xl font-black tabular-nums tracking-tighter leading-none mb-2 px-3 py-1 rounded-full shadow-lg",
                  (currentPrice - stock.avgPrice) >= 0 ? "bg-danger text-white" : "bg-info text-white"
                )}>
                  {(currentPrice - stock.avgPrice) >= 0 ? '+' : ''}
                  {(((currentPrice - stock.avgPrice) / (stock.avgPrice || 1)) * 100).toFixed(2)}%
                </div>
                <div className={cn(
                  "text-sm font-black tabular-nums tracking-tight",
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
