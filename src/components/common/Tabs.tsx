import React, { useState } from 'react';

interface TabItem {
  label: string;
  content: React.ReactNode;
}

interface TabsProps {
  items: TabItem[];
  defaultIndex?: number;
}

export function Tabs({ items, defaultIndex = 0 }: TabsProps) {
  const [activeIndex, setActiveIndex] = useState(defaultIndex);

  return (
    <div>
      <div className="flex border-b border-[var(--color-border)]">
        {items.map((item, i) => (
          <button
            key={i}
            onClick={() => setActiveIndex(i)}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              i === activeIndex
                ? 'text-[var(--color-accent)] border-b-2 border-[var(--color-accent)]'
                : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
      <div className="py-3">{items[activeIndex]?.content}</div>
    </div>
  );
}
