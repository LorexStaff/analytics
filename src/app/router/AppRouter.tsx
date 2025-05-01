import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "../../pages/LoginPage";
import Registration from "../../pages/RegistrationPage";
import OverviewPage from "../../pages/OverviewPage";
import Projects from "../../pages/Projects";
import Monetization from "../../pages/Monetization";
import Engagement from "../../pages/Engagement";
import Productivity from "../../pages/Productivity";
import VR from "../../pages/VR";
import ProtectedRoute from "../providers/ProtectedRoute";
import CreateProjectPage from "../../pages/CreateProjectPage";

const AppRouter: React.FC = () => {
  return (
    <Routes>
      {/* Публичные маршруты */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Registration />} />

      {/* Защищенные маршруты */}
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<OverviewPage />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/monetization" element={<Monetization />} />
        <Route path="/engagement" element={<Engagement />} />
        <Route path="/productivity" element={<Productivity />} />
        <Route path="/vr" element={<VR />} />
        <Route path="/create-project" element={<CreateProjectPage />} />
      </Route>
    </Routes>
  );
};

export default AppRouter;
