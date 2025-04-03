import React from "react";
import styles from "./Checkbox.module.scss";

interface CheckboxProps {
  label?: string;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
}

const Checkbox: React.FC<CheckboxProps> = ({
  label,
  checked = false,
  onChange,
  disabled = false,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      onChange(e.target.checked);
    }
  };

  return (
    <label className={`${styles.checkbox} ${disabled ? styles.disabled : ""}`}>
      <input
        type="checkbox"
        checked={checked}
        onChange={handleChange}
        disabled={disabled}
        className={styles.input}
      />
      <span className={styles.checkmark}></span>
      {label && <span className={styles.label}>{label}</span>}
    </label>
  );
};

export default Checkbox;
