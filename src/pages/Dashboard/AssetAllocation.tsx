import { cn, formatCurrency } from '../../lib/utils';
import type { Stock } from '../../types';

interface AssetAllocationProps {
  holdingStocks: Stock[];
  totalEvaluation: number;
}

export function AssetAllocation({ holdingStocks, totalEvaluation }: AssetAllocationProps) {
  // 상위 5개 종목 추출 및 나머지 '기타' 처리
  const sortedStocks = [...holdingStocks]
    .sort((a, b) => {
      const valA = (a.currentPrice || a.avgPrice) * a.quantity;
      const valB = (b.currentPrice || b.avgPrice) * b.quantity;
      return valB - valA;
    })
    .slice(0, 5);

  const colors = [
    'bg-primary-500',
    'bg-success',
    'bg-info',
    'bg-warning',
    'bg-danger-light',
  ];

  return (
    <div className="bg-gray-900/40 backdrop-blur-sm border border-gray-800/50 rounded-3xl p-8 h-full flex flex-col">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-xl font-bold text-white tracking-tight">자산 비중 리포트</h3>
          <p className="text-xs text-gray-500 mt-1 uppercase tracking-widest font-bold">Asset Allocation</p>
        </div>
      </div>

      <div className="flex-1 space-y-8">
        {/* Visual Stacked Bar */}
        <div className="h-6 w-full flex rounded-full overflow-hidden bg-gray-800/50 outline outline-4 outline-gray-900/20">
          {sortedStocks.map((stock, index) => {
            const value = (stock.currentPrice || stock.avgPrice) * stock.quantity;
            const percentage = totalEvaluation > 0 ? (value / totalEvaluation) * 100 : 0;
            if (percentage < 1) return null;
            
            return (
              <div 
                key={stock.id}
                className={cn("h-full transition-all duration-1000", colors[index])}
                style={{ width: `${percentage}%` }}
                title={`${stock.name}: ${percentage.toFixed(1)}%`}
              />
            );
          })}
        </div>

        {/* Legend Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8">
          {sortedStocks.map((stock, index) => {
            const value = (stock.currentPrice || stock.avgPrice) * stock.quantity;
            const percentage = totalEvaluation > 0 ? (value / totalEvaluation) * 100 : 0;
            
            return (
              <div key={stock.id} className="flex items-center justify-between group">
                <div className="flex items-center gap-3">
                  <div className={cn("w-2.5 h-2.5 rounded-full shrink-0 group-hover:scale-125 transition-transform", colors[index])} />
                  <span className="text-sm font-bold text-gray-400 truncate max-w-[100px]">{stock.name}</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-sm font-black text-white">{percentage.toFixed(1)}%</span>
                  <span className="text-[10px] font-bold text-gray-600 tabular-nums">{formatCurrency(value)}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
