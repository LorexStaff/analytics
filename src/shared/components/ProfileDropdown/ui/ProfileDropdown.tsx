import React, { useState, useEffect, useRef } from "react";
import styles from "./ProfileDropdown.module.scss";
import arrowDownIcon from "../assets/arrow-down.svg";
import profileIcon from "../assets/profile-icon.svg";
import logoutIcon from "../assets/logout-icon.svg";
import userIcon from "../assets/User.svg";
import { useTranslation } from "react-i18next";

const menuItems = [
  { key: "profile", icon: profileIcon },
  { key: "logout", icon: logoutIcon },
];

const ProfileDropdown: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className={styles.profileDropdown} ref={dropdownRef}>
      <div className={styles.trigger} onClick={toggleDropdown}>
        <img src={userIcon} alt="User" className={styles.userIcon} />
        <span>{t("profileDropdown.username")}</span>
        <img
          src={arrowDownIcon}
          alt="Arrow"
          className={`${styles.arrowIcon} ${isOpen ? styles.rotated : ""}`}
        />
      </div>

      {isOpen && (
        <div className={styles.dropdownList}>
          {menuItems.map((item, index) => (
            <div key={index} className={styles.dropdownItem}>
              <img
                src={item.icon}
                alt={t(`profileDropdown.${item.key}`)}
                className={styles.itemIcon}
              />
              <span>{t(`profileDropdown.${item.key}`)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;
