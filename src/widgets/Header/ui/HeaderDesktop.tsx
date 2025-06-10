import React from "react";
import styles from "./Header.module.scss";
import logo from "../assets/logo.svg";
import Dropdown from "../../../features/ProjectsDropdown/ui/Dropdown";
import LanguageDropdown from "../../../shared/components/LanguageDropdown/ui/LanguageDropdown";
import SettingsDropdown from "../../../shared/components/SettingsDropdown/ui/SettingsDropdown";
import ProfileDropdown from "../../../shared/components/ProfileDropdown/ui/ProfileDropdown";

const Header: React.FC = () => {
  return (
    <header className={styles.header}>
      <div className={styles.logoAndDropdown}>
        <div className={styles.logo}>
          <img src={logo} alt="logo" />
        </div>
        <Dropdown />
      </div>
      <div className={styles.rightSection}>
        <ProfileDropdown />
        <SettingsDropdown />
        <LanguageDropdown />
      </div>
    </header>
  );
};

export default Header;
