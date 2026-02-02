import { TrendingUp, RefreshCw } from 'lucide-react';
import { Card, SectionHeader, Button } from '../../components/ui';
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
      <div className="mb-3">
        <SectionHeader
          icon={TrendingUp}
          title="핵심 투자 지표"
          className="px-0"
        />
      </div>

      <div className="space-y-0 divide-y divide-white/5 border-y border-white/5 border-b-0 -mx-5 px-5 font-semibold text-xs text-gray-500">
        <div className="flex justify-between items-center py-3">
          <span className="uppercase ">보유 수량</span>
          <span className="">
            <span className='text-xl font-bold text-white tabular-nums'>{stock.quantity.toLocaleString()}</span> <span className=" text-gray-600 ml-1 uppercase">주</span>
          </span>
        </div>

        <div className="flex flex-col sm:flex-row divide-y sm:divide-y-0 sm:divide-x divide-white/5">
          <div className="py-4 sm:flex-1 space-y-1 min-w-0">
            <div className="uppercase tracking-wider">평균 단가</div>
            <div className="text-lg font-extrabold text-gray-300 tabular-nums truncate">{formatCurrency(stock.avgPrice)}</div>
          </div>
          <div className="py-4 sm:flex-1 sm:pl-6 space-y-1 min-w-0">
            <div className="flex items-center gap-2">
              <div className="text-primary-500 uppercase tracking-wider">현재가</div>
              <Button
                variant="ghost"
                size="sm"
                onClick={fetchCurrentPrice}
                disabled={isUpdatingPrice}
                className="p-1 h-auto opacity-50 hover:bg-transparent hover:opacity-100 hover:text-primary-500 hover:rotate-180 transition-transform duration-500"
                title="현재가 갱신"
              >
                <RefreshCw size={12} className={cn(isUpdatingPrice && "animate-spin")} />
              </Button>
            </div>
            <div className="text-lg font-extrabold text-primary-400 tabular-nums truncate">{formatCurrency(currentPrice)}</div>
          </div>
        </div>

        <div className="pt-4 pb-1 flex flex-col xs:flex-row justify-between items-start xs:items-center gap-1">
          <span className="uppercase tracking-wider">투자 평가액</span>
          <span className="text-lg font-extrabold text-white tabular-nums truncate">{formatCurrency(stock.quantity * currentPrice)}</span>
        </div>
      </div>
    </Card>
  );
}
