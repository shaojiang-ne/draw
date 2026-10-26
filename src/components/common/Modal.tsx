import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export function Modal({ open, onClose, title, children }: ModalProps) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-[var(--color-bg)] rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-auto animate-in fade-in zoom-in-95">
        {title && (
          <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--color-border)]">
            <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">{title}</h2>
            <button onClick={onClose} className="p-1 rounded hover:bg-[var(--color-bg-tertiary)] text-[var(--color-text-secondary)]">
              <X size={18} />
            </button>
          </div>
        )}
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
}
