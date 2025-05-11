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
  const createChartData = () => {
    const labels = projects[0]?.data.map((item) => item.period) || [];
    const datasets = metrics.flatMap((metric, index) => {
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
      ];
      const colorIndex = index % colors.length;

      return projects.map((project) => ({
        label: `${project.name} - ${metric}`,
        data: project.data.map((item) => item[metric]),
        borderColor: colors[colorIndex].borderColor,
        backgroundColor: colors[colorIndex].backgroundColor,
        fill: type === "area",
      }));
    });

    return { labels, datasets };
  };

  const chartData = createChartData();

  const renderContent = () => {
    switch (type) {
      case "table":
        return (
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Проект</th>
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
          return <p>Нет данных для отображения</p>;
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
        return <div className={styles.number}>Пример числа: 123</div>;

      default:
        return null;
    }
  };

  return <div className={styles.widget}>{renderContent()}</div>;
};

export default Widget;
