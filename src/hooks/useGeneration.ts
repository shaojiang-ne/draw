import { useCallback, useRef, useState } from 'react';
import { useAppStore } from '../store/appStore';
import { generateChart, ApiError, ERROR_MESSAGES, type ApiErrorType } from '../services/openai';
import { buildMessages } from '../services/promptBuilder';
import type { StepProgress, ConversationMessage, ChartVersion } from '../types';

interface RunOptions {
  /** 跳过添加用户消息（regenerate 复用最后一条用户消息时使用） */
  skipUserMessage?: boolean;
}

// 模块级保存当前生成的 AbortController，供 cancel() 中断流式请求
let activeController: AbortController | null = null;

export function useGeneration() {
  const store = useAppStore();
  const [error, setError] = useState<ApiErrorType | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const startTimeRef = useRef<number>(0);

  const generate = useCallback(async (userInput: string, options?: RunOptions) => {
    if (!store.currentConversation || store.isGenerating) return;

    setError(null);
    setErrorMessage(null);
    store.setIsGenerating(true);
    store.setCurrentSteps([]);
    store.setGenerationProgress(0);
    store.setStreamingSvg(null);
    startTimeRef.current = Date.now();

    // Add user message
    if (!options?.skipUserMessage) {
      const userMessage: ConversationMessage = {
        id: `msg-${Date.now()}`,
        role: 'user',
        content: userInput,
        timestamp: Date.now(),
      };
      store.addMessage(userMessage);
    }

    // Build messages for API
    const category = store.categories.find(c => c.id === store.currentConversation?.categoryId);
    const subType = category?.subTypes.find(s => s.id === store.currentConversation?.subTypeId);
    const style = store.stylePresets.find(s => s.id === store.currentConversation?.styleId);
    const template = subType?.templates.find(t => t.id === store.currentConversation?.templateId);

    if (!category || !subType || !style) {
      store.setIsGenerating(false);
      setError('unknown');
      setErrorMessage('未找到所选分类/风格配置，请重新选择');
      return;
    }

    const messages = buildMessages({
      category,
      subType,
      style,
      template,
      isOptimization: false,
      historyMessages: store.currentConversation?.messages || [],
      userInput,
    });

    const controller = new AbortController();
    activeController = controller;
    let svgPreview = '';

    const handleFailure = (apiError: ApiError) => {
      if (activeController === controller) activeController = null;
      store.setIsGenerating(false);
      store.setStreamingSvg(null);
      setError(apiError.type);
      const readable = ERROR_MESSAGES[apiError.type]?.title || apiError.message;
      setErrorMessage(readable);
      // 失败留痕：写入对话并落盘，刷新后仍可见
      store.addMessage({
        id: `msg-${Date.now()}`,
        role: 'assistant',
        content: `生成失败：${readable}`,
        timestamp: Date.now(),
      });
      store.saveConversation();
    };

    await generateChart({
      messages,
      signal: controller.signal,
      onStepUpdate: (step: StepProgress) => {
        store.updateStep(step);
        const progress = Math.round((step.index / step.total) * 100);
        store.setGenerationProgress(progress);
      },
      onSvgChunk: (chunk: string) => {
        // 流式 SVG 预览：累积已收到的片段写入 store
        svgPreview += chunk;
        store.setStreamingSvg(svgPreview);
      },
      onSvgRestart: () => {
        // 自检后输出修正版 SVG：清空预览累积，改为展示修正版
        svgPreview = '';
        store.setStreamingSvg(null);
      },
      onCheckUpdate: () => {
        // openai.ts 已把结果并入 currentStep.checkResults，这里只触发 store 更新
        const steps = store.currentSteps;
        const lastStep = steps[steps.length - 1];
        if (lastStep) {
          store.updateStep(lastStep);
        }
      },
      onComplete: (svg: string, steps: StepProgress[], usage: { input: number; output: number }) => {
        if (activeController === controller) activeController = null;
        store.setCurrentSvg(svg);
        store.setStreamingSvg(null);
        store.setGenerationProgress(100);
        store.setIsGenerating(false);
        store.setLastUsage({
          promptTokens: usage.input,
          completionTokens: usage.output,
          totalTokens: usage.input + usage.output,
        });

        // Add assistant message
        const assistantMessage: ConversationMessage = {
          id: `msg-${Date.now()}`,
          role: 'assistant',
          content: '图表已生成',
          timestamp: Date.now(),
          metadata: {
            svgContent: svg,
            steps,
            tokenUsage: usage,
          },
        };
        store.addMessage(assistantMessage);

        // Add version
        const version: ChartVersion = {
          id: `ver-${Date.now()}`,
          messageId: assistantMessage.id,
          svgContent: svg,
          stepLog: steps,
          createdAt: Date.now(),
          label: `v${(store.currentConversation?.versions.length ?? 0) + 1}`,
        };
        store.addVersion(version);
        store.saveConversation();
      },
      onError: handleFailure,
    });
  }, [store]);

  const optimize = useCallback(async (userInput: string, options?: RunOptions) => {
    if (!store.currentConversation || !store.currentSvg || store.isGenerating) return;

    setError(null);
    setErrorMessage(null);
    store.setIsGenerating(true);
    store.setCurrentSteps([]);
    store.setGenerationProgress(0);
    store.setStreamingSvg(null);
    startTimeRef.current = Date.now();

    // Add user message
    if (!options?.skipUserMessage) {
      const userMessage: ConversationMessage = {
        id: `msg-${Date.now()}`,
        role: 'user',
        content: userInput,
        timestamp: Date.now(),
      };
      store.addMessage(userMessage);
    }

    const category = store.categories.find(c => c.id === store.currentConversation?.categoryId);
    const subType = category?.subTypes.find(s => s.id === store.currentConversation?.subTypeId);
    const style = store.stylePresets.find(s => s.id === store.currentConversation?.styleId);
    const template = subType?.templates.find(t => t.id === store.currentConversation?.templateId);

    if (!category || !subType || !style) {
      store.setIsGenerating(false);
      setError('unknown');
      setErrorMessage('未找到所选分类/风格配置，请重新选择');
      return;
    }

    const messages = buildMessages({
      category,
      subType,
      style,
      template,
      isOptimization: true,
      historyMessages: store.currentConversation?.messages || [],
      currentSvg: store.currentSvg,
      userInput,
    });

    const controller = new AbortController();
    activeController = controller;
    let svgPreview = '';

    const handleFailure = (apiError: ApiError) => {
      if (activeController === controller) activeController = null;
      store.setIsGenerating(false);
      store.setStreamingSvg(null);
      setError(apiError.type);
      const readable = ERROR_MESSAGES[apiError.type]?.title || apiError.message;
      setErrorMessage(readable);
      // 失败留痕：写入对话并落盘，刷新后仍可见
      store.addMessage({
        id: `msg-${Date.now()}`,
        role: 'assistant',
        content: `优化失败：${readable}`,
        timestamp: Date.now(),
      });
      store.saveConversation();
    };

    await generateChart({
      messages,
      signal: controller.signal,
      onStepUpdate: (step: StepProgress) => {
        store.updateStep(step);
        const progress = Math.round((step.index / step.total) * 100);
        store.setGenerationProgress(progress);
      },
      onSvgChunk: (chunk: string) => {
        svgPreview += chunk;
        store.setStreamingSvg(svgPreview);
      },
      onSvgRestart: () => {
        // 自检后输出修正版 SVG：清空预览累积，改为展示修正版
        svgPreview = '';
        store.setStreamingSvg(null);
      },
      onCheckUpdate: () => {
        const steps = store.currentSteps;
        const lastStep = steps[steps.length - 1];
        if (lastStep) {
          store.updateStep(lastStep);
        }
      },
      onComplete: (svg: string, steps: StepProgress[], usage: { input: number; output: number }) => {
        if (activeController === controller) activeController = null;
        store.setCurrentSvg(svg);
        store.setStreamingSvg(null);
        store.setGenerationProgress(100);
        store.setIsGenerating(false);
        store.setLastUsage({
          promptTokens: usage.input,
          completionTokens: usage.output,
          totalTokens: usage.input + usage.output,
        });

        const assistantMessage: ConversationMessage = {
          id: `msg-${Date.now()}`,
          role: 'assistant',
          content: '图表已优化',
          timestamp: Date.now(),
          metadata: {
            svgContent: svg,
            steps,
            tokenUsage: usage,
          },
        };
        store.addMessage(assistantMessage);

        const version: ChartVersion = {
          id: `ver-${Date.now()}`,
          messageId: assistantMessage.id,
          svgContent: svg,
          stepLog: steps,
          createdAt: Date.now(),
          label: `v${(store.currentConversation?.versions.length ?? 0) + 1}`,
        };
        store.addVersion(version);
        store.saveConversation();
      },
      onError: handleFailure,
    });
  }, [store]);

  const regenerate = useCallback(async () => {
    if (!store.currentConversation || store.isGenerating) return;
    const lastUserMsg = [...store.currentConversation.messages].reverse().find(m => m.role === 'user');
    if (lastUserMsg) {
      // 复用最后一条用户消息，不再重复添加
      await generate(lastUserMsg.content, { skipUserMessage: true });
    }
  }, [generate, store]);

  const cancel = useCallback(() => {
    if (!store.isGenerating) return;
    activeController?.abort();
    activeController = null;
    store.setIsGenerating(false);
    store.setStreamingSvg(null);
    store.addMessage({
      id: `msg-${Date.now()}`,
      role: 'assistant',
      content: '已取消生成',
      timestamp: Date.now(),
    });
    store.saveConversation();
  }, [store]);

  return {
    generate,
    optimize,
    regenerate,
    cancel,
    isGenerating: store.isGenerating,
    progress: store.generationProgress,
    error,
    errorMessage,
  };
}
