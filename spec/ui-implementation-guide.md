# 주식 노트 UI 구현 가이드 (UI Implementation Guide)

이 문서는 [PRD (MVP v2.0)](./prd.md)를 기반으로 프론트엔드 개발에 필요한 UI 컴포넌트, 레이아웃, 인터랙션, 디자인 시스템을 상세히 정의한다.

---

## 1. 디자인 시스템 (Design System)

### 1.1 컬러 팔레트 (Color Palette)

#### Primary Colors
```css
--color-primary-50: hsl(220, 70%, 97%)
--color-primary-100: hsl(220, 70%, 92%)
--color-primary-200: hsl(220, 70%, 85%)
--color-primary-500: hsl(220, 70%, 50%)   /* Main Brand Color */
--color-primary-600: hsl(220, 70%, 45%)
--color-primary-700: hsl(220, 70%, 40%)
--color-primary-900: hsl(220, 70%, 20%)
```

#### Semantic Colors
```css
/* Success - 수익, 긍정적 상태 */
--color-success-light: hsl(142, 71%, 45%)
--color-success: hsl(142, 71%, 35%)
--color-success-dark: hsl(142, 71%, 25%)

/* Danger - 손실, 경고 */
--color-danger-light: hsl(0, 84%, 60%)
--color-danger: hsl(0, 84%, 50%)
--color-danger-dark: hsl(0, 84%, 40%)

/* Warning - 주의 필요 */
--color-warning-light: hsl(38, 92%, 60%)
--color-warning: hsl(38, 92%, 50%)
--color-warning-dark: hsl(38, 92%, 40%)

/* Info - 정보성 */
--color-info-light: hsl(199, 89%, 60%)
--color-info: hsl(199, 89%, 48%)
--color-info-dark: hsl(199, 89%, 38%)
```

#### Neutral Colors
```css
--color-gray-50: hsl(220, 20%, 98%)
--color-gray-100: hsl(220, 15%, 95%)
--color-gray-200: hsl(220, 13%, 91%)
--color-gray-300: hsl(220, 12%, 82%)
--color-gray-400: hsl(220, 9%, 65%)
--color-gray-500: hsl(220, 9%, 46%)
--color-gray-600: hsl(220, 12%, 36%)
--color-gray-700: hsl(220, 15%, 25%)
--color-gray-800: hsl(220, 18%, 15%)
--color-gray-900: hsl(220, 20%, 10%)
```

#### Background & Surface
```css
--color-bg-primary: hsl(220, 20%, 98%)      /* 메인 배경 */
--color-bg-secondary: hsl(220, 15%, 95%)    /* 카드 배경 */
--color-surface: hsl(0, 0%, 100%)           /* 카드, 모달 */
--color-surface-hover: hsl(220, 20%, 97%)   /* 호버 상태 */
```

### 1.2 타이포그래피 (Typography)

#### Font Family
```css
--font-primary: 'Pretendard', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif
--font-mono: 'JetBrains Mono', 'Fira Code', monospace
```

#### Font Sizes
```css
--text-xs: 0.75rem      /* 12px - 캡션, 메타 정보 */
--text-sm: 0.875rem     /* 14px - 보조 텍스트 */
--text-base: 1rem       /* 16px - 본문 */
--text-lg: 1.125rem     /* 18px - 강조 텍스트 */
--text-xl: 1.25rem      /* 20px - 소제목 */
--text-2xl: 1.5rem      /* 24px - 제목 */
--text-3xl: 1.875rem    /* 30px - 대제목 */
--text-4xl: 2.25rem     /* 36px - 히어로 */
```

#### Font Weights
```css
--font-light: 300
--font-regular: 400
--font-medium: 500
--font-semibold: 600
--font-bold: 700
```

#### Line Heights
```css
--leading-tight: 1.25
--leading-normal: 1.5
--leading-relaxed: 1.75
```

### 1.3 간격 시스템 (Spacing)

```css
--space-1: 0.25rem    /* 4px */
--space-2: 0.5rem     /* 8px */
--space-3: 0.75rem    /* 12px */
--space-4: 1rem       /* 16px */
--space-5: 1.25rem    /* 20px */
--space-6: 1.5rem     /* 24px */
--space-8: 2rem       /* 32px */
--space-10: 2.5rem    /* 40px */
--space-12: 3rem      /* 48px */
--space-16: 4rem      /* 64px */
```

### 1.4 그림자 (Shadows)

```css
--shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05)
--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)
--shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)
--shadow-2xl: 0 25px 50px -12px rgba(0, 0, 0, 0.25)
```

### 1.5 둥근 모서리 (Border Radius)

```css
--radius-sm: 0.25rem    /* 4px */
--radius-md: 0.5rem     /* 8px */
--radius-lg: 0.75rem    /* 12px */
--radius-xl: 1rem       /* 16px */
--radius-2xl: 1.5rem    /* 24px */
--radius-full: 9999px   /* 완전한 원형 */
```

### 1.6 애니메이션 (Animations)

```css
--transition-fast: 150ms cubic-bezier(0.4, 0, 0.2, 1)
--transition-base: 200ms cubic-bezier(0.4, 0, 0.2, 1)
--transition-slow: 300ms cubic-bezier(0.4, 0, 0.2, 1)
--transition-slower: 500ms cubic-bezier(0.4, 0, 0.2, 1)
```

---

## 2. 공통 컴포넌트 (Common Components)

### 2.1 Button (버튼)

#### Variants

**Primary Button**
```
용도: 주요 액션 (저장, 추가, 확인)
배경: var(--color-primary-500)
텍스트: white
호버: var(--color-primary-600) + scale(1.02)
활성: var(--color-primary-700) + scale(0.98)
```

**Secondary Button**
```
용도: 보조 액션 (취소, 닫기)
배경: transparent
테두리: 1px solid var(--color-gray-300)
텍스트: var(--color-gray-700)
호버: var(--color-gray-100)
```

**Danger Button**
```
용도: 삭제, 위험한 액션
배경: var(--color-danger)
텍스트: white
호버: var(--color-danger-dark)
```

**Ghost Button**
```
용도: 텍스트 링크형 버튼
배경: transparent
텍스트: var(--color-primary-500)
호버: var(--color-primary-50)
```

#### Sizes
```
sm: padding 0.5rem 1rem, text-sm
md: padding 0.75rem 1.5rem, text-base (기본)
lg: padding 1rem 2rem, text-lg
```

#### States
- Default
- Hover (scale + brightness)
- Active (scale down)
- Disabled (opacity 0.5, cursor not-allowed)
- Loading (spinner + disabled)

### 2.2 Input (입력 필드)

#### Text Input
```
높이: 2.75rem (44px - 터치 친화적)
패딩: 0.75rem 1rem
테두리: 1px solid var(--color-gray-300)
둥근 모서리: var(--radius-md)
폰트: var(--text-base)

Focus 상태:
- 테두리: 2px solid var(--color-primary-500)
- 그림자: 0 0 0 3px var(--color-primary-100)

Error 상태:
- 테두리: 2px solid var(--color-danger)
- 그림자: 0 0 0 3px hsla(0, 84%, 50%, 0.1)
```

#### Textarea
```
최소 높이: 6rem (96px)
리사이즈: vertical
나머지: Text Input과 동일
```

#### Number Input
```
텍스트 정렬: right
폰트: var(--font-mono) (숫자 가독성)
천 단위 구분 쉼표 자동 표시
```

### 2.3 Card (카드)

#### Base Card
```
배경: var(--color-surface)
테두리: 1px solid var(--color-gray-200)
둥근 모서리: var(--radius-lg)
그림자: var(--shadow-sm)
패딩: var(--space-6)

호버 시:
- 그림자: var(--shadow-md)
- transform: translateY(-2px)
- transition: var(--transition-base)
```

#### Interactive Card (클릭 가능)
```
cursor: pointer
호버 시 배경: var(--color-surface-hover)
```

### 2.4 Badge (배지)

#### Status Badges
```
HOLDING: 
  배경: var(--color-success-light) + opacity 0.1
  텍스트: var(--color-success-dark)
  
PARTIAL_SOLD:
  배경: var(--color-warning-light) + opacity 0.1
  텍스트: var(--color-warning-dark)
  
SOLD:
  배경: var(--color-gray-300)
  텍스트: var(--color-gray-700)
  
WATCHLIST:
  배경: var(--color-info-light) + opacity 0.1
  텍스트: var(--color-info-dark)
```

#### 공통 스타일
```
패딩: 0.25rem 0.75rem
둥근 모서리: var(--radius-full)
폰트: var(--text-xs), var(--font-semibold)
```

### 2.5 Modal (모달)

#### Overlay
```
배경: rgba(0, 0, 0, 0.5)
backdrop-filter: blur(4px)
z-index: 1000
```

#### Modal Container
```
최대 너비: 600px (모바일: 90vw)
배경: var(--color-surface)
둥근 모서리: var(--radius-xl)
그림자: var(--shadow-2xl)
패딩: var(--space-8)

애니메이션:
- 진입: opacity 0 → 1, scale 0.95 → 1
- 퇴장: opacity 1 → 0, scale 1 → 0.95
- duration: var(--transition-base)
```

### 2.6 Toast Notification (토스트 알림)

```
위치: 화면 우측 상단 (top-right)
최대 너비: 400px
배경: var(--color-surface)
테두리: 1px solid (상태별 색상)
그림자: var(--shadow-lg)
패딩: var(--space-4)
둥근 모서리: var(--radius-lg)

타입별 좌측 강조선:
- Success: 4px solid var(--color-success)
- Error: 4px solid var(--color-danger)
- Warning: 4px solid var(--color-warning)
- Info: 4px solid var(--color-info)

자동 닫힘: 3초 (사용자가 호버 시 일시정지)
```

---

## 3. 화면별 UI 상세 (Screen Specifications)

### 3.1 레이아웃 구조 (Layout Structure)

#### Desktop Layout (1024px 이상)
```
┌─────────────────────────────────────────┐
│  Container (h-screen, overflow-hidden)   │
├──────────┬──────────────────────────────┤
│          │                              │
│ Sidebar  │  Main Content Area           │
│ (Fixed)  │  (Scrollable, overflow-auto) │
│          │                              │
│          │                              │
└──────────┴──────────────────────────────┘
```

#### Mobile Layout (768px 미만)
```
┌─────────────────────────────────────────┐
│  Header (고정, 56px)                     │
│  [햄버거 메뉴]                           │
├─────────────────────────────────────────┤
│                                         │
│  Main Content Area (전체 너비)           │
│                                         │
│                                         │
├─────────────────────────────────────────┤
│  Bottom Navigation (고정, 64px)          │
└─────────────────────────────────────────┘
```

### 3.2 Header (헤더)

#### Desktop Header
```
높이: 64px
배경: var(--color-surface)
테두리 하단: 1px solid var(--color-gray-200)
그림자: var(--shadow-sm)

구성 요소:
┌─────────────────────────────────────────┐
│ [로고] 주식 노트    [검색]    [설정] [프로필] │
└─────────────────────────────────────────┘

로고:
- 폰트: var(--text-xl), var(--font-bold)
- 색상: var(--color-primary-500)
- 좌측 패딩: var(--space-6)

검색 (Phase 2):
- 너비: 300px
- placeholder: "종목명 또는 메모 검색..."

우측 아이콘:
- 크기: 24px
- 간격: var(--space-4)
- 호버: 배경 var(--color-gray-100), 둥근 모서리
```

#### Mobile Header
```
높이: 56px
구성:
┌─────────────────────────────────────────┐
│ [☰]  주식 노트                    [검색]  │
└─────────────────────────────────────────┘

햄버거 메뉴:
- 클릭 시 좌측에서 슬라이드 인 (240px)
- Overlay 배경 클릭 시 닫힘
```

### 3.3 Sidebar (사이드바)

#### Desktop Sidebar
```
기본 너비: 224px (w-56)
축소 너비: 80px (w-20)
배경: var(--color-gray-950)
고정: h-full z-20

브랜딩 및 상단:
- 로고: logo_full.png 이미지 적용 (Home 이동 링크)
- 정보 패널: Snapshot/Update 데이터 표시 (점선 테두리, 클릭 불가능한 정적 패널)

기능:
- 접기/펼치기 토글 버튼 (우측 상단, 호버 시 노출)
- cursor-pointer 스타일 적용
- overflow-visible (토글 버튼 잘림 방지)

메뉴 아이템:
- 높이: 48px (py-4)
- 둥근 모서리: var(--radius-2xl)
- 활성 시 배경: var(--color-gray-900)
- 활성 시 텍스트: white
- 비활성 시 텍스트: var(--color-gray-500)

축소 상태 (Collapsed):
- 로고: "SN" 심볼만 표시
- 메뉴: 아이콘만 표시 (텍스트 숨김)
```

#### Mobile Bottom Navigation
```
높이: 64px
배경: var(--color-surface)
테두리 상단: 1px solid var(--color-gray-200)
그림자: 0 -2px 10px rgba(0, 0, 0, 0.1)

구성:
┌────────┬────────┬────────┬────────┐
│ 대시보드 │ 계좌   │ 관심   │ 더보기  │
│   📊   │  💼   │  👁️  │   ⋯   │
└────────┴────────┴────────┴────────┘

아이콘:
- 크기: 24px
- 라벨: var(--text-xs)
- 활성: var(--color-primary-500)
- 비활성: var(--color-gray-500)
```

### 3.4 대시보드 (Dashboard)

#### 레이아웃 구조
```
┌─────────────────────────────────────────────────────────────┐
│  [Hero Section: 총 자산 가치 요약 카드]                         │
├──────────────────┬──────────────────────┬───────────────────┤
│  Holding Stocks  │  Quick Stats Cards   │  Recent Thesis    │
│  (Active Portfolio)│  (Stocks / Memos)   │  (Review Feed)    │
└──────────────────┴──────────────────────┴───────────────────┘
```

#### 전체 예수금 요약 카드 (Hero Stats Section)
```
배경: Layered Premium Dark
  - Surface: bg-gradient-to-br from-gray-900 via-gray-900 to-gray-950
  - Border: 1px solid border-gray-800/50 (상단 및 좌측 광원 효과)
  - Effects: 
    * primary-600/10 Radial Glow (우측 상단)
    * Backdrop-filter: blur(100px) 고도화
    * Subtle Noise Texture (질감 오버레이)

구성 요소 및 위계 (Typography Depth):
┌───────────────────────────────────────────────────────────────┐
│ [L4: text-base, font-black, text-primary-500]                 │
│ TOTAL ASSETS | 총 자산 가치                                    │
│                                                               │
│ [L1: text-6xl, font-black, text-white]                        │
│ ₩ (text-3xl, font-light, text-gray-500, opacity-50) 62,345,678 │
│                                                               │
│ [Live Indicator: text-sm, font-bold, text-gray-600]           │
│ ● 자본 총합 (평가자산 + 총 예수금)                                │
│                                                               │
│   ┌───────────────────────────────────────────────────────────┐   │
│   │ [Floating Card: Glassmorphism / backdrop-blur-3xl]        │   │
│   │ Holdings P/L (text-xs, gray-500)                          │   │
│   │ 평가손익 (text-xs, gray-500) [ROI Badge: font-num]         │   │
│   │                                                           │   │
│   │ { (+) or (-) Amount: Liquid Typography Scale }            │   │
│   │ * Note: Explicit sign added / Loss text: text-info-light  │   │
│   │ * Unit: "원" (text-2xl, opacity-50)                        │   │
│   │ [Deco Icon: Bottom-Right Corner / Opacity 0.05]           │   │
│   └───────────────────────────────────────────────────────────┘   │
│                                                               │
│ ───────────────────────────────────────────────────────────── │
│ 평가자산 (L4)       총 예수금 (L4)       투자비용 (L4)       현금 비중    │
│ ₩ 50,000,000      ₩ 12,345,678      ₩ 48,000,000      19.7%       │
│ [text-2xl, font-black, text-gray-100]                   [L3: 2xl] │
└───────────────────────────────────────────────────────────────┘

디자인 디테일:
- 포트폴리오 센터: 가장 큰 지표(L1)를 총 자산 가치로 설정하여 전체 자산 규모를 한눈에 파악
- 레이아웃 최적화: 대시보드 상단 타이틀/배지 제거로 핵심 정보를 최상단 배치
- 폰트 이원화: 한글(Pretendard), 숫자 및 영문 기호(Inter - font-num)
- Tabular Nums: 모든 금액 수치에 산술적 정렬을 위한 고정폭 폰트 적용
```

#### 계좌별 예수금 섹션
```
제목: "계좌별 예수금"
우측: [+ 계좌 추가] 버튼

카드 리스트:
┌─────────────────────────────────────────┐
│ 한국투자증권                              │
│ ₩ 5,000,000                             │
│ 업데이트: 1일 전                          │
│ ─────────────────────────────────────   │
│ 유안타증권                                │
│ ₩ 7,345,678                             │
#### 퀵 스탯 카드 (Grid Quick Stats)
```
배경: bg-gray-900/30, border-gray-800/50, backdrop-blur (Card 컴포넌트)
인터랙션: hover:bg-gray-900/50, translateY(-2px), shadow-2xl

카드 1: Holdings (보유 종목 수)
- 아이콘: TrendingUp (bg-success/10, text-success)
- 라벨: "Holdings" (text-[11px], font-black, gray-500, uppercase)
- 데이터: {count} Stocks (count: text-5xl, font-black, white / Stocks: text-xl, font-bold, gray-600)
- 설명: "Currently managed investment positions" (text-sm, gray-500)
- 배경 데코: TrendingUp 아이콘 (opacity-5, size-120)

카드 2: Research Docs (작성된 메모 수)
- 아이콘: FileText (bg-primary-500/10, text-primary-500)
- 라벨: "Research Docs" (text-[11px], font-black, gray-500, uppercase)
- 데이터: {count} Memos (count: text-5xl, font-black, white / Memos: text-xl, font-bold, gray-600)
- 설명: "Recorded investment thesis and reviews" (text-sm, gray-500)
- 배경 데코: FileText 아이콘 (opacity-5, size-120)
```

#### 보유 종목 현황 (Active Portfolio)
```
헤더 영역:
- 제목: "Active Portfolio" (text-3xl, font-black, white)
- 개수배지: {count} items (bg-gray-900, border-gray-800, text-gray-500)
- 우측 링크: Watchlist ({count}) (text-primary-500, uppercase)

리스트 구조:
- 배경: space-y-5 간격의 카드 리스트
- 각 항목: StockCard 컴포넌트 (Interactive)
```
테이블 헤더:
┌────────┬────────┬────────┬────────┬────────┐
│ 종목명  │ 수량   │ 평균단가 │ 상태   │ 노트   │
└────────┴────────┴────────┴────────┴────────┘

테이블 행:
┌────────┬────────┬────────┬────────┬────────┐
│ 삼성전자 │ 100주  │ 70,000 │ 보유중  │  ✓    │
│ SK하이닉스│ 50주  │ 120,000│ 일부매도│  -    │
└────────┴────────┴────────┴────────┴────────┘

행 스타일:
- 높이: 56px
- 호버: 배경 var(--color-gray-50)
- 클릭: 종목 상세 페이지 이동

노트 유무 표시:
- 있음: ✓ (var(--color-success))
- 없음: - (var(--color-gray-400))
- 호버 시 툴팁: "노트 작성하기"

상태 배지:
- Badge 컴포넌트 사용
- 우측 정렬
```

#### 관심 종목 섹션
```
제목: "관심 종목 (정찰 중)"
우측: [+ 종목 추가] 버튼

카드 그리드 (3열):
┌─────────┬─────────┬─────────┐
│ 카드 1   │ 카드 2   │ 카드 3   │
└─────────┴─────────┴─────────┘

각 카드:
┌─────────────────────────────┐
│ 🔍 NAVER                    │
│ 종목코드: 035420              │
│                             │
│ 첨부 자료: 3개                │
│ 마지막 업데이트: 2일 전        │
│                             │
│ [상세보기] [매수로 전환]       │
└─────────────────────────────┘

스타일:
- 배경: var(--color-info-light) + opacity 0.05
- 테두리: 1px dashed var(--color-info)
- 아이콘: 🔍 (관심 종목 표시)
```

#### 최근 작성한 노트 섹션
```
제목: "최근 작성한 노트"
우측: [전체 보기] 링크

리스트 (최대 3개):
┌─────────────────────────────────────────┐
│ 삼성전자 - 매수 노트                      │
│ "실적 개선 기대감으로 매수..."             │
│ 📎 이미지 2개                            │
│ 작성: 3시간 전                           │
├─────────────────────────────────────────┤
│ SK하이닉스 - 일반 노트                    │
│ "HBM 수요 증가 관련 리서치..."            │
│ 작성: 1일 전                             │
└─────────────────────────────────────────┘

각 항목:
- 패딩: var(--space-4)
- 테두리 하단: 1px solid var(--color-gray-200)
- 호버: 배경 var(--color-gray-50)
- 클릭: 종목 상세 페이지 이동

노트 미리보기:
- 최대 2줄 (line-clamp-2)
- 색상: var(--color-gray-600)
```

### 3.5 계좌 관리 (Accounts)

#### 레이아웃 및 제약
```
- 제약: 계좌 최대 20개 생성 가능
- 통화: 모든 예수금은 KRW(원화) 정수 단위를 기준
- 제목: "Managed Accounts | 계좌 관리" 
- 우측 상단: [+ 계좌 추가] 버튼 (최대 개수 도달 시 비활성화 및 툴팁 제공)
```

#### 계좌 카드
```
┌─────────────────────────────────────────┐
│  한국투자증권 (broker_name)              │
│  ₩ 5,000,000 (cash_balance)             │
│                                         │
│  보유 종목: 3개                          │
│  최근 갱신: 1일 전 (updated_at)           │
│                                         │
│  메모: "배당주 중심 계좌"                 │
│                                         │
│  [예수금 수정] [내 종목] [삭제]            │
└─────────────────────────────────────────┘

스타일:
- 배경: Layered Premium Dark (Card 컴포넌트)
- 예수금: text-4xl, font-black, text-white (정수 입력 필드 연동)
- 인터랙션: 호버 시 border-primary-500/30 및 shadow-lg
```

#### 계좌 추가/수정 모달
```
제목: "계좌 정보 설정"

폼 필드 가이드:
1. 증권사명 (필수): 최대 50자, 중복 가능
2. 현재 예수금 (필수): 
   - 0 이상의 정수만 입력 가능
   - 입력 시 '원' 단위 고정 표시 및 천 단위 쉼표 자동 적용
3. 메모 (선택): 최대 200자

액션:
- [취소]: 변경사항 없이 닫기
- [저장하기]: API 반영 후 '동기화 완료' 토스트 노출
```

### 3.6 종목 상세 (Stock Detail)

#### 레이아웃 및 핵심 로직
```
- 상태 자동 관리: 매도 수량 입력으로 보유 수량이 0이 될 경우 'SOLD'로 자동 변경
- 타입 제약: 수량과 평균단가는 정수(Integer)만 허용
- 뒤로가기: 이전 페이지 맥락 유지 (대시보드 또는 관심 종목 리스트)
```

#### 종목 정보 헤더 (Visual Hero)
```
┌─────────────────────────────────────────┐
│  (Icon) 삼성전자 (005930)               │
│  [상태: HOLDING 배지] [계좌: 한국투자증권] │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│  보유 수량: 100주 (정수)                  │
│  평균 단가: ₩ 70,000 (정수/KRW)          │
│                                         │
│  [정보 수정] [매도 기록] [종목 삭제]       │
└─────────────────────────────────────────┘

특이 사항:
- WATCHLIST 종목일 경우: 
  - 수량/단가 영역 대신 "리서치 요약" 정보 표시
  - 하단 고정 액션: [이 종목 매수 확정하기 (보유으로 전환)]
```

#### 관심 종목 -> 보유 종목 전환 (Conversion UI)
```
[전환 모달 Flow]
1. 계좌 선택: 소속될 계좌 선택 (필수)
2. 실매수 정보: 수량, 평단가 입력 (정수 필수)
3. Research Bridge (Context Check):
   - 해당 종목에 일반(GENERAL) 노트가 있는 경우에만 표시
   - [v] 최근 리서치 기록을 매수 이유로 가져오기 (Default: checked)
   - 동작: 체크 시 GENERAL 메모 텍스트를 PURCHASE 메모의 buy_reason으로 자동 복제

완료 후: HOLDING 상세 페이지로 자동 이동
```

#### 투자 노트 아카이브 (Thesis Feed)
```
정렬: 최신순 (Stacking Layout)

카드 타입별 테마:
- PURCHASE: 초록색 좌측 바 (Investment Start)
- SELL: 빨간색 좌측 바 (Exit Review)
- GENERAL: 파란색 좌측 바 (Research/Tracking)

내용 구성:
- 주된 판단 근거 (buy_reason / current_thought)
- 시나리오 및 리스크 (텍스트 있을 시에만 영역 노출)
- 첨부 이미지: 탭 형태 또는 그리드 썸네일 (라이트박스 연동)
```

#### Floating Actions
```
보유 종목: [+ 투자 기록 추가] (Floating Button)
관심 종목: [+ 리서치 노트 추가] (Floating Button)
```

### 3.7 노트 작성/수정 (Memo Editor)

#### 인터랙션 가이드
```
- 업로드 전략: 작성 중 이미지는 클라이언트 메모리에만 존재, [저장] 시점에 Supabase Storage로 즉시 업로드 및 비동기 URL 획득
- Contextual Triggers: 
  * 종목 신규 추가 시 자동 제안
  * 전량 매도 시 '매도 회고(Sell Review)' 작성 강제 제안
```

#### 입력 필드 구성
```
상단: [매수: PURCHASE] [매도: SELL] [일반: GENERAL] 스위처

1. 판단 근거 (필수/제안):
   - 매수 시: "왜 이 종목을 선정한 이유 (buy_reason)"
   - 일반 시: "현재의 기록 또는 리서치 내용 (current_thought)"
   - 매도 시: "매매에 대한 자평 및 복기 (sell_review)"

2. 상세 전략 (선택):
   - 기대 시나리오 (expected_scenario)
   - 주요 리스크 (risks)

3. 이미지 첨부 (최대 5개):
   - 이미지당 5MB 제한
   - 업로드 완료 전까지 썸네일에 스피너/프로그레스바 표시
```

#### 이미지 업로드 UI/UX
```
┌─────────────────────────────────────────┐
│ [v] 자동 최적화 (WebP 컨버팅) 적용 중      │
│ ┌───────────────────────────────────┐   │
│ │ 이곳에 이미지를 드롭하거나 클릭하세요   │   │
│ └───────────────────────────────────┘   │
│ 썸네일 미리보기 (업로드 대기 중...)        │
│ ┌────┬────┬────┐                        │
│ │ 🎨 │ 🎨 │ 🎨 │                        │
│ └────┴────┴────┘                        │
└─────────────────────────────────────────┘

기술적 요구사항:
- Supabase Auth SDK 연동 (업로드 권한 확인)
- Public URL 반환 즉시 DB memo_attachments 배열에 기록
```

### 3.8 관심 종목 (Watchlist)

#### 레이아웃
```
┌─────────────────────────────────────────┐
│  페이지 제목: "관심 종목"                  │
│  부제목: "정찰 중인 종목들"                │
│  우측: [+ 종목 추가] 버튼                 │
├─────────────────────────────────────────┤
│  검색 및 필터                            │
│  [검색...] [전체] [IT] [금융] [제조]      │
├─────────────────────────────────────────┤
│  카드 그리드 (3열)                       │
│  ┌─────┬─────┬─────┐                   │
│  │ 카드1│ 카드2│ 카드3│                   │
│  ├─────┼─────┼─────┤                   │
│  │ 카드4│ 카드5│ 카드6│                   │
│  └─────┴─────┴─────┘                   │
└─────────────────────────────────────────┘
```

#### 관심 종목 카드
```
┌─────────────────────────────────────────┐
│  🔍 NAVER                               │
│  035420                                 │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                         │
│  리서치 노트: 3개                        │
│  첨부 자료: 5개                          │
│                                         │
│  마지막 업데이트: 2일 전                  │
│                                         │
│  [상세보기] [매수로 전환]                 │
└─────────────────────────────────────────┘

스타일:
- 배경: var(--color-surface)
- 테두리: 2px solid var(--color-info)
- 둥근 모서리: var(--radius-xl)
- 패딩: var(--space-6)

아이콘:
- 🔍 크기: 32px
- 색상: var(--color-info)

호버:
- 그림자 증가
- transform: translateY(-4px)
```

---

## 4. 반응형 디자인 (Responsive Design)

### 4.1 브레이크포인트 (Breakpoints)

```css
--breakpoint-sm: 640px    /* 모바일 */
--breakpoint-md: 768px    /* 태블릿 */
--breakpoint-lg: 1024px   /* 데스크톱 */
--breakpoint-xl: 1280px   /* 대형 데스크톱 */
```

### 4.2 화면 크기별 조정

#### 모바일 (< 768px)
- Sidebar → Bottom Navigation
- 카드 그리드: 1열
- 테이블 → 카드 리스트
- 폰트 크기: 90%
- 패딩 축소: 75%

#### 태블릿 (768px ~ 1024px)
- Sidebar 유지 (축소 가능)
- 카드 그리드: 2열
- 테이블 유지

#### 데스크톱 (> 1024px)
- 전체 레이아웃 사용
- 카드 그리드: 3열
- 최대 너비: 1440px (중앙 정렬)

---

## 5. 인터랙션 및 애니메이션 (Interactions & Animations)

### 5.1 페이지 전환
```
효과: Fade + Slide
진입: opacity 0 → 1, translateY(20px) → 0
퇴장: opacity 1 → 0, translateY(0) → -20px
duration: 300ms
easing: cubic-bezier(0.4, 0, 0.2, 1)
```

### 5.2 카드 호버
```
transform: translateY(-4px)
box-shadow: var(--shadow-md) → var(--shadow-lg)
duration: 200ms
```

### 5.3 버튼 클릭
```
Active 상태:
- transform: scale(0.98)
- duration: 100ms

Ripple 효과 (선택):
- 클릭 지점에서 원형 파동
- 색상: currentColor + opacity 0.2
```

### 5.4 모달 진입/퇴장
```
Overlay:
- opacity: 0 → 1
- duration: 200ms

Modal:
- opacity: 0 → 1
- transform: scale(0.95) → 1
- duration: 300ms
- easing: cubic-bezier(0.16, 1, 0.3, 1) (spring)
```

### 5.5 리스트 아이템 진입
```
Stagger Animation:
- 각 아이템 50ms 간격으로 순차 진입
- opacity: 0 → 1
- translateY: 20px → 0
```

### 5.6 숫자 카운트업
```
예수금 표시 시:
- 0부터 실제 값까지 애니메이션
- duration: 1000ms
- easing: ease-out
```

---

## 6. 접근성 (Accessibility)

### 6.1 키보드 네비게이션
- Tab 순서: 논리적 흐름
- Focus 표시: 2px solid var(--color-primary-500)
- Skip to content 링크 제공

### 6.2 색상 대비
- WCAG AA 기준 준수 (4.5:1 이상)
- 중요 정보는 색상 외 추가 표시 (아이콘, 텍스트)

### 6.3 스크린 리더
- 모든 이미지에 alt 텍스트
- ARIA 레이블 적절히 사용
- 의미 있는 HTML 구조 (semantic HTML)

### 6.4 터치 타겟
- 최소 크기: 44px × 44px
- 간격: 최소 8px

---

## 7. 성능 최적화 (Performance)

### 7.1 이미지 최적화
- WebP 형식 사용
- 자동 리사이징 (최대 1920px)
- Lazy loading 적용

### 7.2 코드 스플리팅
- 페이지별 번들 분리
- 동적 import 사용

### 7.3 애니메이션 최적화
- transform, opacity만 사용 (GPU 가속)
- will-change 속성 신중히 사용

---

## 8. 다크 모드 (향후 지원)

### 8.1 색상 변수 재정의
```css
[data-theme="dark"] {
  --color-bg-primary: hsl(220, 20%, 10%)
  --color-bg-secondary: hsl(220, 18%, 15%)
  --color-surface: hsl(220, 15%, 18%)
  --color-text-primary: hsl(220, 20%, 98%)
  --color-text-secondary: hsl(220, 15%, 80%)
}
```

### 8.2 전환 애니메이션
```
색상 전환: 200ms ease
```

---

## 9. 에러 상태 및 빈 상태 (Error & Empty States)

### 9.1 에러 상태
```
┌─────────────────────────────────────────┐
│          ⚠️                             │
│                                         │
│  데이터를 불러올 수 없습니다              │
│  잠시 후 다시 시도해주세요                │
│                                         │
│  [다시 시도]                             │
└─────────────────────────────────────────┘

스타일:
- 중앙 정렬
- 아이콘: 64px, var(--color-danger)
- 텍스트: var(--color-gray-700)
```

### 9.2 빈 상태
```
┌─────────────────────────────────────────┐
│          📊                             │
│                                         │
│  아직 등록된 종목이 없습니다              │
│  첫 번째 종목을 추가해보세요              │
│                                         │
│  [+ 종목 추가하기]                       │
└─────────────────────────────────────────┘

스타일:
- 중앙 정렬
- 아이콘: 64px, var(--color-gray-400)
- 텍스트: var(--color-gray-600)
```

### 9.3 로딩 상태
```
스켈레톤 UI:
- 카드/리스트 아이템 형태 유지
- 배경: linear-gradient 애니메이션
- 색상: var(--color-gray-200) → var(--color-gray-300)
- duration: 1.5s infinite
```

---

## 10. 구현 우선순위

### Phase 1: 핵심 컴포넌트
1. 디자인 시스템 CSS 변수 정의
2. 공통 컴포넌트 (Button, Input, Card, Badge, Modal)
3. 레이아웃 (Header, Sidebar, Main)

### Phase 2: 주요 화면
1. 대시보드
2. 계좌 관리
3. 종목 상세

### Phase 3: 고급 기능
1. 노트 작성/수정
2. 이미지 첨부 및 라이트박스
3. 관심 종목

### Phase 4: 완성도
1. 반응형 디자인
2. 애니메이션 및 인터랙션
3. 에러/빈 상태 처리
4. 접근성 개선

---

## 11. 참고사항

- 이 문서는 개발 과정에서 지속적으로 업데이트됨
- 실제 구현 시 사용자 피드백에 따라 조정 가능
- 디자인 시스템은 일관성 유지를 위해 엄격히 준수
- 모든 UI는 "프리미엄하고 사용하기 즐거운" 경험을 목표로 함
