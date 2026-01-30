import { forwardRef, type SelectHTMLAttributes } from 'react';
import { cn } from '../../lib/utils';
import { ChevronDown } from 'lucide-react';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  helperText?: string;
  error?: string;
  options: SelectOption[];
  placeholder?: string;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, helperText, error, options, ...props }, ref) => {
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
              "w-full bg-gray-900/60 border border-gray-800 text-white text-sm rounded-xl px-4 py-3 appearance-none",
              "focus:outline-none focus:border-primary-500/50 focus:ring-4 focus:ring-primary-500/5 transition-all outline-none",
              "cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed backdrop-blur-sm",
              error ? "border-danger/50 focus:border-danger/50 focus:ring-danger/5" : "",
              className
            )}
            {...props}
          >
            <option value="" disabled hidden>{props.placeholder || '선택하세요'}</option>
            {options.map((option) => (
              <option key={option.value} value={option.value} className="bg-gray-950 text-white py-2">
                {option.label}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-primary-500 transition-colors">
            <ChevronDown size={18} />
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
