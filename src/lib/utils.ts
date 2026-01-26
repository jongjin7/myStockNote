import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Tailwind CSS 클래스를 병합하는 유틸리티 함수
 * clsx와 tailwind-merge를 결합하여 조건부 클래스와 중복 제거를 동시에 처리
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * 숫자를 천 단위 구분 쉼표가 있는 문자열로 포맷팅
 * @param value - 포맷팅할 숫자
 * @returns 포맷팅된 문자열 (예: "1,234,567")
 */
export function formatNumber(value: number | string): string {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(num)) return '0';
  return num.toLocaleString('ko-KR');
}

/**
 * 금액을 원화 형식으로 포맷팅
 * @param value - 포맷팅할 금액
 * @returns 포맷팅된 문자열 (예: "₩1,234,567")
 */
export function formatCurrency(value: number | string): string {
  return `₩${formatNumber(value)}`;
}

/**
 * 날짜를 상대적 시간으로 포맷팅 (예: "2시간 전", "3일 전")
 * @param date - 포맷팅할 날짜
 * @returns 상대적 시간 문자열
 */
export function formatRelativeTime(date: Date | string): string {
  const now = new Date();
  const target = typeof date === 'string' ? new Date(date) : date;
  const diffInSeconds = Math.floor((now.getTime() - target.getTime()) / 1000);

  if (diffInSeconds < 60) return '방금 전';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}분 전`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}시간 전`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}일 전`;
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 604800)}주 전`;
  if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)}개월 전`;
  return `${Math.floor(diffInSeconds / 31536000)}년 전`;
}

/**
 * 날짜를 YYYY-MM-DD 형식으로 포맷팅
 * @param date - 포맷팅할 날짜
 * @returns 포맷팅된 날짜 문자열
 */
export function formatDate(date: Date | string): string {
  const target = typeof date === 'string' ? new Date(date) : date;
  return target.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).replace(/\. /g, '-').replace('.', '');
}

/**
 * 날짜를 YYYY-MM-DD HH:mm 형식으로 포맷팅
 * @param date - 포맷팅할 날짜
 * @returns 포맷팅된 날짜시간 문자열
 */
export function formatDateTime(date: Date | string): string {
  const target = typeof date === 'string' ? new Date(date) : date;
  return target.toLocaleString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).replace(/\. /g, '-').replace('.', '');
}

/**
 * 텍스트를 지정된 길이로 자르고 말줄임표 추가
 * @param text - 자를 텍스트
 * @param maxLength - 최대 길이
 * @returns 잘린 텍스트
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

/**
 * 파일 크기를 읽기 쉬운 형식으로 포맷팅
 * @param bytes - 바이트 단위 크기
 * @returns 포맷팅된 크기 문자열 (예: "1.5 MB")
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}
