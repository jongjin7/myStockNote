import { RefreshCcw, Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useApp } from '../../contexts/AppContext';


export function SidebarSyncStatus({ 
  isCollapsed 
}: { isCollapsed: boolean }) {
  const { isLoading, isSyncing, actions } = useApp();
  const isUpdating = isLoading || isSyncing;

  const handleRefresh = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isUpdating) {
      actions.updateAllStockPrices();
    }
  };

  return (
    <button 
      onClick={handleRefresh}
      disabled={isUpdating}
      className={cn(
        "w-full mt-6 bg-gray-900/40 hover:bg-gray-800/60 rounded-xl border border-white/[0.03] group transition-all duration-300 backdrop-blur-md overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed",
        isCollapsed ? "p-3 flex items-center justify-center aspect-square" : "p-4"
      )}
    >
      <div className="flex items-center justify-between gap-3">
        {!isCollapsed && (
          <div className="flex flex-col items-start gap-1">
            <span className="text-[11px] font-black text-gray-500 uppercase tracking-wider leading-none">주가 데이터 동기화</span>
            <span className="text-xs font-bold text-gray-300 tabular-nums leading-none mt-0.5">
              {isSyncing ? '최신화 진행 중...' : isLoading ? '로딩 중...' : `업데이트: ${new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}`}
            </span>
          </div>
        )}
        
        <div className={cn(
          "flex items-center justify-center transition-all duration-500",
          isUpdating ? "text-primary-500" : "text-gray-600 group-hover:text-primary-500",
          isCollapsed ? "" : "bg-gray-950/50 p-2 rounded-lg"
        )}>
          {isUpdating ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <RefreshCcw size={16} className="group-hover:rotate-180 transition-transform duration-500" />
          )}
        </div>
      </div>
    </button>
  );
}
