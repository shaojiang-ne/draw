import { useState, useMemo, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { X } from 'lucide-react';
import { useAppStore } from '../../store/appStore';
import { TemplateSearchBar } from './TemplateSearchBar';
import { TemplateFilter, type FilterState } from './TemplateFilter';
import type { Template, ChartCategory } from '../../types';

export function TemplateLibrary() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const categories = useAppStore((s) => s.categories);
  const selectSubType = useAppStore((s) => s.selectSubType);
  const selectTemplate = useAppStore((s) => s.selectTemplate);
  const confirmSelection = useAppStore((s) => s.confirmSelection);
  const setChatDraft = useAppStore((s) => s.setChatDraft);

  const initialQuery = searchParams.get('q') ?? '';
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [filters, setFilters] = useState<FilterState>({
    categoryId: null,
    subTypeId: null,
    industry: null,
  });

  const filteredCategories = useMemo(() => {
    let cats = categories;

    // Filter by category
    if (filters.categoryId) {
      cats = cats.filter((c) => c.id === filters.categoryId);
    }

    // Map categories with filtered subtypes and templates
    return cats
      .map((cat) => {
        let subTypes = cat.subTypes;

        // Filter by sub-type
        if (filters.subTypeId) {
          subTypes = subTypes.filter((st) => st.id === filters.subTypeId);
        }

        // Map subtypes with filtered templates
        const mappedSubTypes = subTypes
          .map((st) => {
            let templates = st.templates;

            // Filter by industry
            if (filters.industry) {
              templates = templates.filter((t) =>
                t.industryTags.includes(filters.industry!)
              );
            }

            // Filter by search query
            if (searchQuery) {
              const q = searchQuery.toLowerCase();
              templates = templates.filter(
                (t) =>
                  t.name.toLowerCase().includes(q) ||
                  t.description.toLowerCase().includes(q) ||
                  t.industryTags.some((tag) => tag.toLowerCase().includes(q))
              );
            }

            return { ...st, templates };
          })
          .filter((st) => st.templates.length > 0);

        return { ...cat, subTypes: mappedSubTypes };
      })
      .filter((c) => c.subTypes.length > 0);
  }, [categories, filters, searchQuery]);

  const handleTemplateClick = useCallback(
    (template: Template, categoryId: string, subTypeId: string) => {
      selectSubType(categoryId, subTypeId);
      selectTemplate(template.id);
      confirmSelection();
      setChatDraft(template.exampleUserInput);
      navigate('/');
    },
    [navigate, selectSubType, selectTemplate, confirmSelection, setChatDraft]
  );

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-[var(--color-border)] bg-[var(--color-bg)]">
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-xl font-semibold text-[var(--color-text-primary)]">
            模板库
          </h1>
          <button
            onClick={() => navigate('/')}
            className="flex items-center justify-center w-8 h-8 rounded-md hover:bg-[var(--color-bg-tertiary)] text-[var(--color-text-secondary)] transition-colors"
            title="关闭"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="flex items-start gap-3 flex-wrap">
          <div className="w-64">
            <TemplateSearchBar key={initialQuery} initialValue={initialQuery} onSearch={setSearchQuery} />
          </div>
          <TemplateFilter onFilterChange={setFilters} />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-4">
        {filteredCategories.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-[var(--color-text-tertiary)]">
            <p className="text-sm">没有找到匹配的模板</p>
          </div>
        ) : (
          filteredCategories.map((category) => (
            <CategorySection
              key={category.id}
              category={category}
              onTemplateClick={handleTemplateClick}
            />
          ))
        )}
      </div>
    </div>
  );
}

interface CategorySectionProps {
  category: ChartCategory;
  onTemplateClick: (template: Template, categoryId: string, subTypeId: string) => void;
}

function CategorySection({ category, onTemplateClick }: CategorySectionProps) {
  return (
    <div className="mb-8">
      <h2 className="text-lg font-medium text-[var(--color-text-primary)] mb-1 flex items-center gap-2">
        <span>{category.icon}</span>
        <span>{category.name}</span>
      </h2>
      {category.subTypes.map((subType) => (
        <div key={subType.id} className="mb-4">
          <h3 className="text-sm font-medium text-[var(--color-text-secondary)] mb-2 ml-7">
            {subType.name}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 ml-7">
            {subType.templates.map((template) => (
              <TemplateCard
                key={template.id}
                template={template}
                categoryId={category.id}
                subTypeId={subType.id}
                onClick={onTemplateClick}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

interface TemplateCardProps {
  template: Template;
  categoryId: string;
  subTypeId: string;
  onClick: (template: Template, categoryId: string, subTypeId: string) => void;
}

function TemplateCard({ template, categoryId, subTypeId, onClick }: TemplateCardProps) {
  return (
    <button
      onClick={() => onClick(template, categoryId, subTypeId)}
      className="text-left rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] hover:border-[var(--color-accent)] hover:shadow-md transition-all overflow-hidden group"
    >
      {/* Preview */}
      <div className="h-32 bg-white dark:bg-gray-900 flex items-center justify-center p-2 overflow-hidden">
        <div
          className="w-full h-full flex items-center justify-center"
          dangerouslySetInnerHTML={{ __html: template.previewSvg }}
        />
      </div>
      {/* Info */}
      <div className="p-3">
        <h4 className="text-sm font-medium text-[var(--color-text-primary)] group-hover:text-[var(--color-accent)] transition-colors truncate">
          {template.name}
        </h4>
        <p className="text-xs text-[var(--color-text-secondary)] mt-1 line-clamp-2">
          {template.description}
        </p>
        {template.industryTags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {template.industryTags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-[10px] px-1.5 py-0.5 rounded-full bg-[var(--color-bg-tertiary)] text-[var(--color-text-tertiary)]"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </button>
  );
}
