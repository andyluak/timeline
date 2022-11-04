import React, { useState } from "react";

import Layout from "components/layouts/Layout";
import MyAccountMobile from "components/layouts/MyAccountMobile";
import MyAccountDesktop from "components/layouts/MyAccountDesktop";

import { getAuthCookie } from "utils/cookie";

import useDeviceSize from "hooks/useDeviceSize";

import content from "content.json";

import { ProductDropdown } from "components/ui/Dropdown";

function Updates({products}) {
  return (
    <section className="responsive-padding flex w-full flex-col justify-start">
      <h1 className="tracking-header text-center text-4xl font-bold hidden md:block md:text-left">
        Updates
      </h1>
      <ProductDropdown products={products}/>
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

  const products = await fetch(`${process.env.NEXT_PUBLIC_API}/api/product`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${auth_token}`,
    },
  });
  const menuLinks = content.menuLinks;

  return {
    props: { menuLinks, products: await products.json() },
  };
};

Updates.getLayout = function getLayout(page) {
  const {
    props: { menuLinks },
  } = page;
  const { isMobile } = useDeviceSize();
  const LayoutComponent = isMobile ? MyAccountMobile : MyAccountDesktop;

  return (
    <>
      <Layout title="Updates">
        <LayoutComponent links={menuLinks}>{page}</LayoutComponent>
      </Layout>
    </>
  );
};

export default Updates;
