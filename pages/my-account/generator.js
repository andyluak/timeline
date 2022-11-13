import content from "content.json";
import React from "react";

import Layout from "components/layouts/Layout";
import MyAccountDesktop from "components/layouts/MyAccountDesktop";
import MyAccountMobile from "components/layouts/MyAccountMobile";

import useDeviceSize from "hooks/useDeviceSize";
import FolderTab from "components/FolderTab";

function Generator() {
  return (
    <section className="responsive-padding flex w-full flex-col justify-start">
      <h1 className="tracking-header text-center text-4xl font-bold md:text-left">
        Generator
      </h1>
      <FolderTab />
    </section>
  );
}

export const getServerSideProps = async (context) => {
  const { req, res } = context;
  const { auth_token } = req.cookies;

  if (!auth_token) {
    res.writeHead(302, { Location: "/sign-in" });
    res.end();
  }
  const menuLinks = content.menuLinks;

  return {
    props: {
      menuLinks,
    },
  };
};

Generator.getLayout = function getLayout(page) {
  const {
    props: { menuLinks },
  } = page;

  const { isMobile } = useDeviceSize();
  const LayoutComponent = isMobile ? MyAccountMobile : MyAccountDesktop;

  return (
    <>
      <Layout title="Generator">
        <LayoutComponent links={menuLinks}>{page}</LayoutComponent>
      </Layout>
    </>
  );
};

export default Generator;
