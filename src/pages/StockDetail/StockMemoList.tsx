import { FileText, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SectionHeader, Button } from '../../components/ui';
import { StockMemoCard } from './StockMemoCard';
import type { StockMemo, Attachment } from '../../types';

interface StockMemoListProps {
  stockId: string;
  memos: StockMemo[];
  attachments: Attachment[];
  isWatchlist: boolean;
}

export function StockMemoList({ stockId, memos, attachments, isWatchlist }: StockMemoListProps) {
  return (
    <div className="lg:col-span-2 space-y-8">
      <SectionHeader
        icon={FileText}
        title="투자 노트 기록"
        count={memos.length}
        className="px-0"
      />

      <div className="space-y-6 relative">
        {memos.length > 0 && (
          <div className="absolute left-6 top-12 bottom-12 w-px bg-gray-800" />
        )}

        {memos.length > 0 ? (
          memos.map((memo) => (
            <StockMemoCard 
              key={memo.id} 
              memo={memo} 
              attachments={attachments.filter(a => a.memoId === memo.id)}
              isWatchlist={isWatchlist} 
            />
          ))
        ) : (
          <div className="bg-gray-900/10 border border-dashed border-gray-800 p-24 rounded-3xl text-center">
            <FileText size={48} className="mx-auto text-gray-800 mb-6" />
            <p className="text-gray-500 mb-8 font-bold">아직 작성된 투자 노트가 없습니다.</p>
            <Link to={`/stocks/${stockId}/memos/new`}>
              <Button variant="ghost" className="text-primary-500 font-bold">
                첫 투자 판단 기록하기 <ChevronRight size={18} className="ml-1" />
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
