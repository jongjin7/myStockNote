import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { cn } from '../../lib/utils';

interface BackButtonProps {
  /** 이동할 경로 (문자열) 또는 navigate(-1) 등을 위한 숫자. 기본값: -1 */
  to?: string | number;
  /** 버튼에 표시할 텍스트. 기본값: '목록으로 돌아가기' */
  label?: string;
  /** 대문자 처리 여부. 기본값: false */
  uppercase?: boolean;
  /** 추가 클래스 */
  className?: string;
}

export default function BackButton({ 
  to = -1, 
  label = '목록으로 돌아가기', 
  uppercase = false,
  className 
}: BackButtonProps) {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => (typeof to === 'number' ? navigate(to as any) : navigate(to))}
      className={cn(
        "inline-flex items-center text-gray-400 hover:text-white transition-colors group w-fit",
        className
      )}
    >
      <ArrowLeft size={18} className="mr-2 group-hover:-translate-x-1 transition-transform" />
      <span className={cn(
        "font-bold text-sm",
        uppercase && "uppercase tracking-widest"
      )}>
        {label}
      </span>
    </button>
  );
}
