import React from "react";
import { ProjectData } from "../../../entities/Project/model/main/Project";
import styles from "./ProjectTable.module.scss";
import { useTranslation } from "react-i18next";
import { VRMetrics } from "../../../entities/Project/model/metrics/VR";

interface ProjectTableProps {
  projects: ProjectData[];
  metrics: Array<keyof VRMetrics>;
  onSort: (key: string) => void;
  selectedPeriod: string;
}

const getPeriodRanges = (
  selectedPeriod: string
): { currentStart: Date; currentEnd: Date; prevStart: Date; prevEnd: Date } => {
  const today = new Date("2025-06-30");
  switch (selectedPeriod) {
    case "today":
      return {
        currentStart: new Date(today),
        currentEnd: new Date(today),
        prevStart: new Date(today.setDate(today.getDate() - 1)),
        prevEnd: new Date(today.setDate(today.getDate() - 1)),
      };
    case "yesterday":
      return {
        currentStart: new Date(today.setDate(today.getDate() - 1)),
        currentEnd: new Date(today.setDate(today.getDate() - 1)),
        prevStart: new Date(today.setDate(today.getDate() - 2)),
        prevEnd: new Date(today.setDate(today.getDate() - 2)),
      };
    case "last7Days":
      return {
        currentStart: new Date(today.setDate(today.getDate() - 7)),
        currentEnd: new Date(today),
        prevStart: new Date(today.setDate(today.getDate() - 14)),
        prevEnd: new Date(today.setDate(today.getDate() - 8)),
      };
    case "month":
      return {
        currentStart: new Date(today.getFullYear(), today.getMonth(), 1),
        currentEnd: today,
        prevStart: new Date(today.getFullYear(), today.getMonth() - 1, 1),
        prevEnd: new Date(today.getFullYear(), today.getMonth(), 0),
      };
    default:
      return {
        currentStart: new Date("2025-04-01"),
        currentEnd: new Date("2025-06-30"),
        prevStart: new Date("2025-01-01"),
        prevEnd: new Date("2025-03-31"),
      };
  }
};

const aggregateMetrics = (
  project: ProjectData,
  start: Date,
  end: Date
): Record<string, number> => {
  const aggregated: Record<string, number> = {};

  Object.keys(project.monthlyData).forEach((month) => {
    const monthDate = new Date(month);
    if (monthDate < start || monthDate > end) return;

    Object.keys(project.monthlyData[month]).forEach((day) => {
      const dayDate = new Date(`${month}-${day}`);
      if (dayDate < start || dayDate > end) return;

      Object.keys(project.monthlyData[month][day]).forEach((hour) => {
        const hourData = project.monthlyData[month][day][hour];
      });
    });
  });

  return aggregated;
};

const ProjectTable: React.FC<ProjectTableProps> = ({
  projects,
  metrics,
  onSort,
  selectedPeriod,
}) => {
  const { t } = useTranslation();

  const { currentStart, currentEnd, prevStart, prevEnd } =
    getPeriodRanges(selectedPeriod);

  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th onClick={() => onSort("projectName")}>
            {t("projectTable.project")}
          </th>

          {metrics.map((metric) => (
            <th key={metric} onClick={() => onSort(metric)}>
              {t(`projectTable.${metric}`)}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {projects.map((project) => {
          const currentMetrics = aggregateMetrics(
            project,
            currentStart,
            currentEnd
          );
          const previousMetrics = aggregateMetrics(project, prevStart, prevEnd);

          return (
            <tr key={project.projectName}>
              <td>{t(`projectTable.${project.projectName}`)}</td>

              {metrics.map((metric) => {
                const currentValue = currentMetrics[metric] || 0;
                const previousValue = previousMetrics[metric] || 0;

                const change =
                  previousValue !== 0
                    ? ((currentValue - previousValue) / previousValue) * 100
                    : 0;

                return (
                  <td key={metric}>
                    {Math.round(currentValue)}{" "}
                    <span
                      className={
                        change >= 0 ? styles.positive : styles.negative
                      }
                    >
                      ({change >= 0 ? "+" : ""}
                      {Math.round(change)}%)
                    </span>
                  </td>
                );
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default ProjectTable;
