import { forwardRef, type SelectHTMLAttributes } from 'react';
import { cn } from '../../lib/utils';
import { ChevronDown } from 'lucide-react';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  label?: string;
  helperText?: string;
  error?: string;
  options: SelectOption[];
  placeholder?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, helperText, error, options, size = 'md', ...props }, ref) => {
    const sizeStyles = {
      sm: 'h-7 px-3 text-xs rounded',           // 28px height, 4px radius
      md: 'h-8 px-3 text-sm rounded-lg',        // 32px height, 8px radius
      lg: 'h-10 px-5 text-base rounded-xl',     // 40px height, 12px radius
      xl: 'h-12 px-6 text-base rounded-xl',     // 48px height, 12px radius
    };

    const iconSizes = {
      sm: 12,
      md: 14,
      lg: 16,
      xl: 18,
    };

    return (
      <div className="w-full space-y-2 group">
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {label}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            className={cn(
              "w-full bg-gray-900/80 border border-gray-700 text-white pr-9 appearance-none",
              "focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all",
              "cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed backdrop-blur-sm font-medium",
              "hover:bg-gray-900 hover:border-gray-600",
              sizeStyles[size],
              error ? "border-danger/50 focus:border-danger focus:ring-danger/20" : "",
              className
            )}
            {...props}
          >
            <option value="" disabled hidden>{props.placeholder || '선택하세요'}</option>
            {options.map((option) => (
              <option key={option.value} value={option.value} className="bg-gray-900 text-white py-2">
                {option.label}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary-400 transition-colors">
            <ChevronDown size={iconSizes[size]} strokeWidth={2.5} />
          </div>
        </div>
        {(error || helperText) && (
          <p className={cn(
            "text-[10px] ml-1 font-medium tracking-wide",
            error ? "text-danger" : "text-gray-600"
          )}>
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';

export default Select;
