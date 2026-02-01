import { useState } from 'react';
import { ActionModal, Input, Badge, FormField, FormLabel, FormSelect } from '../../components/ui';
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
      <div className="space-y-6">
        {/* 1. 상태 탭 */}
        <FormField>
          <FormLabel>상태</FormLabel>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
            {(['HOLDING', 'WATCHLIST', 'PARTIAL_SOLD', 'SOLD'] as const).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setStatus(s)}
                className={cn(
                  "h-10 px-4 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2",
                  status === s
                    ? "bg-primary-500 text-white border-2 border-primary-500"
                    : "bg-gray-900/80 text-gray-400 border-2 border-gray-700 hover:bg-gray-900 hover:border-gray-600 hover:text-gray-300"
                )}
              >
                <Badge 
                  status={s} 
                  className="p-0 bg-transparent"
                />
              </button>
            ))}
          </div>
        </FormField>

        {/* 2. 종목명, 종목코드, 연결계좌 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            label="종목명"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            size="lg"
            className="bg-gray-950 border-gray-800"
          />
          <Input
            label="종목코드 (선택)"
            value={symbol}
            onChange={(e) => setSymbol(e.target.value)}
            size="lg"
            className="bg-gray-950 border-gray-800"
            placeholder="예: 005930"
          />
          {status !== 'WATCHLIST' && (
            <FormField>
              <FormLabel required>연결 계좌</FormLabel>
              <FormSelect
                value={accountId}
                onChange={(e) => setAccountId(e.target.value)}
                required
                size="lg"
              >
                <option value="">계좌 선택 (필수)</option>
                {accounts.map(a => (
                  <option key={a.id} value={a.id}>{a.brokerName}</option>
                ))}
              </FormSelect>
            </FormField>
          )}
        </div>

        {/* 3. 보유수량, 평균단가, 현재가 */}
        {status !== 'WATCHLIST' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              label="보유 수량"
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              min="1"
              required
              size="lg"
              className="bg-gray-950 border-gray-800"
            />
            <Input
              label="평균 단가 (원)"
              type="number"
              value={avgPrice}
              onChange={(e) => setAvgPrice(Number(e.target.value))}
              min="1"
              required
              size="lg"
              className="bg-gray-950 border-gray-800"
            />
            <Input
              label="현재가 (원)"
              type="number"
              value={currentPrice}
              onChange={(e) => setCurrentPrice(Number(e.target.value))}
              min="0"
              required
              size="lg"
              className="bg-gray-950 border-gray-800"
            />
          </div>
        )}
      </div>
    </ActionModal>
  );
}
