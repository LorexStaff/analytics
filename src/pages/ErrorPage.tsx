import React from "react";
import styles from "./ErrorPage.module.scss";

interface ErrorPageProps {
  errorCode?: number;
  errorMessage?: string;
}

const ErrorPage: React.FC<ErrorPageProps> = ({ errorCode, errorMessage }) => {
  return (
    <div className={styles.errorPage}>
      <h1 className={styles.title}>
        {errorCode ? `Ошибка ${errorCode}` : "Произошла ошибка"}
      </h1>
      <p className={styles.message}>
        {errorMessage ||
          "Попробуйте перезагрузить страницу или вернуться позже."}
      </p>
      <button
        className={styles.button}
        onClick={() => window.location.reload()}
      >
        Перезагрузить страницу
      </button>
    </div>
  );
};

export default ErrorPage;
