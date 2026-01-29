import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../../contexts/AppContext';
import { 
  LayoutDashboard, AlertCircle
} from 'lucide-react';
import { Card, Button, BackButton, PageHeader, SectionHeader } from '../../components/ui';
import { formatCurrency } from '../../lib/utils';

import { AccountSummaryStrip } from './components/AccountSummaryStrip';
import { StockCard } from '../../components/StockCard';
import { StockEmptyState } from './components/StockEmptyState';

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
         <BackButton to="/accounts" label="Back to Accounts" uppercase />
         
         <PageHeader 
           title="계좌 상세"
           subtitle={account.brokerName}
           description="해당 계좌에 보유 중인 모든 종목 리스트입니다."
           extra={
             <div className="text-right">
               <div className="text-sm font-black text-gray-500 uppercase tracking-[0.2em] mb-1">계좌 총 자산</div>
               <div className="text-4xl font-black text-white tracking-tighter tabular-nums">
                 {formatCurrency(totalAssets)}
               </div>
             </div>
           }
         />
       </header>

      {/* Account Stats Strip */}
      <AccountSummaryStrip 
        totalInvested={totalInvested}
        totalProfit={totalProfit}
        totalProfitRate={totalProfitRate}
        cashBalance={account.cashBalance}
      />

      {/* Stock List */}
      <div className="space-y-6">
        <SectionHeader 
          icon={LayoutDashboard}
          title="보유 종목"
          count={accountStocks.length}
        />

        <div className="grid grid-cols-1 gap-4">
          {accountStocks.length > 0 ? (
            accountStocks.map((stock) => {
              const hasNote = memos.some(m => m.stockId === stock.id);
              return (
                <StockCard 
                  key={stock.id}
                  stock={stock}
                  hasNote={hasNote}
                />
              );
            })
          ) : (
            <StockEmptyState />
          )}
        </div>
      </div>
    </div>
  );
}
