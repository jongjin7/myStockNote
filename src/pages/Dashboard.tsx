import { useApp } from '../contexts/AppContext';
import { 
  TrendingUp, FileText, PlusCircle, 
  ChevronRight, ArrowRight, Clock, Target, ShieldCheck
} from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Account, Stock, StockMemo } from '../types';

export default function Dashboard() {
  const { data } = useApp();
  const { accounts, stocks, memos } = data;

  const totalCash = accounts.reduce((acc: number, curr: Account) => acc + (Number(curr.cashBalance) || 0), 0);
  const holdingStocks = stocks.filter((s: Stock) => s.status === 'HOLDING' || s.status === 'PARTIAL_SOLD');
  const totalInvested = holdingStocks.reduce((acc, curr) => acc + ((Number(curr.quantity) || 0) * (Number(curr.avgPrice) || 0)), 0);
  
  const recentMemos = [...memos].sort((a: StockMemo, b: StockMemo) => b.updatedAt - a.updatedAt).slice(0, 3);
  const watchlistCount = stocks.filter(s => s.status === 'WATCHLIST').length;

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight leading-tight text-white mb-2">대시보드</h1>
          <p className="text-sm font-medium text-slate-400 leading-relaxed">투자 판단의 복기가 더 나은 결정으로 이어집니다.</p>
        </div>
        <div className="flex items-center space-x-2 text-xs font-bold text-slate-500 bg-slate-900 border border-slate-800 px-4 py-2 rounded-full">
          <Clock size={14} className="text-blue-500" />
          <span>마지막 업데이트: {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
        </div>
      </header>

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Assets Card */}
        <div className="col-span-1 md:col-span-2 bg-gradient-to-br from-blue-600 to-indigo-700 p-8 rounded-[2.5rem] shadow-2xl shadow-blue-600/20 relative overflow-hidden group">
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
          <div className="relative z-10 flex flex-col h-full justify-between">
            <div>
              <div className="flex items-center space-x-2 text-blue-100/70 font-semibold text-xs mb-4 uppercase tracking-wider">
                <ShieldCheck size={16} />
                <span>총 관리 자산</span>
              </div>
              <div className="text-4xl md:text-5xl font-black text-white leading-none tracking-tight">
                {(totalCash + totalInvested).toLocaleString()} <span className="text-xl font-semibold opacity-70">원</span>
              </div>
            </div>
            <div className="flex items-center space-x-6 mt-8 pt-6 border-t border-white/10">
              <div className="flex flex-col">
                <span className="text-[10px] text-blue-100/60 font-semibold uppercase mb-1 tracking-wide">총 예수금</span>
                <span className="text-lg font-bold text-white tracking-tight">{totalCash.toLocaleString()}원</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] text-blue-100/60 font-semibold uppercase mb-1 tracking-wide">총 매수 금액</span>
                <span className="text-lg font-bold text-white tracking-tight">{totalInvested.toLocaleString()}원</span>
              </div>
            </div>
          </div>
        </div>

        {/* Holding Count Card */}
        <div className="bg-slate-900 border border-slate-800 p-8 rounded-[2.5rem] flex flex-col justify-between hover:border-slate-700 transition-all group">
          <div className="flex items-center justify-between mb-8">
            <div className="p-4 bg-emerald-500/10 text-emerald-500 rounded-2xl group-hover:scale-110 transition-transform">
              <TrendingUp size={28} />
            </div>
            <span className="text-xs font-extrabold text-slate-500 tracking-tight uppercase">Holdings</span>
          </div>
          <div>
            <div className="text-4xl font-black text-white mb-2 leading-none tracking-tight">
              {holdingStocks.length} <span className="text-lg font-medium text-slate-500">개</span>
            </div>
            <p className="text-xs text-slate-500 font-medium">현재 운용 중인 활성 종목</p>
          </div>
        </div>

        {/* Note Count Card */}
        <div className="bg-slate-900 border border-slate-800 p-8 rounded-[2.5rem] flex flex-col justify-between hover:border-slate-700 transition-all group">
          <div className="flex items-center justify-between mb-8">
            <div className="p-4 bg-amber-500/10 text-amber-500 rounded-2xl group-hover:scale-110 transition-transform">
              <FileText size={28} />
            </div>
            <span className="text-xs font-extrabold text-slate-500 tracking-tight uppercase">Notes</span>
          </div>
          <div>
            <div className="text-4xl font-black text-white mb-2 leading-none tracking-tight">
              {memos.length} <span className="text-lg font-medium text-slate-500">개</span>
            </div>
            <p className="text-xs text-slate-500 font-medium">기록된 매수/매도/일반 노트</p>
          </div>
        </div>
      </div>
      {/* Accounts Overview */}
      {accounts.length > 0 && (
        <div className="flex flex-wrap gap-3">
          {accounts.map(acc => (
            <div key={acc.id} className="bg-slate-900/40 border border-slate-800/50 px-4 py-2 rounded-2xl flex items-center space-x-3">
              <div className="w-2 h-2 rounded-full bg-blue-500" />
              <span className="text-xs font-bold text-slate-400">{acc.brokerName}</span>
              <span className="text-xs font-black text-white">{acc.cashBalance.toLocaleString()}원</span>
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
        {/* Holding Stocks Section */}
        <section className="lg:col-span-3 space-y-6">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center space-x-3">
              <h2 className="text-2xl font-bold text-white tracking-tight">보유 종목</h2>
              <span className="text-[10px] font-black bg-slate-800 text-slate-400 px-2.5 py-1 rounded-full">{holdingStocks.length}</span>
            </div>
            <Link to="/watchlist" className="group text-sm font-bold text-blue-500 hover:text-blue-400 flex items-center transition-colors">
              관심 종목 {watchlistCount}개
              <ChevronRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 gap-4">
            {holdingStocks.length > 0 ? (
              holdingStocks.map((stock) => {
                const stockMemos = memos.filter(m => m.stockId === stock.id);
                const hasNote = stockMemos.length > 0;
                
                return (
                  <Link 
                    key={stock.id} 
                    to={`/stocks/${stock.id}`}
                    className="bg-slate-900 border border-slate-800 p-5 rounded-3xl hover:border-slate-700 hover:bg-slate-800/20 transition-all group flex items-center"
                  >
                    <div className="p-4 bg-slate-950 rounded-2xl mr-5 border border-slate-800">
                      <Target size={24} className={hasNote ? "text-blue-500" : "text-slate-700"} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-bold text-lg text-white group-hover:text-blue-400 transition-colors">{stock.name}</span>
                        {stock.symbol && <span className="text-[10px] font-mono text-slate-600 bg-slate-950 px-1.5 py-0.5 rounded uppercase tracking-tighter">{stock.symbol}</span>}
                      </div>
                      <div className="text-xs text-slate-500 font-medium">
                        {stock.quantity.toLocaleString()}주 <span className="text-slate-800 mx-1.5">•</span> {stock.avgPrice.toLocaleString()}원
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <div className="flex -space-x-1.5">
                        {[...Array(Math.min(stockMemos.length, 3))].map((_, i) => (
                          <div key={i} className="w-5 h-5 rounded-full bg-slate-800 border-2 border-slate-900 overflow-hidden">
                            <div className="w-full h-full bg-blue-500/20 flex items-center justify-center">
                              <FileText size={8} className="text-blue-500" />
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                        hasNote ? 'bg-blue-600/10 text-blue-500' : 'bg-amber-600/10 text-amber-500'
                      }`}>
                        {hasNote ? `${stockMemos.length} Notes` : 'Note Required'}
                      </div>
                    </div>
                  </Link>
                );
              })
            ) : (
              <div className="bg-slate-900/50 border border-dashed border-slate-800 rounded-[2.5rem] p-16 text-center">
                <div className="mb-6 inline-flex p-6 bg-slate-800/50 rounded-full text-slate-700">
                  <PlusCircle size={48} />
                </div>
                <h3 className="text-xl font-bold text-slate-400 mb-2">보유 중인 종목이 없습니다.</h3>
                <p className="text-slate-600 mb-8 max-w-xs mx-auto">계좌를 먼저 등록하신 후, 보유 중인 주식 종목을 추가해 보세요.</p>
                <Link 
                  to="/accounts" 
                  className="inline-flex items-center space-x-3 bg-slate-100 hover:bg-white text-slate-950 px-8 py-4 rounded-2xl font-black transition-all shadow-xl active:scale-95"
                >
                  <PlusCircle size={20} />
                  <span>첫 종목 추가하기</span>
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* Recent Memos Section */}
        <section className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-2xl font-bold text-white tracking-tight">최근 투자 노트</h2>
          </div>

          <div className="space-y-4">
            {recentMemos.length > 0 ? (
              recentMemos.map((memo) => {
                const stock = stocks.find(s => s.id === memo.stockId);
                return (
                  <Link 
                    key={memo.id}
                    to={`/stocks/${stock?.id}`}
                    className="block bg-slate-900 border border-slate-800 rounded-3xl p-6 hover:border-slate-700 transition-all relative overflow-hidden group"
                  >
                    <div className="absolute top-0 right-0 w-16 h-16 bg-blue-600/5 -mr-4 -mt-4 rounded-full blur-xl group-hover:bg-blue-600/10 transition-colors" />
                    <div className="flex items-center justify-between mb-4 relative z-10">
                      <span className="text-sm font-black text-blue-500 tracking-tight">{stock?.name}</span>
                      <span className="text-[10px] font-bold text-slate-600 bg-slate-950 px-2 py-1 rounded-lg">
                        {new Date(memo.updatedAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-slate-400 font-medium leading-relaxed italic line-clamp-3 mb-4">
                      "{memo.buyReason || memo.currentThought || '기록된 내용이 없습니다.'}"
                    </p>
                    <div className="flex items-center text-[10px] font-black text-slate-500 group-hover:text-white transition-colors">
                      <span>노트 상세 보기</span>
                      <ArrowRight size={10} className="ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>
                );
              })
            ) : (
              <div className="bg-slate-900/30 border border-dashed border-slate-800 rounded-3xl p-16 text-center">
                <p className="text-slate-600 text-sm font-bold italic">아직 기록이 없습니다.</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
