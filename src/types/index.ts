// ===== 分类体系 =====
export interface ChartCategory {
  id: string;
  name: string;
  icon: string;
  order: number;
  expertRole: string;
  systemPrompt: string;
  expertFlow: ExpertFlow;
  subTypes: ChartSubType[];
}

export interface ChartSubType {
  id: string;
  name: string;
  description: string;
  categoryId: string;
  systemPromptAppend: string;
  expertFlowOverride?: ExpertFlow;
  templates: Template[];
}

export interface ExpertFlow {
  steps: ExpertStep[];
  checkItems: CheckItem[];
}

export interface ExpertStep {
  index: number;
  title: string;
  description: string;
}

export interface CheckItem {
  id: string;
  label: string;
  description: string;
}

// ===== 模板 =====
export interface Template {
  id: string;
  name: string;
  subTypeId: string;
  description: string;
  industryTags: string[];
  previewSvg: string;
  systemPromptAppend: string;
  exampleUserInput: string;
}

// ===== 风格 =====
export interface StylePreset {
  id: string;
  name: string;
  description: string;
  previewSvg: string;
  stylePrompt: string;
  colors: StyleColors;
}

export interface StyleColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
  border: string;
}

// ===== 对话与生成 =====
export interface Conversation {
  id: string;
  title: string;
  categoryId: string;
  subTypeId: string;
  styleId: string;
  templateId?: string;
  createdAt: number;
  updatedAt: number;
  messages: ConversationMessage[];
  versions: ChartVersion[];
}

export interface ConversationMessage {
  id: string;
  role: 'system' | 'user' | 'assistant';
  content: string;
  timestamp: number;
  metadata?: {
    svgContent?: string;
    steps?: StepProgress[];
    tokenUsage?: { input: number; output: number };
  };
}

export interface ChartVersion {
  id: string;
  messageId: string;
  svgContent: string;
  stepLog: StepProgress[];
  createdAt: number;
  label?: string;
}

export interface StepProgress {
  index: number;
  total: number;
  title: string;
  detail: string;
  status: 'running' | 'done' | 'checking';
  checkResults?: CheckResult[];
}

export interface CheckResult {
  itemId: string;
  label: string;
  passed: boolean;
  fixNote?: string;
}

// ===== 用户设置 =====
export interface UserSettings {
  defaultStyleId: string;
  theme: 'light' | 'dark';
  language: 'zh-CN';
}

// ===== 对话摘要 =====
export interface ConversationSummary {
  id: string;
  title: string;
  categoryId: string;
  subTypeId: string;
  styleId: string;
  templateId?: string;
  createdAt: number;
  updatedAt: number;
  versionCount: number;
  lastSvgPreview: string;
}
