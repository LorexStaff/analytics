import React, { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";
import fakeApi from "../data/fakeApi.json";
import styles from "./OverviewPage.module.scss";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ProjectData } from "../entities/Project";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler
);

const OverviewPage: React.FC = () => {
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProjects, setSelectedProjects] = useState<string[]>([]);
  const [sortedProjects, setSortedProjects] = useState<ProjectData[]>([]);
  const [expandedGraphIndex, setExpandedGraphIndex] = useState<number | null>(
    null
  );
  const [sortConfig, setSortConfig] = useState<{
    key: keyof (typeof projects)[0]["data"][0] | "name";
    direction: "asc" | "desc";
  } | null>(null);
  const [period, setPeriod] = useState<
    "today" | "yesterday" | "week" | "month" | "quarter" | "range"
  >("quarter");
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([
    null,
    null,
  ]);

  useEffect(() => {
    try {
      console.log("Данные успешно загружены:", fakeApi);
      setProjects(fakeApi);
      setSortedProjects(fakeApi);
      setLoading(false);
    } catch (error) {
      console.error("Ошибка при загрузке данных:", error);
      setLoading(false);
    }
  }, []);

  const handleCheckboxChange = (projectName: string) => {
    setSelectedProjects((prev) =>
      prev.includes(projectName)
        ? prev.filter((name) => name !== projectName)
        : [...prev, projectName]
    );
  };

  type Period = "today" | "yesterday" | "week" | "month" | "quarter" | "range";

  const filterDataByPeriod = (
    data: ProjectData[],
    period: Period,
    dateRange?: [Date | null, Date | null]
  ): ProjectData[] => {
    if (!data.length) return [];

    const today = new Date("2025-06-30");
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    const weekAgo = new Date(today);
    weekAgo.setDate(today.getDate() - 7);

    const monthStart = new Date(today);
    monthStart.setDate(1);

    const quarterStart = new Date(today);
    quarterStart.setMonth(today.getMonth() - 3);

    const formatDate = (date: Date): string =>
      `${String(date.getDate()).padStart(2, "0")}.${String(
        date.getMonth() + 1
      ).padStart(2, "0")}`;

    const parseDate = (period: string): Date =>
      new Date(`2025-${period.split(".").reverse().join("-")}`);

    switch (period) {
      case "today":
        const todayFormatted = formatDate(today);
        return data.map((project) => ({
          ...project,
          data: project.data.filter((item) => item.period === todayFormatted),
        }));
      case "yesterday":
        const yesterdayFormatted = formatDate(yesterday);
        return data.map((project) => ({
          ...project,
          data: project.data.filter(
            (item) => item.period === yesterdayFormatted
          ),
        }));
      case "week":
        return data.map((project) => ({
          ...project,
          data: project.data.filter(
            (item) =>
              parseDate(item.period) >= weekAgo &&
              parseDate(item.period) <= today
          ),
        }));
      case "month":
        return data.map((project) => ({
          ...project,
          data: project.data.filter(
            (item) =>
              parseDate(item.period) >= monthStart &&
              parseDate(item.period) <= today
          ),
        }));
      case "quarter":
        return data.map((project) => ({
          ...project,
          data: project.data.filter(
            (item) =>
              parseDate(item.period) >= quarterStart &&
              parseDate(item.period) <= today
          ),
        }));
      case "range":
        const [startDate, endDate] = dateRange || [null, null];
        if (!startDate || !endDate) return data;

        const startFormatted = formatDate(startDate);
        const endFormatted = formatDate(endDate);

        return data.map((project) => ({
          ...project,
          data: project.data.filter(
            (item) =>
              item.period >= startFormatted && item.period <= endFormatted
          ),
        }));
      default:
        return data;
    }
  };

  const filteredProjects = filterDataByPeriod(projects, period, dateRange);

  const handleSort = (key: keyof (typeof projects)[0]["data"][0] | "name") => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig?.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }

    const sorted = [...filteredProjects].sort((a, b) => {
      const lastMonthA = a.data[a.data.length - 1];
      const lastMonthB = b.data[b.data.length - 1];

      if (key === "name") {
        return direction === "asc"
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      }

      if (lastMonthA[key] < lastMonthB[key])
        return direction === "asc" ? -1 : 1;
      if (lastMonthA[key] > lastMonthB[key])
        return direction === "asc" ? 1 : -1;
      return 0;
    });

    setSortedProjects(sorted);
    setSortConfig({ key, direction });
  };

  const periods = filteredProjects[0]?.data.map((item) => item.period) || [];

  const chartColors = [
    {
      borderColor: "rgba(255, 99, 132, 1)",
      backgroundColor: "rgba(255, 99, 132, 0.2)",
    },
    {
      borderColor: "rgba(54, 162, 235, 1)",
      backgroundColor: "rgba(54, 162, 235, 0.2)",
    },
  ];

  const createChartData = (
    key: keyof Omit<(typeof projects)[0]["data"][0], "period">
  ) => ({
    labels: periods,
    datasets: sortedProjects
      .filter((project) => selectedProjects.includes(project.name))
      .map((project, index) => {
        const colorIndex = index % chartColors.length;
        return {
          label: project.name,
          data: project.data.map((item) => item[key]),
          borderColor: chartColors[colorIndex].borderColor,
          backgroundColor: chartColors[colorIndex].backgroundColor,
          fill: true,
        };
      }),
  });

  const newUsersChartData = createChartData("newUsers");
  const activeUsersChartData = createChartData("activeUsers");

  return (
    <div>
      <h1 className={styles.title}>Обзор проектов</h1>

      <div className={styles.periodSelector}>
        <label>Выберите период:</label>

        {["today", "yesterday", "week", "month", "quarter", "range"].map(
          (periodOption) => (
            <button
              key={periodOption}
              className={`${styles.periodButton} ${
                period === periodOption ? styles.active : ""
              }`}
              onClick={() => setPeriod(periodOption as any)}
            >
              {periodOption.charAt(0).toUpperCase() + periodOption.slice(1)}
            </button>
          )
        )}
        {period === "range" && (
          <div>
            <DatePicker
              selectsRange
              startDate={dateRange[0]}
              endDate={dateRange[1]}
              onChange={(update) => setDateRange(update)}
              dateFormat="dd.MM.yyyy"
              placeholderText="Выберите диапазон дат"
              className={styles.datePickerInput}
            />
          </div>
        )}
      </div>

      <div className={styles.container}>
        {loading ? (
          <p>Загрузка данных...</p>
        ) : (
          <>
            <div className={styles.widget}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>
                      <input
                        type="checkbox"
                        checked={
                          selectedProjects.length === projects.length &&
                          projects.length > 0
                        }
                        onChange={() =>
                          setSelectedProjects(
                            selectedProjects.length === projects.length
                              ? []
                              : projects.map((project) => project.name)
                          )
                        }
                      />
                    </th>
                    <th onClick={() => handleSort("name")}>Проект</th>
                    <th onClick={() => handleSort("newUsers")}>
                      Новые пользователи
                    </th>
                    <th onClick={() => handleSort("activeUsers")}>
                      Активные пользователи
                    </th>
                    <th onClick={() => handleSort("revenueGrowth")}>
                      Прирост прибыли
                    </th>
                    <th onClick={() => handleSort("arpu")}>ARPU</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedProjects.map((project) => {
                    const lastMonthData =
                      project.data[project.data.length - 1] || project.data[0];
                    return (
                      <tr key={project.name}>
                        <td>
                          <input
                            type="checkbox"
                            checked={selectedProjects.includes(project.name)}
                            onChange={() => handleCheckboxChange(project.name)}
                          />
                        </td>
                        <td>{project.name}</td>
                        <td>{lastMonthData.newUsers}</td>
                        <td>{lastMonthData.activeUsers}</td>
                        <td>{lastMonthData.revenueGrowth}</td>
                        <td>{lastMonthData.arpu}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {selectedProjects.length > 0 && (
              <div className={styles.graphsContainer}>
                {[
                  {
                    title: "График новых пользователей",
                    data: newUsersChartData,
                  },
                  {
                    title: "График активных пользователей",
                    data: activeUsersChartData,
                  },
                ].map(({ title, data }, index) => (
                  <div
                    key={title}
                    className={`${styles.graphWidget} ${
                      expandedGraphIndex === index ? styles.expanded : ""
                    }`}
                  >
                    <div className={styles.chartHeader}>
                      <h2 className={styles.widgetTitle}>{title}</h2>
                      <button
                        className={styles.expandButton}
                        onClick={() =>
                          setExpandedGraphIndex(
                            expandedGraphIndex === index ? null : index
                          )
                        }
                      >
                        {expandedGraphIndex === index
                          ? "Свернуть"
                          : "Развернуть"}
                      </button>
                    </div>
                    <div className={styles.chartContainer}>
                      <Line
                        data={data}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {selectedProjects.length === 0 && (
              <div className={styles.noDataMessage}>
                <p>Выберите проекты для отображения графиков.</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default OverviewPage;
