import { useRouter } from "next/router";
import React, { useState } from "react";

import { getAuthCookie } from "utils/cookie";

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

    const res = await fetch(`${process.env.NEXT_PUBLIC_API}/api/update`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        title,
        status,
        body: body === "" ? false : body,
        productId: selectedProduct,
      }),
    });

    if (res.status > 300) {
      const error = await res.json();
      setErrors(["Something went wrong"]);
    }

    setLoading(false);
    return res;
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
      <form
        className="mt-8 flex w-2/3 flex-col gap-4"
        onSubmit={handleOnSubmit}
      >
        {updateCreatorFormContent.map(({ type, label, name, values }, i) => {
          switch (type) {
            case "text":
              return (
                <div className="mb-2 flex flex-col" key={i}>
                  <label>{label}</label>
                  <input type={type} name={name} autoComplete="off" />
                </div>
              );
            case "textarea":
              return (
                <div className="mb-2 flex flex-col" key={i}>
                  <label>{label}</label>
                  <textarea name={name} />
                </div>
              );

            case "select":
              return (
                <div className="mb-2 flex flex-col" key={i}>
                  <label>{label}</label>
                  <select name={name}>
                    {values.map(({ id, label }, i) => {
                      return (
                        <option key={i} value={id}>
                          {label}
                        </option>
                      );
                    })}
                  </select>
                </div>
              );
          }
        })}
        <button
          className="relative mt-2 border bg-black p-3 uppercase text-white transition-all hover:border hover:border-black hover:bg-white hover:text-black"
          aria-label="Sign In"
          type="submit"
        >
          {loading ? "Loading..." : "Save"}
        </button>
      </form>
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
