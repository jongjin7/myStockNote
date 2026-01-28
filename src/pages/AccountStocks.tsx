import { useParams, useNavigate, Link } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { 
 ArrowLeft, Wallet, 
 Target, PlusCircle, LayoutDashboard,
 AlertCircle
} from 'lucide-react';
import { Card, Button, Badge } from '../components/ui';
import { cn, formatCurrency } from '../lib/utils';
import type { StockMemo } from '../types';

export default function AccountStocks() {
 const { id: accountId } = useParams<{ id: string }>();
 const navigate = useNavigate();
 const { data } = useApp();
 const { accounts, stocks, memos } = data;

 const account = accounts.find(a => a.id === accountId);
 const accountStocks = stocks.filter(s => s.accountId === accountId);
 
 if (!account) {
 return (
  <Card className="flex flex-col items-center justify-center p-20 text-center border-dashed border-gray-800 bg-gray-900/10">
  <AlertCircle size={64} className="text-gray-700 mb-6" />
  <h2 className="text-2xl font-bold text-white mb-2">계좌를 찾을 수 없습니다.</h2>
  <Button variant="ghost" onClick={() => navigate('/accounts')} className="text-primary-500">계좌 목록으로 돌아가기</Button>
  </Card>
 );
 }

 // Calculations for this specific account
 const totalInvested = accountStocks.reduce((acc, curr) => acc + (curr.quantity * curr.avgPrice), 0);
 const totalEvaluation = accountStocks.reduce((acc, curr) => {
 const currentPrice = curr.currentPrice || curr.avgPrice;
 return acc + (curr.quantity * currentPrice);
 }, 0);
 const totalProfit = totalEvaluation - totalInvested;
 const totalProfitRate = totalInvested > 0 ? (totalProfit / totalInvested) * 100 : 0;
 const totalAssets = account.cashBalance + totalEvaluation;

 return (
 <div className="space-y-10 animate-fade-in max-w-5xl mx-auto">
  <header className="flex flex-col space-y-6">
  <button 
   onClick={() => navigate('/accounts')}
   className="inline-flex items-center text-gray-500 hover:text-white transition-colors w-fit group"
  >
   <ArrowLeft size={18} className="mr-2 group-hover:-translate-x-1 transition-transform" />
   <span className="font-bold text-sm tracking-widest uppercase">Back to Accounts</span>
  </button>
  
  <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
   <div>
   <div className="flex items-center gap-4 mb-2">
    <div className="p-3 bg-primary-500/10 text-primary-500 rounded-xl">
    <Wallet size={24} />
    </div>
    <h1 className="text-4xl font-black tracking-tight text-white">{account.brokerName}</h1>
   </div>
   <p className="text-sm font-medium text-gray-400 ml-14">해당 계좌에 보유 중인 모든 종목 리스트입니다.</p>
   </div>
   
   <div className="text-right">
   <div className="text-sm font-black text-gray-500 uppercase tracking-[0.2em] mb-1">계좌 총 자산</div>
   <div className="text-4xl font-black text-white tracking-tighter tabular-nums">
    {formatCurrency(totalAssets)}
   </div>
   </div>
  </div>
  </header>

  {/* Account Stats Strip */}
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
  <Card className="bg-gray-900/40 border-gray-800 p-6">
   <div className="text-sm font-black text-gray-500 uppercase tracking-widest mb-2">총 투자금 (Invested)</div>
   <div className="text-2xl font-bold text-white tabular-nums">{formatCurrency(totalInvested)}</div>
  </Card>
  <Card className={cn(
   "p-6 border-none",
   totalProfit >= 0 ? "bg-danger/10" : "bg-info/10"
  )}>
   <div className="flex justify-between items-start">
   <div className="text-sm font-black text-gray-500 uppercase tracking-widest mb-2">누적 수익 (P/L)</div>
   <Badge variant={totalProfit >= 0 ? 'danger' : 'info'} className="text-sm font-black">
    {totalProfit >= 0 ? '+' : ''}{totalProfitRate.toFixed(2)}%
   </Badge>
   </div>
   <div className={cn(
   "text-2xl font-bold tabular-nums",
   totalProfit >= 0 ? "text-danger-light" : "text-info-light"
   )}>
   {totalProfit >= 0 ? '+' : ''}{formatCurrency(totalProfit)}
   </div>
  </Card>
  <Card className="bg-gray-900/40 border-gray-800 p-6">
   <div className="text-sm font-black text-primary-500 uppercase tracking-widest mb-2">현재 예수금 (Cash)</div>
   <div className="text-2xl font-bold text-white tabular-nums">{formatCurrency(account.cashBalance)}</div>
  </Card>
  </div>

  {/* Stock List */}
  <div className="space-y-6">
  <div className="flex items-center justify-between px-2">
   <h2 className="text-xl font-black text-white flex items-center gap-3">
   <LayoutDashboard size={20} className="text-primary-500" />
   HOLDINGS <span className="text-gray-600 font-bold">|</span> <span className="text-gray-500 text-sm font-bold uppercase">{accountStocks.length} Items</span>
   </h2>
  </div>

  <div className="grid grid-cols-1 gap-4">
   {accountStocks.length > 0 ? (
   accountStocks.map((stock) => {
    const stockMemos = memos.filter(m => m.stockId === stock.id);
    const currentPrice = stock.currentPrice || stock.avgPrice;
    const profit = (currentPrice - stock.avgPrice) * stock.quantity;
    const profitRate = stock.avgPrice > 0 ? ((currentPrice - stock.avgPrice) / stock.avgPrice) * 100 : 0;
    const hasNote = stockMemos.length > 0;

    return (
    <Link key={stock.id} to={`/stocks/${stock.id}`}>
     <Card interactive className="p-6 bg-gray-900/40 border-gray-800 hover:border-primary-500/30 transition-all flex items-center group">
     <div className="p-4 bg-gray-950 rounded-2xl mr-6 border border-gray-800 group-hover:border-primary-500/50 transition-all">
      <Target size={24} className={hasNote ? "text-primary-500" : "text-gray-700"} />
     </div>
     
     <div className="flex-1 min-w-0">
      <div className="flex items-center gap-3 mb-1">
      <span className="font-bold text-xl text-white group-hover:text-primary-400 transition-colors">{stock.name}</span>
      {stock.symbol && (
       <span className="text-[9px] font-black text-gray-500 bg-gray-950 px-2 py-0.5 rounded border border-gray-800 uppercase tracking-tighter">
       {stock.symbol}
       </span>
      )}
      </div>
      <div className="text-sm font-bold text-gray-500 flex items-center gap-3 uppercase tracking-widest">
      <span>{stock.quantity.toLocaleString()}주</span>
      <span className="w-1 h-1 rounded-full bg-gray-800" />
      <span>평단 {formatCurrency(stock.avgPrice)}</span>
      </div>
     </div>

     <div className="flex flex-col items-end gap-1 mr-8 text-right">
      <div className={cn(
      "text-lg font-black tabular-nums",
      profit >= 0 ? "text-danger-light" : "text-info-light"
      )}>
      {profit >= 0 ? '+' : ''}{formatCurrency(profit)}
      </div>
      <div className={cn(
      "text-sm font-black px-2 py-0.5 rounded uppercase tracking-wider",
      profit >= 0 ? "bg-danger/10 text-danger-light" : "bg-info/10 text-info-light"
      )}>
      {profit >= 0 ? '+' : ''}{profitRate.toFixed(2)}%
      </div>
     </div>

     <Badge status={stock.status} />
     </Card>
    </Link>
    );
   })
   ) : (
   <div className="bg-gray-900/10 border border-dashed border-gray-800 p-20 rounded-3xl text-center">
    <PlusCircle size={48} className="mx-auto text-gray-800 mb-6" />
    <h3 className="text-xl font-bold text-gray-400 mb-2">보유 중인 종목이 없습니다.</h3>
    <p className="text-gray-600 mb-8 max-w-sm mx-auto text-sm">대시보드에서 종목을 추가할 때 이 계좌를 선택해 보세요.</p>
    <Link to="/">
    <Button variant="ghost" className="text-primary-500">대시보드로 가기</Button>
    </Link>
   </div>
   )}
  </div>
  </div>
 </div>
 );
}
