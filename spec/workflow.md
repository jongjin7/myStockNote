# 주식 노트 개발 및 운영 프로세스 가이드 (Workflow & Process Guide)

이 문서는 [PRD (MVP v2.0)](./prd.md)를 기반으로, 실제 사용자의 데이터를 어떻게 입력받을 것인지(입력 프로세스)와 개발을 어떻게 진행할 것인지(개발 워크플로우)를 상세히 정의한다.

---

## 1. 데이터 입력 프로세스 정의 (Input Process)

사용자의 수동 입력 편의성을 극대화하여 '기록하는 즐거움'을 주는 것을 목표로 한다.

### 1.1 계좌 및 자산 갱신 프로세스
1. **갱신 주기**: 주 1회 또는 매매 직후 권장.
2. **입력 경로**: 대시보드 요약 카드 또는 [계좌 관리] 메뉴.
3. **핵심 UI**: 
   - 현재 예수금(Cash Balance)을 즉시 수정할 수 있는 인라인 에디팅 기능.
   - 마지막 업데이트 시각을 자동으로 기록하여 '자산 상태의 신선도'를 시각화.

### 1.2 종목 등록 및 자산화 프로세스
1. **시작**: [종목 추가] 버튼 클릭.
2. **정보 입력**: 종목명, 수량, 단가 입력.
3. **상태 결정**: 
   - 실보유 시 `HOLDING`
   - 리서치 단계 시 `WATCHLIST`
4. **저장 후 연계 작업**:
   - 저장 완료 시 "종목이 추가되었습니다. 이 종목을 선정한 이유를 기록해볼까요?"라는 **Contextual Prompt** 제공.

### 1.3 투자 판단 및 리서치 아카이빙 (핵심)
1. **AI 분석 복사/붙여넣기**:
   - ChatGPT 등에서 얻은 텍스트를 `buyReason` 또는 `currentThought` 필드에 붙여넣으면 형식이 유지되도록 보존.
2. **이미지/뉴스 캡처 첨부**:
   - 드래그 앤 드롭으로 리포트, 차트 캡처본 업로드.
   - 시스템은 백그라운드에서 WebP 전환 및 800px~1200px 수준으로 리사이징하여 용량 최적화.

### 1.4 매매 및 사후 회고 프로세스
1. **매매 발생 시**: 사용자가 수량/단가 정보를 업데이트.
2. **회고 트리거**: 상태가 `SOLD`(전량 매도)로 변경되는 시점에 **'매도 복기 노트'** 작성 유도.
3. **회고 내용**: "당초 시나리오와 맞았는가?", "어떤 감정이 의사결정에 영향을 주었는가?" 등의 가이드 제공.

---

## 2. 개발 워크플로우 (Development Workflow)

AI 에이전트와 인간 개발자가 협업하여 고품질의 결과물을 신속하게 도출하기 위한 표준 절차이다.

### 2.1 개발 사이클 (Iterative Development)
1. **Feature Definition**: 구현할 기능의 PRD 요구사항과 데이터 모델(types)을 먼저 검토.
2. **Implementation**: 
   - **Styling**: Tailwind 4 기반 프리미엄 디자인 적용 (Glassmorphism, Vibrant Colors).
   - **Logic**: TypeScript의 엄격한 타입 체크(`VerbatimModuleSyntax`) 준수.
3. **Local Testing**: `pnpm dev`를 통해 코드 변경사항 실시간 반영 확인.
4. **Agent Verification**: `browser_subagent`를 사용하여 렌더링 검증, 콘솔 에러 체크, 스크린샷 캡처 수행.

### 2.2 코드 가이드라인
- **Components**: 재사용 가능한 원자(Atomic) 단위 컴포넌트 개발.
- **State Management**: React Context(`AppContext`)를 사용하여 LocalStorage 기반의 데이터 일관성 유지.
- **Error Handling**: LocalStorage 용량 초과(`QuotaExceededError`) 시에 대한 예외 처리 필수.

### 2.3 UI/UX 원칙
- **Aesthetics**: 단순한 MVP를 넘어 'Premium Look & Feel'을 지향.
- **Interactivity**: 버튼 호버, 페이지 전환 시 부드러운 애니메이션(`framer-motion` 또는 CSS transitions) 적용.

---

## 3. 검증 및 배포 프로세스

### 3.1 기능 검증 (QA)
- 브라우저 에이전트를 활용한 시나리오 테스트 (예: 계좌 추가 -> 종목 추가 -> 이미지 첨부 -> 데이터 보존 확인).
- 다양한 화면 크기(반응형)에서의 레이아웃 깨짐 확인.

### 3.2 데이터 보존 가이드
- 스키마 변경 시 `initialData` 구조와 LocalStorage 키 버저닝(`stock_note_data_v1`) 관리.
- 배포 전 `pnpm build`를 통해 프로덕션 빌드 성공 여 확인.
