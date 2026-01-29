import { Wallet, PlusCircle } from 'lucide-react';
import { Button } from '../../../components/ui';

interface AccountEmptyStateProps {
  onAdd: () => void;
}

export function AccountEmptyState({ onAdd }: AccountEmptyStateProps) {
  return (
    <div className="col-span-full bg-gray-900/20 border border-dashed border-gray-800 p-20 rounded-3xl text-center">
      <div className="inline-flex p-6 bg-gray-900/50 rounded-full text-gray-700 mb-6 font-bold">
        <Wallet size={64} />
      </div>
      <h3 className="text-2xl font-bold text-gray-400 mb-2">등록된 계좌가 없습니다.</h3>
      <p className="text-gray-600 mb-10 max-w-sm mx-auto">증권사별 계좌를 추가하고 전체 예수금 흐름을 한곳에서 파악해 보세요.</p>
      <Button onClick={onAdd} size="lg">
        <PlusCircle size={20} className="mr-2" />
        <span>첫 계좌 만들기</span>
      </Button>
    </div>
  );
}
