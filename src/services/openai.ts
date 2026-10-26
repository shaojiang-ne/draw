import type { ConversationMessage, StepProgress, CheckResult } from '../types';
import { API_CONFIG } from '../utils/constants';
import { extractSvg, SvgParseError } from './svgParser';

export type ApiErrorType =
  | 'no_api_key'
  | 'invalid_api_key'
  | 'quota_exceeded'
  | 'rate_limit'
  | 'model_not_found'
  | 'context_too_long'
  | 'network_error'
  | 'stream_interrupted'
  | 'svg_parse_error'
  | 'unknown';

export class ApiError extends Error {
  public readonly type: ApiErrorType;
  constructor(type: ApiErrorType, message: string) {
    super(message);
    this.name = 'ApiError';
    this.type = type;
  }
}

export function classifyError(error: any): ApiErrorType {
  if (!API_CONFIG.apiKey) return 'no_api_key';
  if (error.status === 401) return 'invalid_api_key';
  if (error.status === 429) return 'rate_limit';
  if (error.status === 404) return 'model_not_found';
  if (error.status === 400 && error.message?.includes('context_length')) return 'context_too_long';
  if (error.status === 402) return 'quota_exceeded';
  if (error.name === 'TypeError' && error.message?.includes('fetch')) return 'network_error';
  return 'unknown';
}

export const ERROR_MESSAGES: Record<ApiErrorType, { title: string; description: string; action: string }> = {
  no_api_key: { title: 'API Key 未配置', description: '请在项目根目录 .env 文件中配置 VITE_OPENAI_API_KEY', action: '配置后需重启开发服务器' },
  invalid_api_key: { title: 'API Key 无效', description: '请检查 .env 中的 Key 是否正确', action: '确认 Key 有效后重启服务器' },
  quota_exceeded: { title: 'API 额度用尽', description: '账户余额不足或已超出使用限制', action: '请检查账户余额' },
  rate_limit: { title: '请求频率超限', description: '短时间内请求过多', action: '等待 1 分钟后重试' },
  model_not_found: { title: '模型不存在', description: '指定的模型名称无效', action: '检查 .env 中的 VITE_OPENAI_MODEL' },
  context_too_long: { title: '上下文超长', description: '对话内容超出模型上下文长度限制', action: '开启新对话' },
  network_error: { title: '网络连接失败', description: '无法连接到 API 服务器', action: '检查网络连接' },
  stream_interrupted: { title: '生成中断', description: '网络连接已断开，已生成部分内容', action: '可复制已生成内容或重新生成' },
  svg_parse_error: { title: 'SVG 解析失败', description: '返回内容无法解析为有效的 SVG', action: '请重新生成' },
  unknown: { title: '未知错误', description: '发生了未预期的错误', action: '请重试或检查控制台日志' },
};

interface GenerateOptions {
  messages: ConversationMessage[];
  signal?: AbortSignal;
  onStepUpdate: (step: StepProgress) => void;
  onSvgChunk: (chunk: string) => void;
  /** 修正版 SVG 开始输出时调用，用于重置流式预览 */
  onSvgRestart?: () => void;
  onCheckUpdate: (check: CheckResult) => void;
  onComplete: (fullSvg: string, steps: StepProgress[], usage: { input: number; output: number }) => void;
  onError: (error: ApiError) => void;
}

export async function generateChart(options: GenerateOptions): Promise<void> {
  const { messages, signal, onStepUpdate, onSvgChunk, onSvgRestart, onCheckUpdate, onComplete, onError } = options;

  if (!API_CONFIG.apiKey) {
    onError(new ApiError('no_api_key', ERROR_MESSAGES.no_api_key.title));
    return;
  }

  try {
    // 本地开发（页面源为 localhost）一律走同源 /api 前缀，由 vite dev proxy
    // 转发到目标 API，避免浏览器 CORS；生产环境优先使用显式配置的
    // VITE_OPENAI_API_ENDPOINT，未配置时退回同源 /api 前缀
    const isLocalDev = ['localhost', '127.0.0.1'].includes(window.location.hostname);
    const envEndpoint = import.meta.env.VITE_OPENAI_API_ENDPOINT as string | undefined;
    const apiBase = isLocalDev ? '/api' : envEndpoint || '/api';
    const response = await fetch(`${apiBase}/chat/completions`, {
      method: 'POST',
      signal,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_CONFIG.apiKey}`,
      },
      body: JSON.stringify({
        model: API_CONFIG.model,
        messages: messages.map(m => ({ role: m.role, content: m.content })),
        stream: true,
        stream_options: { include_usage: true },
        temperature: 0.3,
        max_tokens: 8192,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const apiError = new ApiError(
        classifyError({ status: response.status, ...errorData }),
        errorData.error?.message || response.statusText
      );
      onError(apiError);
      return;
    }

    const reader = response.body!.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    let fullContent = '';
    let currentStep: StepProgress | null = null;
    let svgBuffer = '';
    let isSvgMode = false;
    let steps: StepProgress[] = [];
    let usage = { input: 0, output: 0 };
    // 已完整收到的 SVG（自检后如有修正版会被覆盖，最终以最后一个为准）
    let svgCandidate = '';
    // fullContent 中已扫描标记的位置（避免旧 [SVG_START]/[SVG_END] 被重复识别）
    let scanFrom = 0;
    // 当前正在流式接收的 SVG 在 fullContent 中的起始位置
    let svgContentFrom = 0;
    // 跨 chunk 标记解析缓冲：delta 先进入 textBuffer，只有完整标记才会被消费，
    // 避免 [STEP:...] / [CHECK:...] 被分片切开后丢失
    let textBuffer = '';

    const flushDetail = (text: string) => {
      if (text && currentStep) {
        currentStep.detail += text;
        onStepUpdate(currentStep);
      }
    };

    const handleStepMarker = (match: RegExpMatchArray) => {
      if (currentStep) {
        currentStep.status = 'done';
        steps.push(currentStep);
        onStepUpdate(currentStep);
      }
      currentStep = {
        index: parseInt(match[1]),
        total: parseInt(match[2]),
        title: match[3],
        detail: '',
        status: 'running',
      };
      onStepUpdate(currentStep);
    };

    const handleCheckMarker = (match: RegExpMatchArray) => {
      const checkResult: CheckResult = {
        itemId: match[1].trim(),
        label: match[1].trim(),
        passed: match[2] === '✓',
        fixNote: match[3]?.trim(),
      };
      // 自检结果只在这里追加一次，onCheckUpdate 仅用于通知外部
      if (currentStep) {
        currentStep.checkResults = [...(currentStep.checkResults || []), checkResult];
      }
      onCheckUpdate(checkResult);
    };

    // 收尾当前步骤；notify 时同步推送一次更新
    const finalizeCurrentStep = (notify: boolean) => {
      if (currentStep) {
        currentStep.status = 'done';
        steps.push(currentStep);
        if (notify) onStepUpdate(currentStep);
        currentStep = null;
      }
    };

    // 从 textBuffer 提取完整标记并消费；flushAll 时把残余文本全部计入 detail
    const processTextBuffer = (flushAll = false) => {
      const stepRe = /\[STEP:(\d+)\/(\d+):(.+?)\]/;
      const checkRe = /\[CHECK:(.+?)(✓|✗)(?:→(.+?))?\]/;
      while (true) {
        const stepMatch = textBuffer.match(stepRe);
        const checkMatch = textBuffer.match(checkRe);
        if (!stepMatch && !checkMatch) break;
        const takeStep = !!stepMatch && (!checkMatch || stepMatch.index! <= checkMatch.index!);
        const match = (takeStep ? stepMatch : checkMatch)!;
        flushDetail(textBuffer.slice(0, match.index!));
        textBuffer = textBuffer.slice(match.index! + match[0].length);
        if (takeStep) handleStepMarker(match);
        else handleCheckMarker(match);
      }
      if (flushAll) {
        flushDetail(textBuffer);
        textBuffer = '';
        return;
      }
      // 末尾若有未闭合的 '['，可能是被分片切开的标记，留在 buffer 等下一片
      const lastOpen = textBuffer.lastIndexOf('[');
      const lastClose = textBuffer.lastIndexOf(']');
      if (lastOpen > lastClose) {
        flushDetail(textBuffer.slice(0, lastOpen));
        textBuffer = textBuffer.slice(lastOpen);
      } else {
        flushDetail(textBuffer);
        textBuffer = '';
      }
    };

    while (true) {
      if (signal?.aborted) {
        try { await reader.cancel(); } catch { /* ignore */ }
        return;
      }
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        if (!line.startsWith('data: ') || line === 'data: [DONE]') continue;

        try {
          const data = JSON.parse(line.slice(6));
          const delta = data.choices?.[0]?.delta?.content || '';
          fullContent += delta;

          if (data.usage) {
            usage = { input: data.usage.prompt_tokens || 0, output: data.usage.completion_tokens || 0 };
          }

          // Parse SVG boundaries（基于 fullContent + scanFrom 判断，天然免疫分片）
          if (!isSvgMode) {
            const startIdx = fullContent.indexOf('[SVG_START]', scanFrom);
            if (startIdx !== -1) {
              isSvgMode = true;
              // textBuffer 里可能残留被切开的 "[SVG_ST..." 片段，先剥掉再 flush
              for (let i = Math.min(textBuffer.length, '[SVG_START]'.length - 1); i > 0; i--) {
                if ('[SVG_START]'.startsWith(textBuffer.slice(-i))) {
                  textBuffer = textBuffer.slice(0, -i);
                  break;
                }
              }
              processTextBuffer(true);
              // 自检后发现问题的修正版 SVG：重置流式预览，以新内容为准
              if (svgCandidate) onSvgRestart?.();
              svgContentFrom = startIdx + '[SVG_START]'.length;
              scanFrom = svgContentFrom;
              svgBuffer = fullContent.slice(svgContentFrom);
              if (svgBuffer.trim()) {
                onSvgChunk(svgBuffer);
              }
              continue;
            }
          }
          if (isSvgMode) {
            const endIdx = fullContent.indexOf('[SVG_END]', svgContentFrom);
            if (endIdx !== -1) {
              // SVG 完整收讫：暂存为候选，不结束——后续还有自检验证步骤，
              // 以及自检未通过时的修正版 SVG
              svgBuffer = fullContent.slice(svgContentFrom, endIdx);
              svgCandidate = svgBuffer;
              scanFrom = endIdx + '[SVG_END]'.length;
              isSvgMode = false;
              finalizeCurrentStep(true);
              // SVG 之后的文本（自检步骤标记）进入文本通道解析
              textBuffer += fullContent.slice(scanFrom);
              processTextBuffer();
              continue;
            }
          }

          // Content dispatch
          if (isSvgMode) {
            svgBuffer += delta;
            onSvgChunk(delta);
          } else {
            textBuffer += delta;
            processTextBuffer();
          }
        } catch {
          // Skip malformed JSON chunks
        }
      }
    }

    if (signal?.aborted) {
      try { await reader.cancel(); } catch { /* ignore */ }
      return;
    }

    // Stream ended — 优先使用已完整收到的候选 SVG（自检修正后取最后一版）
    processTextBuffer(true);
    finalizeCurrentStep(false);
    if (svgCandidate) {
      try {
        const svg = extractSvg(svgCandidate);
        onComplete(svg, steps, usage);
      } catch (e) {
        if (e instanceof SvgParseError) {
          onError(new ApiError('svg_parse_error', ERROR_MESSAGES.svg_parse_error.title));
        } else {
          onError(new ApiError('stream_interrupted', ERROR_MESSAGES.stream_interrupted.title));
        }
      }
      return;
    }
    // 兜底：流在 SVG 闭合前中断，尝试从全部内容中提取
    try {
      const svg = extractSvg(fullContent);
      onComplete(svg, steps, usage);
    } catch {
      onError(new ApiError('stream_interrupted', ERROR_MESSAGES.stream_interrupted.title));
    }
  } catch (error: any) {
    // 用户主动取消不算错误，静默结束（取消的 UI 处理在调用方完成）
    if (error?.name === 'AbortError' || signal?.aborted) return;
    onError(new ApiError(classifyError(error), error.message || 'Unknown error'));
  }
}
