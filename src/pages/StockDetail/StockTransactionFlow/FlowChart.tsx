import { cn } from '../../../lib/utils';
import type { DayGroup } from './types';
import type { RefObject } from 'react';

interface FlowChartProps {
  groupedNodes: DayGroup[];
  currentGroupIndex: number;
  setCurrentGroupIndex: (index: number) => void;
  chartScrollRef: RefObject<HTMLDivElement | null>;
}

export function FlowChart({
  groupedNodes,
  currentGroupIndex,
  setCurrentGroupIndex,
  chartScrollRef
}: FlowChartProps) {

  return (
    <div 
      ref={chartScrollRef}
      className="absolute inset-0 pt-28 pb-12 overflow-x-auto custom-scrollbar overflow-y-hidden"
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
            <linearGradient id="hitGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="white" stopOpacity="0" />
              <stop offset="50%" stopColor="white" stopOpacity="0.07" />
              <stop offset="100%" stopColor="white" stopOpacity="0" />
            </linearGradient>
            <filter id="shadow">
              <feDropShadow dx="0" dy="4" stdDeviation="4" floodOpacity="0.3" />
            </filter>
          </defs>

          {(() => {
            const profitTrend = groupedNodes.map((_, i: number) => 
              groupedNodes.slice(0, i + 1).reduce((acc: number, group: DayGroup) => 
                acc + group.transactions.reduce((st: number, t) => st + (t.profit || 0), 0), 0)
            );
            
            const volumeData = groupedNodes.map((g: DayGroup) => ({
              buyQty: g.transactions.filter(t => t.type === 'BUY').reduce((acc, t) => acc + t.quantity, 0),
              sellQty: g.transactions.filter(t => t.type === 'SELL').reduce((acc, t) => acc + t.quantity, 0)
            }));

            const maxAbsProfit = Math.max(...profitTrend.map(Math.abs), 100000);
            const maxQty = Math.max(...volumeData.map(v => Math.max(v.buyQty, v.sellQty)), 10);
            
            const points = profitTrend.map((val: number, i: number) => {
              const x = (i / (profitTrend.length - 1)) * 100;
              const y = 40 - (val / maxAbsProfit) * 35;
              return `${x}% ${y}%`;
            });

            const pathData = points.join(', ');
            const areaPath = `0% 40%, ${pathData}, 100% 40%`;

            return (
              <>
                <line x1="0" y1="40%" x2="100%" y2="40%" stroke="currentColor" className="text-gray-800/40" strokeWidth="1" strokeDasharray="10 5" />
                
                {groupedNodes.map((_, i: number) => {
                  const x = (i / (groupedNodes.length - 1)) * 100;
                  const width = 100 / (groupedNodes.length - 1);

                  return (
                    <rect
                      key={`hit-${i}`}
                      x={`calc(${x}% - ${width / 2}%)`}
                      y="0"
                      width={`${width}%`}
                      height="100%"
                      fill="url(#hitGradient)"
                      className="cursor-pointer pointer-events-auto opacity-0 hover:opacity-100 transition-opacity duration-300"
                      onClick={() => setCurrentGroupIndex(i)}
                    />
                  );
                })}

                {volumeData.map((v, i: number) => {
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

                {groupedNodes.map((group: DayGroup, i: number) => {
                  const isCurrent = i === currentGroupIndex;
                  const x = (i / (groupedNodes.length - 1)) * 100;
                  
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
  );
}
