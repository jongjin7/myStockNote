import { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { formatNumber } from '../../lib/utils';
import type { Account, Stock, StockMemo, StockStatus } from '../../types';
import { PlusCircle } from 'lucide-react';
import { Button } from '../../components/ui';
import { StockModal } from '../../components/StockModal';

import { HeroStats } from './HeroStats';
import { QuickStats } from './QuickStats';
import { PortfolioSection } from './PortfolioSection';
import { RecentMemosSection } from './RecentMemosSection';

export default function Dashboard() {
 const { data } = useApp();
 const { accounts, stocks, memos } = data;

 const [isStockModalOpen, setIsStockModalOpen] = useState(false);
 const [modalInitialStatus, setModalInitialStatus] = useState<StockStatus>('HOLDING');

 const handleOpenAddModal = (status: StockStatus = 'HOLDING') => {
 setModalInitialStatus(status);
 setIsStockModalOpen(true);
 };

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

 return (
 <div className="space-y-12 animate-fade-in max-w-7xl mx-auto">
  {/* Dashboard Header */}
  <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-4">
  <div>
   <h1 className="text-4xl font-bold tracking-tight text-white mb-2">대시보드</h1>
   <p className="text-sm font-medium text-gray-400">나의 주식 자산과 투자 기록을 한눈에 파악합니다.</p>
  </div>
  <Button onClick={() => handleOpenAddModal('HOLDING')} className="shadow-lg shadow-primary-500/20 h-12 px-6">
   <PlusCircle size={20} className="mr-2" />
   <span>종목 추가</span>
  </Button>
  </header>

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

  {/* Portfolio & Watchlist Section */}
  <PortfolioSection 
  holdingStocks={holdingStocks}
  watchlistStocks={stocks.filter(s => s.status === 'WATCHLIST')}
  memos={memos}
  onAddClick={handleOpenAddModal}
  />

  {/* Recent Memos Section */}
  <RecentMemosSection 
  recentMemos={recentMemos}
  stocks={stocks}
  />

  {/* Stock Addition Modal */}
  <StockModal 
  isOpen={isStockModalOpen} 
  onClose={() => setIsStockModalOpen(false)} 
  initialStatus={modalInitialStatus}
  />
 </div>
 );
}
