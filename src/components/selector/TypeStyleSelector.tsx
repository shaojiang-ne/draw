import { useEffect } from 'react';
import { useAppStore } from '../../store/appStore';
import { StyleCard } from './StyleCard';
import { TemplateGrid } from './TemplateGrid';
import { ArrowLeft, SkipForward } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

export function TypeStyleSelector() {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    showTypeStyleSelector,
    selectedCategoryId,
    selectedSubTypeId,
    selectedStyleId,
    selectedTemplateId,
    categories,
    stylePresets,
    selectStyle,
    selectTemplate,
    setShowTypeStyleSelector,
    confirmSelection,
  } = useAppStore();

  // Close drawer on route change
  useEffect(() => {
    setShowTypeStyleSelector(false);
  }, [location.pathname, setShowTypeStyleSelector]);

  // Find current category and sub-type
  const currentCategory = categories.find(c => c.id === selectedCategoryId);
  const currentSubType = currentCategory?.subTypes.find(s => s.id === selectedSubTypeId);

  // Get templates for current sub-type
  const templates = currentSubType?.templates ?? [];

  // Handle skip template and start directly
  const handleSkip = () => {
    selectTemplate(null);
    confirmSelection();
    navigate('/');
  };

  // Handle confirm with template
  const handleConfirm = () => {
    confirmSelection();
    navigate('/');
  };

  return (
    <>
      {/* Backdrop */}
      {showTypeStyleSelector && (
        <div
          className="fixed inset-0 z-35 bg-black/40 transition-opacity duration-300"
          onClick={() => setShowTypeStyleSelector(false)}
        />
      )}

      <div
        className={`fixed inset-y-0 right-0 z-40 w-full max-w-lg bg-[var(--color-bg)] border-l border-[var(--color-border)] shadow-xl transform transition-[transform,visibility] duration-300 ease-in-out ${
          showTypeStyleSelector ? 'translate-x-0' : 'translate-x-full invisible pointer-events-none'
        }`}
        aria-hidden={!showTypeStyleSelector}
      >
      <div className="flex flex-col h-full overflow-hidden">
        {/* Header */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-[var(--color-border)] shrink-0">
          <button
            onClick={() => setShowTypeStyleSelector(false)}
            className="flex items-center justify-center w-8 h-8 rounded-md hover:bg-[var(--color-bg-tertiary)] text-[var(--color-text-secondary)] transition-colors"
            title="返回"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="flex-1 min-w-0">
            <h2 className="text-base font-semibold text-[var(--color-text-primary)] truncate">
              {currentSubType?.name ?? '选择配置'}
            </h2>
            {currentSubType?.description && (
              <p className="text-xs text-[var(--color-text-tertiary)] truncate">
                {currentSubType.description}
              </p>
            )}
          </div>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6">
          {/* Section: Select Style */}
          <div>
            <h3 className="text-sm font-medium text-[var(--color-text-primary)] mb-3">
              ① 选择风格
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {stylePresets.map(style => (
                <StyleCard
                  key={style.id}
                  style={style}
                  selected={selectedStyleId === style.id}
                  onClick={() => selectStyle(style.id)}
                />
              ))}
            </div>
          </div>

          {/* Section: Select Template */}
          <div>
            <h3 className="text-sm font-medium text-[var(--color-text-primary)] mb-3">
              ② 选择模板（可选）
            </h3>
            <TemplateGrid
              templates={templates}
              selectedId={selectedTemplateId}
              onSelect={selectTemplate}
            />
          </div>
        </div>

        {/* Footer buttons */}
        <div className="flex gap-3 px-4 py-3 border-t border-[var(--color-border)] shrink-0">
          <button
            onClick={handleSkip}
            className="flex items-center gap-1.5 px-4 py-2 text-sm rounded-md border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-tertiary)] transition-colors"
          >
            <SkipForward className="w-4 h-4" />
            跳过模板，直接开始
          </button>
          <button
            onClick={handleConfirm}
            className="flex-1 px-4 py-2 text-sm font-medium rounded-md bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-hover)] transition-colors"
          >
            确认开始绘图
          </button>
        </div>
      </div>
    </div>
    </>
  );
}
