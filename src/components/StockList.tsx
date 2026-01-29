import { useState, useMemo } from 'react';
import type { ReactNode } from 'react';
import { PlusCircle, Search } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { SectionHeader } from './ui';
import { StockCard } from './StockCard';
import type { Stock, StockMemo } from '../types';
import { cn } from '../lib/utils';

interface StockListProps {
  title: string;
  stocks: Stock[];
  memos: StockMemo[];
  icon?: LucideIcon;
  onAddClick?: () => void;
  emptyMessage?: string;
  compact?: boolean;
  showSearch?: boolean;
  layout?: 'list' | 'grid';
  className?: string;
  extra?: ReactNode;
  searchPlaceholder?: string;
}

export function StockList({
  title,
  stocks,
  memos,
  icon,
  onAddClick,
  emptyMessage = "종목이 없습니다.",
  compact = false,
  showSearch = false,
  layout = 'list',
  className,
  extra,
  searchPlaceholder = "종목명 또는 심볼로 검색..."
}: StockListProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredStocks = useMemo(() => {
    if (!searchQuery) return stocks;
    const query = searchQuery.toLowerCase();
    return stocks.filter(s => 
      s.name.toLowerCase().includes(query) || 
      (s.symbol && s.symbol.toLowerCase().includes(query))
    );
  }, [stocks, searchQuery]);

  const hasStocks = stocks.length > 0;
  const noSearchResults = searchQuery && filteredStocks.length === 0;

  return (
    <div className={cn("space-y-6", className)}>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <SectionHeader 
          icon={icon}
          title={title}
          count={stocks.length}
          className="px-0"
        />

        <div className="flex items-center gap-3">
          {extra}
          {onAddClick && (
            <button 
              onClick={onAddClick}
              className="p-2.5 bg-gray-800/40 hover:bg-primary-500/10 text-gray-500 hover:text-primary-500 rounded-xl transition-all border border-white/[0.03] hover:border-primary-500/20 group"
            >
              <PlusCircle size={20} className="group-hover:scale-110 transition-transform" />
            </button>
          )}
        </div>
      </div>

      {showSearch && hasStocks && (
        <div className="relative group w-full">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-primary-500 transition-colors">
            <Search size={18} />
          </div>
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={searchPlaceholder}
            className="w-full bg-gray-900/40 border border-gray-800 focus:border-primary-500/50 focus:ring-4 focus:ring-primary-500/5 rounded-2xl pl-12 pr-4 py-3 text-sm text-white focus:outline-none transition-all placeholder:text-gray-700 backdrop-blur-sm"
          />
        </div>
      )}

      {hasStocks ? (
        noSearchResults ? (
          <div className="py-20 text-center border-2 border-dashed border-white/5 rounded-[2rem] bg-gray-900/10">
            <Search size={48} className="mx-auto text-gray-800 mb-4" />
            <p className="text-gray-500 font-medium">검색 결과가 없습니다.</p>
          </div>
        ) : (
          <div className={cn(
            "grid gap-4",
            layout === 'grid' ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1",
            compact ? "space-y-1" : ""
          )}>
            {filteredStocks.map((stock) => {
              const hasNote = memos.some(m => m.stockId === stock.id);
              return (
                <StockCard 
                  key={stock.id}
                  stock={stock}
                  hasNote={hasNote}
                  compact={compact}
                />
              );
            })}
          </div>
        )
      ) : (
        <button 
          onClick={onAddClick}
          className={cn(
            "w-full border-2 border-dashed border-white/5 rounded-[2rem] flex flex-col items-center justify-center gap-3 hover:bg-white/[0.02] hover:border-white/10 transition-all group",
            compact ? "h-32" : "h-64"
          )}
        >
          <div className="p-4 bg-gray-900/50 rounded-full text-gray-700 group-hover:text-primary-500/50 transition-colors">
            <PlusCircle size={compact ? 24 : 40} />
          </div>
          <div className="text-center">
            <p className="text-sm font-bold text-gray-600 group-hover:text-gray-400">{emptyMessage}</p>
            {!compact && <p className="text-xs text-gray-700 mt-1">새로운 종목을 추가하여 추적을 시작하세요.</p>}
          </div>
        </button>
      )}
    </div>
  );
}
