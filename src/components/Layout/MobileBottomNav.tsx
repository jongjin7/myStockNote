import { Link } from 'react-router-dom';
import { cn } from '../../lib/utils';
import type { LucideIcon } from 'lucide-react';

interface MobileBottomNavProps {
  navItems: Array<{
    path: string;
    icon: LucideIcon;
    label: string;
  }>;
  pathname: string;
}

export function MobileBottomNav({ navItems, pathname }: MobileBottomNavProps) {
  return (
    <nav className="md:hidden flex items-center justify-around px-4 py-4 border-t border-gray-800/50 bg-gray-950/90 backdrop-blur-xl sticky bottom-0 z-50 shadow-2xl shadow-black/50">
      {navItems.map((item) => {
        const isActive = pathname === item.path;
        return (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              "flex flex-col items-center gap-2.5 px-6 py-2.5 rounded-2xl transition-all duration-300",
              isActive 
                ? "text-primary-500 bg-primary-500/5" 
                : "text-gray-600 active:scale-90"
            )}
          >
            <item.icon 
              size={24} 
              className={cn(
                "transition-all duration-300",
                isActive && "scale-110 drop-shadow-[0_0_10px_rgba(59,130,246,0.6)]"
              )}
            />
            <span className={cn("text-[9px] font-black uppercase tracking-widest", isActive ? "text-white" : "text-gray-700")}>
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
