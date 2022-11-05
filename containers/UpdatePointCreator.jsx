import { useRouter } from "next/router";
import { useState } from "react";

import { getAuthCookie } from "utils/cookie";

function UpdatePointCreator({
  selectedUpdate,
  setIsCreatingUpdatePoint,
  handleUpdateSelection,
}) {
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const updatePointCreatorFormContent = [
    {
      label: "Description",
      type: "textarea",
      name: "description",
    },
    {
      label: "Type",
      type: "select",
      values: [
        { id: "FEATURE", label: "Feature" },
        { id: "BUG_FIX", label: "Bug fix" },
        { id: "IMPROVEMENT", label: "Improvement" },
      ],
      name: "type",
    },
  ];

  async function addUpdatePoint({ description, type }) {
    const token = getAuthCookie();

    const res = await fetch(`${process.env.NEXT_PUBLIC_API}/api/updatepoint`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        type,
        description,
        updateId: selectedUpdate,
      }),
    });

    if (res.status > 300) {
      const error = await res.json();
      setErrors(["Something went wrong"]);
    }

    setLoading(false);
    router.replace(router.asPath);
    return res;
  }

  const handleOnSubmit = async (e) => {
    setErrors([]);
    e.preventDefault();
    const formData = new FormData(e.target);
    const { description, type } = Object.fromEntries(formData);

    if (description === "") {
      const newErrors = new Set(errors);
      newErrors.add("Body cannot be empty");
      setErrors(Array.from(newErrors));

      return;
    }

    setLoading(true);
    await addUpdatePoint({ description, type });
    setIsCreatingUpdatePoint(false);
    handleUpdateSelection(selectedUpdate);
  };

  return (
    <>
      <form
        className="mt-8 flex w-2/3 flex-col gap-4"
        onSubmit={handleOnSubmit}
      >
        {updatePointCreatorFormContent.map(
          ({ type, label, name, values }, i) => {
            switch (type) {
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
          }
        )}
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

export default UpdatePointCreator;
