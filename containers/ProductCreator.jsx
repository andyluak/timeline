import { useRouter } from "next/router";
import React, { useState } from "react";

import Button from "components/ui/Button";

import { getAuthCookie } from "utils/cookie";
import extendedFetch from "utils/extendedFetch";

function ProductCreator({ setIsCreatingProduct }) {
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  async function addProduct({ name, token }) {
    const res = await extendedFetch({
      endpoint: "api/product",
      method: "POST",
      body: {
        name,
      },
      errors,
      setErrors,
      setLoading,
      token,
    });

    return res;
  }

  const onHandleSubmit = async (e) => {
    setErrors([]);
    e.preventDefault();
    const formData = new FormData(e.target);
    const { name } = Object.fromEntries(formData);

    if (!name) {
      setErrors(["Please enter a product name"]);
      return;
    }

    const token = getAuthCookie();
    addProduct({ name, token });
    setIsCreatingProduct(false);
    router.replace(router.asPath);
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
          <input type="text" name="name" id="name" className="mb-2" />
        </div>

        <Button text={loading ? "Loading" : "Save changes"} type="submit" />
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
