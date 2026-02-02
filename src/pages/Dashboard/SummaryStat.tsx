import { cn, formatNumber } from '../../lib/utils';

interface SummaryStatProps {
 label: string;
 value: string | number;
 prefix?: string;
 valueClassName?: string;
}

export function SummaryStat({ label, value, prefix, valueClassName }: SummaryStatProps) {
 return (
  <div className="shrink-0 space-y-1 sm:space-y-2">
   <span className="font-bold text-[10px] sm:text-xs text-gray-500 uppercase tracking-wider">{label}</span>
   <div className="flex items-baseline tracking-tight tabular-nums">
   {prefix && <span className="text-[10px] sm:text-sm font-light mr-1 opacity-50">{prefix}</span>}
   <p className={cn("text-lg sm:text-2xl lg:text-3xl font-bold text-gray-100 truncate", valueClassName)}>
    {typeof value === 'number' ? formatNumber(value) : value}
   </p>
   </div>
  </div>
 );
}
