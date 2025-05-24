import React from "react";
import { Line, Bar, Pie } from "react-chartjs-2";
import { Chart } from "chart.js";
import zoomPlugin from "chartjs-plugin-zoom";
import styles from "./Widget.module.scss";
import binIcon from "../assets/bin.svg";
import Button from "../../../shared/components/Button/Button";
import { useTranslation } from "react-i18next";

Chart.register(zoomPlugin);

interface WidgetProps {
  id: string;
  type: "chart" | "table" | "barchart" | "piechart" | "area" | "number";
  title: string;
  chartData: any;
  isExpanded: boolean;
  isDragging: boolean;
  selectedProject: string | null;
  onExpandToggle: () => void;
  onRemove: () => void;
  onDragStart: () => void;
  onDragOver: (event: React.DragEvent<HTMLDivElement>) => void;
}

interface TableRow {
  Period: string;
  [key: string]: string | number;
}

const Widget: React.FC<WidgetProps> = ({
  id,
  type,
  title,
  chartData,
  isExpanded,
  isDragging,
  selectedProject,
  onExpandToggle,
  onRemove,
  onDragStart,
  onDragOver,
}) => {
  const { t } = useTranslation();

  const calculateNumberAndChange = () => {
    if (!chartData || !chartData.datasets || chartData.datasets.length === 0) {
      return { current: 0, change: 0 };
    }

    const dataset = chartData.datasets[0];
    const data = dataset.data;

    if (data.length < 2) {
      return { current: data[data.length - 1] || 0, change: 0 };
    }

    const current = data[data.length - 1];
    const previous = data[data.length - 2];

    const change = previous !== 0 ? ((current - previous) / previous) * 100 : 0;

    return { current, change };
  };

  const renderTable = () => {
    if (!chartData.labels || !chartData.datasets) {
      return <p>{t("widgetOverview.noData")}</p>;
    }

    const rows: TableRow[] = chartData.datasets.map((dataset: any) => {
      const row: TableRow = { Period: dataset.label };
      chartData.labels.forEach((label: string, index: number) => {
        row[label] = dataset.data[index];
      });
      return row;
    });

    return (
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>{t("widgetOverview.project")}</th>
              {chartData.labels.map((label: string) => (
                <th key={label}>{label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row: TableRow, rowIndex: number) => (
              <tr key={rowIndex}>
                <td>{row.Period}</td>
                {chartData.labels.map((label: string) => (
                  <td key={label}>{row[label]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const renderChart = () => {
    const commonOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
        },
        zoom: {
          zoom: {
            wheel: {
              enabled: true,
            },
            pinch: {
              enabled: true,
            },
            mode: "xy" as const,
          },
          pan: {
            enabled: true,
            mode: "xy" as const,
          },
        },
      },
      scales: {
        x: {
          beginAtZero: false,
        },
        y: {
          beginAtZero: false,
        },
      },
    };

    switch (type) {
      case "chart":
        return (
          <Line
            data={chartData}
            options={{
              ...commonOptions,
              elements: {
                line: {
                  fill: false,
                },
              },
            }}
          />
        );

      case "barchart":
        return <Bar data={chartData} options={commonOptions} />;

      case "piechart":
        if (!chartData.datasets || chartData.datasets.length === 0) {
          return <p>{t("widgetOverview.noData")}</p>;
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
            options={{
              responsive: true,
              maintainAspectRatio: false,
            }}
          />
        );

      case "area":
        return (
          <Line
            data={chartData}
            options={{
              ...commonOptions,
              elements: {
                line: {
                  fill: true,
                },
              },
            }}
          />
        );

      case "number":
        const { current, change } = calculateNumberAndChange();
        return (
          <div className={styles.number}>
            <div className={styles.currentValue}>{current.toFixed(2)}</div>
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

      case "table":
        return renderTable();

      default:
        return null;
    }
  };

  return (
    <div
      key={id}
      draggable
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      className={`${styles.graphWidget} ${isExpanded ? styles.expanded : ""} ${
        isDragging ? styles.dragging : ""
      }`}
    >
      <div className={styles.chartHeader}>
        <h2 className={styles.widgetTitle}>{title}</h2>
        <div className={styles.chartActions}>
          <Button
            variant="primary"
            size="small"
            className={styles.expandButton}
            onClick={onExpandToggle}
          >
            {isExpanded
              ? t("widgetOverview.collapse")
              : t("widgetOverview.expand")}
          </Button>
          {selectedProject !== "project.all_projects" && (
            <button className={styles.deleteButton} onClick={onRemove}>
              <img src={binIcon} alt="Bin icon" className={styles.binIcon} />
            </button>
          )}
        </div>
      </div>
      <div className={styles.chartContainer}>{renderChart()}</div>
    </div>
  );
};

export default Widget;
