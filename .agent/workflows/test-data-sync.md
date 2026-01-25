---
description: 대시보드 데이터 동기화 테스트
---

# 대시보드 데이터 동기화 테스트 워크플로우

이 워크플로우는 대시보드에 표시되는 정보가 각 메뉴(계좌 관리, 관심 종목)의 실제 데이터와 일치하는지 검증합니다.

## 사전 준비

1. 개발 서버가 실행 중인지 확인 (`npm run dev`)
2. 브라우저에서 http://localhost:5174 접속

## 테스트 단계

### 1단계: 초기 상태 확인

1. 브라우저 개발자 도구 열기 (F12 또는 Cmd+Option+I)
2. Console 탭에서 다음 스크립트 실행:

```javascript
// 현재 localStorage 데이터 확인
const data = JSON.parse(localStorage.getItem('stock_note_data_v1'));
console.log('Accounts:', data.accounts.length);
console.log('Stocks:', data.stocks.length);
console.log('Memos:', data.memos.length);

// 예상 계산값
const totalCash = data.accounts.reduce((sum, acc) => sum + Number(acc.cashBalance || 0), 0);
const holding = data.stocks.filter(s => s.status === 'HOLDING' || s.status === 'PARTIAL_SOLD');
const totalInvested = holding.reduce((sum, s) => sum + (Number(s.quantity || 0) * Number(s.avgPrice || 0)), 0);

console.log('Expected Total Cash:', totalCash.toLocaleString());
console.log('Expected Total Invested:', totalInvested.toLocaleString());
console.log('Expected Total Assets:', (totalCash + totalInvested).toLocaleString());
```

3. 대시보드 UI의 값과 비교

### 2단계: 계좌 추가 테스트

1. **계좌 관리** 페이지로 이동
2. "새 계좌 추가" 클릭
3. 다음 정보 입력:
   - 증권사명: `데이터 동기화 테스트`
   - 예수금: `1000000` (백만원)
4. "계좌 추가" 클릭
5. **즉시** 대시보드로 이동 (새로고침 없이)
6. 확인 사항:
   - 총 예수금이 +1,000,000원 증가했는지
   - 총 관리 자산도 +1,000,000원 증가했는지
   - 계좌 요약 섹션에 "데이터 동기화 테스트 1,000,000원"이 표시되는지
   - 우측 상단 "마지막 업데이트" 시간이 현재 시각인지

### 3단계: 관심 종목 추가 테스트

1. **관심 종목** 페이지로 이동
2. "관심 종목 추가" 클릭
3. 다음 정보 입력:
   - 종목명: `동기화 테스트 종목`
   - 종목코드: `TEST`
4. "관심 종목 추가" 클릭
5. **즉시** 대시보드로 이동
6. 확인 사항:
   - "관심 종목 X개" 링크의 숫자가 증가했는지
   - 보유 종목 섹션은 여전히 0개인지 (관심 종목은 보유가 아님)

### 4단계: 투자 노트 작성 테스트

1. 관심 종목 페이지에서 "동기화 테스트 종목" 클릭
2. "새 투자 노트 작성" 클릭
3. 다음 정보 입력:
   - 매수 이유: `반응성 테스트를 위한 노트`
4. "노트 저장" 클릭
5. **즉시** 대시보드로 이동
6. 확인 사항:
   - Notes 카드의 숫자가 증가했는지
   - "최근 투자 노트" 섹션에 새 노트가 표시되는지

### 5단계: 관심 종목 → 보유 종목 전환 테스트

1. "동기화 테스트 종목" 상세 페이지로 이동
2. 연필 아이콘(수정) 클릭
3. 상태를 "보유 중"으로 변경
4. 계좌 선택: "데이터 동기화 테스트"
5. 보유 수량: `10`
6. 평균 단가: `50000` (50만원)
7. "정보 업데이트" 클릭
8. **즉시** 대시보드로 이동
9. 확인 사항:
   - Holdings 카드가 0 → 1로 증가했는지
   - 총 매수 금액이 500,000원으로 표시되는지
   - 총 관리 자산이 예수금 + 매수금액으로 정확히 계산되는지
   - "보유 종목" 섹션에 "동기화 테스트 종목"이 표시되는지
   - 관심 종목 카운트가 1 감소했는지

### 6단계: 계좌 삭제 테스트

1. **계좌 관리** 페이지로 이동
2. "데이터 동기화 테스트" 계좌의 휴지통 아이콘 클릭
3. 삭제 확인
4. **즉시** 대시보드로 이동
5. 확인 사항:
   - 총 예수금이 -1,000,000원 감소했는지
   - 계좌 요약 섹션에서 해당 계좌가 사라졌는지
   - 연결되어 있던 종목이 관심 종목으로 되돌아갔는지 (상태 자동 전환)

## 성공 기준

- 모든 단계에서 **페이지 새로고침 없이** 대시보드 수치가 즉시 업데이트되어야 함
- localStorage 데이터와 UI 표시값이 항상 일치해야 함
- 계산 오류(NaN, undefined 등)가 발생하지 않아야 함
- 브라우저 콘솔에 에러가 없어야 함

## 문제 발생 시 디버깅

콘솔에서 다음 명령으로 현재 상태 확인:

```javascript
// AppContext 상태 강제 새로고침
window.location.reload();

// 또는 localStorage 직접 확인
console.log(JSON.parse(localStorage.getItem('stock_note_data_v1')));
```
