import React, { useState } from 'react';
import { useAppStore } from '../../store/appStore';

export function VersionSlider() {
  const currentConversation = useAppStore((s) => s.currentConversation);
  const currentSvg = useAppStore((s) => s.currentSvg);
  const setCurrentSvg = useAppStore((s) => s.setCurrentSvg);
  const updateVersionLabel = useAppStore((s) => s.updateVersionLabel);

  const versions = currentConversation?.versions ?? [];

  if (versions.length <= 1) return null;

  const activeIndex = versions.findIndex((v) => v.svgContent === currentSvg);

  return (
    <div className="flex items-center gap-2 px-3 py-2 border-t border-[var(--color-border)] bg-[var(--color-bg-secondary)] overflow-x-auto">
      <span className="text-xs text-[var(--color-text-tertiary)] flex-shrink-0">版本</span>
      <div className="flex items-center gap-1.5">
        {versions.map((version, i) => (
          <VersionDot
            key={version.id}
            index={i}
            label={version.label}
            isActive={i === activeIndex}
            onClick={() => setCurrentSvg(version.svgContent)}
            onLabelChange={(newLabel) => updateVersionLabel(version.id, newLabel)}
          />
        ))}
      </div>
    </div>
  );
}

interface VersionDotProps {
  index: number;
  label?: string;
  isActive: boolean;
  onClick: () => void;
  onLabelChange: (label: string) => void;
}

function VersionDot({ index, label, isActive, onClick, onLabelChange }: VersionDotProps) {
  const [editing, setEditing] = useState(false);
  const [editValue, setEditValue] = useState(label ?? '');

  const handleDoubleClick = () => {
    setEditValue(label ?? '');
    setEditing(true);
  };

  const handleBlur = () => {
    setEditing(false);
    onLabelChange(editValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      setEditing(false);
      onLabelChange(editValue);
    }
  };

  return (
    <div className="flex flex-col items-center gap-0.5 flex-shrink-0">
      <button
        onClick={onClick}
        onDoubleClick={handleDoubleClick}
        className={`w-3 h-3 rounded-full transition-colors ${
          isActive
            ? 'bg-[var(--color-accent)] ring-2 ring-[var(--color-accent)] ring-offset-1 ring-offset-[var(--color-bg-secondary)]'
            : 'bg-[var(--color-text-tertiary)] hover:bg-[var(--color-text-secondary)]'
        }`}
        title={label ?? `版本 ${index + 1}`}
      />
      {editing ? (
        <input
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          autoFocus
          className="w-14 text-[10px] text-center border border-[var(--color-border)] rounded px-0.5 py-0 bg-[var(--color-bg)] text-[var(--color-text-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]"
        />
      ) : (
        <span className="text-[10px] text-[var(--color-text-tertiary)] max-w-[3rem] truncate">
          {label ?? `v${index + 1}`}
        </span>
      )}
    </div>
  );
}
