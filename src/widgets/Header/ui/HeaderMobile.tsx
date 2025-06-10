import React from "react";
import styles from "./HeaderMobile.module.scss";
import logo from "../assets/logo.svg";
import menuIcon from "../assets/menu-icon.svg";
import { useSidebar } from "../../../shared/components/Sidebar/SidebarContext";

const Header: React.FC = () => {
  const { openMobileMenu } = useSidebar();
  console.log("Header rendered with openMobileMenu:", !!openMobileMenu);
  return (
    <header className={styles.header}>
      <div className={styles.leftSection}>
        <div className={styles.logo}>
          <img src={logo} alt="logo" />
        </div>
      </div>

      <div className={styles.rightSection}>
        <button className={styles.menuButton} onClick={openMobileMenu}>
          <img src={menuIcon} alt="Menu" />
        </button>
      </div>
    </header>
  );
};

export default Header;
