import { TrendingUp, FileText } from 'lucide-react';
import { Card } from '../../components/ui';

interface QuickStatsProps {
  holdingStocksCount: number;
  memosCount: number;
}

export function QuickStats({ holdingStocksCount, memosCount }: QuickStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <Card interactive className="p-8 border-gray-800/50 bg-gray-900/30 hover:bg-gray-900/50 group overflow-hidden relative">
        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
          <TrendingUp size={120} />
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-success/10 text-success rounded-2xl">
              <TrendingUp size={24} />
            </div>
            <span className="text-lg text-gray-500 uppercase tracking-[0.2em] font-sans font-black">Holdings | 운용 종목</span>
          </div>
          <div>
            <div className="text-5xl font-black text-white mb-2 tracking-tighter tabular-nums font-num">
              {holdingStocksCount} <span className="text-lg font-bold text-gray-500 uppercase ml-1 tracking-tight font-sans">개 종목</span>
            </div>
            <p className="text-sm text-gray-500 font-medium">현재 포트폴리오에서 운용 중인 투자 포지션</p>
          </div>
        </div>
      </Card>

      <Card interactive className="p-8 border-gray-800/50 bg-gray-900/30 hover:bg-gray-900/50 group overflow-hidden relative">
        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
          <FileText size={120} />
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-primary-500/10 text-primary-500 rounded-2xl">
              <FileText size={24} />
            </div>
            <span className="text-[11px] font-black text-gray-500 uppercase tracking-[0.2em] font-sans">Research | 투자 노트</span>
          </div>
          <div>
            <div className="text-5xl font-black text-white mb-2 tracking-tighter tabular-nums font-num">
              {memosCount} <span className="text-lg font-bold text-gray-500 uppercase ml-1 tracking-tight font-sans">개 메모</span>
            </div>
            <p className="text-sm text-gray-500 font-medium">기록된 투자 아이디어 및 매매 복기</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
