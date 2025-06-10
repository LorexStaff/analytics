import { useMediaQuery } from "usehooks-ts";
import SidebarDesktop from "./SidebarDesktop";
import SidebarMobile from "./SidebarMobile";

const Sidebar = () => {
  const isMobile = useMediaQuery("(max-width: 768px)");

  return isMobile ? <SidebarMobile /> : <SidebarDesktop />;
};

export default Sidebar;
