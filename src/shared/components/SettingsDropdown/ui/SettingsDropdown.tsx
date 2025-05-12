import React, { useState, useEffect, useRef } from "react";
import styles from "./SettingsDropdown.module.scss";
import gearIcon from "../assets/gear-icon.svg";
import arrowDownIcon from "../assets/arrow-down.svg";
import helpIcon from "../assets/headset.svg";
import docsIcon from "../assets/file-earmark-text.svg";
import contactIcon from "../assets/mail.svg";
import { useTranslation } from "react-i18next";

const menuItems = [
  { key: "help", icon: helpIcon },
  { key: "documentation", icon: docsIcon },
  { key: "contactUs", icon: contactIcon },
];

const SettingsDropdown: React.FC = () => {
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
    <div className={styles.settingsDropdown} ref={dropdownRef}>
      <div className={styles.trigger} onClick={toggleDropdown}>
        <img src={gearIcon} alt="Settings" className={styles.gearIcon} />
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
                alt={t(`settingsDropdown.${item.key}`)}
                className={styles.itemIcon}
              />
              <span>{t(`settingsDropdown.${item.key}`)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SettingsDropdown;
