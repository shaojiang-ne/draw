import { useRef, useState, useEffect } from 'react';
import { useAppStore } from '../../store/appStore';
import { useGeneration } from '../../hooks/useGeneration';
import { StepItem } from './StepItem';
import { ProgressBar } from './ProgressBar';
import { X, Palette, Timer, ChevronDown, Loader2, Check, Brain } from 'lucide-react';

export function ProgressPanel() {
  const { currentSteps, isGenerating, generationProgress, categories, selectedCategoryId } = useAppStore();
  const { cancel } = useGeneration();
  const startTimeRef = useRef<number | null>(null);
  const [elapsed, setElapsed] = useState('00:00');
  const [expanded, setExpanded] = useState(false);

  // Find expert role for current category
  const currentCategory = categories.find(c => c.id === selectedCategoryId);
  const expertRole = currentCategory?.expertRole ?? '专家';

  // Track elapsed time
  useEffect(() => {
    if (isGenerating && !startTimeRef.current) {
      startTimeRef.current = Date.now();
    }
    if (!isGenerating) {
      startTimeRef.current = null;
      setElapsed('00:00');
      return;
    }

    const interval = setInterval(() => {
      if (startTimeRef.current) {
        const diff = Math.floor((Date.now() - startTimeRef.current) / 1000);
        const mins = String(Math.floor(diff / 60)).padStart(2, '0');
        const secs = String(diff % 60).padStart(2, '0');
        setElapsed(`${mins}:${secs}`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isGenerating]);

  if (!isGenerating && currentSteps.length === 0) {
    return null;
  }

  const runningStep = currentSteps.find(s => s.status === 'running') ?? null;
  // 思考过程只展示最新片段（单行），随流式输出实时滚动
  const thinkingTail = runningStep?.detail.replace(/\s+/g, ' ').trim().slice(-100) ?? '';
  const clampedProgress = Math.min(100, Math.max(0, generationProgress));

  return (
    <div className="relative flex flex-col bg-[var(--color-bg-secondary)] border-t border-[var(--color-border)]">
      {/* Compact header: status + step chips + meta */}
      <div className="flex items-center gap-3 px-4 h-9">
        <button
          onClick={() => setExpanded(e => !e)}
          className="flex items-center gap-1.5 text-xs font-medium text-[var(--color-text-primary)] hover:text-[var(--color-accent)] transition-colors shrink-0"
          title={expanded ? '收起详情' : '展开详情'}
        >
          <Palette size={13} className="text-[var(--color-accent)]" />
          {expertRole}
          {isGenerating ? ' 正在工作中' : ' 已完成'}
          <ChevronDown
            size={13}
            className={`text-[var(--color-text-tertiary)] transition-transform ${expanded ? 'rotate-180' : ''}`}
          />
        </button>

        {/* Inline step chips */}
        <div className="flex-1 flex items-center gap-1 overflow-x-auto min-w-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {currentSteps.map(step => (
            <span
              key={step.index}
              className={`flex items-center gap-1 px-1.5 py-0.5 rounded text-[11px] whitespace-nowrap shrink-0 ${
                step.status === 'running'
                  ? 'bg-[var(--color-accent)]/10 text-[var(--color-accent)] font-medium'
                  : step.status === 'done'
                    ? 'text-[var(--color-text-tertiary)]'
                    : 'text-[var(--color-text-tertiary)]'
              }`}
            >
              {step.status === 'done' ? (
                <Check size={11} className="text-[var(--color-success)]" />
              ) : step.status === 'running' ? (
                <Loader2 size={11} className="animate-spin" />
              ) : null}
              {step.title}
            </span>
          ))}
          {currentSteps.length === 0 && (
            <span className="text-[11px] text-[var(--color-text-tertiary)]">准备中...</span>
          )}
        </div>

        {/* Meta: elapsed / cancel */}
        <div className="flex items-center gap-3 text-xs text-[var(--color-text-tertiary)] shrink-0">
          <span>{Math.round(clampedProgress)}%</span>
          <span className="flex items-center gap-1"><Timer size={12} />{elapsed}</span>
          {isGenerating && (
            <button
              onClick={cancel}
              className="flex items-center gap-1 px-2 py-0.5 rounded-md border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-tertiary)] transition-colors"
            >
              <X size={12} />
              取消
            </button>
          )}
        </div>
      </div>

      {/* Live thinking one-liner（生成中且当前步骤有思考内容时展示） */}
      {isGenerating && thinkingTail && (
        <div className="flex items-center gap-1.5 px-4 pb-1.5 -mt-0.5 text-[11px] text-[var(--color-text-tertiary)]">
          <Brain size={11} className="shrink-0 text-[var(--color-accent)]" />
          <span className="truncate italic">{thinkingTail}</span>
        </div>
      )}

      {/* Expanded: full step list with details */}
      {expanded && (
        <div className="px-4 py-2 border-t border-[var(--color-border)] max-h-48 overflow-y-auto">
          {currentSteps.length === 0 ? (
            <div className="text-xs text-[var(--color-text-tertiary)] py-2">准备中...</div>
          ) : (
            currentSteps.map(step => <StepItem key={step.index} step={step} />)
          )}
          <div className="pt-1 pb-1">
            <ProgressBar progress={generationProgress} />
          </div>
        </div>
      )}

      {/* Thin progress strip at the bottom edge */}
      <div className="h-0.5 w-full bg-[var(--color-bg-tertiary)]">
        <div
          className={`h-full transition-all duration-300 ${
            clampedProgress >= 100 ? 'bg-[var(--color-success)]' : 'bg-[var(--color-accent)]'
          }`}
          style={{ width: `${clampedProgress}%` }}
        />
      </div>
    </div>
  );
}
