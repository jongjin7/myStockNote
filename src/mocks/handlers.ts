import { http, HttpResponse } from 'msw';
import { storage } from '../lib/storage';
import { generateMockData, mockScenarios } from '../lib/mockData';
import type { AppData, Account, Stock, StockMemo, Attachment } from '../types';

// Supabase API 엔드포인트 패턴
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const REST_URL = `${SUPABASE_URL}/rest/v1`;
const AUTH_URL = `${SUPABASE_URL}/auth/v1`;
const STORAGE_URL = `${SUPABASE_URL}/storage/v1`;

// 서버 사이드 데이터 시뮬레이션 (초기 로드 시 localStorage에서 가져옴)
let currentMockData: AppData;

if (storage.exists()) {
  currentMockData = storage.load();
} else {
  // 처음 방문했을 때만 기본 목 데이터 생성
  currentMockData = generateMockData();
  storage.save(currentMockData);
}

const syncToStorage = () => {
  storage.save(currentMockData);
};

export const handlers = [
  // --- Auth Mock ---
  http.get(`${AUTH_URL}/user`, () => {
    return HttpResponse.json({
      id: 'mock-user-uuid',
      email: 'mock@example.com',
      user_metadata: { full_name: 'Mock User' }
    });
  }),

  // --- REST API Mock (Supabase) ---
  
  // 계좌 목록 조회
  http.get(`${REST_URL}/accounts`, () => {
    return HttpResponse.json(currentMockData.accounts.map(a => ({
      ...a,
      broker_name: a.brokerName,
      cash_balance: a.cashBalance,
      user_id: 'mock-user-uuid'
    })));
  }),

  // 계좌 생성/수정 (UPSERT)
  http.post(`${REST_URL}/accounts`, async ({ request }) => {
    const account = await request.json() as any;
    const mappedAccount: Account = {
      id: account.id,
      brokerName: account.broker_name,
      cashBalance: account.cash_balance,
      memo: account.memo,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    const index = currentMockData.accounts.findIndex((a) => a.id === account.id);
    if (index >= 0) {
      currentMockData.accounts[index] = mappedAccount;
    } else {
      currentMockData.accounts.push(mappedAccount);
    }
    syncToStorage();
    return HttpResponse.json(account);
  }),

  // 계좌 삭제
  http.delete(`${REST_URL}/accounts`, ({ request }) => {
    const url = new URL(request.url);
    const id = url.searchParams.get('id')?.split('.')[1];
    if (id) {
      currentMockData.accounts = currentMockData.accounts.filter((a) => a.id !== id);
      currentMockData.stocks = currentMockData.stocks.map(s => 
        s.accountId === id ? { ...s, accountId: null, status: 'WATCHLIST' as const } : s
      );
      syncToStorage();
    }
    return HttpResponse.json({ success: true });
  }),

  // 주식 목록 조회
  http.get(`${REST_URL}/stocks`, () => {
    return HttpResponse.json(currentMockData.stocks.map(s => ({
      ...s,
      user_id: 'mock-user-uuid',
      account_id: s.accountId,
      avg_price: s.avgPrice,
      current_price: s.currentPrice
    })));
  }),

  // 주식 등록/수정
  http.post(`${REST_URL}/stocks`, async ({ request }) => {
    const stock = await request.json() as any;
    const mappedStock: Stock = {
      id: stock.id,
      accountId: stock.account_id,
      symbol: stock.symbol,
      name: stock.name,
      quantity: stock.quantity,
      avgPrice: stock.avg_price,
      currentPrice: stock.current_price,
      status: stock.status,
      category: stock.category,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    const index = currentMockData.stocks.findIndex((s) => s.id === stock.id);
    if (index >= 0) {
      currentMockData.stocks[index] = mappedStock;
    } else {
      currentMockData.stocks.push(mappedStock);
    }
    syncToStorage();
    return HttpResponse.json(stock);
  }),

  // 주식 삭제
  http.delete(`${REST_URL}/stocks`, ({ request }) => {
    const url = new URL(request.url);
    const id = url.searchParams.get('id')?.split('.')[1];
    if (id) {
      const memoIdsToClean = currentMockData.memos.filter(m => m.stockId === id).map(m => m.id);
      currentMockData.stocks = currentMockData.stocks.filter((s) => s.id !== id);
      currentMockData.memos = currentMockData.memos.filter(m => m.stockId !== id);
      currentMockData.attachments = currentMockData.attachments.filter(a => !memoIdsToClean.includes(a.memoId));
      syncToStorage();
    }
    return HttpResponse.json({ success: true });
  }),

  // 메모 목록 조회
  http.get(`${REST_URL}/memos`, ({ request }) => {
    const url = new URL(request.url);
    const stockId = url.searchParams.get('stock_id')?.split('.')[1];
    
    let memos = currentMockData.memos;
    if (stockId) {
      memos = memos.filter(m => m.stockId === stockId);
    }

    return HttpResponse.json(memos.map(m => ({
      ...m,
      user_id: 'mock-user-uuid',
      stock_id: m.stockId,
      buy_reason: m.buyReason,
      expected_scenario: m.expectedScenario,
      current_thought: m.currentThought,
      sell_review: m.sellReview
    })));
  }),

  // 메모 저장
  http.post(`${REST_URL}/memos`, async ({ request }) => {
    const memo = await request.json() as any;
    const mappedMemo: StockMemo = {
      id: memo.id,
      stockId: memo.stock_id,
      type: memo.type,
      buyReason: memo.buy_reason,
      expectedScenario: memo.expected_scenario,
      risks: memo.risks,
      currentThought: memo.current_thought,
      sellReview: memo.sell_review,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    const index = currentMockData.memos.findIndex((m) => m.id === memo.id);
    if (index >= 0) {
      currentMockData.memos[index] = mappedMemo;
    } else {
      currentMockData.memos.push(mappedMemo);
    }
    syncToStorage();
    return HttpResponse.json(memo);
  }),

  // 첨부파일 목록 조회
  http.get(`${REST_URL}/attachments`, ({ request }) => {
    const url = new URL(request.url);
    const memoId = url.searchParams.get('memo_id')?.split('.')[1];
    
    let attachments = currentMockData.attachments;
    if (memoId) {
      attachments = attachments.filter(a => a.memoId === memoId);
    }

    return HttpResponse.json(attachments.map(a => ({
      ...a,
      user_id: 'mock-user-uuid',
      memo_id: a.memoId,
      file_name: a.fileName,
      file_size: a.fileSize,
      mime_type: a.mimeType,
      storage_url: a.data
    })));
  }),

  // 첨부파일 저장
  http.post(`${REST_URL}/attachments`, async ({ request }) => {
    const attachment = await request.json() as any;
    const mappedAtt: Attachment = {
      id: attachment.id,
      memoId: attachment.memo_id,
      type: attachment.type,
      fileName: attachment.file_name,
      fileSize: attachment.file_size,
      mimeType: attachment.mime_type,
      data: attachment.storage_url,
      createdAt: Date.now(),
    };

    currentMockData.attachments.push(mappedAtt);
    syncToStorage();
    return HttpResponse.json(attachment);
  }),

  // --- Storage API Mock (Supabase) ---
  
  // 이미지 업로드
  http.post(`${STORAGE_URL}/object/stock-images/*`, async ({ request }) => {
    const url = new URL(request.url);
    const path = url.pathname.split('stock-images/')[1];
    
    return HttpResponse.json({
      Key: `stock-images/${path}`,
      Id: 'mock-storage-id',
      path: path
    });
  }),
];

// 시나리오 변경 함수
export function setMockScenario(scenario: keyof typeof mockScenarios) {
  currentMockData = mockScenarios[scenario]();
  syncToStorage();
  console.log(`🎬 MSW 시나리오 "${scenario}"로 변경되었습니다.`);
}

// 목 데이터 초기화
export function resetMockData() {
  currentMockData = generateMockData();
  syncToStorage();
  console.log('🔄 MSW 목 데이터가 초기화되었습니다.');
}

// 모든 데이터 완전 삭제
export function clearMockData() {
  currentMockData = {
    accounts: [],
    stocks: [],
    memos: [],
    attachments: [],
  };
  syncToStorage();
  console.log('🗑️ 모든 데이터가 완전히 삭제되었습니다.');
}

// 현재 목 데이터 가져오기
export function getCurrentMockData() {
  return currentMockData;
}
