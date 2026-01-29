import { Target } from 'lucide-react';
import { SectionHeader } from '../../components/ui';
import { formatNumber } from '../../lib/utils';

interface InvestmentMilestoneProps {
  totalAssets: number;
}

export function InvestmentMilestone({ totalAssets }: InvestmentMilestoneProps) {
  const targetGoal = 100000000; // 목표 1억 원 (기본값)
  const progress = Math.min((totalAssets / targetGoal) * 100, 100);
  const remaining = Math.max(targetGoal - totalAssets, 0);

  return (
    <div className="bg-primary-500/5 backdrop-blur-sm border border-primary-500/10 rounded-3xl p-8 h-full relative overflow-hidden group">
      {/* Background Decor */}
      <div className="absolute -right-10 -bottom-10 opacity-5 group-hover:opacity-10 transition-opacity">
        <Target size={180} />
      </div>

      <div className="relative z-10 flex flex-col h-full">
        <SectionHeader 
          icon={Target}
          title="투자 마일스톤"
          className="px-0 mb-8"
        />

        <div className="flex-1 flex flex-col justify-center">
          <div className="text-center mb-6">
            <div className="text-5xl font-black text-white tracking-tighter tabular-nums mb-1">
              {progress.toFixed(1)}<span className="text-2xl ml-1 text-primary-400">%</span>
            </div>
            <p className="text-sm font-bold text-gray-500 tracking-tight">목표 {formatNumber(targetGoal)}원 도달 현황</p>
          </div>

          <div className="space-y-4">
            <div className="h-4 w-full bg-white/5 rounded-full p-1 border border-white/5 shadow-inner">
              <div 
                className="h-full bg-gradient-to-r from-primary-600 to-primary-400 rounded-full transition-all duration-1000 ease-out relative"
                style={{ width: `${progress}%` }}
              >
                <div className="absolute inset-0 bg-white/20 animate-pulse rounded-full" />
              </div>
            </div>
            
            <div className="flex justify-between items-center text-[11px] font-black uppercase tracking-widest text-gray-600">
              <span>Current: ₩{formatNumber(totalAssets)}</span>
              <span className="text-primary-400/80">Goal Remaining: ₩{formatNumber(remaining)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
