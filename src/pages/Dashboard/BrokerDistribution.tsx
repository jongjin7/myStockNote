import { Landmark } from 'lucide-react';
import { SectionHeader } from '../../components/ui';
import { formatCurrency } from '../../lib/utils';
import type { Account, Stock } from '../../types';

interface BrokerDistributionProps {
  accounts: Account[];
  stocks: Stock[];
  totalAssets: number;
}

export function BrokerDistribution({ accounts, stocks, totalAssets }: BrokerDistributionProps) {
  // 계좌별 총 자산(현금 + 주식) 계산
  const accountStats = accounts.map(account => {
    const accountCash = Number(account.cashBalance) || 0;
    const accountStocksValue = stocks
      .filter(s => s.accountId === account.id && (s.status === 'HOLDING' || s.status === 'PARTIAL_SOLD'))
      .reduce((sum, s) => sum + (s.quantity * (s.currentPrice || s.avgPrice)), 0);
    
    return {
      name: account.brokerName,
      total: accountCash + accountStocksValue,
      percentage: totalAssets > 0 ? ((accountCash + accountStocksValue) / totalAssets) * 100 : 0
    };
  }).sort((a, b) => b.total - a.total);

  return (
    <div className="bg-gray-900/40 backdrop-blur-sm border border-gray-800/50 rounded-3xl p-8 h-full">
      <SectionHeader 
        icon={Landmark}
        title="계좌별 자산 분포"
        className="px-0 mb-8"
      />

      <div className="space-y-6">
        {accountStats.map((stat, index) => (
          <div key={index} className="space-y-2 group">
            <div className="flex justify-between items-end">
              <span className="text-sm font-semibold text-gray-400">{stat.name}</span>
              <span className="text-sm font-semibold text-white tabular-nums">{stat.percentage.toFixed(1)}%</span>
            </div>
            <div className="h-1.5 w-full bg-gray-800/50 rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary-500/60 rounded-full transition-all duration-1000 delay-300" 
                style={{ width: `${stat.percentage}%` }}
              />
            </div>
            <div className="text-xs text-gray-600">
              {formatCurrency(stat.total)} 투자 중
            </div>
          </div>
        ))}
        {accountStats.length === 0 && (
          <div className="text-center py-10 text-gray-600 text-sm font-medium">
            등록된 계좌 정보가 없습니다.
          </div>
        )}
      </div>
    </div>
  );
}
