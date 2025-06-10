import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import styles from "./PeriodSelector.module.scss";

interface PeriodSelectorProps {
  onPeriodChange: (period: string, range?: { start: Date; end: Date }) => void;
}

const PeriodSelector: React.FC<PeriodSelectorProps> = ({ onPeriodChange }) => {
  const [selectedPeriod, setSelectedPeriod] = useState<string>("today");
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([
    null,
    null,
  ]);
  const [startDate, endDate] = dateRange;

  const handlePeriodClick = (period: string) => {
    setSelectedPeriod(period);
    if (period === "customRange") {
      return;
    }
    onPeriodChange(period);
  };

  const handleDateRangeChange = (update: [Date | null, Date | null]) => {
    setDateRange(update);
    if (update[0] && update[1]) {
      onPeriodChange("customRange", { start: update[0], end: update[1] });
    }
  };

  return (
    <div className={styles.periodSelector}>
      <button
        className={`${styles.periodButton} ${
          selectedPeriod === "yesterday" ? styles.active : ""
        }`}
        onClick={() => handlePeriodClick("yesterday")}
      >
        Вчера
      </button>
      <button
        className={`${styles.periodButton} ${
          selectedPeriod === "today" ? styles.active : ""
        }`}
        onClick={() => handlePeriodClick("today")}
      >
        Сегодня
      </button>
      <button
        className={`${styles.periodButton} ${
          selectedPeriod === "last7Days" ? styles.active : ""
        }`}
        onClick={() => handlePeriodClick("last7Days")}
      >
        Неделя
      </button>
      <button
        className={`${styles.periodButton} ${
          selectedPeriod === "month" ? styles.active : ""
        }`}
        onClick={() => handlePeriodClick("month")}
      >
        Месяц
      </button>
      <button
        className={`${styles.periodButton} ${
          selectedPeriod === "quarter" ? styles.active : ""
        }`}
        onClick={() => handlePeriodClick("quarter")}
      >
        Квартал
      </button>
      <button
        className={`${styles.periodButton} ${
          selectedPeriod === "customRange" ? styles.active : ""
        }`}
        onClick={() => handlePeriodClick("customRange")}
      >
        Свой диапазон
      </button>

      {selectedPeriod === "customRange" && (
        <div className={styles.datePickerContainer}>
          <DatePicker
            selectsRange
            startDate={startDate}
            endDate={endDate}
            onChange={handleDateRangeChange}
            dateFormat="dd.MM.yyyy"
            placeholderText="Выберите диапазон дат"
            className={styles.datePickerInput}
            minDate={new Date("2025-04-01")}
            maxDate={new Date("2025-06-30")}
          />
        </div>
      )}
    </div>
  );
};

export default PeriodSelector;
