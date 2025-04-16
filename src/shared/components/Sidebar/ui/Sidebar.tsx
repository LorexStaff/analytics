import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSidebar } from "../SidebarContext";
import styles from "./Sidebar.module.scss";
import monetizationIcon from "../assets/monetization-icon.svg";
import engagementIcon from "../assets/engagement-icon.svg";
import productivityIcon from "../assets/productivity-icon.svg";
import vrIcon from "../assets/vr-icon.svg";
import overviewnIcon from "../assets/overview-icon.svg";
import logoutIcon from "../assets/logout-icon.svg";
import collapseIcon from "../assets/chevron-left.svg";

const Sidebar: React.FC = () => {
  const { isExpanded, toggleMenu } = useSidebar();
  const location = useLocation();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [isCollapseIconRotated, setIsCollapseIconRotated] = useState(false);
  const navigate = useNavigate();

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
      label: "Обзор",
      icon: overviewnIcon,
      subMenu: [
        { to: "/example1", label: "Example 1" },
        { to: "/example2", label: "Example 2" },
      ],
    },
    {
      to: "/monetization",
      label: "Монетизация",
      icon: monetizationIcon,
      subMenu: [
        { to: "/monetization/example1", label: "Example 1" },
        { to: "/monetization/example2", label: "Example 2" },
      ],
    },
    {
      to: "/engagement",
      label: "Вовлеченность",
      icon: engagementIcon,
      subMenu: [
        { to: "/engagement/example1", label: "Example 1" },
        { to: "/engagement/example2", label: "Example 2" },
      ],
    },
    {
      to: "/productivity",
      label: "Производительность",
      icon: productivityIcon,
      subMenu: [
        { to: "/productivity/example1", label: "Example 1" },
        { to: "/productivity/example2", label: "Example 2" },
      ],
    },
    {
      to: "/vr",
      label: "VR",
      icon: vrIcon,
      subMenu: [
        { to: "/vr/example1", label: "Example 1" },
        { to: "/vr/example2", label: "Example 2" },
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
            <div key={item.to}>
              <Link
                to={item.to}
                className={
                  location.pathname === item.to ? styles.activeLink : ""
                }
                onClick={() => item.subMenu && toggleSubMenu(item.to)}
              >
                <img
                  src={item.icon}
                  alt={`${item.label} icon`}
                  className={styles.icon}
                />
                {isExpanded && item.label}
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
                        {subItem.label}
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
              {isExpanded && "Свернуть"}
            </button>
          </div>

          <div className={styles.logoutButtonContainer}>
            <button className={styles.logoutButton} onClick={handleLogout}>
              <img
                src={logoutIcon}
                alt="Logout icon"
                className={styles.logoutIcon}
              />
              {isExpanded && "Выход"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
