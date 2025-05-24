import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line, Bar, Pie } from "react-chartjs-2";
import styles from "./Widget.module.scss";
import { ProjectData } from "../../Project";
import { useTranslation } from "react-i18next";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
  Filler
);

interface WidgetProps {
  type: "table" | "chart" | "barchart" | "piechart" | "area" | "number";
  metrics: Array<keyof Omit<ProjectData["data"][0], "period">>;
  grouping: "country" | "gender" | "none";
  projects: ProjectData[];
}

const Widget: React.FC<WidgetProps> = ({
  type,
  metrics,
  grouping,
  projects,
}) => {
  const { t } = useTranslation();

  const createChartData = () => {
    const labels = projects[0]?.data.map((item) => item.period) || [];

    const colors = [
      {
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
      },
      {
        borderColor: "rgba(255, 99, 132, 1)",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
      },
      {
        borderColor: "rgba(54, 162, 235, 1)",
        backgroundColor: "rgba(54, 162, 235, 0.2)",
      },
      {
        borderColor: "rgba(255, 159, 64, 1)",
        backgroundColor: "rgba(255, 159, 64, 0.2)",
      },
      {
        borderColor: "rgba(153, 102, 255, 1)",
        backgroundColor: "rgba(153, 102, 255, 0.2)",
      },
    ];

    const datasets = metrics.flatMap((metric) =>
      projects.map((project, projectIndex) => {
        const colorIndex = projectIndex % colors.length;
        return {
          label: `${project.name} - ${metric}`,
          data: project.data.map((item) => item[metric]),
          borderColor: colors[colorIndex].borderColor,
          backgroundColor: colors[colorIndex].backgroundColor,
          fill: type === "area",
        };
      })
    );

    return { labels, datasets };
  };
  const chartData = createChartData();

  const calculateNumberAndChange = (
    projects: ProjectData[],
    metric: keyof Omit<ProjectData["data"][0], "period">
  ) => {
    const data = projects[0]?.data;

    if (!data || data.length < 2) {
      return { current: 0, change: 0 };
    }

    const current = data[data.length - 1][metric];
    const previous = data[data.length - 2][metric];
    const change = previous !== 0 ? ((current - previous) / previous) * 100 : 0;

    return { current, change };
  };

  const renderContent = () => {
    switch (type) {
      case "table":
        return (
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>{t("widgetEntity.project")}</th>
                  {projects[0]?.data.map((item, index) => (
                    <th key={index}>{item.period}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {projects.map((project, projectIndex) => (
                  <tr key={projectIndex}>
                    <td>{project.name}</td>
                    {project.data.map((item, dataIndex) => (
                      <td key={dataIndex}>
                        {metrics.map((metric) => item[metric]).join(", ")}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );

      case "chart":
        return (
          <Line
            data={chartData}
            options={{
              plugins: {
                legend: { display: true },
              },
              scales: {
                x: { beginAtZero: false },
                y: { beginAtZero: false },
              },
              elements: {
                line: {
                  fill: false,
                },
              },
            }}
          />
        );

      case "barchart":
        return <Bar data={chartData} />;

      case "piechart":
        if (!chartData.datasets || chartData.datasets.length === 0) {
          return <p>{t("widgetEntity.noData")}</p>;
        }

        const pieDataset = chartData.datasets[0];

        return (
          <Pie
            data={{
              labels: chartData.labels,
              datasets: [
                {
                  ...pieDataset,
                  data: pieDataset.data,
                },
              ],
            }}
          />
        );

      case "area":
        return (
          <Line
            data={chartData}
            options={{
              plugins: {
                legend: { display: true },
              },
              scales: {
                x: { beginAtZero: false },
                y: { beginAtZero: false },
              },
              elements: {
                line: {
                  fill: true,
                },
              },
            }}
          />
        );

      case "number":
        const metric = metrics[0];
        const { current, change } = calculateNumberAndChange(projects, metric);

        return (
          <div className={styles.number}>
            <div className={styles.currentValue}>{current}</div>
            <div
              className={`${styles.changeValue} ${
                change >= 0 ? styles.positive : styles.negative
              }`}
            >
              {change >= 0 ? "+" : ""}
              {change.toFixed(2)}%
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return <div className={styles.widget}>{renderContent()}</div>;
};

export default Widget;
