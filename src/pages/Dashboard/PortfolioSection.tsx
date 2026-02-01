import { useNavigate } from 'react-router-dom';
import { Bookmark, LayoutDashboard, ArrowUpRight, ArrowDownRight, Activity } from 'lucide-react';
import { Badge, SectionHeader } from '../../components/ui';
import { StockList } from '../../components/StockList';
import type { Stock, StockMemo, Account } from '../../types';

// 포트폴리오 요약 카드 컴포넌트
/**
 * 1. 왼쪽: 퍼포먼스 스냅샷 컴포넌트
 */
function PerformanceSnapshot({ 
  holdingCount, 
  profitableCount, 
  losingCount, 
  winRate 
}: { 
  holdingCount: number; 
  profitableCount: number; 
  losingCount: number; 
  winRate: number; 
}) {
  return (
    <div className="flex items-center gap-10">
      <div className="flex flex-col justify-center items-center">
        <span className="text-6xl font-bold text-white tracking-tighter leading-none">
          {holdingCount}
        </span>
        <span className="text-base font-medium text-gray-500 mt-2 uppercase tracking-[0.2em]">보유 종목</span>
      </div>
      
      <div className="flex gap-6 border-l border-white/5 pl-10">
        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5 text-danger-light">
            <ArrowUpRight size={14} strokeWidth={3} />
            <span className="text-sm uppercase tracking-wide">수익 종목</span>
          </div>
          <p className="text-3xl font-semibold text-white tabular-nums leading-none">{profitableCount}</p>
        </div>
        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5 text-info-light">
            <ArrowDownRight size={14} strokeWidth={3} />
            <span className="text-sm uppercase tracking-wide">손실 종목</span>
          </div>
          <p className="text-3xl font-semibold text-white tabular-nums leading-none">{losingCount}</p>
        </div>
      </div>

      <div className="ml-auto">
        <div className="flex flex-col items-center">
          <Badge variant="success" className="bg-success/15 text-success-light border-success/20 px-3 py-1 text-xs font-medium rounded-xl">
            승률 {winRate.toFixed(0)}%
          </Badge>
        </div>
      </div>
    </div>
  );
}

/**
 * 2. 오른쪽: 운용 인사이트 컴포넌트
 */
function AllocationInsight({ 
  accountCount, 
  winRate, 
  profitableCount, 
  losingCount, 
  holdingCount 
}: { 
  accountCount: number; 
  winRate: number; 
  profitableCount: number; 
  losingCount: number; 
  holdingCount: number; 
}) {
  return (
    <div className="@[800px]:border-l border-white/5 @[800px]:pl-12 space-y-7">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex flex-col">
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-bold text-white tabular-nums">{accountCount}</span>
              <span className="text-xs font-bold text-gray-400">개 계좌 운용</span>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-xs font-bold text-gray-600 uppercase tracking-[0.2em] leading-none mb-1">포트폴리오 균형</span>
          <span className="text-xs font-bold text-white/50">{winRate.toFixed(1)}% 활성</span>
        </div>
      </div>

      <div className="space-y-2.5">
        <div className="h-2 w-full bg-white/5 rounded-full flex overflow-hidden p-0.5 border border-white/5">
          <div 
            className="h-full bg-danger rounded-full transition-all duration-1000 shadow-[0_0_12px_rgba(239,68,68,0.2)]" 
            style={{ width: `${(profitableCount / Math.max(holdingCount, 1)) * 100}%` }} 
          />
          <div 
            className="h-full bg-info rounded-full ml-0.5 transition-all duration-1000 shadow-[0_0_12px_rgba(59,130,246,0.2)]" 
            style={{ width: `${(losingCount / Math.max(holdingCount, 1)) * 100}%` }} 
          />
        </div>
        <div className="flex justify-between text-xs font-bold text-gray-600 uppercase tracking-widest pt-1">
          <span className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-danger" /> 수익 비율</span>
          <span className="flex items-center gap-1">손실 비율 <div className="w-1.5 h-1.5 rounded-full bg-info" /></span>
        </div>
      </div>
    </div>
  );
}

/**
 * 3. 메인 포트폴리오 요약 카드 컴포넌트
 */
function PortfolioSummaryCard({ 
  holdingStocks, 
  accounts 
}: { 
  holdingStocks: Stock[]; 
  accounts: Account[]; 
}) {
  const profitableStocks = holdingStocks.filter(s => {
    const currentPrice = s.currentPrice || s.avgPrice;
    return currentPrice > s.avgPrice;
  }).length;

  const losingStocks = Math.max(holdingStocks.length - profitableStocks, 0);
  const winRate = holdingStocks.length > 0 ? (profitableStocks / holdingStocks.length) * 100 : 0;

  return (
    <div className="@container bg-gray-900/40 backdrop-blur-sm border border-gray-800/50 rounded-3xl p-8 flex flex-col relative overflow-hidden group/card shadow-2xl">
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/5 blur-[100px] -mr-32 -mt-32 pointer-events-none" />
      
      <SectionHeader 
        icon={Activity}
        title="포트폴리오 현황"
        className="mb-4 px-0 border-none relative z-10"
      />

      <div className="relative z-10 px-2">
        <div className="grid grid-cols-1 @[800px]:grid-cols-2 gap-12 items-center">
          <PerformanceSnapshot 
            holdingCount={holdingStocks.length}
            profitableCount={profitableStocks}
            losingCount={losingStocks}
            winRate={winRate}
          />

          <AllocationInsight 
            accountCount={accounts.length}
            winRate={winRate}
            profitableCount={profitableStocks}
            losingCount={losingStocks}
            holdingCount={holdingStocks.length}
          />
        </div>
      </div>

      <Activity 
        size={160} 
        className="absolute right-[-20px] bottom-[-30px] text-white/[0.01] -rotate-12 transition-transform duration-1000 group-hover/card:rotate-0 pointer-events-none" 
      />
    </div>
  );
}

interface PortfolioSectionProps {
  holdingStocks: Stock[];
  watchlistStocks: Stock[];
  memos: StockMemo[];
  accounts: Account[];
}

export function PortfolioSection({ holdingStocks, watchlistStocks, memos, accounts }: PortfolioSectionProps) {
  const navigate = useNavigate();

  return (
    <div className="space-y-12 px-4 pb-20">
      {/* 1. 상단 요약 요약 카드 */}
      <PortfolioSummaryCard 
        holdingStocks={holdingStocks} 
        accounts={accounts} 
      />

      {/* 2. 상세 리스트 섹션 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <StockList 
          icon={LayoutDashboard}
          title="보유 리스트"
          stocks={holdingStocks}
          memos={memos}
          onAddClick={() => navigate('/holdings')}
          emptyMessage="보유 중인 종목이 없습니다."
          compact
        />
        <StockList 
          icon={Bookmark}
          title="관심 리스트"
          stocks={watchlistStocks}
          memos={memos}
          onAddClick={() => navigate('/watchlist')}
          emptyMessage="관심 종목이 없습니다."
          compact
        />
      </div>
    </div>
  );
}
