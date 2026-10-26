import { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useAppStore } from '../../store/appStore';
import { Tabs } from '../common/Tabs';
import { ChevronDown, ChevronUp, Check, X } from 'lucide-react';

export function CodePanel() {
  const currentSvg = useAppStore((s) => s.currentSvg);
  const currentSteps = useAppStore((s) => s.currentSteps);
  const [collapsed, setCollapsed] = useState(true);

  const tabItems = [
    {
      label: 'SVG 代码',
      content: (
        <div className="max-h-80 overflow-auto rounded-md">
          {currentSvg ? (
            <SyntaxHighlighter
              language="xml"
              style={oneDark}
              customStyle={{
                margin: 0,
                borderRadius: '0.375rem',
                fontSize: '0.75rem',
                lineHeight: '1.5',
              }}
              wrapLongLines
            >
              {formatSvg(currentSvg)}
            </SyntaxHighlighter>
          ) : (
            <p className="text-sm text-[var(--color-text-tertiary)] py-4 text-center">
              暂无 SVG 代码
            </p>
          )}
        </div>
      ),
    },
    {
      label: '提示词详情',
      content: (
        <div className="space-y-3 py-2 max-h-80 overflow-y-auto">
          {currentSteps.length > 0 ? (
            currentSteps.map((layer, i) => (
              <div key={i} className="border border-[var(--color-border)] rounded-md p-3">
                <h4 className="text-sm font-medium text-[var(--color-text-primary)] mb-1">
                  Layer {layer.index + 1}: {layer.title}
                </h4>
                <p className="text-xs text-[var(--color-text-secondary)]">{layer.detail}</p>
                {layer.checkResults && layer.checkResults.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {layer.checkResults.map((cr, j) => (
                      <div key={j} className="flex items-center gap-1 text-xs">
                        <span className={`flex items-center ${cr.passed ? 'text-[var(--color-success)]' : 'text-[var(--color-warning)]'}`}>
                          {cr.passed ? <Check size={12} /> : <X size={12} />}
                        </span>
                        <span className="text-[var(--color-text-secondary)]">{cr.label}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))
          ) : (
            <p className="text-sm text-[var(--color-text-tertiary)] text-center py-4">
              暂无提示词详情
            </p>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="shrink-0 border-b border-[var(--color-border)]">
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="w-full flex items-center justify-between px-4 py-2 text-sm font-medium text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-tertiary)] transition-colors"
      >
        <span>代码与详情</span>
        {collapsed ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
      </button>
      {!collapsed && (
        <div className="px-4 pb-3">
          <Tabs items={tabItems} />
        </div>
      )}
    </div>
  );
}

function formatSvg(svg: string): string {
  try {
    return svg
      .replace(/></g, '>\n<')
      .replace(/\n\s*\n/g, '\n');
  } catch {
    return svg;
  }
}
