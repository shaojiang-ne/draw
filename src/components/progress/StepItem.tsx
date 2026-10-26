import { useState } from 'react';
import type { StepProgress } from '../../types';
import { CheckResultList } from './CheckResultList';
import { ChevronRight } from 'lucide-react';

interface StepItemProps {
  step: StepProgress;
}

export function StepItem({ step }: StepItemProps) {
  const [expanded, setExpanded] = useState(false);

  const statusIcon = () => {
    switch (step.status) {
      case 'done':
        return <span className="text-[var(--color-success)]">&#10003;</span>;
      case 'running':
        return (
          <span className="inline-block animate-spin text-[var(--color-accent)]">
            &#10227;
          </span>
        );
      case 'checking':
        return <span className="text-[var(--color-warning)]">&#8987;</span>;
      default:
        return <span className="text-[var(--color-text-tertiary)]">&#8987;</span>;
    }
  };

  return (
    <div className="py-1.5">
      <div className="flex items-center gap-2">
        <span className="w-4 text-center text-sm shrink-0">{statusIcon()}</span>
        <span className="text-sm text-[var(--color-text-primary)] flex-1">
          {step.title}
        </span>
        {step.detail && (
          <button
            onClick={() => setExpanded(e => !e)}
            className="flex items-center justify-center w-5 h-5 rounded hover:bg-[var(--color-bg-tertiary)] text-[var(--color-text-tertiary)] transition-colors"
          >
            <ChevronRight
              className={`w-3 h-3 transition-transform ${expanded ? 'rotate-90' : ''}`}
            />
          </button>
        )}
      </div>

      {/* Collapsible detail */}
      {expanded && step.detail && (
        <div className="ml-6 mt-1 text-xs text-[var(--color-text-tertiary)] whitespace-pre-wrap">
          {step.detail}
        </div>
      )}

      {/* Check results inline */}
      {step.checkResults && step.checkResults.length > 0 && (
        <CheckResultList results={step.checkResults} />
      )}
    </div>
  );
}
