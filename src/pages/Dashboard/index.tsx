import { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { formatNumber } from '../../lib/utils';
import type { Account, Stock, StockStatus } from '../../types';
import { PlusCircle } from 'lucide-react';
import { Button, PageHeader } from '../../components/ui';
import { StockModal } from '../../components/StockModal';

import { HeroStats } from './HeroStats';
import { PortfolioSection } from './PortfolioSection';
import { AssetAllocation } from './AssetAllocation';
import { BrokerDistribution } from './BrokerDistribution';
import { InvestmentMilestone } from './InvestmentMilestone';

export default function Dashboard() {
 const { data } = useApp();
 const { accounts, stocks } = data;

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


 return (
 <div className="space-y-12 animate-fade-in max-w-7xl mx-auto">
  {/* Dashboard Header */}
  <PageHeader 
   title="대시보드"
   subtitle="Dashboard"
   description="나의 주식 자산과 투자 기록을 한눈에 파악합니다."
   className="px-4"
   extra={
     <Button onClick={() => handleOpenAddModal('HOLDING')} className="shadow-lg shadow-primary-500/20 h-12 px-6">
       <PlusCircle size={20} className="mr-2" />
       <span>종목 추가</span>
     </Button>
   }
  />

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

  {/* Analysis Grid: Asset Allocation (1), Broker Distribution (2), Milestone (3) */}
  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 px-4 mb-12">
   <div className="lg:col-span-7">
    <AssetAllocation 
     holdingStocks={holdingStocks} 
     totalEvaluation={totalEvaluation} 
    />
   </div>
   <div className="lg:col-span-5 flex flex-col gap-8">
    <BrokerDistribution 
     accounts={accounts} 
     stocks={stocks} 
     totalAssets={totalAssets} 
    />
    <InvestmentMilestone 
     totalAssets={totalAssets} 
    />
   </div>
  </div>

  {/* Portfolio Summary Section */}
  <PortfolioSection 
   holdingStocks={holdingStocks}
   watchlistStocks={stocks.filter(s => s.status === 'WATCHLIST')}
   memos={data.memos}
   onAddClick={handleOpenAddModal}
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
