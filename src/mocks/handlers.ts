import { http, HttpResponse } from 'msw';
import { generateMockData, mockScenarios } from '../lib/mockData';
import type { AppData, Account, Stock, StockMemo, Attachment } from '../types';

// 현재 활성화된 목 데이터
let currentMockData: AppData = generateMockData();

// API 엔드포인트 (실제로는 localStorage를 사용하지만 MSW로 시뮬레이션)
const BASE_URL = '/api';

export const handlers = [
  // 전체 데이터 조회
  http.get(`${BASE_URL}/data`, () => {
    return HttpResponse.json(currentMockData);
  }),

  // 계좌 목록 조회
  http.get(`${BASE_URL}/accounts`, () => {
    return HttpResponse.json(currentMockData.accounts);
  }),

  // 계좌 생성/수정
  http.post(`${BASE_URL}/accounts`, async ({ request }) => {
    const account = await request.json() as Account;
    const index = currentMockData.accounts.findIndex((a) => a.id === account.id);
    if (index >= 0) {
      currentMockData.accounts[index] = account;
    } else {
      currentMockData.accounts.push(account);
    }
    return HttpResponse.json(account);
  }),

  // 계좌 삭제
  http.delete(`${BASE_URL}/accounts/:id`, ({ params }) => {
    const id = String(params.id);
    currentMockData.accounts = currentMockData.accounts.filter((a) => a.id !== id);
    return HttpResponse.json({ success: true });
  }),

  // 주식 목록 조회
  http.get(`${BASE_URL}/stocks`, () => {
    return HttpResponse.json(currentMockData.stocks);
  }),

  // 주식 생성/수정
  http.post(`${BASE_URL}/stocks`, async ({ request }) => {
    const stock = await request.json() as Stock;
    const index = currentMockData.stocks.findIndex((s) => s.id === stock.id);
    if (index >= 0) {
      currentMockData.stocks[index] = stock;
    } else {
      currentMockData.stocks.push(stock);
    }
    return HttpResponse.json(stock);
  }),

  // 주식 삭제
  http.delete(`${BASE_URL}/stocks/:id`, ({ params }) => {
    const id = String(params.id);
    currentMockData.stocks = currentMockData.stocks.filter((s) => s.id !== id);
    return HttpResponse.json({ success: true });
  }),

  // 메모 목록 조회
  http.get(`${BASE_URL}/memos`, ({ request }) => {
    const url = new URL(request.url);
    const stockId = url.searchParams.get('stockId');
    
    if (stockId) {
      return HttpResponse.json(
        currentMockData.memos.filter((m: any) => m.stockId === stockId)
      );
    }
    return HttpResponse.json(currentMockData.memos);
  }),

  // 메모 생성/수정
  http.post(`${BASE_URL}/memos`, async ({ request }) => {
    const memo = await request.json() as StockMemo;
    const index = currentMockData.memos.findIndex((m) => m.id === memo.id);
    if (index >= 0) {
      currentMockData.memos[index] = memo;
    } else {
      currentMockData.memos.push(memo);
    }
    return HttpResponse.json(memo);
  }),

  // 첨부파일 목록 조회
  http.get(`${BASE_URL}/attachments`, ({ request }) => {
    const url = new URL(request.url);
    const memoId = url.searchParams.get('memoId');
    
    if (memoId) {
      return HttpResponse.json(
        currentMockData.attachments.filter((a: any) => a.memoId === memoId)
      );
    }
    return HttpResponse.json(currentMockData.attachments);
  }),

  // 첨부파일 생성
  http.post(`${BASE_URL}/attachments`, async ({ request }) => {
    const attachment = await request.json() as Attachment;
    currentMockData.attachments.push(attachment);
    return HttpResponse.json(attachment);
  }),

  // 첨부파일 삭제
  http.delete(`${BASE_URL}/attachments/:id`, ({ params }) => {
    const id = String(params.id);
    currentMockData.attachments = currentMockData.attachments.filter((a) => a.id !== id);
    return HttpResponse.json({ success: true });
  }),
];

// 시나리오 변경 함수
export function setMockScenario(scenario: keyof typeof mockScenarios) {
  currentMockData = mockScenarios[scenario]();
  console.log(`🎬 MSW 시나리오 "${scenario}"로 변경되었습니다.`);
  console.log(`- 계좌: ${currentMockData.accounts.length}개`);
  console.log(`- 종목: ${currentMockData.stocks.length}개`);
  console.log(`- 메모: ${currentMockData.memos.length}개`);
  console.log(`- 첨부파일: ${currentMockData.attachments.length}개`);
}

// 목 데이터 초기화
export function resetMockData() {
  currentMockData = generateMockData();
  console.log('🔄 MSW 목 데이터가 초기화되었습니다.');
}

// 현재 목 데이터 가져오기
export function getCurrentMockData() {
  return currentMockData;
}
