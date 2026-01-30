import { useState, useEffect } from 'react';
import { useApp } from '../contexts/AppContext';
import { v4 as uuidv4 } from 'uuid';
import { 
 ActionModal,
 Input, Select
} from './ui';
import type { Stock, StockStatus } from '../types';
import { CATEGORY_OPTIONS } from '../lib/constants';
import { fetchStockPrice } from '../lib/stockApi';

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
 const [category, setCategory] = useState('');
 const [accountId, setAccountId] = useState('');
 const [quantity, setQuantity] = useState<number>(0);
 const [avgPrice, setAvgPrice] = useState<number>(0);

 useEffect(() => {
 if (isOpen) {
  setName('');
  setSymbol('');
  setStatus(initialStatus);
  setCategory('');
  setAccountId('');
  setQuantity(0);
  setAvgPrice(0);
 }
 }, [isOpen, initialStatus]);

 const handleSubmit = async (e: React.FormEvent) => {
 e.preventDefault();
 if (!name.trim()) return;

 // 등록 시 실시간 주가 동기화 시도
 let syncedPrice = 0;
 if (symbol.trim()) {
  syncedPrice = await fetchStockPrice(symbol.trim()) || 0;
 }

 const newStock: Stock = {
  id: uuidv4(),
  name: name.trim(),
  symbol: symbol.trim() || null,
  status: status,
  category: category || null,
  accountId: (status === 'WATCHLIST' || status === 'SOLD') ? null : (accountId || null),
  quantity: status === 'WATCHLIST' ? 0 : quantity,
  avgPrice: status === 'WATCHLIST' ? 0 : avgPrice,
  currentPrice: syncedPrice,
  createdAt: Date.now(),
  updatedAt: Date.now(),
 };

 await actions.saveStock(newStock);
 onClose();
 };

 const modalTitle = status === 'WATCHLIST' ? '관심 종목 추가' : '보유 종목 추가';

 return (
 <ActionModal 
  isOpen={isOpen} 
  onClose={onClose}
  onSubmit={handleSubmit}
  title={modalTitle}
  size="lg"
  submitLabel="종목 추가 완료"
  submitDisabled={status !== 'WATCHLIST' && (!accountId || accounts.length === 0)}
 >
  <div className="space-y-8">
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

  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
   <Select 
    label="카테고리 (산업군)"
    value={category}
    onChange={(e) => setCategory(e.target.value)}
    options={CATEGORY_OPTIONS}
    placeholder="산업군을 선택하세요"
   />

   {status !== 'WATCHLIST' && (
    <div className="space-y-2">
     <Select 
      label="연결 계좌"
      value={accountId}
      onChange={(e) => setAccountId(e.target.value)}
      required
      options={accounts.map(a => ({ 
       value: a.id, 
       label: `${a.brokerName} (${a.cashBalance.toLocaleString()}원)` 
      }))}
      placeholder="계좌를 선택하세요"
      error={accounts.length === 0 ? "등록된 계좌가 없습니다. 계좌 관리에서 먼저 생성해 주세요." : undefined}
     />
    </div>
   )}
  </div>

  {status !== 'WATCHLIST' && (
   <div className="space-y-6 animate-slide-up">
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
 </ActionModal>
 );
}
