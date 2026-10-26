export class SvgParseError extends Error {
  public readonly rawContent: string;
  constructor(raw: string) {
    super('无法从返回内容中解析出 SVG 代码');
    this.name = 'SvgParseError';
    this.rawContent = raw;
  }
}

export function extractSvg(raw: string): string {
  // 情况1：包含 [SVG_START]...[SVG_END] 标记
  const marked = raw.match(/\[SVG_START\]\s*([\s\S]*?)\s*\[SVG_END\]/);
  if (marked) return cleanSvg(marked[1]);

  // 情况2：包含 ```svg ... ``` 代码块
  const codeBlock = raw.match(/```svg\s*([\s\S]*?)```/);
  if (codeBlock) return cleanSvg(codeBlock[1]);

  // 情况3：直接包含 <svg>...</svg>
  const direct = raw.match(/<svg[\s\S]*<\/svg>/);
  if (direct) return cleanSvg(direct[0]);

  throw new SvgParseError(raw);
}

function cleanSvg(svg: string): string {
  let cleaned = svg.trim();

  // 确保 viewBox 存在
  if (!cleaned.includes('viewBox')) {
    cleaned = cleaned.replace('<svg', '<svg viewBox="0 0 1200 900"');
  }

  // 确保 xmlns 存在
  if (!cleaned.includes('xmlns')) {
    cleaned = cleaned.replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"');
  }

  // 移除可能的 markdown 残留
  cleaned = cleaned.replace(/^```\w*\s*/gm, '');

  return cleaned;
}
