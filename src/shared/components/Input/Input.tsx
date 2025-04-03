import React, { useState } from "react";
import styles from "./Input.module.scss";
import eyeIcon from "./icons/eye.svg";
import eyeClosedIcon from "./icons/eye-slash.svg";
import dropdownArrow from "./icons/Vector.svg";

interface InputProps {
  type: "text" | "password" | "email" | "dropdown";
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
}

const Input: React.FC<InputProps> = ({
  type,
  placeholder,
  value,
  onChange,
}) => {
  const [isActive, setIsActive] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const handleFocus = () => setIsActive(true);
  const handleBlur = () => setIsActive(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      onChange(e.target.value);
    }
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible((prev) => !prev);
  };

  return (
    <div className={styles.inputWrapper}>
      {type === "dropdown" ? (
        <div className={`${styles.input} ${isActive ? styles.active : ""}`}>
          <input
            type="text"
            placeholder={placeholder}
            value={value}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onChange={handleChange}
            readOnly
            className={styles.dropdownInput}
          />
          <img
            src={dropdownArrow}
            alt="Dropdown"
            className={styles.dropdownIcon}
          />
        </div>
      ) : (
        <div className={`${styles.input} ${isActive ? styles.active : ""}`}>
          <input
            type={
              type === "password" && !isPasswordVisible ? "password" : "text"
            }
            placeholder={placeholder}
            value={value}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onChange={handleChange}
          />
          {type === "password" && (
            <img
              src={isPasswordVisible ? eyeIcon : eyeClosedIcon}
              alt="Toggle Password Visibility"
              className={styles.eyeIcon}
              onClick={togglePasswordVisibility}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default Input;
