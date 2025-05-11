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
import CreateProjectPage from "../../pages/CreateProjectPage";
import ErrorPage from "../../pages/ErrorPage";

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

const getErrorMessage = (code: number): string => {
  switch (code) {
    case 400:
      return "Неверный запрос. Попробуйте снова.";
    case 401:
      return "Неавторизованный доступ. Пожалуйста, войдите в систему.";
    case 403:
      return "Доступ запрещён. У вас нет прав для просмотра этой страницы.";
    case 404:
      return "Страница не найдена.";
    case 500:
      return "Внутренняя ошибка сервера. Попробуйте позже.";
    case 502:
      return "Неверный шлюз. Попробуйте позже.";
    case 503:
      return "Сервис недоступен. Попробуйте позже.";
    case 504:
      return "Таймаут шлюза. Попробуйте позже.";
    default:
      return "Произошла неизвестная ошибка.";
  }
};

const ErrorPageWrapper: React.FC = () => {
  const { code } = useParams<{ code: string }>();
  const errorCode = Number(code) || 500;
  const errorMessage = getErrorMessage(errorCode);

  return <ErrorPage errorCode={errorCode} errorMessage={errorMessage} />;
};

export default AppRouter;
