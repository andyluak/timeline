import content from "content.json";
import React from "react";

import useDeviceSize from "hooks/useDeviceSize";

import MyAccountDesktop from "./MyAccountDesktop";
import MyAccountMobile from "./MyAccountMobile";

function MyAccountLayout({ children }) {
  const { isMobile } = useDeviceSize();

  return isMobile ? (
    <MyAccountMobile links={content.menuLinks}> {children} </MyAccountMobile>
  ) : (
    <MyAccountDesktop links={content.menuLinks}> {children} </MyAccountDesktop>
  );
}

export default MyAccountLayout;
