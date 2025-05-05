import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./ErrorPage.module.scss";

interface ErrorPageProps {
  errorCode?: number;
  errorMessage?: string;
}

const ErrorPage: React.FC<ErrorPageProps> = ({ errorCode, errorMessage }) => {
  const navigate = useNavigate();

  const handleRedirectToHome = () => {
    navigate("/");
  };

  return (
    <div className={styles.errorPage}>
      <h1 className={styles.title}>
        {errorCode ? `Ошибка ${errorCode}` : "Произошла ошибка"}
      </h1>
      <p className={styles.message}>
        {errorMessage ||
          "Попробуйте перезагрузить страницу или вернуться позже."}
      </p>
      <button className={styles.button} onClick={handleRedirectToHome}>
        Вернуться на главную страницу
      </button>
    </div>
  );
};

export default ErrorPage;
