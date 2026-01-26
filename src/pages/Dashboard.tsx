import { useApp } from '../contexts/AppContext';
import { 
  TrendingUp, FileText, PlusCircle, 
  ChevronRight, ArrowRight, Clock, Target,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Account, Stock, StockMemo } from '../types';
import { Card, Badge, Button } from '../components/ui';
import { cn, formatCurrency, formatRelativeTime } from '../lib/utils';

export default function Dashboard() {
  const { data } = useApp();
  const { accounts, stocks, memos } = data;

  const totalCash = accounts.reduce((acc: number, curr: Account) => acc + (Number(curr.cashBalance) || 0), 0);
  const holdingStocks = stocks.filter((s: Stock) => s.status === 'HOLDING' || s.status === 'PARTIAL_SOLD');
  
  // Calculations
  const totalInvested = holdingStocks.reduce((acc, curr) => acc + ((Number(curr.quantity) || 0) * (Number(curr.avgPrice) || 0)), 0);
  const totalEvaluation = holdingStocks.reduce((acc, curr) => {
    const currentPrice = curr.currentPrice || curr.avgPrice; // Use avgPrice if currentPrice is not set
    return acc + ((Number(curr.quantity) || 0) * currentPrice);
  }, 0);
  
  const totalProfit = totalEvaluation - totalInvested;
  const totalProfitRate = totalInvested > 0 ? (totalProfit / totalInvested) * 100 : 0;

  const recentMemos = [...memos].sort((a: StockMemo, b: StockMemo) => b.updatedAt - a.updatedAt).slice(0, 3);
  const watchlistCount = stocks.filter(s => s.status === 'WATCHLIST').length;

  return (
    <div className="space-y-10 animate-fade-in">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-white mb-2">대시보드</h1>
          <p className="text-sm font-medium text-gray-400">투자 판단의 복기가 더 나은 결정으로 이어집니다.</p>
        </div>
        <div className="flex items-center gap-2 text-xs font-bold text-gray-500 bg-gray-900/50 border border-gray-800 px-4 py-2 rounded-full backdrop-blur-sm">
          <Clock size={14} className="text-primary-500" />
          <span>업데이트: {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
      </header>

      {/* Hero Stats Section */}
      <section>
        <div className="bg-gradient-to-br from-primary-600 to-primary-800 p-8 rounded-2xl shadow-xl shadow-primary-900/20 relative overflow-hidden group">
          {/* Decorative Circles */}
          <div className="absolute -right-10 -top-10 w-64 h-64 bg-white/10 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-700" />
          <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-primary-400/10 rounded-full blur-3xl" />
          
          <div className="relative z-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <p className="text-primary-100/80 font-semibold text-sm mb-2 uppercase tracking-wider">전체 예수금 요약</p>
                <div className="text-4xl md:text-5xl font-bold text-white tracking-tight">
                  {formatCurrency(totalCash)}
                </div>
                <div className="mt-4 flex items-center gap-2 text-primary-100/60 text-xs font-medium">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary-200 animate-pulse" />
                  마지막 업데이트: {formatRelativeTime(new Date())}
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/10 min-w-[240px]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold text-primary-100/60 uppercase tracking-widest">실시간 수익 현황</span>
                  {totalProfit >= 0 ? (
                    <ArrowUpRight size={16} className="text-danger-light" />
                  ) : (
                    <ArrowDownRight size={16} className="text-info-light" />
                  )}
                </div>
                <div className={cn(
                  "text-2xl font-bold mb-1 tracking-tight",
                  totalProfit >= 0 ? "text-white" : "text-info-light"
                )}>
                  {totalProfit >= 0 ? '+' : ''}{formatCurrency(totalProfit)}
                </div>
                <div className={cn(
                  "text-xs font-bold px-2 py-0.5 rounded-lg inline-block",
                  totalProfit >= 0 ? "bg-danger/20 text-danger-light" : "bg-info/20 text-info-light"
                )}>
                  {totalProfit >= 0 ? '+' : ''}{totalProfitRate.toFixed(2)}%
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10 pt-8 border-t border-white/10">
              <div className="flex flex-col">
                <span className="text-[10px] text-primary-100/50 font-bold uppercase mb-1 tracking-widest">운용 자산 총액 (예수금 제외)</span>
                <span className="text-xl font-bold text-white tracking-tight">{formatCurrency(totalEvaluation)}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] text-primary-100/50 font-bold uppercase mb-1 tracking-widest">총 매수 금액</span>
                <span className="text-xl font-bold text-white tracking-tight">{formatCurrency(totalInvested)}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] text-primary-100/50 font-bold uppercase mb-1 tracking-widest">계좌 수</span>
                <span className="text-xl font-bold text-white tracking-tight">{accounts.length} <span className="text-sm font-medium opacity-60">개</span></span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Grid Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card interactive className="border-gray-800 bg-gray-900/40 hover:bg-gray-900/60 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-8">
            <div className="p-4 bg-success/10 text-success rounded-xl">
              <TrendingUp size={28} />
            </div>
            <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Holdings</span>
          </div>
          <div>
            <div className="text-4xl font-bold text-white mb-1 tracking-tight">
              {holdingStocks.length} <span className="text-lg font-medium text-gray-500">개 종목</span>
            </div>
            <p className="text-sm text-gray-500 font-medium">현재 운용 및 일부 매도 상태의 종목</p>
          </div>
        </Card>

        <Card interactive className="border-gray-800 bg-gray-900/40 hover:bg-gray-900/60 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-8">
            <div className="p-4 bg-primary-500/10 text-primary-500 rounded-xl">
              <FileText size={28} />
            </div>
            <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Notes</span>
          </div>
          <div>
            <div className="text-4xl font-bold text-white mb-1 tracking-tight">
              {memos.length} <span className="text-lg font-medium text-gray-500">개 노트</span>
            </div>
            <p className="text-sm text-gray-500 font-medium">작성된 모든 투자 판단 및 회고 기록</p>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
        {/* Holding Stocks Section */}
        <section className="lg:col-span-3 space-y-6">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold text-white tracking-tight">보유 종목</h2>
              <Badge variant="default" className="bg-gray-800 text-gray-400">
                {holdingStocks.length}
              </Badge>
            </div>
            <Link to="/watchlist" className="group text-sm font-bold text-primary-500 hover:text-primary-400 flex items-center transition-colors">
              관심 종목 {watchlistCount}개
              <ChevronRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          
          <div className="space-y-4">
            {holdingStocks.length > 0 ? (
              holdingStocks.map((stock) => {
                const stockMemos = memos.filter(m => m.stockId === stock.id);
                const hasNote = stockMemos.length > 0;
                
                const currentPrice = stock.currentPrice || stock.avgPrice;
                const profit = (currentPrice - stock.avgPrice) * stock.quantity;
                const profitRate = stock.avgPrice > 0 ? ((currentPrice - stock.avgPrice) / stock.avgPrice) * 100 : 0;
                
                return (
                  <Link key={stock.id} to={`/stocks/${stock.id}`}>
                    <Card interactive className="p-5 border-gray-800 bg-gray-900/30 hover:bg-gray-900/50 flex items-center group mb-4 last:mb-0 relative overflow-hidden">
                      {/* Profit/Loss Background Hint */}
                      <div className={cn(
                        "absolute right-0 top-0 bottom-0 w-1 opacity-20",
                        profit >= 0 ? "bg-danger" : "bg-info"
                      )} />

                      <div className="p-4 bg-gray-950 rounded-xl mr-5 border border-gray-800 shadow-inner group-hover:border-primary-500/50 transition-colors">
                        <Target size={24} className={hasNote ? "text-primary-500" : "text-gray-700"} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-bold text-lg text-white group-hover:text-primary-400 transition-colors">{stock.name}</span>
                          {stock.symbol && <span className="text-[10px] font-mono text-gray-500 bg-gray-950 px-1.5 py-0.5 rounded border border-gray-800 uppercase tracking-tighter">{stock.symbol}</span>}
                        </div>
                        <div className="text-xs text-gray-500 font-medium flex items-center gap-2">
                          <span>{stock.quantity.toLocaleString()}주</span>
                          <span className="w-1 h-1 rounded-full bg-gray-800" />
                          <span>평균 {formatCurrency(stock.avgPrice)}</span>
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-1 mr-8 text-right min-w-[100px]">
                        <div className={cn(
                          "text-sm font-bold tracking-tight",
                          profit > 0 ? "text-danger-light" : profit < 0 ? "text-info-light" : "text-gray-400"
                        )}>
                          {profit > 0 ? '+' : ''}{formatCurrency(profit)}
                        </div>
                        <div className={cn(
                          "text-[10px] font-bold font-mono",
                          profit > 0 ? "text-danger-light/80" : profit < 0 ? "text-info-light/80" : "text-gray-600"
                        )}>
                          {profit > 0 ? '+' : ''}{profitRate.toFixed(2)}%
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-2 shrink-0">
                        <Badge status={stock.status} />
                        <div className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          hasNote ? 'text-primary-400 bg-primary-500/10' : 'text-warning bg-warning/10'
                        }`}>
                          {hasNote ? `${stockMemos.length} Notes` : '노트 필요'}
                        </div>
                      </div>
                    </Card>
                  </Link>
                );
              })
            ) : (
              <div className="bg-gray-900/20 border border-dashed border-gray-800 rounded-2xl p-16 text-center">
                <div className="mb-6 inline-flex p-6 bg-gray-900/50 rounded-full text-gray-700">
                  <PlusCircle size={48} />
                </div>
                <h3 className="text-xl font-bold text-gray-400 mb-2">보유 중인 종목이 없습니다.</h3>
                <p className="text-gray-600 mb-8 max-w-xs mx-auto">계좌를 먼저 등록하신 후, 보유 중인 주식 종목을 추가해 보세요.</p>
                <Link to="/accounts">
                  <Button size="lg" className="shadow-lg shadow-primary-500/10">
                    <PlusCircle size={20} className="mr-2" />
                    <span>첫 종목 추가하기</span>
                  </Button>
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
                  <Link key={memo.id} to={`/stocks/${stock?.id}`}>
                    <Card interactive className="p-6 border-gray-800 bg-gray-900/30 hover:bg-gray-900/50 relative overflow-hidden group">
                      <div className="absolute top-0 right-0 w-16 h-16 bg-primary-500/5 -mr-4 -mt-4 rounded-full blur-xl group-hover:bg-primary-500/10 transition-colors" />
                      <div className="flex items-center justify-between mb-4 relative z-10">
                        <span className="text-sm font-bold text-primary-400 tracking-tight">{stock?.name}</span>
                        <span className="text-[10px] font-bold text-gray-500 bg-gray-950 px-2 py-1 rounded border border-gray-800">
                          {formatRelativeTime(new Date(memo.updatedAt))}
                        </span>
                      </div>
                      <p className="text-sm text-gray-400 font-medium leading-relaxed line-clamp-3 mb-4 italic">
                        "{memo.buyReason || memo.currentThought || '기록된 내용이 없습니다.'}"
                      </p>
                      <div className="flex items-center text-[10px] font-bold text-gray-500 group-hover:text-white transition-colors gap-1">
                        <span>노트 상세 보기</span>
                        <ArrowRight size={10} className="group-hover:translate-x-1 transition-transform" />
                      </div>
                    </Card>
                  </Link>
                );
              })
            ) : (
              <div className="bg-gray-900/10 border border-dashed border-gray-800 rounded-2xl p-16 text-center">
                <p className="text-gray-600 text-sm font-bold italic">아직 기록이 없습니다.</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
