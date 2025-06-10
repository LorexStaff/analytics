import React, { createContext, useState, useContext } from "react";
import { useMediaQuery } from "usehooks-ts";

interface SidebarContextType {
  isExpanded: boolean;
  toggleMenu: () => void;
  isMobileMenuOpen: boolean;
  openMobileMenu: () => void;
  closeMobileMenu: () => void;
  isMobile: boolean;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export const SidebarProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");

  const toggleMenu = () => {
    setIsExpanded((prevState) => !prevState);
  };

  const openMobileMenu = () => {
    console.log("Opening mobile menu");
    setIsMobileMenuOpen(true);
  };

  const closeMobileMenu = () => {
    console.log("Closing mobile menu");
    setIsMobileMenuOpen(false);
  };

  return (
    <SidebarContext.Provider
      value={{
        isExpanded,
        toggleMenu,
        isMobileMenuOpen,
        openMobileMenu,
        closeMobileMenu,
        isMobile,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
};

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
};
