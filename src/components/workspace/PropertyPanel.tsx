import { useState, useEffect } from 'react';
import { X, Type, Palette, Square } from 'lucide-react';
import type { SelectedElementInfo, EditableProperty } from './SvgEditor';

interface PropertyPanelProps {
  info: SelectedElementInfo | null;
  onPropertyChange: (prop: EditableProperty, value: string) => void;
  /** 输入完成（blur/Enter）时调用，用于将修改同步回 store */
  onCommit: () => void;
  onClose: () => void;
}

const TAG_LABELS: Record<string, string> = {
  rect: '矩形',
  circle: '圆形',
  ellipse: '椭圆',
  polygon: '多边形',
  polyline: '折线',
  path: '路径',
  text: '文字',
  tspan: '文字片段',
  g: '分组',
  image: '图片',
  use: '引用',
};

/** 颜色值转 hex（用于 color input） */
function toHex(color: string): string {
  if (!color || color === 'none' || color === 'transparent') return '#000000';
  if (color.startsWith('#') && (color.length === 7 || color.length === 4)) return color;
  // 使用 canvas 将任意 CSS 颜色转为 hex
  try {
    const ctx = document.createElement('canvas').getContext('2d');
    if (!ctx) return '#000000';
    ctx.fillStyle = color;
    return ctx.fillStyle; // 浏览器会标准化为 #rrggbb
  } catch {
    return '#000000';
  }
}

/** 判断是否为"无颜色" */
function isNoneColor(color: string): boolean {
  return !color || color === 'none' || color === 'transparent';
}

export function PropertyPanel({ info, onPropertyChange, onCommit, onClose }: PropertyPanelProps) {
  const [fillHex, setFillHex] = useState('#000000');
  const [strokeHex, setStrokeHex] = useState('#000000');
  const [strokeWidth, setStrokeWidth] = useState('');
  const [textValue, setTextValue] = useState('');
  const [fontSize, setFontSize] = useState('');
  const [fillNone, setFillNone] = useState(false);
  const [strokeNone, setStrokeNone] = useState(false);

  // 同步 info 到本地 state
  useEffect(() => {
    if (!info) return;
    const fHex = toHex(info.fill);
    const sHex = toHex(info.stroke);
    setFillHex(fHex);
    setStrokeHex(sHex);
    setStrokeWidth(info.strokeWidth || '1');
    setTextValue(info.textContent || '');
    setFontSize(info.fontSize || '16');
    setFillNone(isNoneColor(info.fill));
    setStrokeNone(isNoneColor(info.stroke));
  }, [info]);

  if (!info) return null;

  const isText = info.tagName === 'text' || info.tagName === 'tspan';
  const isGroup = info.tagName === 'g';
  const isLine = info.lineType !== undefined;
  const isMultiSelect = (info.count ?? 1) > 1;
  const tagLabel = TAG_LABELS[info.tagName] || info.tagName;

  return (
    <div className="absolute top-3 right-3 z-20 w-60 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm rounded-lg border border-[var(--color-border)] shadow-xl select-text overflow-hidden">
      {/* 头部 */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-[var(--color-border)] bg-[var(--color-bg-secondary)]/80">
        <div className="flex items-center gap-1.5 text-xs font-medium text-[var(--color-text-primary)]">
          <Square size={13} className="text-blue-500" />
          {isMultiSelect ? (
            <span>已选 {info.count} 个元素</span>
          ) : (
            <>
              <span>{tagLabel}</span>
              <span className="text-[var(--color-text-tertiary)]">&lt;{info.tagName}&gt;</span>
            </>
          )}
        </div>
        <button
          onClick={onClose}
          className="p-0.5 rounded hover:bg-[var(--color-bg-tertiary)] text-[var(--color-text-tertiary)] transition-colors cursor-pointer"
        >
          <X size={14} />
        </button>
      </div>

      <div className="p-3 space-y-3 text-xs">
        {/* 填充色 */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="flex items-center gap-1 text-[var(--color-text-secondary)] font-medium">
              <Palette size={12} />
              填充色
            </label>
            <label className="flex items-center gap-1 text-[var(--color-text-tertiary)] cursor-pointer">
              <input
                type="checkbox"
                checked={fillNone}
                onChange={(e) => {
                  setFillNone(e.target.checked);
                  if (e.target.checked) {
                    onPropertyChange('fill', 'none');
                  } else {
                    onPropertyChange('fill', fillHex);
                  }
                  onCommit();
                }}
                className="w-3 h-3 rounded accent-blue-500"
              />
              无
            </label>
          </div>
          {!fillNone && (
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={fillHex}
                onChange={(e) => {
                  setFillHex(e.target.value);
                  onPropertyChange('fill', e.target.value);
                }}
                onBlur={onCommit}
                className="w-8 h-8 rounded border border-[var(--color-border)] cursor-pointer p-0.5 shrink-0"
              />
              <input
                type="text"
                value={fillHex}
                onChange={(e) => {
                  const v = e.target.value;
                  setFillHex(v);
                  if (/^#[0-9a-fA-F]{6}$/.test(v)) {
                    onPropertyChange('fill', v);
                  }
                }}
                onBlur={onCommit}
                className="flex-1 min-w-0 px-2 py-1 rounded border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text-primary)] font-mono focus:outline-none focus:ring-1 focus:ring-blue-400"
                placeholder="#000000"
              />
            </div>
          )}
        </div>

        {/* 边框色 */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="flex items-center gap-1 text-[var(--color-text-secondary)] font-medium">
              <Palette size={12} />
              边框色
            </label>
            <label className="flex items-center gap-1 text-[var(--color-text-tertiary)] cursor-pointer">
              <input
                type="checkbox"
                checked={strokeNone}
                onChange={(e) => {
                  setStrokeNone(e.target.checked);
                  if (e.target.checked) {
                    onPropertyChange('stroke', 'none');
                  } else {
                    onPropertyChange('stroke', strokeHex);
                  }
                  onCommit();
                }}
                className="w-3 h-3 rounded accent-blue-500"
              />
              无
            </label>
          </div>
          {!strokeNone && (
            <>
              <div className="flex items-center gap-2 mb-1.5">
                <input
                  type="color"
                  value={strokeHex}
                  onChange={(e) => {
                    setStrokeHex(e.target.value);
                    onPropertyChange('stroke', e.target.value);
                  }}
                  onBlur={onCommit}
                  className="w-8 h-8 rounded border border-[var(--color-border)] cursor-pointer p-0.5 shrink-0"
                />
                <input
                  type="text"
                  value={strokeHex}
                  onChange={(e) => {
                    const v = e.target.value;
                    setStrokeHex(v);
                    if (/^#[0-9a-fA-F]{6}$/.test(v)) {
                      onPropertyChange('stroke', v);
                    }
                  }}
                  onBlur={onCommit}
                  className="flex-1 min-w-0 px-2 py-1 rounded border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text-primary)] font-mono focus:outline-none focus:ring-1 focus:ring-blue-400"
                  placeholder="#000000"
                />
              </div>
              {/* 边框宽度 */}
              <div className="flex items-center gap-2">
                <span className="text-[var(--color-text-tertiary)] shrink-0">宽度</span>
                <input
                  type="number"
                  value={strokeWidth}
                  min="0"
                  step="0.5"
                  onChange={(e) => {
                    setStrokeWidth(e.target.value);
                    onPropertyChange('stroke-width', e.target.value);
                  }}
                  onBlur={onCommit}
                  className="w-20 px-2 py-1 rounded border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text-primary)] focus:outline-none focus:ring-1 focus:ring-blue-400"
                />
              </div>
            </>
          )}
        </div>

        {/* 连线类型切换 — 仅 line/path/polyline 元素 */}
        {isLine && (
          <div>
            <label className="flex items-center gap-1 text-[var(--color-text-secondary)] font-medium mb-1.5">
              连线类型
            </label>
            <div className="flex gap-1">
              {(['line', 'curve'] as const).map(type => (
                <button
                  key={type}
                  onClick={() => {
                    onPropertyChange('line-type', type);
                    onCommit();
                  }}
                  className={`flex-1 px-2 py-1.5 rounded border text-[11px] font-medium transition-colors cursor-pointer ${
                    info.lineType === type
                      ? 'bg-blue-100 dark:bg-blue-900/50 border-blue-300 dark:border-blue-700 text-blue-700 dark:text-blue-300'
                      : 'border-[var(--color-border)] text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-tertiary)]'
                  }`}
                >
                  {type === 'line' ? '直线' : '曲线'}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 文字编辑 — 仅 text/tspan 元素 */}
        {isText && (
          <div>
            <label className="flex items-center gap-1 text-[var(--color-text-secondary)] font-medium mb-1.5">
              <Type size={12} />
              文字内容
            </label>
            <textarea
              value={textValue}
              rows={2}
              onChange={(e) => {
                setTextValue(e.target.value);
                onPropertyChange('text', e.target.value);
              }}
              onBlur={onCommit}
              className="w-full px-2 py-1.5 rounded border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text-primary)] text-sm resize-y focus:outline-none focus:ring-1 focus:ring-blue-400"
              placeholder="输入文字内容"
            />
            <div className="flex items-center gap-2 mt-1.5">
              <span className="text-[var(--color-text-tertiary)] shrink-0">字号</span>
              <input
                type="number"
                value={fontSize}
                min="8"
                max="200"
                step="1"
                onChange={(e) => {
                  setFontSize(e.target.value);
                  onPropertyChange('font-size', e.target.value);
                }}
                onBlur={onCommit}
                className="w-20 px-2 py-1 rounded border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text-primary)] focus:outline-none focus:ring-1 focus:ring-blue-400"
              />
            </div>
          </div>
        )}

        {/* 分组提示 */}
        {isGroup && (
          <div className="text-[var(--color-text-tertiary)] italic">
            分组内所有元素将一起移动。修改填充色将应用到分组内的形状元素。
          </div>
        )}

        {/* 操作提示 */}
        <div className="pt-1 border-t border-[var(--color-border)] text-[var(--color-text-tertiary)] text-[10px]">
          {isMultiSelect
            ? '💡 拖拽可整体移动选中元素'
            : isLine
              ? '💡 拖拽节点时连线自动跟随'
              : isText
                ? '💡 双击文字可直接编辑'
                : '💡 拖拽移动，空白处拖拽框选多个'}
        </div>
      </div>
    </div>
  );
}
