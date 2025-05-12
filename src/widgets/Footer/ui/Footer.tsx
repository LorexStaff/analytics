import React from "react";
import styles from "./Footer.module.scss";
import { useTranslation } from "react-i18next";

const Footer: React.FC = () => {
  const { t } = useTranslation();

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.links}>
            <a href="/user-agreement" className={styles.link}>
              {t("footer.userAgreement")}
            </a>
            <a href="/suggest-idea" className={styles.link}>
              {t("footer.suggestIdea")}
            </a>
            <a href="/advertising" className={styles.link}>
              {t("footer.advertising")}
            </a>
            <a href="/about" className={styles.link}>
              {t("footer.about")}
            </a>
          </div>

          <div className={styles.copyright}>{t("footer.copyright")}</div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
