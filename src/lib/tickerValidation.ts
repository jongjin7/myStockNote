/**
 * Validates if a ticker symbol is in a valid format
 * Valid formats:
 * - 6-digit Korean stock codes (e.g., 005930)
 * - 1-5 uppercase letters for US stocks (e.g., AAPL, NVDA, GOOGL)
 * - Symbols with exchange suffix (e.g., 005930.KS, AAPL.O)
 * - ETF symbols (e.g., SPY, QQQ)
 */
export function isValidTickerFormat(ticker: string): boolean {
  if (!ticker || typeof ticker !== 'string') {
    return false;
  }

  const trimmed = ticker.trim().toUpperCase();
  
  if (trimmed.length === 0) {
    return false;
  }

  // Check for symbols with exchange suffix (e.g., 005930.KS, AAPL.O)
  if (trimmed.includes('.')) {
    const parts = trimmed.split('.');
    if (parts.length !== 2) {
      return false;
    }
    const [symbol, exchange] = parts;
    
    // Symbol part should be either 6 digits or 1-5 letters
    const isValidSymbol = /^\d{6}$/.test(symbol) || /^[A-Z]{1,5}$/.test(symbol);
    // Exchange suffix should be 1-2 uppercase letters
    const isValidExchange = /^[A-Z]{1,2}$/.test(exchange);
    
    return isValidSymbol && isValidExchange;
  }

  // 6-digit Korean stock code (e.g., 005930)
  if (/^\d{6}$/.test(trimmed)) {
    return true;
  }

  // 1-5 uppercase letters for US stocks and ETFs (e.g., AAPL, NVDA, GOOGL, SPY)
  if (/^[A-Z]{1,5}$/.test(trimmed)) {
    return true;
  }

  return false;
}

/**
 * Gets a user-friendly error message for invalid ticker formats
 */
export function getTickerValidationError(ticker: string): string | null {
  if (!ticker || ticker.trim().length === 0) {
    return null; // Empty is allowed (optional field)
  }

  if (!isValidTickerFormat(ticker)) {
    const trimmed = ticker.trim();
    
    // Check for common mistakes
    if (/\d/.test(trimmed) && !/^\d{6}$/.test(trimmed) && !trimmed.includes('.')) {
      return '한국 종목코드는 6자리 숫자여야 합니다 (예: 005930)';
    }
    
    if (/[a-z]/.test(trimmed)) {
      return '티커 심볼은 대문자로 입력해주세요 (예: AAPL, NVDA)';
    }
    
    if (/[^A-Z0-9.]/.test(trimmed.toUpperCase())) {
      return '티커 심볼은 영문자, 숫자, 점(.)만 포함할 수 있습니다';
    }
    
    if (/^[A-Z]{6,}$/.test(trimmed)) {
      return '미국 주식 티커는 1-5자리 영문자여야 합니다 (예: AAPL, GOOGL)';
    }
    
    return '올바른 티커 형식이 아닙니다 (예: 005930, AAPL, 005930.KS)';
  }

  return null;
}
