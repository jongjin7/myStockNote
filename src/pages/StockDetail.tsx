import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { 
  ArrowLeft, Pencil, Trash2, FileText, Plus, 
  ChevronRight, Calendar, Bookmark, Activity, 
  TrendingUp, AlertCircle,
  ExternalLink
} from 'lucide-react';
import type { Stock } from '../types';
import { 
  Card, CardTitle, CardDescription,
  Button, Input, Modal, ModalBody, ModalFooter, Badge 
} from '../components/ui';
import { cn, formatCurrency, formatDate, formatDateTime } from '../lib/utils';

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
  const [currentPrice, setCurrentPrice] = useState(stock?.currentPrice || stock?.avgPrice || 0);

  if (!stock) {
    return (
      <Card className="flex flex-col items-center justify-center p-20 text-center border-dashed border-gray-800 bg-gray-900/10">
        <AlertCircle size={64} className="text-gray-700 mb-6" />
        <CardTitle className="text-2xl font-bold text-white mb-2">종목을 찾을 수 없습니다.</CardTitle>
        <CardDescription className="text-gray-500 mb-8">해당 종목이 존재하지 않거나 삭제되었습니다.</CardDescription>
        <Link to="/">
          <Button variant="ghost" className="text-primary-500">대시보드로 돌아가기</Button>
        </Link>
      </Card>
    );
  }

  const handleUpdateStock = async (e: React.FormEvent) => {
    e.preventDefault();
    const updatedStock: Stock = {
      ...stock,
      name,
      symbol: symbol || null,
      status: status as any,
      accountId: status === 'WATCHLIST' ? null : (accountId || null),
      quantity: status === 'WATCHLIST' ? 0 : quantity,
      avgPrice: status === 'WATCHLIST' ? 0 : avgPrice,
      currentPrice: status === 'WATCHLIST' ? 0 : currentPrice,
      updatedAt: Date.now(),
    };
    await actions.saveStock(updatedStock);
    setIsEditModalOpen(false);
  };


  const handleDelete = async () => {
    if (window.confirm('정말 삭제하시겠습니까? 관련 모든 노트와 첨부파일이 영구적으로 삭제됩니다.')) {
      await actions.deleteStock(stock.id);
      navigate('/');
    }
  };


  const getHeroCardBg = (s: string) => {
    switch (s) {
      case 'HOLDING': return 'from-success-dark/80 to-success/60';
      case 'WATCHLIST': return 'from-info-dark/80 to-info/60';
      case 'PARTIAL_SOLD': return 'from-primary-700/80 to-primary-500/60';
      case 'SOLD': return 'from-gray-700 to-gray-500';
      default: return 'from-gray-800 to-gray-600';
    }
  };

  return (
    <div className="space-y-10 animate-fade-in">
      <header className="flex flex-col space-y-6">
        <button 
          onClick={() => navigate(-1)}
          className="inline-flex items-center text-gray-500 hover:text-white transition-colors w-fit group"
        >
          <ArrowLeft size={18} className="mr-2 group-hover:-translate-x-1 transition-transform" />
          <span className="font-bold text-sm">목록으로 돌아가기</span>
        </button>
        
        <div className="bg-gradient-to-br p-8 rounded-2xl shadow-xl relative overflow-hidden group">
          {/* Decorative Elements */}
          <div className={cn(
            "absolute inset-0 bg-gradient-to-br transition-all duration-500",
            getHeroCardBg(stock.status)
          )} />
          <div className="absolute -right-20 -top-20 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <h1 className="text-4xl font-bold tracking-tight text-white">{stock.name}</h1>
                <Badge status={stock.status} className="bg-white/20 text-white border-white/10" />
              </div>
              <div className="flex flex-wrap items-center gap-6 text-white/70">
                {stock.symbol && (
                  <span className="font-mono bg-black/20 border border-white/10 px-2.5 py-1 rounded text-sm font-bold tracking-widest">
                    {stock.symbol}
                  </span>
                )}
                {account && (
                  <div className="flex items-center gap-2">
                    <Activity size={16} />
                    <span className="text-sm font-bold">{account.brokerName}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Calendar size={16} />
                  <span className="text-sm font-bold">{formatDate(new Date(stock.createdAt))} 등록</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button 
                variant="ghost" 
                onClick={() => setIsEditModalOpen(true)}
                className="bg-white/10 hover:bg-white/20 text-white border-white/20"
              >
                <Pencil size={20} />
              </Button>
              <Button 
                variant="ghost" 
                onClick={handleDelete}
                className="bg-white/10 hover:bg-danger/40 text-white border-white/20"
              >
                <Trash2 size={20} />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left Column: Stats & Actions */}
        <div className="space-y-8">
          {stock.status !== 'WATCHLIST' && (
            <Card className="border-gray-800 bg-gray-900/40 backdrop-blur-sm p-8">
              <h3 className="text-xs font-bold text-gray-500 mb-8 flex items-center uppercase tracking-widest">
                <TrendingUp size={16} className="mr-2 text-success" />
                보유 현황
              </h3>
              <div className="space-y-8">
                <div className="flex justify-between items-end">
                  <span className="text-gray-500 text-sm font-bold uppercase tracking-widest">보유 수량</span>
                  <span className="text-3xl font-bold text-white tracking-tight">
                    {stock.quantity.toLocaleString()} <span className="text-sm font-medium text-gray-500">주</span>
                  </span>
                </div>
                <div className="flex justify-between items-end">
                  <span className="text-gray-500 text-sm font-bold uppercase tracking-widest">평균 단가</span>
                  <span className="text-3xl font-bold text-white tracking-tight">
                    {formatCurrency(stock.avgPrice)}
                  </span>
                </div>
                <div className="pt-8 border-t border-gray-800">
                  <div className="flex justify-between items-end">
                    <span className="text-gray-500 text-sm font-bold uppercase tracking-widest">총 매수 금액</span>
                    <span className="font-bold text-xl text-primary-400">
                      {formatCurrency(stock.quantity * stock.avgPrice)}
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          )}

          <Card className="border-primary-500/10 bg-primary-500/5 p-8 space-y-6">
            <h3 className="text-xs font-bold text-primary-400 flex items-center uppercase tracking-widest">
              <Bookmark size={14} className="mr-2" />
              주요 액션
            </h3>
            <div className="flex flex-col gap-4">
              <Link to={`/stocks/${stock.id}/memos/new`} className="w-full">
                <Button className="w-full h-14 text-white shadow-lg shadow-primary-500/20">
                  <Plus size={20} className="mr-2" />
                  <span>새 투자 노트 작성</span>
                </Button>
              </Link>
              {stock.status === 'WATCHLIST' && (
                <Button 
                  variant="secondary" 
                  onClick={() => setIsEditModalOpen(true)}
                  className="w-full h-14 border-gray-800 bg-gray-950 text-white"
                >
                  <ExternalLink size={18} className="mr-2" />
                  <span>매수로 전환하기</span>
                </Button>
              )}
            </div>
          </Card>
        </div>

        {/* Right Column: Notes History */}
        <div className="lg:col-span-2 space-y-8">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-2xl font-bold text-white flex items-center tracking-tight">
              <FileText size={20} className="mr-3 text-primary-500" />
              투자 노트 기록
              <Badge variant="default" className="ml-4 bg-gray-800 text-gray-400">
                총 {stockMemos.length}건
              </Badge>
            </h2>
          </div>

          <div className="space-y-6 relative">
            {stockMemos.length > 0 && (
              <div className="absolute left-6 top-12 bottom-12 w-px bg-gray-800" />
            )}

            {stockMemos.length > 0 ? (
              stockMemos.map((memo) => (
                <div key={memo.id} className="relative pl-14 pb-12 group last:pb-0">
                  <div className="absolute left-4 top-2 w-4 h-4 rounded-full bg-gray-950 border-2 border-gray-700 group-hover:border-primary-500 group-hover:bg-primary-500 transition-all z-10 shadow-[0_0_10px_rgba(0,0,0,0.5)]" />
                  
                  <Card interactive className="border-gray-800 bg-gray-900/30 hover:bg-gray-900/50 p-8 group-hover:border-gray-700">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-4">
                        <Badge variant={memo.type === 'PURCHASE' ? 'success' : memo.type === 'SELL' ? 'danger' : 'info'}>
                          {memo.type === 'PURCHASE' ? '매수 기록' : memo.type === 'SELL' ? '매도 기록' : '일반 메모'}
                        </Badge>
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-widest font-mono">
                          {formatDateTime(new Date(memo.updatedAt))}
                        </span>
                      </div>
                      <Link 
                        to={`/memos/${memo.id}/edit`}
                        className="p-2 text-gray-600 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                      >
                        <Pencil size={16} />
                      </Link>
                    </div>

                    <div className="space-y-6">
                      {memo.buyReason && (
                        <div>
                          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">
                            {stock.status === 'WATCHLIST' ? '분석 및 관심 사유' : '매수 판단 근거'}
                          </p>
                          <p className="text-sm text-gray-300 leading-relaxed font-medium">{memo.buyReason}</p>
                        </div>
                      )}
                      
                      {memo.expectedScenario && (
                        <div className="py-4 border-y border-gray-800/30">
                          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3 flex items-center">
                            <Activity size={12} className="mr-2 text-primary-400" />
                            향후 시나리오
                          </p>
                          <p className="text-sm text-gray-300 leading-relaxed font-medium">{memo.expectedScenario}</p>
                        </div>
                      )}

                      {memo.risks && (
                        <div className="flex items-start gap-3 p-4 bg-danger/5 rounded-xl border border-danger/10">
                          <AlertCircle size={16} className="text-danger shrink-0 mt-0.5" />
                          <div>
                            <p className="text-[10px] font-bold text-danger/70 uppercase tracking-widest mb-1.5">리스크 분석</p>
                            <p className="text-xs text-gray-400 leading-relaxed">{memo.risks}</p>
                          </div>
                        </div>
                      )}

                      {memo.currentThought && (
                        <div className="bg-gray-950/50 p-6 rounded-2xl border border-gray-800/50 relative overflow-hidden">
                          <div className="absolute top-0 right-0 p-3 opacity-5">
                            <TrendingUp size={48} />
                          </div>
                          <p className="text-[10px] font-bold text-primary-400 uppercase tracking-widest mb-3">
                            {stock.status === 'WATCHLIST' ? '리서치 메모' : '현재 보유 관점'}
                          </p>
                          <p className="text-sm text-gray-300 italic font-medium">"{memo.currentThought}"</p>
                        </div>
                      )}

                      {memo.sellReview && (
                        <div className="bg-danger/5 p-6 rounded-2xl border border-danger/20">
                          <p className="text-[10px] font-bold text-danger-light uppercase tracking-widest mb-3">매매 복기 (Sell Review)</p>
                          <p className="text-sm text-gray-300 leading-relaxed">{memo.sellReview}</p>
                        </div>
                      )}

                      {!memo.buyReason && !memo.currentThought && !memo.sellReview && (
                        <p className="text-sm text-gray-600 italic font-medium">내용이 비어 있는 노트입니다.</p>
                      )}
                    </div>
                  </Card>
                </div>
              ))
            ) : (
              <div className="bg-gray-900/10 border border-dashed border-gray-800 p-24 rounded-3xl text-center">
                <FileText size={48} className="mx-auto text-gray-800 mb-6" />
                <p className="text-gray-500 mb-8 font-bold">아직 작성된 투자 노트가 없습니다.</p>
                <Link to={`/stocks/${stock.id}/memos/new`}>
                  <Button variant="ghost" className="text-primary-500 font-bold">
                    첫 투자 판단 기록하기 <ChevronRight size={18} className="ml-1" />
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <Modal 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)}
        title="종목 정보 수정"
        size="lg"
      >
        <form onSubmit={handleUpdateStock}>
          <ModalBody>
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input 
                  label="종목명"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="bg-gray-950 border-gray-800"
                />
                <Input 
                  label="종목코드 (선택)"
                  value={symbol}
                  onChange={(e) => setSymbol(e.target.value)}
                  className="bg-gray-950 border-gray-800"
                  placeholder="예: 005930"
                />
              </div>

              <div className="space-y-3">
                <label className="text-sm font-bold text-gray-500 uppercase tracking-widest">상태</label>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                  {(['HOLDING', 'WATCHLIST', 'PARTIAL_SOLD', 'SOLD'] as const).map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setStatus(s)}
                      className={cn(
                        "px-4 py-3 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-2",
                        status === s 
                          ? "bg-primary-500 border-primary-500 text-white shadow-lg shadow-primary-500/20 shadow-[0_0_15px_rgba(59,130,246,0.3)]" 
                          : "bg-gray-950 border-gray-800 text-gray-500 hover:border-gray-700"
                      )}
                    >
                      <Badge status={s} className={status === s ? "bg-white/20 text-white p-0" : "bg-transparent p-0 text-gray-500"} />
                    </button>
                  ))}
                </div>
              </div>

              {status !== 'WATCHLIST' && (
                <>
                  <div className="space-y-3">
                    <label className="text-sm font-bold text-gray-500 uppercase tracking-widest">연결 계좌</label>
                    <select 
                      value={accountId}
                      onChange={(e) => setAccountId(e.target.value)}
                      required
                      className="w-full h-11 bg-gray-950 border border-gray-800 rounded-lg px-4 text-white focus:outline-none focus:ring-2 focus:ring-primary-500/40 appearance-none font-medium"
                    >
                      <option value="">계좌 선택 (필수)</option>
                      {accounts.map(a => (
                        <option key={a.id} value={a.id}>{a.brokerName}</option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Input 
                      label="보유 수량"
                      type="number" 
                      value={quantity}
                      onChange={(e) => setQuantity(Number(e.target.value))}
                      min="1"
                      required
                      className="bg-gray-950 border-gray-800"
                    />
                    <Input 
                      label="평균 단가 (원)"
                      type="number" 
                      value={avgPrice}
                      onChange={(e) => setAvgPrice(Number(e.target.value))}
                      min="1"
                      required
                      className="bg-gray-950 border-gray-800"
                    />
                    <Input 
                      label="현재가 (원)"
                      type="number" 
                      value={currentPrice}
                      onChange={(e) => setCurrentPrice(Number(e.target.value))}
                      min="0"
                      required
                      className="bg-gray-950 border-gray-800"
                    />
                  </div>
                </>
              )}
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="secondary" type="button" onClick={() => setIsEditModalOpen(false)}>
              취소
            </Button>
            <Button type="submit">
              정보 업데이트하기
            </Button>
          </ModalFooter>
        </form>
      </Modal>
    </div>
  );
}


