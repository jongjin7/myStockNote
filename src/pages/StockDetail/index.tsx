import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useApp } from '../../contexts/AppContext';
import { AlertCircle } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import type { Stock } from '../../types';
import { Card, CardTitle, CardDescription, Button } from '../../components/ui';

// Section Components
import { StockHeader } from './StockHeader';
import { StockStats } from './StockStats';
import { StockActions } from './StockActions';
import { StockMemoList } from './StockMemoList';
import { StockEditModal } from './StockEditModal';
import { StockConvertModal } from './StockConvertModal';

export default function StockDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data, actions, isLoading } = useApp();
  const { stocks, accounts, memos } = data;

  const stock = stocks.find(s => s.id === id);
  const stockMemos = memos.filter(m => m.stockId === id).sort((a, b) => b.updatedAt - a.updatedAt);
  const account = accounts.find(a => a.id === stock?.accountId);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isConvertModalOpen, setIsConvertModalOpen] = useState(false);
  
  const currentPrice = stock?.currentPrice || stock?.avgPrice || 0;
  const isUpdatingPrice = isLoading;

  const fetchCurrentPrice = async () => {
    if (!stock?.id) return;
    await actions.updateStockPrice(stock.id);
  };
   
  if (!stock) {
    return (
      <Card className="flex flex-col items-center justify-center p-20 text-center border-dashed border-gray-800 bg-gray-900/10">
        <AlertCircle size={64} className="text-gray-700 mb-6" />
        <CardTitle className="text-2xl font-bold text-white mb-2">종목을 찾을 수 없습니다.</CardTitle>
        <CardDescription className="text-gray-500 mb-8">해당 종목이 존재하지 않거나 삭제되었습니다.</CardDescription>
        <Link to="/">
          <Button variant="ghost" className="text-primary-500">대시보드로 돌아가기</Button>
        </Link>
      </Card>
    );
  }

  const handleUpdateStock = async (updatedStock: Stock) => {
    await actions.saveStock(updatedStock);
  };

  const handleConvertStock = async (convertData: {
    targetAccountId: string;
    buyQuantity: number;
    buyPrice: number;
    shouldCopyMemo: boolean;
  }) => {
    const { targetAccountId, buyQuantity, buyPrice, shouldCopyMemo } = convertData;
    
    // 1. Get the latest research memo to copy if requested
    const latestResearchMemo = stockMemos.find(m => m.type === 'GENERAL');

    // 2. Update stock status and data
    const updatedStock: Stock = {
      ...stock,
      status: 'HOLDING',
      accountId: targetAccountId,
      quantity: buyQuantity,
      avgPrice: buyPrice,
      currentPrice: buyPrice,
      updatedAt: Date.now(),
    };

    await actions.saveStock(updatedStock);

    // 3. Create a PURCHASE memo
    const purchaseMemo: any = {
      id: uuidv4(),
      stockId: stock.id,
      type: 'PURCHASE',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    if (shouldCopyMemo && latestResearchMemo) {
      purchaseMemo.buyReason = latestResearchMemo.buyReason || latestResearchMemo.currentThought;
      purchaseMemo.expectedScenario = latestResearchMemo.expectedScenario;
      purchaseMemo.risks = latestResearchMemo.risks;
    } else {
      purchaseMemo.buyReason = '관심 종목에서 매수로 전환됨';
    }

    await actions.saveMemo(purchaseMemo);
  };

  const handleDelete = async () => {
    if (window.confirm('정말 삭제하시겠습니까? 관련 모든 노트와 첨부파일이 영구적으로 삭제됩니다.')) {
      await actions.deleteStock(stock.id);
      navigate('/');
    }
  };

  return (
    <div className="space-y-10 animate-fade-in">
      <StockHeader 
        stock={stock}
        account={account}
        currentPrice={currentPrice}
        onEdit={() => setIsEditModalOpen(true)}
        onDelete={handleDelete}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="space-y-8">
          <StockStats 
            stock={stock}
            currentPrice={currentPrice}
            fetchCurrentPrice={fetchCurrentPrice}
            isUpdatingPrice={isUpdatingPrice}
          />
          <StockActions 
            stockId={stock.id}
            isWatchlist={stock.status === 'WATCHLIST'}
            onConvert={() => setIsConvertModalOpen(true)}
          />
        </div>

        <StockMemoList 
          stockId={stock.id}
          memos={stockMemos}
          isWatchlist={stock.status === 'WATCHLIST'}
        />
      </div>

      <StockEditModal 
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        stock={stock}
        accounts={accounts}
        onUpdate={handleUpdateStock}
      />

      <StockConvertModal 
        isOpen={isConvertModalOpen}
        onClose={() => setIsConvertModalOpen(false)}
        accounts={accounts}
        hasGeneralMemo={stockMemos.some(m => m.type === 'GENERAL')}
        onConvert={handleConvertStock}
      />
    </div>
  );
}
