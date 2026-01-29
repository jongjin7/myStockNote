import { useSearchParams } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { LayoutDashboard, WalletCards } from 'lucide-react';
import { PageHeader, Badge, Tabs } from '../components/ui';
import { StockList } from '../components/StockList';
import { cn, formatCurrency } from '../lib/utils';

export default function Holdings() {
  const { data } = useApp();
  const { stocks, memos, accounts } = data;
  const [searchParams, setSearchParams] = useSearchParams();
  const activeAccountId = searchParams.get('accountId') || 'all';

  // 계좌 필터링 로직
  const holdingStocks = stocks.filter(s => {
    const isHolding = s.status === 'HOLDING' || s.status === 'PARTIAL_SOLD';
    if (!isHolding) return false;
    if (activeAccountId === 'all') return true;
    return s.accountId === activeAccountId;
  });

  // 탭 아이템 구성
  const tabItems = [
    { id: 'all', label: '전체 보유', count: stocks.filter(s => s.status === 'HOLDING' || s.status === 'PARTIAL_SOLD').length },
    ...accounts.map(acc => ({
      id: acc.id,
      label: acc.brokerName,
      count: stocks.filter(s => s.accountId === acc.id && (s.status === 'HOLDING' || s.status === 'PARTIAL_SOLD')).length
    }))
  ];

  const handleTabChange = (id: string) => {
    if (id === 'all') {
      searchParams.delete('accountId');
    } else {
      searchParams.set('accountId', id);
    }
    setSearchParams(searchParams);
  };

  // 전체 자산 데이터 합산 계산
  const totalInvested = holdingStocks.reduce((acc, curr) => acc + (curr.quantity * curr.avgPrice), 0);
  const totalEvaluation = holdingStocks.reduce((acc, curr) => {
    const currentPrice = curr.currentPrice || curr.avgPrice;
    return acc + (curr.quantity * currentPrice);
  }, 0);
  const totalProfit = totalEvaluation - totalInvested;
  const totalProfitRate = totalInvested > 0 ? (totalProfit / totalInvested) * 100 : 0;
  
  // 선택된 탭에 따른 현금 잔액 필터링
  const totalCash = accounts
    .filter(a => activeAccountId === 'all' || a.id === activeAccountId)
    .reduce((acc, a) => acc + (Number(a.cashBalance) || 0), 0);
  
  const totalAssets = totalCash + totalEvaluation;
  const activeTabLabel = tabItems.find(t => t.id === activeAccountId)?.label || '보유 종목';

  return (
    <div className="space-y-10 animate-fade-in max-w-6xl mx-auto">
      <PageHeader 
        title="보유 종목"
        subtitle="Holdings"
        description={activeAccountId === 'all' ? "모든 계좌의 보유 자산을 통합하여 관리합니다." : `${activeTabLabel} 계좌의 보유 자산 현황입니다.`}
        extra={
          <div className="text-right">
            <div className="text-sm font-black text-gray-500 uppercase tracking-[0.2em] mb-1">
              {activeAccountId === 'all' ? '총 운용 자산' : '계좌 총 자산'}
            </div>
            <div className="text-4xl font-black text-white tracking-tighter tabular-nums">
              {formatCurrency(totalAssets)}
            </div>
          </div>
        }
      />

      {/* Asset Control Hub Area */}
      <div className="space-y-8 relative">
        {/* Subtle Background Accent */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-3/4 h-64 bg-primary-500/5 blur-[120px] pointer-events-none rounded-full" />
        
        <div className="space-y-8 relative z-10">
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <div className="text-[11px] font-black text-gray-500 uppercase tracking-[0.3em]">Portfolio Filter | 필터링</div>
            </div>
            <Tabs 
              items={tabItems} 
              activeId={activeAccountId} 
              onTabChange={handleTabChange} 
              className="w-fit"
            />
          </div>
          
          {/* 자산 요약 섹션 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-900/40 border border-gray-800 p-8 rounded-[2.5rem] backdrop-blur-sm hover:border-white/10 hover:bg-gray-900/60 transition-all duration-500 group">
              <div className="text-[10px] font-black text-gray-600 uppercase tracking-[0.2em] mb-3 group-hover:text-gray-400 transition-colors">투자 원금 (Principal)</div>
              <div className="text-3xl font-black text-white tabular-nums tracking-tighter group-hover:scale-[1.02] transition-transform origin-left">{formatCurrency(totalInvested)}</div>
            </div>
            
            <div className={cn(
              "p-8 rounded-[2.5rem] border border-white/[0.05] backdrop-blur-md transition-all duration-500 hover:scale-[1.02] cursor-default",
              totalProfit >= 0 ? "bg-danger/10 hover:bg-danger/[0.12] hover:border-danger/20" : "bg-info/10 hover:bg-info/[0.12] hover:border-info/20"
            )}>
              <div className="flex justify-between items-start mb-3">
                <div className="text-[10px] font-black text-gray-600 uppercase tracking-[0.2em]">통합 수익 (P/L)</div>
                <Badge 
                  variant={totalProfit >= 0 ? 'danger' : 'info'} 
                  className="text-[10px] font-black px-2.5 py-1 rounded-lg shadow-lg"
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

            <div className="bg-gray-900/40 border border-gray-800 p-8 rounded-[2.5rem] backdrop-blur-sm hover:border-primary-500/30 hover:bg-gray-900/60 transition-all duration-500 group">
              <div className="text-[10px] font-black text-primary-500 uppercase tracking-[0.2em] mb-3 opacity-60 group-hover:opacity-100 transition-opacity">보유 현금 (Cash)</div>
              <div className="text-3xl font-black text-white tabular-nums tracking-tighter group-hover:scale-[1.02] transition-transform origin-left">{formatCurrency(totalCash)}</div>
            </div>
          </div>
        </div>
      </div>

      <StockList 
        title={`${activeTabLabel} 리스트`}
        stocks={holdingStocks}
        memos={memos}
        icon={activeAccountId === 'all' ? LayoutDashboard : WalletCards}
        showSearch
        layout="grid"
        emptyMessage={activeAccountId === 'all' ? "현재 보유 중인 종목이 없습니다." : "이 계좌에 보유 중인 종목이 없습니다."}
      />
    </div>
  );
}
