import { useApp } from '../../contexts/AppContext';
import { formatNumber } from '../../lib/utils';
import type { Account, Stock, StockMemo } from '../../types';

import { HeroStats } from './HeroStats';
import { QuickStats } from './QuickStats';
import { PortfolioSection } from './PortfolioSection';
import { RecentMemosSection } from './RecentMemosSection';

export default function Dashboard() {
  const { data } = useApp();
  const { accounts, stocks, memos } = data;

  // -- Calculations --
  const totalCash = accounts.reduce((acc: number, curr: Account) => acc + (Number(curr.cashBalance) || 0), 0);
  const holdingStocks = stocks.filter((s: Stock) => s.status === 'HOLDING' || s.status === 'PARTIAL_SOLD');
  
  const totalInvested = holdingStocks.reduce((acc, curr) => acc + ((Number(curr.quantity) || 0) * (Number(curr.avgPrice) || 0)), 0);
  const totalEvaluation = holdingStocks.reduce((acc, curr) => {
    const currentPrice = curr.currentPrice || curr.avgPrice;
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
      <HeroStats 
        totalAssets={totalAssets}
        totalEvaluation={totalEvaluation}
        totalCash={totalCash}
        totalInvested={totalInvested}
        cashRatio={cashRatio}
        totalProfit={totalProfit}
        totalProfitRate={totalProfitRate}
        profitStr={profitStr}
      />

      {/* Grid Quick Stats */}
      <QuickStats 
        holdingStocksCount={holdingStocks.length}
        memosCount={memos.length}
      />

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
        {/* Holding Stocks Section */}
        <PortfolioSection 
          holdingStocks={holdingStocks}
          memos={memos}
          watchlistCount={watchlistCount}
        />

        {/* Recent Memos Section */}
        <RecentMemosSection 
          recentMemos={recentMemos}
          stocks={stocks}
        />
      </div>
    </div>
  );
}
