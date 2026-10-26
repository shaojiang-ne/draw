import { useState, useEffect, useRef } from 'react';
import { Search } from 'lucide-react';

interface TemplateSearchBarProps {
  onSearch: (query: string) => void;
  initialValue?: string;
}

export function TemplateSearchBar({ onSearch, initialValue = '' }: TemplateSearchBarProps) {
  const [value, setValue] = useState(initialValue);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(null);

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      onSearch(value);
    }, 300);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [value, onSearch]);

  return (
    <div className="relative">
      <Search
        size={16}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-tertiary)]"
      />
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="搜索模板..."
        className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-tertiary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent"
      />
    </div>
  );
}
