import type { StylePreset } from '../../types';
import { Check } from 'lucide-react';

interface StyleCardProps {
  style: StylePreset;
  selected: boolean;
  onClick: () => void;
}

export function StyleCard({ style, selected, onClick }: StyleCardProps) {
  return (
    <button
      onClick={onClick}
      className={`relative flex flex-col gap-2 p-3 rounded-lg border-2 text-left transition-all ${
        selected
          ? 'border-[var(--color-accent)] bg-[var(--color-bg-secondary)]'
          : 'border-[var(--color-border)] bg-[var(--color-bg)] hover:border-[var(--color-accent)]'
      }`}
    >
      {/* Selected checkmark */}
      {selected && (
        <div className="absolute top-2 right-2 flex items-center justify-center w-5 h-5 rounded-full bg-[var(--color-accent)] text-white">
          <Check className="w-3 h-3" />
        </div>
      )}

      {/* Style name */}
      <span className="text-sm font-medium text-[var(--color-text-primary)] truncate">
        {style.name}
      </span>

      {/* Color palette bar */}
      <div className="flex gap-0.5">
        <div className="w-5 h-3 rounded-sm" style={{ backgroundColor: style.colors.primary }} />
        <div className="w-5 h-3 rounded-sm" style={{ backgroundColor: style.colors.secondary }} />
        <div className="w-5 h-3 rounded-sm" style={{ backgroundColor: style.colors.accent }} />
        <div className="w-5 h-3 rounded-sm" style={{ backgroundColor: style.colors.background }} />
        <div className="w-5 h-3 rounded-sm" style={{ backgroundColor: style.colors.text }} />
      </div>

      {/* Description */}
      <span className="text-xs text-[var(--color-text-tertiary)] line-clamp-2">
        {style.description}
      </span>
    </button>
  );
}
