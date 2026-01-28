import { cn, formatNumber } from '../../lib/utils';

interface SummaryStatProps {
 label: string;
 value: string | number;
 prefix?: string;
 valueClassName?: string;
}

export function SummaryStat({ label, value, prefix, valueClassName }: SummaryStatProps) {
 return (
 <div className="space-y-2">
  <span className="text-gray-500 uppercase">{label}</span>
  <div className="flex items-baseline tracking-tight tabular-nums mt-1">
  {prefix && <span className="relative -top-0.5 text-sm font-light mr-2">{prefix}</span>}
  <p className={cn("text-3xl font-bold text-gray-100", valueClassName)}>
   {typeof value === 'number' ? formatNumber(value) : value}
  </p>
  </div>
 </div>
 );
}
