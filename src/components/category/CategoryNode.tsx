import { ChevronRight } from 'lucide-react';
import type { ChartCategory } from '../../types';
import { getCategoryIcon } from '../../utils/categoryIcons';
import { SubTypeBadge } from './SubTypeBadge';

interface CategoryNodeProps {
  category: ChartCategory;
  isExpanded: boolean;
  onToggle: () => void;
}

export function CategoryNode({ category, isExpanded, onToggle }: CategoryNodeProps) {
  const Icon = getCategoryIcon(category.icon);

  return (
    <div className="mb-1">
      {/* Category header */}
      <button
        onClick={onToggle}
        className="flex items-center w-full gap-2 px-2 py-1.5 rounded-md text-sm text-[var(--color-text-primary)] hover:bg-[var(--color-bg-tertiary)] transition-colors text-left"
      >
        <ChevronRight
          className={`w-3.5 h-3.5 text-[var(--color-text-tertiary)] shrink-0 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
        />
        <Icon className="w-4 h-4 text-[var(--color-accent)] shrink-0" />
        <span className="flex-1 truncate">{category.name}</span>
        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[var(--color-bg-tertiary)] text-[var(--color-text-tertiary)]">
          {category.subTypes.length}
        </span>
      </button>

      {/* Expanded sub-types */}
      {isExpanded && (
        <div className="flex flex-wrap gap-1.5 pl-8 pr-2 py-1.5">
          {category.subTypes.map(subType => (
            <SubTypeBadge
              key={subType.id}
              subType={subType}
              categoryId={category.id}
            />
          ))}
        </div>
      )}
    </div>
  );
}
