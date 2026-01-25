import { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { PlusCircle, Pencil, Trash2, Wallet, X } from 'lucide-react';
import type { Account } from '../types';
import { v4 as uuidv4 } from 'uuid';

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const accountData: Account = {
      id: editingAccount?.id || uuidv4(),
      brokerName: brokerName.trim() || 'Unknown Broker',
      cashBalance: cashBalance,
      memo: memo.trim() || null,
      createdAt: editingAccount?.createdAt || Date.now(),
      updatedAt: Date.now(),
    };

    actions.saveAccount(accountData);
    closeModal();
  };

  const handleDelete = (id: string) => {
    if (window.confirm('정말 삭제하시겠습니까? 해당 계좌에 연결된 종목들의 계좌 정보가 초기화됩니다.')) {
      actions.deleteAccount(id);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2">계좌 관리</h1>
          <p className="text-slate-400">증권사별 계좌와 예수금을 수동으로 관리하세요.</p>
        </div>
        <button 
          onClick={() => openModal()}
          className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl font-semibold transition-all shadow-lg shadow-blue-600/20 active:scale-95"
        >
          <PlusCircle size={20} />
          <span>새 계좌 추가</span>
        </button>
      </header>

      {/* Account List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {accounts.length > 0 ? (
          accounts.map((account) => (
            <div 
              key={account.id} 
              className="group bg-slate-900 border border-slate-800 p-6 rounded-2xl hover:border-slate-700 transition-all shadow-sm"
            >
              <div className="flex items-start justify-between mb-6">
                <div className="p-3 bg-blue-600/10 text-blue-500 rounded-xl">
                  <Wallet size={24} />
                </div>
                <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => openModal(account)}
                    className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                  >
                    <Pencil size={18} />
                  </button>
                  <button 
                    onClick={() => handleDelete(account.id)}
                    className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">{account.brokerName}</h3>
                  <p className="text-sm text-slate-500">
                    {account.memo || '기록된 메모가 없습니다.'}
                  </p>
                </div>
                
                <div className="pt-4 border-t border-slate-800">
                  <div className="text-xs font-medium text-slate-500 mb-1 uppercase tracking-wider">예수금</div>
                  <div className="text-2xl font-bold text-white">
                    {account.cashBalance.toLocaleString()} <span className="text-sm font-normal text-slate-400">원</span>
                  </div>
                </div>

                <div className="text-[10px] text-slate-600 pt-2 flex justify-between">
                  <span>최종 업데이트</span>
                  <span>{new Date(account.updatedAt).toLocaleString()}</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full bg-slate-900/50 border border-dashed border-slate-800 p-16 rounded-3xl text-center">
            <div className="inline-flex p-5 bg-slate-800/50 rounded-full text-slate-600 mb-4">
              <Wallet size={48} />
            </div>
            <h3 className="text-lg font-medium text-slate-400 mb-2">등록된 계좌가 없습니다.</h3>
            <p className="text-slate-500 text-sm mb-8">증권사 계좌를 추가하고 예수금을 관리해 보세요.</p>
            <button 
              onClick={() => openModal()}
              className="inline-flex items-center space-x-2 bg-slate-800 hover:bg-slate-700 text-white px-6 py-3 rounded-2xl font-semibold transition-colors border border-slate-700"
            >
              <PlusCircle size={20} />
              <span>첫 계좌 만들기</span>
            </button>
          </div>
        )}
      </div>

      {/* Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-6 border-b border-slate-800">
              <h2 className="text-xl font-bold text-white">
                {editingAccount ? '계좌 정보 수정' : '새 계좌 추가'}
              </h2>
              <button 
                onClick={closeModal}
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-400 ml-1">증권사명</label>
                <input 
                  type="text" 
                  value={brokerName}
                  onChange={(e) => setBrokerName(e.target.value)}
                  placeholder="예: 한국투자증권, 유안타증권"
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all placeholder:text-slate-700"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-400 ml-1">현재 예수금 (원)</label>
                <input 
                  type="number" 
                  value={cashBalance}
                  onChange={(e) => setCashBalance(Number(e.target.value))}
                  placeholder="0"
                  min="0"
                  step="1"
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all placeholder:text-slate-700"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-400 ml-1">메모 (선택)</label>
                <textarea 
                  value={memo}
                  onChange={(e) => setMemo(e.target.value)}
                  placeholder="계좌 번호나 용량 등 메모 입력"
                  rows={2}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all resize-none placeholder:text-slate-700"
                />
              </div>

              <div className="pt-4 flex gap-3">
                <button 
                  type="button" 
                  onClick={closeModal}
                  className="flex-1 px-4 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-semibold transition-colors"
                >
                  취소
                </button>
                <button 
                  type="submit" 
                  className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-semibold transition-all shadow-lg shadow-blue-600/20 active:scale-95"
                >
                  {editingAccount ? '변경사항 저장' : '계좌 추가'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
