import React from "react";
import styles from "./AddWidgetModal.module.scss";
import { ProjectData } from "../../../entities/Project";
import Select from "../../../shared/components/Select";
import Button from "../../../shared/components/Button/Button";
import { useTranslation } from "react-i18next";

interface WidgetInterface {
  id: string;
  title: string;
  key: keyof Omit<ProjectData["data"][0], "period">;
  type: "chart" | "table" | "barchart" | "piechart" | "area" | "number";
}

interface AddWidgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddWidget: (
    title: string,
    key: keyof Omit<ProjectData["data"][0], "period">,
    type: "chart" | "table" | "barchart" | "piechart" | "area" | "number"
  ) => void;
  savedWidgets: WidgetInterface[];
}

const AddWidgetModal: React.FC<AddWidgetModalProps> = ({
  isOpen,
  onClose,
  onAddWidget,
  savedWidgets,
}) => {
  const [selectedWidgetId, setSelectedWidgetId] = React.useState<string>("");
  const { t } = useTranslation();

  if (!isOpen) return null;

  const selectedWidget = savedWidgets.find(
    (widget) => widget.id === selectedWidgetId
  );

  const handleAddWidget = () => {
    if (selectedWidget) {
      onAddWidget(
        selectedWidget.title,
        selectedWidget.key,
        selectedWidget.type
      );
      setSelectedWidgetId("");
      onClose();
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <Button
          variant="gray"
          size="small"
          className={styles.closeButton}
          onClick={onClose}
        >
          ×
        </Button>

        <h2>{t("addWidgetModal.title")}</h2>

        <label>{t("addWidgetModal.selectWidget")}:</label>
        <Select
          options={[
            { value: "", label: t("addWidgetModal.selectWidget") },
            ...savedWidgets.map((widget) => ({
              value: widget.id,
              label: widget.title,
            })),
          ]}
          value={selectedWidgetId}
          onChange={(value) => setSelectedWidgetId(value)}
        />

        {selectedWidget && (
          <div className={styles.widgetInfo}>
            <p>
              <strong>{t("addWidgetModal.widgetInfo.title")}</strong>{" "}
              {selectedWidget.title}
            </p>
            <p>
              <strong>{t("addWidgetModal.widgetInfo.metric")}</strong>{" "}
              {selectedWidget.key.charAt(0).toUpperCase() +
                selectedWidget.key.slice(1)}
            </p>
            <p>
              <strong>{t("addWidgetModal.widgetInfo.chartType")}</strong>{" "}
              {selectedWidget.type.charAt(0).toUpperCase() +
                selectedWidget.type.slice(1)}
            </p>
          </div>
        )}

        <Button
          variant="primary"
          size="small"
          onClick={handleAddWidget}
          disabled={!selectedWidgetId}
        >
          {t("addWidgetModal.addChartButton")}
        </Button>
      </div>
    </div>
  );
};

export default AddWidgetModal;
