import { useEffect, useCallback, useState, useRef } from 'react';
import { useAppStore } from '../../store/appStore';
import { useGeneration } from '../../hooks/useGeneration';
import { ERROR_MESSAGES, type ApiErrorType } from '../../services/openai';
import { copyToClipboard, exportSvg } from '../../services/export';
import { ChartPreview } from './ChartPreview';
import { CodePanel } from './CodePanel';
import { ChatHistory } from './ChatHistory';
import { ChatInput } from './ChatInput';
import { ActionBar } from './ActionBar';
import { VersionSlider } from './VersionSlider';
import { WelcomeScreen } from './WelcomeScreen';
import { AlertTriangle, RefreshCw } from 'lucide-react';

function ErrorCard({
  error,
  onRetry,
  retryDisabled,
}: {
  error: ApiErrorType;
  onRetry: () => void;
  retryDisabled?: boolean;
}) {
  const info = ERROR_MESSAGES[error];
  return (
    <div className="mx-4 my-2 rounded-lg border border-red-300 dark:border-red-800 bg-red-50 dark:bg-red-950/30 p-4 animate-in fade-in slide-in-from-top-2 duration-300">
      <div className="flex items-start gap-3">
        <AlertTriangle className="shrink-0 text-red-500 dark:text-red-400" size={20} />
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-medium text-red-800 dark:text-red-300">{info.title}</h4>
          <p className="mt-1 text-xs text-red-600 dark:text-red-400">{info.description}</p>
          <p className="mt-1 text-xs text-red-500 dark:text-red-500">{info.action}</p>
        </div>
        <button
          onClick={onRetry}
          disabled={retryDisabled}
          className="shrink-0 flex items-center gap-1 px-2 py-1 text-xs rounded-md bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-900 transition-colors disabled:opacity-50 disabled:pointer-events-none"
        >
          <RefreshCw size={12} />
          重试
        </button>
      </div>
    </div>
  );
}

/** Minimum widths in pixels for the canvas (center) and chat (right) panels */
const MIN_CANVAS_PX = 360;
const MIN_CHAT_PX = 300;
const DEFAULT_CHAT_PX = 380;

export function Workspace() {
  const currentConversation = useAppStore((s) => s.currentConversation);
  const currentSvg = useAppStore((s) => s.currentSvg);
  const { generate, optimize, regenerate, isGenerating, error } = useGeneration();

  // Splitter state: width of the right chat panel in pixels
  const [chatWidth, setChatWidth] = useState(DEFAULT_CHAT_PX);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const handleSend = (message: string) => {
    if (!currentSvg) {
      generate(message);
    } else {
      optimize(message);
    }
  };

  const handleRetry = () => {
    regenerate();
  };

  // --- Splitter drag handlers ---
  const onSplitterPointerDown = useCallback((e: React.PointerEvent) => {
    e.preventDefault();
    isDragging.current = true;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  }, []);

  const onSplitterPointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDragging.current || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    // Right panel width = distance from cursor to container right edge
    const clamped = Math.max(MIN_CHAT_PX, Math.min(rect.width - MIN_CANVAS_PX, rect.right - e.clientX));
    setChatWidth(clamped);
  }, []);

  const onSplitterPointerUp = useCallback((e: React.PointerEvent) => {
    isDragging.current = false;
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
  }, []);

  // Keyboard shortcuts
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      // Ctrl+Shift+C → copy SVG code
      if (e.ctrlKey && e.shiftKey && e.key === 'C') {
        e.preventDefault();
        if (currentSvg) {
          copyToClipboard(currentSvg);
        }
      }
      // Ctrl+Shift+S → download SVG
      if (e.ctrlKey && e.shiftKey && e.key === 'S') {
        e.preventDefault();
        if (currentSvg) {
          exportSvg(currentSvg);
        }
      }
    },
    [currentSvg],
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  if (!currentConversation) {
    return <WelcomeScreen />;
  }

  return (
    <div ref={containerRef} className="flex-1 flex h-full overflow-hidden">
      {/* Center: Chart Preview + Version Slider + Action Bar */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <CodePanel />
        <ChartPreview />
        <VersionSlider />
        <ActionBar />
      </div>

      {/* Draggable vertical splitter */}
      <div
        className="workspace-splitter-v"
        onPointerDown={onSplitterPointerDown}
        onPointerMove={onSplitterPointerMove}
        onPointerUp={onSplitterPointerUp}
      >
        <div className="workspace-splitter-thumb" />
      </div>

      {/* Right: Chat History + Input */}
      <div
        className="flex flex-col min-h-0 overflow-hidden bg-[var(--color-bg)] shrink-0"
        style={{ width: `${chatWidth}px` }}
      >
        {/* Error display */}
        {error && <ErrorCard error={error} onRetry={handleRetry} retryDisabled={isGenerating} />}

        {/* Chat History + Input */}
        <div className="flex-1 flex flex-col min-h-0">
          <ChatHistory />
          <ChatInput onSend={handleSend} disabled={isGenerating} />
        </div>
      </div>
    </div>
  );
}

