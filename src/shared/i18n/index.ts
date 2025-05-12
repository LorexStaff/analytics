import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import sharedEn from "../../shared/locales/en.json";
import sharedRu from "../../shared/locales/ru.json";
import createProjectEn from "../../pages/CreateProject/locales/en.json";
import createProjectRu from "../../pages/CreateProject/locales/ru.json";
import errorPageEn from "../../pages/Error/locales/en.json";
import errorPageRu from "../../pages/Error/locales/ru.json";
import settingsDropdownEn from "../../shared/components/SettingsDropdown/locales/en.json";
import settingsDropdownRu from "../../shared/components/SettingsDropdown/locales/ru.json";
import profileDropdownEn from "../../shared/components/ProfileDropdown/locales/en.json";
import profileDropdownRu from "../../shared/components/ProfileDropdown/locales/ru.json";
import projectsDropdownEn from "../../features/ProjectsDropdown/locales/en.json";
import projectsDropdownRu from "../../features/ProjectsDropdown/locales/ru.json";
import footerEn from "../../widgets/Footer/locales/en.json";
import footerRu from "../../widgets/Footer/locales/ru.json";
import sidebarEn from "../components/Sidebar/locales/en.json";
import sidebarRu from "../components/Sidebar/locales/ru.json";
import projectTableEn from "../../widgets/ProjectTable/locales/en.json";
import projectTableRu from "../../widgets/ProjectTable/locales/ru.json";
import overviewWidgetEn from "../../features/OverviewWidget/locales/en.json";
import overviewWidgetRu from "../../features/OverviewWidget/locales/ru.json";
import widgetModalEn from "../../features/AddWidgetModal/locales/en.json";
import widgetModalRu from "../../features/AddWidgetModal/locales/ru.json";
import selectEn from "../components/Select/locales/en.json";
import selectRu from "../components/Select/locales/ru.json";
import reportEn from "../../pages/Report/locales/en.json";
import reportRu from "../../pages/Report/locales/ru.json";
import widgetEn from "../../entities/Widget/locales/en.json";
import widgetRu from "../../entities/Widget/locales/ru.json";
import authEn from "../../features/Auth/locales/en.json";
import authRu from "../../features/Auth/locales/ru.json";
import overviewEn from "../../pages/Overview/locales/en.json";
import overviewRu from "../../pages/Overview/locales/ru.json";

const detectUserLanguage = () => {
  const userLanguage = navigator.language || navigator.languages[0];
  const languageCode = userLanguage.split("-")[0];
  return ["ru", "en"].includes(languageCode) ? languageCode : "en";
};

const resources = {
  en: {
    translation: {
      ...sharedEn,
      ...createProjectEn,
      ...errorPageEn,
      ...settingsDropdownEn,
      ...profileDropdownEn,
      ...projectsDropdownEn,
      ...footerEn,
      ...sidebarEn,
      ...projectTableEn,
      ...overviewWidgetEn,
      ...widgetModalEn,
      ...selectEn,
      ...reportEn,
      ...widgetEn,
      ...authEn,
      ...overviewEn,
    },
  },
  ru: {
    translation: {
      ...sharedRu,
      ...createProjectRu,
      ...errorPageRu,
      ...settingsDropdownRu,
      ...profileDropdownRu,
      ...projectsDropdownRu,
      ...footerRu,
      ...sidebarRu,
      ...projectTableRu,
      ...overviewWidgetRu,
      ...widgetModalRu,
      ...selectRu,
      ...reportRu,
      ...widgetRu,
      ...authRu,
      ...overviewRu,
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: detectUserLanguage(),
  fallbackLng: "ru",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
