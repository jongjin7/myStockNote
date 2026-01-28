import { useEffect, type ReactNode } from 'react';
import { X } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
 return twMerge(clsx(inputs));
}

export interface ModalProps {
 isOpen: boolean;
 onClose: () => void;
 children: ReactNode;
 title?: string;
 size?: 'sm' | 'md' | 'lg' | 'xl';
 className?: string;
}

const sizeConfig = {
 sm: 'max-w-md',
 md: 'max-w-lg',
 lg: 'max-w-2xl',
 xl: 'max-w-4xl',
};

export function Modal({ 
 isOpen, 
 onClose, 
 children, 
 title,
 size = 'md',
 className
}: ModalProps) {
 useEffect(() => {
 if (isOpen) {
  document.body.style.overflow = 'hidden';
 } else {
  document.body.style.overflow = 'unset';
 }

 return () => {
  document.body.style.overflow = 'unset';
 };
 }, [isOpen]);

 useEffect(() => {
 const handleEscape = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && isOpen) {
  onClose();
  }
 };

 document.addEventListener('keydown', handleEscape);
 return () => document.removeEventListener('keydown', handleEscape);
 }, [isOpen, onClose]);

 if (!isOpen) return null;

 return (
 <div
  className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-hidden"
 >
  {/* Overlay */}
  <div
  className="absolute inset-0 bg-black/80 backdrop-blur-md animate-fade-in"
  onClick={onClose}
  aria-hidden="true"
  />

  {/* Modal Container */}
  <div
  className={cn(
   'relative w-full bg-gray-900 border border-gray-800 rounded-3xl shadow-2xl',
   'animate-scale-in flex flex-col',
   sizeConfig[size],
   className
  )}
  onClick={(e) => e.stopPropagation()}
  role="dialog"
  aria-modal="true"
  >
  {/* Header */}
  <div className="flex items-center justify-between p-8 pb-4">
   {title ? (
   <h2 className="text-2xl font-bold text-white tracking-tight">
    {title}
   </h2>
   ) : (
   <div />
   )}
   <button
   onClick={onClose}
   className="p-2 rounded-xl text-gray-500 hover:bg-white/5 hover:text-white transition-all transform hover:rotate-90"
   aria-label="닫기"
   >
   <X size={24} />
   </button>
  </div>

  {/* Content */}
  <div className="overflow-y-auto max-h-[calc(100vh-16rem)] thin-scrollbar">
   {children}
  </div>
  </div>
 </div>
 );
}

export interface ModalHeaderProps {
 children: ReactNode;
 className?: string;
}

export function ModalHeader({ children, className }: ModalHeaderProps) {
 return (
 <div className={cn("px-8 py-4", className)}>
  {children}
 </div>
 );
}

export interface ModalBodyProps {
 children: ReactNode;
 className?: string;
}

export function ModalBody({ children, className }: ModalBodyProps) {
 return (
 <div className={cn("px-8 py-6", className)}>
  {children}
 </div>
 );
}

export interface ModalFooterProps {
 children: ReactNode;
 className?: string;
}

export function ModalFooter({ children, className }: ModalFooterProps) {
 return (
 <div className={cn("px-8 py-6 bg-gray-950/50 flex items-center justify-end gap-3 rounded-b-3xl border-t border-gray-800", className)}>
  {children}
 </div>
 );
}
