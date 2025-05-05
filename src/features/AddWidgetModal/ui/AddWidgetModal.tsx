import React from "react";
import styles from "./AddWidgetModal.module.scss";
import { ProjectData } from "../../../entities/Project";

interface AddWidgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddWidget: (
    title: string,
    key: keyof Omit<ProjectData["data"][0], "period">
  ) => void;
}

const AddWidgetModal: React.FC<AddWidgetModalProps> = ({
  isOpen,
  onClose,
  onAddWidget,
}) => {
  const [newWidgetTitle, setNewWidgetTitle] = React.useState("");
  const [newWidgetKey, setNewWidgetKey] =
    React.useState<keyof Omit<ProjectData["data"][0], "period">>("newUsers");

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <button className={styles.closeButton} onClick={onClose}>
          ×
        </button>

        <h2>Добавить график</h2>

        <input
          type="text"
          placeholder="Заголовок графика"
          value={newWidgetTitle}
          onChange={(e) => setNewWidgetTitle(e.target.value)}
        />

        <select
          value={newWidgetKey}
          onChange={(e) =>
            setNewWidgetKey(
              e.target.value as keyof Omit<ProjectData["data"][0], "period">
            )
          }
        >
          <option value="newUsers">Новые пользователи</option>
          <option value="activeUsers">Активные пользователи</option>
          <option value="revenueGrowth">Прирост прибыли</option>
          <option value="arpu">ARPU</option>
        </select>

        <button
          onClick={() => {
            onAddWidget(newWidgetTitle, newWidgetKey);
            setNewWidgetTitle("");
            setNewWidgetKey("newUsers");
            onClose();
          }}
        >
          Добавить график
        </button>
      </div>
    </div>
  );
};

export default AddWidgetModal;
