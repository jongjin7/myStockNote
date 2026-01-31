import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { Bookmark } from 'lucide-react';
import { 
 PageHeader, Tabs
} from '../components/ui';
import { StockList } from '../components/StockList';
import { StockModal } from '../components/StockModal';

import { CATEGORY_OPTIONS } from '../lib/constants';

export default function Watchlist() {
  const { data } = useApp();
  const { stocks, memos } = data;
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTabId = searchParams.get('tab') || 'all';

  const watchlistStocksAll = stocks.filter(s => s.status === 'WATCHLIST');
  const totalMemos = memos.filter(m => stocks.some(s => s.id === m.stockId && s.status === 'WATCHLIST')).length;

  // 동적 카테고리 탭 구성
  const usedCategoryIds = Array.from(new Set(watchlistStocksAll.map(s => s.category).filter(Boolean))) as string[];
  
  const tabItems = [
    { id: 'all', label: '전체 관심', count: watchlistStocksAll.length },
    ...CATEGORY_OPTIONS
      .filter(opt => usedCategoryIds.includes(opt.value))
      .map(opt => ({
        id: opt.value,
        label: opt.label,
        count: watchlistStocksAll.filter(s => s.category === opt.value).length
      }))
  ];

  const watchlistStocks = watchlistStocksAll.filter(s => {
    if (activeTabId === 'all') return true;
    return s.category === activeTabId;
  });

  const handleTabChange = (id: string) => {
    if (id === 'all') {
      searchParams.delete('tab');
    } else {
      searchParams.set('tab', id);
    }
    setSearchParams(searchParams);
  };

  const [isStockModalOpen, setIsStockModalOpen] = useState(false);


 return (
 <div className="space-y-10 animate-fade-in max-w-6xl mx-auto">
  <PageHeader 
    title="관심 종목"
    subtitle="Watchlist"
    description="정찰 중인 종목과 리서치 자료를 관리하며 매수 기회를 포착합니다."
    extra={
      <div className="flex items-center gap-6">
        <div className="flex items-baseline gap-1 text-right text-sm font-bold text-gray-500" >
          <span className=" uppercase tracking-[0.2em]">총 리서치</span>
          <span className="text-3xl text-white tracking-tighter tabular-nums">
            {totalMemos}
          </span>
          <span>건</span>
        </div>
        
      </div>
    }
  />

    {/* Watchlist Control Center Area */}
    <div className="space-y-6 relative">
      {/* Subtle Background Accent (Cyan for Research) */}
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-3/4 h-64 bg-info/5 blur-[120px] pointer-events-none rounded-full" />
      
      <div className="relative z-10">
        <Tabs 
            items={tabItems} 
            activeId={activeTabId} 
            onTabChange={handleTabChange} 
            className="w-full md:w-fit"
          />
      </div>
    </div>

    <StockList 
      title={activeTabId === 'all' ? "관심 종목 리스트" : `${CATEGORY_OPTIONS.find(o => o.value === activeTabId)?.label || ''} 리스트`}
     stocks={watchlistStocks}
     memos={memos}
     icon={Bookmark}
     showSearch
     layout="grid"
     onAddClick={() => setIsStockModalOpen(true)}
     emptyMessage="관심 종목이 비어 있습니다."
   />

  <StockModal 
    isOpen={isStockModalOpen}
    onClose={() => setIsStockModalOpen(false)}
    initialStatus="WATCHLIST"
  />
 </div>
 );
}
