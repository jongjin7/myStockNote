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

// ID 추출 유틸리티 (URL 파라미터에서 eq.uuid 형태 추출)
function getParamId(request: Request, paramName: string = 'id'): string | null {
  const url = new URL(request.url);
  const val = url.searchParams.get(paramName);
  if (!val) return null;
  return val.includes('.') ? val.split('.')[1] : val;
}

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
      user_id: 'mock-user-uuid',
      created_at: new Date(a.createdAt).toISOString(),
      updated_at: new Date(a.updatedAt).toISOString()
    })));
  }),

  // 계좌 생성/수정 (UPSERT)
  http.post(`${REST_URL}/accounts`, async ({ request }) => {
    const account = await request.json() as any;
    const existingIndex = currentMockData.accounts.findIndex((a) => a.id === account.id);
    
    const mappedAccount: Account = {
      id: account.id,
      brokerName: account.broker_name,
      cashBalance: account.cash_balance,
      memo: account.memo,
      createdAt: existingIndex >= 0 ? currentMockData.accounts[existingIndex].createdAt : Date.now(),
      updatedAt: Date.now(),
    };

    if (existingIndex >= 0) {
      currentMockData.accounts[existingIndex] = mappedAccount;
    } else {
      currentMockData.accounts.push(mappedAccount);
    }
    syncToStorage();
    return HttpResponse.json(account);
  }),

  // 계좌 삭제
  http.delete(`${REST_URL}/accounts`, ({ request }) => {
    const id = getParamId(request);
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
      current_price: s.currentPrice,
      created_at: new Date(s.createdAt).toISOString(),
      updated_at: new Date(s.updatedAt).toISOString()
    })));
  }),

  // 주식 등록/수정 (POST/PATCH)
  http.all(`${REST_URL}/stocks`, async ({ request }) => {
    if (request.method !== 'POST' && request.method !== 'PATCH') return;

    const stock = await request.json() as any;
    const id = stock.id || getParamId(request);
    const existingIndex = currentMockData.stocks.findIndex((s) => s.id === id);
    
    const mappedStock: Stock = {
      id: id,
      accountId: stock.account_id,
      symbol: stock.symbol,
      name: stock.name,
      quantity: stock.quantity ?? (existingIndex >= 0 ? currentMockData.stocks[existingIndex].quantity : 0),
      avgPrice: stock.avg_price ?? (existingIndex >= 0 ? currentMockData.stocks[existingIndex].avgPrice : 0),
      currentPrice: stock.current_price ?? (existingIndex >= 0 ? currentMockData.stocks[existingIndex].currentPrice : null),
      status: stock.status ?? (existingIndex >= 0 ? currentMockData.stocks[existingIndex].status : 'HOLDING'),
      category: stock.category ?? (existingIndex >= 0 ? currentMockData.stocks[existingIndex].category : ''),
      createdAt: existingIndex >= 0 ? currentMockData.stocks[existingIndex].createdAt : Date.now(),
      updatedAt: Date.now(),
    };

    if (existingIndex >= 0) {
      currentMockData.stocks[existingIndex] = mappedStock;
    } else {
      currentMockData.stocks.push(mappedStock);
    }
    syncToStorage();
    return HttpResponse.json(stock);
  }),

  // 주식 삭제
  http.delete(`${REST_URL}/stocks`, ({ request }) => {
    const id = getParamId(request);
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
    const stockId = getParamId(request, 'stock_id');
    
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
      sell_review: m.sellReview,
      created_at: new Date(m.createdAt).toISOString(),
      updated_at: new Date(m.updatedAt).toISOString()
    })));
  }),

  // 메모 저장 (POST/PATCH)
  http.all(`${REST_URL}/memos`, async ({ request }) => {
    if (request.method !== 'POST' && request.method !== 'PATCH') return;

    const memo = await request.json() as any;
    const id = memo.id || getParamId(request);
    const existingIndex = currentMockData.memos.findIndex((m) => m.id === id);
    
    const mappedMemo: StockMemo = {
      id: id,
      stockId: memo.stock_id || (existingIndex >= 0 ? currentMockData.memos[existingIndex].stockId : ''),
      type: memo.type || (existingIndex >= 0 ? currentMockData.memos[existingIndex].type : 'GENERAL'),
      buyReason: memo.buy_reason !== undefined ? memo.buy_reason : (existingIndex >= 0 ? currentMockData.memos[existingIndex].buyReason : null),
      expectedScenario: memo.expected_scenario !== undefined ? memo.expected_scenario : (existingIndex >= 0 ? currentMockData.memos[existingIndex].expectedScenario : null),
      risks: memo.risks !== undefined ? memo.risks : (existingIndex >= 0 ? currentMockData.memos[existingIndex].risks : null),
      currentThought: memo.current_thought !== undefined ? memo.current_thought : (existingIndex >= 0 ? currentMockData.memos[existingIndex].currentThought : null),
      sellReview: memo.sell_review !== undefined ? memo.sell_review : (existingIndex >= 0 ? currentMockData.memos[existingIndex].sellReview : null),
      createdAt: existingIndex >= 0 ? currentMockData.memos[existingIndex].createdAt : Date.now(),
      updatedAt: Date.now(),
    };

    if (existingIndex >= 0) {
      currentMockData.memos[existingIndex] = mappedMemo;
    } else {
      currentMockData.memos.push(mappedMemo);
    }
    syncToStorage();
    return HttpResponse.json(memo);
  }),

  // 첨부파일 목록 조회
  http.get(`${REST_URL}/attachments`, ({ request }) => {
    const memoId = getParamId(request, 'memo_id');
    
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
      storage_url: a.data,
      created_at: new Date(a.createdAt).toISOString(),
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

  // 첨부파일 삭제
  http.delete(`${REST_URL}/attachments`, ({ request }) => {
    const id = getParamId(request);
    if (id) {
      currentMockData.attachments = currentMockData.attachments.filter((a) => a.id !== id);
      syncToStorage();
    }
    return HttpResponse.json({ success: true });
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

  // 이미지 공개 URL
  http.get(`${STORAGE_URL}/object/public/stock-images/*`, () => {
    return Response.redirect('https://images.unsplash.com/photo-1611974717483-936666666666?w=800&auto=format&fit=crop&q=60', 302);
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
