# 디자인 시스템 - 버튼 & 필드 사이즈 규칙

## 📐 사이즈 규격

모든 버튼과 입력 필드는 다음의 표준 사이즈를 따릅니다:

| Size | Height | Border Radius | Padding (X) | Font Size | Use Case |
|------|--------|---------------|-------------|-----------|----------|
| **sm** | 28px (h-7) | 4px (rounded) | 12px (px-3) | text-xs | 작은 버튼, 인라인 액션 |
| **md** | 32px (h-8) | 8px (rounded-lg) | 16px (px-4) | text-sm | 기본 입력 필드, 일반 버튼 |
| **lg** | 40px (h-10) | 12px (rounded-xl) | 20px (px-5) | text-base | 중요 버튼, CTA |
| **xl** | 48px (h-12) | 12px (rounded-xl) | 24px (px-6) | text-base | 히어로 버튼, 주요 액션 |

## 🎨 적용 예시

### Button 컴포넌트

```tsx
// Small - 작은 버튼
<Button size="sm">취소</Button>

// Medium - 기본 버튼 (default)
<Button size="md">저장</Button>

// Large - 중요 버튼
<Button size="lg">확인</Button>

// Extra Large - 주요 액션
<Button size="xl">시작하기</Button>
```

### Input 컴포넌트

```tsx
// 기본적으로 md 사이즈 적용 (32px height, 8px radius)
<Input 
  type="text" 
  placeholder="종목명을 입력하세요"
/>
```

### Select 컴포넌트

```tsx
// md 사이즈 기준 (32px height, 8px radius)
<select className="h-8 px-3 text-sm rounded-lg">
  <option>옵션 1</option>
</select>
```

### 폼 예시 (Input + Button)

```tsx
// ✅ 올바른 예시 - 같은 사이즈(md) 사용
<ActionModal>
  <Input 
    label="종목명"
    placeholder="삼성전자"
  />
  {/* ActionModal의 버튼은 자동으로 size="md" 적용 */}
</ActionModal>

// ✅ 커스텀 폼
<form className="flex gap-2">
  <Input type="text" placeholder="검색어" />
  <Button size="md">검색</Button>  {/* Input과 같은 높이 */}
</form>
```

## 📏 Tailwind 클래스 매핑

### Height
- `h-7` = 28px (1.75rem)
- `h-8` = 32px (2rem)
- `h-10` = 40px (2.5rem)
- `h-12` = 48px (3rem)

### Border Radius
- `rounded` = 4px (0.25rem)
- `rounded-lg` = 8px (0.5rem)
- `rounded-xl` = 12px (0.75rem)

### Padding X
- `px-3` = 12px (0.75rem)
- `px-4` = 16px (1rem)
- `px-5` = 20px (1.25rem)
- `px-6` = 24px (1.5rem)

### Font Size
- `text-xs` = 12px (0.75rem)
- `text-sm` = 14px (0.875rem)
- `text-base` = 16px (1rem)

## ✅ 일관성 체크리스트

- [ ] 모든 버튼은 정의된 size prop을 사용
- [ ] 커스텀 높이 클래스 사용 금지 (h-11, h-9 등)
- [ ] 입력 필드는 md 사이즈 기준 (h-8, rounded-lg)
- [ ] **폼에서 인풋과 버튼이 함께 있으면 같은 사이즈 사용** (기본 md)
- [ ] py-* 클래스 사용 금지 (높이는 h-* 로만 제어)
- [ ] 일관된 border-radius 사용

## 🚫 피해야 할 패턴

```tsx
// ❌ 잘못된 예시
<Button className="h-11 py-3 rounded-2xl">버튼</Button>
<input className="h-9 py-2 rounded-full" />

// ✅ 올바른 예시
<Button size="lg">버튼</Button>
<Input type="text" />
```

## 📝 업데이트 이력

- 2026-02-01: 초기 규칙 정의
  - sm: 28px/4px
  - md: 32px/8px
  - lg: 40px/12px
  - xl: 48px/12px
