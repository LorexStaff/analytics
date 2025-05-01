import React from "react";
import Sidebar from "./shared/components/Sidebar/ui/Sidebar";
import {
  SidebarProvider,
  useSidebar,
} from "./shared/components/Sidebar/SidebarContext";
import { BrowserRouter as Router, useLocation } from "react-router-dom";
import Header from "./shared/components/Header";
import Footer from "./widgets/Footer";
import styles from "./shared/components/styles/global.module.scss";
import AppRouter from "./app/router/AppRouter";

const AppContent: React.FC = () => {
  const { isExpanded } = useSidebar();
  const location = useLocation();

  const shouldShowSidebar =
    location.pathname !== "/login" && location.pathname !== "/register";

  const shouldShowHeaderAndFooter =
    location.pathname !== "/login" && location.pathname !== "/register";

  return (
    <div className={styles.page_wrapper}>
      {shouldShowHeaderAndFooter && <Header />}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          minHeight: "calc(100vh - 100px)",
        }}
      >
        <div
          style={{
            display: "flex",
            flex: 1,
          }}
        >
          {shouldShowSidebar && <Sidebar />}
          <div
            className={styles.main_content}
            style={{
              marginLeft: shouldShowSidebar && isExpanded ? "348px" : "0",
              transition: "margin-left 0.3s ease-in-out",
              paddingTop: shouldShowHeaderAndFooter ? "20px" : "0",
              paddingBottom: shouldShowHeaderAndFooter ? "20px" : "0",
            }}
          >
            <AppRouter />
          </div>
        </div>
        {shouldShowHeaderAndFooter && <Footer />}
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
