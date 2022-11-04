import React from "react";

import Dropdown from "components/ui/Dropdown";

function MyAccountMobile({ children, links }) {
  return (
    <>
      <nav className="flex items-center justify-center">
        <Dropdown links={links} />
      </nav>
      {children}
    </>
  );
}

export default MyAccountMobile;
