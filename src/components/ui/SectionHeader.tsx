import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '../../lib/utils';
import Badge from './Badge';

interface SectionHeaderProps {
  icon?: LucideIcon;
  title: string;
  count?: number;
  extra?: ReactNode;
  className?: string;
}

export default function SectionHeader({ 
  icon: Icon, 
  title, 
  count, 
  extra, 
  className 
}: SectionHeaderProps) {
  return (
    <div className={cn("flex items-center justify-between px-2", className)}>
      <div className="flex items-center gap-3">
        {Icon && <Icon size={20} className="text-primary-500/80" />}
        <div className="flex items-center gap-3">
          <h3 className="text-2xl font-bold text-white/90 tracking-tight">
            {title}
          </h3>
          {count !== undefined && (
            <Badge 
              variant="default" 
              className="bg-primary-500/10 text-primary-400 border border-primary-500/10 text-[10px] font-bold px-2.5 py-0 h-6 flex items-center gap-1.5 shadow-lg shadow-primary-500/5 transition-all group-hover:bg-primary-500/20"
            >
              <span className="opacity-60 text-[10px]">총</span>
              <span className="text-white brightness-125 tabular-nums text-xs">{count}</span>
              <span className="opacity-60 text-[10px]">개</span>
            </Badge>
          )}
        </div>
      </div>
      {extra && (
        <div className="flex items-center">
          {extra}
        </div>
      )}
    </div>
  );
}
