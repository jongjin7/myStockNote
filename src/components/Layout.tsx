import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Wallet, Bookmark, Settings, Download, RefreshCcw } from 'lucide-react';
import { cn } from '../lib/utils';

export default function Layout() {
  const location = useLocation();

  const navItems = [
    { path: '/', icon: LayoutDashboard, label: '대시보드' },
    { path: '/accounts', icon: Wallet, label: '계좌 관리' },
    { path: '/watchlist', icon: Bookmark, label: '관심 종목' },
  ];

  const bottomNavItems = [
    { path: '/settings', icon: Settings, label: '설정' },
    { path: '/backup', icon: Download, label: '백업/복구' },
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col md:flex-row font-sans selection:bg-primary-500/30 selection:text-white">
      {/* Sidebar Navigation (Desktop) */}
      <nav className="hidden md:flex flex-col w-72 border-r border-gray-800/50 bg-gray-950 sticky top-0 h-screen overflow-hidden">
        {/* Logo */}
        <div className="flex items-center gap-4 px-8 py-10">
          <div className="w-12 h-12 bg-gradient-to-tr from-primary-600 to-primary-400 rounded-2xl flex items-center justify-center font-black text-white shadow-2xl shadow-primary-500/20 transform hover:rotate-3 transition-transform">
            SN
          </div>
          <div>
            <span className="text-2xl font-bold tracking-tighter text-white">StockNote</span>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mt-1">Investment Log</p>
          </div>
        </div>

        {/* Main Navigation */}
        <div className="flex-1 px-6 py-4 space-y-2 overflow-y-auto custom-scrollbar">
          <div className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-600 px-4 mb-4">Main Menu</div>
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 group relative overflow-hidden",
                  isActive
                    ? "bg-gray-900 border border-gray-800 text-primary-400 shadow-lg shadow-black/20"
                    : "text-gray-500 hover:text-gray-200 hover:bg-gray-900/60"
                )}
              >
                {isActive && (
                  <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-primary-500 rounded-r-full shadow-[0_0_10px_rgba(59,130,246,1)]" />
                )}
                
                <item.icon 
                  size={20} 
                  className={cn(
                    "transition-all duration-300",
                    isActive 
                      ? "text-primary-500 scale-110" 
                      : "text-gray-600 group-hover:scale-110"
                  )} 
                />
                <span className={cn("font-bold text-sm tracking-tight", isActive ? "text-white" : "")}>{item.label}</span>
                
                {isActive && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
                )}
              </Link>
            );
          })}
        </div>

        {/* Bottom Navigation */}
        <div className="px-6 pb-6 space-y-2">
          <div className="h-px bg-gradient-to-r from-transparent via-gray-800 to-transparent mb-6" />
          {bottomNavItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-4 px-5 py-3.5 rounded-2xl transition-all duration-300 group",
                location.pathname === item.path
                  ? "bg-gray-900 text-primary-400 shadow-md"
                  : "text-gray-600 hover:text-gray-300 hover:bg-gray-900/40"
              )}
            >
              <item.icon size={18} className="flex-shrink-0 opacity-60 group-hover:opacity-100 transition-opacity" />
              <span className="text-xs font-bold tracking-tight">{item.label}</span>
            </Link>
          ))}

          {/* Sync Status Card */}
          <div className="mt-8 p-5 bg-gray-900/50 rounded-2xl border border-gray-800/30 group cursor-default">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-black uppercase tracking-[0.15em] text-gray-600">Sync Status</span>
              <RefreshCcw size={14} className="text-gray-700 animate-spin-slow group-hover:text-primary-500 transition-colors" />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-300 mb-1">Local Storage Database</p>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-success shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                <span className="text-[10px] font-mono text-gray-500">Last: {new Date().toLocaleTimeString()}</span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Top Nav */}
      <nav className="md:hidden flex items-center justify-between px-6 py-4 border-b border-gray-800/50 bg-gray-950/90 backdrop-blur-xl sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-tr from-primary-600 to-primary-400 rounded-xl flex items-center justify-center font-black text-white text-sm shadow-xl shadow-primary-500/20">
            SN
          </div>
          <span className="text-xl font-bold tracking-tight text-white">StockNote</span>
        </div>
        <button className="p-3 bg-gray-900 rounded-xl hover:bg-gray-800 transition-colors">
          <Settings size={20} className="text-gray-400" />
        </button>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 overflow-auto bg-grid-pattern">
        <div className="min-h-full p-6 md:p-12 lg:p-16">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </div>
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden flex items-center justify-around px-4 py-4 border-t border-gray-800/50 bg-gray-950/90 backdrop-blur-xl sticky bottom-0 z-50 shadow-2xl shadow-black/50">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
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
    </div>
  );
}
