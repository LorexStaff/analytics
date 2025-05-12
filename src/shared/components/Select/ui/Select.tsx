import React from "react";
import styles from "./Select.module.scss";
import arrowIcon from "../assets/dropdown-vector.svg";
import { useTranslation } from "react-i18next";

interface Option {
  value: string;
  label: string;
}

interface SelectProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  placeholderKey?: string;
}

const Select: React.FC<SelectProps> = ({
  options,
  value,
  onChange,
  placeholderKey = "select.placeholder",
}) => {
  const { t } = useTranslation();

  return (
    <select
      className={styles.select}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{
        backgroundImage: `url(${arrowIcon})`,
      }}
    >
      <option value="" disabled hidden>
        {t(placeholderKey)}
      </option>

      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

export default Select;
