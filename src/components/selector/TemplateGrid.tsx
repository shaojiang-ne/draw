import type { Template } from '../../types';
import { TemplateCard } from './TemplateCard';

interface TemplateGridProps {
  templates: Template[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
}

export function TemplateGrid({ templates, selectedId, onSelect }: TemplateGridProps) {
  if (templates.length === 0) {
    return (
      <div className="text-sm text-[var(--color-text-tertiary)] py-4 text-center">
        暂无可用模板
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
      {templates.map(template => (
        <TemplateCard
          key={template.id}
          template={template}
          selected={selectedId === template.id}
          onClick={() => onSelect(selectedId === template.id ? null : template.id)}
        />
      ))}
    </div>
  );
}
