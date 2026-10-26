import type { StylePreset } from '../../types';

export const STYLE_PRESETS: StylePreset[] = [
  {
    id: 'minimal-blue',
    name: '简约蓝白',
    description: '清爽专业，适合商务文档',
    previewSvg: '<svg viewBox="0 0 120 40" xmlns="http://www.w3.org/2000/svg"><rect width="120" height="40" rx="4" fill="#FFFFFF" stroke="#93C5FD" stroke-width="1"/><rect x="4" y="4" width="16" height="32" rx="2" fill="#2563EB"/><rect x="24" y="4" width="16" height="32" rx="2" fill="#DBEAFE"/><rect x="44" y="4" width="16" height="32" rx="2" fill="#1D4ED8"/><rect x="64" y="4" width="16" height="32" rx="2" fill="#1E293B"/><rect x="84" y="4" width="16" height="32" rx="2" fill="#93C5FD"/></svg>',
    stylePrompt: '配色方案：主色 #2563EB（蓝），辅色 #DBEAFE（浅蓝），强调色 #1D4ED8（深蓝），背景 #FFFFFF（白），文字 #1E293B（深灰），边框 #93C5FD（淡蓝）。\n风格：圆角矩形 rx=8，细边框 1.5px，无阴影，连线 2px 实线，箭头中等大小。文字：14px，加粗标题 16px。整体留白充足，间距宽松。',
    colors: { primary: '#2563EB', secondary: '#DBEAFE', accent: '#1D4ED8', background: '#FFFFFF', text: '#1E293B', border: '#93C5FD' },
  },
  {
    id: 'business-dark',
    name: '商务深色',
    description: '沉稳大气，适合高管汇报',
    previewSvg: '<svg viewBox="0 0 120 40" xmlns="http://www.w3.org/2000/svg"><rect width="120" height="40" rx="4" fill="#0F172A" stroke="#4338CA" stroke-width="1"/><rect x="4" y="4" width="16" height="32" rx="2" fill="#6366F1"/><rect x="24" y="4" width="16" height="32" rx="2" fill="#1E1B4B"/><rect x="44" y="4" width="16" height="32" rx="2" fill="#818CF8"/><rect x="64" y="4" width="16" height="32" rx="2" fill="#E2E8F0"/><rect x="84" y="4" width="16" height="32" rx="2" fill="#4338CA"/></svg>',
    stylePrompt: '配色方案：主色 #6366F1（靛蓝），辅色 #1E1B4B（深靛），强调色 #818CF8（浅靛），背景 #0F172A（深蓝黑），文字 #E2E8F0（浅灰白），边框 #4338CA（靛蓝）。\n风格：圆角矩形 rx=6，边框 2px，柔和阴影 filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3))，连线 2px 实线，箭头较大。文字 14px 白色，标题 16px 加粗。深色背景配浅色元素，高对比度。',
    colors: { primary: '#6366F1', secondary: '#1E1B4B', accent: '#818CF8', background: '#0F172A', text: '#E2E8F0', border: '#4338CA' },
  },
  {
    id: 'fresh-green',
    name: '清新绿色',
    description: '自然环保，适合生态/医疗/教育',
    previewSvg: '<svg viewBox="0 0 120 40" xmlns="http://www.w3.org/2000/svg"><rect width="120" height="40" rx="4" fill="#ECFDF5" stroke="#6EE7B7" stroke-width="1"/><rect x="4" y="4" width="16" height="32" rx="2" fill="#059669"/><rect x="24" y="4" width="16" height="32" rx="2" fill="#D1FAE5"/><rect x="44" y="4" width="16" height="32" rx="2" fill="#047857"/><rect x="64" y="4" width="16" height="32" rx="2" fill="#064E3B"/><rect x="84" y="4" width="16" height="32" rx="2" fill="#6EE7B7"/></svg>',
    stylePrompt: '配色方案：主色 #059669（翠绿），辅色 #D1FAE5（浅绿），强调色 #047857（深绿），背景 #ECFDF5（薄荷白），文字 #064E3B（深绿），边框 #6EE7B7（嫩绿）。\n风格：大圆角 rx=12，细边框 1px，无阴影，连线 1.5px 实线，箭头小巧。文字 13px，标题 15px 加粗。整体轻盈通透，留白多。',
    colors: { primary: '#059669', secondary: '#D1FAE5', accent: '#047857', background: '#ECFDF5', text: '#064E3B', border: '#6EE7B7' },
  },
  {
    id: 'tech-purple',
    name: '科技紫蓝',
    description: '前沿科技感，适合IT/互联网',
    previewSvg: '<svg viewBox="0 0 120 40" xmlns="http://www.w3.org/2000/svg"><rect width="120" height="40" rx="4" fill="#F5F3FF" stroke="#A78BFA" stroke-width="1"/><rect x="4" y="4" width="16" height="32" rx="2" fill="#7C3AED"/><rect x="24" y="4" width="16" height="32" rx="2" fill="#EDE9FE"/><rect x="44" y="4" width="16" height="32" rx="2" fill="#5B21B6"/><rect x="64" y="4" width="16" height="32" rx="2" fill="#1E1B4B"/><rect x="84" y="4" width="16" height="32" rx="2" fill="#A78BFA"/></svg>',
    stylePrompt: '配色方案：主色 #7C3AED（紫），辅色 #EDE9FE（浅紫），强调色 #5B21B6（深紫），背景 #F5F3FF（薰衣草白），文字 #1E1B4B（深紫黑），边框 #A78BFA（淡紫）。\n风格：小圆角 rx=4，边框 1.5px，发光阴影 filter: drop-shadow(0 0 6px rgba(124,58,237,0.3))，连线 2px，箭头锐利。文字 13px，标题 15px 加粗。可使用渐变填充增加科技感。',
    colors: { primary: '#7C3AED', secondary: '#EDE9FE', accent: '#5B21B6', background: '#F5F3FF', text: '#1E1B4B', border: '#A78BFA' },
  },
  {
    id: 'china-red-gold',
    name: '中国红金',
    description: '国风庄重，适合政务/金融/传统行业',
    previewSvg: '<svg viewBox="0 0 120 40" xmlns="http://www.w3.org/2000/svg"><rect width="120" height="40" rx="4" fill="#FFFBEB" stroke="#FCA5A5" stroke-width="1"/><rect x="4" y="4" width="16" height="32" rx="2" fill="#DC2626"/><rect x="24" y="4" width="16" height="32" rx="2" fill="#FEF2F2"/><rect x="44" y="4" width="16" height="32" rx="2" fill="#B91C1C"/><rect x="64" y="4" width="16" height="32" rx="2" fill="#7C2D12"/><rect x="84" y="4" width="16" height="32" rx="2" fill="#D97706"/></svg>',
    stylePrompt: '配色方案：主色 #DC2626（中国红），辅色 #FEF2F2（浅红），强调色 #B91C1C（深红），背景 #FFFBEB（暖白），文字 #7C2D12（深褐），边框 #FCA5A5（淡红）。标题/关键元素可使用金色 #D97706 点缀。\n风格：中等圆角 rx=6，边框 2px，柔和阴影，连线 2px 实线，箭头中等。文字 14px，标题 16px 加粗。庄重大气。',
    colors: { primary: '#DC2626', secondary: '#FEF2F2', accent: '#B91C1C', background: '#FFFBEB', text: '#7C2D12', border: '#FCA5A5' },
  },
  {
    id: 'warm-orange',
    name: '暖橙活力',
    description: '活力热情，适合营销/创意/生活',
    previewSvg: '<svg viewBox="0 0 120 40" xmlns="http://www.w3.org/2000/svg"><rect width="120" height="40" rx="4" fill="#FFFBEB" stroke="#FDBA74" stroke-width="1"/><rect x="4" y="4" width="16" height="32" rx="2" fill="#EA580C"/><rect x="24" y="4" width="16" height="32" rx="2" fill="#FFF7ED"/><rect x="44" y="4" width="16" height="32" rx="2" fill="#C2410C"/><rect x="64" y="4" width="16" height="32" rx="2" fill="#431407"/><rect x="84" y="4" width="16" height="32" rx="2" fill="#FDBA74"/></svg>',
    stylePrompt: '配色方案：主色 #EA580C（橙），辅色 #FFF7ED（浅橙），强调色 #C2410C（深橙），背景 #FFFBEB（暖白），文字 #431407（深棕），边框 #FDBA74（淡橙）。\n风格：大圆角 rx=10，边框 1.5px，无阴影，连线 2px 实线，箭头圆润。文字 14px，标题 16px 加粗。活泼明快，可使用渐变。',
    colors: { primary: '#EA580C', secondary: '#FFF7ED', accent: '#C2410C', background: '#FFFBEB', text: '#431407', border: '#FDBA74' },
  },
];
