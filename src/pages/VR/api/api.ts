import ProjectB from "../../../pages/VR/data/ProjectB.json";
import { ProjectData } from "../../../entities/Project/model/main/Project";

const addMissingProperties = (data: any): ProjectData => {
  const defaultHourlyData = {
    VR: {
      vrFps: { "60": { value: 60, count: 0 } },
      latency: { "20": { value: 20, count: 0 } },
      resolution: { "1920x1080": { value: "1920x1080", count: 0 } },
      refreshRate: { "60": { value: 60, count: 0 } },
      sceneComplexity: { "1": { value: 1, count: 0 } },
      sessionDepth: { "30": { value: 30, count: 0 } },
      vrDevice: { "Oculus Rift": { value: "Oculus Rift", count: 0 } },
    },
    monetization: {},
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

const fetchVrMetricsApi = (): Promise<ProjectData[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([addMissingProperties(ProjectB)]);
    }, 1000);
  });
};

export default fetchVrMetricsApi;
