import React, { useState } from "react";

import MyAccountDesktop from "components/layouts/MyAccountDesktop";
import Layout from "components/layouts/Layout";
import MyAccountMobile from "components/layouts/MyAccountMobile";
import Button from "components/ui/Button";
import { ProductDropdown } from "components/ui/Dropdown";

import { getAuthCookie } from "utils/cookie";

import useDeviceSize from "hooks/useDeviceSize";

import Plus from "public/icons/plus.svg";

import content from "content.json";
import UpdateCreator from "containers/UpdateCreator";
import UpdatePointCreator from "containers/UpdatePointCreator";

import UpdatePoints from "containers/UpdatePoints";

function Updates({ products }) {
  const [isCreatingUpdate, setIsCreatingUpdate] = useState(false);
  const [isCreatingUpdatePoint, setIsCreatingUpdatePoint] = useState(false);

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [updates, setUpdates] = useState([]);

  const [selectedUpdate, setSelectedUpdate] = useState(null);
  const [updatePoints, setUpdatePoints] = useState([]);

  let formattedUpdatePoints;

  const handleProductSelection = async (id) => {
    const product = products.find((product) => {
      return product.id == id;
    });

    setUpdates(product.updates);
  };

  const handleUpdateSelection = async (id) => {
    const auth_token = getAuthCookie();
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API}/api/update/${id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth_token}`,
          },
        }
      );
      const update = await res.json();
      setUpdatePoints(update.updatePoints);
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <section className="responsive-padding flex w-full flex-col justify-start">
      <h1 className="tracking-header hidden text-center text-4xl font-bold md:block md:text-left">
        Updates
      </h1>
      <ProductDropdown
        products={products}
        selectCallback={handleProductSelection}
        selectedProduct={selectedProduct}
        setSelectedProduct={setSelectedProduct}
      />
      {selectedProduct && updates.length === 0 && (
        <div className="mb-8 flex flex-col items-center md:items-start">
          <p className="tracking-body mt-8 text-center text-xl md:text-left">
            You have no updates yet. Click the button below to add an update.
          </p>
          <Button
            text="add update"
            icon={<Plus />}
            onClick={() => setIsCreatingUpdate(!isCreatingUpdate)}
          />
        </div>
      )}
      {updates.length > 0 && (
        <ProductDropdown
          products={updates}
          selectCallback={handleUpdateSelection}
          selectedProduct={selectedUpdate}
          setSelectedProduct={setSelectedUpdate}
        />
      )}
      <div className="flex w-full flex-col items-center justify-center gap-8 md:block">
        <Button
          text="add update"
          icon={<Plus />}
          onClick={() => setIsCreatingUpdate(!isCreatingUpdate)}
        />
        {isCreatingUpdate && (
          <UpdateCreator
            selectedProduct={selectedProduct}
            setIsCreatingUpdate={setIsCreatingUpdate}
          />
        )}
        {selectedProduct && selectedUpdate && (
          <h2 className="tracking-header mt-8 mb-4 text-left text-3xl md:text-left">
            Update Points
          </h2>
        )}
      </div>
      {selectedProduct && selectedUpdate && updatePoints.length == 0 && (
        <>
          <div className="mb-8 flex flex-col items-center md:items-start">
            <p className="tracking-body mt-4 text-center text-xl md:text-left">
              You have no update points yet. Click the button below to add an
              update point.
            </p>
            <Button
              text="add update point"
              icon={<Plus />}
              onClick={() => setIsCreatingUpdatePoint(!isCreatingUpdatePoint)}
            />
          </div>
          {isCreatingUpdatePoint && (
            <UpdatePointCreator
              selectedUpdate={selectedUpdate}
              setIsCreatingUpdatePoint={setIsCreatingUpdatePoint}
            />
          )}
        </>
      )}
      {selectedProduct && selectedUpdate && updatePoints.length > 0 && (
        <>
          <UpdatePoints updatePoints={updatePoints} />
          <Button
            text="add update point"
            icon={<Plus />}
            onClick={() => setIsCreatingUpdatePoint(!isCreatingUpdatePoint)}
          />
          {isCreatingUpdatePoint && (
            <UpdatePointCreator
              selectedUpdate={selectedUpdate}
              setIsCreatingUpdatePoint={setIsCreatingUpdatePoint}
              handleUpdateSelection={handleUpdateSelection}
            />
          )}
        </>
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
