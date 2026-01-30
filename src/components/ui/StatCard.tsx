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
      "p-8 rounded-[2.5rem] backdrop-blur-sm transition-all duration-500 group",
      isDefault && "bg-gray-900/40 border border-gray-800",
      variant === 'primary' && "bg-primary-500/5 border border-primary-500/10 hover:bg-primary-500/10",
      variant === 'success' && "bg-success/10 border border-white/[0.05]",
      variant === 'danger' && "bg-danger/10 border border-white/[0.05]",
      variant === 'info' && "bg-info/10 border border-white/[0.05]",
      action ? "flex items-center justify-between" : "block",
      className
    )}>
      <div className={cn(action ? "flex-1" : "space-y-3")}>
        <div className="flex justify-between items-start mb-3">
          <div className={cn(
            "text-sm font-semibold uppercase tracking-[0.1em]",
            labelVariant === 'primary' ? "text-primary-500" : "text-gray-600"
          )}>
            {label} {subtitle && <span className="opacity-60">{subtitle}</span>}
          </div>
          {badgeText && (
            <Badge variant={badgeVariant || 'info'} className="text-sm font-bold px-2.5 py-1 rounded-lg shadow-lg">
              {badgeText}
            </Badge>
          )}
        </div>
        <div className={cn(
          "text-3xl font-bold tabular-nums tracking-tighter leading-none",
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
