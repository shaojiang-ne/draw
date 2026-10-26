import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store/appStore';
import { ThemeToggle } from './ThemeToggle';
import { getStorageUsage, clearAllData } from '../../services/storage';
import { STORAGE_LIMIT } from '../../utils/constants';
import { STYLE_PRESETS } from '../../data/styles';
import { Button } from '../common/Button';
import { Modal } from '../common/Modal';
import { Trash2, AlertTriangle, X } from 'lucide-react';

export function SettingsPage() {
  const navigate = useNavigate();
  const settings = useAppStore((s) => s.settings);
  const updateSettings = useAppStore((s) => s.updateSettings);
  const conversations = useAppStore((s) => s.conversations);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const storageUsed = getStorageUsage();
  const storagePercent = Math.min((storageUsed / STORAGE_LIMIT) * 100, 100);
  const storageUsedMB = (storageUsed / (1024 * 1024)).toFixed(2);
  const storageLimitMB = (STORAGE_LIMIT / (1024 * 1024)).toFixed(0);

  const handleClearData = () => {
    clearAllData();
    setShowClearConfirm(false);
    // Reload page to reset store state
    window.location.reload();
  };

  return (
    <div className="flex-1 overflow-y-auto px-6 py-6 max-w-2xl mx-auto w-full">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-[var(--color-text-primary)]">设置</h1>
        <button
          onClick={() => navigate('/')}
          className="flex items-center justify-center w-8 h-8 rounded-md hover:bg-[var(--color-bg-tertiary)] text-[var(--color-text-secondary)] transition-colors"
          title="关闭"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* 外观 */}
      <section className="mb-8">
        <h2 className="text-base font-medium text-[var(--color-text-primary)] mb-4 pb-2 border-b border-[var(--color-border)]">
          外观
        </h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[var(--color-text-primary)]">主题</p>
              <p className="text-xs text-[var(--color-text-tertiary)]">切换浅色/深色模式</p>
            </div>
            <ThemeToggle />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[var(--color-text-primary)]">默认风格</p>
              <p className="text-xs text-[var(--color-text-tertiary)]">新建图表时使用的默认风格</p>
            </div>
            <select
              value={settings.defaultStyleId}
              onChange={(e) => updateSettings({ defaultStyleId: e.target.value })}
              className="px-3 py-1.5 text-sm rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
            >
              {STYLE_PRESETS.map((preset) => (
                <option key={preset.id} value={preset.id}>
                  {preset.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* 存储 */}
      <section className="mb-8">
        <h2 className="text-base font-medium text-[var(--color-text-primary)] mb-4 pb-2 border-b border-[var(--color-border)]">
          存储
        </h2>
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-1">
              <p className="text-sm text-[var(--color-text-primary)]">存储使用量</p>
              <p className="text-xs text-[var(--color-text-tertiary)]">
                {storageUsedMB} MB / {storageLimitMB} MB
              </p>
            </div>
            <div className="w-full h-2 bg-[var(--color-bg-tertiary)] rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  storagePercent > 80
                    ? 'bg-[var(--color-error)]'
                    : storagePercent > 60
                    ? 'bg-[var(--color-warning)]'
                    : 'bg-[var(--color-accent)]'
                }`}
                style={{ width: `${storagePercent}%` }}
              />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[var(--color-text-primary)]">对话数量</p>
              <p className="text-xs text-[var(--color-text-tertiary)]">
                当前保存了 {conversations.length} 个对话
              </p>
            </div>
            <span className="text-sm text-[var(--color-text-secondary)]">
              {conversations.length} 个
            </span>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[var(--color-text-primary)]">清除所有数据</p>
              <p className="text-xs text-[var(--color-text-tertiary)]">
                删除所有对话和设置，此操作不可撤销
              </p>
            </div>
            <Button
              variant="danger"
              size="sm"
              icon={<Trash2 size={14} />}
              onClick={() => setShowClearConfirm(true)}
            >
              清除数据
            </Button>
          </div>
        </div>
      </section>

      {/* 关于 */}
      <section className="mb-8">
        <h2 className="text-base font-medium text-[var(--color-text-primary)] mb-4 pb-2 border-b border-[var(--color-border)]">
          关于
        </h2>
        <div className="space-y-2">
          <p className="text-sm text-[var(--color-text-primary)]">AI 智能绘图工作台 v1.0.0</p>
          <p className="text-xs text-[var(--color-text-tertiary)]">
            基于 OpenAI API + SVG 生成技术
          </p>
        </div>
      </section>

      {/* Clear confirmation modal */}
      <Modal
        open={showClearConfirm}
        onClose={() => setShowClearConfirm(false)}
        title="确认清除数据"
      >
        <div className="flex flex-col items-center py-4">
          <AlertTriangle size={48} className="text-[var(--color-warning)] mb-3" />
          <p className="text-sm text-[var(--color-text-primary)] mb-1">
            确定要清除所有数据吗？
          </p>
          <p className="text-xs text-[var(--color-text-tertiary)] mb-4">
            此操作将删除所有对话记录和设置，且不可撤销。
          </p>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => setShowClearConfirm(false)}>
              取消
            </Button>
            <Button variant="danger" onClick={handleClearData}>
              确认清除
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
