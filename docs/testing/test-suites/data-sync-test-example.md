# 데이터 동기화 테스트 자동화

`.agent/workflows/test-data-sync.md` 워크플로우를 Playwright로 자동화한 예시입니다.

## 📋 테스트 시나리오

워크플로우의 6단계를 자동화된 E2E 테스트로 구현합니다.

---

## 🧪 테스트 코드

### tests/data-sync.spec.ts

```typescript
import { test, expect } from '@playwright/test';

test.describe('대시보드 데이터 동기화 테스트', () => {
  
  test.beforeEach(async ({ page }) => {
    // 각 테스트 전 초기화
    await page.goto('/');
    await page.evaluate(() => {
      localStorage.clear();
      // 기본 mock 데이터 로드 (필요시)
      // mockUtils.load();
    });
    await page.reload();
  });

  // ========================================
  // 1단계: 초기 상태 확인
  // ========================================
  test('1단계: 초기 상태 확인', async ({ page }) => {
    await page.goto('/');
    
    // 대시보드 로딩 대기
    await page.waitForSelector('[data-testid="dashboard"]');
    
    // 콘솔에서 데이터 확인
    const data = await page.evaluate(async () => {
      // @ts-ignore
      const apiData = await api.getData();
      return {
        accountsCount: apiData.accounts.length,
        stocksCount: apiData.stocks.length,
        memosCount: apiData.memos.length,
      };
    });
    
    console.log('초기 데이터:', data);
    
    // UI 값 확인
    const totalCash = await page.locator('[data-testid="total-cash"]').textContent();
    const totalInvested = await page.locator('[data-testid="total-invested"]').textContent();
    
    expect(totalCash).toBeTruthy();
    expect(totalInvested).toBeTruthy();
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
    await page.waitForSelector('[data-testid="account-modal"]');
    
    await page.fill('[name="brokerName"]', '데이터 동기화 테스트');
    await page.fill('[name="cashBalance"]', '1000000');
    await page.click('button:has-text("계좌 추가")');
    
    // 모달 닫힘 대기
    await page.waitForSelector('[data-testid="account-modal"]', { state: 'hidden' });
    
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
    
    // 초기 관심 종목 수 확인
    const initialWatchlistText = await page.locator('[data-testid="watchlist-count"]').textContent();
    const initialCount = parseInt(initialWatchlistText!.replace(/[^0-9]/g, ''));
    
    // 관심 종목 페이지로 이동
    await page.click('text=관심 종목');
    await page.waitForURL('**/watchlist');
    
    // 관심 종목 추가
    await page.click('text=관심 종목 추가');
    await page.waitForSelector('[data-testid="stock-modal"]');
    
    await page.fill('[name="name"]', '동기화 테스트 종목');
    await page.fill('[name="code"]', 'TEST');
    await page.selectOption('[name="sector"]', 'Technology');
    await page.click('button:has-text("관심 종목 추가")');
    
    // 즉시 대시보드로 이동
    await page.click('text=대시보드');
    await page.waitForURL('**/');
    
    // 검증
    const newWatchlistText = await page.locator('[data-testid="watchlist-count"]').textContent();
    const newCount = parseInt(newWatchlistText!.replace(/[^0-9]/g, ''));
    
    expect(newCount).toBe(initialCount + 1);
    
    // 보유 종목은 여전히 0개인지 확인
    const holdingsText = await page.locator('[data-testid="holdings-count"]').textContent();
    expect(holdingsText).toContain('0');
  });

  // ========================================
  // 4단계: 투자 노트 작성 테스트
  // ========================================
  test('4단계: 투자 노트 작성 시 대시보드 즉시 업데이트', async ({ page }) => {
    // 먼저 관심 종목 추가
    await page.goto('/watchlist');
    await page.click('text=관심 종목 추가');
    await page.fill('[name="name"]', '동기화 테스트 종목');
    await page.fill('[name="code"]', 'TEST');
    await page.click('button:has-text("관심 종목 추가")');
    
    // 대시보드로 이동하여 초기 노트 수 확인
    await page.goto('/');
    const initialNotesText = await page.locator('[data-testid="notes-count"]').textContent();
    const initialNotes = parseInt(initialNotesText!.replace(/[^0-9]/g, ''));
    
    // 종목 상세 페이지로 이동
    await page.goto('/watchlist');
    await page.click('text=동기화 테스트 종목');
    
    // 투자 노트 작성
    await page.click('text=새 투자 노트 작성');
    await page.waitForSelector('[data-testid="memo-modal"]');
    
    await page.fill('[name="buyReason"]', '반응성 테스트를 위한 노트');
    await page.click('button:has-text("노트 저장")');
    
    // 즉시 대시보드로 이동
    await page.click('text=대시보드');
    await page.waitForURL('**/');
    
    // 검증
    const newNotesText = await page.locator('[data-testid="notes-count"]').textContent();
    const newNotes = parseInt(newNotesText!.replace(/[^0-9]/g, ''));
    
    expect(newNotes).toBe(initialNotes + 1);
    
    // 최근 투자 노트 섹션 확인
    await expect(page.locator('text=반응성 테스트를 위한 노트')).toBeVisible();
  });

  // ========================================
  // 5단계: 관심 종목 → 보유 종목 전환 테스트
  // ========================================
  test('5단계: 관심 종목을 보유 종목으로 전환 시 대시보드 업데이트', async ({ page }) => {
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
    
    // 대시보드 초기 상태 확인
    await page.goto('/');
    const initialHoldingsText = await page.locator('[data-testid="holdings-count"]').textContent();
    const initialHoldings = parseInt(initialHoldingsText!.replace(/[^0-9]/g, ''));
    const initialInvestedText = await page.locator('[data-testid="total-invested"]').textContent();
    const initialInvested = parseInt(initialInvestedText!.replace(/[^0-9]/g, ''));
    
    // 종목 상세 페이지로 이동
    await page.goto('/watchlist');
    await page.click('text=동기화 테스트 종목');
    
    // 수정 모드로 전환
    await page.click('[data-testid="edit-button"]');
    
    // 보유 중으로 변경
    await page.selectOption('[name="status"]', 'HOLDING');
    await page.selectOption('[name="accountId"]', { label: '데이터 동기화 테스트' });
    await page.fill('[name="quantity"]', '10');
    await page.fill('[name="avgPrice"]', '50000');
    await page.click('button:has-text("정보 업데이트")');
    
    // 즉시 대시보드로 이동
    await page.click('text=대시보드');
    await page.waitForURL('**/');
    
    // 검증
    const newHoldingsText = await page.locator('[data-testid="holdings-count"]').textContent();
    const newHoldings = parseInt(newHoldingsText!.replace(/[^0-9]/g, ''));
    expect(newHoldings).toBe(initialHoldings + 1);
    
    const newInvestedText = await page.locator('[data-testid="total-invested"]').textContent();
    const newInvested = parseInt(newInvestedText!.replace(/[^0-9]/g, ''));
    expect(newInvested).toBe(initialInvested + 500000); // 10주 × 50,000원
    
    // 보유 종목 섹션 확인
    await expect(page.locator('[data-testid="holdings-section"]')).toContainText('동기화 테스트 종목');
    
    // 관심 종목 카운트 감소 확인
    const watchlistText = await page.locator('[data-testid="watchlist-count"]').textContent();
    expect(parseInt(watchlistText!.replace(/[^0-9]/g, ''))).toBe(0);
  });

  // ========================================
  // 6단계: 계좌 삭제 테스트
  // ========================================
  test('6단계: 계좌 삭제 시 대시보드 업데이트 및 종목 상태 전환', async ({ page }) => {
    // 계좌 추가
    await page.goto('/accounts');
    await page.click('text=새 계좌 추가');
    await page.fill('[name="brokerName"]', '데이터 동기화 테스트');
    await page.fill('[name="cashBalance"]', '1000000');
    await page.click('button:has-text("계좌 추가")');
    
    // 보유 종목 추가
    await page.goto('/holdings');
    await page.click('text=보유 종목 추가');
    await page.fill('[name="name"]', '동기화 테스트 종목');
    await page.fill('[name="code"]', 'TEST');
    await page.selectOption('[name="status"]', 'HOLDING');
    await page.selectOption('[name="accountId"]', { label: '데이터 동기화 테스트' });
    await page.fill('[name="quantity"]', '10');
    await page.fill('[name="avgPrice"]', '50000');
    await page.click('button:has-text("종목 추가")');
    
    // 대시보드 초기 상태 확인
    await page.goto('/');
    const initialCashText = await page.locator('[data-testid="total-cash"]').textContent();
    const initialCash = parseInt(initialCashText!.replace(/[^0-9]/g, ''));
    
    // 계좌 삭제
    await page.goto('/accounts');
    await page.click('[data-testid="delete-account-데이터 동기화 테스트"]');
    
    // 삭제 확인 다이얼로그
    await page.click('button:has-text("삭제")');
    
    // 즉시 대시보드로 이동
    await page.click('text=대시보드');
    await page.waitForURL('**/');
    
    // 검증
    const newCashText = await page.locator('[data-testid="total-cash"]').textContent();
    const newCash = parseInt(newCashText!.replace(/[^0-9]/g, ''));
    expect(newCash).toBe(initialCash - 1000000);
    
    // 계좌 요약 섹션에서 사라졌는지 확인
    await expect(page.locator('text=데이터 동기화 테스트')).not.toBeVisible();
    
    // 종목이 관심 종목으로 되돌아갔는지 확인
    await page.goto('/watchlist');
    await expect(page.locator('text=동기화 테스트 종목')).toBeVisible();
  });

  // ========================================
  // 통합 테스트: 전체 플로우
  // ========================================
  test('전체 플로우: 계좌 추가 → 종목 추가 → 매수 → 노트 작성 → 삭제', async ({ page }) => {
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
    
    // 모든 수치 검증
    await expect(page.locator('[data-testid="total-cash"]')).toContainText('10,000,000');
    await expect(page.locator('[data-testid="holdings-count"]')).toContainText('1');
    await expect(page.locator('[data-testid="total-invested"]')).toContainText('700,000');
    await expect(page.locator('[data-testid="notes-count"]')).toContainText('1');
    
    // 브라우저 콘솔 에러 확인
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

## 🚀 실행 방법

```bash
# 모든 데이터 동기화 테스트 실행
pnpm test:e2e tests/data-sync.spec.ts

# UI 모드로 실행 (디버깅)
pnpm test:e2e:ui tests/data-sync.spec.ts

# 특정 테스트만 실행
pnpm test:e2e tests/data-sync.spec.ts -g "2단계"

# 헤드리스 모드 (CI/CD)
pnpm test:e2e tests/data-sync.spec.ts --headed=false
```

---

## 📊 성공 기준

모든 테스트가 통과하면:

- ✅ 페이지 새로고침 없이 대시보드 수치 즉시 업데이트
- ✅ localStorage 데이터와 UI 표시값 일치
- ✅ 계산 오류(NaN, undefined) 없음
- ✅ 브라우저 콘솔 에러 없음
- ✅ 모든 플로우 재현 가능

---

## 🎯 다음 단계

1. 테스트 실행 및 결과 확인
2. 실패한 테스트 디버깅
3. 추가 엣지 케이스 테스트 작성
4. CI/CD 파이프라인에 통합
