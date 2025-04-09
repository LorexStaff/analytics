import React from "react";
import Sidebar from "./shared/components/Sidebar/ui/Sidebar";
import {
  SidebarProvider,
  useSidebar,
} from "./shared/components/Sidebar/SidebarContext";
import { BrowserRouter as Router, useLocation } from "react-router-dom";
import Header from "./shared/components/Header";
import styles from "./shared/components/styles/global.module.scss";
import AppRouter from "./app/router/AppRouter";

const AppContent: React.FC = () => {
  const { isExpanded } = useSidebar();
  const location = useLocation();

  const shouldShowSidebar =
    location.pathname !== "/login" && location.pathname !== "/register";

  const shouldShowHeader =
    location.pathname !== "/login" && location.pathname !== "/register";

  return (
    <div className={styles.page_wrapper}>
      {shouldShowHeader && <Header />}
      <div style={{ display: "flex", height: "100vh" }}>
        {shouldShowSidebar && <Sidebar />}
        <div
          className={styles.main_content}
          style={{
            marginLeft: shouldShowSidebar && isExpanded ? "348px" : "0",
            transition: "margin-left 0.3s ease-in-out",
            paddingTop: shouldShowHeader ? "128px" : "0",
          }}
        >
          <AppRouter />
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <SidebarProvider>
      <Router>
        <AppContent />
      </Router>
    </SidebarProvider>
  );
};

export default App;
