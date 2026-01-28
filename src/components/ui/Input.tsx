import { forwardRef, type InputHTMLAttributes } from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
 return twMerge(clsx(inputs));
}

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
 label?: string;
 error?: string;
 helperText?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
 ({ className, label, error, helperText, type = 'text', ...props }, ref) => {
 const inputId = props.id || `input-${Math.random().toString(36).substr(2, 9)}`;

 return (
  <div className="w-full">
  {label && (
   <label
   htmlFor={inputId}
   className="block text-sm font-medium text-gray-700 mb-2"
   >
   {label}
   {props.required && <span className="text-danger ml-1">*</span>}
   </label>
  )}
  
  <input
   ref={ref}
   id={inputId}
   type={type}
   className={cn(
   'w-full h-11 px-4 py-3',
   'text-base font-normal',
   'bg-white border rounded-lg',
   'transition-all duration-200',
   'placeholder:text-gray-400',
   'focus:outline-none focus:ring-2 focus:ring-offset-0',
   error
    ? 'border-danger focus:border-danger focus:ring-danger/20'
    : 'border-gray-300 focus:border-primary-500 focus:ring-primary-100',
   'disabled:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50',
   type === 'number' && 'text-right ',
   className
   )}
   {...props}
  />

  {error && (
   <p className="mt-1.5 text-sm text-danger flex items-center gap-1">
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
   <p className="mt-1.5 text-sm text-gray-500">{helperText}</p>
  )}
  </div>
 );
 }
);

Input.displayName = 'Input';

export default Input;
