import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../../contexts/AppContext';
import { 
  LayoutDashboard, AlertCircle
} from 'lucide-react';
import { Card, Button, BackButton, PageHeader, Badge } from '../../components/ui';
import { cn, formatCurrency } from '../../lib/utils';
import { StockList } from '../../components/StockList';

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

      {/* Account Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-900/40 border border-gray-800 p-8 rounded-[2rem]">
          <div className="text-[10px] font-black text-gray-600 uppercase tracking-[0.2em] mb-2">원화 투자 원금</div>
          <div className="text-3xl font-black text-white tabular-nums tracking-tighter">{formatCurrency(totalInvested)}</div>
        </div>
        
        <div className={cn(
          "p-8 rounded-[2rem] border border-white/[0.05]",
          totalProfit >= 0 ? "bg-danger/10" : "bg-info/10"
        )}>
          <div className="flex justify-between items-start mb-2">
            <div className="text-[10px] font-black text-gray-600 uppercase tracking-[0.2em]">계좌 누적 수익</div>
            <Badge 
              variant={totalProfit >= 0 ? 'danger' : 'info'} 
              className="text-[10px] font-black px-2 py-0.5 rounded-lg"
            >
              {totalProfit >= 0 ? '+' : ''}{totalProfitRate.toFixed(2)}%
            </Badge>
          </div>
          <div className={cn(
            "text-3xl font-black tabular-nums tracking-tighter leading-none",
            totalProfit >= 0 ? "text-danger-light" : "text-info-light"
          )}>
            {totalProfit >= 0 ? '+' : ''}{formatCurrency(totalProfit)}
          </div>
        </div>

        <div className="bg-gray-900/40 border border-gray-800 p-8 rounded-[2rem]">
          <div className="text-[10px] font-black text-primary-500 uppercase tracking-[0.2em] mb-2">계좌 예수금 (CASH)</div>
          <div className="text-3xl font-black text-white tabular-nums tracking-tighter">{formatCurrency(account.cashBalance)}</div>
        </div>
      </div>

      {/* Stock List */}
      <StockList 
        title="보유 종목"
        stocks={accountStocks}
        memos={memos}
        icon={LayoutDashboard}
        emptyMessage="해당 계좌에 보유 중인 종목이 없습니다."
      />
    </div>
  );
}
