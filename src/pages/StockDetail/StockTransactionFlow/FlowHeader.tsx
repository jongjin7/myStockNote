import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../../../components/ui';
import { cn, formatCurrency } from '../../../lib/utils';
import type { TransactionNode, DayGroup } from './types';

interface FlowHeaderProps {
  currentGroupIndex: number;
  groupedNodes: DayGroup[];
  rawNodes: TransactionNode[];
  handlePrev: () => void;
  handleNext: () => void;
}

export function FlowHeader({
  currentGroupIndex,
  groupedNodes,
  rawNodes,
  handlePrev,
  handleNext
}: FlowHeaderProps) {
  return (
    <div className="p-4 md:p-6 pb-0 flex flex-col gap-4 z-20">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 md:gap-4 w-full sm:w-auto">
          {/* Nav Buttons */}
          <div className="bg-white/5 backdrop-blur-xl p-1 rounded-2xl border border-white/10 flex items-center gap-1.5 shadow-xl">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handlePrev}
              disabled={currentGroupIndex === 0}
              className="h-8 w-8 p-0 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 disabled:opacity-10 transition-all"
            >
              <ChevronLeft size={18} />
            </Button>
            <div className="w-px h-4 bg-white/10" />
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleNext}
              disabled={currentGroupIndex === groupedNodes.length - 1}
              className="h-8 w-8 p-0 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 disabled:opacity-10 transition-all"
            >
              <ChevronRight size={18} />
            </Button>
          </div>

          {/* Unified Info Pill - Simplified for Mobile */}
          <div className="flex flex-1 sm:flex-none items-center h-10 px-3 md:px-4 bg-white/[0.03] border border-white/5 backdrop-blur-md rounded-2xl divide-x divide-white/5 overflow-hidden">
            <div className="flex items-center gap-2 md:gap-3 pr-3 md:pr-4 min-w-0">
              <span className="text-[8px] md:text-[9px] font-bold text-gray-500 uppercase tracking-widest whitespace-nowrap hidden xs:block">누적 수익</span>
              {(() => {
                const totalProfit = rawNodes.slice(0, currentGroupIndex + 1).reduce((acc, curr) => acc + (curr.profit || 0), 0);
                return (
                  <span className={cn(
                    "text-[12px] md:text-sm font-bold tracking-tight tabular-nums truncate",
                    totalProfit >= 0 ? "text-red-400" : "text-blue-400"
                  )}>
                    {totalProfit > 0 ? '+' : ''}{formatCurrency(totalProfit)}
                  </span>
                );
              })()}
            </div>
            <div className="flex items-center gap-2 md:gap-3 pl-3 md:pl-4 min-w-0">
              <span className="text-[8px] md:text-[9px] font-bold text-primary-400 uppercase tracking-widest whitespace-nowrap hidden xs:block">{currentGroupIndex + 1}일차</span>
              {(() => {
                const group = groupedNodes[currentGroupIndex];
                const buys = group.transactions.filter(t => t.type === 'BUY').reduce((acc, t) => acc + t.quantity, 0);
                const sells = group.transactions.filter(t => t.type === 'SELL').reduce((acc, t) => acc + t.quantity, 0);
                return (
                  <div className="flex items-center gap-1.5 md:gap-2">
                    <span className="text-[10px] md:text-[11px] font-medium text-blue-400 whitespace-nowrap">B {buys}</span>
                    <span className="text-[10px] md:text-[11px] font-medium text-red-400 whitespace-nowrap">S {sells}</span>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>

        {/* Legend - Hidden on small mobile or shown compactly */}
        <div className="hidden xs:flex items-center gap-4 ml-auto sm:ml-0">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-white/[0.02] rounded-lg border border-white/[0.02]">
            <div className="w-2 h-2 bg-blue-500/60 rounded-sm" />
            <span className="text-[8px] md:text-[9px] font-bold text-gray-500 uppercase tracking-widest">매수</span>
            <div className="w-2 h-2 bg-red-500/60 rounded-sm ml-2" />
            <span className="text-[8px] md:text-[9px] font-bold text-gray-500 uppercase tracking-widest">매도</span>
          </div>
        </div>
      </div>
    </div>
  );
}
