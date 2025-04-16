import React from "react";
import styles from "./Footer.module.scss";

const Footer: React.FC = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.links}>
            <a href="/user-agreement" className={styles.link}>
              Пользовательское соглашение
            </a>
            <a href="/suggest-idea" className={styles.link}>
              Предложить идею
            </a>
            <a href="/advertising" className={styles.link}>
              Реклама
            </a>
            <a href="/about" className={styles.link}>
              О сервисе
            </a>
          </div>

          <div className={styles.copyright}>© 2025 "ТПУ"</div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
