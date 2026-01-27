import { PlusCircle, Target, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, Badge, Button } from '../../components/ui';
import { cn, formatCurrency } from '../../lib/utils';
import type { Stock, StockMemo } from '../../types';

interface StockListItemProps {
  stock: Stock;
  memos: StockMemo[];
}

function StockListItem({ stock, memos }: StockListItemProps) {
  const stockMemos = memos.filter(m => m.stockId === stock.id);
  const hasNote = stockMemos.length > 0;
  const currentPrice = stock.currentPrice || stock.avgPrice;
  const profit = (currentPrice - stock.avgPrice) * stock.quantity;
  const profitRate = stock.avgPrice > 0 ? ((currentPrice - stock.avgPrice) / stock.avgPrice) * 100 : 0;

  return (
    <Link to={`/stocks/${stock.id}`}>
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
            <span className="text-gray-400 font-num">{stock.quantity.toLocaleString()}</span>
            <span className="text-gray-500 mr-2 -ml-2 text-[10px] lowercase font-sans">주</span>
            <span className="w-1 h-1 rounded-full bg-gray-800" />
            <span className="text-gray-600 lowercase font-sans">평단</span>
            <span className="font-num text-gray-400 -ml-1">{formatCurrency(stock.avgPrice)}</span>
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
            "text-[10px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider font-num",
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
            {hasNote ? `${stockMemos.length}건의 기록` : '기록 없음'}
          </div>
        </div>
      </Card>
    </Link>
  );
}

interface PortfolioSectionProps {
  holdingStocks: Stock[];
  watchlistStocks: Stock[];
  memos: StockMemo[];
}

export function PortfolioSection({ holdingStocks, watchlistStocks, memos }: PortfolioSectionProps) {
  return (
    <section className="lg:col-span-3">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 포트폴리오 섹션 (좌측) */}
        <Card className="p-10 border-gray-800/50 bg-gray-900/20 backdrop-blur-sm">
          {/* 섹션 타이틀 */}
          <div className="flex items-center gap-4 mb-10">
            <h2 className="text-3xl font-black tracking-tight bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              Portfolio
            </h2>
            <span className="text-lg text-gray-600 font-bold">|</span>
            <span className="text-xl font-bold text-gray-500 tracking-tight">포트폴리오</span>
          </div>

          <div className="space-y-8">
            {/* 운용 종목 통계 카드 */}
            <Card className="p-6 border-gray-800/50 bg-gray-900/30 group overflow-hidden relative">
              <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                <TrendingUp size={80} />
              </div>
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-success/10 text-success rounded-xl">
                    <TrendingUp size={20} />
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Holdings</div>
                    <div className="text-2xl text-white tracking-tighter tabular-nums font-bold">
                      {holdingStocks.length} <span className="text-sm text-gray-500">종목</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* 보유 종목 리스트 */}
            <div className="relative">
              {/* 구분선 및 타이틀 */}
              <div className="flex items-center gap-3 mb-6">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-800 to-transparent"></div>
                <h3 className="text-sm font-black tracking-tight text-gray-400 uppercase">
                  Holdings
                </h3>
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-800 to-transparent"></div>
              </div>
              
              <div className="space-y-4">
              {holdingStocks.length > 0 ? (
                holdingStocks.map((stock) => (
                  <StockListItem key={stock.id} stock={stock} memos={memos} />
                ))
              ) : (
                <div className="bg-gray-950/20 border-2 border-dashed border-gray-800/50 rounded-2xl p-12 text-center">
                  <div className="mb-6 inline-flex p-6 bg-gray-900/50 rounded-full text-gray-700 shadow-inner">
                    <PlusCircle size={48} />
                  </div>
                  <h3 className="text-xl font-black text-gray-400 mb-2 tracking-tight">Empty</h3>
                  <p className="text-gray-600 text-xs font-medium">종목을 추가해 보세요</p>
                </div>
              )}
              </div>
            </div>
          </div>
        </Card>

        {/* 관심 종목 섹션 (우측) */}
        <Card className="p-10 border-gray-800/50 bg-gray-900/20 backdrop-blur-sm">
          {/* 섹션 타이틀 */}
          <div className="flex items-center gap-4 mb-10">
            <h2 className="text-3xl font-black tracking-tight bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent">
              Watchlist
            </h2>
            <span className="text-lg text-gray-600 font-bold">|</span>
            <span className="text-xl font-bold text-gray-500 tracking-tight">관심 종목</span>
          </div>

          <div className="space-y-8">
            {/* 관심 종목 통계 */}
            <div className="flex items-center gap-3 p-5 bg-primary-500/5 border border-primary-500/20 rounded-xl">
              <div className="text-xs text-gray-500 uppercase tracking-wider">Total</div>
              <div className="px-2.5 py-1 bg-primary-500/10 border border-primary-500/30 rounded-lg">
                <span className="text-lg font-black text-primary-400 font-num">{watchlistStocks.length}</span>
                <span className="text-xs text-gray-500 ml-1">종목</span>
              </div>
            </div>

            {/* 관심 종목 리스트 */}
            {watchlistStocks.length > 0 ? (
              <div className="space-y-4">
                {watchlistStocks.map((stock) => (
                  <StockListItem key={stock.id} stock={stock} memos={memos} />
                ))}
              </div>
            ) : (
              <div className="bg-gray-950/20 border-2 border-dashed border-primary-500/20 rounded-2xl p-12 text-center">
                <div className="mb-6 inline-flex p-6 bg-primary-500/5 rounded-full text-primary-700 shadow-inner">
                  <PlusCircle size={48} />
                </div>
                <h3 className="text-xl font-black text-gray-400 mb-2 tracking-tight">Empty</h3>
                <p className="text-gray-600 text-xs font-medium">관심 종목을 추가해 보세요</p>
              </div>
            )}
          </div>
        </Card>
      </div>
    </section>
  );
}
