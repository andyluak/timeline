import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useRef, useState } from "react";

import Button from "components/ui/Button";

import { getAuthCookie } from "utils/cookie";

import Plus from "public/icons/plus.svg";

function ProductCreator({ hasProducts }) {
  const queryClient = useQueryClient();

  const [isCreatingProduct, setIsCreatingProduct] = useState(false);
  const [errors, setErrors] = useState([]);

  const nameInputRef = useRef(null);

  const addProductMutation = useMutation({
    mutationFn: async (variables) => {
      const { name, auth_token } = variables;

      const res = await fetch(`${process.env.NEXT_PUBLIC_API}/api/product`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth_token}`,
        },
        body: JSON.stringify({ name }),
      });

      if (!res.ok) {
        const { errors } = await res.json();
        throw new Error(errors);
      }
    },
    onMutate: async (variables) => {
      await queryClient.cancelQueries(["products"]);

      // get prev products
      const previousProducts = queryClient.getQueryData(["products"]);

      queryClient.setQueryData(["products"], (oldProducts) => [
        ...oldProducts,
        { name: variables.name, id: new Date() },
      ]);

      return { previousProducts };
    },
    onError: (error, variables, context) => {
      queryClient.setQueryData(["products"], context.previousProducts);
    },
    onSettled: () => {
      queryClient.invalidateQueries(["products"]);
    },
  });

  const onHandleSubmit = async (e) => {
    setErrors([]);
    e.preventDefault();
    const formData = new FormData(e.target);
    const { name } = Object.fromEntries(formData);

    if (!name) {
      setErrors(["Please enter a product name"]);
      return;
    }

    const auth_token = getAuthCookie();
    addProductMutation.mutate({ name, auth_token });
    setIsCreatingProduct(false);
    e.target.reset();
  };

  return (
    <>
      {!hasProducts && (
        <div className="flex flex-col items-center md:items-start">
          <p className="tracking-body mt-8 text-center text-xl md:text-left">
            You have no products yet. Click the button below to add a product.
          </p>
        </div>
      )}
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
      {isCreatingProduct && (
        <>
          <form
            className="mt-8 flex flex-col items-center gap-2 md:items-start"
            onSubmit={onHandleSubmit}
          >
            <div className="flex w-2/3 flex-col">
              <label>Product Name</label>
              <input
                type="text"
                name="name"
                id="name"
                className="mb-2"
                ref={nameInputRef}
              />
            </div>

            <Button
              text={addProductMutation.isLoading ? "Loading" : "Save changes"}
              type="submit"
            />
          </form>
          {errors.map((e, i) => {
            return (
              <p key={i} className="mt-4 text-center text-red-500 md:text-left">
                {e}
              </p>
            );
          })}
        </>
      )}
    </>
  );
}

export default ProductCreator;
