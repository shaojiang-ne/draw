import React, { useState } from 'react';
import { useAppStore } from '../../store/appStore';
import { useGeneration } from '../../hooks/useGeneration';
import { copyToClipboard, exportSvg, exportPng } from '../../services/export';
import { RefreshCw, Copy, Download, Image, Undo2, Redo2, Pencil, Check, Link2 } from 'lucide-react';

export function ActionBar() {
  const currentSvg = useAppStore((s) => s.currentSvg);
  const currentConversation = useAppStore((s) => s.currentConversation);
  const setCurrentSvg = useAppStore((s) => s.setCurrentSvg);
  const isEditMode = useAppStore((s) => s.isEditMode);
  const setEditMode = useAppStore((s) => s.setEditMode);
  const isConnectMode = useAppStore((s) => s.isConnectMode);
  const setConnectMode = useAppStore((s) => s.setConnectMode);
  const addVersion = useAppStore((s) => s.addVersion);
  const saveConversation = useAppStore((s) => s.saveConversation);
  const { regenerate, isGenerating } = useGeneration();
  const [copied, setCopied] = useState(false);
  const [downloadError, setDownloadError] = useState<string | null>(null);

  if (!currentSvg) return null;

  const versions = currentConversation?.versions ?? [];
  const currentVersionIndex = versions.findIndex((v) => v.svgContent === currentSvg);
  const canRegenerate =
    !isGenerating && (currentConversation?.messages.some((m) => m.role === 'user') ?? false);

  const handleCopy = async () => {
    const ok = await copyToClipboard(currentSvg);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownloadSvg = () => {
    exportSvg(currentSvg);
  };

  const handleDownloadPng = () => {
    setDownloadError(null);
    exportPng(currentSvg).catch((err) => {
      setDownloadError(err instanceof Error ? err.message : '导出 PNG 失败');
      setTimeout(() => setDownloadError(null), 3000);
    });
  };

  const handleUndo = () => {
    if (currentVersionIndex > 0) {
      setCurrentSvg(versions[currentVersionIndex - 1].svgContent);
    }
  };

  const handleRedo = () => {
    if (currentVersionIndex < versions.length - 1) {
      setCurrentSvg(versions[currentVersionIndex + 1].svgContent);
    }
  };

  const canUndo = currentVersionIndex > 0;
  const canRedo = currentVersionIndex < versions.length - 1;

  const handleToggleEditMode = () => {
    if (isEditMode) {
      // 退出编辑模式：保存修改后的 SVG 为新版本
      const version = {
        id: `ver-${Date.now()}`,
        messageId: `msg-edit-${Date.now()}`,
        svgContent: currentSvg,
        stepLog: [],
        createdAt: Date.now(),
        label: `v${(versions.length ?? 0) + 1}`,
      };
      addVersion(version);
      saveConversation();
      setConnectMode(false);
      setEditMode(false);
    } else {
      setEditMode(true);
    }
  };

  return (
    <div className="flex items-center gap-1 px-2 py-1.5 border-t border-[var(--color-border)] bg-[var(--color-bg-secondary)]">
      <ActionBarButton
        icon={isEditMode ? <Check size={15} /> : <Pencil size={15} />}
        label={isEditMode ? '完成编辑' : '编辑'}
        onClick={handleToggleEditMode}
        active={isEditMode}
      />
      {isEditMode && (
        <>
          <ActionBarButton
            icon={<Link2 size={15} />}
            label={isConnectMode ? '退出连线' : '连线'}
            onClick={() => setConnectMode(!isConnectMode)}
            active={isConnectMode}
          />
          <div className="w-px h-4 bg-[var(--color-border)] mx-1" />
        </>
      )}
      {!isEditMode && <div className="w-px h-4 bg-[var(--color-border)] mx-1" />}
      <ActionBarButton
        icon={<RefreshCw size={15} />}
        label="重新生成"
        onClick={() => regenerate()}
        disabled={!canRegenerate || isEditMode}
      />
      <div className="w-px h-4 bg-[var(--color-border)] mx-1" />
      <ActionBarButton
        icon={<Copy size={15} />}
        label={copied ? '已复制' : '复制代码'}
        onClick={handleCopy}
        disabled={isEditMode}
      />
      <ActionBarButton
        icon={<Download size={15} />}
        label="下载SVG"
        onClick={handleDownloadSvg}
        disabled={isEditMode}
      />
      <ActionBarButton
        icon={<Image size={15} />}
        label="下载PNG"
        onClick={handleDownloadPng}
        disabled={isEditMode}
      />
      {downloadError && (
        <span className="px-2 text-xs text-red-500">{downloadError}</span>
      )}
      <div className="w-px h-4 bg-[var(--color-border)] mx-1" />
      <ActionBarButton
        icon={<Undo2 size={15} />}
        label="撤销"
        onClick={handleUndo}
        disabled={!canUndo || isEditMode}
      />
      <ActionBarButton
        icon={<Redo2 size={15} />}
        label="重做"
        onClick={handleRedo}
        disabled={!canRedo || isEditMode}
      />
    </div>
  );
}

interface ActionBarButtonProps {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
  disabled?: boolean;
  active?: boolean;
}

function ActionBarButton({ icon, label, onClick, disabled, active }: ActionBarButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={label}
      className={`flex items-center gap-1 px-2 py-1 text-xs rounded transition-colors disabled:opacity-40 disabled:pointer-events-none ${
        active
          ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300'
          : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-tertiary)]'
      }`}
    >
      {icon}
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}
