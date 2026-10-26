import type { Template } from '../../types';
import { Check } from 'lucide-react';

interface TemplateCardProps {
  template: Template;
  selected: boolean;
  onClick: () => void;
}

export function TemplateCard({ template, selected, onClick }: TemplateCardProps) {
  return (
    <button
      onClick={onClick}
      className={`relative flex flex-col gap-2 p-3 rounded-lg border-2 text-left transition-all ${
        selected
          ? 'border-[var(--color-accent)] bg-[var(--color-bg-secondary)]'
          : 'border-[var(--color-border)] bg-[var(--color-bg)] hover:border-[var(--color-accent)]'
      }`}
    >
      {/* Selected checkmark */}
      {selected && (
        <div className="absolute top-2 right-2 flex items-center justify-center w-5 h-5 rounded-full bg-[var(--color-accent)] text-white">
          <Check className="w-3 h-3" />
        </div>
      )}

      {/* SVG preview thumbnail */}
      <div
        className="w-full h-28 rounded-md bg-[var(--color-bg-tertiary)] overflow-hidden flex items-center justify-center [&_svg]:max-w-full [&_svg]:max-h-full"
        dangerouslySetInnerHTML={{ __html: template.previewSvg }}
      />

      {/* Name */}
      <span className="text-sm font-medium text-[var(--color-text-primary)] truncate">
        {template.name}
      </span>

      {/* Description */}
      <span className="text-xs text-[var(--color-text-tertiary)] line-clamp-2">
        {template.description}
      </span>

      {/* Industry tags */}
      {template.industryTags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {template.industryTags.map(tag => (
            <span
              key={tag}
              className="text-[10px] px-1.5 py-0.5 rounded bg-[var(--color-bg-tertiary)] text-[var(--color-text-tertiary)]"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </button>
  );
}
