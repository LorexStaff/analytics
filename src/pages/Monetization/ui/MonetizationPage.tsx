import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Widget from "../../../features/OverviewWidget/ui/Widget";
import fetchProjectData from "../api/api";
import { ProjectData } from "../../../entities/Project/model/main/Project";
import styles from "./MonetizationPage.module.scss";
import { WidgetConfig } from "../model/types";
import ProjectTable from "../../../widgets/ProjectTable/ui/ProjectTableMonetization";
import {
  GroupedMetric,
  MonetizationData,
} from "../../../entities/Project/model/metrics/Monetization";
import PeriodSelector from "../../../features/PeriodSelector/ui/PeriodSelector";

const MonetizationPage: React.FC = () => {
  const { t } = useTranslation();
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [loading, setLoading] = useState(true);
  const [customRange, setCustomRange] = useState<{
    start: Date;
    end: Date;
  } | null>(null);
  const [filteredData, setFilteredData] = useState<{
    [projectName: string]: {
      [day: string]: {
        [hour: string]: MonetizationData;
      };
    };
  }>({});
  const [selectedPeriod, setSelectedPeriod] = useState<string>("today");
  const [expandedGraphIndex, setExpandedGraphIndex] = useState<number | null>(
    null
  );
  const [sortConfig, setSortConfig] = useState<{
    key:
      | keyof ProjectData["monthlyData"]["2025-04"]["01"]["00:00"]["monetization"]
      | "projectName";
    direction: "asc" | "desc";
  } | null>(null);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [selectedProjects, setSelectedProjects] = useState<string[]>([]);
  const [widgets, setWidgets] = useState<WidgetConfig[]>([
    // 1. Круговая диаграмма (Pie Chart) - Покупки в приложении по устройствам для Project B
    {
      id: "widget-1",
      type: "piechart",
      title: `${t("monetization.purchasesByDevice")}`,
      metric: "purchasesInApp",
      grouping: "byDevice",
      projects: ["ProjectB"],
    },

    // 2. Столбчатая диаграмма (Bar Chart) - Покупки в приложении для Project A и B
    {
      id: "widget-2",
      type: "barchart",
      title: `${t("monetization.purchasesInApp")}`,
      metric: "purchasesInApp",
      projects: ["ProjectA", "ProjectB"],
    },
    // 3. График площади (Area Chart) - Процент платящих пользователей для Project A
    {
      id: "widget-3",
      type: "area",
      title: `${t("monetization.payingUsersPercentage")}`,
      metric: "payingUsersPercentage",
      projects: ["ProjectA"],
    },
    // 4. Линейный график (Line Chart) - Общий ARPU для Project A и B
    {
      id: "widget-4",
      type: "chart",
      title: `${t("monetization.totalArpu")}`,
      metric: "totalARPU",
      projects: ["ProjectA", "ProjectB"],
    },
    // 5. Круговая диаграмма (Pie Chart) - ARPU по странам для Project A
    {
      id: "widget-5",
      type: "piechart",
      title: `${t("monetization.arpuByCountry")}`,
      metric: "inAppARPU",
      grouping: "byCountry",
      projects: ["ProjectA"],
    },
    // 6. Столбчатая диаграмма (Bar Chart) - Общий доход по источникам трафика для Project A
    {
      id: "widget-6",
      type: "barchart",
      title: `${t("monetization.cumulativeTotalByTraffic")}`,
      metric: "cumulativeTotal",
      grouping: "byTrafficSource",
      projects: ["ProjectA"],
    },
    // 7. Линейный график (Line Chart) - ARPU внутри приложения для Project A и B
    {
      id: "widget-7",
      type: "chart",
      title: `${t("monetization.inAppArpu")}`,
      metric: "inAppARPU",
      projects: ["ProjectA", "ProjectB"],
    },
    // 8. График площади (Area Chart) - Накопленный общий доход для Project A
    {
      id: "widget-8",
      type: "area",
      title: `${t("monetization.cumulativeTotal")}`,
      metric: "cumulativeTotal",
      projects: ["ProjectA"],
    },
  ]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchProjectData();
        console.log("Данные успешно загружены:", data);
        setProjects(data);
        setLoading(false);
      } catch (error: any) {
        console.error("Ошибка при загрузке данных:", error.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <p>{t("monetization.loading")}</p>;
  }

  const handleCheckboxChange = (projectName: string) => {
    setSelectedProjects((prev) =>
      prev.includes(projectName)
        ? prev.filter((name) => name !== projectName)
        : [...prev, projectName]
    );
  };

  const filterDataByPeriod = (
    projectData: ProjectData,
    selectedPeriod: string,
    range?: { start: Date; end: Date }
  ) => {
    const today = "2025-06-30";
    const yesterday = "2025-06-29";

    const filteredData: {
      [day: string]: { [hour: string]: MonetizationData };
    } = {};

    Object.keys(projectData.monthlyData).forEach((month) => {
      Object.keys(projectData.monthlyData[month]).forEach((day) => {
        const dayDate = new Date(day);
        const isInRange =
          selectedPeriod === "today"
            ? day === today
            : selectedPeriod === "yesterday"
            ? day === yesterday
            : selectedPeriod === "last7Days"
            ? dayDate >= new Date("2025-06-23") && dayDate <= new Date(today)
            : selectedPeriod === "month"
            ? dayDate >= new Date("2025-06-01") && dayDate <= new Date(today)
            : selectedPeriod === "quarter"
            ? dayDate >= new Date("2025-04-01") && dayDate <= new Date(today)
            : selectedPeriod === "customRange" && range
            ? dayDate >= range.start && dayDate <= range.end
            : false;

        if (!isInRange) return;

        if (selectedPeriod === "today" || selectedPeriod === "yesterday") {
          filteredData[day] = {};
          for (let hour = 0; hour < 24; hour++) {
            const hourKey = `${hour}:00`;
            filteredData[day][hourKey] = projectData.monthlyData[month][day]?.[
              hourKey
            ]?.monetization || { total: 0 };
          }
        } else {
          filteredData[day] = Object.keys(
            projectData.monthlyData[month][day]
          ).reduce((acc, hour) => {
            const entry = projectData.monthlyData[month][day][hour];
            if (entry && entry.monetization) {
              acc[hour] = entry.monetization;
            } else {
              acc[hour] = {
                purchasesInApp: { total: 0 },
                payingUsersPercentage: { total: 0 },
                inAppARPU: { total: 0 },
                totalARPU: { total: 0 },
                cumulativeTotal: { total: 0 },
              };
            }
            return acc;
          }, {} as { [hour: string]: MonetizationData });
        }
      });
    });

    return filteredData;
  };

  const handlePeriodChange = (
    period: string,
    range?: { start: Date; end: Date }
  ) => {
    setSelectedPeriod(period);
    setCustomRange(range || null);

    if (projects.length > 0) {
      const aggregatedData = projects.reduce((acc, project) => {
        const projectData = filterDataByPeriod(project, period, range);
        return { ...acc, [project.projectName]: projectData };
      }, {} as { [projectName: string]: { [day: string]: { [hour: string]: MonetizationData } } });

      setFilteredData(aggregatedData);
    }
  };

  interface Dataset {
    label: string;
    data: number[];
    borderColor?: string;
    backgroundColor: string | string[];
    fill?: boolean;
  }

  const getChartData = (widget: WidgetConfig): any => {
    const filteredProjects = widget.projects.filter((project) =>
      selectedProjects.includes(project)
    );

    if (widget.grouping) {
      const aggregatedData = filteredProjects.reduce(
        (acc, projectName) => {
          const projectData = filteredData[projectName];
          if (!projectData) return acc;

          const groupedData = aggregateGroupedMetrics(
            projectData,
            widget.metric as keyof MonetizationData,
            widget.grouping as keyof GroupedMetric<number>,
            selectedPeriod
          );

          acc.datasets.push({
            label: `${projectName} - ${widget.metric} (${widget.grouping})`,
            data: Object.values(groupedData),
            backgroundColor: Object.keys(groupedData).map(() =>
              generateRandomColor()
            ),
          });

          if (acc.labels.length === 0) {
            acc.labels = Object.keys(groupedData);
          }

          return acc;
        },
        { labels: [] as string[], datasets: [] as Dataset[] }
      );

      return aggregatedData;
    } else {
      const labels = Object.keys(filteredData[filteredProjects[0]] || {});
      const datasets = filteredProjects.map((projectName, index) => {
        const projectData = filteredData[projectName];
        if (!projectData) return null;

        const data = labels.map((label) => {
          if (selectedPeriod === "today" || selectedPeriod === "yesterday") {
            return Object.keys(projectData[label]).map((hour) => {
              const metricValue = projectData[label][hour]?.[widget.metric];
              return metricValue?.total || 0;
            });
          } else {
            const dayHours = projectData[label];
            if (widget.metric === "payingUsersPercentage") {
              let sumUsers = 0;
              let sumPaying = 0;
              Object.keys(dayHours).forEach((hour) => {
                const hourData = dayHours[hour];
                const hourUsers = hourData.totalARPU?.total || 0;
                const hourPayPercent =
                  hourData.payingUsersPercentage?.total || 0;
                sumUsers += hourUsers;
                sumPaying += hourPayPercent * hourUsers;
              });
              return sumUsers > 0 ? sumPaying / sumUsers : 0;
            } else if (
              widget.metric === "inAppARPU" ||
              widget.metric === "totalARPU"
            ) {
              let sumUsers = 0;
              let sumRevenue = 0;
              Object.keys(dayHours).forEach((hour) => {
                const hourData = dayHours[hour];
                const hourUsers = hourData.totalARPU?.total || 0;
                const hourRevenue = hourData.cumulativeTotal?.total || 0;
                sumUsers += hourUsers;
                sumRevenue += hourRevenue;
              });
              return sumUsers > 0 ? sumRevenue / sumUsers : 0;
            } else {
              return Object.keys(dayHours).reduce((acc, hour) => {
                const metric = dayHours[hour]?.[widget.metric];
                return acc + (metric ? metric.total : 0);
              }, 0);
            }
          }
        });

        let finalData: number[];
        if (selectedPeriod === "today" || selectedPeriod === "yesterday") {
          finalData = ([] as number[]).concat(...(data as number[][]));
        } else {
          finalData = data as number[];
        }
        return {
          label: `${projectName} - ${widget.metric}`,
          data: finalData,
          borderColor:
            index === 0 ? "rgba(75,192,192,1)" : "rgba(153,102,255,1)",
          backgroundColor:
            index === 0 ? ["rgba(75,192,192,0.2)"] : ["rgba(153,102,255,0.2)"],
          fill: widget.type === "area",
        };
      });

      return {
        labels:
          selectedPeriod === "today" || selectedPeriod === "yesterday"
            ? labels.flatMap((label) =>
                Object.keys(filteredData[filteredProjects[0]][label])
              )
            : labels,
        datasets: datasets.filter((dataset) => dataset !== null) as Dataset[],
      };
    }
  };

  const generateRandomColor = (): string => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  const aggregateGroupedMetrics = (
    filteredData: { [day: string]: { [hour: string]: MonetizationData } },
    metricKey: keyof MonetizationData,
    groupingKey: keyof GroupedMetric<number>,
    selectedPeriod: string,
    customRange?: { start: Date; end: Date }
  ): Record<string, number> => {
    let totalUsers = 0;
    let totalRevenue = 0;
    const weightedPayCounts: Record<string, number> = {};
    const aggregatedData: Record<string, number> = {};

    Object.keys(filteredData).forEach((day) => {
      const dayDate = new Date(day);
      let isInPeriod = false;
      if (selectedPeriod === "customRange" && customRange) {
        isInPeriod = dayDate >= customRange.start && dayDate <= customRange.end;
      } else {
        isInPeriod =
          selectedPeriod === "today"
            ? day === "2025-06-30"
            : selectedPeriod === "yesterday"
            ? day === "2025-06-29"
            : selectedPeriod === "last7Days"
            ? dayDate >= new Date("2025-06-23") &&
              dayDate <= new Date("2025-06-30")
            : selectedPeriod === "month"
            ? dayDate >= new Date("2025-06-01") &&
              dayDate <= new Date("2025-06-30")
            : selectedPeriod === "quarter"
            ? dayDate >= new Date("2025-04-01") &&
              dayDate <= new Date("2025-06-30")
            : false;
      }
      if (!isInPeriod) return;

      Object.keys(filteredData[day]).forEach((hour) => {
        const currentData = filteredData[day][hour];

        const hourUsers = currentData.totalARPU?.total || 0;
        const hourRevenue = currentData.cumulativeTotal?.total || 0;
        totalUsers += hourUsers;
        totalRevenue += hourRevenue;

        const metricData = currentData?.[metricKey];
        if (metricData && metricData[groupingKey]) {
          const groupedMetric = metricData[groupingKey];
          if (typeof groupedMetric === "object" && groupedMetric !== null) {
            Object.entries(groupedMetric).forEach(([category, value]) => {
              if (metricKey === "payingUsersPercentage") {
                const hourPaying = value * hourUsers;
                weightedPayCounts[category] =
                  (weightedPayCounts[category] || 0) + hourPaying;
              } else {
                aggregatedData[category] =
                  (aggregatedData[category] || 0) + value;
              }
            });
          }
        }
      });
    });

    if (metricKey === "payingUsersPercentage") {
      Object.keys(weightedPayCounts).forEach((category) => {
        aggregatedData[category] =
          totalUsers > 0 ? weightedPayCounts[category] / totalUsers : 0;
      });
    }
    if (metricKey === "inAppARPU" || metricKey === "totalARPU") {
      Object.keys(aggregatedData).forEach((category) => {
        aggregatedData[category] =
          totalUsers > 0 ? totalRevenue / totalUsers : 0;
      });
    }

    return aggregatedData;
  };
  const handleExpandToggle = (index: number) => {
    setExpandedGraphIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  const handleDragOver = (
    event: React.DragEvent<HTMLDivElement>,
    index: number
  ) => {
    event.preventDefault();
    console.log("Drag over index:", index);

    if (draggedIndex === null || draggedIndex === index) return;

    const newWidgets = [...widgets];
    const [draggedWidget] = newWidgets.splice(draggedIndex, 1);
    newWidgets.splice(index, 0, draggedWidget);

    console.log("Updated widgets:", newWidgets);
    setWidgets(newWidgets);
    setDraggedIndex(index);
  };

  const handleSort = (key: string) => {
    let direction: "asc" | "desc" = "asc";

    const validKeys = [
      "inAppARPU",
      "payingUsersPercentage",
      "purchasesInApp",
      "cumulativeTotal",
      "totalARPU",
      "projectName",
    ] as const;

    if (!validKeys.includes(key as (typeof validKeys)[number])) {
      console.warn(`Invalid sort key: ${key}`);
      return;
    }

    if (sortConfig?.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }

    const sorted = [...projects].sort((a, b) => {
      const lastMonthA = Object.keys(a.monthlyData).pop() || "";
      const lastDayA = Object.keys(a.monthlyData[lastMonthA] || {}).pop() || "";
      const lastHourA =
        Object.keys(a.monthlyData[lastMonthA]?.[lastDayA] || {}).pop() || "";

      const lastMonthB = Object.keys(b.monthlyData).pop() || "";
      const lastDayB = Object.keys(b.monthlyData[lastMonthB] || {}).pop() || "";
      const lastHourB =
        Object.keys(b.monthlyData[lastMonthB]?.[lastDayB] || {}).pop() || "";

      const lastMonthDataA =
        a.monthlyData[lastMonthA]?.[lastDayA]?.[lastHourA]?.monetization;
      const lastMonthDataB =
        b.monthlyData[lastMonthB]?.[lastDayB]?.[lastHourB]?.monetization;

      if (key === "projectName") {
        return direction === "asc"
          ? a.projectName.localeCompare(b.projectName)
          : b.projectName.localeCompare(a.projectName);
      }

      const valueA = lastMonthDataA?.[key as keyof MonetizationData] || 0;
      const valueB = lastMonthDataB?.[key as keyof MonetizationData] || 0;

      if (valueA < valueB) return direction === "asc" ? -1 : 1;
      if (valueA > valueB) return direction === "asc" ? 1 : -1;
      return 0;
    });

    setProjects(sorted);
    setSortConfig({
      key: key as keyof MonetizationData | "projectName",
      direction,
    });
  };
  const handleMasterCheckboxChange = () => {
    if (selectedProjects.length === projects.length) {
      setSelectedProjects([]);
    } else {
      setSelectedProjects(projects.map((project) => project.projectName));
    }
  };

  const filteredWidgets = selectedProjects.length
    ? widgets.filter((widget) =>
        widget.projects.some((project) => selectedProjects.includes(project))
      )
    : [];

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{t("monetization.title")}</h1>

      <PeriodSelector onPeriodChange={handlePeriodChange} />

      <div className={styles.projectTableContainer}>
        <h2>{t("monetization.selectProjects")}</h2>
        <ProjectTable
          projects={projects}
          selectedPeriod={selectedPeriod}
          selectedProjects={selectedProjects}
          metrics={[
            "inAppARPU",
            "payingUsersPercentage",
            "purchasesInApp",
            "cumulativeTotal",
            "totalARPU",
          ]}
          onCheckboxChange={handleCheckboxChange}
          onMasterCheckboxChange={handleMasterCheckboxChange}
          onSort={handleSort}
        />
      </div>

      {selectedProjects.length === 0 ? (
        <div className={styles.noDataMessage}>
          <p>{t("monetization.noProjectsSelected")}</p>
        </div>
      ) : filteredWidgets.length === 0 ? (
        <div className={styles.noDataMessage}>
          <p>{t("monetization.noWidgetsAvailable")}</p>
        </div>
      ) : (
        <div className={styles.graphsContainer}>
          {filteredWidgets.map((widget, index) => (
            <Widget
              key={widget.id}
              id={widget.id}
              type={widget.type}
              title={widget.title}
              chartData={getChartData(widget)}
              isExpanded={expandedGraphIndex === index}
              isDragging={draggedIndex === index}
              selectedProject={null}
              onExpandToggle={() => handleExpandToggle(index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onRemove={() => console.log(`Удален виджет с ID: ${widget.id}`)}
              onDragStart={() => setDraggedIndex(index)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MonetizationPage;
