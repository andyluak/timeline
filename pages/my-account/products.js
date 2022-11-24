import { QueryClient, dehydrate, useQuery } from "@tanstack/react-query";
import React from "react";

import TimerWrapper from "components/TimerWrapper";
import Layout from "components/layouts/Layout";
import MyAccountLayout from "components/layouts/MyAccountLayout";

import ProductCreator from "containers/ProductCreator";
import ProductListItem from "containers/ProductListItem";

import { getAuthCookie } from "utils/cookie";
import { getProducts } from "utils/queries";

function Products() {
  const token = getAuthCookie();

  const { data, isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: () => getProducts(token),
  });
  const products = data ? data : [];

  return (
    <TimerWrapper>
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

        <ProductCreator hasProducts={products.length > 0} products={products} />
      </section>
    </TimerWrapper>
  );
}

export const getServerSideProps = async (context) => {
  const { req, res } = context;
  const { auth_token } = req.cookies;

  if (!auth_token) {
    res.writeHead(302, { Location: "/sign-in" });
    res.end();
  }
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(["products"], () => getProducts(auth_token));

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
};

Products.getLayout = function getLayout(page) {
  return (
    <>
      <Layout title="My Products">
        <MyAccountLayout>{page}</MyAccountLayout>
      </Layout>
    </>
  );
};

export default Products;
