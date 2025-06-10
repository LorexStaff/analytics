import ProjectA from "../../../pages/Monetization/data/ProjectA.json";
import ProjectB from "../../../pages/Monetization/data/ProjectB.json";
import { ProjectData } from "../../../entities/Project/model/main/Project";

const addMissingProperties = (data: any): ProjectData => {
  const defaultHourlyData = {
    monetization: data.monthlyData?.["2025-04"]?.["2025-04-01"]?.["0:00"]
      ?.monetization || {
      purchasesInApp: { total: 0 },
      payingUsersPercentage: { total: 0 },
      inAppARPU: { total: 0 },
      totalARPU: { total: 0 },
      cumulativeTotal: { total: 0 },
    },
    VR: {},
    engagements: {},
    performance: {},
  };

  const processedData: ProjectData = {
    projectName: data.projectName,
    isVR: data.isVR,
    monthlyData: {},
  };

  for (const month in data.monthlyData) {
    processedData.monthlyData[month] = {};
    for (const day in data.monthlyData[month]) {
      processedData.monthlyData[month][day] = {};
      for (const hour in data.monthlyData[month][day]) {
        processedData.monthlyData[month][day][hour] = {
          ...defaultHourlyData,
          ...data.monthlyData[month][day][hour],
        };
      }
    }
  }

  return processedData;
};

const fetchFakeApi = (): Promise<ProjectData[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([addMissingProperties(ProjectA), addMissingProperties(ProjectB)]);
    }, 1000);
  });
};

export default fetchFakeApi;
