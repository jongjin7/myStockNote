import { Link } from 'react-router-dom';
import { Target } from 'lucide-react';
import { Card, Badge } from '../../../components/ui';
import { cn, formatCurrency } from '../../../lib/utils';
import type { Stock } from '../../../types';

interface StockCardProps {
  stock: Stock;
  hasNote: boolean;
}

export function StockCard({ stock, hasNote }: StockCardProps) {
  const currentPrice = stock.currentPrice || stock.avgPrice;
  const profit = (currentPrice - stock.avgPrice) * stock.quantity;
  const profitRate = stock.avgPrice > 0 ? ((currentPrice - stock.avgPrice) / stock.avgPrice) * 100 : 0;

  return (
    <Link to={`/stocks/${stock.id}`}>
      <Card interactive className="p-6 bg-gray-900/40 border-gray-800 hover:border-primary-500/30 transition-all flex items-center group">
        <div className="p-4 bg-gray-950 rounded-2xl mr-6 border border-gray-800 group-hover:border-primary-500/50 transition-all">
          <Target size={24} className={hasNote ? "text-primary-500" : "text-gray-700"} />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-1">
            <span className="font-bold text-xl text-white group-hover:text-primary-400 transition-colors">{stock.name}</span>
            {stock.symbol && (
              <span className="text-[9px] font-black text-gray-500 bg-gray-950 px-2 py-0.5 rounded border border-gray-800 uppercase tracking-tighter">
                {stock.symbol}
              </span>
            )}
          </div>
          <div className="text-sm font-bold text-gray-500 flex items-center gap-3 uppercase tracking-widest">
            <span>{stock.quantity.toLocaleString()}주</span>
            <span className="w-1 h-1 rounded-full bg-gray-800" />
            <span>평단 {formatCurrency(stock.avgPrice)}</span>
          </div>
        </div>

        <div className="flex flex-col items-end gap-1 mr-8 text-right">
          <div className={cn(
            "text-lg font-black tabular-nums",
            profit >= 0 ? "text-danger-light" : "text-info-light"
          )}>
            {profit >= 0 ? '+' : ''}{formatCurrency(profit)}
          </div>
          <div className={cn(
            "text-sm font-black px-2 py-0.5 rounded uppercase tracking-wider",
            profit >= 0 ? "bg-danger/10 text-danger-light" : "bg-info/10 text-info-light"
          )}>
            {profit >= 0 ? '+' : ''}{profitRate.toFixed(2)}%
          </div>
        </div>

        <Badge status={stock.status} />
      </Card>
    </Link>
  );
}
