import { Quote } from 'lucide-react';
import { cn, formatCurrency, formatNumber } from '../../../lib/utils';
import type { DayGroup } from './types';

interface TransactionLogProps {
  selectedGroup: DayGroup;
}

export function TransactionLog({ selectedGroup }: TransactionLogProps) {
  return (
    <div className="w-full bg-white/[0.01] rounded-2xl border border-white/5 overflow-hidden shadow-xl animate-slide-up animation-delay-100">
      <div className="px-4 md:px-6 py-3 md:py-4 border-b border-white/5 bg-white/[0.01] space-y-3">
        <h4 className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-widest">일간 매매 명세</h4>
        {selectedGroup.memo && (
          <div className="flex items-start gap-2 md:gap-3 bg-white/[0.02] p-3 md:p-4 rounded-xl border border-white/5 animate-in fade-in slide-in-from-top-1">
            <Quote size={12} className="text-primary-500 opacity-60 mt-1 flex-shrink-0" />
            <p className="text-[10px] md:text-[11px] font-medium text-gray-400 italic leading-relaxed">
              {selectedGroup.memo}
            </p>
          </div>
        )}
      </div>
      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full text-left border-collapse min-w-[600px] md:min-w-0">
          <thead>
            <tr className="border-b border-white/[0.02]">
              <th className="px-4 md:px-6 py-3 md:py-4 text-[11px] md:text-[13px] font-normal text-gray-500 uppercase tracking-widest whitespace-nowrap">구분</th>
              <th className="px-4 md:px-6 py-3 md:py-4 text-[11px] md:text-[13px] font-normal text-gray-500 uppercase tracking-widest text-right whitespace-nowrap">수량</th>
              <th className="px-4 md:px-6 py-3 md:py-4 text-[11px] md:text-[13px] font-normal text-gray-500 uppercase tracking-widest text-right whitespace-nowrap">단가</th>
              <th className="px-4 md:px-6 py-3 md:py-4 text-[11px] md:text-[13px] font-normal text-gray-500 uppercase tracking-widest text-right whitespace-nowrap">거래금액</th>
              <th className="px-4 md:px-6 py-3 md:py-4 text-[11px] md:text-[13px] font-normal text-gray-500 uppercase tracking-widest text-right whitespace-nowrap">손익 / 변동</th>
              <th className="px-4 md:px-6 py-3 md:py-4 text-[11px] md:text-[13px] font-normal text-gray-500 uppercase tracking-widest text-right pr-6 md:pr-8 whitespace-nowrap">잔고</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.02]">
            {selectedGroup.transactions.map((node) => (
              <tr key={node.id} className="group/row hover:bg-white/[0.02] transition-colors border-b border-white/[0.01] last:border-0">
                <td className="px-4 md:px-6 py-4 md:py-6">
                  <div className={cn(
                    "inline-flex items-center px-2 md:px-2.5 py-0.5 md:py-1 rounded-md text-[9px] md:text-[10px] font-bold uppercase tracking-wider border",
                    node.type === 'BUY' && "bg-blue-500/20 text-blue-400 border-blue-500/30",
                    node.type === 'SELL' && "bg-red-500/20 text-red-400 border-red-500/30",
                    node.type === 'CURRENT' && "bg-emerald-500/20 text-emerald-400 border-emerald-500/20"
                  )}>
                    {node.type === 'CURRENT' ? 'CURRENT' : node.type}
                  </div>
                </td>
                <td className="px-4 md:px-6 py-4 md:py-6 text-[12px] md:text-[13px] font-normal text-gray-200 text-right tabular-nums tracking-tight">
                  {formatNumber(node.quantity)}
                </td>
                <td className="px-4 md:px-6 py-4 md:py-6 text-[12px] md:text-[13px] font-normal text-gray-400 text-right tabular-nums tracking-tight">
                  {formatCurrency(node.price)}
                </td>
                <td className="px-4 md:px-6 py-4 md:py-6 text-[12px] md:text-[13px] font-normal text-gray-200 text-right tabular-nums tracking-tight">
                  {formatCurrency(node.total)}
                </td>
                <td className="px-4 md:px-6 py-4 md:py-6 text-right tabular-nums">
                  {node.type === 'BUY' ? (
                    <div className="inline-flex items-center px-2 md:px-3 py-0.5 md:py-1 bg-red-500/10 border border-red-500/20 rounded-full">
                      <span className="text-[12px] md:text-[13px] font-normal text-red-400/80">
                        Avg {(node.avgPriceChange || 0) > 0 ? '+' : ''}{formatNumber(Math.abs(node.avgPriceChange || 0))}
                      </span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-end leading-none">
                      <span className={cn(
                        "text-[12px] md:text-[13px] font-normal tracking-tight", 
                        (node.profit || 0) > 0 ? "text-red-400" : "text-blue-400"
                      )}>
                        {formatCurrency(node.profit || 0)}
                      </span>
                      <span className="text-[11px] md:text-[13px] font-normal text-gray-600 mt-1">
                        {node.profitRate}%
                      </span>
                    </div>
                  )}
                </td>
                <td className="px-4 md:px-6 py-4 md:py-6 text-[12px] md:text-[13px] font-normal text-gray-500 text-right pr-6 md:pr-8 tabular-nums tracking-tight">
                  {formatNumber(node.holdingsAfter)}<span className="text-[11px] md:text-[13px] ml-0.5 opacity-50">주</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
