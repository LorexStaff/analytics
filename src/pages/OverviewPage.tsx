import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
import fetchFakeApi from "../data/fakeApi";
import styles from "./OverviewPage.module.scss";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ProjectData } from "../entities/Project";
import Widget from "../features/OverviewWidget/ui/Widget";
import ProjectTable from "../widgets/ProjectTable/ui/ProjectTable";
import AddWidgetModal from "../features/AddWidgetModal/ui/AddWidgetModal";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler
);

interface WidgetInterface {
  id: string;
  type: "chart";
  title: string;
  key: keyof Omit<ProjectData["data"][0], "period">;
}

const OverviewPage: React.FC = () => {
  const [widgets, setWidgets] = useState<WidgetInterface[]>([]);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProjects, setSelectedProjects] = useState<string[]>([]);
  const [sortedProjects, setSortedProjects] = useState<ProjectData[]>([]);
  const [expandedGraphIndex, setExpandedGraphIndex] = useState<number | null>(
    null
  );
  const navigate = useNavigate();
  const [sortConfig, setSortConfig] = useState<{
    key: keyof ProjectData["data"][0] | "name";
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
    const fetchData = async () => {
      try {
        const data = await fetchFakeApi();
        console.log("Данные успешно загружены:", data);
        setProjects(data);
        setSortedProjects(data);
        setLoading(false);
      } catch (error: any) {
        console.error("Ошибка при загрузке данных:", error.message);
        const errorCode = error.statusCode || 500;
        navigate(`/error/${errorCode}`, {
          state: { message: error.message },
        });
      }
    };

    fetchData();
  }, [navigate]);

  const handleCheckboxChange = (projectName: string) => {
    setSelectedProjects((prev) =>
      prev.includes(projectName)
        ? prev.filter((name) => name !== projectName)
        : [...prev, projectName]
    );
  };

  const handleMasterCheckboxChange = () => {
    if (selectedProjects.length === projects.length) {
      setSelectedProjects([]);
    } else {
      setSelectedProjects(projects.map((project) => project.name));
    }
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

  const handleAddWidget = (
    title: string,
    key: keyof Omit<ProjectData["data"][0], "period">
  ) => {
    if (!title || !key) return;

    const newWidget: WidgetInterface = {
      id: `widget-${Date.now()}`,
      type: "chart",
      title,
      key,
    };

    setWidgets((prev) => [...prev, newWidget]);
    setIsModalOpen(false);
  };

  const handleRemoveWidget = (id: string) => {
    setWidgets((prev) => prev.filter((widget) => widget.id !== id));
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

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
        <button
          className={styles.addButton}
          onClick={() => setIsModalOpen(true)}
        >
          Добавить
        </button>
      </div>

      <AddWidgetModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddWidget={handleAddWidget}
      />

      <div className={styles.container}>
        {loading ? (
          <p>Загрузка данных...</p>
        ) : (
          <>
            <div className={styles.widget}>
              <ProjectTable
                projects={sortedProjects}
                selectedProjects={selectedProjects}
                onCheckboxChange={handleCheckboxChange}
                onMasterCheckboxChange={handleMasterCheckboxChange}
                onSort={handleSort}
              />
            </div>

            {widgets.length > 0 && (
              <div
                className={styles.graphsContainer}
                style={{ display: "flex", flexWrap: "wrap" }}
              >
                {widgets.map((widget, index) => {
                  const chartData = createChartData(widget.key);
                  return (
                    <Widget
                      key={widget.id}
                      id={widget.id}
                      title={widget.title}
                      chartData={chartData}
                      isExpanded={expandedGraphIndex === index}
                      isDragging={draggedIndex === index}
                      onExpandToggle={() =>
                        setExpandedGraphIndex(
                          expandedGraphIndex === index ? null : index
                        )
                      }
                      onRemove={() => handleRemoveWidget(widget.id)}
                      onDragStart={() => handleDragStart(index)}
                      onDragOver={(e) => handleDragOver(e, index)}
                    />
                  );
                })}
              </div>
            )}

            {widgets.length === 0 && (
              <div className={styles.noDataMessage}>
                <p>
                  Нет выбранных виджетов. Добавьте виджеты через кнопку выше.
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default OverviewPage;
