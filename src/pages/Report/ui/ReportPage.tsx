import React, { useState, useEffect } from "react";
import styles from "./ReportsPage.module.scss";
import { useAppDispatch } from "../../../app/hooks";
import { addWidget } from "../../../features/ReportBuilder/model/slice";
import Widget from "../../../entities/Widget/ui/Widget";
import fetchFakeApi from "../../../data/fakeApi";
import { ProjectData } from "../../../entities/Project";
import saveIcon from "../assets/save-icon.svg";
import saveGreenIcon from "../assets/save-icon-green.svg";
import Select from "../../../shared/components/Select";
import Button from "../../../shared/components/Button/Button";

const ReportsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMetric, setSelectedMetric] =
    useState<keyof Omit<ProjectData["data"][0], "period">>("newUsers");
  const [widgetType, setWidgetType] = useState<
    "table" | "chart" | "barchart" | "piechart" | "area" | "number"
  >("chart");
  const [grouping, setGrouping] = useState<"country" | "gender" | "none">(
    "none"
  );
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchFakeApi();
        setProjects(data);
        setLoading(false);
      } catch (error: any) {
        console.error("Ошибка при загрузке данных:", error.message);
      }
    };
    fetchData();
  }, []);

  const handleSaveWidget = () => {
    const widgetData = {
      id: `widget-${Date.now()}`,
      type: widgetType,
      metrics: [selectedMetric],
      grouping,
      title: `${
        widgetType.charAt(0).toUpperCase() + widgetType.slice(1)
      } для ${selectedMetric} (${
        grouping === "none" ? "без группировки" : grouping
      })`,
    };
    dispatch(addWidget(widgetData));
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
    }, 1500);
  };

  return (
    <div className={styles.reportsPage}>
      <h1>Создание отчета</h1>
      <div className={styles.horizontalDropdowns}>
        <div className={styles.dropdownContainer}>
          <label htmlFor="metric-select">Выберите метрику:</label>
          <Select
            options={[
              { value: "newUsers", label: "Новые пользователи" },
              { value: "activeUsers", label: "Активные пользователи" },
              { value: "revenueGrowth", label: "Прирост прибыли" },
              { value: "arpu", label: "ARPU" },
            ]}
            value={selectedMetric}
            onChange={(value) =>
              setSelectedMetric(
                value as keyof Omit<ProjectData["data"][0], "period">
              )
            }
            placeholder="Выберите метрику"
          />
        </div>

        <div className={styles.dropdownContainer}>
          <label htmlFor="type-select">Выберите тип виджета:</label>
          <Select
            options={[
              { value: "table", label: "Таблица" },
              { value: "chart", label: "График" },
              { value: "barchart", label: "Столбчатая диаграмма" },
              { value: "piechart", label: "Круговая диаграмма" },
              { value: "area", label: "Area Chart" },
              { value: "number", label: "Число" },
            ]}
            value={widgetType}
            onChange={(value) =>
              setWidgetType(
                value as
                  | "table"
                  | "chart"
                  | "barchart"
                  | "piechart"
                  | "area"
                  | "number"
              )
            }
            placeholder="Выберите тип виджета"
          />
        </div>

        <div className={styles.dropdownContainer}>
          <label htmlFor="grouping-select">Выберите группировку:</label>
          <Select
            options={[
              { value: "none", label: "Без группировки" },
              { value: "country", label: "По странам" },
              { value: "gender", label: "По полу" },
            ]}
            value={grouping}
            onChange={(value) =>
              setGrouping(value as "country" | "gender" | "none")
            }
            placeholder="Выберите группировку"
          />
        </div>

        <Button
          variant="primary"
          size="medium"
          onClick={handleSaveWidget}
          className={styles.saveButton}
        >
          Сохранить виджет
          <img
            src={isSaved ? saveGreenIcon : saveIcon}
            alt="Save Icon"
            className={`${styles.icon} ${isSaved ? styles.saved : ""}`}
          />
        </Button>
      </div>

      <div className={styles.widgetWrapper}>
        <div className={styles.widgetPreview}>
          {loading ? (
            <p>Загрузка данных...</p>
          ) : (
            <Widget
              type={widgetType}
              metrics={[selectedMetric]}
              grouping={grouping}
              projects={projects}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
