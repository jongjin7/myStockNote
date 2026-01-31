import { describe, it, expect } from 'vitest';
import { isValidTickerFormat, getTickerValidationError } from '../tickerValidation';

describe('tickerValidation', () => {
  describe('isValidTickerFormat', () => {
    it('should accept valid 6-digit Korean stock codes', () => {
      expect(isValidTickerFormat('005930')).toBe(true);
      expect(isValidTickerFormat('000660')).toBe(true);
      expect(isValidTickerFormat('035720')).toBe(true);
    });

    it('should accept valid US stock tickers (1-5 letters)', () => {
      expect(isValidTickerFormat('AAPL')).toBe(true);
      expect(isValidTickerFormat('NVDA')).toBe(true);
      expect(isValidTickerFormat('GOOGL')).toBe(true);
      expect(isValidTickerFormat('TSLA')).toBe(true);
      expect(isValidTickerFormat('A')).toBe(true);
    });

    it('should accept tickers with exchange suffix', () => {
      expect(isValidTickerFormat('005930.KS')).toBe(true);
      expect(isValidTickerFormat('005930.KQ')).toBe(true);
      expect(isValidTickerFormat('AAPL.O')).toBe(true);
    });

    it('should reject invalid formats', () => {
      expect(isValidTickerFormat('12345')).toBe(false); // 5 digits
      expect(isValidTickerFormat('1234567')).toBe(false); // 7 digits
      expect(isValidTickerFormat('AAAAAA')).toBe(false); // 6 letters
      expect(isValidTickerFormat('aapl')).toBe(false); // lowercase
      expect(isValidTickerFormat('AAPL123')).toBe(false); // mixed
      expect(isValidTickerFormat('')).toBe(false); // empty
      expect(isValidTickerFormat('   ')).toBe(false); // whitespace
    });

    it('should handle edge cases', () => {
      expect(isValidTickerFormat(null as any)).toBe(false);
      expect(isValidTickerFormat(undefined as any)).toBe(false);
      expect(isValidTickerFormat(123 as any)).toBe(false);
    });
  });

  describe('getTickerValidationError', () => {
    it('should return null for valid tickers', () => {
      expect(getTickerValidationError('005930')).toBeNull();
      expect(getTickerValidationError('AAPL')).toBeNull();
      expect(getTickerValidationError('NVDA')).toBeNull();
      expect(getTickerValidationError('')).toBeNull(); // empty is allowed
    });

    it('should return error for invalid Korean stock codes', () => {
      const error = getTickerValidationError('12345');
      expect(error).toContain('6자리 숫자');
    });

    it('should return error for lowercase tickers', () => {
      const error = getTickerValidationError('aapl');
      expect(error).toContain('대문자');
    });

    it('should return error for invalid characters', () => {
      const error = getTickerValidationError('AAPL@');
      expect(error).toContain('영문자, 숫자, 점');
    });

    it('should return error for too long US tickers', () => {
      const error = getTickerValidationError('AAAAAA');
      expect(error).toContain('1-5자리 영문자');
    });
  });
});
