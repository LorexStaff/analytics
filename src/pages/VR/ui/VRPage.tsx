import React, { useState, useEffect } from "react";
import { ProjectData } from "../../../entities/Project/model/main/Project";
import { useTranslation } from "react-i18next";
import styles from "./VRPage.module.scss";
import fetchVrMetricsApi from "../api/api";
import PeriodSelector from "../../../features/PeriodSelector/ui/PeriodSelector";
import ProjectTable from "../../../widgets/ProjectTable/ui/ProjectTableVR";
import Widget from "../../../features/OverviewWidget/ui/Widget";
import { WidgetConfig } from "../model/types";
import {
  VRMetrics,
  MetricValue,
} from "../../../entities/Project/model/metrics/VR";

const VRPage = () => {
  const { t } = useTranslation();
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState<string>("today");
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [expandedGraphIndex, setExpandedGraphIndex] = useState<number | null>(
    null
  );
  const [widgets, setWidgets] = useState<WidgetConfig[]>([
    // 1. Круговая диаграмма - FPS по устройствам
    {
      id: "widget-1",
      type: "area",
      title: `${t("vr.fps")}`,
      metric: "vrFps",
      projects: ["ProjectB"],
    },
    // 2. Столбчатая диаграмма - Задержка по странам
    {
      id: "widget-2",
      type: "barchart",
      title: `${t("vr.latency")}`,
      metric: "latency",
      projects: ["ProjectB"],
    },
    // 3. Линейный график - Глубина сессии
    {
      id: "widget-3",
      type: "chart",
      title: `${t("vr.sessionDepth")}`,
      metric: "sessionDepth",
      projects: ["ProjectB"],
    },
    // 4. График площади - Сложность сцены
    {
      id: "widget-4",
      type: "area",
      title: `${t("vr.sceneComplexity")}`,
      metric: "sceneComplexity",
      projects: ["ProjectB"],
    },
  ]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchVrMetricsApi();
        console.log("Fetched Projects Data:", data);
        setProjects(data);
        setLoading(false);
      } catch (error) {
        console.error("Ошибка при загрузке данных:", error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleDragOver = (
    event: React.DragEvent<HTMLDivElement>,
    index: number
  ) => {
    event.preventDefault();

    if (draggedIndex === null || draggedIndex === index) return;

    const newWidgets = [...widgets];
    const [draggedWidget] = newWidgets.splice(draggedIndex, 1);
    newWidgets.splice(index, 0, draggedWidget);

    setWidgets(newWidgets);
    setDraggedIndex(index);
  };

  const handlePeriodChange = (period: string) => {
    setSelectedPeriod(period);
  };

  const handleExpandToggle = (index: number) => {
    setExpandedGraphIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  const BASE_DATE = new Date("2025-06-30");

  function isSameDate(date1: Date, date2: Date): boolean {
    return (
      date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
    );
  }

  const isToday = (date: Date): boolean => isSameDate(date, BASE_DATE);

  const isYesterday = (date: Date): boolean => {
    const yesterday = new Date(BASE_DATE);
    yesterday.setDate(BASE_DATE.getDate() - 1);
    return isSameDate(date, yesterday);
  };

  const isWithinLastWeek = (date: Date): boolean => {
    const startDate = new Date(BASE_DATE);
    startDate.setDate(BASE_DATE.getDate() - 6);
    return date >= startDate && date <= BASE_DATE;
  };

  const isCurrentMonth = (date: Date): boolean =>
    date.getMonth() === BASE_DATE.getMonth() &&
    date.getFullYear() === BASE_DATE.getFullYear();

  const isCurrentQuarter = (date: Date): boolean => {
    const month = date.getMonth();
    return (
      date.getFullYear() === BASE_DATE.getFullYear() && month >= 3 && month <= 5
    );
  };

  function filterDataByPeriod(
    project: ProjectData,
    selectedPeriod: string
  ): { [day: string]: { [hour: string]: VRMetrics } } {
    const filteredData: { [day: string]: { [hour: string]: VRMetrics } } = {};

    Object.entries(project.monthlyData).forEach(([month, days]) => {
      Object.entries(days).forEach(([day, hours]) => {
        const fullDate = new Date(`${month}-${day}`);
        let match = false;

        if (selectedPeriod === "today") {
          match = isToday(fullDate);
        } else if (selectedPeriod === "yesterday") {
          match = isYesterday(fullDate);
        } else if (selectedPeriod === "last7Days") {
          match = isWithinLastWeek(fullDate);
        } else if (selectedPeriod === "month") {
          match = isCurrentMonth(fullDate);
        } else if (selectedPeriod === "quarter") {
          match = isCurrentQuarter(fullDate);
        }
        if (match) {
          const hoursVR: { [hour: string]: VRMetrics } = {};
          Object.entries(hours).forEach(([hour, record]) => {
            if (record.VR) {
              hoursVR[hour] = record.VR;
            }
          });
          if (Object.keys(hoursVR).length > 0) {
            filteredData[day] = hoursVR;
          }
        }
      });
    });

    return filteredData;
  }

  function aggregateDayMetrics(dayData: {
    [hour: string]: VRMetrics;
  }): VRMetrics {
    const aggregated: VRMetrics = {
      vrFps: {},
      latency: {},
      resolution: {},
      refreshRate: {},
      sceneComplexity: {},
      sessionDepth: {},
      vrDevice: {},
    };

    Object.values(dayData).forEach((vrMetrics) => {
      Object.entries(vrMetrics).forEach(([metricKey, groupedMetrics]) => {
        const key = metricKey as keyof VRMetrics;
        for (const category in groupedMetrics) {
          const metricValue = groupedMetrics[category];
          if (typeof metricValue.value === "number") {
            if (!aggregated[key][category]) {
              aggregated[key][category] = {
                value: 0,
                count: 0,
              } as MetricValue<number>;
            }
            aggregated[key][category].value =
              (aggregated[key][category].value as number) +
              (metricValue.value as number) * metricValue.count;
            aggregated[key][category].count += metricValue.count;
          } else {
            if (!aggregated[key][category]) {
              aggregated[key][category] = {
                value: metricValue.value,
                count: 1,
              } as MetricValue<string>;
            } else {
              aggregated[key][category].count += 1;
            }
          }
        }
      });
    });

    (Object.keys(aggregated) as (keyof VRMetrics)[]).forEach((key) => {
      for (const category in aggregated[key]) {
        const entry = aggregated[key][category];
        if (typeof entry.value === "number") {
          entry.value =
            entry.count > 0 ? (entry.value as number) / entry.count : 0;
        }
      }
    });

    return aggregated;
  }

  function getChartData(
    widget: { id: string; metric: string; type: string; projects: string[] },
    projects: ProjectData[],
    selectedPeriod: string
  ) {
    const filteredProjects = widget.projects
      .map((name) => projects.find((p) => p.projectName === name))
      .filter(Boolean) as ProjectData[];

    if (filteredProjects.length === 0) {
      console.warn(`Нет проектов для виджета ${widget.id}`);
      return { labels: [], datasets: [] };
    }

    const datasets: {
      label: string;
      data: number[];
      borderColor?: string | string[];
      backgroundColor: string | string[];
      fill?: boolean;
    }[] = [];
    const labelsSet = new Set<string>();

    filteredProjects.forEach((project, idx) => {
      const filtered = filterDataByPeriod(project, selectedPeriod);
      let labels: string[] = [];
      let values: number[] = [];
      const metricKey = widget.metric as keyof VRMetrics;

      if (selectedPeriod === "today" || selectedPeriod === "yesterday") {
        const dayKeys = Object.keys(filtered).sort();
        if (dayKeys.length > 0) {
          const hoursData = filtered[dayKeys[0]];
          labels = Object.keys(hoursData).sort(
            (a, b) => parseInt(a) - parseInt(b)
          );
          values = labels.map((hour) => {
            const vrMetrics = hoursData[hour];
            let sum = 0;
            let totCount = 0;
            Object.values(vrMetrics[metricKey]).forEach((entry) => {
              if (typeof entry.value === "number") {
                sum += entry.value * entry.count;
                totCount += entry.count;
              }
            });
            return totCount > 0 ? sum / totCount : 0;
          });
        }
      } else {
        const dayKeys = Object.keys(filtered).sort();
        labels = dayKeys;
        values = dayKeys.map((day) => {
          const dayData = filtered[day];
          const aggregatedMetrics = aggregateDayMetrics(dayData);
          let sum = 0;
          let totCount = 0;
          Object.values(aggregatedMetrics[metricKey]).forEach((entry) => {
            if (typeof entry.value === "number") {
              sum += entry.value * entry.count;
              totCount += entry.count;
            }
          });
          return totCount > 0 ? sum / totCount : 0;
        });
      }

      labels.forEach((l) => labelsSet.add(l));
      datasets.push({
        label: `${project.projectName} - ${widget.metric}`,
        data: values,
        borderColor: idx === 0 ? "rgba(75,192,192,1)" : "rgba(153,102,255,1)",
        backgroundColor:
          idx === 0 ? "rgba(75,192,192,0.2)" : "rgba(153,102,255,0.2)",
        fill: widget.type === "area",
      });
    });

    return { labels: Array.from(labelsSet).sort(), datasets };
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{t("vr.title")}</h1>

      <PeriodSelector onPeriodChange={handlePeriodChange} />

      <div className={styles.projectTableContainer}>
        <h2>{t("vr.selectProjects")}</h2>
        <ProjectTable
          projects={projects}
          metrics={[
            "vrFps",
            "latency",
            "resolution",
            "refreshRate",
            "sceneComplexity",
            "sessionDepth",
            "vrDevice",
          ]}
          onSort={function (key: string): void {
            throw new Error("Function not implemented.");
          }}
          selectedPeriod={""}
        />
      </div>

      <div className={styles.graphsContainer}>
        {widgets.map((widget, index) => (
          <Widget
            key={widget.id}
            id={widget.id}
            type={widget.type}
            title={widget.title}
            chartData={{
              labels: getChartData(widget, projects, selectedPeriod).labels,
              datasets: getChartData(widget, projects, selectedPeriod).datasets,
            }}
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
    </div>
  );
};

export default VRPage;
