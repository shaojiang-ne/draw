import { STORAGE_KEYS, STORAGE_LIMIT } from '../utils/constants';
import type { ConversationSummary } from '../types';

export function getStorageUsage(): number {
  let total = 0;
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith('draw-app-')) {
      total += (localStorage.getItem(key) || '').length * 2; // UTF-16 = 2 bytes per char
    }
  }
  return total;
}

export function manageStorage(): void {
  const used = getStorageUsage();
  if (used < STORAGE_LIMIT * 0.8) return;

  const data = localStorage.getItem(STORAGE_KEYS.CONVERSATIONS);
  if (!data) return;

  const convs: ConversationSummary[] = JSON.parse(data);
  const sorted = [...convs].sort((a, b) => a.updatedAt - b.updatedAt);

  while (getStorageUsage() > STORAGE_LIMIT * 0.6 && sorted.length) {
    const oldest = sorted.shift()!;
    localStorage.removeItem(`${STORAGE_KEYS.CONVERSATION_PREFIX}${oldest.id}`);
  }

  const remaining = convs.filter(c => sorted.some(s => s.id === c.id));
  localStorage.setItem(STORAGE_KEYS.CONVERSATIONS, JSON.stringify(remaining));
}

export function clearAllData(): void {
  const keysToRemove: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith('draw-app-')) {
      keysToRemove.push(key);
    }
  }
  keysToRemove.forEach(k => localStorage.removeItem(k));
}
