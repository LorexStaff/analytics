import React from "react";
import { useMediaQuery } from "usehooks-ts";
import HeaderMobile from "./HeaderMobile";
import HeaderDesktop from "./HeaderDesktop";

const Header: React.FC = () => {
  const isMobile = useMediaQuery("(max-width: 768px)");

  return isMobile ? <HeaderMobile /> : <HeaderDesktop />;
};

export default Header;
