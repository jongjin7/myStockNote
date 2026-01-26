# 📈 StockNote

> 투자 판단의 복기가 더 나은 결정으로 이어집니다.

개인 투자자를 위한 투자 노트 관리 웹 애플리케이션입니다. 매수/매도 판단의 근거를 체계적으로 기록하고, 과거 투자 결정을 복기하여 더 나은 투자 습관을 만들어갑니다.

## ✨ 주요 기능

### 📊 대시보드
- 총 관리 자산 (예수금 + 매수 금액) 한눈에 확인
- 계좌별 예수금 요약
- 보유 종목 및 관심 종목 현황
- 최근 작성한 투자 노트 타임라인

### 💰 계좌 관리
- 증권사별 계좌 등록 및 관리
- 예수금 수동 업데이트
- 계좌별 메모 기능

### 🔍 관심 종목
- 매수 전 정찰 중인 종목 관리
- 종목별 투자 노트 작성
- 관심 종목 → 보유 종목 전환

### 📝 투자 노트
- **구조화된 기록**: 매수 이유, 기대 시나리오, 리스크 요인 등
- **이미지 첨부**: 차트, 분석 리포트 캡처본 저장 (Base64)
- **타임라인 뷰**: 시간순 투자 판단 기록 확인
- **노트 유형**: 매수/매도/일반 메모 구분

### 📈 종목 상세
- 종목 상태 관리 (관심/보유/일부매도/전량매도)
- 보유 수량 및 평균 단가 추적
- 종목별 투자 노트 히스토리

## 🚀 기술 스택

### Frontend
- **React 19** - 최신 React 기능 활용
- **TypeScript** - 타입 안정성
- **Vite 7** - 빠른 개발 서버 및 빌드
- **React Router** - 클라이언트 사이드 라우팅

### Styling
- **Tailwind CSS 4** - 유틸리티 우선 CSS 프레임워크
- **OKLCH 컬러 시스템** - 프리미엄 다크 모드
- **Lucide React** - 아이콘 라이브러리

### 상태 관리 & 데이터
- **React Context API** - 전역 상태 관리
- **LocalStorage** - 클라이언트 사이드 데이터 영속성
- **Storage Event Listener** - 탭 간 실시간 동기화

## 📦 설치 및 실행

### 사전 요구사항
- Node.js 18+ 
- pnpm (권장) 또는 npm

### 설치
```bash
# 저장소 클론
git clone https://github.com/jongjin7/myStockNote.git
cd myStockNote

# 의존성 설치
pnpm install
# 또는
npm install
```

### 개발 서버 실행
```bash
pnpm dev
# 또는
npm run dev
```

브라우저에서 http://localhost:5174 접속

### 프로덕션 빌드
```bash
pnpm build
# 또는
npm run build
```

## 📁 프로젝트 구조

```
myStockNote/
├── src/
│   ├── components/      # 재사용 가능한 컴포넌트
│   │   └── Layout.tsx   # 사이드바 네비게이션 레이아웃
│   ├── contexts/        # React Context
│   │   └── AppContext.tsx  # 전역 상태 관리
│   ├── lib/             # 유틸리티 함수
│   │   └── storage.ts   # LocalStorage 관리
│   ├── pages/           # 페이지 컴포넌트
│   │   ├── Dashboard.tsx    # 대시보드
│   │   ├── Accounts.tsx     # 계좌 관리
│   │   ├── Watchlist.tsx    # 관심 종목
│   │   ├── StockDetail.tsx  # 종목 상세
│   │   └── MemoEditor.tsx   # 투자 노트 편집기
│   ├── types/           # TypeScript 타입 정의
│   │   └── index.ts
│   ├── App.tsx          # 라우팅 설정
│   ├── main.tsx         # 앱 진입점
│   └── index.css        # 글로벌 스타일
├── spec/                # 프로젝트 문서
│   ├── prd.md          # 제품 요구사항 명세
│   └── workflow.md     # 개발 워크플로우
├── .agent/
│   └── workflows/      # 테스트 워크플로우
└── public/             # 정적 파일
```

## 🎨 디자인 특징

- **프리미엄 다크 모드**: OKLCH 컬러 시스템 기반 고급스러운 UI
- **반응형 디자인**: 모바일, 태블릿, 데스크톱 모두 지원
- **부드러운 애니메이션**: 페이지 전환 및 인터랙션 애니메이션
- **직관적인 UX**: 사이드바 네비게이션, 카드 기반 레이아웃

## 🔧 주요 기술적 특징

### 실시간 데이터 동기화
- `useCallback`으로 최적화된 refresh 함수
- Storage Event Listener로 탭 간 자동 동기화
- 페이지 전환 시 즉시 데이터 반영

### 타입 안전성
- 모든 데이터 모델에 TypeScript 타입 정의
- `verbatimModuleSyntax`로 타입/값 임포트 명확히 구분
- Number 타입 변환으로 계산 오류(NaN) 방지

### 데이터 관리
- LocalStorage 기반 클라이언트 사이드 영속성
- Base64 인코딩으로 이미지 첨부 지원
- 데이터 무결성 보장 (cascade delete)

## 📝 데이터 구조

### Account (계좌)
```typescript
{
  id: string;
  brokerName: string;      // 증권사명
  cashBalance: number;     // 예수금
  memo: string | null;     // 메모
  createdAt: number;
  updatedAt: number;
}
```

### Stock (종목)
```typescript
{
  id: string;
  name: string;            // 종목명
  symbol: string | null;   // 종목코드
  status: 'WATCHLIST' | 'HOLDING' | 'PARTIAL_SOLD' | 'SOLD';
  accountId: string | null;
  quantity: number;        // 보유 수량
  avgPrice: number;        // 평균 단가
  createdAt: number;
  updatedAt: number;
}
```

### StockMemo (투자 노트)
```typescript
{
  id: string;
  stockId: string;
  type: 'PURCHASE' | 'SELL' | 'GENERAL';
  buyReason: string | null;        // 매수 이유
  expectedScenario: string | null; // 기대 시나리오
  risks: string | null;            // 리스크 요인
  currentThought: string | null;   // 현재 생각
  sellReview: string | null;       // 매도 복기
  createdAt: number;
  updatedAt: number;
}
```

## 🧪 테스트

데이터 동기화 테스트 워크플로우:
```bash
# 테스트 가이드 확인
cat .agent/workflows/test-data-sync.md
```

## 🤝 기여

이슈와 풀 리퀘스트를 환영합니다!

## 📄 라이선스

MIT License

## 👤 작성자

**jongjin7**
- GitHub: [@jongjin7](https://github.com/jongjin7)
- Email: ezcode2875@gmail.com

---

**투자 판단의 복기가 더 나은 결정으로 이어집니다.** 🚀
