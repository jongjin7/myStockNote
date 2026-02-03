import { useState, useRef, useEffect, useMemo } from 'react';
import { TrendingUp, Quote, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn, formatCurrency, formatNumber } from '../../lib/utils';
import { Card, Button } from '../../components/ui';

interface TransactionNode {
  id: string;
  date: string;
  type: 'BUY' | 'SELL' | 'CURRENT';
  quantity: number;
  price: number;
  total: number;
  profit?: number;
  profitRate?: number;
  avgPriceChange?: number;
  holdingsAfter: number;
}

interface TransactionFlowProps {
  stockName: string;
  onClose: () => void;
}

export function TransactionFlow({ stockName, onClose }: TransactionFlowProps) {
  // 1. Generate 30 days of transactions (resulting in 30 groups) - Persistent with useMemo
  const groupedNodes = useMemo(() => {
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
  }, []); // Generate once

  const rawNodes = useMemo(() => groupedNodes.flatMap(g => g.transactions), [groupedNodes]);
  const [currentGroupIndex, setCurrentGroupIndex] = useState(groupedNodes.length - 1);
  const selectedGroup = groupedNodes[currentGroupIndex];
  const stepperRef = useRef<HTMLDivElement>(null);
  const chartScrollRef = useRef<HTMLDivElement>(null);

  // Nav functions
  const handlePrev = () => setCurrentGroupIndex(prev => Math.max(0, prev - 1));
  const handleNext = () => setCurrentGroupIndex(prev => Math.min(groupedNodes.length - 1, prev + 1));

  // Sync scroll when group index changes
  useEffect(() => {
    if (stepperRef.current) {
      const selectedButton = stepperRef.current.children[currentGroupIndex] as HTMLElement;
      if (selectedButton) {
        selectedButton.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'center'
        });
      }
    }

    if (chartScrollRef.current) {
      const container = chartScrollRef.current;
      const scrollContent = container.firstChild as HTMLElement;
      if (scrollContent) {
        // The SVG has px-10, so 80px total horizontal padding.
        // The actual drawing area width is scrollContent.offsetWidth - 80.
        // We have groupedNodes.length days, which means groupedNodes.length - 1 intervals.
        // Handle case for single day to avoid division by zero or negative width.
        const effectiveDrawingWidth = Math.max(0, scrollContent.offsetWidth - 80);
        const intervalCount = groupedNodes.length > 1 ? groupedNodes.length - 1 : 1;
        const intervalWidth = effectiveDrawingWidth / intervalCount;

        // Calculate the center x-coordinate of the current day's position within the SVG's drawing area
        const currentDayCenterX = 40 + (currentGroupIndex * intervalWidth);

        // Calculate the scrollLeft needed to center this point in the container's visible area
        const scrollLeft = currentDayCenterX - (container.offsetWidth / 2);
        
        container.scrollTo({
          left: scrollLeft,
          behavior: 'smooth'
        });
      }
    }
  }, [currentGroupIndex, groupedNodes.length]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <Card className="w-full max-w-6xl bg-gray-950 border-gray-800 shadow-2xl overflow-hidden flex flex-col h-[90vh]">
        {/* Header */}
        <div className="p-6 border-b border-gray-800 flex items-center justify-between bg-gray-900/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-500/10 flex items-center justify-center text-primary-500 border border-primary-500/20">
              <TrendingUp size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">{stockName} 거래 플로우</h2>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-0.5">Transaction Timeline Analytics</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-800 rounded-full transition-colors text-gray-500 hover:text-white">
            <span className="text-2xl leading-none">&times;</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Main Data View: Table Style */}
          <div className="flex-1 overflow-y-auto custom-scrollbar p-10">
            <div className="max-w-5xl mx-auto space-y-10">
              {/* Integrated Chart & Overlay Header - Fixed Height */}
              <div className="relative bg-gray-900/40 rounded-3xl border border-gray-800/50 overflow-hidden group/chart h-[320px] flex flex-col">
                {/* Compact Header Section */}
                <div className="p-6 pb-0 flex flex-col gap-4 z-20">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
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

                      {/* Unified Info Pill */}
                      <div className="flex items-center h-10 px-4 bg-white/[0.03] border border-white/5 backdrop-blur-md rounded-2xl divide-x divide-white/5">
                        <div className="flex items-center gap-3 pr-4">
                          <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest whitespace-nowrap">누적 수익</span>
                          {(() => {
                            const totalProfit = rawNodes.slice(0, currentGroupIndex + 1).reduce((acc, curr) => acc + (curr.profit || 0), 0);
                            return (
                              <span className={cn(
                                "text-sm font-bold tracking-tight tabular-nums",
                                totalProfit >= 0 ? "text-red-400" : "text-blue-400"
                              )}>
                                {totalProfit > 0 ? '+' : ''}{formatCurrency(totalProfit)}
                              </span>
                            );
                          })()}
                        </div>
                        <div className="flex items-center gap-3 pl-4">
                          <span className="text-[9px] font-bold text-primary-400 uppercase tracking-widest whitespace-nowrap">{currentGroupIndex + 1}일차 활동</span>
                          {(() => {
                            const group = groupedNodes[currentGroupIndex];
                            const buys = group.transactions.filter(t => t.type === 'BUY').reduce((acc, t) => acc + t.quantity, 0);
                            const sells = group.transactions.filter(t => t.type === 'SELL').reduce((acc, t) => acc + t.quantity, 0);
                            return (
                              <div className="flex items-center gap-2">
                                <span className="text-[11px] font-medium text-blue-400">매수 {buys}</span>
                                <span className="text-[11px] font-medium text-red-400">매도 {sells}</span>
                              </div>
                            );
                          })()}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2 px-3 py-1.5 bg-white/[0.02] rounded-lg border border-white/[0.02]">
                        <div className="w-2 h-2 bg-blue-500/60 rounded-sm" />
                        <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">매수</span>
                        <div className="w-2 h-2 bg-red-500/60 rounded-sm ml-2" />
                        <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">매도</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Enhanced Scrollable Chart Area */}
                <div 
                  ref={chartScrollRef}
                  className="absolute inset-0 pt-24 pb-12 overflow-x-auto custom-scrollbar overflow-y-hidden"
                >
                  <div 
                    style={{ width: `${Math.max(groupedNodes.length * 4, 100)}%`, minWidth: '100%' }}
                    className="h-full relative"
                  >
                    <svg className="w-full h-full overflow-visible px-10" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="chartGlow" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.15" />
                        <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                      </linearGradient>
                      <filter id="shadow">
                        <feDropShadow dx="0" dy="4" stdDeviation="4" floodOpacity="0.5" />
                      </filter>
                    </defs>

                    {(() => {
                      const profitTrend = groupedNodes.map((_, i) => 
                        groupedNodes.slice(0, i + 1).reduce((acc, group) => 
                          acc + group.transactions.reduce((st, t) => st + (t.profit || 0), 0), 0)
                      );
                      
                      const volumeData = groupedNodes.map(g => ({
                        buyQty: g.transactions.filter(t => t.type === 'BUY').reduce((acc, t) => acc + t.quantity, 0),
                        sellQty: g.transactions.filter(t => t.type === 'SELL').reduce((acc, t) => acc + t.quantity, 0)
                      }));

                      const maxAbsProfit = Math.max(...profitTrend.map(Math.abs), 100000);
                      const maxQty = Math.max(...volumeData.map(v => Math.max(v.buyQty, v.sellQty)), 10);
                      
                      const points = profitTrend.map((val, i) => {
                        const x = (i / (profitTrend.length - 1)) * 100;
                        const y = 40 - (val / maxAbsProfit) * 35; // Better vertical range
                        return `${x}% ${y}%`;
                      });

                      const pathData = points.join(', ');
                      const areaPath = `0% 40%, ${pathData}, 100% 40%`;

                      return (
                        <>
                          {/* Baseline */}
                          <line x1="0" y1="40%" x2="100%" y2="40%" stroke="currentColor" className="text-gray-800/40" strokeWidth="1" strokeDasharray="10 5" />
                          
                          {/* 1. HIT ZONES (UX Priority) */}
                          {groupedNodes.map((_, i) => {
                            const x = (i / (groupedNodes.length - 1)) * 100;
                            const width = 100 / (groupedNodes.length - 1);
                            return (
                              <rect
                                key={`hit-${i}`}
                                x={`calc(${x}% - ${width / 2}%)`}
                                y="0"
                                width={`${width}%`}
                                height="100%"
                                fill="transparent"
                                className="cursor-pointer pointer-events-auto hover:fill-white/[0.03] transition-colors"
                                onClick={() => setCurrentGroupIndex(i)}
                              />
                            );
                          })}

                          {/* 2. VOLUME BARS (Background Layer) */}
                          {volumeData.map((v, i) => {
                            const x = (i / (volumeData.length - 1)) * 100;
                            const buyH = (v.buyQty / maxQty) * 45;
                            const sellH = (v.sellQty / maxQty) * 45;
                            const isCurrent = i === currentGroupIndex;
                            
                            return (
                              <g key={`bar-dual-${i}`} className="opacity-80">
                                {v.buyQty > 0 && (
                                  <rect
                                    x={`calc(${x}% - 7px)`}
                                    y={`${90 - buyH}%`}
                                    width="6"
                                    height={`${buyH}%`}
                                    className={cn("transition-all duration-500", isCurrent ? "fill-blue-500" : "fill-blue-500/40")}
                                    rx="3"
                                  />
                                )}
                                {v.sellQty > 0 && (
                                  <rect
                                    x={`calc(${x}% + 1px)`}
                                    y={`${90 - sellH}%`}
                                    width="6"
                                    height={`${sellH}%`}
                                    className={cn("transition-all duration-500", isCurrent ? "fill-red-500" : "fill-red-500/40")}
                                    rx="3"
                                  />
                                )}
                              </g>
                            );
                          })}

                          {/* 3. PROFIT LINE (Key Insight Layer) */}
                          <polyline points={areaPath} fill="url(#chartGlow)" className="opacity-40" />
                          <polyline
                            points={pathData}
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="text-primary-500 shadow-2xl"
                          />

                          {/* 4. SMART X-AXIS (UX: Dynamic labels with indicators for all days) */}
                          {groupedNodes.map((group, i) => {
                            const isCurrent = i === currentGroupIndex;
                            const x = (i / (groupedNodes.length - 1)) * 100;
                            
                            // 4a. Show a subtle tick mark for EVERY day
                            const tickElement = (
                              <circle 
                                key={`tick-${i}`}
                                cx={`${x}%`} 
                                cy="92%" 
                                r={isCurrent ? 2 : 1}
                                className={cn(
                                  "transition-all duration-300",
                                  isCurrent ? "fill-primary-500" : "fill-gray-800"
                                )}
                              />
                            );

                            // 4b. Smart Label Logic
                            const isEdge = i === 0 || i === groupedNodes.length - 1;
                            const isInterval = i % 4 === 0;
                            const isNearEnd = i > groupedNodes.length - 4 && i < groupedNodes.length - 1;
                            
                            const shouldShowLabel = (isInterval && !isNearEnd) || isEdge || isCurrent;

                            return (
                              <g key={`ticker-group-${i}`} className="pointer-events-none">
                                {tickElement}
                                {shouldShowLabel && (
                                  <text 
                                    x={`${x}%`} y="110%" textAnchor="middle" 
                                    className={cn(
                                      "transition-all duration-300",
                                      isCurrent ? "fill-white text-[12px] font-black" : "fill-gray-600 text-[10px] font-bold"
                                    )}
                                  >
                                    {group.date.split('-').slice(1).join('/')}
                                  </text>
                                )}
                              </g>
                            );
                          })}

                          {/* 5. INTERACTIVE HIGHLIGHT (Simplified focus) */}
                          {(() => {
                            const i = currentGroupIndex;
                            const val = profitTrend[i];
                            const x = (i / (profitTrend.length - 1)) * 100;
                            const y = 40 - (val / maxAbsProfit) * 35;
                            
                            return (
                              <g className="pointer-events-none">
                                <line x1={`${x}%`} y1="0" x2={`${x}%`} y2="92%" stroke="currentColor" className="text-primary-500/20" strokeWidth="1.5" strokeDasharray="4 4" />
                                <circle cx={`${x}%`} cy={`${y}%`} r={8} className="fill-primary-500 stroke-white stroke-[4px] shadow-[0_0_30px_rgba(59,130,246,1)]" />
                              </g>
                            );
                          })()}
                        </>
                      );
                    })()}
                  </svg>
                  </div>
                </div>
              </div>

                {/* Transactions Table Section - Simplified */}
                <div className="w-full bg-white/[0.01] rounded-2xl border border-white/5 overflow-hidden shadow-xl animate-slide-up animation-delay-100">
                  <div className="px-6 py-4 border-b border-white/5 bg-white/[0.01] space-y-3">
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">일간 매매 명세</h4>
                    {selectedGroup.memo && (
                      <div className="flex items-start gap-3 bg-white/[0.02] p-4 rounded-xl border border-white/5 animate-in fade-in slide-in-from-top-1">
                        <Quote size={12} className="text-primary-500 opacity-60 mt-1 flex-shrink-0" />
                        <p className="text-[11px] font-medium text-gray-400 italic leading-relaxed">
                          {selectedGroup.memo}
                        </p>
                      </div>
                    )}
                  </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-white/[0.02]">
                        <th className="px-6 py-4 text-[13px] font-normal text-gray-500 uppercase tracking-widest">구분</th>
                        <th className="px-6 py-4 text-[13px] font-normal text-gray-500 uppercase tracking-widest text-right">수량</th>
                        <th className="px-6 py-4 text-[13px] font-normal text-gray-500 uppercase tracking-widest text-right">단가</th>
                        <th className="px-6 py-4 text-[13px] font-normal text-gray-500 uppercase tracking-widest text-right">거래금액</th>
                        <th className="px-6 py-4 text-[13px] font-normal text-gray-500 uppercase tracking-widest text-right">손익 / 변동</th>
                        <th className="px-6 py-4 text-[13px] font-normal text-gray-500 uppercase tracking-widest text-right pr-8">잔고</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.02]">
                      {selectedGroup.transactions.map((node) => (
                        <tr key={node.id} className="group/row hover:bg-white/[0.02] transition-colors border-b border-white/[0.01] last:border-0">
                          <td className="px-6 py-6">
                            <div className={cn(
                              "inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border",
                              node.type === 'BUY' && "bg-blue-500/20 text-blue-400 border-blue-500/30",
                              node.type === 'SELL' && "bg-red-500/20 text-red-400 border-red-500/30",
                              node.type === 'CURRENT' && "bg-emerald-500/20 text-emerald-400 border-emerald-500/20"
                            )}>
                              {node.type === 'CURRENT' ? 'CURRENT' : node.type}
                            </div>
                          </td>
                          <td className="px-6 py-6 text-[13px] font-normal text-gray-200 text-right tabular-nums tracking-tight">
                            {formatNumber(node.quantity)}
                          </td>
                          <td className="px-6 py-6 text-[13px] font-normal text-gray-400 text-right tabular-nums tracking-tight">
                            {formatCurrency(node.price)}
                          </td>
                          <td className="px-6 py-6 text-[13px] font-normal text-gray-200 text-right tabular-nums tracking-tight">
                            {formatCurrency(node.total)}
                          </td>
                          <td className="px-6 py-6 text-right tabular-nums">
                            {node.type === 'BUY' ? (
                              <div className="inline-flex items-center px-3 py-1 bg-red-500/10 border border-red-500/20 rounded-full">
                                <span className="text-[13px] font-normal text-red-400/80">
                                  Avg {(node.avgPriceChange || 0) > 0 ? '+' : ''}{formatNumber(Math.abs(node.avgPriceChange || 0))}
                                </span>
                              </div>
                            ) : (
                              <div className="flex flex-col items-end leading-none">
                                <span className={cn(
                                  "text-[13px] font-normal tracking-tight", 
                                  (node.profit || 0) > 0 ? "text-red-400" : "text-blue-400"
                                )}>
                                  {formatCurrency(node.profit || 0)}
                                </span>
                                <span className="text-[13px] font-normal text-gray-600 mt-1">
                                  {node.profitRate}%
                                </span>
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-6 text-[13px] font-normal text-gray-500 text-right pr-8 tabular-nums tracking-tight">
                            {formatNumber(node.holdingsAfter)}<span className="text-[13px] ml-0.5 opacity-50">주</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Global Bottom Summary */}
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
                onClick={() => setCurrentGroupIndex((prev) => (prev + 1) % groupedNodes.length)}
              >
                NEXT DAY
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
