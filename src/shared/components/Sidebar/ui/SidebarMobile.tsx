import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import styles from "./SidebarMobile.module.scss";
import monetizationIcon from "../assets/money-white.svg";
import engagementIcon from "../assets/people-white.svg";
import productivityIcon from "../assets/tools-white.svg";
import vrIcon from "../assets/controller-white.svg";
import reportsIcon from "../assets/bar-chart-white.svg";
import overviewIcon from "../assets/overview-white.svg";
import logoutIcon from "../assets/logout-white.svg";
import closeIcon from "../assets/close-icon.svg";
import { useSidebar } from "../SidebarContext";
import { useTranslation } from "react-i18next";
import ProfileDropdown from "../../ProfileDropdown";
import logo from "../assets/logo.svg";
import LanguageDropdown from "../../LanguageDropdown";

const MobileSidebar: React.FC = () => {
  const { isMobileMenuOpen, closeMobileMenu } = useSidebar();
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const toggleSubMenu = (itemKey: string) => {
    setExpandedItems((prev) =>
      prev.includes(itemKey)
        ? prev.filter((key) => key !== itemKey)
        : [...prev, itemKey]
    );
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
    <>
      <div
        className={`${styles.sidebar} ${isMobileMenuOpen ? styles.open : ""}`}
      >
        <button className={styles.closeButton} onClick={closeMobileMenu}>
          <img src={closeIcon} alt="Close" />
        </button>

        <div className={styles.menuContent}>
          <div className={styles.logo}>
            <img src={logo} alt="logo" />
          </div>
          <ProfileDropdown />

          {menuItems.map((item) => (
            <div key={item.to}>
              <Link
                to={item.to}
                className={
                  location.pathname === item.to ? styles.activeLink : ""
                }
                onClick={() => {
                  if (item.subMenu) {
                    toggleSubMenu(item.to);
                  } else {
                    closeMobileMenu();
                  }
                }}
              >
                <img src={item.icon} alt={`${t(item.labelKey)} icon`} />
                {t(item.labelKey)}
                {item.subMenu && (
                  <span className={styles.arrowIcon}>
                    {expandedItems.includes(item.to) ? "▲" : "▼"}
                  </span>
                )}
              </Link>

              {item.subMenu && expandedItems.includes(item.to) && (
                <div className={styles.subMenu}>
                  {item.subMenu.map((subItem) => (
                    <Link
                      key={subItem.to}
                      to={subItem.to}
                      className={
                        location.pathname === subItem.to
                          ? styles.activeLink
                          : ""
                      }
                      onClick={closeMobileMenu}
                    >
                      {t(subItem.labelKey)}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
          <div className={styles.languageContainer}>
            <span>Язык</span>
            <LanguageDropdown />
          </div>
          <button
            className={styles.logoutButton}
            onClick={() => {
              console.log("User logged out");
              navigate("/login");
            }}
          >
            <img src={logoutIcon} alt="Logout" />
            {t("sidebar.logout")}
          </button>
        </div>
      </div>
    </>
  );
};

export default MobileSidebar;
