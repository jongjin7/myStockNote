import { TrendingUp } from 'lucide-react';
import { cn, formatNumber } from '../../lib/utils';
import { SummaryStat } from './SummaryStat';

interface HeroStatsProps {
  totalAssets: number;
  totalEvaluation: number;
  totalCash: number;
  totalInvested: number;
  cashRatio: number;
  totalProfit: number;
  totalProfitRate: number;
  profitStr: string;
}

export function HeroStats({
  totalAssets,
  totalEvaluation,
  totalCash,
  totalInvested,
  cashRatio,
  totalProfit,
  totalProfitRate,
  profitStr,
}: HeroStatsProps) {
  return (
    <section className="relative">
      <div className="bg-gradient-to-br from-gray-900 to-gray-950 p-10 rounded-[32px] border border-gray-800/50 shadow-2xl relative overflow-hidden group font-sans">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary-500/5 to-transparent pointer-events-none" />
        <div className="absolute -right-20 -top-20 w-96 h-96 bg-primary-600/10 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-12">
            <div className="space-y-2">
              <span className="text-primary-500 uppercase tracking-[0.3em] ml-1 text-sm">PORTFOLIO VALUE | 포트폴리오 총 자산</span>
              <div className="font-black tracking-tighter tabular-nums flex items-baseline gap-2 text-white">
                <span className="text-3xl font-light">₩</span>
                <span className="text-6xl font-bold  tracking-tight">
                  {formatNumber(totalAssets)}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500 tracking-widest ml-1 opacity-70">
                <span className="w-1.5 h-1.5 rounded-full bg-gray-500 animate-pulse" />
                실시간 자본 총합 (평가자산 + 총 예수금)
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch gap-4 shrink-0">
              <div className="bg-white/[0.03] backdrop-blur-3xl rounded-[28px] p-7 border border-white/10 min-w-[300px] shadow-2xl relative overflow-hidden group/card @container">
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.02] to-white/[0.05] pointer-events-none" />
                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-8">
                    <div className="flex flex-col">
                      <span className="text-[10px] text-gray-500 uppercase tracking-[0.2em] font-black">HOLDINGS P/L</span>
                      <span className="text-xs text-gray-400 font-bold mt-0.5">전체 평가손익</span>
                    </div>
                    <div className={cn(
                      "text-sm font-black px-3 py-1.5 rounded-full inline-flex items-center gap-1.5 shadow-sm backdrop-blur-md border border-white/5 font-num",
                      totalProfit >= 0 ? "bg-danger/20 text-danger-light" : "bg-info/20 text-info-light"
                    )}>
                      {totalProfit >= 0 ? '+' : ''}{totalProfitRate.toFixed(2)}%
                      <span className="opacity-40 font-bold ml-0.5 text-[8px] font-sans">ROI</span>
                    </div>
                  </div>
                  
                  <div className="mt-2 flex flex-col min-w-0">
                    <div className="tracking-tighter tabular-nums flex items-baseline leading-none">
                      <span 
                        className={cn(
                          "flex items-center gap-1 transition-all duration-300",
                          totalProfit >= 0 ? "text-white" : "text-info-light"
                        )}
                        style={{ 
                          fontSize: profitStr.length <= 4 
                            ? 'clamp(2.5rem, 8vw, 3.75rem)'  // 짧은 숫자: 크게
                            : profitStr.length <= 7 
                            ? 'clamp(2rem, 6vw, 3rem)'        // 중간 숫자: 보통
                            : profitStr.length <= 10
                            ? 'clamp(1.5rem, 5vw, 2.25rem)'   // 긴 숫자: 작게
                            : 'clamp(1.25rem, 4vw, 1.875rem)' // 매우 긴 숫자: 매우 작게
                        }}
                      >
                        <span className='relative -top-[0.05em]'>{totalProfit >= 0 ? '+' : '-'} </span>
                        <span 
                          className={cn(
                            "font-bold",
                            totalProfit >= 0 ? "text-white" : "text-info-light"
                          )}
                        >
                          {profitStr}
                        </span>
                      </span>
                      <span className="text-2xl opacity-40 ml-2">원</span>
                    </div>
                  </div>

                  <div className="absolute -bottom-12 -right-4 opacity-5">
                    <TrendingUp size={120} strokeWidth={3} /> 
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mt-12 pt-10 border-t border-gray-800/40">
            <SummaryStat label="평가자산" value={totalEvaluation} prefix="₩" />
            <SummaryStat label="총 예수금" value={totalCash} prefix="₩" />
            <SummaryStat label="투자원금" value={totalInvested} prefix="₩" />
            <SummaryStat label="현금 비중" value={`${cashRatio.toFixed(1)}%`} valueClassName="text-primary-400" />
          </div>
        </div>
      </div>
    </section>
  );
}
