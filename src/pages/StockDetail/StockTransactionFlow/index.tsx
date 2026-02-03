import { useState, useRef, useEffect, useMemo } from 'react';
import { TrendingUp } from 'lucide-react';
import { Modal } from '../../../components/ui';
import { FlowHeader } from './FlowHeader';
import { FlowChart } from './FlowChart';
import { TransactionLog } from './TransactionLog';
import { FlowFooter } from './FlowFooter';
import type { TransactionNode, DayGroup } from './types';

interface StockTransactionFlowProps {
  isOpen: boolean;
  stockName: string;
  onClose: () => void;
}

export function StockTransactionFlow({ isOpen, stockName, onClose }: StockTransactionFlowProps) {
  // 1. Generate 30 days of transactions (resulting in 30 groups) - Persistent with useMemo
  const groupedNodes = useMemo<DayGroup[]>(() => {
    return Array.from({ length: 30 }, (_, dayIdx) => {
      const date = new Date(2023, 9, 15 + dayIdx * 3).toISOString().split('T')[0];
      const transCount = Math.random() > 0.8 ? 3 : (Math.random() > 0.5 ? 2 : 1);
      
      const memo = Math.random() > 0.6 ? 
        [
          "전일 미증시 반등으로 인한 심리적 안정세. 외인 매수세 유입 확인됨.",
          "예상보다 낮은 실적 발표로 인한 조정 장세. 분할 매수로 대응.",
          "목표가 도달에 따른 일부 차익 실현. 남은 물량은 홀딩 예정.",
          "단기 과매도 구간으로 판단되어 비중 확대 결정.",
          "섹터 전반적인 수급 악화. 리스크 관리 차원에서 보수적 접근."
        ][dayIdx % 5] : undefined;

      const transactions: TransactionNode[] = Array.from({ length: transCount }, (_, tIdx) => {
        const isBuy = Math.random() > 0.4 || (dayIdx === 0 && tIdx === 0);
        const isLastDay = dayIdx === 29;
        const isLastTrans = tIdx === transCount - 1;
        const type = (isLastDay && isLastTrans) ? 'CURRENT' : (isBuy ? 'BUY' : 'SELL');
        
        const quantity = Math.floor(Math.random() * 10) + 1;
        const price = 150000 + (Math.floor(Math.random() * 50000) - 25000);
        const total = quantity * price;

        return {
          id: `day-${dayIdx}-t-${tIdx}`,
          date,
          type,
          quantity,
          price,
          total,
          profit: type !== 'BUY' ? (Math.random() * 200000 - 50000) : undefined,
          profitRate: type !== 'BUY' ? parseFloat((Math.random() * 15 - 5).toFixed(1)) : undefined,
          avgPriceChange: type === 'BUY' ? (Math.random() * 10000 - 5000) : undefined,
          holdingsAfter: (dayIdx * 2 + tIdx + 1) * 5,
        };
      });

      return { date, transactions, memo };
    });
  }, []);

  const rawNodes = useMemo(() => groupedNodes.flatMap((g: DayGroup) => g.transactions), [groupedNodes]);
  const [currentGroupIndex, setCurrentGroupIndex] = useState(groupedNodes.length - 1);
  const selectedGroup = groupedNodes[currentGroupIndex];
  const chartScrollRef = useRef<HTMLDivElement>(null);

  const handlePrev = () => setCurrentGroupIndex((prev: number) => Math.max(0, prev - 1));
  const handleNext = () => setCurrentGroupIndex((prev: number) => Math.min(groupedNodes.length - 1, prev + 1));

  useEffect(() => {
    if (chartScrollRef.current) {
      const container = chartScrollRef.current;
      const scrollContent = container.firstChild as HTMLElement;
      if (scrollContent) {
        const effectiveDrawingWidth = Math.max(0, scrollContent.offsetWidth - 80);
        const intervalCount = groupedNodes.length > 1 ? groupedNodes.length - 1 : 1;
        const intervalWidth = effectiveDrawingWidth / intervalCount;
        const currentDayCenterX = 40 + (currentGroupIndex * intervalWidth);
        const scrollLeft = currentDayCenterX - (container.offsetWidth / 2);
        
        container.scrollTo({
          left: scrollLeft,
          behavior: 'smooth'
        });
      }
    }
  }, [currentGroupIndex, groupedNodes.length]);

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      size="2xl"
      title={
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-primary-500/10 flex items-center justify-center text-primary-500 border border-primary-500/20">
            <TrendingUp size={18} />
          </div>
          <div>
            <h2 className="text-base md:text-lg font-bold text-white tracking-tight">{stockName} 거래 플로우</h2>
            <p className="text-[9px] md:text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-0.5 whitespace-nowrap">Transaction Timeline Analytics</p>
          </div>
        </div>
      }
    >
      {/* Content Area */}
      <div className="p-4 md:p-8 lg:p-10">
        <div className="max-w-5xl mx-auto space-y-10">
          {/* Chart Section */}
          <div className="relative bg-gray-900/40 rounded-3xl border border-gray-800/50 overflow-hidden group/chart h-[320px] flex flex-col">
            <FlowHeader 
              currentGroupIndex={currentGroupIndex}
              groupedNodes={groupedNodes}
              rawNodes={rawNodes}
              handlePrev={handlePrev}
              handleNext={handleNext}
            />
            <FlowChart 
              groupedNodes={groupedNodes}
              currentGroupIndex={currentGroupIndex}
              setCurrentGroupIndex={setCurrentGroupIndex}
              chartScrollRef={chartScrollRef}
            />
          </div>

          {/* Transaction Log Table */}
          <TransactionLog selectedGroup={selectedGroup} />
        </div>
      </div>

      {/* Footer Summary */}
      <FlowFooter 
        rawNodes={rawNodes}
        onClose={onClose}
      />
    </Modal>
  );
}
