export const API_CONFIG = {
  apiKey: import.meta.env.VITE_OPENAI_API_KEY || '',
  endpoint: import.meta.env.VITE_OPENAI_API_ENDPOINT || 'https://api.openai.com/v1',
  model: import.meta.env.VITE_OPENAI_MODEL || 'gpt-4o',
};

export const SVG_VIEWBOX = {
  width: 1200,
  height: 900,
} as const;

export const STORAGE_KEYS = {
  SETTINGS: 'draw-app-settings',
  CONVERSATIONS: 'draw-app-conversations',
  CONVERSATION_PREFIX: 'draw-app-conv-',
} as const;

export const STORAGE_LIMIT = 5 * 1024 * 1024; // 5MB

export const MAX_HISTORY_ROUNDS = 6; // 保留最近6轮对话

export const DEFAULT_STYLE_ID = 'minimal-blue';
