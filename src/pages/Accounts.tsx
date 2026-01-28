import { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { PlusCircle, Pencil, Trash2, Wallet } from 'lucide-react';
import type { Account } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { 
  Card,
  Button, Input, Textarea, Modal, ModalBody, ModalFooter 
} from '../components/ui';
import { formatCurrency, formatDateTime } from '../lib/utils';

export default function Accounts() {
  const { data, actions } = useApp();
  const { accounts } = data;

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
    if (window.confirm('정말 삭제하시겠습니까? 해당 계좌에 연결된 종목들의 계좌 정보가 초기화됩니다.')) {
      await actions.deleteAccount(id);
    }
  };


  return (
    <div className="space-y-10 animate-fade-in">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-white mb-2">계좌 관리</h1>
          <p className="text-sm font-medium text-gray-400">증권사별 계좌와 예수금을 수동으로 관리하세요.</p>
        </div>
        <Button onClick={() => openModal()} className="shadow-lg shadow-primary-500/10">
          <PlusCircle size={20} className="mr-2" />
          <span>새 계좌 추가</span>
        </Button>
      </header>

      {/* Account List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {accounts.length > 0 ? (
          accounts.map((account) => (
            <Card key={account.id} className="group border-gray-800 bg-gray-900/40 backdrop-blur-sm p-8">
              <div className="flex items-start justify-between mb-8">
                <div className="p-4 bg-primary-500/10 text-primary-500 rounded-2xl">
                  <Wallet size={28} />
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => openModal(account)}
                    className="p-2 h-auto text-gray-400 hover:text-white"
                  >
                    <Pencil size={18} />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleDelete(account.id)}
                    className="p-2 h-auto text-gray-400 hover:text-danger"
                  >
                    <Trash2 size={18} />
                  </Button>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2 tracking-tight">{account.brokerName}</h3>
                  <p className="text-sm text-gray-500 h-10 line-clamp-2">
                    {account.memo || '기록된 메모가 없습니다.'}
                  </p>
                </div>
                
                <div className="pt-6 border-t border-gray-800">
                  <div className="text-[10px] font-bold text-gray-500 mb-2 uppercase tracking-widest">예수금 잔액</div>
                  <div className="text-3xl font-bold text-white tracking-tight">
                    {formatCurrency(account.cashBalance)}
                  </div>
                </div>

                <div className="text-[10px] text-gray-600 pt-2 flex justify-between border-t border-gray-800/50">
                  <span className="font-bold uppercase tracking-widest">최종 업데이트</span>
                  <span className="font-mono">{formatDateTime(new Date(account.updatedAt))}</span>
                </div>
              </div>
            </Card>
          ))
        ) : (
          <div className="col-span-full bg-gray-900/20 border border-dashed border-gray-800 p-20 rounded-3xl text-center">
            <div className="inline-flex p-6 bg-gray-900/50 rounded-full text-gray-700 mb-6 font-bold">
              <Wallet size={64} />
            </div>
            <h3 className="text-2xl font-bold text-gray-400 mb-2">등록된 계좌가 없습니다.</h3>
            <p className="text-gray-600 mb-10 max-w-sm mx-auto">증권사별 계좌를 추가하고 전체 예수금 흐름을 한곳에서 파악해 보세요.</p>
            <Button onClick={() => openModal()} size="lg">
              <PlusCircle size={20} className="mr-2" />
              <span>첫 계좌 만들기</span>
            </Button>
          </div>
        )}
      </div>

      {/* Account Add/Edit Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={closeModal}
        title={editingAccount ? '계좌 정보 수정' : '새 계좌 추가'}
      >
        <form onSubmit={handleSubmit}>
          <ModalBody>
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
          </ModalBody>
          <ModalFooter>
            <Button variant="secondary" type="button" onClick={closeModal}>
              취소
            </Button>
            <Button type="submit">
              {editingAccount ? '변경사항 저장' : '계좌 추가하기'}
            </Button>
          </ModalFooter>
        </form>
      </Modal>
    </div>
  );
}
