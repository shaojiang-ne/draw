import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, LayoutGrid, SlidersHorizontal, PenLine } from 'lucide-react';
import { useAppStore } from '../../store/appStore';
import { getCategoryIcon } from '../../utils/categoryIcons';

export function WelcomeScreen() {
  const navigate = useNavigate();
  const categories = useAppStore(s => s.categories);
  const selectSubType = useAppStore(s => s.selectSubType);
  const startDirectly = useAppStore(s => s.startDirectly);
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);

  const activeCategory = categories.find(c => c.id === activeCategoryId);

  // 快速开始：跳过所有选择，用默认类型（第一个分类的第一个子类型）创建空白对话
  const defaultCategory = categories[0];
  const defaultSubType = defaultCategory?.subTypes[0];
  const handleQuickStart = () => {
    if (defaultCategory && defaultSubType) {
      startDirectly(defaultCategory.id, defaultSubType.id);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="min-h-full flex flex-col items-center justify-center px-6 py-10">
        {/* Hero */}
        <div className="flex flex-col items-center text-center mb-10">
          <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-accent-hover)] text-white shadow-lg shadow-[var(--color-accent)]/25 mb-5">
            <Sparkles className="w-7 h-7" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-[var(--color-text-primary)] tracking-tight">
            用一句话，生成<span className="text-[var(--color-accent)]">专业图表</span>
          </h1>
          <p className="mt-3 text-sm md:text-base text-[var(--color-text-secondary)] max-w-md">
            选择图表类型，AI 专家流程帮你构思、绘制并校验，随时用自然语言继续调整
          </p>
          <button
            onClick={handleQuickStart}
            className="mt-6 flex items-center gap-2 px-6 py-2.5 rounded-lg bg-[var(--color-accent)] text-white text-sm font-medium hover:bg-[var(--color-accent-hover)] transition-colors shadow-sm"
          >
            <PenLine className="w-4 h-4" />
            直接开始绘图
          </button>
          <p className="mt-2 text-xs text-[var(--color-text-tertiary)]">
            跳过类型与模板选择，立即开始
          </p>
        </div>

        {/* Category quick-start grid */}
        <div className="w-full max-w-3xl">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {categories.map(category => {
              const Icon = getCategoryIcon(category.icon);
              const isActive = category.id === activeCategoryId;
              return (
                <button
                  key={category.id}
                  onClick={() => setActiveCategoryId(isActive ? null : category.id)}
                  className={`group flex items-center gap-3 p-3.5 rounded-xl border text-left transition-all duration-150 ${
                    isActive
                      ? 'border-[var(--color-accent)] bg-[var(--color-bg-secondary)] shadow-sm'
                      : 'border-[var(--color-border)] bg-[var(--color-bg-secondary)] hover:border-[var(--color-accent)]/60 hover:shadow-sm hover:-translate-y-0.5'
                  }`}
                >
                  <div
                    className={`flex items-center justify-center w-10 h-10 rounded-lg shrink-0 transition-colors ${
                      isActive
                        ? 'bg-[var(--color-accent)] text-white'
                        : 'bg-[var(--color-bg-tertiary)] text-[var(--color-accent)] group-hover:bg-[var(--color-accent)]/10'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[var(--color-text-primary)] truncate">
                      {category.name}
                    </p>
                    <p className="text-xs text-[var(--color-text-tertiary)]">
                      {category.subTypes.length} 个子类型
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Sub-type chips of the active category */}
          {activeCategory && (
            <div className="mt-3 p-4 rounded-xl border border-[var(--color-accent)]/40 bg-[var(--color-bg-secondary)] animate-in fade-in slide-in-from-top-1 duration-200">
              <p className="text-xs font-medium text-[var(--color-text-tertiary)] mb-2.5">
                点击子类型直接开始绘图，或点右侧
                <SlidersHorizontal className="inline w-3 h-3 mx-0.5 -mt-0.5" />
                选择风格与模板
              </p>
              <div className="flex flex-wrap gap-2">
                {activeCategory.subTypes.map(subType => (
                  <div
                    key={subType.id}
                    className="group flex items-center rounded-full border border-[var(--color-border)] bg-[var(--color-bg)] text-sm text-[var(--color-text-secondary)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] transition-colors"
                  >
                    <button
                      onClick={() => startDirectly(activeCategory.id, subType.id)}
                      title="直接开始绘图"
                      className="flex items-center gap-1.5 pl-3 pr-2 py-1.5"
                    >
                      {subType.name}
                      <ArrowRight className="w-3.5 h-3.5 opacity-0 -ml-1 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                    </button>
                    <button
                      onClick={() => selectSubType(activeCategory.id, subType.id)}
                      title="选择风格与模板"
                      className="pr-2.5 pl-1 py-1.5 text-[var(--color-text-tertiary)] hover:text-[var(--color-accent)] transition-colors"
                    >
                      <SlidersHorizontal className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer action */}
        <div className="flex items-center gap-3 mt-10 text-sm text-[var(--color-text-tertiary)]">
          <span>没有思路？</span>
          <button
            onClick={() => navigate('/templates')}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] transition-colors"
          >
            <LayoutGrid className="w-4 h-4" />
            浏览模板库
          </button>
        </div>
      </div>
    </div>
  );
}
