import { useState } from 'react';
import { cn, formatCurrency } from '../../lib/utils';
import type { Stock } from '../../types';
import { PieChart, Info, TrendingUp, ShieldCheck } from 'lucide-react';
import { SectionHeader } from '../../components/ui';

interface AssetAllocationProps {
  holdingStocks: Stock[];
  totalEvaluation: number;
}

const COLORS = [
  '#3b82f6', // primary-500
  '#10b981', // success
  '#0ea5e9', // info
  '#f59e0b', // warning
  '#f43f5e', // danger-light
  '#475569', // slate-600
];

const BG_COLORS = [
  'bg-primary-500',
  'bg-success',
  'bg-info',
  'bg-warning',
  'bg-danger-light',
  'bg-slate-600',
];

/**
 * 1. 파이 차트 컴포넌트
 */
function AllocationPieChart({
  displayStocks,
  totalEvaluation,
  activeStockId,
  setActiveStockId,
  topWeight,
  topStockName
}: {
  displayStocks: Stock[];
  totalEvaluation: number;
  activeStockId: string | null;
  setActiveStockId: (id: string | null) => void;
  topWeight: number;
  topStockName: string;
}) {
  const r = 25;
  const strokeWidth = 50;
  const circumference = 2 * Math.PI * r;

  const activeStock = displayStocks.find(s => s.id === activeStockId);
  const activeStockValue = activeStock ? (activeStock.currentPrice || activeStock.avgPrice) * activeStock.quantity : 0;
  const activePercentage = totalEvaluation > 0 ? (activeStockValue / totalEvaluation * 100) : 0;

  return (
    <div className="relative w-72 h-72 shrink-0 flex items-center justify-center">
      {/* Animated Glow behind pie */}
      <div className={cn(
        "absolute inset-0 rounded-full blur-[40px] transition-all duration-700",
        activeStockId ? "bg-primary-500/20 scale-110" : "bg-primary-500/10 animate-pulse"
      )} />
      
      <svg 
        className="w-64 h-64 -rotate-90 drop-shadow-[0_0_40px_rgba(0,0,0,0.6)] z-10 cursor-pointer overflow-visible" 
        viewBox="0 0 100 100"
        onClick={() => setActiveStockId(null)}
      >
        {[...displayStocks]
          .sort((a, b) => (a.id === activeStockId ? 1 : b.id === activeStockId ? -1 : 0))
          .map((stock) => {
            const value = (stock.currentPrice || stock.avgPrice) * stock.quantity;
            const percentage = totalEvaluation > 0 ? (value / totalEvaluation) * 100 : 0;
            if (percentage <= 0) return null;

            const originalIndex = displayStocks.findIndex(s => s.id === stock.id);
            let currentOffset = 0;
            for (let i = 0; i < originalIndex; i++) {
              const s = displayStocks[i];
              const val = (s.currentPrice || s.avgPrice) * s.quantity;
              currentOffset += totalEvaluation > 0 ? (val / totalEvaluation) * 100 : 0;
            }

            const strokeDasharray = `${(percentage / 100) * circumference} ${circumference}`;
            const strokeDashoffset = -((currentOffset / 100) * circumference);
            
            const isActive = activeStockId === stock.id;
            const isOtherActive = activeStockId !== null && !isActive;

            return (
              <circle
                key={stock.id}
                cx="50"
                cy="50"
                r={r}
                fill="transparent"
                stroke={COLORS[originalIndex]}
                strokeWidth={strokeWidth}
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveStockId(isActive ? null : stock.id);
                }}
                style={{ transformOrigin: '50% 50%' }}
                className={cn(
                  "transition-all duration-500 ease-out cursor-pointer",
                  isOtherActive ? "opacity-30 grayscale-[0.3]" : "opacity-100",
                  isActive ? "scale-[1.05] brightness-110 drop-shadow-[0_0_12px_rgba(255,255,255,0.4)]" : "scale-100"
                )}
              />
            );
          })}
      </svg>
      
      {/* Outer Glass Ring */}
      <div className="absolute inset-0 rounded-full border border-white/5 bg-white/[0.01] backdrop-blur-[2px] pointer-events-none" />
      <div className="absolute inset-4 rounded-full border border-white/5 pointer-events-none" />
      
      {/* Dynamic Label for Active/Highest Stock */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-4 bg-gray-950/80 backdrop-blur-xl px-4 py-1.5 rounded-full text-[10px] font-bold text-white shadow-[0_8px_16px_rgba(0,0,0,0.4)] z-20 flex items-center gap-2 whitespace-nowrap">
        <span className={cn(
          "w-1.5 h-1.5 rounded-full animate-ping",
          activeStockId ? "bg-primary-400" : "bg-primary-500"
        )} />
        <span className="text-primary-400 uppercase tracking-widest mr-1">
          {activeStockId ? 'Selected' : 'Top Weight'}:
        </span>
        <span className="text-white">
          {activeStockId ? activeStock?.name : topStockName}
        </span>
        <span className="text-gray-500 mx-1">|</span>
        <span className="text-white tabular-nums">
          {activeStockId ? `${activePercentage.toFixed(1)}%` : `${topWeight.toFixed(1)}%`}
        </span>
      </div>
    </div>
  );
}

/**
 * 2. 개별 자산 항목 컴포넌트
 */
function AssetItem({ 
  stock, 
  index, 
  totalEvaluation, 
  isActive, 
  onClick 
}: { 
  stock: Stock; 
  index: number; 
  totalEvaluation: number; 
  isActive: boolean; 
  onClick: () => void; 
}) {
  const value = (stock.currentPrice || stock.avgPrice) * stock.quantity;
  const percentage = totalEvaluation > 0 ? (value / totalEvaluation) * 100 : 0;

  return (
    <div 
      onClick={onClick}
      className={cn(
        "flex items-center justify-between group py-3 px-4 rounded-2xl transition-all cursor-pointer",
        isActive ? "bg-white/[0.08] translate-x-1 border border-white/10" : "hover:bg-white/[0.03] hover:translate-x-1 border border-transparent"
      )}
    >
      <div className="flex items-center gap-4">
        <div className={cn(
          "w-3 h-3 rounded-full shrink-0 shadow-lg transition-transform duration-500", 
          BG_COLORS[index],
          isActive ? "scale-150 ring-4 ring-white/10" : "group-hover:scale-125"
        )} />
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-gray-200 truncate max-w-[160px] group-hover:text-white transition-colors">
              {stock.name}
            </span>
            {stock.symbol && (
              <span className="text-[10px] text-gray-700 uppercase tracking-tighter">
                {stock.symbol}
              </span>
            )}
          </div>
          <span className="text-xs font-normal text-gray-600 tabular-nums">
            {formatCurrency(value)}
          </span>
        </div>
      </div>
      <div className="text-right flex flex-col items-end">
        <div className="flex items-baseline gap-1">
          <span className="text-lg font-black text-white group-hover:text-primary-400 transition-colors tabular-nums">
            {percentage.toFixed(1)}
          </span>
          <span className="text-[10px] font-black text-gray-700">%</span>
        </div>
        <div className="w-16 h-1 bg-gray-800/30 rounded-full mt-1.5 overflow-hidden">
          <div 
            className={cn("h-full transition-all duration-1000 delay-500 opacity-60", BG_COLORS[index])} 
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    </div>
  );
}

/**
 * 3. 하단 요약 인사이트 컴포넌트
 */
function AllocationInsights({ 
  diversificationStatus, 
  avgWeight, 
  count 
}: { 
  diversificationStatus: string; 
  avgWeight: number; 
  count: number; 
}) {
  return (
    <div className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-5 flex items-center justify-between divide-x divide-white/10 mt-auto shadow-xl">
      <div className="flex flex-col items-center justify-center flex-1 px-2 border-none">
        <div className="flex items-center gap-1.5 mb-2">
          <ShieldCheck size={12} className="text-success" />
          <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Stratum</span>
        </div>
        <span className="text-sm font-black text-white tracking-tight">{diversificationStatus}</span>
      </div>
      
      <div className="flex flex-col items-center justify-center flex-1 px-2">
        <div className="flex items-center gap-2 mb-2">
          <TrendingUp size={12} className="text-gray-500" />
          <div className="flex flex-col items-center leading-none">
            <span className="text-[8px] font-black text-gray-500 uppercase tracking-widest">Avg</span>
            <span className="text-[8px] font-black text-gray-500 uppercase tracking-widest">wt</span>
          </div>
        </div>
        <span className="text-sm font-black text-white tabular-nums tracking-tighter">{avgWeight.toFixed(1)}%</span>
      </div>
      
      <div className="flex flex-col items-center justify-center flex-1 px-2">
        <div className="flex items-center gap-1.5 mb-2">
          <Info size={12} className="text-info" />
          <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Count</span>
        </div>
        <span className="text-sm font-black text-white tabular-nums tracking-tighter">{count}개</span>
      </div>
    </div>
  );
}

export function AssetAllocation({ holdingStocks, totalEvaluation }: AssetAllocationProps) {
  const [activeStockId, setActiveStockId] = useState<string | null>(null);

  // 상위 5개 종목 추출 및 나머지 '기타' 합산
  const sortedAll = [...holdingStocks].sort((a, b) => {
    const valA = (a.currentPrice || a.avgPrice) * a.quantity;
    const valB = (b.currentPrice || b.avgPrice) * b.quantity;
    return valB - valA;
  });

  const topStocks = sortedAll.slice(0, 5);
  const otherStocks = sortedAll.slice(5);
  
  const othersValue = otherStocks.reduce((sum, s) => sum + (s.currentPrice || s.avgPrice) * s.quantity, 0);
  const displayStocks = [...topStocks];
  
  if (othersValue > 0) {
    displayStocks.push({
      id: 'others',
      name: '기타 종목',
      symbol: `${otherStocks.length}개 종목`,
      quantity: 1,
      avgPrice: othersValue,
      currentPrice: othersValue,
      status: 'HOLDING',
      accountId: '',
      createdAt: 0,
      updatedAt: 0
    } as Stock);
  }

  // Analysis Stats
  const topWeight = sortedAll.length > 0 
    ? ((sortedAll[0].currentPrice || sortedAll[0].avgPrice) * sortedAll[0].quantity / totalEvaluation * 100) 
    : 0;
  const avgWeight = sortedAll.length > 0 ? (100 / sortedAll.length) : 0;
  const diversificationStatus = topWeight > 40 ? '집중 투자' : topWeight > 20 ? '균형 분산' : '폭넓은 분산';

  return (
    <div className="bg-gray-900/40 backdrop-blur-sm border border-gray-800/50 rounded-3xl p-8 h-full flex flex-col relative overflow-hidden group/card">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/5 blur-[100px] -mr-32 -mt-32 pointer-events-none" />
      
      <SectionHeader 
        icon={PieChart}
        title="자산 비중 리포트"
        className="mb-10 px-0 relative z-10"
        extra={
          <div className="flex flex-col items-end">
            <span className="text-sm font-semibold text-gray-600 uppercase tracking-[0.2em] mb-1">총 평가금액</span>
            <span className="text-2xl font-bold text-white tabular-nums tracking-tighter leading-none group-hover/card:text-primary-400 transition-colors">
              {formatCurrency(totalEvaluation)}
            </span>
          </div>
        }
      />

      <div className="flex-1 flex flex-col xl:flex-row items-center justify-center gap-12 py-4 relative z-10">
        <AllocationPieChart 
          displayStocks={displayStocks}
          totalEvaluation={totalEvaluation}
          activeStockId={activeStockId}
          setActiveStockId={setActiveStockId}
          topWeight={topWeight}
          topStockName={sortedAll[0]?.name || ''}
        />

        {/* Dynamic Information Grid */}
        <div className="flex-1 w-full max-w-md flex flex-col justify-between h-full space-y-6">
          <div className="grid grid-cols-1 gap-3">
            {displayStocks.map((stock, index) => (
              <AssetItem 
                key={stock.id}
                stock={stock}
                index={index}
                totalEvaluation={totalEvaluation}
                isActive={activeStockId === stock.id}
                onClick={() => setActiveStockId(activeStockId === stock.id ? null : stock.id)}
              />
            ))}
          </div>

          <AllocationInsights 
            diversificationStatus={diversificationStatus}
            avgWeight={avgWeight}
            count={sortedAll.length}
          />
        </div>
      </div>
    </div>
  );
}

