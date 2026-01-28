import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
 return twMerge(clsx(inputs));
}

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
 variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'success';
 size?: 'sm' | 'md' | 'lg';
 isLoading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
 ({ 
 className, 
 variant = 'primary', 
 size = 'md', 
 isLoading = false,
 disabled,
 children,
 ...props 
 }, ref) => {
 const baseStyles = cn(
  'inline-flex items-center justify-center',
  'font-bold transition-all duration-300',
  'focus:outline-none focus:ring-2 focus:ring-primary-500/40',
  'disabled:opacity-40 disabled:cursor-not-allowed',
  'active:scale-[0.96]'
 );

 const variantStyles = {
  primary: cn(
  'bg-primary-500 text-white',
  'hover:bg-primary-600 hover:shadow-lg hover:shadow-primary-500/20',
  ),
  secondary: cn(
  'bg-white/5 border border-white/10 text-gray-300',
  'hover:bg-white/10 hover:text-white',
  ),
  success: cn(
  'bg-success text-white',
  'hover:bg-success-dark hover:shadow-lg hover:shadow-success/20',
  ),
  danger: cn(
  'bg-danger text-white',
  'hover:bg-danger-dark hover:shadow-lg hover:shadow-danger/20',
  ),
  ghost: cn(
  'bg-transparent text-gray-400',
  'hover:bg-white/5 hover:text-white',
  ),
 };

 const sizeStyles = {
  sm: 'px-4 py-2 text-xs rounded-xl tracking-wider',
  md: 'px-6 py-3 text-sm rounded-2xl tracking-wide',
  lg: 'px-8 py-4 text-base rounded-3xl tracking-widest uppercase',
 };

 return (
  <button
  ref={ref}
  className={cn(
   baseStyles,
   variantStyles[variant],
   sizeStyles[size],
   className
  )}
  disabled={disabled || isLoading}
  {...props}
  >
  {isLoading ? (
   <>
   <svg
    className="animate-spin -ml-1 mr-3 h-5 w-5"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
   >
    <circle
    className="opacity-25"
    cx="12"
    cy="12"
    r="10"
    stroke="currentColor"
    strokeWidth="4"
    />
    <path
    className="opacity-75"
    fill="currentColor"
    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    />
   </svg>
   처리 중...
   </>
  ) : (
   children
  )}
  </button>
 );
 }
);

Button.displayName = 'Button';

export default Button;
