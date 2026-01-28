import { type ReactNode } from 'react';
import { Modal, ModalBody, ModalFooter } from './Modal';
import Button from '../Button';

export interface ActionModalProps {
 isOpen: boolean;
 onClose: () => void;
 onSubmit: (e: React.FormEvent) => void;
 title: string;
 children: ReactNode;
 submitLabel?: string;
 cancelLabel?: string;
 isSubmitting?: boolean;
 submitDisabled?: boolean;
 size?: 'sm' | 'md' | 'lg' | 'xl';
 variant?: 'primary' | 'danger' | 'success';
}

export function ActionModal({
 isOpen,
 onClose,
 onSubmit,
 title,
 children,
 submitLabel = '저장하기',
 cancelLabel = '취소',
 isSubmitting = false,
 submitDisabled = false,
 size = 'md',
 variant = 'primary'
}: ActionModalProps) {
 return (
 <Modal isOpen={isOpen} onClose={onClose} title={title} size={size}>
  <form onSubmit={onSubmit}>
  <ModalBody>
   {children}
  </ModalBody>
  <ModalFooter>
   <Button 
   variant="secondary" 
   type="button" 
   onClick={onClose}
   className="border-gray-800"
   >
   {cancelLabel}
   </Button>
   <Button 
   type="submit" 
   variant={variant}
   disabled={submitDisabled || isSubmitting}
   className={isSubmitting ? "opacity-70 cursor-not-allowed" : ""}
   >
   {isSubmitting ? '처리 중...' : submitLabel}
   </Button>
  </ModalFooter>
  </form>
 </Modal>
 );
}
