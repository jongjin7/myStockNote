# StockNote 문서

이 폴더에는 StockNote 프로젝트의 모든 문서가 포함되어 있습니다.

## � 폴더 구조

```
spec/
├── README.md              # 이 파일
├── product/              # 📋 제품 스펙
│   ├── prd.md           # 제품 요구사항 문서
│   └── workflow.md      # 워크플로우 정의
├── design/               # 🎨 디자인 가이드
│   ├── typography-guide.md
│   └── ui-implementation-guide.md
└── testing/              # 🧪 테스트 문서
    ├── README.md
    ├── setup.md
    ├── checklist.md
    └── test-suites/
        ├── data-sync-example.md
        └── data-sync-suite.md
```

---

## 📋 제품 스펙 (Product)

### [PRD - 제품 요구사항 문서](./product/prd.md)
StockNote의 핵심 기능과 요구사항을 정의한 문서입니다.

**포함 내용:**
- 프로젝트 개요
- 핵심 기능
- 사용자 스토리
- 기술 스택

### [워크플로우](./product/workflow.md)
사용자 플로우와 시스템 워크플로우를 정의한 문서입니다.

**포함 내용:**
- 사용자 여정
- 데이터 플로우
- 상태 관리

---

## 🎨 디자인 가이드 (Design)

### [타이포그래피 가이드](./design/typography-guide.md)
프로젝트의 타이포그래피 시스템을 정의한 문서입니다.

**포함 내용:**
- 폰트 패밀리
- 타이포그래피 스케일
- 사용 예시

### [UI 구현 가이드](./design/ui-implementation-guide.md)
UI 컴포넌트 구현 가이드입니다.

**포함 내용:**
- 컴포넌트 구조
- 스타일 가이드
- 베스트 프랙티스

---

## 🧪 테스트 문서 (Testing)

테스트 환경 구성 및 테스트 작성 가이드입니다.

**자세한 내용은 [testing/README.md](./testing/README.md)를 참고하세요.**

### 주요 문서:
- **[테스트 환경 구성](./testing/setup.md)** - Vitest & Playwright 설정
- **[빠른 시작 체크리스트](./testing/checklist.md)** - 단계별 설정 가이드
- **[테스트 스위트](./testing/test-suites/)** - 실전 테스트 예시

---

## 🚀 빠른 시작

### 제품 이해하기
1. [PRD](./product/prd.md) 읽기
2. [워크플로우](./product/workflow.md) 확인

### 디자인 시스템 이해하기
1. [타이포그래피 가이드](./design/typography-guide.md) 읽기
2. [UI 구현 가이드](./design/ui-implementation-guide.md) 확인

### 테스트 환경 구성하기
1. [테스트 체크리스트](./testing/checklist.md) 따라하기
2. [테스트 환경 구성](./testing/setup.md) 읽기
3. [테스트 스위트](./testing/test-suites/data-sync-suite.md) 참고하여 테스트 작성

---

## 📚 문서 작성 가이드

### 새 문서 추가 시:

1. **제품 스펙**: `product/` 폴더에 추가
2. **디자인 가이드**: `design/` 폴더에 추가
3. **테스트 문서**: `testing/` 폴더에 추가

### 문서 작성 규칙:

- 명확한 제목과 설명
- 실행 가능한 코드 예시
- 단계별 가이드
- 이 README에 링크 추가

---

## � 문서 찾기

### 제품 관련
- 기능 요구사항 → `product/prd.md`
- 워크플로우 → `product/workflow.md`

### 디자인 관련
- 타이포그래피 → `design/typography-guide.md`
- UI 구현 → `design/ui-implementation-guide.md`

### 테스트 관련
- 환경 구성 → `testing/setup.md`
- 빠른 시작 → `testing/checklist.md`
- 테스트 예시 → `testing/test-suites/`

---

## 📝 기여하기

문서를 개선하거나 추가하려면:

1. 적절한 폴더에 문서 추가
2. 이 README에 링크 추가
3. 명확한 설명 작성
4. 커밋 메시지에 문서 변경 사항 명시

---

**마지막 업데이트:** 2026-01-31
