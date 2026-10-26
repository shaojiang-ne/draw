import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PanelLeftClose, PanelLeft, Trash2 } from 'lucide-react';
import { CategoryTree } from '../category/CategoryTree';
import { useAppStore } from '../../store/appStore';

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const conversations = useAppStore(s => s.conversations);
  const currentConversation = useAppStore(s => s.currentConversation);
  const loadConversation = useAppStore(s => s.loadConversation);
  const deleteConversation = useAppStore(s => s.deleteConversation);

  // Auto-collapse sidebar on screens < 768px
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    setCollapsed(mq.matches);

    const handler = (e: MediaQueryListEvent) => setCollapsed(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const sortedConversations = [...conversations].sort((a, b) => b.updatedAt - a.updatedAt);

  const formatTime = (ts: number) =>
    new Date(ts).toLocaleString('zh-CN', {
      month: 'numeric',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

  const handleDelete = (e: React.MouseEvent, id: string, title: string) => {
    e.stopPropagation();
    if (window.confirm(`确定删除对话「${title || '未命名对话'}」吗？`)) {
      deleteConversation(id);
    }
  };

  return (
    <div
      className={`flex flex-col h-full bg-[var(--color-bg-secondary)] border-r border-[var(--color-border)] shrink-0 transition-all duration-200 ${collapsed ? 'w-10' : 'w-48 md:w-60'}`}
    >
      {/* Toggle button */}
      <div className="flex items-center justify-end h-10 px-2 border-b border-[var(--color-border)] shrink-0">
        <button
          onClick={() => setCollapsed(c => !c)}
          className="flex items-center justify-center w-7 h-7 rounded-md hover:bg-[var(--color-bg-tertiary)] text-[var(--color-text-secondary)] transition-colors"
          title={collapsed ? '展开侧栏' : '收起侧栏'}
        >
          {collapsed ? <PanelLeft className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
        </button>
      </div>

      {/* Category tree */}
      {!collapsed && (
        <div className="flex-1 overflow-y-auto py-2">
          <CategoryTree />
        </div>
      )}

      {/* Conversation history */}
      {!collapsed && conversations.length > 0 && (
        <div className="shrink-0 max-h-[40%] flex flex-col border-t border-[var(--color-border)]">
          <div className="px-3 pt-2 pb-1 text-xs font-medium text-[var(--color-text-tertiary)] shrink-0">
            历史对话
          </div>
          <div className="overflow-y-auto pb-2">
            {sortedConversations.map(conv => {
              const isActive = currentConversation?.id === conv.id;
              return (
                <div
                  key={conv.id}
                  onClick={() => {
                    loadConversation(conv.id);
                    navigate('/');
                  }}
                  className={`group flex items-center gap-1 px-3 py-1.5 cursor-pointer transition-colors ${
                    isActive
                      ? 'bg-[var(--color-bg-tertiary)] text-[var(--color-accent)]'
                      : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-tertiary)]'
                  }`}
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-xs truncate">
                      {conv.title || '未命名对话'}
                    </p>
                    <p className="text-[10px] text-[var(--color-text-tertiary)]">
                      {formatTime(conv.updatedAt)}
                    </p>
                  </div>
                  <button
                    onClick={(e) => handleDelete(e, conv.id, conv.title)}
                    className="shrink-0 flex items-center justify-center w-6 h-6 rounded opacity-0 group-hover:opacity-100 hover:bg-[var(--color-bg)] text-[var(--color-text-tertiary)] hover:text-[var(--color-error)] transition-opacity"
                    title="删除对话"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
