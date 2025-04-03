import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useSidebar } from "./SidebarContext";
import styles from "./Sidebar.module.scss";

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
            { to: "/projects", label: "Мои проекты" },
            { to: "/monetization", label: "Монетизация" },
            { to: "/engagement", label: "Вовлеченность" },
            { to: "/productivity", label: "Производительность" },
            { to: "/vr", label: "VR" },
          ].map((item) => (
            <div key={item.to}>
              <Link
                to={item.to}
                className={
                  location.pathname === item.to ? styles.activeLink : ""
                }
              >
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
