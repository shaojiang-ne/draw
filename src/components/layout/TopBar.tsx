import { Link, useLocation } from 'react-router-dom';
import { Palette, BookOpen, Sun, Moon, Settings } from 'lucide-react';
import { useAppStore } from '../../store/appStore';

export default function TopBar() {
  const { settings, updateSettings } = useAppStore();
  const isDark = settings.theme === 'dark';
  const location = useLocation();

  const isTemplates = location.pathname === '/templates';
  const isSettings = location.pathname === '/settings';

  const handleThemeToggle = () => {
    updateSettings({ theme: isDark ? 'light' : 'dark' });
  };

  return (
    <div
      className="flex items-center justify-between h-12 w-full px-4 bg-[var(--color-bg-secondary)] border-b border-[var(--color-border)] shrink-0"
    >
      {/* Left: Logo（点击返回落地页，落地页在 SPA 之外，用原生链接） */}
      <a
        href="/"
        className="flex items-center gap-2 shrink-0 rounded-md px-1.5 py-1 -ml-1.5 hover:bg-[var(--color-bg-tertiary)] transition-colors"
        title="返回首页"
      >
        <Palette className="w-5 h-5 text-[var(--color-accent)]" />
        <span className="text-sm font-semibold text-[var(--color-text-primary)]">
          AI 绘图
        </span>
      </a>

      {/* Right: Actions */}
      <div className="flex items-center gap-3 shrink-0">
        <Link
          to={isTemplates ? "/" : "/templates"}
          className={`flex items-center justify-center w-8 h-8 rounded-md transition-colors ${
            isTemplates
              ? 'bg-[var(--color-bg-tertiary)] text-[var(--color-accent)] font-medium'
              : 'hover:bg-[var(--color-bg-tertiary)] text-[var(--color-text-secondary)]'
          }`}
          title={isTemplates ? "关闭模板库" : "模板库"}
        >
          <BookOpen className="w-4 h-4" />
        </Link>

        <button
          onClick={handleThemeToggle}
          className="flex items-center justify-center w-8 h-8 rounded-md hover:bg-[var(--color-bg-tertiary)] text-[var(--color-text-secondary)] transition-colors"
          title={isDark ? '切换亮色模式' : '切换暗色模式'}
        >
          {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        <Link
          to={isSettings ? "/" : "/settings"}
          className={`flex items-center justify-center w-8 h-8 rounded-md transition-colors ${
            isSettings
              ? 'bg-[var(--color-bg-tertiary)] text-[var(--color-accent)] font-medium'
              : 'hover:bg-[var(--color-bg-tertiary)] text-[var(--color-text-secondary)]'
          }`}
          title={isSettings ? "关闭设置" : "设置"}
        >
          <Settings className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
