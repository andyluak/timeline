import React from "react";
import Dropdown from "../ui/Dropdown";

function MyAccountMobile({ children }) {
  return (
    <>
      <nav>
        <Dropdown />
      </nav>
      {children}
    </>
  );
}

export default MyAccountMobile;
