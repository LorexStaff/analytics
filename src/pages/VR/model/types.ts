import { GroupedMetrics } from "../../../entities/Project/model/metrics/VR";
import { VRMetrics } from "../../../entities/Project/model/metrics/VR";

export interface WidgetConfig {
  id: string;
  type: "piechart" | "barchart" | "chart" | "area";
  title: string;
  metric: keyof VRMetrics;
  grouping?: keyof GroupedMetrics<string>;
  projects: string[];
}
