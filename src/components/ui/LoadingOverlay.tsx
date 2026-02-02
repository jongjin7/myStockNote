import { createPortal } from 'react-dom';

interface LoadingOverlayProps {
  isLoading: boolean;
  message?: string;
}

export function LoadingOverlay({ isLoading, message }: LoadingOverlayProps) {
  if (!isLoading) return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-950/40 backdrop-blur-sm duration-300">
      <div className="relative flex flex-col items-center justify-center p-8">
        {/* Outer Ring */}
        <div className="absolute inset-0 border-4 border-gray-800/30 rounded-full w-20 h-20 m-auto" />
        
        {/* Spinning Gradient Ring */}
        <div className="w-20 h-20 rounded-full border-4 border-transparent border-t-primary-500 border-r-primary-500/50 animate-spin" />

        {/* Text */}
        <div className="absolute -bottom-4 flex flex-col items-center gap-1">
          <p className="text-primary-400 font-semibold text-sm animate-pulse uppercase whitespace-nowrap">
            {message || 'Processing ...'}
          </p>
        </div>
      </div>
    </div>,
    document.body
  );
}
