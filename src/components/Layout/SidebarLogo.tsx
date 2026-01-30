import { Link } from 'react-router-dom';
import { cn } from '../../lib/utils';

interface SidebarLogoProps {
  isCollapsed: boolean;
}

export function SidebarLogo({ isCollapsed }: SidebarLogoProps) {
  return (
    <div className={cn("flex items-center gap-4 py-8 transition-all duration-300", isCollapsed ? "px-4 justify-center" : "px-8")}>
      <Link to="/" className="cursor-pointer block">
        {isCollapsed ? (
          <div className="w-10 h-10 bg-gradient-to-tr from-primary-600 to-primary-400 rounded-2xl flex-shrink-0 flex items-center justify-center font-black text-white shadow-2xl shadow-primary-500/20 transform hover:rotate-3 transition-transform">
            SN
          </div>
        ) : (
          <img 
            src="/logo_full.png" 
            alt="StockNote" 
            className="h-12 w-auto object-contain transition-all duration-300" 
          />
        )}
      </Link>
    </div>
  );
}
