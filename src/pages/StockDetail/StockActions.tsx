import { Plus, ExternalLink, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui';

interface StockActionsProps {
  stockId: string;
  isWatchlist: boolean;
  onConvert: () => void;
  onShowFlow: () => void;
}

export function StockActions({ stockId, isWatchlist, onConvert, onShowFlow }: StockActionsProps) {
  return (
    <div className="">
      <div className="flex flex-col gap-4">
        <Link to={`/stocks/${stockId}/memos/new`} className="w-full">
          <Button className="w-full h-12">
            <Plus size={20} className="mr-2" />
            <span>새 투자 노트 작성</span>
          </Button>
        </Link>
        <Button
          variant="secondary"
          onClick={onShowFlow}
          className="w-full h-12"
        >
          <TrendingUp size={18} className="mr-2" />
          <span>거래 플로우 시각화</span>
        </Button>
        {isWatchlist && (
          <Button
            variant="success"
            onClick={onConvert}
            className="w-full h-12"
          >
            <ExternalLink size={18} className="mr-2" />
            <span className="font-black">매수 확정하기 (전환)</span>
          </Button>
        )}
      </div>
    </div>
  );
}
