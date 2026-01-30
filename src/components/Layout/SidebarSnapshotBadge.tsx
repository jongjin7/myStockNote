interface SidebarSnapshotBadgeProps {
  isCollapsed: boolean;
}

export function SidebarSnapshotBadge({ isCollapsed }: SidebarSnapshotBadgeProps) {
  if (isCollapsed) return null;
  
  return (
    <div className="px-5 mb-6 animate-fade-in transition-all duration-300 select-none cursor-default">
      <div className="flex items-center justify-between gap-3 bg-gray-950/30 border border-dashed border-gray-800/60 px-4 py-3 rounded-lg">
        <div className="flex flex-col items-end gap-0.5">
          <span className="text-[9px] font-black text-gray-500 uppercase tracking-[0.2em] leading-none">SNAPSHOT | 스냅샷</span>
          <span className="text-sm font-bold text-gray-400 tabular-nums uppercase tracking-widest leading-none mt-1">
            {new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: 'short', day: '2-digit' })}
          </span>
        </div>
        <div className="w-[1px] h-6 bg-gray-800/50" />
        <div className="flex flex-col items-start gap-0.5">
          <span className="text-[9px] font-black text-gray-600 uppercase tracking-[0.2em] leading-none">UPDATE | 업데이트</span>
          <div className="flex items-center gap-1.5 leading-none mt-1">
            <div className="w-1.5 h-1.5 rounded-full bg-primary-500/80 animate-pulse" />
            <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">LIVE | 활성</span>
          </div>
        </div>
      </div>
    </div>
  );
}
