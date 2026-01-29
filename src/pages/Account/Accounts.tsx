import { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { PlusCircle } from 'lucide-react';
import type { Account } from '../../types';
import { v4 as uuidv4 } from 'uuid';
import { 
  Button, Input, Textarea, ActionModal, PageHeader 
} from '../../components/ui';
import { AccountCard } from './components/AccountCard';
import { AccountEmptyState } from './components/AccountEmptyState';

export default function Accounts() {
  const { data, actions } = useApp();
  const { accounts, stocks } = data;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);

  // Form states
  const [brokerName, setBrokerName] = useState('');
  const [cashBalance, setCashBalance] = useState<number>(0);
  const [memo, setMemo] = useState('');

  const openModal = (account?: Account) => {
    if (account) {
      setEditingAccount(account);
      setBrokerName(account.brokerName);
      setCashBalance(account.cashBalance);
      setMemo(account.memo || '');
    } else {
      setEditingAccount(null);
      setBrokerName('');
      setCashBalance(0);
      setMemo('');
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingAccount(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const accountData: Account = {
      id: editingAccount?.id || uuidv4(),
      brokerName: brokerName.trim() || 'Unknown Broker',
      cashBalance: cashBalance,
      memo: memo.trim() || null,
      createdAt: editingAccount?.createdAt || Date.now(),
      updatedAt: Date.now(),
    };

    await actions.saveAccount(accountData);
    closeModal();
  };

  const handleDelete = async (id: string) => {
    const linkedStocksCount = stocks.filter(s => s.accountId === id).length;
    const message = linkedStocksCount > 0 
      ? `이 계좌를 삭제하시겠습니까?\n\n연결된 ${linkedStocksCount}개의 종목들은 '관심 종목(WATCHLIST)' 상태로 전환되며 계좌 정보가 초기화됩니다.`
      : '이 계좌를 정말 삭제하시겠습니까?';

    if (window.confirm(message)) {
      await actions.deleteAccount(id);
    }
  };

  return (
   <div className="space-y-10 animate-fade-in">
    <PageHeader 
      title="계좌 관리"
      subtitle="Accounts"
      description="모든 자산은 KRW(원화)를 기준으로 하며, 증권사별 예수금을 관리합니다."
      extra={
        <Button onClick={() => openModal()} className="shadow-lg shadow-primary-500/10">
          <PlusCircle size={20} className="mr-2" />
          <span>새 계좌 추가</span>
        </Button>
      }
    />

      {/* Account List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {accounts.length > 0 ? (
          accounts.map((account) => (
            <AccountCard 
              key={account.id}
              account={account}
              stocks={stocks}
              onEdit={openModal}
              onDelete={handleDelete}
            />
          ))
        ) : (
          <AccountEmptyState onAdd={() => openModal()} />
        )}
      </div>

  {/* Account Add/Edit Modal */}
  <ActionModal 
  isOpen={isModalOpen} 
  onClose={closeModal}
  onSubmit={handleSubmit}
  title={editingAccount ? '계좌 정보 설정' : '새 계좌 추가'}
  submitLabel={editingAccount ? '변경사항 저장' : '계좌 추가하기'}
  >
  <div className="space-y-6">
   <Input 
   label="증권사명"
   value={brokerName}
   onChange={(e) => setBrokerName(e.target.value)}
   placeholder="예: 한국투자증권, 유안타증권"
   required
   className="bg-gray-950 border-gray-800"
   />

   <Input 
   label="현재 예수금 (원)"
   type="number" 
   value={cashBalance}
   onChange={(e) => setCashBalance(Number(e.target.value))}
   placeholder="0"
   min="0"
   required
   className="bg-gray-950 border-gray-800"
   />

   <Textarea 
   label="메모 (선택)"
   value={memo}
   onChange={(e) => setMemo(e.target.value)}
   placeholder="계좌 번호나 사용 목적 등을 자유롭게 기록하세요."
   maxLength={200}
   showCharCount
   className="bg-gray-950 border-gray-800"
   />
  </div>
  </ActionModal>
 </div>
 );
}
