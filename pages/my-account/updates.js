import { useQuery } from "@tanstack/react-query";
import content from "content.json";
import React, { useState } from "react";

import Layout from "components/layouts/Layout";
import MyAccountLayout from "components/layouts/MyAccountLayout";
import Button from "components/ui/Button";
import { ProductDropdown } from "components/ui/Dropdown";

import UpdateCreator from "containers/UpdateCreator";
import UpdatePointCreator from "containers/UpdatePointCreator";
import UpdatePoints from "containers/UpdatePoints";

import { getAuthCookie } from "utils/cookie";
import { getProducts, getUpdatePoints } from "utils/queries";

import Plus from "public/icons/plus.svg";

function Updates() {
  const [isCreatingUpdate, setIsCreatingUpdate] = useState(false);
  const [isCreatingUpdatePoint, setIsCreatingUpdatePoint] = useState(false);

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [updates, setUpdates] = useState([]);

  const [selectedUpdate, setSelectedUpdate] = useState(null);
  const token = getAuthCookie();

  const { data, isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: () => getProducts(token),
  });
  const products = data ? data : [];

  const { data: updatePointsData, isLoading: updatePointsLoading } = useQuery({
    queryKey: ["updatePoints", selectedUpdate || 0],
    queryFn: () =>
      getUpdatePoints({ auth_token: token, updateId: selectedUpdate }),
    enabled: !!selectedUpdate,
  });

  const updatePoints = updatePointsData ? updatePointsData.updatePoints : [];
  let formattedUpdatePoints;

  const handleProductSelection = async (id) => {
    const product = products.find((product) => {
      return product.id == id;
    });
    setUpdates(product.updates);
  };

  return (
    <section className="responsive-padding flex w-full flex-col justify-start">
      <h1 className="tracking-header hidden text-center text-4xl font-bold md:block md:text-left">
        Updates
      </h1>
      {products.length > 0 && (
        <ProductDropdown
          products={products}
          selectCallback={handleProductSelection}
          selectedProduct={selectedProduct}
          setSelectedProduct={setSelectedProduct}
        />
      )}

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
          selectCallback={() => {}}
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
          <UpdatePoints
            updatePoints={updatePoints}
            handleUpdateSelection={() => {}}
          />
          <div className="mt-4 flex flex-col items-center gap-4 md:items-start">
            <Button
              text="add update point"
              icon={<Plus />}
              onClick={() => setIsCreatingUpdatePoint(!isCreatingUpdatePoint)}
            />
            {isCreatingUpdatePoint && (
              <UpdatePointCreator
                selectedUpdate={selectedUpdate}
                setIsCreatingUpdatePoint={setIsCreatingUpdatePoint}
              />
            )}
          </div>
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
  const menuLinks = content.menuLinks;

  return {
    props: { menuLinks },
  };
};

Updates.getLayout = function getLayout(page) {
  return (
    <>
      <Layout title="Updates">
        <MyAccountLayout>{page}</MyAccountLayout>
      </Layout>
    </>
  );
};

export default Updates;
