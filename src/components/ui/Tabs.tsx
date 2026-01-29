import { cn } from '../../lib/utils';

interface TabItem {
  id: string;
  label: string;
  count?: number;
}

interface TabsProps {
  items: TabItem[];
  activeId: string;
  onTabChange: (id: string) => void;
  className?: string;
}

export function Tabs({ items, activeId, onTabChange, className }: TabsProps) {
  return (
    <div className={cn(
      "flex items-center gap-1 bg-gray-900/40 p-1 rounded-2xl border border-white/[0.03] backdrop-blur-xl overflow-x-auto no-scrollbar shadow-inner", 
      className
    )}>
      {items.map((item) => {
        const isActive = activeId === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={cn(
              "flex items-center gap-2.5 px-6 py-2.5 rounded-[14px] text-sm font-black transition-all duration-500 ease-out whitespace-nowrap group/tab",
              isActive 
                ? "bg-gray-800 text-white shadow-[0_8px_20px_-6px_rgba(0,0,0,0.6)] border border-white/[0.08] ring-1 ring-white/[0.02]" 
                : "text-gray-500 hover:text-gray-300 hover:bg-white/[0.02]"
            )}
          >
            <span className={cn(
              "transition-colors duration-300",
              isActive ? "text-white" : "group-hover/tab:text-gray-200"
            )}>
              {item.label}
            </span>
            {item.count !== undefined && (
              <span className={cn(
                "text-[9px] tabular-nums px-2 py-0.5 rounded-lg font-black tracking-tighter transition-all duration-300",
                isActive 
                  ? "bg-primary-500 text-white shadow-[0_0_12px_rgba(59,130,246,0.4)]" 
                  : "bg-gray-900/80 text-gray-700 group-hover/tab:bg-gray-800 group-hover/tab:text-gray-500"
              )}>
                {item.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
