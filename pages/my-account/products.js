import React, { useState } from "react";
import Layout from "../../components/layouts/Layout";
import MyAccountMobile from "../../components/layouts/MyAccountMobile";
import ProductCreator from "../../containers/ProductCreator";
import Button from "../../components/ui/Button";
import useDeviceSize from "../../hooks/useDeviceSize";
import Plus from "../../public/icons/plus.svg";
import ProductListItem from "../../containers/ProductListItem";

function Products({ products }) {
  const [isCreatingProduct, setIsCreatingProduct] = useState(false);
  return (
    <section className="responsive-padding flex flex-col justify-center">
      <h1 className="tracking-header text-center text-4xl font-bold md:text-left">
        Product Details
      </h1>
      <h2 className="tracking-header my-8 text-left text-3xl underline md:text-left">
        Current Products
      </h2>
      {products.length > 0 && products.map((p, i) => {
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
      {isCreatingProduct && <ProductCreator setIsCreatingProduct={setIsCreatingProduct}/>}
    </section>
  );
}

Products.getLayout = function getLayout(page) {
  const { isMobile } = useDeviceSize();
  const LayoutComponent = isMobile ? MyAccountMobile : React.Fragment;

  return (
    <>
      <Layout title="My Products">
        <LayoutComponent>{page}</LayoutComponent>
      </Layout>
    </>
  );
};

export const getServerSideProps = async (context) => {
  const { req, res } = context;
  const { auth_token } = req.cookies;

  if (!auth_token) {
    res.writeHead(302, { Location: "/sign-in" });
    res.end();
  }
  console.log(process.env.NEXT_PUBLIC_API);
  const products = await fetch(`${process.env.NEXT_PUBLIC_API}/api/product`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${auth_token}`,
    },
  });

  return {
    props: {
      products: await products.json(),
    },
  };
};

export default Products;
