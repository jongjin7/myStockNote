import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { ReactNode } from 'react';
import { Button } from '../../../components/ui';
import { cn, formatCurrency } from '../../../lib/utils';
import type { TransactionNode, DayGroup } from './types';

interface LegendItemProps {
  color: string;
  label: string;
}

function LegendItem({ color, label }: LegendItemProps) {
  return (
    <div className="flex items-center gap-1.5 whitespace-nowrap">
      <div className={cn("w-2 h-2 rounded-sm", color)} />
      <span className="text-xs font-medium text-gray-500 uppercase tracking-widest leading-none">
        {label}
      </span>
    </div>
  );
}

function HeaderStatCard({ children, className }: { children: ReactNode, className?: string }) {
  return (
    <div className={cn("flex items-center h-10 px-4 bg-white/5 border border-white/5 backdrop-blur-sm rounded-3xl", className)}>
      {children}
    </div>
  );
}

interface HeaderStatItemProps {
  label: string;
  value: ReactNode;
  variant?: 'default' | 'primary';
  className?: string;
}

function HeaderStatItem({ label, value, variant = 'default', className }: HeaderStatItemProps) {
  return (
    <div className={cn("flex items-center gap-3 px-4 text-sm font-medium first:pl-0 last:pr-0", className)}>
      <span className={cn(
        "uppercase whitespace-nowrap",
        variant === 'primary' ? "text-primary-400" : "text-gray-500"
      )}>
        {label}
      </span>
      {value}
    </div>
  );
}

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
  const selectedGroup = groupedNodes[currentGroupIndex];
  
  // Stats
  const totalProfit = rawNodes.slice(0, currentGroupIndex + 1).reduce((acc, curr) => acc + (curr.profit || 0), 0);
  const buys = selectedGroup.transactions.filter(t => t.type === 'BUY').reduce((acc, t) => acc + t.quantity, 0);
  const sells = selectedGroup.transactions.filter(t => t.type === 'SELL').reduce((acc, t) => acc + t.quantity, 0);

  return (
    <div className="flex flex-col relative z-1">
      <div className="px-4 md:px-6 pt-3 pb-2 md:pt-4 md:pb-3 border-b border-white/5 bg-white/[0.01]">
        <h4 className="text-lg font-bold text-white uppercase">거래 흐름 시각화</h4>
      </div>
      <div className="p-3 md:p-4 pb-0">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3 md:gap-4 w-full sm:w-auto">
            {/* 날짜 이동 버튼 */}
            <HeaderStatCard className="px-1.5">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handlePrev}
                disabled={currentGroupIndex === 0}
                className="h-8 w-8 p-0 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 disabled:opacity-10 transition-all"
              >
                <ChevronLeft size={18} />
              </Button>
              
              <span className="text-sm text-gray-500 font-medium px-1">
                {selectedGroup.date}
              </span>

              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleNext}
                disabled={currentGroupIndex === groupedNodes.length - 1}
                className="h-8 w-8 p-0 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 disabled:opacity-10 transition-all"
              >
                <ChevronRight size={18} />
              </Button>
            </HeaderStatCard>

            {/* 통합 정보 표시바 */}
            <HeaderStatCard>
              <HeaderStatItem 
                label="누적 수익"
                value={
                  <span className={cn(
                    "tracking-tight tabular-nums",
                    totalProfit >= 0 ? "text-red-400" : "text-blue-400"
                  )}>
                    {totalProfit > 0 ? '+' : ''}{formatCurrency(totalProfit)}
                  </span>
                }
              />
            </HeaderStatCard>

            <HeaderStatCard>
              <HeaderStatItem 
                label={`${currentGroupIndex + 1}일차 활동`}
                variant="primary"
                value={
                  <div className="flex items-center gap-2 ">
                    <span className="text-blue-400">매수 {buys}</span>
                    <span className="text-red-400">매도 {sells}</span>
                  </div>
                }
              />
            </HeaderStatCard>
          </div>

          <div className="flex items-center px-2 h-7 gap-3"> 
            <LegendItem color="bg-blue-500/60" label="매수" />
            <LegendItem color="bg-red-500/60" label="매도" />
          </div>
        </div>
      </div>
      
    </div>
  );
}
