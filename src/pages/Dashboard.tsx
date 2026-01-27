import { useApp } from '../contexts/AppContext';
import { 
  TrendingUp, TrendingDown, FileText, PlusCircle, 
  ChevronRight, ArrowRight, Clock, Target,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Account, Stock, StockMemo } from '../types';
import { Card, Badge, Button } from '../components/ui';
import { cn, formatCurrency, formatRelativeTime, formatNumber } from '../lib/utils';

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
  const profitStr = formatNumber(Math.abs(totalProfit));

  const totalAssets = totalCash + totalEvaluation;
  const cashRatio = totalAssets > 0 ? (totalCash / totalAssets) * 100 : 0;

  const recentMemos = [...memos].sort((a: StockMemo, b: StockMemo) => b.updatedAt - a.updatedAt).slice(0, 3);
  const watchlistCount = stocks.filter(s => s.status === 'WATCHLIST').length;

  return (
    <div className="space-y-8 animate-fade-in max-w-6xl mx-auto">

      {/* Hero Stats Section */}
      <section className="relative">
        <div className="bg-gradient-to-br from-gray-900 to-gray-950 p-10 rounded-[32px] border border-gray-800/50 shadow-2xl relative overflow-hidden group">
          {/* Subtle Background Textures */}
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary-500/5 to-transparent pointer-events-none" />
          <div className="absolute -right-20 -top-20 w-96 h-96 bg-primary-600/10 rounded-full blur-[100px] pointer-events-none" />
          
          <div className="relative z-10">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-12">
              <div className="space-y-2">
                <span className="font-light text-primary-500 uppercase tracking-[0.3em] ml-1">TOTAL ASSETS | 총 자산 가치</span>
                <div className="font-black tracking-tighter tabular-nums flex items-baseline">
                  <span className="text-3xl font-light text-gray-500 mr-3 opacity-50">₩</span>
                  <span className="text-6xl font-black text-white">
                    {formatNumber(totalAssets)}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 font-bold uppercase tracking-widest ml-1">
                  <span className="w-2 h-2 rounded-full bg-gray-600" />
                  자본 총합 (평가자산 + 총 예수금)
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch gap-4 shrink-0">
                <div className="bg-white/[0.03] backdrop-blur-3xl rounded-[28px] p-7 border border-white/10 min-w-[300px] shadow-2xl relative overflow-hidden group/card @container">
                
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.02] to-white/[0.05] pointer-events-none" />
                  
                  <div className="relative z-10">
                    <div className="flex items-start justify-between mb-8">
                      <div className="flex flex-col">
                        <span className="text-xs text-gray-500 uppercase tracking-[0.1em]">Holdings P/L</span>
                        <span className="text-xs text-gray-500 uppercase tracking-[0.2em] mt-0.5">평가손익</span>
                      </div>
                      <div className={cn(
                        "text-md font-black px-3 py-1.5 rounded-full inline-flex items-center gap-1.5 shadow-sm backdrop-blur-md border border-white/5 font-num",
                        totalProfit >= 0 ? "bg-danger/20 text-danger-light" : "bg-info/20 text-info-light"
                      )}>
                        {totalProfit >= 0 ? '+' : ''}{totalProfitRate.toFixed(2)}%
                        <span className="opacity-40 font-bold ml-1 text-[9px] font-sans">ROI</span>
                      </div>
                    </div>
                    
                    <div className="mt-2 flex flex-col min-w-0">
                      <div className="font-black tracking-tighter tabular-nums flex items-baseline leading-none">
                        <span 
                          className={cn(
                            "inline-block transition-all duration-300 font-num",
                            totalProfit >= 0 ? "text-white" : "text-info-light"
                          )}
                          style={{ 
                            fontSize: `clamp(1rem, ${180 / (profitStr.length + 3)}cqi, 3.5rem)` 
                          }}
                        >
                          {totalProfit >= 0 ? '+' : '-'}
                          <span className="mx-2">{profitStr}</span>
                          <span className="text-2xl mr-2 opacity-50">원</span>
                        </span>
                      </div>
                    </div>

                    {/* Corner Icon */}
                    <div className="absolute -bottom-12 -right-4 opacity-5">
                      <TrendingUp size={120} strokeWidth={3} /> 
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mt-12 pt-10 border-t border-gray-800/40">
              <div className="space-y-2">
                <span className="text-base font-black text-gray-600 uppercase tracking-widest">평가자산</span>
                <div className="flex items-baseline font-black tracking-tight tabular-nums">
                  <span className="text-sm font-light text-gray-500 mr-2 opacity-50">₩</span>
                  <p className="text-2xl text-gray-100 font-num">{formatNumber(totalEvaluation)}</p>
                </div>
              </div>
              <div className="space-y-2">
                <span className="text-base font-black text-gray-600 uppercase tracking-widest">총 예수금</span>
                <div className="flex items-baseline font-black tracking-tight tabular-nums">
                  <span className="text-sm font-light text-gray-500 mr-2 opacity-50">₩</span>
                  <p className="text-2xl text-gray-100 font-num">{formatNumber(totalCash)}</p>
                </div>
              </div>
              <div className="space-y-2">
                <span className="text-base font-black text-gray-600 uppercase tracking-widest">투자비용</span>
                <div className="flex items-baseline font-black tracking-tight tabular-nums">
                  <span className="text-sm font-light text-gray-500 mr-2 opacity-50">₩</span>
                  <p className="text-2xl text-gray-100 font-num">{formatNumber(totalInvested)}</p>
                </div>
              </div>
              <div className="space-y-2">
                <span className="text-base font-black text-gray-600 uppercase tracking-widest">현금 비중</span>
                <p className="text-2xl font-black text-primary-400 tracking-tight tabular-nums font-num">{cashRatio.toFixed(1)}%</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Grid Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card interactive className="p-8 border-gray-800/50 bg-gray-900/30 hover:bg-gray-900/50 group overflow-hidden relative">
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
            <TrendingUp size={120} />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 bg-success/10 text-success rounded-2xl">
                <TrendingUp size={24} />
              </div>
              <span className="text-[11px] font-black text-gray-500 uppercase tracking-[0.2em]">Holdings</span>
            </div>
            <div>
              <div className="text-5xl font-black text-white mb-2 tracking-tighter">
                {holdingStocks.length} <span className="text-xl font-bold text-gray-600 uppercase ml-2 tracking-widest">Stocks</span>
              </div>
              <p className="text-sm text-gray-500 font-medium">Currently managed investment positions</p>
            </div>
          </div>
        </Card>

        <Card interactive className="p-8 border-gray-800/50 bg-gray-900/30 hover:bg-gray-900/50 group overflow-hidden relative">
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
            <FileText size={120} />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 bg-primary-500/10 text-primary-500 rounded-2xl">
                <FileText size={24} />
              </div>
              <span className="text-[11px] font-black text-gray-500 uppercase tracking-[0.2em]">Research Docs</span>
            </div>
            <div>
              <div className="text-5xl font-black text-white mb-2 tracking-tighter">
                {memos.length} <span className="text-xl font-bold text-gray-600 uppercase ml-2 tracking-widest">Memos</span>
              </div>
              <p className="text-sm text-gray-500 font-medium">Recorded investment thesis and reviews</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
        {/* Holding Stocks Section */}
        <section className="lg:col-span-3 space-y-8">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-4">
              <h2 className="text-3xl font-black text-white tracking-tight">Active Portfolio</h2>
              <div className="px-3 py-1 bg-gray-900 border border-gray-800 rounded-full text-[10px] font-black text-gray-500 uppercase tracking-widest">
                {holdingStocks.length} items
              </div>
            </div>
            <Link to="/watchlist" className="group text-xs font-black text-primary-500 hover:text-primary-400 flex items-center transition-all uppercase tracking-widest">
              Watchlist ({watchlistCount})
              <ChevronRight size={14} className="ml-1 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          
          <div className="space-y-5">
            {holdingStocks.length > 0 ? (
              holdingStocks.map((stock) => {
                const stockMemos = memos.filter(m => m.stockId === stock.id);
                const hasNote = stockMemos.length > 0;
                
                const currentPrice = stock.currentPrice || stock.avgPrice;
                const profit = (currentPrice - stock.avgPrice) * stock.quantity;
                const profitRate = stock.avgPrice > 0 ? ((currentPrice - stock.avgPrice) / stock.avgPrice) * 100 : 0;
                
                return (
                  <Link key={stock.id} to={`/stocks/${stock.id}`}>
                    <Card interactive className="p-6 border-gray-800/40 bg-gray-900/20 hover:bg-gray-900/60 flex items-center group transition-all duration-500 relative overflow-hidden backdrop-blur-sm">
                      <div className={cn(
                        "absolute right-0 top-0 bottom-0 w-1 opacity-40 transition-all group-hover:w-2",
                        profit >= 0 ? "bg-danger shadow-[0_0_15px_rgba(239,68,68,0.4)]" : "bg-info shadow-[0_0_15px_rgba(14,165,233,0.4)]"
                      )} />

                      <div className="p-4 bg-gray-950 rounded-2xl mr-6 border border-gray-800/80 shadow-inner group-hover:border-primary-500/50 group-hover:scale-105 transition-all">
                        <Target size={24} className={hasNote ? "text-primary-500" : "text-gray-700"} />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-1.5">
                          <span className="font-bold text-xl text-white group-hover:text-primary-400 transition-colors truncate">{stock.name}</span>
                          {stock.symbol && (
                            <span className="text-[9px] font-black font-mono text-gray-500 bg-gray-950 px-2 py-0.5 rounded-lg border border-gray-800/80 uppercase tracking-tighter">
                              {stock.symbol}
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] font-bold text-gray-600 flex items-center gap-3 uppercase tracking-widest">
                          <span className="text-gray-400">{stock.quantity.toLocaleString()} shares</span>
                          <span className="w-1 h-1 rounded-full bg-gray-800" />
                          <span>Avg {formatCurrency(stock.avgPrice)}</span>
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-1.5 mr-10 text-right min-w-[120px]">
                        <div className={cn(
                          "text-lg font-black tracking-tighter tabular-nums",
                          profit > 0 ? "text-danger-light" : profit < 0 ? "text-info-light" : "text-gray-500"
                        )}>
                          {profit > 0 ? '+' : ''}{formatCurrency(profit)}
                        </div>
                        <div className={cn(
                          "text-[10px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider",
                          profit > 0 ? "bg-danger/10 text-danger-light" : profit < 0 ? "bg-info/10 text-info-light" : "bg-gray-800 text-gray-500"
                        )}>
                          {profit > 0 ? '+' : ''}{profitRate.toFixed(2)}%
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-3 shrink-0">
                        <Badge status={stock.status} className="px-3 py-1 shadow-sm" />
                        <div className={cn(
                          "text-[9px] font-black px-2.5 py-1 rounded-lg uppercase tracking-widest transition-colors",
                          hasNote ? 'text-primary-400 bg-primary-500/10' : 'text-warning/80 bg-warning/5 border border-warning/10'
                        )}>
                          {hasNote ? `${stockMemos.length} Thesis` : 'No Record'}
                        </div>
                      </div>
                    </Card>
                  </Link>
                );
              })
            ) : (
              <div className="bg-gray-950/20 border-2 border-dashed border-gray-800/50 rounded-[32px] p-20 text-center">
                <div className="mb-8 inline-flex p-8 bg-gray-900/50 rounded-full text-gray-800 shadow-inner">
                  <PlusCircle size={64} />
                </div>
                <h3 className="text-2xl font-black text-gray-400 mb-3 tracking-tight">Empty Portfolio</h3>
                <p className="text-gray-600 mb-10 max-w-xs mx-auto text-sm font-medium leading-relaxed">준비된 자산이 없습니다. 계좌를 등록하고 첫 번째 투자 종목을 추가해 보세요.</p>
                <Link to="/accounts">
                  <Button size="lg" className="shadow-2xl shadow-primary-500/30 px-12 h-14 rounded-2xl font-black">
                    <PlusCircle size={20} className="mr-3" />
                    <span>Get Started</span>
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* Recent Memos Section */}
        <section className="lg:col-span-2 space-y-8">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-3xl font-black text-white tracking-tight">Recent Thesis</h2>
          </div>

          <div className="space-y-6">
            {recentMemos.length > 0 ? (
              recentMemos.map((memo) => {
                const stock = stocks.find(s => s.id === memo.stockId);
                return (
                  <Link key={memo.id} to={`/stocks/${stock?.id}`}>
                    <Card interactive className="p-8 border-gray-800/50 bg-gray-900/30 hover:bg-gray-900/50 relative overflow-hidden group transition-all duration-500">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-primary-500/5 -mr-6 -mt-6 rounded-full blur-2xl group-hover:bg-primary-500/10 transition-all duration-700" />
                      
                      <div className="flex items-center justify-between mb-6 relative z-10">
                        <span className="text-sm font-black text-primary-400 tracking-wider uppercase">{stock?.name}</span>
                        <div className="flex items-center gap-2 px-3 py-1 bg-gray-950 border border-gray-800/80 rounded-full">
                          <Clock size={10} className="text-gray-600" />
                          <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest font-mono">
                            {formatRelativeTime(new Date(memo.updatedAt))}
                          </span>
                        </div>
                      </div>
                      
                      <p className="text-sm text-gray-400 font-medium leading-[1.8] line-clamp-3 mb-8 italic opacity-80 group-hover:opacity-100 transition-opacity">
                        "{memo.buyReason || memo.currentThought || 'No thesis description available for this record.'}"
                      </p>
                      
                      <div className="flex items-center text-[10px] font-black text-gray-600 group-hover:text-primary-400 transition-all gap-2 uppercase tracking-[0.2em]">
                        <span>Review Deep Analysis</span>
                        <ArrowRight size={12} className="group-hover:translate-x-2 transition-transform duration-300" />
                      </div>
                    </Card>
                  </Link>
                );
              })
            ) : (
              <div className="bg-gray-950/20 border border-dashed border-gray-800/40 rounded-[24px] p-20 text-center">
                <p className="text-gray-700 text-[11px] font-black uppercase tracking-[0.3em] font-mono">Awaiting Records...</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
