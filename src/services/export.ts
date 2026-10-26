import { SVG_VIEWBOX } from '../utils/constants';

/**
 * 清洗模型生成的 SVG：LLM 输出常有重复属性、未闭合标签等问题，
 * 浏览器内联渲染（HTML 解析）能容错，但作为 XML 文件下载或经 <img> 加载会失败。
 * 用 HTML 解析器宽松解析（重复属性保留第一个、自动闭合标签），再序列化为合法 XML。
 */
export function sanitizeSvg(svgContent: string): string {
  try {
    const doc = new DOMParser().parseFromString(svgContent, 'text/html');
    const svgEl = doc.querySelector('svg');
    if (!svgEl) return svgContent;
    return new XMLSerializer().serializeToString(svgEl);
  } catch {
    return svgContent;
  }
}

export function exportSvg(svgContent: string, filename?: string): void {
  const blob = new Blob([sanitizeSvg(svgContent)], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename || `chart-${Date.now()}.svg`;
  a.click();
  URL.revokeObjectURL(url);
}

export function exportPng(svgContent: string, filename?: string, scale: number = 2): Promise<void> {
  return new Promise((resolve, reject) => {
    // 先清洗，避免非法 XML（重复属性、未闭合标签）导致 <img> 加载失败
    const cleanSvg = sanitizeSvg(svgContent);
    // 从 SVG 的 viewBox / width / height 读取真实尺寸，读取失败回退到默认尺寸
    let width: number = SVG_VIEWBOX.width;
    let height: number = SVG_VIEWBOX.height;
    const viewBoxMatch = cleanSvg.match(/viewBox=["']\s*[-\d.]+[\s,]+[-\d.]+[\s,]+([\d.]+)[\s,]+([\d.]+)\s*["']/);
    if (viewBoxMatch) {
      width = parseFloat(viewBoxMatch[1]);
      height = parseFloat(viewBoxMatch[2]);
    } else {
      const widthMatch = cleanSvg.match(/<svg[^>]*\bwidth=["']([\d.]+)/);
      const heightMatch = cleanSvg.match(/<svg[^>]*\bheight=["']([\d.]+)/);
      if (widthMatch && heightMatch) {
        width = parseFloat(widthMatch[1]);
        height = parseFloat(heightMatch[1]);
      }
    }
    if (!Number.isFinite(width) || !Number.isFinite(height) || width <= 0 || height <= 0) {
      reject(new Error('无法解析 SVG 尺寸，导出 PNG 失败'));
      return;
    }

    const img = new Image();
    const blob = new Blob([cleanSvg], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);

    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = width * scale;
      canvas.height = height * scale;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        URL.revokeObjectURL(url);
        reject(new Error('无法创建画布上下文，导出 PNG 失败'));
        return;
      }
      // 先填充白色背景，避免透明底导出后发黑
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.scale(scale, scale);
      ctx.drawImage(img, 0, 0, width, height);
      URL.revokeObjectURL(url);

      canvas.toBlob((pngBlob) => {
        if (!pngBlob) {
          reject(new Error('PNG 编码失败，请重试'));
          return;
        }
        const pngUrl = URL.createObjectURL(pngBlob);
        const a = document.createElement('a');
        a.href = pngUrl;
        a.download = filename || `chart-${Date.now()}.png`;
        a.click();
        URL.revokeObjectURL(pngUrl);
        resolve();
      }, 'image/png');
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('SVG 图像加载失败，无法导出 PNG'));
    };

    img.src = url;
  });
}

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    return true;
  }
}
