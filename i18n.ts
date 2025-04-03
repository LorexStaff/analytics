import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import ru from "./src/shared/locales/ru.json";
import en from "./src/shared/locales/en.json";

const resources = {
  ru: {
    translation: ru,
  },
  en: {
    translation: en,
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: "ru",
  fallbackLng: "ru",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
