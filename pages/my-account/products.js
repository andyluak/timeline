import { QueryClient, dehydrate, useQuery } from "@tanstack/react-query";
import React, { useRef, useState } from "react";

import Layout from "components/layouts/Layout";
import MyAccountLayout from "components/layouts/MyAccountLayout";
import Button from "components/ui/Button";

import ProductCreator from "containers/ProductCreator";
import ProductListItem from "containers/ProductListItem";

import { getAuthCookie } from "utils/cookie";
import { getProducts } from "utils/queries";

import Plus from "public/icons/plus.svg";

function Products() {
  const [isCreatingProduct, setIsCreatingProduct] = useState(false);
  const token = getAuthCookie();

  const { data, isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: () => getProducts(token),
  });
  const products = data ? data : [];

  const nameInputRef = useRef(null);

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
            onClick={() => {
              setIsCreatingProduct(true);
              setTimeout(() => {
                nameInputRef.current.focus();
              }, 300);
            }}
          />
        </div>
      )}
      <Button
        text="add product"
        icon={<Plus />}
        onClick={() => {
          setIsCreatingProduct(true);
          setTimeout(() => {
            nameInputRef.current.focus();
          }, 100);
        }}
      />
      {isCreatingProduct && (
        <ProductCreator
          setIsCreatingProduct={setIsCreatingProduct}
          nameInputRef={nameInputRef}
        />
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
