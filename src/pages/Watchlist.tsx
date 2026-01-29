import { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { PlusCircle, Bookmark } from 'lucide-react';
import type { Stock } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { 
 Button, Input, ActionModal, PageHeader, Badge 
} from '../components/ui';
import { StockList } from '../components/StockList';

export default function Watchlist() {
 const { data, actions } = useApp();
 const { stocks, memos } = data;

 const watchlistStocks = stocks.filter(s => s.status === 'WATCHLIST');
  const activeResearchCount = watchlistStocks.filter(s => memos.some(m => m.stockId === s.id)).length;
  const totalMemos = memos.filter(m => watchlistStocks.some(s => s.id === m.stockId)).length;

 const [isModalOpen, setIsModalOpen] = useState(false);
 const [newStockName, setNewStockName] = useState('');
 const [newStockSymbol, setNewStockSymbol] = useState('');

 const handleAddStock = async (e: React.FormEvent) => {
 e.preventDefault();
 if (!newStockName.trim()) return;

 const stock: Stock = {
  id: uuidv4(),
  name: newStockName.trim(),
  symbol: newStockSymbol.trim() || null,
  status: 'WATCHLIST',
  accountId: null,
  quantity: 0,
  avgPrice: 0,
  createdAt: Date.now(),
  updatedAt: Date.now(),
 };

 await actions.saveStock(stock);
 setNewStockName('');
 setNewStockSymbol('');
 setIsModalOpen(false);
 };


 return (
 <div className="space-y-10 animate-fade-in max-w-6xl mx-auto">
  <PageHeader 
    title="관심 종목"
    subtitle="Watchlist"
    description="정찰 중인 종목과 리서치 자료를 관리하며 매수 기회를 포착합니다."
    extra={
      <div className="text-right">
        <div className="text-sm font-black text-gray-500 uppercase tracking-[0.2em] mb-1">관심 리서치 기록</div>
        <div className="text-4xl font-black text-white tracking-tighter tabular-nums">
          {totalMemos}<span className="text-xl ml-1 text-gray-600">건</span>
        </div>
      </div>
    }
  />

  {/* 관심 종목 요약 섹션 */}
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    <div className="bg-gray-900/40 border border-gray-800 p-8 rounded-[2rem] flex items-center justify-between group">
      <div>
        <div className="text-[10px] font-black text-gray-600 uppercase tracking-[0.2em] mb-2">전체 관심 종목</div>
        <div className="text-3xl font-black text-white tabular-nums tracking-tighter">
          {watchlistStocks.length}<span className="text-lg ml-1 text-gray-600 font-bold group-hover:text-primary-500 transition-colors">종목</span>
        </div>
      </div>
      <Button onClick={() => setIsModalOpen(true)} className="rounded-2xl h-12 px-6 font-bold shadow-lg shadow-primary-500/10 transition-all hover:scale-105 active:scale-95">
        <PlusCircle size={20} className="mr-2" />
        종목 추가
      </Button>
    </div>
    
    <div className="bg-primary-500/5 border border-primary-500/10 p-8 rounded-[2rem] group">
      <div className="flex justify-between items-start mb-2">
        <div className="text-[10px] font-black text-primary-500 uppercase tracking-[0.2em]">액티브 리서치</div>
        <Badge variant="info" className="text-[10px] font-black px-2 py-0.5 rounded-lg">
          {watchlistStocks.length > 0 ? ((activeResearchCount / watchlistStocks.length) * 100).toFixed(0) : 0}% 분석중
        </Badge>
      </div>
      <div className="text-3xl font-black text-white tabular-nums tracking-tighter leading-none">
        {activeResearchCount}<span className="text-lg ml-1 text-gray-600 font-bold group-hover:text-primary-500 transition-colors">종합</span>
      </div>
    </div>
  </div>

   <StockList 
     title="관심 종목 리스트"
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
  </div>
  </ActionModal>
 </div>
 );
}
