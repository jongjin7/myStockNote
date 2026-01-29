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
    <div className={cn("flex items-center gap-1 bg-gray-950/40 p-1.5 rounded-2xl border border-white/[0.02] backdrop-blur-md overflow-x-auto no-scrollbar", className)}>
      {items.map((item) => {
        const isActive = activeId === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={cn(
              "flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 whitespace-nowrap",
              isActive 
                ? "bg-gray-800 text-white shadow-xl shadow-black/20 border border-white/[0.05]" 
                : "text-gray-500 hover:text-gray-300 hover:bg-white/5"
            )}
          >
            <span>{item.label}</span>
            {item.count !== undefined && (
              <span className={cn(
                "text-[10px] tabular-nums px-1.5 py-0.5 rounded-md font-black",
                isActive ? "bg-primary-500/20 text-primary-400" : "bg-gray-900 text-gray-700"
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
