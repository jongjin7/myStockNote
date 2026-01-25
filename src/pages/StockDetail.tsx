import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { 
  ArrowLeft, Pencil, Trash2, FileText, Plus, 
  ChevronRight, Calendar, Bookmark, Activity, 
  TrendingUp, CheckCircle2, AlertCircle, X,
  ExternalLink
} from 'lucide-react';
import type { Stock, StockMemo, Account } from '../types';

export default function StockDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data, actions } = useApp();
  const { stocks, accounts, memos } = data;

  const stock = stocks.find(s => s.id === id);
  const stockMemos = memos.filter(m => m.stockId === id).sort((a, b) => b.updatedAt - a.updatedAt);
  const account = accounts.find(a => a.id === stock?.accountId);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  
  // Edit Form States
  const [name, setName] = useState(stock?.name || '');
  const [symbol, setSymbol] = useState(stock?.symbol || '');
  const [status, setStatus] = useState(stock?.status || 'HOLDING');
  const [accountId, setAccountId] = useState(stock?.accountId || '');
  const [quantity, setQuantity] = useState(stock?.quantity || 0);
  const [avgPrice, setAvgPrice] = useState(stock?.avgPrice || 0);

  if (!stock) {
    return (
      <div className="flex flex-col items-center justify-center p-20 text-center">
        <AlertCircle size={64} className="text-slate-700 mb-6" />
        <h2 className="text-2xl font-bold text-white mb-2">종목을 찾을 수 없습니다.</h2>
        <p className="text-slate-500 mb-8">해당 종목이 존재하지 않거나 삭제되었습니다.</p>
        <Link to="/" className="text-blue-500 hover:underline">대시보드로 돌아가기</Link>
      </div>
    );
  }

  const handleUpdateStock = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedStock: Stock = {
      ...stock,
      name,
      symbol: symbol || null,
      status: status as any,
      accountId: status === 'WATCHLIST' ? null : (accountId || null),
      quantity: status === 'WATCHLIST' ? 0 : quantity,
      avgPrice: status === 'WATCHLIST' ? 0 : avgPrice,
      updatedAt: Date.now(),
    };
    actions.saveStock(updatedStock);
    setIsEditModalOpen(false);
  };

  const handleDelete = () => {
    if (window.confirm('정말 삭제하시겠습니까? 관련 모든 노트와 첨부파일이 영구적으로 삭제됩니다.')) {
      actions.deleteStock(stock.id);
      navigate('/');
    }
  };

  const getStatusColor = (s: string) => {
    switch (s) {
      case 'HOLDING': return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
      case 'WATCHLIST': return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
      case 'PARTIAL_SOLD': return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
      case 'SOLD': return 'text-slate-500 bg-slate-500/10 border-slate-500/20';
      default: return 'text-slate-500 bg-slate-500/10 border-slate-500/20';
    }
  };

  const getStatusLabel = (s: string) => {
    switch (s) {
      case 'HOLDING': return '보유 중';
      case 'WATCHLIST': return '관심 종목';
      case 'PARTIAL_SOLD': return '일부 매도';
      case 'SOLD': return '전량 매도';
      default: return s;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col space-y-4">
        <button 
          onClick={() => navigate(-1)}
          className="inline-flex items-center text-slate-400 hover:text-white transition-colors w-fit group"
        >
          <ArrowLeft size={18} className="mr-2 group-hover:-translate-x-1 transition-transform" />
          <span>뒤로 가기</span>
        </button>
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <h1 className="text-4xl font-extrabold tracking-tight text-white">{stock.name}</h1>
              <div className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(stock.status)}`}>
                {getStatusLabel(stock.status)}
              </div>
            </div>
            <div className="flex items-center space-x-4 text-slate-400">
              {stock.symbol && (
                <span className="font-mono bg-slate-900 border border-slate-800 px-2 py-0.5 rounded text-sm">
                  {stock.symbol}
                </span>
              )}
              {account && (
                <div className="flex items-center space-x-1.5">
                  <Activity size={14} />
                  <span className="text-sm font-medium">{account.brokerName}</span>
                </div>
              )}
              <div className="flex items-center space-x-1.5">
                <Calendar size={14} />
                <span className="text-sm">{new Date(stock.createdAt).toLocaleDateString()} 등록</span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button 
              onClick={() => setIsEditModalOpen(true)}
              className="p-3 bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 rounded-2xl transition-all"
            >
              <Pencil size={20} />
            </button>
            <button 
              onClick={handleDelete}
              className="p-3 bg-slate-900 border border-slate-800 text-slate-400 hover:text-red-400 hover:border-red-500/30 rounded-2xl transition-all"
            >
              <Trash2 size={20} />
            </button>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Stats & Actions */}
        <div className="space-y-6">
          {stock.status !== 'WATCHLIST' && (
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-sm">
              <h3 className="text-sm font-semibold text-slate-500 mb-6 flex items-center">
                <TrendingUp size={16} className="mr-2 text-emerald-500" />
                보유 현황
              </h3>
              <div className="space-y-6">
                <div className="flex justify-between items-end">
                  <span className="text-slate-400 text-sm">보유 수량</span>
                  <span className="text-2xl font-bold text-white">
                    {stock.quantity.toLocaleString()} <span className="text-sm font-normal text-slate-500">주</span>
                  </span>
                </div>
                <div className="flex justify-between items-end">
                  <span className="text-slate-400 text-sm">평균 단가</span>
                  <span className="text-2xl font-bold text-white">
                    {stock.avgPrice.toLocaleString()} <span className="text-sm font-normal text-slate-500">원</span>
                  </span>
                </div>
                <div className="pt-6 border-t border-slate-800">
                  <div className="flex justify-between items-end">
                    <span className="text-slate-400 text-sm font-medium">총 매수 금액</span>
                    <span className="font-bold text-lg text-white">
                      {(stock.quantity * stock.avgPrice).toLocaleString()} 원
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="bg-blue-600/5 border border-blue-500/10 p-6 rounded-3xl space-y-4">
            <h3 className="text-sm font-semibold text-blue-400 flex items-center uppercase tracking-wider">
              <Bookmark size={14} className="mr-2" />
              Quick Actions
            </h3>
            <div className="grid grid-cols-1 gap-3">
              <Link 
                to={`/stocks/${stock.id}/memos/new`}
                className="flex items-center justify-between p-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl transition-all font-bold shadow-lg shadow-blue-600/20 active:scale-[0.98]"
              >
                <span>새 투자 노트 작성</span>
                <Plus size={20} />
              </Link>
              {stock.status === 'WATCHLIST' && (
                <button 
                  onClick={() => setIsEditModalOpen(true)}
                  className="flex items-center justify-between p-4 bg-slate-900 border border-slate-800 text-white hover:bg-slate-800 rounded-2xl transition-all font-bold"
                >
                  <span>매수로 전환하기</span>
                  <ExternalLink size={18} />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Notes History */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-xl font-bold text-white flex items-center">
              <FileText size={20} className="mr-2 text-blue-500" />
              투자 노트 기록
              <span className="ml-3 text-xs font-normal text-slate-500 bg-slate-800 px-2 py-1 rounded-full">
                총 {stockMemos.length}건
              </span>
            </h2>
          </div>

          <div className="space-y-4 relative">
            {stockMemos.length > 0 && (
              <div className="absolute left-6 top-10 bottom-10 w-px bg-slate-800" />
            )}

            {stockMemos.length > 0 ? (
              stockMemos.map((memo) => (
                <div key={memo.id} className="relative pl-14 pb-8 group">
                  <div className="absolute left-4 top-2 w-4 h-4 rounded-full bg-slate-900 border-2 border-slate-700 group-hover:border-blue-500 group-hover:bg-blue-600 transition-all z-10" />
                  
                  <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 group-hover:border-slate-700 transition-all hover:shadow-lg">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                          memo.type === 'PURCHASE' ? 'text-blue-400 border-blue-400/30 bg-blue-400/5' : 
                          memo.type === 'SELL' ? 'text-red-400 border-red-400/30 bg-red-400/5' : 
                          'text-slate-400 border-slate-400/30 bg-slate-400/5'
                        }`}>
                          {memo.type === 'PURCHASE' ? '매수 기록' : memo.type === 'SELL' ? '매도 기록' : '일반 메모'}
                        </span>
                        <span className="text-xs text-slate-500">
                          {new Date(memo.updatedAt).toLocaleDateString()} {new Date(memo.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <Link 
                        to={`/memos/${memo.id}/edit`}
                        className="p-2 text-slate-600 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                      >
                        <Pencil size={14} />
                      </Link>
                    </div>

                    <div className="space-y-4">
                      {memo.buyReason && (
                        <div>
                          <p className="text-sm font-semibold text-slate-100 mb-1">매수 이유</p>
                          <p className="text-sm text-slate-400 line-clamp-3 leading-relaxed">{memo.buyReason}</p>
                        </div>
                      )}
                      {memo.currentThought && (
                        <div className="bg-slate-950/50 p-4 rounded-2xl border border-slate-800/50">
                          <p className="text-xs font-bold text-blue-500 uppercase tracking-tight mb-2">Current Thought</p>
                          <p className="text-sm text-slate-300 italic">"{memo.currentThought}"</p>
                        </div>
                      )}
                      {!memo.buyReason && !memo.currentThought && (
                        <p className="text-sm text-slate-600 italic">내용이 비어 있는 노트입니다.</p>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-slate-900/5 border border-dashed border-slate-800 p-20 rounded-3xl text-center">
                <FileText size={40} className="mx-auto text-slate-800 mb-4" />
                <p className="text-slate-500 mb-6">아직 작성된 투자 노트가 없습니다.</p>
                <Link 
                  to={`/stocks/${stock.id}/memos/new`}
                  className="inline-flex items-center text-blue-500 font-bold hover:underline"
                >
                  첫 투자 판단 기록하기 <ChevronRight size={16} className="ml-1" />
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between p-6 border-b border-slate-800 sticky top-0 bg-slate-900 z-10">
              <h2 className="text-xl font-bold text-white">종목 정보 수정</h2>
              <button 
                onClick={() => setIsEditModalOpen(false)}
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleUpdateStock} className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2 col-span-2 md:col-span-1">
                  <label className="text-sm font-medium text-slate-400 ml-1">종목명</label>
                  <input 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all placeholder:text-slate-700"
                  />
                </div>
                <div className="space-y-2 col-span-2 md:col-span-1">
                  <label className="text-sm font-medium text-slate-400 ml-1">종목코드 (선택)</label>
                  <input 
                    type="text" 
                    value={symbol}
                    onChange={(e) => setSymbol(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all placeholder:text-slate-700"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-400 ml-1">상태</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {['HOLDING', 'WATCHLIST', 'PARTIAL_SOLD', 'SOLD'].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setStatus(s as any)}
                      className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all ${
                        status === s 
                          ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-600/20' 
                          : 'bg-slate-950 border-slate-800 text-slate-500 hover:border-slate-700'
                      }`}
                    >
                      {getStatusLabel(s)}
                    </button>
                  ))}
                </div>
              </div>

              {status !== 'WATCHLIST' && (
                <>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-400 ml-1">연결 계좌</label>
                    <select 
                      value={accountId}
                      onChange={(e) => setAccountId(e.target.value)}
                      required
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all appearance-none"
                    >
                      <option value="">계좌 선택 (필수)</option>
                      {accounts.map(a => (
                        <option key={a.id} value={a.id}>{a.brokerName}</option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-400 ml-1">보유 수량</label>
                      <input 
                        type="number" 
                        value={quantity}
                        onChange={(e) => setQuantity(Number(e.target.value))}
                        min="1"
                        required
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-400 ml-1">평균 단가 (원)</label>
                      <input 
                        type="number" 
                        value={avgPrice}
                        onChange={(e) => setAvgPrice(Number(e.target.value))}
                        min="1"
                        required
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
                      />
                    </div>
                  </div>
                </>
              )}

              <div className="pt-4 flex gap-3 sticky bottom-0 bg-slate-900 mt-4">
                <button 
                  type="button" 
                  onClick={() => setIsEditModalOpen(false)}
                  className="flex-1 px-4 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-semibold transition-colors"
                >
                  취소
                </button>
                <button 
                  type="submit" 
                  className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-semibold transition-all shadow-lg shadow-blue-600/20 active:scale-95"
                >
                  정보 업데이트
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
