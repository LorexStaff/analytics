import React from "react";
import { Routes, Route, useParams } from "react-router-dom";
import Login from "../../pages/LoginPage";
import Registration from "../../pages/RegistrationPage";
import OverviewPage from "../../pages/Overview";
import ReportPage from "../../pages/Report";
import Projects from "../../pages/Projects";
import Monetization from "../../pages/Monetization";
import Engagement from "../../pages/Engagement";
import Productivity from "../../pages/Productivity";
import VR from "../../pages/VR";
import ProtectedRoute from "../providers/ProtectedRoute";
import CreateProjectPage from "../../pages/CreateProject";
import ErrorPage from "../../pages/Error/ui/ErrorPage";
import { useTranslation } from "react-i18next";

const AppRouter: React.FC = () => {
  return (
    <Routes>
      {/* Публичные маршруты */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Registration />} />

      {/* Защищенные маршруты */}
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<OverviewPage />} />
        <Route path="/reports" element={<ReportPage />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/monetization" element={<Monetization />} />
        <Route path="/engagement" element={<Engagement />} />
        <Route path="/productivity" element={<Productivity />} />
        <Route path="/vr" element={<VR />} />
        <Route path="/create-project" element={<CreateProjectPage />} />
        <Route path="/error/:code" element={<ErrorPageWrapper />} />
      </Route>
    </Routes>
  );
};

const ErrorPageWrapper: React.FC = () => {
  const { code } = useParams<{ code: string }>();
  const errorCode = Number(code) || 500;
  const { t } = useTranslation();
  const errorMessage = t(`errors.${errorCode}`, {
    defaultValue: t("errors.default"),
  });

  return <ErrorPage errorCode={errorCode} errorMessage={errorMessage} />;
};

export default AppRouter;
