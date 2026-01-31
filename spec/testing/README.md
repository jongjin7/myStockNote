# 테스트 문서

StockNote 프로젝트의 테스트 환경 구성 및 테스트 작성 가이드입니다.

## 📚 문서 목록

### 1. [테스트 환경 구성 가이드](./setup.md) ⭐
**완전한 테스트 환경 구성 가이드**
- Vitest 설정 (단위/통합 테스트)
- Playwright 설정 (E2E 테스트)
- 테스트 작성 가이드
- CI/CD 통합 방법

**대상:** 처음 테스트 환경을 구성하는 개발자

---

### 2. [테스트 환경 구성 체크리스트](./checklist.md) 🚀
**빠른 참조를 위한 체크리스트**
- 단계별 설치 가이드
- 설정 파일 템플릿
- 테스트 작성 템플릿
- 문제 해결 가이드

**대상:** 빠르게 설정하고 싶은 개발자

---

### 3. [테스트 스위트](./test-suites/)
**실전 테스트 예시 모음**

#### [데이터 동기화 테스트 예시](./test-suites/data-sync-example.md)
- E2E 테스트 예시
- 워크플로우 자동화
- 6단계 데이터 동기화 테스트

#### [데이터 동기화 테스트 스위트](./test-suites/data-sync-suite.md) 💎
- **완전한 테스트 스위트 (단위/통합/E2E)**
- 단위 테스트: 계산 로직, 유틸리티 함수
- 통합 테스트: Context 동기화, 컴포넌트 통합
- E2E 테스트: 전체 워크플로우 (6단계)
- 실행 가능한 코드 예시

**대상:** 실제 테스트 코드를 작성하는 개발자

---

## 🚀 빠른 시작

### 1단계: 패키지 설치

```bash
# Vitest + React Testing Library
pnpm add -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom @vitest/ui

# Playwright
pnpm add -D @playwright/test
npx playwright install
```

### 2단계: 설정 파일 생성

[테스트 환경 구성 체크리스트](./checklist.md)를 참고하여 설정 파일을 생성하세요.

### 3단계: 테스트 작성

[데이터 동기화 테스트 스위트](./test-suites/data-sync-suite.md)를 참고하여 테스트를 작성하세요.

### 4단계: 테스트 실행

```bash
# Vitest (단위/통합 테스트)
pnpm test

# Playwright (E2E 테스트)
pnpm test:e2e
```

---

## 📖 추천 학습 순서

### **초보자:**
1. [테스트 환경 구성 체크리스트](./checklist.md) 읽기
2. 패키지 설치 및 설정
3. 간단한 단위 테스트 작성
4. [테스트 환경 구성 가이드](./setup.md)로 심화 학습

### **중급자:**
1. [테스트 환경 구성 가이드](./setup.md) 전체 읽기
2. [데이터 동기화 테스트 스위트](./test-suites/data-sync-suite.md) 참고하여 테스트 작성
3. CI/CD 통합

### **고급자:**
1. 모든 문서 참고
2. 프로젝트에 맞게 커스터마이징
3. 테스트 커버리지 80% 이상 달성

---

## 🎯 테스트 전략

```
        /\
       /E2E\          ← Playwright (10%)
      /------\           핵심 비즈니스 플로우
     /통합테스트\      ← React Testing Library (20%)
    /----------\         컴포넌트 + Context 통합
   /  단위테스트  \    ← Vitest (70%)
  /--------------\       로직, 유틸리티, 계산
```

---

## 📊 테스트 커버리지 목표

| 영역 | 목표 | 도구 |
|------|------|------|
| 유틸리티 함수 | 90% | Vitest |
| Context/Hooks | 80% | Vitest + RTL |
| 컴포넌트 | 70% | React Testing Library |
| E2E 플로우 | 핵심 플로우만 | Playwright |

---

## 🔗 외부 리소스

- [Vitest 공식 문서](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [Playwright 공식 문서](https://playwright.dev/)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

---

## 📝 새 테스트 문서 추가하기

새로운 테스트 스위트를 추가하려면:

1. `test-suites/` 폴더에 문서 추가
2. 명확한 제목과 설명 작성
3. 실행 가능한 코드 예시 포함
4. 이 README에 링크 추가

---

## ❓ 질문 및 지원

테스트 관련 질문이나 문제가 있으면:

1. 먼저 [체크리스트](./checklist.md)의 문제 해결 섹션 확인
2. [환경 구성 가이드](./setup.md) 참고
3. GitHub Issues에 질문 등록

---

**마지막 업데이트:** 2026-01-31
