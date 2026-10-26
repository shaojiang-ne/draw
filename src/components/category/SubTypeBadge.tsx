import type { ChartSubType } from '../../types';
import { useAppStore } from '../../store/appStore';

interface SubTypeBadgeProps {
  subType: ChartSubType;
  categoryId: string;
}

export function SubTypeBadge({ subType, categoryId }: SubTypeBadgeProps) {
  const { selectedSubTypeId, selectSubType } = useAppStore();
  const isSelected = selectedSubTypeId === subType.id;

  return (
    <button
      onClick={() => selectSubType(categoryId, subType.id)}
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
        isSelected
          ? 'bg-[var(--color-accent)] text-white'
          : 'bg-[var(--color-bg-tertiary)] text-[var(--color-text-secondary)] hover:bg-[var(--color-accent)] hover:text-white'
      }`}
    >
      {subType.name}
    </button>
  );
}
