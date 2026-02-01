import { type ReactNode } from 'react';
import { cn } from '../../lib/utils';

interface FormFieldProps {
  children: ReactNode;
  className?: string;
}

export function FormField({ children, className }: FormFieldProps) {
  return (
    <div className={cn("space-y-2", className)}>
      {children}
    </div>
  );
}

interface FormLabelProps {
  children: ReactNode;
  htmlFor?: string;
  required?: boolean;
  className?: string;
}

export function FormLabel({ children, htmlFor, required, className }: FormLabelProps) {
  return (
    <label 
      htmlFor={htmlFor}
      className={cn("block text-sm font-medium text-gray-700", className)}
    >
      {children}
      {required && <span className="text-danger ml-1">*</span>}
    </label>
  );
}
