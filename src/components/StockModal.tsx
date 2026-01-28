import { useState, useEffect } from 'react';
import { useApp } from '../contexts/AppContext';
import { v4 as uuidv4 } from 'uuid';
import { 
  Modal, ModalBody, ModalFooter, 
  Button, Input, Badge, Card
} from './ui';
import { cn } from '../lib/utils';
import type { Stock, StockStatus } from '../types';

interface StockModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialStatus?: StockStatus;
}

export function StockModal({ isOpen, onClose, initialStatus = 'HOLDING' }: StockModalProps) {
  const { data, actions } = useApp();
  const { accounts } = data;

  const [name, setName] = useState('');
  const [symbol, setSymbol] = useState('');
  const [status, setStatus] = useState<StockStatus>(initialStatus);
  const [accountId, setAccountId] = useState('');
  const [quantity, setQuantity] = useState<number>(0);
  const [avgPrice, setAvgPrice] = useState<number>(0);
  const [currentPrice, setCurrentPrice] = useState<number>(0);

  useEffect(() => {
    if (isOpen) {
      setName('');
      setSymbol('');
      setStatus(initialStatus);
      setAccountId('');
      setQuantity(0);
      setAvgPrice(0);
      setCurrentPrice(0);
    }
  }, [isOpen, initialStatus]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newStock: Stock = {
      id: uuidv4(),
      name: name.trim(),
      symbol: symbol.trim() || null,
      status: status,
      accountId: status === 'WATCHLIST' ? null : (accountId || null),
      quantity: status === 'WATCHLIST' ? 0 : quantity,
      avgPrice: status === 'WATCHLIST' ? 0 : avgPrice,
      currentPrice: status === 'WATCHLIST' ? 0 : (currentPrice || avgPrice),
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    await actions.saveStock(newStock);
    onClose();
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
      title="종목 추가"
      size="lg"
    >
      <form onSubmit={handleSubmit}>
        <ModalBody>
          <div className="space-y-8">
            {/* Type Selection */}
            <div className="space-y-3">
              <label className="text-sm font-bold text-gray-500 uppercase tracking-widest">종목 구분</label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setStatus('HOLDING')}
                  className={cn(
                    "p-4 rounded-2xl border-2 transition-all text-left group",
                    status === 'HOLDING' || status === 'PARTIAL_SOLD' || status === 'SOLD'
                      ? "bg-success/10 border-success text-white shadow-lg shadow-success/10"
                      : "bg-gray-950 border-gray-800 text-gray-500 hover:border-gray-700"
                  )}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold">보유 종목</span>
                    <Badge status="HOLDING" className={status === 'HOLDING' ? "bg-success text-white" : "bg-gray-800 text-gray-600"} />
                  </div>
                  <p className="text-[10px] leading-relaxed text-gray-500 group-hover:text-gray-400">실제로 매수하여 보유 중인 자산</p>
                </button>

                <button
                  type="button"
                  onClick={() => setStatus('WATCHLIST')}
                  className={cn(
                    "p-4 rounded-2xl border-2 transition-all text-left group",
                    status === 'WATCHLIST'
                      ? "bg-info/10 border-info text-white shadow-lg shadow-info/10"
                      : "bg-gray-950 border-gray-800 text-gray-500 hover:border-gray-700"
                  )}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold">관심 종목</span>
                    <Badge status="WATCHLIST" className={status === 'WATCHLIST' ? "bg-info text-white" : "bg-gray-800 text-gray-600"} />
                  </div>
                  <p className="text-[10px] leading-relaxed text-gray-500 group-hover:text-gray-400">리서치 및 매수 대기 중인 종목</p>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input 
                label="종목명"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="예: 삼성전자, 엔비디아"
                required
                className="bg-gray-950 border-gray-800"
              />
              <Input 
                label="종목코드/심볼 (선택)"
                value={symbol}
                onChange={(e) => setSymbol(e.target.value)}
                placeholder="예: 005930, NVDA"
                className="bg-gray-950 border-gray-800"
              />
            </div>

            {status !== 'WATCHLIST' && (
              <div className="space-y-6 animate-slide-up">
                <div className="space-y-3">
                  <label className="text-sm font-bold text-gray-500 uppercase tracking-widest">연결 계좌</label>
                  <select 
                    value={accountId}
                    onChange={(e) => setAccountId(e.target.value)}
                    required
                    className="w-full h-12 bg-gray-950 border border-gray-800 rounded-xl px-4 text-white focus:outline-none focus:ring-2 focus:ring-primary-500/40 appearance-none font-medium transition-all"
                  >
                    <option value="">계좌를 선택하세요 (필수)</option>
                    {accounts.map(a => (
                      <option key={a.id} value={a.id}>{a.brokerName} ({a.cashBalance.toLocaleString()}원)</option>
                    ))}
                  </select>
                  {accounts.length === 0 && (
                    <p className="text-[10px] text-warning font-bold">등록된 계좌가 없습니다. 계좌 관리에서 먼저 생성해 주세요.</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input 
                    label="보유 수량"
                    type="number" 
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    min="0"
                    step="any"
                    required
                    className="bg-gray-950 border-gray-800"
                  />
                  <Input 
                    label="평균 단가 (원)"
                    type="number" 
                    value={avgPrice}
                    onChange={(e) => setAvgPrice(Number(e.target.value))}
                    min="0"
                    required
                    className="bg-gray-950 border-gray-800"
                  />
                </div>
              </div>
            )}
          </div>
        </ModalBody>
        <ModalFooter>
          <Button variant="secondary" type="button" onClick={onClose} className="border-gray-800">
            취소
          </Button>
          <Button type="submit" disabled={status !== 'WATCHLIST' && (!accountId || accounts.length === 0)}>
            종목 추가 완료
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  );
}
