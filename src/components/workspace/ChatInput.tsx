import React, { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';
import { useAppStore } from '../../store/appStore';

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

const EXAMPLE_PROMPTS = [
  '帮我画一个系统架构图',
  '将流程图改为横向布局',
  '增加数据统计模块',
  '使用深色主题重新渲染',
];

export function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [value, setValue] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const chatDraft = useAppStore((s) => s.chatDraft);
  const setChatDraft = useAppStore((s) => s.setChatDraft);

  // 消费模板库写入的草稿：填入输入框后清空
  useEffect(() => {
    if (chatDraft != null) {
      setValue(chatDraft);
      setChatDraft(null);
      textareaRef.current?.focus();
    }
  }, [chatDraft, setChatDraft]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 150)}px`;
    }
  }, [value]);

  const handleSend = () => {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setValue('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="border-t border-[var(--color-border)] p-3">
      <div className="flex items-end gap-2">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          placeholder="描述你需要绘制的图表，或对当前图表的修改需求..."
          rows={1}
          className="flex-1 resize-none rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-tertiary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent disabled:opacity-50"
        />
        <button
          onClick={handleSend}
          disabled={disabled || !value.trim()}
          className="flex-shrink-0 p-2 rounded-lg bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-hover)] transition-colors disabled:opacity-50 disabled:pointer-events-none"
        >
          <Send size={18} />
        </button>
      </div>
      <div className="mt-2 flex flex-wrap gap-1.5 max-md:hidden">
        {EXAMPLE_PROMPTS.map((prompt, i) => (
          <button
            key={i}
            onClick={() => {
              if (disabled) return;
              onSend(prompt);
            }}
            disabled={disabled}
            className="text-xs px-2 py-1 rounded-full border border-[var(--color-border)] text-[var(--color-text-tertiary)] hover:text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-tertiary)] transition-colors disabled:opacity-50 disabled:pointer-events-none"
          >
            {prompt}
          </button>
        ))}
      </div>
    </div>
  );
}
