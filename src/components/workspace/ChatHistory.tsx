import { useEffect, useRef } from 'react';
import { User, Bot } from 'lucide-react';
import { useAppStore } from '../../store/appStore';
import type { ConversationMessage, ChartVersion } from '../../types';

export function ChatHistory() {
  const currentConversation = useAppStore((s) => s.currentConversation);
  const containerRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const nearBottomRef = useRef(true);

  const messages = currentConversation?.messages ?? [];
  const versions = currentConversation?.versions ?? [];

  // 仅当用户原本就在底部附近时才自动滚动，上翻浏览时不拽回
  useEffect(() => {
    if (nearBottomRef.current) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages.length]);

  const handleScroll = () => {
    const el = containerRef.current;
    if (!el) return;
    nearBottomRef.current = el.scrollHeight - el.scrollTop - el.clientHeight < 80;
  };

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center text-sm text-[var(--color-text-tertiary)]">
        开始对话以生成图表
      </div>
    );
  }

  return (
    <div ref={containerRef} onScroll={handleScroll} className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
      {messages.map((msg) => (
        <div key={msg.id} className="flex gap-2">
          {msg.role === 'user' ? (
            <UserMessage message={msg} />
          ) : (
            <AssistantMessage message={msg} versions={versions} />
          )}
        </div>
      ))}
      <div ref={bottomRef} />
    </div>
  );
}

function UserMessage({ message }: { message: ConversationMessage }) {
  return (
    <div className="flex gap-2 w-full">
      <div className="flex-shrink-0 w-7 h-7 rounded-full bg-[var(--color-bg-tertiary)] flex items-center justify-center text-[var(--color-text-secondary)]">
        <User size={15} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-xs text-[var(--color-text-tertiary)] mb-0.5">用户</div>
        <div className="text-sm text-[var(--color-text-primary)] whitespace-pre-wrap break-words">
          {message.content}
        </div>
      </div>
    </div>
  );
}

function AssistantMessage({
  message,
  versions,
}: {
  message: ConversationMessage;
  versions: ChartVersion[];
}) {
  const versionIndex = versions.findIndex((v) => v.messageId === message.id);
  const version = versionIndex >= 0 ? versions[versionIndex] : null;
  const timeStr = new Date(message.timestamp).toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="flex gap-2 w-full">
      <div className="flex-shrink-0 w-7 h-7 rounded-full bg-[var(--color-bg-tertiary)] flex items-center justify-center text-[var(--color-text-secondary)]">
        <Bot size={15} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 text-xs text-[var(--color-text-tertiary)] mb-0.5">
          <span>助手</span>
          {version && (
            <>
              <span>v{versionIndex + 1}</span>
              <span>{version.stepLog.length} 步</span>
            </>
          )}
          <span>{timeStr}</span>
        </div>
        <div className="text-sm text-[var(--color-text-primary)] whitespace-pre-wrap break-words">
          {message.content}
        </div>
      </div>
    </div>
  );
}
