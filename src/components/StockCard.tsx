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
  const currentPrice = stock.currentPrice || stock.avgPrice;
  const profit = (currentPrice - stock.avgPrice) * stock.quantity;
  const profitRate = stock.avgPrice > 0 ? ((currentPrice - stock.avgPrice) / stock.avgPrice) * 100 : 0;

  return (
    <Card 
      onClick={() => navigate(`/stocks/${stock.id}`)}
      className={cn(
        "bg-gray-900/40 hover:bg-gray-900/50 border-none flex items-center justify-between group cursor-pointer overflow-hidden relative transition-all duration-300 ease-out",
        "hover:-translate-y-0.5 hover:shadow-xl",
        compact ? "py-3 px-4 rounded-xl" : "p-6 rounded-[2rem]"
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
           compact ? "flex-row items-center gap-6" : "flex-col"
        )}>
          <div className="flex items-center gap-2 min-w-0 overflow-hidden">
            <span className={cn(
              "text-white truncate font-semibold",
              compact ? "text-md" : "text-xl"
            )}>
              {stock.name}
            </span>
            {stock.symbol && !compact && (
              <span className="text-[9px] font-black text-gray-500 bg-gray-950 px-1.5 py-0.5 rounded-md border border-white/[0.03] uppercase tracking-tighter shrink-0">
                {stock.symbol}
              </span>
            )}
            {stock.category && !compact && (
              <span className="text-[9px] font-black text-primary-400/80 bg-primary-500/5 px-1.5 py-0.5 rounded-md border border-primary-500/10 tracking-tighter shrink-0">
                {stock.category}
              </span>
            )}
          </div>

          <div className={cn(
            "flex items-center gap-2 font-semibold text-gray-600 uppercase tracking-widest shrink-0",
            compact ? "text-xs" : "text-md"
          )}>
            <span>{stock.quantity.toLocaleString()}주</span>
            <span className="w-0.5 h-0.5 rounded-full bg-gray-700/80" />
            <span>{formatCurrency(stock.avgPrice)}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4 ml-4">
        {stock.status === 'HOLDING' ? (
          <div className={cn(
            "flex items-center gap-3 text-right shrink-0",
            compact ? "flex-row" : "flex-col"
          )}>
            <div className={cn(
              "font-semibold tabular-nums tracking-tighter",
              compact ? "text-sm" : "text-lg",
              profit >= 0 ? "text-danger-light" : "text-info-light"
            )}>
              {profit >= 0 ? '+' : ''}{formatCurrency(profit)}
            </div>
            <div className={cn(
              "font-semibold tabular-nums text-[10px] opacity-70",
              profit >= 0 ? "text-danger-light" : "text-info-light"
            )}>
              {profitRate > 0 ? '+' : ''}{profitRate.toFixed(2)}%
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-end gap-1.5">
            <Badge status={stock.status} className="shadow-none scale-90" />
            {hasNote && (
              <span className="text-[10px] font-black text-gray-600 uppercase tracking-tighter">
                Research Active
              </span>
            )}
          </div>
        )}
        
        {/* Simplified Action: Static Subtle Arrow */}
        <div className="shrink-0 opacity-40 group-hover:opacity-100 transition-opacity duration-300">
          <ArrowUpRight 
            size={16} 
            className="text-gray-700 group-hover:text-primary-500 transition-colors duration-300" 
          />
        </div>
      </div>
    </Card>
  );
}
