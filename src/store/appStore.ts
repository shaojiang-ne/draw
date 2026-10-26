import { create } from 'zustand';
import type {
  ChartCategory,
  StylePreset,
  Conversation,
  ConversationSummary,
  ConversationMessage,
  ChartVersion,
  StepProgress,
  UserSettings,
} from '../types';
import { DEFAULT_STYLE_ID, STORAGE_KEYS } from '../utils/constants';
import { manageStorage } from '../services/storage';

interface AppStore {
  // --- 分类与模板数据（静态，启动时加载） ---
  categories: ChartCategory[];
  stylePresets: StylePreset[];

  // --- 当前工作状态 ---
  currentConversation: Conversation | null;
  currentSvg: string | null;
  currentSteps: StepProgress[];
  isGenerating: boolean;
  generationProgress: number;
  streamingSvg: string | null;
  isEditMode: boolean;
  isConnectMode: boolean;
  lastUsage: { promptTokens: number; completionTokens: number; totalTokens: number } | null;
  chatDraft: string | null;
  error: string | null;

  // --- 选择状态 ---
  selectedCategoryId: string | null;
  selectedSubTypeId: string | null;
  selectedStyleId: string;
  selectedTemplateId: string | null;
  showTypeStyleSelector: boolean;

  // --- 历史记录 ---
  conversations: ConversationSummary[];

  // --- 设置 ---
  settings: UserSettings;

  // --- Actions: Selection ---
  setCategories: (categories: ChartCategory[]) => void;
  setStylePresets: (presets: StylePreset[]) => void;
  selectSubType: (categoryId: string, subTypeId: string) => void;
  selectStyle: (styleId: string) => void;
  selectTemplate: (templateId: string | null) => void;
  setShowTypeStyleSelector: (show: boolean) => void;
  confirmSelection: () => void;
  /** 不选风格/模板，直接用默认配置开始绘图 */
  startDirectly: (categoryId: string, subTypeId: string) => void;

  // --- Actions: Generation ---
  setCurrentSvg: (svg: string | null) => void;
  setCurrentSteps: (steps: StepProgress[]) => void;
  updateStep: (step: StepProgress) => void;
  setIsGenerating: (generating: boolean) => void;
  setGenerationProgress: (progress: number) => void;
  setStreamingSvg: (svg: string | null) => void;
  setEditMode: (mode: boolean) => void;
  setConnectMode: (mode: boolean) => void;
  setLastUsage: (usage: { promptTokens: number; completionTokens: number; totalTokens: number } | null) => void;
  setChatDraft: (draft: string | null) => void;
  setError: (error: string | null) => void;

  // --- Actions: Conversation ---
  setCurrentConversation: (conv: Conversation | null) => void;
  addMessage: (message: ConversationMessage) => void;
  addVersion: (version: ChartVersion) => void;
  updateVersionLabel: (versionId: string, label: string) => void;
  saveConversation: () => void;
  loadConversation: (id: string) => void;
  deleteConversation: (id: string) => void;
  loadConversations: () => void;

  // --- Actions: Settings ---
  updateSettings: (settings: Partial<UserSettings>) => void;
  loadSettings: () => void;
}

const defaultSettings: UserSettings = {
  defaultStyleId: DEFAULT_STYLE_ID,
  theme: 'light',
  language: 'zh-CN',
};

export const useAppStore = create<AppStore>((set, get) => ({
  categories: [],
  stylePresets: [],

  currentConversation: null,
  currentSvg: null,
  currentSteps: [],
  isGenerating: false,
  generationProgress: 0,
  streamingSvg: null,
  isEditMode: false,
  isConnectMode: false,
  lastUsage: null,
  chatDraft: null,
  error: null,

  selectedCategoryId: null,
  selectedSubTypeId: null,
  selectedStyleId: DEFAULT_STYLE_ID,
  selectedTemplateId: null,
  showTypeStyleSelector: false,

  conversations: [],

  settings: defaultSettings,

  // --- Selection Actions ---
  setCategories: (categories) => set({ categories }),
  setStylePresets: (presets) => set({ stylePresets: presets }),

  selectSubType: (categoryId, subTypeId) => set({
    selectedCategoryId: categoryId,
    selectedSubTypeId: subTypeId,
    showTypeStyleSelector: true,
  }),

  selectStyle: (styleId) => set({ selectedStyleId: styleId }),

  selectTemplate: (templateId) => set({ selectedTemplateId: templateId }),

  setShowTypeStyleSelector: (show) => set({ showTypeStyleSelector: show }),

  startDirectly: (categoryId, subTypeId) => {
    set({
      selectedCategoryId: categoryId,
      selectedSubTypeId: subTypeId,
      selectedTemplateId: null,
      showTypeStyleSelector: false,
    });
    get().confirmSelection();
  },

  confirmSelection: () => {
    const { selectedCategoryId, selectedSubTypeId, selectedStyleId, selectedTemplateId, categories } = get();
    const category = categories.find(c => c.id === selectedCategoryId);
    if (!category) return;

    const subType = category.subTypes.find(s => s.id === selectedSubTypeId);
    const template = subType?.templates.find(t => t.id === selectedTemplateId);

    const versions: ChartVersion[] = [];
    let initialSvg: string | null = null;
    let initialMessages: ConversationMessage[] = [];

    if (template) {
      initialSvg = template.previewSvg;
      const assistantMessageId = `msg-init-${Date.now()}`;
      initialMessages = [
        {
          id: `msg-user-init-${Date.now()}`,
          role: 'user',
          content: `基于模板“${template.name}”开始绘图`,
          timestamp: Date.now(),
        },
        {
          id: assistantMessageId,
          role: 'assistant',
          content: `已加载“${template.name}”模板。你可以通过输入指令来修改或优化它。`,
          timestamp: Date.now(),
          metadata: {
            svgContent: initialSvg,
            steps: [],
          },
        },
      ];

      versions.push({
        id: `ver-init-${Date.now()}`,
        messageId: assistantMessageId,
        svgContent: initialSvg,
        stepLog: [],
        createdAt: Date.now(),
        label: 'v1',
      });
    }

    const conversation: Conversation = {
      id: `conv-${Date.now()}`,
      title: template ? `基于模板: ${template.name}` : '',
      categoryId: selectedCategoryId!,
      subTypeId: selectedSubTypeId!,
      styleId: selectedStyleId,
      templateId: selectedTemplateId ?? undefined,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      messages: initialMessages,
      versions: versions,
    };

    set({
      currentConversation: conversation,
      currentSvg: initialSvg,
      currentSteps: [],
      showTypeStyleSelector: false,
      chatDraft: template ? template.exampleUserInput : null,
    });

    if (template) {
      get().saveConversation();
    }
  },

  // --- Generation Actions ---
  setCurrentSvg: (svg) => set({ currentSvg: svg }),
  setCurrentSteps: (steps) => set({ currentSteps: steps }),
  updateStep: (step) => set((state) => {
    const steps = [...state.currentSteps];
    const idx = steps.findIndex(s => s.index === step.index);
    if (idx >= 0) {
      steps[idx] = step;
    } else {
      steps.push(step);
    }
    return { currentSteps: steps };
  }),
  setIsGenerating: (generating) => set({ isGenerating: generating }),
  setGenerationProgress: (progress) => set({ generationProgress: progress }),
  setStreamingSvg: (svg) => set({ streamingSvg: svg }),
  setEditMode: (mode) => set({ isEditMode: mode }),
  setConnectMode: (mode) => set({ isConnectMode: mode }),
  setLastUsage: (usage) => set({ lastUsage: usage }),
  setChatDraft: (draft) => set({ chatDraft: draft }),
  setError: (error) => set({ error }),

  // --- Conversation Actions ---
  setCurrentConversation: (conv) => set({ currentConversation: conv }),

  addMessage: (message) => set((state) => {
    if (!state.currentConversation) return {};
    const conv = { ...state.currentConversation };
    conv.messages = [...conv.messages, message];
    conv.updatedAt = Date.now();
    if (message.role === 'user' && !conv.title) {
      conv.title = message.content.slice(0, 30);
    }
    return { currentConversation: conv };
  }),

  addVersion: (version) => set((state) => {
    if (!state.currentConversation) return {};
    const conv = { ...state.currentConversation };
    conv.versions = [...conv.versions, version];
    return { currentConversation: conv };
  }),

  updateVersionLabel: (versionId, label) => {
    const { currentConversation } = get();
    if (!currentConversation) return;
    const conv = { ...currentConversation };
    conv.versions = conv.versions.map(v => v.id === versionId ? { ...v, label } : v);
    set({ currentConversation: conv });
    get().saveConversation();
  },

  saveConversation: () => {
    const { currentConversation, conversations } = get();
    if (!currentConversation) return;

    // 写入前先清理历史数据，尽量避免超出 localStorage 配额
    try {
      manageStorage();
    } catch {
      // 清理失败（如数据损坏）不阻断保存流程
    }

    const key = `${STORAGE_KEYS.CONVERSATION_PREFIX}${currentConversation.id}`;

    const summary: ConversationSummary = {
      id: currentConversation.id,
      title: currentConversation.title,
      categoryId: currentConversation.categoryId,
      subTypeId: currentConversation.subTypeId,
      styleId: currentConversation.styleId,
      templateId: currentConversation.templateId,
      createdAt: currentConversation.createdAt,
      updatedAt: currentConversation.updatedAt,
      versionCount: currentConversation.versions.length,
      lastSvgPreview: currentConversation.versions.length > 0
        ? currentConversation.versions[currentConversation.versions.length - 1].svgContent.slice(0, 200)
        : '',
    };

    const existing = conversations.findIndex(c => c.id === currentConversation.id);
    const updated = [...conversations];
    if (existing >= 0) {
      updated[existing] = summary;
    } else {
      updated.push(summary);
    }

    try {
      localStorage.setItem(key, JSON.stringify(currentConversation));
      localStorage.setItem(STORAGE_KEYS.CONVERSATIONS, JSON.stringify(updated));
    } catch {
      // 超出配额等写入失败：状态保留在内存中，并给出用户可读提示
      set({ error: '本地存储空间不足，对话保存失败。请删除部分历史对话后重试。' });
      return;
    }
    set({ conversations: updated });
  },

  loadConversation: (id) => {
    const key = `${STORAGE_KEYS.CONVERSATION_PREFIX}${id}`;
    const data = localStorage.getItem(key);
    if (!data) return;
    let conv: Conversation;
    try {
      conv = JSON.parse(data);
    } catch {
      // 数据损坏，跳过加载，避免白屏
      return;
    }
    const lastVersion = conv.versions.length > 0 ? conv.versions[conv.versions.length - 1] : null;
    set({
      currentConversation: conv,
      currentSvg: lastVersion?.svgContent ?? null,
      selectedCategoryId: conv.categoryId,
      selectedSubTypeId: conv.subTypeId,
      selectedStyleId: conv.styleId,
      selectedTemplateId: conv.templateId ?? null,
    });
  },

  deleteConversation: (id) => {
    const key = `${STORAGE_KEYS.CONVERSATION_PREFIX}${id}`;
    localStorage.removeItem(key);
    const updated = get().conversations.filter(c => c.id !== id);
    localStorage.setItem(STORAGE_KEYS.CONVERSATIONS, JSON.stringify(updated));
    set({ conversations: updated });
    if (get().currentConversation?.id === id) {
      set({ currentConversation: null, currentSvg: null, currentSteps: [] });
    }
  },

  loadConversations: () => {
    const data = localStorage.getItem(STORAGE_KEYS.CONVERSATIONS);
    if (data) {
      try {
        set({ conversations: JSON.parse(data) });
      } catch {
        // 数据损坏，回退为空列表
        set({ conversations: [] });
      }
    }
  },

  // --- Settings Actions ---
  updateSettings: (newSettings) => set((state) => {
    const settings = { ...state.settings, ...newSettings };
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch {
      // 写入失败不阻断设置生效
    }
    if (newSettings.theme) {
      document.documentElement.classList.toggle('dark', newSettings.theme === 'dark');
    }
    return {
      settings,
      // 默认风格变更时同步当前选中的风格
      ...(newSettings.defaultStyleId ? { selectedStyleId: newSettings.defaultStyleId } : {}),
    };
  }),

  loadSettings: () => {
    const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (data) {
      try {
        const settings: UserSettings = JSON.parse(data);
        document.documentElement.classList.toggle('dark', settings.theme === 'dark');
        set({ settings, selectedStyleId: settings.defaultStyleId });
      } catch {
        // 数据损坏，保留默认设置
      }
    }
  },
}));
