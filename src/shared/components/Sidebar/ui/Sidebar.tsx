import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useSidebar } from "../SidebarContext";
import styles from "./Sidebar.module.scss";
import monetizationIcon from "../assets/monetization-icon.svg";
import engagementIcon from "../assets/engagement-icon.svg";
import productivityIcon from "../assets/productivity-icon.svg";
import vrIcon from "../assets/vr-icon.svg";
import overviewnIcon from "../assets/overview-icon.svg";

const Sidebar: React.FC = () => {
  const { isExpanded, toggleMenu } = useSidebar();
  const location = useLocation();

  return (
    <div className={styles.wrapper}>
      <button
        className={`${styles.toggle_button} ${isExpanded ? "" : styles.active}`}
        onClick={toggleMenu}
      >
        {isExpanded ? "<" : ">"}
      </button>

      <div
        className={`${styles.sidebar_menu} ${isExpanded ? styles.active : ""}`}
      >
        <div className={styles.menu_content}>
          {[
            {
              to: "/",
              label: "Обзор",
              icon: overviewnIcon,
            },
            {
              to: "/monetization",
              label: "Монетизация",
              icon: monetizationIcon,
            },
            { to: "/engagement", label: "Вовлеченность", icon: engagementIcon },
            {
              to: "/productivity",
              label: "Производительность",
              icon: productivityIcon,
            },
            { to: "/vr", label: "VR", icon: vrIcon },
          ].map((item) => (
            <div key={item.to}>
              <Link
                to={item.to}
                className={
                  location.pathname === item.to ? styles.activeLink : ""
                }
              >
                <img
                  src={item.icon}
                  alt={`${item.label} icon`}
                  className={styles.icon}
                />
                {item.label}
              </Link>
              <div
                className={`${styles.hover_oval} ${
                  location.pathname === item.to ? styles.visibleOval : ""
                }`}
              ></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
