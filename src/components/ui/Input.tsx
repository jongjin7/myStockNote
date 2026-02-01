import { forwardRef, type InputHTMLAttributes } from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string;
  helperText?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helperText, type = 'text', size = 'md', ...props }, ref) => {
    const inputId = props.id || `input-${Math.random().toString(36).substr(2, 9)}`;

    const sizeStyles = {
      sm: 'h-7 px-3 text-xs rounded',           // 28px height, 4px radius
      md: 'h-8 px-3 text-sm rounded-sm',        // 32px height, 8px radius
      lg: 'h-10 px-4 text-base rounded-md',     // 40px height, 12px radius
      xl: 'h-12 px-5 text-base rounded-lg',     // 48px height, 12px radius
    };

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            {label}
          </label>
        )}

        <input
          ref={ref}
          id={inputId}
          type={type}
          className={cn(
            'w-full',
            'font-normal',
            'bg-white border',
            'transition-all duration-200',
            'placeholder:text-gray-400',
            'focus:outline-none focus:ring-2 focus:ring-offset-0',
            error
              ? 'border-danger focus:border-danger focus:ring-danger/20'
              : 'border-gray-300 focus:border-primary-500 focus:ring-primary-100',
            'disabled:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50',
            type === 'number' && 'text-right',
            sizeStyles[size],
            className
          )}
          {...props}
        />

        {(error || helperText) && (
          <p className={cn(
            "text-[10px] ml-1 font-medium tracking-wide mt-1.5",
            error ? "text-danger" : "text-gray-600"
          )}>
            {error || helperText}
          </p>
        )}

        {helperText && !error && (
          <p className="mt-1.5 text-sm text-gray-500">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
