import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Wallet, Bookmark, FileText, ChevronRight } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function Layout() {
  const location = useLocation();

  const navItems = [
    { path: '/', icon: LayoutDashboard, label: '대시보드' },
    { path: '/accounts', icon: Wallet, label: '계좌 관리' },
    { path: '/watchlist', icon: Bookmark, label: '관심 종목' },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row">
      {/* Sidebar Navigation (Desktop) */}
      <nav className="hidden md:flex flex-col w-64 border-r border-slate-800 p-6 space-y-8">
        <div className="flex items-center space-x-2 px-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white">
            SN
          </div>
          <span className="text-xl font-bold tracking-tight">StockNote</span>
        </div>

        <div className="flex-1 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group",
                location.pathname === item.path
                  ? "bg-blue-600/10 text-blue-400"
                  : "text-slate-400 hover:bg-slate-900 hover:text-slate-100"
              )}
            >
              <item.icon size={20} className={cn(
                "transition-colors",
                location.pathname === item.path ? "text-blue-400" : "text-slate-500 group-hover:text-slate-300"
              )} />
              <span className="font-medium">{item.label}</span>
              {location.pathname === item.path && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-500" />
              )}
            </Link>
          ))}
        </div>

        <div className="p-4 bg-slate-900/50 rounded-2xl border border-slate-800">
          <p className="text-xs text-slate-500 mb-2">마지막 동기화</p>
          <p className="text-sm font-medium">{new Date().toLocaleDateString()}</p>
        </div>
      </nav>

      {/* Mobile Top Nav */}
      <nav className="md:hidden flex items-center justify-between p-4 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white">
            SN
          </div>
          <span className="text-lg font-bold">StockNote</span>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 overflow-auto p-4 md:p-10">
        <div className="max-w-6xl mx-auto">
          <Outlet />
        </div>
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden flex items-center justify-around p-3 border-t border-slate-800 bg-slate-950/80 backdrop-blur-md sticky bottom-0 z-50">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              "flex flex-col items-center p-2 rounded-lg transition-colors",
              location.pathname === item.path ? "text-blue-400" : "text-slate-500"
            )}
          >
            <item.icon size={20} />
            <span className="text-[10px] mt-1 font-medium">{item.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}
