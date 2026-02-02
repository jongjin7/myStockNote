import { useNavigate } from 'react-router-dom';
import { Target, ArrowUpRight } from 'lucide-react';
import { Card, Badge } from './ui';
import { cn, formatCurrency } from '../lib/utils';
import type { Stock } from '../types';

interface StockCardProps {
  stock: Stock;
  hasNote?: boolean;
  compact?: boolean;
}

export function StockCard({ stock, hasNote, compact = false }: StockCardProps) {
  const navigate = useNavigate();
  const currentPrice = stock.currentPrice || 0;
  const profit = (currentPrice - stock.avgPrice) * stock.quantity;
  const profitRate = stock.avgPrice > 0 ? ((currentPrice - stock.avgPrice) / stock.avgPrice) * 100 : 0;

  return (
    <Card 
      onClick={() => navigate(`/stocks/${stock.id}`)}
      className={cn(
        "bg-gray-800/20 hover:bg-gray-800/70 border-none flex items-center justify-between group cursor-pointer overflow-hidden relative transition-all duration-300 ease-out",
        "hover:-translate-y-0.5 hover:shadow-xl",
        compact ? "py-3 px-4 rounded-xl" : "p-4 rounded-2xl"
      )}
    >
      {/* Visual Indicator for Profit/Loss on the side */}
      <div className={cn(
        "absolute left-0 top-0 bottom-0 w-1 opacity-20 transition-all group-hover:w-1.5",
        stock.status === 'HOLDING' ? (profit >= 0 ? "bg-danger" : "bg-info") : "bg-gray-800"
      )} />

      <div className="flex items-center gap-3 transition-transform group-hover:translate-x-1 duration-300 min-w-0 flex-1">
        <div className={cn(
          "bg-gray-950 rounded-xl group-hover:scale-105 transition-transform flex items-center justify-center shrink-0 border border-white/[0.03]",
          compact ? "w-8 h-8" : "w-14 h-14"
        )}>
          <Target size={compact ? 14 : 24} className={hasNote ? "text-primary-500" : "text-gray-700"} />
        </div>

        <div className={cn(
          "flex min-w-0 flex-1",
          compact ? "flex-col lg:flex-row lg:items-center gap-1 lg:gap-6" : "flex-col gap-1"
        )}>
          <div className="flex items-center gap-2 min-w-0">
            <span className={cn(
              "text-white truncate font-semibold leading-tight",
              compact ? "text-sm sm:text-base font-bold" : "text-lg sm:text-xl"
            )}>
              {stock.name}
            </span>
          </div>

          <div className={cn(
            "flex items-center gap-1.5 sm:gap-2 text-gray-600 uppercase tracking-wide shrink-0",
            compact ? "text-[9px] sm:text-xs font-bold" : "text-sm sm:text-md"
          )}>
            {stock.status === 'WATCHLIST' ? (
              <span className="truncate">
                <span className="hidden sm:inline">현재가 </span>
                {formatCurrency(currentPrice)}
              </span>
            ) : (
              <>
                <span className="whitespace-nowrap">{stock.quantity.toLocaleString()}주</span>
                <span className="w-0.5 h-0.5 rounded-full bg-gray-700/80 shrink-0" />
                <span className="truncate">{formatCurrency(stock.avgPrice)}</span>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3 ml-2 sm:ml-4 shrink-0">
        {stock.status === 'HOLDING' ? (
          <div className={cn(
            "flex items-center text-right shrink-0",
            compact ? "flex-col items-end gap-0" : "flex-col gap-0.5 sm:gap-1"
          )}>
            <div className={cn(
              "font-bold tabular-nums tracking-tighter leading-none mb-0.5 sm:mb-1",
              compact ? "text-[11px] sm:text-sm" : "text-md sm:text-lg",
              profit >= 0 ? "text-danger-light" : "text-info-light"
            )}>
              {profit >= 0 ? '+' : ''}{formatCurrency(profit)}
            </div>
            <div className={cn(
              "font-bold tabular-nums text-[9px] sm:text-xs opacity-70 leading-none",
              profit >= 0 ? "text-danger-light" : "text-info-light"
            )}>
              {profitRate > 0 ? '+' : ''}{profitRate.toFixed(2)}%
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
            <Badge status={stock.status} className="shadow-none scale-75 sm:scale-90" />
          </div>
        )}
      </div>

      <div className={cn(
        "absolute right-2  opacity-0 group-hover:opacity-100 transition-opacity",
        compact ? "top-1" : "top-2"
      )}>
        <ArrowUpRight size={16} className="text-gray-600" />
      </div>
    </Card>
  );
}
