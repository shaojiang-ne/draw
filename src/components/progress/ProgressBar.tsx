interface ProgressBarProps {
  progress: number; // 0-100
}

export function ProgressBar({ progress }: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, progress));
  const isComplete = clamped >= 100;

  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-2 rounded-full bg-[var(--color-bg-tertiary)] overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-300 ${
            isComplete ? 'bg-[var(--color-success)]' : 'bg-[var(--color-accent)]'
          }`}
          style={{ width: `${clamped}%` }}
        />
      </div>
      <span className="text-xs text-[var(--color-text-tertiary)] w-10 text-right">
        {Math.round(clamped)}%
      </span>
    </div>
  );
}
