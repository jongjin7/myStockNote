# UI 구현 가이드 (Implemented Spec)

## 1. 디자인 시스템 (Core)

- **테마**: 프리미엄 다크 모드 (배경: `slate-950`, 카드: `slate-900/40`)
- **컬러**: 블루(`primary-500`), 그린(`success`), 레드/로즈(`danger/danger-light`), 사이안(`info/info-light`)
- **폰트**: `Pretendard Variable` 전역 적용 (숫자/통화는 `tabular-nums` 및 `font-black` 활용)
- **그림자/보더**: 1px 보더(`white/5` 또는 `gray-800`), 미세한 블러(`backdrop-blur-sm`), 카드 호버 효과
- **텍스트 위계 (Hierarchy)**:
  - **Level 1 (웅장함)**: 총 자산 등 핵심 수치 (`text-4xl`~`6xl`, `font-black`, `tracking-tighter`)
  - **Level 2 (강조)**: 종목명, 수익금액 등 (`text-xl`~`2xl`, `font-black`)
  - **Level 3 (본문)**: 일반 정보 (`text-sm`~`base`, `font-medium`)
  - **Level 4 (캡션)**: 항목 라벨, 보조 메타데이터 (`text-[10px]`, `font-black`, `uppercase`, `tracking-[0.2em]`, `text-gray-500`)

## 2. 레이아웃 & 네비게이션

- **PC**: 고정 사이드바 (좌) + 반응형 메인 콘텐츠 (우, 최대 너비 5xl)
- **전환 애니메이션**: `animate-fade-in` (Slide-up + Fade, 300ms) 적용
- **공통 컴포넌트**: `Card`, `Button`, `Badge`, `Input`, `ActionModal` 사용

## 3. 화면별 구현 현황

### 3.1 대시보드 (Dashboard)
- **Hero Stats**: 총 자산 가치, 평가 손익(ROI 배지), 총 예수금 요약 카드 (Radial Glow 효과)
- **Quick Stats**: 보유 종목 수(Holdings) 및 작성 메모 수(Research Docs) 퀵 카드
- **Active Portfolio**: 현재 보유 중인 종목 리스트 (수익률 표시 및 상세 연결)
- **Recent Memos**: 최근 작성된 투자 노트 피드 (최대 3개)

### 3.2 계좌 관리 (Accounts)
- **Account Cards**: 증권사, 현재 예수금, 보유 종목 수 표시
- **CRUD**: 계좌 추가 및 정보 수정(예수금, 메모 등) 모달 연동

### 3.3 계좌별 종목 리스트 (Account Stocks)
- **Account Summary**: 해당 계좌의 총 자산, 매수 금액, 누적 수익, 현재 예수금 3열 요약
- **Stock List**: 계좌 내 보유 종목 리스트 (수량, 평단, 현재가 기반 수익금/수익률 및 상태 배지)

### 3.4 종목 상세 (Stock Detail)
- **Status Hero**: 종목명, 심볼, 현재 상태에 따른 가변 그라데이션 배경 헤더
- **Live Evaluation Card**: 투입 대비 성과 중심의 레이어 설계
  - **Primary Box (자산 요약)**: 
    - 최상단: **현재 평가 자산** (Current Evaluation) - 가장 큰 텍스트 위계
    - 하단단: **매수 원금** (Total Invested) 및 **실시간 수익 현황** (금액/%) 대비 배치
  - **Fundamental Strip (기초 데이터)**:
    - 수량(Quantity), 평균단가(Avg Price), 현재가(Current)를 3열 그리드로 하단 배치하여 데이터의 근간을 강조
  - **인터랙션**: Yahoo Finance API 기반 실시간 갱신 (`Refresh` 버튼)
- **Thesis Timeline**: 투자 노트를 수직 타임라인 형태로 배치 (매수/매도/일반 타입별 배지 구분)
- **Conversion Flow**: 관심 종목 상세에서 '매수 확정' 시 계좌 선택 및 정보 복사 전환 모달

### 3.5 관심 종목 (Watchlist)
- **Watchlist Grid**: 'WATCHLIST' 상태의 종목들만 모아보기 (리서치 노트 개수 및 최종 업데이트 정보 표시)

### 3.6 노트 에디터 (Memo Editor)
- **Contextual Form**: 매수/매도/일반 타입 전환에 따른 맞춤형 입력 필드 (판단 근거, 시나리오, 리스크, 복기 등)

## 4. 기술 명세

- **주가 연동**: `Yahoo Finance API` + `AllOrigins Proxy` (CORS 우회) 기반 실시간 조회
- **데이터 관리**: `Context API` + `MSW` (Mock Service Worker)를 통한 로컬 가상 서버 환경
- **포맷팅**: `intl` 라이브러리 없이 `ko-KR` locale 기반 통화 및 날짜 커스텀 유틸 사용
