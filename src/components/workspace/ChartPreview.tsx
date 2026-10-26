import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store/appStore';
import { ProgressPanel } from '../progress/ProgressPanel';
import { EmptyState } from '../common/EmptyState';
import { SvgEditor } from './SvgEditor';
import type { SvgEditorHandle, SelectedElementInfo, EditableProperty } from './SvgEditor';
import { PropertyPanel } from './PropertyPanel';
import { ImageOff, ZoomIn, ZoomOut, Maximize } from 'lucide-react';

export function ChartPreview() {
  const currentSvg = useAppStore((s) => s.currentSvg);
  const setCurrentSvg = useAppStore((s) => s.setCurrentSvg);
  const isGenerating = useAppStore((s) => s.isGenerating);
  const streamingSvg = useAppStore((s) => s.streamingSvg);
  const isEditMode = useAppStore((s) => s.isEditMode);
  const isConnectMode = useAppStore((s) => s.isConnectMode);
  const navigate = useNavigate();

  // Zoom & Pan states
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });

  // Editor ref & selection state
  const editorRef = useRef<SvgEditorHandle>(null);
  const [selectedInfo, setSelectedInfo] = useState<SelectedElementInfo | null>(null);

  // Reset scale/position when SVG content changes
  useEffect(() => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  }, [currentSvg]);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;
    setIsDragging(true);
    dragStart.current = { x: e.clientX - position.x, y: e.clientY - position.y };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - dragStart.current.x,
      y: e.clientY - dragStart.current.y,
    });
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    setIsDragging(false);
    e.currentTarget.releasePointerCapture(e.pointerId);
  };

  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    e.preventDefault();
    const zoomFactor = 1.15;
    let newScale = scale;
    if (e.deltaY < 0) {
      newScale = Math.min(scale * zoomFactor, 10);
    } else {
      newScale = Math.max(scale / zoomFactor, 0.15);
    }

    const rect = e.currentTarget.getBoundingClientRect();
    const mouseX = e.clientX - rect.left - rect.width / 2;
    const mouseY = e.clientY - rect.top - rect.height / 2;

    setPosition({
      x: mouseX - (mouseX - position.x) * (newScale / scale),
      y: mouseY - (mouseY - position.y) * (newScale / scale),
    });
    setScale(newScale);
  };

  const handleZoomIn = () => {
    setScale((prev) => Math.min(prev * 1.2, 10));
  };

  const handleZoomOut = () => {
    setScale((prev) => Math.max(prev / 1.2, 0.15));
  };

  const handleReset = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  const handleEditorSvgChange = (svg: string) => {
    setCurrentSvg(svg);
  };

  const handleEditorSelect = (info: SelectedElementInfo | null) => {
    setSelectedInfo(info);
  };

  // 编辑过程中 silent 同步（只改 DOM），避免 SVG 重挂载导致输入框失焦
  const handlePropertyChange = (prop: EditableProperty, value: string) => {
    editorRef.current?.applyPropertyChange(prop, value, true);
  };

  // 面板失去焦点或关闭时，将修改提交回 store
  const handleCommit = () => {
    editorRef.current?.commitChanges();
  };

  const handlePanelClose = () => {
    editorRef.current?.commitChanges();
    setSelectedInfo(null);
    editorRef.current?.clearSelection();
  };

  // 未闭合的 SVG 直接交给浏览器 HTML 解析器容错渲染；不含 <svg> 时静默不显示
  const streamingPreview =
    isGenerating && streamingSvg && streamingSvg.includes('<svg') ? streamingSvg : null;

  if (isGenerating) {
    return (
      <div className="flex-1 flex flex-col min-h-0 bg-[var(--color-bg-secondary)] rounded-lg border border-[var(--color-border)]">
        <ProgressPanel />
        {streamingPreview && (
          <div className="relative flex-1 min-h-0 overflow-auto bg-white dark:bg-gray-900 border-t border-[var(--color-border)] p-4">
            <span className="absolute top-2 right-2 z-10 text-[10px] px-1.5 py-0.5 rounded bg-[var(--color-bg-tertiary)] text-[var(--color-text-tertiary)]">
              实时预览
            </span>
            <div
              className="w-full h-full flex items-center justify-center"
              dangerouslySetInnerHTML={{ __html: streamingPreview }}
            />
          </div>
        )}
        {!streamingPreview && <div className="flex-1" />}
      </div>
    );
  }

  if (currentSvg) {
    // 编辑模式
    if (isEditMode) {
      return (
        <div className="relative flex-1 bg-white dark:bg-gray-900 rounded-lg border border-[var(--color-border)] overflow-hidden">
          {/* 编辑模式提示 */}
          <div className="absolute top-3 left-3 z-10 flex items-center gap-2 px-2 py-1 rounded-md bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800 text-xs text-blue-700 dark:text-blue-300 select-none">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
            {isConnectMode
              ? '连线模式 — 从节点拖拽到另一个节点创建连线'
              : '编辑模式 — 点击选中，空白拖拽框选，双击文字编辑'}
          </div>
          <SvgEditor
            ref={editorRef}
            svgContent={currentSvg}
            onSvgChange={handleEditorSvgChange}
            onSelect={handleEditorSelect}
            isConnectMode={isEditMode && isConnectMode}
          />
          {/* 属性面板 */}
          <PropertyPanel
            info={selectedInfo}
            onPropertyChange={handlePropertyChange}
            onCommit={handleCommit}
            onClose={handlePanelClose}
          />
        </div>
      );
    }

    // 预览模式（原有逻辑）
    return (
      <div
        className="relative flex-1 bg-white dark:bg-gray-900 rounded-lg border border-[var(--color-border)] overflow-hidden select-none cursor-grab active:cursor-grabbing"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onWheel={handleWheel}
      >
        <div
          style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
            transformOrigin: 'center center',
            transition: isDragging ? 'none' : 'transform 0.15s ease-out',
          }}
          className="w-full h-full flex items-center justify-center [&_svg]:max-w-full [&_svg]:max-h-full [&_svg]:transition-none"
          dangerouslySetInnerHTML={{ __html: currentSvg }}
        />

        {/* Floating zoom controls */}
        <div
          onPointerDown={(e) => e.stopPropagation()}
          className="absolute bottom-4 right-4 z-10 flex items-center gap-1 p-1 rounded-lg bg-[var(--color-bg-secondary)] border border-[var(--color-border)] shadow-lg select-none"
        >
          <button
            onClick={handleZoomIn}
            className="flex items-center justify-center w-7 h-7 rounded hover:bg-[var(--color-bg-tertiary)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors cursor-pointer"
            title="放大"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={handleZoomOut}
            className="flex items-center justify-center w-7 h-7 rounded hover:bg-[var(--color-bg-tertiary)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors cursor-pointer"
            title="缩小"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <div className="h-4 w-[1px] bg-[var(--color-border)] mx-1" />
          <button
            onClick={handleReset}
            className="flex items-center justify-center px-1.5 h-7 text-[10px] font-medium rounded hover:bg-[var(--color-bg-tertiary)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors cursor-pointer"
            title="重置缩放"
          >
            {Math.round(scale * 100)}%
          </button>
          <button
            onClick={handleReset}
            className="flex items-center justify-center w-7 h-7 rounded hover:bg-[var(--color-bg-tertiary)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors cursor-pointer"
            title="自适应"
          >
            <Maximize className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex items-center justify-center bg-[var(--color-bg-secondary)] rounded-lg border border-[var(--color-border)]">
      <EmptyState
        icon={<ImageOff size={48} strokeWidth={1} />}
        title="选择图表类型并开始生成"
        actionLabel="浏览模板库"
        onAction={() => navigate('/templates')}
      />
    </div>
  );
}
