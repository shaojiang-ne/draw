import React from 'react';
import { Button } from './Button';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({ icon, title, description, actionLabel, onAction }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      {icon && <div className="text-[var(--color-text-tertiary)] mb-4">{icon}</div>}
      <h3 className="text-lg font-medium text-[var(--color-text-primary)] mb-1">{title}</h3>
      {description && <p className="text-sm text-[var(--color-text-secondary)] mb-4 text-center max-w-md">{description}</p>}
      {actionLabel && onAction && <Button variant="primary" onClick={onAction}>{actionLabel}</Button>}
    </div>
  );
}
