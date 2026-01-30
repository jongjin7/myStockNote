import { useState, useEffect } from 'react';
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
  const { data, actions } = useApp();
  const { stocks, accounts, memos } = data;

  const stock = stocks.find(s => s.id === id);
  const stockMemos = memos.filter(m => m.stockId === id).sort((a, b) => b.updatedAt - a.updatedAt);
  const account = accounts.find(a => a.id === stock?.accountId);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isConvertModalOpen, setIsConvertModalOpen] = useState(false);
  const [currentPrice, setCurrentPrice] = useState(stock?.currentPrice || stock?.avgPrice || 0);
  const [isUpdatingPrice, setIsUpdatingPrice] = useState(false);

  // Synchronize internal currentPrice when stock data changes
  useEffect(() => {
    if (stock) {
      setCurrentPrice(stock.currentPrice || stock.avgPrice || 0);
    }
  }, [stock?.id, stock?.currentPrice]);

  const fetchCurrentPrice = async () => {
    if (!stock?.symbol) {
      alert('종목 코드가 등록되어 있지 않아 가격을 가져올 수 없습니다.');
      return;
    }

    setIsUpdatingPrice(true);
    try {
      const symbol = stock.symbol.trim();
      let yahooSymbol = symbol;
      if (/^\d{6}$/.test(symbol)) {
        yahooSymbol = `${symbol}.KS`; 
      }

      const url = `https://query1.finance.yahoo.com/v8/finance/chart/${yahooSymbol}?interval=1m&range=1d`;
      const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;

      const response = await fetch(proxyUrl);
      const data = await response.json();
      const result = JSON.parse(data.contents);
      
      let meta = result.chart?.result?.[0]?.meta;

      if (!meta?.regularMarketPrice && yahooSymbol.endsWith('.KS')) {
        const kqSymbol = yahooSymbol.replace('.KS', '.KQ');
        const kqUrl = `https://query1.finance.yahoo.com/v8/finance/chart/${kqSymbol}?interval=1m&range=1d`;
        const kqProxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(kqUrl)}`;
        
        const kqRes = await fetch(kqProxyUrl);
        const kqData = await kqRes.json();
        const kqResult = JSON.parse(kqData.contents);
        meta = kqResult.chart?.result?.[0]?.meta;
      }

      if (!meta?.regularMarketPrice) {
        throw new Error('주가 정보를 찾을 수 없습니다.');
      }

      const newPrice = Math.round(meta.regularMarketPrice);
      const updatedStock = {
        ...stock,
        currentPrice: newPrice,
        updatedAt: Date.now()
      };
      
      await actions.saveStock(updatedStock);
      setCurrentPrice(newPrice);
    } catch (error) {
      console.error('Failed to update price:', error);
      alert('주가 정보를 가져오는데 실패했습니다. 심볼을 확인해주세요.');
    } finally {
      setIsUpdatingPrice(false);
    }
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
