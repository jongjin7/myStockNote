import { type HTMLAttributes } from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type BadgeStatus = 'HOLDING' | 'PARTIAL_SOLD' | 'SOLD' | 'WATCHLIST';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  status?: BadgeStatus;
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'default';
  children?: React.ReactNode;
}

const statusConfig: Record<BadgeStatus, { bg: string; text: string; label: string }> = {
  HOLDING: {
    bg: 'bg-success-light/10',
    text: 'text-success-dark',
    label: '보유중',
  },
  PARTIAL_SOLD: {
    bg: 'bg-warning-light/10',
    text: 'text-warning-dark',
    label: '일부매도',
  },
  SOLD: {
    bg: 'bg-gray-300/50',
    text: 'text-gray-700',
    label: '전량매도',
  },
  WATCHLIST: {
    bg: 'bg-info-light/10',
    text: 'text-info-dark',
    label: '관심종목',
  },
};

const variantConfig = {
  success: 'bg-success-light/10 text-success-dark',
  warning: 'bg-warning-light/10 text-warning-dark',
  danger: 'bg-danger-light/10 text-danger-dark',
  info: 'bg-info-light/10 text-info-dark',
  default: 'bg-gray-200 text-gray-700',
};

export default function Badge({ 
  status, 
  variant = 'default',
  className, 
  children,
  ...props 
}: BadgeProps) {
  const config = status ? statusConfig[status] : null;
  const variantStyle = variant ? variantConfig[variant] : variantConfig.default;

  return (
    <span
      className={cn(
        'inline-flex items-center px-3 py-1',
        'text-xs font-semibold',
        'rounded-full',
        'transition-colors duration-200',
        config ? `${config.bg} ${config.text}` : variantStyle,
        className
      )}
      {...props}
    >
      {status ? config?.label : children}
    </span>
  );
}
