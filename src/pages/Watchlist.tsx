import { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { PlusCircle, Search, Bookmark, ChevronRight, FileText, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Stock } from '../types';
import { v4 as uuidv4 } from 'uuid';

export default function Watchlist() {
  const { data, actions } = useApp();
  const { stocks, memos } = data;

  const watchlistStocks = stocks.filter(s => s.status === 'WATCHLIST');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newStockName, setNewStockName] = useState('');
  const [newStockSymbol, setNewStockSymbol] = useState('');

  const handleAddStock = (e: React.FormEvent) => {
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

    actions.saveStock(stock);
    setNewStockName('');
    setNewStockSymbol('');
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2">관심 종목</h1>
          <p className="text-slate-400">정찰 중인 종목과 리서치 자료를 관리합니다.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl font-semibold transition-all shadow-lg shadow-blue-600/20 active:scale-95"
        >
          <PlusCircle size={20} />
          <span>관심 종목 추가</span>
        </button>
      </header>

      {/* Search Bar (Placeholder for now) */}
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-blue-500 transition-colors">
          <Search size={20} />
        </div>
        <input 
          type="text" 
          placeholder="저장된 관심 종목 검색..." 
          className="w-full bg-slate-900/50 border border-slate-800 focus:border-blue-600/50 focus:ring-4 focus:ring-blue-600/10 rounded-2xl pl-12 pr-4 py-4 text-white focus:outline-none transition-all placeholder:text-slate-700"
        />
      </div>

      {/* Watchlist Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {watchlistStocks.length > 0 ? (
          watchlistStocks.map((stock) => {
            const stockMemos = memos.filter(m => m.stockId === stock.id);
            return (
              <Link 
                key={stock.id} 
                to={`/stocks/${stock.id}`}
                className="group bg-slate-900 border border-slate-800 p-6 rounded-2xl hover:border-slate-700 transition-all hover:shadow-xl hover:shadow-blue-500/5"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="p-2 bg-amber-600/10 text-amber-500 rounded-lg">
                    <Bookmark size={20} />
                  </div>
                  <ChevronRight size={18} className="text-slate-700 group-hover:text-slate-400 transition-colors" />
                </div>
                
                <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors mb-1">{stock.name}</h3>
                <div className="text-sm text-slate-500 mb-6 font-mono">{stock.symbol || 'No code'}</div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-800/50">
                  <div className="flex items-center space-x-2 text-slate-400">
                    <FileText size={14} />
                    <span className="text-xs">{stockMemos.length}개의 노트</span>
                  </div>
                  <span className="text-[10px] text-slate-600">
                    {new Date(stock.createdAt).toLocaleDateString()} 등록
                  </span>
                </div>
              </Link>
            );
          })
        ) : (
          <div className="col-span-full bg-slate-900/50 border border-dashed border-slate-800 p-20 rounded-3xl text-center">
            <div className="inline-flex p-6 bg-slate-800/80 rounded-full text-slate-600 mb-6">
              <Bookmark size={48} />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">관심 종목이 비어 있습니다.</h3>
            <p className="text-slate-500 max-w-sm mx-auto mb-8">
              매수하고 싶거나 리서치가 필요한 종목을 추가해 보세요. 투자 판단을 기록하는 첫 걸음입니다.
            </p>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-2xl font-bold transition-all active:scale-95"
            >
              <PlusCircle size={20} />
              <span>종목 추가하기</span>
            </button>
          </div>
        )}
      </div>

      {/* Add Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-6 border-b border-slate-800">
              <h2 className="text-xl font-bold text-white">관심 종목 추가</h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddStock} className="p-6 space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-400 ml-1">종목명</label>
                <input 
                  type="text" 
                  value={newStockName}
                  onChange={(e) => setNewStockName(e.target.value)}
                  placeholder="예: 삼성전자, 엔비디아"
                  autoFocus
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all placeholder:text-slate-700"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-400 ml-1">종목코드 (선택)</label>
                <input 
                  type="text" 
                  value={newStockSymbol}
                  onChange={(e) => setNewStockSymbol(e.target.value)}
                  placeholder="예: 005930, NVDA"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all placeholder:text-slate-700"
                />
              </div>

              <div className="pt-4 flex gap-3">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-semibold transition-colors"
                >
                  취소
                </button>
                <button 
                  type="submit" 
                  className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-semibold transition-all shadow-lg shadow-blue-600/20 active:scale-95"
                >
                  관심 종목 추가
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
