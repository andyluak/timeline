import { useRouter } from "next/router";
import React, { useState } from "react";

import Form from "components/ui/Form";

import { getAuthCookie } from "utils/cookie";
import extendedFetch from "utils/extendedFetch";

function UpdateCreator({ selectedProduct, setIsCreatingUpdate }) {
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const updateCreatorFormContent = [
    {
      label: "Title*",
      type: "text",
      name: "title",
    },
    {
      label: "Body(optional)",
      type: "textarea",
      name: "body",
    },
    {
      label: "Status",
      type: "select",
      values: [
        { id: "IN_PROGRESS", label: "In progress" },
        { id: "SHIPPED", label: "Shipped" },
      ],
      name: "status",
    },
  ];

  async function addUpdate({ title, body, status }) {
    const token = getAuthCookie();
    await extendedFetch({
      endpoint: "api/update",
      method: "POST",
      token,
      body: {
        title,
        status,
        body: body === "" ? false : body,
        productId: selectedProduct,
      },
      setErrors,
      setLoading,
      errors,
    });
  }

  const handleOnSubmit = async (e) => {
    setErrors([]);
    e.preventDefault();
    const formData = new FormData(e.target);
    const { title, body, status } = Object.fromEntries(formData);

    if (title === "") {
      const newErrors = new Set(errors);
      newErrors.add("Title cannot be empty");
      setErrors(Array.from(newErrors));

      return;
    }

    setLoading(true);
    setIsCreatingUpdate(false);
    await addUpdate({ title, body, status });
    router.reload();
  };
  return (
    <>
      <Form
        className="mt-8 flex w-2/3 flex-col gap-4"
        onHandleSubmit={handleOnSubmit}
        inputs={updateCreatorFormContent}
        buttonText={loading ? "Loading" : "Save"}
      />
      {errors.map((e, i) => {
        return (
          <p key={i} className="mt-4 text-center text-red-500">
            {e}
          </p>
        );
      })}
    </>
  );
}

export default UpdateCreator;
