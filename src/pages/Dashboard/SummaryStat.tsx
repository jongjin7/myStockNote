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
      <span className="text-gray-500 uppercase tracking-widest text-[11px] font-bold">{label}</span>
      <div className="flex items-baseline font-black tracking-tight tabular-nums mt-1">
        {prefix && <span className="text-xs font-light text-gray-600 mr-2 opacity-50">{prefix}</span>}
        <p className={cn("text-2xl text-gray-100 font-num", valueClassName)}>
          {typeof value === 'number' ? formatNumber(value) : value}
        </p>
      </div>
    </div>
  );
}
