import {
  GroupedMetric,
  MonetizationData,
} from "../../../entities/Project/model/metrics/Monetization";

export interface WidgetConfig {
  id: string;
  type: "chart" | "table" | "barchart" | "piechart" | "area" | "number";
  title: string;
  metric: keyof MonetizationData;
  grouping?: keyof GroupedMetric<number>;
  projects: string[];
}

export interface MonetizationState {
  widgets: WidgetConfig[];
}
