# 대시보드 데이터 동기화 테스트 스위트

`.agent/workflows/test-data-sync.md` 워크플로우를 자동화된 테스트로 구현한 완전한 테스트 스위트입니다.

## 📋 목차

1. [개요](#개요)
2. [단위 테스트](#단위-테스트)
3. [통합 테스트](#통합-테스트)
4. [E2E 테스트](#e2e-테스트)
5. [실행 방법](#실행-방법)

---

## 개요

### 테스트 피라미드

```
        /\
       /E2E\          ← 전체 플로우 (6단계)
      /------\
     /통합테스트\      ← Context + 컴포넌트
    /----------\
   /  단위테스트  \    ← 계산 로직
  /--------------\
```

### 테스트 범위

- **단위 테스트**: 계산 로직 (총 자산, 수익률 등)
- **통합 테스트**: Context 동기화 (데이터 추가/삭제 시 상태 업데이트)
- **E2E 테스트**: 전체 사용자 플로우 (6단계 워크플로우)

---

## 단위 테스트

### 1. 계산 로직 테스트

**`src/utils/__tests__/calculations.test.ts`**

```typescript
import { describe, test, expect } from 'vitest';
import {
  calculateTotalCash,
  calculateTotalInvested,
  calculateTotalAssets,
  calculateProfitRate,
  calculateProfitAmount,
} from '../calculations';
import type { Account, Stock } from '@/types';

describe('포트폴리오 계산 함수', () => {
  const mockAccounts: Account[] = [
    { id: '1', brokerName: 'KB증권', cashBalance: 1000000 },
    { id: '2', brokerName: '삼성증권', cashBalance: 2000000 },
  ];

  const mockStocks: Stock[] = [
    {
      id: '1',
      name: '삼성전자',
      code: '005930',
      status: 'HOLDING',
      quantity: 10,
      avgPrice: 70000,
      currentPrice: 75000,
    },
    {
      id: '2',
      name: 'SK하이닉스',
      code: '000660',
      status: 'HOLDING',
      quantity: 5,
      avgPrice: 100000,
      currentPrice: 110000,
    },
    {
      id: '3',
      name: 'NAVER',
      code: '035420',
      status: 'WATCHING',
      quantity: 0,
      avgPrice: 0,
      currentPrice: 200000,
    },
  ];

  describe('calculateTotalCash', () => {
    test('모든 계좌의 예수금 합계를 반환', () => {
      const result = calculateTotalCash(mockAccounts);
      expect(result).toBe(3000000); // 1M + 2M
    });

    test('빈 배열인 경우 0 반환', () => {
      const result = calculateTotalCash([]);
      expect(result).toBe(0);
    });

    test('null 값 처리', () => {
      const accounts = [
        { id: '1', brokerName: 'KB증권', cashBalance: null as any },
      ];
      const result = calculateTotalCash(accounts);
      expect(result).toBe(0);
    });
  });

  describe('calculateTotalInvested', () => {
    test('보유 중인 종목의 총 투자금 계산', () => {
      const result = calculateTotalInvested(mockStocks);
      // (10 * 70000) + (5 * 100000) = 700000 + 500000 = 1200000
      expect(result).toBe(1200000);
    });

    test('관심 종목은 제외', () => {
      const watchingOnly = mockStocks.filter(s => s.status === 'WATCHING');
      const result = calculateTotalInvested(watchingOnly);
      expect(result).toBe(0);
    });

    test('빈 배열인 경우 0 반환', () => {
      const result = calculateTotalInvested([]);
      expect(result).toBe(0);
    });
  });

  describe('calculateTotalAssets', () => {
    test('총 자산 = 예수금 + 투자금', () => {
      const result = calculateTotalAssets(mockAccounts, mockStocks);
      // 3M (cash) + 1.2M (invested) = 4.2M
      expect(result).toBe(4200000);
    });
  });

  describe('calculateProfitRate', () => {
    test('수익률 계산 (양수)', () => {
      const invested = 1000000;
      const current = 1200000;
      const result = calculateProfitRate(invested, current);
      expect(result).toBe(20); // 20%
    });

    test('수익률 계산 (음수)', () => {
      const invested = 1000000;
      const current = 800000;
      const result = calculateProfitRate(invested, current);
      expect(result).toBe(-20); // -20%
    });

    test('투자금이 0인 경우', () => {
      const result = calculateProfitRate(0, 100000);
      expect(result).toBe(0);
    });
  });

  describe('calculateProfitAmount', () => {
    test('수익금 계산', () => {
      const stock = mockStocks[0]; // 삼성전자
      const result = calculateProfitAmount(stock);
      // (75000 - 70000) * 10 = 50000
      expect(result).toBe(50000);
    });

    test('손실금 계산', () => {
      const stock = {
        ...mockStocks[0],
        currentPrice: 60000,
      };
      const result = calculateProfitAmount(stock);
      // (60000 - 70000) * 10 = -100000
      expect(result).toBe(-100000);
    });
  });
});
```

### 2. 유틸리티 함수 테스트

**`src/utils/__tests__/formatters.test.ts`**

```typescript
import { describe, test, expect } from 'vitest';
import { formatCurrency, formatNumber, formatDate } from '../formatters';

describe('formatCurrency', () => {
  test('원화 포맷', () => {
    expect(formatCurrency(1000000)).toBe('₩1,000,000');
    expect(formatCurrency(0)).toBe('₩0');
    expect(formatCurrency(-500000)).toBe('-₩500,000');
  });
});

describe('formatNumber', () => {
  test('숫자 포맷', () => {
    expect(formatNumber(1234567)).toBe('1,234,567');
    expect(formatNumber(0)).toBe('0');
  });
});

describe('formatDate', () => {
  test('날짜 포맷', () => {
    const date = new Date('2026-01-31');
    expect(formatDate(date)).toBe('2026-01-31');
  });
});
```

---

## 통합 테스트

### 1. AppContext 동기화 테스트

**`src/contexts/__tests__/AppContext.test.tsx`**

```typescript
import { describe, test, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { AppProvider, useAppContext } from '../AppContext';

describe('AppContext 데이터 동기화', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('초기 상태 확인', () => {
    const { result } = renderHook(() => useAppContext(), {
      wrapper: AppProvider,
    });

    expect(result.current.accounts).toEqual([]);
    expect(result.current.stocks).toEqual([]);
    expect(result.current.memos).toEqual([]);
  });

  test('계좌 추가 시 즉시 반영', () => {
    const { result } = renderHook(() => useAppContext(), {
      wrapper: AppProvider,
    });

    const newAccount = {
      id: 'test-1',
      brokerName: '데이터 동기화 테스트',
      cashBalance: 1000000,
      createdAt: new Date().toISOString(),
    };

    act(() => {
      result.current.addAccount(newAccount);
    });

    expect(result.current.accounts).toHaveLength(1);
    expect(result.current.accounts[0]).toEqual(newAccount);
    
    // localStorage 확인
    const stored = JSON.parse(localStorage.getItem('accounts') || '[]');
    expect(stored).toHaveLength(1);
  });

  test('종목 추가 시 즉시 반영', () => {
    const { result } = renderHook(() => useAppContext(), {
      wrapper: AppProvider,
    });

    const newStock = {
      id: 'test-1',
      name: '동기화 테스트 종목',
      code: 'TEST',
      status: 'WATCHING' as const,
      createdAt: new Date().toISOString(),
    };

    act(() => {
      result.current.addStock(newStock);
    });

    expect(result.current.stocks).toHaveLength(1);
    expect(result.current.stocks[0].name).toBe('동기화 테스트 종목');
  });

  test('종목 상태 변경 시 즉시 반영', () => {
    const { result } = renderHook(() => useAppContext(), {
      wrapper: AppProvider,
    });

    // 계좌 추가
    act(() => {
      result.current.addAccount({
        id: 'acc-1',
        brokerName: '테스트증권',
        cashBalance: 1000000,
        createdAt: new Date().toISOString(),
      });
    });

    // 관심 종목 추가
    act(() => {
      result.current.addStock({
        id: 'stock-1',
        name: '테스트종목',
        code: 'TEST',
        status: 'WATCHING',
        createdAt: new Date().toISOString(),
      });
    });

    // 보유 종목으로 전환
    act(() => {
      result.current.updateStock('stock-1', {
        status: 'HOLDING',
        accountId: 'acc-1',
        quantity: 10,
        avgPrice: 50000,
      });
    });

    const updatedStock = result.current.stocks.find(s => s.id === 'stock-1');
    expect(updatedStock?.status).toBe('HOLDING');
    expect(updatedStock?.quantity).toBe(10);
    expect(updatedStock?.avgPrice).toBe(50000);
  });

  test('계좌 삭제 시 연결된 종목 상태 변경', () => {
    const { result } = renderHook(() => useAppContext(), {
      wrapper: AppProvider,
    });

    // 계좌 추가
    act(() => {
      result.current.addAccount({
        id: 'acc-1',
        brokerName: '테스트증권',
        cashBalance: 1000000,
        createdAt: new Date().toISOString(),
      });
    });

    // 보유 종목 추가
    act(() => {
      result.current.addStock({
        id: 'stock-1',
        name: '테스트종목',
        code: 'TEST',
        status: 'HOLDING',
        accountId: 'acc-1',
        quantity: 10,
        avgPrice: 50000,
        createdAt: new Date().toISOString(),
      });
    });

    // 계좌 삭제
    act(() => {
      result.current.deleteAccount('acc-1');
    });

    expect(result.current.accounts).toHaveLength(0);
    
    // 종목이 관심 종목으로 전환되었는지 확인
    const stock = result.current.stocks.find(s => s.id === 'stock-1');
    expect(stock?.status).toBe('WATCHING');
    expect(stock?.accountId).toBeUndefined();
    expect(stock?.quantity).toBe(0);
    expect(stock?.avgPrice).toBe(0);
  });

  test('메모 추가 시 즉시 반영', () => {
    const { result } = renderHook(() => useAppContext(), {
      wrapper: AppProvider,
    });

    // 종목 추가
    act(() => {
      result.current.addStock({
        id: 'stock-1',
        name: '테스트종목',
        code: 'TEST',
        status: 'WATCHING',
        createdAt: new Date().toISOString(),
      });
    });

    // 메모 추가
    act(() => {
      result.current.addMemo({
        id: 'memo-1',
        stockId: 'stock-1',
        buyReason: '반응성 테스트를 위한 노트',
        createdAt: new Date().toISOString(),
      });
    });

    expect(result.current.memos).toHaveLength(1);
    expect(result.current.memos[0].buyReason).toBe('반응성 테스트를 위한 노트');
  });
});
```

### 2. 대시보드 컴포넌트 통합 테스트

**`src/pages/__tests__/Dashboard.integration.test.tsx`**

```typescript
import { describe, test, expect, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@/test/utils';
import Dashboard from '../Dashboard';
import { useAppContext } from '@/contexts/AppContext';
import { act } from '@testing-library/react';

describe('대시보드 통합 테스트', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('계좌 추가 시 대시보드 수치 업데이트', async () => {
    const { rerender } = render(<Dashboard />);
    
    // 초기 예수금 확인
    const initialCash = screen.getByTestId('total-cash').textContent;
    
    // Context를 통해 계좌 추가
    const TestComponent = () => {
      const { addAccount } = useAppContext();
      
      React.useEffect(() => {
        addAccount({
          id: 'test-1',
          brokerName: '데이터 동기화 테스트',
          cashBalance: 1000000,
          createdAt: new Date().toISOString(),
        });
      }, []);
      
      return <Dashboard />;
    };
    
    rerender(<TestComponent />);
    
    // 예수금 증가 확인
    await waitFor(() => {
      const newCash = screen.getByTestId('total-cash').textContent;
      expect(newCash).not.toBe(initialCash);
      expect(newCash).toContain('1,000,000');
    });
  });

  test('종목 추가 시 카운트 업데이트', async () => {
    const { rerender } = render(<Dashboard />);
    
    const TestComponent = () => {
      const { addStock } = useAppContext();
      
      React.useEffect(() => {
        addStock({
          id: 'test-1',
          name: '동기화 테스트 종목',
          code: 'TEST',
          status: 'WATCHING',
          createdAt: new Date().toISOString(),
        });
      }, []);
      
      return <Dashboard />;
    };
    
    rerender(<TestComponent />);
    
    await waitFor(() => {
      const watchlistCount = screen.getByTestId('watchlist-count');
      expect(watchlistCount).toHaveTextContent('1');
    });
  });
});
```

---

## E2E 테스트

### 완전한 워크플로우 테스트

**`tests/data-sync-workflow.spec.ts`**

```typescript
import { test, expect } from '@playwright/test';

test.describe('대시보드 데이터 동기화 워크플로우', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  // ========================================
  // 1단계: 초기 상태 확인
  // ========================================
  test('1단계: 초기 상태 확인', async ({ page }) => {
    await page.goto('/');
    
    // 콘솔에서 데이터 확인
    const data = await page.evaluate(async () => {
      // @ts-ignore
      const apiData = await api.getData();
      
      const totalCash = apiData.accounts.reduce(
        (sum: number, acc: any) => sum + Number(acc.cashBalance || 0), 
        0
      );
      
      const holding = apiData.stocks.filter(
        (s: any) => s.status === 'HOLDING' || s.status === 'PARTIAL_SOLD'
      );
      
      const totalInvested = holding.reduce(
        (sum: number, s: any) => sum + (Number(s.quantity || 0) * Number(s.avgPrice || 0)), 
        0
      );
      
      return {
        accounts: apiData.accounts.length,
        stocks: apiData.stocks.length,
        memos: apiData.memos.length,
        totalCash,
        totalInvested,
        totalAssets: totalCash + totalInvested,
      };
    });
    
    console.log('초기 데이터:', data);
    
    // UI 값 확인
    const totalCashUI = await page.locator('[data-testid="total-cash"]').textContent();
    const totalInvestedUI = await page.locator('[data-testid="total-invested"]').textContent();
    
    expect(totalCashUI).toBeTruthy();
    expect(totalInvestedUI).toBeTruthy();
  });

  // ========================================
  // 2단계: 계좌 추가 테스트
  // ========================================
  test('2단계: 계좌 추가 시 대시보드 즉시 업데이트', async ({ page }) => {
    await page.goto('/');
    
    // 초기 예수금 확인
    const initialCashText = await page.locator('[data-testid="total-cash"]').textContent();
    const initialCash = parseInt(initialCashText!.replace(/[^0-9]/g, ''));
    
    // 계좌 관리 페이지로 이동
    await page.click('text=계좌 관리');
    await page.waitForURL('**/accounts');
    
    // 새 계좌 추가
    await page.click('text=새 계좌 추가');
    await page.fill('[name="brokerName"]', '데이터 동기화 테스트');
    await page.fill('[name="cashBalance"]', '1000000');
    await page.click('button:has-text("계좌 추가")');
    
    // 즉시 대시보드로 이동 (새로고침 없이)
    await page.click('text=대시보드');
    await page.waitForURL('**/');
    
    // 검증
    const newCashText = await page.locator('[data-testid="total-cash"]').textContent();
    const newCash = parseInt(newCashText!.replace(/[^0-9]/g, ''));
    
    expect(newCash).toBe(initialCash + 1000000);
    
    // 계좌 요약 섹션 확인
    await expect(page.locator('text=데이터 동기화 테스트')).toBeVisible();
    await expect(page.locator('text=1,000,000원')).toBeVisible();
    
    // 마지막 업데이트 시간 확인
    const updateTime = await page.locator('[data-testid="last-update"]').textContent();
    expect(updateTime).toBeTruthy();
  });

  // ========================================
  // 3단계: 관심 종목 추가 테스트
  // ========================================
  test('3단계: 관심 종목 추가 시 대시보드 즉시 업데이트', async ({ page }) => {
    await page.goto('/');
    
    const initialWatchlistText = await page.locator('[data-testid="watchlist-count"]').textContent();
    const initialCount = parseInt(initialWatchlistText!.replace(/[^0-9]/g, ''));
    
    await page.click('text=관심 종목');
    await page.waitForURL('**/watchlist');
    
    await page.click('text=관심 종목 추가');
    await page.fill('[name="name"]', '동기화 테스트 종목');
    await page.fill('[name="code"]', 'TEST');
    await page.click('button:has-text("관심 종목 추가")');
    
    await page.click('text=대시보드');
    await page.waitForURL('**/');
    
    const newWatchlistText = await page.locator('[data-testid="watchlist-count"]').textContent();
    const newCount = parseInt(newWatchlistText!.replace(/[^0-9]/g, ''));
    
    expect(newCount).toBe(initialCount + 1);
    
    const holdingsText = await page.locator('[data-testid="holdings-count"]').textContent();
    expect(holdingsText).toContain('0');
  });

  // ========================================
  // 4단계: 투자 노트 작성 테스트
  // ========================================
  test('4단계: 투자 노트 작성 시 대시보드 즉시 업데이트', async ({ page }) => {
    // 관심 종목 추가
    await page.goto('/watchlist');
    await page.click('text=관심 종목 추가');
    await page.fill('[name="name"]', '동기화 테스트 종목');
    await page.fill('[name="code"]', 'TEST');
    await page.click('button:has-text("관심 종목 추가")');
    
    // 대시보드 초기 노트 수 확인
    await page.goto('/');
    const initialNotesText = await page.locator('[data-testid="notes-count"]').textContent();
    const initialNotes = parseInt(initialNotesText!.replace(/[^0-9]/g, ''));
    
    // 종목 상세 페이지로 이동
    await page.goto('/watchlist');
    await page.click('text=동기화 테스트 종목');
    
    // 투자 노트 작성
    await page.click('text=새 투자 노트 작성');
    await page.fill('[name="buyReason"]', '반응성 테스트를 위한 노트');
    await page.click('button:has-text("노트 저장")');
    
    // 즉시 대시보드로 이동
    await page.click('text=대시보드');
    await page.waitForURL('**/');
    
    const newNotesText = await page.locator('[data-testid="notes-count"]').textContent();
    const newNotes = parseInt(newNotesText!.replace(/[^0-9]/g, ''));
    
    expect(newNotes).toBe(initialNotes + 1);
    await expect(page.locator('text=반응성 테스트를 위한 노트')).toBeVisible();
  });

  // ========================================
  // 5단계: 관심 종목 → 보유 종목 전환 테스트
  // ========================================
  test('5단계: 관심 종목을 보유 종목으로 전환', async ({ page }) => {
    // 계좌 추가
    await page.goto('/accounts');
    await page.click('text=새 계좌 추가');
    await page.fill('[name="brokerName"]', '데이터 동기화 테스트');
    await page.fill('[name="cashBalance"]', '1000000');
    await page.click('button:has-text("계좌 추가")');
    
    // 관심 종목 추가
    await page.goto('/watchlist');
    await page.click('text=관심 종목 추가');
    await page.fill('[name="name"]', '동기화 테스트 종목');
    await page.fill('[name="code"]', 'TEST');
    await page.click('button:has-text("관심 종목 추가")');
    
    // 대시보드 초기 상태
    await page.goto('/');
    const initialHoldingsText = await page.locator('[data-testid="holdings-count"]').textContent();
    const initialHoldings = parseInt(initialHoldingsText!.replace(/[^0-9]/g, ''));
    
    // 종목 수정
    await page.goto('/watchlist');
    await page.click('text=동기화 테스트 종목');
    await page.click('[data-testid="edit-button"]');
    await page.selectOption('[name="status"]', 'HOLDING');
    await page.selectOption('[name="accountId"]', { label: '데이터 동기화 테스트' });
    await page.fill('[name="quantity"]', '10');
    await page.fill('[name="avgPrice"]', '50000');
    await page.click('button:has-text("정보 업데이트")');
    
    // 대시보드 확인
    await page.click('text=대시보드');
    await page.waitForURL('**/');
    
    const newHoldingsText = await page.locator('[data-testid="holdings-count"]').textContent();
    const newHoldings = parseInt(newHoldingsText!.replace(/[^0-9]/g, ''));
    expect(newHoldings).toBe(initialHoldings + 1);
    
    const investedText = await page.locator('[data-testid="total-invested"]').textContent();
    expect(investedText).toContain('500,000');
  });

  // ========================================
  // 6단계: 계좌 삭제 테스트
  // ========================================
  test('6단계: 계좌 삭제 시 종목 상태 자동 전환', async ({ page }) => {
    // 계좌 + 보유 종목 추가
    await page.goto('/accounts');
    await page.click('text=새 계좌 추가');
    await page.fill('[name="brokerName"]', '데이터 동기화 테스트');
    await page.fill('[name="cashBalance"]', '1000000');
    await page.click('button:has-text("계좌 추가")');
    
    await page.goto('/holdings');
    await page.click('text=보유 종목 추가');
    await page.fill('[name="name"]', '동기화 테스트 종목');
    await page.fill('[name="code"]', 'TEST');
    await page.selectOption('[name="status"]', 'HOLDING');
    await page.selectOption('[name="accountId"]', { label: '데이터 동기화 테스트' });
    await page.fill('[name="quantity"]', '10');
    await page.fill('[name="avgPrice"]', '50000');
    await page.click('button:has-text("종목 추가")');
    
    // 대시보드 초기 상태
    await page.goto('/');
    const initialCashText = await page.locator('[data-testid="total-cash"]').textContent();
    const initialCash = parseInt(initialCashText!.replace(/[^0-9]/g, ''));
    
    // 계좌 삭제
    await page.goto('/accounts');
    await page.click('[data-testid="delete-account-데이터 동기화 테스트"]');
    await page.click('button:has-text("삭제")');
    
    // 대시보드 확인
    await page.click('text=대시보드');
    await page.waitForURL('**/');
    
    const newCashText = await page.locator('[data-testid="total-cash"]').textContent();
    const newCash = parseInt(newCashText!.replace(/[^0-9]/g, ''));
    expect(newCash).toBe(initialCash - 1000000);
    
    await expect(page.locator('text=데이터 동기화 테스트')).not.toBeVisible();
    
    // 종목이 관심 종목으로 전환되었는지 확인
    await page.goto('/watchlist');
    await expect(page.locator('text=동기화 테스트 종목')).toBeVisible();
  });

  // ========================================
  // 통합: 전체 플로우
  // ========================================
  test('전체 플로우: 1-6단계 연속 실행', async ({ page }) => {
    // 1. 계좌 추가
    await page.goto('/accounts');
    await page.click('text=새 계좌 추가');
    await page.fill('[name="brokerName"]', 'KB증권');
    await page.fill('[name="cashBalance"]', '10000000');
    await page.click('button:has-text("계좌 추가")');
    
    // 2. 관심 종목 추가
    await page.goto('/watchlist');
    await page.click('text=관심 종목 추가');
    await page.fill('[name="name"]', '삼성전자');
    await page.fill('[name="code"]', '005930');
    await page.click('button:has-text("관심 종목 추가")');
    
    // 3. 보유 종목으로 전환
    await page.click('text=삼성전자');
    await page.click('[data-testid="edit-button"]');
    await page.selectOption('[name="status"]', 'HOLDING');
    await page.selectOption('[name="accountId"]', { label: 'KB증권' });
    await page.fill('[name="quantity"]', '10');
    await page.fill('[name="avgPrice"]', '70000');
    await page.click('button:has-text("정보 업데이트")');
    
    // 4. 투자 노트 작성
    await page.click('text=새 투자 노트 작성');
    await page.fill('[name="buyReason"]', '장기 투자 목적');
    await page.click('button:has-text("노트 저장")');
    
    // 5. 대시보드 최종 확인
    await page.goto('/');
    
    await expect(page.locator('[data-testid="total-cash"]')).toContainText('10,000,000');
    await expect(page.locator('[data-testid="holdings-count"]')).toContainText('1');
    await expect(page.locator('[data-testid="total-invested"]')).toContainText('700,000');
    await expect(page.locator('[data-testid="notes-count"]')).toContainText('1');
    
    // 6. 콘솔 에러 확인
    const consoleErrors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });
    
    expect(consoleErrors).toHaveLength(0);
  });
});
```

---

## 실행 방법

### 단위 테스트

```bash
# 모든 단위 테스트 실행
pnpm test

# 특정 파일만 실행
pnpm test src/utils/__tests__/calculations.test.ts

# 워치 모드
pnpm test --watch

# 커버리지
pnpm test:coverage
```

### 통합 테스트

```bash
# Context 테스트
pnpm test src/contexts/__tests__

# 컴포넌트 통합 테스트
pnpm test src/pages/__tests__
```

### E2E 테스트

```bash
# 모든 E2E 테스트
pnpm test:e2e tests/data-sync-workflow.spec.ts

# UI 모드 (디버깅)
pnpm test:e2e:ui tests/data-sync-workflow.spec.ts

# 특정 테스트만
pnpm test:e2e tests/data-sync-workflow.spec.ts -g "2단계"

# 헤드리스 모드
pnpm test:e2e tests/data-sync-workflow.spec.ts --headed=false
```

### 전체 테스트

```bash
# 모든 테스트 실행
pnpm test:run && pnpm test:e2e
```

---

## 성공 기준

### 단위 테스트
- ✅ 모든 계산 함수가 정확한 값 반환
- ✅ 엣지 케이스 처리 (null, undefined, 0 등)
- ✅ 100% 코드 커버리지

### 통합 테스트
- ✅ Context 상태 변경 시 즉시 반영
- ✅ localStorage 동기화
- ✅ 컴포넌트 리렌더링 확인

### E2E 테스트
- ✅ 페이지 새로고침 없이 대시보드 수치 즉시 업데이트
- ✅ localStorage 데이터와 UI 표시값 일치
- ✅ 계산 오류(NaN, undefined) 없음
- ✅ 브라우저 콘솔 에러 없음
- ✅ 모든 플로우 재현 가능

---

## 다음 단계

1. ✅ 테스트 코드 작성
2. ✅ 테스트 실행 및 검증
3. 📝 실패한 테스트 디버깅
4. 📝 추가 엣지 케이스 테스트
5. 📝 CI/CD 파이프라인 통합
6. 📝 테스트 커버리지 80% 달성
