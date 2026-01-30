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
      isDefault && "bg-gray-900/40 border border-gray-800 hover:border-white/10 hover:bg-gray-900/60",
      variant === 'primary' && "bg-primary-500/5 border border-primary-500/10 hover:bg-primary-500/10 hover:border-primary-500/30",
      variant === 'success' && "bg-success/10 border border-white/[0.05] hover:bg-success/[0.12] hover:border-success/20",
      variant === 'danger' && "bg-danger/10 border border-white/[0.05] hover:bg-danger/[0.12] hover:border-danger/20",
      variant === 'info' && "bg-info/10 border border-white/[0.05] hover:bg-info/[0.12] hover:border-info/20",
      action ? "flex items-center justify-between" : "block",
      className
    )}>
      <div className={cn(action ? "flex-1" : "space-y-3")}>
        <div className="flex justify-between items-start mb-3">
          <div className={cn(
            "text-[10px] font-black uppercase tracking-[0.2em] transition-colors",
            labelVariant === 'primary' ? "text-primary-500 opacity-60 group-hover:opacity-100" : "text-gray-600 group-hover:text-gray-400"
          )}>
            {label} {subtitle && <span className="opacity-60">{subtitle}</span>}
          </div>
          {badgeText && (
            <Badge variant={badgeVariant || 'info'} className="text-[10px] font-black px-2.5 py-1 rounded-lg shadow-lg">
              {badgeText}
            </Badge>
          )}
        </div>
        <div className={cn(
          "text-3xl font-black tabular-nums tracking-tighter leading-none group-hover:scale-[1.02] transition-transform origin-left",
          variant === 'danger' ? "text-danger-light" : variant === 'info' ? "text-info-light" : "text-white",
          valueClassName
        )}>
          {value}
          {unit && (
            <span className="text-lg ml-1 text-gray-600 font-bold group-hover:text-primary-500 transition-colors">
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
