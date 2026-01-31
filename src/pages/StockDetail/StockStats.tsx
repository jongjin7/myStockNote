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

        <div className="grid grid-cols-2">
          <div className="py-3 pr-4 border-r border-white/5 space-y-1">
            <div className="uppercase ">평균 단가</div>
            <div className="text-lg font-bold text-gray-300 tabular-nums">{formatCurrency(stock.avgPrice)}</div>
          </div>
          <div className="py-3 pl-5 space-y-1">
            <div className="flex items-center gap-2">
              <div className="text-primary-500 uppercase ">현재가</div>
              <Button
                variant="ghost"
                size="sm"
                onClick={fetchCurrentPrice}
                disabled={isUpdatingPrice}
                className="p-1 opacity-50 hover:bg-transparent hover:opacity-80 hover:text-primary-500 hover:rotate-180 transition-transform duration-500"
                title="현재가 갱신"
              >
                <RefreshCw size={12} className={cn(isUpdatingPrice && "animate-spin")} />
              </Button>
            </div>
            <div className="text-lg font-bold text-primary-400 tabular-nums">{formatCurrency(currentPrice)}</div>
          </div>
        </div>

        <div className="pt-3 pb-1 flex justify-between items-center">
          <span className="uppercase">투자 원금 (Total)</span>
          <span className="text-lg font-bold text-gray-300 tabular-nums">{formatCurrency(stock.quantity * stock.avgPrice)}</span>
        </div>
      </div>
    </Card>
  );
}
