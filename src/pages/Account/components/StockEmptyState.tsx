import { Link } from 'react-router-dom';
import { PlusCircle } from 'lucide-react';
import { Button } from '../../../components/ui';

export function StockEmptyState() {
  return (
    <div className="bg-gray-900/10 border border-dashed border-gray-800 p-20 rounded-3xl text-center">
      <PlusCircle size={48} className="mx-auto text-gray-800 mb-6" />
      <h3 className="text-xl font-bold text-gray-400 mb-2">보유 중인 종목이 없습니다.</h3>
      <p className="text-gray-600 mb-8 max-w-sm mx-auto text-sm">대시보드에서 종목을 추가할 때 이 계좌를 선택해 보세요.</p>
      <Link to="/">
        <Button variant="ghost" className="text-primary-500">대시보드로 가기</Button>
      </Link>
    </div>
  );
}
