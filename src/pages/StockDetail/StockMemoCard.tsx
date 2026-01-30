import { Pencil, Activity, AlertCircle, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, Badge } from '../../components/ui';
import { formatDateTime } from '../../lib/utils';
import type { StockMemo } from '../../types';

interface StockMemoCardProps {
  memo: StockMemo;
  isWatchlist: boolean;
}

export function StockMemoCard({ memo, isWatchlist }: StockMemoCardProps) {
  return (
    <div className="relative pl-14 pb-12 last:pb-0">
      <div className="absolute left-4 top-2 w-4 h-4 rounded-full bg-gray-950 border-2 border-gray-700 transition-all z-10 shadow-[0_0_10px_rgba(0,0,0,0.5)]" />

      <Card className="border-gray-800 bg-gray-900/30 p-8 rounded-3xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Badge variant={memo.type === 'PURCHASE' ? 'success' : memo.type === 'SELL' ? 'danger' : 'info'}>
              {memo.type === 'PURCHASE' ? '매수 기록' : memo.type === 'SELL' ? '매도 기록' : '일반 메모'}
            </Badge>
            <span className="text-xs font-bold text-gray-500 uppercase tracking-widest ">
              {formatDateTime(new Date(memo.updatedAt))}
            </span>
          </div>
          <Link
            to={`/memos/${memo.id}/edit`}
            className="p-2 text-gray-600 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
          >
            <Pencil size={16} />
          </Link>
        </div>

        <div className="space-y-6">
          {memo.buyReason && (
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">
                {isWatchlist ? '분석 및 관심 사유' : '매수 판단 근거'}
              </p>
              <p className="text-sm text-gray-200 leading-relaxed font-medium">{memo.buyReason}</p>
            </div>
          )}

          {memo.expectedScenario && (
            <div className="py-4 border-y border-gray-800/30">
              <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-3 flex items-center">
                <Activity size={12} className="mr-2 text-primary-500/70" />
                EXPECTED SCENARIO
              </p>
              <p className="text-sm text-gray-300 leading-relaxed">{memo.expectedScenario}</p>
            </div>
          )}

          {memo.risks && (
            <div className="flex items-start gap-3 p-4 bg-danger/5 rounded-xl border border-danger/10">
              <AlertCircle size={16} className="text-danger shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-danger/70 uppercase tracking-widest mb-1.5">리스크 분석</p>
                <p className="text-xs text-gray-400 leading-relaxed">{memo.risks}</p>
              </div>
            </div>
          )}

          {memo.currentThought && (
            <div className="bg-gray-950/50 p-6 rounded-2xl border border-gray-800/50 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-3 opacity-5">
                <TrendingUp size={48} />
              </div>
              <p className="text-sm font-bold text-primary-400 uppercase tracking-widest mb-3">
                {isWatchlist ? '리서치 메모' : '현재 보유 관점'}
              </p>
              <p className="text-sm text-gray-300 italic font-medium">"{memo.currentThought}"</p>
            </div>
          )}

          {memo.sellReview && (
            <div className="bg-danger/5 p-6 rounded-3xl border border-danger/20">
              <p className="text-sm font-bold text-danger-light uppercase tracking-widest mb-3">매매 복기 (Sell Review)</p>
              <p className="text-sm text-gray-300 leading-relaxed">{memo.sellReview}</p>
            </div>
          )}

          {!memo.buyReason && !memo.currentThought && !memo.sellReview && (
            <p className="text-sm text-gray-600 italic font-medium">내용이 비어 있는 노트입니다.</p>
          )}
        </div>
      </Card>
    </div>
  );
}
