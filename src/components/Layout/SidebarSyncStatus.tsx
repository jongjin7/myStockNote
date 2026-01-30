import { RefreshCcw, Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils';

interface SidebarSyncStatusProps {
  isCollapsed: boolean;
  isLoading: boolean;
}

export function SidebarSyncStatus({ 
  isCollapsed, 
  isLoading 
}: SidebarSyncStatusProps) {
  return (
    <div className={cn(
      "mt-8 bg-gray-900/50 rounded-2xl border border-gray-800/30 group cursor-default transition-all duration-300 overflow-hidden",
      isCollapsed ? "p-2 mx-auto w-10 h-10 flex items-center justify-center hover:w-full hover:p-5 hover:h-auto absolute bottom-6 left-0 right-0 mx-4 z-10 backdrop-blur-md" : "p-5"
    )}>
      {isCollapsed && (
        <RefreshCcw size={14} className="text-gray-700 animate-spin-slow group-hover:hidden" />
      )}
      
      <div className={cn(isCollapsed ? "hidden group-hover:block" : "block")}>
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-black uppercase tracking-[0.15em] text-gray-600">SYNC STATUS | 동기화</span>
          {isLoading ? (
            <Loader2 size={14} className="text-primary-500 animate-spin" />
          ) : (
            <RefreshCcw size={14} className="text-gray-700 group-hover:text-primary-500 transition-colors" />
          )}
        </div>
        <div className=" ">
          <p className="text-[11px] font-bold text-gray-300 mb-1 whitespace-nowrap">API SERVER | 온라인</p>
          <div className="flex items-center gap-2">
            <div className={cn("w-1.5 h-1.5 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.5)]", isLoading ? "bg-primary-500 animate-pulse" : "bg-success")} />
            <span className="text-[9px] text-gray-500 whitespace-nowrap uppercase tracking-tighter">
              {isLoading ? '동기화 중...' : `최근: ${new Date().toLocaleTimeString('ko-KR')}`}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
