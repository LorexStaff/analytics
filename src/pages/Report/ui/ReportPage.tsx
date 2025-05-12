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
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();

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
        grouping === "none"
          ? t("reportsPage.none")
          : t(`reportsPage.${grouping}`)
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
      <h1>{t("reportsPage.title")}</h1>
      <div className={styles.horizontalDropdowns}>
        <div className={styles.dropdownContainer}>
          <label htmlFor="metric-select">
            {t("reportsPage.selectMetric")}:
          </label>
          <Select
            options={[
              { value: "newUsers", label: t("projectTable.newUsers") },
              { value: "activeUsers", label: t("projectTable.activeUsers") },
              {
                value: "revenueGrowth",
                label: t("projectTable.revenueGrowth"),
              },
              { value: "arpu", label: t("projectTable.arpu") },
            ]}
            value={selectedMetric}
            onChange={(value) =>
              setSelectedMetric(
                value as keyof Omit<ProjectData["data"][0], "period">
              )
            }
            placeholderKey="reportsPage.selectMetric"
          />
        </div>

        <div className={styles.dropdownContainer}>
          <label htmlFor="type-select">
            {t("reportsPage.selectWidgetType")}:
          </label>
          <Select
            options={[
              { value: "table", label: t("widget.table") },
              { value: "chart", label: t("widget.chart") },
              { value: "barchart", label: t("widget.barchart") },
              { value: "piechart", label: t("widget.piechart") },
              { value: "area", label: t("widget.area") },
              { value: "number", label: t("widget.number") },
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
            placeholderKey="reportsPage.selectWidgetType"
          />
        </div>

        <div className={styles.dropdownContainer}>
          <label htmlFor="grouping-select">
            {t("reportsPage.selectGrouping")}:
          </label>
          <Select
            options={[
              { value: "none", label: t("reportsPage.none") },
              { value: "country", label: t("reportsPage.country") },
              { value: "gender", label: t("reportsPage.gender") },
            ]}
            value={grouping}
            onChange={(value) =>
              setGrouping(value as "country" | "gender" | "none")
            }
            placeholderKey="reportsPage.selectGrouping"
          />
        </div>

        <Button
          variant="primary"
          size="medium"
          onClick={handleSaveWidget}
          className={styles.saveButton}
        >
          {t("reportsPage.saveWidget")}
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
            <p>{t("reportsPage.loadingData")}</p>
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
