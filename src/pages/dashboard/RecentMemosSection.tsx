import { ArrowRight, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card } from '../../components/ui';
import { formatRelativeTime } from '../../lib/utils';
import type { Stock, StockMemo } from '../../types';

interface RecentMemoItemProps {
  memo: StockMemo;
  stock?: Stock;
}

function RecentMemoItem({ memo, stock }: RecentMemoItemProps) {
  return (
    <Link to={`/stocks/${stock?.id}`}>
      <Card interactive className="p-8 border-gray-800/50 bg-gray-900/30 hover:bg-gray-900/50 relative overflow-hidden group transition-all duration-500">
        <div className="absolute top-0 right-0 w-24 h-24 bg-primary-500/5 -mr-6 -mt-6 rounded-full blur-2xl group-hover:bg-primary-500/10 transition-all duration-700" />
        
        <div className="flex items-center justify-between mb-6 relative z-10">
          <span className="text-sm font-black text-primary-400 tracking-wider uppercase">{stock?.name}</span>
          <div className="flex items-center gap-2 px-3 py-1 bg-gray-950 border border-gray-800/80 rounded-full font-num">
            <Clock size={10} className="text-gray-600" />
            <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest font-mono">
              {formatRelativeTime(new Date(memo.updatedAt))}
            </span>
          </div>
        </div>
        
        <p className="text-sm text-gray-400 font-medium leading-[1.8] line-clamp-3 mb-8 italic opacity-80 group-hover:opacity-100 transition-opacity">
          "{memo.buyReason || memo.currentThought || '기록된 투자 관련 코멘트가 없습니다.'}"
        </p>
        
        <div className="flex items-center text-[10px] font-black text-gray-600 group-hover:text-primary-400 transition-all gap-2 uppercase tracking-[0.2em]">
          <span>노트 상세 분석 보기</span>
          <ArrowRight size={12} className="group-hover:translate-x-2 transition-transform duration-300" />
        </div>
      </Card>
    </Link>
  );
}

interface RecentMemosSectionProps {
  recentMemos: StockMemo[];
  stocks: Stock[];
}

export function RecentMemosSection({ recentMemos, stocks }: RecentMemosSectionProps) {
  return (
    <section className="lg:col-span-2 space-y-8">
      <div className="flex items-center justify-between px-2">
        <h2 className="text-3xl font-black text-white tracking-tight">최근 투자 노트</h2>
      </div>

      <div className="space-y-6">
        {recentMemos.length > 0 ? (
          recentMemos.map((memo) => (
            <RecentMemoItem 
              key={memo.id} 
              memo={memo} 
              stock={stocks.find(s => s.id === memo.stockId)} 
            />
          ))
        ) : (
          <div className="bg-gray-950/20 border border-dashed border-gray-800/40 rounded-[24px] p-20 text-center">
            <p className="text-gray-700 text-[11px] font-black uppercase tracking-[0.3em] font-mono">기록 대기 중...</p>
          </div>
        )}
      </div>
    </section>
  );
}
