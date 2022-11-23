import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";

import Form from "components/ui/Form";

import { getAuthCookie } from "utils/cookie";

function UpdateCreator({ selectedProduct, setIsCreatingUpdate }) {
  const queryClient = useQueryClient();

  const [errors, setErrors] = useState([]);

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

  const addUpdateMutation = useMutation({
    mutationFn: async (variables) => {
      const { title, status, body, selectedProduct, auth_token } = variables;

      const res = await fetch(`${process.env.NEXT_PUBLIC_API}/api/update`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth_token}`,
        },
        body: JSON.stringify({
          name,
          title,
          status,
          body: body === "" ? false : body,
          productId: selectedProduct,
        }),
      });

      if (!res.ok) {
        const { errors } = await res.json();
        throw new Error(errors);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries(["products"]);
    },
  });

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
    const auth_token = getAuthCookie();
    setIsCreatingUpdate(false);
    addUpdateMutation.mutate({
      title,
      body,
      status,
      auth_token,
      selectedProduct,
    });
  };
  return (
    <>
      <Form
        className="mt-8 flex w-2/3 flex-col gap-4"
        onHandleSubmit={handleOnSubmit}
        inputs={updateCreatorFormContent}
        buttonText={addUpdateMutation.isLoading ? "Loading" : "Save"}
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
