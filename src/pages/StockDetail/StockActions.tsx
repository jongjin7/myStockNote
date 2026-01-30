import { Plus, Bookmark, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button, Card } from '../../components/ui';

interface StockActionsProps {
  stockId: string;
  isWatchlist: boolean;
  onConvert: () => void;
}

export function StockActions({ stockId, isWatchlist, onConvert }: StockActionsProps) {
  return (
    <Card className="border-primary-500/10 bg-primary-500/5 p-8 space-y-6 rounded-3xl">
      <h3 className="text-xs font-bold text-primary-400 flex items-center uppercase tracking-widest">
        <Bookmark size={14} className="mr-2" />
        주요 액션
      </h3>
      <div className="flex flex-col gap-4">
        <Link to={`/stocks/${stockId}/memos/new`} className="w-full">
          <Button className="w-full h-14 text-white shadow-lg shadow-primary-500/20">
            <Plus size={20} className="mr-2" />
            <span>새 투자 노트 작성</span>
          </Button>
        </Link>
        {isWatchlist && (
          <Button
            variant="success"
            onClick={onConvert}
            className="w-full h-14 shadow-lg shadow-success/20"
          >
            <ExternalLink size={18} className="mr-2" />
            <span className="font-black">매수 확정하기 (전환)</span>
          </Button>
        )}
      </div>
    </Card>
  );
}
