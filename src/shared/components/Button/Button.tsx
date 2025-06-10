import React from "react";
import styles from "./Button.module.scss";

interface ButtonProps {
  variant?: "primary" | "secondary" | "gray" | "outline";
  size?: "small" | "medium" | "large";
  children: React.ReactNode;
  className?: string;
  [key: string]: any;
}

const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "medium",
  children,
  className,
  ...props
}) => {
  const buttonClass = `${styles.button} ${styles[variant]} ${styles[size]} ${
    className || ""
  }`;

  return (
    <button className={buttonClass} {...props}>
      {children}
    </button>
  );
};

export default Button;
