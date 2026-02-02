import { useNavigate } from 'react-router-dom';
import { Bookmark, LayoutDashboard } from 'lucide-react';
import { StockList } from '../../components/StockList';
import type { Stock, StockMemo, Account } from '../../types';
import { PortfolioSummaryCard } from './PortfolioSummaryCard';

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
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 xl:gap-12">
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
