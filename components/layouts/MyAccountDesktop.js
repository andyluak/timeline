import React from "react";

import Sidebar from "components/Sidebar";

function MyAccountDesktop({ children, links }) {
  return (
    <div className="flex flex-row">
      <Sidebar links={links} />
      {children}
    </div>
  );
}

export default MyAccountDesktop;
