import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { LayoutDashboard, Wallet, Bookmark, Settings, ChevronLeft, ChevronRight, LayoutList } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useApp } from '../../contexts/AppContext';
import { Button } from '../ui';
import { SidebarLogo } from './SidebarLogo';
import { SidebarNavItem } from './SidebarNavItem';
import { SidebarSyncStatus } from './SidebarSyncStatus';
import { MobileTopNav } from './MobileTopNav';
import { MobileBottomNav } from './MobileBottomNav';

export default function Layout() {
  const { isLoading } = useApp();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navItems = [
    { path: '/', icon: LayoutDashboard, label: '대시보드' },
    { path: '/holdings', icon: LayoutList, label: '보유 종목' },
    { path: '/accounts', icon: Wallet, label: '계좌 관리' },
    { path: '/watchlist', icon: Bookmark, label: '관심 종목' },
  ];

  const bottomNavItems = [
    { path: '/settings', icon: Settings, label: '설정' },
  ];

  return (
    <div className="h-screen bg-gray-950 text-gray-100 flex flex-col md:flex-row selection:bg-primary-500/30 selection:text-white overflow-hidden">
      {/* Sidebar Navigation (Desktop) */}
      <nav 
        className={cn(
          "hidden md:flex flex-col border-r border-gray-800/50 bg-gray-950 h-full overflow-visible transition-all duration-300 ease-in-out relative z-20 group/sidebar",
          isCollapsed ? "w-20" : "w-56"
        )}
      >
        <Button
          variant="secondary"
          size="sm"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-10 w-7 h-7 p-0 rounded-full border border-gray-800 z-50 opacity-0 group-hover/sidebar:opacity-100 focus:opacity-100"
        >
          {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </Button>

        <SidebarLogo isCollapsed={isCollapsed} />

        {/* Main Navigation */}
        <div className="flex-1 px-3 py-4 space-y-1 overflow-y-auto custom-scrollbar overflow-x-hidden">
          {navItems.map((item) => (
            <SidebarNavItem 
              key={item.path}
              item={item}
              isActive={location.pathname === item.path}
              isCollapsed={isCollapsed}
            />
          ))}
        </div>

        {/* Bottom Navigation */}
        <div className="px-3 pb-6 space-y-2">
          <div className="h-px bg-gradient-to-r from-transparent via-gray-800 to-transparent mb-6 mx-2" />
          {bottomNavItems.map((item) => (
            <SidebarNavItem 
              key={item.path}
              item={item}
              isActive={location.pathname === item.path}
              isCollapsed={isCollapsed}
              isBottom
            />
          ))}
          <SidebarSyncStatus isCollapsed={isCollapsed} />
        </div>
      </nav>

      <MobileTopNav />

      {/* Main Content Area */}
      <main className="flex-1 overflow-auto bg-grid-pattern relative">
        {isLoading && (
          <div className="absolute top-0 left-0 right-0 h-1 z-50 overflow-hidden">
            <div className="w-full h-full bg-primary-500/20 animate-pulse">
              <div className="h-full bg-primary-500 animate-loading-bar w-1/3" />
            </div>
          </div>
        )}
        
        <div className="min-h-full p-6 md:p-12 lg:p-16">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </div>
      </main>

      <MobileBottomNav navItems={navItems} pathname={location.pathname} />
    </div>
  );
}
