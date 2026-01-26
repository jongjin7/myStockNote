import { forwardRef, useState, useEffect, type TextareaHTMLAttributes } from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  maxLength?: number;
  showCharCount?: boolean;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ 
    className, 
    label, 
    error, 
    helperText, 
    maxLength,
    showCharCount = false,
    value,
    onChange,
    ...props 
  }, ref) => {
    const [charCount, setCharCount] = useState(0);
    const textareaId = props.id || `textarea-${Math.random().toString(36).substr(2, 9)}`;

    useEffect(() => {
      if (value !== undefined) {
        setCharCount(String(value).length);
      }
    }, [value]);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setCharCount(e.target.value.length);
      onChange?.(e);
    };

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={textareaId}
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            {label}
            {props.required && <span className="text-danger ml-1">*</span>}
          </label>
        )}
        
        <textarea
          ref={ref}
          id={textareaId}
          className={cn(
            'w-full min-h-[6rem] px-4 py-3',
            'text-base font-normal',
            'bg-white border rounded-lg',
            'transition-all duration-200',
            'placeholder:text-gray-400',
            'resize-vertical',
            'focus:outline-none focus:ring-2 focus:ring-offset-0',
            error
              ? 'border-danger focus:border-danger focus:ring-danger/20'
              : 'border-gray-300 focus:border-primary-500 focus:ring-primary-100',
            'disabled:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50',
            className
          )}
          maxLength={maxLength}
          value={value}
          onChange={handleChange}
          {...props}
        />

        <div className="flex items-center justify-between mt-1.5">
          <div className="flex-1">
            {error && (
              <p className="text-sm text-danger flex items-center gap-1">
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                {error}
              </p>
            )}

            {helperText && !error && (
              <p className="text-sm text-gray-500">{helperText}</p>
            )}
          </div>

          {(showCharCount || maxLength) && (
            <p
              className={cn(
                'text-xs font-medium ml-2',
                maxLength && charCount > maxLength
                  ? 'text-danger'
                  : 'text-gray-500'
              )}
            >
              {charCount}
              {maxLength && ` / ${maxLength}`}
            </p>
          )}
        </div>
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

export default Textarea;
