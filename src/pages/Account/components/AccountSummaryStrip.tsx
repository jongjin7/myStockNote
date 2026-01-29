import { Card, Badge } from '../../../components/ui';
import { cn, formatCurrency } from '../../../lib/utils';

interface AccountSummaryStripProps {
  totalInvested: number;
  totalProfit: number;
  totalProfitRate: number;
  cashBalance: number;
}

export function AccountSummaryStrip({ 
  totalInvested, 
  totalProfit, 
  totalProfitRate, 
  cashBalance 
}: AccountSummaryStripProps) {
  return (
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
        <div className="text-2xl font-bold text-white tabular-nums">{formatCurrency(cashBalance)}</div>
      </Card>
    </div>
  );
}
