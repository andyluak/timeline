import Head from "next/head";
import React from "react";

import Footer from "components/Footer";
import Navbar from "components/Navbar";

import content from "../../content.json";

function Layout({ children, title }) {
  const { navLinks: links, copyright } = content;
  const newTitle = title ? `${title} - Timeline` : "Timeline";
  return (
    <>
      <Head key="head">
        <title>{newTitle}</title>
      </Head>
      <Navbar links={links} />
      <main className="w-screen">{children}</main>
      <Footer copyright={copyright} />
    </>
  );
}

export default Layout;
