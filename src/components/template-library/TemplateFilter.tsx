import { useState, useMemo, useEffect, useRef } from 'react';
import { useAppStore } from '../../store/appStore';
import { ChevronDown } from 'lucide-react';

interface TemplateFilterProps {
  onFilterChange: (filters: FilterState) => void;
}

export interface FilterState {
  categoryId: string | null;
  subTypeId: string | null;
  industry: string | null;
}

export function TemplateFilter({ onFilterChange }: TemplateFilterProps) {
  const categories = useAppStore((s) => s.categories);
  const [filters, setFilters] = useState<FilterState>({
    categoryId: null,
    subTypeId: null,
    industry: null,
  });

  const selectedCategory = useMemo(
    () => categories.find((c) => c.id === filters.categoryId) ?? null,
    [categories, filters.categoryId]
  );

  const subTypes = useMemo(
    () => selectedCategory?.subTypes ?? [],
    [selectedCategory]
  );

  const industries = useMemo(() => {
    const tagSet = new Set<string>();
    categories.forEach((cat) =>
      cat.subTypes.forEach((st) =>
        st.templates.forEach((t) =>
          t.industryTags.forEach((tag) => tagSet.add(tag))
        )
      )
    );
    return Array.from(tagSet).sort();
  }, [categories]);

  const updateFilter = (partial: Partial<FilterState>) => {
    const next = { ...filters, ...partial };
    // Reset subType when category changes
    if (partial.categoryId !== undefined && partial.categoryId !== filters.categoryId) {
      next.subTypeId = null;
    }
    setFilters(next);
    onFilterChange(next);
  };

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {/* Category dropdown */}
      <FilterDropdown
        label="分类"
        options={categories.map((c) => ({ value: c.id, label: c.name }))}
        value={filters.categoryId}
        onChange={(v) => updateFilter({ categoryId: v })}
        placeholder="全部分类"
      />

      {/* Sub-type dropdown (dynamic) */}
      <FilterDropdown
        label="子类型"
        options={subTypes.map((st) => ({ value: st.id, label: st.name }))}
        value={filters.subTypeId}
        onChange={(v) => updateFilter({ subTypeId: v })}
        placeholder="全部子类型"
        disabled={!filters.categoryId}
      />

      {/* Industry dropdown */}
      <FilterDropdown
        label="行业"
        options={industries.map((ind) => ({ value: ind, label: ind }))}
        value={filters.industry}
        onChange={(v) => updateFilter({ industry: v })}
        placeholder="全部行业"
      />
    </div>
  );
}

interface FilterDropdownProps {
  label: string;
  options: { value: string; label: string }[];
  value: string | null;
  onChange: (value: string | null) => void;
  placeholder: string;
  disabled?: boolean;
}

function FilterDropdown({
  options,
  value,
  onChange,
  placeholder,
  disabled,
}: FilterDropdownProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const selectedLabel = options.find((o) => o.value === value)?.label;

  // Close on outside click or Escape
  useEffect(() => {
    if (!open) return;
    const handleMouseDown = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open]);

  return (
    <div className="relative" ref={rootRef}>
      <button
        onClick={() => setOpen(!open)}
        disabled={disabled}
        className="flex items-center gap-1 px-3 py-1.5 text-sm rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-tertiary)] transition-colors disabled:opacity-40"
      >
        <span>{selectedLabel ?? placeholder}</span>
        <ChevronDown size={14} />
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-1 z-10 min-w-[160px] bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg shadow-lg py-1 max-h-60 overflow-y-auto">
          <button
            onClick={() => {
              onChange(null);
              setOpen(false);
            }}
            className="w-full text-left px-3 py-1.5 text-sm text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-tertiary)]"
          >
            {placeholder}
          </button>
          {options.map((opt) => (
            <button
              key={opt.value}
              onClick={() => {
                onChange(opt.value);
                setOpen(false);
              }}
              className={`w-full text-left px-3 py-1.5 text-sm hover:bg-[var(--color-bg-tertiary)] ${
                opt.value === value
                  ? 'text-[var(--color-accent)] font-medium'
                  : 'text-[var(--color-text-primary)]'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
