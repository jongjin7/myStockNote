import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../../contexts/AppContext';
import { 
  Wallet, LayoutDashboard, AlertCircle
} from 'lucide-react';
import { Card, Button, BackButton } from '../../components/ui';
import { formatCurrency } from '../../lib/utils';

import { AccountSummaryStrip } from './components/AccountSummaryStrip';
import { StockCard } from './components/StockCard';
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
      <AccountSummaryStrip 
        totalInvested={totalInvested}
        totalProfit={totalProfit}
        totalProfitRate={totalProfitRate}
        cashBalance={account.cashBalance}
      />

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
