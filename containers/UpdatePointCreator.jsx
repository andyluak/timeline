import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import Form from "components/ui/Form";

import { getAuthCookie } from "utils/cookie";

function UpdatePointCreator({ selectedUpdate, setIsCreatingUpdatePoint }) {
  const queryClient = useQueryClient();
  const [errors, setErrors] = useState([]);

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

  const addUpdatePointMutation = useMutation({
    mutationFn: async (variables) => {
      const { type, description, selectedUpdate, auth_token } = variables;

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API}/api/updatepoint`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth_token}`,
          },
          body: JSON.stringify({
            type,
            description,
            updateId: selectedUpdate,
          }),
        }
      );
      if (!res.ok) {
        const { errors } = await res.json();
        throw new Error(errors);
      }
    },
    onMutate: async (variables) => {
      await queryClient.cancelQueries(["updatePoints", selectedUpdate]);
      const newUpdatePoint = {
        id: new Date(),
        type: variables.type,
        description: variables.description,
      };
      const previousUpdate = queryClient.getQueryData([
        "updatePoints",
        selectedUpdate,
      ]);
      const newUpdate = {
        ...previousUpdate,
        updatePoints: [...previousUpdate.updatePoints, newUpdatePoint],
      };

      queryClient.setQueryData(
        ["updatePoints", selectedUpdate],
        () => newUpdate
      );

      return { previousUpdate };
    },
    onError: (error, variables, context) => {
      queryClient.setQueryData(
        ["updatePoints", selectedUpdate],
        context.previousProducts
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries(["updatePoints", selectedUpdate]);
    },
  });

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
    const auth_token = getAuthCookie();
    addUpdatePointMutation.mutate({
      type,
      description,
      selectedUpdate,
      auth_token,
    });
    setIsCreatingUpdatePoint(false);
  };

  return (
    <>
      <Form
        className="mt-8 flex w-2/3 flex-col gap-4"
        onHandleSubmit={handleOnSubmit}
        inputs={updatePointCreatorFormContent}
        buttonText={addUpdatePointMutation.isLoading ? "Loading..." : "Save"}
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

export default UpdatePointCreator;
