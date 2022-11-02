import React from "react";
import Navbar from "../Navbar";
import Footer from "../Footer";
import content from "../../content.json";
import Head from "next/head";

function Layout({ children, title }) {
  const { navLinks: links, copyright } = content;
  const newTitle = title ? `${title} - Timeline` : "Timeline";
  return (
    <>
      <Head key="head">
        <title>{newTitle}</title>
      </Head>
      <Navbar links={links} />
      <main>{children}</main>
      <Footer copyright={copyright} />
    </>
  );
}

export default Layout;
