// Force reload trigger: Optimized 5 templates and employee onboarding BPMN template
import { flowchartCategory } from './flowchart';
import { itArchitectureCategory } from './it-architecture';
import { networkTopologyCategory } from './network-topology';
import { engineeringCategory } from './engineering';
import { architectureCategory } from './architecture';
import { projectManagementCategory } from './project-management';
import { businessAnalysisCategory } from './business-analysis';
import { dataChartCategory } from './data-chart';
import { educationDesignCategory } from './education-design';
import type { ChartCategory } from '../../types';

export const ALL_CATEGORIES: ChartCategory[] = [
  flowchartCategory,
  itArchitectureCategory,
  networkTopologyCategory,
  engineeringCategory,
  architectureCategory,
  projectManagementCategory,
  businessAnalysisCategory,
  dataChartCategory,
  educationDesignCategory,
];
