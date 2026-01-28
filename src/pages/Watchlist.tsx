import { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { PlusCircle, Search, Bookmark, ChevronRight, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Stock } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { 
  Card,
  Button, Input, ActionModal 
} from '../components/ui';
import { formatDate } from '../lib/utils';

export default function Watchlist() {
  const { data, actions } = useApp();
  const { stocks, memos } = data;

  const watchlistStocks = stocks.filter(s => s.status === 'WATCHLIST');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newStockName, setNewStockName] = useState('');
  const [newStockSymbol, setNewStockSymbol] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredStocks = watchlistStocks.filter(stock => 
    stock.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (stock.symbol && stock.symbol.toLowerCase().includes(searchQuery.toLowerCase()))
  );

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
    <div className="space-y-10 animate-fade-in">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-white mb-2">관심 종목</h1>
          <p className="text-sm font-medium text-gray-400">정찰 중인 종목과 리서치 자료를 관리합니다.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="shadow-lg shadow-primary-500/10">
          <PlusCircle size={20} className="mr-2" />
          <span>관심 종목 추가</span>
        </Button>
      </header>

      {/* Search Bar */}
      <div className="relative group max-w-2xl">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-primary-500 transition-colors">
          <Search size={22} />
        </div>
        <input 
          type="text" 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="종목명 또는 심볼 검색..." 
          className="w-full bg-gray-900/40 border border-gray-800 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 rounded-2xl pl-12 pr-4 py-4 text-white focus:outline-none transition-all placeholder:text-gray-700 backdrop-blur-sm"
        />
      </div>

      {/* Watchlist Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStocks.length > 0 ? (
          filteredStocks.map((stock) => {
            const stockMemos = memos.filter(m => m.stockId === stock.id);
            return (
              <Link key={stock.id} to={`/stocks/${stock.id}`}>
                <Card interactive className="p-8 border-gray-800 bg-gray-900/40 backdrop-blur-sm group hover:border-info/50 shadow-lg">
                  <div className="flex items-start justify-between mb-8">
                    <div className="p-3 bg-info/10 text-info rounded-xl group-hover:bg-info/20 transition-colors">
                      <Bookmark size={24} />
                    </div>
                    <ChevronRight size={20} className="text-gray-700 group-hover:text-white group-hover:translate-x-1 transition-all" />
                  </div>
                  
                  <div className="mb-8">
                    <h3 className="text-2xl font-bold text-white group-hover:text-info transition-colors mb-2 tracking-tight">{stock.name}</h3>
                    <div className="text-sm font-mono text-gray-500 bg-gray-950/50 px-2 py-1 rounded inline-block border border-gray-800/50 uppercase tracking-widest">{stock.symbol || 'NO CODE'}</div>
                  </div>

                  <div className="flex items-center justify-between pt-6 border-t border-gray-800/50">
                    <div className="flex items-center gap-2 text-gray-400 group-hover:text-info/80 transition-colors">
                      <FileText size={16} />
                      <span className="text-xs font-bold">{stockMemos.length}개의 리서치 노트</span>
                    </div>
                    <span className="text-[10px] font-mono text-gray-600">
                      {formatDate(new Date(stock.createdAt))} 등록
                    </span>
                  </div>
                </Card>
              </Link>
            );
          })
        ) : (
          <div className="col-span-full bg-gray-900/20 border border-dashed border-gray-800 p-20 rounded-3xl text-center">
            <div className="inline-flex p-6 bg-gray-900/50 rounded-full text-gray-700 mb-6">
              <Bookmark size={64} />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">관심 종목이 비어 있습니다.</h3>
            <p className="text-gray-600 max-w-sm mx-auto mb-10 text-sm font-medium leading-relaxed">
              매수하고 싶거나 리서치가 필요한 종목을 추가해 보세요. 투자 판단을 기록하는 첫 걸음입니다.
            </p>
            <Button onClick={() => setIsModalOpen(true)} size="lg">
              <PlusCircle size={20} className="mr-2" />
              <span>종목 추가하기</span>
            </Button>
          </div>
        )}
      </div>

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
