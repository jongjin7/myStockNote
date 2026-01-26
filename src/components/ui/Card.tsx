import { type HTMLAttributes, type ReactNode } from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  interactive?: boolean;
  hover?: boolean;
}

export default function Card({ 
  children, 
  className, 
  interactive = false,
  hover = true,
  ...props 
}: CardProps) {
  return (
    <div
      className={cn(
        'bg-surface border border-gray-200 rounded-lg shadow-sm',
        'p-6',
        'transition-all duration-200',
        hover && 'hover:shadow-md hover:-translate-y-0.5',
        interactive && 'cursor-pointer hover:bg-surface-hover',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export function CardHeader({ children, className, ...props }: CardHeaderProps) {
  return (
    <div className={cn('mb-4', className)} {...props}>
      {children}
    </div>
  );
}

export interface CardTitleProps extends HTMLAttributes<HTMLHeadingElement> {
  children: ReactNode;
}

export function CardTitle({ children, className, ...props }: CardTitleProps) {
  return (
    <h3 
      className={cn('text-xl font-bold text-gray-900 tracking-tight', className)} 
      {...props}
    >
      {children}
    </h3>
  );
}

export interface CardDescriptionProps extends HTMLAttributes<HTMLParagraphElement> {
  children: ReactNode;
}

export function CardDescription({ children, className, ...props }: CardDescriptionProps) {
  return (
    <p 
      className={cn('text-sm text-gray-600 mt-1', className)} 
      {...props}
    >
      {children}
    </p>
  );
}

export interface CardContentProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export function CardContent({ children, className, ...props }: CardContentProps) {
  return (
    <div className={cn('', className)} {...props}>
      {children}
    </div>
  );
}

export interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export function CardFooter({ children, className, ...props }: CardFooterProps) {
  return (
    <div 
      className={cn('mt-4 pt-4 border-t border-gray-200 flex items-center gap-2', className)} 
      {...props}
    >
      {children}
    </div>
  );
}
