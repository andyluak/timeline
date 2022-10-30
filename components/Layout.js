import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import content from "../content.json";

function Layout({ children }) {
  const { navLinks: links, copyright } = content;
  return (
    <>
      <Navbar links={links} />
      <main>{children}</main>
      <Footer copyright={copyright} />
    </>
  );
}

export default Layout;
