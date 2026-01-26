# 타이포그래피(Pretendard) 웹폰트 사용 가이드

## 설정 완료 사항

### 1. HTML (index.html)
```html
<!-- Pretendard Variable CDN -->
<link rel="stylesheet" as="style" crossorigin 
  href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.min.css" />
```

### 2. CSS (src/index.css)
```css
:root {
  font-family: "Pretendard Variable", Pretendard, -apple-system, BlinkMacSystemFont, 
    system-ui, Roboto, "Helvetica Neue", "Segoe UI", "Apple SD Gothic Neo", 
    "Noto Sans KR", "Malgun Gothic", sans-serif;
}
```

## Pretendard 폰트 특징

### 장점
- **한글 최적화**: 한글 글꼴로 설계되어 가독성이 뛰어남
- **Variable Font**: 하나의 파일로 다양한 굵기(weight) 지원
- **크로스 플랫폼**: macOS, Windows, Linux 모두 일관된 렌더링
- **오픈소스**: 무료로 상업적 사용 가능

### 지원 Weight
- 100 (Thin)
- 200 (ExtraLight)
- 300 (Light)
- 400 (Regular)
- 500 (Medium)
- 600 (SemiBold)
- 700 (Bold)
- 800 (ExtraBold)
- 900 (Black)

## Tailwind CSS에서 사용법

### Font Weight 클래스
```tsx
<h1 className="font-black">     {/* 900 */}
<h2 className="font-extrabold"> {/* 800 */}
<h3 className="font-bold">      {/* 700 */}
<p className="font-semibold">   {/* 600 */}
<p className="font-medium">     {/* 500 */}
<p className="font-normal">     {/* 400 */}
<span className="font-light">  {/* 300 */}
```

### 실전 예제
```tsx
// 페이지 제목
<h1 className="text-4xl font-extrabold tracking-tight text-white">
  대시보드
</h1>

// 섹션 제목
<h2 className="text-2xl font-bold text-white">
  보유 종목
</h2>

// 본문 텍스트
<p className="text-sm font-medium text-slate-400">
  투자 판단의 복기가 더 나은 결정으로 이어집니다.
</p>

// 강조 텍스트
<span className="text-lg font-semibold text-blue-500">
  10,000,000원
</span>
```

## 타이포그래피 위계

### 1. 페이지 제목 (H1)
- `text-3xl` ~ `text-4xl`
- `font-extrabold` (800) 또는 `font-black` (900)
- `tracking-tight` (자간 좁게)

### 2. 섹션 제목 (H2)
- `text-xl` ~ `text-2xl`
- `font-bold` (700)
- `tracking-tight`

### 3. 카드 제목 (H3)
- `text-lg` ~ `text-xl`
- `font-bold` (700) 또는 `font-semibold` (600)

### 4. 본문 텍스트
- `text-sm` ~ `text-base`
- `font-medium` (500) 또는 `font-normal` (400)

### 5. 보조 텍스트
- `text-xs` ~ `text-sm`
- `font-medium` (500) 또는 `font-normal` (400)
- 색상: `text-slate-400`, `text-slate-500`

## 가독성 최적화 팁

### Line Height
```tsx
// 제목: 타이트하게
<h1 className="leading-tight">  {/* line-height: 1.25 */}

// 본문: 여유있게
<p className="leading-relaxed">  {/* line-height: 1.625 */}
```

### Letter Spacing
```tsx
// 제목: 좁게
<h1 className="tracking-tight">  {/* letter-spacing: -0.025em */}

// 본문: 기본
<p className="tracking-normal">  {/* letter-spacing: 0 */}

// 강조: 넓게
<span className="tracking-wide"> {/* letter-spacing: 0.025em */}
```

## 다크 모드 색상 조합

```tsx
// 흰색 계열 (주요 텍스트)
text-white          // #ffffff
text-slate-50       // #f8fafc
text-slate-100      // #f1f5f9

// 회색 계열 (보조 텍스트)
text-slate-300      // #cbd5e1
text-slate-400      // #94a3b8
text-slate-500      // #64748b

// 어두운 회색 (비활성)
text-slate-600      // #475569
text-slate-700      // #334155
```

## 주의사항

1. **폰트 로딩**: CDN을 사용하므로 네트워크 상태에 따라 로딩 시간이 있을 수 있음
2. **폴백 폰트**: 로딩 실패 시 시스템 폰트로 자동 전환
3. **Variable Font 지원**: 구형 브라우저에서는 일반 Pretendard로 폴백
4. **한글 우선**: 한글 콘텐츠에 최적화되어 있으므로 영문은 시스템 폰트 사용 권장

## 성능 최적화

### Preload (선택사항)
더 빠른 로딩을 원한다면 `<head>`에 추가:
```html
<link rel="preload" as="style" 
  href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.min.css" />
```

### Self-hosting (선택사항)
CDN 대신 로컬 호스팅:
```bash
npm install pretendard
```

```css
@font-face {
  font-family: 'Pretendard Variable';
  src: url('/fonts/PretendardVariable.woff2') format('woff2-variations');
  font-weight: 100 900;
}
```
