import { EngagementMetrics } from "../metrics/Engagement";
import { MonetizationData } from "../metrics/Monetization";
import { PerformanceMetrics } from "../metrics/Performance";
import { VRMetrics } from "../metrics/VR";

export interface ProjectData {
  projectName: string;
  isVR: boolean;
  monthlyData: {
    [month: string]: {
      [day: string]: {
        [hour: string]: {
          monetization: MonetizationData;
          VR: VRMetrics;
          engagements: EngagementMetrics;
          performance: PerformanceMetrics;
        };
      };
    };
  };
}
