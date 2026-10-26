import {
  BarChart3,
  PieChart,
  LineChart,
  ScatterChart,
  AreaChart,
  Radar,
  FolderTree,
  Flame,
  GitBranch,
  Brain,
  Network,
  Table2,
  LayoutGrid,
  Building2,
  TrendingUp,
  BarChart2,
  Palette,
  Settings,
  Monitor,
  Globe,
  ClipboardList,
  type LucideIcon,
} from 'lucide-react';

const iconMap: Record<string, LucideIcon> = {
  // 分类数据（src/data/categories）实际使用的图标名
  home: Building2,
  'trending-up': TrendingUp,
  'bar-chart-2': BarChart2,
  palette: Palette,
  settings: Settings,
  'git-branch': GitBranch,
  monitor: Monitor,
  globe: Globe,
  'clipboard-list': ClipboardList,
  // 图表类型名（备用）
  bar: BarChart3,
  pie: PieChart,
  line: LineChart,
  scatter: ScatterChart,
  area: AreaChart,
  radar: Radar,
  treemap: FolderTree,
  heatmap: Flame,
  funnel: GitBranch,
  sankey: GitBranch,
  mindmap: Brain,
  network: Network,
  table: Table2,
  grid: LayoutGrid,
};

export function getCategoryIcon(iconName: string): LucideIcon {
  return iconMap[iconName] ?? BarChart3;
}
