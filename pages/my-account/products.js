import content from "content.json";
import React, { useState } from "react";

import Layout from "components/layouts/Layout";
import MyAccountDesktop from "components/layouts/MyAccountDesktop";
import MyAccountMobile from "components/layouts/MyAccountMobile";
import Button from "components/ui/Button";

import ProductCreator from "containers/ProductCreator";
import ProductListItem from "containers/ProductListItem";

import useDeviceSize from "hooks/useDeviceSize";

import Plus from "public/icons/plus.svg";

function Products({ products }) {
  const [isCreatingProduct, setIsCreatingProduct] = useState(false);
  return (
    <section className="responsive-padding flex w-full flex-col justify-start">
      <h1 className="tracking-header text-center text-4xl font-bold md:text-left">
        Product Details
      </h1>
      <h2 className="tracking-header my-8 text-left text-3xl underline md:text-left">
        Current Products
      </h2>
      {products.length > 0 &&
        products.map((p, i) => {
          return <ProductListItem order={i + 1} product={p} key={i} />;
        })}
      {products.length === 0 && (
        <div className="flex flex-col items-center md:items-start">
          <p className="tracking-body mt-8 text-center text-xl md:text-left">
            You have no products yet. Click the button below to add a product.
          </p>
          <Button
            text="add product"
            icon={<Plus />}
            onClick={() => setIsCreatingProduct(true)}
          />
        </div>
      )}
      <Button
        text="add product"
        icon={<Plus />}
        onClick={() => setIsCreatingProduct(!isCreatingProduct)}
      />
      {isCreatingProduct && (
        <ProductCreator setIsCreatingProduct={setIsCreatingProduct} />
      )}
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
    props: {
      products: await products.json(),
      menuLinks,
    },
  };
};

Products.getLayout = function getLayout(page) {
  const {
    props: { menuLinks },
  } = page;

  const { isMobile } = useDeviceSize();
  const LayoutComponent = isMobile ? MyAccountMobile : MyAccountDesktop;

  return (
    <>
      <Layout title="My Products">
        <LayoutComponent links={menuLinks}>{page}</LayoutComponent>
      </Layout>
    </>
  );
};

export default Products;
