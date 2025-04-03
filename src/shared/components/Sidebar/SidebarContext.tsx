import React, { createContext, useState, useContext } from "react";

interface SidebarContextType {
  isExpanded: boolean;
  toggleMenu: () => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export const SidebarProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const toggleMenu = () => {
    setIsExpanded((prevState) => !prevState);
  };

  return (
    <SidebarContext.Provider value={{ isExpanded, toggleMenu }}>
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
