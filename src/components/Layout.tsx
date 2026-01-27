import { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Wallet, Bookmark, Settings, Download, RefreshCcw, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../lib/utils';

export default function Layout() {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

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
    <div className="h-screen bg-gray-950 text-gray-100 flex flex-col md:flex-row font-sans selection:bg-primary-500/30 selection:text-white overflow-hidden">
      {/* Sidebar Navigation (Desktop) */}
      <nav 
        className={cn(
          "hidden md:flex flex-col border-r border-gray-800/50 bg-gray-950 h-full overflow-visible transition-all duration-300 ease-in-out relative z-20 group/sidebar",
          isCollapsed ? "w-20" : "w-56"
        )}
      >
        {/* Toggle Button */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-10 bg-gray-900 border border-gray-800 text-gray-400 p-1 rounded-full hover:text-white hover:bg-gray-800 transition-colors z-50 opacity-0 group-hover/sidebar:opacity-100 focus:opacity-100 cursor-pointer"
        >
          {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>

        {/* Logo */}
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

        {/* Snapshot Badge */}
        {!isCollapsed && (
          <div className="px-5 mb-6 animate-fade-in transition-all duration-300 select-none cursor-default">
            <div className="flex items-center justify-between gap-3 bg-gray-950/30 border border-dashed border-gray-800/60 px-4 py-3 rounded-lg font-num">
              <div className="flex flex-col items-end gap-0.5">
                <span className="text-[9px] font-black text-gray-500 uppercase tracking-[0.2em] leading-none">SNAPSHOT | 스냅샷</span>
                <span className="text-[10px] font-bold text-gray-400 tabular-nums uppercase tracking-widest leading-none mt-1">
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
        )}

        {/* Main Navigation */}
        <div className="flex-1 px-3 py-4 space-y-2 overflow-y-auto custom-scrollbar overflow-x-hidden">
          {!isCollapsed && (
            <div className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-600 px-7 mb-4 whitespace-nowrap transition-opacity duration-300">
              메뉴 목록
            </div>
          )}
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-4 py-4 rounded-2xl transition-all duration-300 group relative overflow-hidden",
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
                  <span className={cn("font-bold text-sm tracking-tight whitespace-nowrap overflow-hidden transition-all duration-300", isActive ? "text-white" : "")}>
                    {item.label}
                  </span>
                )}
                
                {isActive && !isCollapsed && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
                )}
              </Link>
            );
          })}
        </div>

        {/* Bottom Navigation */}
        <div className="px-3 pb-6 space-y-2">
          <div className="h-px bg-gradient-to-r from-transparent via-gray-800 to-transparent mb-6 mx-2" />
          {bottomNavItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
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
          })}

          {/* Sync Status Card */}
          <div className={cn(
            "mt-8 bg-gray-900/50 rounded-2xl border border-gray-800/30 group cursor-default transition-all duration-300 overflow-hidden",
            isCollapsed ? "p-2 mx-auto w-10 h-10 flex items-center justify-center hover:w-full hover:p-5 hover:h-auto absolute bottom-6 left-0 right-0 mx-4 z-10 backdrop-blur-md" : "p-5"
          )}>
            {isCollapsed ? (
              <RefreshCcw size={14} className="text-gray-700 animate-spin-slow group-hover:hidden" />
            ) : null}
            
            <div className={cn(isCollapsed ? "hidden group-hover:block" : "block")}>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-black uppercase tracking-[0.15em] text-gray-600">SYNC STATUS | 동기화</span>
                <RefreshCcw size={14} className="text-gray-700 animate-spin-slow group-hover:text-primary-500 transition-colors" />
              </div>
              <div className="font-num">
                <p className="text-[11px] font-bold text-gray-300 mb-1 whitespace-nowrap">DATABASE | 로컬 저장소</p>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-success shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                  <span className="text-[9px] font-mono text-gray-500 whitespace-nowrap uppercase tracking-tighter">최근: {new Date().toLocaleTimeString('ko-KR')}</span>
                </div>
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
        <button className="p-3 bg-gray-900 rounded-xl hover:bg-gray-800 transition-colors cursor-pointer">
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
