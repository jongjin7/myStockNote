# 테스트 환경 구성 가이드

StockNote 프로젝트의 테스트 환경을 구성하는 방법을 설명합니다.

## 📋 목차

1. [개요](#개요)
2. [Vitest 설정](#vitest-설정)
3. [Playwright 설정](#playwright-설정)
4. [테스트 작성 가이드](#테스트-작성-가이드)
5. [실행 방법](#실행-방법)
6. [CI/CD 통합](#cicd-통합)

---

## 개요

### 테스트 전략

```
        /\
       /E2E\          ← Playwright (핵심 플로우)
      /------\
     /통합테스트\      ← React Testing Library
    /----------\
   /  단위테스트  \    ← Vitest
  /--------------\
```

- **Vitest**: 단위 테스트 및 통합 테스트 (70%)
- **Playwright**: E2E 테스트 (30%)

---

## Vitest 설정

### 1. 패키지 설치

```bash
pnpm add -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom @vitest/ui
```

### 2. Vitest 설정 파일 생성

**`vitest.config.ts`** (프로젝트 루트)

```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    css: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/mockData',
      ],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

### 3. 테스트 설정 파일 생성

**`src/test/setup.ts`**

```typescript
import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

// 각 테스트 후 자동 정리
afterEach(() => {
  cleanup();
});

// localStorage mock
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
global.localStorage = localStorageMock as any;

// matchMedia mock (Tailwind CSS 등에서 필요)
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});
```

### 4. 테스트 유틸리티 생성

**`src/test/utils.tsx`**

```typescript
import { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AppProvider } from '../contexts/AppContext';
import { SettingsProvider } from '../contexts/SettingsContext';

// 모든 Provider를 포함한 래퍼
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <BrowserRouter>
      <SettingsProvider>
        <AppProvider>
          {children}
        </AppProvider>
      </SettingsProvider>
    </BrowserRouter>
  );
};

// 커스텀 render 함수
const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) => render(ui, { wrapper: AllTheProviders, ...options });

export * from '@testing-library/react';
export { customRender as render };
```

### 5. package.json 스크립트 추가

```json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:run": "vitest run",
    "test:coverage": "vitest run --coverage"
  }
}
```

---

## Playwright 설정

### 1. 패키지 설치

```bash
pnpm add -D @playwright/test
npx playwright install
```

### 2. Playwright 설정 파일 생성

**`playwright.config.ts`** (프로젝트 루트)

```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],

  webServer: {
    command: 'pnpm dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
  },
});
```

### 3. 테스트 디렉토리 구조 생성

```bash
mkdir -p tests
mkdir -p tests/fixtures
```

### 4. Playwright 픽스처 생성

**`tests/fixtures/index.ts`**

```typescript
import { test as base } from '@playwright/test';

// 커스텀 픽스처 정의
type MyFixtures = {
  authenticatedPage: any;
};

export const test = base.extend<MyFixtures>({
  authenticatedPage: async ({ page }, use) => {
    // 필요시 인증 로직 추가
    await use(page);
  },
});

export { expect } from '@playwright/test';
```

### 5. package.json 스크립트 추가

```json
{
  "scripts": {
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "test:e2e:debug": "playwright test --debug",
    "test:e2e:report": "playwright show-report"
  }
}
```

---

## 테스트 작성 가이드

### Vitest 단위 테스트 예시

**`src/utils/__tests__/calculations.test.ts`**

```typescript
import { describe, test, expect } from 'vitest';
import { calculateTotalAssets, calculateProfitRate } from '../calculations';

describe('포트폴리오 계산 함수', () => {
  test('총 자산 계산', () => {
    const accounts = [
      { cashBalance: 1000000 },
      { cashBalance: 2000000 },
    ];
    const stocks = [
      { quantity: 10, currentPrice: 50000 },
      { quantity: 5, currentPrice: 100000 },
    ];
    
    const result = calculateTotalAssets(accounts, stocks);
    expect(result).toBe(4000000); // 3M cash + 1M stocks
  });

  test('수익률 계산', () => {
    const invested = 1000000;
    const current = 1200000;
    
    const rate = calculateProfitRate(invested, current);
    expect(rate).toBe(20);
  });
});
```

### Vitest 컴포넌트 테스트 예시

**`src/components/__tests__/Switch.test.tsx`**

```typescript
import { describe, test, expect, vi } from 'vitest';
import { render, screen } from '@/test/utils';
import userEvent from '@testing-library/user-event';
import Switch from '../ui/Switch';

describe('Switch 컴포넌트', () => {
  test('렌더링 확인', () => {
    render(<Switch checked={false} onChange={() => {}} />);
    const switchElement = screen.getByRole('switch');
    expect(switchElement).toBeInTheDocument();
  });

  test('클릭 시 onChange 호출', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    
    render(<Switch checked={false} onChange={handleChange} />);
    const switchElement = screen.getByRole('switch');
    
    await user.click(switchElement);
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  test('disabled 상태에서 클릭 불가', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    
    render(<Switch checked={false} onChange={handleChange} disabled />);
    const switchElement = screen.getByRole('switch');
    
    await user.click(switchElement);
    expect(handleChange).not.toHaveBeenCalled();
  });
});
```

### Vitest 통합 테스트 예시

**`src/__tests__/dashboard-sync.test.tsx`**

```typescript
import { describe, test, expect, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@/test/utils';
import userEvent from '@testing-library/user-event';
import Dashboard from '@/pages/Dashboard';
import { useAppContext } from '@/contexts/AppContext';

describe('대시보드 데이터 동기화', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('계좌 추가 시 대시보드 즉시 업데이트', async () => {
    const user = userEvent.setup();
    const { rerender } = render(<Dashboard />);
    
    // 초기 예수금 확인
    const initialCash = screen.getByTestId('total-cash').textContent;
    
    // Context를 통해 계좌 추가 (실제로는 Accounts 페이지에서)
    const { result } = renderHook(() => useAppContext());
    act(() => {
      result.current.addAccount({
        id: 'test-1',
        brokerName: '테스트증권',
        cashBalance: 1000000,
      });
    });
    
    // 대시보드 리렌더링
    rerender(<Dashboard />);
    
    // 예수금 증가 확인
    await waitFor(() => {
      const newCash = screen.getByTestId('total-cash').textContent;
      expect(newCash).not.toBe(initialCash);
    });
  });
});
```

### Playwright E2E 테스트 예시

**`tests/data-sync.spec.ts`**

```typescript
import { test, expect } from './fixtures';

test.describe('데이터 동기화 E2E 테스트', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // localStorage 초기화
    await page.evaluate(() => localStorage.clear());
  });

  test('계좌 추가 시 대시보드 즉시 업데이트', async ({ page }) => {
    // 초기 예수금 확인
    const initialCash = await page.locator('[data-testid="total-cash"]').textContent();
    
    // 계좌 관리 페이지로 이동
    await page.click('text=계좌 관리');
    await page.waitForURL('**/accounts');
    
    // 계좌 추가
    await page.click('text=새 계좌 추가');
    await page.fill('[name="brokerName"]', '데이터 동기화 테스트');
    await page.fill('[name="cashBalance"]', '1000000');
    await page.click('text=계좌 추가');
    
    // 대시보드로 이동
    await page.click('text=대시보드');
    await page.waitForURL('**/');
    
    // 예수금 증가 확인
    const newCash = await page.locator('[data-testid="total-cash"]').textContent();
    expect(parseInt(newCash!.replace(/[^0-9]/g, ''))).toBeGreaterThan(
      parseInt(initialCash!.replace(/[^0-9]/g, ''))
    );
  });

  test('전체 투자 플로우', async ({ page }) => {
    // 1. 계좌 추가
    await page.goto('/accounts');
    await page.click('text=새 계좌 추가');
    await page.fill('[name="brokerName"]', 'KB증권');
    await page.fill('[name="cashBalance"]', '10000000');
    await page.click('text=계좌 추가');
    
    // 2. 관심 종목 추가
    await page.goto('/watchlist');
    await page.click('text=관심 종목 추가');
    await page.fill('[name="name"]', '삼성전자');
    await page.fill('[name="code"]', '005930');
    await page.click('text=관심 종목 추가');
    
    // 3. 보유 종목으로 전환
    await page.click('text=삼성전자');
    await page.click('[data-testid="edit-button"]');
    await page.selectOption('[name="status"]', 'HOLDING');
    await page.fill('[name="quantity"]', '10');
    await page.fill('[name="avgPrice"]', '70000');
    await page.click('text=정보 업데이트');
    
    // 4. 대시보드 확인
    await page.goto('/');
    await expect(page.locator('[data-testid="holdings-count"]')).toContainText('1');
    await expect(page.locator('[data-testid="total-invested"]')).toContainText('700,000');
  });
});
```

---

## 실행 방법

### Vitest 실행

```bash
# 워치 모드 (개발 중)
pnpm test

# UI 모드 (시각적 인터페이스)
pnpm test:ui

# 단일 실행 (CI/CD)
pnpm test:run

# 커버리지 리포트
pnpm test:coverage
```

### Playwright 실행

```bash
# 모든 브라우저에서 테스트
pnpm test:e2e

# UI 모드 (디버깅)
pnpm test:e2e:ui

# 특정 브라우저만
pnpm test:e2e --project=chromium

# 디버그 모드
pnpm test:e2e:debug

# 리포트 보기
pnpm test:e2e:report
```

### 전체 테스트 실행

```bash
# 모든 테스트 실행
pnpm test:run && pnpm test:e2e
```

---

## CI/CD 통합

### GitHub Actions 예시

**`.github/workflows/test.yml`**

```yaml
name: Tests

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  unit-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'pnpm'
      
      - name: Install dependencies
        run: pnpm install
      
      - name: Run unit tests
        run: pnpm test:run
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/coverage-final.json

  e2e-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'pnpm'
      
      - name: Install dependencies
        run: pnpm install
      
      - name: Install Playwright browsers
        run: npx playwright install --with-deps
      
      - name: Run E2E tests
        run: pnpm test:e2e
      
      - name: Upload test results
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: playwright-report
          path: playwright-report/
```

---

## 디렉토리 구조

```
myStockNote/
├── src/
│   ├── __tests__/              # 통합 테스트
│   │   └── dashboard-sync.test.tsx
│   ├── components/
│   │   └── __tests__/          # 컴포넌트 테스트
│   │       └── Switch.test.tsx
│   ├── utils/
│   │   └── __tests__/          # 유틸리티 테스트
│   │       └── calculations.test.ts
│   └── test/                   # 테스트 설정
│       ├── setup.ts
│       └── utils.tsx
├── tests/                      # E2E 테스트
│   ├── fixtures/
│   │   └── index.ts
│   └── data-sync.spec.ts
├── vitest.config.ts
├── playwright.config.ts
└── package.json
```

---

## 다음 단계

1. ✅ 패키지 설치
2. ✅ 설정 파일 생성
3. ✅ 테스트 작성
4. ✅ CI/CD 통합
5. 📝 테스트 커버리지 목표 설정 (80% 이상)

---

## 참고 자료

- [Vitest 공식 문서](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [Playwright 공식 문서](https://playwright.dev/)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
