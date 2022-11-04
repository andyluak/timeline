import Sidebar from "components/Sidebar";
import React from "react";

function MyAccountDesktop({ children, links }) {
  return (
    <div className="flex flex-row">
      <Sidebar links={links} />
      {children}
    </div>
  );
}

export default MyAccountDesktop;
