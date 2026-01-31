# 티커 유효성 검사 구현

## 개요
종목 등록 시 올바른 티커 형식이 아닌 경우 Stock API를 호출하지 않도록 유효성 검사를 추가했습니다.

## 변경 사항

### 1. 티커 유효성 검사 유틸리티 (`src/lib/tickerValidation.ts`)
새로운 유틸리티 함수를 생성하여 티커 심볼의 유효성을 검사합니다.

#### 지원하는 티커 형식:
- **한국 주식**: 6자리 숫자 (예: `005930`)
- **미국 주식**: 1-5자리 대문자 영문자 (예: `AAPL`, `NVDA`, `GOOGL`)
- **거래소 접미사 포함**: 심볼.거래소 (예: `005930.KS`, `AAPL.O`)

#### 주요 함수:
- `isValidTickerFormat(ticker: string)`: 티커가 유효한 형식인지 확인
- `getTickerValidationError(ticker: string)`: 유효하지 않은 경우 사용자 친화적인 오류 메시지 반환

### 2. StockModal 컴포넌트 업데이트 (`src/components/StockModal.tsx`)

#### 추가된 기능:
1. **실시간 유효성 검사**: 사용자가 티커를 입력할 때마다 형식을 검사
2. **오류 표시**: 잘못된 형식의 티커 입력 시 즉시 오류 메시지 표시
3. **제출 방지**: 유효하지 않은 티커가 있을 경우 폼 제출 비활성화
4. **API 호출 최적화**: 유효한 티커 형식일 때만 Stock API 호출

#### 구현 세부사항:
```typescript
// 상태 추가
const [symbolError, setSymbolError] = useState<string | null>(null);

// 티커 입력 핸들러
const handleSymbolChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const value = e.target.value;
  setSymbol(value);
  const error = getTickerValidationError(value);
  setSymbolError(error);
};

// 제출 시 검증
if (trimmedSymbol) {
  const validationError = getTickerValidationError(trimmedSymbol);
  if (validationError) {
    setSymbolError(validationError);
    return; // API 호출 없이 종료
  }
}

// 유효한 티커일 때만 API 호출
if (trimmedSymbol && isValidTickerFormat(trimmedSymbol)) {
  syncedPrice = await fetchStockPrice(trimmedSymbol) || 0;
}
```

## 사용자 경험 개선

### 오류 메시지 예시:
- `"12345"` 입력 시: "한국 종목코드는 6자리 숫자여야 합니다 (예: 005930)"
- `"aapl"` 입력 시: "티커 심볼은 대문자로 입력해주세요 (예: AAPL, NVDA)"
- `"AAPL@"` 입력 시: "티커 심볼은 영문자, 숫자, 점(.)만 포함할 수 있습니다"
- `"AAAAAA"` 입력 시: "미국 주식 티커는 1-5자리 영문자여야 합니다 (예: AAPL, GOOGL)"

## 테스트
`src/lib/__tests__/tickerValidation.test.ts`에 단위 테스트가 포함되어 있습니다.

## 이점
1. **성능 향상**: 잘못된 티커로 인한 불필요한 API 호출 방지
2. **사용자 경험**: 즉각적인 피드백으로 입력 오류를 빠르게 수정 가능
3. **데이터 품질**: 유효한 형식의 티커만 저장되도록 보장
4. **오류 감소**: API 오류 및 실패 케이스 감소
