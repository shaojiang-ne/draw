import { Sun, Moon } from 'lucide-react';
import { useAppStore } from '../../store/appStore';

export function ThemeToggle() {
  const theme = useAppStore((s) => s.settings.theme);
  const updateSettings = useAppStore((s) => s.updateSettings);

  const handleToggle = () => {
    updateSettings({ theme: theme === 'light' ? 'dark' : 'light' });
  };

  return (
    <button
      onClick={handleToggle}
      className="flex items-center gap-2 px-3 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] hover:bg-[var(--color-bg-tertiary)] transition-colors text-sm text-[var(--color-text-primary)]"
    >
      {theme === 'light' ? <Sun size={16} /> : <Moon size={16} />}
      <span>{theme === 'light' ? '浅色模式' : '深色模式'}</span>
    </button>
  );
}
