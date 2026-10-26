import { useState, useEffect } from 'react';
import { useAppStore } from '../../store/appStore';
import { CategoryNode } from './CategoryNode';

export function CategoryTree() {
  const { categories, selectedCategoryId } = useAppStore();
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  // Auto-expand current category when selected
  useEffect(() => {
    if (selectedCategoryId) {
      setExpandedIds(prev => {
        if (prev.has(selectedCategoryId)) return prev;
        const next = new Set(prev);
        next.add(selectedCategoryId);
        return next;
      });
    }
  }, [selectedCategoryId]);

  const toggle = (id: string) => {
    setExpandedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  if (categories.length === 0) {
    return (
      <div className="px-4 py-8 text-center text-sm text-[var(--color-text-tertiary)]">
        暂无分类数据
      </div>
    );
  }

  return (
    <div className="px-2">
      {categories.map(category => (
        <CategoryNode
          key={category.id}
          category={category}
          isExpanded={expandedIds.has(category.id)}
          onToggle={() => toggle(category.id)}
        />
      ))}
    </div>
  );
}
