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
    let finalAvgPrice = avgPrice;

    if (i < 6) {
      status = 'HOLDING';
      quantity = faker.number.int({ min: 10, max: 500 });
    } else if (i < 9) {
      status = 'PARTIAL_SOLD';
      quantity = faker.number.int({ min: 5, max: 100 });
    } else if (i < 11) {
      status = 'SOLD';
      quantity = 0;
    } else {
      status = 'WATCHLIST';
      quantity = 0;
      finalAvgPrice = 0; // 관심 종목은 평단가 0
    }

    const createdAt = faker.date.past({ years: 1 }).getTime();
    stocks.push({
      id: uuidv4(),
      accountId: status !== 'WATCHLIST' ? faker.helpers.arrayElement(accounts).id : null,
      symbol: stockInfo.symbol,
      name: stockInfo.name,
      quantity,
      avgPrice: finalAvgPrice,
      currentPrice: status !== 'SOLD' && status !== 'WATCHLIST' ? currentPrice : (status === 'WATCHLIST' ? Math.round(avgPrice * 1.1) : null),
      status,
      createdAt,
      updatedAt: faker.date.between({ from: createdAt, to: Date.now() }).getTime(),
    });
  }

  return stocks;
}

const MOCK_REASONS = [
  '실적 턴어라운드 기대감이 큼. 2분기 영업이익 컨센서스 상회 예상.',
  '글로벌 공급망 다변화로 인한 수혜가 예상됨. 장기적 관점에서 접근 필요.',
  'AI 반도체 수요 폭증에 따른 직접적인 수혜주. 엔비디아와의 협력 강화.',
  '기술적 반등 구간 진입. 전고점 돌파 여부가 중요 포인트임.',
  '배당 수익률 5% 이상의 고배당 매력. 하락장에서도 방어주 역할 기대.',
  '신제품 출시 효과로 인한 점유율 확대 가능성. 브랜드 인지도 상승 중.',
  '기관 및 외국인의 동반 매수세 유입. 수급 측면에서 긍정적.',
];

const MOCK_SCENARIOS = [
  '목표가 1차 15만원, 2차 20만원 설정. 하반기 신사업 가시화 시 상향 조정.',
  '전저점 이탈 시 비중 축소. 하지만 60일 이동평균선 지지 시 추가 매수 고려.',
  '연말까지 홀딩 전략. 금리 인하 사이클 진입 시 밸류에이션 리레이팅 기대.',
  '단기 트레이딩 관점. 10% 수익 시 분할 매도 수익 실현.',
];

/**
 * 목 메모 데이터 생성
 */
export function generateMockMemos(stocks: Stock[]): StockMemo[] {
  const memos: StockMemo[] = [];

  stocks.forEach((stock) => {
    const memoCount = faker.number.int({ min: 1, max: 3 });
    
    for (let i = 0; i < memoCount; i++) {
      let type: MemoType;
      
      if (stock.status === 'WATCHLIST') {
        type = 'GENERAL';
      } else {
        type = i === 0 ? 'PURCHASE' : (stock.status === 'SOLD' && i === memoCount - 1 ? 'SELL' : 'GENERAL');
      }

      const createdAt = faker.date.between({ 
        from: stock.createdAt, 
        to: Date.now() 
      }).getTime();

      const reason = faker.helpers.arrayElement(MOCK_REASONS);
      const scenario = faker.helpers.arrayElement(MOCK_SCENARIOS);

      memos.push({
        id: uuidv4(),
        stockId: stock.id,
        type,
        buyReason: type === 'PURCHASE' || stock.status === 'WATCHLIST' ? reason : null,
        expectedScenario: type === 'PURCHASE' || stock.status === 'WATCHLIST' ? scenario : null,
        risks: type === 'PURCHASE' || stock.status === 'WATCHLIST' ? '시장 변동성 및 금리 변화 주시 필요' : null,
        currentThought: stock.status === 'WATCHLIST' 
          ? `[관심] ${reason} 현재 리서치 중이며 매수 적정가 판단 시 대기.` 
          : (type === 'GENERAL' ? '현재 펀더멘탈은 견고하며 분할 매수/매도 관점에서 접근 중.' : null),
        sellReview: type === 'SELL' ? '원칙에 따라 수익 실현 완료. 향후 재매수 기회 모색.' : null,
        createdAt,
        updatedAt: faker.date.between({ from: createdAt, to: Date.now() }).getTime(),
      });
    }
  });

  return memos;
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
  const memos = generateMockMemos(stocks);
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
    const memos = generateMockMemos(stocks);
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
    const memos = generateMockMemos(stocks);
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
    const memos = generateMockMemos(stocks);
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
    const memos = generateMockMemos(stocks);
    const attachments = generateMockAttachments(memos, 20);
    return { accounts, stocks, memos, attachments };
  },

  // 시나리오 5: 계좌만 있는 경우 (Empty State 테스트)
  onlyAccounts: (): AppData => {
    const accounts = generateMockAccounts(2);
    return { 
      accounts, 
      stocks: [], 
      memos: [], 
      attachments: [] 
    };
  },

  // 시나리오 6: 관심 종목만 있는 경우
  onlyWatchlist: (): AppData => {
    const accounts = generateMockAccounts(1);
    const stocks = generateMockStocks(accounts, 5).map(stock => ({
      ...stock,
      status: 'WATCHLIST' as const,
      accountId: null,
      quantity: 0,
      avgPrice: 0,
      currentPrice: null,
    }));
    const memos = generateMockMemos(stocks);
    const attachments = generateMockAttachments(memos, 3);
    return { 
      accounts, 
      stocks, 
      memos, 
      attachments 
    };
  },

  // 시나리오 7: 메모가 없는 경우
  noMemos: (): AppData => {
    const accounts = generateMockAccounts(2);
    const stocks = generateMockStocks(accounts, 8);
    return { 
      accounts, 
      stocks, 
      memos: [], 
      attachments: [] 
    };
  },

  // 시나리오 8: 최소 데이터 (각 1개씩)
  minimal: (): AppData => {
    const accounts = generateMockAccounts(1);
    accounts[0].cashBalance = 1000000;
    const stocks = generateMockStocks(accounts, 1);
    stocks[0].status = 'HOLDING';
    stocks[0].quantity = 10;
    stocks[0].avgPrice = 50000;
    const memos = generateMockMemos(stocks);
    return { 
      accounts, 
      stocks, 
      memos, 
      attachments: [] 
    };
  },
};

