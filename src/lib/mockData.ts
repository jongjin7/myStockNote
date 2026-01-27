import { faker } from '@faker-js/faker/locale/ko';
import { v4 as uuidv4 } from 'uuid';
import type { Account, Stock, StockMemo, Attachment, AppData, StockStatus, MemoType } from '../types';

// 한국 주식 종목 샘플
const KOREAN_STOCKS = [
  { symbol: '005930', name: '삼성전자' },
  { symbol: '000660', name: 'SK하이닉스' },
  { symbol: '035420', name: 'NAVER' },
  { symbol: '005380', name: '현대차' },
  { symbol: '051910', name: 'LG화학' },
  { symbol: '006400', name: '삼성SDI' },
  { symbol: '035720', name: '카카오' },
  { symbol: '068270', name: '셀트리온' },
  { symbol: '207940', name: '삼성바이오로직스' },
  { symbol: '105560', name: 'KB금융' },
  { symbol: '055550', name: '신한지주' },
  { symbol: '000270', name: '기아' },
  { symbol: '012330', name: '현대모비스' },
  { symbol: '028260', name: '삼성물산' },
  { symbol: '066570', name: 'LG전자' },
  { symbol: '003550', name: 'LG' },
  { symbol: '017670', name: 'SK텔레콤' },
  { symbol: '034730', name: 'SK' },
  { symbol: '096770', name: 'SK이노베이션' },
  { symbol: '009150', name: '삼성전기' },
];

const BROKERS = [
  '삼성증권', 'KB증권', '미래에셋증권', 'NH투자증권', '한국투자증권',
  '키움증권', '신한투자증권', '하나증권', 'SK증권', '대신증권'
];

/**
 * 목 계좌 데이터 생성
 */
export function generateMockAccounts(count: number = 3): Account[] {
  return Array.from({ length: count }, () => {
    const createdAt = faker.date.past({ years: 2 }).getTime();
    return {
      id: uuidv4(),
      brokerName: faker.helpers.arrayElement(BROKERS),
      cashBalance: faker.number.int({ min: 100000, max: 50000000 }),
      memo: faker.datatype.boolean() ? faker.lorem.sentence() : null,
      createdAt,
      updatedAt: faker.date.between({ from: createdAt, to: Date.now() }).getTime(),
    };
  });
}

/**
 * 목 주식 데이터 생성 (다양한 케이스)
 */
export function generateMockStocks(accounts: Account[], count: number = 15): Stock[] {
  const stocks: Stock[] = [];
  const usedStocks = new Set<string>();

  for (let i = 0; i < count; i++) {
    // 중복되지 않는 주식 선택
    let stockInfo;
    do {
      stockInfo = faker.helpers.arrayElement(KOREAN_STOCKS);
    } while (usedStocks.has(stockInfo.symbol) && usedStocks.size < KOREAN_STOCKS.length);
    usedStocks.add(stockInfo.symbol);

    const avgPrice = faker.number.int({ min: 5000, max: 500000 });
    const priceChange = faker.number.float({ min: -0.3, max: 0.5 }); // -30% ~ +50%
    const currentPrice = Math.round(avgPrice * (1 + priceChange));

    // 다양한 케이스 생성
    let status: StockStatus;
    let quantity: number;

    if (i < 5) {
      // 보유 중 (수익/손실 다양)
      status = 'HOLDING';
      quantity = faker.number.int({ min: 10, max: 500 });
    } else if (i < 10) {
      // 일부 매도
      status = 'PARTIAL_SOLD';
      quantity = faker.number.int({ min: 5, max: 100 });
    } else if (i < 13) {
      // 전량 매도
      status = 'SOLD';
      quantity = 0;
    } else {
      // 관심 종목
      status = 'WATCHLIST';
      quantity = 0;
    }

    const createdAt = faker.date.past({ years: 1 }).getTime();
    stocks.push({
      id: uuidv4(),
      accountId: status !== 'WATCHLIST' ? faker.helpers.arrayElement(accounts).id : null,
      symbol: stockInfo.symbol,
      name: stockInfo.name,
      quantity,
      avgPrice,
      currentPrice: status !== 'SOLD' ? currentPrice : null,
      status,
      createdAt,
      updatedAt: faker.date.between({ from: createdAt, to: Date.now() }).getTime(),
    });
  }

  return stocks;
}

/**
 * 목 메모 데이터 생성
 */
export function generateMockMemos(stocks: Stock[], count: number = 20): StockMemo[] {
  const memos: StockMemo[] = [];

  // 각 주식마다 1~3개의 메모 생성
  stocks.forEach((stock) => {
    const memoCount = faker.number.int({ min: 1, max: 3 });
    
    for (let i = 0; i < memoCount; i++) {
      const type: MemoType = i === 0 
        ? 'PURCHASE' 
        : stock.status === 'SOLD' && i === memoCount - 1 
        ? 'SELL' 
        : 'GENERAL';

      const createdAt = faker.date.between({ 
        from: stock.createdAt, 
        to: Date.now() 
      }).getTime();

      memos.push({
        id: uuidv4(),
        stockId: stock.id,
        type,
        buyReason: type === 'PURCHASE' ? faker.lorem.paragraph() : null,
        expectedScenario: type === 'PURCHASE' ? faker.lorem.sentences(2) : null,
        risks: type === 'PURCHASE' ? faker.lorem.sentence() : null,
        currentThought: type === 'GENERAL' ? faker.lorem.paragraph() : null,
        sellReview: type === 'SELL' ? faker.lorem.paragraph() : null,
        createdAt,
        updatedAt: faker.date.between({ from: createdAt, to: Date.now() }).getTime(),
      });
    }
  });

  return memos.slice(0, count);
}

/**
 * 목 첨부파일 데이터 생성
 */
export function generateMockAttachments(memos: StockMemo[], count: number = 10): Attachment[] {
  const attachments: Attachment[] = [];

  // 일부 메모에만 첨부파일 추가
  const memosWithAttachments = faker.helpers.arrayElements(memos, Math.min(count, memos.length));

  memosWithAttachments.forEach((memo) => {
    const attachmentCount = faker.number.int({ min: 1, max: 3 });
    
    for (let i = 0; i < attachmentCount && attachments.length < count; i++) {
      const isImage = faker.datatype.boolean();
      
      attachments.push({
        id: uuidv4(),
        memoId: memo.id,
        type: isImage ? 'IMAGE' : 'TEXT',
        fileName: isImage 
          ? `chart_${faker.string.alphanumeric(8)}.png`
          : `analysis_${faker.string.alphanumeric(8)}.txt`,
        fileSize: faker.number.int({ min: 10000, max: 5000000 }),
        mimeType: isImage ? 'image/png' : 'text/plain',
        data: isImage 
          ? 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=='
          : faker.lorem.paragraphs(3),
        createdAt: faker.date.between({ from: memo.createdAt, to: Date.now() }).getTime(),
      });
    }
  });

  return attachments;
}

/**
 * 전체 목 데이터 생성
 */
export function generateMockData(): AppData {
  const accounts = generateMockAccounts(3);
  const stocks = generateMockStocks(accounts, 15);
  const memos = generateMockMemos(stocks, 20);
  const attachments = generateMockAttachments(memos, 10);

  return {
    accounts,
    stocks,
    memos,
    attachments,
  };
}

/**
 * 특정 시나리오별 목 데이터 생성
 */
export const mockScenarios = {
  // 시나리오 1: 큰 수익 케이스
  bigProfit: (): AppData => {
    const accounts = generateMockAccounts(2);
    const stocks = generateMockStocks(accounts, 8).map(stock => ({
      ...stock,
      currentPrice: stock.avgPrice ? Math.round(stock.avgPrice * faker.number.float({ min: 1.5, max: 3 })) : null,
      quantity: stock.status === 'HOLDING' ? faker.number.int({ min: 100, max: 1000 }) : stock.quantity,
    }));
    const memos = generateMockMemos(stocks, 15);
    const attachments = generateMockAttachments(memos, 8);
    return { accounts, stocks, memos, attachments };
  },

  // 시나리오 2: 손실 케이스
  bigLoss: (): AppData => {
    const accounts = generateMockAccounts(2);
    const stocks = generateMockStocks(accounts, 8).map(stock => ({
      ...stock,
      currentPrice: stock.avgPrice ? Math.round(stock.avgPrice * faker.number.float({ min: 0.5, max: 0.9 })) : null,
      quantity: stock.status === 'HOLDING' ? faker.number.int({ min: 50, max: 300 }) : stock.quantity,
    }));
    const memos = generateMockMemos(stocks, 15);
    const attachments = generateMockAttachments(memos, 8);
    return { accounts, stocks, memos, attachments };
  },

  // 시나리오 3: 소액 투자 케이스
  smallPortfolio: (): AppData => {
    const accounts = generateMockAccounts(1);
    accounts[0].cashBalance = faker.number.int({ min: 50000, max: 500000 });
    const stocks = generateMockStocks(accounts, 3).map(stock => ({
      ...stock,
      quantity: stock.status === 'HOLDING' ? faker.number.int({ min: 1, max: 10 }) : stock.quantity,
      avgPrice: faker.number.int({ min: 10000, max: 50000 }),
    }));
    const memos = generateMockMemos(stocks, 5);
    const attachments = generateMockAttachments(memos, 2);
    return { accounts, stocks, memos, attachments };
  },

  // 시나리오 4: 대규모 포트폴리오
  largePortfolio: (): AppData => {
    const accounts = generateMockAccounts(5);
    accounts.forEach(acc => {
      acc.cashBalance = faker.number.int({ min: 10000000, max: 100000000 });
    });
    const stocks = generateMockStocks(accounts, 20).map(stock => ({
      ...stock,
      quantity: stock.status === 'HOLDING' ? faker.number.int({ min: 100, max: 2000 }) : stock.quantity,
      avgPrice: faker.number.int({ min: 50000, max: 1000000 }),
    }));
    const memos = generateMockMemos(stocks, 40);
    const attachments = generateMockAttachments(memos, 20);
    return { accounts, stocks, memos, attachments };
  },
};
