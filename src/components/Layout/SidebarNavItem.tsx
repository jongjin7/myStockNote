import { Link } from 'react-router-dom';
import { cn } from '../../lib/utils';
import type { LucideIcon } from 'lucide-react';

interface SidebarNavItemProps {
  item: {
    path: string;
    icon: LucideIcon;
    label: string;
  };
  isActive: boolean;
  isCollapsed: boolean;
  isBottom?: boolean;
}

export function SidebarNavItem({ 
  item, 
  isActive, 
  isCollapsed, 
  isBottom = false 
}: SidebarNavItemProps) {
  if (isBottom) {
    return (
      <Link
        to={item.path}
        className={cn(
          "flex items-center gap-4 py-3.5 rounded-2xl transition-all duration-300 group overflow-hidden",
          isActive 
            ? "bg-gray-900 text-primary-400 shadow-md"
            : "text-gray-600 hover:text-gray-300 hover:bg-gray-900/40",
          isCollapsed ? "justify-center px-0" : "px-5"
        )}
        title={isCollapsed ? item.label : undefined}
      >
        <item.icon size={18} className="flex-shrink-0 opacity-60 group-hover:opacity-100 transition-opacity" />
        {!isCollapsed && (
          <span className="text-xs font-bold tracking-tight whitespace-nowrap transition-all duration-300">{item.label}</span>
        )}
      </Link>
    );
  }

  return (
    <Link
      to={item.path}
      className={cn(
        "flex items-center gap-3 py-2 rounded-full transition-all duration-300 group relative overflow-hidden",
        isActive
          ? "bg-gray-900 border border-gray-800 text-primary-400 shadow-lg shadow-black/20"
          : "text-gray-500 hover:text-gray-200 hover:bg-gray-900/60",
        isCollapsed ? "justify-center px-0" : "px-5"
      )}
      title={isCollapsed ? item.label : undefined}
    >
      {isActive && !isCollapsed && (
        <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-primary-500 rounded-r-full shadow-[0_0_10px_rgba(59,130,246,1)]" />
      )}
      
      <item.icon 
        size={20} 
        className={cn(
          "transition-all duration-300 flex-shrink-0",
          isActive 
            ? "text-primary-500 scale-110" 
            : "text-gray-600 group-hover:scale-110"
        )} 
      />
      
      {!isCollapsed && (
        <span className={cn("font-semibold tracking-tight whitespace-nowrap overflow-hidden transition-all duration-300", isActive ? "text-white" : "")}>
          {item.label}
        </span>
      )}
      
      {isActive && !isCollapsed && (
        <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
      )}
    </Link>
  );
}
