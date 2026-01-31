# 테스트 환경 구성 체크리스트

빠른 설정을 위한 단계별 체크리스트입니다.

## 🚀 빠른 시작 (Quick Start)

### 1단계: 패키지 설치

```bash
# Vitest 및 React Testing Library
pnpm add -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom @vitest/ui

# Playwright
pnpm add -D @playwright/test
npx playwright install
```

### 2단계: 설정 파일 생성

- [ ] `vitest.config.ts` 생성
- [ ] `playwright.config.ts` 생성
- [ ] `src/test/setup.ts` 생성
- [ ] `src/test/utils.tsx` 생성
- [ ] `tests/fixtures/index.ts` 생성

### 3단계: package.json 스크립트 추가

```json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:run": "vitest run",
    "test:coverage": "vitest run --coverage",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "test:e2e:debug": "playwright test --debug",
    "test:e2e:report": "playwright show-report"
  }
}
```

### 4단계: 첫 테스트 작성

- [ ] 단위 테스트 작성 (`src/utils/__tests__/`)
- [ ] 컴포넌트 테스트 작성 (`src/components/__tests__/`)
- [ ] E2E 테스트 작성 (`tests/`)

### 5단계: 테스트 실행

```bash
# Vitest
pnpm test

# Playwright
pnpm test:e2e
```

---

## 📝 설정 파일 템플릿

### vitest.config.ts

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
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

### playwright.config.ts

```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
  webServer: {
    command: 'pnpm dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
  },
});
```

### src/test/setup.ts

```typescript
import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

afterEach(() => {
  cleanup();
});

const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
global.localStorage = localStorageMock as any;
```

### src/test/utils.tsx

```typescript
import { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AppProvider } from '../contexts/AppContext';
import { SettingsProvider } from '../contexts/SettingsContext';

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

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) => render(ui, { wrapper: AllTheProviders, ...options });

export * from '@testing-library/react';
export { customRender as render };
```

---

## 🎯 테스트 작성 템플릿

### 단위 테스트

```typescript
// src/utils/__tests__/example.test.ts
import { describe, test, expect } from 'vitest';
import { myFunction } from '../example';

describe('myFunction', () => {
  test('should return expected value', () => {
    const result = myFunction(input);
    expect(result).toBe(expected);
  });
});
```

### 컴포넌트 테스트

```typescript
// src/components/__tests__/MyComponent.test.tsx
import { describe, test, expect } from 'vitest';
import { render, screen } from '@/test/utils';
import MyComponent from '../MyComponent';

describe('MyComponent', () => {
  test('renders correctly', () => {
    render(<MyComponent />);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });
});
```

### E2E 테스트

```typescript
// tests/example.spec.ts
import { test, expect } from '@playwright/test';

test('basic test', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/StockNote/);
});
```

---

## ✅ 검증 체크리스트

### 설치 확인

```bash
# Vitest 설치 확인
pnpm test --version

# Playwright 설치 확인
npx playwright --version
```

### 테스트 실행 확인

- [ ] `pnpm test` 실행 성공
- [ ] `pnpm test:e2e` 실행 성공
- [ ] 테스트 리포트 생성 확인

### 디렉토리 구조 확인

```
✓ src/test/setup.ts
✓ src/test/utils.tsx
✓ tests/fixtures/index.ts
✓ vitest.config.ts
✓ playwright.config.ts
```

---

## 🐛 문제 해결

### Vitest 관련

**문제: `Cannot find module '@testing-library/jest-dom'`**
```bash
pnpm add -D @testing-library/jest-dom
```

**문제: `ReferenceError: vi is not defined`**
```typescript
// vitest.config.ts에 globals: true 추가
test: {
  globals: true,
}
```

### Playwright 관련

**문제: `browserType.launch: Executable doesn't exist`**
```bash
npx playwright install
```

**문제: `Error: page.goto: net::ERR_CONNECTION_REFUSED`**
```bash
# 개발 서버가 실행 중인지 확인
pnpm dev
```

---

## 📚 추가 리소스

- [상세 가이드](./testing-setup.md)
- [Vitest 문서](https://vitest.dev/)
- [Playwright 문서](https://playwright.dev/)
- [Testing Library 문서](https://testing-library.com/)
