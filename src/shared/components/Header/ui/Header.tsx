import React from "react";
import styles from "./Header.module.scss";
import logo from "../assets/logo.svg";

const Header: React.FC = () => {
  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <img src={logo} alt="logo" />
      </div>
    </header>
  );
};

export default Header;
