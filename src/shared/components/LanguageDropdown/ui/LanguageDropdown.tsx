import React, { useState, useEffect, useRef } from "react";
import styles from "./LanguageDropdown.module.scss";
import ruFlag from "../assets/ru-flag.svg";
import enFlag from "../assets/en-flag.svg";
import arrowDownIcon from "../assets/arrow-down.svg";
import { useTranslation } from "react-i18next";

interface Language {
  code: string;
  flag: string;
}

const languages: Language[] = [
  { code: "RU", flag: ruFlag },
  { code: "EN", flag: enFlag },
];

const LanguageDropdown: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(
    languages.find((lang) => lang.code === "RU") || languages[0]
  );
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { i18n } = useTranslation();

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

    const currentLanguageCode = i18n.language.toUpperCase();
    const initialLanguage = languages.find(
      (lang) => lang.code === currentLanguageCode
    );
    if (initialLanguage) {
      setSelectedLanguage(initialLanguage);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLanguageSelect = (language: Language) => {
    setSelectedLanguage(language);
    setIsOpen(false);
    i18n.changeLanguage(language.code.toLowerCase());
  };

  return (
    <div className={styles.languageDropdown} ref={dropdownRef}>
      <div className={styles.selectedLanguage} onClick={toggleDropdown}>
        <img src={selectedLanguage.flag} alt={selectedLanguage.code} />
        <img
          src={arrowDownIcon}
          alt="Arrow"
          className={`${styles.arrowIcon} ${isOpen ? styles.rotated : ""}`}
        />
      </div>

      {isOpen && (
        <div className={styles.dropdownList}>
          {languages.map((language) => (
            <div
              key={language.code}
              className={styles.dropdownItem}
              onClick={() => handleLanguageSelect(language)}
            >
              <img src={language.flag} alt={language.code} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageDropdown;
