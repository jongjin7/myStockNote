import { Button } from '../../../components/ui';
import { cn, formatCurrency, formatNumber } from '../../../lib/utils';
import type { TransactionNode } from './types';

interface FlowFooterProps {
  rawNodes: TransactionNode[];
  onClose: () => void;
  onNextDay: () => void;
}

export function FlowFooter({
  rawNodes,
  onClose,
  onNextDay
}: FlowFooterProps) {
  return (
    <div className="p-8 border-t border-gray-800 bg-gray-900/30">
      <div className="max-w-5xl mx-auto flex items-center justify-between gap-12">
        <div className="flex items-center gap-10 flex-1">
          <div>
            <p className="text-[10px] font-black text-gray-600 uppercase tracking-[0.2em] mb-1.5">Total Invested</p>
            <p className="text-base font-bold text-white tracking-tight">
              {formatCurrency(rawNodes.filter(n => n.type === 'BUY').reduce((acc, curr) => acc + curr.total, 0))}
            </p>
          </div>
          <div className="w-px h-8 bg-gray-800" />
          <div>
            <p className="text-[10px] font-black text-gray-600 uppercase tracking-[0.2em] mb-1.5">Realized Profit</p>
            {(() => {
              const totalProfit = rawNodes.reduce((acc, curr) => acc + (curr.profit || 0), 0);
              return (
                <p className={cn("text-base font-black tracking-tight", totalProfit > 0 ? "text-red-400" : "text-blue-400")}>
                  {totalProfit > 0 ? '+' : ''}{formatCurrency(totalProfit)}
                </p>
              );
            })()}
          </div>
          <div className="w-px h-8 bg-gray-800" />
          <div>
            <p className="text-[10px] font-black text-gray-600 uppercase tracking-[0.2em] mb-1.5">Final Holdings</p>
            <p className="text-base font-bold text-gray-300">
              {formatNumber(rawNodes[rawNodes.length - 1]?.holdingsAfter || 0)}주
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <Button variant="secondary" onClick={onClose} className="px-8 h-12 font-bold text-white border-transparent bg-gray-900 hover:bg-gray-800 transition-all">
            닫기
          </Button>
          <Button 
            className="px-10 h-12 font-black text-white shadow-lg shadow-primary-500/20"
            onClick={onNextDay}
          >
            NEXT DAY
          </Button>
        </div>
      </div>
    </div>
  );
}
