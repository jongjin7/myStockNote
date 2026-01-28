import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { 
 ArrowLeft, Pencil, Trash2, FileText, Plus, 
 ChevronRight, Calendar, Bookmark, Activity, 
 TrendingUp, AlertCircle, Info,
 ExternalLink, RefreshCw
} from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import type { Stock } from '../types';
import { 
 Card, CardTitle, CardDescription,
 Button, Input, ActionModal, Badge 
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
 const [isConvertModalOpen, setIsConvertModalOpen] = useState(false);
 
 // Convert Form States
 const [targetAccountId, setTargetAccountId] = useState('');
 const [buyQuantity, setBuyQuantity] = useState<number>(0);
 const [buyPrice, setBuyPrice] = useState<number>(0);
 const [shouldCopyMemo, setShouldCopyMemo] = useState(true);
 
 // Edit Form States
 const [name, setName] = useState(stock?.name || '');
 const [symbol, setSymbol] = useState(stock?.symbol || '');
 const [status, setStatus] = useState(stock?.status || 'HOLDING');
 const [accountId, setAccountId] = useState(stock?.accountId || '');
 const [quantity, setQuantity] = useState(stock?.quantity || 0);
 const [avgPrice, setAvgPrice] = useState(stock?.avgPrice || 0);
 const [currentPrice, setCurrentPrice] = useState(stock?.currentPrice || stock?.avgPrice || 0);
 const [isUpdatingPrice, setIsUpdatingPrice] = useState(false);

 const fetchCurrentPrice = async () => {
  if (!stock?.symbol) {
   alert('종목 코드가 등록되어 있지 않아 가격을 가져올 수 없습니다.');
   return;
  }

  setIsUpdatingPrice(true);
  try {
   const symbol = stock.symbol.trim();
   let yahooSymbol = symbol;
   if (/^\d{6}$/.test(symbol)) {
    yahooSymbol = `${symbol}.KS`; 
   }

   const url = `https://query1.finance.yahoo.com/v8/finance/chart/${yahooSymbol}?interval=1m&range=1d`;
   const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;

   const response = await fetch(proxyUrl);
   const data = await response.json();
   const result = JSON.parse(data.contents);
   
   let meta = result.chart?.result?.[0]?.meta;

   if (!meta?.regularMarketPrice && yahooSymbol.endsWith('.KS')) {
    const kqSymbol = yahooSymbol.replace('.KS', '.KQ');
    const kqUrl = `https://query1.finance.yahoo.com/v8/finance/chart/${kqSymbol}?interval=1m&range=1d`;
    const kqProxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(kqUrl)}`;
    
    const kqRes = await fetch(kqProxyUrl);
    const kqData = await kqRes.json();
    const kqResult = JSON.parse(kqData.contents);
    meta = kqResult.chart?.result?.[0]?.meta;
   }

   if (!meta?.regularMarketPrice) {
    throw new Error('주가 정보를 찾을 수 없습니다.');
   }

   const newPrice = Math.round(meta.regularMarketPrice);
   const updatedStock = {
    ...stock,
    currentPrice: newPrice,
    updatedAt: Date.now()
   };
   
   await actions.saveStock(updatedStock);
   setCurrentPrice(newPrice);
  } catch (error) {
   console.error('Failed to update price:', error);
   alert('주가 정보를 가져오는데 실패했습니다. 심볼을 확인해주세요.');
  } finally {
   setIsUpdatingPrice(false);
  }
 };

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

 const handleConvertStock = async (e: React.FormEvent) => {
 e.preventDefault();
 if (!targetAccountId || buyQuantity <= 0 || buyPrice <= 0) return;

 // 1. Get the latest research memo to copy if requested
 const latestResearchMemo = stockMemos.filter(m => m.type === 'GENERAL')[0];

 // 2. Update stock status and data
 const updatedStock: Stock = {
  ...stock,
  status: 'HOLDING',
  accountId: targetAccountId,
  quantity: buyQuantity,
  avgPrice: buyPrice,
  currentPrice: buyPrice,
  updatedAt: Date.now(),
 };

 await actions.saveStock(updatedStock);

 // 3. Create a PURCHASE memo if needed
 if (shouldCopyMemo && latestResearchMemo) {
  const purchaseMemo: any = {
  id: uuidv4(),
  stockId: stock.id,
  type: 'PURCHASE',
  buyReason: latestResearchMemo.buyReason || latestResearchMemo.currentThought,
  expectedScenario: latestResearchMemo.expectedScenario,
  risks: latestResearchMemo.risks,
  createdAt: Date.now(),
  updatedAt: Date.now(),
  };
  await actions.saveMemo(purchaseMemo);
 } else {
  // Basic PURCHASE memo indicating the conversion
  const purchaseMemo: any = {
  id: uuidv4(),
  stockId: stock.id,
  type: 'PURCHASE',
  buyReason: '관심 종목에서 매수로 전환됨',
  createdAt: Date.now(),
  updatedAt: Date.now(),
  };
  await actions.saveMemo(purchaseMemo);
 }

 setIsConvertModalOpen(false);
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
   <div className="flex items-center justify-between w-full">
    <button 
     onClick={() => navigate(-1)}
     className="inline-flex items-center text-gray-400 hover:text-white transition-colors group"
    >
     <ArrowLeft size={18} className="mr-2 group-hover:-translate-x-1 transition-transform" />
     <span className="font-bold text-sm">목록으로 돌아가기</span>
    </button>

    <div className="flex items-center gap-1">
     <Button 
      variant="ghost" 
      size="sm"
      onClick={() => setIsEditModalOpen(true)}
      className="p-2 h-auto hover:bg-white/5 text-gray-500 hover:text-white border-none transition-all"
      title="종목 정보 수정"
     >
      <Pencil size={18} />
     </Button>
     <Button 
      variant="ghost" 
      size="sm"
      onClick={handleDelete}
      className="p-2 h-auto hover:bg-danger/10 text-gray-500 hover:text-danger-light border-none transition-all"
      title="종목 삭제"
     >
      <Trash2 size={18} />
     </Button>
    </div>
   </div>
  
  <div className="relative rounded-3xl shadow-xl overflow-hidden border border-white/10 group">
   {/* Dynamic Background Layer */}
   <div className={cn(
    "absolute inset-0 bg-gradient-to-r transition-all duration-700 opacity-90",
    getHeroCardBg(stock.status)
   )} />
   <div className="absolute inset-0 bg-black/10 backdrop-blur-[2px]" />
   <div className="absolute -right-10 -top-10 w-64 h-64 bg-white/10 rounded-full blur-3xl opacity-50" />
      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between px-8 py-10 gap-10">
     {/* Left: Stock Info */}
     <div className="flex flex-col gap-4 w-full lg:w-auto">
      <div className="flex items-center gap-4">
       <h1 className="text-4xl font-black tracking-tighter text-white drop-shadow-sm">{stock.name}</h1>
       <Badge status={stock.status} className="bg-white/10 text-white border-white/5 py-1 px-4 text-[11px] font-black uppercase tracking-widest" />
      </div>
      
      <div className="flex flex-wrap items-center gap-6 text-white/70">
       {stock.symbol && (
        <span className="bg-black/30 border border-white/10 px-2.5 py-1 rounded-lg text-[11px] font-black tracking-widest text-white">
         {stock.symbol}
        </span>
       )}
       <div className="flex items-center gap-2 text-sm font-bold">
        <Activity size={16} className="opacity-60" />
        <span>{account?.brokerName || '계좌 미지정'}</span>
       </div>
       <div className="flex items-center gap-2 text-sm font-bold">
        <Calendar size={16} className="opacity-60" />
        <span>{formatDate(new Date(stock.createdAt))}</span>
       </div>
      </div>
     </div>

     {/* Right: Focused Evaluation Box */}
     <div className="bg-black/30 backdrop-blur-md px-8 py-7 rounded-2xl border border-white/5 shadow-2xl flex items-center gap-10 w-full lg:w-auto justify-between lg:justify-end">
      <div className="flex flex-col">
       <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] mb-1.5">Current Value</span>
       <div className="text-4xl font-black text-white tracking-tighter tabular-nums text-right leading-none">
        {formatCurrency(stock.quantity * currentPrice)}
       </div>
      </div>
      
      <div className="flex flex-col items-end">
       <div className={cn(
        "text-xl font-black tabular-nums tracking-tighter leading-none mb-2 px-3 py-1 rounded-full shadow-lg",
        (currentPrice - stock.avgPrice) >= 0 ? "bg-danger text-white" : "bg-info text-white"
       )}>
        {(currentPrice - stock.avgPrice) >= 0 ? '+' : ''}
        {(((currentPrice - stock.avgPrice) / stock.avgPrice) * 100).toFixed(2)}%
       </div>
       <div className={cn(
        "text-sm font-black tabular-nums tracking-tight",
        (currentPrice - stock.avgPrice) >= 0 ? "text-danger-light" : "text-info-light"
       )}>
        {(currentPrice - stock.avgPrice) >= 0 ? '+' : ''}
        {formatCurrency((currentPrice - stock.avgPrice) * stock.quantity)}
       </div>
      </div>
     </div>
    </div>
  </div>
  </header>

  <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
  {/* Left Column: Stats & Actions */}
  <div className="space-y-8">
    {stock.status !== 'WATCHLIST' && (
    <Card className="border-gray-800 bg-gray-900/40 backdrop-blur-sm pt-4 pb-4 px-5 rounded-3xl">
     <div className="mb-6">
      <h3 className="text-2xl font-bold text-white flex items-center tracking-tight">
       <TrendingUp size={24} className="mr-3 text-success opacity-80" />
       핵심 투자 지표
      </h3>
     </div>
     
     <div className="space-y-0 divide-y divide-white/5 border-y border-white/5 -mx-5 px-5">
      <div className="flex justify-between items-center py-4">
       <span className="text-sm font-bold text-gray-500 uppercase tracking-widest">보유 수량</span>
       <span className="text-xl font-black text-white tabular-nums">{stock.quantity.toLocaleString()} <span className="text-xs text-gray-600 font-medium ml-1 lowercase">주</span></span>
      </div>
      
      <div className="grid grid-cols-2">
       <div className="py-4 pr-4 border-r border-white/5 space-y-1">
        <div className="text-sm font-bold text-gray-500 uppercase tracking-widest">평균 단가</div>
        <div className="text-lg font-bold text-gray-300 tabular-nums">{formatCurrency(stock.avgPrice)}</div>
       </div>
       <div className="py-4 pl-5 space-y-1">
        <div className="flex items-center gap-2">
         <div className="text-sm font-bold text-primary-500 uppercase tracking-widest">현재가</div>
         <button 
           onClick={fetchCurrentPrice} 
           disabled={isUpdatingPrice}
           className={cn(
             "p-1.5 rounded-md bg-primary-500/10 hover:bg-primary-500/20 text-primary-500 transition-all",
             isUpdatingPrice && "animate-spin"
           )}
           title="현재가 갱신"
         >
           <RefreshCw size={12} />
         </button>
        </div>
        <div className="text-lg font-black text-primary-400 tabular-nums">{formatCurrency(currentPrice)}</div>
       </div>
      </div>

      <div className="py-4 flex justify-between items-center">
       <span className="text-sm font-bold text-gray-500 uppercase tracking-widest">투자 원금 (Total)</span>
       <span className="text-lg font-bold text-gray-400 tabular-nums">{formatCurrency(stock.quantity * stock.avgPrice)}</span>
      </div>
     </div>
    </Card>
    )}

   <Card className="border-primary-500/10 bg-primary-500/5 p-8 space-y-6 rounded-3xl">
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
     variant="success" 
     onClick={() => setIsConvertModalOpen(true)}
     className="w-full h-14 shadow-lg shadow-success/20"
    >
     <ExternalLink size={18} className="mr-2" />
     <span className="font-black">매수 확정하기 (전환)</span>
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
    <div key={memo.id} className="relative pl-14 pb-12 last:pb-0">
     <div className="absolute left-4 top-2 w-4 h-4 rounded-full bg-gray-950 border-2 border-gray-700 transition-all z-10 shadow-[0_0_10px_rgba(0,0,0,0.5)]" />
     
     <Card className="border-gray-800 bg-gray-900/30 p-8 rounded-3xl">
     <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-4">
      <Badge variant={memo.type === 'PURCHASE' ? 'success' : memo.type === 'SELL' ? 'danger' : 'info'}>
       {memo.type === 'PURCHASE' ? '매수 기록' : memo.type === 'SELL' ? '매도 기록' : '일반 메모'}
      </Badge>
      <span className="text-xs font-bold text-gray-500 uppercase tracking-widest ">
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
       <p className="text-sm text-gray-200 leading-relaxed font-medium">{memo.buyReason}</p>
      </div>
      )}
      
      {memo.expectedScenario && (
      <div className="py-4 border-y border-gray-800/30">
       <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-3 flex items-center">
        <Activity size={12} className="mr-2 text-primary-500/70" />
        EXPECTED SCENARIO
       </p>
       <p className="text-sm text-gray-300 leading-relaxed">{memo.expectedScenario}</p>
      </div>
      )}

      {memo.risks && (
      <div className="flex items-start gap-3 p-4 bg-danger/5 rounded-xl border border-danger/10">
       <AlertCircle size={16} className="text-danger shrink-0 mt-0.5" />
       <div>
       <p className="text-sm font-bold text-danger/70 uppercase tracking-widest mb-1.5">리스크 분석</p>
       <p className="text-xs text-gray-400 leading-relaxed">{memo.risks}</p>
       </div>
      </div>
      )}

      {memo.currentThought && (
      <div className="bg-gray-950/50 p-6 rounded-2xl border border-gray-800/50 relative overflow-hidden">
       <div className="absolute top-0 right-0 p-3 opacity-5">
       <TrendingUp size={48} />
       </div>
       <p className="text-sm font-bold text-primary-400 uppercase tracking-widest mb-3">
       {stock.status === 'WATCHLIST' ? '리서치 메모' : '현재 보유 관점'}
       </p>
       <p className="text-sm text-gray-300 italic font-medium">"{memo.currentThought}"</p>
      </div>
      )}

      {memo.sellReview && (
      <div className="bg-danger/5 p-6 rounded-3xl border border-danger/20">
       <p className="text-sm font-bold text-danger-light uppercase tracking-widest mb-3">매매 복기 (Sell Review)</p>
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
  <ActionModal 
  isOpen={isEditModalOpen} 
  onClose={() => setIsEditModalOpen(false)}
  onSubmit={handleUpdateStock}
  title="종목 정보 수정"
  size="lg"
  submitLabel="정보 업데이트하기"
  >
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
     "px-4 py-3 rounded-xl text-sm font-bold border transition-all flex items-center justify-center gap-2",
     status === s 
      ? "bg-primary-500 border-primary-500 text-white shadow-lg shadow-primary-500/20" 
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
  </ActionModal>

  {/* Conversion Modal */}
  <ActionModal
  isOpen={isConvertModalOpen}
  onClose={() => setIsConvertModalOpen(false)}
  onSubmit={handleConvertStock}
  title="보유 종목으로 전환 (매수 확정)"
  submitLabel="전환 완료 및 매수 기록"
  >
  <div className="space-y-8">
   <div className="p-4 bg-info/5 border border-info/20 rounded-2xl flex items-start gap-4">
   <Info size={20} className="text-info shrink-0 mt-1" />
   <div className="text-sm text-gray-400 leading-relaxed">
    관심 종목을 실제 보유 종목으로 전환합니다. <br />
    매수 정보를 입력하면 <span className="text-info font-bold">HOLDING</span> 상태로 변경됩니다.
   </div>
   </div>

   <div className="space-y-6">
   <div className="space-y-3">
    <label className="text-sm font-bold text-gray-500 uppercase tracking-widest">입고 계좌 선택</label>
    <select 
    value={targetAccountId}
    onChange={(e) => setTargetAccountId(e.target.value)}
    required
    className="w-full h-12 bg-gray-950 border border-gray-800 rounded-xl px-4 text-white focus:outline-none focus:ring-2 focus:ring-primary-500/40 appearance-none font-bold"
    >
    <option value="">계좌를 선택하세요</option>
    {accounts.map(a => (
     <option key={a.id} value={a.id}>{a.brokerName}</option>
    ))}
    </select>
   </div>

   <div className="grid grid-cols-2 gap-6">
    <Input 
    label="매수 수량"
    type="number"
    value={buyQuantity}
    onChange={(e) => setBuyQuantity(Number(e.target.value))}
    min="1"
    required
    placeholder="0"
    className="bg-gray-950 border-gray-800"
    />
    <Input 
    label="매수 단가 (원)"
    type="number"
    value={buyPrice}
    onChange={(e) => setBuyPrice(Number(e.target.value))}
    min="1"
    required
    placeholder="0"
    className="bg-gray-950 border-gray-800"
    />
   </div>

   {stockMemos.some(m => m.type === 'GENERAL') && (
    <label className="flex items-center gap-3 p-4 bg-gray-900/50 rounded-3xl border border-gray-800 cursor-pointer hover:bg-gray-900 hover:border-gray-700 transition-all">
    <input 
     type="checkbox" 
     checked={shouldCopyMemo}
     onChange={(e) => setShouldCopyMemo(e.target.checked)}
     className="w-5 h-5 rounded-lg border-gray-700 bg-gray-950 text-primary-500 focus:ring-offset-gray-950"
    />
    <div className="flex flex-col">
     <span className="text-sm font-bold text-gray-200">최근 리서치 기록을 매수 이유로 가져오기</span>
     <span className="text-sm text-gray-500 mt-0.5">기존의 일반 노트를 매수 판단 근거로 자동 복사합니다.</span>
    </div>
    </label>
   )}
   </div>
  </div>
  </ActionModal>
 </div>
 );
}
