import { Button } from '../../../components/ui';
import { cn, formatCurrency, formatNumber } from '../../../lib/utils';
import type { TransactionNode } from './types';

interface FlowFooterProps {
  rawNodes: TransactionNode[];
  onClose: () => void;
}

interface StatItemProps {
  label: string;
  value: React.ReactNode;
  showDivider?: boolean;
}

function StatItem({ label, value, showDivider }: StatItemProps) {
  return (
    <div className="flex flex-col items-center md:items-start relative">
      {showDivider && (
        <div className="hidden md:block absolute -left-5 top-1/2 -translate-y-1/2 w-px h-8 bg-gray-800" />
      )}
      <p className="text-sm font-medium text-gray-600 uppercase tracking-[0.2em] mb-1.5">{label}</p>
      {value}
    </div>
  );
}

export function FlowFooter({
  rawNodes,
  onClose
}: FlowFooterProps) {
  return (
    <div className="p-6 md:p-8 border-t border-gray-800 bg-gray-900/30">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 md:gap-12">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-10 flex-1 w-full md:w-auto">
          <StatItem 
            label="총 투자금액"
            value={
              <p className="text-base font-bold text-white tracking-tight tabular-nums">
                {formatCurrency(rawNodes.filter(n => n.type === 'BUY').reduce((acc, curr) => acc + curr.total, 0))}
              </p>
            }
          />
          
          <StatItem 
            label="실현 손익"
            showDivider
            value={(() => {
              const totalProfit = rawNodes.reduce((acc, curr) => acc + (curr.profit || 0), 0);
              return (
                <p className={cn("text-base font-bold tracking-tight tabular-nums", totalProfit > 0 ? "text-red-400" : "text-blue-400")}>
                  {totalProfit > 0 ? '+' : ''}{formatCurrency(totalProfit)}
                </p>
              );
            })()}
          />
          
          <StatItem 
            label="최종 잔고"
            showDivider
            value={
              <p className="text-base font-bold text-gray-300 tabular-nums">
                {formatNumber(rawNodes[rawNodes.length - 1]?.holdingsAfter || 0)}주
              </p>
            }
          />
        </div>

        <div className="flex w-full md:w-auto">
          <Button variant="secondary" size="xl" onClick={onClose} className="w-full md:w-auto text-white border-transparent bg-gray-900 hover:bg-gray-800">
            닫기
          </Button>
        </div>
      </div>
    </div>
  );
}
