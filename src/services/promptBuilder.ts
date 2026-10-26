import type { ChartCategory, ChartSubType, StylePreset, Template, ConversationMessage, ExpertFlow } from '../types';
import { BASE_SYSTEM_PROMPT } from '../data/prompts/base-system';
import { OPTIMIZATION_PROMPT_APPEND } from '../data/prompts/optimization';
import { MAX_HISTORY_ROUNDS } from '../utils/constants';

interface BuildPromptParams {
  category: ChartCategory;
  subType: ChartSubType;
  style: StylePreset;
  template?: Template;
  isOptimization: boolean;
  historyMessages: ConversationMessage[];
  currentSvg?: string;
  userInput: string;
}

export function buildSystemPrompt(params: {
  category: ChartCategory;
  subType: ChartSubType;
  style: StylePreset;
  template?: Template;
  isOptimization: boolean;
}): string {
  const { category, subType, style, template, isOptimization } = params;
  const flow = subType.expertFlowOverride || category.expertFlow;

  const parts: string[] = [];

  // Layer 1: 通用基础指令
  parts.push(BASE_SYSTEM_PROMPT);

  // Layer 1 追加: 执行进度输出规范
  parts.push(buildStepFormatPrompt(flow));

  // Layer 2: 类型专家指令
  parts.push(category.systemPrompt);

  // Layer 2: 子类型追加
  if (subType.systemPromptAppend) {
    parts.push(subType.systemPromptAppend);
  }

  // Layer 3: 风格指令
  parts.push(`## 当前风格：${style.name}\n${style.stylePrompt}`);

  // Layer 3: 模板上下文
  if (template) {
    parts.push(template.systemPromptAppend);
  }

  // 优化模式追加
  if (isOptimization) {
    parts.push(OPTIMIZATION_PROMPT_APPEND);
  }

  return parts.join('\n\n');
}

function buildStepFormatPrompt(flow: ExpertFlow): string {
  // 最后一步为质量检查/自检步骤，安排在 SVG 输出之后执行
  const lastStep = flow.steps[flow.steps.length - 1];
  const preSteps = flow.steps.slice(0, -1);
  const total = flow.steps.length;

  const stepLines = preSteps
    .map(s => `第${s.index}步 ${s.title}：${s.description}`)
    .join('\n');

  const stepMarkers = preSteps
    .map(s => `[STEP:${s.index}/${total}:${s.title}]`)
    .join('\n');

  const checkFormat = flow.checkItems.map(c => c.label).join('、');

  return `## 执行进度输出规范
在生成 SVG 之前，按以下步骤顺序执行并输出进度：

${stepLines}

每步用标记输出：
${stepMarkers}

完成上述步骤后，输出 SVG：
[SVG_START]
<svg ...>...</svg>
[SVG_END]

SVG 输出完成后，执行最后一步「${lastStep.title}」（${lastStep.description}），输出标记：
[STEP:${lastStep.index}/${total}:${lastStep.title}]
然后逐项输出自检结果，格式为 [CHECK:检查项✓] 或 [CHECK:检查项✗→修正说明]，检查项：${checkFormat}

如果自检全部通过，直接结束输出，不要重复输出 SVG。
如果自检发现任何问题，必须修正后再次输出完整的修正版 SVG：
[SVG_START]
<修正后的完整 SVG>
[SVG_END]`;
}

export function buildMessages(params: BuildPromptParams): ConversationMessage[] {
  const { category, subType, style, template, isOptimization, historyMessages, currentSvg, userInput } = params;

  const messages: ConversationMessage[] = [];

  // System message
  messages.push({
    id: `sys-${Date.now()}`,
    role: 'system',
    content: buildSystemPrompt({ category, subType, style, template, isOptimization }),
    timestamp: Date.now(),
  });

  // History messages (trimmed)
  const nonSystemHistory = historyMessages.filter(m => m.role !== 'system');
  const recentHistory = nonSystemHistory.slice(-(MAX_HISTORY_ROUNDS * 2));

  for (const msg of recentHistory) {
    if (msg.role === 'assistant' && msg.metadata?.svgContent) {
      if (isOptimization) {
        // 优化模式：所有历史 SVG 用摘要替代，最新 SVG 在下方单独注入
        // 这样模型始终基于最新版本修改，而非旧版本
        messages.push({
          ...msg,
          content: `[当前图表为${category.name}，共${msg.metadata.svgContent.length}字符SVG代码]`,
        });
      } else {
        // 非优化模式：最后一条 assistant 包含完整 SVG，其余用摘要
        const isLastAssistant = nonSystemHistory.indexOf(msg) >= nonSystemHistory.length - 2;
        if (isLastAssistant) {
          messages.push({
            ...msg,
            content: `[当前图表 SVG 代码如下]\n${msg.metadata.svgContent}`,
          });
        } else {
          messages.push({
            ...msg,
            content: `[当前图表为${category.name}，共${msg.metadata.svgContent.length}字符SVG代码]`,
          });
        }
      }
    } else {
      messages.push(msg);
    }
  }

  // 优化模式下，始终在用户消息前注入最新 SVG
  // 确保模型看到的是 currentSvg（最新版本），而非历史中的旧版本
  if (isOptimization && currentSvg) {
    messages.push({
      id: `svg-ctx-${Date.now()}`,
      role: 'assistant',
      content: `[当前图表 SVG 代码如下，请在此基础上修改]\n${currentSvg}`,
      timestamp: Date.now(),
    });
  }

  // User input
  messages.push({
    id: `user-${Date.now()}`,
    role: 'user',
    content: userInput,
    timestamp: Date.now(),
  });

  return messages;
}
