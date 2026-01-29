import { Link } from 'react-router-dom';
import { Wallet, Pencil, Trash2 } from 'lucide-react';
import { Card, Button } from '../../../components/ui';
import { formatCurrency, formatDateTime } from '../../../lib/utils';
import type { Account, Stock } from '../../../types';

interface AccountCardProps {
  account: Account;
  stocks: Stock[];
  onEdit: (account: Account) => void;
  onDelete: (id: string) => void;
}

export function AccountCard({ account, stocks, onEdit, onDelete }: AccountCardProps) {
  const accountStocks = stocks.filter(
    (s) => s.accountId === account.id && (s.status === 'HOLDING' || s.status === 'PARTIAL_SOLD')
  );

  return (
    <Card className="group border-gray-800 bg-gray-900/40 backdrop-blur-sm p-8 flex flex-col h-full">
      <div className="flex items-start justify-between mb-8">
        <div className="p-4 bg-primary-500/10 text-primary-500 rounded-2xl">
          <Wallet size={28} />
        </div>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => onEdit(account)}
            className="p-2 h-auto text-gray-400 hover:text-white"
          >
            <Pencil size={18} />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => onDelete(account.id)}
            className="p-2 h-auto text-gray-400 hover:text-danger"
          >
            <Trash2 size={18} />
          </Button>
        </div>
      </div>

      <div className="flex-1 space-y-6">
        <div>
          <h3 className="text-2xl font-bold text-white mb-2 tracking-tight">{account.brokerName}</h3>
          <p className="text-sm text-gray-500 h-10 line-clamp-2 leading-relaxed">
            {account.memo || '기록된 메모가 없습니다.'}
          </p>
        </div>
        
        <div className="grid grid-cols-2 gap-4 py-6 border-y border-gray-800/50">
          <div>
            <div className="text-sm font-bold text-gray-500 mb-1 uppercase tracking-widest">보유 종목</div>
            <div className="text-xl font-bold text-white">
              {accountStocks.length} <span className="text-xs text-gray-600 font-medium">개</span>
            </div>
          </div>
          <div>
            <div className="text-sm font-bold text-gray-500 mb-1 uppercase tracking-widest">최종 업데이트</div>
            <div className="text-[11px] text-gray-400 mt-1.5">
              {formatDateTime(new Date(account.updatedAt)).split(' ')[0]}
            </div>
          </div>
        </div>

        <div className="pt-2">
          <div className="text-sm font-bold text-gray-500 mb-2 uppercase tracking-widest">예수금 잔액 (CASH)</div>
          <div className="text-3xl font-black text-white tracking-tight">
            {formatCurrency(account.cashBalance)}
          </div>
        </div>
      </div>

      <div className="pt-8 grid grid-cols-2 gap-3 mt-auto">
        <Button 
          variant="secondary" 
          size="sm" 
          onClick={() => onEdit(account)} 
          className="rounded-xl font-bold text-[11px]"
        >
          예수금 수정
        </Button>
        <Link to={`/accounts/${account.id}/stocks`} className="w-full">
          <Button 
            variant="ghost" 
            size="sm" 
            className="w-full rounded-xl font-bold text-[11px] border border-gray-800 hover:bg-gray-800"
          >
            내 종목 보기
          </Button>
        </Link>
      </div>
    </Card>
  );
}
