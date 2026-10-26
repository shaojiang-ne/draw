import { useRef, useEffect, useCallback, forwardRef, useImperativeHandle } from 'react';

export interface SelectedElementInfo {
  tagName: string;
  fill: string;
  stroke: string;
  strokeWidth: string;
  textContent?: string;
  fontSize?: string;
  /** 选中元素数量（>1 表示框选多选） */
  count?: number;
  /** 连线类型（仅 line/path/polyline 元素） */
  lineType?: 'line' | 'curve' | 'polyline';
}

export type EditableProperty = 'fill' | 'stroke' | 'stroke-width' | 'text' | 'font-size' | 'line-type';

export interface SvgEditorHandle {
  getModifiedSvg: () => string;
  applyPropertyChange: (prop: EditableProperty, value: string, silent?: boolean) => void;
  clearSelection: () => void;
  /** 将当前 DOM 状态同步回 store（编辑结束时调用） */
  commitChanges: () => void;
}

interface SvgEditorProps {
  svgContent: string;
  onSvgChange?: (svg: string) => void;
  onSelect?: (info: SelectedElementInfo | null) => void;
  /** 是否处于连线模式（从节点拖出连线） */
  isConnectMode?: boolean;
}

const SVG_NS = 'http://www.w3.org/2000/svg';

/** 可选中的具体元素标签（不含 g，g 仅作兜底） */
const SELECTABLE_TAGS = new Set(['rect', 'circle', 'ellipse', 'text', 'path', 'polygon', 'polyline', 'line', 'image', 'use', 'g']);

/** 文本类元素标签 */
const TEXT_TAGS = new Set(['text', 'tspan']);

/** 连线类元素标签 */
const LINE_TAGS = new Set(['line', 'path', 'polyline']);

/** 节点类元素标签（可被连线连接的色块） */
const NODE_TAGS = new Set(['rect', 'circle', 'ellipse', 'polygon', 'image', 'g']);

/** 端点匹配容差（像素，SVG 用户坐标系） */
const CONNECT_TOLERANCE = 2;

/** 获取元素的 BBox，容错处理 */
function getBBox(el: SVGGraphicsElement): DOMRect {
  try {
    return el.getBBox();
  } catch {
    return new DOMRect(0, 0, 0, 0);
  }
}

/** 解析元素现有的 transform translate 值 */
function parseTranslate(el: SVGElement): { x: number; y: number; base: string } {
  const transform = el.getAttribute('transform') || '';
  const match = transform.match(/translate\(\s*([-\d.]+)[\s,]+([-\d.]+)\s*\)/);
  if (match) {
    const base = transform.replace(/translate\(\s*[-\d.]+[\s,]+[-\d.]+\s*\)/, '').trim();
    return { x: parseFloat(match[1]), y: parseFloat(match[2]), base };
  }
  return { x: 0, y: 0, base: transform };
}

/** 设置元素的 transform translate */
function setTranslate(el: SVGElement, x: number, y: number, base: string) {
  const parts: string[] = [];
  if (base) parts.push(base);
  parts.push(`translate(${x.toFixed(1)}, ${y.toFixed(1)})`);
  el.setAttribute('transform', parts.join(' '));
}

/** 找到最近的可选中元素（优先具体子元素 rect/circle/text 等，而非 <g> 分组） */
function findDraggableTarget(el: Element, svgRoot: SVGSVGElement): SVGElement | null {
  let firstSpecific: SVGElement | null = null;
  let firstGroup: SVGElement | null = null;
  let current: Element | null = el;

  while (current && current !== svgRoot) {
    if (current instanceof SVGElement && SELECTABLE_TAGS.has(current.tagName.toLowerCase())) {
      const tag = current.tagName.toLowerCase();
      if (tag === 'g') {
        if (!firstGroup) firstGroup = current;
      } else {
        if (!firstSpecific) firstSpecific = current;
      }
    }
    current = current.parentElement;
  }

  return firstSpecific || firstGroup;
}

/** 提取选中元素的信息 */
function extractElementInfo(el: SVGElement, count = 1): SelectedElementInfo {
  const tagName = el.tagName.toLowerCase();
  const fill = el.getAttribute('fill') || '';
  const stroke = el.getAttribute('stroke') || '';
  const strokeWidth = el.getAttribute('stroke-width') || '';
  const fontSize = el.getAttribute('font-size') || '';

  // 连线类型
  let lineType: SelectedElementInfo['lineType'];
  if (LINE_TAGS.has(tagName)) {
    const dataLineType = el.getAttribute('data-line-type');
    if (dataLineType === 'curve') lineType = 'curve';
    else if (tagName === 'line') lineType = 'line';
    else if (tagName === 'polyline') lineType = 'polyline';
    else lineType = 'curve'; // path 默认为曲线
  }

  if (TEXT_TAGS.has(tagName)) {
    return {
      tagName,
      fill,
      stroke,
      strokeWidth,
      fontSize,
      textContent: el.textContent || '',
      count,
      lineType,
    };
  }

  if (tagName === 'g') {
    const firstShape = el.querySelector('rect, circle, ellipse, polygon, polyline, path');
    if (firstShape) {
      return {
        tagName,
        fill: firstShape.getAttribute('fill') || '',
        stroke: firstShape.getAttribute('stroke') || '',
        strokeWidth: firstShape.getAttribute('stroke-width') || '',
        count,
        lineType,
      };
    }
    return { tagName, fill, stroke, strokeWidth, count, lineType };
  }

  return { tagName, fill, stroke, strokeWidth, count, lineType };
}

/** 判断两个矩形是否相交（用于框选命中检测） */
function rectsIntersect(a: DOMRect, b: DOMRect): boolean {
  return !(
    a.right < b.left ||
    a.left > b.right ||
    a.bottom < b.top ||
    a.top > b.bottom
  );
}

/** 计算 BBox 在 SVG 用户坐标系中的矩形（含 transform translate 偏移） */
function getTranslatedBBox(el: SVGElement): DOMRect {
  const bbox = getBBox(el as SVGGraphicsElement);
  const { x: tx, y: ty } = parseTranslate(el);
  return new DOMRect(bbox.x + tx, bbox.y + ty, bbox.width, bbox.height);
}

/** 获取元素中心点（含 transform 偏移） */
function getElementCenter(el: SVGElement): { x: number; y: number } {
  const b = getTranslatedBBox(el);
  return { x: b.x + b.width / 2, y: b.y + b.height / 2 };
}

// ===== 连接关系表 =====

interface Connection {
  lineEl: SVGElement;
  type: 'line' | 'path' | 'polyline';
  startNode: SVGElement | null;
  endNode: SVGElement | null;
  startOffset: { dx: number; dy: number };
  endOffset: { dx: number; dy: number };
}

/** 提取线的起点和终点坐标 */
function getLineEndpoints(el: SVGElement): { start: { x: number; y: number }; end: { x: number; y: number } } | null {
  const tag = el.tagName.toLowerCase();
  if (tag === 'line') {
    return {
      start: { x: parseFloat(el.getAttribute('x1') || '0'), y: parseFloat(el.getAttribute('y1') || '0') },
      end: { x: parseFloat(el.getAttribute('x2') || '0'), y: parseFloat(el.getAttribute('y2') || '0') },
    };
  }
  if (tag === 'polyline') {
    const pts = (el.getAttribute('points') || '').trim().split(/[\s,]+/).map(Number);
    if (pts.length >= 4) {
      return { start: { x: pts[0], y: pts[1] }, end: { x: pts[pts.length - 2], y: pts[pts.length - 1] } };
    }
    return null;
  }
  if (tag === 'path') {
    const d = el.getAttribute('d') || '';
    // 提取 M 起点
    const mMatch = d.match(/M\s*([-\d.]+)[\s,]+([-\d.]+)/);
    // 提取终点：最后一个 L/C 后的坐标
    const lMatch = d.match(/L\s*([-\d.]+)[\s,]+([-\d.]+)\s*$/);
    const cMatch = d.match(/C\s*[-\d.]+[\s,]+[-\d.]+[\s,]+[-\d.]+[\s,]+[-\d.]+[\s,]+([-\d.]+)[\s,]+([-\d.]+)\s*$/);
    if (mMatch) {
      const endMatch = lMatch || cMatch;
      return {
        start: { x: parseFloat(mMatch[1]), y: parseFloat(mMatch[2]) },
        end: endMatch ? { x: parseFloat(endMatch[1]), y: parseFloat(endMatch[2]) } : { x: parseFloat(mMatch[1]), y: parseFloat(mMatch[2]) },
      };
    }
    return null;
  }
  return null;
}

/** 判断点是否在元素的 BBox 内（含容差） */
function pointInElementBBox(px: number, py: number, el: SVGElement, tolerance: number): boolean {
  const b = getTranslatedBBox(el);
  return px >= b.x - tolerance && px <= b.x + b.width + tolerance &&
         py >= b.y - tolerance && py <= b.y + b.height + tolerance;
}

/** 查找 BBox 包含给定点的最近节点元素 */
function findNodeAtPoint(svgRoot: SVGSVGElement, px: number, py: number, tolerance: number): SVGElement | null {
  let best: SVGElement | null = null;
  let bestArea = Infinity;
  const candidates = svgRoot.querySelectorAll<SVGElement>('rect, circle, ellipse, polygon, image');
  for (const el of candidates) {
    if (el.hasAttribute('data-editor-helper')) continue;
    if (pointInElementBBox(px, py, el, tolerance)) {
      const b = getTranslatedBBox(el);
      const area = b.width * b.height;
      // 选面积最小的（最精确的匹配）
      if (area < bestArea) {
        bestArea = area;
        best = el;
      }
    }
  }
  return best;
}

/** 构建连接关系表 */
function buildConnectionMap(svgRoot: SVGSVGElement): Connection[] {
  const connections: Connection[] = [];
  const lineEls = svgRoot.querySelectorAll<SVGElement>('line, path, polyline');

  for (const el of lineEls) {
    if (el.hasAttribute('data-editor-helper')) continue;
    const tag = el.tagName.toLowerCase() as 'line' | 'path' | 'polyline';
    const endpoints = getLineEndpoints(el);
    if (!endpoints) continue;

    const startNode = findNodeAtPoint(svgRoot, endpoints.start.x, endpoints.start.y, CONNECT_TOLERANCE);
    const endNode = findNodeAtPoint(svgRoot, endpoints.end.x, endpoints.end.y, CONNECT_TOLERANCE);

    const startOffset = startNode
      ? { dx: endpoints.start.x - getElementCenter(startNode).x, dy: endpoints.start.y - getElementCenter(startNode).y }
      : { dx: 0, dy: 0 };
    const endOffset = endNode
      ? { dx: endpoints.end.x - getElementCenter(endNode).x, dy: endpoints.end.y - getElementCenter(endNode).y }
      : { dx: 0, dy: 0 };

    connections.push({ lineEl: el, type: tag, startNode, endNode, startOffset, endOffset });
  }

  return connections;
}

/** 更新连线的端点坐标 */
function updateLineEndpoint(
  el: SVGElement,
  type: 'line' | 'path' | 'polyline',
  which: 'start' | 'end',
  x: number,
  y: number,
) {
  if (type === 'line') {
    if (which === 'start') {
      el.setAttribute('x1', x.toFixed(1));
      el.setAttribute('y1', y.toFixed(1));
    } else {
      el.setAttribute('x2', x.toFixed(1));
      el.setAttribute('y2', y.toFixed(1));
    }
    return;
  }

  if (type === 'polyline') {
    const ptsStr = (el.getAttribute('points') || '').trim();
    const pairs = ptsStr.split(/\s+/);
    if (which === 'start' && pairs.length > 0) {
      pairs[0] = `${x.toFixed(1)},${y.toFixed(1)}`;
    } else if (which === 'end' && pairs.length > 1) {
      pairs[pairs.length - 1] = `${x.toFixed(1)},${y.toFixed(1)}`;
    }
    el.setAttribute('points', pairs.join(' '));
    return;
  }

  if (type === 'path') {
    const d = el.getAttribute('d') || '';
    if (which === 'start') {
      // 替换 M 后的坐标
      el.setAttribute('d', d.replace(/M\s*[-\d.]+[\s,]+[-\d.]+/, `M ${x.toFixed(1)} ${y.toFixed(1)}`));
    } else {
      // 替换最后一个 L 或 C 终点坐标
      const lRe = /(L)\s*[-\d.]+[\s,]+[-\d.]+\s*$/;
      const cRe = /(C)\s*[-\d.]+[\s,]+[-\d.]+[\s,]+[-\d.]+[\s,]+[-\d.]+[\s,]+([-\d.]+)[\s,]+([-\d.]+)\s*$/;
      if (lRe.test(d)) {
        el.setAttribute('d', d.replace(lRe, `L ${x.toFixed(1)} ${y.toFixed(1)}`));
      } else if (cRe.test(d)) {
        el.setAttribute('d', d.replace(
          /C\s*([-\d.]+)[\s,]+([-\d.]+)[\s,]+([-\d.]+)[\s,]+([-\d.]+)[\s,]+([-\d.]+)[\s,]+([-\d.]+)\s*$/,
          `C $1 $2 $3 $4 ${x.toFixed(1)} ${y.toFixed(1)}`
        ));
      }
    }
  }
}

/** 将直线转为贝塞尔曲线 */
function lineToCurve(el: SVGElement, type: 'line' | 'path' | 'polyline'): { newEl: SVGElement; newType: 'path' } {
  const endpoints = getLineEndpoints(el);
  if (!endpoints) return { newEl: el, newType: type as 'path' };

  const { start, end } = endpoints;
  // 计算中间控制点（偏移量 = 距离的 25%，垂直于连线方向）
  const mx = (start.x + end.x) / 2;
  const my = (start.y + end.y) / 2;
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const len = Math.sqrt(dx * dx + dy * dy) || 1;
  const curvature = len * 0.25;
  // 垂直方向偏移
  const cpx = mx + (-dy / len) * curvature;
  const cpy = my + (dx / len) * curvature;

  const ns = 'http://www.w3.org/2000/svg';
  const path = document.createElementNS(ns, 'path');
  // 复制属性
  for (const attr of Array.from(el.attributes)) {
    if (attr.name !== 'd' && attr.name !== 'x1' && attr.name !== 'y1' && attr.name !== 'x2' && attr.name !== 'y2' && attr.name !== 'points') {
      path.setAttribute(attr.name, attr.value);
    }
  }
  path.setAttribute('d', `M ${start.x.toFixed(1)} ${start.y.toFixed(1)} Q ${cpx.toFixed(1)} ${cpy.toFixed(1)} ${end.x.toFixed(1)} ${end.y.toFixed(1)}`);
  path.setAttribute('data-line-type', 'curve');

  el.parentNode?.replaceChild(path, el);
  return { newEl: path, newType: 'path' };
}

/** 将曲线转为直线 */
function curveToLine(el: SVGElement): { newEl: SVGElement; newType: 'line' } {
  const endpoints = getLineEndpoints(el);
  if (!endpoints) return { newEl: el, newType: 'line' };

  const { start, end } = endpoints;
  const ns = 'http://www.w3.org/2000/svg';
  const line = document.createElementNS(ns, 'line');
  for (const attr of Array.from(el.attributes)) {
    if (attr.name !== 'd' && attr.name !== 'points') {
      line.setAttribute(attr.name, attr.value);
    }
  }
  line.setAttribute('x1', start.x.toFixed(1));
  line.setAttribute('y1', start.y.toFixed(1));
  line.setAttribute('x2', end.x.toFixed(1));
  line.setAttribute('y2', end.y.toFixed(1));
  line.removeAttribute('data-line-type');

  el.parentNode?.replaceChild(line, el);
  return { newEl: line, newType: 'line' };
}

export const SvgEditor = forwardRef<SvgEditorHandle, SvgEditorProps>(function SvgEditor(
  { svgContent, onSvgChange, onSelect, isConnectMode = false },
  ref,
) {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRootRef = useRef<SVGSVGElement | null>(null);
  // 选中高亮框（包围所有选中元素的整体 bbox）
  const selectionRectRef = useRef<SVGRectElement | null>(null);
  // 框选时的橡皮筋矩形
  const marqueeRectRef = useRef<SVGRectElement | null>(null);
  // 连线模式下的临时连线
  const tempLineRef = useRef<SVGPathElement | null>(null);
  // 当前选中的元素集合
  const selectedSetRef = useRef<Set<SVGElement>>(new Set());
  // 连接关系表
  const connectionsRef = useRef<Connection[]>([]);
  // 连线模式 prop 的最新值（事件处理函数通过 ref 读取，避免频繁重注册）
  const isConnectModeRef = useRef(isConnectMode);
  isConnectModeRef.current = isConnectMode;
  const onSelectRef = useRef(onSelect);
  onSelectRef.current = onSelect;
  const onSvgChangeRef = useRef(onSvgChange);
  onSvgChangeRef.current = onSvgChange;

  type DragState =
    | { mode: 'none' }
    | { mode: 'move'; startX: number; startY: number; moved: boolean; startTranslates: Map<SVGElement, { x: number; y: number; base: string }> }
    | { mode: 'marquee'; startX: number; startY: number }
    | { mode: 'connect'; startNode: SVGElement; startX: number; startY: number };

  const dragStateRef = useRef<DragState>({ mode: 'none' });

  /** 屏幕坐标 → SVG 坐标 */
  const screenToSvg = useCallback((clientX: number, clientY: number): { x: number; y: number } => {
    const svg = svgRootRef.current;
    if (!svg) return { x: 0, y: 0 };
    const pt = svg.createSVGPoint();
    pt.x = clientX;
    pt.y = clientY;
    const ctm = svg.getScreenCTM();
    if (!ctm) return { x: 0, y: 0 };
    const svgPt = pt.matrixTransform(ctm.inverse());
    return { x: svgPt.x, y: svgPt.y };
  }, []);

  /** 计算所有选中元素的整体 BBox，更新高亮框 */
  const updateSelectionRect = useCallback(() => {
    const rect = selectionRectRef.current;
    const svg = svgRootRef.current;
    if (!rect || !svg) return;

    const selected = selectedSetRef.current;
    if (selected.size === 0) {
      rect.setAttribute('width', '0');
      rect.setAttribute('height', '0');
      return;
    }

    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    selected.forEach(el => {
      const b = getTranslatedBBox(el);
      if (b.width === 0 && b.height === 0) return;
      minX = Math.min(minX, b.x);
      minY = Math.min(minY, b.y);
      maxX = Math.max(maxX, b.x + b.width);
      maxY = Math.max(maxY, b.y + b.height);
    });

    if (!Number.isFinite(minX)) {
      rect.setAttribute('width', '0');
      rect.setAttribute('height', '0');
      return;
    }

    rect.setAttribute('x', String(minX - 4));
    rect.setAttribute('y', String(minY - 4));
    rect.setAttribute('width', String(maxX - minX + 8));
    rect.setAttribute('height', String(maxY - minY + 8));
  }, []);

  /** 给元素打上选中标记 */
  const markSelected = useCallback((el: SVGElement) => {
    el.setAttribute('data-editor-selected', 'true');
  }, []);

  const unmarkSelected = useCallback((el: SVGElement) => {
    el.removeAttribute('data-editor-selected');
  }, []);

  /** 通知外部当前选中信息 */
  const notifySelection = useCallback(() => {
    const selected = selectedSetRef.current;
    if (selected.size === 0) {
      onSelectRef.current?.(null);
      return;
    }
    // 以第一个元素为代表构造 info，count 标注总数
    const first = selected.values().next().value!;
    onSelectRef.current?.(extractElementInfo(first, selected.size));
  }, []);

  /** 选中单个元素（替换之前的选中） */
  const selectSingle = useCallback((el: SVGElement) => {
    selectedSetRef.current.forEach(unmarkSelected);
    selectedSetRef.current.clear();
    selectedSetRef.current.add(el);
    markSelected(el);
    updateSelectionRect();
    notifySelection();
  }, [markSelected, unmarkSelected, updateSelectionRect, notifySelection]);

  /** 选中多个元素 */
  const selectMultiple = useCallback((elements: SVGElement[]) => {
    selectedSetRef.current.forEach(unmarkSelected);
    selectedSetRef.current.clear();
    elements.forEach(el => {
      selectedSetRef.current.add(el);
      markSelected(el);
    });
    updateSelectionRect();
    notifySelection();
  }, [markSelected, unmarkSelected, updateSelectionRect, notifySelection]);

  /** 取消所有选中 */
  const clearSelection = useCallback(() => {
    selectedSetRef.current.forEach(unmarkSelected);
    selectedSetRef.current.clear();
    updateSelectionRect();
    notifySelection();
  }, [unmarkSelected, updateSelectionRect, notifySelection]);

  /** 序列化当前 SVG DOM 回字符串（移除辅助元素与标记） */
  const getModifiedSvg = useCallback(() => {
    const svg = svgRootRef.current;
    if (!svg) return svgContent;
    const helpers = svg.querySelectorAll('[data-editor-helper]');
    helpers.forEach(h => h.remove());
    svg.querySelectorAll('[data-editor-selected]').forEach(el => {
      el.removeAttribute('data-editor-selected');
    });
    return new XMLSerializer().serializeToString(svg);
  }, [svgContent]);

  /** 应用属性变更到当前所有选中元素。
   *  silent=true 时只修改 DOM 不触发 onSvgChange（编辑过程中避免重挂载） */
  const applyPropertyChange = useCallback((prop: EditableProperty, value: string, silent = false) => {
    const svg = svgRootRef.current;
    if (!svg) return;
    const selected = selectedSetRef.current;
    if (selected.size === 0) return;

    selected.forEach(sel => {
      const tagName = sel.tagName.toLowerCase();

      if (prop === 'text') {
        const tspan = sel.querySelector('tspan');
        if (tspan) tspan.textContent = value;
        else sel.textContent = value;
      } else if (prop === 'font-size') {
        sel.setAttribute('font-size', value);
        sel.querySelectorAll('tspan').forEach(ts => ts.setAttribute('font-size', value));
      } else if (prop === 'fill' || prop === 'stroke' || prop === 'stroke-width') {
        if (tagName === 'g') {
          const children = sel.querySelectorAll('rect, circle, ellipse, polygon, polyline, path, text, tspan, image');
          children.forEach(child => child.setAttribute(prop, value));
          sel.setAttribute(prop, value);
        } else {
          sel.setAttribute(prop, value);
        }
      } else if (prop === 'line-type') {
        // 连线形状切换
        const currentType = sel.getAttribute('data-line-type') || (tagName === 'line' ? 'line' : tagName === 'path' ? 'curve' : 'polyline');
        if (value === 'curve' && currentType !== 'curve') {
          const { newEl, newType } = lineToCurve(sel, tagName as 'line' | 'path' | 'polyline');
          newEl.setAttribute('data-line-type', 'curve');
          // 更新选中集合和连接表
          if (newEl !== sel) {
            selected.delete(sel);
            selected.add(newEl);
            unmarkSelected(sel);
            markSelected(newEl);
            // 更新连接表中对应的元素引用
            for (let i = 0; i < connectionsRef.current.length; i++) {
              if (connectionsRef.current[i].lineEl === sel) {
                connectionsRef.current[i] = { ...connectionsRef.current[i], lineEl: newEl, type: newType };
              }
            }
          }
        } else if (value === 'line' && currentType !== 'line') {
          const { newEl, newType } = curveToLine(sel);
          newEl.removeAttribute('data-line-type');
          if (newEl !== sel) {
            selected.delete(sel);
            selected.add(newEl);
            unmarkSelected(sel);
            markSelected(newEl);
            for (let i = 0; i < connectionsRef.current.length; i++) {
              if (connectionsRef.current[i].lineEl === sel) {
                connectionsRef.current[i] = { ...connectionsRef.current[i], lineEl: newEl, type: newType };
              }
            }
          }
        }
      }
    });

    updateSelectionRect();
    if (!silent) {
      onSvgChangeRef.current?.(getModifiedSvg());
    }
  }, [updateSelectionRect, getModifiedSvg]);

  useImperativeHandle(ref, () => ({
    getModifiedSvg,
    applyPropertyChange,
    clearSelection,
    /** 将当前 DOM 状态同步回 store（编辑结束时调用） */
    commitChanges: () => {
      onSvgChangeRef.current?.(getModifiedSvg());
    },
  }), [getModifiedSvg, applyPropertyChange, clearSelection]);

  /** 双击文字进入 inline 编辑 */
  const startInlineTextEdit = useCallback((el: SVGElement) => {
    const svg = svgRootRef.current;
    const container = containerRef.current;
    if (!svg || !container) return;

    const bbox = getBBox(el as SVGGraphicsElement);
    const ctm = (el as SVGGraphicsElement).getScreenCTM();
    if (!ctm) return;

    const svgPt = svg.createSVGPoint();
    svgPt.x = bbox.x;
    svgPt.y = bbox.y + bbox.height * 0.8;
    const screenPt = svgPt.matrixTransform(ctm);

    const containerRect = container.getBoundingClientRect();
    const fontSize = el.getAttribute('font-size') || '16';
    const fill = el.getAttribute('fill') || '#000000';

    const input = document.createElement('input');
    input.type = 'text';
    input.value = el.textContent || '';
    input.style.position = 'absolute';
    input.style.left = `${screenPt.x - containerRect.left}px`;
    input.style.top = `${screenPt.y - containerRect.top - bbox.height}px`;
    input.style.fontSize = `${fontSize}px`;
    input.style.color = fill;
    input.style.background = 'rgba(255,255,255,0.95)';
    input.style.border = '1px solid #3b82f6';
    input.style.borderRadius = '2px';
    input.style.padding = '0 2px';
    input.style.outline = 'none';
    input.style.zIndex = '50';
    input.style.minWidth = `${Math.max(bbox.width, 60)}px`;
    input.style.fontFamily = el.getAttribute('font-family') || 'inherit';

    container.appendChild(input);
    input.focus();
    input.select();

    let finished = false;
    const finish = (commit: boolean) => {
      if (finished) return;
      finished = true;
      if (commit) {
        el.textContent = input.value;
        updateSelectionRect();
        // 只在结束时同步 SVG 到 store，避免编辑过程中重挂载
        onSvgChangeRef.current?.(getModifiedSvg());
        selectSingle(el);
      }
      input.remove();
    };

    input.addEventListener('blur', () => finish(true));
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        finish(true);
      } else if (e.key === 'Escape') {
        e.preventDefault();
        finish(false);
      }
    });
  }, [updateSelectionRect, getModifiedSvg, selectSingle]);

  /** 挂载 SVG DOM 到容器 */
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.innerHTML = '';

    const parser = new DOMParser();
    const doc = parser.parseFromString(svgContent, 'image/svg+xml');
    const svgEl = doc.querySelector('svg');
    if (!svgEl) return;

    svgEl.style.width = '100%';
    svgEl.style.height = '100%';

    // 选中高亮框（包围所有选中元素）
    const selectionRect = document.createElementNS(SVG_NS, 'rect');
    selectionRect.setAttribute('fill', 'none');
    selectionRect.setAttribute('stroke', '#3b82f6');
    selectionRect.setAttribute('stroke-width', '2');
    selectionRect.setAttribute('stroke-dasharray', '6 3');
    selectionRect.setAttribute('rx', '3');
    selectionRect.setAttribute('pointer-events', 'none');
    selectionRect.setAttribute('width', '0');
    selectionRect.setAttribute('height', '0');
    selectionRect.setAttribute('data-editor-helper', 'selection');
    svgEl.appendChild(selectionRect);
    selectionRectRef.current = selectionRect;

    // 框选橡皮筋矩形
    const marqueeRect = document.createElementNS(SVG_NS, 'rect');
    marqueeRect.setAttribute('fill', 'rgba(59,130,246,0.12)');
    marqueeRect.setAttribute('stroke', '#3b82f6');
    marqueeRect.setAttribute('stroke-width', '1');
    marqueeRect.setAttribute('stroke-dasharray', '4 2');
    marqueeRect.setAttribute('pointer-events', 'none');
    marqueeRect.setAttribute('width', '0');
    marqueeRect.setAttribute('height', '0');
    marqueeRect.setAttribute('data-editor-helper', 'marquee');
    svgEl.appendChild(marqueeRect);
    marqueeRectRef.current = marqueeRect;

    // 连线模式下的临时连线
    const tempLine = document.createElementNS(SVG_NS, 'path');
    tempLine.setAttribute('fill', 'none');
    tempLine.setAttribute('stroke', '#3b82f6');
    tempLine.setAttribute('stroke-width', '2');
    tempLine.setAttribute('stroke-dasharray', '6 3');
    tempLine.setAttribute('pointer-events', 'none');
    tempLine.setAttribute('d', '');
    tempLine.setAttribute('data-editor-helper', 'temp-line');
    svgEl.appendChild(tempLine);
    tempLineRef.current = tempLine;

    svgRootRef.current = svgEl;
    selectedSetRef.current = new Set();
    // 构建连接关系表
    connectionsRef.current = buildConnectionMap(svgEl);

    container.appendChild(svgEl);

    return () => {
      container.innerHTML = '';
      svgRootRef.current = null;
      selectionRectRef.current = null;
      marqueeRectRef.current = null;
      tempLineRef.current = null;
      selectedSetRef.current = new Set();
      connectionsRef.current = [];
    };
  }, [svgContent]);

  /** 收集 SVG 中所有可框选的具体元素（顶层 + <g> 内的，排除辅助元素） */
  const collectSelectableElements = useCallback((): SVGElement[] => {
    const svg = svgRootRef.current;
    if (!svg) return [];
    const selector = 'rect, circle, ellipse, polygon, polyline, line, path, text, image, use';
    const els = Array.from(svg.querySelectorAll<SVGElement>(selector));
    // 过滤掉编辑器辅助元素
    return els.filter(el => !el.hasAttribute('data-editor-helper'));
  }, []);

  /** 注册 pointer 事件 */
  useEffect(() => {
    const svg = svgRootRef.current;
    if (!svg) return;

    const handlePointerDown = (e: PointerEvent) => {
      if (e.button !== 0) return;

      // 双击文字 → inline 编辑
      if (e.detail >= 2) {
        const directTarget = e.target as Element;
        let textTarget: SVGElement | null = null;
        let cur: Element | null = directTarget;
        while (cur && cur !== svg) {
          if (cur instanceof SVGElement && TEXT_TAGS.has(cur.tagName.toLowerCase())) {
            textTarget = cur;
            break;
          }
          cur = cur.parentElement;
        }
        if (textTarget) {
          e.preventDefault();
          e.stopPropagation();
          startInlineTextEdit(textTarget);
          return;
        }
      }

      const target = findDraggableTarget(e.target as Element, svg);

      // 点击空白 → 开始框选
      if (!target) {
        e.preventDefault();
        const svgPt = screenToSvg(e.clientX, e.clientY);
        // 框选前清空已有选中
        clearSelection();
        dragStateRef.current = { mode: 'marquee', startX: svgPt.x, startY: svgPt.y };
        svg.setPointerCapture(e.pointerId);
        return;
      }

      e.preventDefault();
      e.stopPropagation();

      // 连线模式下，如果点击了节点内的任何元素（包括 text），找到最近的节点并进入连线拖拽
      if (isConnectModeRef.current) {
        let connectNode: SVGElement | null = target;
        // 如果 target 本身不是节点类型，向上查找节点
        if (!NODE_TAGS.has(connectNode.tagName.toLowerCase())) {
          let cur: Element | null = target;
          while (cur && cur !== svg) {
            if (cur instanceof SVGElement && NODE_TAGS.has(cur.tagName.toLowerCase())) {
              connectNode = cur;
              break;
            }
            cur = cur.parentElement;
          }
          if (!(cur instanceof SVGElement)) connectNode = null;
        }
        if (connectNode) {
          selectSingle(connectNode);
          const center = getElementCenter(connectNode);
          dragStateRef.current = {
            mode: 'connect',
            startNode: connectNode,
            startX: center.x,
            startY: center.y,
          };
          svg.setPointerCapture(e.pointerId);
          return;
        }
      }

      // 非连线模式，或点击的不是节点

      // 点击元素：若该元素已在选中集合中，则进入"整体移动"模式；
      // 否则单选该元素
      if (!selectedSetRef.current.has(target)) {
        selectSingle(target);
      }

      // 进入移动模式，记录所有选中元素的起始 transform
      const startTranslates = new Map<SVGElement, { x: number; y: number; base: string }>();
      selectedSetRef.current.forEach(el => {
        startTranslates.set(el, parseTranslate(el));
      });
      dragStateRef.current = {
        mode: 'move',
        startX: screenToSvg(e.clientX, e.clientY).x,
        startY: screenToSvg(e.clientX, e.clientY).y,
        moved: false,
        startTranslates,
      };
      svg.setPointerCapture(e.pointerId);
    };

    const handlePointerMove = (e: PointerEvent) => {
      const drag = dragStateRef.current;
      if (drag.mode === 'none') return;

      const svgPt = screenToSvg(e.clientX, e.clientY);

      if (drag.mode === 'marquee') {
        const marquee = marqueeRectRef.current;
        if (!marquee) return;
        const x = Math.min(drag.startX, svgPt.x);
        const y = Math.min(drag.startY, svgPt.y);
        const w = Math.abs(svgPt.x - drag.startX);
        const h = Math.abs(svgPt.y - drag.startY);
        marquee.setAttribute('x', String(x));
        marquee.setAttribute('y', String(y));
        marquee.setAttribute('width', String(w));
        marquee.setAttribute('height', String(h));
        return;
      }

      if (drag.mode === 'connect') {
        // 更新临时连线
        const tempLine = tempLineRef.current;
        if (!tempLine) return;
        const sx = drag.startX;
        const sy = drag.startY;
        const ex = svgPt.x;
        const ey = svgPt.y;
        // 绘制一条带弯曲的临时连线
        const mx = (sx + ex) / 2;
        const my = (sy + ey) / 2;
        const dx = ex - sx;
        const dy = ey - sy;
        const len = Math.sqrt(dx * dx + dy * dy) || 1;
        const bend = len * 0.15;
        const cpx = mx + (-dy / len) * bend;
        const cpy = my + (dx / len) * bend;
        tempLine.setAttribute('d',
          `M ${sx.toFixed(1)} ${sy.toFixed(1)} Q ${cpx.toFixed(1)} ${cpy.toFixed(1)} ${ex.toFixed(1)} ${ey.toFixed(1)}`
        );

        // 高亮鼠标下的目标节点（容差放大，便于命中）
        const hitNode = findNodeAtPoint(svg, svgPt.x, svgPt.y, 15);
        // 移除之前的高亮
        svg.querySelectorAll('[data-editor-helper="connect-target"]').forEach(el => el.remove());
        if (hitNode && hitNode !== drag.startNode) {
          const bbox = getTranslatedBBox(hitNode);
          const highlight = document.createElementNS(SVG_NS, 'rect');
          highlight.setAttribute('fill', 'rgba(59,130,246,0.2)');
          highlight.setAttribute('stroke', '#3b82f6');
          highlight.setAttribute('stroke-width', '2');
          highlight.setAttribute('rx', '4');
          highlight.setAttribute('x', String(bbox.x - 3));
          highlight.setAttribute('y', String(bbox.y - 3));
          highlight.setAttribute('width', String(bbox.width + 6));
          highlight.setAttribute('height', String(bbox.height + 6));
          highlight.setAttribute('pointer-events', 'none');
          highlight.setAttribute('data-editor-helper', 'connect-target');
          svg.appendChild(highlight);
        }
        return;
      }

      if (drag.mode === 'move') {
        const dx = svgPt.x - drag.startX;
        const dy = svgPt.y - drag.startY;
        if (Math.abs(dx) > 1 || Math.abs(dy) > 1) drag.moved = true;

        drag.startTranslates.forEach((start, el) => {
          setTranslate(el, start.x + dx, start.y + dy, start.base);
        });

        // 更新与被移动节点相连的连线端点
        const movedElements = Array.from(selectedSetRef.current);
        for (const conn of connectionsRef.current) {
          for (const movedEl of movedElements) {
            if (conn.startNode === movedEl) {
              const center = getElementCenter(movedEl);
              updateLineEndpoint(conn.lineEl, conn.type, 'start',
                center.x + conn.startOffset.dx,
                center.y + conn.startOffset.dy);
            }
            if (conn.endNode === movedEl) {
              const center = getElementCenter(movedEl);
              updateLineEndpoint(conn.lineEl, conn.type, 'end',
                center.x + conn.endOffset.dx,
                center.y + conn.endOffset.dy);
            }
          }
        }

        updateSelectionRect();
      }
    };

    const handlePointerUp = (e: PointerEvent) => {
      const drag = dragStateRef.current;
      if (drag.mode === 'none') return;
      dragStateRef.current = { mode: 'none' };

      try { svg.releasePointerCapture(e.pointerId); } catch { /* ignore */ }

      if (drag.mode === 'connect') {
        // 清理临时连线和目标高亮
        const tempLine = tempLineRef.current;
        if (tempLine) tempLine.setAttribute('d', '');
        svg.querySelectorAll('[data-editor-helper="connect-target"]').forEach(el => el.remove());

        // 通过 DOM 事件直接检测鼠标释放位置下的元素
        // 用 elementFromPoint 更可靠，不受缩放影响
        const elUnderPointer = document.elementFromPoint(e.clientX, e.clientY);
        let targetNode: SVGElement | null = null;

        if (elUnderPointer && elUnderPointer !== svg) {
          // 从鼠标下的元素向上查找节点
          let cur: Element | null = elUnderPointer;
          while (cur && cur !== svg) {
            if (cur instanceof SVGElement && NODE_TAGS.has(cur.tagName.toLowerCase())) {
              targetNode = cur;
              break;
            }
            cur = cur.parentElement;
          }
        }

        // 备用：如果 elementFromPoint 没找到（可能被临时线遮挡），用坐标匹配
        if (!targetNode) {
          const svgPt = screenToSvg(e.clientX, e.clientY);
          targetNode = findNodeAtPoint(svg, svgPt.x, svgPt.y, 15);
        }

        if (targetNode && targetNode !== drag.startNode) {
          // 创建正式连线
          const startCenter = getElementCenter(drag.startNode);
          const endCenter = getElementCenter(targetNode);

          const newLine = document.createElementNS(SVG_NS, 'line');
          newLine.setAttribute('x1', startCenter.x.toFixed(1));
          newLine.setAttribute('y1', startCenter.y.toFixed(1));
          newLine.setAttribute('x2', endCenter.x.toFixed(1));
          newLine.setAttribute('y2', endCenter.y.toFixed(1));
          newLine.setAttribute('stroke', '#6b7280');
          newLine.setAttribute('stroke-width', '2');
          newLine.setAttribute('marker-end', 'url(#arrowhead)');

          // 查找或创建箭头 marker
          let defs = svg.querySelector('defs');
          if (!defs) {
            defs = document.createElementNS(SVG_NS, 'defs');
            svg.insertBefore(defs, svg.firstChild);
          }
          if (!defs.querySelector('#arrowhead')) {
            const marker = document.createElementNS(SVG_NS, 'marker');
            marker.setAttribute('id', 'arrowhead');
            marker.setAttribute('markerWidth', '10');
            marker.setAttribute('markerHeight', '7');
            marker.setAttribute('refX', '10');
            marker.setAttribute('refY', '3.5');
            marker.setAttribute('orient', 'auto');
            const arrowPath = document.createElementNS(SVG_NS, 'polygon');
            arrowPath.setAttribute('points', '0 0, 10 3.5, 0 7');
            arrowPath.setAttribute('fill', '#6b7280');
            marker.appendChild(arrowPath);
            defs.appendChild(marker);
          }

          // 插入到 SVG 第一个子元素之前（连线在下层）
          const firstChild = svg.firstChild;
          if (firstChild) svg.insertBefore(newLine, firstChild);
          else svg.appendChild(newLine);

          // 更新连接关系表
          const startOffset = { dx: 0, dy: 0 };
          const endOffset = { dx: 0, dy: 0 };
          connectionsRef.current.push({
            lineEl: newLine,
            type: 'line',
            startNode: drag.startNode,
            endNode: targetNode,
            startOffset,
            endOffset,
          });

          onSvgChangeRef.current?.(getModifiedSvg());
        }
        return;
      }

      if (drag.mode === 'marquee') {
        const marquee = marqueeRectRef.current;
        if (marquee) {
          const mx = parseFloat(marquee.getAttribute('x') || '0');
          const my = parseFloat(marquee.getAttribute('y') || '0');
          const mw = parseFloat(marquee.getAttribute('width') || '0');
          const mh = parseFloat(marquee.getAttribute('height') || '0');
          // 重置橡皮筋
          marquee.setAttribute('width', '0');
          marquee.setAttribute('height', '0');

          // 只在框出一定面积时才执行选中，避免单击空白误触
          if (mw > 3 && mh > 3) {
            const marqueeRect = new DOMRect(mx, my, mw, mh);
            const hits = collectSelectableElements().filter(el =>
              rectsIntersect(getTranslatedBBox(el), marqueeRect)
            );
            if (hits.length > 0) {
              selectMultiple(hits);
            }
          }
        }
        return;
      }

      if (drag.mode === 'move' && drag.moved) {
        onSvgChangeRef.current?.(getModifiedSvg());
      }
    };

    svg.addEventListener('pointerdown', handlePointerDown);
    svg.addEventListener('pointermove', handlePointerMove);
    svg.addEventListener('pointerup', handlePointerUp);

    return () => {
      svg.removeEventListener('pointerdown', handlePointerDown);
      svg.removeEventListener('pointermove', handlePointerMove);
      svg.removeEventListener('pointerup', handlePointerUp);
    };
  }, [screenToSvg, selectSingle, selectMultiple, clearSelection, collectSelectableElements, updateSelectionRect, getModifiedSvg, startInlineTextEdit]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full flex items-center justify-center cursor-default [&_svg]:max-w-full [&_svg]:max-h-full [&_svg]:transition-none"
    />
  );
});
