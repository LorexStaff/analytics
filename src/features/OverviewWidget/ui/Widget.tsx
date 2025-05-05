import React from "react";
import { Line } from "react-chartjs-2";
import styles from "./Widget.module.scss";
import binIcon from "../assets/bin.svg";

interface WidgetProps {
  id: string;
  title: string;
  chartData: any;
  isExpanded: boolean;
  isDragging: boolean;
  onExpandToggle: () => void;
  onRemove: () => void;
  onDragStart: () => void;
  onDragOver: (event: React.DragEvent<HTMLDivElement>) => void;
}

const Widget: React.FC<WidgetProps> = ({
  id,
  title,
  chartData,
  isExpanded,
  isDragging,
  onExpandToggle,
  onRemove,
  onDragStart,
  onDragOver,
}) => {
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
          <button className={styles.expandButton} onClick={onExpandToggle}>
            {isExpanded ? "Свернуть" : "Развернуть"}
          </button>
          <button className={styles.deleteButton} onClick={onRemove}>
            <img src={binIcon} alt="Bin icon" className={styles.binIcon} />
          </button>
        </div>
      </div>
      <div className={styles.chartContainer}>
        <Line
          data={chartData}
          options={{
            responsive: true,
            maintainAspectRatio: false,
          }}
        />
      </div>
    </div>
  );
};

export default Widget;
