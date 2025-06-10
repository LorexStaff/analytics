import React from "react";
import styles from "./ProjectTableMonetization.module.scss";
import { ProjectData } from "../../../entities/Project/model/main/Project";
import { useTranslation } from "react-i18next";

interface ProjectTableProps {
  projects: ProjectData[];
  selectedProjects: string[];
  metrics: Array<
    keyof ProjectData["monthlyData"]["2025-04"]["01"]["00:00"]["monetization"]
  >;
  selectedPeriod: string;
  customRange?: { start: Date; end: Date };
  onCheckboxChange: (projectName: string) => void;
  onMasterCheckboxChange: () => void;
  onSort: (
    key:
      | keyof ProjectData["monthlyData"]["2025-04"]["01"]["00:00"]["monetization"]
      | "projectName"
  ) => void;
}

const getPeriodRanges = (
  selectedPeriod: string,
  customRange?: { start: Date; end: Date }
) => {
  const today = new Date("2025-06-30");
  let currentStart: Date, currentEnd: Date, prevStart: Date, prevEnd: Date;

  switch (selectedPeriod) {
    case "today":
      currentStart = new Date(today);
      currentEnd = new Date(today);
      prevStart = new Date(today);
      prevStart.setDate(prevStart.getDate() - 1);
      prevEnd = new Date(prevStart);
      break;
    case "yesterday":
      currentEnd = new Date(today);
      currentEnd.setDate(currentEnd.getDate() - 1);
      currentStart = new Date(currentEnd);
      prevStart = new Date(currentEnd);
      prevStart.setDate(prevStart.getDate() - 1);
      prevEnd = new Date(prevStart);
      break;
    case "last7Days":
      currentEnd = new Date(today);
      currentStart = new Date(today);
      currentStart.setDate(currentStart.getDate() - 6);
      prevEnd = new Date(currentStart);
      prevEnd.setDate(prevEnd.getDate() - 1);
      prevStart = new Date(prevEnd);
      prevStart.setDate(prevStart.getDate() - 6);
      break;
    case "month":
      currentStart = new Date(today.getFullYear(), today.getMonth(), 1);
      currentEnd = new Date(today);
      prevEnd = new Date(currentStart);
      prevEnd.setDate(0);
      prevStart = new Date(prevEnd.getFullYear(), prevEnd.getMonth(), 1);
      break;
    case "quarter":
      {
        const month = today.getMonth();
        const quarterStartMonth = month - (month % 3);
        currentStart = new Date(today.getFullYear(), quarterStartMonth, 1);
        currentEnd = new Date(today);
        if (quarterStartMonth === 0) {
          prevEnd = new Date(today.getFullYear() - 1, 11, 31);
          prevStart = new Date(today.getFullYear() - 1, 9, 1);
        } else {
          prevEnd = new Date(today.getFullYear(), quarterStartMonth, 0);
          prevStart = new Date(today.getFullYear(), quarterStartMonth - 3, 1);
        }
      }
      break;
    case "customRange":
      if (customRange) {
        currentStart = customRange.start;
        currentEnd = customRange.end;
        const diffDays =
          Math.floor(
            (currentEnd.getTime() - currentStart.getTime()) / (1000 * 3600 * 24)
          ) + 1;
        prevEnd = new Date(currentStart);
        prevEnd.setDate(prevEnd.getDate() - 1);
        prevStart = new Date(prevEnd);
        prevStart.setDate(prevStart.getDate() - diffDays + 1);
      } else {
        currentStart = today;
        currentEnd = today;
        prevStart = new Date(today);
        prevStart.setDate(prevStart.getDate() - 1);
        prevEnd = new Date(prevStart);
      }
      break;
    default:
      currentStart = new Date(today);
      currentEnd = new Date(today);
      prevStart = new Date(today);
      prevStart.setDate(prevStart.getDate() - 1);
      prevEnd = new Date(prevStart);
      break;
  }

  return { currentStart, currentEnd, prevStart, prevEnd };
};

const aggregateMetrics = (
  project: ProjectData,
  start: Date,
  end: Date
): Record<string, number> => {
  const aggregated: Record<string, number> = {
    purchasesInApp: 0,
    payingUsersPercentage: 0,
    inAppARPU: 0,
    totalARPU: 0,
    cumulativeTotal: 0,
  };

  let totalUsersForPay = 0;
  let sumWeightedPay = 0;

  let totalUsersForARPU = 0;
  let totalRevenueForARPU = 0;

  Object.keys(project.monthlyData).forEach((month) => {
    const monthData = project.monthlyData[month];
    Object.keys(monthData).forEach((dayStr) => {
      const dayDate = new Date(dayStr);
      if (dayDate >= start && dayDate <= end) {
        const dayData = monthData[dayStr];
        Object.keys(dayData).forEach((hour) => {
          const monetization = dayData[hour].monetization;
          aggregated.purchasesInApp += monetization.purchasesInApp.total;
          aggregated.cumulativeTotal += monetization.cumulativeTotal.total;

          const hourUsers = monetization.totalARPU?.total || 0;
          const hourPayPercent = monetization.payingUsersPercentage?.total || 0;
          totalUsersForPay += hourUsers;
          sumWeightedPay += hourPayPercent * hourUsers;

          totalUsersForARPU += hourUsers;
          totalRevenueForARPU += monetization.cumulativeTotal.total;
        });
      }
    });
  });

  aggregated.payingUsersPercentage =
    totalUsersForPay > 0 ? sumWeightedPay / totalUsersForPay : 0;
  aggregated.inAppARPU =
    totalUsersForARPU > 0 ? totalRevenueForARPU / totalUsersForARPU : 0;
  aggregated.totalARPU = aggregated.inAppARPU;

  return aggregated;
};

const ProjectTable: React.FC<ProjectTableProps> = ({
  projects,
  selectedProjects,
  metrics,
  selectedPeriod,
  customRange,
  onCheckboxChange,
  onMasterCheckboxChange,
  onSort,
}) => {
  const { t } = useTranslation();

  const { currentStart, currentEnd, prevStart, prevEnd } = getPeriodRanges(
    selectedPeriod,
    customRange
  );

  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th>
            <input
              type="checkbox"
              checked={
                projects.length > 0 &&
                selectedProjects.length === projects.length
              }
              onChange={onMasterCheckboxChange}
            />
          </th>
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
              <td data-label={t("projectTable.select")}>
                <input
                  type="checkbox"
                  checked={selectedProjects.includes(project.projectName)}
                  onChange={() => onCheckboxChange(project.projectName)}
                />
              </td>
              <td data-label={t("projectTable.project")}>
                {t(`projectTable.${project.projectName}`)}
              </td>
              {metrics.map((metric) => {
                const currentValue = currentMetrics[metric] || 0;
                const previousValue = previousMetrics[metric] || 0;
                const change =
                  previousValue !== 0
                    ? ((currentValue - previousValue) / previousValue) * 100
                    : 0;
                return (
                  <td key={metric} data-label={t(`projectTable.${metric}`)}>
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
