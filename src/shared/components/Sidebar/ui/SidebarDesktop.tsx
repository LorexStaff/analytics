import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSidebar } from "../SidebarContext";
import styles from "./Sidebar.module.scss";
import monetizationIcon from "../assets/monetization-icon.svg";
import engagementIcon from "../assets/engagement-icon.svg";
import productivityIcon from "../assets/productivity-icon.svg";
import vrIcon from "../assets/vr-icon.svg";
import overviewIcon from "../assets/overview-icon.svg";
import logoutIcon from "../assets/logout-icon.svg";
import collapseIcon from "../assets/chevron-left.svg";
import reportsIcon from "../assets/reports-icon.svg";
import { useTranslation } from "react-i18next";

const Sidebar: React.FC = () => {
  const { isExpanded, toggleMenu } = useSidebar();
  const location = useLocation();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [isCollapseIconRotated, setIsCollapseIconRotated] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const toggleSubMenu = (itemKey: string) => {
    setExpandedItems((prev) =>
      prev.includes(itemKey)
        ? prev.filter((key) => key !== itemKey)
        : [...prev, itemKey]
    );
  };

  const handleLogout = () => {
    console.log("User logged out");
    navigate("/login");
  };

  const handleCollapseClick = () => {
    toggleMenu();
    setIsCollapseIconRotated((prev) => !prev);
  };

  const menuItems = [
    {
      to: "/",
      labelKey: "sidebar.overview",
      icon: overviewIcon,
    },
    {
      to: "/reports",
      labelKey: "sidebar.reports",
      icon: reportsIcon,
    },
    {
      to: "/monetization",
      labelKey: "sidebar.monetization",
      icon: monetizationIcon,
      subMenu: [
        { to: "/monetization/example1", labelKey: "sidebar.example1" },
        { to: "/monetization/example2", labelKey: "sidebar.example2" },
      ],
    },
    {
      to: "/engagement",
      labelKey: "sidebar.engagement",
      icon: engagementIcon,
      subMenu: [
        { to: "/engagement/example1", labelKey: "sidebar.example1" },
        { to: "/engagement/example2", labelKey: "sidebar.example2" },
      ],
    },
    {
      to: "/productivity",
      labelKey: "sidebar.productivity",
      icon: productivityIcon,
      subMenu: [
        { to: "/productivity/example1", labelKey: "sidebar.example1" },
        { to: "/productivity/example2", labelKey: "sidebar.example2" },
      ],
    },
    {
      to: "/vr",
      labelKey: "sidebar.vr",
      icon: vrIcon,
      subMenu: [
        { to: "/vr/example1", labelKey: "sidebar.example1" },
        { to: "/vr/example2", labelKey: "sidebar.example2" },
      ],
    },
  ];

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
        style={{
          width: isExpanded ? "var(--menu-width)" : "60px",
        }}
      >
        <div className={styles.menu_content}>
          {menuItems.map((item) => (
            <div
              key={item.to}
              onMouseEnter={() => setHoveredItem(item.to)}
              onMouseLeave={() => setHoveredItem(null)}
            >
              <Link
                to={item.to}
                className={
                  location.pathname === item.to ? styles.activeLink : ""
                }
                onClick={() => item.subMenu && toggleSubMenu(item.to)}
              >
                <img
                  src={item.icon}
                  alt={`${t(item.labelKey)} icon`}
                  className={styles.icon}
                />
                {isExpanded && t(item.labelKey)}
                {isExpanded ? (
                  <span className={styles.arrow}>
                    {item.subMenu &&
                      (expandedItems.includes(item.to) ? "▲" : "▼")}
                  </span>
                ) : (
                  <span className={styles.dot}>•</span>
                )}
              </Link>
              {!expandedItems.includes(item.to) && (
                <div
                  className={`${styles.hover_oval} ${
                    isExpanded ? styles.expanded : styles.collapsed
                  } ${location.pathname === item.to ? styles.visibleOval : ""}`}
                ></div>
              )}
              {!isExpanded && hoveredItem === item.to && item.subMenu && (
                <div className={styles.hover_submenu}>
                  {item.subMenu.map((subItem) => (
                    <Link
                      key={subItem.to}
                      to={subItem.to}
                      className={
                        location.pathname === subItem.to
                          ? styles.activeLink
                          : ""
                      }
                    >
                      {t(subItem.labelKey)}
                    </Link>
                  ))}
                </div>
              )}
              {isExpanded &&
                item.subMenu &&
                expandedItems.includes(item.to) && (
                  <div className={styles.sub_menu}>
                    {item.subMenu.map((subItem) => (
                      <Link
                        key={subItem.to}
                        to={subItem.to}
                        className={
                          location.pathname === subItem.to
                            ? styles.activeLink
                            : ""
                        }
                      >
                        {t(subItem.labelKey)}
                      </Link>
                    ))}
                  </div>
                )}
            </div>
          ))}

          <div className={styles.collapseButtonContainer}>
            <button
              className={styles.collapseButton}
              onClick={handleCollapseClick}
            >
              <img
                src={collapseIcon}
                alt="Collapse icon"
                className={`${styles.collapseIcon} ${
                  isCollapseIconRotated ? styles.rotated : ""
                }`}
              />
              {isExpanded && t("sidebar.collapse")}
            </button>
          </div>

          <div className={styles.logoutButtonContainer}>
            <button className={styles.logoutButton} onClick={handleLogout}>
              <img
                src={logoutIcon}
                alt="Logout icon"
                className={styles.logoutIcon}
              />
              {isExpanded && t("sidebar.logout")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
