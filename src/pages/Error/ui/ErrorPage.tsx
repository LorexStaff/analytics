import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./ErrorPage.module.scss";
import { useTranslation } from "react-i18next";

interface ErrorPageProps {
  errorCode?: number;
  errorMessage?: string;
}

const ErrorPage: React.FC<ErrorPageProps> = ({ errorCode, errorMessage }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleRedirectToHome = () => {
    navigate("/");
  };

  return (
    <div className={styles.errorPage}>
      <h1 className={styles.title}>
        {errorCode
          ? t("errorPage.title", { code: errorCode })
          : t("errorPage.defaultTitle")}
      </h1>
      <p className={styles.message}>
        {errorMessage
          ? t("errorPage.customMessage", { message: errorMessage })
          : t("errorPage.message")}
      </p>
      <button className={styles.button} onClick={handleRedirectToHome}>
        {t("common.backToHome")}
      </button>
    </div>
  );
};

export default ErrorPage;
