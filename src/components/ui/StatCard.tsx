import type { ReactNode } from 'react';
import { cn } from '../../lib/utils';
import Badge from './Badge';

interface StatCardProps {
  label: string;
  value: string | number;
  unit?: string;
  subtitle?: string;
  variant?: 'default' | 'primary' | 'success' | 'danger' | 'info';
  badgeText?: string;
  badgeVariant?: 'default' | 'success' | 'danger' | 'info' | 'warning';
  action?: ReactNode;
  className?: string;
  valueClassName?: string;
  labelVariant?: 'default' | 'primary';
}

export function StatCard({
  label,
  value,
  unit,
  subtitle,
  variant = 'default',
  badgeText,
  badgeVariant,
  action,
  className,
  valueClassName,
  labelVariant = 'default'
}: StatCardProps) {
  const isDefault = variant === 'default';
  
  return (
    <div className={cn(
      "p-4 sm:p-6 lg:p-8 rounded-[1.25rem] sm:rounded-[2rem] lg:rounded-[2.5rem] backdrop-blur-sm transition-all duration-500 group overflow-hidden",
      isDefault && "bg-gray-900/40 border border-gray-800",
      variant === 'primary' && "bg-primary-500/5 border border-primary-500/10 hover:bg-primary-500/10",
      variant === 'success' && "bg-success/10 border border-white/[0.05]",
      variant === 'danger' && "bg-danger/10 border border-white/[0.05]",
      variant === 'info' && "bg-info/10 border border-white/[0.05]",
      action ? "flex items-center justify-between" : "block",
      className
    )}>
      <div className={cn(action ? "flex-1" : "space-y-1.5 sm:space-y-2 lg:space-y-3", "min-w-0")}>
        <div className="flex justify-between items-start mb-1.5 sm:mb-2 lg:mb-3 gap-2">
          <div className={cn(
            "text-[10px] sm:text-xs lg:text-sm font-semibold uppercase tracking-[0.1em] truncate",
            labelVariant === 'primary' ? "text-primary-500" : "text-gray-600"
          )}>
            {label} {subtitle && <span className="opacity-60 hidden sm:inline">{subtitle}</span>}
          </div>
          {badgeText && (
            <Badge variant={badgeVariant || 'info'} className="text-[10px] sm:text-xs font-bold px-1.5 py-0.5 sm:px-2.5 sm:py-1 rounded-lg shadow-lg whitespace-nowrap">
              {badgeText}
            </Badge>
          )}
        </div>
        <div className={cn(
          "text-lg sm:text-2xl lg:text-3xl font-bold tabular-nums tracking-tighter leading-tight break-words",
          variant === 'danger' ? "text-danger-light" : variant === 'info' ? "text-info-light" : "text-white",
          valueClassName
        )}>
          {value}
          {unit && (
            <span className="text-lg ml-1 text-gray-600 font-bold">
              {unit}
            </span>
          )}
        </div>
      </div>
      {action && (
        <div className="ml-4">
          {action}
        </div>
      )}
    </div>
  );
}
