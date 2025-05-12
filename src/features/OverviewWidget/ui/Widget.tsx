import React from "react";
import { Line, Bar, Pie } from "react-chartjs-2";
import styles from "./Widget.module.scss";
import binIcon from "../assets/bin.svg";
import Button from "../../../shared/components/Button/Button";
import { useTranslation } from "react-i18next";

interface WidgetProps {
  id: string;
  type: "chart" | "table" | "barchart" | "piechart" | "area" | "number";
  title: string;
  chartData: any;
  isExpanded: boolean;
  isDragging: boolean;
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
  onExpandToggle,
  onRemove,
  onDragStart,
  onDragOver,
}) => {
  const { t } = useTranslation();

  const renderTable = () => {
    if (!chartData.labels || !chartData.datasets) {
      return <p>{t("widget.noData")}</p>;
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
              <th>{t("widget.project")}</th>
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
        legend: { display: true },
      },
      scales: {
        x: { beginAtZero: false },
        y: { beginAtZero: false },
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
          return <p>{t("widget.noData")}</p>;
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
        return (
          <div className={styles.number}>
            {t("widget.exampleNumber", { value: 123 })}
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
            {isExpanded ? t("widget.collapse") : t("widget.expand")}
          </Button>
          <button className={styles.deleteButton} onClick={onRemove}>
            <img src={binIcon} alt="Bin icon" className={styles.binIcon} />
          </button>
        </div>
      </div>
      <div className={styles.chartContainer}>{renderChart()}</div>
    </div>
  );
};

export default Widget;
