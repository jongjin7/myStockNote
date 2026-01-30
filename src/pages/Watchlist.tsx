import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { PlusCircle, Bookmark } from 'lucide-react';
import type { Stock } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { 
 Button, Input, ActionModal, PageHeader, Tabs, Select 
} from '../components/ui';
import { StockList } from '../components/StockList';

export default function Watchlist() {
  const { data, actions } = useApp();
  const { stocks, memos } = data;
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTabId = searchParams.get('tab') || 'all';

  const watchlistStocksAll = stocks.filter(s => s.status === 'WATCHLIST');
  const totalMemos = memos.filter(m => stocks.some(s => s.id === m.stockId && s.status === 'WATCHLIST')).length;

  // 동적 카테고리 탭 구성
  const usedCategoryIds = Array.from(new Set(watchlistStocksAll.map(s => s.category).filter(Boolean))) as string[];
  
  const categoryOptions = [
    { value: 'Tech', label: '기술/IT' },
    { value: 'Finance', label: '금융/은행' },
    { value: 'Healthcare', label: '제약/바이오' },
    { value: 'Energy', label: '에너지/자원' },
    { value: 'Consumer', label: '소비재/유통' },
    { value: 'Industrial', label: '산업재/제조' },
    { value: 'Communication', label: '통신/서비스' },
    { value: 'BasicMaterials', label: '기초소재/화학' },
    { value: 'Infra', label: '인프라/건설' },
    { value: 'Etc', label: '기타/ETF' },
  ];

  const tabItems = [
    { id: 'all', label: '전체 관심', count: watchlistStocksAll.length },
    ...categoryOptions
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

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newStockName, setNewStockName] = useState('');
  const [newStockSymbol, setNewStockSymbol] = useState('');
  const [newStockCategory, setNewStockCategory] = useState('');

  const handleAddStock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStockName.trim()) return;

    const stock: Stock = {
      id: uuidv4(),
      name: newStockName.trim(),
      symbol: newStockSymbol.trim() || null,
      status: 'WATCHLIST',
      category: newStockCategory || null,
      accountId: null,
      quantity: 0,
      avgPrice: 0,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    await actions.saveStock(stock);
    setNewStockName('');
    setNewStockSymbol('');
    setNewStockCategory('');
    setIsModalOpen(false);
  };


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
        <Button 
          onClick={() => setIsModalOpen(true)} 
          className="px-6 h-12"
        >
          <PlusCircle size={20} className="mr-2" />
          관심 추가
        </Button>
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
      title={activeTabId === 'all' ? "관심 종목 리스트" : `${categoryOptions.find(o => o.value === activeTabId)?.label || ''} 리스트`}
     stocks={watchlistStocks}
     memos={memos}
     icon={Bookmark}
     showSearch
     layout="grid"
     onAddClick={() => setIsModalOpen(true)}
     emptyMessage="관심 종목이 비어 있습니다."
   />

  {/* Add Modal */}
  <ActionModal 
  isOpen={isModalOpen} 
  onClose={() => setIsModalOpen(false)}
  onSubmit={handleAddStock}
  title="관심 종목 추가"
  submitLabel="관심 종목 추가하기"
  >
  <div className="space-y-6">
    <Input 
      label="종목명"
      value={newStockName}
      onChange={(e) => setNewStockName(e.target.value)}
      placeholder="예: 삼성전자, 엔비디아, 테슬라"
      autoFocus
      required
      className="bg-gray-950 border-gray-800"
    />

    <Input 
      label="종목코드/심볼 (선택)"
      value={newStockSymbol}
      onChange={(e) => setNewStockSymbol(e.target.value)}
      placeholder="예: 005930, NVDA, TSLA"
      className="bg-gray-950 border-gray-800"
      helperText="심볼을 입력하면 시세 연동 등 향후 기능 확장에 용이합니다."
    />

    <Select 
      label="카테고리 (산업군)"
      value={newStockCategory}
      onChange={(e) => setNewStockCategory(e.target.value)}
      options={categoryOptions}
      placeholder="산업군을 선택하세요"
    />
  </div>
  </ActionModal>
 </div>
 );
}
