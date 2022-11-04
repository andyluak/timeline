import React from "react";
import Dropdown from "components/ui/Dropdown";

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
