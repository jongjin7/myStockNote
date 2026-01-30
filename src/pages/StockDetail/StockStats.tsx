import { TrendingUp, RefreshCw } from 'lucide-react';
import { Card, SectionHeader } from '../../components/ui';
import { cn, formatCurrency } from '../../lib/utils';
import type { Stock } from '../../types';

interface StockStatsProps {
  stock: Stock;
  currentPrice: number;
  fetchCurrentPrice: () => void;
  isUpdatingPrice: boolean;
}

export function StockStats({ stock, currentPrice, fetchCurrentPrice, isUpdatingPrice }: StockStatsProps) {
  if (stock.status === 'WATCHLIST') return null;

  return (
    <Card className="border-gray-800 bg-gray-900/40 backdrop-blur-sm pt-4 pb-4 px-5 rounded-3xl">
      <div className="mb-6">
        <SectionHeader
          icon={TrendingUp}
          title="핵심 투자 지표"
          className="px-0"
        />
      </div>

      <div className="space-y-0 divide-y divide-white/5 border-y border-white/5 -mx-5 px-5">
        <div className="flex justify-between items-center py-4">
          <span className="text-sm font-bold text-gray-500 uppercase tracking-widest">보유 수량</span>
          <span className="text-xl font-black text-white tabular-nums">
            {stock.quantity.toLocaleString()} <span className="text-xs text-gray-600 font-medium ml-1 lowercase">주</span>
          </span>
        </div>

        <div className="grid grid-cols-2">
          <div className="py-4 pr-4 border-r border-white/5 space-y-1">
            <div className="text-sm font-bold text-gray-500 uppercase tracking-widest">평균 단가</div>
            <div className="text-lg font-bold text-gray-300 tabular-nums">{formatCurrency(stock.avgPrice)}</div>
          </div>
          <div className="py-4 pl-5 space-y-1">
            <div className="flex items-center gap-2">
              <div className="text-sm font-bold text-primary-500 uppercase tracking-widest">현재가</div>
              <button
                onClick={fetchCurrentPrice}
                disabled={isUpdatingPrice}
                className={cn(
                  "p-1.5 rounded-md bg-primary-500/10 hover:bg-primary-500/20 text-primary-500 transition-all",
                  isUpdatingPrice && "animate-spin"
                )}
                title="현재가 갱신"
              >
                <RefreshCw size={12} />
              </button>
            </div>
            <div className="text-lg font-black text-primary-400 tabular-nums">{formatCurrency(currentPrice)}</div>
          </div>
        </div>

        <div className="py-4 flex justify-between items-center">
          <span className="text-sm font-bold text-gray-500 uppercase tracking-widest">투자 원금 (Total)</span>
          <span className="text-lg font-bold text-gray-400 tabular-nums">{formatCurrency(stock.quantity * stock.avgPrice)}</span>
        </div>
      </div>
    </Card>
  );
}
