import type { CheckResult } from '../../types';

interface CheckResultListProps {
  results: CheckResult[];
}

export function CheckResultList({ results }: CheckResultListProps) {
  if (results.length === 0) return null;

  return (
    <div className="ml-5 mt-1 space-y-0.5">
      {results.map(result => (
        <div key={result.itemId} className="flex items-start gap-1.5 text-xs">
          {result.passed ? (
            <span className="text-[var(--color-success)] shrink-0">&#10003;</span>
          ) : (
            <span className="text-[var(--color-error)] shrink-0">&#10007;</span>
          )}
          <span
            className={`${
              result.passed
                ? 'text-[var(--color-text-secondary)]'
                : 'text-[var(--color-error)]'
            }`}
          >
            {result.label}
          </span>
          {!result.passed && result.fixNote && (
            <span className="text-[var(--color-warning)] ml-1">
              ({result.fixNote})
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
