import { useState } from 'react';
import { ActionModal, Input, Badge } from '../../components/ui';
import { cn } from '../../lib/utils';
import type { Stock, Account } from '../../types';

interface StockEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  stock: Stock;
  accounts: Account[];
  onUpdate: (updatedStock: Stock) => Promise<void>;
}

export function StockEditModal({ isOpen, onClose, stock, accounts, onUpdate }: StockEditModalProps) {
  const [name, setName] = useState(stock.name);
  const [symbol, setSymbol] = useState(stock.symbol || '');
  const [status, setStatus] = useState(stock.status);
  const [accountId, setAccountId] = useState(stock.accountId || '');
  const [quantity, setQuantity] = useState(stock.quantity || 0);
  const [avgPrice, setAvgPrice] = useState(stock.avgPrice || 0);
  const [currentPrice, setCurrentPrice] = useState(stock.currentPrice || 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const updatedStock: Stock = {
      ...stock,
      name,
      symbol: symbol || null,
      status: status as any,
      accountId: status === 'WATCHLIST' ? null : (accountId || null),
      quantity: status === 'WATCHLIST' ? 0 : quantity,
      avgPrice: status === 'WATCHLIST' ? 0 : avgPrice,
      currentPrice: status === 'WATCHLIST' ? 0 : currentPrice,
      updatedAt: Date.now(),
    };
    await onUpdate(updatedStock);
    onClose();
  };

  return (
    <ActionModal
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      title="종목 정보 수정"
      size="lg"
      submitLabel="정보 업데이트하기"
    >
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="종목명"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="bg-gray-950 border-gray-800"
          />
          <Input
            label="종목코드 (선택)"
            value={symbol}
            onChange={(e) => setSymbol(e.target.value)}
            className="bg-gray-950 border-gray-800"
            placeholder="예: 005930"
          />
        </div>

        <div className="space-y-3">
          <label className="text-sm font-bold text-gray-500 uppercase tracking-widest">상태</label>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 bg-gray-900/40 p-1.5 rounded-2xl border border-white/[0.03]">
            {(['HOLDING', 'WATCHLIST', 'PARTIAL_SOLD', 'SOLD'] as const).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setStatus(s)}
                className={cn(
                  "px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2",
                  status === s
                    ? "bg-gray-800 text-white shadow-lg border border-white/[0.08]"
                    : "text-gray-600 hover:text-gray-400 hover:bg-white/[0.02]"
                )}
              >
                <Badge status={s} className={status === s ? "bg-white/10 text-white p-0" : "bg-transparent p-0 text-gray-700"} />
              </button>
            ))}
          </div>
        </div>

        {status !== 'WATCHLIST' && (
          <>
            <div className="space-y-3">
              <label className="text-sm font-bold text-gray-500 uppercase tracking-widest">연결 계좌</label>
              <select
                value={accountId}
                onChange={(e) => setAccountId(e.target.value)}
                required
                className="w-full h-11 bg-gray-950 border border-gray-800 rounded-lg px-4 text-white focus:outline-none focus:ring-2 focus:ring-primary-500/40 appearance-none font-medium"
              >
                <option value="">계좌 선택 (필수)</option>
                {accounts.map(a => (
                  <option key={a.id} value={a.id}>{a.brokerName}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Input
                label="보유 수량"
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                min="1"
                required
                className="bg-gray-950 border-gray-800"
              />
              <Input
                label="평균 단가 (원)"
                type="number"
                value={avgPrice}
                onChange={(e) => setAvgPrice(Number(e.target.value))}
                min="1"
                required
                className="bg-gray-950 border-gray-800"
              />
              <Input
                label="현재가 (원)"
                type="number"
                value={currentPrice}
                onChange={(e) => setCurrentPrice(Number(e.target.value))}
                min="0"
                required
                className="bg-gray-950 border-gray-800"
              />
            </div>
          </>
        )}
      </div>
    </ActionModal>
  );
}
