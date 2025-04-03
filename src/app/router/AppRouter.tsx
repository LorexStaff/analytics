import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "../../pages/LoginPage";
import Registration from "../../pages/RegistrationPage";
import MainPage from "../../pages/MainPage";
import Projects from "../../pages/Projects";
import Monetization from "../../pages/Monetization";
import Engagement from "../../pages/Engagement";
import Productivity from "../../pages/Productivity";
import VR from "../../pages/VR";
import ProtectedRoute from "../providers/ProtectedRoute";

const AppRouter: React.FC = () => {
  return (
    <Routes>
      {/* Публичные маршруты */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Registration />} />

      {/* Защищенные маршруты */}
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<MainPage />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/monetization" element={<Monetization />} />
        <Route path="/engagement" element={<Engagement />} />
        <Route path="/productivity" element={<Productivity />} />
        <Route path="/vr" element={<VR />} />
      </Route>
    </Routes>
  );
};

export default AppRouter;
