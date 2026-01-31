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
export function formatDate(date: Date | string | number): string {
  if (!date) return '-';
  const d = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;
  if (isNaN(d.getTime())) return '-';
  
  // getFullYear, getMonth, getDate는 브라우저 로컬 시간대를 사용합니다.
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * 날짜를 YYYY-MM-DD HH:mm 형식으로 포맷팅 (한국 시간대 기준)
 * @param date - 포맷팅할 날짜
 * @returns 포맷팅된 로컬 날짜시간 문자열
 */
export function formatDateTime(date: Date | string | number): string {
  if (!date) return '-';
  const d = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;
  if (isNaN(d.getTime())) return '-';

  const datePart = formatDate(d);
  const hours = String(d.getHours()).padStart(2, '0'); // 로컬 시
  const minutes = String(d.getMinutes()).padStart(2, '0'); // 로컬 분
  return `${datePart} ${hours}:${minutes}`;
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

/**
 * 이미지 파일을 리사이징하고 형식을 변환(WebP)하여 압축합니다.
 * @param file - 원본 이미지 파일
 * @param maxWidth - 최대 너비 (기본 1200px)
 * @param quality - 압축 품질 (0.8 = 80%)
 * @param outputType - 변환할 형식 (기본 image/webp)
 * @returns 리사이징 및 변환된 File 객체
 */
export async function resizeImage(
  file: File, 
  maxWidth: number = 1200, 
  quality: number = 0.8,
  outputType: string = 'image/webp'
): Promise<File> {
  return new Promise((resolve, reject) => {
    // 이미지 파일이 아니면 변환 없이 반환
    if (!file.type.startsWith('image/')) {
      return resolve(file);
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              // 확장자 변경 (예: photo.png -> photo.webp)
              const newFileName = file.name.replace(/\.[^/.]+$/, "") + ".webp";
              const convertedFile = new File([blob], newFileName, {
                type: outputType,
                lastModified: Date.now(),
              });
              resolve(convertedFile);
            } else {
              reject(new Error('Canvas to Blob failed'));
            }
          },
          outputType,
          quality
        );
      };
    };
    reader.onerror = (error) => reject(error);
  });
}

