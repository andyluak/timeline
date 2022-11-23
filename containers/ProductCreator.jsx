import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";

import Button from "components/ui/Button";

import { getAuthCookie } from "utils/cookie";

function ProductCreator({ setIsCreatingProduct, nameInputRef }) {
  const queryClient = useQueryClient();

  const [errors, setErrors] = useState([]);

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
  );
}

export default ProductCreator;
