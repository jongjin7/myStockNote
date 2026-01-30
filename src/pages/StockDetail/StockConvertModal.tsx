import { useState } from 'react';
import { Info } from 'lucide-react';
import { ActionModal, Input } from '../../components/ui';
import type { Account } from '../../types';

interface StockConvertModalProps {
  isOpen: boolean;
  onClose: () => void;
  accounts: Account[];
  hasGeneralMemo: boolean;
  onConvert: (data: {
    targetAccountId: string;
    buyQuantity: number;
    buyPrice: number;
    shouldCopyMemo: boolean;
  }) => Promise<void>;
}

export function StockConvertModal({ 
  isOpen, 
  onClose, 
  accounts, 
  hasGeneralMemo, 
  onConvert 
}: StockConvertModalProps) {
  const [targetAccountId, setTargetAccountId] = useState('');
  const [buyQuantity, setBuyQuantity] = useState<number>(0);
  const [buyPrice, setBuyPrice] = useState<number>(0);
  const [shouldCopyMemo, setShouldCopyMemo] = useState(true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetAccountId || buyQuantity <= 0 || buyPrice <= 0) return;
    
    await onConvert({
      targetAccountId,
      buyQuantity,
      buyPrice,
      shouldCopyMemo
    });
    onClose();
  };

  return (
    <ActionModal
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      title="보유 종목으로 전환 (매수 확정)"
      submitLabel="전환 완료 및 매수 기록"
    >
      <div className="space-y-8">
        <div className="p-4 bg-info/5 border border-info/20 rounded-2xl flex items-start gap-4">
          <Info size={20} className="text-info shrink-0 mt-1" />
          <div className="text-sm text-gray-400 leading-relaxed">
            관심 종목을 실제 보유 종목으로 전환합니다. <br />
            매수 정보를 입력하면 <span className="text-info font-bold">HOLDING</span> 상태로 변경됩니다.
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-3">
            <label className="text-sm font-bold text-gray-500 uppercase tracking-widest">입고 계좌 선택</label>
            <select
              value={targetAccountId}
              onChange={(e) => setTargetAccountId(e.target.value)}
              required
              className="w-full h-12 bg-gray-950 border border-gray-800 rounded-xl px-4 text-white focus:outline-none focus:ring-2 focus:ring-primary-500/40 appearance-none font-bold"
            >
              <option value="">계좌를 선택하세요</option>
              {accounts.map(a => (
                <option key={a.id} value={a.id}>{a.brokerName}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <Input
              label="매수 수량"
              type="number"
              value={buyQuantity}
              onChange={(e) => setBuyQuantity(Number(e.target.value))}
              min="1"
              required
              placeholder="0"
              className="bg-gray-950 border-gray-800"
            />
            <Input
              label="매수 단가 (원)"
              type="number"
              value={buyPrice}
              onChange={(e) => setBuyPrice(Number(e.target.value))}
              min="1"
              required
              placeholder="0"
              className="bg-gray-950 border-gray-800"
            />
          </div>

          {hasGeneralMemo && (
            <label className="flex items-center gap-3 p-4 bg-gray-900/50 rounded-3xl border border-gray-800 cursor-pointer hover:bg-gray-900 hover:border-gray-700 transition-all">
              <input
                type="checkbox"
                checked={shouldCopyMemo}
                onChange={(e) => setShouldCopyMemo(e.target.checked)}
                className="w-5 h-5 rounded-lg border-gray-700 bg-gray-950 text-primary-500 focus:ring-offset-gray-950"
              />
              <div className="flex flex-col">
                <span className="text-sm font-bold text-gray-200">최근 리서치 기록을 매수 이유로 가져오기</span>
                <span className="text-sm text-gray-500 mt-0.5">기존의 일반 노트를 매수 판단 근거로 자동 복사합니다.</span>
              </div>
            </label>
          )}
        </div>
      </div>
    </ActionModal>
  );
}
