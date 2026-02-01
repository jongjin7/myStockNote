import type { ReactNode } from 'react';
import { cn } from '../../lib/utils';

interface PageHeaderProps {
  title: string;
  subtitle: string;
  description?: string;
  extra?: ReactNode;
  className?: string;
}

export default function PageHeader({ 
  title, 
  subtitle, 
  description, 
  extra, 
  className 
}: PageHeaderProps) {
  return (
    <header className={cn("flex flex-col md:flex-row md:items-center justify-between gap-6", className)}>
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-4 leading-none">
          <h1 className="text-[2.75rem] font-bold tracking-tight">
            {title}
          </h1>
          <span className="text-2xl font-light opacity-50">|</span>
          <span className="text-xl font-bold opacity-50 uppercase tracking-widest">
            {subtitle}
          </span>
        </div>
        {description && (
          <p className="text-sm font-medium text-gray-600">
            {description}
          </p>
        )}
      </div>
      {extra && (
        <div className="flex items-center gap-3">
          {extra}
        </div>
      )}
    </header>
  );
}
