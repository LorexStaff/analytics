export interface ProjectData {
  name: string;
  data: {
    period: string;
    newUsers: number;
    activeUsers: number;
    revenueGrowth: number;
    arpu: number;
  }[];
}
